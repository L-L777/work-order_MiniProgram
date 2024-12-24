import axios from './axios.js';
import handleErrors from "./handleError.js"
const $http = new axios({
  baseUrl: 'http://117.72.95.156:6100/api' // 设置请求根路径
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
};
let isRefreshing = false;
let requestQueue=[];
let refreshCount=0
let Max_refresh=10;
// 请求完成之后做一些事情
$http.afterRequest = async function(res, resolve, reject) {
  // console.log('isRefreshing', isRefreshing);
  if (res.statusCode === 401 && !isRefreshing&&refreshCount<=Max_refresh) {
    console.log('endRequest', res);
    const config = res.config;
    console.log(resolve);
    requestQueue.push({ config, resolve, reject });
    // console.log(requestQueue[0]);
    let refreshToken = wx.getStorageSync('refreshToken');
    console.log('refreshToken');
    console.log(refreshToken);
    if (refreshToken === "" || refreshToken === undefined) {
      // 处理登录过期逻辑
      handleLoginExpired();
    } else if (!isRefreshing) {
      isRefreshing = true;
      try {
        const response = await wx.$http.get('/user/refreshToken', {}, { refreshToken });
        if(response.code===1){
          refreshCount++
          console.log(response.data.accessToken);
          wx.setStorageSync('accessToken', response.data.accessToken);
          wx.setStorageSync('refreshToken', response.data.refreshToken);
          console.log(111);
          // 重试队列中的请求
          retryQueue();
        }else{
          handleLoginExpired() ;
        }
        isRefreshing = false;
      } catch (err) {
        handleLoginExpired();
        isRefreshing = false;
      }
    }
  } else if(res.statusCode === 401&&refreshCount>Max_refresh ){
    // 如果一直刷新token后，获取到的token万一还是过期的，直接退出登录
    handleLoginExpired();
  }
  else {
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
    refreshCount = 0;
    // await wait(500);
    wx.reLaunch({
      url: "/pages/index/index"
    });
    wx.showToast({
      title: "登录过期",
      icon: "error"
    });
  }

  async function retryQueue() {
    while (requestQueue.length > 0) {
      // console.log(requestQueue[0]);
      const { config, resolve, reject } = requestQueue.shift();
      // console.log(config);
      // console.log(resolve);
      sendBeforeRequest(config, resolve, reject);
    }
  }

  async function sendBeforeRequest(requestConfig,beforeResolve, beforeReject) {
    // console.log(beforeResolve);
    Object.assign($http,requestConfig)
    // console.log($http);
    $http._sendRequest(beforeResolve, beforeReject)
      .then((response) => {
        // console.log(response);
        // beforeResolve(response.data);
      })
      .catch((error) => {
        // console.log(error);
        // beforeReject(error);
      });
  }
};

export default $http;