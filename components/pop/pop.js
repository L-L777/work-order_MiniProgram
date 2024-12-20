// components/pop/pop.js
import { ordersReq } from "../../utils/api.js";
Component({

  /**
   * 组件的属性列表
   */
  properties: {
    createShow:{
      type:Boolean
    },
    detailShow:{
      type:Boolean
    },
    signShow:{
      type:Boolean
    },
    detailMessage:{
      type:Object,
      value:{}
    },
    orderId:{
      type:Number,
      value:0
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
 // 绑定提交工单输入字段的值
 customerName: '',
 customerPhone: '',
 employeeName: '',
 employeePhone: '',
 constructionName: '',
 constructionPhone: '',
  },

  /**
   * 组件的方法列表
   */
  methods: {
// 关闭新建工单和修改工单弹窗
onCreateClose:function(){
 // 调用自定义方法，发送数据到父组件
 this.triggerEvent('closeCreate', { data: '关闭弹窗' });
},
// 确认新建
messageSubmit:function(){
 // 调用自定义方法，发送数据到父组件
 this.triggerEvent('closeCreate', { data: '关闭弹窗' });
},
// 关闭查看工单信息弹窗
onDetailClose:function(){
  // 调用自定义方法，发送数据到父组件
  this.triggerEvent('closeDetail', { data: '关闭弹窗' });
 },
 // 关闭查看历史签到签退信息弹窗
 onSignClose:function(){
  // 调用自定义方法，发送数据到父组件
  this.triggerEvent('closeSign', { data: '关闭弹窗' });
 },
//  图片预览
previewImg: function(e) {
  const currentUrl = e.currentTarget.dataset.src; // 获取当前点击的图片URL
  const imgList = [];
  imgList.push(currentUrl)
  wx.previewImage({
    current: currentUrl, // 当前显示图片的链接
    urls:imgList,  //需要预览的图片链接列表
  });
}
  },
  lifetimes: {
    // 组件实例被挂载到页面节点树中时执行
    attached: function() {
      // console.log(this.data.orderId);
    },
  }
})