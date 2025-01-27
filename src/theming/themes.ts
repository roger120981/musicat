type ThemeType = "dark" | "light";

import tmZokugunObsidium from "./themes/zokugun-obsidium.json";

export interface Theme {
    type: ThemeType;
    /**  Primary text color */
    text: string;
    /**  Secondary text color, for dimmed text */
    "text-secondary": string;
    /**  Text color for active items */
    "text-active": string;
    /**  Text color for inactive items */
    "text-inactive": string;
    /**  Window background (will be made more translucent on macOS) */
    background: string;
    /**  Overlays, popups */
    "overlay-bg": string;
    "overlay-shadow": string;
    /**  Primary accent color used for active items that need to stand out */
    accent: string;
    "accent-secondary": string;
    "icon-primary": string;
    "icon-secondary": string;
    "icon-secondary-hover": string;
    "icon-tertiary": string;
    "icon-tertiary-hover": string;
    "button-bg": string;
    "button-text": string;
    "input-alt-focus-outline": string;
    "input-bg": string;
    "input-focus-outline": string;
    "header-opacity": number;
    "header-text": string;
    link: string;
    "link-hover": string;
    title: string;
    /** Menus */
    "menu-bg": string;
    "menu-border": string;
    "menu-checkbox-off": string;
    "menu-checkbox-on": string;
    "menu-divider": string;
    "menu-item-confirm-bg": string;
    "menu-item-destructive-hover-bg": string;
    "menu-item-destructive-hover-text": string;
    "menu-item-disabled": string;
    "menu-item-highlight-bg": string;
    "menu-item-highlight-border": string;
    "menu-item-highlight-text": string;
    "menu-item-highlight-secondary-bg": string;
    "menu-item-highlight-secondary-border": string;
    "menu-item-highlight-secondary-text": string;
    "menu-item-loading-from": string;
    "menu-item-loading-to": string;
    "menu-item-text": string;
    "menu-shadow": string;
    /** Play, pause, next, previous */
    "transport-control": string;
    "transport-control-hover": string;
    "transport-favorite": string;
    "transport-favorite-hover": string;
    "transport-seekbar-hoverhead": string;
    "transport-shuffle": string;
    "transport-shuffle-hover": string;
    "transport-volume-thumb-bg": string;
    "transport-volume-thumb-icon": string;
    "transport-volume-thumb-secondary": string;
    /** Main panel background */
    "panel-background": string;
    /** Library */
    "library-text-color": string;
    "library-playing-bg": string;
    "library-playing-text": string;
    "library-playing-icon": string;
    "library-highlight-bg": string;
    "library-hover-bg": string;
    "library-header-bg": string;
    "library-header-text": string;
    "library-header-active-bg": string;
    "library-clickable-cell-bg": string;
    "library-clickable-cell-hover-bg": string;
    "library-favourite-icon": string;
    "library-favourite-hover-icon": string;
    /** Smart playlist */
    "smart-playlist-builder-bg": string;
    "smart-playlist-builder-text": string;
    "smart-playlist-builder-block-bg": string;
    "smart-playlist-builder-block-focused-bg": string;
    "smart-playlist-builder-block-input-bg": string;
    "smart-playlist-builder-block-input-text": string;
    "smart-playlist-button-bg": string;
    "smart-playlist-button-disabled": string;
    "smart-playlist-button-disabled-bg": string;
    /** Album */
    "album-playing-pause-bg": string;
    "album-playing-pause-border": string;
    "album-playing-pause-icon": string;
    "album-playing-pause-hover-bg": string;
    "album-playing-pause-hover-icon": string;
    "album-playing-play-bg": string;
    "album-playing-play-border": string;
    "album-playing-play-icon": string;
    "album-playing-play-hover-bg": string;
    "album-playing-play-hover-icon": string;
    "album-playing-shadow": string;
    "album-playing-title-bg": string;
    /** Popups */
    "popup-data-field-bg": string;
    "popup-song-artwork-about": string;
    "popup-song-artwork-found": string;
    "popup-song-artwork-notfound": string;
    "popup-song-metadata-prompt-error": string;
    "popup-song-metadata-title": string;
    "popup-song-metadata-validation-error": string;
    "popup-song-metadata-validation-warning": string;
    /** Oscilloscope line color */
    oscilloscope: string;
    /** Waveform */
    "waveform-bg": string;
    "waveform-bg-hover": string;
    "waveform-cursor": string;
    "waveform-region-loop": string;
    "waveform-progress": string;
    "waveform-region-current": string;
    "waveform-wave": string;
    "waveform-hover-label-bg": string;
    "waveform-hover-label-text": string;
    "waveform-hover-line": string;
    "waveform-hoverhead-line-bg": string;
    /** Sidebar */
    "sidebar-item-drag-bg": string;
    "sidebar-item-hover-bg": string;
    "sidebar-item-hover-text": string;
    "sidebar-item-selected-pipe-bg": string;
    "sidebar-node-inactive-hover-bg": string;
    "sidebar-node-inactive-hover-opacity": number;
    "sidebar-node-inactive-hover-text": string;
    /** Map View */
    "mapview-region-bg": string;
    "mapview-region-border": string;
    "mapview-region-hover-bg": string;
    "mapview-region-hover-border": string;
    "mapview-region-selected-bg": string;
    "mapview-region-selected-border": string;
    "mapview-region-selected-hover-bg": string;
    "mapview-region-selected-hover-border": string;
    "mapview-scale-1": string;
    "mapview-scale-2": string;
    /** Progress bar */
    "progressbar-track-bg": string;
    "progressbar-value-bg": string;
    /** Analytics/Stats */
    "analytics-primary": string;
    "analytics-secondary": string;
    /** Prune */
    "prune-button-delete-bg": string;
    "prune-button-delete-pressed-shadow": string;
    "prune-button-keep-bg": string;
    "prune-button-keep-pressed-shadow": string;
    "prune-fordelete": string;
    /** Wiki */
    "wiki-bg": string;
    "wiki-header-bg": string;
    "wiki-inarticle-bg": string;
    "wiki-pill-bg": string;
    "wiki-pill-text": string;
    "wiki-pill-hover-bg": string;
    "wiki-pill-hover-text": string;
}
export const allFonts = {
    "2Peas": {
        "--font": "2Peas"
    }
};

