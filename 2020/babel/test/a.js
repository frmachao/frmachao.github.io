const array = [1, 2, 3, 4, 5, 6];
console.log(array.includes(2));// 实例方法
console.log(Array.from('foo'));// 静态方法
const fetchData = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve('fetch data is me')
        }, 1000)
        setTimeout(() => {
            reject({ name: "error", message: '出错' })
        }, 500)
    })
}
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