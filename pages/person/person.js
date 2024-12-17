// pages/person/person.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navBarHeight: app.globalData.navBarHeight,
    tabBarHeight: app.globalData.tabBarHeight,
    phone: app.globalData.phone,
  },

  loginout:()=>{
wx.reLaunch({
  url: '/pages/index/index',
})
wx.removeStorageSync('accessToken')
wx.removeStorageSync('refreshToken')
  }
})