export const DEFAULT_THEME: Theme = {
    type: "dark",
    text: "#ffffffde",
    "text-secondary": "#9fa0a2",
    "text-active": "#ffffff",
    "text-inactive": "#938e8e",
    background: "#242026cb",
    "overlay-bg": "#3c3c3f33",
    "overlay-shadow": "#00000042",
    accent: "#45fffcf3",
    "accent-secondary": "#632fff",
    "icon-primary": "#ffffff",
    "icon-secondary": "#948f8f",
    "icon-secondary-hover": "rgb(from var(--icon-secondary) r g b / 0.4)",
    "icon-tertiary": "var(--accent-secondary)",
    "icon-tertiary-hover": "rgb(from var(--icon-tertiary) r g b / 0.4)",
    "button-bg": "#1c1b1b",
    "button-text": "#ffffff",
    "input-alt-focus-outline": "1px solid #c4c7c8",
    "input-bg": "#4d494966",
    "input-focus-outline": "2px solid #7171bb",
    "header-opacity": 0.2,
    "header-text": "var(--text)",
    link: "#acafff",
    "link-hover": "#8086ff",
    title: "#7dffee",
    "menu-bg": "#20202296",
    "menu-border": "#ffffff3b",
    "menu-checkbox-off": "#808080",
    "menu-checkbox-on": "#ffffff",
    "menu-divider": "#494949",
    "menu-item-confirm-bg": "#d2630e",
    "menu-item-destructive-hover-bg": "#d20e32",
    "menu-item-destructive-hover-text": "#ffffff",
    "menu-item-disabled": "#aeaeae66",
    "menu-item-highlight-bg": "#ffffffcb",
    "menu-item-highlight-border": "transparent",
    "menu-item-highlight-text": "#252424",
    "menu-item-highlight-secondary-bg": "#ffffff32",
    "menu-item-highlight-secondary-border": "#ffffff1a",
    "menu-item-highlight-secondary-text": "#ffffff",
    "menu-item-loading-from": "inherit",
    "menu-item-loading-to": "#dba4fac1",
    "menu-item-text": "#ffffff",
    "menu-shadow": "#00000022",
    "transport-control": "#ffffff",
    "transport-control-hover": "rgb(from var(--transport-control) r g b / 0.5)",
    "transport-favorite": "#59cd7a",
    "transport-favorite-hover": "rgb(from var(--transport-favorite) r g b / 0.4)",
    "transport-seekbar-hoverhead": "#00C56C",
    "transport-shuffle": "#e1ff00",
    "transport-shuffle-hover": "rgb(from var(--transport-shuffle) r g b / 0.4)",
    "transport-volume-thumb-bg": "#FDFDFD",
    "transport-volume-thumb-icon": "#5123DD",
    "transport-volume-thumb-secondary": "#04aa6d",
    "panel-background": "#242026b3",
    "library-text-color": "#d3d3d3",
    "library-playing-bg": "#5123dd",
    "library-playing-text": "#00ddff",
    "library-playing-icon": "#00ddff",
    "library-highlight-bg": "#2e3357",
    "library-hover-bg": "#2e335737",
    "library-header-bg": "#71658e7e",
    "library-header-text": "#ffffffde",
    "library-header-active-bg": "#604d8d",
    "library-clickable-cell-bg": "#71658e1e",
    "library-clickable-cell-hover-bg": "#8c7dae36",
    "library-favourite-icon": "#5123dd",
    "library-favourite-hover-icon": "#784bff",
    "smart-playlist-builder-bg": "#4d347c",
    "smart-playlist-builder-text": "#ffffffde",
    "smart-playlist-builder-block-bg": "#7256be56",
    "smart-playlist-builder-block-focused-bg": "#7256be99",
    "smart-playlist-builder-block-input-bg": "#231b4d45",
    "smart-playlist-builder-block-input-text": "#ffffffde",
    "smart-playlist-button-bg": "#624dd4",
    "smart-playlist-button-disabled": "#747272",
    "smart-playlist-button-disabled-bg": "#4935b8",
    "album-playing-pause-bg": "var(--album-playing-play-bg)",
    "album-playing-pause-border": "var(--album-playing-play-border)",
    "album-playing-pause-icon": "var(--album-playing-play-icon)",
    "album-playing-pause-hover-bg": "var(--album-playing-play-hover-bg)",
    "album-playing-pause-hover-icon": "var(--album-playing-play-hover-icon)",
    "album-playing-play-bg": "#25222b",
    "album-playing-play-border": "#5123dd",
    "album-playing-play-icon": "#ffffff",
    "album-playing-play-hover-bg": "#5123dd",
    "album-playing-play-hover-icon": "#ffffff",
    "album-playing-shadow": "#5123dd",
    "album-playing-title-bg": "#632fff",
    "popup-data-field-bg": "#0000001e",
    "popup-song-artwork-about": "#82c9df",
    "popup-song-artwork-found": "#44a15e",
    "popup-song-artwork-notfound": "#808080",
    "popup-song-metadata-prompt-error": "#6f5757",
    "popup-song-metadata-title": "#ffe6ac",
    "popup-song-metadata-validation-error": "#a12e2e",
    "popup-song-metadata-validation-warning": "#e19a00",
    oscilloscope: "#14D8BD",
    "waveform-bg": "#9c86b10f",
    "waveform-bg-hover": "#9c86b11c",
    "waveform-cursor": "#ffffff",
    "waveform-progress": "#cfbfff",
    "waveform-region-current": "#00C56C",
    "waveform-region-loop": "#DCBCFF3A",
    "waveform-wave": "#64578cca",
    "waveform-hover-label-bg": "transparent",
    "waveform-hover-label-text": "#ffffff",
    "waveform-hover-line": "#f8f8f882",
    "waveform-hoverhead-line-bg": "#FFFFFF62",
    "sidebar-item-drag-bg": "#5123dd",
    "sidebar-item-hover-bg": "#392f5d3b",
    "sidebar-item-hover-text": "var(--text-inactive)",
    "sidebar-item-selected-pipe-bg": "#5123dd",
    "sidebar-node-inactive-hover-bg": "transparent",
    "sidebar-node-inactive-hover-opacity": 0.5,
    "sidebar-node-inactive-hover-text": "var(--text-inactive)",
    "mapview-region-bg": "#645479",
    "mapview-region-border": "#4F4464",
    "mapview-region-hover-bg": "#645479",
    "mapview-region-hover-border": "#C1B1F3",
    "mapview-region-selected-bg": "#59CD70",
    "mapview-region-selected-border": "#4F4464",
    "mapview-region-selected-hover-bg": "#59CD70",
    "mapview-region-selected-hover-border": "#4F4464",
    "mapview-scale-1": "#eeeeee",
    "mapview-scale-2": "#999999",
    "progressbar-track-bg": "#ffffff43",
    "progressbar-value-bg": "#23DD7F",
    "analytics-primary": "#23dd7f",
    "analytics-secondary": "#855dff",
    "prune-button-delete-bg": "#ff00007d",
    "prune-button-delete-pressed-shadow": "#ff4747aa",
    "prune-button-keep-bg": "#00800073",
    "prune-button-keep-pressed-shadow": "#00ff00aa",
    "prune-fordelete": "#ff5a5a",
    "wiki-bg": "#ffffff18",
    "wiki-header-bg": "var(--wiki-bg)",
    "wiki-inarticle-bg": "var(--wiki-bg)",
    "wiki-pill-bg": "var(--wiki-bg)",
    "wiki-pill-text": "var(--text-secondary)",
    "wiki-pill-hover-bg":
        "color-mix(in srgb, var(--button-bg) 20%, transparent)",
    "wiki-pill-hover-text": "var(--text-secondary)"
};

