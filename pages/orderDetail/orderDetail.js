// pages/orderDetail/orderDetail.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navBarHeight: app.globalData.navBarHeight,
    role: app.globalData.role,
    userId: app.globalData.userId,
    updateShow:false,//修改工单弹出框状态
    detailShow:false,//工单信息弹出框状态
  },
// 关闭弹窗
  onClose:function(){
    this.setData({ updateShow: false,detailShow:false });
  },
  // 修改工单按钮
  updateOrder:function(){
    this.setData({ updateShow: true });
  },
  // 工单信息按钮
  detailOrder:function(){
    this.setData({ detailShow: true });
  },
  // 验收工单按钮
  checkOrder:function(){
    wx.navigateTo({
      url: '/pages/checkOrder/checkOrder',
    })
  },
  // 签到签退历史记录按钮
  signHistory:function(){
    wx.navigateTo({
      url: '/pages/signHistory/signHistory',
    })
  },
  // 签到签退按钮
  sign:function(e){
    const status=e.currentTarget.dataset.status
    wx.navigateTo({
      url: '/pages/sign/sign?status=' + status,
    })
  },
})