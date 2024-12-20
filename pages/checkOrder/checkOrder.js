// pages/checkOrder/checkOrder.js
import { ordersReq } from "../../utils/api.js";
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navBarHeight: app.globalData.navBarHeight,
    role: app.globalData.userInfo.role,
    userId: app.globalData.userId,
    orderId:0,
    imgSrc:''//验收工单图片url
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({role:app.globalData.userInfo.role,orderId:options.orderId})
    this.fetchOrderImg(options.orderId)
  },
  // 获取验收工单图片url
fetchOrderImg:async function (orderId){
const res=await ordersReq.getOrdersCheckDetail(orderId);
if(res.code===1){
  this.setData({imgSrc:res.data})
}else{
  wx.showToast({
    title: res.msg,
    icon: 'none',
  });
}
},

check:async function(){
const res=await ordersReq.checkOrders(this.data.orderId)
if(res.code===1){
  //  验收成功后回退到详情页数据更新 设置需要刷新的标记
   wx.setStorageSync('needDetailRefreshOnReturn', true);
  wx.navigateBack(
    {delta: 1}
  )
  wx.showToast({
    title: '验收通过',
    icon: 'success',
  });
  
}else{
  wx.showToast({
    title: res.msg,
    icon: 'none',
  });
}
},
  
})