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
    role: app.globalData.role,
    userId: app.globalData.userId,
    selectKey: '0', // 初始选择状态（全部或者我的）
    orderList: [], // 工单列表
  },
  allSelectClick() {
    this.setData({ allSelectActive: true, selectKey: '0' });
  },
  mySelectClick() {
    this.setData({ allSelectActive: false, selectKey: '1' });
  },
  onLoad() {
    this.fetchOrders();
  },
  // 获取数据
  fetchOrders: async function() {
    let key = this.data.role === 'EMPLOYEE' || this.data.role === 'ADMIN' ?this.data.selectKey : '';

    const res = await ordersReq.getOrders(key);
    if (res.code === 1) 
    {
      // console.log(res.data);
      this.setData({ orderList: [...this.data.orderList, ...res.data] });
    } else {
      wx.showToast({
        title: res.msg,
        icon: 'none',
      });
    }
  },
  // 新建工单
  createBtn:()=>{
    wx.navigateTo({url:'/pages/addOrder/addOrder'})
  }
});