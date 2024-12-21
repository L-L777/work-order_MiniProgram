// pages/person/person.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navBarHeight: app.globalData.navBarHeight,
    tabBarHeight: app.globalData.tabBarHeight,
    phone: 0,
    passwordShow:false,//修改密码弹出窗显示状态
  },
onLoad(){
this.setData({phone:app.globalData.userInfo.phone})
},
// 退出登录
  loginout:()=>{
wx.reLaunch({
  url: '/pages/index/index',
})
wx.removeStorageSync('accessToken')
wx.removeStorageSync('refreshToken')
wx.removeStorageSync('userInfo')
  },

  // 修改密码
  updatePassword:function(){
    this.setData({ passwordShow: true });
  },
  // 关闭弹窗
  onClose:function(){
    this.setData({ passwordShow: false });
  },
})