// Symphonia
// Copyright (c) 2019-2022 The Project Symphonia Developers.
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

//! Platform-dependant Audio Outputs

use std::f32::consts::PI;
use std::result;

use rustfft::{num_complex::Complex, FftPlanner};
use std::sync::Arc;

use symphonia::core::audio::{AudioBufferRef, SampleBuffer, SignalSpec};
use symphonia::core::units::Duration;
use webrtc::data_channel::RTCDataChannel;

pub trait AudioOutput {
    fn write(&mut self, decoded: AudioBufferRef<'_>, ramp_up_samples: u64, ramp_down_samples: u64);
    fn flush(&mut self);
    fn get_sample_rate(&self) -> u32;
    fn pause(&self);
    fn resume(&self);
    fn update_resampler(&mut self, spec: SignalSpec, max_frames: u64) -> bool;
    fn has_remaining_samples(&self) -> bool;
    fn ramp_down(&mut self, buffer: AudioBufferRef, num_samples: usize);
    fn ramp_up(&mut self, buffer: AudioBufferRef, num_samples: usize);
}

#[allow(dead_code)]
#[allow(clippy::enum_variant_names)]
#[derive(Debug)]
pub enum AudioOutputError {
    OpenStreamError,
    PlayStreamError,
    StreamClosedError,
}

pub type Result<T> = result::Result<T, AudioOutputError>;

mod cpal {
    use std::sync::mpsc::Receiver;
    use std::sync::{Arc, RwLock};
    use std::time::Duration;

    use crate::output::{fft, ifft};
    use crate::resampler::Resampler;
    use crate::{SampleOffsetEvent, VolumeControlEvent};

    use super::{AudioOutput, AudioOutputError, Result};

    use bytes::Bytes;
    use cpal::{Sample, SupportedBufferSize};
    use symphonia::core::audio::{
        AudioBufferRef, Channels, Layout, RawSample, SampleBuffer, SignalSpec,
    };
    use symphonia::core::conv::{ConvertibleSample, IntoSample};
    use symphonia::core::units::TimeBase;

    use cpal::traits::{DeviceTrait, HostTrait, StreamTrait};
    use rb::*;

    use log::{error, info};
    use tauri::{AppHandle, Emitter, Manager};
    use tokio::sync::Mutex;
    use webrtc::data_channel::RTCDataChannel;

    pub struct CpalAudioOutput {}

    trait AudioOutputSample:
        cpal::Sample
        + cpal::SizedSample
        + ConvertibleSample
        + IntoSample<f32>
        + RawSample
        + std::marker::Send
        + 'static
    {
    }

    impl AudioOutputSample for f32 {}
    impl AudioOutputSample for i16 {}
    impl AudioOutputSample for u16 {}

