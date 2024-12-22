// app.js
App({
onLaunch(){
  const windowInfo = wx.getWindowInfo()
  const statusBarHeight=windowInfo.statusBarHeight
  const screenWidth=windowInfo.screenWidth
  this.globalData.navBarHeight = statusBarHeight*750/screenWidth + 80;
  // console.log(statusBarHeight*750/screenWidth + 80);
  this.globalData.tabBarHeight=statusBarHeight*750/screenWidth + 80;
   // 异步获取用户权限
   wx.getStorage({
    key: 'userInfo',
    success: (res) => {
      this.globalData.userInfo = res.data || {};
    },
    fail: () => {
      this.globalData.userInfo = {};
    }
  });
  
},
// 判断当前页面本地是否存在token，若无token则退回登录页面
judgeToken(){
if(!wx.getStorageSync('accessToken')){
wx.reLaunch({
  url: '/pages/index/index',
})
wx.showToast({
  title: '请先登录',
  icon:'error'
})
return false
}else{
  return true
}
},
  globalData: {
    userId:null,
    userInfo:{},//用户信息
    navBarHeight: 0,//导航栏高度
    tabBarHeight:0,//TabBar高度
  }
})
