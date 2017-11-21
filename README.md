# WeChat-custom-sharing
自定义微信分享的内容<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;本文主要讲解如何实现在微信里面分享网页，自定义分享的标题、图片、内容。<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;微信在大概6的版本后，就不能像以前一样在html里放个隐藏的图片来实现自定义分享的，需要按照<a href="https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1421141115">微信的sdk</a>说明文档来。<br><br>
步骤：<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;（一）登录<a href="https://mp.weixin.qq.com/">微信公众号平台</a> 按照：设置---公众号设置---功能设置，
找到“JS接口安全域名”（填写的时候要慎重，因为一个月只有3次的修改机会，一定要确认之填写）<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;（二）在需要分享的页面script引入http://res.wx.qq.com/open/js/jweixin-1.2.0.js 当然也支持使用 AMD/CMD 标准模块加载方法加载。<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;（二）按照官方文档的介绍第三部需要配置config(注：出于安全考虑，开发者必须在服务器端实现签名的逻辑，写在前台没用的哦)<br>
wx.config({

    debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert，若要看传入参数，可在pc端打开，参数通过log打出。

    appId: '', // 必填，公众号的唯一标识 (1)

    timestamp: , // 必填，生成签名的时间戳 (2)

    nonceStr: '', // 必填，生成签名的随机串 (3)

    signature: '',// 必填，签名，见附录1 (4)

    jsApiList: [] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2 (5)

});<br>
参数1 appid，这个简单，直接在微信公众平台的开发者中心里面就可以查找到 。<br><br>
参数2 timestamp，先看参数3 nonceStr，这个参数3就是生成一个随机的字符串，生成一个string(32)类型的字符串就可以，然后获取当前的时间戳，即为参数2（例：14300000000）。<br><br>
参数4 signature，这个是最麻烦的，签名生成规则如下：<br><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;参与签名的字段包括noncestr（随机字符串）, 有效的jsapi_ticket, timestamp（时间戳）, url（当前网页的URL，不包含#及其后面部分） 。对所有待签名参数按照字段名的ASCII 码从小到大排序（字典序）后，使用URL键值对的格式（即key1=value1&key2=value2…）拼接成字符串string1。这里需要注意的是所有参数名均为小写字符。对string1作sha1加密，字段名和字段值都采用原始值，不进行URL 转义。<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;首先我们先来总结一下现在已经有了哪些东西：noncestr（随机字符串）、有效的jsapi_ticket、timestamp（时间戳）、url（当前网页的URL，不包含#及其后面部分），除了有效的jsapi_ticket，别的都已经获取，如何获取有效的jsapi_ticket:<br><br>
1.先获取access_token（有效期7200秒，开发者必须在自己的服务全局缓存access_token），通过这个接口https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=" + appid + "&secret=" + APPSECRET，APPSECRET是开发者密码，同样在微信公众平台里面可以找到，跟appid在一个地方<br>
2.用第一步拿到的access_token 采用http GET方式请求获得卡券 api_ticket（有效期7200秒，开发者必须在自己的服务全局缓存卡券 api_ticket）：https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=ACCESS_TOKEN&type=wx_card 返回数据格式如下：<br>
{<br>
&nbsp;&nbsp;"errcode":0,<br>
&nbsp;&nbsp;"errmsg":"ok",<br>
&nbsp;&nbsp;"ticket":"bxLdikRXVbTPdHSM05e5u5sUoXNKd8-41ZO3MhKoyN5OfkWITDGgnr2fwJ0m9E8NYzWKVZvdVtaUgWvsdshFKA",<br>
&nbsp;&nbsp;"expires_in":7200<br>
}<br>
ticket即为api_ticket。下面就是最终获取signature的方法：

步骤1. 对所有待签名参数按照字段名的ASCII 码从小到大排序（字典序）后，使用URL键值对的格式（即key1=value1&key2=value2…）拼接成字符串string1：

jsapi_ticket=sM4AOVdWfPE4DxkXGEs8VMCPGGVi4C3VM0P37wVUCFvkVAy_90u5h9nbSlYy3-Sl-HhTdfl2fzFy1AOcHKP7qg&noncestr=Wm3WZYTPz0wzccnW&timestamp=1414587457&url=http://mp.weixin.qq.com?params=value

步骤2. 对string1进行sha1签名，得到signature：

0f9de62fce790f9a083d5c99e95740ceb90c27ed

<br><br><br><br><br>

附录：常见错误：<br>
第一个.invalid url domain当前页面所在域名与使用的appid没有绑定，请确认正确填写绑定的域名，仅支持80（http）和443（https）两个端口，因此不需要填写端口号（一个appid可以绑定三个有效域名，见 目录1.1.1）。

第二个.invalid signature签名错误。建议按如下顺序检查：

&nbsp;&nbsp; 1.确认签名算法正确，可用 http://mp.weixin.qq.com/debug/cgi-bin/sandbox?t=jsapisign 页面工具进行校验。

&nbsp;&nbsp;2.确认config中nonceStr（js中驼峰标准大写S）, timestamp与用以签名中的对应noncestr, timestamp一致。

&nbsp;&nbsp; 3.确认url是页面完整的url(请在当前页面alert(location.href.split('#')[0])确认)，包括'http(s)://'部分，以及'？'后面的GET参数部分,但不包括'#'hash后面的部分。

&nbsp;&nbsp; 4.确认 config 中的 appid 与用来获取 jsapi_ticket 的 appid 一致。

&nbsp;&nbsp; 5.确保一定缓存access_token和jsapi_ticket。

&nbsp;&nbsp; 6.确保你获取用来签名的url是动态获取的，动态页面可参见实例代码中php的实现方式。如果是html的静态页面在前端通过ajax将url传到后台签名，前端需要用js获取当前页面除去'#'hash部分的链接（可用location.href.split('#')[0]获取,而且需要encodeURIComponent），因为页面一旦分享，微信客户端会在你的链接末尾加入其它参数，如果不是动态获取当前链接，将导致分享后的页面签名失败。

