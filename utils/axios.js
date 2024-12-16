// 封装axios
class axios {
  constructor(options = {}) {
    // 请求的根路径
    this.baseUrl = options.baseUrl || '';
    // 请求的 url 地址
    this.url = options.url || '';
    // 请求方式
    this.method = 'GET';
    // 请求的参数对象
    this.data = null;
    // header 请求头
    this.header = options.header || {};
    this.beforeRequest = null;
    this.afterRequest = null;
    this.errRequest = null;
  }

  // 添加对header的支持
  _mergeHeaders(customHeader = {}) {
    return Object.assign({}, this.header, customHeader); // 合并默认header和自定义header
  }

  get(url, data = {}, header = {}) {
    // 清空 header 对象
    this.header = {};
    this.method = 'GET';
    this.url = this.baseUrl + url;
    this.data = data;
    this.header = this._mergeHeaders(header); // 合并header
    return this._sendRequest();
  }

  post(url, data = {}, header = {}) {
    // 清空 header 对象
    this.header = {};
    this.method = 'POST';
    this.url = this.baseUrl + url;
    this.data = data;
    this.header = this._mergeHeaders(header); // 合并header
    return this._sendRequest();
  }

  put(url, data = {}, header = {}) {
    // 清空 header 对象
    this.header = {};
    this.method = 'PUT';
    this.url = this.baseUrl + url;
    this.data = data;
    this.header = this._mergeHeaders(header); // 合并header
    return this._sendRequest();
  }

  delete(url, data = {}, header = {}) {
    // 清空 header 对象
    this.header = {};
    this.method = 'DELETE';
    this.url = this.baseUrl + url;
    this.data = data;
    this.header = this._mergeHeaders(header); // 合并header
    return this._sendRequest();
  }

  _sendRequest() {
    // 请求之前做一些事
    if (this.beforeRequest && typeof this.beforeRequest === 'function') {
      this.beforeRequest(this);
    }
    // 发起请求
    return new Promise((resolve, reject) => {
      wx.request({
        url: this.url,
        method: this.method,
        data: this.data,
        header: this.header,
        success: (res) => {
          // console.log(res);
          if (res.statusCode === 200) {
            resolve(res.data);
          } else {
            const config = {
              url: this.url,
              method: this.method,
              data: this.data,
              header: this.header,
            };
            res.config = config;
            reject(res);
          }
        },
        fail: (err) => {
          // console.log(err);
          const config = {
            url: this.url,
            method: this.method,
            data: this.data,
            header: this.header,
          };
          err.config = config;
          reject(err);
        },
        complete: (res) => {
          // 请求完成以后做一些事情
          if (this.afterRequest && typeof this.afterRequest === 'function') {
            this.afterRequest(res, resolve, reject);
          }
        }
      });
    });
  }
}

// const $http = new axios();
export default axios;