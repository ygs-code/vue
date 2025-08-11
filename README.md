 ***English document***: https://github.com/ygs-code/vue/blob/master/README_EN.md
#   开始

 vue源码业余时间差不多看了一年，以前在网上找帖子，发现很多帖子很零散，都是一部分一部分说，断章的很多，所以自己下定决定一行行看，经过自己坚持与努力，现在基本看完了   。这个vue源码逐行分析，我基本每一行都打上注释，加上整个框架的流程思维导图，基本上是小白也能看懂的vue源码了。

   说的非常的详细，里面的源码注释，有些是自己多年开发vue经验而获得的，有些是自己跑上下文程序知道的， 如果有不足的地方可以联系我QQ群 ：302817612  修改，或者发邮件给我281113270@qq.com  谢谢。 如果大家觉得不错请动动小手指，帮我点一个satr，你们的支持就是我的动力。

vue 如何去看vue源码呢？其实mvvm源码并没有想象中那么神秘，从12年开始到至今mvvm发展已经有了十几年历史了，从以前直接操作dom的jq发展有十几年历史，但是这十几年历史发展，并没有多大的改变，思想还是那些，模块还是分为几大块：

## 1.模板转换：

 就是我们写的 vue 模板 或者是 react jsx 我们都可以理解是模板，然后他会经过 模板编译转换，像vue的话是进过一个方法paseHTML方法转换成ast树，里面的paseHTML用while 循环模板，然后经过正则 匹配到vue指令，还有vue的属性，事件方法等，收集到一个ast树中。

## 2.数据相应：

 vue是一个双数据相应的框架，底层用的是Object.defineProperty 监听和挟持数据改变，然后调用回调方法更新视图更新。双数据绑定原理是：obersve()方法判断value没有没有__ob___属性并且是不是Obersve实例化的，  value是不是Vonde实例化的，如果不是则调用Obersve 去把数据添加到观察者中，为数据添加__ob__属性， Obersve 则调用defineReactive方法，该方法是连接Dep和wacther方法的一个通道，利用Object.definpropty() 中的get和set方法 监听数据。get方法中是new Dep调用depend()。为dep添加一个wacther类，watcher中有个方法是更新视图的是run调用update去更新vonde 然后更新视图。 然后set方法就是调用dep中的notify 方法调用wacther中的run 更新视图

## 3.虚拟dom：

 vnode，在vue用vnode是通过 ast对象，在转义成vonde 需要渲染的函数，比如_c('div'  s(''))  等这类的函数，编译成vonde 虚拟dom。然后到updata更新数据 调用__patch__ 把vonde 通过diff算法变成正真正的dom元素。

##   4.diff算法：

​     vue2 的diff 算法是深度优先算法遍历，然后对比算法是通过 新旧的vnode对比先对比他们的基本属性，比如key 标签等，如果是相同则通过diff算法对比然后diff算法是新旧的vnode对比，然后有四个指针索引，两个新的vnode开始指针和新的 vnode 结束指针，两个旧的vnode开始指针和旧的 vnode 结束指针。然后先判断vnode是否为空，如果为空就往中间靠拢  开始的指针++  结束的指针 --。然后两头对比之后，在交叉对比，直到找不到相同的vnode之后如果多出的就删除，如果少的话就新增，然后对比完之后在更新到真实dom。





源码入口流程 vue源码解读流程 1.new Vue 调用的是 Vue.prototype._init  从该函数开始 经过 $options 参数合并之后 initLifecycle 初始化生命周期标志 初始化事件，初始化渲染函数。初始化状态就是数据。把数据添加到观察者中实现双数据绑定。

# new Vue实例化程序入口

