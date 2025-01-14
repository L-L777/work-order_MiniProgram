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
    page: 1, // 当前页码
    pageSize:5,//一页多少条
    total:0,//总数据条数
    hasMore: true, // 是否还有更多数据
    refresh:false,//下拉刷新状态
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
const res=await ordersReq.getSignDetail(this.data.orderId,this.data.page,this.data.pageSize)
this.setData({loading:false})
if(res.code===1){
this.setData({signHistory:[...this.data.signHistory,...res.data.workOrderList],total:res.data.total})
// console.log(res.data);
if(res.data.total>this.data.page*this.data.pageSize){
  this.setData({hasMore:true});
}else{
  this.setData({hasMore:false});
}
}else{
  wx.showToast({
    title: res.msg,
    icon: 'none',
  });
  
}
  },

 // 滑动分页加载
 onLoadMore() {    
  // console.log(111);
  if (this.data.hasMore) {
    this.setData({page:this.data.page+1 },() => {
      this.fetchHistory();
    });
  }
},
  // 下拉刷新事件处理函数
  onRefresh() {
    this.setData({
      signHistory:[],
    signDetail:{},
      loading: true,
      refresh:true ,
      page:1
    },()=>{
       // 调用获取数据的函数，这里假设是fetchOrders
    this.fetchHistory();
    // 结束下拉刷新
    wx.stopPullDownRefresh();
    });
  },

  // 关闭弹窗
  onClose:function(){
    this.setData({ signShow:false });
  },
  // 详情按钮
  signHistory:function(e){
    // console.log(e.currentTarget.dataset);
    const detail=JSON.stringify(e.currentTarget.dataset.detail)
    wx.navigateTo({
      url: `/pages/signdetail/signdetail?signDetail=${detail}`,
    })
    // this.setData({ signShow: true,signDetail:e.currentTarget.dataset.detail });
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