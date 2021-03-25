import { InputOptions, OutputOptions, RollupBuild, rollup } from "rollup";
import { readFile } from "fs";
import resolve from "@rollup/plugin-node-resolve";
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-var-requires
const commonjs = require("@rollup/plugin-commonjs");
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-var-requires
const typescript = require("rollup-plugin-typescript2");
/**
 * 构建流程
 */
const plugins = [
  // 打包依赖
  resolve(),
  // 模块化依赖
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  commonjs(),
  // 编译 ts
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  typescript({ tsconfig: "tsconfig.json" })
];

/**
 * 执行模块构建
 * @param input 构建的入口文件
 * @returns 可以直接用在 bot 中的 module
 */
export const build = async function (input: string): Promise<Record<string, unknown>> {
  const inputOptions: InputOptions = { input, plugins };
  const outputOptions: OutputOptions = { format: "cjs", sourcemap: true };

  // 构建模块代码
  const bundle: RollupBuild = await rollup(inputOptions);
  const {
    output: [targetChunk]
  } = await bundle.generate(outputOptions);

  // 组装并返回构建成果
  return {
    main: targetChunk.code,
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    "main.js.map": `module.exports = ${targetChunk.map};`
  };
};

/**
 * async 版本的 readFile
 *
 * @param path 要读取的文件
 * @returns 该文件的字符串内容
 */
const readCode = async function (path: string): Promise<string> {
  // eslint-disable-next-line @typescript-eslint/no-shadow
  return new Promise((resolve, reject) => {
    readFile(path, (err, data) => {
      if (err) return reject(err);
      resolve(data.toString());
    });
  });
};

/**
 * 全局唯一的 dist 代码模块
 */
let myCode: Record<string, unknown>;

/**
 * 获取自己的全量代码模块
 */
export const getMyCode = async function (): Promise<Record<string, unknown>> {
  if (myCode) return myCode;

  const [main, map] = await Promise.all([readCode("dist/main.js"), readCode("dist/main.js.map.js")]);

  myCode = { main, "main.js.map": map };
  return myCode;
};
