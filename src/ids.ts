export const BASE_PLUGIN_ID = "com.whyisjake.sleep-screensaver";

// Value injected by rollup-replace at build time
const VARIANT = (process.env.STREAM_DECK_VARIANT || "prod").toLowerCase();

export const PLUGIN_ID = VARIANT === "dev" ? `${BASE_PLUGIN_ID}.dev` : BASE_PLUGIN_ID;

export const UUIDS = {
  SLEEP: `${PLUGIN_ID}.sleep`,
  SCREENSAVER: `${PLUGIN_ID}.screensaver`,
};
