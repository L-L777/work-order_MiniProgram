// index.js

Page({
  data: {
    isLoginActive: true // 默认登录按钮为激活状态
  },
  onLoginClick() {
    this.setData({
      isLoginActive: true // 点击登录按钮时设置为激活状态
    });
  },

  onRegisterClick() {
    this.setData({
      isLoginActive: false // 点击注册按钮时设置为非激活状态
    });
  }
})
