import axios from './axios.js';
import handleErrors from "./handleError.js"
const $http = new axios({
  baseUrl: 'http://117.72.95.156:8082/api' // 设置请求根路径
});
wx.$http = $http; // 将$http实例挂载到wx对象上，方便全局访问
// 请求开始之前做一些事情
$http.beforeRequest = function(options) {
  // 获取存储在本地的token
  const token = wx.getStorageSync('accessToken');
  // 如果token存在，则添加到请求头中
  if (token) {
    this.header['accessToken'] = `${token}`;
  }
 wx.showLoading({
   title: '数据加载中...',
 });
};
let isRefreshing = false;
let refreshCount = 0;
let requestQueue=[];
const MAX_REFRESH_COUNT = 5;
// 请求完成之后做一些事情
$http.afterRequest = async function(res, resolve, reject) {
  wx.hideLoading();
  // console.log('isRefreshing', isRefreshing);
  refreshCount++;

  if (res.statusCode === 401 && !isRefreshing && refreshCount < MAX_REFRESH_COUNT) {
    console.log('endRequest', res);
    const config = res.config;
    requestQueue.push(config);
    let refreshToken = wx.getStorageSync('refreshToken');
    console.log('refreshToken');
    console.log(refreshToken);
    if (refreshToken === "" || refreshToken === undefined) {
      // 处理登录过期逻辑
      handleLoginExpired();
    } else if (!isRefreshing) {
      isRefreshing = true;
      try {
        const response = await $http.get('/user/refreshToken', {}, { refreshToken });
        console.log(response);
        wx.setStorageSync('accessToken', response.data.accessToken);
        wx.setStorageSync('refreshToken', response.data.refreshToken);
        // 重试队列中的请求
        retryQueue();
        isRefreshing = false;
      } catch (err) {
        handleLoginExpired();
        isRefreshing = false;
      }
    }
  } else {
    // 正常处理响应
    if (res.statusCode === 200) {
      resolve(res.data);
    } else {
      handleErrors(res); // 处理请求错误
      reject(res);
    }
  }

  async function handleLoginExpired() {
    wx.removeStorageSync('refreshToken');
    wx.removeStorageSync('accessToken');
    wx.showToast({
      title: "登录过期",
      icon: "error"
    });
    refreshCount = 0;
    await wait(500);
    wx.reLaunch({
      url: "/pages/index/index"
    });
  }

  async function retryQueue() {
    while (requestQueue.length > 0) {
      const queuedRequest = requestQueue.shift();
      sendRequest(queuedRequest);
    }
  }

  async function sendRequest(requestConfig) {
    wx.$http._(requestConfig)
      .then((response) => {
        requestConfig.resolve(response);
      })
      .catch((error) => {
        requestConfig.reject(error);
      });
  }
};

export default $http;