#   begin

 vue source code spare time to see almost a year, before looking for posts on the Internet, found that many posts are very scattered, are part of a part said, a lot of chapters, so they decided to see line by line, after their own persistence and efforts, now basically read. This vue source line by line analysis, I basically every line on the annotation, plus the whole framework of the process mind map, is basically a small white can also understand the vue source code.

Said very detailed, inside the source code notes, some are their own years of experience in developing vue, some are their own context program to know, if there are shortcomings can contact me QQ group: 302817612 modification, or send an email to me 281113270@qq.com thank you. If you feel good, please move your little finger to help me click a satr, your support is my motivation.

vue How to see vue source code? In fact, mvvm source code is not as mysterious as imagined, from the beginning of 12 years to the present mvvm development has more than a decade of history, from the previous direct operation of the dom jq development has more than a decade of history, but this decade of historical development, and there is not much change, the idea is still those, the module is still divided into several chunks:

## 1. Template conversion:

Is we write a vue template or react jsx we can understand is a template, and then it will go through the template compilation conversion, like vue is into a method paseHTML method converted into the ast tree, paseHTML inside the while loop template, Then through the RE match to the vue instructions, as well as vue properties, event methods, etc., collected into an ast tree.

## 2. Corresponding data:

vue is a dual data corresponding framework, the underlying use is Object.defineProperty to listen for and hijack data changes, and then call callback methods to update the view update. The principle of dual data binding is as follows: The obersve() method determines whether value has no __ob___ attribute and is not Obersve instantiated, and whether value is Vonde instantiated. If not, it calls Obersve to add the data to the observer and add the __ob__ attribute to the data. Obersve calls the defineReactive method, which is a channel connecting the Dep and wacther methods, and listens for data using the get and set methods in Object.definpropty(). In the get method, new Dep calls depend(). To add a wacther class to dep, watcher has a method to update the view. run calls update to update the vonde and then updates the view. Then the set method is to call the notify method in dep to call the run update view in wacther

## 3. Virtual dom:





vnode, used in vue, is via ast objects, escaped into vonde needs to render functions, such as _c('div' s('')) and such functions, compiled into vonde virtual dom. Then update the data to updata and call __patch__ to turn vonde into a true dom element through diff algorithm.

##   4.diff algorithm:

​    The diff algorithm of vue2 is depth-first traversal, and then the comparison algorithm compares the old vnode with the new vnode, first compares their basic attributes, such as key labels, etc. If they are the same, the diff algorithm compares the old Vnode with the new Vnode, and then there are four pointer indexes. Two new vnode start Pointers and two new vnode end Pointers, two old vnode start Pointers and old vnode end Pointers. Then first determine whether the vnode is empty, if it is empty, move to the center of the start pointer ++ end pointer --. Then after comparing the two sides, cross-compare until you can't find the same vnode, if there are more, delete it, if there are fewer, add it, and then update it to the real dom after comparing.



new Vue calls vue.prototype. _init. From this function, after merging with the $options parameter, initLifecycle initializes the life cycle, marking the initialization event, and initializing the rendering function. The initialization state is the data. Add data to the observer for double data binding.

# new Vue instantiates the program entry

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



# Find and mount templates

 vm.$mount goes to the mount template method and determines whether it has a render function or a template, and if not, uses el.outerHTML, which is essentially getting the html content of the template

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



# Compile the AST and render functions

After you call the Vue.prototype.$mount method and get the template, you enter the following methods, which use a lot of functional programming

```
compileToFunctions

createCompiler

createCompilerCreator

baseCompile

parse

parseHTML

```

