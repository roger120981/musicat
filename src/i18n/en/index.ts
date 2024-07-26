import type { BaseTranslation } from "../i18n-types";

const en = {
    infoPopup: {
        buildBy: "Built by ",
        version: "version",
        releaseNotes: "Release Notes"
    },
    sidebar: {
        search: "Search",
        library: "Library",
        albums: "Albums",
        favorites: "Favourites",
        playlists: "Playlists",
        smartPlaylists: "Smart Playlists",
        artistsToolkit: "Artist's Toolkit",
        map: "Map",
        internetArchive: "Internet Archive",
        stats: "Stats"
    },
    library: {
        fields: {
            title: "Title",
            artist: "Artist",
            composer: "Composer",
            album: "Album",
            track: "Track",
            year: "Year",
            dateAdded: "Date Added",
            genre: "Genre",
            origin: "Origin",
            duration: "Duration"
        }
    },
    bottomBar: {
        queue: "Queue",
        lyrics: "Lyrics",
        lossySelector: {
            lossy: "lossy",
            lossless: "lossless",
            both: "lossy + lossless"
        },
        nextUp: "Next Up",
        stats: {
            songs: "songs",
            artists: "artists",
            albums: "albums"
        }
    },
    smartPlaylists: {
        builtIn: {
            recentlyAdded: "Recently Added",
            favourites: "Favourites"
        },
        builder: {
            close: "Close editor",
            save: "Save",
            placeholder: "My New Smart Playlist",
            addNewBlock: "add new block",
            valid: "query is valid",
            invalid: "query is invalid",
            parts: {
                byArtist: {
                    title: "by artist",
                    example: "eg. by Charlie Parker"
                },
                releasedBetween: {
                    title: "released between",
                    example: "eg. released between 1950 and 1967"
                },
                releasedAfter: {
                    title: "released after",
                    example: "eg. released after 1950"
                },
                releasedIn: {
                    title: "released in",
                    example: "eg. released in 1999"
                },
                titleContains: {
                    title: "song title contains {text}",
                    example: " eg. title contains Love"
                },
                longerThan: {
                    title: "longer than",
                    example: "eg. longer than 04:00"
                },
                containsGenre: {
                    title: "contains genre",
                    example: "eg. contains Rock"
                },
                fromCountry: {
                    title: "from country",
                    example: "eg. from Australia"
                },
                byComposer: {
                    title: "by composer",
                    example: "eg. by Charles Mingus"
                }
            }
        },
        newSmartPlaylist: "New smart playlist",
        libraryPlaceholder: {
            title: "Smart playlist results will appear here",
            subtitle: "Happy searching!"
        }
    },
    trackInfo: {
        title: "Track Info",
        subtitle: "Use UP and DOWN to change tracks",
        overwriteFile: "Overwrite file",
        fileInfo: "File Info",
        file: "File",
        codec: "Codec",
        tagType: "Tag Type",
        duration: "Duration",
        sampleRate: "Sample rate",
        bitRate: "Bitrate",
        enrichmentCenter: "Enrichment Center",
        countryOfOrigin: "Country of Origin",
        countryOfOriginTooltip:
            "Set this to use the Map view and filter by country in Smart Playlists",
        fetchingOriginCountry: "Loading...",
        save: "Save",
        fetchFromWikipedia: "Fetch from Wikipedia",
        artworkReadyToSave: "Ready to save",
        artworkFound: "Found",
        noArtwork: "No artwork",
        fetchArt: "Fetch Art",
        metadata: "Metadata",
        tools: "Tools",
        aboutArtwork: "About artwork",
        artworkTooltipTitle: "🎨 Artwork priority",
        artworkTooltipBody:
            "<h3 style='margin:0'>🎨 Artwork priority</h3><br/>First, Musicat looks for artwork encoded in the file metadata, which you can overwrite by clicking this square (png and jpg supported). <br/><br/>If there is none, it will look for a file in the album folder called <i>cover.jpg, folder.jpg</i> or <i>artwork.jpg</i> (you can change this list of filenames in Settings).<br/><br/>Otherwise, it will look for any image in the album folder and use that.",
        encodedInFile: "Encoded in file",
        bit: "bit",
        noMetadata: "Song has no metadata",
        unsupportedFormat:
            "This file type is not yet supported for metadata viewing/editing",
        fix: "Fix",
        errors: {
            nullChars:
                "Some tags have a hidden character that prevents them from being read properly."
        },
        artist: "artist",
        fixLegacyEncodings: {
            title: "Fix legacy encodings",
            body: "If you have ID3 tags encoded with legacy encodings, you should update them to the universal UTF-8 so they display properly. Select an encoding and click Fix.",
            hint: "Select encoding..."
        }
    },
    settings: {
        title: "Settings",
        subtitle: "Configure stuff",
        version: "Version",
        commaSeparatedFilenames: "filenames",
        llms: "gpt-3.5-turbo, gpt-4, ollama",
        foldersToWatch: "Folders to watch",
        folder: "{{1 folder | ?? folders}}",
        importing: "Importing..",
        enableArtistsToolkit: "Enable Artist's Toolkit",
        enableAIFeatures: "Enable AI features",
        aiModel: "AI Model (LLM)",
        openApiKey: "OpenAI API Key",
        geniusApiKey: "Genius API Key"
    }
} satisfies BaseTranslation;

export default en;
