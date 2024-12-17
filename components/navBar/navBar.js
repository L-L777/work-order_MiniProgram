// components/navBar/navBar.js
Component({

  /**
   * 组件的属性列表
   */
  properties: {
    name:{
      type: String,
    },
    leftStatus:{
      type:Boolean,
      value: false 
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    onBack: function() {
      wx.navigateBack({
        delta: 1 // 返回的页面数，如果 delta 大于现有页面数，则返回到首页
      });
    }
  }
})