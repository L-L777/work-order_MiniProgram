// components/pop/pop.js
import { ordersReq,privateReq } from "../../utils/api.js";
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
    passwordShow:{
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
 // 关闭修改密码弹窗
 onPasswordClose:function(){
  // 调用自定义方法，发送数据到父组件
  this.triggerEvent('closePassword', { data: '关闭弹窗' });
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
},
  // 密码非空校验
  validatePassword: function (password) {
    return password.trim() !== ''; // 去除前后空格后判断是否为空
  },
    // 密码长度和字符类型校验
    validatePasswordStrength: function (password) {
      // 正则表达式：至少6位，包含字母和数字
      const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
      return regex.test(password);
    },
    // 确认密码校验
    validateConfirmPassword: function (password, confirmPassword) {
      return password === confirmPassword;
    },
  // 确认修改密码按钮
  passwordSubmit:async function(e){
    const {  password, confirmPassword } = e.detail.value;
 // 密码非空校验
 if (!this.validatePassword(password)) {
  wx.showToast({
    title: '密码不能为空',
    icon: 'none',
  });
  return; // 密码为空，停止执行
}
// 密码强度校验
if (!this.validatePasswordStrength(password)) {
wx.showToast({
  title: '密码必须至少6位，且为字母和数字',
  icon: 'none',
});
return; // 密码不符合要求，停止执行
}
// 确认密码校验
if (!this.validateConfirmPassword(password, confirmPassword)) {
  wx.showToast({
    title: '两次输入的密码不一致',
    icon: 'none',
  });
  return; // 密码不一致，停止执行
}
const phone=wx.getStorageSync('userInfo').phone
wx.showLoading({
  title: '数据加载中...',
});
const res=await privateReq.updatePassword(phone,password)
if(res.code===1){
  this.triggerEvent('closePassword', { data: '关闭弹窗' });
wx.showToast({
title: '修改成功',
icon: 'success',
});
wx.hideLoading();
}
else{
  wx.showToast({
    title: res.msg,
    icon: 'none',
  });
}
    
    
   },

  },

  lifetimes: {
    // 组件实例被挂载到页面节点树中时执行
    attached: function() {
      // console.log(this.data.orderId);
    },
  }
})