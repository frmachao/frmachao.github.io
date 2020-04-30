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
fetchData()
    .then(result => { console.log('result', result) })
    .catch(err => { console.log('err', err) })