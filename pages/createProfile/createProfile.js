// pages/createProfile/createProfile.js
import { ordersReq } from "../../utils/api.js";
const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
title:'',
navBarHeight: app.globalData.navBarHeight,
orderList:[],
searchValue:'',
page: 1, // 当前页码
    pageSize:10,//一页多少条
    total:0,//总数据条数
    hasMore: true, // 是否还有更多数据
    loading:false,//是否显示下滑加载
    refresh:false,//下拉刷新状态
    selectShow:false,//已选择工单弹窗状态
    sum:0,//选择工单的数量
    selectOrderList:[],//已选择的工单列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
this.setData({title:"生成附件"+options.fileName})
this.fetchOrders();
  },
  // 搜索
  onSearch(e) {  
    // console.log(e.detail);  
this.setData({page:1,hasMore: true,orderList: [],searchValue:e.detail},()=>{
  this.fetchOrders();
})
  },
  // 取消搜索
  onSearchCancel() {    
   this.setData({page:1,hasMore: true,orderList: [],searchValue:''},()=>{
    this.fetchOrders();
   })
  },

// 获取数据
fetchOrders: async function() {
  this.setData({loading:true})

  const res = await ordersReq.getOrders( this.data.page,this.data.pageSize,'1',this.data.searchValue);
  if (res.code === 1) 
  {
    // console.log(res.data);
    this.setData({ orderList: [...this.data.orderList, ...res.data.workOrderList],total:res.data.total});
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
  this.setData({loading:false, refresh:false,})
},

// 滑动分页加载
onLoadMore() {    
  // console.log(111);
  if (this.data.hasMore) {
    this.setData({page:this.data.page+1 },() => {
      this.fetchOrders();
    });
  }
},
  // 下拉刷新事件处理函数
  onRefresh() {
    this.setData({
      orderList: [],
      loading: true,
      refresh:true ,
      page:1
    },()=>{
       // 调用获取数据的函数，这里假设是fetchOrders
    this.fetchOrders();
    // 结束下拉刷新
    wx.stopPullDownRefresh();
    });
  },

  // 显示已选择工单的弹窗
  checkSelect:function(){
this.setData({selectShow:true})
  },

  // 关闭弹窗
  onClose:function(e){
 this.setData({ selectShow: false});
  },

  // 选择工单操作
  selectOrder:function(e){
const {status,order}=e.detail
if(status){
  this.setData({sum:this.data.sum-1})
  this.setData({
    selectOrderList: this.data.selectOrderList.filter(item => item.id!== order.id)
});
}else{
  this.setData({sum:this.data.sum+1,selectOrderList:[...this.data.selectOrderList,order]})
}
  },
})