```
 Vue.prototype._init = function (options) { //初始化函数
  //... 省略code
  
    initLifecycle(vm); //初始化生命周期 标志
            initEvents(vm); //初始化事件
            initRender(vm); // 初始化渲染
            callHook(vm, 'beforeCreate'); //触发beforeCreate钩子函数
            initInjections(vm); // resolve injections before data/props 在数据/道具之前解决注入问题 //初始化 inject
            initState(vm);  //    //初始化状态
            initProvide(vm); // resolve provide after data/props  解决后提供数据/道具  provide 选项应该是一个对象或返回一个对象的函数。该对象包含可注入其子孙的属性，用于组件之间通信。
            callHook(vm, 'created'); //触发created钩子函数
  
  
  //... 省略code
    // 然后挂载模板，这里大概就是把模板转换成ast的入口
    vm.$mount(vm.$options.el);
  
 }
```



# 查找和挂载模板

​    vm.$mount 进入这个挂载模板方法，判断是否有 render 函数 或者是template，如果没有则使用el.outerHTML , 实际上这里就是要拿到模板的html内容

```
 Vue.prototype.$mount = function (el, hydrating) { 
   //... 省略code
       el = el && query(el); //获取dom
         if (!options.render) {
              if (template) {
              
              }else if (template.nodeType) { 
                  template = template.innerHTML;
              } else if (el) {
                template = getOuterHTML(el);
              }
         ｝
          
         
              // render 函数 也是 ast 转换 方法
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
         
         
       
   
     //... 省略code
      //执行$mount方法     用$mount的方法把扩展挂载到dom上
        return mount.call(
            this,
            el, //真实的dom
            hydrating //undefined
        )
 
 ｝
```



# 编译AST和render函数

调用  Vue.prototype.$mount 方法之后 拿到模板之后 就会进入以下这几个方法，这几个方法用了很多函数式编程

```
compileToFunctions

createCompiler

createCompilerCreator

baseCompile

parse

parseHTML

```

