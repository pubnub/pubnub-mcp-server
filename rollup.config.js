import { builtinModules } from "node:module";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import typescript from "@rollup/plugin-typescript";
import pkg from "./package.json" with { type: "json" };

const isDevelopment = process.env.NODE_ENV === "development" || process.env.ROLLUP_WATCH;
const deps = Object.keys(pkg.dependencies || {});
const builtins = new Set([...builtinModules, ...builtinModules.map(m => `node:${m}`)]);

export default {
  input: "src/index.ts",

  output: {
    file: "dist/index.js",
    format: "es",
    sourcemap: true,
    banner: isDevelopment ? "" : "#!/usr/bin/env node",
  },

  plugins: [
    commonjs(),
    json(),
    typescript({
      tsconfig: "./tsconfig.json",
    }),
  ],

  external: id => {
    if (builtins.has(id)) return true;
    if ([...builtins].some(m => id.startsWith(`${m}/`))) return true;
    return deps.some(dep => id === dep || id.startsWith(`${dep}/`));
  },

  watch: {
    exclude: "node_modules/**",
    include: "src/**",
  },
};
