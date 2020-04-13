# Promise 异步编程 学习笔记1
> 工作中经常使用到 `Promise` 但经常是一知半解 特此记录一下

## Promise是什么
> 阮一峰 es6 入门有关于其的介绍
Promise 是异步编程的一种解决方案，比传统的解决方案——回调函数和事件——更合理和更强大。它由社区最早提出和实现，ES6 将其写进了语言标准，统一了用法，原生提供了`Promise`对象。

所谓`Promise`，简单说就是一个容器，里面保存着某个未来才会结束的事件（通常是一个异步操作）的结果。从语法上说，Promise 是一个对象，从它可以获取异步操作的消息。Promise 提供统一的 API，各种异步操作都可以用同样的方法进行处理。

Promise两个重要的状态 resolved 和 reject 我理解是Promise对象被调用后 一定会响应一种状态 要么resolver 要么 reject ,否则不会有返回结果

## 基本用法
Promise对象是一个构造函数，用来生成Promise实例
```js
const promise = new Promise(function(resolve, reject) {
  // ... some code
  if (/* 异步操作成功 */){
    resolve(value);
  } else {
    reject(error);
  }
});
```
Promise构造函数接受一个函数作为参数，该函数的两个参数分别是resolve和reject。它们是两个函数，由 JavaScript 引擎提供，不用自己部署。

resolve函数的作用是，将Promise对象的状态从“未完成”变为“成功”（即从 pending 变为 resolved），在异步操作成功时调用，并将异步操作的结果，作为参数传递出去；reject函数的作用是，将Promise对象的状态从“未完成”变为“失败”（即从 pending 变为 rejected），在异步操作失败时调用，并将异步操作报出的错误，作为参数传递出去。

Promise实例生成以后，可以用then方法分别指定resolved状态和rejected状态的回调函数
```js
promise.then((value)=> {
  // success
}, (error)=> {
  // failure
});
```

## 实现一个简单的异步控制
```js
const fetchData = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve('fetch data is me')
        }, 1000)
        setTimeout(() => {
            // 只要调用fetchData reject 就会在控制台输出,如果想捕捉 reject 需要通过promise.property.catch 或者then(undefined, rejection)
            reject({ name: "error", message: '出错' })
        }, 500)
    })
}
fetchData()
.then(result=>{console.log('result',result)})
.catch(err=>{console.log('err',err)})
```
上面代码输出 `err {name: "error", message: "出错"}`,这也验证了上面说的,两种状态一旦有一个被响应就会结束；
Promise.prototype.catch()方法是.then(null, rejection)或.then(undefined, rejection)的别名，用于指定发生错误时的回调函数。
所以,上面的代码也可以写成 
```js
fetchData()
.then(result=>{console.log('result',result)},(reject)=>{console.log('reject==',reject)})
```
## 结合 Async(Promise的语法糖) 函数  
Promise.prototype.then() 这里 返回的是一个新的Promise 实例，`注意`：不是原来的那个Promise。

下面的test函数里`Promise` 调用了`catch` 那么 接下来的 `asyc`函数里就捕获不到`error`,
还记得上面说的`.catch()方法是.then(null, rejection)别名`吗，所以调用catch也是返回了一个新`Promise` ,
```js
const test = () => {
    return fetchData()
            .then(res =>111)
            .catch(err=>err)
}
(async () => {
    const [err, data] = await test().then(data => [null, data]).catch(err => [err, null])
    console.log('data==', data)// err {name: "error", message: "出错"}
    console.log('err==', err.message)// null
})()
```

再稍微修改一下 `fetchData`方法,将 resolve 参数先被执行
```js
const fetchData = () => {
    // Promise对象是一个构造函数，用来生成Promise实例
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve('fetch data is me')
        }, 500)
        setTimeout(() => {
            reject({ name: "error", message: '出错' })
        }, 1000)
    })
}
const test = () => {
    return fetchData()
            .then(res =>111)
            .catch(err=>err)
}
(async () => {
    const [err, data] = await test().then(data => [null, data]).catch(err => [err, null])
    console.log('data==', data)// 111
    console.log('err==', err.message)// null
})()
// 如果这种 async 函数里 data 打印出的依然是第一个promsie resolve状态的结果，嗯 似乎有点理解了
fetchData().then(res=>res) // data== fetch data is me
```

## 待续.....