The important thing here is that parseHTML is a while (html) {// loop through the html and then through the re match to the vue directive, as well as vue properties, event methods, etc., collected into an ast tree.

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



## Dual data response

The dual data binding entry method is in the defineReactive function, whether it is prop or state or property listener set method or initInjections entry.

First he instantiates var dep = new Dep(); Depending on the collection Dep, the get method adds one

​       //添加一个dep
​                    dep.depend();

​    if (childOb) {  //如果子节点存在也添加一个dep
​                        childOb.dep.depend();
​                        if (Array.isArray(value)) {  //判断是否是数组 如果是数组
​                            dependArray(value);   //则数组也添加dep
​                        }
​                    }



The set method is the trigger for updating the view

//observe Add an observer

// Then add dependencies

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







## Depends on collecting Dep

 In the vue data get, whoever reads the data will collect it. Therefore, dep is a set. When the data is set, the notify method of each dep is triggered by traversing the dep to update through the view
The main function of dep is to act only as a collection, so how do you update the view after collecting the dependencies
So you need to define a new Watcher class that will update the view
Each dependency collected by the dep is actually a Watcher

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

## Data detection Watcher

 Watcher's main function is to interface to the Dep notification, and then call the update method to update the view
The callback is triggered in the update method, and the callback function is actually the generated render function

Upon calling the render function, the values in the function will get the changed value, so a new vnode will be generated
After the new vnode is generated, it is the patch process. The new vnode is compared with the old vnode. Finally, the vnode after comparison is converted into the actual dom and added to the node to which the template is mounted
After the new template is mounted, delete the old template so that the view is updated

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

get is triggered when the Watcher instance constructor executes
After the get is triggered, the Watcher instance is collected
update is the method that is triggered when a Dep notification is received
The run method is called in update
The cb callback method is called inside the run method
The cb back method is actually the template compile-time render method





# Virtual DOM

Virtual DOM in vue actually identifies a dom by defining a Vnode class and adding some dom attributes to the class

The main effect is to reduce the manipulation of the actual dom to reduce the cost of browser performance

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

# diff algorithm

patch, sameVnode, patchVnode, updateChildren these methods

The entry point is patch and then the sameVnode is called

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

If the sameVnode condition is valid, enter the patchVnode method.

The patchVnode method is mainly used to add and delete vnodes and update key. Then determine when neither virtual dom is empty and they are not equal oldCh! == ch enters the updateChildren diff update algorithm.

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



# ddif algorithm updateChildren

diff algorithm, the diff algorithm of vue2 is a depth-first algorithm for traversal, and then the comparison algorithm compares the old vnode with the new vnode, first compares their basic attributes, such as key labels, etc. If they are the same, the diff algorithm compares the old Vnode with the new Vnode, and then has four pointer indexes. Two new vnode start Pointers and two new vnode end Pointers, two old vnode start Pointers and old vnode end Pointers. Then first determine whether the vnode is empty, if it is empty, move to the center of the start pointer ++ end pointer --. Then, after comparing the two sides, cross-compare until the same vnode is not found. If there are more Vnodes, delete them; if there are fewer, add them. After comparing, call patchVnode to add or delete virtual dom. Then if there are Vnodes that are not the same, updateChildren is called, so deep recursion, also called depth-first search, is done, and then the child Vnodes are not updated to the real dom.

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

Specifically look at my source code and flow chart, here the text does not describe so much, the flow chart is the following network disk, source code is vue.js, basically every line has comments

link：https://pan.baidu.com/s/10IxV6mQ2TIwkRACKu2T0ng 
password：1fnu 

The above vue.js is my vue.js based on each line of vue source code with comments, and the other files are the vue.js source code small demo that I pulled out when I looked at Vue.js source code. If you feel good, please move your little finger to help me click a satr, your support is my motivation，thank you



Author: Yao Guanshou





I've been unemployed recently and I'm looking for a front-end development job. I hope any friends whose companies are recruiting can contact me. Thank you. The location can be Shenzhen or remote. Front-end architecture, senior front-end development, and team leader positions are all fine. My wechat: 18529531779, helloTalk account @18529531779, email: 281113270@qq.com, thank you.
