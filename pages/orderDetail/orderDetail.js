// pages/orderDetail/orderDetail.js
import { ordersReq } from "../../utils/api.js";
import {dealTime} from "../../utils/dealTime.js"
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
    updateShow:false,//修改工单弹出框状态
    detailShow:false,//工单信息弹出框状态
    orderId:0,
    detailMessage:{},
    fileLink1:'',//文件连接
    fileLink2:'',//文件连接
  },
  onLoad(option) {
    this.setData({ orderId: option.id ,role: app.globalData.userInfo.role}, () => {
      this.fetchDetail(option.id,this);
    });
  },
  onShow: function () {
    // 检查是否有需要刷新的标记
    if (wx.getStorageSync('needDetailRefreshOnReturn')) {
      // 执行刷新操作，例如重新加载数据
      this.fetchDetail(this.data.orderId,this);
      // 清除标记
      wx.removeStorageSync('needDetailRefreshOnReturn');
    }
  },
  // 获取详情数据
  fetchDetail:async function (id,that){
    const res = await ordersReq.getOrdersDetail(id);
    if(res.code===1){
      // console.log(res.data);
      // 处理返回数据里的时间
      res.data.acceptanceTime=dealTime.formatTime(res.data.acceptanceTime);
      res.data.completionDate=dealTime.formatDate(res.data.completionDate);
      res.data.orderAcceptDate=dealTime.formatDate(res.data.orderAcceptDate);
      res.data.orderDeliveryDate=dealTime.formatDate(res.data.orderDeliveryDate);
      that.setData({detailMessage: res.data,fileLink1:res.data.attachmentUrl1,fileLink2:res.data.attachmentUrl2})
    }else{
      wx.showToast({
        title: res.msg,
        icon: 'none',
      });
    }
    
  },
  // 查看附件按钮
  fileCheck: function(event) {
    // 获取 data-src 属性的值
    var fileSrc = event.currentTarget.dataset.src;
    this.previewFile(fileSrc);
  },
  // 预览文件
  previewFile:function(url){
    wx.downloadFile({
      //文件url
      url: url,
      success: function (res) {
        const filePath = res.tempFilePath
        wx.openDocument({
          filePath: filePath,
          success: function (res) {
            // console.log('打开文档成功')
          },
          fail: function (res) {
            // console.log('打开文档失败')
          },
        })
      }
    })
  },
// 关闭弹窗
  onClose:function(){
    this.setData({ updateShow: false,detailShow:false });
  },
  // 修改工单按钮
  updateOrder:function(){
    this.setData({ updateShow: true });
  },
  // 工单信息按钮
  detailOrder:function(){
    this.setData({ detailShow: true });
  },
  // 验收工单按钮
  checkOrder:function(){
    wx.navigateTo({
      url: '/pages/checkOrder/checkOrder?orderId='+this.data.orderId,
    })
  },
  // 删除工单按钮
  deleteOrder:async function(){
    // console.log(this.data.orderId);
    const confirm=await modal.modalAlert('是否删除工单')
    if(confirm){
      const res = await ordersReq.deleteOrders(parseInt(this.data.orderId));
      if(res.code===1){
        wx.showToast({
          title: res.msg,
          icon: 'success',
        });
        wx.setStorageSync('needHomeRefreshOnReturn', true);
        wx.switchTab({
          url: '/pages/home/home',
        })
      }else{
        wx.showToast({
          title: res.msg,
          icon: 'none',
        });
      }
    }else{
      return
    }
   
  },
  // 签到签退历史记录按钮
  signHistory:function(){
    wx.navigateTo({
      url: '/pages/signHistory/signHistory?orderId='+this.data.orderId,
    })
  },
  // 签到签退按钮
  sign:function(e){
    const status=e.currentTarget.dataset.status
    wx.navigateTo({
      url: '/pages/sign/sign?status=' + status+'&orderId='+this.data.orderId,
    })
  },
  // 施工状态按钮
  confirm:async function(){
   if(this.data.role!=='WORKER'){
     return;
   }
   if(this.data.detailMessage.status!=='施工方未确认'){
     return;
   }
   const confirm=await modal.modalAlert('是否确认工单')
   if(confirm){
    wx.showLoading({
      title: '数据加载中...',
    });
     const res =await ordersReq.updateOrderStatus(this.data.orderId,"施工方确认未施工")
     if(res.code===1){
      wx.setStorageSync('needHomeRefreshOnReturn', true);
      wx.hideLoading();
      this.setData({
        detailMessage:{...this.data.detailMessage,status:"施工方确认未施工"}
      })
      wx.showToast({
        title:'确认成功',
        icon: 'success',
      });
      
     }else{
      wx.hideLoading();
      wx.showToast({
        title: res.msg,
        icon: 'none',
      });
     }
   }else{
     return
   }
   
  },

  // 结束工程按钮
  finish:async function(){
 
    const confirm=await modal.modalAlert('是否结束工程')
    if(confirm){
      wx.showLoading({
        title: '数据加载中...',
      });
       const res =await ordersReq.updateOrderStatus(this.data.orderId,"验收未通过")
       if(res.code===1){
        wx.setStorageSync('needHomeRefreshOnReturn', true);
        wx.hideLoading();
        this.setData({
          detailMessage:{...this.data.detailMessage,status:"验收未通过"}
        })
        wx.showToast({
          title:'确认成功',
          icon: 'success',
        });
        
       }else{
        wx.hideLoading();
        wx.showToast({
          title: res.msg,
          icon: 'none',
        });
       }
    }else{
      return
    }
    
   },
})