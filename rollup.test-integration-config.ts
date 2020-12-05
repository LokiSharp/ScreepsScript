/* eslint-disable @typescript-eslint/no-unsafe-call */
"use strict";
import buble from "rollup-plugin-buble";
import clear from "rollup-plugin-clear";
import commonjs from "@rollup/plugin-commonjs";
import multiEntry from "@rollup/plugin-multi-entry";
import nodent from "rollup-plugin-nodent";
import resolve from "@rollup/plugin-node-resolve";
import typescript from "rollup-plugin-typescript2";

export default {
  input: "test/integration/integration.test.ts",
  output: {
    file: "dist/test-integration.bundle.js",
    name: "lib",
    sourcemap: true,
    format: "iife",
    globals: {
      chai: "chai",
      it: "it",
      describe: "describe"
    }
  },
  external: ["chai", "it", "describe"],
  plugins: [
    clear({ targets: ["dist/test-integration.bundle.js"] }),
    resolve(),
    commonjs({
      include: /node_modules/,
      namedExports: {
        "node_modules/lodash/index.js": ["get", "set", "each"]
      }
    }),
    typescript({ tsconfig: "./tsconfig.test-integration.json" }),
    nodent(),
    multiEntry(),
    buble()
  ]
};
