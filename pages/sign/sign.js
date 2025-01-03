// pages/sign/sign.js
import { ordersReq } from "../../utils/api.js";
import {modal} from "../../utils/showModal.js"
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
    description: '', // 用于存储描述文本
    fileList: [],
    latitude:0,//纬度
    longitude:0,//经度
    orderId:'0',  
    signDetail:{},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
     // 判断有无token
   if(app.judgeToken())
   {
    // console.log(options);
    this.setData({status:parseInt(options.status),  role: app.globalData.userInfo.role,orderId:options.orderId})
    if(options.status==='1'){
      this.setData({title:'签到'})
    }else{
      this.setData({title:'签退'})
    }

    if(options.signDetail){
      const detail=JSON.parse(options.signDetail)
      const img=[]
      detail.images.map((item)=>{
        img.push({tempFilePath:item,url:item,status:0})
      })
      this.setData({signDetail:detail,description:detail.textInfo,fileList:[...img]})
    }
   }
    

  },
  onDescriptionInput(e) {
    this.setData({
      description: e.detail.value
    });
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
    console.log(file);
    // console.log(event.detail);
    // 上传文件的逻辑...
    // 假设上传成功后，服务器返回的文件链接保存在 file.url 中
    // const newFileList = this.data.fileList.concat({ ...file[0] });
    const newFileList=[...this.data.fileList]
    if (Array.isArray(file) && file.length) {
      file.forEach(item => {
        // 对每个文件执行上传操作
    newFileList.push(item)
      });
    }
    
   
    this.setData({ fileList: [...newFileList ]});
  },
  previewImage(event) {
    // 获取所有图片的链接，用于预览
    const urls = this.data.fileList.map(item => item.tempFilePath);
    wx.previewImage({
      current: urls[1], // 当前显示图片的链接
      urls: urls // 需要预览的图片链接列表
    });
  },

  // 提交表单
  signSubmit: async function (e){
    const that = this;
    const { description, fileList } = this.data;
     // 非空校验
     if (!description.trim()) {
      wx.showToast({
        title: '描述不能为空',
        icon: 'none'
      });
      return; // 终止执行
    }
    if (fileList.length === 0) {
      wx.showToast({
        title: '至少上传一张图片',
        icon: 'none'
      });
      return; // 终止执行
    }
    const confirm=await modal.modalAlert("是否进行次操作")
    if(confirm){
      wx.showLoading({
        title: '图片上传中...',
      });
        // 上传图片的Promise数组
      const uploadPromises = this.data.fileList.filter(file => file.status !== 0) .map(file => {
        // console.log(file);
        return new Promise((resolve, reject) => {
          wx.uploadFile({
            url: 'http://117.72.95.156:6100/api/orders/signImage', // 你的服务器上传图片的接口
            filePath: file.tempFilePath, // 要上传文件资源的路径
            name: 'image', // 必填，后台用来解析文件的key
            header: {
              'Content-Type': 'multipart/form-data' ,
            },
            formData: {
              'image': file,
            },
            success: (res) => {
              // 上传成功的处理
              if (res.statusCode === 200) {
                const fileUrl =JSON.parse(res.data).data.imagePath;
                resolve(fileUrl);
              } else {
                wx.showToast({
                  title: '图片上传失败',
                  icon:'error'
                })
                reject(new Error('图片上传失败'));
              }  
            },
            fail: (err) => {
              wx.showToast({
                title: '图片上传失败',
                icon:'error'
              })
              wx.hideLoading();
              reject(err);
            }
          });
        });
      });
      const fileUrls = await Promise.all(uploadPromises);
      this.data.fileList.filter(file => file.status === 0).map((item)=>{
        fileUrls.push(item.url)
      })
      wx.hideLoading();
      // console.log('所有图片上传成功', fileUrls);
    wx.showLoading({
      title: '数据提交中...',
    });
    if(that.data.role==="WORKER"){
 // 获取定位
 wx.getLocation({
  type: 'gcj02',
  success(res){
    const latitude = res.latitude;
    const longitude = res.longitude;
    that.setData({
      latitude,
      longitude
    });
    // console.log(latitude);
    // 使用 Promise 链式调用
    console.log(fileUrls);
    ordersReq.sign(that.data.orderId,latitude,longitude,that.data.status,description,fileUrls)
      .then(res => {
        wx.hideLoading();
        if(res.code===1){
          wx.showToast({
            title: res.msg,
            icon: 'success',
          });
          wx.setStorageSync('needDetailRefreshOnReturn', true);
          wx.navigateBack({
            delta:1
          })
        }else{
         
          wx.showToast({
            title: res.msg,
            icon: 'none',
          });
        }
      })
      .catch(err => {
        wx.hideLoading();
        wx.showToast({
          title: '请求失败',
          icon: 'error',
        });
      });
  },
  fail(err) {
    console.error('定位失败', err);
    // 提示用户定位失败
    wx.showToast({
      title: '定位失败，请检查权限设置',
      icon: 'none'
    });
  }
})
}else{
  const res=await ordersReq.updateSignDetail(that.data.signDetail.id,that.data.signDetail.orderId,that.data.description,fileUrls )
  wx.hideLoading();
  if(res.code===1){
    wx.setStorageSync('needSignHistoryRefreshOnReturn', true);
    wx.navigateBack({
      delta:1
    })
    wx.showToast({
      title: '更新成功',
      icon:'success'
    })

  }else{
    wx.showToast({
      title: res.msg,
      icon:'none'
    })
  }
}
    }else{
      return
    }
   
  
  }
})