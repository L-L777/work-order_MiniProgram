// pages/home/home.js
import { ordersReq } from "../../utils/api.js";
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    navBarHeight: app.globalData.navBarHeight,
    tabBarHeight: app.globalData.tabBarHeight,
    allSelectActive: true, // 筛选全部工单按钮
    role: "",
    userId: app.globalData.userId,
    selectKey: '0', // 初始选择状态（全部或者我的）
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
  // 选择全部工单按钮
  allSelectClick() {
    this.setData({ allSelectActive: true, selectKey: '0', page:1,hasMore: true,length:0,orderList: [] }, () => {
      this.fetchOrders();
    });
  },
  // 选择我的工单按钮
  mySelectClick() {
    this.setData({ allSelectActive: false, selectKey: '1', page:1, hasMore: true,length:0,orderList: [] }, () => {
      this.fetchOrders();
    });
  },
  onLoad() {
    // 判断有无token
    if(app.judgeToken())
    {
      this.setData({role:app.globalData.userInfo.role})
      // console.log(this.data.role);
      this.fetchOrders();
    }
   
  },
  onShow: function () {
    // 检查是否有需要刷新的标记
    if (wx.getStorageSync('needHomeRefreshOnReturn')) {
      // 执行刷新操作，例如重新加载数据
      this.setData({ allSelectActive: true, selectKey: '0', page:1,hasMore: true,length:0,orderList: [], }, () => {
        this.fetchOrders();
      });
      // 清除标记
      wx.removeStorageSync('needHomeRefreshOnReturn');
    }
  },
  // 获取数据
  fetchOrders: async function() {
    this.setData({pageLoading:true})
    let key=''
    if(app.globalData.userInfo.role!=="WORKER"){
      key = this.data.selectKey;
    }
    const res = await ordersReq.getOrders( this.data.page,this.data.pageSize,key,this.data.searchValue);
    if (res.code === 1) 
    {
      // console.log(res.data);
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
  // 搜索
  onSearch(e) {  
    // console.log(e.detail);  
this.setData({page:1,hasMore: true,length:0,orderList: [],searchValue:e.detail},()=>{
  this.fetchOrders();
})
  },
  // 取消搜索
  onSearchCancel() {    
   this.setData({page:1,hasMore: true,length:0,orderList: [],searchValue:''},()=>{
    this.fetchOrders();
   })
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
  // 新建工单
  createBtn:()=>{
    wx.navigateTo({url:'/pages/addOrder/addOrder'})
  }
});