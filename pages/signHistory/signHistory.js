// pages/signHistory/signHistory.js
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
    signShow:false,//历史签到签退信息弹出框状态
    orderId:0,
    signDetail:[]
    },

  onLoad(options){
this.setData({orderId:options.orderId},()=>{
  this.fetchHistory()
})
  },
  fetchHistory: async function(){
const res=await ordersReq.getSignDetail(this.data.orderId)
if(res.code===1){
this.setData({signDetail:[...res.data]})
console.log(res.data);
}else{
  wx.showToast({
    title: res.msg,
    icon: 'none',
  });
}
  },
  // 关闭弹窗
  onClose:function(){
    this.setData({ signShow:false });
  },
  // 详情按钮
  signHistory:function(){
    this.setData({ signShow: true });
  },
  // 修改按钮
  signUpdate:function(e){
    const status=e.currentTarget.dataset.status
console.log(status);
    wx.navigateTo({
      url: '/pages/sign/sign?status='+status,
    })
  }
})