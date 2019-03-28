/*!
 * Vue.js v2.5.16
 * (c) 2014-2018 Evan You
 * Released under the MIT License.
 * development   开发
 * production    生产
 /*
 *  兼容 amd cmd 模块写法
 * */
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
        typeof define === 'function' && define.amd ? define(factory) :
            (global.Vue = factory());
}(this, (function () {
    'use strict';

    /*  */
//Object.freeze()阻止修改现有属性的特性和值，并阻止添加新属性。
    var emptyObject = Object.freeze({});

// these helpers produces better vm code in JS engines due to their
// explicitness and function inlining
    // these helpers produces better vm code in JS engines due to their
// explicitness and function inlining
    //判断数据 是否是undefined或者null
    function isUndef(v) {
        return v === undefined || v === null
    }

    //判断数据 是否不等于 undefined或者null
    function isDef(v) {
        return v !== undefined && v !== null
    }

    //判断是否真的等于true
    function isTrue(v) {
        return v === true
    }

    //  判断是否是false
    function isFalse(v) {

        return v === false
    }

    /**
     * Check if value is primitive
     *  //判断数据类型是否是string，number，symbol，boolean
     */
    function isPrimitive(value) {
        //判断数据类型是否是string，number，symbol，boolean
        return (
            typeof value === 'string' ||
            typeof value === 'number' ||
            // $flow-disable-line
            typeof value === 'symbol' ||
            typeof value === 'boolean'
        )
    }

    /**
     * Quick object check - this is primarily used to tell
     * Objects from primitive values when we know the value
     * is a JSON-compliant type.
     */
    function isObject(obj) {
        //判断是否是对象
        return obj !== null && typeof obj === 'object'
    }

    /**
     * Get the raw type string of a value e.g. [object Object]
     */
        //获取toString 简写
    var _toString = Object.prototype.toString;

    function toRawType(value) {
        //类型判断 返会Array ，Function，String,Object,Re 等
        return _toString.call(value).slice(8, -1)
    }

    /**
     * Strict object type check. Only returns true
     * for plain JavaScript objects.
     */
    function isPlainObject(obj) {
        //判断是否是对象
        return _toString.call(obj) === '[object Object]'
    }

    function isRegExp(v) {
        //判断是否是正则对象
        return _toString.call(v) === '[object RegExp]'
    }

    /**
     * Check if val is a valid array index.
     */
    /**
     * Check if val is a valid array index.
     * 检查VAL是否是有效的数组索引。
     */
    function isValidArrayIndex(val) {
        //isFinite 检测是否是数据
        //Math.floor 向下取整
        var n = parseFloat(String(val));
        //isFinite 如果 number 是有限数字（或可转换为有限数字），那么返回 true。否则，如果 number 是 NaN（非数字），或者是正、负无穷大的数，则返回 false。
        return n >= 0 && Math.floor(n) === n && isFinite(val)
    }

    /**
     * Convert a value to a string that is actually rendered.
     */
    function toString(val) {

        //将对象或者其他基本数据 变成一个 字符串
        return val == null
            ? ''
            : typeof val === 'object'
            ? JSON.stringify(val, null, 2)
            : String(val)
    }

    /**
     * Convert a input value to a number for persistence.
     * If the conversion fails, return original string.
     */
    function toNumber(val) {
        //字符串转数字，如果失败则返回字符串
        var n = parseFloat(val);
        return isNaN(n) ? val : n
    }

    /**
     * Make a map and return a function for checking if a key
     * is in that map.
     *
     *  //map 对象中的[name1,name2,name3,name4]  变成这样的map{name1:true,name2:true,name3:true,name4:true}
     *  并且传进一个key值取值，这里用到策略者模式
     */
    function makeMap(str,
                     expectsLowerCase) {
        var map = Object.create(null);   //创建一个新的对象
        var list = str.split(',');    //按字符串,分割
        for (var i = 0; i < list.length; i++) {
            map[list[i]] = true;   //map 对象中的[name1,name2,name3,name4]  变成这样的map{name1:true,name2:true,name3:true,name4:true}
        }
        return expectsLowerCase
            ? function (val) {
            return map[val.toLowerCase()];
        }   //返回一个柯里化函数 toLowerCase转换成小写
            : function (val) {
            return map[val];
        }   //返回一个柯里化函数 并且把map中添加一个 属性建
    }

    /**
     * Check if a tag is a built-in tag.
     * 检查标记是否为内置标记。
     */
    var isBuiltInTag = makeMap('slot,component', true);

    /**
     * Check if a attribute is a reserved attribute.
     * 检查属性是否为保留属性。
     * isReservedAttribute=function(vale){ map{key:true,ref:true,slot-scope:true,is:true,vaule:undefined}  }
     */
    var isReservedAttribute = makeMap('key,ref,slot,slot-scope,is');

    /**
     * Remove an item from an array
     *    //删除数组
     */
    function remove(arr, item) {
        if (arr.length) {
            var index = arr.indexOf(item);
            if (index > -1) {
                return arr.splice(index, 1)
            }
        }
    }

    /**
     * Check whether the object has the property.
     *检查对象属性是否是实例化还是原型上面的
     */
    var hasOwnProperty = Object.prototype.hasOwnProperty;

    function hasOwn(obj, key) {
        return hasOwnProperty.call(obj, key)
    }

    /**
     * Create a cached version of a pure function.
     */
    /**
     * Create a cached version of a pure function.
     * 创建纯函数的缓存版本。
     * 创建一个函数，缓存，再return 返回柯里化函数
     * 闭包用法
     */
    /***********************************************************************************************
     *函数名 ：cached
     *函数功能描述 ： 创建纯函数的缓存版本。 创建一个函数，缓存，再return 返回柯里化函数 闭包用法
     *函数参数 ： fn 函数
     *函数返回值 ：    fn
     *作者 ：
     *函数创建日期 ：
     *函数修改日期 ：
     *修改人 ：
     *修改原因 ：
     *版本 ：
     *历史版本 ：
     ***********************************************************************************************/

    /*
     * var aFn =  cached(function(string){
     *
     *      return string
     *  })
     * aFn(string1);
     * aFn(string2);
     * aFn(string);
     * aFn(string1);
     * aFn(string2);
     *
     * aFn 函数会多次调用 里面就能体现了
     *  用对象去缓存记录函数
     * */

    function cached(fn) {
        var cache = Object.create(null);
        return (function cachedFn(str) {
            var hit = cache[str];
            return hit || (cache[str] = fn(str))
        })
    }

    /**
     * Camelize a hyphen-delimited string.
     * 用连字符分隔的字符串。
     * camelize = cachedFn(str)=>{ var hit = cache[str];
    return hit || (cache[str] = fn(str))}

     调用一个camelize 存一个建进来 调用两次 如果建一样就返回 hit

     横线-的转换成驼峰写法
     可以让这样的的属性 v-model 变成 vModel
     */
    var camelizeRE = /-(\w)/g;
    var camelize = cached(function (str) {
        return str.replace(camelizeRE, function (_, c) {
            return c ? c.toUpperCase() : '';
        })
    });

    /**
     * Capitalize a string.  将首字母变成大写。
     */
    var capitalize = cached(function (str) {
        return str.charAt(0).toUpperCase() + str.slice(1)
    });

    /**
     * Hyphenate a camelCase string.
     * \B的用法
     \B是非单词分界符，即可以查出是否包含某个字，如“ABCDEFGHIJK”中是否包含“BCDEFGHIJK”这个字。
     */
    var hyphenateRE = /\B([A-Z])/g;
    var hyphenate = cached(function (str) {
        //大写字母，加完减号又转成小写了 比如把驼峰 aBc 变成了 a-bc
        //匹配大写字母并且两面不是空白的 替换成 '-' + '字母' 在全部转换成小写
        return str.replace(hyphenateRE, '-$1').toLowerCase();
    });

    /**
     * Simple bind polyfill for environments that do not support it... e.g.
     * PhantomJS 1.x. Technically we don't need this anymore since native bind is
     * now more performant in most browsers, but removing it would be breaking for
     * code that was able to run in PhantomJS 1.x, so this must be kept for
     * backwards compatibility.
     *  改变this 上下文
     *  执行方式
     */

    /* istanbul ignore next */
    //绑定事件 并且改变上下文指向
    function polyfillBind(fn, ctx) {
        function boundFn(a) {
            var l = arguments.length;
            return l
                ? l > 1
                ? fn.apply(ctx, arguments)
                : fn.call(ctx, a)
                : fn.call(ctx)
        }

        boundFn._length = fn.length;
        return boundFn
    }

    //执行方式
    function nativeBind(fn, ctx) {
        return fn.bind(ctx)
    }

//bing 改变this上下文
    var bind = Function.prototype.bind
        ? nativeBind
        : polyfillBind;

    /**
     * Convert an Array-like object to a real Array.
     * 将假的数组转换成真的数组
     */
    function toArray(list, start) {
        start = start || 0;
        var i = list.length - start;
        var ret = new Array(i);
        while (i--) {
            ret[i] = list[i + start];
        }
        return ret
    }

    /**
     * Mix properties into target object.
     * * 浅拷贝
     */
    /***********************************************************************************************
     *函数名 ：extend
     *函数功能描述 ： 浅拷贝
     *函数参数 ： to 超类， _from 子类
     *函数返回值 ： 合并类
     *作者 ：
     *函数创建日期 ：
     *函数修改日期 ：
     *修改人 ：
     *修改原因 ：
     *版本 ：
     *历史版本 ：
     ***********************************************************************************************/
    //对象浅拷贝，参数（to, _from）循环_from的值，会覆盖掉to的值
    function extend(to, _from) {
        for (var key in _from) {
            to[key] = _from[key];
        }
        return to
    }

    /**
     * Merge an Array of Objects into a single Object.
     *
     */
    /***********************************************************************************************
     *函数名 ：toObject
     *函数功能描述 ： 和并对象数组合并成一个对象
     *函数参数 ： arr 数组对象类
     *函数返回值 ：
     *作者 ：
     *函数创建日期 ：
     *函数修改日期 ：
     *修改人 ：
     *修改原因 ：
     *版本 ：
     *历史版本 ：
     ***********************************************************************************************/

    function toObject(arr) {
        var res = {};
        for (var i = 0; i < arr.length; i++) {
            if (arr[i]) {
                extend(res, arr[i]);
            }
        }
        return res
    }

    /**
     * Perform no operation.
     * Stubbing args to make Flow happy without leaving useless transpiled code
     * with ...rest (https://flow.org/blog/2017/05/07/Strict-Function-Call-Arity/)

     */
    function noop(a, b, c) {
    }

    /**
     * Always return false.
     * 返回假的
     */
    var no = function (a, b, c) {
        return false;
    };

    /**
     * Return same value
     *返回相同值
     */
    var identity = function (_) {
        return _;
    };

    /**
     * Generate a static keys string from compiler modules.
     *
     *    [{ staticKeys:1},{staticKeys:2},{staticKeys:3}]
     * 连接数组对象中的 staticKeys key值，连接成一个字符串 str=‘1,2,3’
     */
    function genStaticKeys(modules) {
        return modules.reduce(
                        function (keys, m) {
                                        //累加staticKeys的值变成数组
                                          return keys.concat(m.staticKeys || [])
                                      },
                         []
        ).join(',') //转换成字符串
    }

    /**
     * Check if two values are loosely equal - that is,
     * if they are plain objects, do they have the same shape?
     * 检测a和b的数据类型，是否是不是数组或者对象，对象的key长度一样即可，数组长度一样即可
     */
    function looseEqual(a, b) {
        if (a === b) {
            return true
        }  //如果a和b是完全相等 则true
        var isObjectA = isObject(a);
        var isObjectB = isObject(b);
        if (isObjectA && isObjectB) {  //如果a和都是对象则让下走
            try {
                var isArrayA = Array.isArray(a);
                var isArrayB = Array.isArray(b);
                if (isArrayA && isArrayB) {  //如果a和b都是数组
                    // every  条件判断
                    return a.length === b.length && a.every(function (e, i) {  //如果a长度和b长度一样的时候
                            return looseEqual(e, b[i])  //递归
                        })
                } else if (!isArrayA && !isArrayB) {  //或者a和b都不是数组
                    var keysA = Object.keys(a);  // 获取到a的key值 变成一个数组
                    var keysB = Object.keys(b); // 获取到b的key值 变成一个数组
                    //他们的对象key值长度是一样的时候  则加载every 条件函数
                    return keysA.length === keysB.length && keysA.every(function (key) {
                            //递归 a和b的值
                            return looseEqual(a[key], b[key])
                        })
                } else {
                    //如果不是对象跳槽循环
                    /* istanbul ignore next */
                    return false
                }
            } catch (e) {
                //如果不是对象跳槽循环
                /* istanbul ignore next */
                return false
            }
        } else if (!isObjectA && !isObjectB) {  //b和a 都不是对象的时候
            //把a和b变成字符串，判断他们是否相同
            return String(a) === String(b)
        } else {
            return false
        }
    }

// 判断 arr数组中的数组 是否和val相等。
// 或者 arr数组中的对象，或者对象数组 是否和val 相等
    function looseIndexOf(arr, val) {
        for (var i = 0; i < arr.length; i++) {
            if (looseEqual(arr[i], val)) {
                return i
            }
        }
        return -1
    }

    /**
     * Ensure a function is called only once.
     *  确保该函数只调用一次 闭包函数
     */
    function once(fn) {
        var called = false;
        return function () {
            if (!called) {
                called = true;
                fn.apply(this, arguments);
            }
        }
    }

//ssr标记属性
    var SSR_ATTR = 'data-server-rendered';

    var ASSET_TYPES = [
        'component',  //组建指令
        'directive', //定义指令 指令
        'filter'  //过滤器指令
    ];


    var LIFECYCLE_HOOKS = [
        'beforeCreate',  //  生命周期 开始实例化 vue 指令
        'created',       //生命周期   结束实例化完 vue 指令
        'beforeMount',  //生命周期 开始渲染虚拟dom ，挂载event 事件 指令
        'mounted',      //生命周期  渲染虚拟dom ，挂载event 事件 完 指令
        'beforeUpdate',  //生命周期  开始更新wiew 数据指令
        'updated',       //生命周期  结束更新wiew 数据指令
        'beforeDestroy', //生命周期  开始销毁 new 实例 指令
        'destroyed',     //生命周期  结束销毁 new 实例 指令
        'activated',   //keep-alive组件激活时调用。
        'deactivated',  //deactivated keep-alive组件停用时调用。
        'errorCaptured'  // 具有此钩子的组件捕获其子组件树（不包括其自身）中的所有错误（不包括在异步回调中调用的那些）。
    ];
    /*  */

    var config = ({
        /**
         * Option merge strategies (used in core/util/options)
         */
        // $flow-disable-line
        //合并对象 策略
        optionMergeStrategies: Object.create(null),

        /**
         * Whether to suppress warnings.
         * * 是否禁止警告。
         */
        silent: false,

        /**
         * Show production mode tip message on boot?
         * 在引导时显示生产模式提示消息？
         * webpack打包判断执行环境是不是生产环境，如果是生产环境会压缩并且没有提示警告之类的东西
         */
        productionTip: "development" !== 'production',
        /**
         * Whether to enable devtools
         * 是否启用DevTools
         */
        devtools: "development" !== 'production',

        /**
         * Whether to record perf
         * 是否记录PERF
         */
        performance: false,

        /**
         * Error handler for watcher errors
         *监视器错误的错误处理程序
         */
        errorHandler: null,

        /**
         * Warn handler for watcher warns
         * 观察加警告处理。
         */
        warnHandler: null,

        /**
         * Ignore certain custom elements
         * 忽略某些自定义元素
         */
        ignoredElements: [],

        /**
         * Custom user key aliases for v-on
         * 用于V-on的自定义用户密钥别名 键盘码
         */
        // $flow-disable-line
        keyCodes: Object.create(null),

        /**
         * Check if a tag is reserved so that it cannot be registered as a
         * component. This is platform-dependent and may be overwritten.
         * 检查是否保留了一个标签，使其不能注册为组件。这是平台相关的，可能会被覆盖。
         */
        isReservedTag: no,

        /**
         * Check if an attribute is reserved so that it cannot be used as a component
         * prop. This is platform-dependent and may be overwritten.
         * 检查属性是否被保留，使其不能用作组件支持。这是平台相关的，可能会被覆盖。
         */
        isReservedAttr: no,

        /**
         * Check if a tag is an unknown element.
         * Platform-dependent.
         * Check if a tag is an unknown element.  Platform-dependent.
         * 检查标签是否为未知元素依赖于平台的检查，如果标签是未知元素。平台相关的
         *
         */
        isUnknownElement: no,

        /**
         * Get the namespace of an element
         * 获取元素的命名空间
         */
        getTagNamespace: noop,

        /**
         * Parse the real tag name for the specific platform.
         * 解析真实的标签平台
         */
        parsePlatformTagName: identity,

        /**
         * Check if an attribute must be bound using property, e.g. value
         * Platform-dependent.
         * 检查属性是否必须使用属性绑定，例如依赖于依赖于平台的属性。
         */
        mustUseProp: no,

        /**
         * Exposed for legacy reasons
         * 因遗产原因暴露
         * 声明周期对象
         */
        _lifecycleHooks: LIFECYCLE_HOOKS
    })

    /*  */

    /**
     * Check if a string starts with $ or _
     * 检查一个字符串是否以$或者_开头
     */
    function isReserved(str) {
        var c = (str + '').charCodeAt(0);
        return c === 0x24 || c === 0x5F
    }

    /**
     * Define a property.
     * 用defineProperty 定义属性
     * 详细地址 https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty
     第一个参数是对象
     第二个是key
     第三个是vue
     第四个是 是否可以枚举
     */
    function def(obj, key, val, enumerable) {

        Object.defineProperty(obj, key, {
            value: val, //值
            enumerable: !!enumerable,  //定义了对象的属性是否可以在 for...in 循环和 Object.keys() 中被枚举。
            writable: true, //可以 改写 value
            configurable: true  //configurable特性表示对象的属性是否可以被删除，以及除writable特性外的其他特性是否可以被修改。
        });
    }


    /**
     * Parse simple path.
     * 解析。
     */
    var bailRE = /[^\w.$]/;  //匹配不是 数字字母下划线 $符号   开头的为true

    function parsePath(path) {
        console.log(path)

        if (bailRE.test(path)) {  //匹配上 返回 true
            return
        }
        //匹配不上  path在已点分割
        var segments = path.split('.');
        return function (obj) {

            for (var i = 0; i < segments.length; i++) {
                //如果没有参数则返回
                if (!obj) {
                    return
                }
                //将对象中的一个key值 赋值给该对象 相当于 obj = obj[segments[segments.length-1]];
                obj = obj[segments[i]];
            }
            //否则返回一个对象
            return obj
        }
    }

    /*  */

// can we use __proto__?
    var hasProto = '__proto__' in {};

// Browser environment sniffing
//判断设备和浏览器
    var inBrowser = typeof window !== 'undefined';

//如果不是浏览器
    var inWeex = typeof WXEnvironment !== 'undefined' && !!WXEnvironment.platform; //weex 环境 一个 vue做app包的框架
    var weexPlatform = inWeex && WXEnvironment.platform.toLowerCase();//weex 环境 一个 vue做app包的框架

//window.navigator.userAgent属性包含了浏览器类型、版本、操作系统类型、浏览器引擎类型等信息，通过这个属性来判断浏览器类型
    var UA = inBrowser && window.navigator.userAgent.toLowerCase(); //获取浏览器
    var isIE = UA && /msie|trident/.test(UA);  //ie
    var isIE9 = UA && UA.indexOf('msie 9.0') > 0;  //ie9
    var isEdge = UA && UA.indexOf('edge/') > 0; //ie10 以上
    var isAndroid = (UA && UA.indexOf('android') > 0) || (weexPlatform === 'android');  //安卓
    var isIOS = (UA && /iphone|ipad|ipod|ios/.test(UA)) || (weexPlatform === 'ios');  //ios
    var isChrome = UA && /chrome\/\d+/.test(UA) && !isEdge; //谷歌浏览器

// Firefox has a "watch" function on Object.prototype...
    var nativeWatch = ({}).watch;

//兼容火狐浏览器写法
    var supportsPassive = false;
    if (inBrowser) {
        try {
            var opts = {};
            Object.defineProperty(opts, 'passive', ({
                get: function get() {
                    /* istanbul ignore next */
                    supportsPassive = true;
                }
            })); // https://github.com/facebook/flow/issues/285
            window.addEventListener('test-passive', null, opts);
        } catch (e) {
        }
    }

// this needs to be lazy-evaled because vue may be required before
// vue-server-renderer can set VUE_ENV
    //vue 服务器渲染 可以设置   VUE_ENV
    var _isServer;
//判断是不是node 服务器环境
    var isServerRendering = function () {
        if (_isServer === undefined) {
            /* istanbul ignore if */
            //如果不是浏览器 并且global 对象存在，那么有可能是node 脚本
            if (!inBrowser && typeof global !== 'undefined') {
                //
                // detect presence of vue-server-renderer and avoid
                // Webpack shimming the process
                //_isServer 设置是服务器渲染
                _isServer = global['process'].env.VUE_ENV === 'server';
            } else {
                _isServer = false;
            }
        }
        return _isServer
    };

// detect devtools
    //检测开发者工具。
    var devtools = inBrowser && window.__VUE_DEVTOOLS_GLOBAL_HOOK__;

    /* istanbul ignore next */
    function isNative(Ctor) {
        //或者判断该函数是不是系统内置函数
        //判断一个函数中是否含有 'native code' 字符串 比如
        //   function code(){
        //       var native='native code'
        //   }
        //   或者
        //   function code(){
        //       var native='native codeasdfsda'
        //   }

        return typeof Ctor === 'function' && /native code/.test(Ctor.toString())
    }

//判断是否支持Symbol 数据类型
    var hasSymbol =
        //Symbol es6新出来的一种数据类型，类似于string类型，声明唯一的数据值
        typeof Symbol !== 'undefined' && isNative(Symbol) &&
        // Reflect.ownKeys
        // Reflect.ownKeys方法用于返回对象的所有属性，基本等同于Object.getOwnPropertyNames与Object.getOwnPropertySymbols之和。
        typeof Reflect !== 'undefined' && isNative(Reflect.ownKeys);

    var _Set;
    /* istanbul ignore if */ // $flow-disable-line
//ES6 提供了新的数据结构 Set。它类似于数组，但是成员的值都是唯一的，没有重复的值。
//     Set 本身是一个构造函数，用来生成 Set 数据结构。
    //判断是否有set这个方法
    if (typeof Set !== 'undefined' && isNative(Set)) {
        // use native Set when available.
        _Set = Set;
    } else {
        // a non-standard Set polyfill that only works with primitive keys.
        //如果没有他自己写一个
        _Set = (function () {
            function Set() {
                this.set = Object.create(null);
            }

            Set.prototype.has = function has(key) {
                return this.set[key] === true
            };
            Set.prototype.add = function add(key) {
                this.set[key] = true;
            };
            Set.prototype.clear = function clear() {
                this.set = Object.create(null);
            };

            return Set;
        }());
    }

    var warn = noop;
    var tip = noop;

    var generateComponentTrace = (noop); // work around flow check 绕流检查
    var formatComponentName = (noop);

    {
        //判断是否有console 打印输出属性
        var hasConsole = typeof console !== 'undefined';

        var classifyRE = /(?:^|[-_])(\w)/g;
//非捕获  匹配不分组 。 就是可以包含，但是不匹配上
        //过滤掉class中的 -_ 符号 并且把字母开头的改成大写
        var classify = function (str) {
            return str.replace(classifyRE,
                function (c) {
                    return c.toUpperCase();
                }).replace(/[-_]/g, '');
        };


        /***********************************************************************************************
         *函数名 ：warn
         *函数功能描述 ：    警告信息提示
         *函数参数 ： msg： 警告信息， vm：vue对象
         *函数返回值 ： void
         *作者 ：
         *函数创建日期 ：
         *函数修改日期 ：
         *修改人 ：
         *修改原因 ：
         *版本 ：
         *历史版本 ：
         ***********************************************************************************************/
        warn = function (msg, vm) {
            //vm 如果没有传进来就给空， 不然给执行generateComponentTrace 收集 vue错误码
            var trace = vm ? generateComponentTrace(vm) : '';
            //warnHandler 如果存在 则调用他
            if (config.warnHandler) {
                config.warnHandler.call(null, msg, vm, trace);
            } else if (hasConsole && (!config.silent)) {
                //如果config.warnHandler 不存在则 console 内置方法打印
                console.error(("[Vue warn]: " + msg + trace));
            }
        };

        //也是个警告输出方法
        tip = function (msg, vm) {

            if (hasConsole && (!config.silent)) {
                //
                console.warn("[Vue tip]: " + msg + (
                        vm ? generateComponentTrace(vm) : ''
                    ));
            }
        };

        /***********************************************************************************************
         *函数名 ：formatComponentName
         *函数功能描述 ：   格式组件名
         *函数参数 ： msg： 警告信息， vm：vue对象
         *函数返回值 ： void
         *作者 ：
         *函数创建日期 ：
         *函数修改日期 ：
         *修改人 ：
         *修改原因 ：
         *版本 ：
         *历史版本 ：
         ***********************************************************************************************/


        formatComponentName = function (vm, includeFile) {

            if (vm.$root === vm) {
                return '<Root>'
            }
            /*
             * 如果 vm === 'function' && vm.cid != null 条件成立 则options等于vm.options
             * 当vm === 'function' && vm.cid != null 条件不成立的时候 vm._isVue ? vm.$options || vm.constructor.options : vm || {};
             *  vm._isVue为真的时候 vm.$options || vm.constructor.options ，vm._isVue为假的时候 vm || {}
             * */
            var options =
                typeof vm === 'function' && vm.cid != null
                    ? vm.options : vm._isVue ? vm.$options || vm.constructor.options : vm || {};

            var name = options.name || options._componentTag;
            console.log('name=' + name);

            var file = options.__file;

            if (!name && file) {
                //匹配.vue 后缀的文件名
                //如果文件名中含有vue的文件将会被匹配出来 但是会多虑掉 \符号
                var match = file.match(/([^/\\]+)\.vue$/);
                name = match && match[1];
            }

            //可能返回 classify(name)
            //name 组件名称或者是文件名称
            /*
             * classify 去掉-_连接  大些字母连接起来
             * 如果name存在则返回name
             * 如果name不存在那么返回‘<Anonymous>’+ 如果file存在并且includeFile！==false的时候 返回" at " + file 否则为空
             *
             * */
            return (
                (name ? ("<" + (classify(name)) + ">") : "<Anonymous>") +
                (file && includeFile !== false ? (" at " + file) : '')
            )
        };

        /*
         *重复 递归 除2次 方法+ str
         * */
        var repeat = function (str, n) {
            var res = '';
            while (n) {
                if (n % 2 === 1) {
                    res += str;
                }
                if (n > 1) {
                    str += str;
                }
                n >>= 1;
                //16 8
                //15 7 相当于除2 向下取整2的倍数
                //console.log(  a >>= 1)
            }
            return res
        };
        /***********************************************************************************************
         *函数名 ：generateComponentTrace
         *函数功能描述 ： 生成组建跟踪 vm=vm.$parent递归收集到msg出处。
         *函数参数 ： vm 组建
         *函数返回值 ：
         *作者 ：
         *函数创建日期 ：
         *函数修改日期 ：
         *修改人 ：
         *修改原因 ：
         *版本 ：
         *历史版本 ：
         ***********************************************************************************************/
        generateComponentTrace = function (vm) {
            if (vm._isVue && vm.$parent) { //如果_isVue 等于真，并且有父亲节点的
                var tree = [];   //记录父节点
                var currentRecursiveSequence = 0;
                while (vm) {  //循环 vm 节点
                    if (tree.length > 0) {//tree如果已经有父节点的
                        var last = tree[tree.length - 1];
                        if (last.constructor === vm.constructor) { //上一个节点等于父节点 个人感觉这里用户不会成立
                            currentRecursiveSequence++;
                            vm = vm.$parent;
                            continue
                        } else if (currentRecursiveSequence > 0) { //这里也不会成立
                            tree[tree.length - 1] = [last, currentRecursiveSequence];
                            currentRecursiveSequence = 0;
                        }
                    }
                    tree.push(vm);  //把vm添加到队列中
                    vm = vm.$parent;
                }
                return '\n\nfound in\n\n' + tree
                        .map(function (vm, i) {
                            //如果i是0 则输出 ‘---->’
                            //如果i 不是0的时候输出组件名称
                            return ("" + (i === 0 ?
                                    '---> ' : repeat(' ', 5 + i * 2)) +
                                (
                                    Array.isArray(vm) ?
                                        ((formatComponentName(vm[0])) + "... (" + (vm[1]) + " recursive calls)")
                                        : formatComponentName(vm)
                                )
                            );
                        })
                        .join('\n')
            } else {
                //如果没有父组件则输出一个组件名称
                return ("\n\n(found in " + (formatComponentName(vm)) + ")")
            }
        };


    }

    /*  */

    /*  */


    var uid = 0;

    /**
     * A dep is an observable that can have multiple dep是可观察到的，可以有多个
     * directives subscribing to it.订阅它的指令。
     *
     */
        //主题对象Dep构造函数  主要用于添加发布事件后，用户更新数据的 响应式原理之一函数
    var Dep = function Dep() {
            //uid  初始化为0
            this.id = uid++;
            /* 用来存放Watcher对象的数组 */
            this.subs = [];
        };

    Dep.prototype.addSub = function addSub(sub) {
        /* 在subs中添加一个Watcher对象 */
        this.subs.push(sub);
    };

    Dep.prototype.removeSub = function removeSub(sub) {
        /*删除 在subs中添加一个Watcher对象 */
        remove(this.subs, sub);
    };
    //this$1.deps[i].depend();
    //为Watcher 添加 为Watcher.newDeps.push(dep); 一个dep对象
    Dep.prototype.depend = function depend() {
        //添加一个dep    target 是Watcher dep就是dep对象
        if (Dep.target) {
            //像指令添加依赖项
            Dep.target.addDep(this);
        }
    };
    /* 通知所有Watcher对象更新视图 */
    Dep.prototype.notify = function notify() {
        // stabilize the subscriber list first
        var subs = this.subs.slice();
        for (var i = 0, l = subs.length; i < l; i++) {
            //更新数据
            subs[i].update();
        }
    };

// the current target watcher being evaluated.
// this is globally unique because there could be only one
// watcher being evaluated at any time.
//当前正在评估的目标监视程序。
//这在全球是独一无二的，因为只有一个
//观察者在任何时候都被评估。
    Dep.target = null;
    var targetStack = [];

    function pushTarget(_target) {
        //target 是Watcher dep就是dep对象
        if (Dep.target) { //静态标志 Dep当前是否有添加了target
            //添加一个pushTarget
            targetStack.push(Dep.target);
        }
        Dep.target = _target;
    }

    //
    function popTarget() {
        // 出盏一个pushTarget
        Dep.target = targetStack.pop();
    }

    /*
     * 创建标准的vue vnode
     *
     * */

    var VNode = function VNode(
                               tag, /*当前节点的标签名*/
                               data, /*当前节点对应的对象，包含了具体的一些数据信息，是一个VNodeData类型，可以参考VNodeData类型中的数据信息*/
                               children, //子节点
                               text, //文本
                               elm, /*当前节点的dom */
                               context, /*编译作用域*/
                               componentOptions, /*组件的option选项*/
                               asyncFactory/*异步工厂*/) {
        /*当前节点的标签名*/
        this.tag = tag;

        /*当前节点对应的对象，包含了具体的一些数据信息，是一个VNodeData类型，可以参考VNodeData类型中的数据信息*/
        this.data = data;

        /*当前节点的子节点，是一个数组*/
        this.children = children;

        /*当前节点的文本*/
        this.text = text;

        /*当前虚拟节点对应的真实dom节点*/
        this.elm = elm;

        /*当前节点的名字空间*/
        this.ns = undefined;

        /*编译作用域 vm*/
        this.context = context;

        this.fnContext = undefined;
        this.fnOptions = undefined;
        this.fnScopeId = undefined;

        /*节点的key属性，被当作节点的标志，用以优化*/
        this.key = data && data.key;

        /*组件的option选项*/
        this.componentOptions = componentOptions;

        /*当前节点对应的组件的实例*/
        this.componentInstance = undefined;

        /*当前节点的父节点*/
        this.parent = undefined;

        /*简而言之就是是否为原生HTML或只是普通文本，innerHTML的时候为true，textContent的时候为false*/
        this.raw = false;

        /*静态节点标志*/
        this.isStatic = false;

        /*是否作为跟节点插入*/
        this.isRootInsert = true;

        /*是否为注释节点*/
        this.isComment = false;

        /*是否为克隆节点*/
        this.isCloned = false;

        /*是否有v-once指令*/
        this.isOnce = false;

        /*异步工厂*/
        this.asyncFactory = asyncFactory;

        this.asyncMeta = undefined;
        this.isAsyncPlaceholder = false;
    };
    //当且仅当该属性描述符的类型可以被改变并且该属性可以从对应对象中删除。默认为 false
    var prototypeAccessors = {child: {configurable: true}};

// DEPRECATED: alias for componentInstance for backwards compat.
    /* istanbul ignore next */

    prototypeAccessors.child.get = function () {
        return this.componentInstance
    };
    /*设置所有VNode.prototype 属性方法  都为
     {
     'child':{
     configurable: true,
     get:function(){
     return this.componentInstance
     }
     }
     }
     */
    Object.defineProperties(VNode.prototype, prototypeAccessors);

    //创建一个节点    空的vnode
    var createEmptyVNode = function (text) {
        if (text === void 0) text = '';

        var node = new VNode();
        node.text = text;
        node.isComment = true;
        return node
    };

    //创建一个文本节点
    function createTextVNode(val) {

        return new VNode(
            undefined,
            undefined,
            undefined,
            String(val)
        )
    }

// optimized shallow clone
// used for static nodes and slot nodes because they may be reused across
// multiple renders, cloning them avoids errors when DOM manipulations rely
// on their elm reference.
//优化浅克隆
//用于静态节点和时隙节点，因为它们可以被重用。
//多重渲染，克隆它们避免DOM操作依赖时的错误
//他们的榆树参考。

    //克隆节点  把节点变成静态节点
    function cloneVNode(vnode, deep) {
        //
        var componentOptions = vnode.componentOptions;
        /*组件的option选项*/
        var cloned = new VNode(
            vnode.tag,
            vnode.data,
            vnode.children,
            vnode.text,
            vnode.elm,
            vnode.context,
            componentOptions,
            vnode.asyncFactory
        );
        cloned.ns = vnode.ns;/*当前节点的名字空间*/
        cloned.isStatic = vnode.isStatic;/*静态节点标志*/
        cloned.key = vnode.key;/*节点的key属性，被当作节点的标志，用以优化*/
        cloned.isComment = vnode.isComment;/*是否为注释节点*/
        cloned.fnContext = vnode.fnContext; //函数上下文
        cloned.fnOptions = vnode.fnOptions; //函数Options选项
        cloned.fnScopeId = vnode.fnScopeId; //函数范围id
        cloned.isCloned = true;
        /*是否为克隆节点*/
        if (deep) { //如果deep存在
            if (vnode.children) { //如果有子节点
                //深度拷贝子节点
                cloned.children = cloneVNodes(vnode.children, true);
            }
            if (componentOptions && componentOptions.children) {
                //深度拷贝子节点
                componentOptions.children = cloneVNodes(componentOptions.children, true);
            }
        }
        return cloned
    }

    //克隆多个节点 为数组的
    function cloneVNodes(vnodes, deep) {
        var len = vnodes.length;
        var res = new Array(len);
        for (var i = 0; i < len; i++) {
            res[i] = cloneVNode(vnodes[i], deep);
        }
        return res
    }


    /*
     * not type checking this file because flow doesn't play well with
     * dynamically accessing methods on Array prototype
     */

    var arrayProto = Array.prototype;
    var arrayMethods = Object.create(arrayProto);

    var methodsToPatch = [
        'push',
        'pop',
        'shift',
        'unshift',
        'splice',
        'sort',
        'reverse'
    ];

    /**
     * Intercept mutating methods and emit events
     */
    /***********************************************************************************************
     *函数名 ：methodsToPatch
     *函数功能描述 ： 更新数据时候如果是数组拦截方法，如果在数据中更新用的是'push','pop','shift','unshift','splice','sort','reverse' 方法则会调用这里
     *函数参数 ：
     *函数返回值 ：
     *作者 ：
     *函数创建日期 ：
     *函数修改日期 ：
     *修改人 ：
     *修改原因 ：
     *版本 ：
     *历史版本 ：
     ***********************************************************************************************/


    methodsToPatch.forEach(function (method) {
        console.log('methodsToPatch')

        // cache original method
        var original = arrayProto[method];
        console.log('==method==')
        console.log(method)
        console.log('==original==')
        console.log(original)

        def(arrayMethods, method, function mutator() {
            console.log('==def_original==')
            console.log(original)

            var args = [], len = arguments.length;
            while (len--) args[len] = arguments[len];

            var result = original.apply(this, args);
            var ob = this.__ob__;
            console.log('this.__ob__')
            console.log(this.__ob__)


            var inserted;
            switch (method) {
                case 'push':
                case 'unshift':
                    inserted = args;
                    break
                case 'splice':
                    inserted = args.slice(2);
                    break
            }
            if (inserted) {
                //观察数组数据
                ob.observeArray(inserted);
            }
            // notify change
            //更新通知
            ob.dep.notify();
            console.log('====result====')
            console.log(result)
            return result
        });
    });

    /*  */
    // 方法返回一个由指定对象的所有自身属性的属性名（包括不可枚举属性但不包括Symbol值作为名称的属性）组成的数组,只包括实例化的属性和方法，不包括原型上的。
    var arrayKeys = Object.getOwnPropertyNames(arrayMethods);


    /**
     * In some cases we may want to disable observation inside a component's
     * update computation.
     *在某些情况下，我们可能希望禁用组件内部的观察。
     *更新计算。
     */
    var shouldObserve = true; //标志是否禁止还是添加到观察者模式
    function toggleObserving(value) {
        shouldObserve = value;
    }

    /**
     * Observer class that is attached to each observed
     * object. Once attached, the observer converts the target
     * object's property keys into getter/setters that
     * collect dependencies and dispatch updates.
     * *每个观察到的观察者类
     *对象。一旦被连接，观察者就转换目标。
     *对象的属性键为吸收器/设置器
     *收集依赖关系并发送更新。
     *
     * 实例化 dep对象,获取dep对象  为 value添加__ob__ 属性
     */
    var Observer = function Observer(value) {


        this.value = value;
        this.dep = new Dep();
        this.vmCount = 0;
        //设置监听 value 必须是对象
        def(value, '__ob__', this);
        if (Array.isArray(value)) { //判断是不是数组
            var augment = hasProto  //__proto__ 存在么 高级浏览器都会有这个
                ? protoAugment
                : copyAugment;
            augment(value, arrayMethods, arrayKeys);
            this.observeArray(value);
        } else {
            this.walk(value);
        }
    };

    /**
     * Walk through each property and convert them into
     * getter/setters. This method should only be called when
     * value type is Object.
     * *遍历每个属性并将其转换为
     * getter / setter。此方法只应在调用时调用
     *值类型是Object。
     */
    Observer.prototype.walk = function walk(obj) {
        var keys = Object.keys(obj);
        for (var i = 0; i < keys.length; i++) {
            defineReactive(obj, keys[i]);
        }
    };

    /**
     * Observe a list of Array items.
     * 观察数组项的列表。
     * 把数组拆分一个个 添加到观察者 上面去
     */
    Observer.prototype.observeArray = function observeArray(items) {
        for (var i = 0, l = items.length; i < l; i++) {
            console.log('items[i]')
            console.log(items[i])

            observe(items[i]);
        }
    };

// helpers

    /**
     * Augment an target Object or Array by intercepting
     * the prototype chain using __proto__
     * 通过拦截来增强目标对象或数组
     * 使用原型原型链
     * target 目标对象
     * src 原型 对象或者属性、
     * keys key
     *
     */
    function protoAugment(target, src, keys) {
        /* eslint-disable no-proto */
        target.__proto__ = src;
        /* eslint-enable no-proto */
    }

    /**
     * Augment an target Object or Array by defining
     * hidden properties.
     * 复制扩充
     * 定义添加属性 并且添加 监听
     *target 目标对象
     * src对象
     * keys 数组keys
     */
    /* istanbul ignore next */
    function copyAugment(target, src, keys) {
        for (var i = 0, l = keys.length; i < l; i++) {
            var key = keys[i];
            def(target, key, src[key]);
        }
    }

    /**
     * Attempt to create an observer instance for a value,
     * returns the new observer if successfully observed,
     * or the existing observer if the value already has one.
     *尝试为值创建一个观察者实例，
     *如果成功观察，返回新的观察者；
     *或现有的观察员，如果值已经有一个。
     *
     * 判断value 是否有__ob__    实例化 dep对象,获取dep对象  为 value添加__ob__ 属性  返回 new Observer 实例化的对象
     */
    function observe(value, asRootData) {

        if (!isObject(value) || value instanceof VNode) {
            //value 不是一个对象 或者 实例化 的VNode
            console.log(value)

            return
        }
        var ob;

        if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
            console.log('hasOwn value')
            console.log(value)


            ob = value.__ob__;
        } else if (
            shouldObserve &&  //shouldObserve 为真
            !isServerRendering() &&  //并且不是在服务器node环境下
            (Array.isArray(value) || isPlainObject(value)) && //是数组或者是对象
            Object.isExtensible(value) && //Object.preventExtensions(O) 方法用于锁住对象属性，使其不能够拓展，也就是不能增加新的属性，但是属性的值仍然可以更改，也可以把属性删除，Object.isExtensible用于判断对象是否可以被拓展
            !value._isVue //_isVue为假
        ) {
            console.log('new Observer value')
            console.log(value)
            //实例化 dep对象 为 value添加__ob__ 属性
            ob = new Observer(value);
        }
        console.log(value)
        //如果是RootData，即咱们在新建Vue实例时，传到data里的值，只有RootData在每次observe的时候，会进行计数。 vmCount是用来记录此Vue实例被使用的次数的， 比如，我们有一个组件logo，页面头部和尾部都需要展示logo，都用了这个组件，那么这个时候vmCount就会计数，值为2

        if (asRootData && ob) { //是根节点数据的话 并且 ob 存在
            ob.vmCount++; //统计有几个vm
        }
        //    * 实例化 dep对象,获取dep对象  为 value添加__ob__ 属性
        return ob
    }

    /**
     * Define a reactive property on an Object.
     * 在对象上定义一个无功属性。
     * 更新数据
     * 通过defineProperty的set方法去通知notify()订阅者subscribers有新的值修改
     * 添加观察者 get set方法
     */
    function defineReactive(obj, //对象
                            key,//对象的key
                            val, //监听的数据 返回的数据
                            customSetter, //  日志函数
                            shallow //是否要添加__ob__ 属性
    ) {
        //实例化一个主题对象，对象中有空的观察者列表
        var dep = new Dep();
        //获取描述属性
        var property = Object.getOwnPropertyDescriptor(obj, key);
        var _property = Object.getOwnPropertyNames(obj); //获取实力对象属性或者方法，包括定义的描述属性
        console.log(property);
        console.log(_property);

        if (property && property.configurable === false) {
            return
        }

        // cater for pre-defined getter/setters

        var getter = property && property.get;
        console.log('arguments.length=' + arguments.length)

        if (!getter && arguments.length === 2) {
            val = obj[key];
        }
        var setter = property && property.set;
        console.log(val)
        //判断value 是否有__ob__    实例化 dep对象,获取dep对象  为 value添加__ob__ 属性递归把val添加到观察者中  返回 new Observer 实例化的对象
        var childOb = !shallow && observe(val);
        //定义描述
        Object.defineProperty(obj, key, {
            enumerable: true,
            configurable: true,
            get: function reactiveGetter() {

                var value = getter ? getter.call(obj) : val;
                if (Dep.target) {  //Dep.target 静态标志 标志了Dep添加了Watcher 实例化的对象
                    //添加一个dep
                    dep.depend();
                    if (childOb) {  //如果子节点存在也添加一个dep
                        childOb.dep.depend();
                        if (Array.isArray(value)) {  //判断是否是数组 如果是数组
                            dependArray(value);   //则数组也添加dep
                        }
                    }
                }
                return value
            },
            set: function reactiveSetter(newVal) {
                var value = getter ? getter.call(obj) : val;
                /* eslint-disable no-self-compare  新旧值比较 如果是一样则不执行了*/
                if (newVal === value || (newVal !== newVal && value !== value)) {
                    return
                }
                /* eslint-enable no-self-compare
                 *   不是生产环境的情况下
                 * */
                if ("development" !== 'production' && customSetter) {
                    customSetter();
                }
                if (setter) {
                    //set 方法 设置新的值
                    setter.call(obj, newVal);
                } else {
                    //新的值直接给他
                    val = newVal;
                }
                console.log(newVal)

                //observe 添加 观察者
                childOb = !shallow && observe(newVal);
                //更新数据
                dep.notify();
            }
        });
    }

    /**
     * Set a property on an object. Adds the new property and
     * triggers change notification if the property doesn't
     * already exist.
     **在对象上设置属性。添加新属性和
     *触发器更改通知，如果该属性不
     *已经存在。
     */
    //如果是数组  并且key是数字 就更新数组
    //如果是对象则重新赋值
    //如果 (target).__ob__ 存在则表明该数据以前添加过观察者对象中  //通知订阅者ob.value更新数据 添加观察者  define  set get 方法
    function set(target, key, val) {
        if ("development" !== 'production' &&
            //判断数据 是否是undefined或者null
            (isUndef(target) || isPrimitive(target))   //判断数据类型是否是string，number，symbol，boolean
        ) {
            //必须是对象数组才可以 否则发出警告
            warn(("Cannot set reactive property on undefined, null, or primitive value: " + ((target))));
        }

        //如果是数组  并且key是数字
        if (Array.isArray(target) && isValidArrayIndex(key)) {
            //设置数组的长度
            target.length = Math.max(target.length, key);
            //像数组尾部添加一个新数据，相当于push
            target.splice(key, 1, val);
            return val
        }
        //判断key是否在target 上，并且不是在Object.prototype 原型上，而不是通过父层原型链查找的
        if (key in target && !(key in Object.prototype)) {
            target[key] = val;  //赋值
            return val
        }
        var ob = (target).__ob__;  //声明一个对象ob 值为该target对象中的原型上面的所有方法和属性 ，表明该数据加入过观察者中
        //vmCount 记录vue被实例化的次数
        //是不是vue
        if (target._isVue || (ob && ob.vmCount)) {
            //如果不是生产环境，发出警告
            "development" !== 'production' && warn(
                'Avoid adding reactive properties to a Vue instance or its root $data ' +
                'at runtime - declare it upfront in the data option.'
            );
            return val
        }
        //如果ob不存在 说明他没有添加观察者 则直接赋值
        if (!ob) {
            target[key] = val;
            return val
        }
        //通知订阅者ob.value更新数据 添加观察者  define  set get 方法
        defineReactive(ob.value, key, val);
        //通知订阅者ob.value更新数据
        ob.dep.notify();
        return val
    }

    /**
     * Delete a property and trigger change if necessary.
     * 删除属性并在必要时触发更改数据。
     */
    function del(target, key) {
        //如果不是生产环境

        if ("development" !== 'production' &&
            (isUndef(target) || isPrimitive(target))
        ) {
            //无法删除未定义的、空的或原始值的无功属性：
            warn(("Cannot delete reactive property on undefined, null, or primitive value: " + ((target))));
        }

        //如果是数据则用splice方法删除
        if (Array.isArray(target) && isValidArrayIndex(key)) {
            target.splice(key, 1);
            return
        }


        var ob = (target).__ob__;
        //vmCount 记录vue被实例化的次数
        //是不是vue
        if (target._isVue || (ob && ob.vmCount)) {
            //如果是开发环境就警告
            "development" !== 'production' && warn(
                'Avoid deleting properties on a Vue instance or its root $data ' +
                '- just set it to null.'
            );
            return
        }
        //如果不是target 实例化不删除原型方法
        if (!hasOwn(target, key)) {
            return
        }
        //删除对象中的属性或者方法
        delete target[key];
        if (!ob) {
            return
        }
        //更新数据
        ob.dep.notify();
    }

    /**
     * Collect dependencies on array elements when the array is touched, since
     * we cannot intercept array element access like property getters.
     * 在数组被触摸时收集数组元素的依赖关系，因为
     * 我们不能拦截数组元素访问，如属性吸收器。
     * 参数是数组
     */
    function dependArray(value) {
        for (var e = (void 0), i = 0, l = value.length; i < l; i++) {
            e = value[i];
            //添加一个dep
            e && e.__ob__ && e.__ob__.dep.depend();
            //递归
            if (Array.isArray(e)) {
                dependArray(e);
            }
        }
    }

    /*  */

    /**
     * Option overwriting strategies are functions that handle
     * how to merge a parent option value and a child option
     * value into the final value.
     * *选项重写策略是处理的函数

     *如何合并父选项值和子选项

     *值为最终值。
     */
        //选择策略
    var strats = config.optionMergeStrategies;

    /**
     * Options with restrictions
     * 选择与限制
     */
    {
        strats.el = strats.propsData = function (parent, child, vm, key) {
            if (!vm) {
                warn(
                    "option \"" + key + "\" can only be used during instance " +
                    'creation with the `new` keyword.'
                );
            }
            //默认开始
            return defaultStrat(parent, child)
        };
    }

    /**
     * Helper that recursively merges two data objects together.
     * 递归合并数据 深度拷贝
     */
    function mergeData(to, from) {
        if (!from) {
            return to
        }
        var key, toVal, fromVal;
        var keys = Object.keys(from); //获取对象的keys 变成数组
        for (var i = 0; i < keys.length; i++) {
            key = keys[i]; //获取对象的key
            toVal = to[key]; //
            fromVal = from[key]; //获取对象的值
            if (!hasOwn(to, key)) { //如果from对象的key在to对象中没有
                set(to, key, fromVal);
            } else if (isPlainObject(toVal) && isPlainObject(fromVal)) {
                //深层递归
                mergeData(toVal, fromVal);
            }
        }
        return to
    }

    /**
     * Data
     * mergeDataOrFn递归合并数据 深度拷贝。如果vm不存在，并且childVal不存在就返回parentVal。如果vm不存在并且parentVal不存在则返回childVal。如果vm不存在parentVal和childVal都存在则返回mergedDataFn。如果vm存在则返回 mergedInstanceDataFn函数
     */
    function mergeDataOrFn(
                           parentVal,
                           childVal,
                           vm
                                ) {
                                    //vm不存在的时候
                                    if (!vm) {
                                                        // in a Vue.extend merge, both should be functions Vue。扩展合并，两者都应该是函数
                                                        if (!childVal) {
                                                            return parentVal
                                                        }
                                                        if (!parentVal) {
                                                            return childVal
                                                        }
                                                        // when parentVal & childVal are both present,
                                                        // we need to return a function that returns the
                                                        // merged result of both functions... no need to
                                                        // check if parentVal is a function here because
                                                        // it has to be a function to pass previous merges.
                                                    //当父母和孩子都在场时，
                                                    //我们需要返回一个函数，该函数返回
                                                    //两个函数的合并结果…不需要
                                                    //检查parentVal是否是一个函数，因为
                                                    //它必须是一个函数来传递以前的合并。
                                                        return function mergedDataFn() {
                                                                    //如果childVal，parentVal是函数 先改变this
                                                                    return mergeData(
                                                                        typeof childVal === 'function' ? childVal.call(this, this) : childVal,
                                                                        typeof parentVal === 'function' ? parentVal.call(this, this) : parentVal
                                                                    )
                                                        }
                                    } else {
                                                        //如果vm 存在 则是合并vm的数据
                                                        return function mergedInstanceDataFn() {
                                                                        // instance merge
                                                                        var instanceData = typeof childVal === 'function'
                                                                            ? childVal.call(vm, vm)
                                                                            : childVal;

                                                                        var defaultData = typeof parentVal === 'function'
                                                                            ? parentVal.call(vm, vm)
                                                                            : parentVal;

                                                                        if (instanceData) {
                                                                            return mergeData(instanceData, defaultData)
                                                                        } else {
                                                                            return defaultData
                                                                        }
                                                        }
                                    }
    }

    strats.data = function (
                            parentVal,
                            childVal,
                            vm
                                 ) {
                                if (!vm) {
                                    if (childVal && typeof childVal !== 'function') {
                                        "development" !== 'production' && warn(
                                            'The "data" option should be a function ' +
                                            'that returns a per-instance value in component ' +
                                            'definitions.',
                                            vm
                                        );

                                        return parentVal
                                    }
                                    return mergeDataOrFn(parentVal, childVal)
                                }

                       return mergeDataOrFn(parentVal, childVal, vm)
    };

    /**
     * Hooks and props are merged as arrays.
     * 钩子和道具被合并成数组。
     * 判断childVal存在么？如果不存在 则返回parentVal
     * 如果childVal存在 则判断parentVal存在么。如果parentVal存在则返回 parentVal.concat(childVal)，如果不存在，则判断childVal是不是数组如果是数组直接返回去，
     * 如果不是数组把childVal变成数组在返回出去
     */
    function mergeHook(
                        parentVal,
                        childVal
                        ) {
                            return childVal ? (parentVal ?
                                                             parentVal.concat(childVal) :
                                                             (Array.isArray(childVal) ?
                                                                                       childVal :
                                                                                       [childVal]
                                                              )
                                               ):parentVal
                        }

    LIFECYCLE_HOOKS.forEach(function (hook) {
        strats[hook] = mergeHook;
    });

    /**
     * Assets
     *
     * When a vm is present (instance creation), we need to do
     * a three-way merge between constructor options, instance
     * options and parent options.
     *
     ＊资产
     *当存在虚拟机（实例创建）时，我们需要做
     *构造函数选项之间的三路合并，实例
     *选项和父选项。
     * 创建一个res对象，获取parentVal对象中的数据。如果parentVal存在则获取parentVal对象 的数据存在res中的  __props__ 中，如果没有则创建一个空的对象。
     * 如果childVal 存在，则用浅拷贝吧 childVal 合并到res中，返回res对象
     */
    function mergeAssets(
                          parentVal,
                         childVal,
                         vm,
                         key
                      ) {
        var res = Object.create(parentVal || null);
        if (childVal) {
            "development" !== 'production' && assertObjectType(key, childVal, vm);
            return extend(res, childVal)
        } else {
            return res
        }
    }

    //为每一个组件指令添加一个
    ASSET_TYPES.forEach(function (type) {
        strats[type + 's'] = mergeAssets;
    });

    /**
     * Watchers.
     *
     * Watchers hashes should not overwrite one
     * another, so we merge them as arrays.
     * *观察者散列不应该覆盖一个
     *另一个，所以我们将它们合并为数组。
     *
     * 循环childVal。获取到子节点childVal的key如果在父亲节点上面有，则先获取到父亲节点的值，如果父亲节点的上没有值得获取子节点的值。 变成数组存在ret对象中。
     */
    strats.watch = function (
                            parentVal,   //父节点值
                             childVal,  //子节点值
                             vm,   //vm  vue实例化的对象
                             key) {  // key值
        // work around Firefox's Object.prototype.watch... 在Firefox的对象周围工作。原型
        //// Firefox has a "watch" function on Object.prototype...
        //var nativeWatch = ({}).watch;
        if (parentVal === nativeWatch) {
            parentVal = undefined;
        }
        if (childVal === nativeWatch) {
            childVal = undefined;
        }
        /* istanbul ignore if */
        if (!childVal) {  //如果子节点不存在 则创建一个 对象
            return Object.create(parentVal || null)
        }
        {
            //检测childVal是不是对象
            assertObjectType(key, childVal, vm);
        }
        if (!parentVal) {  //如果父节点不存在 则返回子节点
            return childVal
        }
        var ret = {};
        extend(ret, parentVal); //合并对象 一个新的对象
        for (var key$1 in childVal) { //循环子节点
            var parent = ret[key$1]; // 把子节点的kye放到父节点中
            var child = childVal[key$1]; //获取子节点的值
            if (parent && !Array.isArray(parent)) {  //如果子节点的key放到父节点中能获取到子节点 ，并且子节点不是一个数组
                parent = [parent];  //
            }
            ret[key$1] = parent ? parent.concat(child)
                                                       : Array.isArray(child) ?
                                                                                child :
                                                                                [child];
        }
        return ret
    };

    /**
     * Other object hashes.
     */
    strats.props =
        strats.methods =
            strats.inject =
                strats.computed = function (
                                            parentVal,
                                            childVal,
                                            vm,
                                            key
                                            ) {
                                                        if (childVal && "development" !== 'production') {
                                                            //判断是否是对象
                                                            assertObjectType(key, childVal, vm);
                                                        }
                                                        if (!parentVal) {
                                                            return childVal
                                                        }
                                                        var ret = Object.create(null);
                                                          //对象浅拷贝，参数（to, _from）循环_from的值，会覆盖掉to的值
                                                        extend(ret, parentVal);
                                                        if (childVal) {
                                                            //对象浅拷贝，参数（to, _from）循环_from的值，会覆盖掉to的值
                                                            extend(ret, childVal);
                                                        }
                                                        return ret
                                            };
    strats.provide = mergeDataOrFn;

    /**
     * Default strategy.
     * 如果没有子节点就返回父节点，如果有子节点就返回子节点
     */
    var defaultStrat = function (parentVal, childVal) {
        return childVal === undefined ? parentVal : childVal
    };

    /**
     * Validate component names
     *验证组件名称
     */
    function checkComponents(options) {
        for (var key in options.components) {
           // 验证组件名称 必须是大小写，并且是-横杆
            validateComponentName(key);
        }
    }

    //验证组件名称 必须是大小写，并且是-横杆
    function validateComponentName(name) {
        if (!/^[a-zA-Z][\w-]*$/.test(name)) {
            warn(
                'Invalid component name: "' + name + '". Component names ' +
                'can only contain alphanumeric characters and the hyphen, ' +
                'and must start with a letter.'
            );
        }
        if (isBuiltInTag(name) || config.isReservedTag(name)) {
            warn(
                'Do not use built-in or reserved HTML elements as component ' +
                'id: ' + name
            );
        }
    }

    /**
     * Ensure all props option syntax are normalized into the
     * 确保所有props选项语法都规范化为
     * Object-based format.
     * 基于对象格式
     *
     * 检查 props 数据类型
     * normalizeProps 检查 props 数据类型，并把type标志打上。如果是数组循环props属性数组，如果val是string则把它变成驼峰写法  res[name] = {type: null}; 。如果是对象也循环props把key变成驼峰，并且判断val是不是对象如果是对象则    res[name] 是{type: val}否则    res[name] 是val。
     *
     */
    function normalizeProps(options, vm) {
        //参数中有没有props
        var props = options.props;
        if (!props) {
            return
        }
        var res = {};
        var i, val, name;

        //如果props 是一个数组
        if (Array.isArray(props)) {
            i = props.length;
            while (i--) {
                val = props[i];
                if (typeof val === 'string') {
                    //把含有横岗的字符串 变成驼峰写法
                    name = camelize(val);

                    res[name] = {type: null};
                } else {
                    //当使用数组语法时，道具必须是字符串。 如果是props 是数组必须是字符串
                    warn('props must be strings when using array syntax.');
                }
            }
        } else if (isPlainObject(props)) { //如果是对象
            for (var key in props) {  //for in 提取值
                val = props[key];
                name = camelize(key);   //把含有横岗的字符串 变成驼峰写法
                res[name] = isPlainObject(val)  //判断值是不是对象
                    ? val
                    : {type: val};
            }
        } else {
            //如果不是对象和数组则警告
            warn(
                "Invalid value for option \"props\": expected an Array or an Object, " +
                "but got " + (toRawType(props)) + ".",
                vm
            );
        }
        options.props = res;
    }

    /**
     * Normalize all injections into Object-based format
     * 将所有注入规范化为基于对象的格式
     *
     *
     * 将数组转化成对象 比如 [1,2,3]转化成
     * normalized[1]={from: 1}
     * normalized[2]={from: 2}
     * normalized[3]={from: 3}
     *
     *
     * *
     */
    function normalizeInject(options, vm) {
 //  provide 和 inject 主要为高阶插件/组件库提供用例。并不推荐直接用于应用程序代码中。
 // 这对选项需要一起使用，以允许一个祖先组件向其所有子孙后代注入一个依赖，不论组件层次有多深，并在起上下游关系成立的时间里始终生效。如果你熟悉 React，这与 React 的上下文特性很相似。

        var inject = options.inject;
        if (!inject) {
            return
        }
        var normalized = options.inject = {};
        if (Array.isArray(inject)) { //如果是数组
            for (var i = 0; i < inject.length; i++) {
            // * 将数组转化成对象 比如 [1,2,3]转化成
            // * normalized[1]={from: 1}
            // * normalized[2]={from: 2}
            // * normalized[3]={from: 3}
                normalized[inject[i]] = {from: inject[i]};
            }
        } else if (isPlainObject(inject)) { //如果是对象
            for (var key in inject) {
                var val = inject[key];
                normalized[key] = isPlainObject(val) ? extend({from: key}, val) : {from: val};
            }
        } else {
            warn(
                "Invalid value for option \"inject\": expected an Array or an Object, " +
                "but got " + (toRawType(inject)) + ".",
                vm
            );
        }
    }

    /**
     * Normalize raw function directives into object format.
     *
     * 将原始函数指令归一化为对象格式。
     *
     *
     * normalizeDirectives获取到指令对象值。循环对象指令的值，如果是函数则把它变成dirs[key] = {bind: def, update: def} 这种形式
     */
    function normalizeDirectives(options) {
        //获取参数中的指令
        var dirs = options.directives;
        console.log(options)

        if (dirs) { //如果指令存在
            for (var key in dirs) {  //循环该指令
                var def = dirs[key];  //获取到指令的值
                console.log(def)

                if (typeof def === 'function') { //如果是函数
                    //为该函数添加一个对象和值
                    dirs[key] = {bind: def, update: def};
                }
            }
        }
    }

    //判断是否是对象
    function assertObjectType(name, value, vm) {
        if (!isPlainObject(value)) {
            warn(
                "Invalid value for option \"" + name + "\": expected an Object, " +
                "but got " + (toRawType(value)) + ".",
                vm
            );
        }
    }

    /**
     * Merge two option objects into a new one.
     * Core utility used in both instantiation and inheritance.
     * 将两个对象合成一个对象 将父值对象和子值对象合并在一起，并且优先取值子值，如果没有则取子值
     *
     * 用于实例化和继承的核心实用程序。
     */
    function mergeOptions(parent, //父值
                          child, //子值 优选取子值
                          vm) {

        {
            //检验子组件
            checkComponents(child);
        }

        if (typeof child === 'function') {
            //如果child 是函数则获取他的参数
            child = child.options;
        }
        //检查 props 数据类型
        normalizeProps(child, vm);

        // 将数组转化成对象 比如 [1,2,3]转化成
        normalizeInject(child, vm);

       // * normalizeDirectives获取到指令对象值。循环对象指令的值，如果是函数则把它变成dirs[key] = {bind: def, update: def} 这种形式
        normalizeDirectives(child);

        //子组件是否有需要合并的对象继承 方式
        var extendsFrom = child.extends;

        if (extendsFrom) {
            //如果有则递归
            parent = mergeOptions(parent, extendsFrom, vm);
        }

        //如果 子组件有mixins 数组 则也递归合并，继承 方式 mixins 必须是数组
        if (child.mixins) {
            for (var i = 0, l = child.mixins.length; i < l; i++) {
                parent = mergeOptions(parent, child.mixins[i], vm);
            }
        }
        var options = {};
        var key;
        for (key in parent) {  //循环合并后的key
            mergeField(key);
        }
        for (key in child) {  //循环子组件的
            if (!hasOwn(parent, key)) {
                mergeField(key);
            }
        }

        //获取到key 去读取strats类的方法
        // strats类 有方法 el，propsData，data，provide，watch，props，methods，inject，computed，components，directives，filters 。
        // strats类里面的方法都是  合并数据 如果没有子节点childVal，
        // 就返回父节点parentVal，如果有子节点childVal就返回子节点childVal。
        function mergeField(key) {
            //defaultStrat 获取子值还是父组的值
            var strat =strats[key] ||  //
                                       defaultStrat;  //* 如果没有子节点就返回父节点，如果有子节点就返回子节点
            //获取子值还是父组的值
            options[key] = strat(parent[key], child[key], vm, key);
        }

        //返回参数
        return options
    }

    /**
     * Resolve an asset.
     * This function is used because child instances need access
     * to assets defined in its ancestor chain.
     *  检测指令是否在 组件对象上面 ,返回注册指令或者组建的对象, 包括检查directives ， filters ，components
     *
     */
    function resolveAsset(options, //参数
                          type, // 类型：directives ， filters ，components
                          id,   // 指令的key 属性
                          warnMissing //警告的信息 true
    ) {
        console.log('==resolveAsset==')
        console.log(options)
        console.log(type)
        console.log(id)
        console.log(warnMissing)



        /* istanbul ignore if  如果id不是字符串 */
        if (typeof id !== 'string') {
            return
        }
        var assets = options[type]; //
        console.log('==assets==')
        console.log(assets)

        // check local registration variations first
        //首先检查本地注册的变化 检查id是否是assets 实例化的属性或者方法
        if (hasOwn(assets, id)) {
            return assets[id]
        }
        //   可以让这样的的属性 v-model 变成 vModel  变成驼峰
        var camelizedId = camelize(id);

        console.log('==camelizedId==')
        console.log(camelizedId)

        // 检查camelizedId是否是assets 实例化的属性或者方法
        if (hasOwn(assets, camelizedId)) {
            return assets[camelizedId]
        }
        console.log('==assets==')
        console.log(assets)

        //    将首字母变成大写 变成 VModel
        var PascalCaseId = capitalize(camelizedId);
        console.log('==PascalCaseId==')
        console.log(PascalCaseId)
        // 检查PascalCaseId是否是assets 实例化的属性或者方法
        if (hasOwn(assets, PascalCaseId)) {
            return assets[PascalCaseId]
        }
        console.log('==assets==')
        console.log(assets)

        console.log('==id-camelizedId-PascalCaseId==')
        console.log(assets)
        console.log(assets[id])
        console.log(assets[camelizedId])
        console.log(assets[PascalCaseId])

        // fallback to prototype chain  回到原型链
        var res = assets[id] || assets[camelizedId] || assets[PascalCaseId];

        //如果检查不到id 实例化则如果是开发环境则警告
        if ("development" !== 'production' && warnMissing && !res) {
            warn(
                'Failed to resolve ' + type.slice(0, -1) + ': ' + id,
                options
            );
        }
        console.log('==res==')
        console.log(res)
        //返回注册指令或者组建的对象
        return res
    }

    /*
     *验证支柱  验证 prosp 是否是规范数据 并且为props 添加 value.__ob__  属性，把prosp添加到观察者中
     *  校验 props 参数 就是组建 定义的props 类型数据，校验类型
     *
     * 判断prop.type的类型是不是Boolean或者String，如果不是他们两类型，调用getPropDefaultValue获取默认值并且把value添加到观察者模式中
     *
     *
     */
    function validateProp(
                        key,  //key
                        propOptions,  //原始props 参数
                        propsData, //转义过的组件props数据
                        vm //    VueComponent 组件构造函数
                            ) {  //vm this属性


                                var prop = propOptions[key]; //获取组件定义的props 属性
                                var absent = !hasOwn(propsData, key);  // 如果该为假的那么可能  a-b 这样的key才能获取到值
                                var value = propsData[key]; // 获取值
                                // boolean casting
                                //Boolean 传一个布尔值  但是 一般是函数或者数组函数才有意义，而且是函数声明的函数并不是 函数表达式prop.type 也需要是函数
                                //返回的是相同的索引  判断 属性类型定义的是否是Boolean
                                var booleanIndex = getTypeIndex(Boolean, prop.type);
                                if (booleanIndex > -1) {  //如果是boolean值

                                    if (absent && !hasOwn(prop, 'default')) { //如果key 不是propsData 实例化，或者 没有定义default 默认值的时候   设置value 为false
                                        value = false;
                                    } else if (
                                        value === ''  //如果value 是空
                                        || value === hyphenate(key) //或者key转出 - 形式和value 相等的时候
                                    ) { //
                                        // only cast empty string / same name to boolean if 仅将空字符串/相同名称转换为boolean if
                                        // boolean has higher priority  获取到相同的
                                        //判断prop.type 的类型是否是string字符串类型
                                        var stringIndex = getTypeIndex(String, prop.type);

                                        if (
                                            stringIndex < 0 || //如果匹配不到字符串
                                            booleanIndex < stringIndex) { //或者布尔值索引小于字符串 索引的时候
                                            value = true;
                                        }
                                    }
                                }
                                // check default value 检查默认值
                                if (value === undefined) {  //如果没有值 value 也不是boolean， 也不是string的时候
                                    //  有可能是 函数
                                    value = getPropDefaultValue(vm, prop, key);
                                    // since the default value is a fresh copy, 由于默认值是一个新的副本，
                                    // make sure to observe it. 一定要遵守。
                                    var prevShouldObserve = shouldObserve;
                                    toggleObserving(true);
                                    console.log('===value===')
                                    console.log(value);
                                    //为 value添加 value.__ob__  属性，把value添加到观察者中
                                    observe(value);
                                    toggleObserving(prevShouldObserve);
                                }
                                {
                                    console.log( prop,
                                        key,
                                        value,
                                        vm,
                                        absent)

                                    //检查prop 是否合格
                                    assertProp(
                                        prop, //属性的type值
                                        key, //props属性中的key
                                        value, //view 属性的值
                                        vm, // VueComponent 组件构造函数
                                        absent //false
                                    );
                                }
                                return value
    }

    /**
     * Get the default value of a prop.
     *获取prop 属性默认的vue值
     */
    function getPropDefaultValue(vm, prop, key) {
        // no default, return undefined
        //判断该对象prop 中的default 是否是prop 实例化的
        if (!hasOwn(prop, 'default')) {
            return undefined
        }
        var def = prop.default;
        // warn against non-factory defaults for Object & Array
        //警告对象和数组的非工厂默认值
        if ("development" !== 'production' && isObject(def)) {
            warn(
                'Invalid default value for prop "' + key + '": ' +
                'Props with type Object/Array must use a factory function ' +
                'to return the default value.',
                vm
            );
        }
        // the raw prop value was also undefined from previous render,
        //原始PROP值也未从先前的渲染中定义，
        // return previous default value to avoid unnecessary watcher trigger
        //返回先前的默认值以避免不必要的监视触发器
        if (vm && vm.$options.propsData &&
            vm.$options.propsData[key] === undefined &&
            vm._props[key] !== undefined
        ) {
            return vm._props[key]
        }
        // call factory function for non-Function types
        //非功能类型调用工厂函数
        // a value is Function if its prototype is function even across different execution context
        //一个值是函数，即使它的原型在不同的执行上下文中也是函数。
        //getType检查函数是否是函数声明  如果是函数表达式或者匿名函数是匹配不上的
        //判断def 是不是函数 如果是则执行，如果不是则返回props的PropDefaultValue
        return typeof def === 'function' && getType(prop.type) !== 'Function'
            ? def.call(vm)
            : def
    }

    /**
     * Assert whether a prop is valid.
     * 断言一个属性是否有效。
     *
     *
     *
     *  prop, //属性的type值
     key, //props属性中的key
     value, //view 属性的值
     vm, //组件构造函数
     absent //false
     */



    function assertProp(
                        prop,  //属性的type值
                        name, //props属性中的key
                        value, //view 属性的值
                        vm, //组件构造函数
                        absent//false
                       ) {
                                    //必须有required 和 absent
                                    if (prop.required && absent) {
                                        warn(
                                            'Missing required prop: "' + name + '"',
                                            vm
                                        );
                                        return
                                    }
                                    //如果vual 为空 或者 不是必填项 则不执行下面代码
                                    if (value == null && !prop.required) {
                                        return
                                    }
                                    //类型
                                    var type = prop.type;

                                    //如果类型为真 或者类型 不存在
                                    var valid = !type || type === true;

                                    var expectedTypes = [];

                                    if (type) { //如果type存在
                                        if (!Array.isArray(type)) {  //如果不是数组
                                            type = [type];  //再包裹成数组
                                        }
                                        for (var i = 0; i < type.length && !valid; i++) {
                                            var assertedType = assertType(value, type[i]);
                                            expectedTypes.push(assertedType.expectedType || '');
                                            valid = assertedType.valid;
                                        }
                                    }
                                    if (!valid) {
                                        warn(
                                            "Invalid prop: type check failed for prop \"" + name + "\"." +
                                            " Expected " + (expectedTypes.map(capitalize).join(', ')) +
                                            ", got " + (toRawType(value)) + ".",
                                            vm
                                        );
                                        return
                                    }
                                    var validator = prop.validator;
                                    if (validator) {
                                        if (!validator(value)) {
                                            warn(
                                                'Invalid prop: custom validator check failed for prop "' + name + '".',
                                                vm
                                            );
                                        }
                                    }
    }

    //检测数据类型 是否是String|Number|Boolean|Function|Symbol 其中的一个数据类型
    var simpleCheckRE = /^(String|Number|Boolean|Function|Symbol)$/;

    //获取type类型
    function assertType(value, type) {
        var valid;
        //getType检查函数是否是函数声明  如果是函数表达式或者匿名函数是匹配不上的
        //type 必须是String|Number|Boolean|Function|Symbol 构造函数
        var expectedType = getType(type);

        //检测改函数是什么类型
        if (simpleCheckRE.test(expectedType)) { //type 必须是String|Number|Boolean|Function|Symbol 构造函数 这里才为真 (String|Number|Boolean|Function|Symbol)
            var t = typeof value;
            //转换成小写
            valid = t === expectedType.toLowerCase(); //布尔值
            // for primitive wrapper objects 对于原始包装对象
            if (!valid && t === 'object') {
                valid = value instanceof type;
            }
        } else if (expectedType === 'Object') {
            //检测是否是真正的对象
            valid = isPlainObject(value);
        } else if (expectedType === 'Array') {
            //检测是否是真正的数组
            valid = Array.isArray(value);
        } else {
            //判断 value 是否是type中的实例化对象
            valid = value instanceof type;
        }
        //返回出去值
        return {
            valid: valid,
            expectedType: expectedType
        }
    }

    /**
     * Use function string name to check built-in types,
     * because a simple equality check will fail when running
     * across different vms / iframes.
     * 检查函数是否是函数声明  如果是函数表达式或者匿名函数是匹配不上的
     *
     *
     */
    function getType(fn) {
        var match = fn && fn.toString().match(/^\s*function (\w+)/);
        return match ? match[1] : ''
    }

    //判断两个函数声明是否是相等
    function isSameType(a, b) {
        return getType(a) === getType(b)
    }


    //判断expectedTypes 中的函数和 type 函数是否有相等的如有有则返回索引index 如果没有则返回-1

    function getTypeIndex(type, expectedTypes) {
        //如果不是数组直接比较 如果真则返回0
        if (!Array.isArray(expectedTypes)) {
            return isSameType(expectedTypes, type) ? 0 : -1
        }
        for (var i = 0, len = expectedTypes.length; i < len; i++) {
            //如果是数组则寻找索引
            if (isSameType(expectedTypes[i], type)) {
                return i
            }
        }
        return -1
    }

    /*

     向外暴露了一个 handleError 方法，在需要捕获异常的地方调用。
     handleError 方法中首先获取到报错的组件，之后递归查找当前组件的父组件，
     依次调用 errorCaptured 方法。在遍历调用完所有 errorCaptured 方法、或 errorCaptured 方法有报错时，

     会调用 globalHandleError 方法。

     globalHandleError 方法调用了全局的 errorHandler 方法。

     如果 errorHandler 方法自己又报错了呢？生产环境下会使用 console.error 在控制台中输出。

     可以看到 errorCaptured 和 errorHandler 的触发时机都是相同的，不同的是 errorCaptured 发生在前，
     且如果某个组件的 errorCaptured 方法返回了 false，那么这个异常信息不会再向上冒泡也不会再调用
     errorHandler 方法。

     */

    function handleError(err, vm, info) {
        if (vm) {
            var cur = vm;
            //循环父组件
            while ((cur = cur.$parent)) {
                //如果hooks 存在 则循环 所有的hooks
                var hooks = cur.$options.errorCaptured;
                if (hooks) {
                    for (var i = 0; i < hooks.length; i++) {
                        try {
                            //调用hooks 中函数，如果发生错误则调用globalHandleError
                            var capture = hooks[i].call(cur, err, vm, info) === false;
                            if (capture) {
                                return
                            }
                        } catch (e) {
                            //调用全局日志输出
                            globalHandleError(e, cur, 'errorCaptured hook');
                        }
                    }
                }
            }
        }
        //调用全局日志输出
        globalHandleError(err, vm, info);
    }

    function globalHandleError(err, vm, info) {

        //如果errorHandler 存在 则调用 errorHandler函数
        if (config.errorHandler) {

            try {
                return config.errorHandler.call(null, err, vm, info)
            } catch (e) {
                //错误日志信息输出
                logError(e, null, 'config.errorHandler');
            }
        }
        logError(err, vm, info);
    }

    //错误日志信息输出
    function logError(err, vm, info) {
        {
            warn(("Error in " + info + ": \"" + (err.toString()) + "\""), vm);
        }
        /* istanbul ignore else 如果是浏览器或者是 微信端，输出console */
        if ((inBrowser || inWeex) && typeof console !== 'undefined') {
            console.error(err);
        } else {
            //如果是服务器端 则抛出错误
            throw err
        }
    }

    /*  */
    /* globals MessageChannel 全局消息通道 */

    //回调函数队列
    var callbacks = [];
    var pending = false;
    // 触发 callbacks 队列中的函数
    function flushCallbacks() {

        pending = false;
        //.slice(0) 浅拷贝
        var copies = callbacks.slice(0);
        callbacks.length = 0;
        console.log(copies)

        for (var i = 0; i < copies.length; i++) {
            //执行回调函数
            copies[i]();
        }
    }

// Here we have async deferring wrappers using both microtasks and (macro) tasks. 在这里，我们使用了微任务和宏任务的异步包装器。
// In < 2.4 we used microtasks everywhere, but there are some scenarios where 在< 2.4中，我们到处使用微任务，但也有一些场景。
// microtasks have too high a priority and fire in between supposedly  微任务优先级太高，据称介于两者之间。
// sequential events (e.g. #4521, #6690) or even between bubbling of the same 序贯事件（例如α4521，α6690），甚至在同一气泡之间
// event (#6566). However, using (macro) tasks everywhere also has subtle problems 事件（α6566）。然而，到处使用（宏）任务也有微妙的问题。
// when state is changed right before repaint (e.g. #6813, out-in transitions). 当状态在重新绘制之前被正确改变（例如，α6813，在过渡中出现）。
// Here we use microtask by default, but expose a way to force (macro) task when  这里，我们默认使用微任务，但是暴露一种方法来强制（宏）任务
// needed (e.g. in event handlers attached by v-on). 需要的（例如在事件处理程序中附加的V-on）。


    var microTimerFunc; //微计时器功能
    var macroTimerFunc; //宏计时器功能
    var useMacroTask = false; //使用宏任务

// Determine (macro) task defer implementation. 确定（宏）任务延迟实现。
// Technically setImmediate should be the ideal choice, but it's only available 技术上应该是理想的选择，但它是唯一可用的。
// in IE. The only polyfill that consistently queues the callback after all DOM 在IE.中，唯一的填充在所有DOM之后始终排队回叫。
// events triggered in the same loop is by using MessageChannel. 在同一循环中触发的事件是通过使用消息通道。
    /* istanbul ignore if */
    //判断setImmediate 是否存在，如果存在则判断下是是否是系统内置函数
    if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
        //函数表达式赋值给macroTimerFunc
        macroTimerFunc = function () {

            setImmediate(flushCallbacks);
        };
    } else if (typeof MessageChannel !== 'undefined' && (
            isNative(MessageChannel) ||
            // PhantomJS
            MessageChannel.toString() === '[object MessageChannelConstructor]'
        )) {
        //如果有 消息体 内置函数则实例化
        var channel = new MessageChannel();
        //获取端口2
        var port = channel.port2;

        //设置端口1 的接受函数为flushCallbacks
        channel.port1.onmessage = flushCallbacks;

        //端口2推送信息给端口1
        macroTimerFunc = function () {

            port.postMessage(1);
        };
    } else {
        /* istanbul ignore next */
        // 异步执行
        macroTimerFunc = function () {

            setTimeout(flushCallbacks, 0);
        };
    }

// Determine microtask defer implementation.
    //确定微任务延迟执行。
    /* istanbul ignore next, $flow-disable-line */
    if (typeof Promise !== 'undefined' && isNative(Promise)) {
        // 声明一个成功的 Promise
        var p = Promise.resolve();
        //microTimerFunc 一个异步 队列函数
        microTimerFunc = function () {
            p.then(flushCallbacks);
            // in problematic UIWebViews, Promise.then doesn't completely break, but 在有问题的UIWebVIEW中，Promise.then并没有完全崩溃，而是
            // it can get stuck in a weird state where callbacks are pushed into the 它可能会陷入一种怪异的状态，其中回调被推到
            // microtask queue but the queue isn't being flushed, until the browser 微任务队列，但队列没有刷新，直到浏览器
            // needs to do some other work, e.g. handle a timer. Therefore we can 需要做一些其他的工作，例如处理计时器。因此我们可以
            // "force" the microtask queue to be flushed by adding an empty timer. [强制]通过添加空计时器来刷新微任务队列。
            //如果是ios 执行下 noop 空函数
            if (isIOS) {
                setTimeout(noop);
            }
        };
    } else {
        // fallback to macro
        //回归宏

        microTimerFunc = macroTimerFunc;
    }

    /**
     * Wrap a function so that if any code inside triggers state change, 包装一个函数，如果内部的任何代码触发状态改变，
     * the changes are queued using a (macro) task instead of a microtask. 使用宏（宏）任务而不是微任务对这些队列进行排队
     */
    function withMacroTask(fn) {
        //宏任务
        return fn._withTask || (fn._withTask = function () {
                useMacroTask = true;
                var res = fn.apply(null, arguments);
                useMacroTask = false;
                return res
            })
    }

    //为callbacks 收集队列cb 函数 并且根据 pending 状态是否要触发callbacks 队列函数
    function nextTick(cb, ctx) {
        //cb 回调函数
        //ctx this的指向
        var _resolve;
        //添加一个回调函数到队列里面去

        callbacks.push(function () {
            if (cb) {
                //如果cb存在 并且是一个函数就执行
                try {
                    cb.call(ctx);
                } catch (e) {
                    //如果不是函数则报错
                    handleError(e, ctx, 'nextTick');
                }
            } else if (_resolve) {
                //_resolve 如果存在则执行
                _resolve(ctx);
            }
        });
        console.log('==callbacks==')
        console.log(callbacks)
        console.log(pending)

        if (!pending) {

            pending = true;
            //执行异步宏任务
            if (useMacroTask) {

                macroTimerFunc(); //异步触发 或者 实现观察者 触发  callbacks 队列中的函数
            } else {
                microTimerFunc(); //异步触发 或者 实现观察者 触发  callbacks 队列中的函数
            }
        }


        // $flow-disable-line
        if (!cb && typeof Promise !== 'undefined') {
            //如果回调函数不存在 则声明一个Promise 函数
            return new Promise(function (resolve) {
                _resolve = resolve;
            })
        }
    }

    /*  */

    var mark;
    var measure;

    {
        //浏览器性能监控
        var perf = inBrowser && window.performance;
        /* istanbul ignore if */
        if (
            perf &&
            perf.mark &&
            perf.measure &&
            perf.clearMarks &&
            perf.clearMeasures
        ) {
            mark = function (tag) {
                return perf.mark(tag);
            };
            measure = function (name, startTag, endTag) {
                perf.measure(name, startTag, endTag);
                perf.clearMarks(startTag);
                perf.clearMarks(endTag);
                perf.clearMeasures(name);
            };
        }
    }

    /*
     not type checking this file because flow doesn't play well with Proxy
     不检查此文件，因为流不能很好地使用代理
     * */

    var initProxy;

    {
        //map 对象中的[name1,name2,name3,name4]  变成这样的map{name1:true,name2:true,name3:true,name4:true}
        /*全局api 匹配'Infinity,undefined,NaN,isFinite,isNaN,' +
        'parseFloat,parseInt,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,' +
        'Math,Number,Date,Array,Object,Boolean,String,RegExp,Map,Set,JSON,Intl,' +
        'require'
        */
        var allowedGlobals = makeMap(
            'Infinity,undefined,NaN,isFinite,isNaN,' +
            'parseFloat,parseInt,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,' +
            'Math,Number,Date,Array,Object,Boolean,String,RegExp,Map,Set,JSON,Intl,' +
            'require' // for Webpack/Browserify
        );

        //不存在的key 发出警告
        var warnNonPresent = function (target, key) {
            warn(
                "Property or method \"" + key + "\" is not defined on the instance but " +
                'referenced during render. Make sure that this property is reactive, ' +
                'either in the data option, or for class-based components, by ' +
                'initializing the property. ' +
                'See: https://vuejs.org/v2/guide/reactivity.html#Declaring-Reactive-Properties.',
                target
            );
        };

        //判断 系统内置 函数有没有 es6的Proxy 代理对象api
        var hasProxy =
            typeof Proxy !== 'undefined' && isNative(Proxy);

        if (hasProxy) {
            //这些修改键就是 Shift、Ctrl、Alt和 Meta（在 Windows键盘中是 Windows键，在苹果机中 是 Cmd 键）它们经常被用来修改鼠标事件的行为。
            var isBuiltInModifier = makeMap('stop,prevent,self,ctrl,shift,alt,meta,exact');
            //声明代理拦截对象
            config.keyCodes = new Proxy(config.keyCodes, {
                set: function set(target, key, value) {
                    if (isBuiltInModifier(key)) { //匹配键盘上的快捷键 'stop,prevent,self,ctrl,shift,alt,meta,exact'
                        //避免在配置键代码中重写内置修改器： 在一些快捷键中不需要加vue事件修饰器
                        warn(("Avoid overwriting built-in modifier in config.keyCodes: ." + key));
                        return false
                    } else {
                        //记录不是快捷键的键盘码
                        target[key] = value;
                        return true
                    }
                }
            });
        }

        var hasHandler = {
            has: function has(target, key) {
                var has = key in target;
                //是否含有全局api 就是window 的内置函数
                //全局api
                // var allowedGlobals = makeMap(
                //     'Infinity,undefined,NaN,isFinite,isNaN,' +
                //     'parseFloat,parseInt,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,' +
                //     'Math,Number,Date,Array,Object,Boolean,String,RegExp,Map,Set,JSON,Intl,' +
                //     'require' // for Webpack/Browserify
                // );

                var isAllowed = allowedGlobals(key) || key.charAt(0) === '_';
                //如果  key 在target对象中 不存在 或者 isAllowed 不是全局api 并且 第一个字符不是_的时候 发出警告
                if (!has && !isAllowed) {
                    //不存在key发出警告
                    warnNonPresent(target, key);
                }
                //返回true
                return has || !isAllowed
            }
        };

        var getHandler = {
            get: function get(target, key) {
                //key必须是等于string 并且 key在target中含有属性或者方法
                if (typeof key === 'string' && !(key in target)) {
                    //如果没有则发出警告
                    warnNonPresent(target, key);
                }
                //返回target值
                return target[key]
            }
        };

        //初始化 代理 监听
        initProxy = function initProxy(vm) {
            if (hasProxy) {
                // determine which proxy handler to use 确定使用哪个代理处理程序
                var options = vm.$options; //获取vm中的参数
                //render 渲染 如果是渲染 并且含有_withStripped
                var handlers = options.render && options.render._withStripped
                    ? getHandler  //获取值
                    : hasHandler;  //判断内部函数，这样vue中模板就可以使用内置函数
                //实例化 代理对象，只是这里添加了 警告的日志而已
                vm._renderProxy = new Proxy(vm, handlers);
            } else {
                //如果不能代理直接赋值
                vm._renderProxy = vm;
            }
        };
    }

    /*
     * 实例化set对象
     * */

    var seenObjects = new _Set();

    /**
     * Recursively traverse an object to evoke all converted 递归遍历对象以唤起所有转换
     * getters, so that every nested property inside the object 吸收器，以便对象内的每个嵌套属性
     * is collected as a "deep" dependency. 被收集为一个“深度”依赖。
     *   为 seenObjects 深度收集val 中的key
     */
    function traverse(val) {
        // 搜索seen 为seen添加depId
        //seenObjects set对象
        //  为 seenObjects 深度收集val 中的key

        _traverse(val, seenObjects);
        //清除对象 给对象置空
        seenObjects.clear();
    }

    //搜集依赖
    /*
     * 搜索seen 为seen添加depId
     *  为 seenObjects 深度收集val 中的key
     *
     * */
    //看到这里
    function _traverse(val, seen) {
        console.log(val)
        console.log(seen.add)

        var i, keys;
        //判断是否是数组
        var isA = Array.isArray(val);
        //isFrozen 方法判断一个对象是否被冻结。 https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/isFrozen
        //val 是否是被VNode 实例化
        if ((!isA && !isObject(val)) || Object.isFrozen(val) || val instanceof VNode) {
            return
        }
        console.log(val.__ob__)

        //如果val 有__ob__ 属性
        if (val.__ob__) {
            var depId = val.__ob__.dep.id;
            // seen 中是否含有depId 属性或者方法
            if (seen.has(depId)) {
                return
            }
            console.log(seen.add)

            // seen 是 seenObjects = new _Set(); add 就是set对象中的add方法，添加为一的值得key
            //如果没有则添加进去
            seen.add(depId);
        }
        //如果是数组
        if (isA) {
            i = val.length;
            //则循环检查 回调递归
            while (i--) {
                _traverse(val[i], seen);
            }
        } else {

            keys = Object.keys(val);
            i = keys.length;
            //如果是对象也循环递归检查
            while (i--) {
                _traverse(val[keys[i]], seen);
            }
        }
    }

    /*
     *
     * // normalizeEvent函数主要用于将传入的带有特殊前缀的事件修饰符分解为具有特定值的事件对象
     * cachedFn
     *
     function cached(fn) {
     var cache = Object.create(null);
     return (function cachedFn(str) {
     var hit = cache[str];
     return hit || (cache[str] = fn(str))
     })
     }
     *   normalizeEvent 得到的是一个函数  如果传入的 name 中 在cache 对象中有值 则返回这个值
     *   如果该对象没有值则 调用该函数 并且用返回值 记录 当前执行函数返回值记录起来
     * */
    //该函数是过滤 vue 事件中的修饰符
    var normalizeEvent = cached(function (name) {
        //判断第一个字符是否是'&
        var passive = name.charAt(0) === '&';
        //slice()，返回一个新的字符串，该方法可从已有的数组中,或者字符串中返回选定的元素。
        name = passive ? name.slice(1) : name;

        //判断第一个字符串是否是~
        var once$$1 = name.charAt(0) === '~'; // Prefixed last, checked first

        //slice()，返回一个新的字符串，该方法可从已有的数组中,或者字符串中返回选定的元素。
        name = once$$1 ? name.slice(1) : name;
        //判断第一个位是否是 ！
        var capture = name.charAt(0) === '!';
        //slice()，返回一个新的字符串，该方法可从已有的数组中,或者字符串中返回选定的元素。
        name = capture ? name.slice(1) : name;
        return {
            name: name,
            once: once$$1,
            capture: capture,
            passive: passive
        }
    });

    //createFnInvoker 创建一个调用程序 创建一个钩子函数
    //createFnInvoker，如果事件只是个函数就为为事件添加多一个静态类， invoker.fns = fns; 把真正的事件放在fns。而 invoker 则是转义fns然后再运行fns
    function createFnInvoker(fns) {
        function invoker() {
            //获取传进来的参数，是一个数组
            var arguments$1 = arguments;

            //静态方法传进来的函数 赋值给fns
            var fns = invoker.fns;

            //判断fns 是否是一个数组
            if (Array.isArray(fns)) {
                //如果是数组 浅拷贝
                var cloned = fns.slice();
                //执行fns 数组中的函数 并且把 invoker  arguments$1参数一个个传给fns 函数中
                for (var i = 0; i < cloned.length; i++) {

                    cloned[i].apply(null, arguments$1);
                }
            } else {
                // return handler return value for single handlers
                //如果fns 不是数组函数，而是一个函数 则执行arguments$1参数一个个传给fns 函数中
                return fns.apply(null, arguments)
            }
        }

        invoker.fns = fns;
        return invoker  //静态类
    }


    //更新事件 并且为新的值 添加函数 旧的值删除函数等功能
    function updateListeners(
                              on,  //新的事件
                             oldOn, //旧的事件
                              add,  //添加事件函数
                             remove$$1, //删除事件函数
                             vm//vue 实例化对象
                          ) {
        var name, def, cur, old, event;

        for (name in on) {  // 遍历on
            def = cur = on[name];  //on 新的事件值
            old = oldOn[name];  //oldOn 对象中的 与 name 匹配 并且赋值 old 估计这个是旧的值
            event = normalizeEvent(name);   //normalizeEvent 如果是事件，则过滤 事件修饰符

            /* istanbul ignore if */
            // isUndef 判断值存在 并且是空的  return v === undefined || v === null
            if (isUndef(cur)) {
                //如果不是生产环境
                "development" !== 'production' && warn(
                    "Invalid handler for event \"" + (event.name) + "\": got " + String(cur),
                    vm
                );
            } else if (isUndef(old)) {  //判断旧的值是否存在 为空的时候  没有定义旧的事件

                if (isUndef(cur.fns)) { //如果函数不存在 则绑定函数
                    //函数 获取钩子函数
                    // 创建函数调用器并重新复制给cur和on[name]
                    cur = on[name] = createFnInvoker(cur); //这个时候cur.fns就存在了
                }



                name = '&' + name; // mark the event as passive 将事件标记为被动的
                //添加事件
                add(
                    event.name, //事件名称
                    cur, // 转义过的事件 执行静态类
                    event.once, //是否只触发一次的状态
                    event.capture, //  事件俘获或是冒泡行为
                    event.passive, // 检测事件修饰符 是否是   '&'
                     event.params //事件参数
                );

            } else if (cur !== old) {
                //如果新的值不等于旧的值
                //则更新新旧值
                old.fns = cur;
                on[name] = old;
            }
        }
        for (name in oldOn) {
            //循环旧的值 为空的时候
            if (isUndef(on[name])) {
                //获取事件
                event = normalizeEvent(name);
                //删除旧的值的事件
                remove$$1(event.name, oldOn[name], event.capture);
            }
        }
    }

    /*
     *
     *  合并vue vnode 钩子函数，
      *  def[hookKey] = invoker; //把钩子函数用对象存起来
     * */

    function mergeVNodeHook(def, hookKey, hook) {
        //判断def  是否 是vnode 实例化的对象
        if (def instanceof VNode) {
            // 重新赋值def 把def.data.hook  赋值给def
            def = def.data.hook || (def.data.hook = {});
        }

        var invoker;
        //获取旧的oldHook 钩子
        var oldHook = def[hookKey];

        function wrappedHook() {
            //执行钩子函数
            hook.apply(this, arguments);
            // important: remove merged hook to ensure it's called only once
            // and prevent memory leak
            //重要：删除合并钩子以确保只调用一次
            //和防止内存泄漏
            remove(invoker.fns, wrappedHook);
        }

        if (isUndef(oldHook)) { //如果旧的钩子函数没有 为空的时候
            // no existing hook 无现有钩 则创建一个钩子函数
            invoker = createFnInvoker([wrappedHook]);
        } else {
            /* istanbul ignore if  如果有老的钩子函数，并且fns钩子函数存在 并且已经合并过*/
            if (isDef(oldHook.fns) && isTrue(oldHook.merged)) {
                // already a merged invoker 已合并的调用程序
                invoker = oldHook; //直接老的钩子函数直接覆盖新的钩子函数
                //为钩子函数的fns 添加一个函数
                invoker.fns.push(wrappedHook);
            } else {
                // existing plain hook
                invoker = createFnInvoker([oldHook, wrappedHook]);
            }
        }

        invoker.merged = true;
        //把钩子函数用对象存起来
        def[hookKey] = invoker;
    }

    /*
     extractPropsFromVNodeData 从 props属性中获取vnode数据
     extractPropsFromVNodeData循环propOptions对象，把驼峰的key转换成横杠的key。校验props属性的key是否和attrs属性值相同，如果相同删除掉attrs属性的同样key的值。获取props属性的值添加搞res对象中，返回出去
     *
     * */
    function extractPropsFromVNodeData(
                                        data, //tag标签属性数据
                                        Ctor, //组件构造函数VueComponent
                                        tag //tag标签名称
                                       ) {
                                        // we are only extracting raw values here.
                                        // validation and default values are handled in the child
                                        // component itself.
                                        //我们只是在这里提取原始值。
                                        //验证和默认值在孩子中被处理
                                        //组件本身。

                                        //获取Ctor 参数中的 props
                                        var propOptions = Ctor.options.props; //获取组件的props属性
                                       console.log(Ctor.options)

                                        //如果propOptions 属性是空或者不存在 这不执行下面代码
                                        if (isUndef(propOptions)) {
                                            return
                                        }


                                        var res = {};
                                        var attrs = data.attrs;
                                        var props = data.props;

                                        //如果data中的属性attrs或者props 属性 数据存在
                                        if (isDef(attrs) || isDef(props)) {
                                            //遍历propOptions  props属性中的值
                                            for (var key in propOptions) {

                                                //altKey获取到一个函数，该函数功能是把 abCd 驼峰字母改写成 ab-c 如果是 aB cd 则是 ab cd
                                                //大写字母，加完减号又转成小写了 比如把驼峰 aBc 变成了 a-bc
                                                //匹配大写字母并且两面不是空白的 替换成 '-' + '字母' 在全部转换成小写

                                                var altKey = hyphenate(key);


                                                {
                                                    //把key 转换成小写
                                                    var keyInLowerCase = key.toLowerCase();
                                                    //如果他们key不相同 并且 属性attrs存在 并且keyInLowerCase 属性存在 attrs对象中
                                                    if (
                                                        key !== keyInLowerCase &&
                                                        attrs && hasOwn(attrs, keyInLowerCase)
                                                    ) {
                                                        //输出一个警告信息
                                                        tip(
                                                            "Prop \"" + keyInLowerCase + "\" is passed to component " +
                                                            (formatComponentName(tag || Ctor)) + ", but the declared prop name is" +
                                                            " \"" + key + "\". " +
                                                            "Note that HTML attributes are case-insensitive and camelCased " +
                                                            "props need to use their kebab-case equivalents when using in-DOM " +
                                                            "templates. You should probably use \"" + altKey + "\" instead of \"" + key + "\"."
                                                        );
                                                    }
                                                }
                                                //检查属性
                                                checkProp(
                                                    res,  //空对象
                                                    props, //props 属性
                                                    key, //propOptions 的原始key
                                                    altKey, //转换后的 横杆key
                                                    true
                                                ) ||
                                                checkProp(
                                                    res,
                                                    attrs,
                                                    key,
                                                    altKey,
                                                    false
                                                );
                                            }
                                        }
                                        return res
    }


    //检查  属性  检查key和altKey 在hash属性对象中有没有，如果有则赋值给res对象
    function checkProp(
                       res,   //需要添加值的对象
                       hash,   // 属性对象
                       key,    // 原始key
                       altKey,  //转换后的 横杆key
                       preserve  //是否要删除hash 对象中的属性或者方法   状态 布尔值
    ) {
        //hash 值存在
        if (isDef(hash)) {
            //如果是hash对象中含有key 属性或者方法
            if (hasOwn(hash, key)) {
                //添加res值
                res[key] = hash[key];
                //preserve 不存在的时候则在hash对象中删除该key 属性或者方法
                if (!preserve) {
                    delete hash[key];
                }
                return true
            } else if (hasOwn(hash, altKey)) {      //如果是hash对象中含有altKey 属性或者方法
                //添加res值
                res[key] = hash[altKey];
                //preserve 不存在的时候则在hash对象中删除该key 属性或者方法
                if (!preserve) {
                    delete hash[altKey];
                }
                return true
            }
        }
        return false
    }

    /*  */

// The template compiler attempts to minimize the need for normalization by 模板编译器试图最小化对规范化的需要。
// statically analyzing the template at compile time. 在编译时静态分析模板。
//
// For plain HTML markup, normalization can be completely skipped because the 对于普通HTML标记，可以完全跳过标准化，因为
// generated render function is guaranteed to return Array<VNode>. There are 生成的渲染函数保证返回数组<VNoCT>。有
// two cases where extra normalization is needed: 需要额外标准化的两种情况：

// 1. When the children contains components - because a functional component 当儿童包含组件时，因为函数组件
// may return an Array instead of a single root. In this case, just a simple 可以返回数组而不是单个根。在这种情况下，只是一个简单的例子
// normalization is needed - if any child is an Array, we flatten the whole 规范化是必要的-如果任何一个孩子是一个数组，我们扁平化整个
// thing with Array.prototype.concat. It is guaranteed to be only 1-level deep 和Array.prototype.concat在一起。保证仅为1级深
// because functional components already normalize their own children. 因为功能组件已经规范了他们自己的孩子。

    //循环子节点children，把他连在一起，其实就是把伪数组变成真正的数组
    function simpleNormalizeChildren(children) {
        for (var i = 0; i < children.length; i++) {
            if (Array.isArray(children[i])) {
                return Array.prototype.concat.apply([], children)
            }
        }
        return children
    }

// 2. When the children contains constructs that always generated nested Arrays, 2。当子类包含总是生成嵌套数组的结构时，
// e.g. <template>, <slot>, v-for, or when the children is provided by user 例如，模板缝隙＞＜＞、＜V时，或当孩子由用户提供
// with hand-written render functions / JSX. In such cases a full normalization       具有手写渲染功能/JSX。在这种情况下，完全归一化。
// is needed to cater to all possible types of children values.   需要满足所有可能的儿童价值类型。
    //判断children的数据类型 而创建不同的虚拟dom vonde
    function normalizeChildren(children) {
        return isPrimitive(children) ?  //判断数据类型是否是string，number，symbol，boolean
                                        [createTextVNode(children)]  // 创建一个文本节点
                                        : Array.isArray(children) ?  //判断是否是数组
                                                                    normalizeArrayChildren(children) //创建一个规范的子节点数组。
                                                                    : undefined
    }

    //判断是否是文本节点
    function isTextNode(node) {
        return isDef(node) && isDef(node.text) && isFalse(node.isComment)
    }


    //规范的子节点
    //  normalizeArrayChildren接收 2 个参数，
    //  children 表示要规范的子节点，nestedIndex 表示嵌套的索引，

    //  主要的逻辑就是遍历 children，获得单个节点 c，然后对 c 的类型判断，
    //  如果是一个数组类型，则递归调用 normalizeArrayChildren;
    //  如果是基础类型，则通过 createTextVNode 方法转换成 VNode 类型；
    //  否则就已经是 VNode 类型了，如果 children 
    //  是一个列表并且列表还存在嵌套的情况，则根据 nestedIndex 
    //  去更新它的 key。这里需要注意一点，在遍历的过程中，
    //  对这 3 种情况都做了如下处理：如果存在两个连续的 text 节点，
    //  会把它们合并成一个 text 节点。
    //  因为单个 child 可能是一个数组类型。把这个深层的数组遍历到一层数组上面去。如果是深层数组则调用递.归 normalizeArrayChildren


    function normalizeArrayChildren(
                                        children,
                                        nestedIndex
                                    ) {
                                        var res = [];
                                        var i, c, lastIndex, last;

                                        for (i = 0; i < children.length; i++) {  //循环数组子节点children
                                            c = children[i];
                                            //判断是否是空 并且 c是一个布尔值的时候
                                            if (isUndef(c) || typeof c === 'boolean') {
                                                continue
                                            }
                                            // 获取  res 数组的长度
                                            lastIndex = res.length - 1;
                                            //获取res 最后一个数据
                                            last = res[lastIndex];
                                            //  nested
                                            if (Array.isArray(c)) { //如果c 子节点还是一个数组
                                                if (c.length > 0) { //并且 长度 不为0
                                                    //数组则用递归   nestedIndex 有可能是 0_0  0_0_0 0_0_1 0_0_2  0_1  0_1_0 0_1_1 0_1_2
                                                    //如果含有子节点，则递归，把所有子节点变成文本节点
                                                    c = normalizeArrayChildren(c, ((nestedIndex || '') + "_" + i));
                                                    // merge adjacent text nodes 合并相邻文本节点
                                                    //如果c[0] 中的第一个是文本节点 并且 res 最后一个节点是 文本节点
                                                    if (isTextNode(c[0]) && isTextNode(last)) {
                                                        //创建一个文本节点 并且是合并他们的文本内容
                                                        res[lastIndex] = createTextVNode(last.text + (c[0]).text);
                                                        //从c 出栈第一个数据
                                                        c.shift();
                                                    }
                                                    //res 添加 数据 相当于 concat 链接数组
                                                    res.push.apply(res, c);
                                                }
                                            } else if (isPrimitive(c)) {  //判断数据类型是否是string，number，symbol，boolean
                                                //如果res最后数据一个是文本节点
                                                if (isTextNode(last)) {
                                                    // merge adjacent text nodes 合并相邻文本节点
                                                    // this is necessary for SSR hydration because text nodes are 这对于SSR水化是必要的，因为文本节点是
                                                    // essentially merged when rendered to HTML strings 当呈现到HTML字符串时本质上合并
                                                    // 创建文本节点
                                                    res[lastIndex] = createTextVNode(last.text + c);
                                                } else if (c !== '') { //c不等于空
                                                    // convert primitive to vnode
                                                    //转换成 vnode  创建 文本节点
                                                    res.push(createTextVNode(c));
                                                }
                                            } else {
                                                //如果c  中的第一个是文本节点 并且 res 最后一个节点是 文本节点
                                                if (isTextNode(c) && isTextNode(last)) {
                                                    // merge adjacent text nodes 合并相邻文本节点
                                                    //创建文本节点
                                                    res[lastIndex] = createTextVNode(last.text + c.text);
                                                } else {
                                                    // default key for nested array children (likely generated by v-for)
                                                    //嵌套数组子的默认键 可能v-for产生的

                                                    if (
                                                        isTrue(children._isVList) && //如果children._isVList 为true
                                                        isDef(c.tag) &&   //c.tag 不为空
                                                        isUndef(c.key) && //c.key 为空的时候
                                                        isDef(nestedIndex)) { //nestedIndex不为空
                                                        //赋值key的值为__vlist+1+"_" + 1 + "__";
                                                        c.key = "__vlist" + nestedIndex + "_" + i + "__";
                                                    }
                                                    //把VNode 添加到res 中
                                                    res.push(c);
                                                }
                                            }
                                        }
                                        console.log(res)

                                        //返回 res 值
                                        return res
                                    }

    /*
     判断是否是对象 如果是则合并起来
     */
    function ensureCtor(comp, base) {
        //https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol/toStringTag
        if (

            //__webpack_require__.n会判断module是否为es模块，当__esModule为true的时候，标识module为es模块，那么module.a默认返回module.default，否则返回module。
        //https://segmentfault.com/a/1190000010955254
        comp.__esModule ||  //如果 comp.__esModule 存在
        (hasSymbol && comp[Symbol.toStringTag] === 'Module') //或者 支持hasSymbol 类型 并且判断 对象类的标签属性是Module "[object Module]"
        ) {
            //将 comp 默认属性给 comp
            comp = comp.default;
        }
        //如果comp 是对象 则合并 base，否则返回comp
        return isObject(comp)
            ? base.extend(comp)
            : comp
    }

//createAsyncPlaceholder 创建简单的占位符 创建一个节点
    //解决异步组件
    function createAsyncPlaceholder(factory, //工厂
                                    data,  //数据
                                    context, //语境
                                    children, //子节点
                                    tag) {  //标签
        //创建一个空节点
        var node = createEmptyVNode();
        node.asyncFactory = factory;
        /*异步工厂*/
        node.asyncMeta = {
            data: data,
            context: context,
            children: children,
            tag: tag
        };
        return node
    }

    // 解析异步组件 更新数据
    function resolveAsyncComponent(
                                   factory,  //函数工厂
                                   baseCtor, //构造函数或者vue
                                   context //vue实例化 对象
    ) {
        console.log(factory);
        console.log(baseCtor);
        console.log(context);

        //如果  有错误     则返回错误信息
        if (isTrue(factory.error) && isDef(factory.errorComp)) {
            return factory.errorComp
        }
        //成功状态
        if (isDef(factory.resolved)) {
            return factory.resolved
        }
        //等待状态
        if (isTrue(factory.loading) && isDef(factory.loadingComp)) {
            return factory.loadingComp
        }
        //环境
        if (isDef(factory.contexts)) {
            // already pending 已经等待
            factory.contexts.push(context);
        } else {
            var contexts = factory.contexts = [context]; //转化成数组
            var sync = true;
            //渲染
            var forceRender = function () {
                for (var i = 0, l = contexts.length; i < l; i++) {
                    //更新数据 观察者数据
                    contexts[i].$forceUpdate();
                }
            };
            //成功 状态渲染
            var resolve = once(function (res) { //确保只是渲染一次
                // cache resolved
                factory.resolved = ensureCtor(res, baseCtor);
                // invoke callbacks only if this is not a synchronous resolve
                // (async resolves are shimmed as synchronous during SSR)
                //只有在这不是同步解析时才调用回调
                //(异步解析在SSR期间以同步的方式进行调整)
                if (!sync) {
                    //渲染组件更新数据
                    forceRender();
                }
            });
            //失败状态
            var reject = once(function (reason) {
                "development" !== 'production' && warn(
                    "Failed to resolve async component: " + (String(factory)) +
                    (reason ? ("\nReason: " + reason) : '')
                );
                if (isDef(factory.errorComp)) {
                    factory.error = true;
                    //渲染组件更新数据
                    forceRender();
                }
            });

            var res = factory(resolve, reject);

            if (isObject(res)) {  //如果是对象 表明支持promise
                //如果 then 是函数
                if (typeof res.then === 'function') {
                    // () => Promise 执行 promise
                    if (isUndef(factory.resolved)) {//没有定义 resolved 成功
                        res.then(resolve, reject); //执行 then
                    }
                } else if (isDef(res.component) && typeof res.component.then === 'function') { //如果组件有定义并且有值，而且组件是异步的then是函数
                    res.component.then(resolve, reject);  //执行组件的异步

                    if (isDef(res.error)) {  //如果有错误则 把错误合并
                        factory.errorComp = ensureCtor(res.error, baseCtor);
                    }

                    if (isDef(res.loading)) {  //如果组件在加载
                        //则合并组件加载时候baseCtor合并
                        factory.loadingComp = ensureCtor(res.loading, baseCtor);
                        if (res.delay === 0) {
                            //delay 在加载等待
                            factory.loading = true;
                        } else {
                            setTimeout(function () {
                                //如果没有resolved成功 并且没有错误
                                if (isUndef(factory.resolved) && isUndef(factory.error)) {
                                    factory.loading = true;
                                    //渲染组件更新数据
                                    forceRender();
                                }
                            }, res.delay || 200);
                        }
                    }

                    if (isDef(res.timeout)) { //如果有定义一般渲染时间
                        setTimeout(function () {
                            if (isUndef(factory.resolved)) {  //没有执行成功
                                reject( // 则执行失败
                                    "timeout (" + (res.timeout) + "ms)"
                                );
                            }
                        }, res.timeout);
                    }
                }
            }

            sync = false;
            // return in case resolved synchronously 在同步解析的情况下返回
            return factory.loading
                ? factory.loadingComp
                : factory.resolved
        }
    }

    /*
     *  判断是否是异步的
     * */
    function isAsyncPlaceholder(node) {
        return node.isComment && node.asyncFactory
    }

    /*
     *  获取第一个子组件并且子组件有options参数，并且是异步组件的
     *
     * */

    function getFirstComponentChild(children) {
        if (Array.isArray(children)) { //如果组件是个数组
            for (var i = 0; i < children.length; i++) { //循环子组件
                var c = children[i];
                //如果子组件存在，并且子组件有options参数，不是空组件的，并且是异步组件的
                if (isDef(c) && (isDef(c.componentOptions) || isAsyncPlaceholder(c))) {
                    return c
                }
            }
        }
    }


    /*
     * 初始化事件
     * */

    function initEvents(vm) {
        vm._events = Object.create(null);
        vm._hasHookEvent = false;
        // init parent attached events  初始化 父亲事件
        var listeners = vm.$options._parentListeners;
        if (listeners) {
            //更新组件事件
            updateComponentListeners(vm, listeners);
        }
    }

    var target;

    /**
     * 添加事件
     * event 添加事件名称
     * fn 函数
     *
     *  */
    function add(event, fn, once) {
        if (once) {
            //第一个参数是事件类型，第二个参数是事件的函数
            target.$once(event, fn);
        } else {
            //第一个参数是事件类型，第二个参数是事件的函数
            target.$on(event, fn);
        }
    }

    //解绑事件
    function remove$1(event, fn) {
        target.$off(event, fn);
    }

    //更新组件事件
    function updateComponentListeners(vm,  //虚拟dom
                                      listeners,  //新的数据队列
                                      oldListeners //旧的事件数据队列
    ) {
        target = vm;
        //更新数据源 并且为新的值 添加函数 旧的值删除函数等功能
        updateListeners(listeners, oldListeners || {}, add, remove$1, vm);
        target = undefined;
    }

    /*
     初始化事件绑定方法
     *
     */
    function eventsMixin(Vue) {
        var hookRE = /^hook:/;  //开头是^hook: 的字符串
        /*
         * 添加绑定事件
         * vm._events[event]
         * */
        Vue.prototype.$on = function (event, fn) {
            var this$1 = this;

            var vm = this;
            //如果事件是数组
            if (Array.isArray(event)) {
                for (var i = 0, l = event.length; i < l; i++) {
                    //绑定事件
                    this$1.$on(event[i], fn);
                }
            } else {
                //把所有事件拆分存放到_events 数组中
                (vm._events[event] || (vm._events[event] = [])).push(fn);
                // optimize hook:event cost by using a boolean flag marked at registration
                // instead of a hash lookup
                //如果是 hook: 开头的标记为vue vue系统内置钩子函数 比如vue 生命周期函数等
                if (hookRE.test(event)) {
                    vm._hasHookEvent = true;
                }
            }
            return vm
        };
        /*
         *  添加事件
         * */
        Vue.prototype.$once = function (event, fn) {
            var vm = this;

            function on() {
                //解绑事件
                vm.$off(event, on);
                //执行事件
                fn.apply(vm, arguments);
            }

            on.fn = fn;
            //添加事件
            vm.$on(event, on);
            return vm
        };

        /*
         *  vue把事件添加到一个数组队列里面，通过删除该数组事件队列，而达到解绑事件
         * */
        Vue.prototype.$off = function (event, fn) {
            var this$1 = this;

            var vm = this;
            // all 如果没有参数的情况下 返回 this vm
            if (!arguments.length) {
                //创建一个事件对象
                vm._events = Object.create(null);
                return vm
            }
            // array of events 如果事件是数组事件 则循环回调递归
            if (Array.isArray(event)) {
                for (var i = 0, l = event.length; i < l; i++) {
                    this$1.$off(event[i], fn);
                }
                return vm
            }
            // specific event 特定的事件 如果事件不存在则返回vm
            var cbs = vm._events[event];
            if (!cbs) {
                return vm
            }
            if (!fn) {
                //如果函数不存在则清空函数对象属性
                vm._events[event] = null;
                return vm
            }
            if (fn) {
                // specific handler 具体的处理程序
                //如果函数存在 并且事件cbs是一个数组
                var cb;
                var i$1 = cbs.length;
                while (i$1--) {
                    cb = cbs[i$1];
                    if (cb === fn || cb.fn === fn) {
                        //清空事件数组
                        cbs.splice(i$1, 1);
                        break
                    }
                }
            }
            return vm
        };

        //触发事件
        Vue.prototype.$emit = function (event) {
            var vm = this;
            {
                var lowerCaseEvent = event.toLowerCase(); //转成小写
                //如果事件转成小写之后并不相等以前字符串，并且是不存在_events 事件队列中
                if (lowerCaseEvent !== event && vm._events[lowerCaseEvent]) {
                    //然后根据组件追踪发出一个警告
                    tip(
                        "Event \"" + lowerCaseEvent + "\" is emitted in component " +
                        (formatComponentName(vm)) + " but the handler is registered for \"" + event + "\". " +
                        "Note that HTML attributes are case-insensitive and you cannot use " +
                        "v-on to listen to camelCase events when using in-DOM templates. " +
                        "You should probably use \"" + (hyphenate(event)) + "\" instead of \"" + event + "\"."
                    );
                }
            }
            //获取事件值
            var cbs = vm._events[event];
            if (cbs) {
                //如果长度大于1 将它变成一个真正的数组
                cbs = cbs.length > 1 ? toArray(cbs) : cbs;
                //将参数变成一个真正数组
                var args = toArray(arguments, 1);
                //循环事件
                for (var i = 0, l = cbs.length; i < l; i++) {
                    try {
                        //执行触发事件
                        cbs[i].apply(vm, args);
                    } catch (e) {
                        //如果发生错误则发出报错警告
                        handleError(e, vm, ("event handler for \"" + event + "\""));
                    }
                }
            }
            return vm
        };
    }

    /*  */


    /**
     * Runtime helper for resolving raw children VNodes into a slot object.
     * 用于将原始子节点vnode解析为槽对象的运行时帮助器。
     *
     * 判断children 有没有分发式插槽 并且过滤掉空的插槽,并且收集插槽
     *
     */
    function resolveSlots(children,
                          context) {
        var slots = {};
        //如果没有子节点 则返回一个空对象
        if (!children) {
            return slots
        }
        //循环子节点
        for (var i = 0, l = children.length; i < l; i++) {
            //获取单个子节点
            var child = children[i];
            //获取子节点数据
            var data = child.data;
            // remove slot attribute if the node is resolved as a Vue slot node
            //如果节点被解析为Vue槽节点，则删除slot属性 slot 分发式属性
            if (data && data.attrs && data.attrs.slot) {
                delete data.attrs.slot;
            }
            //只有在
            // named slots should only be respected if the vnode was rendered in the
            //如果在VN节点中呈现VNT，则只应命名命名槽。

            // same context.
            //同样的背景。
            //context 上下文
            if ((child.context === context || child.fnContext === context) &&
                data && data.slot != null
            ) {
                //如果有内容分发 插槽
                var name = data.slot;
                var slot = (slots[name] || (slots[name] = []));
                //child 有模板
                if (child.tag === 'template') {
                    //把子节点的 子节点 添加 到slot插槽中
                    slot.push.apply(slot, child.children || []);
                } else {
                    //把子节点 添加 到slot插槽中
                    slot.push(child);
                }
            } else {
                //
                (slots.default || (slots.default = [])).push(child);
            }
        }
        // ignore slots that contains only whitespace
        //忽略只包含空白的槽
        for (var name$1 in slots) {
            //删除空的插槽
            if (slots[name$1].every(isWhitespace)) {
                delete slots[name$1];
            }
        }
        return slots
    }

    function isWhitespace(node) {
        //不是异步
        return (node.isComment && !node.asyncFactory) || node.text === ' '
    }

    //解决范围槽
    //把对象数组事件分解成 对象

    /*
     * [
     *
     * {
     *  key:'name',
     *  fn:()=>{}
     * },
     * {
     *  key:'name1',
     *  fn:()=>{}
     * },
     * {
     *  key:'name2',
     *  fn:()=>{}
     * },
     * {
     *  key:'name3',
     *  fn:()=>{}
     * },
     * ]
     * 变成
     * {
     *   name:()=>{},
     *   name1:()=>{},
     *   name2:()=>{},
     *   name3:()=>{},
     * }
     * */
    function resolveScopedSlots(fns, // see flow/vnode
                                res) {
        res = res || {};
        for (var i = 0; i < fns.length; i++) {  //
            if (Array.isArray(fns[i])) { //如果是数组则递归

                resolveScopedSlots(fns[i], res);
            } else {
                //可以去重
                res[fns[i].key] = fns[i].fn;
            }
        }
        return res
    }

    /*  */

    var activeInstance = null;
    var isUpdatingChildComponent = false;

    //初始化生命周期
    function initLifecycle(vm) {
        var options = vm.$options;

        // locate first non-abstract parent
        //定位第一个非抽象父节点
        var parent = options.parent;
        if (parent && !options.abstract) {
            //判断parent父亲节点是否存在，并且判断抽象节点是否存在
            while (parent.$options.abstract && parent.$parent) {
                //如果有父亲抽象节点，则把父层或爷爷节点   给当前节点的父亲节点
                parent = parent.$parent;
            }
            //子节点添加 vm
            parent.$children.push(vm);
        }
        //添加$parent 参数
        vm.$parent = parent;

        //判断parent 是否是顶层 root 如果是 则$root赋值给$root
        vm.$root = parent ? parent.$root : vm;

        // 情况 $children 节点
        vm.$children = [];
        //获取节点的key
        vm.$refs = {};

        vm._watcher = null; //观察者
        vm._inactive = null; //禁用的组件状态标志
        vm._directInactive = false;  // 不活跃 禁用的组件标志
        vm._isMounted = false; //标志是否 触发过 钩子Mounted
        vm._isDestroyed = false; //是否已经销毁的组件标志
        vm._isBeingDestroyed = false; //是否已经销毁的组件标志 如果为true 则不触发 beforeDestroy 钩子函数 和destroyed 钩子函数
    }

    //初始化vue 更新 销毁 函数
    function lifecycleMixin(Vue) {
        //更新数据函数
        Vue.prototype._update = function (vnode, hydrating) {
            var vm = this;

            if (vm._isMounted) {
                //触发更新数据 触发生命周期函数
                callHook(vm, 'beforeUpdate');
            }

            //获取 vue 的el节点
            var prevEl = vm.$el;
            //vue 的标准 vnode
            var prevVnode = vm._vnode;  //标志上一个 vonde
            console.log(prevVnode)

            var prevActiveInstance = activeInstance;
            activeInstance = vm;
            vm._vnode = vnode; //标志上一个 vonde
            // Vue.prototype.__patch__ is injected in entry points 注入入口点
            // based on the rendering backend used. 基于所使用的呈现后端。
            if (!prevVnode) { //如果这个prevVnode不存在表示上一次没有创建过vnode，这个组件或者new Vue 是第一次进来
                // initial render    起始指令
                //创建dmo 虚拟dom
                console.log('vm.$el=')
                console.log(vm.$el)
                console.log(['vnode=', vnode])
                console.log(['hydrating=', hydrating])
                console.log(['vm.$options._parentElm=', vm.$options._parentElm])
                console.log(['vm.$options._refElm=', vm.$options._refElm])
                console.log( '====vm.$el===')
                console.log( vm.$el)

                debugger;
                //更新虚拟dom
                vm.$el = vm.__patch__(
                    vm.$el, //真正的dom
                    vnode, //vnode
                    hydrating, // 空
                    false /* removeOnly */,
                    vm.$options._parentElm, //父节点 空
                    vm.$options._refElm //当前节点 空
                );
                console.log('=vm.$el=')
                console.log(vm.$el)
                // no need for the ref nodes after initial patch 初始补丁之后不需要ref节点
                // this prevents keeping a detached DOM tree in memory (#5851) 这可以防止在内存中保留分离的DOM树
                vm.$options._parentElm = vm.$options._refElm = null;
            } else { //如果这个prevVnode存在，表示vno的已经创建过，只是更新数据而已
                // updates 更新  上一个旧的节点prevVnode 更新虚拟dom
                vm.$el = vm.__patch__(prevVnode, vnode);
            }
            activeInstance = prevActiveInstance; //vue实例化的对象
            // update __vue__ reference 更新vue参考
            console.log('==prevEl==')
            console.log(prevEl)
            console.log(typeof prevEl)
            console.log(Object.prototype.toString.call(prevEl))
            console.log(vm);


            if (prevEl) {
                prevEl.__vue__ = null;
            }
            if (vm.$el) { //更新 __vue__
                vm.$el.__vue__ = vm;
            }
            // if parent is an HOC, update its $el as well
            //如果parent是一个HOC，那么也要更新它的$el
            if (vm.$vnode && vm.$parent && vm.$vnode === vm.$parent._vnode) {
                vm.$parent.$el = vm.$el;
            }
            // updated hook is called by the scheduler to ensure that children are
            //调度器调用update hook以确保子节点是
            // updated in a parent's updated hook.
            //在父类的更新钩子中更新。
        };

        //更新数据 观察者数据
        Vue.prototype.$forceUpdate = function () {
            var vm = this;
            //如果_watcher 观察者在就更新数据
            if (vm._watcher) {
                vm._watcher.update(); //更新观察者数据
            }
        };

        //销毁组建周期函数
        Vue.prototype.$destroy = function () {
            var vm = this;
            //如果是已经销毁过则不会再执行
            if (vm._isBeingDestroyed) {
                return
            }
            //触发生命周期beforeDestroy 钩子函数
            callHook(vm, 'beforeDestroy');
            vm._isBeingDestroyed = true;
            // remove self from parent
            //从父节点移除self
            var parent = vm.$parent;
            //删除父节点
            if (parent && !parent._isBeingDestroyed && !vm.$options.abstract) {
                remove(parent.$children, vm);
            }
            // teardown watchers 拆卸观察者
            if (vm._watcher) {
                vm._watcher.teardown();
            }
            //获取观察者的长度
            var i = vm._watchers.length;
            // //把观察者添加到队列里面 当前Watcher添加到vue实例上
            //vm._watchers.push(this);
            while (i--) {
                vm._watchers[i].teardown();
            }
            // remove reference from data ob
            //从数据ob中删除引用
            // frozen object may not have observer.
            //被冻结的对象可能没有观察者。
            if (vm._data.__ob__) {
                vm._data.__ob__.vmCount--;
            }
            // call the last hook...
            //调用最后一个钩子…
            vm._isDestroyed = true;
            // invoke destroy hooks on current rendered tree
            //调用当前渲染树上的销毁钩子
            vm.__patch__(vm._vnode, null);
            // fire destroyed hook
            // 销毁组建
            callHook(vm, 'destroyed');
            // turn off all instance listeners.
            //销毁事件监听器
            vm.$off();
            // remove __vue__ reference
            //删除vue 参数
            if (vm.$el) {
                vm.$el.__vue__ = null;
            }
            // release circular reference (#6759)
            //释放循环引用 销毁父节点
            if (vm.$vnode) {
                vm.$vnode.parent = null;
            }
        };
    }

    //安装组件
    function mountComponent(
                                vm,  //vnode
                                el,  //dom
                                hydrating
                             ) {
        vm.$el = el; //dom
        console.log(vm.$options.render)

        //如果参数中没有渲染
        if (!vm.$options.render) { //实例化vm的渲染函数，虚拟dom调用参数的渲染函数
            //创建一个空的组件
            vm.$options.render = createEmptyVNode;

            {
                /* istanbul ignore if */
                //如果参数中的模板第一个不为# 号则会 警告
                if ((vm.$options.template && vm.$options.template.charAt(0) !== '#') ||
                    vm.$options.el || el) {
                    warn(
                        'You are using the runtime-only build of Vue where the template ' +
                        'compiler is not available. Either pre-compile the templates into ' +
                        'render functions, or use the compiler-included build.',
                        vm
                    );
                } else {
                    warn(
                        'Failed to mount component: template or render function not defined.',
                        vm
                    );
                }
            }
        }



        //执行生命周期函数 beforeMount
        callHook(vm, 'beforeMount');
        //更新组件
        var updateComponent;
        /* istanbul ignore if */
        //如果开发环境
        if ("development" !== 'production' && config.performance && mark) {
            updateComponent = function () {
                var name = vm._name;
                var id = vm._uid;
                var startTag = "vue-perf-start:" + id;
                var endTag = "vue-perf-end:" + id;

                mark(startTag); //插入一个名称 并且记录插入名称的时间
                var vnode = vm._render();
                mark(endTag);
                measure(("vue " + name + " render"), startTag, endTag);

                mark(startTag); //浏览器 性能时间戳监听
                //更新组件
                vm._update(vnode, hydrating);
                mark(endTag);
                measure(("vue " + name + " patch"), startTag, endTag);
            };
        } else {
            updateComponent = function () {
                console.log(vm._render())


                //直接更新view试图
                vm._update(

                    /*
                     render 是  虚拟dom，需要执行的编译函数 类似于这样的函数
                     (function anonymous( ) {
                     with(this){return _c('div',{attrs:{"id":"app"}},[_c('input',{directives:[{name:"info",rawName:"v-info"},{name:"data",rawName:"v-data"}],attrs:{"type":"text"}}),_v(" "),_m(0)])}
                     })
                     */
                    vm._render(), //先执行_render,返回vnode
                    hydrating
                );
            };
        }

        // we set this to vm._watcher inside the watcher's constructor
        // since the watcher's initial patch may call $forceUpdate (e.g. inside child
        // component's mounted hook), which relies on vm._watcher being already defined
        //我们将其设置为vm。在观察者的构造函数中
        //因为观察者的初始补丁可能调用$forceUpdate(例如inside child)
        //组件的挂载钩子)，它依赖于vm。_watcher已经定义
        //创建观察者
        new Watcher(
            vm,  //vm vode
            updateComponent, //数据绑定完之后回调该函数。更新组件函数 更新 view试图
            noop, //回调函数
            null, //参数
            true //是否渲染过得观察者
            /* isRenderWatcher */);
        hydrating = false;

        // manually mounted instance, call mounted on self
        // mounted is called for render-created child components in its inserted hook
        //手动挂载实例，调用挂载在self上
        // 在插入的钩子中为呈现器创建的子组件调用// mount
        if (vm.$vnode == null) {
            vm._isMounted = true;
            //执行生命周期函数mounted
            callHook(vm, 'mounted');
        }

        return vm
    }

    //更新子组件 循环props 把他们添加到观察者中 ，更新事件
    function updateChildComponent(
                                  vm,// 虚拟dom vonde
                                  propsData, //props 数据属性
                                  listeners, //事件
                                  parentVnode, //父亲 虚拟dom vonde
                                  renderChildren) { //子节点
        {
            isUpdatingChildComponent = true; //标志 是否已经更新过了子组件
        }


        // determine whether component has slot children 确定组件是否有槽子组件
        // we need to do this before overwriting $options._renderChildren 在覆盖$options._renderChildren之前，我们需要这样做
        //
        var hasChildren = !!(
            renderChildren ||               // has new static slots  是否有新的静态插槽
            vm.$options._renderChildren ||  // has old static slots  是否有旧的 静态插槽
            parentVnode.data.scopedSlots || // has new scoped slots  是否有范围插槽
            vm.$scopedSlots !== emptyObject // has old scoped slots  是否有旧的范围插槽 emptyObject 是一个空的对象
        );

        vm.$options._parentVnode = parentVnode; //父亲 虚拟dom vonde
        vm.$vnode = parentVnode; // update vm's placeholder node without re-render 无需重新渲染即可更新vm的占位符节点

        if (vm._vnode) { // update child tree's parent 更新子树的父树
            vm._vnode.parent = parentVnode;
        }
        vm.$options._renderChildren = renderChildren; //子节点

        // update $attrs and $listeners hash
        // these are also reactive so they may trigger child update if the child
        // used them during render
        //更新$attrs和$listener散列
        //它们也是反应性的，因此如果子进程更新，它们可能触发子进程更新
        //渲染时使用它们
        vm.$attrs = parentVnode.data.attrs || emptyObject; //虚拟dom的属性
        vm.$listeners = listeners || emptyObject; //虚拟dom的 事件

        // update props  更新props 属性
        if (propsData && vm.$options.props) {
            toggleObserving(false); // 标志是否禁止还是添加到观察者模式
            var props = vm._props;  //获取属性对象
            var propKeys = vm.$options._propKeys || []; //获取属性的prop的key
            for (var i = 0; i < propKeys.length; i++) { //循环props属性
                var key = propKeys[i]; //获取props 单个 属性的key
                var propOptions = vm.$options.props; // wtf flow?
                /*
                 验证支柱  验证 prosp 是否是规范数据 并且为props 添加 value.__ob__  属性，把prosp添加到观察者中
                 *  校验 props 参数 就是组建 定义的props 类型数据，校验类型
                 *
                 * 判断prop.type的类型是不是Boolean或者String，如果不是他们两类型，调用getPropDefaultValue获取默认值并且把value添加到观察者模式中
                 */
                props[key] = validateProp(key, propOptions, propsData, vm);
            }
            toggleObserving(true);

            // keep a copy of raw propsData
            //保留原始propsData的副本
            vm.$options.propsData = propsData;
        }

        // update listeners 更新事件
        listeners = listeners || emptyObject;
        var oldListeners = vm.$options._parentListeners; //旧的事件
        vm.$options._parentListeners = listeners; //新的事件
        //更新组件事件
        updateComponentListeners(vm, listeners, oldListeners);

        // resolve slots + force update if has children
        //解决插槽+强制更新如果有 子节点
        if (hasChildren) {
            //判断children 有没有分发式插槽 并且过滤掉空的插槽,并且收集插槽
            vm.$slots = resolveSlots(renderChildren, parentVnode.context);
            //更新数据 观察者数据
            vm.$forceUpdate();
        }

        {
            isUpdatingChildComponent = false;
        }
    }

    //循环父树层 如果有不活跃的则返回真
    function isInInactiveTree(vm) { //活动中的树
        while (vm && (vm = vm.$parent)) { //循环父节点如果父节点有_inactive 则返回true
            if (vm._inactive) { //不活跃
                return true
            }
        }
        return false
    }

    //判断是否有不活跃的组件 禁用他 如果有活跃组件则触发钩子函数activated
    function activateChildComponent(vm, // 虚拟dom vode
                                    direct //布尔值
    ) {
        if (direct) {
            vm._directInactive = false;
            if (isInInactiveTree(vm)) { //如果有不活跃的树，或者被禁用组件
                return
            }
        } else if (vm._directInactive) { //单个不活跃的
            return
        }
        if (vm._inactive || vm._inactive === null) { //如果 _inactive=true 不活跃组件 或者 vm._inactive === null
            vm._inactive = false;
            for (var i = 0; i < vm.$children.length; i++) { //循环禁止子组件
                activateChildComponent(vm.$children[i]); //递归循环 禁用子组件
            }
            callHook(vm, 'activated'); //触发activated 生命周期钩子函数
        }
    }

    // 循环子组件 和父组件  判断是否有禁止的组件 如果有活跃组件则执行生命后期函数deactivated
    function deactivateChildComponent(vm, direct) {
        if (direct) {
            vm._directInactive = true;
            if (isInInactiveTree(vm)) {
                return
            }
        }
        if (!vm._inactive) { //如果该组件是活跃的
            vm._inactive = true; //设置活动中的树
            for (var i = 0; i < vm.$children.length; i++) {
                deactivateChildComponent(vm.$children[i]);
            }
            //执行生命周期函数deactivated
            callHook(vm, 'deactivated');
        }
    }

    //触发钩子函数
    function callHook(vm,  //虚拟dom  vonde
                      hook //钩子函数的key
    ) {
        // #7573 disable dep collection when invoking lifecycle hooks
        //调用生命周期钩子时禁用dep集合
        //Dep.target = _target; //存储
        pushTarget();
        //在vm 中添加声明周期函数
        var handlers = vm.$options[hook];
        console.log('hook=' + hook)
        console.log('vm.$options[hook]')
        console.log(vm.$options[hook])
        console.log('==handlers==')
        console.log(handlers)
        if (handlers) {  //数组
            for (var i = 0, j = handlers.length; i < j; i++) {
                try {
                    //执行生命周期函数
                    handlers[i].call(vm);
                } catch (e) {
                    handleError(e, vm, (hook + " hook"));
                }
            }
        }
        if (vm._hasHookEvent) {
            vm.$emit('hook:' + hook);
        }
        popTarget();
    }

    /*  */


    var MAX_UPDATE_COUNT = 100;

    var queue = []; //记录观察者队列的数组
    var activatedChildren = []; //记录活跃的子组件
    var has = {}; //  记录观察者的id
    var circular = {}; //持续循环更新的次数，如果超过100次 则判断已经进入了死循环，则会报错
    var waiting = false; //观察者在更新数据时候 等待的标志
    var flushing = false; //进入flushSchedulerQueue 函数等待标志
    var index = 0; //queue 观察者队列的索引

    /**
     * Reset the scheduler's state.
     * 重置调度程序的状态。
     * 清空观察者watcher队列中的数据
     */
    function resetSchedulerState() {
        index = queue.length = activatedChildren.length = 0;
        has = {}; //观察者记录的id
        {
            circular = {};
        }
        waiting = flushing = false;
    }

    /**
     * Flush both queues and run the watchers. 刷新两个队列并运行监视程序。
     * 更新观察者 运行观察者watcher.run() 函数 并且   调用组件更新和激活的钩子
     */
    function flushSchedulerQueue() {
        flushing = true;
        var watcher, id;

        // Sort queue before flush.
        // This ensures that:
        // 1. Components are updated from parent to child. (because parent is always
        //    created before the child)
        // 2. A component's user watchers are run before its render watcher (because
        //    user watchers are created before the render watcher)
        // 3. If a component is destroyed during a parent component's watcher run,
        //    its watchers can be skipped.
        //刷新前对队列排序。
        //这确保:
        // 1。组件从父组件更新到子组件。因为父母总是在孩子之前创建)
        // 2。组件的用户观察者在其呈现观察者之前运行(因为用户观察者是在渲染观察者之前创建的)
        // 3。如果一个组件在父组件的监视程序运行期间被销毁，可以跳过它的观察者。
        //观察者根据id去排序
        queue.sort(function (a, b) {
            return a.id - b.id;
        });

        // do not cache length because more watchers might be pushed 不要缓存长度，因为可能会推入更多的观察者
        // as we run existing watchers 我们运行现有的观察者
        for (index = 0; index < queue.length; index++) {
            watcher = queue[index]; //获取单个观察者
            id = watcher.id;
            has[id] = null;
            watcher.run(); //运行观察者
            // in dev build, check and stop circular updates. 在dev build中，检查并停止循环更新。
            if ("development" !== 'production' && has[id] != null) {
                circular[id] = (circular[id] || 0) + 1;
                if (circular[id] > MAX_UPDATE_COUNT) {
                    warn(
                        'You may have an infinite update loop ' + (
                            watcher.user
                                ? ("in watcher with expression \"" + (watcher.expression) + "\"")
                                : "in a component render function."
                        ),
                        watcher.vm
                    );
                    break
                }
            }
        }

        // keep copies of post queues before resetting state 在重置状态之前保留post队列的副本
        var activatedQueue = activatedChildren.slice(); // 浅拷贝
        var updatedQueue = queue.slice();// 浅拷贝

        //清空观察者watcher队列中的数据
        resetSchedulerState();

        // call component updated and activated hooks 调用组件更新和激活的钩子
        callActivatedHooks(activatedQueue);
        callUpdatedHooks(updatedQueue);

        // devtool hook
        /* istanbul ignore if */
        //触发父层flush 钩子函数
        if (devtools && config.devtools) {
            devtools.emit('flush');
        }
    }

    //触发更新updated 钩子函数
    function callUpdatedHooks(queue) {
        var i = queue.length;
        while (i--) {
            var watcher = queue[i];
            var vm = watcher.vm; //获取到虚拟dom
            if (vm._watcher === watcher && vm._isMounted) { //判断watcher与vm._watcher 相等 _isMounted已经更新触发了 mounted 钩子函数
                //触发updated 更新数据钩子函数
                callHook(vm, 'updated');
            }
        }
    }

    /**
     * Queue a kept-alive component that was activated during patch. 对补丁期间激活的kept-alive组件进行队列。
     * The queue will be processed after the entire tree has been patched. 队列将在整个树被修补之后处理。
     * 添加活跃的组件函数 把活跃的vm添加到activatedChildren 中
     */
    function queueActivatedComponent(vm) {
        // setting _inactive to false here so that a render function can 在这里将_inactive设置为false，以便呈现函数可以
        // rely on checking whether it's in an inactive tree (e.g. router-view) 依赖于检查它是否在非活动树中(例如router-view)
        vm._inactive = false;
        activatedChildren.push(vm);
    }

    //  调用组件激活的钩子
    function callActivatedHooks(queue) {
        for (var i = 0; i < queue.length; i++) {
            queue[i]._inactive = true;
            //判断是否有不活跃的组件 禁用他 如果有活跃组件则触发钩子函数activated
            activateChildComponent(queue[i], true /* true */);
        }
    }

    /**
     * Push a watcher into the watcher queue. *将一个观察者推入观察者队列。
     * Jobs with duplicate IDs will be skipped unless it's id重复的作业将被跳过，除非是
     * pushed when the queue is being flushed. *刷新队列时推送。
     *
     * 将观察者推进 queue 队列中 过滤重复的 id 除非是*刷新队列时推送。
     */
    function queueWatcher(watcher) {
        var id = watcher.id;
        if (has[id] == null) {
            has[id] = true;
            // flushing=true; //这个标志需要去掉
            console.log(flushing)

            if (!flushing) {
                queue.push(watcher); //把观察者添加到队列中
            } else {
                // if already flushing, splice the watcher based on its id 如果已经刷新，则根据监视程序的id拼接它
                // if already past its id, it will be run next immediately. 如果已经通过了它的id，那么将立即运行next。
                var i = queue.length - 1;
                while (i > index && queue[i].id > watcher.id) {
                    i--;
                }
                //根据id大小拼接插入在数组的哪个位置
                queue.splice(i + 1, 0, watcher);
            }
            console.log(waiting)

            // queue the flush
            if (!waiting) {
                waiting = true;
                //为callbacks 收集队列cb 函数 并且根据 pending 状态是否要触发callbacks 队列函数
                nextTick(
                    flushSchedulerQueue//更新观察者 运行观察者watcher.run() 函数 并且   调用组件更新和激活的钩子
                );
            }
        }
    }

    /*  */

    var uid$1 = 0; //观察者的id

    /**
     * A watcher parses an expression, collects dependencies,
     * and fires callback when the expression value changes.
     * This is used for both the $watch() api and directives.
     * *观察者分析表达式，收集依赖项，
     *并在表达式值更改时触发回调。
     *这用于$watch() api和指令。
     * 当前vue实例、updateComponent函数、空函数。
     */
    var Watcher = function Watcher(
                                   vm, //vm dom
                                   expOrFn,  //获取值的函数，或者是更新viwe试图函数
                                   cb, //回调函数,回调值给回调函数
                                   options, //参数
                                   isRenderWatcher//是否渲染过得观察者
    ) {
        console.log('====Watcher====')
        this.vm = vm;
        //是否是已经渲染过得观察者
        if (isRenderWatcher) { //把当前 Watcher 对象赋值给 vm._watcher上
            vm._watcher = this;
        }
        //把观察者添加到队列里面 当前Watcher添加到vue实例上
        vm._watchers.push(this);
        // options
        if (options) { //如果有参数
            this.deep = !!options.deep; //实际
            this.user = !!options.user; //用户
            this.lazy = !!options.lazy; //懒惰 ssr 渲染
            this.sync = !!options.sync; //如果是同步
        } else {

            this.deep = this.user = this.lazy = this.sync = false;
        }
        this.cb = cb; //回调函数
        this.id = ++uid$1; // uid for batching uid为批处理  监听者id
        this.active = true; //激活
        this.dirty = this.lazy; // for lazy watchers 对于懒惰的观察者
        this.deps = [];    // 观察者队列
        this.newDeps = []; // 新的观察者队列
        // 内容不可重复的数组对象
        this.depIds = new _Set();
        this.newDepIds = new _Set();
        // 把函数变成字符串形式
        this.expression = expOrFn.toString();
        // parse expression for getter
        //getter的解析表达式
        if (typeof expOrFn === 'function') {
            //获取值的函数
            this.getter = expOrFn;
        } else {
            //如果是keepAlive 组件则会走这里
            //path 因该是路由地址
            if (bailRE.test(path)) {  //  匹配上 返回 true     var bailRE = /[^\w.$]/;  //匹配不是 数字字母下划线 $符号   开头的为true
                return
            }

            // //匹配不上  path在已点分割
            // var segments = path.split('.');
            // return function (obj) {
            //
            //     for (var i = 0; i < segments.length; i++) {
            //         //如果有参数则返回真
            //         if (!obj) {
            //             return
            //         }
            //         //将对象中的一个key值 赋值给该对象 相当于 segments 以点拆分的数组做obj 的key
            //         obj = obj[segments[i]];
            //     }
            //     //否则返回一个对象
            //     return obj
            // }

            //匹配不是 数字字母下划线 $符号   开头的为true

            this.getter = parsePath(expOrFn);
            if (!this.getter) { //如果不存在 则给一个空的数组
                this.getter = function () {
                };
                "development" !== 'production' && warn(
                    "Failed watching path: \"" + expOrFn + "\" " +
                    'Watcher only accepts simple dot-delimited paths. ' +
                    'For full control, use a function instead.',
                    vm
                );
            }
        }
        this.value = this.lazy ?  //   lazy为真的的时候才能获取值  这个有是组件才为真
            undefined :
            this.get(); //计算getter，并重新收集依赖项。 获取值
    };

    /**
     * Evaluate the getter, and re-collect dependencies.
     * 计算getter，并重新收集依赖项。 获取value值
     */
    Watcher.prototype.get = function get() {
        //添加一个dep target
        pushTarget(this);
        var value;
        var vm = this.vm;
        try {
            console.log(this.getter)
            //获取值 如果报错 则执行catch
            value = this.getter.call(vm, vm);
            console.log(value)

        } catch (e) {
            if (this.user) {
                handleError(e, vm, ("getter for watcher \"" + (this.expression) + "\""));
            } else {
                throw e
            }
        } finally {
            // "touch" every property so they are all tracked as
            // dependencies for deep watching
            //“触摸”每个属性，以便它们都被跟踪为
            //依赖深度观察
            if (this.deep) {

                // //如果val 有__ob__ 属性
                // if (val.__ob__) {
                //     var depId = val.__ob__.dep.id;
                //     // seen 中是否含有depId 属性或者方法
                //     if (seen.has(depId)) {
                //         return
                //     }
                //     //如果没有则添加进去
                //     seen.add(depId);
                // }
                //为 seenObjects 深度收集val 中的key
                traverse(value);
            }
            // 出盏一个pushTarget
            popTarget();
            //清理依赖项集合。
            this.cleanupDeps();
        }
        //返回值
        return value
    };

    /**
     * Add a dependency to this directive. 向该指令添加依赖项。
     */
    Watcher.prototype.addDep = function addDep(dep) {
        var id = dep.id; //dep.id 一个持续相加的id
        if (!this.newDepIds.has(id)) {//如果id存在
            this.newDepIds.add(id); //添加一个id
            this.newDeps.push(dep); //添加一个deps
            if (!this.depIds.has(id)) {  //如果depIds 不存在id则添加一个addSub  //添加一个sub
                dep.addSub(this);
            }
        }
    };

    /**
     * Clean up for dependency collection.
     * 清理观察者依赖项集合。
     */
    Watcher.prototype.cleanupDeps = function cleanupDeps() {
        var this$1 = this;
        var i = this.deps.length; //遍历
        while (i--) {
            var dep = this$1.deps[i];
            if (!this$1.newDepIds.has(dep.id)) {
                //清除 sub
                dep.removeSub(this$1);
            }
        }
        var tmp = this.depIds; //获取depid
        this.depIds = this.newDepIds; //获取新的depids
        this.newDepIds = tmp;  //旧的覆盖新的
        this.newDepIds.clear(); //清空对象

        //互换值
        tmp = this.deps; //
        this.deps = this.newDeps;
        this.newDeps = tmp;
        this.newDeps.length = 0;
    };

    /**
     * Subscriber interface.用户界面。
     * Will be called when a dependency changes.
     * 将在依赖项更改时调用。
     */
    Watcher.prototype.update = function update() {

        /* istanbul ignore else  伊斯坦布尔忽略其他 */
        if (this.lazy) { //懒惰的 忽略
            this.dirty = true;

        } else if (this.sync) { //如果是同步

            //更新数据
            this.run();
        } else {

            //如果是多个观察者
            queueWatcher(this); //队列中的观察者
        }
    };

    /**
     * Scheduler job interface. 调度器的工作界面。
     * Will be called by the scheduler. 将被调度程序调用。
     */
    Watcher.prototype.run = function run() {
        if (this.active) { //活跃
            var value = this.get(); //获取值 函数 expOrFn
            if (
                value !== this.value ||  //如果值不相等
                // Deep watchers and watchers on Object/Arrays should fire even 深度观察和对象/数组上的观察应该是均匀的
                // when the value is the same, because the value may 当值相等时，因为值可以
                // have mutated. 有突变。
                isObject(value) || //或者值的object
                this.deep  //获取deep为true
            ) {
                // set new value
                var oldValue = this.value; //获取旧的值
                this.value = value; //新的值赋值
                if (this.user) { //如果是user 用更新值
                    try {
                        this.cb.call(this.vm, value, oldValue); //更新回调函数  获取到新的值 和旧的值
                    } catch (e) {
                        handleError(e, this.vm, ("callback for watcher \"" + (this.expression) + "\""));
                    }
                } else {
                    this.cb.call(this.vm, value, oldValue);//更新回调函数  获取到新的值 和旧的值
                }
            }
        }
    };

    /**
     * Evaluate the value of the watcher. 评估观察者的值。
     * This only gets called for lazy watchers. 这只适用于懒惰的观察者。
     */
    Watcher.prototype.evaluate = function evaluate() {
        this.value = this.get(); //获取值
        this.dirty = false; // 懒惰者标志  标志已经获取过一次值
    };

    /**
     * Depend on all deps collected by this watcher.
     * 依赖于此监视程序收集的所有dep。
     * 循环deps 收集 newDeps dep 当newDeps 数据被清空的时候重新收集依赖
     */
    Watcher.prototype.depend = function depend() {
        // this.newDeps.push(dep); //添加一个deps
        //deps=this.newDeps
        var this$1 = this;
        var i = this.deps.length;
        console.log('==  this.deps.length  ==')
        while (i--) {
            // 为Watcher 添加dep 对象
            // this.newDeps.push(dep); //添加一个deps
            this$1.deps[i].depend();
        }
    };

    /**
     * Remove self from all dependencies' subscriber list.
     * 从所有依赖项的订阅方列表中删除self。
     */
    Watcher.prototype.teardown = function teardown() {
        var this$1 = this;
        if (this.active) {
            // remove self from vm's watcher list 从vm的监视者列表中删除self
            // this is a somewhat expensive operation so we skip it 这是一个有点昂贵的操作，所以我们跳过它
            // if the vm is being destroyed. 如果vm被销毁。
            if (!this.vm._isBeingDestroyed) { //是否销毁的标志
                remove(this.vm._watchers, this); //删除观察者
            }
            var i = this.deps.length;
            while (i--) {
                //删除 removeSub
                this$1.deps[i].removeSub(this$1);
            }
            this.active = false;
        }
    };

    /*
     *
     Object.defineProperty(person,'name',{
     configurable:false,//能否使用delete、能否需改属性特性、或能否修改访问器属性、，false为不可重新定义，默认值为true 是否可以编辑
     enumerable:false,//对象属性是否可通过for-in循环，flase为不可循环，默认值为true 是否可以枚举遍历
     writable:false,//对象属性是否可修改,flase为不可修改，默认值为true
     value:'' //对象属性的默认值，默认值为undefined
     });
     * */
    var sharedPropertyDefinition = { //共享属性定义
        enumerable: true,
        configurable: true,
        get: noop,
        set: noop
    };

    // var Odata={
    //     data:{
    //         name:'yao',
    //         age:28,
    //         array:[1,2,3,4,5,6,7,8,9],
    //         obj:{
    //             area:'guangxi',
    //             work:'engineer'
    //
    //         }
    //     }
    // }
    // 设置 监听 观察者, 该函数是可以让 对象中的三级key 直接冒泡到1级key中
    //比如 name 只能在Odata.data.name 获取到数据，执行 proxy(Odata,'data','name')之后可以Odata.name 获取值
    function proxy(target, sourceKey, key) {
        sharedPropertyDefinition.get = function proxyGetter() { //设置get函数
            return this[sourceKey][key]
        };
        sharedPropertyDefinition.set = function proxySetter(val) {//设置set函数
            this[sourceKey][key] = val;
        };
        Object.defineProperty(target, key, sharedPropertyDefinition); //设置监听观察者
    }

    //初始化状态
    function initState(vm) {
        vm._watchers = []; //初始化观察者队列
        var opts = vm.$options; //初始化参数
        //判断是否有props属性，如果有则添加观察者
        if (opts.props) {
            //初始化props 检验props 数据格式是否是规范的如果是规范的则添加到观察者队列中
            initProps(vm, opts.props);
        }


        if (opts.methods) { //事件
            //   初始化事件Methods 把事件 冒泡到 vm[key] 虚拟dom  最外层中
            initMethods(vm, opts.methods);
        }
        if (opts.data) { //初始化数据
            // 初始化数据 获取options.data 的数据 将他们添加到 监听者中
            console.log(vm)

            initData(vm);
            console.log(vm)

        } else {
            console.log('vm._data')
            console.log(vm._data)


            //  判断value 是否有__ob__    实例化 dep对象,获取dep对象  为 value添加__ob__ 属性，把vm._data添加到观察者中  返回 new Observer 实例化的对象
            observe(vm._data = {}, true /* asRootData */);

        }
        if (opts.computed) { //计算属性
            //初始化计算属性 并且判断属性的key 是否 在 data ，将 计算属性的key 添加入监听者中
            initComputed(vm, opts.computed);
        }
        //options 中的 watch
        if (opts.watch && opts.watch !== nativeWatch) {
            //初始化Watch
            initWatch(vm, opts.watch);
        }
    }

    //初始化props 检验props 数据格式是否是规范的如果是规范的则添加到观察者队列中
    function initProps(vm, propsOptions) {
        var propsData = vm.$options.propsData || {};
        var props = vm._props = {};
        // cache prop keys so that future props updates can iterate using Array
        //缓存道具键，以便以后道具更新可以使用数组迭代
        // instead of dynamic object key enumeration.
        //而不是动态对象键枚举。
        var keys = vm.$options._propKeys = [];
        var isRoot = !vm.$parent;
        // root instance props should be converted
        //应该转换根实例道具
        if (!isRoot) {  //则不会监听 观察者
            toggleObserving(false);
        }
        var loop = function (key) {
            keys.push(key);
            /*
             验证支柱  验证 prosp 是否是规范数据 并且为props 添加 value.__ob__  属性，把prosp添加到观察者中
             *  校验 props 参数 就是组建 定义的props 类型数据，校验类型
             *
             * 判断prop.type的类型是不是Boolean或者String，如果不是他们两类型，调用getPropDefaultValue获取默认值并且把value添加到观察者模式中
             */
            var value = validateProp(
                                        key, //props 对象的key
                                        propsOptions,
                                        propsData,
                                        vm
                                    );
            /* istanbul ignore else 伊斯坦布尔忽略其他 */
            {
                //大写字母，加完减号又转成小写了 比如把驼峰 aBc 变成了 a-bc
                //匹配大写字母并且两面不是空白的 替换成 - 在转换成小写
                var hyphenatedKey = hyphenate(key);
                // 检查属性是否为保留属性。
                //var isReservedAttribute = makeMap('key,ref,slot,slot-scope,is');
                if (isReservedAttribute(hyphenatedKey) ||
                    config.isReservedAttr(hyphenatedKey)) {
                    //输出警告
                    warn(
                        ("\"" + hyphenatedKey + "\" is a reserved attribute and cannot be used as component prop."),
                        vm
                    );
                }
                //通过defineProperty的set方法去通知notify()订阅者subscribers有新的值修改
                defineReactive(props, key, value, function () {
                    if (vm.$parent && !isUpdatingChildComponent) {
                        warn(
                            "Avoid mutating a prop directly since the value will be " +
                            "overwritten whenever the parent component re-renders. " +
                            "Instead, use a data or computed property based on the prop's " +
                            "value. Prop being mutated: \"" + key + "\"",
                            vm
                        );
                    }
                });
            }
            // static props are already proxied on the component's prototype
            // during Vue.extend(). We only need to proxy props defined at
            // instantiation here.
            if (!(key in vm)) { //如果vm中没有props属性，则把他添加到vm中，这样组件this.[propsKey] 就可以获取到值了
                proxy(vm, "_props", key);
            }
        };
        //循环校验 props 是否 是合格数据 并且添加观察者
        for (var key in propsOptions) loop(key);
        toggleObserving(true);
    }

    //初始化数据 获取options.data 的数据 将他们添加到 监听者中
    function initData(vm) {
        //获取到$options.data 数据
        var data = vm.$options.data;

        //获取data中的数据   判断如果是函数则
        data = vm._data = typeof data === 'function' //如果data是函数
            ? getData(data, vm)  //转换数据 如果数据是 一个函数的时候 执行该函数 拿到数据
            : data || {}; //直接获取数据

        if (!isPlainObject(data)) { //如果不是对象 则发出警告日志
            data = {};
            "development" !== 'production' && warn(
                'data functions should return an object:\n' +
                'https://vuejs.org/v2/guide/components.html#data-Must-Be-a-Function',
                vm
            );
        }
        // proxy data on instance
        var keys = Object.keys(data); //获取数据的key
        var props = vm.$options.props; //获取props 属性
        var methods = vm.$options.methods; //获取事件
        var i = keys.length; //获取数据key的长度
        while (i--) { //循环data
            var key = keys[i];
            {
                if (methods && hasOwn(methods, key)) { //如果数据中的 key 与事件 中的定义的key 一样 则发出警告
                    warn(
                        ("Method \"" + key + "\" has already been defined as a data property."),
                        vm
                    );
                }
            }

            if (props && hasOwn(props, key)) { //如果数据中的 key 与props属性 中的定义的key 一样 则发出警告
                "development" !== 'production' && warn(
                    "The data property \"" + key + "\" is already declared as a prop. " +
                    "Use prop default value instead.",
                    vm
                );
            } else if (!isReserved(key)) { //如果不是 以$或者_开头
                console.log(vm)
                console.log(key)

                proxy(vm, "_data", key); //把数据添加到监听者中
                console.log(vm)


            }
        }
        // observe data
        console.log('data')
        console.log(data)

        observe(data, true /* asRootData */);
    }

    //转换数据 如果数据是 一个函数的时候 执行该函数 拿到数据
    function getData(data, vm) {
        // #7573 disable dep collection when invoking data getters
        //调用数据getter时禁用dep收集
        pushTarget();
        try {
            //执行函数 获取数据
            return data.call(vm, vm)
        } catch (e) {
            //收集错误信息
            handleError(e, vm, "data()");
            return {}
        } finally {
            //调用数据getter时禁用dep收集
            popTarget();
        }
    }

    var computedWatcherOptions = {lazy: true};

    //初始化计算属性 并且判断属性的key 是否 在 data ，将 计算属性的key 添加入监听者中
    function initComputed(vm, computed) {
        // $flow-disable-line
        //创建一个新的监听者对象空对象
        var watchers = vm._computedWatchers = Object.create(null);
        // computed properties are just getters during SSR 计算的属性只是SSR期间的getter
        var isSSR = isServerRendering(); // 服务器呈现  判断是不是node 服务器环境

        for (var key in computed) {
            var userDef = computed[key]; //获取值
            var getter = typeof userDef === 'function' ? userDef : userDef.get; //获取值函数
            if ("development" !== 'production' && getter == null) { //如果getter 是 空 警告
                warn(
                    ("Getter is missing for computed property \"" + key + "\"."),
                    vm
                );
            }

            if (!isSSR) { //如果不是node ssr渲染
                // create internal watcher for the computed property.
                watchers[key] = new Watcher(
                    vm, //vm  vode
                    getter || noop,  //函数
                    noop,  //回调函数
                    computedWatcherOptions  //参数 lazy = true
                );
            }

            // component-defined computed properties are already defined on the 组件定义的计算属性已经在
            // component prototype. We only need to define computed properties defined 组件原型。我们只需要定义已定义的计算属性
            // at instantiation here. 在实例化。
            if (!(key in vm)) { //如果computed 属性key 不在虚拟dom中
                defineComputed(vm, key, userDef); //定义计算属性 并且 把属性的数据 添加到对象监听中
            } else {
                if (key in vm.$data) {  //如果判断属性监听的key在 data 中则发出警告
                    warn(("The computed property \"" + key + "\" is already defined in data."), vm);
                } else if (vm.$options.props && key in vm.$options.props) {
                    warn(("The computed property \"" + key + "\" is already defined as a prop."), vm);
                }
            }
        }
    }

    //定义计算属性 并且 把属性的数据 添加到对象监听中
    function defineComputed(target, //目标
                            key, //key
                            userDef //值
    ) {
        var shouldCache = !isServerRendering(); //如果不是node服务器 是浏览器
        if (typeof userDef === 'function') { //属性的值如果是个函数
            sharedPropertyDefinition.get = shouldCache
                ? createComputedGetter(key) //如果不是node服务器 是浏览器    创建计算属性 获取值 收集 dep 依赖
                : userDef; //node 服务器取值 直接调用该函数
            sharedPropertyDefinition.set = noop; //赋值一个空函数
        } else {
            sharedPropertyDefinition.get = userDef.get ?//如果userDef.get 存在
                (shouldCache && userDef.cache !== false ? //缓存
                        createComputedGetter(key) :  //创建计算属性 获取值 收集 dep 依赖
                        userDef.get
                ) :
                noop;  //如果userDef.get 不存在给一个空的函数
            sharedPropertyDefinition.set = userDef.set //如果userDef.set 存在
                ? userDef.set
                : noop;
        }
        if ("development" !== 'production' &&
            sharedPropertyDefinition.set === noop) { //如果设置值等于一个空函数则警告
            sharedPropertyDefinition.set = function () {
                warn(
                    ("Computed property \"" + key + "\" was assigned to but it has no setter."),
                    this
                );
            };
        }
        //添加对象监听
        Object.defineProperty(target, key, sharedPropertyDefinition);
    }

    //创建计算属性 获取值 收集 dep 依赖
    function createComputedGetter(key) {
        return function computedGetter() {
            // Watcher 实例化之后的对象
            var watcher = this._computedWatchers && this._computedWatchers[key];
            if (watcher) {
                if (watcher.dirty) {
                    //this.value 获取值 this.getter
                    watcher.evaluate(); //评估
                }
                if (Dep.target) {
                    //为Watcher 添加 为Watcher.newDeps.push(dep); 一个dep对象
                    //循环deps 收集 newDeps dep 当newDeps 数据被清空的时候重新收集依赖
                    watcher.depend();
                }
                //返回值
                return watcher.value
            }
        }
    }

    //初始化事件Methods 把事件 冒泡到 vm[key] 虚拟dom  最外层中
    function initMethods(vm, methods) {
        var props = vm.$options.props;
        //循环 methods 事件对象
        for (var key in methods) {
            {
                //如果事件是null则发出警告
                if (methods[key] == null) {
                    warn(
                        "Method \"" + key + "\" has an undefined value in the component definition. " +
                        "Did you reference the function correctly?",
                        vm
                    );
                }

                //判断key是否是改对象实例化的
                //如果属性中定义了key，则在methods中不能定义同样的key
                if (props && hasOwn(props, key)) {
                    warn(
                        ("Method \"" + key + "\" has already been defined as a prop."),
                        vm
                    );
                }
                //isReserved 检查一个字符串是否以$或者_开头的字母
                if ((key in vm) && isReserved(key)) { //事件不能以$或者_开头的字母
                    warn(
                        "Method \"" + key + "\" conflicts with an existing Vue instance method. " +
                        "Avoid defining component methods that start with _ or $."
                    );
                }
            }
            //把事件放在最外层对象中，如果是函数为空则给一个空函数，如果是有函数则执行改函数
            vm[key] = methods[key] == null ? noop : bind(methods[key], vm);
        }
    }

    //初始化Watch监听
    function initWatch(vm, watch) {
        //循环watch对象
        for (var key in watch) {
            var handler = watch[key]; //获取单个watch
            //如果他是数组handler
            if (Array.isArray(handler)) {
                //循环数组 创建 监听
                for (var i = 0; i < handler.length; i++) {
                    createWatcher(
                        vm, //vm 是 vue对象
                        key, //key
                        handler[i]//函数或者对象
                    );
                }
            } else {
                //循环数组 创建 监听
                createWatcher(
                    vm, // vm 是 vue对象
                    key, //key
                    handler //函数或者对象
                );
            }
        }
    }

    // 转义handler 并且为数据 创建 Watcher 观察者
    function createWatcher(vm,  //vm对象
                           expOrFn, // key 值 或者函数
                           handler, // 函数 或者 对象 或者key
                           options  // 参数
    ) {
        if (isPlainObject(handler)) {  //判断是否是对象
            options = handler;
            handler = handler.handler; //对象中的handler 一定是函数或者字符串
        }
        if (typeof handler === 'string') { //判断handler 是否是字符串 如果是 则是key
            handler = vm[handler]; //取值 vm 就是Vue 最外层 中的函数
        }
        //转义handler 并且为数据 创建 Watcher 观察者
        return vm.$watch(
            expOrFn,// key 值 或者函数
            handler, //函数
            options //参数
        )
    }

    //数据绑定，$watch方法
    function stateMixin(Vue) {
        // flow somehow has problems with directly declared definition object
        //流在某种程度上与直接声明的定义对象有问题
        // when using Object.defineProperty, so we have to procedurally build up
        //在使用Object.defineProperty时，我们必须循序渐进地进行构建
        // the object here. 这里的对象。
        var dataDef = {};
        //重新定义get 和set方法
        dataDef.get = function () {
            return this._data //获取data中的数据
        };

        var propsDef = {};
        propsDef.get = function () {
            return this._props// 获取props 数据
        };

        {
            dataDef.set = function (newData) {
                //避免替换实例根$data。 使用嵌套数据属性代替
                warn(
                    'Avoid replacing instance root $data. ' +
                    'Use nested data properties instead.',
                    this
                );
            };
            propsDef.set = function () {
                //props 只是可度的数据不可以设置更改
                warn("$props is readonly.", this);
            };
        }
        console.log('==dataDef==')
        console.log(dataDef)


        Object.defineProperty(Vue.prototype, '$data', dataDef);
        Object.defineProperty(Vue.prototype, '$props', propsDef);

        //添加多一个数组数据或者对象数据
        Vue.prototype.$set = set;
        //删除一个数组数据或者对象数据
        Vue.prototype.$delete = del;

        Vue.prototype.$watch = function (expOrFn, //用户手动监听
                                         cb, // 监听 变化之后 回调函数
                                         options //参数
        ) {
            var vm = this;
            if (isPlainObject(cb)) { //判断是否是对象 如果是对象则递归 深层 监听 直到它不是一个对象的时候才会跳出递归
                //    转义handler 并且为数据 创建 Watcher 观察者
                return createWatcher(
                    vm,
                    expOrFn,
                    cb,
                    options
                )
            }
            options = options || {};
            options.user = true; //用户手动监听， 就是在 options 自定义的 watch
            console.log(expOrFn)

            //实例化Watcher 观察者
            var watcher = new Watcher(
                vm, //vm  vode
                expOrFn,  //函数 手动
                cb, //回调函数
                options  //参数
            );
            if (options.immediate) {
                //回调触发函数
                cb.call(vm, watcher.value);
            }
            return function unwatchFn() { //卸载观察者
                //从所有依赖项的订阅方列表中删除self。
                watcher.teardown();
            }
        };
    }

    /*
     provide 选项应该是一个对象或返回一个对象的函数。该对象包含可注入其子孙的属性，用于组件之间通信。
     *  */
    function initProvide(vm) {
        var provide = vm.$options.provide; //provide 选项应该是一个对象或返回一个对象的函数。该对象包含可注入其子孙的属性。
        if (provide) {  //判断provide 存在么
            vm._provided = typeof provide === 'function' //判断是否是函数如果是函数则执行
                ? provide.call(vm)
                : provide;
        }
    }

    //初始化 inject
    function initInjections(vm) {
        //provide 和 inject 主要为高阶插件/组件库提供用例。并不推荐直接用于应用程序代码中。
        //这对选项需要一起使用，以允许一个祖先组件向其所有子孙后代注入一个依赖，不论组件层次有多深，并在起上下游关系成立的时间里始终生效。如果你熟悉 React，这与 React 的上下文特性很相似。
        //更多详情信息https://cn.vuejs.org/v2/api/#provide-inject
        var result = resolveInject(vm.$options.inject, vm);
        if (result) {
            toggleObserving(false);
            Object.keys(result).forEach(function (key) { //注入的值不能修改，相当于props属性一样
                /* istanbul ignore else */
                {
                    // 通过defineProperty的set方法去通知notify()订阅者subscribers有新的值修改
                    //  * 添加观察者 get set方法
                    defineReactive(
                        vm,
                        key,
                        result[key],
                        function () {
                            warn(
                                "Avoid mutating an injected value directly since the changes will be " +
                                "overwritten whenever the provided component re-renders. " +
                                "injection being mutated: \"" + key + "\"",
                                vm
                            );
                        });
                }
            });
            toggleObserving(true);
        }
    }

    // inject 选项应该是一个字符串数组或一个对象，该对象的 key 代表了本地绑定的名称，value 为其 key (字符串或 Symbol) 以在可用的注入中搜索。
    function resolveInject(inject, vm) {

        if (inject) {
            // inject is :any because flow is not smart enough to figure out cached
            // inject是:any，因为flow不够智能，无法计算缓存
            var result = Object.create(null);
            var keys = hasSymbol ?  //判断是否支持Symbol 数据类型
                Reflect.ownKeys(inject).filter(function (key) {
                    //Object.getOwnPropertyDescriptor 查看描述对象 并且获取到enumerable 为true 的时候才会获取到该数组
                    return Object.getOwnPropertyDescriptor(inject, key).enumerable
                }) :
                Object.keys(inject); //如果不支持hasSymbol 则降级用 Object.keys

            // 将数组转化成对象 比如 [1,2,3]转化成
            // * normalized[1]={from: 1}
            for (var i = 0; i < keys.length; i++) { //循环key
                var key = keys[i];  //获取单个key值
                var provideKey = inject[key].from; //normalized[3]={from: 3} 获取key的值
                var source = vm;
                while (source) {
                    if (source._provided && hasOwn(source._provided, provideKey)) { //判断_provided 存在么 并且是对象的时候，并且实例化属性provideKey 存在
                        result[key] = source._provided[provideKey]; //获取值 存起来
                        break
                    }
                    source = source.$parent; //循环父节点
                }
                if (!source) {  //如果vm 不存在
                    if ('default' in inject[key]) { // 判断default key存在inject[key]中么
                        var provideDefault = inject[key].default; //如果存在则获取默认default的值
                        result[key] = typeof provideDefault === 'function' //如果是函数则执行
                            ? provideDefault.call(vm)
                            : provideDefault;
                    } else {
                        warn(("Injection \"" + key + "\" not found"), vm);
                    }
                }
            }
            return result
        }
    }

    /*  */

    /**
     * Runtime helper for rendering v-for lists.
     * 用于呈现v-for列表的运行时助手。
     * 根据value 判断是数字，数组，对象，字符串，循环渲染
     */
    function renderList(val, //值
                        render //渲染函数
    ) {
        var ret, i, l, keys, key; //
        if (
            Array.isArray(val) ||  //如果是数组
            typeof val === 'string' //或者字符串
        ) {
            ret = new Array(val.length); //获取长度
            for (i = 0, l = val.length; i < l; i++) { //循环数组或者字符串
                ret[i] = render(val[i], i);
            }
        } else if (typeof val === 'number') { //如果是数字
            ret = new Array(val); //变成数组 获取长度
            for (i = 0; i < val; i++) { //循环数字
                ret[i] = render(i + 1, i);
            }
        } else if (isObject(val)) { //如果是对象
            keys = Object.keys(val); //获取对象的key
            ret = new Array(keys.length); //获取数组长度
            for (i = 0, l = keys.length; i < l; i++) {
                key = keys[i];
                ret[i] = render(val[key], key, i);
            }
        }
        if (isDef(ret)) { //判断是否定义有ret
            (ret)._isVList = true;  //标志是否定义有ret
        }
        //返回一个空数组对象
        return ret
    }

    /*  */

    /**
     * Runtime helper for rendering <slot>
     * 用于呈现<slot>的运行时帮助程序
     */
    function renderSlot(name, //子组件中slot的name，匿名default
                        fallback, //子组件插槽中默认内容VNode数组，如果没有插槽内容，则显示该内容
                        props, //子组件传递到插槽的props
                        bindObject // 针对<slot v-bind="obj"></slot> obj必须是一个对象
    ) {
        var scopedSlotFn = this.$scopedSlots[name];  // 判断父组件是否传递作用域插槽
        var nodes; //虚拟dom
        if (scopedSlotFn) { // scoped slot
            props = props || {};
            if (bindObject) { //bindObject 必须是一个对象
                if ("development" !== 'production' && !isObject(bindObject)) {
                    warn(
                        'slot v-bind without argument expects an Object',
                        this
                    );
                }
                //合并对象和props属性
                props = extend(extend({}, bindObject), props);
            }
            // 传入props生成相应的VNode
            nodes = scopedSlotFn(props) || fallback;
        } else {
            // 如果父组件没有传递作用域插槽
            var slotNodes = this.$slots[name]; //所以在插槽 嵌入引入插槽时候不能命名一样
            // warn duplicate slot usage 警告重复槽的使用
            if (slotNodes) {
                if ("development" !== 'production' && slotNodes._rendered) {
                    warn(
                        "Duplicate presence of slot \"" + name + "\" found in the same render tree " +
                        "- this will likely cause render errors.",
                        this
                    );
                }
                // 设置父组件传递插槽的VNode._rendered，用于后面判断是否有重名slot
                slotNodes._rendered = true;
            }
            nodes = slotNodes || fallback;
        }

        // 如果还需要向子组件的子组件传递slot
        /*举个栗子：
         * Bar组件: <p class="bar"><slot name="foo"/></p>
         * Foo组件：<p class="foo"><bar><slot slot="foo"/></bar></p>
         * main组件：<p><foo>hello</foo></p>
         *
         * 最终渲染：<p class="foo"><p class="bar">hello</p></p>
         */


        var target = props && props.slot; //如果props属性存在并且属性的插槽存在props.slot
        if (target) {
            //创建模板 创建dom节点 虚拟dom需要渲染的数据结构
            return this.$createElement('template', {slot: target}, nodes)
        } else {
            return nodes
        }
    }

    /*  */

    /**
     * Runtime helper for resolving filters
     * 用于解析过滤器的运行时助手
     * 返回注册指令或者组建的对象
     *  检测指令是否在 组件对象上面 包括
     *
     */
    function resolveFilter(id) {
        return resolveAsset(this.$options, 'filters', id, true) || identity
    }

    /*
     * 检查key是否匹配
     * 如果没有匹配上的就返回true
     */
    function isKeyNotMatch(expect, actual) {
        if (Array.isArray(expect)) { //检查expect 是否是数组
            return expect.indexOf(actual) === -1 //检查数组中是否含有actual
        } else {
            return expect !== actual
        }
    }

    /**
     * Runtime helper for checking keyCodes from config. 用于从配置中检查密钥代码的运行时帮助程序。
     * exposed as Vue.prototype._k 暴露为Vue.prototype._k
     * passing in eventKeyName as last argument separately for backwards compat   为向后compat分别传入eventKeyName作为最后一个参数
     检查两个key是否相等，如果不想等返回true 如果相等返回false
     */
    function checkKeyCodes(eventKeyCode, //事件key
                           key, //键
                           builtInKeyCode, //内建键码
                           eventKeyName, //事件键名
                           builtInKeyName //内建键名
    ) {
        var mappedKeyCode = config.keyCodes[key] || builtInKeyCode; //映射的关键代码
        if (
            builtInKeyName &&
            eventKeyName && !config.keyCodes[key]
        ) {
            //比较两个key是否相等
            return isKeyNotMatch(builtInKeyName, eventKeyName)
        } else if (mappedKeyCode) {
            //比较两个key是否相等
            return isKeyNotMatch(mappedKeyCode, eventKeyCode)
        } else if (eventKeyName) {
            //把驼峰的key 转换成 -链接  判断 key 不一样
            return hyphenate(eventKeyName) !== key
        }
    }

    /*  */

    /**
     * Runtime helper for merging v-bind="object" into a VNode's data.
     * 用于将v-bind="object"合并到VNode的数据中的运行时助手。
     * 检查value 是否是对象，并且为value 添加update 事件
     */
    function bindObjectProps(data, //数据
                             tag, //vonde 节点
                             value, //value值
                             asProp, //prosp属性
                             isSync) { //是否 同步
        if (value) {
            if (!isObject(value)) { //判断绑定值如果不是对象
                "development" !== 'production' && warn(
                    'v-bind without argument expects an Object or Array value',
                    this
                );
            } else {
                if (Array.isArray(value)) { //判断值如果是数组
                    value = toObject(value);  //转成对象
                }
                var hash;
                var loop = function (key) {
                    if (
                        key === 'class' || //如果key 是class
                        key === 'style' || //获取是style
                        isReservedAttribute(key) //或者是'key,ref,slot,slot-scope,is'
                    ) {
                        hash = data;
                    } else {
                        var type = data.attrs && data.attrs.type; //如果含有其他属性 或者 tyep

                        /* mustUseProp
                         * 1. attr === 'value', tag 必须是 'input,textarea,option,select,progress' 其中一个 type !== 'button'
                         * 2. attr === 'selected' && tag === 'option'
                         * 3. attr === 'checked' && tag === 'input'
                         * 4. attr === 'muted' && tag === 'video'
                         * 的情况下为真
                         * */

                        hash = asProp || config.mustUseProp(tag, type, key) ?
                        data.domProps || (data.domProps = {}) :
                        data.attrs || (data.attrs = {});
                    }
                    if (!(key in hash)) { //如果数据和属性都没有这个key的时候，判断他应该是事件
                        hash[key] = value[key];
                        if (isSync) { //判断是否是同步
                            var on = data.on || (data.on = {});
                            on[("update:" + key)] = function ($event) { //更新数据事件
                                value[key] = $event;
                            };
                        }
                    }
                };
                //循环 value中的所有key
                for (var key in value) {
                    loop(key)
                }
                ;
            }
        }
        return data
    }

    /*  */

    /**
     * Runtime helper for rendering static trees.
     * 用于呈现静态树的运行时助手。
     */
    function renderStatic(index, //索引
                          isInFor //是否是for指令
    ) {
        var cached = this._staticTrees || (this._staticTrees = []); //静态数
        var tree = cached[index]; //获取单个数
        // if has already-rendered static tree and not inside v-for, 如果已经渲染的静态树不在v-for中，
        // we can reuse the same tree. 我们可以重用相同的树。
        if (tree && !isInFor) {
            return tree
        }
        // otherwise, render a fresh tree. 否则，渲染一个新的树。
        tree = cached[index] = this.$options.staticRenderFns[index].call(
            this._renderProxy,
            null,
            this // for render fns generated for functional component templates 用于为功能组件模板生成的呈现fns
        );
        //循环标志静态的vonde 虚拟dom
        markStatic(tree, ("__static__" + index), false);
        return tree
    }

    /**
     * Runtime helper for v-once. v的运行时助手。
     * Effectively it means marking the node as static with a unique key.
     * 实际上，这意味着使用唯一键将节点标记为静态。
     * 标志 v-once. 指令
     */
    function markOnce(tree,
                      index,
                      key) {
        //循环标志静态的vonde 虚拟dom
        markStatic(tree, ("__once__" + index + (key ? ("_" + key) : "")), true);
        return tree
    }

    //循环标志静态的vonde 虚拟dom
    function markStatic(tree, //树
                        key, //key
                        isOnce //是否是v-once指令
    ) {
        if (Array.isArray(tree)) { //判断是否是数组
            for (var i = 0; i < tree.length; i++) {
                if (tree[i] && typeof tree[i] !== 'string') {
                    //标志静态的vonde 虚拟dom
                    markStaticNode(tree[i], (key + "_" + i), isOnce);
                }
            }
        } else {
            //标志静态的vonde 虚拟dom
            markStaticNode(tree, key, isOnce);
        }
    }

    //标志静态的vonde 虚拟dom
    function markStaticNode(node, key, isOnce) {
        node.isStatic = true;
        node.key = key;
        node.isOnce = isOnce;
    }

    /*
     *绑定对象监听器
     * 判断value 是否是对象，并且为数据 data.on 合并data和value 的on
     * */
    function bindObjectListeners(data, value) {
        if (value) {
            if (!isPlainObject(value)) { //value 如果不是对象则发出警告日志
                "development" !== 'production' && warn(
                    'v-on without argument expects an Object value',
                    this
                );
            } else {
                var on = data.on = data.on ? extend({}, data.on) : {}; //获取事件
                for (var key in value) { //遍历循环value 值
                    var existing = on[key];  // 合并他们两事件
                    var ours = value[key];
                    on[key] = existing ? [].concat(existing, ours) : ours;
                }
            }
        }
        //返回合并过的数据
        return data
    }

    /*
     *
     * 安装渲染助手
     * */
    function installRenderHelpers(target) {
        target._o = markOnce; //实际上，这意味着使用唯一键将节点标记为静态。* 标志 v-once. 指令
        target._n = toNumber; //字符串转数字，如果失败则返回字符串
        target._s = toString; // 将对象或者其他基本数据 变成一个 字符串
        target._l = renderList; //根据value 判断是数字，数组，对象，字符串，循环渲染
        target._t = renderSlot; //用于呈现<slot>的运行时帮助程序 创建虚拟slot vonde
        target._q = looseEqual; //检测a和b的数据类型，是否是不是数组或者对象，对象的key长度一样即可，数组长度一样即可
        target._i = looseIndexOf; //或者 arr数组中的对象，或者对象数组 是否和val 相等
        target._m = renderStatic;//用于呈现静态树的运行时助手。 创建静态虚拟vnode
        target._f = resolveFilter; // 用于解析过滤器的运行时助手
        target._k = checkKeyCodes; // 检查两个key是否相等，如果不想等返回true 如果相等返回false
        target._b = bindObjectProps; //用于将v-bind="object"合并到VNode的数据中的运行时助手。  检查value 是否是对象，并且为value 添加update 事件
        target._v = createTextVNode; //创建一个文本节点 vonde
        target._e = createEmptyVNode;  // 创建一个节点 为注释节点 空的vnode
        target._u = resolveScopedSlots; //  解决范围槽 把对象数组事件分解成 对象
        target._g = bindObjectListeners; //判断value 是否是对象，并且为数据 data.on 合并data和value 的on 事件
    }

    /*
     *
     *  添加虚拟dom 属性data，添加事件，添加props属性，添加parent 属性 添加injections属性
     *  添加slots插槽渲染方法 重写 this._c   createElement 函数 渲染vonde
     *  安渲染函数到FunctionalRenderContext.prototype原型中，这样该对象和 Vue有着同样的渲染功能
     *  installRenderHelpers(FunctionalRenderContext.prototype)
     *
     * */
    function FunctionalRenderContext(
                                     data, // vonde 虚拟dom的属性数据
                                     props,  //props 属性 包含值和key
                                     children, //子节点
                                     parent, //vm vue实例化，如果parent也组件 也可能是VueComponent 构造函数 实例化的对象
                                     Ctor  //VueComponent 构造函数
    ) {
        console.log([
            data, // vonde 虚拟dom的属性数据
            props,  //props 属性
            children, //子节点
            parent, //vm
            Ctor  //VueComponent 构造函数
        ])

        var options = Ctor.options;
        // ensure the createElement function in functional components
        // gets a unique context - this is necessary for correct named slot check
        //确保函数组件中的createElement函数
        // 获取唯一上下文——这对于正确的命名槽检查是必要的
        var contextVm;
        console.log(hasOwn(parent, '_uid'))
        if (hasOwn(parent, '_uid')) { //判断这个组件是否是 new _init  过
            contextVm = Object.create(parent); //创建一个对象
            // $flow-disable-line  流禁用线
            contextVm._original = parent;
        } else {
            // the context vm passed in is a functional context as well.
            // in this case we want to make sure we are able to get a hold to the
            // real context instance.
            //传入的上下文vm也是一个功能上下文。
            //在这种情况下，我们想确定一下我们能否得到
            //真实的上下文实例。
            contextVm = parent;
            // $flow-disable-line
            parent = parent._original;
        }
        var isCompiled = isTrue(options._compiled); // 判断是否是模板编译
        var needNormalization = !isCompiled; //如果不是模板编译

        // data, // vonde 虚拟dom的数据
        //   props,  //props 属性
        //   children, //子节点
        //   parent, //vm
        //   Ctor  //VueComponent 构造函数

        this.data = data;     // vonde 虚拟dom的数据
        this.props = props;  //  props 属性
        this.children = children; //子节点
        this.parent = parent; //vm
        this.listeners = data.on || emptyObject; // 事件
        // inject 选项应该是一个字符串数组或一个对象，该对象的 key 代表了本地绑定的名称，value 为其 key (字符串或 Symbol) 以在可用的注入中搜索。
        this.injections = resolveInject(options.inject, parent);
        this.slots = function () { //插槽
            // 判断children 有没有分发式插槽 并且过滤掉空的插槽
            return resolveSlots(children, parent);
        };

        // support for compiled functional template
        //支持编译的函数模板
        if (isCompiled) {
            // exposing $options for renderStatic() 为renderStatic()公开$options
            this.$options = options;
            // pre-resolve slots for renderSlot() renderSlot()的预解析槽()
            this.$slots = this.slots(); //收集插槽
            // data.scopedSlots = {default: children[0]};  //获取插槽
            this.$scopedSlots = data.scopedSlots || emptyObject;
        }

        if (options._scopeId) { //范围id
            this._c = function (a, b, c, d) { //

                //创建子节点 vonde
                var vnode = createElement(contextVm, a, b, c, d, needNormalization);

                if (vnode && !Array.isArray(vnode)) {
                    vnode.fnScopeId = options._scopeId;
                    vnode.fnContext = parent;
                }
                return vnode
            };
        } else {

            this._c = function (a, b, c, d) {

                //创建子节点 vonde
                return createElement(contextVm, a, b, c, d, needNormalization);
            };
        }
    }

    //安装渲染助手
    installRenderHelpers(FunctionalRenderContext.prototype);

    //创建功能组件 通过检测 props 属性 然后合并props   之后创建 vond 虚拟dom
    function createFunctionalComponent(
                                       Ctor, //组件构造函数VueComponent
                                       propsData, //组件props数据
                                       data,  //  组件属性 数据
                                       contextVm, //vm  vue实例化对象
                                       children //组件子节点
                                     ) {
                                            console.log('==Ctor==')
                                            console.log(Ctor)
                                            console.log('==propsData==')
                                            console.log(propsData)
                                            console.log('==data==')
                                            console.log(data)
                                            console.log('==contextVm==')
                                            console.log(contextVm)
                                            console.log('==children==')
                                            console.log(children)



                                            var options = Ctor.options; //获取拓展参数
                                            var props = {};
                                            var propOptions = options.props; //获取props 参数 就是组建 定义的props 类型数据
                                            console.log('==options.props==')
                                            console.log(options.props)

                                            if (isDef(propOptions)) { //如果定义了props 参数
                                                for (var key in propOptions) { //循环 propOptions 参数

                                               /*
                                                   验证支柱  验证 prosp 是否是规范数据 并且为props 添加 value.__ob__  属性，把prosp添加到观察者中
                                                    *  校验 props 参数 就是组建 定义的props 类型数据，校验类型
                                                    *
                                                    * 判断prop.type的类型是不是Boolean或者String，如果不是他们两类型，调用getPropDefaultValue获取默认值并且把value添加到观察者模式中
                                                    */
                                                    props[key] = validateProp(
                                                        key,  //key
                                                        propOptions, //原始props 参数
                                                        propsData || emptyObject  // 转义过的组件props数据
                                                    );
                                                }
                                            } else {
                                                if (isDef(data.attrs)) {  //如果定义有属性
                                                    // 前拷贝合并 props属性 并且把 from 的key 由 - 写法变成 驼峰的写法。
                                                    mergeProps(props, data.attrs); //合并props 和 属性
                                                }
                                                if (isDef(data.props)) { //如果data定义有props 合并props
                                                    mergeProps(props, data.props);
                                                }
                                            }
                                            //  Ctor,
                                            // propsData, //组件props数据
                                            // data,  // vonde 虚拟dom的数据
                                            // contextVm, //上下文this Vm
                                            // children //子节点
                                            console.log(Ctor)
                                            // Ctor = function VueComponent(options) {
                                            //     this._init(options);
                                            // }
                                            //
                                         //返回
                                            var renderContext = new FunctionalRenderContext(  //实例化一个对象
                                                data,// vonde 虚拟dom的数据
                                                props, //props 属性
                                                children, //子节点
                                                contextVm, //vm
                                                Ctor  //VueComponent 构造函数
                                            );

                                            // children : undefined
                                            // data : Object
                                            // injections :  undefined
                                            // listeners  : Object
                                            // parent :  Vue
                                            // props :  Object
                                            // slots : function ()
                                            // _c: function (a, b, c, d)
                                            // __proto__:  Object
                                            console.log('==renderContext==')
                                            console.log(renderContext)

                                            //创建 vnode
                                            var vnode = options.render.call(null, renderContext._c, renderContext);

                                            if (vnode instanceof VNode) { //如果 vnode 的构造函数是VNode

                                                //克隆并标记函数结果
                                                return cloneAndMarkFunctionalResult(vnode, data, renderContext.parent, options)
                                            } else if (Array.isArray(vnode)) { //如果vnode 是数组

                                                //normalizeArrayChildren 创建一个规范的子节点 vonde
                                                var vnodes = normalizeChildren(vnode) || [];
                                                var res = new Array(vnodes.length); // 创建一个空数组
                                                for (var i = 0; i < vnodes.length; i++) {
                                                    //克隆并标记函数结果 静态 节点
                                                    res[i] = cloneAndMarkFunctionalResult(vnodes[i], data, renderContext.parent, options);
                                                }
                                                return res
                                            }
    }

    //克隆并标记函数结果 静态 节点
    function cloneAndMarkFunctionalResult(vnode,   //vnode 虚拟dom
                                          data,  //虚拟dom 数据
                                          contextVm, //vm this
                                          options // options 拓展函数
    ) {
        // #7817 clone node before setting fnContext, otherwise if the node is reused
        // (e.g. it was from a cached normal slot) the fnContext causes named slots
        // that should not be matched to match.
        // #7817在设置fnContext之前克隆节点，否则如果节点被重用
        //(例如，它来自一个缓存的正常槽)fnContext导致命名槽
        //这是不应该匹配的。
        //克隆节点  把节点变成静态节点
        var clone = cloneVNode(vnode);
        clone.fnContext = contextVm;
        clone.fnOptions = options;
        if (data.slot) { //判断是否有插槽
            (clone.data || (clone.data = {})).slot = data.slot;
        }
        return clone
    }

    // 前拷贝合并 props属性 并且把 from 的key 由 - 写法变成 驼峰的写法。
    function mergeProps(to, from) {
        for (var key in from) {
            to[camelize(key)] = from[key];
        }
    }

    /*  */


// Register the component hook to weex native render engine.
// The hook will be triggered by native, not javascript.


// Updates the state of the component to weex native render engine.

    /*  */

// https://github.com/Hanks10100/weex-native-directive/tree/master/component

// listening on native callback

    /*  */

    /*  */

// inline hooks to be invoked on component VNodes during patch
    //补丁期间在组件vnode上调用的内联钩子
    var componentVNodeHooks = {  //组件钩子函数
        init: function init(    //初始化组件函数
            vnode, //vonde虚拟dom
            hydrating, //新的虚拟dom vonde
            parentElm,  //父亲 dom
            refElm
        ) {  //当前elm dom


            //根据Vnode生成VueComponent实例
            if (
                vnode.componentInstance &&  //已经实例过的组件就只更新
                !vnode.componentInstance._isDestroyed && //并且没有销毁
                vnode.data.keepAlive //并且是keepAlive 组件
            ) {


                // kept-alive components, treat as a patch
                // kept-alive组件，当作补丁
                // work around flow 围绕流程工作
                var mountedNode = vnode;
                //触发更新虚拟比较

                componentVNodeHooks.prepatch(mountedNode, mountedNode);
            } else {

                // 调用VueComponent构造函数去实例化组件对象
                var child = vnode.componentInstance = createComponentInstanceForVnode(
                    vnode, //虚拟dom vonde
                    activeInstance, //活动实例 vue 实例化的对象
                    parentElm, //父dom el
                    refElm //当前dom el
                );
                //实例方法挂载 vm
                child.$mount(
                    hydrating ? vnode.elm : undefined,
                    hydrating //新的虚拟dom vonde
                );
            }
        },

        prepatch: function prepatch(
                                   oldVnode,  //旧的
                                    vnode) {  //比较新旧的虚拟dom 更新组件数据


            var options = vnode.componentOptions; //组件的参数
            var child = vnode.componentInstance = oldVnode.componentInstance; //组件实例
            updateChildComponent( //更新子组建
                child, //子节点
                options.propsData, // updated props 组件属性。属性数据
                options.listeners, // updated listeners 属性事件
                vnode, // new parent vnode 新的vond 虚拟dom
                options.children // new children 新的子节点 虚拟dom
            );
        },

        insert: function insert(vnode) { //安装插入
            var context = vnode.context; //vm vue 实例化对象或者是VueComponent 构造函数实例化对象
            var componentInstance = vnode.componentInstance; //组件实例化对象
            if (!componentInstance._isMounted) { //
                componentInstance._isMounted = true;
                callHook(
                    componentInstance,
                    'mounted' //触发mounted钩子函数
                ); //
            }
            //如果有keepAlive 组件才触发下面
            if (vnode.data.keepAlive) {
                if (context._isMounted) {
                    // vue-router#1212
                    // During updates, a kept-alive component's child components may
                    // change, so directly walking the tree here may call activated hooks
                    // on incorrect children. Instead we push them into a queue which will
                    // be processed after the whole patch process ended.
                    // vue-router # 1212
                    //在更新期间，kept-alive组件的子组件可以
                    //改变，所以直接在树中行走可能会调用激活钩子
                    //关于不正确的孩子。相反，我们把它们推到一个队列中
                    //在整个补丁过程结束后处理。
                    //添加活跃的组件函数 把活跃的vm添加到activatedChildren 中
                    queueActivatedComponent(componentInstance);
                } else {
                    //判断是否有不活跃的组件 禁用他 如果有活跃组件则触发钩子函数activated
                    activateChildComponent(componentInstance, true /* direct */);
                }
            }
        },
        //销毁钩子函数
        destroy: function destroy(vnode) {
            var componentInstance = vnode.componentInstance; //组件实例化
            if (!componentInstance._isDestroyed) {
                if (!vnode.data.keepAlive) { //如果组件不是keepAlive 则销毁掉
                    // 销毁不是keepAlive 的组件 改组件是虚拟组件 用于 缓存单页 返回上一页数据
                    componentInstance.$destroy();
                } else {
                    //keepAlive组件则走这里
                    // 循环子组件 和父组件  判断是否有禁止的组件 如果有活跃组件则执行生命后期函数deactivated
                    deactivateChildComponent(componentInstance, true /* direct */);
                }
            }
        }
    };

    //获取对象的key值并且以数组形式封装
    var hooksToMerge = Object.keys(componentVNodeHooks);

    //创建组件
    function createComponent(
                            Ctor, //VueComponen函数
                             data, // 组件标签上面的属性数据
                             context, //vm Vue 实例化之后的对象上下文
                             children, //子节点
                             tag) {  //标签



                                        if (isUndef(Ctor)) {
                                            return
                                        }
                                        //vue
                                        //用来标识扩展所有普通对象的“基”构造函数
                                        // Weex的多实例场景中的组件。
                                        var baseCtor = context.$options._base;  //基本的Vue 静态类

                                        // plain options object: turn it into a constructor
                                        //普通选项对象:将其转换为构造函数  _base vue 的 构造函数
                                        if (isObject(Ctor)) {
                                            Ctor = baseCtor.extend(Ctor);
                                        }

                                        // if at this stage it's not a constructor or an async component factory,
                                        //如果在这个阶段它不是构造函数或异步组件工厂，
                                        // reject.
                                        if (typeof Ctor !== 'function') { //如果不是函数则发出警告
                                            {
                                                warn(("Invalid Component definition: " + (String(Ctor))), context);
                                            }
                                            return
                                        }
                            console.log(Ctor)
                            console.log(baseCtor)
                            console.log(context)


                          // async component
                                        //异步组件
                                        var asyncFactory;
                                        // Vue.cid = 0;


                                        if (isUndef(Ctor.cid)) { //组件的id 唯一标识符

                                            asyncFactory = Ctor; //
                                            // 解决异步组件 更新组建数据
                                            Ctor = resolveAsyncComponent(  //返回组件现在的状态
                                                asyncFactory, //新的
                                                baseCtor, //基本的Vue 静态类
                                                context //当前已经实例化的vm对象
                                            );

                                            if (Ctor === undefined) {
                                                // return a placeholder node for async component, which is rendered
                                                // as a comment node but preserves all the raw information for the node.
                                                // the information will be used for async server-rendering and hydration.

                                                //为已呈现的异步组件返回占位符节点
                                                //作为注释节点，但保留该节点的所有原始信息。
                                                //这些信息将用于异步服务器呈现和水合作用。

                                                //      factory, //工厂
                                                //     data,  //数据
                                                //     context, //语境
                                                //     children, //子节点
                                                //     tag) {  //标签

                                                return createAsyncPlaceholder(
                                                    asyncFactory, //VueComponent  构造函数
                                                    data,  //组件tag的属性数据
                                                    context, //Vue 实例化对象
                                                    children, //子节点
                                                    tag  //组件标签
                                                )
                                            }
                                        }

                                        data = data || {};
                                        console.log(Ctor)


                                        // resolve constructor options in case global mixins are applied after
                                        // component constructor creation
                                        //解析构造函数选项，以防在后面应用全局mixin
                                        //组件构造函数创建
                                        //解决构造函数的选择 options 参数，合并，过滤重复 options参数
                                        resolveConstructorOptions(Ctor);

                                        // transform component v-model data into props & events
                                        //将组件转换   v-model data into props & events
                                        //转换v-model 并且 绑定事件
                                        if (isDef(data.model)) {  //如果定义有 model 转义 model 并且绑定 v-model
                                            transformModel(Ctor.options, data);
                                        }
                                        console.log(data)
                                        console.log(Ctor)
                                        console.log(tag)


                                        // extract props  从…提取，文件的摘录 extractPropsFromVNodeData 从 props属性中获取vnode数据
                                        var propsData = extractPropsFromVNodeData(
                                                                                    data, //tag标签属性数据
                                                                                    Ctor, //组件构造函数VueComponent
                                                                                    tag //tag标签名称
                                                                                );

                                        // functional component 功能组成部分，功能部件
                                        if (isTrue(Ctor.options.functional)) { //为真
                                            return createFunctionalComponent(
                                                                                Ctor,  //组件构造函数VueComponent
                                                                                propsData, //组件props 数据
                                                                                data,  //组件属性 数据
                                                                                context,  //vm  vue实例化对象
                                                                                children //组件子节点
                                                                              )
                                        }

                                        // extract listeners, since these needs to be treated as
                                        // child component listeners instead of DOM listeners
                                        //提取监听器，因为这些监听器需要被当作
                                        //子组件监听器而不是DOM监听器
                                        var listeners = data.on;  //事件
                                        // replace with listeners with .native modifier
                                        // so it gets processed during parent component patch.
                                        //用.native修饰符替换监听器
                                        //因此它在父组件补丁中被处理
                                        data.on = data.nativeOn;
                                        //你可能有很多次想要在一个组件的根元素上直接监听一个原生事件。这时，你可以使用 v-on 的 .native 修饰符：
                                        // <base-input v-on:focus.native="onFocus"></base-input>

                                        if (isTrue(Ctor.options.abstract)) {  //静态
                                            // abstract components do not keep anything
                                            // other than props & listeners & slot
                                            // work around flow
                                            //抽象组件不保存任何东西
                                            //除了道具、监听器和插槽
                                            //围绕流程工作
                                            var slot = data.slot; //插槽
                                            data = {};
                                            if (slot) {
                                                data.slot = slot;
                                            }
                                        }

                                        // install component management hooks onto the placeholder node
                                        //将组件管理钩子安装到占位符节点上
                                console.log(data);

                                        installComponentHooks(data);

                                        // return a placeholder vnode
                                        var name = Ctor.options.name || tag;



        console.log( ("vue-component-" + (Ctor.cid) + (name ? ("-" + name) : '')))
        console.log( data)
        console.log( context)
        console.log(        {Ctor: Ctor, propsData: propsData, listeners: listeners, tag: tag, children: children})
        console.log(asyncFactory)

                                        var vnode = new VNode(
                                                            ("vue-component-" + (Ctor.cid) + (name ? ("-" + name) : '')),
                                                            data,  // 标签 属性数据
                                                            undefined,//子节点
                                                            undefined,//文本
                                                            undefined,/*当前节点的dom */
                                                            context, //vm vue实例化对象或者父组件。
                                                            {Ctor: Ctor, propsData: propsData, listeners: listeners, tag: tag, children: children}, //当前组件 构造函数propsData属性  事件，tag标签， 子节点
                                                            asyncFactory
                                                          );


                                        // Weex specific: invoke recycle-list optimized @render function for
                                        // extracting cell-slot template.
                                        // https://github.com/Hanks10100/weex-native-directive/tree/master/component
                                        /* istanbul ignore if */
                                console.log('===vnode===')
                                console.log(vnode)
                                        return vnode
    }

    //调用VueComponent构造函数去实例化组件对象
    function createComponentInstanceForVnode(
                                             vnode, // we know it's MountedComponentVNode but flow doesn't //我们知道它是MountedComponentVNode，但flow不是
                                             parent, // activeInstance in lifecycle state 处于生命周期状态的activeInstance
                                             parentElm, // 父亲dom
                                             refElm //当前的dom
    ) {
        var options = {
            _isComponent: true, //是否是组件
            parent: parent, //组件的父节点
            _parentVnode: vnode, //组件的 虚拟vonde 父节点
            _parentElm: parentElm || null, //父节点的dom el
            _refElm: refElm || null //当前节点 el
        };
        // check inline-template render functions  检查内联模板渲染函数
        var inlineTemplate = vnode.data.inlineTemplate; //内联模板
        if (isDef(inlineTemplate)) { //是否有内联模板
            options.render = inlineTemplate.render; //如果有内联模板 获取内联模板的渲染函数
            options.staticRenderFns = inlineTemplate.staticRenderFns; //获取静态渲染函数
        }
        return new vnode.componentOptions.Ctor(options) //实例化 VueComponent 构造函数
    }

    //安装组件钩子函数
    function installComponentHooks(
        data //vonde 虚拟dom
    ) {

        //安装组件钩子函数
        var hooks = data.hook || (data.hook = {});
        for (var i = 0; i < hooksToMerge.length; i++) {
            var key = hooksToMerge[i];
            hooks[key] = componentVNodeHooks[key]; //组建钩子函数
        }
        console.log('==hooks==')
        console.log(hooks)

    }

    // transform component v-model info (value and callback) into
    // prop and event handler respectively.
    //将组件v-model信息(值和回调)转换为
    //分别是prop和event handler。

    //将标签含有v-model 信息属性转换为
    //获取options.model.prop属性  获取options.model.event 事件类型，
    // 把data.model.value 数据赋值到data.props.value中 如果value的key没有定义 则是input
    // 把事件  data.model.callback 添加到 data.on[event] 中  如果没有定义是input
    function transformModel(options, data) {
        //获取prop 如果获取不到 则取值 value
        var prop = (options.model && options.model.prop) || 'value';

        //获取event如果获取不到 则取值 input
        var event = (options.model && options.model.event) || 'input';

        //把data.model.value的值赋值到data.props.value 中
        (data.props || (data.props = {}))[prop] = data.model.value;
        var on = data.on || (data.on = {});
        if (isDef(on[event])) {  //如果model 事件已经定义了则是和钩子函数合并
            on[event] = [data.model.callback].concat(on[event]);
        } else {
            on[event] = data.model.callback;  //只赋值钩子函数
        }
    }

    /*  */

    var SIMPLE_NORMALIZE = 1;
    var ALWAYS_NORMALIZE = 2;

// wrapper function for providing a more flexible interface 包装器功能，提供更灵活的接口
// without getting yelled at by flow 而不是被心流狂吼

    //创建dom节点
    function createElement(
                            context, //vm new Vue 实例化的对象
                           tag, //标签标签名称
                           data, //标签数据，包括属性，class style 指令等
                           children, //子节点
                           normalizationType,//应该设置为常量ALWAYS_NORMALIZE的值
                           alwaysNormalize //布尔值 是否是真的是true

    ) {
        console.log(data)

        //如果数据是数组  或者是  //判断数据类型是否是string，number，symbol，boolean
        if (Array.isArray(data) || isPrimitive(data)) {
            normalizationType = children;
            children = data;
            data = undefined;
        }
        //如果是真的是  true
        if (isTrue(alwaysNormalize)) {
            normalizationType = ALWAYS_NORMALIZE; //type等于2
        }
        //创建节点
        return _createElement(
                                    context, //vm new Vue 实例化的对象
                                    tag,//节点标签
                                    data, //标签数据，包括属性，class style 指令等
                                    children, //子节点
                                    normalizationType
                                )
    }

    //创建虚拟dom节点
    function _createElement(context,  //vm vue实例化的对象
                            tag,  //节点
                            data,  //标签数据，包括属性，class style 指令等
                            children, //子节点
                            normalizationType // 1或者2
    ) {
        /**
         *  如果存在data.__ob__，
         * 说明data是被Observer观察的数据
         * 不能用作虚拟节点的data
         * 需要抛出警告，
         * 并返回一个空节点
         * 被监控的data不能被用作vnode渲染的数据的原因是：data在vnode渲染过程中可能会被改变，
         * 这样会触发监控，
         * 导致不符合预期的操作
         * */
        if (isDef(data) && isDef((data).__ob__)) {
            "development" !== 'production' && warn(
                "Avoid using observed data object as vnode data: " + (JSON.stringify(data)) + "\n" +
                'Always create fresh vnode data objects in each render!',
                context
            );
            //创建一个空的节点
            return createEmptyVNode()
        }
        // object syntax in v-bind
        // v-bind中的对象语法
        //如果定义有数据并且数据中的is也定义了
        if (isDef(data) && isDef(data.is)) {
            tag = data.is; //tag等于is
        }
        //如果tag不存在
        // 当组件的is属性被设置为一个falsy的值
        // Vue将不会知道要把这个组件渲染成什么
        // 所以渲染一个空节点
        if (!tag) {
            // in case of component :is set to falsy value
            //组件的情况:设置为falsy值 创建一个空节点
            return createEmptyVNode()
        }
        // warn against non-primitive key
        //警告非原始键
        if ("development" !== 'production' &&
            isDef(data) && isDef(data.key) && !isPrimitive(data.key)
        ) {
            {
                warn(
                    'Avoid using non-primitive value as key, ' +
                    'use string/number value instead.',
                    context
                );
            }
        }
        // support single function children as default scoped slot
        //支持作为默认作用域插槽的单函数子函数
        if (
            Array.isArray(children) &&  //如果子节点是数组
            typeof children[0] === 'function' //并且第一个子节点类型是函数
        ) {
            data = data || {};
            data.scopedSlots = {default: children[0]};  //获取插槽
            children.length = 0;
        }
        // 根据normalizationType的值，选择不同的处理方法
        if (normalizationType === ALWAYS_NORMALIZE) { //2



            //创建一个规范的子节点
            children = normalizeChildren(children);
        } else if (normalizationType === SIMPLE_NORMALIZE) { //1
            //把所有子节点的数组 子孙连接在一个数组。
            children = simpleNormalizeChildren(children);
        }

        var vnode, ns;
        if (typeof tag === 'string') { //类型是string
                            var Ctor;

                            //getTagNamespace  判断 tag 是否是svg或者math 标签
                            // 获取标签名的命名空间
                            ns = (context.$vnode && context.$vnode.ns) ||
                                 config.getTagNamespace(tag); //判断 tag 是否是svg或者math 标签

                            //判断标签是不是html 原有的标签
                            if (config.isReservedTag(tag)) {
                                // platform built-in elements
                                //平台内置的元素
                                //创建一个vnode

                                // tag, /*当前节点的标签名*/
                                //     data, /*当前节点对应的对象，包含了具体的一些数据信息，是一个VNodeData类型，可以参考VNodeData类型中的数据信息*/
                                //     children, //子节点
                                //     text, //文本
                                //     elm, /*当前节点的dom */
                                //     context, /*编译作用域*/
                                //     componentOptions, /*组件的option选项*/
                                //     asyncFactory/*异步工厂*/


                                vnode = new VNode(
                                    config.parsePlatformTagName(tag), //返回相同的值 。当前tag的标签名称
                                    data, //tag标签的属性数据
                                    children, //子节点
                                    undefined,  //文本
                                    undefined, //*当前节点的dom */
                                    context // vm vue实例化的对象
                                );
                                // 如果不是保留标签，那么我们将尝试从vm的components上查找是否有这个标签的定义
                            } else if (isDef(Ctor = resolveAsset(context.$options, 'components', tag))) {
                                // component  如果有则创建一个组件
                                console.log('===Ctor===')
                                console.log(Ctor) //获取到 VueComponent 构造函数 sup类

                                //Ctor是VueComponent 组件构造函数
                                //创建一个组件  调用6000多行的createComponent
                                vnode = createComponent(
                                    Ctor,  //组件构造函数
                                    data, //组件虚拟dom数据
                                    context, //this上下文
                                    children,  //子节点
                                    tag //组件标签
                                );

                            } else {
                                // unknown or unlisted namespaced elements
                                // check at runtime because it may get assigned a namespace when its
                                // parent normalizes children
                                //创建标准的vue vnode // 兜底方案，正常创建一个vnode
                                vnode = new VNode(
                                    tag, //虚拟dom的标签
                                    data,  //虚拟dom的数据
                                    children,  //虚拟dom的子节点
                                    undefined,
                                    undefined,
                                    context
                                );
                            }
        } else {
                    // 当tag不是字符串的时候，我们认为tag是组件的构造类 // 所以直接创建
                    // direct component options / constructor  直接组件选项/构造函数     //创建组件
                    vnode = createComponent(tag, data, context, children);
        }
        if (Array.isArray(vnode)) { //如果vnode 是数组
                        return vnode
        } else if (isDef(vnode)) { //如果vnode 有定义
                        if (isDef(ns)) {//如果ns 有定义 标签名
                            // 如果有namespace，就应用下namespace，然后返回vnode
                            //检测 vnode中的tag === 'foreignObject' 是否相等。并且修改ns值与force 标志
                            applyNS(vnode, ns);
                        }
                        if (isDef(data)) {
                            //注册深绑定
                            registerDeepBindings(data);
                        }
                        return vnode
        } else {
                        // 否则，返回一个空节点
                        return createEmptyVNode()
        }
    }

    //检测 vnode中的tag === 'foreignObject' 是否相等。并且修改ns值与force 标志
    function applyNS(
                        vnode, //虚拟dom
                        ns, // namespace 标签 应该是svg标签吧 不是很清楚
                        force
                     ) {
        vnode.ns = ns; //
        if (vnode.tag === 'foreignObject') { //svg标签
            // use default namespace inside foreignObject //使用foreignObject中的默认名称空间
            ns = undefined;
            force = true;
        }
        if (isDef(vnode.children)) { //虚拟dom是否后子节点 递归循环
            for (var i = 0, l = vnode.children.length; i < l; i++) {
                var child = vnode.children[i];
                if (isDef(child.tag) &&
                            (
                                isUndef(child.ns) || //子节点没有定义ns
                                (isTrue(force) && child.tag !== 'svg') //force为真，子节点不为svg
                            )
                ) {
                    applyNS(child, ns, force); //递归
                }
            }
        }
    }

// ref #5318
// necessary to ensure parent re-render when deep bindings like :style and
// :class are used on slot nodes
    //裁判# 5318
//必须确保父元素在深度绑定时重新呈现，比如:style和
//类在槽节点上使
    function registerDeepBindings(data) {
        if (isObject(data.style)) { //
            //为 seenObjects 深度收集val 中的key
            traverse(data.style);
        }
        if (isObject(data.class)) {
            //为 seenObjects 深度收集val 中的key
            traverse(data.class);
        }
    }

    /*
     * 初始化渲染
     *
     */
    function initRender(vm) {
        //vm 是Vue 对象
        vm._vnode = null; // the root of the child tree 上一个 vonde
        vm._staticTrees = null; // v-once cached trees v-once缓存的树
        var options = vm.$options; //获取参数
        var parentVnode = vm.$vnode = options._parentVnode; // the placeholder node in parent tree 父树中的占位符节点
        var renderContext = parentVnode && parentVnode.context; // this 上下文
        //判断children 有没有分发式插槽 并且过滤掉空的插槽,并且收集插槽
        vm.$slots = resolveSlots(options._renderChildren, renderContext);
        vm.$scopedSlots = emptyObject;
        // bind the createElement fn to this instance
        // so that we get proper render context inside it.
        // args order: tag, data, children, normalizationType, alwaysNormalize
        // internal version is used by render functions compiled from templates
        //将createElement fn绑定到这个实例
        //这样我们就得到了合适的渲染上下文。
        // args order: tag, data, children, normalizationType, alwaysNormalize
        //内部版本由模板编译的呈现函数使用
        //创建虚拟dom的数据结构
        vm._c = function (a, b, c, d) {
            console.log(a)
            console.log(b)
            console.log(c)
            console.log(d)

            return createElement(
                                    vm, //vm  new Vue 实例化的对象
                                    a, //有可能是vonde或者指令
                                    b,
                                    c,
                                    d,
                                    false
                                 );
        };
        // normalization is always applied for the public version, used in
        //的公共版本总是应用规范化
        // user-written render functions.
        //用户编写的渲染功能。
        vm.$createElement = function (a, b, c, d) {

            return createElement(vm, a, b, c, d, true);
        };

        // $attrs & $listeners are exposed for easier HOC creation.
        // they need to be reactive so that HOCs using them are always updated
        // $attrs和$listener将被公开，以便更容易地进行临时创建。
        //它们需要是反应性的，以便使用它们的HOCs总是更新的
        var parentData = parentVnode && parentVnode.data; //获取父vnode

        /* istanbul ignore else */
        {
            // 通过defineProperty的set方法去通知notify()订阅者subscribers有新的值修改
            defineReactive(
                vm,
                '$attrs',
                parentData && parentData.attrs || emptyObject,
                function () {
                    !isUpdatingChildComponent && warn("$attrs is readonly.", vm);
                },
                true
            );
            // 通过defineProperty的set方法去通知notify()订阅者subscribers有新的值修改
            defineReactive(vm, '$listeners', options._parentListeners || emptyObject, function () {
                !isUpdatingChildComponent && warn("$listeners is readonly.", vm);
            }, true);
        }
    }

    function renderMixin(Vue) {
        // install runtime convenience helpers 安装运行时方便助手
        // 安装渲染助手
        installRenderHelpers(Vue.prototype);

        Vue.prototype.$nextTick = function (fn) {
            //为callbacks 收集队列cb 函数 并且根据 pending 状态是否要触发callbacks 队列函数
            return nextTick(fn, this)
        };
        //渲染函数
        Vue.prototype._render = function () {
            var vm = this;
            //获取vm参数
            var ref = vm.$options;
            /*
             render 是  虚拟dom，需要执行的编译函数 类似于这样的函数
             (function anonymous( ) {
                   with(this){return _c('div',{attrs:{"id":"app"}},[_c('input',{directives:[{name:"info",rawName:"v-info"},{name:"data",rawName:"v-data"}],attrs:{"type":"text"}}),_v(" "),_m(0)])}
             })
             */
            var render = ref.render;
            var _parentVnode = ref._parentVnode;

            // reset _rendered flag on slots for duplicate slot check
            //重置槽上的_render标记，以检查重复槽
            {
                for (var key in vm.$slots) {
                    // $flow-disable-line
                    //标志位
                    vm.$slots[key]._rendered = false;
                }
            }

            if (_parentVnode) {  //判断是否有parentVnode
                // data.scopedSlots = {default: children[0]};  //获取插槽
                vm.$scopedSlots = _parentVnode.data.scopedSlots || emptyObject;
            }

            // set parent vnode. this allows render functions to have access
            //设置父vnode。这允许呈现函数具有访问权限
            // to the data on the placeholder node.
            //到占位符节点上的数据。

            //把父层的Vnode 赋值的到$vnode
            vm.$vnode = _parentVnode;
            // render self
            var vnode;
            try {
                //创建一个空的组件
                // vm.$options.render = createEmptyVNode;
                //_renderProxy 代理拦截
                /*
                 render 是  虚拟dom，需要执行的编译函数 类似于这样的函数
                 (function anonymous(
                 ) {

                      with(this){return _c('div',{attrs:{"id":"app"}},[_c('input',{directives:[{name:"info",rawName:"v-info"},{name:"data",rawName:"v-data"}],attrs:{"type":"text"}}),_v(" "),_m(0),_v(" "),_c('div',[_v("\n        "+_s(message)+"\n    ")])])}
                 })
                 */

                vnode = render.call(
                    vm._renderProxy, //this指向 其实就是vm
                    vm.$createElement //这里虽然传参进去但是没有接收参数
                );
                console.log(vnode)


            } catch (e) { //收集错误信息 并抛出
                handleError(e, vm, "render");
                // return error render result,
                // or previous vnode to prevent render error causing blank component
                //返回错误渲染结果，
                //或以前的vnode，以防止渲染错误导致空白组件
                /* istanbul ignore else */
                {
                    if (vm.$options.renderError) {
                        try {
                            vnode = vm.$options.renderError.call(vm._renderProxy, vm.$createElement, e);
                        } catch (e) {
                            handleError(e, vm, "renderError");
                            vnode = vm._vnode;
                        }
                    } else {
                        vnode = vm._vnode;
                    }
                }
            }
            // return empty vnode in case the render function errored out 如果呈现函数出错，返回空的vnode
            if (!(vnode instanceof VNode)) {
                if ("development" !== 'production' && Array.isArray(vnode)) {
                    warn(
                        'Multiple root nodes returned from render function. Render function ' +
                        'should return a single root node.',
                        vm
                    );
                }
                //创建一个节点 为注释节点 空的vnode
                vnode = createEmptyVNode();
            }
            // set parent
            vnode.parent = _parentVnode; //设置父vnode
            return vnode
        };
    }

    /*  */

    var uid$3 = 0;
    //初始化vue
    function initMixin(Vue) {
        Vue.prototype._init = function (options) { //初始化函数

            var vm = this;
            // a uid
            vm._uid = uid$3++; //id

            var startTag,  //开始标签
                endTag;  //结束标签
            /* istanbul ignore if */
            //浏览器性能监控
            if ("development" !== 'production' && config.performance && mark) {
                startTag = "vue-perf-start:" + (vm._uid);
                endTag = "vue-perf-end:" + (vm._uid);
                mark(startTag);
            }

            // a flag to avoid this being observed 一个避免被观察到的标志
            vm._isVue = true;
            // merge options 合并选项 参数
            if (options && options._isComponent) { //判断是否是组件
                // optimize internal component instantiation
                // since dynamic options merging is pretty slow, and none of the
                // internal component options needs special treatment.
                //优化内部组件实例化
                //因为动态选项合并非常慢，没有一个是内部组件选项需要特殊处理。
                //初始化内部组件
                initInternalComponent(vm, options);
            } else {
                //合并参数 将两个对象合成一个对象 将父值对象和子值对象合并在一起，并且优先取值子值，如果没有则取子值
                vm.$options = mergeOptions(
                    resolveConstructorOptions(vm.constructor), //  //解析constructor上的options属性的
                    options || {},
                    vm
                );
            }
            /* istanbul ignore else */
            {
                //初始化 代理 监听
                initProxy(vm);
            }
            // expose real self 暴露真实的self
            vm._self = vm;
            initLifecycle(vm); //初始化生命周期 标志
            initEvents(vm); //初始化事件
            initRender(vm); // 初始化渲染
            callHook(vm, 'beforeCreate'); //触发beforeCreate钩子函数
            initInjections(vm); // resolve injections before data/props 在数据/道具之前解决注入问题 //初始化 inject
            initState(vm);  //    //初始化状态
            initProvide(vm); // resolve provide after data/props  解决后提供数据/道具  provide 选项应该是一个对象或返回一个对象的函数。该对象包含可注入其子孙的属性，用于组件之间通信。
            callHook(vm, 'created'); //触发created钩子函数

            /* istanbul ignore if */
            //浏览器 性能监听
            if ("development" !== 'production' && config.performance && mark) {
                vm._name = formatComponentName(vm, false);
                mark(endTag);
                measure(("vue " + (vm._name) + " init"), startTag, endTag);
            }

            if (vm.$options.el) {
                // Vue 的$mount()为手动挂载，
                // 在项目中可用于延时挂载（例如在挂载之前要进行一些其他操作、判断等），之后要手动挂载上。
                // new Vue时，el和$mount并没有本质上的不同。
                vm.$mount(vm.$options.el);
            }
        };

    }

    //初始化内部组件
    function initInternalComponent(vm,  //vue实例
                                   options //选项参数
    ) {
        var opts = vm.$options = Object.create(vm.constructor.options); //vm的参数
        // doing this because it's faster than dynamic enumeration. 这样做是因为它比动态枚举快。
        // var options = {
        //     _isComponent: true, //是否是组件
        //     parent: parent, //组件的父节点
        //     _parentVnode: vnode, //组件的 虚拟vonde 父节点
        //     _parentElm: parentElm || null, //父节点的dom el
        //     _refElm: refElm || null //当前节点 el
        // }
        var parentVnode = options._parentVnode;
        opts.parent = options.parent; //组件的父节点
        opts._parentVnode = parentVnode; //组件的 虚拟vonde 父节点
        opts._parentElm = options._parentElm; //父节点的dom el
        opts._refElm = options._refElm; //当前节点 el

        var vnodeComponentOptions = parentVnode.componentOptions; //组件参数
        opts.propsData = vnodeComponentOptions.propsData; //组件数据
        opts._parentListeners = vnodeComponentOptions.listeners;//组件 事件
        opts._renderChildren = vnodeComponentOptions.children;  //组件子节点
        opts._componentTag = vnodeComponentOptions.tag; //组件的标签

        if (options.render) { //渲染函数
            opts.render = options.render; //渲染函数
            opts.staticRenderFns = options.staticRenderFns; //静态渲染函数
        }
    }

    //解析new Vue constructor上的options拓展参数属性的 合并 过滤去重数据
    function resolveConstructorOptions(Ctor) {
        var options = Ctor.options;
        // 有super属性，说明Ctor是Vue.extend构建的子类 继承的子类
        if (Ctor.super) { //超类
            var superOptions = resolveConstructorOptions(Ctor.super); //回调超类 表示继承父类
            var cachedSuperOptions = Ctor.superOptions; // Vue构造函数上的options,如directives,filters,....
            if (superOptions !== cachedSuperOptions) { //判断如果 超类的options不等于子类的options 的时候
                // super option changed,
                // need to resolve new options.
                //超级选项改变，
                //需要解决新的选项。
                Ctor.superOptions = superOptions; //让他的超类选项赋值Ctor.superOptions
                // check if there are any late-modified/attached options (#4976) 检查是否有任何后期修改/附加选项(#4976)
                // 解决修改选项 转义数据 合并 数据
                var modifiedOptions = resolveModifiedOptions(Ctor);
                // update base extend options 更新基本扩展选项
                if (modifiedOptions) {
                    //extendOptions合并拓展参数
                    extend(Ctor.extendOptions, modifiedOptions);
                }
                // 优先取Ctor.extendOptions 将两个对象合成一个对象 将父值对象和子值对象合并在一起，并且优先取值子值，如果没有则取子值
                options = Ctor.options = mergeOptions(superOptions, Ctor.extendOptions);
                if (options.name) { //如果参数含有name 组件name

                    options.components[options.name] = Ctor;
                }
            }
        }
        return options //返回参数
    }

    //解决修改options 转义数据 合并 数据
    function resolveModifiedOptions(Ctor) {
        var modified;
        var latest = Ctor.options; //获取选项
        var extended = Ctor.extendOptions;  //获取拓展的选项
        var sealed = Ctor.sealedOptions;  //获取子类选项
        for (var key in latest) {  //遍历最新选项
            if (latest[key] !== sealed[key]) {  //如果选项不等于子类选项
                if (!modified) {
                    modified = {};
                }
                //合并参数
                modified[key] = dedupe(latest[key], extended[key], sealed[key]);
            }
        }
        //返回合并后的参数
        return modified
    }

    //转换判断最新的选项是否是数组，如果是数组则将他们拓展和最新还有自选项 合并数组。如果是对象直接返回最新的对象
    function dedupe(
                    latest,//最新的选项
                    extended, //拓展的选项
                    sealed  //获取子类选项
    ) {
        // compare latest and sealed to ensure lifecycle hooks won't be duplicated
        // between merges
        //比较最新的和密封的，确保生命周期钩子不会重复
        //之间的合并
        if (Array.isArray(latest)) {  //如果是数组
            var res = [];
            sealed = Array.isArray(sealed) ? sealed : [sealed]; //对象转义数组
            extended = Array.isArray(extended) ? extended : [extended];//对象转义数组
            for (var i = 0; i < latest.length; i++) {
                // push original options and not sealed options to exclude duplicated options
                //推动原始选项和非密封选项排除重复的选项 过滤重复选项
                if (extended.indexOf(latest[i]) >= 0 || sealed.indexOf(latest[i]) < 0) {
                    res.push(latest[i]);
                }
            }
            //返回数组
            return res
        } else {
            //返回对象
            return latest
        }
    }

    //vue 构造函数
    function Vue(options) {
        if ("development" !== 'production' && !(this instanceof Vue)
        ) {
            warn('Vue is a constructor and should be called with the `new` keyword');
        }
        this._init(options);
    }

    initMixin(Vue);    //初始化vue
    stateMixin(Vue);  //数据绑定，$watch方法
    eventsMixin(Vue);  // 初始化事件绑定方法
    lifecycleMixin(Vue); // 初始化vue 更新 销毁 函数
    renderMixin(Vue); //初始化vue 需要渲染的函数


    /*  */
    // 初始化vue 安装插件函数
    function initUse(Vue) {
        //安装 Vue.js 插件。
        Vue.use = function (plugin) {
            var installedPlugins = (this._installedPlugins || (this._installedPlugins = []));
            //
            if (installedPlugins.indexOf(plugin) > -1) { //判断是否已经安装过插件了

                return this
            }

            // additional parameters//额外的参数
            var args = toArray(arguments, 1);  //变成真的数组
            args.unshift(this); //在前面添加
            if (typeof plugin.install === 'function') { //如果plugin.install 是个函数 则执行安装
                plugin.install.apply(plugin, args);
            } else if (typeof plugin === 'function') { //如果plugin 是个函数则安装
                plugin.apply(null, args);
            }
            installedPlugins.push(plugin); // 将已经安装过的插件添加到队列去
            return this
        };
    }

    /*  */
    //初始化vue mixin 函数
    function initMixin$1(Vue) {
        Vue.mixin = function (mixin) {
            // 合并 对象
            this.options = mergeOptions(this.options, mixin);
            return this
        };
    }

    /*  */
    //初始化 vue extend 函数
    function initExtend(Vue) {
        /**
         * Each instance constructor, including Vue, has a unique
         * cid. This enables us to create wrapped "child
         * constructors" for prototypal inheritance and cache them.
         */
        Vue.cid = 0;
        var cid = 1;

        /**
         Vue.extend//使用基础 Vue 构造器，创建一个“子类”。参数是一个包含组件选项的对象。合并继承new 实例化中的拓展参数或者是用户直接使用Vue.extend 的拓展参数。把对象转义成组件构造函数。创建一个sub类 构造函数是VueComponent，合并options参数，把props属性和计算属性添加到观察者中。//如果组件含有名称 则 把这个对象存到 组件名称中, 在options拓展参数的原型中能获取到该数据Sub.options.components[name] = Sub 简称Ctor，返回该构造函数
         */
        Vue.extend = function (extendOptions) { //使用基础 Vue 构造器，创建一个“子类”。参数是一个包含组件选项的对象。

            extendOptions = extendOptions || {};
            var Super = this;
            var SuperId = Super.cid;
            var cachedCtors = extendOptions._Ctor || (extendOptions._Ctor = {}); //组件构造函数
            if (cachedCtors[SuperId]) { //父类 超类id
                return cachedCtors[SuperId] //获取 超类
            }
            var name = extendOptions.name || Super.options.name; //获取组件的name
            if ("development" !== 'production' && name) {
                //  验证组件名称 必须是大小写，并且是-横杆
                validateComponentName(name);
            }
            //实例化 组件 对象
            var Sub = function VueComponent(options) {
                console.log('==this._init')
                console.log(this._init)

                // vue中的_init 函数   Vue.prototype._init
                this._init(options);
            };
            //创建一个对象 继承 超类的原型
            Sub.prototype = Object.create(Super.prototype);
            //让他的构造函数指向回来，防止继承扰乱。
            Sub.prototype.constructor = Sub;
            //id 加加。标志 不同的组件
            Sub.cid = cid++;
            //合并参数
            Sub.options = mergeOptions(
                Super.options,
                extendOptions
            );
            //记录超类
            Sub['super'] = Super;

            // For props and computed properties, we define the proxy getters on
            // the Vue instances at extension time, on the extended prototype. This
            // avoids Object.defineProperty calls for each instance created.
            //对于道具和计算属性，我们定义代理getter
            //在扩展原型上的扩展时的Vue实例。这避免为创建的每个实例调用Object.defineProperty。
            if (Sub.options.props) { //获取props属性 如果有
                //初始化属性 并且把组件的属性 加入 观察者中
                initProps$1(Sub);
            }
            if (Sub.options.computed) { //组件计算属性
                //定义计算属性 并且 把属性的数据 添加到对象监听中
                initComputed$1(Sub);
            }

            // allow further extension/mixin/plugin usage 允许进一步的扩展/混合/插件使用
            Sub.extend = Super.extend;
            Sub.mixin = Super.mixin;
            Sub.use = Super.use;

            // create asset registers, so extended classes
            // can have their private assets too.
            //创建资产注册，所以扩展类
            //也可以拥有他们的私人资产。

            // var ASSET_TYPES = [
            //     'component',  //组建指令
            //     'directive', //定义指令 指令
            //     'filter'  //过滤器指令
            // ];
            ASSET_TYPES.forEach(function (type) {
                Sub[type] = Super[type];
            });
            // enable recursive self-lookup 使递归self-lookup
            if (name) { //如果组件含有名称 则 把这个对象存到 组件名称中, 在options拓展参数的原型中能获取到该数据
                console.log(name)

                Sub.options.components[name] = Sub;
            }

            // keep a reference to the super options at extension time.
            // later at instantiation we can check if Super's options have
            // been updated.
            //在扩展时保留对超级选项的引用。
            //稍后在实例化时，我们可以检查Super的选项是否具有
            //更新。
            Sub.superOptions = Super.options; //超类 父类的拓展参数
            Sub.extendOptions = extendOptions; //子类拓参数
            Sub.sealedOptions = extend({}, Sub.options); //合并

            // cache constructor
            cachedCtors[SuperId] = Sub; // 当前缓存的构造函数
            console.log(cachedCtors)

            return Sub
        };
    }


    //初始化属性 并且把组件的属性 加入 观察者中
    function initProps$1(Comp) {
        var props = Comp.options.props; //组件属性
        for (var key in props) { //
            proxy(Comp.prototype, "_props", key);
        }
    }

    //初始化 组件计算属性
    function initComputed$1(Comp) {
        var computed = Comp.options.computed;
        for (var key in computed) {
            //定义计算属性 并且 把属性的数据 添加到对象监听中
            defineComputed(Comp.prototype, key, computed[key]);
        }
    }

    /*
     *  为vue 添加 静态方法component，directive，，filter
     * */
    function initAssetRegisters(Vue) {
        /**
         * Create asset registration methods.
         *
         *
         *  // var ASSET_TYPES = [
         //     'component',  //组建指令
         //     'directive', //定义指令 指令
         //     'filter'  //过滤器指令
         // ];
         *为vue 添加 静态方法component，directive，filter
         *
         */
        ASSET_TYPES.forEach(function (type) {

            Vue[type] = function (
                 id, //id
                 definition //new Vue拓展参数对象
            ) {
                console.log(definition)


                if (!definition) {  //如果definition不存在
                    return this.options[type + 's'][id] //返回
                } else {
                    /* istanbul ignore if */
                    if ("development" !== 'production' && type === 'component') {
                        // 验证组件名称 必须是大小写，并且是-横杆
                        validateComponentName(id);
                    }
                    if (type === 'component' && isPlainObject(definition)) { //如果类型是组件
                        definition.name = definition.name || id; //名称如果有定义就获取 如果没有 就按照id的来

                        definition = this.options._base.extend(definition); // Class inheritance 类继承 用于vue多个组件中的合并拓展参数

                    }
                    if (type === 'directive' && typeof definition === 'function') { //如果类型是指令
                        definition = {bind: definition, update: definition};
                    }
                    this.options[type + 's'][id] = definition; //返回集合
                    return definition
                }
            };
        });
    }

    /*
     * 获取组件的名称
     */
    function getComponentName(opts) {
        return opts && (opts.Ctor.options.name || opts.tag)
    }

    // 判断pattern 中是否还有 name
    function matches(pattern, name) {
        if (Array.isArray(pattern)) { //如果是数组
            return pattern.indexOf(name) > -1 // 是否存在
        } else if (typeof pattern === 'string') { //如果是字符串
            return pattern.split(',').indexOf(name) > -1 //判断是否存在
        } else if (isRegExp(pattern)) { // 如果是正则 则用正则表示
            return pattern.test(name)
        }
        /* istanbul ignore next */
        return false
    }

    function pruneCache(keepAliveInstance, //当前保持活着的实例
                        filter //函数过滤器
    ) {
        var cache = keepAliveInstance.cache; // 控对象
        var keys = keepAliveInstance.keys; //获取key
        var _vnode = keepAliveInstance._vnode;
        for (var key in cache) { // 循环
            var cachedNode = cache[key]; //获取值
            if (cachedNode) { //值存在
                var name = getComponentName(cachedNode.componentOptions); // 获取组件的名称
                if (name && !filter(name)) { //如果name已经被销毁掉
                    pruneCacheEntry( //检测缓存中的组件，如果不是当前激活的组件则销毁
                        cache,
                        key,
                        keys,
                        _vnode
                    );
                }
            }
        }
    }

    //检测缓存中的组件，如果不是当前激活的组件则销毁
    function pruneCacheEntry(cache, //缓存对象
                             key, //单个key
                             keys, //多个key
                             current //当前虚拟dom
    ) {
        var cached$$1 = cache[key]; //获取值遍历中的值
        if (cached$$1 && (!current || cached$$1.tag !== current.tag)) {
            //判断遍历中的值 如果不等于当前活跃的组件则让他销毁
            cached$$1.componentInstance.$destroy();
        }

        cache[key] = null;
        remove(keys, key);
    }

    var patternTypes = [String, RegExp, Array]; //类型

    var KeepAlive = {   //  <keep-alive> 包裹动态组件时，会缓存不活动的组件实例，而不是销毁它们。
        name: 'keep-alive',
        abstract: true, //标准是静态组件
        props: {
            include: patternTypes,  // 设置include类型 允许[String, RegExp, Array]  缓存还没有销毁的组件
            exclude: patternTypes, // 设置include类型 允许[String, RegExp, Array]   缓存已经被销毁的组件
            max: [String, Number] // 设置include类型 允许 [String, Number]
        },
        created: function created() { //created生命周期
            this.cache = Object.create(null); //创建一个缓存的空对象
            this.keys = []; //缓存key
        },

        destroyed: function destroyed() { //销毁 生命周期
            var this$1 = this;
            for (var key in this$1.cache) {
                //销毁所有组件
                pruneCacheEntry(
                    this$1.cache, key,
                    this$1.keys
                );
            }
        },

        mounted: function mounted() { //组件初始化 生命周期
            var this$1 = this;
            this.$watch(
                'include',  //监听 include 数据是否有变化
                function (val) { //监听为完后更新的值
                    pruneCache(
                        this$1,
                        function (name) {
                            // 判断include 中是否还有 name 就证明组件还在
                            return matches(val, name);
                            //判断include 对象中 name 不存在了 就 调用 检测缓存中的组件，如果不是当前激活的组件则销毁
                        });
                });
            this.$watch(
                'exclude',  //监听 exclude 数据是否有变化
                function (val) {
                    pruneCache(this$1, function (name) {
                        //如果exclude 对象中存在name 不存在了 就 调用 检测缓存中的组件，如果不是当前激活的组件则销毁
                        return !matches(val, name);
                    });
                });
        },

        // 渲染 keepAlive 组件
        render: function render() {
            var slot = this.$slots.default; //获取插槽
            var vnode = getFirstComponentChild(slot); // 获取插槽子组件
            var componentOptions = vnode && vnode.componentOptions; //获取组件参数
            if (componentOptions) {
                // check pattern
                var name = getComponentName(componentOptions); //获取组件名称
                var ref = this;
                var include = ref.include; //获取include
                var exclude = ref.exclude; //获取exclude
                if (
                    // not included 没有包括在内
                (include && (!name || !matches(include, name))) || //如果include存在,并且name不存在，或者name不存在include中则进if
                // excluded
                (exclude && name && matches(exclude, name)) //如果exclude存在 并且name存在 并且name存在exclude对象中
                ) {
                    return vnode  //返回虚拟dom
                }

                var ref$1 = this; //获取当前this vm
                var cache = ref$1.cache; //缓存的对象
                var keys = ref$1.keys; //获取keys 所有的key
                var key = vnode.key == null // 判断当前虚拟dom得key 是否为空
                    // same constructor may get registered as different local components
                    // so cid alone is not enough (#3269)
                    //同一个构造函数可以注册为不同的本地组件
                    //单靠cid是不够的(#3269)
                    //这里三木是 判断组件是否有cid 如果有 则 判断 是否有组件标签，如果有组件标签则返回 '::'+组件标签，如果没有组件标签则返回空。如果没有 判断组件是否有cid 则返回 vnode.key

                    ? componentOptions.Ctor.cid + (componentOptions.tag ?
                    ("::" + (componentOptions.tag)) :
                    '') :
                    vnode.key;
                if (cache[key]) { //获取值 如果key存在
                    vnode.componentInstance = cache[key].componentInstance; //直接获取组件实例化
                    // make current key freshest
                    remove(keys, key);  //把key添加到末端
                    keys.push(key);
                } else {
                    //将虚拟dom缓存起来
                    cache[key] = vnode;
                    keys.push(key); //key缓存起来
                    // prune oldest entry //删除最老的条目
                    //设定最大的缓存值
                    if (this.max && keys.length > parseInt(this.max)) {
                        pruneCacheEntry(
                            cache,
                            keys[0], //第一个key
                            keys, //keys[]
                            this._vnode //当前活跃的组件
                        );
                    }
                }

                vnode.data.keepAlive = true;
            }
            return vnode || (slot && slot[0])
        }
    }
    //
    var builtInComponents = {
        KeepAlive: KeepAlive
    }

    /*
     * 初始化全局api 并且暴露 一些静态方法
     */
    function initGlobalAPI(Vue) {
        // config
        var configDef = {};
        configDef.get = function () {
            return config;
        };
        {
            configDef.set = function () {
                warn(
                    'Do not replace the Vue.config object, set individual fields instead.'
                );
            };
        }
        Object.defineProperty(Vue, 'config', configDef);

        // exposed util methods.
        // NOTE: these are not considered part of the public API - avoid relying on
        // them unless you are aware of the risk.
        //暴露的util方法。
        //注意:这些不是公共API的一部分——避免依赖
        //除非你意识到其中的风险。
        Vue.util = {
            warn: warn, //警告函数
            extend: extend, //继承方式
            mergeOptions: mergeOptions, //合并参数
            defineReactive: defineReactive // 通过defineProperty的set方法去通知notify()订阅者subscribers有新的值修改 添加观察者 get set方法
        };

        Vue.set = set; //暴露接口静态方法 set
        Vue.delete = del; //暴露接口静态方法 delete 方法
        Vue.nextTick = nextTick; // 暴露接口静态方法 nextTick 方法

        Vue.options = Object.create(null); //创建一个空的参数
        // var ASSET_TYPES = [
        //     'component',  //组建指令
        //     'directive', //定义指令 指令
        //     'filter'  //过滤器指令
        // ];
        //
        //添加components ，directives， filters 指令组件 控对象
        ASSET_TYPES.forEach(function (type) {
            Vue.options[type + 's'] = Object.create(null);
        });

        // this is used to identify the "base" constructor to extend all plain-object
        // components with in Weex's multi-instance scenarios.
        //用来标识扩展所有普通对象的“基”构造函数
        // Weex的多实例场景中的组件。
        Vue.options._base = Vue;

        extend(Vue.options.components, builtInComponents); //合并  KeepAlive参数中的组件对象
        initUse(Vue); //  初始化vue 安装插件函数
        initMixin$1(Vue);  //初始化vue mixin 函数
        initExtend(Vue); //初始化 vue extend 函数
        initAssetRegisters(Vue); //为vue 添加 静态方法component，directive，，filter
    }

    //初始化全局api 并且暴露 一些静态方法
    initGlobalAPI(Vue);

    //监听是否是服务器环境
    Object.defineProperty(Vue.prototype, '$isServer', {
        get: isServerRendering
    });
    // 获取$ssrContext
    Object.defineProperty(Vue.prototype, '$ssrContext', {
        get: function get() {
            /* istanbul ignore next */
            return this.$vnode && this.$vnode.ssrContext
        }
    });

    // expose FunctionalRenderContext for ssr runtime helper installation
    //为ssr运行时帮助程序安装公开FunctionalRenderContext 创建 虚拟dom vonde 渲染 slots插槽
    Object.defineProperty(Vue, 'FunctionalRenderContext', {
        value: FunctionalRenderContext
    });

    Vue.version = '2.5.16'; //版本号


    // these are reserved for web because they are directly compiled away
    // during template compilation
    //这些是为web保留的，因为它们是直接编译掉的
    //在模板编译期间
    //  isReservedAttr是一个函数判断 传入字符串style或者class的是否返回真
    var isReservedAttr = makeMap('style,class');

    // attributes that should be using props for binding
    //用于绑定props的属性 acceptValue是一个函数判断传入字符串'input,textarea,option,select,progress'的是否返回真
    var acceptValue = makeMap('input,textarea,option,select,progress');
    //校验属性
    var mustUseProp = function (tag, type, attr) {
        /*
         * 1. attr === 'value', tag 必须是 'input,textarea,option,select,progress' 其中一个 type !== 'button'
         * 2. attr === 'selected' && tag === 'option'
         * 3. attr === 'checked' && tag === 'input'
         * 4. attr === 'muted' && tag === 'video'
         * 的情况下为真
         * */
        return (
            (attr === 'value' && acceptValue(tag)) && type !== 'button' || //
            (attr === 'selected' && tag === 'option') ||
            (attr === 'checked' && tag === 'input') ||
            (attr === 'muted' && tag === 'video')
        )
    };

    //contenteditable 是否可以编辑属性
    //draggable html5设置是否可以拖动
    //spellcheck 进行拼写检查的可编辑段落：
    var isEnumeratedAttr = makeMap('contenteditable,draggable,spellcheck');


    //检查是否是html中的布尔值属性  就是该属性只有 true 和 false
    //     HTML5的boolean值得属性：
    // checkd,checked="",checked="checked",checked=true,checke=false 只要有checked属性，其属性值有没有都认为选中状态
    var isBooleanAttr = makeMap(
        'allowfullscreen,async,autofocus,autoplay,checked,compact,controls,declare,' +
        'default,defaultchecked,defaultmuted,defaultselected,defer,disabled,' +
        'enabled,formnovalidate,hidden,indeterminate,inert,ismap,itemscope,loop,multiple,' +
        'muted,nohref,noresize,noshade,novalidate,nowrap,open,pauseonexit,readonly,' +
        'required,reversed,scoped,seamless,selected,sortable,translate,' +
        'truespeed,typemustmatch,visible'
    );

    var xlinkNS = 'http://www.w3.org/1999/xlink';
    //判断是否是xmlns 属性 例子 <bookstore xmlns:xlink="http://www.w3.org/1999/xlink">
    var isXlink = function (name) {
        return name.charAt(5) === ':' && name.slice(0, 5) === 'xlink'
    };

    //获取xml link的属性
    var getXlinkProp = function (name) {
        return isXlink(name) ? name.slice(6, name.length) : ''
    };

    //判断val 是否是 null 或者 false
    var isFalsyAttrValue = function (val) {
        return val == null || val === false
    };

    /*

     * class 转码获取vonde 中的staticClass 静态class  和class动态class转义成真实dom需要的class格式。然后返回class字符串
     * */
    function genClassForVnode(vnode) {
        var data = vnode.data;  //获取vnode.data 数据 标签属性数据
        var parentNode = vnode; //获取 父节点
        var childNode = vnode; //获取子节点
        //  this.componentInstance = undefined;  /*当前节点对应的组件的实例*/
        while (isDef(childNode.componentInstance)) { //如果定义了componentInstance 组件实例  递归合并子组件的class
            childNode = childNode.componentInstance._vnode; //上一个vnode
            if (childNode && childNode.data) {
                data = mergeClassData(childNode.data, data);
            }
        }
        while (isDef(parentNode = parentNode.parent)) { //递归父组件parent 合并父组件class
            if (parentNode && parentNode.data) {
                //合并calss数据
                data = mergeClassData(data, parentNode.data);
            }
        }
        return renderClass(data.staticClass, data.class) //渲染calss
    }

    //合并calss数据
    function mergeClassData(child, parent) {

        return {
            staticClass: concat(child.staticClass, parent.staticClass), //静态calss
            class: isDef(child.class)  //data中动态calss
                ? [child.class, parent.class]
                : parent.class
        }
    }

    //渲染calss 这里获取到已经转码的calss
    function renderClass(
                         staticClass, //静态class
                         dynamicClass //动态calss
    ) {
        if (isDef(staticClass) || isDef(dynamicClass)) {
            //连接class
            return concat(
                staticClass, //静态的class 就是class 属性的class
                stringifyClass(dynamicClass) //动态class就是vonde对象中的class 需要stringifyClass转义成 真实dom需要的class
            )
        }
        /* istanbul ignore next */
        return ''
    }


    //class 连接
    function concat(a, b) {
        return a ?
                (   b ?
                    (a + ' ' + b) :
                                    a
                ):
                  (b || '')
    }


    //转码 class，把数组格式，对象格式的calss 全部转化成 字符串格式
    function stringifyClass(value) {
        if (Array.isArray(value)) { //如果是数组
            //数组变成字符串，然后用空格 隔开 拼接 起来变成字符串
            return stringifyArray(value)
        }
        if (isObject(value)) {
            return stringifyObject(value)
        }
        //直到全部转成 字符串才结束递归
        if (typeof value === 'string') {
            return value
        }
        /* istanbul ignore next */
        return ''
    }

    //数组字符串变成字符串，然后用空格 隔开 拼接 起来变成字符串
    function stringifyArray(value) {
        var res = '';
        var stringified;
        for (var i = 0, l = value.length; i < l; i++) {
            if (isDef(stringified = stringifyClass(value[i])) && stringified !== '') {
                if (res) {
                    res += ' ';
                }
                res += stringified;
            }
        }
        return res
    }

    //对象字符串变成字符串，然后用空格 隔开 拼接 起来变成字符串
    function stringifyObject(value) {
        var res = '';
        for (var key in value) {
            if (value[key]) {
                if (res) {
                    res += ' ';
                }
                res += key;
            }
        }
        return res
    }

    /*
     *
     * */
    var namespaceMap = {
        svg: 'http://www.w3.org/2000/svg', //svg标签命名xmlns属性
        math: 'http://www.w3.org/1998/Math/MathML' //math 中的xmlns属性声明 XHTML 文件
    };


    //isHTMLTag 函数，验证是否是html中的原始标签
    var isHTMLTag = makeMap(
        'html,body,base,head,link,meta,style,title,' +
        'address,article,aside,footer,header,h1,h2,h3,h4,h5,h6,hgroup,nav,section,' +
        'div,dd,dl,dt,figcaption,figure,picture,hr,img,li,main,ol,p,pre,ul,' +
        'a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,rtc,ruby,' +
        's,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video,' +
        'embed,object,param,source,canvas,script,noscript,del,ins,' +
        'caption,col,colgroup,table,thead,tbody,td,th,tr,' +
        'button,datalist,fieldset,form,input,label,legend,meter,optgroup,option,' +
        'output,progress,select,textarea,' +
        'details,dialog,menu,menuitem,summary,' +
        'content,element,shadow,template,blockquote,iframe,tfoot'
    );

    // this map is intentionally selective, only covering SVG elements that may
    // contain child elements.
    //此映射是有意选择的，只覆盖可能的SVG元素
    //包含子元素。
    //isSVG函数  判断svg 标签，包括svg子元素标签
    var isSVG = makeMap(
        'svg,animate,circle,clippath,cursor,defs,desc,ellipse,filter,font-face,' +
        'foreignObject,g,glyph,image,line,marker,mask,missing-glyph,path,pattern,' +
        'polygon,polyline,rect,switch,symbol,text,textpath,tspan,use,view',
        true
    );
    //判断标签是否是pre 如果是则返回真
    var isPreTag = function (tag) {
        return tag === 'pre';
    };
    //保留标签 判断是不是真的是 html 原有的标签 或者svg标签
    var isReservedTag = function (tag) {
        return isHTMLTag(tag) || isSVG(tag)
    };

    //判断 tag 是否是svg或者math 标签
    function getTagNamespace(tag) {
        //如果是svg
        if (isSVG(tag)) {
            return 'svg'
        }
        // basic support for MathML
        // note it doesn't support other MathML elements being component roots
        // MathML的基本支持
        //注意，它不支持作为组件根的其他MathML元素
        if (tag === 'math') {
            return 'math'
        }
    }

    var unknownElementCache = Object.create(null);


    //判断是不是真的是 html 原有的标签，判断是否是浏览器标准标签 包括标准html和svg标签
    //如果不是则返回真，这样就是用户自定义标签
    function isUnknownElement(tag) {
        /* istanbul ignore if */
        if (!inBrowser) {  //判断是否是浏览器
            return true
        }

        //保留标签 判断是不是真的是 html 原有的标签
        if (isReservedTag(tag)) {
            return false
        }
        //把标签转化成小写
        tag = tag.toLowerCase();
        /* istanbul ignore if */
        //缓存未知标签
        if (unknownElementCache[tag] != null) {
            //如果缓存有则返回出去
            return unknownElementCache[tag]
        }
        //创建该标签
        var el = document.createElement(tag);
        //判断是否是含有 - 的组件标签
        if (tag.indexOf('-') > -1) {
            // http://stackoverflow.com/a/28210364/1070244
            return (unknownElementCache[tag] = (
                el.constructor === window.HTMLUnknownElement ||
                el.constructor === window.HTMLElement
            ))
        } else {
            //正则判断标签是否是HTMLUnknownElement
            return (unknownElementCache[tag] = /HTMLUnknownElement/.test(el.toString()))
        }
    }

    //map 对象中的[name1,name2,name3,name4]  变成这样的map{name1:true,name2:true,name3:true,name4:true}
    //匹配'text,number,password,search,email,tel,url'
    var isTextInputType = makeMap('text,number,password,search,email,tel,url');

    /*  */

    /**
     * Query an element selector if it's not an element already.
     * html5 获取dom
     */
    function query(el) {
        if (typeof el === 'string') {
            var selected = document.querySelector(el);
            if (!selected) {
                "development" !== 'production' && warn(
                    'Cannot find element: ' + el
                );
                return document.createElement('div')
            }
            return selected
        } else {
            return el
        }
    }

    /* 
     创建一个真实的dom
     */
    function createElement$1(tagName, vnode) {
        //创建一个真实的dom
        var elm = document.createElement(tagName);
        if (tagName !== 'select') { //如果不是select标签则返回dom出去
            return elm
        }
        // false or null will remove the attribute but undefined will not
        // false或null将删除属性，但undefined不会
        if (vnode.data && vnode.data.attrs && vnode.data.attrs.multiple !== undefined) { //如果是select标签 判断是否设置了multiple属性。如果设置了则加上去

            elm.setAttribute('multiple', 'multiple');
        }
        return elm
    }

    //XML  createElementNS() 方法可创建带有指定命名空间的元素节点。
    //createElement差不多 创建一个dom节点
    //  document.createElementNS('http://www.w3.org/2000/svg','svg');
    //创建一个真实的dom svg方式
    function createElementNS(namespace, tagName) {
        // var namespaceMap = {
        //     svg: 'http://www.w3.org/2000/svg',
        //     math: 'http://www.w3.org/1998/Math/MathML'
        // };
        return document.createElementNS(namespaceMap[namespace], tagName)
    }

    //创建文本节点真是dom节点
    function createTextNode(text) {
        return document.createTextNode(text)
    }

    //创建一个注释节点
    function createComment(text) {
        return document.createComment(text)
    }

    //插入节点 在referenceNode  dom 前面插入一个节点
    function insertBefore(parentNode, newNode, referenceNode) {

        parentNode.insertBefore(newNode, referenceNode);
    }

    //删除子节点
    function removeChild(node, child) {
        node.removeChild(child);
    }

    //添加子节点 尾部
    function appendChild(node, child) {
        node.appendChild(child);
    }

    //获取父亲子节点dom
    function parentNode(node) {
        return node.parentNode
    }

    //获取下一个兄弟节点
    function nextSibling(node) {
        return node.nextSibling
    }

    //获取dom标签名称
    function tagName(node) {
        return node.tagName
    }

    //设置dom 文本
    function setTextContent(node, text) {
        node.textContent = text;
    }


    //设置组建样式的作用域
    function setStyleScope(node, scopeId) {
        node.setAttribute(scopeId, '');
    }

//Object.freeze()阻止修改现有属性的特性和值，并阻止添加新属性。
    var nodeOps = Object.freeze({
        createElement: createElement$1, //创建一个真实的dom
        createElementNS: createElementNS, //创建一个真实的dom svg方式
        createTextNode: createTextNode, // 创建文本节点
        createComment: createComment,  // 创建一个注释节点
        insertBefore: insertBefore,  //插入节点 在xxx  dom 前面插入一个节点
        removeChild: removeChild,   //删除子节点
        appendChild: appendChild,  //添加子节点 尾部
        parentNode: parentNode,  //获取父亲子节点dom
        nextSibling: nextSibling,     //获取下一个兄弟节点
        tagName: tagName,   //获取dom标签名称
        setTextContent: setTextContent, //  //设置dom 文本
        setStyleScope: setStyleScope  //设置组建样式的作用域
    });

    /*
     * ref 创建 更新 和 销毁 事件
     * */

    var ref = {
        create: function create(_, vnode) {
            //创建注册一个ref
            registerRef(vnode);
        },
        update: function update(oldVnode, vnode) {
            //更新ref
            if (oldVnode.data.ref !== vnode.data.ref) {

                registerRef(oldVnode, true); //先删除
                registerRef(vnode);  //在添加
            }
        },
        destroy: function destroy(vnode) {
            registerRef(vnode, true); //删除销毁ref
        }
    }
    //注册ref或者删除ref。比如标签上面设置了ref='abc' 那么该函数就是为this.$refs.abc 注册ref 把真实的dom存进去
    function registerRef(vnode, isRemoval) {
        var key = vnode.data.ref;  //获取vond ref的字符串
        if (!isDef(key)) {  //如果没有定义则不执行下面的代码了
            return
        }

        var vm = vnode.context;  //vm 上下文
        var ref = vnode.componentInstance || vnode.elm; //组件实例   或者   elm DOM 节点
        var refs = vm.$refs;   //获取vm总共的refs
        if (isRemoval) {  //标志是否删除ref
            if (Array.isArray(refs[key])) { //如果定义有多个同名的ref 则会定义为一个数组，删除refs 这个key 定义的数组
                remove(refs[key], ref); //删除ref
            } else if (refs[key] === ref) { //如果是单个的时候
                refs[key] = undefined;  //直接置空
            }
        } else {
            if (vnode.data.refInFor) { //如果ref和for一起使用的时候
                if (!Array.isArray(refs[key])) { //refs[key] 不是数组 则变成一个数组
                    refs[key] = [ref];
                } else if (refs[key].indexOf(ref) < 0) { //如果ref 不存在 refs的时候则添加进去
                    // $flow-disable-line
                    refs[key].push(ref);
                }
            } else {
                refs[key] = ref; //如果是单个直接赋值
            }
        }
    }

    /**
     * Virtual DOM patching algorithm based on Snabbdom by
     * Simon Friis Vindum (@paldepind)
     * Licensed under the MIT License
     * https://github.com/paldepind/snabbdom/blob/master/LICENSE
     *
     * modified by Evan You (@yyx990803)
     *
     * Not type-checking this because this file is perf-critical and the cost
     * of making flow understand it is not worth it.
     */
        //创建一个空的vnode
    var emptyNode = new VNode('', {}, []);

    var hooks = ['create', 'activate', 'update', 'remove', 'destroy'];

    //sameVnode(oldVnode, vnode)2个节点的基本属性相同，那么就进入了2个节点的diff过程。
    function sameVnode(a, b) {
        return (

            a.key === b.key && (   //如果a的key 等于b的key
                (

                    a.tag === b.tag && // 如果a的tag 等于b的tag
                    a.isComment === b.isComment && // 如果a和b 都是注释节点
                    isDef(a.data) === isDef(b.data) && //如果a.data 和 b.data 都定义后，是组件，或者是都含有tag属性
                    sameInputType(a, b)   //相同的输入类型。判断a和b的属性是否相同
                ) || (
                    isTrue(a.isAsyncPlaceholder) && //判断是否是异步的
                    a.asyncFactory === b.asyncFactory &&
                    isUndef(b.asyncFactory.error)
                )
            )
        )
    }

     //相同的输入类型。判断a和b的属性是否相同
    function sameInputType(a, b) {
        if (a.tag !== 'input') { //如果a标签不是input
            return true
        }
        var i;
        var typeA = isDef(i = a.data) && isDef(i = i.attrs) && i.type; //获取a的tag标签属性
        var typeB = isDef(i = b.data) && isDef(i = i.attrs) && i.type;//获取b的tag标签属性
        return typeA === typeB || //typeA和typeB 都相同
                                //匹配'text,number,password,search,email,tel,url'
                                 isTextInputType(typeA) && isTextInputType(typeB)
    }

    function createKeyToOldIdx(children, beginIdx, endIdx) {
        var i, key;
        var map = {};
        for (i = beginIdx; i <= endIdx; ++i) {
            key = children[i].key;
            if (isDef(key)) {
                map[key] = i;
            }
        }
        return map
    }

    //创建虚拟dom
    function createPatchFunction(backend) {
        /*
         var nodeOps = Object.freeze({
         createElement: createElement$1, //创建一个真实的dom
         createElementNS: createElementNS, //创建一个真实的dom svg方式
         createTextNode: createTextNode, // 创建文本节点
         createComment: createComment,  // 创建一个注释节点
         insertBefore: insertBefore,  //插入节点 在xxx  dom 前面插入一个节点
         removeChild: removeChild,   //删除子节点
         appendChild: appendChild,  //添加子节点 尾部
         parentNode: parentNode,  //获取父亲子节点dom
         nextSibling: nextSibling,     //获取下一个兄弟节点
         tagName: tagName,   //获取dom标签名称
         setTextContent: setTextContent, //  //设置dom 文本
         setStyleScope: setStyleScope  //设置组建样式的作用域
         });
         modules=[
         attrs,  // attrs包含两个方法create和update都是更新设置真实dom属性值 {create: updateAttrs,  update: updateAttrs   }
         klass, //klass包含类包含两个方法create和update都是更新calss。其实就是updateClass方法。 设置真实dom的class
         events, //更新真实dom的事件
         domProps, //更新真实dom的props 属性值
         style, // 更新真实dom的style属性。有两个方法create 和update 不过函数都是updateStyle更新真实dom的style属性值.将vonde虚拟dom的css 转义成并且渲染到真实dom的css中
         transition // 过度动画
         ref,  //ref创建，更新 ， 销毁 函数
         directives //自定义指令 创建 ，更新，销毁函数
         ]
         */
        console.log(backend)

        var i, j;
        var cbs = {};
        console.log('==backend==')
        console.log(backend)
        var modules = backend.modules;
        var nodeOps = backend.nodeOps;


        //  把钩子函数添加到cbs队列中  循环数字 var hooks = ['create', 'activate', 'update', 'remove', 'destroy'];
        for (i = 0; i < hooks.length; ++i) {
            cbs[hooks[i]] = [];
            //循环modules 数组
            for (j = 0; j < modules.length; ++j) {
                //判断modules上面是否有定义有  'create', 'activate', 'update', 'remove', 'destroy'
                if (isDef(modules[j][hooks[i]])) {
                    //如果有则把他添加到cbs 对象数组中
                    cbs[hooks[i]].push(modules[j][hooks[i]]); //把钩子函数添加到cbs队列中
                }
            }
        }
        /*
         cbs={
                 'create':[],
                 'activate':[],
                 'update':[],
                 'remove':[],
                 'destroy:[]
         }
         */


        //创建一个vnode节点
        function emptyNodeAt(elm) {
            // tag,  /*当前节点的标签名*/
            //     data, /*当前节点对应的对象，包含了具体的一些数据信息，是一个VNodeData类型，可以参考VNodeData类型中的数据信息*/
            //     children, //子节点
            //     text, //文本
            //     elm, /*当前节点*/
            //     context,  /*编译作用域*/
            //     componentOptions, /*组件的option选项*/
            //     asyncFactory
            return new VNode(
                nodeOps.tagName(elm).toLowerCase(),
                {},
                [],
                undefined,
                elm
            )
        }

        //创建一个RmCb
        function createRmCb(
                            childElm,  //子节点
                            listeners //事件数组
        ) {

            function remove() {
                //如果listeners === 0 的时候就删除掉该子节点
                if (--remove.listeners === 0) {
                    removeNode(childElm);
                }
            }

            remove.listeners = listeners;
            return remove
        }

        //删除真实的dom  参数el 是dom
        function removeNode(el) {
            // function parentNode(node) {
            //     return node.parentNode
            // }
            //获取父亲dom
            var parent = nodeOps.parentNode(el);
            // element may have already been removed due to v-html / v-text
            // 元素可能已经由于v-html / v-text而被删除
            //判断父亲dom是否存在 如果存在则
            // function removeChild(node, child) {
            //     node.removeChild(child);
            // }
            //删除子节点
            if (isDef(parent)) {
                nodeOps.removeChild(parent, el);
            }
        }

        // 检查dom 节点的tag标签 类型 是否是VPre 标签 或者是判断是否是浏览器自带原有的标签
        function isUnknownElement$$1(
                                     vnode,   //vnode
                                     inVPre      //标记 标签是否还有 v-pre 指令，如果没有则是false
        ) {
            return (
                !inVPre && // 标记 标签是否还有 v-pre 指令，如果没有则是false
                !vnode.ns && !(
                    config.ignoredElements.length &&
                    config.ignoredElements.some(function (ignore) {  //some() 方法测试是否至少有一个元素通过由提供的函数实现的测试。
                        return isRegExp(ignore)   //判断是否是正则对象
                            ? ignore.test(vnode.tag)
                            : ignore === vnode.tag
                    })
                ) &&
                //判断是不是真的是 html 原有的标签，判断是否是浏览器标准标签
                config.isUnknownElement(vnode.tag)
            )
        }

        var creatingElmInVPre = 0;
        //创建dom 节点
        function createElm(
                           vnode,  //vnode 节点，
                           insertedVnodeQueue, //插入Vnode队列
                           parentElm, //父亲节点
                           refElm,  //当前的节点的兄弟节点
                           nested,  //嵌套
                           ownerArray, //主数组 节点
                           index  //索引
        ) {
            console.log(vnode)
            //判断是否定义有vnode.elm 和 定义有ownerArray
            if (isDef(vnode.elm) && isDef(ownerArray)) {
                // This vnode was used in a previous render!
                // now it's used as a new node, overwriting its elm would cause
                // potential patch errors down the road when it's used as an insertion
                // reference node. Instead, we clone the node on-demand before creating
                // associated DOM element for it.
                //这个vnode在之前的渲染中使用过!
                //现在它被用作一个新节点，覆盖它的elm将导致
                //当它被用作插入时，将来可能会出现补丁错误
                //引用节点。相反，我们在创建之前按需克隆节点
                //关联的DOM元素。
                //克隆一个新的节点

                vnode = ownerArray[index] = cloneVNode(vnode);
            }

            vnode.isRootInsert = !nested; // for transition enter check //对于过渡输入检查
            //创建组件，并且判断它是否实例化过
            if (createComponent(
                    vnode, //虚拟dom vonde
                    insertedVnodeQueue, //插入Vnode队列
                    parentElm,//父亲节点
                    refElm //当前节点
                )) {
                return
            }

            var data = vnode.data;  //vnode 数据 如 属性等
            var children = vnode.children; //vonde 子节点
            var tag = vnode.tag;  //vonde 标签


            if (isDef(tag)) {   //如果组件标签定义了
                 console.log(vnode)

                            {

                                if (data && data.pre) { //标记是否是pre 标签吧
                                    creatingElmInVPre++;
                                }
                                // 检查dom 节点的tag标签 类型 是否是VPre 标签 或者是判断是否是浏览器自带原有的标签
                                if (isUnknownElement$$1(vnode, creatingElmInVPre)) {
                                    warn(
                                        'Unknown custom element: <' + tag + '> - did you ' +
                                        'register the component correctly? For recursive components, ' +
                                        'make sure to provide the "name" option.',
                                        vnode.context
                                    );
                                }
                            }

                            vnode.elm =
                                vnode.ns //   字符串值，可为此元素节点规定命名空间的名称。 可能是svg 或者 math 节点
                                    ? nodeOps.createElementNS(vnode.ns, tag) //   字符串值，可为此元素节点规定命名空间的名称。 可能是svg 或者 math 节点
                                    : nodeOps.createElement(tag, vnode);   //html创建一个dom 节点
                            setScope(vnode); //设置样式的作用域
                            console.log('====tag====' + tag)

                            /* istanbul ignore if */
                            {
                                //创建子节点
                                createChildren(
                                    vnode, //虚拟dom
                                    children,  // vonde 子节点
                                    insertedVnodeQueue //已经安装好的vonde
                                );
                                if (isDef(data)) {

                                    // invokeCreateHooks，循环cbs.create 钩子函数，并且执行调用，其实cbs.create 钩子函数就是platformModules中的attrs中 updateAttrs更新属性函数。如果是组件则调用componentVNodeHooks中的 create
                                    invokeCreateHooks(vnode, insertedVnodeQueue);
                                }
                                 //插入一个真实的dom，如果ref$$1.parentNode等于parent是。ref$$1和elm他们是兄弟节点则插入ref$$1前面
                                //如果ref$$1的ref$$1.parentNode不等于parent。那么elm就直接append到parent中
                                insert(
                                    parentElm,
                                    vnode.elm,
                                    refElm
                                );
                            }

                            if ("development" !== 'production' && data && data.pre) {
                                creatingElmInVPre--;
                            }
            } else if (isTrue(vnode.isComment)) {
                                                    vnode.elm = nodeOps.createComment(vnode.text);
                                                    //插入一个真实的dom，如果ref$$1.parentNode等于parent是。ref$$1和elm他们是兄弟节点则插入ref$$1前面
                                                    //如果ref$$1的ref$$1.parentNode不等于parent。那么elm就直接append到parent中
                                                    insert(parentElm, vnode.elm, refElm);
            } else {
                                                    vnode.elm = nodeOps.createTextNode(vnode.text);
                                                    //插入一个真实的dom，如果ref$$1.parentNode等于parent是。ref$$1和elm他们是兄弟节点则插入ref$$1前面
                                                    //如果ref$$1的ref$$1.parentNode不等于parent。那么elm就直接append到parent中
                                                    insert(parentElm, vnode.elm, refElm);
            }
        }



        //如果组件已经实例化过了才会初始化组件，才会返回值为真
        function createComponent(  //创建组件
                                vnode,
                                insertedVnodeQueue,// insertedVnodeQueue 插入vnode队列
                                parentElm, //父节点 dom
                                refElm //当前节点 dom
                            ) {
                                var i = vnode.data; //标签 dom 中的属性 或者是组件
                               console.log(i)

                                if (isDef(i)) { //如果i有定义
                                    var isReactivated = isDef(vnode.componentInstance) && i.keepAlive; //如果已经实例化过，并且是keepAlive组件
                                    if (isDef(i = i.hook) && isDef(i = i.init)) { //触发钩子函数。或者init，
                                        console.log(i)

                                        i(
                                            vnode,
                                            false /* hydrating */,
                                            parentElm,
                                            refElm
                                        );
                                    }
                                    // after calling the init hook, if the vnode is a child component
                                    // it should've created a child instance and mounted it. the child
                                    // component also has set the placeholder vnode's elm.
                                    // in that case we can just return the element and be done.
                                    //调用init钩子后，如果vnode是一个子组件
                                    //它应该创建一个子实例并挂载它。这个孩子
                                    //组件还设置了占位符vnode的elm。
                                    //在这种情况下，我们只需要返回元素就可以了。
                                    if (isDef(vnode.componentInstance)) { //组件已经实例过
                                       //initComponent 初始化组建，如果没有tag标签则去更新真实dom的属性，如果有tag标签，则注册或者删除ref 然后为insertedVnodeQueue.push(vnode);确保调用插入钩子如果vnode.data.pendingInsert为反正则也为insertedVnodeQueue插入缓存 vnode.data.pendingInsert
                                        initComponent(
                                            vnode,
                                            insertedVnodeQueue
                                        );
                                        //判断是否是真的true
                                        if (isTrue(isReactivated)) {
                                            //激活组件
                                            reactivateComponent(
                                                            vnode, //新的vonde
                                                            insertedVnodeQueue, //
                                                            parentElm,
                                                            refElm
                                                        );
                                        }
                                        return true
                                    }
                                }
        }

        // 初始化组建，如果没有tag标签则去更新真实dom的属性，如果有tag标签，则注册或者删除ref 然后为insertedVnodeQueue.push(vnode);确保调用插入钩子如果vnode.data.pendingInsert为反正则也为insertedVnodeQueue插入缓存 vnode.data.pendingInsert
        function initComponent(
                               vnode, //node 虚拟dom
                               insertedVnodeQueue //插入Vnode队列 记录已经实例化过的组件
        ) {
            if (isDef(vnode.data.pendingInsert)) {  //模板缓存 待插入
                insertedVnodeQueue.push.apply(insertedVnodeQueue, vnode.data.pendingInsert);
                vnode.data.pendingInsert = null;
            }
            vnode.elm = vnode.componentInstance.$el; //组件实例
            if (isPatchable(vnode)) { //   判断组件是否定义有 tag标签
                //invokeCreateHooks，循环cbs.create 钩子函数，并且执行调用，其实cbs.create 钩子函数就是platformModules中的attrs中 updateAttrs更新属性函数。如果是组件则调用componentVNodeHooks中的 create
                invokeCreateHooks(vnode, insertedVnodeQueue);
                //为有作用域的CSS设置作用域id属性。
                //这是作为一种特殊情况来实现的，以避免开销
                //通过常规属性修补过程。
                setScope(vnode);
            } else {
                // empty component root.
                // skip all element-related modules except for ref (#3455)
                //空组件根。
                //跳过除ref(#3455)之外的所有与元素相关的模块
                //注册ref
                registerRef(vnode);
                // make sure to invoke the insert hook
                //确保调用插入钩子
                insertedVnodeQueue.push(vnode);
            }
        }

        //激活组建。把vonde添加到parentElm中。如果是transition组件则 调用 transition中的activate就是_enter
        function reactivateComponent(
                                    vnode, //新的vonde
                                    insertedVnodeQueue,//
                                    parentElm,
                                    refElm
                                      ) {
                                            var i;
                                            // hack for #4339: a reactivated component with inner transition
                                            // does not trigger because the inner node's created hooks are not called
                                            // again. It's not ideal to involve module-specific logic in here but
                                            // there doesn't seem to be a better way to do it.
                                            //破解#4339:一个内部转换的重新激活的组件
                                            //不触发，因为没有调用内部节点创建的钩子
                                            //一次。在这里使用特定于模块的逻辑并不理想，但是
                                            //似乎没有比这更好的方法了。
                                            var innerNode = vnode;
                                            while (innerNode.componentInstance) { //如果已经实例过的
                                                innerNode = innerNode.componentInstance._vnode; // 标志上一个 vonde 就是旧的 vonde
                                                if (isDef(i = innerNode.data) && isDef(i = i.transition)) { //如果是transition 组件 _enter
                                                    for (i = 0; i < cbs.activate.length; ++i) {
                                                        cbs.activate[i](emptyNode, innerNode); //调用 transition中的activate就是_enter
                                                    }
                                                    insertedVnodeQueue.push(innerNode);
                                                    break
                                                }
                                            }
                                            // unlike a newly created component,
                                            // a reactivated keep-alive component doesn't insert itself
                                        //与新创建的组件不同，
                                        //重新激活的keep-alive组件不会插入
                                            insert(
                                                parentElm,  //父真实dom
                                                vnode.elm, //当前vonde的真实dom
                                                refElm //当前vonde的真实dom的兄弟节点或者不是
                                               );
        }

        //插入一个真实的dom，如果ref$$1.parentNode等于parent是。ref$$1和elm他们是兄弟节点则插入ref$$1前面
        //如果ref$$1的ref$$1.parentNode不等于parent。那么elm就直接append到parent中
        function insert(
                        parent,//父真实dom
                        elm,//当前vonde的真实dom
                        ref$$1 // 当前vonde的真实dom的兄弟节点或者不是
                        ) {
                            if (isDef(parent)) {
                                if (isDef(ref$$1)) {
                                    if (ref$$1.parentNode === parent) {
                                        nodeOps.insertBefore(parent, elm, ref$$1);
                                    }
                                } else {
                                    nodeOps.appendChild(parent, elm);
                                }
                            }
                        }

        //创建子节点
        function createChildren(
                                vnode, //虚拟dom
                                children,  //子节点
                                insertedVnodeQueue //插入Vnode队列
        ) {
            console.log('==children==')
            console.log(children)

            if (Array.isArray(children)) { //如果children 是数组
                {
                    //检测key是否有重复
                    checkDuplicateKeys(children);
                }
                //创造节点
                for (var i = 0; i < children.length; ++i) {
                    //创造节点
                    createElm(
                        children[i], //vnode 节点
                        insertedVnodeQueue, //插入Vnode队列
                        vnode.elm, //父亲节点
                        null, //当前节点
                        true, //嵌套
                        children, //主数组 节点
                        i //索引
                    );
                }
                //判断数据类型是否是string，number，symbol，boolean
            } else if (isPrimitive(vnode.text)) {
                //添加子节点                       创建一个文本节点
                nodeOps.appendChild(
                    vnode.elm,
                    nodeOps.createTextNode(String(vnode.text)) //创建文本节点真是dom节点
                );
            }
        }

        //循环组件实例 是否定义有 tag标签
        function isPatchable(vnode) {
            while (vnode.componentInstance) { //组件实例  循环n层组件实例
                vnode = vnode.componentInstance._vnode;
            }
            //判断组件是否定义有 tag标签
            return isDef(vnode.tag)
        }

         // invokeCreateHooks，循环cbs.create 钩子函数，并且执行调用，其实cbs.create 钩子函数就是platformModules中的attrs中 updateAttrs更新属性函数。如果是组件则调用componentVNodeHooks中的 create
        function invokeCreateHooks(vnode, insertedVnodeQueue) {
            // 这里的cbs如下：
            /*
             cbs={
             'create':[],
             'activate':[],
             'update':[],
             'remove':[],
             'destroy:[]
             }
             */
            // activate:Array(1)
            // create:Array(8)
            // destroy:Array(2)
            // remove:Array(1)
            // update:Array(7)
            // __proto__:Object
            console.log('==cbs.create==')
            console.log(cbs)
            for (var i$1 = 0; i$1 < cbs.create.length; ++i$1) {

                cbs.create[i$1](emptyNode, vnode);
            }
            i = vnode.data.hook; // Reuse variable 如果他是组件
            console.log(i)
           // 如果是组件则调用componentVNodeHooks中的 create
            if (isDef(i)) {
                if (isDef(i.create)) { //但是componentVNodeHooks 中没有create 所以下面可能不会执行
                    i.create(emptyNode, vnode);
                }
                if (isDef(i.insert)) {
                    insertedVnodeQueue.push(vnode);
                }
            }
        }

        // set scope id attribute for scoped CSS.
        // this is implemented as a special case to avoid the overhead
        // of going through the normal attribute patching process.
        //为有作用域的CSS设置作用域id属性。
        //这是作为一种特殊情况来实现的，以避免开销
        //通过常规属性修补过程。
        function setScope(vnode) {
            var i;
            //fnScopeId 判断css作用 有没有设置Scope 如果有则设置 css作用域
            if (isDef(i = vnode.fnScopeId)) {
                nodeOps.setStyleScope(vnode.elm, i);
            } else {
                var ancestor = vnode;
                while (ancestor) {
                    // context,  /*编译作用域*/ 上下文 判断vnode 是否设置有作用于 与css是否设置有作用域 _scopeId 是放在dom属性上面做标记
                    if (isDef(i = ancestor.context) && isDef(i = i.$options._scopeId)) {
                        //设置css作用域
                        nodeOps.setStyleScope(vnode.elm, i);
                    }
                    //循环父节点
                    ancestor = ancestor.parent;
                }
            }
            // for slot content they should also get the scopeId from the host instance.
            // 对于插槽内容，它们还应该从主机实例获得scopeId
            // activeInstance 可能是 vm
            if (isDef(i = activeInstance) &&
                i !== vnode.context &&
                i !== vnode.fnContext &&
                isDef(i = i.$options._scopeId)
            ) {
                nodeOps.setStyleScope(vnode.elm, i);
            }
        }


        function addVnodes(parentElm, //父亲节点
                           refElm,    //当前点
                           vnodes,  //虚拟dom
                           startIdx,  // 开始index
                           endIdx, // 结束index
                           insertedVnodeQueue   //插入Vnode队列
        ) {

            for (; startIdx <= endIdx; ++startIdx) {

                //创造dom节点
                createElm(
                    vnodes[startIdx],  //vnode 节点
                    insertedVnodeQueue,  //插入Vnode队列
                    parentElm,  //父亲节点
                    refElm, //当前节点
                    false,   //嵌套
                    vnodes,  //vnodes 数组
                    startIdx //索引
                );
            }
        }

        //组件销毁，触发销毁钩子函数
        function invokeDestroyHook(vnode) {
            var i, j;
            var data = vnode.data; //如果vonde有标签属性
            if (isDef(data)) {  //如果vonde有标签属性
                if (isDef(i = data.hook) && isDef(i = i.destroy)) { //如果有钩子函数，或者销毁的钩子函数destroy 就调用destroy或者钩子函数
                    i(vnode);
                }
                for (i = 0; i < cbs.destroy.length; ++i) { //并且判断有几个销毁的钩子函数，循环调用
                    cbs.destroy[i](vnode); //
                }
            }
            if (isDef(i = vnode.children)) { //如果有子节点则递归
                for (j = 0; j < vnode.children.length; ++j) {
                    invokeDestroyHook(vnode.children[j]);
                }
            }
        }

        function removeVnodes(parentElm, vnodes, startIdx, endIdx) {
            for (; startIdx <= endIdx; ++startIdx) {
                var ch = vnodes[startIdx];
                if (isDef(ch)) {
                    if (isDef(ch.tag)) {
                        removeAndInvokeRemoveHook(ch);
                        invokeDestroyHook(ch);
                    } else { // Text node
                        removeNode(ch.elm);
                    }
                }
            }
        }

        function removeAndInvokeRemoveHook(vnode, rm) {
            if (isDef(rm) || isDef(vnode.data)) {
                var i;
                var listeners = cbs.remove.length + 1;
                if (isDef(rm)) {
                    // we have a recursively passed down rm callback
                    // increase the listeners count
                    rm.listeners += listeners;
                } else {
                    // directly removing
                    rm = createRmCb(vnode.elm, listeners);
                }
                // recursively invoke hooks on child component root node
                if (isDef(i = vnode.componentInstance) && isDef(i = i._vnode) && isDef(i.data)) {
                    removeAndInvokeRemoveHook(i, rm);
                }
                for (i = 0; i < cbs.remove.length; ++i) {
                    cbs.remove[i](vnode, rm);
                }
                if (isDef(i = vnode.data.hook) && isDef(i = i.remove)) {
                    i(vnode, rm);
                } else {
                    rm();
                }
            } else {
                removeNode(vnode.elm);
            }
        }

        function updateChildren(
                                parentElm,
                                oldCh,
                                newCh,
                                insertedVnodeQueue,
                                removeOnly
                                 ) {
            var oldStartIdx = 0;
            var newStartIdx = 0;
            var oldEndIdx = oldCh.length - 1;
            var oldStartVnode = oldCh[0];
            var oldEndVnode = oldCh[oldEndIdx];
            var newEndIdx = newCh.length - 1;
            var newStartVnode = newCh[0];
            var newEndVnode = newCh[newEndIdx];
            var oldKeyToIdx, idxInOld, vnodeToMove, refElm;

            // removeOnly is a special flag used only by <transition-group>
            // to ensure removed elements stay in correct relative positions
            // during leaving transitions
            var canMove = !removeOnly;

            {
                checkDuplicateKeys(newCh);
            }

            while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
                if (isUndef(oldStartVnode)) {
                    oldStartVnode = oldCh[++oldStartIdx]; // Vnode has been moved left
                } else if (isUndef(oldEndVnode)) {
                    oldEndVnode = oldCh[--oldEndIdx];
                } else if (sameVnode(oldStartVnode, newStartVnode)) {
                    patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue);
                    oldStartVnode = oldCh[++oldStartIdx];
                    newStartVnode = newCh[++newStartIdx];
                } else if (sameVnode(oldEndVnode, newEndVnode)) {
                    patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue);
                    oldEndVnode = oldCh[--oldEndIdx];
                    newEndVnode = newCh[--newEndIdx];
                } else if (sameVnode(oldStartVnode, newEndVnode)) { // Vnode moved right
                    patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue);
                    canMove && nodeOps.insertBefore(parentElm, oldStartVnode.elm, nodeOps.nextSibling(oldEndVnode.elm));
                    oldStartVnode = oldCh[++oldStartIdx];
                    newEndVnode = newCh[--newEndIdx];
                } else if (sameVnode(oldEndVnode, newStartVnode)) { // Vnode moved left
                    patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue);
                    canMove && nodeOps.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm);
                    oldEndVnode = oldCh[--oldEndIdx];
                    newStartVnode = newCh[++newStartIdx];
                } else {
                    if (isUndef(oldKeyToIdx)) {
                        oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx);
                    }
                    idxInOld = isDef(newStartVnode.key)
                        ? oldKeyToIdx[newStartVnode.key]
                        : findIdxInOld(newStartVnode, oldCh, oldStartIdx, oldEndIdx);
                    if (isUndef(idxInOld)) { // New element
                        createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx);
                    } else {
                        vnodeToMove = oldCh[idxInOld];
                        if (sameVnode(vnodeToMove, newStartVnode)) {
                            patchVnode(vnodeToMove, newStartVnode, insertedVnodeQueue);
                            oldCh[idxInOld] = undefined;
                            canMove && nodeOps.insertBefore(parentElm, vnodeToMove.elm, oldStartVnode.elm);
                        } else {
                            // same key but different element. treat as new element
                            createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx);
                        }
                    }
                    newStartVnode = newCh[++newStartIdx];
                }
            }
            if (oldStartIdx > oldEndIdx) {
                refElm = isUndef(newCh[newEndIdx + 1]) ? null : newCh[newEndIdx + 1].elm;
                addVnodes(parentElm, refElm, newCh, newStartIdx, newEndIdx, insertedVnodeQueue);
            } else if (newStartIdx > newEndIdx) {
                removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx);
            }
        }

        //检测key是否有重复
        function checkDuplicateKeys(children) {
            var seenKeys = {};
            for (var i = 0; i < children.length; i++) {  //循环子节点
                var vnode = children[i]; //获取子节点
                var key = vnode.key; //获取子节点的key
                if (isDef(key)) { //判断key是否有定义过
                    if (seenKeys[key]) { //如果定义过则发出警告
                        warn(
                            //检测到重复键:“+ key +”。这可能会导致更新错误。
                            ("Duplicate keys detected: '" + key + "'. This may cause an update error."),
                            vnode.context
                        );
                    } else {
                        //标志key 状态是 true
                        seenKeys[key] = true;
                    }
                }
            }
        }

        function findIdxInOld(node, oldCh, start, end) {
            for (var i = start; i < end; i++) {
                var c = oldCh[i];
                if (isDef(c) && sameVnode(node, c)) {
                    return i
                }
            }
        }

          //看到这里
        function patchVnode(
                            oldVnode,
                            vnode,
                            insertedVnodeQueue,
                            removeOnly
        ) {
            if (oldVnode === vnode) { //如果他们相等
                return
            }

            var elm = vnode.elm = oldVnode.elm; //获取真实的dom

            if (isTrue(oldVnode.isAsyncPlaceholder)) {
                if (isDef(vnode.asyncFactory.resolved)) {
                    hydrate(oldVnode.elm, vnode, insertedVnodeQueue);
                } else {
                    vnode.isAsyncPlaceholder = true;
                }
                return
            }

            // reuse element for static trees.
            // note we only do this if the vnode is cloned -
            // if the new node is not cloned it means the render functions have been
            // reset by the hot-reload-api and we need to do a proper re-render.
            if (isTrue(vnode.isStatic) &&
                isTrue(oldVnode.isStatic) &&
                vnode.key === oldVnode.key &&
                (isTrue(vnode.isCloned) || isTrue(vnode.isOnce))
            ) {
                vnode.componentInstance = oldVnode.componentInstance;
                return
            }

            var i;
            var data = vnode.data;
            if (isDef(data) && isDef(i = data.hook) && isDef(i = i.prepatch)) {
                i(oldVnode, vnode);
            }

            var oldCh = oldVnode.children;
            var ch = vnode.children;
            if (isDef(data) && isPatchable(vnode)) {
                for (i = 0; i < cbs.update.length; ++i) {
                    cbs.update[i](oldVnode, vnode);
                }
                if (isDef(i = data.hook) && isDef(i = i.update)) {
                    i(oldVnode, vnode);
                }
            }
            if (isUndef(vnode.text)) {
                if (isDef(oldCh) && isDef(ch)) {
                    if (oldCh !== ch) {
                        updateChildren(elm, oldCh, ch, insertedVnodeQueue, removeOnly);
                    }
                } else if (isDef(ch)) {
                    if (isDef(oldVnode.text)) {
                        nodeOps.setTextContent(elm, '');
                    }
                    addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue);
                } else if (isDef(oldCh)) {
                    removeVnodes(elm, oldCh, 0, oldCh.length - 1);
                } else if (isDef(oldVnode.text)) {
                    nodeOps.setTextContent(elm, '');
                }
            } else if (oldVnode.text !== vnode.text) {
                nodeOps.setTextContent(elm, vnode.text);
            }
            if (isDef(data)) {
                if (isDef(i = data.hook) && isDef(i = i.postpatch)) {
                    i(oldVnode, vnode);
                }
            }
        }

        function invokeInsertHook(vnode, queue, initial) {
            // delay insert hooks for component root nodes, invoke them after the
            // element is really inserted
            if (isTrue(initial) && isDef(vnode.parent)) {
                vnode.parent.data.pendingInsert = queue;
            } else {
                for (var i = 0; i < queue.length; ++i) {
                    queue[i].data.hook.insert(queue[i]);
                }
            }
        }

        var hydrationBailed = false;
        // list of modules that can skip create hook during hydration because they
        // are already rendered on the client or has no need for initialization
        // Note: style is excluded because it relies on initial clone for future
        // deep updates (#7063).
        var isRenderedModule = makeMap('attrs,class,staticClass,staticStyle,key');

        // Note: this is a browser-only function so we can assume elms are DOM nodes.
        function hydrate(elm, vnode, insertedVnodeQueue, inVPre) {
            var i;
            var tag = vnode.tag;
            var data = vnode.data;
            var children = vnode.children;
            inVPre = inVPre || (data && data.pre);
            vnode.elm = elm;

            if (isTrue(vnode.isComment) && isDef(vnode.asyncFactory)) {
                vnode.isAsyncPlaceholder = true;
                return true
            }
            // assert node match
            {
                if (!assertNodeMatch(elm, vnode, inVPre)) {
                    return false
                }
            }
            if (isDef(data)) {
                if (isDef(i = data.hook) && isDef(i = i.init)) {
                    i(vnode, true /* hydrating */);
                }
                if (isDef(i = vnode.componentInstance)) {
                    // child component. it should have hydrated its own tree.
                    // 初始化组建，如果没有tag标签则去更新真实dom的属性，如果有tag标签，则注册或者删除ref 然后为insertedVnodeQueue.push(vnode);确保调用插入钩子如果vnode.data.pendingInsert为反正则也为insertedVnodeQueue插入缓存 vnode.data.pendingInsert

                    initComponent(vnode, insertedVnodeQueue);
                    return true
                }
            }
            if (isDef(tag)) {
                if (isDef(children)) {
                    // empty element, allow client to pick up and populate children
                    if (!elm.hasChildNodes()) {
                        createChildren(vnode, children, insertedVnodeQueue);
                    } else {
                        // v-html and domProps: innerHTML
                        if (isDef(i = data) && isDef(i = i.domProps) && isDef(i = i.innerHTML)) {
                            if (i !== elm.innerHTML) {
                                /* istanbul ignore if */
                                if ("development" !== 'production' &&
                                    typeof console !== 'undefined' && !hydrationBailed
                                ) {
                                    hydrationBailed = true;
                                    console.warn('Parent: ', elm);
                                    console.warn('server innerHTML: ', i);
                                    console.warn('client innerHTML: ', elm.innerHTML);
                                }
                                return false
                            }
                        } else {
                            // iterate and compare children lists
                            var childrenMatch = true;
                            var childNode = elm.firstChild;
                            for (var i$1 = 0; i$1 < children.length; i$1++) {
                                if (!childNode || !hydrate(childNode, children[i$1], insertedVnodeQueue, inVPre)) {
                                    childrenMatch = false;
                                    break
                                }
                                childNode = childNode.nextSibling;
                            }
                            // if childNode is not null, it means the actual childNodes list is
                            // longer than the virtual children list.
                            if (!childrenMatch || childNode) {
                                /* istanbul ignore if */
                                if ("development" !== 'production' &&
                                    typeof console !== 'undefined' && !hydrationBailed
                                ) {
                                    hydrationBailed = true;
                                    console.warn('Parent: ', elm);
                                    console.warn('Mismatching childNodes vs. VNodes: ', elm.childNodes, children);
                                }
                                return false
                            }
                        }
                    }
                }
                if (isDef(data)) {
                    var fullInvoke = false;
                    for (var key in data) {
                        if (!isRenderedModule(key)) {
                            fullInvoke = true;
                            // invokeCreateHooks，循环cbs.create 钩子函数，并且执行调用，其实cbs.create 钩子函数就是platformModules中的attrs中 updateAttrs更新属性函数。如果是组件则调用componentVNodeHooks中的 create
                            invokeCreateHooks(vnode, insertedVnodeQueue);
                            break
                        }
                    }
                    if (!fullInvoke && data['class']) {
                        // ensure collecting deps for deep class bindings for future updates
                        traverse(data['class']);
                    }
                }
            } else if (elm.data !== vnode.text) {
                elm.data = vnode.text;
            }
            return true
        }

        function assertNodeMatch(node, vnode, inVPre) {
            if (isDef(vnode.tag)) {
                return vnode.tag.indexOf('vue-component') === 0 || (
                        !isUnknownElement$$1(vnode, inVPre) &&
                        vnode.tag.toLowerCase() === (node.tagName && node.tagName.toLowerCase())
                    )
            } else {
                return node.nodeType === (vnode.isComment ? 8 : 3)
            }
        }
       // patch入口是这里
       //   vm.$el, //真正的dom
       // vnode, //vnode
        /*
           __patch__(
                        vm.$el, //真正的dom
                        vnode, //vnode
                        hydrating, // 空
                        false  // removeOnly  ,
                        vm.$options._parentElm, //父节点 空
                        vm.$options._refElm //当前节点 空
                   );
          */
        return function patch(
                                oldVnode, //旧的vonde或者是真实的dom. 或者是没有
                                vnode, //新的vode
                                hydrating,
                                removeOnly, //是否要全部删除标志
                                parentElm, //父节点 真实的dom
                                refElm//当前节点 真实的dom
                               ) {
            console.log('===oldVnode===')
            console.log(oldVnode)
            debugger;
                                    if (isUndef(vnode)) {　　　　//如果没有定义新的vonde
                                        if (isDef(oldVnode)) { //如果没有定义旧的vonde
                                            invokeDestroyHook(oldVnode); //如果vnode不存在但是oldVnode存在，说明意图是要销毁老节点，那么就调用invokeDestroyHook(oldVnode)来进行销毁
                                        }
                                        return
                                    }

                                    var isInitialPatch = false;
                                    var insertedVnodeQueue = []; //vonde队列 如果vnode上有insert钩子，那么就将这个vnode放入insertedVnodeQueue中作记录，到时再在全局批量调用insert钩子回调

                                    if (isUndef(oldVnode)) { //如果没有定义旧的vonde
                                        // empty mount (likely as component), create new root element 空挂载(可能作为组件)，创建新的根元素
                                        isInitialPatch = true;
                                        createElm( //创建节点
                                                    vnode, //虚拟dom
                                                    insertedVnodeQueue, //vonde队列空数组
                                                    parentElm, //真实的 父节点
                                                    refElm  //当前节点
                                                 );
                                    } else {
                                        var isRealElement = isDef(oldVnode.nodeType); //获取 真实的dom 类型
                                        if (!isRealElement &&  //如果获取不到真实的dom 类型
                                            sameVnode(oldVnode, vnode) //sameVnode(oldVnode, vnode)2个节点的基本属性相同，那么就进入了2个节点的diff过程。
                                          ) {
                                            // patch existing root node
                                            //修补现有根节点
                                            patchVnode(
                                                oldVnode,
                                                vnode,
                                                insertedVnodeQueue, //vonde队列
                                                removeOnly  //是否要全部删除标志
                                            );
                                        } else {
                                            if (isRealElement) {
                                                // mounting to a real element
                                                // check if this is server-rendered content and if we can perform
                                                // a successful hydration.
                                                if (oldVnode.nodeType === 1 && oldVnode.hasAttribute(SSR_ATTR)) {
                                                    oldVnode.removeAttribute(SSR_ATTR);
                                                    hydrating = true;
                                                }
                                                if (isTrue(hydrating)) {
                                                    if (hydrate(oldVnode, vnode, insertedVnodeQueue)) {
                                                        invokeInsertHook(vnode, insertedVnodeQueue, true);
                                                        return oldVnode
                                                    } else {
                                                        warn(
                                                            'The client-side rendered virtual DOM tree is not matching ' +
                                                            'server-rendered content. This is likely caused by incorrect ' +
                                                            'HTML markup, for example nesting block-level elements inside ' +
                                                            '<p>, or missing <tbody>. Bailing hydration and performing ' +
                                                            'full client-side render.'
                                                        );
                                                    }
                                                }
                                                // either not server-rendered, or hydration failed.
                                                // create an empty node and replace it
                                                oldVnode = emptyNodeAt(oldVnode);
                                            }

                                            // replacing existing element
                                            var oldElm = oldVnode.elm;
                                            var parentElm$1 = nodeOps.parentNode(oldElm);

                                            // create new node
                                            createElm(
                                                vnode,
                                                insertedVnodeQueue,
                                                // extremely rare edge case: do not insert if old element is in a
                                                // leaving transition. Only happens when combining transition +
                                                // keep-alive + HOCs. (#4590)
                                                oldElm._leaveCb ? null : parentElm$1,
                                                nodeOps.nextSibling(oldElm)
                                            );

                                            // update parent placeholder node element, recursively
                                            if (isDef(vnode.parent)) {
                                                var ancestor = vnode.parent;
                                                var patchable = isPatchable(vnode);
                                                while (ancestor) {
                                                    for (var i = 0; i < cbs.destroy.length; ++i) {
                                                        cbs.destroy[i](ancestor);
                                                    }
                                                    ancestor.elm = vnode.elm;
                                                    if (patchable) {
                                                        for (var i$1 = 0; i$1 < cbs.create.length; ++i$1) {
                                                            cbs.create[i$1](emptyNode, ancestor);
                                                        }
                                                        // #6513
                                                        // invoke insert hooks that may have been merged by create hooks.
                                                        // e.g. for directives that uses the "inserted" hook.
                                                        var insert = ancestor.data.hook.insert;
                                                        if (insert.merged) {
                                                            // start at index 1 to avoid re-invoking component mounted hook
                                                            for (var i$2 = 1; i$2 < insert.fns.length; i$2++) {
                                                                insert.fns[i$2]();
                                                            }
                                                        }
                                                    } else {
                                                        registerRef(ancestor);
                                                    }
                                                    ancestor = ancestor.parent;
                                                }
                                            }

                                            // destroy old node
                                            if (isDef(parentElm$1)) {
                                                removeVnodes(parentElm$1, [oldVnode], 0, 0);
                                            } else if (isDef(oldVnode.tag)) {
                                                invokeDestroyHook(oldVnode);
                                            }
                                        }
                                    }

                                    invokeInsertHook(vnode, insertedVnodeQueue, isInitialPatch);
                                    return vnode.elm
        }


    }


    //创建虚拟dom-end

    /*
     *  vue 指令
     * */

    var directives = {
        create: updateDirectives, //创建指令
        update: updateDirectives,  //更新指令
        destroy: function unbindDirectives(vnode) {  //销毁指令
            updateDirectives(vnode, emptyNode);
        }
    }

    //更新数据
    //oldVnode 老数据
    //vnode 新数据 //更新指令
    function updateDirectives(oldVnode, vnode) {
        //判断旧的指令 或者现在指令存在么
        if (oldVnode.data.directives || vnode.data.directives) {
            _update(oldVnode, vnode);
        }
    }

    //更新指令 比较oldVnode和vnode，根据oldVnode和vnode的情况 触发指令钩子函数bind，update，inserted，insert，componentUpdated，unbind钩子函数
    function _update(oldVnode, vnode) {


        var isCreate = oldVnode === emptyNode;  // 判断旧的指令是否等于一个空的指令
        var isDestroy = vnode === emptyNode;// 判断现在指令是否等于一个空的指令
        //指令字符串                 vm this上下文
        console.log(oldVnode)
        console.log(vnode)
        //规范化的指令，为指令属性修正变成规范的指令数据。返回指令数据集合
        var oldDirs = normalizeDirectives$1(
            oldVnode.data.directives, //vonde指令对象集合
            oldVnode.context //vm vne实例化对象，或者是组件实例化的对象
        );
        //规范化的指令，为指令属性修正变成规范的指令数据。返回指令数据集合
        var newDirs = normalizeDirectives$1(
            vnode.data.directives, //vonde指令对象集合
            vnode.context //vm vne实例化对象，或者是组件实例化的对象
        );

        var dirsWithInsert = [];
        var dirsWithPostpatch = [];

        var key, oldDir, dir;
        for (key in newDirs) { //循环新的指令集合
            console.log(newDirs[key])

            oldDir = oldDirs[key]; //获取旧的单个指令值
            dir = newDirs[key];//获取新的单个指令值
            if (!oldDir) { //如果旧的不存在了
                // new directive, bind 新指令,绑定
                callHook$1(
                     dir, //新的指令值
                    'bind', //触发bind钩子函数
                    vnode,//新的vonde
                    oldVnode //旧的vonde
                );
                if (dir.def && dir.def.inserted) { //获取指令的属性。 插入标记，指令
                    dirsWithInsert.push(dir); //记录插入指令
                }
            } else {

                // existing directive, update 现有的指令,更新
                dir.oldValue = oldDir.value; // 如有指令 <div v-hello='123'></div> value=123. 如果更新了123 就是更新值
                callHook$1(dir,
                    'update',  //触发更新钩子函数
                    vnode,
                    oldVnode
                );
                if (dir.def && dir.def.componentUpdated) { // 组件更新
                    dirsWithPostpatch.push(dir); //记录更新
                }
            }
        }

        if (dirsWithInsert.length) {
            var callInsert = function () {
                for (var i = 0; i < dirsWithInsert.length; i++) {
                    callHook$1(
                        dirsWithInsert[i], //新的指令值
                        'inserted', //触发inserted钩子函数
                        vnode, //新的vonde
                        oldVnode //旧的vonde
                    );
                }
            };
            if (isCreate) { //是否是第一次创建的指令
                mergeVNodeHook(
                    vnode,
                    'insert',//合并钩子函数
                    callInsert
                );
            } else {
                callInsert();
            }
        }

        if (dirsWithPostpatch.length) {
            mergeVNodeHook(vnode,
                'postpatch',
                function () {
                for (var i = 0; i < dirsWithPostpatch.length; i++) {
                    callHook$1(
                        dirsWithPostpatch[i],
                        'componentUpdated',
                        vnode, oldVnode);
                }
            });
        }

        if (!isCreate) {
            for (key in oldDirs) {
                if (!newDirs[key]) { //新的vonde 中没有了指令
                    // no longer present, unbind 不再存在，解除束缚
                    callHook$1(
                        oldDirs[key],
                        'unbind', //触发unbind 钩子
                        oldVnode,
                        oldVnode,
                        isDestroy
                    );
                }
            }
        }
    }

    var emptyModifiers = Object.create(null);

    //规范化的指令，为指令属性修正变成规范的指令数据。返回指令数据集合
    function normalizeDirectives$1(
                                    dirs, //vonde 指令集合
                                    vm //vm vne实例化对象，或者是组件实例化的对象
                                 ) {
        //创建一个空的对象
        var res = Object.create(null);
        //如果 指令 名称dirs 不存在 则返回一个空的对象
        if (!dirs) {
            // $flow-disable-line
            return res
        }

        var i, dir;
        for (i = 0; i < dirs.length; i++) { //循环遍历指令集合
            dir = dirs[i];
            if (!dir.modifiers) { //判断是否有修饰符
                // $flow-disable-line
                dir.modifiers = emptyModifiers; //空对象
            }
            //返回指令名称 或者属性name名称+修饰符
            res[getRawDirName(dir)] = dir;
            //指令属性，该属性由用户自定义如 bind，inserted，update，componentUpdated，unbind这些
            dir.def = resolveAsset(vm.$options, 'directives', dir.name, true);
        }
        // $flow-disable-line
        return res
    }

      //返回指令名称 或者属性name名称+修饰符
    function getRawDirName(dir) {
        //rawName 视图中的 指令如 <div v-hello></div>  就是v-hello
        //name 视图中的 指令如 <div v-hello></div>  就是hello
        //modifiers 修饰符
        console.log(dir)

        return dir.rawName || ((dir.name) + "." + (Object.keys(dir.modifiers || {}).join('.')))
    }

   //触发指令钩子函数
    function callHook$1(
                        dir,  //新的指令值
                        hook, //钩子函数
                        vnode, //新的vnode
                        oldVnode, //旧的vnode
                        isDestroy
                    ) {
                        var fn = dir.def && dir.def[hook]; //获取属性上面的钩子函数
                        if (fn) {
                            try {
                                fn(
                                    vnode.elm, //真实dom
                                    dir, //指令的参数
                                    vnode, //新的vond
                                    oldVnode, //旧的vonde
                                    isDestroy //是否要销毁标记
                                );
                            } catch (e) {
                                handleError(e, vnode.context, ("directive " + (dir.name) + " " + hook + " hook"));
                            }
                        }
    }

    var baseModules = [
        ref,  //ref创建，更新 ， 销毁 函数
        directives //自定义指令 创建 ，更新，销毁函数
    ]

    /*
     *
     * 更新属性，比较新的vnode和旧的oldVnode中的属性值，如果不相等则设置属性,就更新属性值，如果新的vnode 属性中没有了则删除该属性
     *
     * */

    function updateAttrs(oldVnode, vnode) {
        debugger
        var opts = vnode.componentOptions;  //获取组件的拓展参数
        if (isDef(opts) && opts.Ctor.options.inheritAttrs === false) {  // 判断是否定义有拓展参数，并且需要Ctor.options.inheritAttrs 不等于 false的 时候才执行下面的代码
            return
        }
        //如果 oldVnode和vnode 没有定义有attrs 属性  也不会执行下面的代码
        if (isUndef(oldVnode.data.attrs) && isUndef(vnode.data.attrs)) {
            return
        }
        var key, cur, old;
        var elm = vnode.elm;
        var oldAttrs = oldVnode.data.attrs || {};  //获取旧的vonde attrs
        var attrs = vnode.data.attrs || {}; //获取新的vonde attrs
        // clone observed objects, as the user probably wants to mutate it
        ////克隆观察到的对象，因为用户可能希望对其进行变异

        if (isDef(attrs.__ob__)) { //判断attrs.__ob__ 如果定义了 就执行 从新克隆一个
            attrs = vnode.data.attrs = extend({}, attrs);
        }

        for (key in attrs) {  //循环attrs
            cur = attrs[key];  //获取到 attrs 值
            old = oldAttrs[key]; //获取到旧的 attrs 值
            if (old !== cur) {  //如果他们两值不相等的时候就设置值
                //设置属性
                setAttr(elm, key, cur);
            }
        }
        // #4391: in IE9, setting type can reset value for input[type=radio] 在IE9中，设置类型可以重置输入值[type=radio]
        // #6666: IE/Edge forces progress value down to 1 before setting a max 在设置最大值之前，IE/Edge会将进度值降低到1
        /* istanbul ignore if */

        if ((isIE || isEdge) && attrs.value !== oldAttrs.value) { //如果是ie浏览器，或者是edge浏览器 新的值和旧的值不相等的时候
            setAttr(elm, 'value', attrs.value); //设置新的value值
        }
        for (key in oldAttrs) { //遍历循环旧的属性
            if (isUndef(attrs[key])) { // 如果新的属性中 还含有旧的属性key 并且有值的时候
                if (isXlink(key)) { //判断是否是xml
                    elm.removeAttributeNS(xlinkNS, getXlinkProp(key)); //设置属性
                } else if (!isEnumeratedAttr(key)) { //如果不是 'contenteditable,draggable,spellcheck' 属性
                    elm.removeAttribute(key); //设置属性
                }
            }
        }
    }

    //设置属性
    function setAttr(el, key, value) {
        //如果dom点 tag标签 含有- 则是自定义标签
        if (el.tagName.indexOf('-') > -1) {
            //设置属性
            baseSetAttr(el, key, value);

        } else if (isBooleanAttr(key)) {   //检查是否是html中的布尔值属性  就是该属性只有 true 和 false
            // set attribute for blank value 为空值设置属性
            // e.g. <option disabled>Select one</option>
            if (isFalsyAttrValue(value)) { //判断val 是否是 null 或者 false
                el.removeAttribute(key); //删除属性
            } else {
                // technically allowfullscreen is a boolean attribute for <iframe>, 从技术上讲，allowfullscreen是一个布尔属性
                // but Flash expects a value of "true" when used on <embed> tag  但是Flash希望在<embed>标签上使用时，其值为"true"
                //判断标签是否是EMBED 如果是 true 如果不是则给标签key就行了
                value = key === 'allowfullscreen' && el.tagName === 'EMBED'
                    ? 'true'
                    : key;
                //设置属性
                el.setAttribute(key, value);
            }
        } else if (isEnumeratedAttr(key)) { //判断是否是contenteditable，draggable，spellcheck 这三个属性的其中一个
            //设置属性
            el.setAttribute(key, isFalsyAttrValue(value) || value === 'false' ? 'false' : 'true');
        } else if (isXlink(key)) {   //判断是否是xmlns 属性 例子 <bookstore xmlns:xlink="http://www.w3.org/1999/xlink">
            if (isFalsyAttrValue(value)) { //value 没有值
                //xml 则用个方法删除属性
                el.removeAttributeNS(xlinkNS, getXlinkProp(key));
            } else {
                //设置xml 属性
                el.setAttributeNS(xlinkNS, key, value);
            }
        } else {
            //设置基本属性
            baseSetAttr(el, key, value);
        }
    }

    // 设置基本的属性
    //设置属性，并且判断是否是ie浏览器 如果是 并且不是ie九的时候 更新input事件
    function baseSetAttr(el, //dom节点
                         key,  //属性的 key
                         value //属性的值
    ) {

        if (isFalsyAttrValue(value)) {  // 判断value 是否是 null 或者 false
            el.removeAttribute(key);  //从dom中删除属性
        } else {
            // #7138: IE10 & 11 fires input event when setting placeholder on IE10和11在设置占位符时触发输入事件
            // <textarea>... block the first input event and remove the blocker 阻塞第一个输入事件并删除该阻塞程序
            // immediately.
            /* istanbul ignore if */
            if (
                isIE &&  //如果是is
                !isIE9 &&  //如果不是ie9  不支持ie9
                el.tagName === 'TEXTAREA' &&  //如果标签是TEXTAREA
                key === 'placeholder' && //如果key等于html5文本提示输入的placeholder
                !el.__ieph  //__ieph 等于假的 标志位
            ) {
                var blocker = function (e) {
                    // 如果有多个相同类型事件的事件监听函数绑定到同一个元素，当该类型的事件触发时，它们会按照被添加的顺序执行。如果其中某个监听函数执行了 event.stopImmediatePropagation() 方法，则当前元素剩下的监听函数将不会被执行。
                    // stopImmediatePropagation 则是阻止事件冒泡
                    e.stopImmediatePropagation();
                    //删除input 事件
                    el.removeEventListener('input', blocker);
                };
                //添加新的input 事件
                el.addEventListener('input', blocker);
                // $flow-disable-line
                //标志已经添加过 或者更新过input事件
                el.__ieph = true;
                /* IE placeholder patched  占位符打补丁 */
            }
            //设置属性
            el.setAttribute(key, value);
        }
    }

    var attrs = {
        create: updateAttrs, //创建属性
        update: updateAttrs  //更新属性
    }

    /*
     * 更新 真实dom的  calss
     * */

    function updateClass(oldVnode, vnode) {
        var el = vnode.elm;  //获取dom节点
        var data = vnode.data; //获取新的 vnode数据
        var oldData = oldVnode.data; //获取旧的 oldVnode 数据
        if (
            isUndef(data.staticClass) && //如果没有定义静态的 staticClass
            isUndef(data.class) && //没有定义calss
            (
                isUndef(oldData) || //如果旧的oldData 没有定义
                (
                    isUndef(oldData.staticClass) &&  //旧的oldData staticClass  class 没有定义
                    isUndef(oldData.class)
                )
            )
        ) {
            //返回去 不执行下面的代码
            return
        }
        //class 转码获取vonde 中的staticClass 静态class  和class动态class转义成真实dom需要的class格式。然后返回class字符串

        var cls = genClassForVnode(vnode);

        // handle transition classes
        var transitionClass = el._transitionClasses;
        if (isDef(transitionClass)) {
            cls = concat(cls, stringifyClass(transitionClass));
        }

        // set the class _prevClass 上一个css表示是否已经更新过
        if (cls !== el._prevClass) {
            el.setAttribute('class', cls);
            el._prevClass = cls;
        }
    }

    var klass = {
        create: updateClass,
        update: updateClass
    }

    /*
     匹配 ) 或 . 或 + 或 - 或 _ 或 $ 或 ]
     */
    var validDivisionCharRE = /[\w).+\-_$\]]/;
    /*处理value 解析成正确的value，把过滤器 转换成vue 虚拟dom的解析方法函数 比如把过滤器 ' ab | c | d' 转换成 _f("d")(_f("c")(ab))
     * 表达式中的过滤器解析 方法
     * @param {*} exp
     */
    console.log(parseFilters(' ab | c | d')) //转化成 _f("d")(_f("c")(ab))
    function parseFilters(exp) {
        // 是否在 ''中
        var inSingle = false;
        // 是否在 "" 中
        var inDouble = false;
        // 是否在 ``
        var inTemplateString = false;
        //  是否在 正则 \\ 中
        var inRegex = false;
        // 是否在 {{ 中发现一个 culy加1 然后发现一个 } culy减1 直到culy为0 说明 { .. }闭合
        var curly = 0;
        // 跟{{ 一样 有一个 [ 加1 有一个 ] 减1
        var square = 0;
        // 跟{{ 一样 有一个 ( 加1 有一个 ) 减1
        var paren = 0;
        var lastFilterIndex = 0;
        var c, prev, i, expression, filters;

        for (i = 0; i < exp.length; i++) {
            prev = c;
            c = exp.charCodeAt(i);
            console.log('c =' + exp[i])
            console.log('c === 0x7C=' + (c === 0x7C))
            console.log('exp.charCodeAt(i + 1) !== 0x7C=' + (exp.charCodeAt(i + 1) !== 0x7C))
            console.log('exp.charCodeAt(i - 1) !== 0x7C=' + (exp.charCodeAt(i - 1) !== 0x7C))
            console.log('curly=' + (curly))
            console.log('!curly=' + (!curly))
            console.log('square=' + (square ))
            console.log('!square=' + (!square ))
            console.log('!paren=' + (!paren))
            console.log('最后一个=' + ( c === 0x7C && // pipe
                exp.charCodeAt(i + 1) !== 0x7C &&
                exp.charCodeAt(i - 1) !== 0x7C && !curly && !square && !paren))


            if (inSingle) {
                //  '  \
                if (c === 0x27 && prev !== 0x5C) {
                    inSingle = false;
                }
            } else if (inDouble) {
                // " \
                if (c === 0x22 && prev !== 0x5C) {
                    inDouble = false;
                }
            } else if (inTemplateString) {
                //  `
                if (c === 0x60 && prev !== 0x5C) {
                    inTemplateString = false;
                }
            } else if (inRegex) {
                // 当前在正则表达式中  /开始
                //  / \
                if (c === 0x2f && prev !== 0x5C) {
                    inRegex = false;
                }
            } else if (
                // 如果在 之前不在 ' " ` / 即字符串 或者正则中
            // 那么就判断 当前字符是否是 |
            //  如果当前 字符为 |
            // 且 不在 { } 对象中
            // 且 不在 [] 数组中
            // 且不在  () 中
            // 那么说明此时是过滤器的一个 分界点

            c === 0x7C && // |
            exp.charCodeAt(i + 1) !== 0x7C &&
            exp.charCodeAt(i - 1) !== 0x7C && !curly && !square && !paren
            ) {


                /*
                 如果前面没有表达式那么说明这是第一个 管道符号 "|"
                 再次遇到 | 因为前面 expression = 'message '
                 执行  pushFilter()
                 */
                if (expression === undefined) {
                    // first filter, end of expression
                    // 过滤器表达式 就是管道符号之后开始
                    lastFilterIndex = i + 1;
                    // 存储过滤器的 表达式
                    expression = exp.slice(0, i).trim(); //这里匹配如果字符串是 'ab|c' 则把ab匹配出来
                    console.log(expression)
                } else {
                    pushFilter();
                }
            } else {
                switch (c) {
                    case 0x22:
                        inDouble = true;
                        break                 // 匹配"
                    case 0x27:
                        inSingle = true;
                        break                // 匹配'
                    case 0x60:
                        inTemplateString = true;
                        break                // 匹配`
                    case 0x28:
                        paren++;
                        break                 // 匹配(
                    case 0x29:
                        paren--;
                        break                 // 匹配)
                    case 0x5B:
                        square++;
                        break                // 匹配[
                    case 0x5D:
                        square--;
                        break                // 匹配]
                    case 0x7B:
                        curly++;
                        break                 // 匹配 {
                    case 0x7D:
                        curly--;
                        break                 //  匹配 }
                    case 0x5C:
                        break                //   匹配   \
                    case 0x2f:
                        break;                //   匹配   /

                    case  0x7C:               //   匹配   |
                        break;
                }


                if (c === 0x2f) { //  /
                    var j = i - 1;
                    var p = (void 0);
                    // find first non-whitespace prev char
                    //查找第一个非空白的prev字符
                    for (; j >= 0; j--) {
                        p = exp.charAt(j);
                        if (p !== ' ') {
                            break
                        }
                    }
                    if (!p || !validDivisionCharRE.test(p)) {
                        inRegex = true;
                    }
                }


            }


        }

        if (expression === undefined) {
            expression = exp.slice(0, i).trim();
        } else if (lastFilterIndex !== 0) {
            pushFilter();
        }
        // 获取当前过滤器的 并将其存储在filters 数组中
        //  filters = [ 'filterA' , 'filterB']
        function pushFilter() {
            (filters || (filters = [])).push(exp.slice(lastFilterIndex, i).trim());
            lastFilterIndex = i + 1;
        }

        if (filters) {
            console.log(filters)
            for (i = 0; i < filters.length; i++) {
                //把过滤器封装成函数 虚拟dom需要渲染的函数
                expression = wrapFilter(expression, filters[i]);
            }
        }
        console.log(expression)

        //返回值
        return expression
    }

    /*
     生成过滤器的 表达式字符串
     如上面的
     exp = message
     filters = ['filterA','filterB(arg1,arg2)']
     第一步  以exp 为入参 生成 filterA 的过滤器表达式字符串  _f("filterA")(message)
     第二步 以第一步字符串作为入参 生成第二个过滤器的表达式字符串 _f("filterB")(_f("filterA")(message),arg1,arg2)
     => _f("filterB")(_f("filterA")(message),arg1,arg2)
     * @param {string} exp   上一个过滤器的值 没有就是 表达式的值
     * @param {string} filter
     * @returns {string}
     */
    console.log(wrapFilter('abc', 'defg(hijk)')) //结果 _f("defg")(abc,hijk)
    function wrapFilter(exp, filter) {
        var i = filter.indexOf('('); //返回字符串第一次出现索引的位置
        console.log('i=' + i)
        if (i < 0) {
            // _f: resolveFilter
            return ("_f(\"" + filter + "\")(" + exp + ")") //闭包
        } else {
            //name 是 从字符串开始到(结束的字符串,不包含(
            var name = filter.slice(0, i); //截取字符串 arrayObject.slice(start,end)
            console.log('==name==')
            console.log(name)

            //args是从(开始匹配，到字符串末端，不包含(
            var args = filter.slice(i + 1); //如果 end 未被规定，那么 slice() 方法会选取从 start 到数组结尾的所有元素。
            console.log('==args==')
            console.log(args)
            return (
                "_f(\"" + name + "\")(" + exp +
                (
                    args !== ')' ?
                    ',' + args
                        : args
                )
            )
        }
    }


    /*  */

    function baseWarn(msg) {
        console.error(("[Vue compiler]: " + msg));
    }

    //循环过滤数组或者对象的值，根据key循环 过滤对象或者数组[key]值，如果不存在则丢弃，如果有相同多个的key值，返回多个值的数组
    function pluckModuleFunction(
        modules, //数组或者对象
        key //key
    ) {
        return modules ?
                        modules.map(function (m) {
                                   return m[key]; // 获取modules[key] 值
                       }).filter(function (_) {
                              return _;  //过滤modules[key] 值，如果不存在则丢弃
                       }):[]
    }
    //在虚拟dom中添加prop属性
    function addProp(el, name, value) {
        (el.props || (el.props = [])).push({name: name, value: value});
        el.plain = false;
    }

    //添加attrs属性
    function addAttr(el, name, value) {
        (el.attrs || (el.attrs = [])).push({name: name, value: value});
        el.plain = false;
    }

// add a raw attr (use this in preTransforms)
    //添加原始attr(在预转换中使用)
    function addRawAttr(el, name, value) {
        el.attrsMap[name] = value;
        el.attrsList.push({name: name, value: value});
    }




    //为虚拟dom 添加一个 指令directives属性 对象
    function addDirective(
                          el, //虚拟dom
                          name, //获取 view 原始属性的名称 不包含 v- : @的
                          rawName, // 获取 view 原始属性的名称 包含 v- : @的
                          value, //属性view 属性上的值
                          arg,  // efg:hig 属性名称冒号后面多出来的标签
                          modifiers
                         ) {
        (el.directives || (el.directives = [])).push({
            name: name,
            rawName: rawName,
            value: value,
            arg: arg,
            modifiers: modifiers
        });
        el.plain = false;
    }


    //为虚拟dom添加events 事件对象属性，如果添加@click='clickEvent' 则此时 虚拟dom为el.events.click.value="clickEvent"
    //或者虚拟dom添加nativeEvents 事件对象属性，如果添加@click.native='clickEvent' 则此时 虚拟dom为el.nativeEvents.click.value="clickEvent"
    function addHandler(
                        el, //虚拟dom
                        name, //name 事件名称 事件类型
                        value, //事件函数
                        modifiers, //事件类型状态状态
                        important, // 根据important为true 把事件添加在前面 假就添加在尾部
                        warn //警告日志
                        ) {

        modifiers = modifiers || emptyObject;
        // warn prevent and passive modifier
        /* istanbul ignore if */
        if (
            "development" !== 'production' && warn &&
            modifiers.prevent && modifiers.passive
        ) {
            warn(
                'passive and prevent can\'t be used together. ' +
                'Passive handler can\'t prevent default event.'
            );
        }

        // check capture modifier 检查捕获修饰符
        if (modifiers.capture) {
            delete modifiers.capture;
            name = '!' + name; // mark the event as captured 将事件标记为捕获
        }
        if (modifiers.once) { //将事件标记为一次
            delete modifiers.once;
            name = '~' + name; // mark the event as once 将事件标记为一次
        }
        /* istanbul ignore if */
        if (modifiers.passive) {
            delete modifiers.passive;
            name = '&' + name; // mark the event as passive 将事件标记为被动的
        }

        // normalize click.right and click.middle since they don't actually fire
        // this is technically browser-specific, but at least for now browsers are
        // the only target envs that have right/middle clicks.
        //点击正常化。并点击。中间，因为它们实际上不会开火
        //这在技术上是特定于浏览器的，但至少现在浏览器是
        //唯一有右/中点击的目标环境。
        if (name === 'click') {//判断是否是点击事件
            if (modifiers.right) { //判断是否是鼠标右击
                name = 'contextmenu';
                delete modifiers.right;
            } else if (modifiers.middle) {//如果是鼠标左击
                name = 'mouseup';  //变成鼠标抬起事件
            }
        }

        var events;
        if (modifiers.native) { // 判断是有原生事件修饰符 通俗点讲：就是在父组件中给子组件绑定一个原生的事件，就将子组件变成了普通的HTML标签，不加'. native'事件是无法触  发的。
           /*
           * 比如<my-component @click="outClick"></my-component> 这样是不会触发事件的
           * 需要加修饰符<my-component @click.native="outClick"></my-component> 这样是不会触发事件的
           * */
            delete modifiers.native;
            events = el.nativeEvents || (el.nativeEvents = {}); //获取修饰符事件，如果虚拟dom没有nativeEvents 这个属性则为他添加
        } else {
            events = el.events || (el.events = {}); //直接获取事件对象，如果虚拟dom没有events属性则为他添加一个
        }

         //此时下面操作events 就相当于操作 el.nativeEvents 或者 el.events 对象

        var newHandler = {
            value: value.trim() //把事件函数 去除两边空格
        };
        if (modifiers !== emptyObject) { //如果 modifiers 不是一个空的对象
            newHandler.modifiers = modifiers;
        }

        var handlers = events[name]; //获取事件的值。
        /* istanbul ignore if */
        if (Array.isArray(handlers)) { //判断事件是否是数组
            //根据important 判断在前面添加事件还是在末端加
            important ? handlers.unshift(newHandler) : handlers.push(newHandler);

        } else if (handlers) { //如果handlers 已经存在，但是不是数组，说明现在是有两个事件
            //将handlers 修改为数组，新的事件和旧的事件一起
            events[name] = important ? [newHandler, handlers] : [handlers, newHandler];
        } else {
            //如果handlers 不存在 则直接获取事件，说明该事件同名的只有一个，
            events[name] = newHandler;
        }

        el.plain = false;
    }









    //  获取 :属性 或者v-bind:属性，或者获取属性 移除传进来的属性name，并且返回获取到 属性的值
    function getBindingAttr(el, //虚拟dom  vonde
                            name, //name
                            getStatic //
    ) {
        //获取 :属性 或者v-bind:属性
        var dynamicValue = getAndRemoveAttr(el, ':' + name) ||
            getAndRemoveAttr(el, 'v-bind:' + name);
        console.log(el)
        console.log(dynamicValue)
        if (dynamicValue != null) {
            /*
             *处理value 解析成正确的value，把过滤器 转换成vue 虚拟dom的解析方法函数 比如把过滤器 ' ab | c | d' 转换成 _f("d")(_f("c")(ab))
             * 表达式中的过滤器解析 方法
             */
            let parseFiltersValue = parseFilters(dynamicValue);
            console.log(parseFiltersValue)
            return parseFiltersValue
        } else if (getStatic !== false) {
            //移除传进来的属性name，并且返回获取到 属性的值
            var staticValue = getAndRemoveAttr(el, name);
            if (staticValue != null) {
                //转换成字符串
                return JSON.stringify(staticValue)
            }
        }
    }

// note: this only removes the attr from the Array (attrsList) so that it
// doesn't get processed by processAttrs.
// By default it does NOT remove it from the map (attrsMap) because the map is
// needed during codegen.
    //注意:这只是从数组(attrsList)中移除attr
//不会被processAttrs处理。
//默认情况下，它不会从地图(attrsMap)中删除它，因为地图是
//在codegen期间需要。

    //移除传进来的属性name，并且返回获取到 属性的值
    function getAndRemoveAttr(el, //el  虚拟dom
                              name,//属性名称 需要删除的属性 name，获取值的name属性
                              removeFromMap //是否要删除属性的标志
    ) {
        var val;
        if ((val = el.attrsMap[name]) != null) {
            var list = el.attrsList; //按地址引用
            for (var i = 0, l = list.length; i < l; i++) {
                if (list[i].name === name) {
                    list.splice(i, 1); //按地址引用 删除一个属性name
                    break
                }
            }
        }
        if (removeFromMap) { //是否要删除属性的标志
            delete el.attrsMap[name];
        }
        return val
    }

    /*  */

    /**
     * Cross-platform code generation for component v-model
     * 组件v-model的跨平台代码生成 更新$$v 数据
     *  为虚拟dom添加model属性，
     */
    function genComponentModel(
            el, //虚拟dom
            value, //绑定v-model 的值
            modifiers
    ) {
        var ref = modifiers || {};
        var number = ref.number; //数字
        var trim = ref.trim; //去除字符串
        // 给baseValueExpression赋值一个默认的字符串
        var baseValueExpression = '$$v';
        var valueExpression = baseValueExpression;
        if (trim) {
            // 判断类型是否为字符串，如果是使用去空格方法，如果不是返回原值
            valueExpression =
                "(typeof " + baseValueExpression + " === 'string'" +
                "? " + baseValueExpression + ".trim()" +
                ": " + baseValueExpression + ")";
        }
        if (number) { //如果是数字 则用数字渲染方法
            valueExpression = "_n(" + valueExpression + ")";
        }

        /*
         *创赋值代码，转义字符串对象拆分字符串对象  把后一位key分离出来
        * 返回 key"=" value
        * 或者 $set(object[info],key,valueExpression)
        */
        var assignment = genAssignmentCode(
            value, //绑定v-model 的属性值
            valueExpression //值
        );
        console.log(value)
        console.log(valueExpression)
        console.log(baseValueExpression)
        console.log(assignment)


    //如果 trim不存在，number 不存在 则 valueExpression 默认为$$v
    //回调函数是 $set(object[info],key,$$v) 更新$$v的值
        el.model = {
            value: ("(" + value + ")"), // 绑定v-model 的值
            expression: ("\"" + value + "\""), //绑定v-model 的值
            //函数  $set(object[info],key,$$v) //$set更新值函数
            callback: ("function (" + baseValueExpression + ") {" + assignment + "}")
        };


    }

    /**
     * Cross-platform codegen helper for generating v-model value assignment code.
     * 用于生成v-model值赋值代码的跨平台codegen助手。
     * 创赋值代码，转义字符串对象拆分字符串对象  把后一位key分离出来
     *
     * 返回 key"=" value
     * 或者 $set(object[info],key,value)
     */
    function genAssignmentCode(
        value, //key
         assignment //值
    ) {

        //转义字符串对象拆分字符串对象  把后一位key分离出来
        // 两种情况分析1 如果数据是object.info.name的情况下 则返回是 {exp: "object.info",key: "name"}
        //如果数据是object[info][name]的情况下 则返回是 {exp: "object[info]",key: "name"}
        var res = parseModel(value);
        if (res.key === null) {
            return (value + "=" + assignment) // 没有key就是当前值，返回当前值的key
        } else {
            return ("$set(" + (res.exp) + ", " + (res.key) + ", " + assignment + ")")  // 返回更新值 '$set(object[info],key,value)'
        }
    }

    /**
     * Parse a v-model expression into a base path and a final key segment.
     * Handles both dot-path and possible square brackets.
     * 将v-model表达式解析为基路径和最后一个键段。
     *处理点路径和可能的方括号。
     *
     * Possible cases:
     * 可能的情况下:
     *
     * - test
     * - test[key]
     * - test[test1[key]]
     * - test["a"][key]
     * - xxx.test[a[a].test1[key]]
     * - test.xxx.a["asa"][test1[key]]
     *
     */

    var len; //字符串长度
    var str; //字符串
    var chr; //字符串的编码
    var index$1; //循环的索引
    var expressionPos; //匹配到   符号 [ 的开始索引
    var expressionEndPos; // 如果匹配上一对 [] 的时候就跳出循环  则是匹配

    console.log(parseModel('object'))
    console.log(parseModel('object[info][name]'))
    console.log(parseModel('object.info.name'))
    console.log(parseModel('test[key]'))
    console.log(parseModel('test[test1[key]]'))
    console.log(parseModel('test["a"][key]'))
    console.log(parseModel('xxx.test[a[a].test1[key]]'))
    console.log(parseModel('test.xxx.a["asa"][test1[key]]'))

    //转义字符串对象拆分字符串对象  把后一位key分离出来
    // 两种情况分析1 如果数据是object.info.name的情况下 则返回是 {exp: "object.info",key: "name"}
   //如果数据是object[info][name]的情况下 则返回是 {exp: "object[info]",key: "name"}
    function parseModel(val) {
        // Fix https://github.com/vuejs/vue/pull/7730
        // allow v-model="obj.val " (trailing whitespace)
        val = val.trim(); //值
        len = val.length; //获取长度
        //lastIndexOf 方法可返回一个指定的字符串值最后出现的位置
        if (
            val.indexOf('[') < 0 || //这个字符串没有出现过[
            val.lastIndexOf(']') < len - 1 //这个字符串 没有出现过]这个符号  或者是出现位置不是在最后一位的时候
        ) {
            index$1 = val.lastIndexOf('.'); //获取最后一位出现 . 的位置
            if (index$1 > -1) { //说明有点.
                return {
                    exp: val.slice(0, index$1), //丢弃最后一位 比如data.object.info.age获取data.object.info
                    key: '"' + val.slice(index$1 + 1) + '"' //获取最后一位 age
                }
            } else {
                return {
                    exp: val, //如果没有点 则只有一个值
                    key: null
                }
            }
        }

        str = val;
        index$1 = expressionPos = expressionEndPos = 0;
        // 索引和字符串长度比较 如果索引大于或者等于字符串的时候返回真

        while (!eof()) { //循环获取字符串的编码 直到把字符编码循环完
            //获取字符串的编码
            chr = next();
            /* istanbul ignore if */

            if (isStringStart(chr)) { //如果是 " 或者 ' 的时候返回真
                parseString(chr); //循环匹配一对''或者""符号
            } else if (chr === 0x5B) { // 符号 [
                //检测 匹配[] 一对这样的=括号
                parseBracket(chr);
            }
        }

        return {
            exp: val.slice(0, expressionPos),
            key: val.slice(expressionPos + 1, expressionEndPos)
        }
    }

    //索引加加 获取字符串的编码
    function next() {
        //charCodeAt() 方法可返回指定位置的字符的 Unicode 编码。这个返回值是 0 - 65535 之间的整数。
        return str.charCodeAt(++index$1)
    }

    // 索引和字符串长度比较 如果索引大于或者等于字符串的时候返回真
    function eof() {
        //索引和字符串长度比较
        return index$1 >= len
    }

    //如果是 " 或者 ' 的时候返回真
    function isStringStart(chr) {
        //    "              '
        return chr === 0x22 || chr === 0x27
    }

    //检测 匹配[] 一对这样的=括号
    function parseBracket(chr) {
        var inBracket = 1;
        expressionPos = index$1;
        while (!eof()) {
            chr = next();
            if (isStringStart(chr)) { //如果是 " 或者 ' 的时候返回真
                parseString(chr); //循环匹配一对''或者""符号
                continue
            }
            if (chr === 0x5B) { // 匹配上
                inBracket++;
            }
            if (chr === 0x5D) {  //匹配上 ]
                inBracket--;
            }
            if (inBracket === 0) {  //如果匹配上一对 [] 的时候就跳出循环
                expressionEndPos = index$1;
                break
            }
        }
    }
    //循环匹配一对''或者""符号
    function parseString(chr) {
        var stringQuote = chr; //记录当前的'或者"
        while (!eof()) {
            chr = next();
            if (chr === stringQuote) {  //当他们匹配上一对的时候退出循环
                break
            }
        }
    }

    /*  */

    var warn$1;

// in some cases, the event used has to be determined at runtime
// so we used some reserved tokens during compile.
    //在某些情况下，使用的事件必须在运行时确定
//因此我们在编译期间使用了一些保留的令牌。
    var RANGE_TOKEN = '__r'; //虚拟dom渲染函数
    var CHECKBOX_RADIO_TOKEN = '__c';
   //根据判断虚拟dom的标签类型是什么？给相应的标签绑定 相应的 v-model 双数据绑定代码函数
    function model(
                el, //虚拟dom
                dir, // v-model 属性的key和值
                _warn //警告日志函数
    ) {
        console.log(el)
        console.log(dir)
        // {name: "model"
        //     rawName: "v-model"
        //     value: "item.url"}
        warn$1 = _warn;
        var value = dir.value; //
        var modifiers = dir.modifiers;
        var tag = el.tag;
        var type = el.attrsMap.type;

        {
            // inputs with type="file" are read only and setting the input's
            // value will throw an error.
            if (tag === 'input' && type === 'file') {
                warn$1(
                    "<" + (el.tag) + " v-model=\"" + value + "\" type=\"file\">:\n" +
                    "File inputs are read only. Use a v-on:change listener instead."
                );
            }
        }
        //根据表单元素的tag标签以及type属性的值，调用不同的方法也就验证了官网所说的“随表单控件类型不同而不同。”这里调用的就是genDefaultModel().
        if (el.component) { //如果是组件
            // 组件v-model的跨平台代码生成 更新$$v 数据
            // *  为虚拟dom添加model属性，
            genComponentModel(el, value, modifiers);
            // 组件v-model不需要额外的运行时
            // component v-model doesn't need extra runtime
            return false
        } else if (tag === 'select') {
            //为虚拟dom select添加change 函数 ，change函数调用 set 去更新 select选中数据的值
            genSelect(el, value, modifiers);
        } else if (tag === 'input' && type === 'checkbox') {
            //为input type="checkbox" 虚拟dom添加 change 函数 ，根据v-model是否是数组，调用change函数，调用 set 去更新 checked选中数据的值
            genCheckboxModel(el, value, modifiers);
        } else if (tag === 'input' && type === 'radio') {
            //为虚拟dom  inpu标签 type === 'radio' 添加change 事件 更新值
            genRadioModel(el, value, modifiers);
        } else if (tag === 'input' || tag === 'textarea') {
            //为虚拟dom  inpu标签   事件 更新值
            genDefaultModel(el, value, modifiers);
        } else if (!config.isReservedTag(tag)) {   //保留标签 判断是不是真的是 html 原有的标签 或者svg标签 如果不是则表示是组件 标签
            // 组件v-model的跨平台代码生成 更新$$v 数据
            // *  为虚拟dom添加model属性，
            genComponentModel(el, value, modifiers);
            // component v-model doesn't need extra runtime
            return false
        } else {
            warn$1(
                "<" + (el.tag) + " v-model=\"" + value + "\">: " +
                "v-model is not supported on this element type. " +
                'If you are working with contenteditable, it\'s recommended to ' +
                'wrap a library dedicated for that purpose inside a custom component.'
            );
        }

        // ensure runtime directive metadata
        return true
    }


    //为input type="checkbox" 虚拟dom添加 change 函数 ，根据v-model是否是数组，调用change函数，调用 set 去更新 checked选中数据的值
    function genCheckboxModel(
                              el, //虚拟dom
                              value, //v-model view的属性值
                              modifiers
    ) {
        console.log(el)

        var number = modifiers && modifiers.number;
        var valueBinding = getBindingAttr(el, 'value') || 'null'; //获取 表单的 value属性值 如果 view 是 value="1"
        var trueValueBinding = getBindingAttr(el, 'true-value') || 'true';
        var falseValueBinding = getBindingAttr(el, 'false-value') || 'false';

        /*
         view 绑定的 v-model="item.selected" 第二个参数为
         *  Array.isArray(item.selected)?_i(item.selected,"index")>-1:(item.selected)
         * */

        console.log( "Array.isArray(" + value + ")" +
            "?_i(" + value + "," + valueBinding + ")>-1" +
            (
                trueValueBinding === 'true'?
                    (":(" + value + ")")
                    : (":_q(" + value + "," + trueValueBinding + ")")
            ))

        //在虚拟dom中添加prop属性
        addProp(el,
            'checked',
            "Array.isArray(" + value + ")" +
                                           "?_i(" + value + "," + valueBinding + ")>-1" +
                                                (
                                                    trueValueBinding === 'true'?
                                                                                (":(" + value + ")")
                                                                                : (":_q(" + value + "," + trueValueBinding + ")")
                                                )
        );







        console.log("var $$a=" + value + "," +
            '$$el=$event.target,' +
            "$$c=$$el.checked?(" + trueValueBinding + "):(" + falseValueBinding + ");" +
            'if(Array.isArray($$a)){' +
            "var $$v=" + (number ? '_n(' + valueBinding + ')' : valueBinding) + "," +
            '$$i=_i($$a,$$v);' +
            "if($$el.checked){$$i<0&&(" + (genAssignmentCode(value, '$$a.concat([$$v])')) + ")}" +
            "else{$$i>-1&&(" + (genAssignmentCode(value, '$$a.slice(0,$$i).concat($$a.slice($$i+1))')) + ")}" +
            "}else{" + (genAssignmentCode(value, '$$c')) + "}")
        /*
         view 绑定的 v-model="item.selected" 第二个参数为

         var $$a = item.selected,  //属性值  v-model view的属性值  item.selected是否是数组
         $$el = $event.target,  //目标dom 真实dom
         $$c = $$el.checked ? (true) : (false);  //是否有选中
         if (Array.isArray($$a)) {
                     var $$v = "1",  //获取 表单的 value属性值 如果 view 是 value="1"
                     $$i = _i($$a, $$v); //获取到数组的索引，如果没有匹配上则是新的数据
                     if ($$el.checked) {
                                  //更新数组的值
                                 $$i < 0 && ($set(item, "selected", $$a.concat([$$v])))
                     } else {
                              //截取数组 更新获取到索引的数组 从匹配到到最后一位
                                 $$i > -1 && ($set(item, "selected", $$a.slice(0, $$i).concat($$a.slice($$i + 1))))
                     }
         } else {
                     $set(item, "selected", $$c)
         }
         * */

         //更新函数绑定change事件
        addHandler(
            el, //虚拟dom
            'change',  //事件
            "var $$a=" + value + "," +
            '$$el=$event.target,' +
            "$$c=$$el.checked?(" + trueValueBinding + "):(" + falseValueBinding + ");" +
            'if(Array.isArray($$a)){' +
                             "var $$v=" + (number ? '_n(' + valueBinding + ')' : valueBinding) + "," +
                              '$$i=_i($$a,$$v);' +
                               "if($$el.checked){$$i<0&&(" + (genAssignmentCode(value, '$$a.concat([$$v])')) + ")}" +
                              "else{$$i>-1&&(" + (genAssignmentCode(value, '$$a.slice(0,$$i).concat($$a.slice($$i+1))')) + ")}" +
            "}else{" + (genAssignmentCode(value, '$$c')) + "}",
            null,
            true
        );
    }

     //为虚拟dom  inpu标签 type === 'radio' 添加change 事件 更新值
    function genRadioModel(
                            el, //虚拟dom
                            value, //v-model 在view中的属性值
                            modifiers
                            ) {
        var number = modifiers && modifiers.number; //是否是数字
        var valueBinding = getBindingAttr(el, 'value') || 'null'; //获取虚拟dom view标签value属性值
         //如果是数字 则调用_n() 转义
        valueBinding = number ? ("_n(" + valueBinding + ")") : valueBinding;
        addProp(
            el,
            'checked',
            ("_q(" + value + "," + valueBinding + ")")
        );


         //添加事件
        addHandler(
                    el, //虚拟dom
                    'change', //change事件
                    //     返回 key"=" valueBinding
                    // * 或者 $set(object[info],key,valueBinding)
                    genAssignmentCode(value, valueBinding), //事件函数
                    null,// modifiers, //事件类型状态状态
                    true// 根据important为true 把事件添加在前面 假就添加在尾部
                   );
    }

    //为虚拟dom添加change 函数 ，change函数调用 set 去更新 select选中数据的值
    function genSelect(
                       el, //虚拟dom
                       value, //v-model属性值
                       modifiers
    ) {
        var number = modifiers && modifiers.number;
        var selectedVal = "Array.prototype.filter" +
                                                ".call($event.target.options," +
                                                        "function(o){" +
                                                        "           return o.selected" +
                                                        "})" +
                                                        ".map(function(o){" +
                                                                            "var val = \"_value\" in o ? o._value : o.value;" +
                                                                              "return " + (number ? '_n(val)' : 'val') + "" +
                                                                  "})";
        console.log(selectedVal)

        var assignment = '$event.target.multiple ? $$selectedVal : $$selectedVal[0]';
        var code = "var $$selectedVal = " + selectedVal + ";";

    // * 返回 key"=" $$selectedVal
    //     * 或者 $set(object[info],key,$$selectedVal)

        code = code + " " + (
                       genAssignmentCode(
                           value,  //v-model属性值
                           assignment // $$selectedVal是select选中数据的值
                       )
            );
        //这里字符串js意思是。先执行Array.prototype.filter 获取到值之后 在调用 $set(object[info],key,value) 更新数据
        //在把这个事件添加到change事件中
        addHandler(
             el, //虚拟dom
            'change',   //name 事件名称 事件类型
             code, //事件函数
            null,  //事件类型状态
            true // 根据important为true 把事件添加在前面 假就添加在尾部
        );
    }
    // 如果虚拟dom标签是  'input' 类型不是checkbox，radio 或者是'textarea' 标签的时候，获取真实的dom的value值调用 change或者input方法执行set方法更新数据
    function genDefaultModel(
                        el, //虚拟dom
                        value, //属性在view 的值
                        modifiers   //标签类型对象  修饰符
    ) {
        console.log(el)
        console.log(value)

        var type = el.attrsMap.type; //获取类型

        // warn if v-bind:value conflicts with v-model 警告如果v-bind:值与v-model冲突
        // except for inputs with v-bind:type 除了输入v-bind:type
        {
            var value$1 = el.attrsMap['v-bind:value'] || el.attrsMap[':value'];
            var typeBinding = el.attrsMap['v-bind:type'] || el.attrsMap[':type'];
            if (value$1 && !typeBinding) { //如果type属性没有则发出警告
                var binding = el.attrsMap['v-bind:value'] ? 'v-bind:value' : ':value';
                warn$1(
                    binding + "=\"" + value$1 + "\" conflicts with v-model on the same element " +
                    'because the latter already expands to a value binding internally'
                );
            }
        }

        var ref = modifiers || {};
        var lazy = ref.lazy; //只有在焦点不集中时，才应该更新带有lazy的输入 失去焦点
        var number = ref.number; //数字
        var trim = ref.trim; //去除两边空格
        var needCompositionGuard = !lazy && type !== 'range'; //如果不是滑动类型input
        var event = lazy ?  //获取类型事件 可以是change或者是input 事件
                         'change'
                         : type === 'range' ? //判断是否是滑动块
                                             RANGE_TOKEN    //'__r'虚拟dom渲染函数
                                             : 'input';

        var valueExpression = '$event.target.value';
        if (trim) {
            valueExpression = "$event.target.value.trim()"; //获取真实dom的value
        }
        if (number) {
            valueExpression = "_n(" + valueExpression + ")";
        }
        //更新值
            // * 返回 key"=" value
            //     * 或者 $set(object[info],key,value)
        var code = genAssignmentCode(
            value,  //v-model 的属性值
            valueExpression //真实dom的value
        );
        if (needCompositionGuard) { //如果不是滑动块
            code = "if($event.target.composing)return;" + code;
        }
          //添加props 属性
        addProp(el, 'value', ("(" + value + ")"));
       //添加绑定事件
        addHandler(
            el, //虚拟dom
            event, //事件类型
            code, //事件函数
            null, //事件类型状态状态 修饰符
            true // 根据important为true 把事件添加在前面 假就添加在尾部
        );
        if (trim || number) {

            addHandler(el, 'blur', '$forceUpdate()');
        }
    }

    /*  */

// normalize v-model event tokens that can only be determined at runtime.
// it's important to place the event as the first in the array because
// the whole point is ensuring the v-model callback gets called before
// user-attached handlers.
//规范化只能在运行时确定的v-model事件令牌。
//将事件放在数组的第一个位置很重要，因为
//关键是确保v-model回调函数在之前被调用
//user-attached处理程序。

    //为事件 多添加 change 或者input 事件加进去
    function normalizeEvents(on) {
        /* istanbul ignore if */
        if (isDef(on[RANGE_TOKEN])) {
            // IE input[type=range] only supports `change` event
            //
            var event = isIE ? 'change' : 'input';  //判断是否是ie 浏览器，如果是则选择 change 事件，如果不是则选择input事件
            on[event] = [].concat(on[RANGE_TOKEN], on[event] || []); //连接事件 把change或者input 事件添加进去
            delete on[RANGE_TOKEN]; //删除旧的事件
        }
        // This was originally intended to fix #4521 but no longer necessary
        // after 2.5. Keeping it for backwards compat with generated code from < 2.4
        /* istanbul ignore if */
        //最初的目的是修复#4521，但现在已经没有必要了
        // 2.5之后。保留它以便与< 2.4生成的代码进行反向比较
        //添加change事件
        if (isDef(on[CHECKBOX_RADIO_TOKEN])) {

            on.change = [].concat(on[CHECKBOX_RADIO_TOKEN], on.change || []);
            delete on[CHECKBOX_RADIO_TOKEN];
        }
    }

    var target$1;
   //柯理化函数，返回一个直接调用函数的方法，调用完就删除事件

    function createOnceHandler(
                                handler,//转义过的事件
                                event, //事件名称
                                capture  // 事件俘获或是冒泡行为
                           ) {
                            var _target = target$1; // save current target element in closure
                            return function onceHandler() {
                                var res = handler.apply(null, arguments);
                                if (res !== null) {
                                    remove$2(
                                        event,  //事件名称
                                        onceHandler, //绑定的事件
                                        capture, //事件俘获或是冒泡行为
                                        _target //真实的dom
                                    );
                                }
                            }
    }


     //withMacroTask，为事件添加一个静态属性_withTask为红任务，则是执行fn的。
    // 判断once$$1是否存在，如果存在则调用createOnceHandler  返回一个直接调用函数的方法，调用完就删除事件
    // 为真实的dom添加事件
    function add$1(
                   event,  //事件名称
                   handler, // 转义过的事件 执行事件静态类
                   once$$1, //是否只触发一次的状态
                   capture, //  事件俘获或是冒泡行为
                   passive // 检测事件修饰符 是否是   '&'
            ) {
        //withMacroTask，为事件添加一个静态属性_withTask为红任务，则是执行fn的。
        handler = withMacroTask(handler);
        if (once$$1) {
            //创建一次处理程序
          //柯理化函数，返回一个直接调用函数的方法，调用完就删除事件
            handler = createOnceHandler(
                handler,//转义过的事件
                event, //事件名称
                capture  //事件俘获或是冒泡行为
            );
        }
        //为真实的dom添加事件
        target$1.addEventListener(
            event, //事件名称
            handler, //事件函数
            supportsPassive ? {capture: capture,passive: passive}: capture //事件是俘获还是冒泡
        );
    }
  //删除真实dom的事件
    function remove$2(
                      event,//事件名称
                      handler, //转义过的事件 dom绑定的事件
                      capture, //事件俘获或是冒泡行为
                      _target //真实的dom
                          ) {
        (_target || target$1).removeEventListener(
            event,
            handler._withTask || handler,
            capture //事件俘获或是冒泡行为
        );
    }

    //更新dom事件
    function updateDOMListeners(oldVnode, vnode) {
        //判断是否定义了事件on 如果他们两不定义有则不执行下面代码
        if (isUndef(oldVnode.data.on) && isUndef(vnode.data.on)) {
            return
        }
        var on = vnode.data.on || {};
        var oldOn = oldVnode.data.on || {};
        target$1 = vnode.elm; //真实的dom
        normalizeEvents(on);    //为事件 多添加 change 或者input 事件加进去
        //更新数据源 并且为新的值 添加函数 旧的值删除函数等功能
        updateListeners(
            on, //新的事件对象
            oldOn, //旧的事件对象
            add$1, //添加真实dom的事件函数
            remove$2, //删除真实dom的事件函数
            vnode.context //vue 实例化的对象 new Vue 或者组件 构造函数实例化的对象
        );
        target$1 = undefined;
    }

    var events = {
        create: updateDOMListeners,
        update: updateDOMListeners
    }

    /* 
     *   更新真实dom的props属性
     *  */
    function updateDOMProps(oldVnode, vnode) {

        if (isUndef(oldVnode.data.domProps) && isUndef(vnode.data.domProps)) {
            return
        }
        var key, cur;
        var elm = vnode.elm;
        var oldProps = oldVnode.data.domProps || {}; //获取旧的props属性
        var props = vnode.data.domProps || {}; //获取新的props
        // clone observed objects, as the user probably wants to mutate it
        //克隆观察到的对象，因为用户可能希望对其进行修改
        if (isDef(props.__ob__)) { //如果是props添加了观察者，重新克隆他，这样就可以修改了
            props = vnode.data.domProps = extend({}, props);
        }
        consolelog(props)
        consolelog(oldProps)

        for (key in oldProps) { //循环旧的props属性，如果没有定义了 就给空
            if (isUndef(props[key])) {
                elm[key] = '';
            }
        }
        for (key in props) { //循环新的props属性
            cur = props[key]; //获取props 的值
            // ignore children if the node has textContent or innerHTML,
            // as these will throw away existing DOM nodes and cause removal errors
            // on subsequent patches (#3360)
            //忽略子节点，如果节点有textContent或innerHTML，
            //因为这将丢弃现有的DOM节点并导致删除错误
            //其后的修补程式(#3360)
            if (
                key === 'textContent' ||
                key === 'innerHTML'
            ) {
                    if (vnode.children) {
                        vnode.children.length = 0;
                    }
                    if (cur === oldProps[key]) {
                        continue
                    }
                    // #6601 work around Chrome version <= 55 bug where single textNode
                    // replaced by innerHTML/textContent retains its parentNode property
                    // #6601解决Chrome版本<= 55的bug，其中只有一个textNode
                    //被innerHTML/textContent替换后，保留了它的parentNode属性
                    if (elm.childNodes.length === 1) { //文本节点
                        elm.removeChild(elm.childNodes[0]);
                    }
            }

            if (key === 'value') {
                // store value as _value as well since
                // non-string values will be stringified
                 //将value存储为_value以及since
                //非字符串值将被字符串化
                elm._value = cur;
                // avoid resetting cursor position when value is the same
                // 当值相同时，避免重置光标位置
                var strCur = isUndef(cur) ? '' : String(cur); //转义成字符串
                if (shouldUpdateValue(
                        elm,   //真实的dom
                        strCur //value
                    )) {
                    elm.value = strCur; //赋值
                }
            } else {
                elm[key] = cur; //直接赋值
            }
        }
    }

// check platforms/web/util/attrs.js acceptValue

// 判断你是否更新value
    function shouldUpdateValue(elm, checkVal) {
        return (!elm.composing && (
            elm.tagName === 'OPTION' ||
            isNotInFocusAndDirty(elm, checkVal) ||
            isDirtyWithModifiers(elm, checkVal)
        ))
    }

    function isNotInFocusAndDirty(elm, checkVal) {
        // return true when textbox (.number and .trim) loses focus and its value is
        // not equal to the updated value
        var notInFocus = true;
        // #6157
        // work around IE bug when accessing document.activeElement in an iframe
        try {
            notInFocus = document.activeElement !== elm;
        } catch (e) {
        }
        return notInFocus && elm.value !== checkVal
    }

    function isDirtyWithModifiers(elm, newVal) {
        var value = elm.value;
        var modifiers = elm._vModifiers; // injected by v-model runtime
        if (isDef(modifiers)) {
            if (modifiers.lazy) {
                // inputs with lazy should only be updated when not in focus
                return false
            }
            if (modifiers.number) {
                return toNumber(value) !== toNumber(newVal)
            }
            if (modifiers.trim) {
                return value.trim() !== newVal.trim()
            }
        }
        return value !== newVal
    }

    var domProps = {
        create: updateDOMProps, //更新真实dom的props 属性值
        update: updateDOMProps//更新真实dom的props 属性值
    }

    /*  */

    //把style 字符串 转换成对象 比如'width:100px;height:200px;' 转化成 {width:100px,height:200px}
    var parseStyleText = cached(function (cssText) {
        var res = {};
        var listDelimiter = /;(?![^(]*\))/g; //匹配字符串中的 ;符号。但是不属于 (;)的 符号 如果是括号中的;不能匹配出来
        var propertyDelimiter = /:(.+)/;  //:+任何字符串
        console.log(cssText.split(listDelimiter))

        cssText.split(listDelimiter).forEach(function (item) {
            if (item) {
                var tmp = item.split(propertyDelimiter);
                console.log(tmp)

                tmp.length > 1 && (res[tmp[0].trim()] = tmp[1].trim());
            }
        });
        return res
    });

    console.log(parseStyleText('width:100px;(height:200px);'))

    // merge static and dynamic style data on the same vnode
    //在同一个vnode上合并静态和动态样式数据
    function normalizeStyleData(data) {
        // //将可能的数组/字符串值规范化为对象  把style 字符串 转换成对象 比如'width:100px;height:200px;' 转化成 {width:100px,height:200px} 返回该字符串。
        var style = normalizeStyleBinding(data.style); //获取到vonde中的style属性值
        // static style is pre-processed into an object during compilation
        // and is always a fresh object, so it's safe to merge into it
        //静态样式在编译期间被预处理为对象
        //始终是一个新鲜的对象，所以可以安全地融入其中
        return data.staticStyle ?
                                  extend(data.staticStyle, style) : //合并静态
                                  style
    }

// normalize possible array / string values into Object
    //将可能的数组/字符串值规范化为对象
    //看到这里
    function normalizeStyleBinding(bindingStyle) {
        if (Array.isArray(bindingStyle)) {
            return toObject(bindingStyle)
        }
        if (typeof bindingStyle === 'string') {
            //把style 字符串 转换成对象 比如'width:100px;height:200px;' 转化成 {width:100px,height:200px}
            return parseStyleText(bindingStyle)
        }
        return bindingStyle
    }

    /**
     * parent component style should be after child's
     * so that parent component's style could override it
     * 父组件样式应该在子组件样式之后
     * 这样父组件的样式就可以覆盖它
     * 循环子组件和组件的样式，把它全部合并到一个样式对象中返回 样式对象 如{width:100px,height:200px} 返回该字符串。
     */
    function getStyle(
                        vnode, //虚拟dom
                        checkChild //标志点 布尔值
                        ) {
                                var res = {};
                                var styleData; //style data
                                if (checkChild) { // 标志点 布尔值
                                    var childNode = vnode; //获取子节点
                                    while (childNode.componentInstance) { //已经实例化过的 就是子节点有vonde
                                                                        childNode = childNode.componentInstance._vnode;
                                                                        if (
                                                                            childNode &&
                                                                            childNode.data &&
                                                                            (styleData = normalizeStyleData(childNode.data))
                                                                        ) {
                                                                            extend(res, styleData);
                                                                        }
                                    }
                                }

                                if ((styleData = normalizeStyleData(vnode.data))) {
                                    extend(res, styleData);
                                }

                                var parentNode = vnode;
                                while ((parentNode = parentNode.parent)) {
                                                                        if (parentNode.data && (styleData = normalizeStyleData(parentNode.data))) {
                                                                                    extend(res, styleData);
                                                                        }
                                }
                                return res
    }

    /*  */

    var cssVarRE = /^--/; //开始以 --开始
    var importantRE = /\s*!important$/; //以!important 结束

    var setProp = function (el, name, val) {
        //object.setProperty(propertyname, value, priority)
        //         参数	描述
        //         propertyname	必需。一个字符串，表示创建或修改的属性。
        // value	可选，新的属性值。
        // priority	可选。字符串，规定是否需要设置属性的优先级 important。
        // 可以是下面三个值:"important"，undefined，""
        /* istanbul ignore if */
        if (cssVarRE.test(name)) { //开始以 --开始
            el.style.setProperty(name, val); //设置真实dom样式
        } else if (importantRE.test(val)) { //以!important 结束
            el.style.setProperty(
                                name,
                                val.replace(importantRE, ''),
                                'important'
                                );
        } else {
            //给css加前缀
            var normalizedName = normalize(name);
            if (Array.isArray(val)) {
                // Support values array created by autoprefixer, e.g.
                // {display: ["-webkit-box", "-ms-flexbox", "flex"]}
                // Set them one by one, and the browser will only set those it can recognize
                //支持自动修复程序创建的值数组。
                //{显示:[“-webkit-box”、“-ms-flexbox”,“柔化”)}
                //一个一个设置，浏览器只会设置它能识别的
                for (var i = 0, len = val.length; i < len; i++) {
                    el.style[normalizedName] = val[i]; //循环一个个设置样式
                }
            } else {
                el.style[normalizedName] = val;
            }
        }
    };

    var vendorNames = ['Webkit', 'Moz', 'ms'];
    var emptyStyle;
    //给css加前缀。解决浏览器兼用性问题，加前缀
    var normalize = cached(function (prop) {
        emptyStyle = emptyStyle || document.createElement('div').style; //获取浏览器中的style样式
        prop = camelize(prop);
        if (prop !== 'filter' && (prop in emptyStyle)) { //如果该属性已经在样式中
            return prop
        }
        var capName = prop.charAt(0).toUpperCase() + prop.slice(1); //首字母变成大写
        for (var i = 0; i < vendorNames.length; i++) {
            var name = vendorNames[i] + capName; //加前缀
            if (name in emptyStyle) {
                return name
            }
        }
    });
   // 将vonde虚拟dom的css 转义成并且渲染到真实dom的csszhong
    function updateStyle(oldVnode, vnode) {
        var data = vnode.data; //获取新虚拟dom的标签属性
        var oldData = oldVnode.data; //获取旧虚拟dom的标签属性

        if (isUndef(data.staticStyle) && isUndef(data.style) &&
            isUndef(oldData.staticStyle) && isUndef(oldData.style)
        ) {
            return
        }

        var cur, name;
        var el = vnode.elm; //获取真实的dom
        var oldStaticStyle = oldData.staticStyle; //获取旧的静态 staticStyle
        var oldStyleBinding = oldData.normalizedStyle || oldData.style || {}; //获取旧的动态style

        // if static style exists, stylebinding already merged into it when doing normalizeStyleData
      //  如果存在静态样式，则在执行normalizeStyleData时，stylebinding已经合并到其中
        var oldStyle = oldStaticStyle || oldStyleBinding; //旧的style样式


        //将可能的数组/字符串值规范化为对象 //把style 字符串 转换成对象 比如'width:100px;height:200px;' 转化成 {width:100px,height:200px}
        var style = normalizeStyleBinding(vnode.data.style) || {};

        // store normalized style under a different key for next diff
        // make sure to clone it if it's reactive, since the user likely wants
        // to mutate it.
        //为下一个diff在不同的键下存储规范化样式
        //如果它是反应性的，请确保克隆它，因为用户可能希望这样做
        //使之变异
        vnode.data.normalizedStyle = isDef(style.__ob__)  ? //如果style 加入了观察者之后
                                                            extend({}, style):  //重新克隆,可以修改
                                                            style; //直接赋值
        //getStyle循环子组件和组件的样式，把它全部合并到一个样式对象中返回 样式对象 如{width:100px,height:200px} 返回该字符串。
        var newStyle = getStyle(
                                vnode,
                                true
                               );

        for (name in oldStyle) { //获取旧虚拟dom的样式
            if (isUndef(newStyle[name])) { // 如果新的虚拟dom vonde没有了
                setProp(el, name, ''); //则设置样式为空
            }
        }
        for (name in newStyle) { //循环新的虚拟dom vonde 样式
            cur = newStyle[name];
            if (cur !== oldStyle[name]) { //如果旧的和新的不同了 就设置新的样式
                // ie9 setting to null has no effect, must use empty string
                setProp(el, name, cur == null ? '' : cur);
            }
        }
    }

    var style = {
        create: updateStyle,
        update: updateStyle
    }

    /*  */

    /**
     * Add class with compatibility for SVG since classList is not supported on
     * SVG elements in IE
     * *添加与SVG兼容的类，因为不支持类列表
     * IE中的SVG元素
     *为真实dom 元素添加class类
     */
    function addClass(el, cls) {
        /* istanbul ignore if */
        if (!cls || !(cls = cls.trim())) {
            return
        }

        /* istanbul ignore else */
        if (el.classList) { //如果浏览器支持classList
            if (cls.indexOf(' ') > -1) {
                cls.split(/\s+/).forEach(function (c) {
                    return el.classList.add(c);
                });
            } else {
                el.classList.add(cls);
            }
        } else { //不支持classList  直接用字符串拼接
            var cur = " " + (el.getAttribute('class') || '') + " ";
            if (cur.indexOf(' ' + cls + ' ') < 0) {
                el.setAttribute('class', (cur + cls).trim());
            }
        }
    }

    /**
     * Remove class with compatibility for SVG since classList is not supported on
     * SVG elements in IE
      *删除与SVG兼容的类，因为不支持类列表
     * IE中的SVG元素
      
     删除真实dom的css类名
     */
    function removeClass(el, cls) {
        /* istanbul ignore if */
        if (!cls || !(cls = cls.trim())) {
            return
        }

        /* istanbul ignore else */
        if (el.classList) {
            if (cls.indexOf(' ') > -1) {
                cls.split(/\s+/).forEach(function (c) {
                    return el.classList.remove(c);
                });
            } else {
                el.classList.remove(cls);
            }
            if (!el.classList.length) {
                el.removeAttribute('class');
            }
        } else {
            var cur = " " + (el.getAttribute('class') || '') + " ";
            var tar = ' ' + cls + ' ';
            while (cur.indexOf(tar) >= 0) {
                cur = cur.replace(tar, ' ');
            }
            cur = cur.trim();
            if (cur) {
                el.setAttribute('class', cur);
            } else {
                el.removeAttribute('class');
            }
        }
    }

    /*
    *
    *    解析vonde中的transition的name属性获取到一个css过度对象类
    * */

    function resolveTransition(def) {
        if (!def) {
            return
        }
        /* istanbul ignore else */
        if (typeof def === 'object') {
            var res = {};
            if (def.css !== false) {
                // 使用 name，默认为 v
                //  通过 name 属性获取过渡 CSS 类名   比如标签上面定义name是 fade  css就要定义  .fade-enter-active,.fade-leave-active，.fade-enter,.fade-leave-to 这样的class
                extend(res, autoCssTransition(def.name || 'v'));
            }
            extend(res, def);
            return res
        } else if (typeof def === 'string') {
            return autoCssTransition(def)
        }
    }

     //  通过 name 属性获取过渡 CSS 类名   比如标签上面定义name是 fade  css就要定义  .fade-enter-active,.fade-leave-active，.fade-enter,.fade-leave-to 这样的class
    var autoCssTransition = cached(function (name) {
        return {
            enterClass: (name + "-enter"), //
            enterToClass: (name + "-enter-to"), //
            enterActiveClass: (name + "-enter-active"), //进入激活动画的css类   类似这样的 v-enter-active {transition: all .3s ease;}
            leaveClass: (name + "-leave"), //离开动画的css 动画过度类
            leaveToClass: (name + "-leave-to"), //离开动画的css 动画过度类
            leaveActiveClass: (name + "-leave-active")//激活离开动画的css 动画过度类
        }
    });

    var hasTransition = inBrowser && !isIE9;
    var TRANSITION = 'transition';
    var ANIMATION = 'animation';

// Transition property/event sniffing
    var transitionProp = 'transition';
    var transitionEndEvent = 'transitionend';
    var animationProp = 'animation';
    var animationEndEvent = 'animationend';
    if (hasTransition) {
        /* istanbul ignore if */
        if (window.ontransitionend === undefined &&
            window.onwebkittransitionend !== undefined
        ) {
            transitionProp = 'WebkitTransition';
            transitionEndEvent = 'webkitTransitionEnd';
        }
        if (window.onanimationend === undefined &&
            window.onwebkitanimationend !== undefined
        ) {
            animationProp = 'WebkitAnimation';
            animationEndEvent = 'webkitAnimationEnd';
        }
    }

// binding to window is necessary to make hot reload work in IE in strict mode
    //绑定到窗口是必要的，使热重载工作在IE严格模式
    //如果是浏览器如果浏览器支持requestAnimationFrame就用requestAnimationFrame，不支持就用setTimeout
       var raf = inBrowser ?
                             (window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : setTimeout)
                            : function (fn) {
                                  return fn();
                               };

     //下一帧
    function nextFrame(fn) {
        raf(function () {
            raf(fn);
        });
    }
    //获取 真实dom addTransitionClass 记录calss类
    function addTransitionClass(el, cls) {
        var transitionClasses = el._transitionClasses || (el._transitionClasses = []);
        if (transitionClasses.indexOf(cls) < 0) { //如果没有添加则添加
            transitionClasses.push(cls);
            //为真实的dom添加class
            addClass(el, cls);
        }
    }

   //删除vonde的class类和删除真实dom的class类
    function removeTransitionClass(el, cls) {
        if (el._transitionClasses) {

            remove(el._transitionClasses, cls); //删除数组
        }
       // 删除真实dom的css类名
        removeClass(el, cls);
    }

// 获取动画的信息，执行动画。
    function whenTransitionEnds(
                                el, //真实的dom
                                expectedType,//动画类型
                                cb //回调方法
                               ) {
        //获取返回transition，或者animation 动画的类型，动画个数，动画执行时间
        var ref = getTransitionInfo(el, expectedType);
        var type = ref.type; //动画类型
        var timeout = ref.timeout;//总动画执行的时长
        var propCount = ref.propCount; //动画的个数
        if (!type) {
            return cb()
        }
        //TRANSITION=transition
        //判断是transition动画还是animation动画
        var event = type === TRANSITION ? transitionEndEvent : animationEndEvent;
        var ended = 0;
        var end = function () { //结束动画函数
            //删除动画事件
            el.removeEventListener(event, onEnd);
            cb(); //回调执行动画
        };
        var onEnd = function (e) {
            if (e.target === el) {
                if (++ended >= propCount) {
                    end();
                }
            }
        };
        setTimeout(function () { //执行动画
            if (ended < propCount) {
                end(); //时间到了就执行动画并且删除事件。
            }
        }, timeout + 1);
        el.addEventListener(event, onEnd);
    }

    var transformRE = /\b(transform|all)(,|$)/;
   //获取Transition 过度动画信息
    //获取transition，或者animation 动画的类型，动画个数，动画执行时间
    function getTransitionInfo(
        el, //真实的dom
        expectedType //动画类型
    ) {
        //  Window.getComputedStyle()方法返回一个对象，
// 该对象在应用活动样式表并解析这些值可能包含的任何基本计算后报告元素的所有CSS属性的值
// 私有的CSS属性值可以通过对象提供的API或通过简单地使用CSS属性名称进行索引来访问。
        var styles = window.getComputedStyle(el); //
        console.log('==styles==')
        console.log(styles)
//          var transitionProp = 'transition';
        var transitionDelays = styles[transitionProp + 'Delay'].split(', '); //获取动画时间
        var transitionDurations = styles[transitionProp + 'Duration'].split(', '); //获取动画时间
        //transitionDelays=5s
        var transitionTimeout = getTimeout(transitionDelays, transitionDurations);//获取动画时间
        var animationDelays = styles[animationProp + 'Delay'].split(', ');//获取动画时间
        var animationDurations = styles[animationProp + 'Duration'].split(', ');//获取动画时间
        var animationTimeout = getTimeout(animationDelays, animationDurations); //获取动画时间
        console.log('transitionDelays='+transitionDelays)
        console.log('transitionDurations='+transitionDurations)
        console.log('transitionTimeout='+transitionTimeout)
        console.log('animationDelays='+animationDelays)
        console.log('animationDurations='+animationDurations)
        console.log('animationTimeout='+animationTimeout)


        var type;  //动画类型
        var timeout = 0; //动画时长
        var propCount = 0; //动画个数
        /* istanbul ignore if */
        if (expectedType === TRANSITION) {// 判断动画是否是transition
            if (transitionTimeout > 0) {
                type = TRANSITION;
                timeout = transitionTimeout;
                propCount = transitionDurations.length;
            }
        } else if (expectedType === ANIMATION) { //判断动画是否是animation
            if (animationTimeout > 0) {
                type = ANIMATION;
                timeout = animationTimeout;
                propCount = animationDurations.length;
            }
        } else {
            timeout = Math.max(transitionTimeout, animationTimeout);
            type = timeout > 0
                ? transitionTimeout > animationTimeout
                ? TRANSITION
                : ANIMATION
                : null;
            propCount = type
                ? type === TRANSITION
                ? transitionDurations.length
                : animationDurations.length
                : 0;
        }
        var hasTransform =
            type === TRANSITION &&
            transformRE.test(styles[transitionProp + 'Property']);
        console.log(styles[transitionProp + 'Property']) //获取动画设置在哪些属性上面

        return {
            type: type,//过度或者css3动画类型
            timeout: timeout, //执行动画的时长
            propCount: propCount, //动画个数 执行多个动画
            hasTransform: hasTransform //布尔值 是不是  transition 动画
        }
    }

    function getTimeout(delays, durations) {
        console.log(delays)
        console.log(durations)
        debugger
        /* istanbul ignore next */
        while (delays.length < durations.length) {
            delays = delays.concat(delays);
        }

        return Math.max.apply(null, durations.map(function (d, i) {
            return toMs(d) + toMs(delays[i])
        }))
    }

    function toMs(s) {
        return Number(s.slice(0, -1)) * 1000
    }

    //resolveTransition 解析vonde中的transition的name属性获取到一个css过度对象类
    function enter(
                    vnode,
                    toggleDisplay
    ) {
        var el = vnode.elm; //真实的dom



        //  call leave callback now 执行 leave 回调函数
        if (isDef(el._leaveCb)) {
            el._leaveCb.cancelled = true; //标志已经执行过_leaveCb函数
            el._leaveCb(); //执行_leaveCb回调
        }
     //resolveTransition 解析vonde中的transition的name属性获取到一个css过度对象类
        var data = resolveTransition(vnode.data.transition);
        console.log(vnode.data.transition)
        console.log(data)

        if (isUndef(data)) {
            return
        }

        /* istanbul ignore if */
        if (isDef(el._enterCb) || el.nodeType !== 1) { //不是真实的dom
            return
        }

        var css = data.css; //css类
        var type = data.type; //dom类型
        var enterClass = data.enterClass; //动画进入中的 css 中的过度类
        var enterToClass = data.enterToClass; //动画退出中的 css 中的过度类
        var enterActiveClass = data.enterActiveClass; //动画进入活跃的类  类似这样的    enter-active {transition: all .3s ease;}
        var appearClass = data.appearClass;  //  自定义动画props属性 过度
        var appearToClass = data.appearToClass; //自定义动画props属性 离开的过度 css 类名
        var appearActiveClass = data.appearActiveClass;//自定义动画props属性 激活 css 类名
        var beforeEnter = data.beforeEnter; //进入动画钩子函数
        var enter = data.enter;//进入动画钩子函数
        var afterEnter = data.afterEnter; //进入动画钩子函数
        var enterCancelled = data.enterCancelled;//进入动画钩子函数
        var beforeAppear = data.beforeAppear; //自定义过过度动画的钩子函数
        var appear = data.appear; //自定义过度动画的 属性名称
        var afterAppear = data.afterAppear; //自定义过度动画的 钩子函数
        var appearCancelled = data.appearCancelled;  //自定义过度动画的 钩子函数
        var duration = data.duration; //定义动画的时长

        // activeInstance will always be the <transition> component managing this
        // transition. One edge case to check is when the <transition> is placed
        // as the root node of a child component. In that case we need to check
        // <transition>'s parent for appear check.
        //activeInstance始终是管理这个的<transition>组件
        //转换。要检查的一种边缘情况是何时放置<transition>
        //作为子组件的根节点。那样的话，我们需要检查一下
        // <切换到>的父节点以查看是否出现。
        var context = activeInstance; //vue 实例化的对象
        var transitionNode = activeInstance.$vnode;     // 父层的Vnode
        while (transitionNode && transitionNode.parent) { //循环父层vonde 一直到顶层的 vonde
            transitionNode = transitionNode.parent;
            context = transitionNode.context;
        }

        var isAppear =
            !context._isMounted ||  //是否已经调用过Mounted 生命周期函数
            !vnode.isRootInsert; //   /*是否作为跟节点插入*/
        

        if (isAppear && !appear && appear !== '') {
            return
        }
        //获取静态css类，
        var startClass = isAppear && appearClass ?
                                                   appearClass : enterClass;

   /*
       获取激活css类  类似这样的
       .v-leave-active {
                transition: opacity .5s;
            }
        .v-enter-active{
                transition: opacity .5s;
            }
     */

        var activeClass = isAppear && appearActiveClass
            ? appearActiveClass
            : enterActiveClass;



        /*
         获取过度时候的css类，类似这样的
          .fade-enter,
         .fade-leave-to  {
         opacity: 0;
         }
        * */
        var toClass = isAppear && appearToClass // 离开的过度 css 类名
            ? appearToClass
            : enterToClass;

          //钩子函数 进入动画的钩子函数
        var beforeEnterHook = isAppear
            ? (beforeAppear || beforeEnter)
            : beforeEnter;

        //
        var enterHook = isAppear
            ? (typeof appear === 'function' ? appear : enter)
            : enter;

        //进入过度动画的钩子函数
        var afterEnterHook = isAppear
            ? (afterAppear || afterEnter)
            : afterEnter;

            //取消过度动画的钩子函数
        var enterCancelledHook = isAppear
            ? (appearCancelled || enterCancelled)
            : enterCancelled;
      //动画时长
        var explicitEnterDuration = toNumber(
            isObject(duration)
                ? duration.enter
                : duration
        );

        if ("development" !== 'production' && explicitEnterDuration != null) {
            checkDuration(explicitEnterDuration, 'enter', vnode);
        }

        var expectsCSS = css !== false && !isIE9; //如果不是在ie9的环境下。还有css类

      //检测钩子函数 fns 的长度
        var userWantsControl = getHookArgumentsLength(enterHook);

        var cb = el._enterCb = once(function () { //只执行一次函数
            //这个函数就是给dom添加css class 让dom执行动画的
            if (expectsCSS) {
                removeTransitionClass(el, toClass); //删除了   离开的过度 css 类名
                removeTransitionClass(el, activeClass); //删除了 激活过度 css 类名
            }
            if (cb.cancelled) { //如果执行过了_enterCb函数
                if (expectsCSS) {
                    removeTransitionClass(el, startClass); //
                }
                enterCancelledHook && enterCancelledHook(el); //回调 取消过度动画的钩子函数
            } else {
                afterEnterHook && afterEnterHook(el); //回调进入过度动画的钩子函数
            }
            el._enterCb = null;
        });

        if (!vnode.data.show) {
            // remove pending leave element on enter by injecting an insert hook
            //通过注入插入钩子，在进入时删除挂起的leave元素
            mergeVNodeHook(
                vnode,
                'insert',
                function () {
                var parent = el.parentNode; //获取真实dom的父节点
                var pendingNode = parent && parent._pending && parent._pending[vnode.key];
                if (
                    pendingNode &&
                    pendingNode.tag === vnode.tag &&
                    pendingNode.elm._leaveCb
                ) {
                    //调用离开回调函数
                    pendingNode.elm._leaveCb();
                }
                //调用的进入过度动画钩子函数
                enterHook && enterHook(el, cb);
            });
        }

        // start enter transition
        //开始进入过渡 动画 钩子函数
        beforeEnterHook && beforeEnterHook(el);


        if (expectsCSS) { //如果没有dom中没有clss类
            //为真实dom添加class类
            addTransitionClass(
                el,
                startClass
            );
            //为真实dom添加class类
            addTransitionClass(
                el,
                activeClass
            );
            nextFrame(function () {
                console.log('nextFrame')


                removeTransitionClass(el, startClass); //执行过了就删除class类
                if (!cb.cancelled) { //如果还是取消动画
                    addTransitionClass(el, toClass); //则添加过度动画 class
                    if (!userWantsControl) {  //检测钩子函数 fns 的长度
                        if (isValidDuration(explicitEnterDuration)) {   //如果是  number 类型
                            setTimeout(cb, explicitEnterDuration); //设置延迟过度事件
                        } else {

                            whenTransitionEnds(
                                el, //真实的dom
                                type, //动画类型
                                cb //_enterCb 回调函数
                            );
                        }
                    }
                }
            });
        }

        if (vnode.data.show) {
            toggleDisplay && toggleDisplay(); //执行回调切换显示或者隐藏函数
            enterHook && enterHook(el, cb);
        }

        if (!expectsCSS && !userWantsControl) {
            cb();
        }
    }
    //执行离开过度动画效果执行方式
    function leave(
                    vnode,  //虚拟dom
                    rm      //回调函数                  
                             ) {
        var el = vnode.elm;

        // call enter callback now
        if (isDef(el._enterCb)) { //标志是否执行过_enterCb
            el._enterCb.cancelled = true; //取消
            el._enterCb();
        }
        //解析vonde中的transition的name属性获取到一个css过度对象类
        var data = resolveTransition(vnode.data.transition);

        if (isUndef(data) || el.nodeType !== 1) {
            return rm()
        }

        /* istanbul ignore if */
        if (isDef(el._leaveCb)) {
            return
        }

        var css = data.css; //vonde 的css类
        var type = data.type; //vonde 的 类型 如 1,2,3,4.真实dom的类型
        var leaveClass = data.leaveClass; //离开动画的css 动画过度类
        var leaveToClass = data.leaveToClass; //离开动画的css 动画过度类
        var leaveActiveClass = data.leaveActiveClass;//激活离开动画的css 动画过度类

        var beforeLeave = data.beforeLeave; //离开动画的钩子函数
        var leave = data.leave; //离开动画的钩子函数
        var afterLeave = data.afterLeave;//离开动画的钩子函数
        var leaveCancelled = data.leaveCancelled;//离开动画的钩子函数
        var delayLeave = data.delayLeave; //延迟动画钩子函数
        var duration = data.duration; //动画时长

        var expectsCSS = css !== false && !isIE9;

        // 检测钩子函数 fns 的长度
        // 数据必须是这样才返回真，也可以是n层fns只要规律是一样嵌套下去就行
        var userWantsControl = getHookArgumentsLength(leave);

        var explicitLeaveDuration = toNumber(
            isObject(duration)
                ? duration.leave
                : duration
        );

        if ("development" !== 'production' && isDef(explicitLeaveDuration)) {
            checkDuration(explicitLeaveDuration, 'leave', vnode);
        }

        var cb = el._leaveCb = once(function () {
            if (el.parentNode && el.parentNode._pending) {
                el.parentNode._pending[vnode.key] = null;
            }
            if (expectsCSS) {
                removeTransitionClass(el, leaveToClass); //离开动画的css 动画过度类
                removeTransitionClass(el, leaveActiveClass);//激活离开动画的css 动画过度类
            }
            if (cb.cancelled) { //取消过度动画标志
                if (expectsCSS) {
                    removeTransitionClass(el, leaveClass);  //离开动画的css 动画过度类
                }
                leaveCancelled && leaveCancelled(el); //钩子函数
            } else {
                rm(); //执行回调函数
                afterLeave && afterLeave(el); //执行钩子函数
            }
            el._leaveCb = null;
        });

        if (delayLeave) {
            delayLeave(performLeave); //delayLeave 延迟动画钩子函数
        } else {
            performLeave();
        }

        function performLeave() {
            // the delayed leave may have already been cancelled
            if (cb.cancelled) { //取消过度动画标志
                return
            }
            // record leaving element
            if (!vnode.data.show) {
                (el.parentNode._pending || (el.parentNode._pending = {}))[(vnode.key)] = vnode;
            }
            beforeLeave && beforeLeave(el); //离开动画的钩子函数
            if (expectsCSS) {
                addTransitionClass(el, leaveClass);//  为真实dom添加 css 过度动画leaveClass类
                addTransitionClass(el, leaveActiveClass);//激活离开动画的css 动画过度类
                nextFrame(function () {
                    removeTransitionClass(el, leaveClass);//  为真实dom删除 css 过度动画leaveClass类
                    if (!cb.cancelled) { //取消过度动画标志
                        addTransitionClass(el, leaveToClass); //离开动画的css 动画过度类
                        if (!userWantsControl) {
                            if (isValidDuration(explicitLeaveDuration)) { //如果是数字
                                setTimeout(cb, explicitLeaveDuration); //执行回调函数 _leaveCb
                            } else {
                                // 获取动画的信息，执行动画。
                                whenTransitionEnds(
                                    el, //真实的dom
                                    type,  //动画类型
                                    cb//执行回调函数 _leaveCb
                                ); //
                            }
                        }
                    }
                });
            }
            leave && leave(el, cb);
            if (!expectsCSS && !userWantsControl) {
                cb();
            }
        }
    }

// only used in dev mode
    //检测 val必需是数字
    function checkDuration(val, name, vnode) {
        if (typeof val !== 'number') {
            warn(
                "<transition> explicit " + name + " duration is not a valid number - " +
                "got " + (JSON.stringify(val)) + ".",
                vnode.context
            );
        } else if (isNaN(val)) {
            warn(
                "<transition> explicit " + name + " duration is NaN - " +
                'the duration expression might be incorrect.',
                vnode.context
            );
        }
    }
    //如果是  number 类型
    function isValidDuration(val) {
        return typeof val === 'number' && !isNaN(val)
    }

    /**
     * Normalize a transition hook's argument length. The hook may be:
     * - a merged hook (invoker) with the original in .fns
     * - a wrapped component method (check ._length)
     * - a plain function (.length)
     *规范化转换钩子的参数长度。问题可能是:
     * -一个合并的钩子(调用程序)与原始的。fns
     * -封装的组件方法(检查._length)
     * -一个普通函数(.length)




      检测钩子函数 fns 的长度
     数据必须是这样才返回真，也可以是n层fns只要规律是一样嵌套下去就行
     var fn1=[1,2,3,4];
     var fn={
                fns:[

                        [1,2,3,45,34]

              ]
           }
     var fn2={
          fns:[
              {
                  fns:[
                      {
                          fns:[[1,2,3,45,9]]
                      }
                  ]
              }
          ]
      }

     */
    function getHookArgumentsLength(fn) {
        if (isUndef(fn)) {
            return false
        }
        var invokerFns = fn.fns;
        if (isDef(invokerFns)) {
            // invoker

            return getHookArgumentsLength(
                                            Array.isArray(invokerFns) ?
                                                                        invokerFns[0] :
                                                                        invokerFns
                                           )
        } else {
            return (fn._length || fn.length) > 1
        }
    }

    function _enter(_, vnode) {
        if (vnode.data.show !== true) { //如果不是show的时候
            enter(vnode);
        }
    }
   //
    var transition = inBrowser ? //如果是浏览器环境
                                {
                                    create: _enter, //进入时
                                    activate: _enter, //激活
                                    remove: function remove$$1(vnode, rm) { //删除
                                        /* istanbul ignore else */
                                        if (vnode.data.show !== true) {
                                            leave(vnode, rm);
                                        } else {
                                            rm();
                                        }
                                    }
                                }:
                                {}

    var platformModules = [
        attrs,  // attrs包含两个方法create和update都是更新设置真实dom属性值 {create: updateAttrs, /*创建属性*/ update: updateAttrs  /*更新属性 */}
        klass, //klass包含类包含两个方法create和update都是更新calss。其实就是updateClass方法。 设置真实dom的class
        events, //更新真实dom的事件
        domProps, //更新真实dom的props 属性值
        style, // 更新真实dom的style属性。有两个方法create 和update 不过函数都是updateStyle更新真实dom的style属性值.将vonde虚拟dom的css 转义成并且渲染到真实dom的css中
        transition // 过度动画
    ]

    /*  */

// the directive module should be applied last, after all
// built-in modules have been applied.
    //毕竟，指令模块应该是最后应用的
//已应用内置模块。
    //baseModules 包括了 ref创建，更新 ， 销毁 函数 和 directives自定义指令 创建 ，更新，销毁函数

    var modules = platformModules.concat(baseModules);

    //创建补丁函数 创建虚拟dom
    /*
     var nodeOps = Object.freeze({
     createElement: createElement$1, //创建一个真实的dom
     createElementNS: createElementNS, //创建一个真实的dom svg方式
     createTextNode: createTextNode, // 创建文本节点
     createComment: createComment,  // 创建一个注释节点
     insertBefore: insertBefore,  //插入节点 在xxx  dom 前面插入一个节点
     removeChild: removeChild,   //删除子节点
     appendChild: appendChild,  //添加子节点 尾部
     parentNode: parentNode,  //获取父亲子节点dom
     nextSibling: nextSibling,     //获取下一个兄弟节点
     tagName: tagName,   //获取dom标签名称
     setTextContent: setTextContent, //  //设置dom 文本
     setStyleScope: setStyleScope  //设置组建样式的作用域
     });
     modules=[
        attrs,  // attrs包含两个方法create和update都是更新设置真实dom属性值 {create: updateAttrs,  update: updateAttrs   }
        klass, //klass包含类包含两个方法create和update都是更新calss。其实就是updateClass方法。 设置真实dom的class
        events, //更新真实dom的事件
        domProps, //更新真实dom的props 属性值
        style, // 更新真实dom的style属性。有两个方法create 和update 不过函数都是updateStyle更新真实dom的style属性值.将vonde虚拟dom的css 转义成并且渲染到真实dom的css中
        transition // 过度动画
        ref,  //ref创建，更新 ， 销毁 函数
        directives //自定义指令 创建 ，更新，销毁函数
        ]
     */
    //path 把vonde 渲染成真实的dom
    var patch = createPatchFunction(
        {
            nodeOps: nodeOps,
            modules: modules
        }
        );
    console.log('===patch==')
    console.log(patch)


    /**
     * Not type checking this file because flow doesn't like attaching
     * properties to Elements.
     */

    /* istanbul ignore if */
    if (isIE9) {
        // http://www.matts411.com/post/internet-explorer-9-oninput/
        document.addEventListener('selectionchange', function () {
            var el = document.activeElement;
            if (el && el.vmodel) {
                trigger(el, 'input');
            }
        });
    }

    var directive = {
        inserted: function inserted(el, binding, vnode, oldVnode) {

            if (vnode.tag === 'select') {
                // #6903
                if (oldVnode.elm && !oldVnode.elm._vOptions) {
                    mergeVNodeHook(vnode, 'postpatch', function () {
                        directive.componentUpdated(el, binding, vnode);
                    });
                } else {
                    setSelected(el, binding, vnode.context);
                }
                el._vOptions = [].map.call(el.options, getValue);
            } else if (vnode.tag === 'textarea' || isTextInputType(el.type)) {
                el._vModifiers = binding.modifiers;
                if (!binding.modifiers.lazy) {
                    el.addEventListener('compositionstart', onCompositionStart);
                    el.addEventListener('compositionend', onCompositionEnd);
                    // Safari < 10.2 & UIWebView doesn't fire compositionend when
                    // switching focus before confirming composition choice
                    // this also fixes the issue where some browsers e.g. iOS Chrome
                    // fires "change" instead of "input" on autocomplete.
                    el.addEventListener('change', onCompositionEnd);
                    /* istanbul ignore if */
                    if (isIE9) {
                        el.vmodel = true;
                    }
                }
            }
        },

        componentUpdated: function componentUpdated(el, binding, vnode) {
            if (vnode.tag === 'select') {
                setSelected(el, binding, vnode.context);
                // in case the options rendered by v-for have changed,
                // it's possible that the value is out-of-sync with the rendered options.
                // detect such cases and filter out values that no longer has a matching
                // option in the DOM.
                var prevOptions = el._vOptions;
                var curOptions = el._vOptions = [].map.call(el.options, getValue);
                if (curOptions.some(function (o, i) {
                        return !looseEqual(o, prevOptions[i]);
                    })) {
                    // trigger change event if
                    // no matching option found for at least one value
                    var needReset = el.multiple
                        ? binding.value.some(function (v) {
                        return hasNoMatchingOption(v, curOptions);
                    })
                        : binding.value !== binding.oldValue && hasNoMatchingOption(binding.value, curOptions);
                    if (needReset) {
                        trigger(el, 'change');
                    }
                }
            }
        }
    };

    function setSelected(el, binding, vm) {
        actuallySetSelected(el, binding, vm);
        /* istanbul ignore if */
        if (isIE || isEdge) {
            setTimeout(function () {
                actuallySetSelected(el, binding, vm);
            }, 0);
        }
    }

    function actuallySetSelected(el, binding, vm) {
        var value = binding.value;
        var isMultiple = el.multiple;
        if (isMultiple && !Array.isArray(value)) {
            "development" !== 'production' && warn(
                "<select multiple v-model=\"" + (binding.expression) + "\"> " +
                "expects an Array value for its binding, but got " + (Object.prototype.toString.call(value).slice(8, -1)),
                vm
            );
            return
        }
        var selected, option;
        for (var i = 0, l = el.options.length; i < l; i++) {
            option = el.options[i];
            if (isMultiple) {
                selected = looseIndexOf(value, getValue(option)) > -1;
                if (option.selected !== selected) {
                    option.selected = selected;
                }
            } else {
                if (looseEqual(getValue(option), value)) {
                    if (el.selectedIndex !== i) {
                        el.selectedIndex = i;
                    }
                    return
                }
            }
        }
        if (!isMultiple) {
            el.selectedIndex = -1;
        }
    }

    function hasNoMatchingOption(value, options) {
        return options.every(function (o) {
            return !looseEqual(o, value);
        })
    }

    function getValue(option) {
        return '_value' in option
            ? option._value
            : option.value
    }

    function onCompositionStart(e) {
        e.target.composing = true;
    }

    function onCompositionEnd(e) {
        // prevent triggering an input event for no reason
        if (!e.target.composing) {
            return
        }
        e.target.composing = false;
        trigger(e.target, 'input');
    }

    function trigger(el, type) {
        var e = document.createEvent('HTMLEvents');
        e.initEvent(type, true, true);
        el.dispatchEvent(e);
    }

    /*  */

// recursively search for possible transition defined inside the component root
    function locateNode(vnode) {
        return vnode.componentInstance && (!vnode.data || !vnode.data.transition)
            ? locateNode(vnode.componentInstance._vnode)
            : vnode
    }

    var show = {
        bind: function bind(el, ref, vnode) {
            var value = ref.value;

            vnode = locateNode(vnode);
            var transition$$1 = vnode.data && vnode.data.transition;
            var originalDisplay = el.__vOriginalDisplay =
                el.style.display === 'none' ? '' : el.style.display;
            if (value && transition$$1) {
                vnode.data.show = true;
                enter(vnode, function () {
                    el.style.display = originalDisplay;
                });
            } else {
                el.style.display = value ? originalDisplay : 'none';
            }
        },

        update: function update(el, ref, vnode) {
            var value = ref.value;
            var oldValue = ref.oldValue;

            /* istanbul ignore if */
            if (!value === !oldValue) {
                return
            }
            vnode = locateNode(vnode);
            var transition$$1 = vnode.data && vnode.data.transition;
            if (transition$$1) {
                vnode.data.show = true;
                if (value) {
                    enter(vnode, function () {
                        el.style.display = el.__vOriginalDisplay;
                    });
                } else {
                    leave(vnode, function () {
                        el.style.display = 'none';
                    });
                }
            } else {
                el.style.display = value ? el.__vOriginalDisplay : 'none';
            }
        },

        unbind: function unbind(el,
                                binding,
                                vnode,
                                oldVnode,
                                isDestroy) {
            if (!isDestroy) {
                el.style.display = el.__vOriginalDisplay;
            }
        }
    }

    var platformDirectives = {
        model: directive,
        show: show
    }

    /*  */

// Provides transition support for a single element/component.
// supports transition mode (out-in / in-out)

    var transitionProps = {
        name: String, //
        appear: Boolean,
        css: Boolean,
        mode: String,
        type: String,
        enterClass: String,
        leaveClass: String, //离开动画的css 动画过度类
        enterToClass: String, //   动画退出中的 css 中的过度类
        leaveToClass: String, //离开动画的css 动画过度类
        enterActiveClass: String, //激活过度动画 的css  类
        leaveActiveClass: String, //激活离开动画的css 动画过度类
        appearClass: String, //  自定义动画props属性 过度
        appearActiveClass: String, //自定义动画props属性 激活 css 类名
        appearToClass: String,  //自定义动画props属性 离开的过度 css 类名
        duration: [Number, String, Object] //持续的时间
    };

// in case the child is also an abstract component, e.g. <keep-alive>
// we want to recursively retrieve the real component to be rendered
    function getRealChild(vnode) {
        var compOptions = vnode && vnode.componentOptions;
        if (compOptions && compOptions.Ctor.options.abstract) {
            return getRealChild(getFirstComponentChild(compOptions.children))
        } else {
            return vnode
        }
    }

    function extractTransitionData(comp) {
        var data = {};
        var options = comp.$options;
        // props
        for (var key in options.propsData) {
            data[key] = comp[key];
        }
        // events.
        // extract listeners and pass them directly to the transition methods
        var listeners = options._parentListeners;
        for (var key$1 in listeners) {
            data[camelize(key$1)] = listeners[key$1];
        }
        return data
    }

    function placeholder(h, rawChild) {
        if (/\d-keep-alive$/.test(rawChild.tag)) {
            return h('keep-alive', {
                props: rawChild.componentOptions.propsData
            })
        }
    }

    function hasParentTransition(vnode) {
        while ((vnode = vnode.parent)) {
            if (vnode.data.transition) {
                return true
            }
        }
    }

    function isSameChild(child, oldChild) {
        return oldChild.key === child.key && oldChild.tag === child.tag
    }

    var Transition = { //动画组件
        name: 'transition',
        props: transitionProps, //动画属性
        abstract: true,

        render: function render(h) { //动画组件的vonde
            var this$1 = this;

            var children = this.$slots.default;
            if (!children) {
                return
            }

            // filter out text nodes (possible whitespaces)
            children = children.filter(function (c) {
                return c.tag || isAsyncPlaceholder(c);
            });
            /* istanbul ignore if */
            if (!children.length) {
                return
            }

            // warn multiple elements
            if ("development" !== 'production' && children.length > 1) {
                warn(
                    '<transition> can only be used on a single element. Use ' +
                    '<transition-group> for lists.',
                    this.$parent
                );
            }

            var mode = this.mode;

            // warn invalid mode
            if ("development" !== 'production' &&
                mode && mode !== 'in-out' && mode !== 'out-in'
            ) {
                warn(
                    'invalid <transition> mode: ' + mode,
                    this.$parent
                );
            }

            var rawChild = children[0];

            // if this is a component root node and the component's
            // parent container node also has transition, skip.
            if (hasParentTransition(this.$vnode)) {
                return rawChild
            }

            // apply transition data to child
            // use getRealChild() to ignore abstract components e.g. keep-alive
            var child = getRealChild(rawChild);
            /* istanbul ignore if */
            if (!child) {
                return rawChild
            }

            if (this._leaving) {
                return placeholder(h, rawChild)
            }

            // ensure a key that is unique to the vnode type and to this transition
            // component instance. This key will be used to remove pending leaving nodes
            // during entering.
            var id = "__transition-" + (this._uid) + "-";
            child.key = child.key == null
                ? child.isComment
                ? id + 'comment'
                : id + child.tag
                : isPrimitive(child.key)
                ? (String(child.key).indexOf(id) === 0 ? child.key : id + child.key)
                : child.key;

            var data = (child.data || (child.data = {})).transition = extractTransitionData(this);
            var oldRawChild = this._vnode;
            var oldChild = getRealChild(oldRawChild);

            // mark v-show
            // so that the transition module can hand over the control to the directive
            if (child.data.directives && child.data.directives.some(function (d) {
                    return d.name === 'show';
                })) {
                child.data.show = true;
            }

            if (
                oldChild &&
                oldChild.data && !isSameChild(child, oldChild) && !isAsyncPlaceholder(oldChild) &&
                // #6687 component root is a comment node
                !(oldChild.componentInstance && oldChild.componentInstance._vnode.isComment)
            ) {
                // replace old child transition data with fresh one
                // important for dynamic transitions!
                var oldData = oldChild.data.transition = extend({}, data);
                // handle transition mode
                if (mode === 'out-in') {
                    // return placeholder node and queue update when leave finishes
                    this._leaving = true;
                    mergeVNodeHook(oldData, 'afterLeave', function () {
                        this$1._leaving = false;
                        this$1.$forceUpdate();
                    });
                    return placeholder(h, rawChild)
                } else if (mode === 'in-out') {
                    if (isAsyncPlaceholder(child)) {
                        return oldRawChild
                    }
                    var delayedLeave;
                    var performLeave = function () {
                        delayedLeave();
                    };
                    mergeVNodeHook(data, 'afterEnter', performLeave);
                    mergeVNodeHook(data, 'enterCancelled', performLeave);
                    mergeVNodeHook(oldData, 'delayLeave', function (leave) {
                        delayedLeave = leave;
                    });
                }
            }

            return rawChild
        }
    }

    /*  */

// Provides transition support for list items.
// supports move transitions using the FLIP technique.

// Because the vdom's children update algorithm is "unstable" - i.e.
// it doesn't guarantee the relative positioning of removed elements,
// we force transition-group to update its children into two passes:
// in the first pass, we remove all nodes that need to be removed,
// triggering their leaving transition; in the second pass, we insert/move
// into the final desired state. This way in the second pass removed
// nodes will remain where they should be.

    var props = extend({
        tag: String,
        moveClass: String
    }, transitionProps);

    delete props.mode;

    var TransitionGroup = {
        props: props,

        render: function render(h) {
            var tag = this.tag || this.$vnode.data.tag || 'span';
            var map = Object.create(null);
            var prevChildren = this.prevChildren = this.children;
            var rawChildren = this.$slots.default || [];
            var children = this.children = [];
            var transitionData = extractTransitionData(this);

            for (var i = 0; i < rawChildren.length; i++) {
                var c = rawChildren[i];
                if (c.tag) {
                    if (c.key != null && String(c.key).indexOf('__vlist') !== 0) {
                        children.push(c);
                        map[c.key] = c
                        ;
                        (c.data || (c.data = {})).transition = transitionData;
                    } else {
                        var opts = c.componentOptions;
                        var name = opts ? (opts.Ctor.options.name || opts.tag || '') : c.tag;
                        warn(("<transition-group> children must be keyed: <" + name + ">"));
                    }
                }
            }

            if (prevChildren) {
                var kept = [];
                var removed = [];
                for (var i$1 = 0; i$1 < prevChildren.length; i$1++) {
                    var c$1 = prevChildren[i$1];
                    c$1.data.transition = transitionData;
                    c$1.data.pos = c$1.elm.getBoundingClientRect();
                    if (map[c$1.key]) {
                        kept.push(c$1);
                    } else {
                        removed.push(c$1);
                    }
                }
                this.kept = h(tag, null, kept);
                this.removed = removed;
            }

            return h(tag, null, children)
        },

        beforeUpdate: function beforeUpdate() {
            // force removing pass
            this.__patch__(
                this._vnode,
                this.kept,
                false, // hydrating
                true // removeOnly (!important, avoids unnecessary moves)
            );
            this._vnode = this.kept;
        },

        updated: function updated() {
            var children = this.prevChildren;
            var moveClass = this.moveClass || ((this.name || 'v') + '-move');
            if (!children.length || !this.hasMove(children[0].elm, moveClass)) {
                return
            }

            // we divide the work into three loops to avoid mixing DOM reads and writes
            // in each iteration - which helps prevent layout thrashing.
            children.forEach(callPendingCbs);
            children.forEach(recordPosition);
            children.forEach(applyTranslation);

            // force reflow to put everything in position
            // assign to this to avoid being removed in tree-shaking
            // $flow-disable-line
            this._reflow = document.body.offsetHeight;

            children.forEach(function (c) {
                if (c.data.moved) {
                    var el = c.elm;
                    var s = el.style;
                    addTransitionClass(el, moveClass);
                    s.transform = s.WebkitTransform = s.transitionDuration = '';
                    el.addEventListener(transitionEndEvent, el._moveCb = function cb(e) {
                        if (!e || /transform$/.test(e.propertyName)) {
                            el.removeEventListener(transitionEndEvent, cb);
                            el._moveCb = null;
                            removeTransitionClass(el, moveClass);
                        }
                    });
                }
            });
        },

        methods: {
            hasMove: function hasMove(el, moveClass) {
                /* istanbul ignore if */
                if (!hasTransition) {
                    return false
                }
                /* istanbul ignore if */
                if (this._hasMove) {
                    return this._hasMove
                }
                // Detect whether an element with the move class applied has
                // CSS transitions. Since the element may be inside an entering
                // transition at this very moment, we make a clone of it and remove
                // all other transition classes applied to ensure only the move class
                // is applied.
                var clone = el.cloneNode();
                if (el._transitionClasses) {
                    el._transitionClasses.forEach(function (cls) {
                        removeClass(clone, cls);
                    });
                }
                addClass(clone, moveClass);
                clone.style.display = 'none';
                this.$el.appendChild(clone);
                var info = getTransitionInfo(clone);
                this.$el.removeChild(clone);
                return (this._hasMove = info.hasTransform)
            }
        }
    }

    function callPendingCbs(c) {
        /* istanbul ignore if */
        if (c.elm._moveCb) {
            c.elm._moveCb();
        }
        /* istanbul ignore if */
        if (c.elm._enterCb) {
            c.elm._enterCb();
        }
    }

    function recordPosition(c) {
        c.data.newPos = c.elm.getBoundingClientRect();
    }

    function applyTranslation(c) {
        var oldPos = c.data.pos;
        var newPos = c.data.newPos;
        var dx = oldPos.left - newPos.left;
        var dy = oldPos.top - newPos.top;
        if (dx || dy) {
            c.data.moved = true;
            var s = c.elm.style;
            s.transform = s.WebkitTransform = "translate(" + dx + "px," + dy + "px)";
            s.transitionDuration = '0s';
        }
    }

    var platformComponents = {
        Transition: Transition,
        TransitionGroup: TransitionGroup
    }

    /*  */

// install platform specific utils
    /*校验属性
     * 1. attr === 'value', tag 必须是 'input,textarea,option,select,progress' 其中一个 type !== 'button'
     * 2. attr === 'selected' && tag === 'option'
     * 3. attr === 'checked' && tag === 'input'
     * 4. attr === 'muted' && tag === 'video'
     * 的情况下为真
     * */
    Vue.config.mustUseProp = mustUseProp;    //校验属性


    Vue.config.isReservedTag = isReservedTag;
    Vue.config.isReservedAttr = isReservedAttr;
    Vue.config.getTagNamespace = getTagNamespace;
    Vue.config.isUnknownElement = isUnknownElement;

// install platform runtime directives & components
    extend(Vue.options.directives, platformDirectives);
    extend(Vue.options.components, platformComponents);

// install platform patch function 安装平台补丁功能
    Vue.prototype.__patch__ = inBrowser ? patch : noop;

// public mount method 安装方法 实例方法挂载 vm
    // 手动地挂载一个未挂载的实例。

    Vue.prototype.$mount = function (el,  //真实dom 或者是string
                                     hydrating  //新的虚拟dom vonde
    ) {
         debugger
        el = el && inBrowser ? query(el) : undefined;
        return mountComponent(
                                this,
                                el,
                                hydrating
                             )
    };

// devtools global hook
    /* istanbul ignore next */
    if (inBrowser) {
        setTimeout(function () {
            if (config.devtools) {
                if (devtools) {
                    devtools.emit('init', Vue);
                } else if (
                    "development" !== 'production' &&
                    "development" !== 'test' &&
                    isChrome
                ) {
                    console[console.info ? 'info' : 'log'](
                        'Download the Vue Devtools extension for a better development experience:\n' +
                        'https://github.com/vuejs/vue-devtools'
                    );
                }
            }
            //如果不是生产环境
            if ("development" !== 'production' &&
                "development" !== 'test' &&
                config.productionTip !== false &&
                typeof console !== 'undefined'
            ) {
                console[console.info ? 'info' : 'log'](
                    "You are running Vue in development mode.\n" +
                    "Make sure to turn on production mode when deploying for production.\n" +
                    "See more tips at https://vuejs.org/guide/deployment.html"
                );
            }
        }, 0);
    }

    /*  */
    //
    var defaultTagRE = /\{\{((?:.|\n)+?)\}\}/g; //匹配viwe 视图中的{{指令}}
    var regexEscapeRE = /[-.*+?^${}()|[\]\/\\]/g; //匹配特殊符号  - 或者. 或者* 或者+ 或者? 或者^ 或者$ 或者{ 或者} 或者( 或者) 或者| 或者[ 或者] 或者/ 或者\


    var buildRegex = cached(function (delimiters) {
        var open = delimiters[0].replace(regexEscapeRE, '\\$&'); //$&	与 regexp 相匹配的子串。 这里的意思是遇到了特殊符号的时候在正则里面需要替换加多一个/斜杠
        var close = delimiters[1].replace(regexEscapeRE, '\\$&');
        return new RegExp(open + '((?:.|\\n)+?)' + close, 'g') // 匹配开始的open +任意字符或者换行符+ close 全局匹配
    });


    //匹配view 指令，并且把他转换成 虚拟dom vonde 需要渲染的函数,比如指令{{name}}转换成 _s(name)
    //比如字符串  我叫{{name}},今年{{age}},数据{{data.number}}个手机  转换成 我叫+_s(name)+,今年+_s(age)+,数据+_s(data.number)+个手机
    function parseText(text, //字符串
                       delimiters //被修改默认的标签匹配
    ) {
        var tagRE = delimiters ? buildRegex(delimiters) : defaultTagRE; // 如果delimiters不存在则 用默认指令 {{}}，如果修改成其他指令则用其他指令
        if (!tagRE.test(text)) { //判断字符串是否含有指令
            return
        }
        var tokens = [];
        var rawTokens = [];
        var lastIndex = tagRE.lastIndex = 0;
        var match, index, tokenValue;
        while ((match = tagRE.exec(text))) { //循环能匹配上的指令，全局匹配代码：的时候会有个lastIndex  执行exec方法后，lastIndex就会记录匹配的字符串在原始字符串中最后一位的索引加一，
            console.log('match=')
            console.log(match)
            console.log('match.index=' + match.index)
            console.log('lastIndex=' + lastIndex)
            index = match.index; //当前匹配上的字符串位置，也可以是上一次匹配出来的位置
            // push text token
            if (index > lastIndex) { //
                rawTokens.push(tokenValue = text.slice(lastIndex, index)); //截取匹配到字符串指令前面的字符串，并添加到rawTokens
                tokens.push(JSON.stringify(tokenValue)); //添加匹配到字符串指令前面的字符串
            }
            // tag token
            //处理value 解析成正确的value，把过滤器 转换成vue 虚拟dom的解析方法函数 比如把过滤器 ' ab | c | d' 转换成 _f("d")(_f("c")(ab))
            var exp = parseFilters(match[1].trim()); //
            tokens.push(("_s(" + exp + ")")); //把指令转义成函数，便于vonde 虚拟dom 渲染 比如指令{{name}} 转换成 _s(name)
            rawTokens.push({'@binding': exp}); //绑定指令{{name}} 指令转换成  [{@binding: "name"}]
            lastIndex = index + match[0].length; // 上一次匹配出来的字符串的位置+上一次字符串的长度  比如字符串   我叫{{name}},今年{{age}},数据{{data.number}}个手机  这时候lastIndex 等于10

        }
        console.log(lastIndex)
        console.log(text.length)
        if (lastIndex < text.length) { //拼接最后一个字符， 数据{{data.number}}个手机    把个手机 的字符串连接起来
            rawTokens.push(tokenValue = text.slice(lastIndex)); //截取字符串。到最后一位
            tokens.push(JSON.stringify(tokenValue)); //拼接最后一位字符串
        }
        return {
            expression: tokens.join('+'), //把数组变成字符串，用加号链接 比如数组为 ['我叫','_s(name)',',今年','_s(age)',',数据','_s(data.number)','个手机']  变成   我叫+_s(name)+,今年+_s(age)+,数据+_s(data.number)+个手机
            tokens: rawTokens
        }
    }

    console.log(parseText('我叫{{name}},今年{{age}},数据{{data.number}}个手机'))
//    console.log(parseText('{{name}}这个'))

    /*
     * 获取 class 属性和:class或者v-bind的动态属性值，并且转化成字符串 添加到staticClass和classBinding 属性中
     * */
    function transformNode(
                           el, //虚拟dom vonde
                           options //用户 new Vue 的参数
    ) {
        var warn = options.warn || baseWarn; //警告日志
        var staticClass = getAndRemoveAttr(el, 'class'); //获取class

        if ("development" !== 'production' && staticClass) {
            //匹配view 指令，并且把他转换成 虚拟dom vonde 需要渲染的函数,比如指令{{name}}转换成 _s(name)
            var res = parseText(
                staticClass, //class 属性值
                options.delimiters //指令 {{ }} 或者自定义指令['${',  '}']
            );
            //如果在静态的class中有动态 指令的话 则发出警告
            //当用户设置  class="{ active: isActive }"    data={ active:true}, 应该用户是不是忘记加 : 点了
            if (res) {
                warn(
                    "class=\"" + staticClass + "\": " +
                    'Interpolation inside attributes has been removed. ' +
                    'Use v-bind or the colon shorthand instead. For example, ' +
                    'instead of <div class="{{ val }}">, use <div :class="val">.'
                );
            }
        }
        if (staticClass) {
            //获取原始class属性的值  转化成字符串
            el.staticClass = JSON.stringify(staticClass);
        }
        //获取 :class或者v-bind的动态属性值
        var classBinding = getBindingAttr(el, 'class', false /* getStatic */);
        if (classBinding) {
            el.classBinding = classBinding;
        }
    }

    //创数据，转换class
    function genData(el) {
        var data = '';
        if (el.staticClass) {
            //el.staticClass 比如我们设置样式是这样  class="classA classB" 此时将数据变成   staticClass:classA classB,
            data += "staticClass:" + (el.staticClass) + ",";
        }
        if (el.classBinding) {
            //el.staticClass 比如我们设置样式是这样  class="classC classD" 此时将数据变成   class:classC classD,
            data += "class:" + (el.classBinding) + ",";
        }
        return data
    }

    var klass$1 = {
        staticKeys: ['staticClass'],
        transformNode: transformNode,
        genData: genData
    }

    /*
     transformNode$1获取 style属性和:style或者v-bind的动态属性值，并且转化成字符串 添加到staticStyle和styleBinding属性中
     * */
    function transformNode$1(el, options) {
        var warn = options.warn || baseWarn;
        var staticStyle = getAndRemoveAttr(el, 'style');
        if (staticStyle) {
            /* istanbul ignore if */
            {
                //匹配view 指令，并且把他转换成 虚拟dom vonde 需要渲染的函数,比如指令{{name}}转换成 _s(name)
                var res = parseText(staticStyle, options.delimiters);
                //如果在静态的class中有动态 指令的话 则发出警告
                //当用户设置  style="{ width: num }"    data={ num:'100px'}, 应该用户是不是忘记加 : 点了
                if (res) {
                    warn(
                        "style=\"" + staticStyle + "\": " +
                        'Interpolation inside attributes has been removed. ' +
                        'Use v-bind or the colon shorthand instead. For example, ' +
                        'instead of <div style="{{ val }}">, use <div :style="val">.'
                    );
                }
            }
            //把style 字符串 转换成对象 比如'width:100px;height:200px;' 转化成 {width:100px,height:200px}
            // 然后在转换成字符串
            el.staticStyle = JSON.stringify(parseStyleText(staticStyle));
        }

        var styleBinding = getBindingAttr(el, 'style', false /* getStatic */);
        if (styleBinding) {
            el.styleBinding = styleBinding;
        }
    }

    //style 数据转换
    function genData$1(el) {
        var data = '';
        if (el.staticStyle) {
            //比如staticStyle的值是  {width:100px,height:200px} 转换成 staticStyle:{width:100px,height:200px},
            data += "staticStyle:" + (el.staticStyle) + ",";
        }
        if (el.styleBinding) {
            //比如style的值是  {width:100px,height:200px} 转换成 style:(width:100px,height:200px),
            data += "style:(" + (el.styleBinding) + "),";
        }
        return data
    }

    var style$1 = {
        staticKeys: ['staticStyle'],
        transformNode: transformNode$1,
        genData: genData$1
    }

    /*  */

    var decoder;
   //获取html文本内容
    var he = {
        decode: function decode(html) {
            decoder = decoder || document.createElement('div');
            decoder.innerHTML = html;
            return decoder.textContent
        }
    }

    /*  */

    var isUnaryTag = makeMap(
        'area,base,br,col,embed,frame,hr,img,input,isindex,keygen,' +
        'link,meta,param,source,track,wbr'
    );

// Elements that you can, intentionally, leave open
// (and which close themselves)
    var canBeLeftOpenTag = makeMap(
        'colgroup,dd,dt,li,options,p,td,tfoot,th,thead,tr,source'
    );

// HTML5 tags https://html.spec.whatwg.org/multipage/indices.html#elements-3
// Phrasing Content https://html.spec.whatwg.org/multipage/dom.html#phrasing-content
    /*          判断标签是否是
                'address,article,aside,base,blockquote,body,caption,col,colgroup,dd,' +
                'details,dialog,div,dl,dt,fieldset,figcaption,figure,footer,form,' +
                'h1,h2,h3,h4,h5,h6,head,header,hgroup,hr,html,legend,li,menuitem,meta,' +
                'optgroup,option,param,rp,rt,source,style,summary,tbody,td,tfoot,th,thead,' +
                'title,tr,track'
    */
    var isNonPhrasingTag = makeMap(
        'address,article,aside,base,blockquote,body,caption,col,colgroup,dd,' +
        'details,dialog,div,dl,dt,fieldset,figcaption,figure,footer,form,' +
        'h1,h2,h3,h4,h5,h6,head,header,hgroup,hr,html,legend,li,menuitem,meta,' +
        'optgroup,option,param,rp,rt,source,style,summary,tbody,td,tfoot,th,thead,' +
        'title,tr,track'
    );

    /**
     * Not type-checking this file because it's mostly vendor code.
     */

    /*!
     * HTML Parser By John Resig (ejohn.org)
     * Modified by Juriy "kangax" Zaytsev
     * Original code by Erik Arvidsson, Mozilla Public License
     * http://erik.eae.net/simplehtmlparser/simplehtmlparser.js
     */

// Regular Expressions for parsing tags and attributes 解析标记和属性的正则表达式
    var attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
// could use https://www.w3.org/TR/1999/REC-xml-names-19990114/#NT-QName
// but for Vue templates we can enforce a simple charset
    var ncname = '[a-zA-Z_][\\w\\-\\.]*';
    var qnameCapture = "((?:" + ncname + "\\:)?" + ncname + ")"; //  ((?:[a-zA-Z_][\\w\\-\\.]*\\:)?[a-zA-Z_][\\w\\-\\.]*)
    var startTagOpen = new RegExp(("^<" + qnameCapture))  // 匹配开头必需是< 后面可以忽略是任何字符串  ^<((?:[a-zA-Z_][\\w\\-\\.]*\\:)?[a-zA-Z_][\\w\\-\\.]*)
    var startTagClose = /^\s*(\/?)>/; //     匹配 > 标签 或者/> 闭合标签
    var endTag = new RegExp(("^<\\/" + qnameCapture + "[^>]*>"));  //匹配开头必需是</ 后面可以忽略是任何字符串  ^<\\/((?:[a-zA-Z_][\\w\\-\\.]*\\:)?[a-zA-Z_][\\w\\-\\.]*)[^>]*>
    var doctype = /^<!DOCTYPE [^>]+>/i; //匹配html的头文件 <!DOCTYPE html>
// #7298: escape - to avoid being pased as HTML comment when inlined in page
    var comment = /^<!\--/; // 匹配 开始字符串为<!--任何字符串
    var conditionalComment = /^<!\[/; //匹配开始为 <![ 字符串    匹配这样动态加ie浏览器的 字符串  <!--[if IE 8]><link href="ie8only.css" rel="stylesheet"><![endif]-->

    var IS_REGEX_CAPTURING_BROKEN = false;
    'x'.replace(/x(.)?/g, function (m, g) {
         IS_REGEX_CAPTURING_BROKEN = g === '';
    });

// Special Elements (can contain anything)  判断标签是是否是script,style,textarea
    var isPlainTextElement = makeMap('script,style,textarea', true);
    var reCache = {};
    //替换 把   &lt;替换 <  ， &gt; 替换 > ， &quot;替换  "， &amp;替换 & ， &#10;替换\n  ，&#9;替换\t
    var decodingMap = {
        '&lt;': '<',
        '&gt;': '>',
        '&quot;': '"',
        '&amp;': '&',
        '&#10;': '\n',
        '&#9;': '\t'
    };
    var encodedAttr = /&(?:lt|gt|quot|amp);/g;   //匹配 &lt或&gt或&quot或&amp
    var encodedAttrWithNewLines = /&(?:lt|gt|quot|amp|#10|#9);/g; //匹配 &lt或&gt或&quot或&amp或&#10或&#9

   //判断标签是否pre,textarea
    var isIgnoreNewlineTag = makeMap('pre,textarea', true);
    //匹配tag标签是pre,textarea，并且第二个参数的第一个字符是回车键
    var shouldIgnoreFirstNewline = function (tag, html) {
        return tag && isIgnoreNewlineTag(tag) && html[0] === '\n';
    };

   //替换html 中的特殊符号，转义成js解析的字符串,替换 把   &lt;替换 <  ， &gt; 替换 > ， &quot;替换  "， &amp;替换 & ， &#10;替换\n  ，&#9;替换\t
    function decodeAttr(
        value, //标签中属性的值
        shouldDecodeNewlines  //状态布尔值 标志。判断是否是a标签和是ie浏览器还是谷歌浏览器
    ) {
        console.log(value)
        console.log(shouldDecodeNewlines)

        var re = shouldDecodeNewlines ? encodedAttrWithNewLines :  //匹配 &lt或&gt或&quot或&amp或&#10或&#9
                                        encodedAttr;   //匹配 &lt或&gt或&quot或&amp
        //替换html 中的特殊符号，转义成js解析的字符串
        return value.replace(re, function (match) {
            // 替换 把   &lt;替换 <  ， &gt; 替换 > ， &quot;替换  "， &amp;替换 & ， &#10;替换\n  ，&#9;替换\t
            return decodingMap[match];
        })
    }

    function parseHTML(
        html, //字符串模板
        options //参数
    ) {
        var stack = []; // parseHTML 节点标签堆栈
        var expectHTML = options.expectHTML; //true
        var isUnaryTag$$1 = options.isUnaryTag || no; //函数匹配标签是否是 'area,base,br,col,embed,frame,hr,img,input,isindex,keygen, link,meta,param,source,track,wbr'
        var canBeLeftOpenTag$$1 = options.canBeLeftOpenTag || no; //函数 //判断标签是否是 'colgroup,dd,dt,li,options,p,td,tfoot,th,thead,tr,source'
        var index = 0;
        var last, //
            lastTag; //
        console.log(html)



        while (html) { //循环html
            last = html; //
            // Make sure we're not in a plaintext content element like script/style 确保我们不在像脚本/样式这样的纯文本内容元素中
            if (
                !lastTag || //lastTag 不存在
                !isPlainTextElement(lastTag)  // 如果标签不是script,style,textarea
                ) {

                                                var textEnd = html.indexOf('<'); //匹配开始标签或者结束标签的位置
                                                if (textEnd === 0) { //标识是开始标签
                                                                    // Comment:
                                                                    if (comment.test(html)) { //匹配 开始字符串为<!--任何字符串,注释标签  如果匹配上
                                                                                        var commentEnd = html.indexOf('-->'); //获取注释标签的结束位置

                                                                                        if (commentEnd >= 0) { //如果注释标签结束标签位置大于0，则有注释内容
                                                                                                            console.log(html.substring(4, commentEnd))
                                                                                                            if (options.shouldKeepComment) { //shouldKeepComment为真时候。获取注释标签内容

                                                                                                                //截取注释标签的内容
                                                                                                                options.comment(html.substring(4, commentEnd));
                                                                                                            }
                                                                                                            //截取字符串重新循环  while 跳出循环就是靠该函数，每次匹配到之后就截取掉字符串，知道最后一个标签被截取完没有匹配到则跳出循环
                                                                                                            advance(commentEnd + 3);
                                                                                                            continue
                                                                                        }
                                                                    }

                                                                    //这里思路是先匹配到注释节点，在匹配到这里的ie浏览器加载样式节点
                                                                    // http://en.wikipedia.org/wiki/Conditional_comment#Downlevel-revealed_conditional_comment
                                                                    if (conditionalComment.test(html)) {  //匹配开始为 <![ 字符串  <![endif]-->   匹配这样动态加ie浏览器的 字符串  <!--[if IE 8]><link href="ie8only.css" rel="stylesheet"><![endif]-->
                                                                         //匹配ie浏览器动态加样式结束符号
                                                                        var conditionalEnd = html.indexOf(']>');

                                                                                                    if (conditionalEnd >= 0) {
                                                                                                        //截取字符串重新循环  while 跳出循环就是靠该函数，每次匹配到之后就截取掉字符串，知道最后一个标签被截取完没有匹配到则跳出循环
                                                                                                        advance(conditionalEnd + 2);
                                                                                                          continue
                                                                                                    }
                                                                    }

                                                                    // Doctype:
                                                                  //匹配html的头文件 <!DOCTYPE html>
                                                                    var doctypeMatch = html.match(doctype);
                                                                    if (doctypeMatch) {
                                                                        //截取字符串重新循环  while 跳出循环就是靠该函数，每次匹配到之后就截取掉字符串，知道最后一个标签被截取完没有匹配到则跳出循环
                                                                           advance(doctypeMatch[0].length);
                                                                          continue
                                                                    }

                                                                    // End tag:
                                                                    //匹配开头必需是</ 后面可以忽略是任何字符串  ^<\\/((?:[a-zA-Z_][\\w\\-\\.]*\\:)?[a-zA-Z_][\\w\\-\\.]*)[^>]*>
                                                                    var endTagMatch = html.match(endTag);
                                                                    if (endTagMatch) {

                                                                                        var curIndex = index;
                                                                                        //标签分隔函数 while 跳出循环就是靠该函数，每次匹配到之后就截取掉字符串，知道最后一个标签被截取完没有匹配到则跳出循环
                                                                                        advance(endTagMatch[0].length);
                                                                        console.log(endTagMatch)
                                                                        console.log(curIndex,index)
                                                                        //查找parseHTML的stack栈中与当前tagName标签名称相等的标签，
                                                                        //调用options.end函数，删除当前节点的子节点中的最后一个如果是空格或者空的文本节点则删除，
                                                                        //为stack出栈一个当前标签，为currentParent变量获取到当前节点的父节点
                                                                                        parseEndTag(
                                                                                            endTagMatch[1],
                                                                                            curIndex,
                                                                                            index
                                                                                        );
                                                                                        continue
                                                                    }

                                                                    // Start tag:
                                                                     //解析开始标记 标记开始标签
                                                                  //  获取开始标签的名称，属性集合，开始位置和结束位置，并且返回该对象
                                                                    var startTagMatch = parseStartTag();

                                                                    if (startTagMatch) {
                                                                                        //把数组对象属性值循环变成对象，这样可以过滤相同的属性
                                                                                        //为parseHTML 节点标签堆栈 插入一个桟数据
                                                                                        //调用options.start  为parse函数 stack标签堆栈 添加一个标签
                                                                                        handleStartTag(startTagMatch);
                                                                                       //匹配tag标签是pre,textarea，并且第二个参数的第一个字符是回车键
                                                                                        if (shouldIgnoreFirstNewline(lastTag, html)) {
                                                                                                                              //去除回车键空格
                                                                                                                             advance(1);
                                                                                        }
                                                                                        continue
                                                                    }
                                                }

                                                var text = (void 0),
                                                    rest = (void 0),
                                                    next = (void 0);
                                                if (textEnd >= 0) {

                                                    rest = html.slice(textEnd); //截取字符串  var textEnd = html.indexOf('<'); //匹配开始标签或者结束标签的位置
                                                  console.log(rest)

                                                    while (
                                                                !endTag.test(rest) && //匹配开头必需是</ 后面可以忽略是任何字符串
                                                                !startTagOpen.test(rest) && // 匹配开头必需是< 后面可以忽略是任何字符串
                                                                !comment.test(rest) && // 匹配 开始字符串为<!--任何字符串
                                                                !conditionalComment.test(rest) //匹配开始为 <![ 字符串
                                                           ) {
                                                        console.log(rest);


                                                                    // < in plain text, be forgiving and treat it as text
                                                                // <在纯文本中，要宽容，把它当作文本来对待
                                                                    next = rest.indexOf('<', 1); //匹配是否有多个<
                                                                    if (next < 0) {
                                                                        break
                                                                    }
                                                                    textEnd += next; //截取 索引位置
                                                                    rest = html.slice(textEnd); //获取 < 字符串 <    获取他们两符号< 之间的字符串
                                                             }
                                                            text = html.substring(0, textEnd); //截取字符串 前面字符串到 <

                                                    //while 跳出循环就是靠该函数，每次匹配到之后就截取掉字符串，知道最后一个标签被截取完没有匹配到则跳出循环
                                                       advance(textEnd);
                                                }

                                                if (textEnd < 0) { //都没有匹配到 < 符号 则表示纯文本
                                                    text = html; //出来text
                                                    html = ''; //把html至空 跳槽 while循环
                                                }

                                                if (options.chars && text) {
                                                    options.chars(text);
                                                }
            } else {
                //  处理是script,style,textarea
                        var endTagLength = 0;
                        var stackedTag = lastTag.toLowerCase();
                        var reStackedTag = reCache[stackedTag] || (reCache[stackedTag] = new RegExp('([\\s\\S]*?)(</' + stackedTag + '[^>]*>)', 'i'));
                        var rest$1 = html.replace(reStackedTag, function (all, text, endTag) {
                                                                                            endTagLength = endTag.length;
                                                                                            if (!isPlainTextElement(stackedTag) && stackedTag !== 'noscript') {
                                                                                                                                    text = text
                                                                                                                                                .replace(/<!\--([\s\S]*?)-->/g, '$1') // #7298
                                                                                                                                                .replace(/<!\[CDATA\[([\s\S]*?)]]>/g, '$1');
                                                                                            }
                                                                                             //匹配tag标签是pre,textarea，并且第二个参数的第一个字符是回车键
                                                                                            if (shouldIgnoreFirstNewline(stackedTag, text)) {
                                                                                                                                    text = text.slice(1);
                                                                                            }
                                                                                            if (options.chars) {
                                                                                                                                      options.chars(text);
                                                                                            }
                                                                                            return ''
                        });
                        index += html.length - rest$1.length;
                        html = rest$1;
                        parseEndTag(stackedTag, index - endTagLength, index);
            }

            if (html === last) {
                                    options.chars && options.chars(html);
                                    if ("development" !== 'production' && !stack.length && options.warn) {
                                                             options.warn(("Mal-formatted tag at end of template: \"" + html + "\""));
                                    }
                                    break
            }
        }






        // Clean up any remaining tags
        //查找parseHTML的stack栈中与当前tagName标签名称相等的标签，
        //调用options.end函数，删除当前节点的子节点中的最后一个如果是空格或者空的文本节点则删除，
        //为stack出栈一个当前标签，为currentParent变量获取到当前节点的父节点
        parseEndTag();
         //while 跳出循环就是靠该函数，每次匹配到之后就截取掉字符串，知道最后一个标签被截取完没有匹配到则跳出循环
        function advance(n) {
            index += n; //让索引叠加
            html = html.substring(n); //截取当前索引 和 后面的字符串。
        }

        //获取开始标签的名称，收集属性集合，开始位置和结束位置，并且返回该对象
        function parseStartTag() {
            var start = html.match(startTagOpen); //匹配开始标签 匹配开头必需是< 后面可以忽略是任何字符串  ^<((?:[a-zA-Z_][\\w\\-\\.]*\\:)?[a-zA-Z_][\\w\\-\\.]*)
            console.log(start)
            console.log(start[0].length)

            if (start) {
                var match = {
                    tagName: start[1], //标签名称
                    attrs: [], //标签属性集合
                    start: index //标签的开始索引
                };
                //标记开始标签的位置，截取了开始标签
                advance(start[0].length);
                var end, attr;

                while (
                        !(end = html.match(startTagClose)) //没有到 关闭标签 > 标签
                        && (attr = html.match(attribute)) //收集属性
                       ) {
                    console.log(html)
                     //截取属性标签
                    advance(attr[0].length);
                    match.attrs.push(attr); //把属性收集到一个集合
                }
                if (end) {
                    match.unarySlash = end[1]; //如果是/>标签 则unarySlash 是/。 如果是>标签 则unarySlash 是空
                    console.log(end)

                    //截取掉开始标签，并且更新索引
                    advance(end[0].length);
                    match.end = index; //开始标签的结束位置
                    return match
                }
            }
        }

         //把数组对象属性值循环变成对象，这样可以过滤相同的属性
         //为parseHTML 节点标签堆栈 插入一个桟数据
        //调用options.start  为parse函数 stack标签堆栈 添加一个标签
        function handleStartTag(match) {
            /*
            * match = {
                     tagName: start[1], //标签名称
                     attrs: [], //标签属性集合
                     start: index， //开始标签的开始索引
                     match:index ，   //开始标签的 结束位置
                    unarySlash:'' //如果是/>标签 则unarySlash 是/。 如果是>标签 则unarySlash 是空
             };
            * */

            var tagName = match.tagName; //开始标签名称
            var unarySlash = match.unarySlash; //如果是/>标签 则unarySlash 是/。 如果是>标签 则unarySlash 是空
           console.log(expectHTML)
            console.log('lastTag==')
            console.log(lastTag)
            console.log(tagName)

            if (expectHTML) {   //true

                if (
                    lastTag === 'p' //上一个标签是p
                    /*
                      判断标签是否是
                     'address,article,aside,base,blockquote,body,caption,col,colgroup,dd,' +
                     'details,dialog,div,dl,dt,fieldset,figcaption,figure,footer,form,' +
                     'h1,h2,h3,h4,h5,h6,head,header,hgroup,hr,html,legend,li,menuitem,meta,' +
                     'optgroup,option,param,rp,rt,source,style,summary,tbody,td,tfoot,th,thead,' +
                     'title,tr,track'
                     */
                    && isNonPhrasingTag(tagName)
                ) {
                    //查找parseHTML的stack栈中与当前tagName标签名称相等的标签，
                    //调用options.end函数，删除当前节点的子节点中的最后一个如果是空格或者空的文本节点则删除，
                    //为stack出栈一个当前标签，为currentParent变量获取到当前节点的父节点
                    parseEndTag(lastTag);
                }
                if (
                    canBeLeftOpenTag$$1(tagName) &&   //判断标签是否是 'colgroup,dd,dt,li,options,p,td,tfoot,th,thead,tr,source'
                    lastTag === tagName //上一个标签和现在标签相同  <li><li> 编译成 <li></li>  但是这种情况是不会出现的 因为浏览器解析的时候会自动补全如果是<li>我是li标签<li> 浏览器自动解析成  <li>我是li标签</li><li> </li>
                ) {
                    //查找parseHTML的stack栈中与当前tagName标签名称相等的标签，
                    //调用options.end函数，删除当前节点的子节点中的最后一个如果是空格或者空的文本节点则删除，
                    //为stack出栈一个当前标签，为currentParent变量获取到当前节点的父节点
                    parseEndTag(tagName);
                }
            }

            var unary = isUnaryTag$$1(tagName) || //函数匹配标签是否是 'area,base,br,col,embed,frame,hr,img,input,isindex,keygen, link,meta,param,source,track,wbr'
                         !!unarySlash; //如果是/> 则为真

            var l = match.attrs.length;
            var attrs = new Array(l); //数组属性对象转换正真正的数组对象
            for (var i = 0; i < l; i++) {
                var args = match.attrs[i]; //获取属性对象
                // hackish work around FF bug https://bugzilla.mozilla.org/show_bug.cgi?id=369778
                //对FF bug进行黑客攻击:https://bugzilla.mozilla.org/show_bug.cgi?id=369778
                if (
                    IS_REGEX_CAPTURING_BROKEN &&  //这个应该是 火狐浏览器私有 标志
                    args[0].indexOf('""') === -1
                ) {
                    if (args[3] === '') {
                        delete args[3];
                    }
                    if (args[4] === '') {
                        delete args[4];
                    }
                    if (args[5] === '') {
                        delete args[5];
                    }
                }
                var value = args[3] || args[4] || args[5] || '';
                var shouldDecodeNewlines = tagName === 'a' && args[1] === 'href'
                    ? options.shouldDecodeNewlinesForHref  // true chrome在a[href]中编码内容
                    : options.shouldDecodeNewlines;  //flase //IE在属性值中编码换行，而其他浏览器则不会

                attrs[i] = {  //把数组对象属性值循环变成对象，这样可以过滤相同的属性
                    name: args[1], //属性名称
                    //属性值
                    value: decodeAttr(value, shouldDecodeNewlines) //替换html 中的特殊符号，转义成js解析的字符串,替换 把   &lt;替换 <  ， &gt; 替换 > ， &quot;替换  "， &amp;替换 & ， &#10;替换\n  ，&#9;替换\t

                };

            }

            console.log('==!unary==')
            console.log(!unary)

            if (!unary) { //如果不是单标签

                // 为parseHTML 节点标签堆栈 插入一个桟数据
                stack.push({ //标签堆栈
                    tag: tagName, //开始标签名称
                    lowerCasedTag: tagName.toLowerCase(), //变成小写记录标签
                    attrs: attrs //获取属性
                });
                //设置结束标签
                lastTag = tagName;
                console.log('== parseHTML handleStartTag stack==')
                console.log(stack)

            }


            //
            if (options.start) {

                //标签开始函数， 创建一个ast标签dom，  判断获取v-for属性是否存在如果有则转义 v-for指令 把for，alias，iterator1，iterator2属性添加到虚拟dom中
                //获取v-if属性，为el虚拟dom添加 v-if，v-eles，v-else-if 属性
                //获取v-once 指令属性，如果有有该属性 为虚拟dom标签 标记事件 只触发一次则销毁
                //校验属性的值，为el添加muted， events，nativeEvents，directives，  key， ref，slotName或者slotScope或者slot，component或者inlineTemplate 标志 属性
                // 标志当前的currentParent当前的 element
                //为parse函数 stack标签堆栈 添加一个标签
                options.start(
                    tagName,  //标签名称
                    attrs,  //标签属性
                    unary,  // 如果不是单标签则为真
                    match.start,  //开始标签的开始位置
                    match.end //开始标签的结束的位置
                );
            }


        }



         //查找parseHTML的stack栈中与当前tagName标签名称相等的标签，
        //调用options.end函数，删除当前节点的子节点中的最后一个如果是空格或者空的文本节点则删除，
        //为stack出栈一个当前标签，为currentParent变量获取到当前节点的父节点
        function parseEndTag(
            tagName,   //标签名称
            start,  //结束标签开始位置
            end    //结束标签结束位置
        ) {
            var pos,
                lowerCasedTagName;
            if (start == null) { //如果没有传开始位置
                start = index;    //就那当前索引
            }
            if (end == null) {  //如果没有传结束位置
                end = index;    //就那当前索引
            }

            if (tagName) { //结束标签名称
                lowerCasedTagName = tagName.toLowerCase(); //将字符串转化成小写
            }

            // Find the closest opened tag of the same type 查找最近打开的相同类型的标记
            if (tagName) {
                // 获取stack堆栈最近的匹配标签
                for (pos = stack.length - 1; pos >= 0; pos--) {
                     //找到最近的标签相等
                    if (stack[pos].lowerCasedTag === lowerCasedTagName) {
                        break
                    }
                }
            } else {
                // If no tag name is provided, clean shop
                //如果没有提供标签名称，请清理商店
                pos = 0;
            }


            if (pos >= 0) { //这里就获取到了stack堆栈的pos索引
                // Close all the open elements, up the stack 关闭所有打开的元素，向上堆栈
                console.log(pos)

                for (var i = stack.length - 1; i >= pos; i--) {

                                    if ("development" !== 'production' && //如果stack中找不到tagName 标签的时候就输出警告日志，找不到标签
                                        (i > pos || !tagName) &&
                                        options.warn
                                    ) {
                                        options.warn(
                                            ("tag <" + (stack[i].tag) + "> has no matching end tag.")
                                        );
                                    }
                                    if (options.end) {
                                        console.log(options.end)
                                    //调用options.end函数，删除当前节点的子节点中的最后一个如果是空格或者空的文本节点则删除，
                                     //为stack出栈一个当前标签，为currentParent变量获取到当前节点的父节点
                                        options.end(
                                            stack[i].tag,//结束标签名称
                                            start, //结束标签开始位置
                                            end //结束标签结束位置
                                        );
                                    }
                }
                // Remove the open elements from the stack
                //从堆栈中删除打开的元素
                // console.log(stack[pos].tag)
                // 为parseHTML 节点标签堆栈 出桟当前匹配到的标签
                stack.length = pos;
                //获取到上一个标签，就是当前节点的父节点
                lastTag = pos && stack[pos - 1].tag;
                console.log(stack)
                console.log(lastTag)




            } else if (lowerCasedTagName === 'br') {
                                                    if (options.start) {
                                                        //标签开始函数， 创建一个ast标签dom，  判断获取v-for属性是否存在如果有则转义 v-for指令 把for，alias，iterator1，iterator2属性添加到虚拟dom中
                                                        //获取v-if属性，为el虚拟dom添加 v-if，v-eles，v-else-if 属性
                                                        //获取v-once 指令属性，如果有有该属性 为虚拟dom标签 标记事件 只触发一次则销毁
                                                        //校验属性的值，为el添加muted， events，nativeEvents，directives，  key， ref，slotName或者slotScope或者slot，component或者inlineTemplate 标志 属性
                                                        // 标志当前的currentParent当前的 element
                                                        //为parse函数 stack标签堆栈 添加一个标签
                                                        options.start(
                                                            tagName,
                                                            [], true,
                                                            start,
                                                            end
                                                        );
                                                    }
            } else if (lowerCasedTagName === 'p') {
                                                if (options.start) {
                                                    //标签开始函数， 创建一个ast标签dom，  判断获取v-for属性是否存在如果有则转义 v-for指令 把for，alias，iterator1，iterator2属性添加到虚拟dom中
                                                    //获取v-if属性，为el虚拟dom添加 v-if，v-eles，v-else-if 属性
                                                    //获取v-once 指令属性，如果有有该属性 为虚拟dom标签 标记事件 只触发一次则销毁
                                                    //校验属性的值，为el添加muted， events，nativeEvents，directives，  key， ref，slotName或者slotScope或者slot，component或者inlineTemplate 标志 属性
                                                    // 标志当前的currentParent当前的 element
                                                    //为parse函数 stack标签堆栈 添加一个标签
                                                    options.start(
                                                        tagName,
                                                        [], false,
                                                        start,
                                                        end);
                                                }
                                                if (options.end) {
                                                    //删除当前节点的子节点中的最后一个如果是空格或者空的文本节点则删除，
                                                    //为stack出栈一个当前标签，为currentParent变量获取到当前节点的父节点
                                                    options.end(
                                                        tagName,
                                                        start,
                                                        end
                                                    );
                                                }
            }
            console.log(lastTag)

        }
    }

    /*  */

    var onRE = /^@|^v-on:/;//判断是否是 @或者v-on:属性开头的
    var dirRE = /^v-|^@|^:/; //判断是否是 v-或者@或者:  属性开头的
    var forAliasRE = /([^]*?)\s+(?:in|of)\s+([^]*)/; //匹配 含有   字符串 in  字符串   或者  字符串 of  字符串
    var forIteratorRE = /,([^,\}\]]*)(?:,([^,\}\]]*))?$/; //匹配上,  但是属于两边是 [{ , 点 , }]  所以匹配上   ,+字符串
    var stripParensRE = /^\(|\)$/g; //匹配括号 ()

    var argRE = /:(.*)$/; //匹配字符串是否含有:
    var bindRE = /^:|^v-bind:/; //开始匹配是 :或者是v-bind
    var modifierRE = /\.[^.]+/g; // 匹配以点开头的分组 不属于点 data.object.info.age  匹配到 ['.object'，'.info' , '.age']

    var decodeHTMLCached = cached(he.decode);    //获取 真是dom的textContent文本

// configurable state
    var warn$2; //日志输出函数
    var delimiters;   //改变纯文本插入分隔符。修改指令的书写风格，比如默认是{{mgs}}  delimiters: ['${', '}']之后变成这样 ${mgs}
    var transforms; //transforms 样式属性的集合 函数
    var preTransforms;//transforms  arr属性的集合 函数
    var postTransforms; //空数组 
    var platformIsPreTag;   //  判断标签是否是pre 如果是则返回真
    var platformMustUseProp;  //  校验特定的属性方法
    var platformGetTagNamespace; //判断 tag 是否是svg或者math 标签


    //转换属性，把数组属性转换成对象属性，返回对象 AST元素
    function createASTElement(tag,  //标签名称
                              attrs, //属性
                              parent //父层
    ) {
        return {
            type: 1, //dom 类型
            tag: tag, //标签
            attrsList: attrs, //数组属性
            attrsMap: makeAttrsMap(attrs), //对象属性 把数组对象转换成 对象  例如attrs = [{name:tag1,value:1},{ name:tag2,value:2},{name:tag3,value:3}]转换成map={tag1:1,tag2:2,tag3:3}
            parent: parent, //父层
            children: []
        }
    }

    /**
     * Convert HTML string to AST.
     * 将HTML字符串转换为AST。
     */
    function parse(
                   template, //html 模板
                   options
    ) {
        warn$2 = options.warn || baseWarn; //警告日志函数
        platformIsPreTag = options.isPreTag || no;   //  判断标签是否是pre 如果是则返回真
        /* mustUseProp 校验属性
         * 1. attr === 'value', tag 必须是 'input,textarea,option,select,progress' 其中一个 type !== 'button'
         * 2. attr === 'selected' && tag === 'option'
         * 3. attr === 'checked' && tag === 'input'
         * 4. attr === 'muted' && tag === 'video'
         * 的情况下为真
         * */
        platformMustUseProp = options.mustUseProp || no;


        platformGetTagNamespace = options.getTagNamespace || no; //判断 tag 是否是svg或者math 标签
        //baseOptions中的modules参数为
        // modules=modules$1=[
        //     {       // class 转换函数
        //         staticKeys: ['staticClass'],
        //         transformNode: transformNode,
        //         genData: genData
        //     },
        //     {  //style 转换函数
        //         staticKeys: ['staticStyle'],
        //         transformNode: transformNode$1,
        //         genData: genData$1
        //     },
        //     {
        //         preTransformNode: preTransformNode
        //     }
        // ]


        //循环过滤数组或者对象的值，根据key循环 过滤对象或者数组[key]值，如果不存在则丢弃，如果有相同多个的key值，返回多个值的数组
        transforms = pluckModuleFunction(options.modules, 'transformNode');
        //循环过滤数组或者对象的值，根据key循环 过滤对象或者数组[key]值，如果不存在则丢弃，如果有相同多个的key值，返回多个值的数组
        preTransforms = pluckModuleFunction(options.modules, 'preTransformNode');
        //循环过滤数组或者对象的值，根据key循环 过滤对象或者数组[key]值，如果不存在则丢弃，如果有相同多个的key值，返回多个值的数组
        postTransforms = pluckModuleFunction(options.modules, 'postTransformNode');
        console.log('==options==')
        console.log(options)

        /*
         拿到 key transforms值的函数
        * transforms=[
               transformNode, //函数 获取 class 属性和:class或者v-bind的动态属性值，并且转化成字符串 添加到staticClass和classBinding 属性中
               transformNode$1 //函数  transformNode$1获取 style属性和:style或者v-bind的动态属性值，并且转化成字符串 添加到staticStyle和styleBinding属性中
        * ]
        * */
        console.log('==transforms==')
        console.log(transforms)
        /*
         拿到 key preTransforms值的函数
         * preTransforms=[
                  preTransformNode //     preTransformNode把attrsMap与attrsList属性值转换添加到el   ast虚拟dom中为虚拟dom添加for，alias，iterator1，iterator2， addRawAttr ，type ，key， ref，slotName或者slotScope或者slot，component或者inlineTemplate ， plain，if ，else，elseif 属性
         * ]
         * */
        console.log('==preTransforms==')
        console.log(preTransforms)




        /*
         拿到 key postTransforms值的函数
         * postTransforms=[   为空

         * ]
         * */
        console.log('==postTransforms==')
        console.log(postTransforms)





        //改变纯文本插入分隔符。修改指令的书写风格，比如默认是{{mgs}}  delimiters: ['${', '}']之后变成这样 ${mgs}
        delimiters = options.delimiters;

        var stack = []; // parse函数 标签堆栈
        var preserveWhitespace = options.preserveWhitespace !== false; //模板编译器的选项。当使用默认的 vue-template-compiler 的时候，你可以使用这个选项来添加自定义编译器指令、模块或通过 { preserveWhitespace: false } 放弃模板标签之间的空格。
        var root;
        var currentParent; //当前父节点
        var inVPre = false;  //标记 标签是否还有 v-pre 指令，如果没有则是false
        var inPre = false; //  判断标签是否是pre 如果是则返回真
        var warned = false;
        console.log(currentParent)


        function warnOnce(msg) {
            if (!warned) {
                warned = true;
                warn$2(msg); //警告日志函数
            }
        }

        //克隆节点
        function closeElement(element) {
            // check pre state
            if (element.pre) { //判断标签是否还有 v-pre 指令
                inVPre = false; //标记 标签是否还有 v-pre 指令，如果没有则是false
            }
            if (platformIsPreTag(element.tag)) { //  判断标签是否是pre 如果是则返回真
                inPre = false; //  判断标签是否是pre 如果是则返回真
            }
            console.log(postTransforms)

            // apply post-transforms 应用转化后 postTransforms数组为空所以不执行这里
            for (var i = 0; i < postTransforms.length; i++) {
                postTransforms[i](element, options);
            }
        }
        console.log(currentParent)





        parseHTML(
                    template, //字符串模板
                    {
                    warn: warn$2, //警告日志函数
                    expectHTML: options.expectHTML, //标志是html 是true
                    isUnaryTag: options.isUnaryTag, //匹配标签是否是 'area,base,br,col,embed,frame,hr,img,input,isindex,keygen, link,meta,param,source,track,wbr'
                    canBeLeftOpenTag: options.canBeLeftOpenTag, //判断标签是否是 'colgroup,dd,dt,li,options,p,td,tfoot,th,thead,tr,source'
                    shouldDecodeNewlines: options.shouldDecodeNewlines,  //flase //IE在属性值中编码换行，而其他浏览器则不会
                    shouldDecodeNewlinesForHref: options.shouldDecodeNewlinesForHref, // true chrome在a[href]中编码内容
                    shouldKeepComment: options.comments, //当设为 true 时，将会保留且渲染模板中的 HTML 注释。默认行为是舍弃它们。
                    //标签开始函数， 创建一个ast标签dom，  判断获取v-for属性是否存在如果有则转义 v-for指令 把for，alias，iterator1，iterator2属性添加到虚拟dom中
                    //获取v-if属性，为el虚拟dom添加 v-if，v-eles，v-else-if 属性
                    //获取v-once 指令属性，如果有有该属性 为虚拟dom标签 标记事件 只触发一次则销毁
                    //校验属性的值，为el添加muted， events，nativeEvents，directives，  key， ref，slotName或者slotScope或者slot，component或者inlineTemplate 标志 属性
                    // 标志当前的currentParent当前的 element
                        //为parse函数 stack标签堆栈 添加一个标签
                    start: function start(
                                           tag, //标签名称
                                          attrs,   //标签属性
                                          unary  // 如果不是单标签则为真
                    ) {


                        // check namespace. 检查名称空间。
                        // inherit parent ns if there is one 如果有，继承父ns
                        var ns = (currentParent && currentParent.ns) ||
                                   platformGetTagNamespace(tag);//判断 tag 是否是svg或者math 标签

                        // handle IE svg bug
                        /* istanbul ignore if */
                        if (isIE && ns === 'svg') { //如果是ie浏览器 并且是 svg
                            //防止ie浏览器 svu 的 bug 替换属性含有NS+数字 去除 NS+数字
                            attrs = guardIESVGBug(attrs);
                        }

                        //转换属性，把数组属性转换成对象属性，返回对象 AST元素
                        console.log(currentParent)
                        //创建一个ast标签dom
                        var element = createASTElement(tag, attrs, currentParent);

                        if (ns) { //判断 tag 是否是svg或者math 标签
                            element.ns = ns;
                        }

                        if (
                            isForbiddenTag(element) &&     //如果是style或者是是script 标签并且type属性不存在 或者存在并且是javascript 属性 的时候返回真
                            !isServerRendering() //不是在服务器node环境下
                        ) {
                            element.forbidden = true;
                            "development" !== 'production' && warn$2(
                                'Templates should only be responsible for mapping the state to the ' +
                                'UI. Avoid placing tags with side-effects in your templates, such as ' +
                                "<" + tag + ">" + ', as they will not be parsed.'
                            );
                        }

                        // apply pre-transforms     transforms  arr属性的集合 函数
                        for (var i = 0; i < preTransforms.length; i++) {
                            //transforms  arr属性的集合 函数
                            //     preTransformNode把attrsMap与attrsList属性值转换添加到el   ast虚拟dom中为虚拟dom添加for，alias，iterator1，iterator2， addRawAttr ，type ，key， ref，slotName或者slotScope或者slot，component或者inlineTemplate ， plain，if ，else，elseif 属性
                            element = preTransforms[i](element, options) || element;
                        }
                        console.log(element)


                        if (!inVPre) { //如果  标签 没有 v-pre 指令
                            processPre(element);    //检查标签是否有v-pre 指令 含有 v-pre 指令的标签里面的指令则不会被编译
                            if (element.pre) { //标记 标签是否还有 v-pre 指令
                                inVPre = true; //如果标签有v-pre 指令 则标记为true
                            }
                        }
                        if (platformIsPreTag(element.tag)) { //  判断标签是否是pre 如果是则返回真
                            inPre = true;
                        }
                        if (inVPre) { //如果含有 v-pre 指令
                            //浅拷贝属性 把虚拟dom的attrsList拷贝到attrs中,如果没有pre块，标记plain为true
                            processRawAttrs(element);
                        } else if (!element.processed) {
                            // structural directives  指令
                            //判断获取v-for属性是否存在如果有则转义 v-for指令 把for，alias，iterator1，iterator2属性添加到虚拟dom中
                            processFor(element);
                            //获取v-if属性，为el虚拟dom添加 v-if，v-eles，v-else-if 属性
                            processIf(element);
                            //获取v-once 指令属性，如果有有该属性 为虚拟dom标签 标记事件 只触发一次则销毁
                            processOnce(element);
                            // element-scope stuff

                            //校验属性的值，为el添加muted， events，nativeEvents，directives，  key， ref，slotName或者slotScope或者slot，component或者inlineTemplate 标志 属性
                            processElement(element, options);
                        }
                        console.log(element)

                        //检查根约束 根节点不能是slot或者template标签，并且不能含有v-for 属性
                        function checkRootConstraints(el) {
                            {
                                if (el.tag === 'slot' || el.tag === 'template') {
                                    warnOnce(
                                        "Cannot use <" + (el.tag) + "> as component root element because it may " +
                                        'contain multiple nodes.'
                                    );
                                }
                                if (el.attrsMap.hasOwnProperty('v-for')) {
                                    warnOnce(
                                        'Cannot use v-for on stateful component root element because ' +
                                        'it renders multiple elements.'
                                    );
                                }
                            }
                        }

                        // tree management
                        if (!root) {
                            root = element;
                            //检查根约束 根节点不能是slot或者template标签，并且不能含有v-for 属性
                            checkRootConstraints(root);
                        } else if (!stack.length) {
                            // allow root elements with v-if, v-else-if and v-else
                            //允许根元素带有v-if、v-else-if和v-else
                            if (root.if && (element.elseif || element.else)) {
                                checkRootConstraints(element);//检查根约束 根节点不能是slot或者template标签，并且不能含有v-for 属性

                                //为if指令添加标记
                                addIfCondition(
                                    root, //根节点
                                    {
                                    exp: element.elseif, //view 试图中的elseif 属性
                                    block: element //当前的虚拟dom
                                   }
                                 );
                            } else {
                                warnOnce(
                                    "Component template should contain exactly one root element. " +
                                    "If you are using v-if on multiple elements, " +
                                    "use v-else-if to chain them instead."
                                );
                            }
                        }
                          //如果currentParent父节点存在。并且element.forbidden不存在
                        if (
                            currentParent &&
                            !element.forbidden   //如果是style或者是是script 标签并且type属性不存在 或者存在并且是javascript 属性 的时候返回真
                            ) {
                            if (element.elseif || element.else) { //如果有elseif或者else属性的时候
                                //找到上一个兄弟节点，如果上一个兄弟节点是if，则下一个兄弟节点则是elseif
                                processIfConditions(element, currentParent);
                            } else if (element.slotScope) { // scoped slot 作用域的槽

                                currentParent.plain = false;
                                //获取slotTarget作用域标签，如果获取不到则定义为default
                                var name = element.slotTarget || '"default"';
                                (currentParent.scopedSlots || (currentParent.scopedSlots = {}))[name] = element;
                            } else {
                                //如果父节点存在currentParent则在父节点添加一个子节点，并且
                                currentParent.children.push(element);
                                //当前节点上添加parent属性
                                element.parent = currentParent;
                            }
                        }

                        // var unary = isUnaryTag$$1(tagName) || //函数匹配标签是否是 'area,base,br,col,embed,frame,hr,img,input,isindex,keygen, link,meta,param,source,track,wbr'
                        //     !!unarySlash; //如果是/> 则为真
                         //如果当前标签不是单标签，也不是闭合标签，就标志当前currentParent 是当前标签
                        console.log(stack)


                        if (!unary) {
                            currentParent = element;
                            //为parse函数 stack标签堆栈 添加一个标签
                            stack.push(element);

                            console.log('== start stack==')
                            console.log(stack)


                        } else {
                             //克隆节点
                            closeElement(element);

                        }
                        console.log('===start===')
                        console.log(stack)


                    },

                        //删除当前节点的子节点中的最后一个如果是空格或者空的文本节点则删除，
                        //为stack出栈一个当前标签，为currentParent变量获取到当前节点的父节点
                    end: function end() {
                        console.log('end')


                        // remove trailing whitespace 删除尾随空格
                        //取到栈中最后一位数据 如果标签是这样 <div><span><i></i></span></div> 则这里会先是i 先进后出
                        //parse函数 标签堆栈，出栈一个当前标签，为currentParent变量获取到当前节点的父节点
                        var element = stack[stack.length - 1];

                        console.log(element)

                        var lastNode = element.children[element.children.length - 1];
                        if (
                            lastNode && //判断子节点最后一个节点
                            lastNode.type === 3  //文本节点 Text 空格等 属性内容#text
                            && lastNode.text === ' ' //空格
                            && !inPre //标志需要编译的状态
                        ) {
                            element.children.pop(); //删除空格文本节点
                        }
                        // pop stack 获取上一个标签节点则是他当前节点的父节点
                        //  parse函数 标签堆栈，出栈一个当前标签，
                        stack.length -= 1;
                       //获取当前节点的父节点标签
                        currentParent = stack[stack.length - 1];
                        console.log(stack)

                        //克隆节点
                        closeElement(element);
                    },
                    //把text添加到属性节点或者添加到注释节点，ast模板数据
                    chars: function chars(text) {
                        console.log('chars')
                        console.log(currentParent)


                         //判断是否有当前的父节点
                        if (!currentParent) {  //警告日志
                            {
                                if (text === template) {
                                    warnOnce(
                                        'Component template requires a root element, rather than just text.'
                                    );
                                } else if ((text = text.trim())) {
                                    warnOnce(
                                        ("text \"" + text + "\" outside root element will be ignored.")
                                    );
                                }
                            }
                            return
                        }
                        // IE textarea placeholder bug
                        /* istanbul ignore if */
                        if (
                            isIE && //如果是ie
                            currentParent.tag === 'textarea' && //如果上一个节点 父节点是textarea
                            currentParent.attrsMap.placeholder === text //如果他的html5 用户信息提示和当前的文本一样
                        ) {
                            return
                        }
                        var children = currentParent.children; // 获取到同级的兄弟节点
                        text = inPre ||  //  判断标签是否是pre 如果是则返回真，则不需要去空格
                                    text.trim() ?  //去除text空格
                                                      (isTextTag(currentParent) ?   //判断标签是否是script或者是style
                                                                                 text//直接获取文本
                                                                                 : decodeHTMLCached(text)) //获取 真是dom的textContent文本
                                                                                    // only preserve whitespace if its not right after a starting tag
                                                                         //只有在开始标记之后没有空格时才保留空格
                                               : preserveWhitespace && //模板编译器的选项。当使用默认的 vue-template-compiler 的时候，你可以使用这个选项来添加自定义编译器指令、模块或通过 { preserveWhitespace: false } 放弃模板标签之间的空格。
                                                 children.length ? ' ' : ''; //如果是children.length存在并且preserveWhitespace为真则保留空格
                        if (text) {
                            var res;
                            if (
                                !inVPre &&  //标记 标签是否还有 v-pre 指令，如果没有则是false
                                text !== ' ' && //你是空节点
                                 (res = parseText(text, delimiters) )  //匹配view 指令，并且把他转换成 虚拟dom vonde 需要渲染的函数,比如指令{{name}}转换成 _s(name)
                                         //比如字符串  我叫{{name}},今年{{age}},数据{{data.number}}个手机  转换成 我叫+_s(name)+,今年+_s(age)+,数据+_s(data.number)+个手机
                               ) {
                                console.log(res)

                                        children.push({  //添加为属性节点
                                            type: 2,  //Attr	代表属性
                                            expression: res.expression,             //比如字符串  我叫{{name}},今年{{age}},数据{{data.number}}个手机  转换成 我叫+_s(name)+,今年+_s(age)+,数据+_s(data.number)+个手机
                                            tokens: res.tokens,
                                            text: text //html文本
                                        });
                            } else if (
                                    //如果当前text不是空的，子节点也不是空的表示是注释几点
                                        text !== ' ' ||
                                        !children.length ||
                                        children[children.length - 1].text !== ' '
                                      ) {
                                            children.push({
                                                type: 3, //注释节点
                                                text: text
                                            });
                            }
                        }
                    },
                        //把text添加到属性节点或者添加到注释节点，ast模板数据
                    comment: function comment(text) {
                        console.log('comment')

                        console.log(currentParent)

                        currentParent.children.push({
                            type: 3,  //注释节点
                            text: text,
                            isComment: true
                        });
                    }
                }
                  );

        return root
    }
    //检查标签是否有v-pre 指令 含有 v-pre 指令的标签里面的指令则不会被编译
    function processPre(el) {
        if (getAndRemoveAttr(el, 'v-pre') != null) {
            el.pre = true;  //标记 标签是否还有 v-pre 指令 ,如果有则为真   含有 v-pre 指令的标签里面的指令则不会被编译
        }
    }

    //浅拷贝属性 把虚拟dom的attrsList拷贝到attrs中,如果没有pre块，标记plain为true
    function processRawAttrs(el) {
        var l = el.attrsList.length;
        if (l) {
            var attrs = el.attrs = new Array(l);
            for (var i = 0; i < l; i++) {
                attrs[i] = {
                    name: el.attrsList[i].name,
                    value: JSON.stringify(el.attrsList[i].value)
                };
            }
        } else if (!el.pre) {  //标记 标签是否还有 v-pre 指令 ,如果有则为真
            // non root node in pre blocks with no attributes
            //没有属性的pre块中的非根节点
            el.plain = true;
        }
    }


    //校验属性的值，为el添加muted， events，nativeEvents，directives，  key， ref，slotName或者slotScope或者slot，component或者inlineTemplate 标志 属性
    function processElement(element, options) {
        //获取属性key值，校验key 是否放在template 标签上面 为el 虚拟dom添加 key属性
        processKey(element);

        // determine whether this is a plain element after
        // removing structural attributes
        //确定这是否是一个普通元素后
        //删除结构属性
        element.plain = !element.key && !element.attrsList.length;  //如果没有key 也没有属性

        //获取ref 属性，并且判断ref 是否含有v-for指令 为el虚拟dom 添加 ref 属性
        processRef(element);

        //检查插槽作用域 为el虚拟dom添加 slotName或者slotScope或者slot
        processSlot(element);

      //  判断虚拟dom 是否有 :is属性，是否有inline-template 内联模板属性 如果有则标记下 为el 虚拟dom 添加component属性或者inlineTemplate 标志
        processComponent(element);

        //转换数据
        for (var i = 0; i < transforms.length; i++) {
            element = transforms[i](element, options) || element;
        }
        //检查属性，为虚拟dom属性转换成对应需要的虚拟dom vonde数据 为el虚拟dom 添加muted， events，nativeEvents，directives
        processAttrs(element);
    }


    //获取属性key值，校验key 是否放在template 标签上面
    function processKey(el) {
        //校验key 有没有放在
        var exp = getBindingAttr(el, 'key');
        if (exp) {
            if ("development" !== 'production' && el.tag === 'template') {
                //不能的。把键放在真实的template元素上。
                warn$2("<template> cannot be keyed. Place the key on real elements instead.");
            }
            el.key = exp;
        }
    }

    //获取ref 属性，并且判断ref 是否含有v-for指令
    function processRef(el) {
        //获取ref 属性
        var ref = getBindingAttr(el, 'ref');
        if (ref) {
            el.ref = ref;
            //检查当前虚拟dom  vonde 是否有for指令，或者父组件是否有for指令
            el.refInFor = checkInFor(el);
        }
    }

    //判断获取v-for属性是否存在如果有则转义 v-for指令 把for，alias，iterator1，iterator2属性添加到虚拟dom中
    function processFor(el) {
        var exp;
        //获取v-for指令 属性
        if ((exp = getAndRemoveAttr(el, 'v-for'))) {
            console.log(exp)

            //转换 for指令 获取 for中的key  返回一个res对象为{for:data字符串，alias：value字符串，iterator1:key字符串，iterator2:index字符串}
            var res = parseFor(exp);

            if (res) {
                //合并浅拷贝到el中
                extend(el, res);
            } else {
                warn$2(
                    ("Invalid v-for expression: " + exp)
                );
            }
        }
    }

    //转换 for指令 获取 for中的key  返回一个res对象为{for:data字符串，alias：value字符串，iterator1:key字符串，iterator2:index字符串}
    function parseFor(exp //字符串 列如 是 (item,index) in data 或 item in data 或item of data 或者(item,index) of data
    ) {
        var inMatch = exp.match(forAliasRE); //匹配 含有   字符串 in  字符串   或者  字符串 of  字符串 比如(value, key, index) in data
        if (!inMatch) { //如果匹配不上则返回出去
            return
        }
        var res = {};
        console.log(inMatch)

        res.for = inMatch[2].trim(); //获取到数据 data 字符串
        var alias = inMatch[1].trim().replace(stripParensRE, ''); //去除括号 比如(value, key, index) in data 变成 value, key, index


        var iteratorMatch = alias.match(forIteratorRE); // 匹配出分组 [0: ", key, index",  1: " key" , 2: "index"]

        if (iteratorMatch) {
            res.alias = alias.replace(forIteratorRE, ''); // value , key , index 去掉 ,+字符串 获得value 字符串
            console.log(res.alias)

            res.iterator1 = iteratorMatch[1].trim(); //获取第二个字符串  key
            if (iteratorMatch[2]) {
                res.iterator2 = iteratorMatch[2].trim(); //获取第三个字符串 index
            }
        } else {
            res.alias = alias;  //单个字符串的时候  value in data
        }
        return res
    }

    //获取v-if属性，为el虚拟dom添加 v-if，v-eles，v-else-if 属性
    function processIf(el) {
        var exp = getAndRemoveAttr(el, 'v-if'); //获取v-if属性
        if (exp) {
            el.if = exp;
            addIfCondition(el, {  //为if指令添加标记
                exp: exp,
                block: el
            });
        } else {
            if (getAndRemoveAttr(el, 'v-else') != null) {
                el.else = true;
            }
            var elseif = getAndRemoveAttr(el, 'v-else-if');
            if (elseif) {
                el.elseif = elseif;
            }
        }
    }
     //找到上一个兄弟节点，如果上一个兄弟节点是if，则下一个兄弟节点则是elseif
    function processIfConditions(el, parent) {
        //找到兄弟节点，上一个兄弟节点。
        var prev = findPrevElement(parent.children);
        if (prev && prev.if) { //上一个节点如果是有if 这个节点标记则是elseif
            //为if指令添加标记
            addIfCondition(
                prev,
                {
                    exp: el.elseif,
                    block: el
                }
            );
        } else {
            warn$2(
                "v-" + (el.elseif ? ('else-if="' + el.elseif + '"') : 'else') + " " +
                "used on element <" + (el.tag) + "> without corresponding v-if."
            );
        }
    }
   //找到上一个节点
    function findPrevElement(children) {
        var i = children.length;
        while (i--) {
            if (children[i].type === 1) {
                return children[i]
            } else {//如果是其他节点则删除
                if ("development" !== 'production' && children[i].text !== ' ') {
                    warn$2(
                        "text \"" + (children[i].text.trim()) + "\" between v-if and v-else(-if) " +
                        "will be ignored."
                    );
                }
                children.pop();
            }
        }
    }

    //为if指令添加标记
    function addIfCondition(
                                el,   //   el当前渲染的虚拟组件
                                condition // 标记的状态 对象  {exp: view中的if属性,block: el当前渲染的虚拟组件}
                            ) {
        if (!el.ifConditions) { //
            el.ifConditions = []; //存储队列
        }
        el.ifConditions.push(condition); //if 指令标记
    }
     //获取v-once 指令属性，如果有有该属性 为虚拟dom标签 标记事件 只触发一次则销毁
    function processOnce(el) {
        var once$$1 = getAndRemoveAttr(el, 'v-once');
        if (once$$1 != null) {
            el.once = true;
        }
    }

    //检查插槽作用域 为el虚拟dom添加 slotName或者slotScope或者slot
    function processSlot(el) {
        if (el.tag === 'slot') { //判断是否是slot插槽
            el.slotName = getBindingAttr(el, 'name'); //获取插槽的name属性
            //如果设置了key 则警告
            if ("development" !== 'production' && el.key) {
                warn$2(
                    "`key` does not work on <slot> because slots are abstract outlets " +
                    "and can possibly expand into multiple elements. " +
                    "Use the key on a wrapping element instead."
                );
            }
        } else {
                                    var slotScope;
                                    if (el.tag === 'template') { //如果是模板标签
                                                            slotScope = getAndRemoveAttr(el, 'scope'); //获取scope属性值
                                                            /* istanbul ignore if */
                                                            if ("development" !== 'production' && slotScope) {
                                                                warn$2(
                                                                    "the \"scope\" attribute for scoped slots have been deprecated and " +
                                                                    "replaced by \"slot-scope\" since 2.5. The new \"slot-scope\" attribute " +
                                                                    "can also be used on plain elements in addition to <template> to " +
                                                                    "denote scoped slots.",
                                                                    true
                                                                );
                                                            }
                                                            el.slotScope = slotScope || getAndRemoveAttr(el, 'slot-scope'); //添加slotScope 的作用域

                                    } else if ((slotScope = getAndRemoveAttr(el, 'slot-scope'))) { //获取slot-scope 作用域属性
                                                            /* istanbul ignore if */
                                                            if ("development" !== 'production' && el.attrsMap['v-for']) {
                                                                warn$2(
                                                                    "Ambiguous combined usage of slot-scope and v-for on <" + (el.tag) + "> " +
                                                                    "(v-for takes higher priority). Use a wrapper <template> for the " +
                                                                    "scoped slot to make it clearer.",
                                                                    true
                                                                );
                                                            }
                                                            el.slotScope = slotScope;//添加slotScope 的作用域
                                    }


                                    var slotTarget = getBindingAttr(el, 'slot'); //获取slot 属性
                                    if (slotTarget) {
                                                        el.slotTarget = slotTarget === '""' ? '"default"' : slotTarget;
                                                        // preserve slot as an attribute for native shadow DOM compat
                                                        // only for non-scoped slots.
                                                        //保留slot作为本地影子DOM compat的属性
                                                        //只适用于非作用域插槽。
                                                        if (el.tag !== 'template' && !el.slotScope) {
                                                                        //添加插槽属性
                                                                        addAttr(el, 'slot', slotTarget);
                                                        }
                                    }
        }
    }

    // 判断虚拟dom 是否有 :is属性，是否有inline-template 内联模板属性 如果有则标记下 为el 虚拟dom 添加component属性或者inlineTemplate 标志
    function processComponent(el) {
        var binding;
        if ((binding = getBindingAttr(el, 'is'))) { //获取:is 或者是 v-bind:is 属性
            el.component = binding; //如果有 把他绑定在属性中
        }
        if (getAndRemoveAttr(el, 'inline-template') != null) { //当 inline-template 这个特殊的特性出现在一个子组件上时，这个组件将会使用其里面的内容作为模板，而不是将其作为被分发的内容。这使得模板的撰写工作更加灵活。
            el.inlineTemplate = true; //标志有内联模板
        }
    }
   //检查属性，为虚拟dom属性转换成对应需要的虚拟dom vonde数据 为el虚拟dom 添加muted， events，nativeEvents，directives
    function processAttrs(el) {
        var list = el.attrsList; //获取属性列表
        var i, //循环数组的索引
            l, //属性数组长度
            name, //获取 view 属性的名称
            rawName,//获取 view 属性的名称
            value, //属性名
            modifiers,
            isProp; //是否是props 属性

        for (i = 0, l = list.length; i < l; i++) { //循环属性列表
                                                name = rawName = list[i].name; //获取 view 属性的名称
                                                value = list[i].value; //获取属性的值

                                                if (dirRE.test(name)) { // 判断是否是 v-或者@或者:  属性开头的
                                                                        // mark element as dynamic
                                                                        el.hasBindings = true; // 动态标记元素
                                                                        // modifiers 编辑器    //把字符串中的对象拆分成 对象比如 data.object.info.age 变成对象{object:true,info:true,age:true} 返回出去
                                                                        modifiers = parseModifiers(name);
                                                                        if (modifiers) {
                                                                            //把刚才后面的.+字符串去除掉 获取最后一位的key
                                                                            name = name.replace(modifierRE, '');
                                                                        }
                                                                        if (bindRE.test(name)) { // v-bind  匹配开始匹配是 :或者是v-bind

                                                                                                name = name.replace(bindRE, ''); //去除   开始匹配是 :或者是v-bind
                                                                                                // 处理value 解析成正确的value，把过滤器 转换成vue 虚拟dom的解析方法函数 比如把过滤器 ' ab | c | d' 转换成 _f("d")(_f("c")(ab))
                                                                                                // 表达式中的过滤器解析方法
                                                                                                value = parseFilters(value);
                                                                                                isProp = false;
                                                                                                if (modifiers) { //匹配到对象点的时候
                                                                                                                        if (modifiers.prop) {//匹配到有prop属性的时候
                                                                                                                                        isProp = true;
                                                                                                                                        //属性 v-model 变成 vModel
                                                                                                                                        name = camelize(name);
                                                                                                                                        //如果是innerHtml属性变成innerHTML
                                                                                                                                        if (name === 'innerHtml') {
                                                                                                                                                     name = 'innerHTML';
                                                                                                                                        }
                                                                                                                        }
                                                                                                                        if (modifiers.camel) {
                                                                                                                            name = camelize(name);
                                                                                                                        }
                                                                                                                        if (modifiers.sync) { //同步属性

                                                                                                                            //为虚拟dom添加events 事件对象属性，如果添加@click='clickEvent' 则此时 虚拟dom为el.events.click.value="clickEvent"
                                                                                                                            //或者虚拟dom添加nativeEvents 事件对象属性，如果添加@click.native='clickEvent' 则此时 虚拟dom为el.nativeEvents.click.value="clickEvent"
                                                                                                                            addHandler(
                                                                                                                                el,
                                                                                                                                ("update:" + (camelize(name))), //  //属性 v-model 变成 vModel
                                                                                                                                //创建赋值代码
                                                                                                                                // 创赋值代码，子功能转义字符串对象拆分字符串对象  把后一位key分离出来
                                                                                                                                genAssignmentCode(  //返回值 函数
                                                                                                                                    value,  //对象
                                                                                                                                     "$event" //key
                                                                                                                                )
                                                                                                                            );
                                                                                                                        }
                                                                                                }
                                                                                                if (
                                                                                                    isProp  //如果是prop属性
                                                                                                    ||
                                                                                                    (
                                                                                                        !el.component && platformMustUseProp(el.tag, el.attrsMap.type, name) //校验特定的属性方法
                                                                                                    )) {
                                                                                                    //添加props属性
                                                                                                    addProp(el, name, value);
                                                                                                } else {
                                                                                                   //添加普通的属性 在attrs属性中
                                                                                                    addAttr(el, name, value);
                                                                                                }
                                                                        } else if (onRE.test(name)) { // v-on   判断是否是 @或者v-on:属性开头的

                                                                            name = name.replace(onRE, '');
                                                                            console.log(name)
                                                                            console.log(value)
                                                                            console.log(modifiers)
                                                                            console.log(false)
                                                                            console.log(warn$2)
                                                                            console.log(el)

                                                                            addHandler(
                                                                                el, //虚拟dom
                                                                                name, //name 事件名称 事件类型
                                                                                value, // 事件名称的值
                                                                                modifiers,
                                                                                false,
                                                                                warn$2 //警告的日志
                                                                            );
                                                                            console.log(el)

                                                                        } else { // normal directives 正常的指令
                                                                                //一般也不会进来这里 因为前面已经匹配了  :或者v-bind  @或者v-on:属性 开头的，所以进来这里的就是自定义指令
                                                                                            name = name.replace(dirRE, ''); //判断是否是 v-或者@或者:  属性开头的 去除掉 值获取name
                                                                                            // parse arg
                                                                                            var argMatch = name.match(argRE);  //匹配字符串是否含有: 只是匹配一个
                                                                                            var arg = argMatch && argMatch[1]; //获取字符串 比如原字符串是 abc:efg:hig  获取到efg:hig

                                                                                            if (arg) {
                                                                                                name = name.slice(0, -(arg.length + 1)); // 截取name 取得abc
                                                                                            }

                                                                                            /* 当然也可以这么写
                                                                                               var index = argMatch&&argMatch.index;
                                                                                             if (index) {
                                                                                                  name = name.slice(0, index+ 1); // 截取name 取得abc
                                                                                             }
                                                                                            */
                                                                                            console.log(el)
                                                                                            console.log(name)
                                                                                            console.log(rawName)
                                                                                            console.log(value)
                                                                                            console.log(arg)
                                                                                            console.log(modifiers)

                                                                                           //为虚拟dom 添加一个 指令directives属性 对象
                                                                                            addDirective(
                                                                                                el, //虚拟dom vonde
                                                                                                name, //获取 view 原始属性的名称 不包含 v- : @的
                                                                                                rawName,// 获取 view 原始属性的名称 包含 v- : @的
                                                                                                value, // 属性view 属性上的值
                                                                                                arg, // efg:hig 属性名称冒号后面多出来的标签
                                                                                                modifiers
                                                                                            );
                                                                                            if ("development" !== 'production' && name === 'model') {
                                                                                                //检查指令的命名值 不能为for 或者 for中的遍历的item
                                                                                                checkForAliasModel(el, value);
                                                                                            }
                                                                        }
                                                } else {
                                                    // literal attribute文字属性

                                                    {
                                                        //匹配view 指令，并且把他转换成 虚拟dom vonde 需要渲染的函数,比如指令{{name}}转换成 _s(name)
                                                        //比如字符串  我叫{{name}},今年{{age}},数据{{data.number}}个手机  转换成 我叫+_s(name)+,今年+_s(age)+,数据+_s(data.number)+个手机
                                                        var res = parseText(value, delimiters); //校验是否含有{{}} 括号的属性 比如 <div  style='style'>  </div> 如果写成 <div  style='{{style}}'>  </div>  则报错警告
                                                                if (res) {
                                                                    warn$2(
                                                                        name + "=\"" + value + "\": " +
                                                                        'Interpolation inside attributes has been removed. ' +
                                                                        'Use v-bind or the colon shorthand instead. For example, ' +
                                                                        'instead of <div id="{{ val }}">, use <div :id="val">.'
                                                                    );
                                                                }
                                                            }
                                                            //添加属性
                                                            addAttr(
                                                                el, //虚拟dom
                                                                name, //view 属性名称
                                                                JSON.stringify(value)  //view 属性值
                                                            );
                                                            // #6887 firefox doesn't update muted state if set via attribute
                                                            // even immediately after element creation
                                                            // #6887如果通过属性设置，firefox不会更新静音状态
                                                            //甚至在元素创建之后
                                                            if (
                                                                !el.component && //如果不是组件
                                                                name === 'muted' && // Video 属性 muted 属性设置或返回视频是否应该被静音（关闭声音）。
                                                                platformMustUseProp(el.tag, el.attrsMap.type, name) //  校验特定的属性方法
                                                            ) {
                                                                //添加音频属性
                                                                addProp(el, name, 'true');
                                                            }
                                                }
        }
    }

    //检查当前虚拟dom  vonde 是否有for指令，或者父组件是否有for指令
    function checkInFor(el) {
        var parent = el;
        while (parent) {
            if (parent.for !== undefined) {
                return true
            }
            parent = parent.parent;
        }
        return false
    }

    //把字符串中的对象拆分成 对象比如 data.object.info.age 变成对象{object:true,info:true,age:true} 返回出去
    function parseModifiers(name) {
        // 匹配以点开头的分组 不属于点 data.object.info.age  匹配到 ['.object'，'.info' , '.age']
        var match = name.match(modifierRE);
        if (match) {
            var ret = {};
            match.forEach(function (m) {
                ret[m.slice(1)] = true; //去除点，丢弃第一位。 把他变成对象{object:true,info:true,age:true}
            });
            return ret
        }
    }

    /*
     把数组对象转换成 对象 例如
     attrs = [{name:tag1,value:1},{ name:tag2,value:2},{name:tag3,value:3}]
     转换成
     map={tag1:1,tag2:2,tag3:3}
     * */
    function makeAttrsMap(attrs) {
        var map = {};

        for (var i = 0, l = attrs.length; i < l; i++) {
            if (
                "development" !== 'production' &&
                map[attrs[i].name] && !isIE && !isEdge
            ) {
                warn$2('duplicate attribute: ' + attrs[i].name);
            }

            map[attrs[i].name] = attrs[i].value;
        }
        return map
    }

// for script (e.g. type="x/template") or style, do not decode content
    //判断标签是否是script或者是style
    function isTextTag(el) {
        return el.tag === 'script' || el.tag === 'style'
    }

    //如果是style或者是是script 标签并且type属性不存在 或者存在并且是javascript 属性 的时候返回真
    function isForbiddenTag(el) {
        return (
            el.tag === 'style' ||  //如果标签是 style
            (
                el.tag === 'script'&& //如果是script 标签
                (
                    !el.attrsMap.type || //如果type属性不存在
                    el.attrsMap.type === 'text/javascript' //或者如果type属性是javascript
                )
            )
        )
    }

    var ieNSBug = /^xmlns:NS\d+/; //匹配 字符串    xmlns:NS+数字
    var ieNSPrefix = /^NS\d+:/;   //匹配 字符串    NS+数字

    /* istanbul ignore next */
    //防止ie浏览器 svu 的 bug 替换属性含有NS+数字 去除 NS+数字
    function guardIESVGBug(attrs) {
        var res = [];  //属性数组
        for (var i = 0; i < attrs.length; i++) { //循环属性
            var attr = attrs[i];
            if (!ieNSBug.test(attr.name)) { //匹配 字符串    xmlns:NS+数字
                attr.name = attr.name.replace(
                                  ieNSPrefix, //匹配 字符串    NS+数字
                    '');
                res.push(attr);
            }
        }
        return res
    }

    //检查指令的命名值 不能为for 或者 for中的遍历的item
    function checkForAliasModel(el, value) {
        var _el = el;
        while (_el) {
            if (_el.for && _el.alias === value) {
                warn$2(
                    "<" + (el.tag) + " v-model=\"" + value + "\">: " +
                    "You are binding v-model directly to a v-for iteration alias. " +
                    "This will not be able to modify the v-for source array because " +
                    "writing to the alias is like modifying a function local variable. " +
                    "Consider using an array of objects and use v-model on an object property instead."
                );
            }
            _el = _el.parent;
        }
    }

    /*  */

    /**
     * Expand input[v-model] with dyanmic type bindings into v-if-else chains
     * 使用dyanmic类型绑定将输入[v-model]展开到v-if-else链中
     * Turn this:
     * 把这个
     *   <input v-model="data[type]" :type="type">
     * into this: 到这个
     *   <input v-if="type === 'checkbox'" type="checkbox" v-model="data[type]">
     *   <input v-else-if="type === 'radio'" type="radio" v-model="data[type]">
     *   <input v-else :type="type" v-model="data[type]">
     *
     */

    // preTransformNode把attrsMap与attrsList属性值转换添加到el   ast虚拟dom中为虚拟dom添加for，alias，iterator1，iterator2，
// addRawAttr ，type ，key， ref，slotName或者slotScope或者slot，component或者inlineTemplate ， plain，if ，else，elseif 属性
    function preTransformNode(
                              el,  //虚拟dom  vonde
                              options
                              ) {
        if (el.tag === 'input') {  //如果是input标签

            var map = el.attrsMap; //获取vonde 所有属性
            if (!map['v-model']) { //如果属性中没有v-model 则不需要执行
                return
            }

            var typeBinding; //类型
            if (map[':type'] || map['v-bind:type']) { //获取类型属性
                typeBinding = getBindingAttr(el, 'type'); //获取类型属性值
            }
            if (!map.type && !typeBinding && map['v-bind']) { //如果获取不到type属性也获取不到v-bind:type属性，可以获取到v-bind属性
                typeBinding = "(" + (map['v-bind']) + ").type"; //获取到v-bind的值，比如v-bind等于abc变成  (abc).type
            }

            if (typeBinding) {         //判断 typeBinding 是否存在
                var ifCondition = getAndRemoveAttr(el, 'v-if', true); //获取v-if值
                var ifConditionExtra = ifCondition ? ("&&(" + ifCondition + ")") : ""; //判断if是否有值比如v-if="flag" 如果有 变成   &&(flag)
                var hasElse = getAndRemoveAttr(el, 'v-else', true) != null; //获取 v-else 属性值 标志 如果有有 可能是 ''   ，  ''!= null 为真
                var elseIfCondition = getAndRemoveAttr(el, 'v-else-if', true); //获取v-else-if 的值
                // 1. checkbox   克隆 创建 checkbox ast 元素
                var branch0 = cloneASTElement(el);
                // process for on the main node
                //判断获取v-for属性是否存在如果有则转义 v-for指令 把for，alias，iterator1，iterator2属性添加到虚拟dom中
                processFor(branch0);

                //添加type 属性 值为checkbox
                addRawAttr(branch0, 'type', 'checkbox');

                //校验属性的值，为el添加muted， events，nativeEvents，directives，  key， ref，slotName或者slotScope或者slot，component或者inlineTemplate 标志 属性
                processElement(branch0, options);

                branch0.processed = true; // prevent it from double-processed 防止它被重复处理
                branch0.if = "(" + typeBinding + ")==='checkbox'" + ifConditionExtra; //     ifConditionExtra 是 判断if是否有值比如v-if="flag" 如果有 变成   &&(flag)  最终合并成  ((abc).type)===checkbox&&(flag)
                //为if指令添加标记
                addIfCondition(
                    branch0,  //虚拟dom
                    {
                        exp: branch0.if, //if指令的标志
                        block: branch0 //虚拟dom
                    }
                );
                // 2. add radio else-if condition 添加radio else-if条件
                //克隆 创建 radio ast 元素
                var branch1 = cloneASTElement(el);

                //删除v-for 属性
                getAndRemoveAttr(branch1, 'v-for', true);

               //添加type 属性
                addRawAttr(branch1, 'type', 'radio');

                //校验属性的值，为el 虚拟dom添加muted， events，nativeEvents，directives，  key， ref，slotName或者slotScope或者slot，component或者inlineTemplate 标志 属性
                processElement(branch1, options);
                //为if指令添加标记
                addIfCondition(branch0, {
                    exp: "(" + typeBinding + ")==='radio'" + ifConditionExtra,
                    block: branch1
                });
                // 3. other  克隆 创建   ast 元素
                var branch2 = cloneASTElement(el);
                //删除v-for属性
                getAndRemoveAttr(branch2, 'v-for', true);
               //添加:type 属性
                addRawAttr(branch2, ':type', typeBinding);
                //校验属性的值，为el添加muted， events，nativeEvents，directives，  key， ref，slotName或者slotScope或者slot，component或者inlineTemplate 标志 属性
                processElement(branch2, options);
                //为if指令添加标记
                addIfCondition(
                    branch0,
                    {
                    exp: ifCondition, //v-if 属性值
                    block: branch2 //ast元素 需要渲染的ast子组件
                    }
                );

                  //判断是else还是elseif
                if (hasElse) {
                    branch0.else = true;
                } else if (elseIfCondition) {
                    branch0.elseif = elseIfCondition;
                }
                 //返回转换过虚拟dom的对象值
                return branch0
            }
        }
    }

    function cloneASTElement(el) {
        //转换属性，把数组属性转换成对象属性，返回对象 AST元素
        return createASTElement(
            el.tag, //标签
            el.attrsList.slice(), //变成真正的数组
            el.parent //父层节点
        )
    }

    var model$2 = {
        preTransformNode: preTransformNode
    }

    var modules$1 = [
        klass$1, // class 转换函数
        style$1, //style 转换函数
        model$2 //把attrsMap与attrsList属性值转换添加到el   ast虚拟dom中为虚拟dom添加for，alias，iterator1，iterator2，addRawAttr ，type ，key， ref，slotName或者slotScope或者slot，component或者inlineTemplate ， plain，if ，else，elseif 属性
    ]

    /*
     *为虚拟dom添加textContent 属性
     * */
    function text(el, dir) {
        if (dir.value) {
            addProp(
                el,
                'textContent',
                ("_s(" + (dir.value) + ")")
            );
        }
    }

    /*
      * 为虚拟dom添加innerHTML 属性
       * */
    function html(el, dir) {
        if (dir.value) {
            addProp(el, 'innerHTML', ("_s(" + (dir.value) + ")"));
        }
    }

    var directives$1 = {
        model: model, //根据判断虚拟dom的标签类型是什么？给相应的标签绑定 相应的 v-model 双数据绑定代码函数
        text: text, // 为虚拟dom添加textContent 属性
        html: html//  为虚拟dom添加innerHTML 属性
    }

    /*
     * 为虚拟dom添加基本需要的属性

     modules=modules$1=[
                     {       // class 转换函数
                             staticKeys: ['staticClass'],
                             transformNode: transformNode,
                             genData: genData
                     },
                     {  //style 转换函数
                             staticKeys: ['staticStyle'],
                             transformNode: transformNode$1,
                             genData: genData$1
                     },
                     {
                        preTransformNode: preTransformNode
                     }
     ]

     *  */
    var baseOptions = {
        expectHTML: true, //标志 是html
        modules: modules$1, //为虚拟dom添加staticClass，classBinding，staticStyle，styleBinding，for，alias，iterator1，iterator2，addRawAttr ，type ，key， ref，slotName或者slotScope或者slot，component或者inlineTemplate ，      plain，if ，else，elseif 属性
        directives: directives$1,// 根据判断虚拟dom的标签类型是什么？给相应的标签绑定 相应的 v-model 双数据绑定代码函数，为虚拟dom添加textContent 属性，为虚拟dom添加innerHTML 属性
        isPreTag: isPreTag, //判断标签是否是pre
        isUnaryTag: isUnaryTag,//匹配标签是否是 'area,base,br,col,embed,frame,hr,img,input,isindex,keygen, link,meta,param,source,track,wbr'
        //校验属性
        /*
         * 1. attr === 'value', tag 必须是 'input,textarea,option,select,progress' 其中一个 type !== 'button'
         * 2. attr === 'selected' && tag === 'option'
         * 3. attr === 'checked' && tag === 'input'
         * 4. attr === 'muted' && tag === 'video'
         * 的情况下为真
         * */
        mustUseProp: mustUseProp,
        canBeLeftOpenTag: canBeLeftOpenTag, //判断标签是否是 'colgroup,dd,dt,li,options,p,td,tfoot,th,thead,tr,source'
        isReservedTag: isReservedTag, //保留标签 判断是不是真的是 html 原有的标签 或者svg标签
        getTagNamespace: getTagNamespace,  //判断 tag 是否是svg或者math 标签
        staticKeys: genStaticKeys(modules$1)    // * 把数组对象 [{ staticKeys:1},{staticKeys:2},{staticKeys:3}]连接数组对象中的 staticKeys key值，连接成一个字符串 str=‘1,2,3’
    };

    console.log('==baseOptions==')
    console.log(baseOptions)




    /*  */

    var isStaticKey;
    var isPlatformReservedTag;

    //匹配type,tag,attrsList,attrsMap,plain,parent,children,attrs +key 字符串
    var genStaticKeysCached = cached(genStaticKeys$1);

    /**
     * Goal of the optimizer: walk the generated template AST tree
     * and detect sub-trees that are purely static, i.e. parts of
     * the DOM that never needs to change.
     *
     * Once we detect these sub-trees, we can:
     *
     * 1. Hoist them into constants, so that we no longer need to
     *    create fresh nodes for them on each re-render;
     * 2. Completely skip them in the patching process.
     * 优化器的目标:遍历生成的模板AST树
     检测纯静态的子树，即
     永远不需要更改的DOM。
     *
     *一旦我们检测到这些子树，我们可以:
     *
     * 1。把它们变成常数，这样我们就不需要了
     *在每次重新渲染时为它们创建新的节点;
     * 2。在修补过程中完全跳过它们。
     *
     *
     * 循环递归虚拟node，标记是不是静态节点
     *  根据node.static或者 node.once 标记staticRoot的状态
     */
    function optimize(root, options) {
        if (!root) {
            return
        }
        //匹配type,tag,attrsList,attrsMap,plain,parent,children,attrs + staticKeys 字符串
        isStaticKey = genStaticKeysCached(options.staticKeys || '');
        //保留标签 判断是不是真的是 html 原有的标签 或者svg标签
        isPlatformReservedTag = options.isReservedTag || no;
        // first pass: mark all non-static nodes.
        ////第一遍:标记所有非静态节点。
        //循环递归虚拟node，标记不是静态节点
        markStatic$1(root);
        // second pass: mark static roots.
        //第二步:标记静态根。
        markStaticRoots(root, false);
    }

    //匹配type,tag,attrsList,attrsMap,plain,parent,children,attrs +key 字符串
    function genStaticKeys$1(keys) {
        return makeMap(
            'type,tag,attrsList,attrsMap,plain,parent,children,attrs' +
            (keys ? ',' + keys : '')
        )
    }
      //循环递归虚拟node，标记不是静态节点
    function markStatic$1(node) {
        node.static = isStatic(node);   //判断是否是静态的ast虚拟dom type必须不等于2和3，pre必须为真
        if (node.type === 1) {
                            // do not make component slot content static. this avoids
                            // 1. components not able to mutate slot nodes
                            // 2. static slot content fails for hot-reloading
                            //不要将组件插槽内容设置为静态。这就避免了
                            // 1。组件无法更改插槽节点
                            // 2。静态插槽内容无法热加载
                            if (
                                !isPlatformReservedTag(node.tag) &&   //保留标签 判断是不是真的是 html 原有的标签 或者svg标签
                                node.tag !== 'slot' &&  //当前标签不等于slot
                                node.attrsMap['inline-template'] == null  // 也不是inline-template    内联模板
                            ) {
                                return
                            }
                            //深递归循环
                            for (var i = 0, l = node.children.length; i < l; i++) {
                                                                                var child = node.children[i];
                                                                                markStatic$1(child);
                                                                                if (!child.static) {
                                                                                                     node.static = false;
                                                                                }
                            }

                            if (node.ifConditions) { //if标记
                                                        for (var i$1 = 1, l$1 = node.ifConditions.length; i$1 < l$1; i$1++) {
                                                            var block = node.ifConditions[i$1].block;  //虚拟dom
                                                            markStatic$1(block);
                                                            if (!block.static) {
                                                                                 node.static = false;
                                                            }
                                                        }
                            }
        }
    }
   //根据node.static或者 node.once 标记staticRoot的状态
    function markStaticRoots(node, isInFor) {
        if (node.type === 1) { //虚拟 dom 节点
            if (
                node.static || //静态节点
                node.once // v-once 只渲染一次节点。
                ) {
                         node.staticInFor = isInFor;
                  }
            // For a node to qualify as a static root, it should have children that
            // are not just static text. Otherwise the cost of hoisting out will
            // outweigh the benefits and it's better off to just always render it fresh.
            //要使一个节点符合静态根的条件，它应该有这样的子节点
            //不仅仅是静态文本。否则，吊装费用将会增加
            //好处大于好处，最好总是保持新鲜。
            if (
                node.static &&  //如果是静态节点
                node.children.length && //如果是有子节点
                !(
                    node.children.length === 1 && //如果只有一个子节点
                    node.children[0].type === 3 //属性节点
                )) {
                            node.staticRoot = true; //标记静态根节点
                            return
                } else {
                             node.staticRoot = false;
                }
                if (node.children) {
                                    for (var i = 0, l = node.children.length; i < l; i++) {
                                                 markStaticRoots(
                                                                 node.children[i],
                                                                 isInFor || !!node.for
                                                                );
                                    }
                }
                if (node.ifConditions) {
                                        for (var i$1 = 1, l$1 = node.ifConditions.length; i$1 < l$1; i$1++) {
                                                      markStaticRoots(
                                                                      node.ifConditions[i$1].block,
                                                                      isInFor
                                                                     );
                                        }
                }
        }
    }
    //判断是否是静态的ast虚拟dom type必须不等于2和3，pre必须为真
    function isStatic(node) {
        if (node.type === 2) { // expression  属性节点 expression
            return false
        }
        if (node.type === 3) { // text 文本节点或者是空注释节点
            return true
        }
        return !!(
            // 跳过这个元素和它的子元素的编译过程。可以用来显示原始 Mustache 标签。跳过大量没有指令的节点会加快编译。 遇到指令不需要编译成模板显示原始指令
            node.pre ||   //标记 标签是否还有 v-pre 指令 ,如果有则为真
                    (
                        !node.hasBindings && // no dynamic bindings // 没有动态标记元素
                        !node.if && !node.for && // not v-if or v-for or v-else 没有 v-if 或者 v-for 或者 v-else
                        !isBuiltInTag(node.tag) && // not a built-in  没有 slot,component
                        isPlatformReservedTag(node.tag) && // not a component 不是一个组件   保留标签 判断是不是真的是 html 原有的标签 或者svg标签
                        !isDirectChildOfTemplateFor(node) && //    判断当前ast 虚拟dom 的父标签 如果不是template则返回false，如果含有v-for则返回true
                        Object.keys(node).every(isStaticKey) //node的key必须每一项都符合   匹配type,tag,attrsList,attrsMap,plain,parent,children,attrs + staticKeys 的字符串
                    )
        )
    }

    //  判断当前ast 虚拟dom 的父标签 如果不是template则返回false，如果含有v-for则返回true
    function isDirectChildOfTemplateFor(node) {
        while (node.parent) { //父dom
            node = node.parent;
            if (node.tag !== 'template') { //不是模板 标签
                return false
            }
            if (node.for) { //含有v-for
                return true
            }
        }
        return false
    }

    /*  */

    var fnExpRE = /^([\w$_]+|\([^)]*?\))\s*=>|^function\s*\(/;
    var simplePathRE = /^[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*|\['[^']*?']|\["[^"]*?"]|\[\d+]|\[[A-Za-z_$][\w$]*])*$/;

// KeyboardEvent.keyCode aliases
    var keyCodes = {
        esc: 27,
        tab: 9,
        enter: 13,
        space: 32,
        up: 38,
        left: 37,
        right: 39,
        down: 40,
        'delete': [8, 46]
    };

// KeyboardEvent.key aliases
    var keyNames = {
        esc: 'Escape',
        tab: 'Tab',
        enter: 'Enter',
        space: ' ',
        // #7806: IE11 uses key names without `Arrow` prefix for arrow keys.
        up: ['Up', 'ArrowUp'],
        left: ['Left', 'ArrowLeft'],
        right: ['Right', 'ArrowRight'],
        down: ['Down', 'ArrowDown'],
        'delete': ['Backspace', 'Delete']
    };

// #4868: modifiers that prevent the execution of the listener
// need to explicitly return null so that we can determine whether to remove
// the listener for .once
    var genGuard = function (condition) {
        return ("if(" + condition + ")return null;");
    };

    var modifierCode = {
        stop: '$event.stopPropagation();',
        prevent: '$event.preventDefault();',
        self: genGuard("$event.target !== $event.currentTarget"),
        ctrl: genGuard("!$event.ctrlKey"),
        shift: genGuard("!$event.shiftKey"),
        alt: genGuard("!$event.altKey"),
        meta: genGuard("!$event.metaKey"),
        left: genGuard("'button' in $event && $event.button !== 0"),
        middle: genGuard("'button' in $event && $event.button !== 1"),
        right: genGuard("'button' in $event && $event.button !== 2")
    };

    function genHandlers(
                            events,
                            isNative,
                            warn
                             ) {
                                var res = isNative ? 'nativeOn:{' : 'on:{';
                                for (var name in events) {
                                    res += "\"" + name + "\":" + (genHandler(name, events[name])) + ",";
                                }
                                return res.slice(0, -1) + '}'
                            }

    function genHandler(
                        name,
                        handler
                        ) {
                            if (!handler) {
                                return 'function(){}'
                            }

                            if (Array.isArray(handler)) {
                                return ("[" + (handler.map(function (handler) {
                                    return genHandler(name, handler);
                                }).join(',')) + "]")
                            }

                            var isMethodPath = simplePathRE.test(handler.value);
                            var isFunctionExpression = fnExpRE.test(handler.value);

                            if (!handler.modifiers) {
                                if (isMethodPath || isFunctionExpression) {
                                    return handler.value
                                }
                                /* istanbul ignore if */
                                return ("function($event){" + (handler.value) + "}") // inline statement
                            } else {
                                var code = '';
                                var genModifierCode = '';
                                var keys = [];
                                for (var key in handler.modifiers) {
                                    if (modifierCode[key]) {
                                        genModifierCode += modifierCode[key];
                                        // left/right
                                        if (keyCodes[key]) {
                                            keys.push(key);
                                        }
                                    } else if (key === 'exact') {
                                        var modifiers = (handler.modifiers);
                                        genModifierCode += genGuard(
                                            ['ctrl', 'shift', 'alt', 'meta']
                                                .filter(function (keyModifier) {
                                                    return !modifiers[keyModifier];
                                                })
                                                .map(function (keyModifier) {
                                                    return ("$event." + keyModifier + "Key");
                                                })
                                                .join('||')
                                        );
                                    } else {
                                        keys.push(key);
                                    }
                                }
                                if (keys.length) {
                                    code += genKeyFilter(keys);
                                }
                                // Make sure modifiers like prevent and stop get executed after key filtering
                                if (genModifierCode) {
                                    code += genModifierCode;
                                }
                                var handlerCode = isMethodPath
                                    ? ("return " + (handler.value) + "($event)")
                                    : isFunctionExpression
                                    ? ("return (" + (handler.value) + ")($event)")
                                    : handler.value;
                                /* istanbul ignore if */
                                return ("function($event){" + code + handlerCode + "}")
                            }
    }

    function genKeyFilter(keys) {
        return ("if(!('button' in $event)&&" + (keys.map(genFilterCode).join('&&')) + ")return null;")
    }

    function genFilterCode(key) {
        var keyVal = parseInt(key, 10);
        if (keyVal) {
            return ("$event.keyCode!==" + keyVal)
        }
        var keyCode = keyCodes[key];
        var keyName = keyNames[key];
        return (
            "_k($event.keyCode," +
            (JSON.stringify(key)) + "," +
            (JSON.stringify(keyCode)) + "," +
            "$event.key," +
            "" + (JSON.stringify(keyName)) +
            ")"
        )
    }

    /*  */
    //包装事件
    function on(el, dir) {
        if ("development" !== 'production' && dir.modifiers) {
            warn("v-on without argument does not support modifiers.");
        }
        //包装事件
        el.wrapListeners = function (code) {
            return ("_g(" + code + "," + (dir.value) + ")");
        };
    }

    /*  */
    //包装数据
    function bind$1(el, dir) {
        el.wrapData = function (code) {
            return ("_b(" + code + ",'" + (el.tag) + "'," + (dir.value) + "," + (dir.modifiers && dir.modifiers.prop ? 'true' : 'false') + (dir.modifiers && dir.modifiers.sync ? ',true' : '') + ")")
        };
    }

    /*
     * 基本指令参数
     */
    var baseDirectives = {
        on: on, //包装事件
        bind: bind$1, //包装数据
        cloak: noop //空函数
    }

    /*
    *  扩展指令，on,bind，cloak,方法，
    *  dataGenFns 获取到一个数组，数组中有两个函数genData和genData$1
    * */

    var CodegenState = function CodegenState(options) {
        this.options = options;
        this.warn = options.warn || baseWarn; //警告日志输出函数
        /*
         * 为虚拟dom添加基本需要的属性
             modules=modules$1=[
                                   {       // class 转换函数
                                                 staticKeys: ['staticClass'],
                                                 transformNode: transformNode,
                                                 genData: genData
                                     },
                                     {  //style 转换函数
                                                 staticKeys: ['staticStyle'],
                                                 transformNode: transformNode$1,
                                                 genData: genData$1
                                     },
                                     {
                                                 preTransformNode: preTransformNode
                                     }
                                 ]
         */

        //循环过滤数组或者对象的值，根据key循环 过滤对象或者数组[key]值，如果不存在则丢弃，如果有相同多个的key值，返回多个值的数组
        //这里返回是空
        this.transforms = pluckModuleFunction(options.modules, 'transformCode');

        //获取到一个数组，数组中有两个函数genData和genData$1
        this.dataGenFns = pluckModuleFunction(options.modules, 'genData');
        console.log(this.transforms )
        console.log(this.dataGenFns )
        console.log(options)


        // options.directives= {
        //          model: model, //根据判断虚拟dom的标签类型是什么？给相应的标签绑定 相应的 v-model 双数据绑定代码函数
        //         text: text, // 为虚拟dom添加textContent 属性
        //         html: html//  为虚拟dom添加innerHTML 属性
        // }
        /*
         * 基本指令参数
         */
        // var baseDirectives = {
        //     on: on, //包装事件
        //     bind: bind$1, //包装数据
        //     cloak: noop //空函数
        // }

        // var directives$1 = {
        //     model: model, //根据判断虚拟dom的标签类型是什么？给相应的标签绑定 相应的 v-model 双数据绑定代码函数
        //     text: text, // 为虚拟dom添加textContent 属性
        //     html: html//  为虚拟dom添加innerHTML 属性
        // }
        // 扩展指令，on,bind，cloak,方法
        this.directives = extend(
            extend(
                    {},
                    baseDirectives
                    ),
                    options.directives
        );
        var isReservedTag = options.isReservedTag || no; //保留标签 判断是不是真的是 html 原有的标签 或者svg标签
        //也许是组件
        this.maybeComponent = function (el) {
            return !isReservedTag(el.tag);
        };
        this.onceId = 0;
        //静态渲染方法
        this.staticRenderFns = [];
    };

   //初始化扩展指令，on,bind，cloak,方法， dataGenFns 获取到一个数组，数组中有两个函数genData和genData$1
    //genElement根据el判断是否是组件，或者是否含有v-once，v-if,v-for,是否有template属性，或者是slot插槽，转换style，css等转换成虚拟dom需要渲染的参数函数
    function generate(
                        ast, //ast 对象模板数据
                        options
                 ) {

        // options 参数为
        // 原型中有baseOptions方法
        // {
        //     shouldDecodeNewlines: shouldDecodeNewlines, //flase //IE在属性值中编码换行，而其他浏览器则不会
        //         shouldDecodeNewlinesForHref: shouldDecodeNewlinesForHref, //true chrome在a[href]中编码内容
        //     delimiters: options.delimiters, //改变纯文本插入分隔符。修改指令的书写风格，比如默认是{{mgs}}  delimiters: ['${', '}']之后变成这样 ${mgs}
        //     comments: options.comments //当设为 true 时，将会保留且渲染模板中的 HTML 注释。默认行为是舍弃它们。
        // },
                  //生成状态
    // *  扩展指令，on,bind，cloak,方法，
       // *  dataGenFns 获取到一个数组，数组中有两个函数genData和genData$1
                var state = new CodegenState(options);
        //根据el判断是否是组件，或者是否含有v-once，v-if,v-for,是否有template属性，或者是slot插槽，转换style，css等转换成虚拟dom需要渲染的参数函数
        var code = ast ? genElement(ast, state) : '_c("div")';
                console.log({
                    render: ("with(this){return " + code + "}"),
                    staticRenderFns: state.staticRenderFns
                })

                return {
                    //with 绑定js的this 缩写
                    render: ("with(this){return " + code + "}"),
                    staticRenderFns: state.staticRenderFns //空数组
                }
    }

  //根据el判断是否是组件，或者是否含有v-once，v-if,v-for,是否有template属性，或者是slot插槽，转换style，css等转换成虚拟dom需要渲染的参数函数
    function genElement(
        el, //ast对象或者虚拟dom
        state //渲染虚拟dom的一些方法
    ) {
        console.log(state)
        console.log(el)



        if (el.staticRoot && !el.staticProcessed) {
            //将子节点导出虚拟dom 渲染函数的参数形式。静态渲染
            return genStatic(el, state)
        } else if (el.once && !el.onceProcessed) {
            //参考文档 https://cn.vuejs.org/v2/api/#v-once
            // v-once
            // 不需要表达式
            // 详细：只渲染元素和组件一次。随后的重新渲染，元素/组件及其所有的子节点将被视为静态内容并跳过。这可以用于优化更新性能
            // <!-- 单个元素 -->
            // <span v-once>This will never change: {{msg}}</span>
            return genOnce(el, state);
        } else if (el.for && !el.forProcessed) {
            // v-for
            //判断标签是否含有v-for属性 解析v-for指令中的参数 并且返回 虚拟dom需要的参数js渲染函数
            return genFor(el, state)
        } else if (el.if && !el.ifProcessed) { //判断标签是否有if属性
            // v-if
            //判断标签是否含有if属性 解析 if指令中的参数 并且返回 虚拟dom需要的参数js渲染函数
            return genIf(el, state)
        } else if (el.tag === 'template' && !el.slotTarget) {
            //标签是模板template
            //获取虚拟dom子节点
            return genChildren(el, state) || 'void 0'
        } else if (el.tag === 'slot') {
            //如果标签是插槽
            return genSlot(el, state)
        } else {
            // component or element
            //组件或元素
            var code;
            if (el.component) { //如果是组件

                //创建一个虚拟dom 的参数渲染的函数
                code = genComponent(
                    el.component,
                    el,
                    state
                );
            } else {

                var data = el.plain ?  //如果标签中没有属性则这个标志为真
                                     undefined :
                                     genData$2(el, state);

                var children = el.inlineTemplate ? //是不是内联模板标签
                                                 null :
                                                 genChildren(el, state, true);
                code = "_c('" + (el.tag) + "'" + (data ? ("," + data) : '') + (children ? ("," + children) : '') + ")";
            }

            // module transforms
            for (var i = 0; i < state.transforms.length; i++) {
                code = state.transforms[i](el, code);
            }
            //返回 虚拟dom需要的参数js渲染函数
            return code
        }
    }

// hoist static sub-trees out 将静态子树吊出
    //将子节点导出虚拟dom 渲染函数的参数形式
    function genStatic(el, state) {
        //标记已经处理过
        el.staticProcessed = true;
        //添加渲染函数
        //genElement根据el判断是否是组件，或者是否含有v-once，v-if,v-for,是否有template属性，或者是slot插槽，转换style，css等转换成虚拟dom需要渲染的参数函数
        state.staticRenderFns.push(("with(this){return " + (genElement(el, state)) + "}"));

        //返回虚拟dom渲染需要的参数格式
        return ("_m(" + (state.staticRenderFns.length - 1) + (el.staticInFor ? ',true' : '') + ")")
    }

// v-once
    //文档https://cn.vuejs.org/v2/api/#v-once
    // v-once
    // 不需要表达式
    // 详细：只渲染元素和组件一次。随后的重新渲染，元素/组件及其所有的子节点将被视为静态内容并跳过。这可以用于优化更新性能。

    function genOnce(el, state) {
        //标志已经处理过的
        el.onceProcessed = true;
        if (el.if && !el.ifProcessed) {
            //判断标签是否含有if属性
            return genIf(el, state)
        } else if (el.staticInFor) {
            var key = '';
            var parent = el.parent;
            while (parent) {
                if (parent.for) {
                    key = parent.key;
                    break
                }
                parent = parent.parent;
            }
            if (!key) {
                "development" !== 'production' && state.warn(
                    "v-once can only be used inside v-for that is keyed. "
                );
                //genElement根据el判断是否是组件，或者是否含有v-once，v-if,v-for,是否有template属性，或者是slot插槽，转换style，css等转换成虚拟dom需要渲染的参数函数
                return genElement(el, state)
            }
            //genElement根据el判断是否是组件，或者是否含有v-once，v-if,v-for,是否有template属性，或者是slot插槽，转换style，css等转换成虚拟dom需要渲染的参数函数
            return ("_o(" + (genElement(el, state)) + "," + (state.onceId++) + "," + key + ")")
        } else {
            //将子节点导出虚拟dom 渲染函数的参数形式
            return genStatic(el, state)
        }
    }

    //判断标签是否含有if属性 解析 if指令中的参数 并且返回 虚拟dom需要的参数js渲染函数
    function genIf(
                   el,  //dom节点
                   state, //状态
                   altGen, // 不知道干嘛的
                   altEmpty // 不知道干嘛的
    ) {
        console.log('==el==')
        console.log(el)

        el.ifProcessed = true; // avoid recursion 标记已经处理过 避免递归
        //el.ifConditions.slice() if条件参数
        //解析 if指令中的参数 并且返回 虚拟dom需要的参数js渲染函数
        return genIfConditions(el.ifConditions.slice(), state, altGen, altEmpty)
    }

    //解析 if指令中的参数 并且返回 虚拟dom需要的参数js渲染函数
    function genIfConditions(
                             conditions, //el 虚拟dom
                             state, //状态
                             altGen, //知道干嘛的
                             altEmpty//知道干嘛的
                           ) {

                            if (!conditions.length) { //如果conditions 不存在 则返回一个空的虚拟dom参数
                                return altEmpty || '_e()'
                            }

                            var condition = conditions.shift();  //取第一个元素
                            console.log('==condition==')
                            console.log(condition)
                            if (condition.exp) {  //判断if指令参数是否存在 如果存在则递归condition.block 数据此时ifProcessed 变为true 下次不会再进来

                                return ("(" + (condition.exp) + ")?" + (genTernaryExp(condition.block)) + ":" + (genIfConditions(conditions, state, altGen, altEmpty)))
                            } else {
                                return ("" + (genTernaryExp(condition.block)))
                            }

                            // v-if with v-once should generate code like (a)?_m(0):_m(1)
                            //如果用v-once生成像(a)?_m(0):_m(1)这样的代码
                            function genTernaryExp(el) {
                                console.log('==altGen==');
                                console.log(altGen);
                                //数据此时ifProcessed 变为true 下次不会再进来
                                return altGen ?
                                    altGen(el, state)  //altGen 一个自定义函数吧
                                    : el.once ?     //静态标签标志 存在么 不存在
                                    genOnce(el, state)  //导出一个静态标签的虚拟dom参数
                                    : genElement(el, state) //递归el 数据此时ifProcessed 变为true 下次不会再进来
                            }
    }

    function genFor(
                    el,   //虚拟dom 节点
                    state, //状态
                    altGen, //函数不知道是什么
                    altHelper //函数不知道是什么
    ) {

        var exp = el.for; //含有for的标签
        var alias = el.alias;  //"item"
        var iterator1 = el.iterator1 ? ("," + (el.iterator1)) : ''; //iterator1  "index" 索引
        var iterator2 = el.iterator2 ? ("," + (el.iterator2)) : ''; //iterator2: "key"

        if ("development" !== 'production' &&
            state.maybeComponent(el) &&
            el.tag !== 'slot' &&
            el.tag !== 'template' && !el.key
        ) {
            state.warn(
                "<" + (el.tag) + " v-for=\"" + alias + " in " + exp + "\">: component lists rendered with " +
                "v-for should have explicit keys. " +
                "See https://vuejs.org/guide/list.html#key for more info.",
                true /* tip */
            );
        }

        el.forProcessed = true; // avoid recursion  标记已经处理过for
        //递归回调
        return (altHelper || '_l') + "((" + exp + ")," +
            "function(" + alias + iterator1 + iterator2 + "){" +
            "return " + ((altGen || genElement)(el, state)) +
            '})'
    }

     //根据判断el是否含有 指令属性,key,ref，refInFor，v-for,pre,component
    function genData$2(el, state) {
        var data = '{';

        // directives first.
        // directives may mutate the el's other properties before they are generated.
        //初始化指令属性参数,把ast对象中的指令属性对象提取出来成数组只保留name和rawName这两个key 比如<div v-info></div> 则变成 directives:[{name:"info",rawName:"v-info"}]
        var dirs = genDirectives(el, state);
        if (dirs) {
            data += dirs + ',';
        }

        // key
        if (el.key) {
            data += "key:" + (el.key) + ",";
        }
        // ref
        if (el.ref) {
            data += "ref:" + (el.ref) + ",";
        }
        if (el.refInFor) {
            data += "refInFor:true,";
        }
        // pre
        if (el.pre) {
            data += "pre:true,";
        }
        // record original tag name for components using "is" attribute
        if (el.component) {
            data += "tag:\"" + (el.tag) + "\",";
        }
        // module data generation functions
        for (var i = 0; i < state.dataGenFns.length; i++) {
            data += state.dataGenFns[i](el);
        }
        // attributes
        if (el.attrs) { //普通属性
            //把props 变成 一个 由 字符串对象数组
            // name1:value1,name2:value2,name3:value3
            data += "attrs:{" + (genProps(el.attrs)) + "},";
        }
        // DOM props
        if (el.props) { //props属性
            //把props 变成 一个 由 字符串对象数组
            // name1:value1,name2:value2,name3:value3
            data += "domProps:{" + (genProps(el.props)) + "},";
        }
        // event handlers
        if (el.events) {
            data += (genHandlers(el.events, false, state.warn)) + ",";
        }
        if (el.nativeEvents) {
            data += (genHandlers(el.nativeEvents, true, state.warn)) + ",";
        }
        // slot target
        // only for non-scoped slots
        if (el.slotTarget && !el.slotScope) {
            data += "slot:" + (el.slotTarget) + ",";
        }
        // scoped slots
        if (el.scopedSlots) {
            data += (genScopedSlots(el.scopedSlots, state)) + ",";
        }
        // component v-model
        if (el.model) {
            data += "model:{value:" + (el.model.value) + ",callback:" + (el.model.callback) + ",expression:" + (el.model.expression) + "},";
        }
        // inline-template
        if (el.inlineTemplate) {
            var inlineTemplate = genInlineTemplate(el, state);
            if (inlineTemplate) {
                data += inlineTemplate + ",";
            }
        }
        data = data.replace(/,$/, '') + '}';
        // v-bind data wrap
        if (el.wrapData) {
            data = el.wrapData(data);
        }
        // v-on data wrap
        if (el.wrapListeners) {
            data = el.wrapListeners(data);
        }
        return data
    }
    //初始化指令属性参数,把ast对象中的指令属性对象提取出来成数组只保留name和rawName这两个key 比如<div v-info></div> 则变成 directives:[{name:"info",rawName:"v-info"}]
    function genDirectives(el, state) {
        var dirs = el.directives; //是否是指令
        if (!dirs) {
            return
        }
        var res = 'directives:[';
        var hasRuntime = false;
        var i, l, dir, needRuntime;


        //为虚拟dom 添加一个 指令directives属性 对象
        // addDirective(
        //     el, //虚拟dom vonde
        //     name, //获取 view 原始属性的名称 不包含 v- : @的
        //     rawName,// 获取 view 原始属性的名称 包含 v- : @的
        //     value, // 属性view 属性上的值
        //     arg, // efg:hig 属性名称冒号后面多出来的标签
        //     modifiers
        // );

        console.log(dirs)

        for (i = 0, l = dirs.length; i < l; i++) { //一个虚拟dom可能会有能绑定多个指令
            dir = dirs[i];
            console.log(dir)

            needRuntime = true;
            var gen = state.directives[dir.name];
            console.log(gen)

            if (gen) {
                // compile-time directive that manipulates AST.
                // returns true if it also needs a runtime counterpart.
                // 操作AST的编译时指令。
                // 如果还需要运行时对等项，则返回true。
                needRuntime = !!gen(el, dir, state.warn);
            }
            if (needRuntime) {
                hasRuntime = true;
                res += "{name:\"" + (dir.name) + "\",rawName:\"" + (dir.rawName) + "\"" + (dir.value ? (",value:(" + (dir.value) + "),expression:" + (JSON.stringify(dir.value))) : '') + (dir.arg ? (",arg:\"" + (dir.arg) + "\"") : '') + (dir.modifiers ? (",modifiers:" + (JSON.stringify(dir.modifiers))) : '') + "},";
            }
        }
        if (hasRuntime) {
            res = res.slice(0, -1) + ']'
            console.log(res)

            return res;
        }
    }

    function genInlineTemplate(el, state) {
        var ast = el.children[0];
        if ("development" !== 'production' && (
                el.children.length !== 1 || ast.type !== 1
            )) {
            state.warn('Inline-template components must have exactly one child element.');
        }
        if (ast.type === 1) {
            var inlineRenderFns = generate(ast, state.options);
            return ("inlineTemplate:{render:function(){" + (inlineRenderFns.render) + "},staticRenderFns:[" + (inlineRenderFns.staticRenderFns.map(function (code) {
                return ("function(){" + code + "}");
            }).join(',')) + "]}")
        }
    }

    function genScopedSlots(slots,
                            state) {
        return ("scopedSlots:_u([" + (Object.keys(slots).map(function (key) {
            return genScopedSlot(key, slots[key], state)
        }).join(',')) + "])")
    }

    function genScopedSlot(key,
                           el,
                           state) {
        if (el.for && !el.forProcessed) {
            return genForScopedSlot(key, el, state)
        }
        var fn = "function(" + (String(el.slotScope)) + "){" +
            "return " + (el.tag === 'template'
                ? el.if
                ? ((el.if) + "?" + (genChildren(el, state) || 'undefined') + ":undefined")
                : genChildren(el, state) || 'undefined'
                : genElement(el, state)) + "}";    //genElement根据el判断是否是组件，或者是否含有v-once，v-if,v-for,是否有template属性，或者是slot插槽，转换style，css等转换成虚拟dom需要渲染的参数函数
        return ("{key:" + key + ",fn:" + fn + "}")
    }

    function genForScopedSlot(key,
                              el,
                              state) {
        var exp = el.for;
        var alias = el.alias;
        var iterator1 = el.iterator1 ? ("," + (el.iterator1)) : '';
        var iterator2 = el.iterator2 ? ("," + (el.iterator2)) : '';
        el.forProcessed = true; // avoid recursion
        return "_l((" + exp + ")," +
            "function(" + alias + iterator1 + iterator2 + "){" +
            "return " + (genScopedSlot(key, el, state)) +
            '})'
    }

    //获取虚拟dom子节点
    function genChildren(el,  //dom
                         state, //状态
                         checkSkip, // 布尔值
                         altGenElement,
                         altGenNode
                         ) {
                                    var children = el.children; //子节点
                                    if (children.length) {
                                        var el$1 = children[0];
                                        // optimize single v-for 优化单 v-for。
                                        if (
                                            children.length === 1 &&//如果只有一个子节点
                                            el$1.for &&
                                            el$1.tag !== 'template' && //节点不是template
                                            el$1.tag !== 'slot' //节点不是slot
                                        ) {  //子节点如果只是一个

                                            //altGenElement和genElement是一个函数   传进来参数是el$1, state
                                            return (altGenElement || genElement)(el$1, state)
                                        }

                                        //确定子数组所需的标准化。
                                        // 0:不需要标准化
                                        // 1:需要简单的标准化(可能是1级深嵌套数组)
                                        // 2:需要完全标准化
                                        var normalizationType = checkSkip
                                            ? getNormalizationType(  //如果children.length==0 就返回0，如果如果有for属性存在或者tag等于template或者是slot 则问真就返回1，如果是组件则返回2
                                                                   children, //子节点
                                                                   state.maybeComponent //判断是否是组件
                                                              )
                                                              : 0;
                                        var gen = altGenNode || genNode; //genNode根据node.type 属性不同调用不同的方法,得到不同的虚拟dom渲染方法
                                        return ("[" + (children.map(function (c) {
                                            return gen(c, state);  //genNode根据node.type 属性不同调用不同的方法,得到不同的虚拟dom渲染方法
                                        }).join(',')) + "]" + (normalizationType ? ("," + normalizationType) : ''))
                                    }
                         }

// determine the normalization needed for the children array.
// 0: no normalization needed
// 1: simple normalization needed (possible 1-level deep nested array)
// 2: full normalization needed
//确定子数组所需的标准化。
// 0:不需要标准化
// 1:需要简单的标准化(可能是1级深嵌套数组)
// 2:需要完全标准化
    //如果children.length==0 就返回0，如果如果有for属性存在或者tag等于template或者是slot 则问真就返回1，如果是组件则返回2
    function getNormalizationType(
                                    children,
                                    maybeComponent
                                  ) {
                                    var res = 0;
                                    for (var i = 0; i < children.length; i++) { //循环子节点
                                        var el = children[i];
                                        if (el.type !== 1) { //如果是真是dom则跳过循环
                                            continue
                                        }
                                            //如果有for属性存在或者tag等于template或者是slot 则问真
                                        if (needsNormalization(el) ||
                                            (el.ifConditions && el.ifConditions.some(function (c) { //判断数组中是否存在满足条件的项，只要有一项满足条件，就会返回true。
                                                return needsNormalization(c.block);
                                            }))) {
                                            res = 2;
                                            break
                                        }
                                        if (maybeComponent(el) || //判断是否是组件
                                            (el.ifConditions && el.ifConditions.some(function (c) {//判断数组中是否存在满足条件的项，只要有一项满足条件，就会返回true。
                                                return maybeComponent(c.block);
                                            }))) {
                                            res = 1;
                                        }
                                    }
                                    return res
    }

    //如果for属性存在或者tag等于template或者是slot 则问真
    function needsNormalization(el) {
        return el.for !== undefined || el.tag === 'template' || el.tag === 'slot'
    }

    //根据node.type 属性不同调用不同的方法
    function genNode(node, state) {
        if (node.type === 1) {
            //返回虚拟dom vonde渲染调用的函数
            //genElement根据el判断是否是组件，或者是否含有v-once，v-if,v-for,是否有template属性，或者是slot插槽，转换style，css等转换成虚拟dom需要渲染的参数函数
            return genElement(node, state)
        }
        if (node.type === 3 && node.isComment) {
            //返回虚拟dom vonde渲染调用的函数
            return genComment(node)
        } else {
          //返回虚拟dom vonde渲染调用的函数
            return genText(node)
        }
    }

     //返回虚拟dom vonde渲染调用的函数
    function genText(text) {
        return ("_v(" + (text.type === 2
            ? text.expression // no need for () because already wrapped in _s()
            : transformSpecialNewlines(JSON.stringify(text.text))) + ")")
    }

    //返回虚拟dom vonde渲染调用的函数
    function genComment(comment) {
        return ("_e(" + (JSON.stringify(comment.text)) + ")")
    }

     //返回虚拟dom vonde渲染调用的函数
    function genSlot(el, state) {
        var slotName = el.slotName || '"default"'; //获取slotName 插槽名称
        var children = genChildren(el, state); //获取子节点的虚拟dom渲染 函数
        var res = "_t(" + slotName + (children ? ("," + children) : '');
        var attrs = el.attrs && ("{" + (el.attrs.map(function (a) { //属性
                return ((camelize(a.name)) + ":" + (a.value));
            }).join(',')) + "}");
        var bind$$1 = el.attrsMap['v-bind']; //v-bind属性
        if ((attrs || bind$$1) && !children) {
            res += ",null";
        }
        if (attrs) {
            res += "," + attrs;
        }
        if (bind$$1) {
            res += (attrs ? '' : ',null') + "," + bind$$1;
        }
        return res + ')'
    }

// componentName is el.component, take it as argument to shun flow's pessimistic refinement
    //返回虚拟dom vonde渲染调用的函数
    function genComponent(
                         componentName, //组件名称
                          el,
                          state
                           ) {
        var children = el.inlineTemplate ? null : genChildren(el, state, true);
        return ("_c(" + componentName + "," + (genData$2(el, state)) + (children ? ("," + children) : '') + ")")
    }


    //把props 变成 一个 由 字符串对象数组
    // name1:value1,name2:value2,name3:value3
    function genProps(props) {
        var res = '';
        for (var i = 0; i < props.length; i++) {
            var prop = props[i];
            /* istanbul ignore if */
            {
                res += "\"" + (prop.name) + "\":" + (transformSpecialNewlines(prop.value)) + ",";
            }
        }
        //去除最后一位字符串
        return res.slice(0, -1)
    }


    /*
     \u2028	 	行分隔符	行结束符
     \u2029	 	段落分隔符	行结束符
     这个编码为2028的字符为行分隔符，会被浏览器理解为换行，而在Javascript的字符串表达式中是不允许换行的，从而导致错误。
     把特殊字符转义替换即可，代码如下所示：
     str = str.Replace("\u2028", "\\u2028");
     */
    function transformSpecialNewlines(text) {
        return text
            .replace(/\u2028/g, '\\u2028')
            .replace(/\u2029/g, '\\u2029')
    }

    /*  */

// these keywords should not appear inside expressions, but operators like 这些关键字不应该出现在表达式中，但是操作符喜欢
// typeof, instanceof and in are allowed 允许使用类型of、instanceof和in
    //匹配 配有全局匹配 只会匹配到一个
    // do,if,for,let,new,try,var,case,else,with,await,break,catch,class,const,' +
    // 'super,throw,while,yield,delete,export,import,return,switch,default,' +
    // 'extends,finally,continue,debugger,function,arguments
    //匹配是否含有 'do,if,for,let,new,try,var,case,else,with,await,break,catch,class,const,' +
    // 'super,throw,while,yield,delete,export,import,return,switch,default,' +
    // 'extends,finally,continue,debugger,function,arguments'
    var prohibitedKeywordRE = new RegExp('\\b' + (
            'do,if,for,let,new,try,var,case,else,with,await,break,catch,class,const,' +
            'super,throw,while,yield,delete,export,import,return,switch,default,' +
            'extends,finally,continue,debugger,function,arguments'
        ).split(',').join('\\b|\\b') + '\\b');

// these unary operators should not be used as property/method names 这些一元运算符不应该用作属性/方法名
    // 匹配 delete (任何字符) 或  typeof (任何字符) 或  void (任何字符)
    var unaryOperatorsRE = new RegExp('\\b' + (
            'delete,typeof,void'
        ).split(',').join('\\s*\\([^\\)]*\\)|\\b') + '\\s*\\([^\\)]*\\)');


// strip strings in expressions 在表达式中剥离字符串
    //判断是否是真正的字符串
    var stripStringRE = /'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*\$\{|\}(?:[^`\\]|\\.)*`|`(?:[^`\\]|\\.)*`/g;

    //'([^'\\]|\\.)*'　''内的若干字符
    //|
    //"([^"\\]|\\.)*" ""内的若干字符
    //|
    // `(?:[^`\\]|\\.)* \$\{|\}(?:[^`\\]|\\.)*`  `字符和${字符}和字符`
    //|
    //`([^`\\]|\\.)*`　`和`之间的若干字符


// detect problematic expressions in a template
    //检测模板中有问题的表达式
    function detectErrors(ast) {
        var errors = [];
        if (ast) {
            //检查模板中的表达式
            checkNode(ast, errors);
        }
        return errors
    }

    //检测 模板指令 把字符串变成真正的js是否有报错
    function checkNode(node, errors) {
        //node
        // 元素element   1
        // 属性attr   2
        // 文本text   3
        if (node.type === 1) { //text 节点类型，相当于在dom点中的空白区域
            //attrsMap 节点记录属性的对象
            for (var name in node.attrsMap) {
                if (dirRE.test(name)) {  //  var dirRE = /^v-|^@|^:/;  判断属性开头是否为 v- @ : 等 //如果是vue 中的属性则抽离出来
                    var value = node.attrsMap[name];   //获取属性名称
                    if (value) {
                        if (name === 'v-for') {  //如果是v-for
                            checkFor(node, ("v-for=\"" + value + "\""), errors);  //检查字符串模板 转换成js是否有报错
                        } else if (onRE.test(name)) {  // var onRE = /^@|^v-on:/; 匹配@开头 或者是v-on: 开头
                            //检查事件是否含有关键词 type void delete 并且不是$开头的 收集错误信息
                            checkEvent(value, (name + "=\"" + value + "\""), errors);
                        } else {
                            //检查字符串转成真正js的时候是否会报错 可以替代eval()
                            checkExpression(value, (name + "=\"" + value + "\""), errors);
                        }
                    }
                }
            }
            if (node.children) { //如果有子节点则递归
                for (var i = 0; i < node.children.length; i++) {
                    //递归子节点 检查子节点
                    checkNode(node.children[i], errors);
                }
            }
        } else if (node.type === 2) {
            //检查属性 字符串转成真正js的时候是否会报错 可以替代eval()
            checkExpression(node.expression, node.text, errors);
        }
    }

    //检查事件，去除掉模板字符串，匹配是否含有delete (任何字符) 或  typeof (任何字符) 或  void (任何字符) 关键词，检查字符串开头是否含有$
    function checkEvent(exp, text, errors) {
        var stipped = exp.replace(stripStringRE, ''); //去除掉模板字符串
        var keywordMatch = stipped.match(unaryOperatorsRE); //匹配是否含有delete (任何字符) 或  typeof (任何字符) 或  void (任何字符) 关键词
        //判断匹配到的 字符串 开头是否是$ 开头的
        if (keywordMatch && stipped.charAt(keywordMatch.index - 1) !== '$') {
            errors.push(
                "avoid using JavaScript unary operator as property name: " +
                "\"" + (keywordMatch[0]) + "\" in expression " + (text.trim())
            );
        }
        //字符串转成真正js的时候是否会报错 可以替代eval()
        checkExpression(exp, text, errors);
    }

    //检查 for
    function checkFor(node,  //节点
                      text,  //for的text    "(itme,index) in list"
                      errors //错误信息
    ) {

        //检查字符串 转成真正的js的时候是否会报错
        checkExpression(node.for || '', text, errors);

        //检查 new Function(("var " + ident + "=_")); 是否会报错  相当于 var str = _;
        checkIdentifier(node.alias, 'v-for alias', text, errors);

        checkIdentifier(node.iterator1, 'v-for iterator', text, errors);

        checkIdentifier(node.iterator2, 'v-for iterator', text, errors);

    }

//检查var a ='_' 或者 检查var a =_  是否会报错  new function  用来检测js错误 与eval差不多
    function checkIdentifier(ident, //识别
                             type,  //类型
                             text,  //为本
                             errors  //错误信息
    ) {
        if (typeof ident === 'string') {
            try {
                new Function(("var " + ident + "=_"));  //检查var a ='_' 或者 检查var a =_  是否会报错  new function  用来检测js错误 与eval差不多
            } catch (e) {
                errors.push(("invalid " + type + " \"" + ident + "\" in expression: " + (text.trim())));
            }
        }
    }

    // new function  用来检测js错误 可以替代eval() 字符转换js检查  字符串变量指向Function，防止有些前端编译工具报错
    function checkExpression(exp, text, errors) {
        try {
            // new function  用来检测js错误 可以替代eval() 字符转换js检查  字符串变量指向Function，防止有些前端编译工具报错
            new Function(("return " + exp));
        } catch (e) {
            //把里面的字符串替换成空的
            //然后在匹配
            // 'do,if,for,let,new,try,var,case,else,with,await,break,catch,class,const,' +
            // 'super,throw,while,yield,delete,export,import,return,switch,default,' +
            // 'extends,finally,continue,debugger,function,arguments' 这些关键词
            var keywordMatch = exp.replace(stripStringRE, '').match(prohibitedKeywordRE);

            if (keywordMatch) {  //收集错误信息
                errors.push(
                    "avoid using JavaScript keyword as property name: " +
                    "\"" + (keywordMatch[0]) + "\"\n  Raw expression: " + (text.trim())
                );
            } else {
                errors.push(
                    "invalid expression: " + (e.message) + " in\n\n" +
                    "    " + exp + "\n\n" +
                    "  Raw expression: " + (text.trim()) + "\n"
                );
            }
        }
    }

    /*
     *
     * 创建一个函数
     * */
    //把字符串 转成真正的js 并且以一个函数形式导出去
    function createFunction(code, errors) {
        try {
            return new Function(code)
        } catch (err) {
            errors.push({err: err, code: code});
            return noop
        }
    }


    //创建编译函数
    /*********************************************************************************
       *Function: createCompileToFunctionFn 
       * Description： 函数科里化  创建一个对象，并且把字符串转换成 对象函数方式存在在对象中，导出去匿名函数
       *Calls:  
       *Called By:  //调用本函数的清单
       *Input: template 模板字符串  options参数   vm vnode节点 
       *Return: function  返回一个匿名函数
     **********************************************************************************/
    function createCompileToFunctionFn(compile) {

        //创建一个空的对象
        var cache = Object.create(null);
        //函数科里化
        // 把字符串 编译变成 真正的js 并且以对象函数方式导出去
        /*********************************************************************************
           *Function: compileToFunctions 
           * Description： 把字符串 编译变成 真正的js 并且以对象函数方式导出去 
           *Calls:  
           *Called By:  
           *Input: template 模板字符串  options参数   vm vnode节点 
           *Return:  object  对象函数 //函数返回值的说明
         **********************************************************************************/
        return function compileToFunctions(
                                           template,  //字符串模板
                                           options, //参数
                                           vm  //vmnode
        ) {
            //浅拷贝参数
            options = extend({}, options);
            //警告
            var warn$$1 = options.warn || warn;
            //删除参数中的警告
            delete options.warn;

            /* istanbul ignore if */
            {
                // detect possible CSP restriction
                try {
                    new Function('return 1');
                } catch (e) {
                    if (e.toString().match(/unsafe-eval|CSP/)) {
                        warn$$1(
                            'It seems you are using the standalone build of Vue.js in an ' +
                            'environment with Content Security Policy that prohibits unsafe-eval. ' +
                            'The template compiler cannot work in this environment. Consider ' +
                            'relaxing the policy to allow unsafe-eval or pre-compiling your ' +
                            'templates into render functions.'
                        );
                    }
                }
            }

            // check cache 拦阻索
            /*
             *这个选项只在完整构建版本中的浏览器内编译时可用。
             * 详细：改变纯文本插入分隔符。
             *
             * 示例：
             new Vue({
             delimiters: ['${', '}']
             })
             // 分隔符变成了 ES6 模板字符串的风格
             *
             * */

            var key = options.delimiters ? String(options.delimiters) + template : template;
            if (cache[key]) {
                return cache[key]
            }

            // compile 传进来的函数
            var compiled = compile(
                template, //模板字符串
                options //参数
            );
            console.log(compiled)


            // check compilation errors/tips
            {
                if (compiled.errors && compiled.errors.length) {
                    warn$$1(
                        "Error compiling template:\n\n" + template + "\n\n" +
                        compiled.errors.map(function (e) {
                            return ("- " + e);
                        }).join('\n') + '\n',
                        vm
                    );
                }
                if (compiled.tips && compiled.tips.length) {
                    compiled.tips.forEach(function (msg) {
                        return tip(msg, vm);
                    });
                }
            }

            // turn code into functions 将代码转换为函数
            var res = {};
            var fnGenErrors = [];
            //将compiled.render创建一个函数，如果发生错误则记录fnGenErrors错误
            //把字符串 转化成真正的js并且以 函数的方式导出去
            res.render = createFunction(
                compiled.render,
                fnGenErrors);
            //字符串转化js 创建一个集合函数
            res.staticRenderFns = compiled.staticRenderFns.map(function (code) {
                return createFunction(code, fnGenErrors)
            });

            // check function generation errors.
            // this should only happen if there is a bug in the compiler itself.
            // mostly for codegen development use
            /* istanbul ignore if */
            //检查函数生成错误。
            //只有在编译器本身存在错误时才应该这样做。
            //主要用于codegen开发
            //伊斯坦布尔忽略如果*/
            {
                if ((!compiled.errors || !compiled.errors.length) && fnGenErrors.length) {
                    warn$$1(
                        "Failed to generate render function:\n\n" +
                        fnGenErrors.map(function (ref) {
                            var err = ref.err;
                            var code = ref.code;

                            return ((err.toString()) + " in\n\n" + code + "\n");
                        }).join('\n'),
                        vm
                    );
                }
            }

            return (cache[key] = res)
        }
    }

    /* 创建编译器
     *
     *把字符串 转化成真正的js函数
     * */

    /*********************************************************************************
       *Function: createCompilerCreator 
       * Description： 函数科里化  创建一个对象，并且把字符串转换成 对象函数方式存在在对象中，导出去匿名函数
       *Input: baseCompile  基本编译函数
       *Return: function   返回一个函数
     **********************************************************************************/
    function createCompilerCreator(
                    baseCompile //基本的编译函数
    ) {

        console.log(baseCompile)


        return function createCompiler(baseOptions) {
           console.log(baseOptions)


            function compile(
                                 template,  //字符串模板
                                 options //options 参数
                             ) {
                                   console.log(options)


                                    //template 模板  options 参数
                                    // 创建一个对象 拷贝baseOptions 拷贝到 原型 protype 中
                                    var finalOptions = Object.create(baseOptions); //为虚拟dom添加基本需要的属性
                                    console.log(finalOptions)
                                    console.log(finalOptions.__proto__)
                                    console.log(finalOptions.property)

                                    var errors = [];
                                    var tips = [];
                                    //声明警告函数
                                    finalOptions.warn = function (msg, tip) {
                                        (tip ? tips : errors).push(msg);
                                    };

                                    if (options) {
                                        console.log(options)

                                        // merge custom modules
                                          //baseOptions中的modules参数为
                                        // modules=modules$1=[
                                        //     {       // class 转换函数
                                        //         staticKeys: ['staticClass'],
                                        //         transformNode: transformNode,
                                        //         genData: genData
                                        //     },
                                        //     {  //style 转换函数
                                        //         staticKeys: ['staticStyle'],
                                        //         transformNode: transformNode$1,
                                        //         genData: genData$1
                                        //     },
                                        //     {
                                        //         preTransformNode: preTransformNode
                                        //     }
                                        // ]



                                        if (options.modules) { //
                                            finalOptions.modules = (baseOptions.modules || []).concat(options.modules);
                                        }
                                        // merge custom directives 合并定制指令
                                        if (options.directives) {
                                            finalOptions.directives = extend(Object.create(baseOptions.directives || null), options.directives);
                                        }
                                        console.log(options)

                                        // options 为：

                                        // comments: undefined
                                        // delimiters: undefined
                                        // shouldDecodeNewlines: false
                                        // shouldDecodeNewlinesForHref: true

                                        // copy other options 复制其他选项
                                        for (var key in options) {
                                            if (key !== 'modules' && key !== 'directives') {
                                                //浅拷贝
                                                finalOptions[key] = options[key];
                                            }
                                        }
                                    }
                                    //参数传进来的函数
                                    //template 模板
                                    //finalOptions 基本参数
                                    var compiled = baseCompile(
                                        template, //template 模板
                                        finalOptions  //finalOptions 基本参数  为虚拟dom添加基本需要的属性
                                    );


                                    {
                                        errors.push.apply(errors, detectErrors(compiled.ast));
                                    }
                                    compiled.errors = errors;
                                    compiled.tips = tips;
                                    return compiled
            }

            /*
             * compile
             *在 render 函数中编译模板字符串。只在独立构建时有效
             var res = Vue.compile('<div><span>{{ msg }}</span></div>')
             new Vue({
             data: {
                 msg: 'hello'
             },
                 render: res.render,
                 staticRenderFns: res.staticRenderFns
             })
             *
             *
             *
             * */
            return {
                compile: compile,
                compileToFunctions: createCompileToFunctionFn(compile)
            }
        }
    }

    /*  */

// `createCompilerCreator` allows creating compilers that use alternative 允许创建使用替代的编译器
// parser/optimizer/codegen, e.g the SSR optimizing compiler. 解析器/优化/ codegen,e。SSR优化编译器。
// Here we just export a default compiler using the default parts. 这里我们只是使用默认部分导出一个默认编译器。

    //编译器创建的创造者
    var createCompiler = createCompilerCreator(

                                                    //把html变成ast模板对象，然后再转换成 虚拟dom 渲染的函数参数形式。
                                                    // 返回出去一个对象
                                                    // {ast: ast, //ast 模板
                                                    // render: code.render, //code 虚拟dom需要渲染的参数函数
                                                    //staticRenderFns: code.staticRenderFns } //空数组

                                                      function baseCompile(
                                                                            template, //string模板
                                                                            options //
                                                                          ) {

                                                            /*
                                                                    template, //模板字符串
                                                                    options 参数为
                                                                            原型中有baseOptions方法
                                                                            {
                                                                            shouldDecodeNewlines: shouldDecodeNewlines, //flase //IE在属性值中编码换行，而其他浏览器则不会
                                                                            shouldDecodeNewlinesForHref: shouldDecodeNewlinesForHref, //true chrome在a[href]中编码内容
                                                                            delimiters: options.delimiters, //改变纯文本插入分隔符。修改指令的书写风格，比如默认是{{mgs}}  delimiters: ['${', '}']之后变成这样 ${mgs}
                                                                            comments: options.comments //当设为 true 时，将会保留且渲染模板中的 HTML 注释。默认行为是舍弃它们。
                                                                            },
                                                                */
                                                                          console.log(options)

                                                                            //返回ast模板对象
                                                                            var ast = parse(template.trim(), options);

                                                                            if (options.optimize !== false) {  //optimize 的主要作用是标记 static 静态节点，
                                                                            // * 循环递归虚拟node，标记是不是静态节点
                                                                            //*  根据node.static或者 node.once 标记staticRoot的状态
                                                                                optimize(ast, options);
                                                                            }
                                                                            //初始化扩展指令，on,bind，cloak,方法， dataGenFns 获取到一个数组，数组中有两个函数genData和genData$1
                                                                            //genElement根据el判断是否是组件，或者是否含有v-once，v-if,v-for,是否有template属性，或者是slot插槽，转换style，css等转换成虚拟dom需要渲染的参数函数
                                                                            //返回对象{ render: ("with(this){return " + code + "}"),staticRenderFns: state.staticRenderFns} //空数组
                                                                             var code = generate(ast, options);

                                                                            return {
                                                                                ast: ast, //ast 模板
                                                                                render: code.render, //code 虚拟dom需要渲染的参数函数
                                                                                staticRenderFns: code.staticRenderFns  //空数组
                                                                            }
                                               });

    /*
     *
     *
     * */
    //创建编译获取编译对象函数
    var ref$1 = createCompiler(baseOptions);
    //执行编译对象函数 compileToFunctions 是一个函数
    var compileToFunctions = ref$1.compileToFunctions;

    /*  */

// check whether current browser encodes a char inside attribute values
    var div;

    //检查a标签是否有href 地址，如果有则渲染a标签，如果没有则渲染div标签
    // 判断标签属性是否是真正的原生属性
    function getShouldDecode(href) {
        div = div || document.createElement('div');
        div.innerHTML = href ? "<a href=\"\n\"/>" : "<div a=\"\n\"/>";
        //html里title属性换行的方法： &#10;  <div title="123& #10;456">text</div>
        return div.innerHTML.indexOf('&#10;') > 0
    }

// #3663: IE encodes newlines inside attribute values while other browsers don't
    //IE在属性值中编码换行，而其他浏览器则不会
    var shouldDecodeNewlines = inBrowser ? getShouldDecode(false) : false;
// #6828: chrome encodes content in a[href]
    //chrome在a[href]中编码内容
    var shouldDecodeNewlinesForHref = inBrowser ? getShouldDecode(true) : false;

    /*
     *
     *   * aFn 函数会多次调用 里面就能体现了
     *  用对象去缓存记录函数
     *  idToTemplate 是一个函数，根据key值来 取值，如果第二次的key还是一样则从对象中取值，而不是重新在执行一次函数
     * */

    var idToTemplate = cached(function (id) {
        var el = query(id);
        return el && el.innerHTML
    });


    var mount = Vue.prototype.$mount; //缓存上一次的Vue.prototype.$mount

    // Vue 的$mount()为手动挂载，
    // 在项目中可用于延时挂载（例如在挂载之前要进行一些其他操作、判断等），之后要手动挂载上。
    // new Vue时，el和$mount并没有本质上的不同。

    Vue.prototype.$mount = function (el, hydrating) { //重写Vue.prototype.$mount

        el = el && query(el); //获取dom
        /* istanbul ignore if */
        //如果el 是body 或者文档 则警告
        if (el === document.body || el === document.documentElement) {
            "development" !== 'production' && warn(
                "Do not mount Vue to <html> or <body> - mount to normal elements instead."
            );
            return this
        }
        //获取参数
        var options = this.$options;
        // resolve template/el and convert to render function
        //解析模板/el并转换为render函数
        if (!options.render) {
            //获取模板字符串
            var template = options.template;

            if (template) { //如果有模板

                if (typeof template === 'string') { //模板是字符串

                    //模板第一个字符串为# 则判断该字符串为 dom的id
                    if (template.charAt(0) === '#') {
                        console.log(template)

                        template = idToTemplate(template); //获取字符串模板的innerHtml
                        console.log(template)

                        /* istanbul ignore if */
                        if ("development" !== 'production' && !template) {
                            warn(
                                ("Template element not found or is empty: " + (options.template)),
                                this
                            );
                        }
                    }
                } else if (template.nodeType) { //如果template 是don节点 则获取他的html
                    template = template.innerHTML;
                } else {
                    //如果什么都是不是则发出警告
                    {
                        warn('invalid template option:' + template, this);
                    }
                    return this

                }
            } else if (el) {

                //如果模板没有，dom节点存在则获取dom节点中的html 给模板
                template = getOuterHTML(el);
                console.log(template)

            }
            if (template) {
                /* istanbul ignore if */
                //监听性能监测
                if ("development" !== 'production' && config.performance && mark) {
                    mark('compile');
                }
                //创建模板
                console.log('==options.comments==')
                console.log(options.comments)

                var ref = compileToFunctions(
                    template, //模板字符串
                    {
                        shouldDecodeNewlines: shouldDecodeNewlines, //flase //IE在属性值中编码换行，而其他浏览器则不会
                        shouldDecodeNewlinesForHref: shouldDecodeNewlinesForHref, //true chrome在a[href]中编码内容
                        delimiters: options.delimiters, //改变纯文本插入分隔符。修改指令的书写风格，比如默认是{{mgs}}  delimiters: ['${', '}']之后变成这样 ${mgs}
                        comments: options.comments //当设为 true 时，将会保留且渲染模板中的 HTML 注释。默认行为是舍弃它们。
                    },
                    this
                );
                // res.render = createFunction(compiled.render, fnGenErrors);
                //获取编译函数 是将字符串转化成真正js的函数
                console.log('==ref.render==')
                console.log(ref.render)
                console.log(ref)
                console.log('==ref.render-end==')
                // res.render = createFunction(compiled.render, fnGenErrors);
                // //字符串转化js 创建一个集合函数
                // res.staticRenderFns = compiled.staticRenderFns.map(function (code) {
                //     return createFunction(code, fnGenErrors)
                // });



                // ast: ast, //ast 模板
                //render: code.render, //code 虚拟dom需要渲染的参数函数
                //staticRenderFns: code.staticRenderFns  //空数组

                //这样赋值可以有效地 防止 引用按地址引用，造成数据修改而其他对象也修改问题，
                var render = ref.render;
                var staticRenderFns = ref.staticRenderFns;

              /*
               render 是  虚拟dom，需要执行的编译函数 类似于这样的函数
               (function anonymous( ) {
                    with(this){return _c('div',{attrs:{"id":"app"}},[_c('input',{directives:[{name:"info",rawName:"v-info"},{name:"data",rawName:"v-data"}],attrs:{"type":"text"}}),_v(" "),_m(0)])}
                 })
               */
                options.render = render;
                options.staticRenderFns = staticRenderFns;
                console.log(options);
                console.log(options.render);

                /* istanbul ignore if */
                if ("development" !== 'production' && config.performance && mark) {
                    mark('compile end');
                    measure(("vue " + (this._name) + " compile"), 'compile', 'compile end');
                }
            }
        }
        console.log(render)
        console.log(el)
        console.log(hydrating)


        //执行$mount方法 一共执行了两次 第一次是在9000多行那一个  用$mount的方法把扩展挂载到dom上
        return mount.call(
                            this,
                            el, //真实的dom
                            hydrating //undefined
                          )
    };

    /**
     * Get outerHTML of elements, taking care
     * of SVG elements in IE as well.
     *获取 dom的html    //outerHTML  输出当前标签的本身和标签内的文本内容，如果有子标签，那么子标签本身和标签内的文本内容也将一起输出
     */
    function getOuterHTML(el) {
        if (el.outerHTML) { //
            return el.outerHTML
        } else {
            //创建一个div节点 并且 包裹着el
            var container = document.createElement('div');
            container.appendChild(el.cloneNode(true));
            return container.innerHTML
        }
    }

    Vue.compile = compileToFunctions;

    return Vue;


})));
