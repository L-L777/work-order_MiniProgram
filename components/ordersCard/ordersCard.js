// components/ordersCard/ordersCard.js
Component({

  /**
   * 组件的属性列表
   */
  properties: {
    order:{
      type: Object,
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
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 点击新建按钮
    createOrders: function() {
      this.setData({ show: true });
    },
    // 关闭弹出框
    onClose:function(){
      this.setData({ show: false });
    },
    // 前往详情页面
    toDetail:function(){
wx.navigateTo({
  url: '/pages/orderDetail/orderDetail',
})
    },
  }
})