    impl CpalAudioOutput {
        pub fn try_open(
            spec: SignalSpec,
            volume_control_receiver: Arc<Mutex<Receiver<VolumeControlEvent>>>,
            sample_offset_receiver: Arc<Mutex<Receiver<SampleOffsetEvent>>>,
            playback_state_receiver: Arc<Mutex<Receiver<bool>>>,
            reset_control_receiver: Arc<Mutex<Receiver<bool>>>,
            data_channel: Arc<tokio::sync::Mutex<Option<Arc<RTCDataChannel>>>>,
            vol: Option<f64>,
            app_handle: AppHandle,
        ) -> Result<Arc<Mutex<dyn AudioOutput>>> {
            // Get default host.
            let host = cpal::default_host();

            // Get the default audio output device.
            let device = match host.default_output_device() {
                Some(device) => device,
                _ => {
                    error!("failed to get default audio output device");
                    return Err(AudioOutputError::OpenStreamError);
                }
            };

            println!("Default audio device: {:?}", device.name());

            let config = match device.default_output_config() {
                Ok(config) => config,
                Err(err) => {
                    error!("failed to get default audio output device config: {}", err);
                    return Err(AudioOutputError::OpenStreamError);
                }
            };

            // Only resample when audio device doesn't support file sample rate
            // so we can't switch the device rate to match.
            let supports_sample_rate = device
                .supported_output_configs()
                .unwrap()
                .find(|c| {
                    return c
                        .try_with_sample_rate(cpal::SampleRate(spec.rate))
                        .is_some();
                })
                .is_some();

            println!(
                "output: supports sample rate ({}) ? {}",
                spec.rate, supports_sample_rate
            );

            let rate = if supports_sample_rate {
                spec.rate
            } else {
                config.sample_rate().0
            };

            let device_spec = SignalSpec::new_with_layout(
                rate,
                match spec.channels.count() {
                    1 => Layout::Mono,
                    2 => Layout::Stereo,
                    3 => Layout::TwoPointOne,
                    5 => Layout::FivePointOne,
                    _ => Layout::Stereo,
                },
            );

            let duration = match config.buffer_size() {
                SupportedBufferSize::Range { min, max } => {
                    (*max * device_spec.channels.count() as u32) as u64
                }
                SupportedBufferSize::Unknown => 4096 as u64,
            };

            // Select proper playback routine based on sample format.
            match config.sample_format() {
                cpal::SampleFormat::F32 => CpalAudioOutputImpl::<f32>::try_open(
                    device_spec,
                    duration,
                    &device,
                    volume_control_receiver,
                    sample_offset_receiver,
                    playback_state_receiver,
                    reset_control_receiver,
                    data_channel,
                    |packet, volume| ((packet as f64) * volume) as f32,
                    |data| {
                        let fft_result = fft(&data);

                        let time_domain_signal = ifft(&fft_result);

                        Bytes::from(time_domain_signal)
                    },
                    vol,
                    app_handle,
                ),
                cpal::SampleFormat::I16 => CpalAudioOutputImpl::<i16>::try_open(
                    device_spec,
                    duration,
                    &device,
                    volume_control_receiver,
                    sample_offset_receiver,
                    playback_state_receiver,
                    reset_control_receiver,
                    data_channel,
                    |packet, volume| ((packet as f64) * volume) as i16,
                    |data| {
                        let mut byte_array = Vec::with_capacity(data.len());

                        for d in &mut data.iter() {
                            byte_array.push(*d as u8);
                        }
                        Bytes::from(byte_array)
                    },
                    vol,
                    app_handle,
                ),
                cpal::SampleFormat::U16 => CpalAudioOutputImpl::<u16>::try_open(
                    device_spec,
                    duration,
                    &device,
                    volume_control_receiver,
                    sample_offset_receiver,
                    playback_state_receiver,
                    reset_control_receiver,
                    data_channel,
                    |packet, volume| ((packet as f64) * volume) as u16,
                    |data| {
                        let mut byte_array = Vec::with_capacity(data.len());

                        for d in &mut data.iter() {
                            byte_array.push(*d as u8);
                        }
                        Bytes::from(byte_array)
                    },
                    vol,
                    app_handle,
                ),
                _ => CpalAudioOutputImpl::<f32>::try_open(
                    device_spec,
                    duration,
                    &device,
                    volume_control_receiver,
                    sample_offset_receiver,
                    playback_state_receiver,
                    reset_control_receiver,
                    data_channel,
                    |packet, volume| ((packet as f64) * volume) as f32,
                    |data| {
                        let fft_result = fft(&data);

                        let time_domain_signal = ifft(&fft_result);

                        Bytes::from(time_domain_signal)
                    },
                    vol,
                    app_handle,
                ),
            }
        }
    }

    struct CpalAudioOutputImpl<T: AudioOutputSample>
    where
        T: AudioOutputSample + Send + Sync,
    {
        ring_buf: SpscRb<T>,
        ring_buf_producer: rb::Producer<T>,
        sample_buf: SampleBuffer<T>,
        stream: cpal::Stream,
        resampler: Option<Resampler<T>>,
        sample_rate: u32,
    }

