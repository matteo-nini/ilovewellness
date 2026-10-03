// Gli stessi colori del sito (apps/web/src/app/globals.css): un'unica identità visiva.
export const colors = {
  sand50: "#fbf8f3",
  sand100: "#f4ede2",
  sand200: "#e9dcc5",
  sage100: "#e3ebe1",
  sage300: "#b4c8b0",
  sage500: "#6f8f6b",
  sage700: "#44603f",
  sage900: "#23331f",
  terra400: "#d98e6a",
  terra500: "#c4704b",
  terra600: "#a95a38",
  ink: "#1f2a1d",
  muted: "#5d6a59",
  white: "#ffffff",
};

// In React Native non c'è CSS: gli stili sono oggetti JavaScript e le misure sono "punti" (dp).
export const space = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 };
export const radius = { sm: 8, md: 12, lg: 16, xl: 24, pill: 999 };
export const font = {
  serif: { fontFamily: "Georgia", fontWeight: "400" as const },
};
