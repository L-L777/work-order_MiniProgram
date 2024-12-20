// pages/signHistory/signHistory.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navBarHeight: app.globalData.navBarHeight,
    role: app.globalData.userInfo.role,
    userId: app.globalData.userId,
    signShow:false,//历史签到签退信息弹出框状态
  },

  // 关闭弹窗
  onClose:function(){
    this.setData({ signShow:false });
  },
  // 详情按钮
  signHistory:function(){
    this.setData({ signShow: true });
  },
})