    impl<T: AudioOutputSample + Send + Sync> CpalAudioOutputImpl<T> {
        pub fn try_open(
            spec: SignalSpec,
            duration: symphonia::core::units::Duration,
            device: &cpal::Device,
            volume_control_receiver: Arc<Mutex<Receiver<VolumeControlEvent>>>,
            sample_offset_receiver: Arc<Mutex<Receiver<SampleOffsetEvent>>>,
            playback_state_receiver: Arc<Mutex<Receiver<bool>>>,
            reset_control_receiver: Arc<Mutex<Receiver<bool>>>,
            data_channel: Arc<tokio::sync::Mutex<Option<Arc<RTCDataChannel>>>>,
            volume_change: fn(T, f64) -> T,
            get_viz_bytes: fn(Vec<T>) -> Bytes,
            vol: Option<f64>,
            app_handle: AppHandle,
        ) -> Result<Arc<Mutex<dyn AudioOutput>>> {
            let num_channels = spec.channels.count();

            // Output audio stream config.
            let config = if cfg!(not(target_os = "windows")) {
                cpal::StreamConfig {
                    channels: num_channels as cpal::ChannelCount,
                    sample_rate: cpal::SampleRate(spec.rate),
                    buffer_size: cpal::BufferSize::Default,
                }
            } else {
                // Use the default config for Windows.
                device
                    .default_output_config()
                    .expect("Failed to get the default output config.")
                    .config()
            };

            let time_base = TimeBase {
                numer: 1,
                denom: config.sample_rate.0 * config.channels as u32,
            };

            // Create a ring buffer with a capacity
            let ring_len = ((5000 * config.sample_rate.0 as usize) / 1000) * num_channels;

            let ring_buf = SpscRb::new(ring_len);
            let (ring_buf_producer, ring_buf_consumer) = (ring_buf.producer(), ring_buf.consumer());
            println!("Ring buffer capacity: {:?}", ring_buf.capacity());
            // States
            let volume_state = Arc::new(RwLock::new(vol.unwrap()));
            let frame_idx_state = Arc::new(RwLock::new(0));
            let elapsed_time_state = Arc::new(RwLock::new(0));
            let playback_state = Arc::new(RwLock::new(true));
            let dc = Arc::new(data_channel);

            let rt = tokio::runtime::Runtime::new().unwrap();
            let mut viz_data = Vec::with_capacity(1024);

            let stream_result = device.build_output_stream(
                &config,
                move |data: &mut [T], _cb: &cpal::OutputCallbackInfo| {
                    // println!("playing back {:?}", data.len());
                    // If file changed, reset
                    let reset = reset_control_receiver.try_lock().unwrap().try_recv();
                    if let Ok(rst) = reset {
                        if rst {
                            println!("Got rst: {:?}", rst);
                            let mut frame_idx = frame_idx_state.write().unwrap();
                            *frame_idx = 0;
                            let mut elapsed_time = elapsed_time_state.write().unwrap();
                            *elapsed_time = 0;
                            let _ = app_handle.emit("timestamp", Some(0f64));
                        }
                    }

                    // Get volume
                    let volume = volume_control_receiver.try_lock().unwrap().try_recv();
                    if let Ok(vol) = volume {
                        println!("Got volume: {:?}", vol);
                        let mut current_volume = volume_state.write().unwrap();
                        *current_volume = vol.volume.unwrap();
                    }

                    let current_volume = { *volume_state.read().unwrap() };
                    // println!("Current volume: {:?}", current_volume);

                    let playing = playback_state_receiver.try_lock().unwrap().try_recv();
                    if let Ok(pl) = playing {
                        let mut current_playing = playback_state.write().unwrap();
                        *current_playing = pl;
                    }

                    // update duration if seconds changed
                    if *playback_state.try_read().unwrap() {
                        // Write out as many samples as possible from the ring buffer to the audio
                        // output.
                        let written = ring_buf_consumer.read(data).unwrap_or(0);

                        let sample_offset = sample_offset_receiver.try_lock().unwrap().try_recv();

                        if let Ok(offset) = sample_offset {
                            println!("Got sample offset: {:?}", offset);
                            let mut current_sample_offset = frame_idx_state.write().unwrap();
                            *current_sample_offset = offset.sample_offset.unwrap();
                        }

                        let mut i = 0;
                        for d in &mut *data {
                            *d = volume_change(*d, current_volume);
                            i += 1;
                        }

                        let length = data.len();

                        let mut u = 0;
                        let mut should_send = false;
                        for d in &mut *data {
                            if viz_data.len() < length {
                                viz_data.push(*d);
                            } else {
                                should_send = true;
                            }
                            u += 1;
                        }

                        // new offset
                        let new_sample_offset = {
                            let mut sample_offset = frame_idx_state.write().unwrap();
                            *sample_offset += i;
                            *sample_offset
                        };
                        // new duration
                        let next_duration = time_base.calc_time(new_sample_offset as u64).seconds;
                        // println!("Next duration: {:?}", next_duration);

                        let prev_duration = { *elapsed_time_state.read().unwrap() };

                        if prev_duration != next_duration {
                            let new_duration = Duration::from_secs(next_duration);

                            let _ = app_handle.emit("timestamp", Some(new_duration.as_secs_f64()));

                            let mut duration = elapsed_time_state.write().unwrap();
                            *duration = new_duration.as_secs();
                        }
                        let viz = viz_data.clone();
                        // Every x samples - send viz data to frontend
                        if should_send {
                            viz_data.clear();
                            if let Ok(dc_guard) = dc.try_lock() {
                                if let Some(dc1) = dc_guard.as_ref().cloned() {
                                    rt.spawn(async move {
                                        let _ = dc1.send(&get_viz_bytes(viz)).await;
                                    });
                                }
                            }
                        }
                        // Mute any remaining samples.
                        data[written..].iter_mut().for_each(|s| *s = T::MID);
                    } else {
                        data.iter_mut().for_each(|s| *s = T::MID);
                    }
                },
                move |err| error!("audio output error: {}", err),
                None,
            );

            if let Err(err) = stream_result {
                error!("audio output stream open error: {}", err);

                return Err(AudioOutputError::OpenStreamError);
            }

            let stream = stream_result.unwrap();

            // Start the output stream.
            if let Err(err) = stream.play() {
                error!("audio output stream play error: {}", err);

                return Err(AudioOutputError::PlayStreamError);
            }

            let sample_buf = SampleBuffer::<T>::new(duration, spec);

            Ok(Arc::new(Mutex::new(CpalAudioOutputImpl {
                ring_buf,
                ring_buf_producer,
                sample_buf,
                stream,
                resampler: None,
                sample_rate: config.sample_rate.0,
            })))
        }
    }

