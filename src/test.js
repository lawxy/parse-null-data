let obj = {
    a: {b: [1,{c:34},3]},
    b: [1,3,4,5,7]
}

function getType(data) {
    /**
     * [object Number] String Undefined Boolean Object Array Function
    */
    let t = Object.prototype.toString.call(data);
    return t.match(/\[object (.*)\]/)[1]
}

function defineProperty (obj, key, val) {
    Object.defineProperty(obj, key, {
        value: val,
        enumerable: false
    })
}

function ProxyFun (val) {
    // 代理函数初始值， 可以替换
    let returnVal = val;
    // 执行最终函数时，判断是否强替换， 否则判断使用初始值或者默认值
    let fun = function (defaultVal, replace) {
        let result
        if (replace === true) result = defaultVal;
        else result = returnVal ? returnVal : defaultVal;
        return result
    }

    // let type = getType(val);
    // if(['Object', 'Array', 'Function'].indexOf(type) > -1) {
    //     let win = typeof window !== 'undefined' ? window : global;
    //     let prototypes = Object.getOwnPropertyNames(win[type].prototype);

    //     prototypes.forEach(method => {
    //         if (typeof win[type].prototype[method] === 'funtion') {
    //             fun[method] =  win[type].prototype[method].bind(val)
    //         }
    //     })
    // }
  
    return fun
}

function proxyObj(obj, defaultVal) {
    let fun = new ProxyFun(defaultVal)
    return new Proxy(fun, {
        get(target, key) {
            // fun() = {b:123}
            if (typeof obj[key] ==='object' && obj[key] !== null || typeof obj[key] === 'funtion') {
               for (let k in obj[key]) {
                   fun[k] = obj[key][k]
               }
            }

            let p = proxyObj(fun, obj[key]);
           
            defineProperty(p, 'valueOf', function () {
                return obj[key]
            })
            defineProperty(p, 'toString', function () {
                return obj[key]
            })
            return p;
        }
    })
}

let p = proxyObj(obj)

const { a:{b} } = p;
console.log(b())

