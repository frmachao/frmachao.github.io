const fetchData = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve('fetch data is me')
        }, 1000)
        setTimeout(() => {
            // 只要调用fetchData reject 就会在控制台输出,如果想捕捉 reject 需要通过promise.property.catch 或者promise.property.then 方法的第二个参数来捕获
            reject({ name: "error", message: '出错' })
        }, 1100)
        // throw new Error('test');
    })
}

const test = () => {
    return fetchData()
        .then()
        .catch(err=>err)
}
(async () => {
    const [err, data] = await test().then(data => [null, data]).catch(err => [err, null])
    console.log('data==', data)// null
    console.log('err==', err)// err
})()

//.catch(err)的返回值也是Promise ，相当于错误被他吃了 并作为结果返回，所以Async里拿不到error；data 就是catch 返回的结果
// (async () => {
//     const [err, data] = await test().then(data => [null, data]).catch(err => [err, null])
//     console.log('data==', data)
//     console.log('err==', err)
// })()

// const fetchData = () => {
//     // Promise对象是一个构造函数，用来生成Promise实例
//     return new Promise((resolve, reject) => {
//         setTimeout(() => {
//             resolve('fetch data is me')
//         }, 1000)
//         setTimeout(() => {
//             // 只要调用fetchData reject 就会在控制台输出,如果想捕捉 reject 需要通过promise.property.catch
//             reject({ name: "error", message: '出错' })
//         }, 500)
//     })
// }
