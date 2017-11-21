$.ajax({
    url:url,//你的url 获取config里面各个字段值的接口
    type:'POST', //GET
    data:{},
    success:function(data){
        wx.config({
            debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: data.appId, // 必填，公众号的唯一标识
            timestamp: data.timestamp, // 必填，生成签名的时间戳
            nonceStr: data.nonceStr, // 必填，生成签名的随机串
            signature: data.signature,// 必填，签名，见附录1
            jsApiList: [
             'onMenuShareAppMessage'

           ]//这个参数是 wx.ready里面用到了那几个分享，就需要在这里声明一下
        })
        wx.ready(function(){
            //分享给朋友
            wx.onMenuShareAppMessage({
                title: , // 分享标题
                desc: , // 分享描述
                link: , // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                imgUrl: , // 分享图标
                type: 'link', // 分享类型,music、video或link，不填默认为link
                dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                success: function () {
                    // 用户确认分享后执行的回调函数
                },
                cancel: function () {
                    // 用户取消分享后执行的回调函数
                }
            });
        });
    }
})