这里比较重点的是parseHTML 他是  while (html) { //循环html 然后 然后经过正则 匹配到vue指令，还有vue的属性，事件方法等，收集到一个ast树中。

```
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
                        console.log(curIndex, index)
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
```



一些匹配模板正则

```
  var onRE = /^@|^v-on:/;//判断是否是 @或者v-on:属性开头的
    var dirRE = /^v-|^@|^:/; //判断是否是 v-或者@或者:  属性开头的
    var forAliasRE = /([^]*?)\s+(?:in|of)\s+([^]*)/; //匹配 含有   字符串 in  字符串   或者  字符串 of  字符串
    var forIteratorRE = /,([^,\}\]]*)(?:,([^,\}\]]*))?$/; //匹配上,  但是属于两边是 [{ , 点 , }]  所以匹配上   ,+字符串
    var stripParensRE = /^\(|\)$/g; //匹配括号 ()

    var argRE = /:(.*)$/; //匹配字符串是否含有:
    var bindRE = /^:|^v-bind:/; //开始匹配是 :或者是v-bind
    var modifierRE = /\.[^.]+/g; // 匹配以点开头的分组 不属于点 data.object.info.age  匹配到 ['.object'，'.info' , '.age']

    var decodeHTMLCached = cached(he.decode);    //获取 真是dom的textContent文本
```



## 双数据响应

 双数据绑定 入口 方法在defineReactive函数中 ，不管是 prop 还是 state 还是 属性监听方法 set 方法，还是initInjections 入口都是这里。

首先他会实例化         var dep = new Dep(); 依赖收集 Dep，get方法会添加一个   

​       //添加一个dep
​                    dep.depend();

​    if (childOb) {  //如果子节点存在也添加一个dep
​                        childOb.dep.depend();
​                        if (Array.isArray(value)) {  //判断是否是数组 如果是数组
​                            dependArray(value);   //则数组也添加dep
​                        }
​                    }



set 方法是触发更新视图的

//observe 添加 观察者

 // 然后在添加依赖

   childOb = !shallow && observe(newVal);
    //更新数据
    dep.notify();



```
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

```







## 依赖收集 Dep

 在vue数据get获取中，谁读取了该数据，就把它收集起来，所以dep是一个集合，在数据set时，通过遍历dep去触发每个dep的notify方法通过视图更新
dep的主要功能是只作为收集，那在收集了依赖后，如何使视图更新呢
所以需要定义一个新的Watcher类，改类是会实现对视图的更新
 dep每收集的一个依赖实际就是一个Watcher

```
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
```

## 数据检测 Watcher

 Watcher的功能主要是接口到Dep的通知，然后调用update方法更新视图
在update方法中会触发回调，回调函数实际就是已生成render函数

在调用render函数是，函数里的值就会获取到已经更改后值，所以就会生成新的vnode
新的vnode生成后，就是patch的过程，用新的vnode与旧的vnode进行比对，最终将比对后的vnode转换为实际的dom添加到模板挂载节点上
新的模板挂载后，将旧的模板删除，这样视图就更新完成

```
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

```

在Watcher实例构造函数执行时，会触发get
触发了get后就会该Watcher实例进行收集
update为接到Dep通知时触发的方法
update内会调用run方法
在run方法内会调用cb回调方法
cb回到方法实际就是模板编译时render方法





# 虚拟DOM

vue中的虚拟DOM,实际就是通过定义一个Vnode类，在该类上添加了dom的一些属性来标识一个dom

主要的作用是降低对实际dom的操作，来减轻对浏览器性能的耗费

```
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
```

# diff算法

patch ，sameVnode， patchVnode ，updateChildren 这几个方法

入口是patch 然后调用sameVnode

```
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
```

如果调用sameVnode 条件成立 则进入patchVnode 方法,

patchVnode 方法主要是对vnode 进行增加和删除，主要还有key更新等。然后 判断 两个虚拟dom都不为空，并且他们不相等的时候oldCh !== ch 就进入updateChildren diff更新算法。

```
  // 对比 虚拟dom
        function patchVnode(
            oldVnode, // 旧的虚拟dom
            vnode,  // 新的虚拟dom
            insertedVnodeQueue,  // 删除虚拟dom队列
            removeOnly
        ) {
            if (oldVnode === vnode) { //如果他们相等
                return
            }

            var elm = vnode.elm = oldVnode.elm; //获取真实的dom

            // 判断是否有isAsyncPlaceholder 属性
            if (isTrue(oldVnode.isAsyncPlaceholder)) {
                //判断数据 是否不等于 undefined或者null
                if (isDef(vnode.asyncFactory.resolved)) {
                    // ssr 渲染
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
            //为静态树重用元素。
            //注意，只有当vnode被克隆时，我们才这样做
            //如果新节点没有克隆，则表示渲染函数已经克隆
            //由hot-reload api重置，我们需要做一个适当的重新渲染。
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
            // 钩子函数
            if (isDef(data) && isDef(i = data.hook) && isDef(i = i.prepatch)) {
                i(oldVnode, vnode);
            }

            var oldCh = oldVnode.children;
            var ch = vnode.children;
            //循环组件实例 是否定义有 tag标签
            if (isDef(data) && isPatchable(vnode)) {
                // 触发钩子函数 更新钩子函数
                for (i = 0; i < cbs.update.length; ++i) {
                    cbs.update[i](oldVnode, vnode);
                }
                // 触发钩子函数
                if (isDef(i = data.hook) && isDef(i = i.update)) {
                    i(oldVnode, vnode);
                }
            }

            //如果是文本虚拟dom
            if (isUndef(vnode.text)) {
                // 两个虚拟dom都存在
                if (isDef(oldCh) && isDef(ch)) {
                    // 如果他们不相等
                    if (oldCh !== ch) {
                        // diff算法更新
                        updateChildren(elm, oldCh, ch, insertedVnodeQueue, removeOnly);
                    }
                } else if (isDef(ch)) {  // 如果是有新的虚拟dom
                    // 如果是文本虚拟dom 则 设置 空
                    if (isDef(oldVnode.text)) {
                        nodeOps.setTextContent(elm, '');
                    }
                    // 添加 vnode
                    addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue);
                } else if (isDef(oldCh)) { // 如果旧的有 新的虚拟dom没有则删除 虚拟dom
                    removeVnodes(elm, oldCh, 0, oldCh.length - 1);
                } else if (isDef(oldVnode.text)) { // 如果是文本虚拟dom则设置文本
                    nodeOps.setTextContent(elm, '');
                }


            } else if (oldVnode.text !== vnode.text) {
                // 如果新旧的文本不相同则设置文本
                nodeOps.setTextContent(elm, vnode.text);
            }
            if (isDef(data)) {
                // 触发钩子
                if (isDef(i = data.hook) && isDef(i = i.postpatch)) {
                    i(oldVnode, vnode);
                }
            }
        }

```



# ddif 算法updateChildren

diff算法，vue2 的diff 算法是深度优先算法遍历，然后对比算法是通过 新旧的vnode对比先对比他们的基本属性，比如key 标签等，如果是相同则通过diff算法对比然后diff算法是新旧的vnode对比，然后有四个指针索引，两个新的vnode开始指针和新的 vnode 结束指针，两个旧的vnode开始指针和旧的 vnode 结束指针。然后先判断vnode是否为空，如果为空就往中间靠拢  开始的指针++  结束的指针 --。然后两头对比之后，在交叉对比，直到找不到相同的vnode之后如果多出的就删除，如果少的话就新增，然后对比完之后 在调用patchVnode去增删虚拟dom。然后如果有vnode不相同在调用updateChildren，这样就做到深层递归，也叫深度优先搜索，然后子vnode没有了在更新到真实dom。 

```

        // ddif 算法
        function updateChildren(
            parentElm,  // 父亲dom
            oldCh,  // 旧的虚拟dom
            newCh,  // 新的虚拟dom
            insertedVnodeQueue,
            removeOnly
        ) {
            var oldStartIdx = 0;  // 旧的虚拟dom开始指针 
            var newStartIdx = 0; // 新的虚拟dom开始指针 
            var oldEndIdx = oldCh.length - 1; // 旧的虚拟dom结束指针 
            var newEndIdx = newCh.length - 1;// 新的虚拟dom结束指针 

            var oldStartVnode = oldCh[0];  // 旧的虚拟dom开始节点
            var newStartVnode = newCh[0]; // 新的虚拟dom开始节点

            var oldEndVnode = oldCh[oldEndIdx]; // 旧的虚拟dom结束节点
            var newEndVnode = newCh[newEndIdx];// 新的虚拟dom结束节点

            var oldKeyToIdx, idxInOld, vnodeToMove, refElm;

            // removeOnly is a special flag used only by <transition-group>
            // to ensure removed elements stay in correct relative positions
            // during leaving transitions
            var canMove = !removeOnly;

            {
                // 检查同一个兄弟节点是否有重复的key，如果有则发出警告日志
                checkDuplicateKeys(newCh);
            }

            /*
            diff 算法开始
              这里diff算法其实就是

            */
            while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {

                if (isUndef(oldStartVnode)) {
                    // 如果旧的开始节点不存在或者为空
                    // 如果旧的开始节点指针往中间偏移
                    oldStartVnode = oldCh[++oldStartIdx]; // Vnode has been moved left
                } else if (isUndef(oldEndVnode)) {
                    // 如果旧的结束节点不存在或者为空
                    // 如果旧的结束节点指针往中间偏移
                    oldEndVnode = oldCh[--oldEndIdx];

                } else if (sameVnode(oldStartVnode, newStartVnode)) {   //sameVnode(oldVnode, vnode)2个节点的基本属性相同，那么就进入了2个节点的diff过程。



                    // 在对比下虚拟dom 
                    patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue);

                    //开始指针 两个都往中间偏移
                    oldStartVnode = oldCh[++oldStartIdx];
                    newStartVnode = newCh[++newStartIdx];

                } else if (sameVnode(oldEndVnode, newEndVnode)) {  //sameVnode(oldVnode, vnode)2个节点的基本属性相同，那么就进入了2个节点的diff过程。
                    // 在对比下虚拟dom 
                    patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue);
                    // 结束指针 两个都往中间偏移
                    oldEndVnode = oldCh[--oldEndIdx];
                    newEndVnode = newCh[--newEndIdx];
                } else if (sameVnode(oldStartVnode, newEndVnode)) { // Vnode moved right  //sameVnode(oldVnode, vnode)2个节点的基本属性相同，那么就进入了2个节点的diff过程。

                    // 交叉对比 深度优先算法入口
                    patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue);
                    // 交叉对比
                    canMove && nodeOps.insertBefore(parentElm, oldStartVnode.elm, nodeOps.nextSibling(oldEndVnode.elm));

                    oldStartVnode = oldCh[++oldStartIdx];
                    newEndVnode = newCh[--newEndIdx];
                } else if (sameVnode(oldEndVnode, newStartVnode)) { // Vnode moved left
                    // 交叉对比
                    patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue);
                    // 交叉对比
                    canMove && nodeOps.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm);
                    oldEndVnode = oldCh[--oldEndIdx];
                    newStartVnode = newCh[++newStartIdx];
                } else {
                    // 如果没有key 则给塔新的key
                    if (isUndef(oldKeyToIdx)) {

                        // 创建key 如果没有key 则用索引作为key
                        oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx);
                    }
                    
                    // 获取 旧的vnode key
                    idxInOld = isDef(newStartVnode.key)
                        ? oldKeyToIdx[newStartVnode.key]
                          // 查找旧的vnode key
                        : findIdxInOld(newStartVnode, oldCh, oldStartIdx, oldEndIdx);
                        // 如果旧的 vnode key 未定义则创建新的真实dom
                    if (isUndef(idxInOld)) { // New element
                         //创建真实 dom 节点
                        createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx);
                    } else {

                        vnodeToMove = oldCh[idxInOld];
                        if (sameVnode(vnodeToMove, newStartVnode)) {
                            // 对比虚拟dom
                            patchVnode(vnodeToMove, newStartVnode, insertedVnodeQueue);
                            
                            oldCh[idxInOld] = undefined;
                            // 真实节点交换
                            canMove && nodeOps.insertBefore(parentElm, vnodeToMove.elm, oldStartVnode.elm);
                        } else {
                            // same key but different element. treat as new element
                            // 创建真实dom
                            createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx);
                        }
                    }
                    newStartVnode = newCh[++newStartIdx];
                }
            }
            if (oldStartIdx > oldEndIdx) {
                refElm = isUndef(newCh[newEndIdx + 1]) ? null : newCh[newEndIdx + 1].elm;
                // 添加虚拟dom
                addVnodes(parentElm, refElm, newCh, newStartIdx, newEndIdx, insertedVnodeQueue);
            } else if (newStartIdx > newEndIdx) {
                // 删除虚拟dom
                removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx);
            }
        }

```

具体看我源码和流程图，这里文字就不描述这么多了，流程图是下面这中的网盘，源码是vue.js,基本每一行都有注释

链接：https://pan.baidu.com/s/10IxV6mQ2TIwkRACKu2T0ng 
提取码：1fnu 


上面的vue.js 就是我基于vue源码中每行加有注释的vue.js, 其他文件就是我看vue.js源码的时候抽出来的vue.js 源码小demo。如果大家觉得不错请动动小手指，帮我点一个satr，你们的支持就是我的动力

 

 作者：姚观寿



最近失业了，想找一份前端开发工作，希望有朋友公司招聘的可以联系下我，谢谢你们，地点 深圳，或者远程都可以，前端构架，前端高级开发，组长职位都行。 我微信：18529531779  ，  helloTalk 号@18529531779，邮箱：281113270@qq.com 谢谢了。
