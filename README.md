# [dva](https://github.com/careteenL/dva)
[![](https://img.shields.io/badge/Powered%20by-dva-brightgreen.svg)](https://github.com/careteenL/dva)
[![license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/careteenL/dva/blob/master/LICENSE)
[![Build Status](https://travis-ci.org/careteenL/dva.svg?branch=master)](https://travis-ci.org/careteenL/dva)
[![npm](https://img.shields.io/badge/npm-0.1.0-orange.svg)](https://www.npmjs.com/package/@careteen/dva)
[![NPM downloads](http://img.shields.io/npm/dm/@careteen/dva.svg?style=flat-square)](http://www.npmtrends.com/@careteen/dva)

<!-- [English Document](./README.en_US.md) -->

学习并仿写`dva`，目前已提供基础功能。

- [x] 基础功能
- [x] 支持`plugin`
  - [x] [dva-loading](./plugins/dva-loading.js)
  - [x] `dynamic`
  - [x] [redux-undo](./plugins/redux-undo.js)
  - [x] [redux-persist](./plugins/redux-persist)
  - [x] [redux-immer](./plugins/redux-immer.js)
- [x] 支持`middleware`
  - [x] [redux-logger](./middlewares/redux-logger.js)
- 支持捕获错误

> [示例](./examples)

## 快速使用

安装
```shell
npm i -S @careteen/dva
```

使用方式和`dva`一样

```js
// TODO
```


## issue模板

- [Issue Template](./ISSUETEMPLATE.md)

## 贡献者指南

clone仓库并引入依赖
```shell
git clone git@github.com:careteenL/dva.git
npm install
```
开始开发：）

...

启动本地服务器编写示例
```shell
npm run example
```
- [Contributors](https://github.com/careteenL/dva/graphs/contributors)

## 更新日志

- [Changelog](./CHANGELOG.md)
