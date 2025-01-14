// components/ordersCard/ordersCard.js
import { ordersReq } from "../../utils/api.js";
Component({

  /**
   * 组件的属性列表
   */
  properties: {
    order:{
      type: Object,
      value:{},
    },
    btnshow:{
      type: String,
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
show:false,
selectStatus:false,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 点击新建按钮
    createOrders: async function() {
      // this.setData({ show: true });
    const res = await ordersReq.publishOrders(this.data.order.id)
    if(res.code===1){
      
      wx.setStorageSync('needHomeRefreshOnReturn', true)
      wx.navigateBack(
      {  delta: 1 }
      )
      wx.showToast({
        title: res.msg,
        icon:'success',
      })
    }else{
      wx.showToast({
        title: '新建失败',
        icon:'none'
      })
    }
    },
    // 关闭弹出框
    onClose:function(){
      this.setData({ show: false });
    },
    // 前往详情页面
    toDetail:function(){
wx.navigateTo({
  url: '/pages/orderDetail/orderDetail?id='+this.data.order.id,
})
    },
    // 选择工单
    selectOrders:function(){
      this.triggerEvent('selectOrder', { status: this.data.selectStatus, order:this.data.order});
      this.setData({selectStatus:!this.data.selectStatus})
    },
  },
  lifetimes: {
    // 组件实例被挂载到页面节点树中时执行
    attached: function() {
      // console.log('Order:', this.data.order.id);

    },
  }
})