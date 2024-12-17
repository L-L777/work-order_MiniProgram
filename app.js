// app.js
App({
onLaunch(){
  const windowInfo = wx.getWindowInfo()
  const statusBarHeight=windowInfo.statusBarHeight
  const screenWidth=windowInfo.screenWidth
  this.globalData.navBarHeight = statusBarHeight*750/screenWidth + 80;
  // console.log(statusBarHeight*750/screenWidth + 80);
  this.globalData.tabBarHeight=statusBarHeight*750/screenWidth + 80;
},
  globalData: {
    userId:null,
    role:"",//用户权限
    phone:'',//用户手机号码
    navBarHeight: 0,//导航栏高度
    tabBarHeight:0,//TabBar高度
  }
})
