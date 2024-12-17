// components/tabBar/tabBar.js
Component({

  /**
   * 组件的属性列表
   */
  properties: {
    active: {
      type:Number,
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    pages: {
      0: '/pages/home/home', // 工单首页的页面路径
      1: '/pages/person/person' // 个人中心的页面路径
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onChange(event) {
      // event.detail 的值为当前选中项的索引
      const index = event.detail;
      const path = this.data.pages[index];
      if (path) {
        wx.switchTab({
          url: path
        });
      }
    },
  }
})