import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import replace from "@rollup/plugin-replace";

const variant = (process.env.STREAM_DECK_VARIANT || "prod").toLowerCase();
const outDir =
  variant === "dev"
    ? "com.whyisjake.sleep-screensaver.dev.sdPlugin/bin/plugin.js"
    : "com.whyisjake.sleep-screensaver.sdPlugin/bin/plugin.js";

export default {
  input: "src/plugin.ts",
  output: {
    file: outDir,
    format: "es",
    sourcemap: true,
  },
  external: ["@elgato/streamdeck", "child_process"],
  plugins: [
    replace({
      preventAssignment: true,
      values: {
        "process.env.STREAM_DECK_VARIANT": JSON.stringify(variant),
      },
    }),
    resolve({
      preferBuiltins: true,
    }),
    commonjs(),
    typescript({
      tsconfig: "./tsconfig.json",
    }),
  ],
};