    impl<T: AudioOutputSample + Send + Sync> AudioOutput for CpalAudioOutputImpl<T> {
        fn write(
            &mut self,
            decoded: AudioBufferRef<'_>,
            ramp_up_samples: u64,
            ramp_down_samples: u64,
        ) -> () {
            // Do nothing if there are no audio frames.
            if decoded.frames() == 0 {
                println!("No more samples.");
                return;
            }

            // Print buffer size
            {
                // println!("decoded samples: {}", decoded.frames());
                // // Current Buffer size
                // println!("buffer samples: {}", self.sample_buf.samples().len());
                // println!("ring buffer size: {}", self.ring_buf.count());
            }

            let mut samples = if let Some(resampler) = &mut self.resampler {
                // Resampling is required. The resampler will return interleaved samples in the
                // correct sample format.
                match resampler.resample(decoded) {
                    Some(resampled) => resampled,
                    None => return,
                }
            } else {
                // Resampling is not required. Interleave the sample for cpal using a sample buffer.
                if (ramp_up_samples > 0) {
                    println!("Ramping up first {:?}", ramp_up_samples);
                    self.ramp_up(decoded, ramp_up_samples as usize);
                    self.sample_buf.samples()
                } else if (ramp_down_samples > 0) {
                    println!("Ramping down last {:?}", ramp_down_samples);
                    self.ramp_down(decoded, ramp_down_samples as usize);
                    self.sample_buf.samples()
                } else {
                    self.sample_buf.copy_interleaved_ref(decoded);
                    self.sample_buf.samples()
                }
            };

            // Write all samples to the ring buffer.
            while let Some(written) = self.ring_buf_producer.write_blocking(samples) {
                samples = &samples[written..];
                // Print written
                // println!("written: {}", written);
            }
        }

