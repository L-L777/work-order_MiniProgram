// index.js
import {enterReq} from "../../utils/api.js"
const app=getApp();
Page({
  data: {
    isLoginActive: true // 默认登录按钮为激活状态
  },
  // 切换到登录表单
  onLoginClick() {
    this.setData({
      isLoginActive: true // 点击登录按钮时设置为激活状态
    });
  },
  // 切换到注册表单
  onRegisterClick() {
    this.setData({
      isLoginActive: false // 点击注册按钮时设置为非激活状态
    });
  },
    // 手机号校验规则
    validatePhone: function (phone) {
      // 正则表达式，用于匹配中国大陆手机号
      const regex = /^1[3-9]\d{9}$/;
      return regex.test(phone);
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
    
    // 提交注册表单
    registerSubmit: async function (e) {
      const { phone, password, confirmPassword } = e.detail.value;
      // 手机号校验
      if (!this.validatePhone(phone)) {
        wx.showToast({
          title: '手机号格式不正确',
          icon: 'none',
        });
        return; // 手机号格式不正确，停止执行
      }
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
      // 交互
      try{
        const res=await enterReq.register(phone,password)
        if(res.code===1){
 wx.showToast({
  title: '注册成功',
  icon: 'success',
});
// 变成登录表单进行登录操作
this.setData({
  isLoginActive: true 
});
        }
        else{
          wx.showToast({
            title: res.msg,
            icon: 'none',
          });
        }
      }catch(error){

      }

    },

    // 提交登录表单
    loginSubmit: async function (e) {
      const { phone, password } = e.detail.value;
      // 手机号校验
      if (!this.validatePhone(phone)) {
        wx.showToast({
          title: '手机号格式不正确',
          icon: 'none',
        });
        return; // 手机号格式不正确，停止执行
      }
      // 密码非空校验
      if (!this.validatePassword(password)) {
        wx.showToast({
          title: '密码不能为空',
          icon: 'none',
        });
        return; // 密码为空，停止执行
      }
      
      // 交互
      try{
        const res=await enterReq.login(phone,password)
        if(res.code===1){
 wx.showToast({
  title: '登录成功',
  icon: 'success',
});
// 存token和用户权限
wx.setStorageSync('accessToken', res.data.accessToken);
wx.setStorageSync('refreshToken', res.data.refreshToken);
app.globalData.userId=res.data.userId
app.globalData.role=res.data.role
// 跳转到首页
wx.switchTab({ url: '/pages/home/home', });
        }
        else{
          wx.showToast({
            title: res.msg,
            icon: 'none',
          });
        }
      }catch(error){

      }

    }
})
