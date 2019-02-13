const app = getApp()
Page({
  data: {

  },
  onLoad: function (options) {
    
  },
  onReady: function () {

  },
  onShow: function () {
    this.getRegisterErcode()
  },
  onHide: function () {

  },
  onUnload: function () {

  },
  onPullDownRefresh: function () {

  },
  onReachBottom: function () {

  },
  // onShareAppMessage: function () {

  // }

  // 获取注册二维码
  getRegisterErcode() {
    let that = this, url = `${app.baseUrl}/org/myorg_code`, data = {}
    app.wxRequest(url, data, (res) => {
      console.log('注册二维码', res)
      if(res.data.error_code == 'SUCCESS') {
        res.data.result.path = app.baseImgUrl + '/' + res.data.result.path
        that.setData({
          'ercode': res.data.result.path
        })
      } else {
        wx.showToast({
          title: res.data.reason,
          icon: 'none',
          duration: 1000
        })
      }
    })
  },

  // 图片预览
  previewImage(e) {
    console.log(e)
    let imgArr = []
    let itemUrl = e.currentTarget.dataset.src
    imgArr.push(itemUrl)
    wx.previewImage({
      current: itemUrl, // 当前显示图片的http链接
      urls: imgArr, // 需要预览的图片http链接列表
    })
  }
})