        fn flush(&mut self) {
            // If there is a resampler, then it may need to be flushed
            // depending on the number of samples it has.
            if let Some(resampler) = &mut self.resampler {
                while let Some(remaining_samples) = resampler.flush() {
                    println!("Flushed samples {:?}", remaining_samples.len());
                }
            }

            // Flush is best-effort, ignore the returned result.

            self.sample_buf.clear();
            self.ring_buf.clear();

            // Check what's left now
            println!(
                "Sample buf empty: {}, Ring buf empty:{} ",
                self.sample_buf.is_empty(),
                self.ring_buf.is_empty()
            );
        }

        fn get_sample_rate(&self) -> u32 {
            return self.sample_rate;
        }

        fn pause(&self) {
            let pause_result = self.stream.pause();
            println!("cpal: Stream pause result: {:?}", pause_result);
        }

        fn resume(&self) {
            let resume_result = self.stream.play();
            println!("cpal: Stream resume result: {:?}", resume_result);
        }

        fn update_resampler(&mut self, spec: SignalSpec, max_frames: u64) -> bool {
            let host = cpal::default_host();
            let output_device = host.default_output_device();

            // If we have a default audio device (we always should, but just in case)
            // we check if the track spec differs from the output device
            // if it does - resample the decoded audio using Symphonia.

            if self.sample_rate != spec.rate {
                println!("resampling {} Hz to {} Hz", spec.rate, self.sample_rate);
                self.resampler
                    .replace(Resampler::new(spec, self.sample_rate as usize, max_frames));
                return true;
            } else {
                self.resampler.take();
                return false;
            }
        }

        /// Checks if there are any samples left in the buffer that have not been played yet.
        fn has_remaining_samples(&self) -> bool {
            !self.ring_buf.is_empty()
        }

        fn ramp_down(&mut self, buffer: AudioBufferRef, num_samples: usize) {
            self.sample_buf.copy_interleaved_ref(buffer);
            let ramp_len = num_samples.min(self.sample_buf.len());

            for (i, sample) in self.sample_buf.samples_mut()[..ramp_len]
                .iter_mut()
                .enumerate()
            {
                let factor = 1.0 - (i as f32 / ramp_len as f32);
                sample.mul_amp(factor.to_sample());
            }
        }

