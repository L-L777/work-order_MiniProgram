// pages/signdetail/signdetail.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navBarHeight: app.globalData.navBarHeight,
    role: app.globalData.userInfo.role,
title:'',//标题
signDetail:{},
// 地图配置
markers: [{
  id: 1,
  latitude: 0,
  longitude: 0,
  title: '施工地点',
  width: 20, // 标记的宽度
  height: 20 // 标记的高度
}],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const signDetail=JSON.parse(options.signDetail)

this.setData({signDetail:signDetail,markers:[...this.data.markers, {
  longitude: signDetail.longitude,
  latitude: signDetail.latitude
}]})
if(signDetail.signType==='1'){
  this.setData({title:'签到详情'})
}else{
  this.setData({title:'签退详情'})
}
  },

  previewImg: function(e) {
    const currentUrl = e.currentTarget.dataset.src; // 获取当前点击的图片URL
    wx.previewImage({
      current: currentUrl, // 当前显示图片的链接
      urls:this.data.signDetail.images,  //需要预览的图片链接列表
    });
  },
})