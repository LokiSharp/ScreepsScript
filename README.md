# ScreepsScript

LokiSharp 的 [Screeps](https://screeps.com/a/#!/map) 半自动 AI 项目

## 准备

**安装依赖**

你需要安装:

- [Node.JS](https://nodejs.org/en/download) (10.x 或 12.x)
- 包管理工具 ([Yarn](https://yarnpkg.com/en/docs/getting-started) 或 [npm](https://docs.npmjs.com/getting-started/installing-node))
- Rollup CLI (可选, 通过 `npm install -g rollup` 安装)

从[这里](https://github.com/LokiSharp/ScreepsScript/archive/master.zip)下载并解压最新的代码。

在终端中打开这个目录并运行你的包管理器安装依赖包。

```bash
# npm
npm install

# yarn
yarn
```

**设置密钥**

复制并重命名 screeps.sample.json 为 screeps.json，填写相关设置。

## 使用

向服务器提交代码

```
npm run push-main       # 官方服务器
npm run push-pserver    # 个人服务器
npm run push-sim        # 模拟环境
```

监视代码变动并自动向服务器提交代码

```
npm run watch-main          # 官方服务器
npm run watch-pserver       # 个人服务器
npm run watch-sim           # 模拟环境
```

运行测试

```
npm run test                # 运行全部测试
npm run test-unit           # 运行单元测试
npm run test-integration    # 运行集成测试
```

检查代码风格

```
npm run lint                # 检验代码风格，仅项目代码
npm run lint-fix            # 检验代码风格并自动修复，仅项目代码
npm run lint-all            # 检验代码风格，包括测试代码和项目构建脚本
npm run lint-fix-all        # 检验代码风格并自动修复，包括测试代码和项目构建脚本
```

## 其他

本项目的构建流程参考了 [screeps-typescript-starter](https://github.com/screepers/screeps-typescript-starter)，代码结构以及设计思路参考了 [HoPGoldy/my-screeps-ai](https://github.com/HoPGoldy/my-screeps-ai) 。
