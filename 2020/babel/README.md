## 前言

我的项目中使用 `babel7` 处理 `TS` `JS` `TSX` 文件，babel 真的很棒 而且插件丰富，感谢 babel 团队。

但是当我想利用 babel polyfill 的能力来兼容 ie 8 时，纠结来很久。不清楚 babel-plugin-transform-runtime 和 babel-preset-env 如何配合使用，非常不幸的事：babel 提供的在线工具总是提示我 插件加载失败，这使得我只能单独配置一个 测试环境来学习 babel 插件的使用。
![image](https://user-images.githubusercontent.com/22849231/80725521-c69e1d80-8b35-11ea-9aad-4f27e5194a49.png)
babel 和 gulp 的基本使用就不介绍了.....，[本文中的代码地址](https://github.com/frmachao/blog/tree/master/2020/babel)

```js
/*
环境相关依赖
"gulp": "^4.0.2",
"gulp-babel": "^8.0.0-beta.2",
"@babel/core": "^7.6.4",
"@babel/preset-env": "^7.6.3"
*/
```

## 使用 babel-preset-env

```js
// gulpfile.js
const gulp = require("gulp");
const babel = require("gulp-babel");

const paths = {
  build: "dist",
  test: "test/**/*.js",
};
gulp.task("test", () => {
  return gulp
    .src(paths.test)
    .pipe(
      babel({
        presets: [
          [
            "@babel/preset-env",
            {
              targets: {
                // 表示兼容市场占有率>1%，浏览器的最新两个版本，ie8以下不兼容
                browsers: ["> 1%", "last 2 versions", "not ie <= 8"],
                useBuiltIns: "usage",
                corejs: { version: 3 },
              },
            },
          ],
        ],
        exclude: [/node_modules/],
      })
    )
    .pipe(gulp.dest(paths.build));
});
// test/a.js
const array = [1, 2, 3, 4, 5, 6];
console.log(array.includes(2)); // 实例方法
console.log(Array.from("foo")); // 静态方法
const fetchData = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve("fetch data is me");
    }, 1000);
    setTimeout(() => {
      reject({ name: "error", message: "出错" });
    }, 500);
  });
};
fetchData()
```

然后执行 `npx gulp test`,会看到编译后的结果
![image](https://user-images.githubusercontent.com/22849231/80727285-17167a80-8b38-11ea-9354-cae80b0e9a18.png)
可以看到，babel 已经自动的往里面加载了对应的 polyfill，但是这样有个问题：
polyfill 直接挂载在全局对象上的，对于写业务 API 的时候这样并不影响使用，但是如果对于开发第三方包的情况，babel-polyfill 会污染全局变量。这时候就需要配合`babel-plugin-transform-runtime`来使用了

## 使用 babel-plugin-transform-runtime

这个插件主要用来解决两个问题：

- 避免在编译后的输出中重复代码
- 避免全局变量污染
  > 有时候 Babel 可能会在输出中注入跨文件相同的代码，因此可能会被重用

```js
// 将上面例子中的代码改写
{
            presets: [
                [
                    "@babel/preset-env",
                    {
                        targets: {
                            // ie: 8,
                            "browsers": ["> 1%", "last 2 versions", "not ie <= 8"]
                        },
                        useBuiltIns: 'usage',
                        corejs: { version: 3 }
                    }
                ]
            ],
            plugins: [
                // 避免在编译后的输出中重复代码 以及 避免全局变量污染
                ["@babel/plugin-transform-runtime"]
            ],
            exclude: [/node_modules/],
        }
```

编译后结果：没 有 变 化！说好的避免全局变量污染呢？
![image](https://user-images.githubusercontent.com/22849231/80729297-a45ace80-8b3a-11ea-90f5-d75a6e80b6b8.png)
怀疑配置有冲突,我将 @babel/preset-env 中的 useBuiltIns corejs 配置去掉后，再次运行得到:
```
var array = [1, 2, 3, 4, 5, 6];
console.log(array.includes(2)); // 实例方法

console.log(Array.from("foo")); // 静态方法

var fetchData = function fetchData() {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      resolve("fetch data is me");
    }, 1000);
    setTimeout(function () {
      reject({
        name: "error",
        message: "出错"
      });
    }, 500);
  });
};

fetchData();
```
🤨：这时我又去百度了一下，看到知乎专栏有人跟我一样的配置写，得到的编译结果却跟我不同，同时作者也没有给出文中示例代码的源码，让我无从验证 [聊一聊Babel7.x+Webpack(babel7.4+的使用感受](https://zhuanlan.zhihu.com/p/97884144)

翻看babel-plugin-transform-runtime文档看到这句：
`The plugin defaults to assuming that all polyfillable APIs will be provided by the user. Otherwise the corejs option needs to be specified.`
这个插件默认所有 polyfillable api 都将由用户提供。 否则，需要指定 corejs 选项。

```js
// 继续修改上面的例子
            plugins: [
                ["@babel/plugin-transform-runtime", {
                    "corejs": 3, // 指定corejs
                }]
            ],
```

`npx gulp test` 走你：
![image](https://user-images.githubusercontent.com/22849231/80730024-a1141280-8b3b-11ea-9899-1cf0e37a659f.png)
编译结果中可以看到全局变量已经加上了前缀


🤔️ 关于配置项 regenerator

> 文档中说： 默认 true 切换是否将生成器函数转换为使用不会污染全局范围的再生器运行时

我理解这就是避免全局污染的配置项，但是当我设置为 false 时，编译出的文件中全局变量还是加了前缀，不懂，大概只能看源码了...
