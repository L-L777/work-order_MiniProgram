const handleErrors = (error) => {
  // console.log(error);
  if (error) {
    const { statusCode } = error;
    // console.log(statusCode);
    switch (true) {
      case statusCode >= 500 && statusCode < 600:
        
        wx.showToast({
          title: `服务器错误: ${statusCode}`,
          icon: 'none',
          duration: 2000
        })
        break;
      case statusCode === 403:
        wx.showToast({
          title: "禁止访问: 403 Forbidden",
          icon: 'none',
          duration: 2000
        })
        break;
      case statusCode === 404:
        wx.showToast({
          title: "未找到: 404 Not Found",
          icon: 'none',
          duration: 2000
        })
        break;
      default:
        wx.showToast({
          title: `错误状态码: ${statusCode}`,
          icon: 'none',
          duration: 2000
        })
        break;
    }
  } else if (error.request) {
    
    wx.showToast({
      title: "请求发出, 网络错误",
      icon: 'none',
      duration: 2000
    })
  } else {
    wx.showToast({
      title: "请求错误: " + error.errMsg,
      icon: 'none',
      duration: 2000
    })
  }
};

export default handleErrors;