export const allThemes: { [key: string]: Theme } = {
    light: {
        ...DEFAULT_THEME,
        type: "light",
        text: "#282230",
        "text-secondary": "#56575b",
        "text-active": "#38353b",
        "text-inactive": "#707879",
        background: "#e8e1e1",
        "overlay-bg": "#f1f1f1c0",
        accent: "#5d00fff3",
        "accent-secondary": "#da69ff",
        "button-bg": "#282b2c",
        "button-text": "#ede8f0",
        "input-bg": "#86808066",
        "icon-primary": "#2c0b3e",
        "icon-secondary": "#716a6a",
        "transport-control": "#333135",
        "transport-favorite": "#49ab65",
        "transport-shuffle": "#9804d3",
        "panel-background": "#dfd8d8",
        "library-text-color": "#3e4040",
        "library-playing-bg": "#36a4b5",
        "library-playing-text": "#ffffff",
        "library-playing-icon": "#1a1718",
        "library-highlight-bg": "#9fb0b4",
        "library-hover-bg": "#c2cfd2",
        "library-header-bg": "#95afb37e",
        "library-header-active-bg": "#7bb1b7",
        "library-clickable-cell-bg": "#8ebac546",
        "library-clickable-cell-hover-bg": "#6fb1beae",
        "library-favourite-icon": "#5123dd",
        "smart-playlist-builder-bg": "#347c75",
        "smart-playlist-builder-block-bg": "#56beb556",
        "smart-playlist-builder-block-focused-bg": "#569abe99",
        "smart-playlist-builder-block-input-bg": "#1b474d6f",
        "album-playing-play-hover-bg": "#36a4b5",
        "album-playing-shadow": "#36a4b5",
        "album-playing-title-bg": "#da69ff",
        oscilloscope: "#017b94"
    },
    light2: {
        ...DEFAULT_THEME,
        type: "light",
        text: "#282230",
        "text-secondary": "#56575b",
        "text-active": "#38353b",
        "text-inactive": "#646067",
        background: "#e9e5efd9",
        "overlay-bg": "#f1f1f1c0",
        accent: "#5d00fff3",
        "accent-secondary": "#da69ff",
        "button-bg": "#282b2c",
        "button-text": "#ede8f0",
        "input-bg": "#86808066",
        "icon-primary": "#2c0b3e",
        "icon-secondary": "#716a6a",
        "transport-control": "#333135",
        "transport-favorite": "#49ab65",
        "transport-shuffle": "#9804d3",
        "panel-background": "#e3dfe8",
        "library-text-color": "#3e4040",
        "library-playing-bg": "#5123dd",
        "library-playing-text": "#ffffff",
        "library-playing-icon": "#efe2e6",
        "library-highlight-bg": "#5123dd45",
        "library-hover-bg": "#5123dd1c",
        "library-header-bg": "#998bbb7e",
        "library-header-text": "#312c2c",
        "library-header-active-bg": "#997be1",
        "library-clickable-cell-bg": "#9891aa1c",
        "library-clickable-cell-hover-bg": "#5123dd6e",
        "library-favourite-icon": "#5123dd",
        "smart-playlist-builder-bg": "#b49bff",
        "smart-playlist-builder-text": "#ffffffde",
        "smart-playlist-builder-block-bg": "#a691f3",
        "smart-playlist-builder-block-focused-bg": "#8b76d0",
        "smart-playlist-builder-block-input-bg": "#907dd1",
        "album-playing-play-hover-bg": "#5123dd",
        "album-playing-shadow": "#5123dd",
        "album-playing-title-bg": "#da69ff",
        oscilloscope: "#590194"
    },
    dark: DEFAULT_THEME,
    amphibian: {
        ...DEFAULT_THEME,
        type: "dark",
        text: "#b6e1e3de",
        "text-secondary": "#819be8",
        "text-active": "#83e4ff",
        "text-inactive": "#668e93",
        background: "#233346",
        "overlay-bg": "#2333466d",
        accent: "#00ff62f3",
        "accent-secondary": "#4453bbf3",
        "button-bg": "#486d7b",
        "icon-primary": "#ffffff",
        "icon-secondary": "#797676",
        "transport-control": "#e9d6fb",
        "transport-favorite": "#59cd7a",
        "transport-shuffle": "#e1ff00",
        "panel-background": "#181e25",
        "library-text-color": "#8cb3b8",
        "library-playing-bg": "#23cedd",
        "library-playing-text": "#000000",
        "library-playing-icon": "#1a1718",
        "library-highlight-bg": "#2e4f57",
        "library-hover-bg": "#1d2a30",
        "library-header-bg": "#65888e7e",
        "library-header-active-bg": "#4d788d",
        "library-clickable-cell-bg": "#286e7f46",
        "library-clickable-cell-hover-bg": "#188da5ae",
        "library-favourite-icon": "#23cedd",
        "library-favourite-hover-icon": "#83dbe6",
        "smart-playlist-builder-bg": "#347c75",
        "smart-playlist-builder-block-bg": "#56beb556",
        "smart-playlist-builder-block-focused-bg": "#569abe99",
        "smart-playlist-builder-block-input-bg": "#1b474d6f",
        "album-playing-play-hover-bg": "#23cedd",
        "album-playing-shadow": "#23cedd",
        "album-playing-title-bg": "#4453bbf3"
    },
    turquoise: {
        ...DEFAULT_THEME,
        type: "dark",
        background: "#01796fda",
        text: "#eef4f1",
        "text-secondary": "#e4d7c7ff",
        "text-active": "#ffffff",
        "text-inactive": "#a3ccc5",
        accent: "#45fffcf3",
        "accent-secondary": "#32ceb5f3",
        "overlay-bg": "#02564fc6",
        "panel-background": "#027167",
        "button-bg": "#282b2c",
        "button-text": "#ede8f0",
        "input-bg": "#0c5f58da",
        "icon-primary": "white",
        "icon-secondary": "white",
        "library-text-color": "#e4eced",
        "library-header-bg": "#03867b",
        "library-header-active-bg": "#59b5ad",
        "library-playing-bg": "#f3d2ba",
        "library-highlight-bg": "#f3caad82",
        "library-hover-bg": "#f4ceb238",
        "library-playing-text": "#3d1507",
        "library-playing-icon": "#073d23",
        "library-favourite-icon": "#f3d2ba",
        "library-favourite-hover-icon": "#f6decd",
        "library-clickable-cell-bg": "#03867b",
        "library-clickable-cell-hover-bg": "#0ca89b",
        "smart-playlist-builder-bg": "#d6d5d0",
        "smart-playlist-builder-block-bg": "#eee3e3",
        "smart-playlist-builder-block-focused-bg": "#f5efef",
        "smart-playlist-builder-block-input-bg": "#d6e1e090",
        "smart-playlist-builder-block-input-text": "#675c5cde",
        "smart-playlist-builder-text": "#1c4531",
        "album-playing-play-hover-bg": "#f3d2ba",
        "album-playing-shadow": "#f3d2ba",
        "album-playing-title-bg": "#32ceb5f3",
        oscilloscope: "#d2ff2e"
    },
    red: {
        ...DEFAULT_THEME,
        text: "#f1f1f1",
        background: "#562931",
        "accent-secondary": "#be3153f3",
        "library-playing-bg": "#be3153",
        "library-playing-text": "#ffffff",
        "library-playing-icon": "#ffffff",
        "library-favourite-icon": "#ff386a",
        "library-favourite-hover-icon": "#ff899d",
        "album-playing-play-hover-bg": "#be3153f3",
        "album-playing-shadow": "#be3153",
        "album-playing-title-bg": "#be3153f3",
        "transport-control": "#be3153",
        "transport-favorite": "#ff386a",
        "transport-shuffle": "#be3153"
    },
    winamp: {
        ...DEFAULT_THEME,
        type: "dark",
        background: "#25253e",
        "panel-background": "black",
        "library-text-color": "#05A101",
        "library-playing-bg": "transparent",
        "library-playing-text": "white",
        "library-header-bg": "black",
        "library-header-text": "#acb4ac",
        "library-playing-icon": "#7fbd7f",
        "library-favourite-icon": "#05A101",
        "library-favourite-hover-icon": "#7fbd7f",
        "album-playing-play-hover-bg": "#7c715cf3",
        "album-playing-shadow": "transparent",
        "album-playing-title-bg": "#7c715cf3",
        accent: "#F0D895",
        "accent-secondary": "#7c715cf3",
        "text-active": "#F0D895",
        "text-inactive": "#aeafa8",
        "icon-primary": "#E5F6F7",
        "icon-secondary": "#E5F6F7",
        "oscilloscope": "#07ea03",
    },
    "zokugun obsidium": tmZokugunObsidium as Theme,
};
