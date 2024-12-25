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
    signHistory:[],
    signDetail:{},
    loading:false,
    },

  onLoad(options){
     // 判断有无token
   if(app.judgeToken())
   {
    this.setData({orderId:options.orderId,role:app.globalData.userInfo.role},()=>{
      this.fetchHistory()
    })
   }

  },
  onShow(){
    if (wx.getStorageSync('needSignHistoryRefreshOnReturn')) {
      // 执行刷新操作，例如重新加载数据
      this.setData({ signHistory:[]},()=>{
        this.fetchHistory()
      })
     
      // 清除标记
      wx.removeStorageSync('needSignHistoryRefreshOnReturn');
    }
  },
  fetchHistory: async function(){
    this.setData({loading:true})
const res=await ordersReq.getSignDetail(this.data.orderId)
this.setData({loading:false})
if(res.code===1){
this.setData({signHistory:[...res.data]})
// console.log(res.data);
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
  signHistory:function(e){
    // console.log(e.currentTarget.dataset);
    this.setData({ signShow: true,signDetail:e.currentTarget.dataset.detail });
  },
  // 修改按钮
  signUpdate:function(e){
    const status=e.currentTarget.dataset.status
    const detail=JSON.stringify(e.currentTarget.dataset.detail)
// console.log(status);
    wx.navigateTo({
      url: '/pages/sign/sign?status='+status+'&signDetail='+detail,
    })
  }
})