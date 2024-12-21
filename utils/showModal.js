// 展示modal提示框
const modal={
  modalAlert(msg){
    return new Promise((resolve, reject) => {
      wx.showModal({
        title: '提示',
        content: msg,
        cancelColor:"#000000",
        confirmColor:"#3b86ff",
        success (res) {
          if (res.confirm) {
            resolve(true);
          }else if (res.cancel) {
            resolve(false);
          }
        }
      })
    })
  }
}
module.exports = {modal};