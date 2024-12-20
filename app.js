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

  globalData: {
    userId:null,
    userInfo:{},//用户信息
    navBarHeight: 0,//导航栏高度
    tabBarHeight:0,//TabBar高度
  }
})