        fn ramp_up(&mut self, buffer: AudioBufferRef, num_samples: usize) {
            self.sample_buf.copy_interleaved_ref(buffer);
            let ramp_len = num_samples.min(self.sample_buf.len());

            for (i, sample) in self.sample_buf.samples_mut()[..ramp_len]
                .iter_mut()
                .enumerate()
            {
                let factor = i as f32 / ramp_len as f32;
                sample.mul_amp(factor.to_sample());
            }
        }
    }
}

pub fn try_open(
    spec: SignalSpec,
    volume_control_receiver: Arc<
        tokio::sync::Mutex<std::sync::mpsc::Receiver<crate::VolumeControlEvent>>,
    >,
    sample_offset_receiver: Arc<
        tokio::sync::Mutex<std::sync::mpsc::Receiver<crate::SampleOffsetEvent>>,
    >,
    playback_state_receiver: Arc<tokio::sync::Mutex<std::sync::mpsc::Receiver<bool>>>,
    reset_control_receiver: Arc<tokio::sync::Mutex<std::sync::mpsc::Receiver<bool>>>,
    data_channel: Arc<tokio::sync::Mutex<Option<Arc<RTCDataChannel>>>>,
    vol: Option<f64>,
    app_handle: tauri::AppHandle,
) -> Result<Arc<tokio::sync::Mutex<dyn AudioOutput>>> {
    cpal::CpalAudioOutput::try_open(
        spec,
        volume_control_receiver,
        sample_offset_receiver,
        playback_state_receiver,
        reset_control_receiver,
        data_channel,
        vol,
        app_handle,
    )
}

fn hanning_window(n: usize, N: usize) -> f32 {
    0.5 * (1.0 - ((2.0 * PI * n as f32) / (N as f32 - 1.0)).cos())
}

fn hamming_window(n: usize, N: usize) -> f32 {
    0.54 - 0.46 * ((2.0 * std::f32::consts::PI * n as f32) / (N as f32 - 1.0)).cos()
}

fn fft(input: &[f32]) -> Vec<Complex<f32>> {
    let len = input.len();
    let mut planner = FftPlanner::new();
    let fft = planner.plan_fft_forward(len);

    // Apply Hanning window
    // let windowed_input: Vec<f32> = input
    //     .iter()
    //     .enumerate()
    //     .map(|(i, &x)| x * hamming_window(i, len))
    //     .collect();

    // Convert input into complex numbers
    let mut complex_input: Vec<Complex<f32>> =
        input.iter().map(|&x| Complex::new(x, 0.0)).collect();

    // Perform FFT
    fft.process(&mut complex_input);

    complex_input
}

fn ifft(input: &[Complex<f32>]) -> Vec<u8> {
    let len = input.len();
    let mut planner = FftPlanner::new();
    let ifft = planner.plan_fft_inverse(len);

    let mut output: Vec<Complex<f32>> = input.to_vec();

    // Perform inverse FFT
    ifft.process(&mut output);

    // Extract real parts and scale
    let mut time_domain_signal = output.iter().map(|&freq| freq.re).collect::<Vec<f32>>();

    // Remove any residual imaginary part due to precision issues
    for val in time_domain_signal.iter_mut() {
        if val.abs() < 1e-6 {
            *val = 0.0;
        }
    }

    let interpolated_signal: Vec<f32> = time_domain_signal
        .windows(2)
        .map(|pair| {
            let (x0, x1) = (pair[0], pair[1]);
            smoothing(x0, x1, 0.2f32)
        })
        .collect();

    let mut interleaved_bytes: Vec<u8> = Vec::new();

    // Iterate through each complex number in the FFT result
    for i in 0..interpolated_signal.len() {
        // Every 2nd sample, sum the last two together and divide by two
        if i % 2 == 0 && i + 1 < interpolated_signal.len() {
            let freq1 = interpolated_signal[i];
            let freq2 = interpolated_signal[i + 1];

            // Calculate magnitude of the complex number
            // let magnitude1 = (freq1.re.powi(2) + freq1.im.powi(2)).sqrt();
            // let magnitude2 = (freq2.re.powi(2) + freq2.im.powi(2)).sqrt();
            let summed = (((freq1 - freq2) * 0.8 / 2.0) + 128.0) as u8;
            // println!("L: {}, R: {}, summed: {}", freq1, freq2, summed);

            // Split the f32 into its individual bytes
            // let bytes = summed.to_ne_bytes();
            interleaved_bytes.push(summed);

            // Interleave the bytes
            // for &byte in bytes.iter() {
            //     interleaved_bytes.push(byte);
            // }
        }
    }

    interleaved_bytes
}

fn linear_interpolate(x0: f32, x1: f32, t: f32) -> f32 {
    x0 * (1.0 - t) + x1 * t
}

fn smoothing(x0: f32, x1: f32, factor: f32) -> f32 {
    x1 + ((x0 - x1) * factor)
}
