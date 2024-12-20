// pages/sign/sign.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navBarHeight: app.globalData.navBarHeight,
    role: app.globalData.userInfo.role,
    userId: app.globalData.userId,
    status:-1,//判断当前是签到还是签退 （1签到，0签退）
    title:'',//导航栏标题
    fileList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({status:parseInt(options.status),  role: app.globalData.userInfo.role,})
    if(options.status==='1'){
      this.setData({title:'签到'})
    }else{
      this.setData({title:'签退'})
    }

  },

  onDelete(event) {
    // 删除图片，从 fileList 中移除对应的项
    const index = event.detail.index;
    const newFileList = this.data.fileList.filter((item, idx) => idx !== index);
    this.setData({ fileList: newFileList });
  },
  onAfterRead(event) {
    // 文件读取完成后的回调，通常用于上传文件
    const { file } = event.detail;
    // 上传文件的逻辑...
    // 假设上传成功后，服务器返回的文件链接保存在 file.url 中
    const newFileList = this.data.fileList.concat({ ...file[0] });
    this.setData({ fileList: newFileList });
  },
  previewImage(event) {
    // 获取所有图片的链接，用于预览
    const urls = this.data.fileList.map(item => item.tempFilePath);
    wx.previewImage({
      current: urls[1], // 当前显示图片的链接
      urls: urls // 需要预览的图片链接列表
    });
  }
})