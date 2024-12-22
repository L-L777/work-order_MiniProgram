// pages/addOrder/addOrder.js
import { ordersReq } from "../../utils/api.js";
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navBarHeight: app.globalData.navBarHeight,
    orderList: [], // 工单列表
    page: 1, // 当前页码
    pageSize:10,//一页多少条
    total:0,//总数据条数
    length:0,//当前已经获取多少条数据
    hasMore: true, // 是否还有更多数据
    searchValue:'',//搜索内容
    pageLoading:false,//是否显示下滑加载
    refresh:false,//下拉刷新状态
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
 // 判断有无token
 if(app.judgeToken())
 {
  this.fetchOrders()
 }

  },
// 获取数据
fetchOrders: async function() {
  this.setData({pageLoading:true})
  const res = await ordersReq.getUnpublishOrders(this.data.page,this.data.pageSize);
  if (res.code === 1) 
  {
    this.setData({ orderList: [...this.data.orderList, ...res.data.workOrderList],total:res.data.total,length:this.data.length+res.data.workOrderList.length});
    if(res.data.total>this.data.page*this.data.pageSize){
      this.setData({hasMore:true});
    }else{
      this.setData({hasMore:false});
    }
  } else {
    wx.showToast({
      title: res.msg,
      icon: 'none',
    });
  }
  this.setData({pageLoading:false, refresh:false,})
},
 // 滑动分页加载
 onReachBottom() {    
  if (this.data.hasMore) {
    this.setData({page:this.data.page+1 },() => {
      this.fetchOrders();
    });
  }
},
  // 下拉刷新事件处理函数
  onPullDownRefresh() {
    this.setData({
      orderList: [], 
      pageLoading: true,
      refresh:true ,
      length:0,
        page:1
    },()=>{
       // 调用获取数据的函数，这里假设是fetchOrders
    this.fetchOrders();
    // 结束下拉刷新
    wx.stopPullDownRefresh();
    });
  },
})