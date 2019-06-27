



   vue源码业余时间差不多看了一年，以前在网上找帖子，发现很多帖子很零散，都是一部分一部分说，断章的很多，所以自己下定决定一行行看，经过自己坚持与努力，现在基本看完了，差diff那部分，因为考虑到自己要换工作了，所以暂缓下来先，diff那块后期我会补上去。这个vue源码逐行分析，我基本每一行都打上注释，加上整个框架的流程思维导图，基本上是小白也能看懂的vue源码了。
     
   说的非常的详细，里面的源码注释，有些是参考网上帖子的，有些是自己多年开发vue经验而猜测的，有些是自己跑上下文程序知道的，本人水平可能有限，不一定是很正确，如果有不足的地方可以联系我QQ群 ：302817612  修改，或者发邮件给我281113270@qq.com  谢谢。 

   1.vue源码解读流程 1.new Vue 调用的是 Vue.prototype._init  从该函数开始 经过 $options 参数合并之后 initLifecycle 初始化生命周期标志 初始化事件，初始化渲染函数。初始化状态就是数据。把数据添加到观察者中实现双数据绑定。

   2.双数据绑定原理是：obersve()方法判断value没有没有__ob___属性并且是不是Obersve实例化的，
   value是不是Vonde实例化的，如果不是则调用Obersve 去把数据添加到观察者中，为数据添加__ob__属性， Obersve 则调用defineReactive方法，该方法是连接Dep和wacther方法的一个通道，利用Object.definpropty() 中的get和set方法 监听数据。get方法中是new Dep调用depend()。为dep添加一个wacther类，watcher中有个方法是更新视图的是run调用update去更新vonde 然后更新视图。 然后set方法就是调用dep中的notify 方法调用wacther中的run 更新视图
 3.vue从字符串模板怎么到真实的dom呢？是通过$mount挂载模板，就是获取到html，然后通过paseHTML这个方法转义成ast模板，他大概算法是 while(html) 如果匹配到开始标签，结束标签，或者是属性，都会截取掉html，然后收集到一个对象中，知道循环结束 html被截取完。最后变成一个ast对象，ast对象好了之后，在转义成vonde 需要渲染的函数，比如_c('div'  s(''))  等这类的函数，编译成vonde 虚拟dom。然后到updata更新数据 调用__patch__ 把vonde 通过diff算法变成正真正的dom元素。



具体看我源码和流程图，这里文字就不描述这么多了，流程图是下面这中的网盘，源码是vue.js,基本每一行都有注释，然后diff待更新中

链接：https://pan.baidu.com/s/10IxV6mQ2TIwkRACKu2T0ng 
提取码：1fnu 
 

上面的vue.js 就是我基于vue源码中每行加有注释的vue.js, 其他文件就是我看vue.js源码的时候抽出来的vue.js 源码小demo

 
 
 
 作者：姚观寿
