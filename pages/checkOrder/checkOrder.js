// pages/checkOrder/checkOrder.js
import { ordersReq } from "../../utils/api.js";
import {modal} from "../../utils/showModal.js"
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
    imgSrc:'',//验收工单图片url
    previewImages: [] // 用于预览的图片数组
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
  const confirm=await modal.modalAlert('是否验收工单')
if(confirm){
  const res=await ordersReq.checkOrders(this.data.orderId)
  if(res.code===1){
    //  验收成功后回退到详情页数据更新 设置需要刷新的标记
    wx.setStorageSync('needHomeRefreshOnReturn', true);
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
}else{
  return
}

},
// 图片放大预览
onImageClick() {
  // 点击图片时触发，打开图片预览
  this.setData({
    previewImages: [this.data.imgSrc] // 将当前图片放入数组中，用于预览
  });
  wx.previewImage({
    current: this.data.imgSrc, // 当前显示图片的链接
    urls: this.data.previewImages // 需要预览的图片链接列表
  });
},
})