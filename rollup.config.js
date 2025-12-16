import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";

export default {
  input: "src/plugin.ts",
  output: {
    file: "com.whyisjake.sleep-screensaver.sdPlugin/bin/plugin.js",
    format: "es",
    sourcemap: true,
  },
  external: ["@elgato/streamdeck", "child_process"],
  plugins: [
    resolve({
      preferBuiltins: true,
    }),
    commonjs(),
    typescript({
      tsconfig: "./tsconfig.json",
    }),
  ],
};
