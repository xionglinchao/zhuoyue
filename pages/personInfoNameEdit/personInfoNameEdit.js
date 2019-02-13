const app = getApp()
Page({
  data: {

  },
  onLoad: function (options) {
    this.setData({
      'nameType': options.nameType  // 判断修改姓名的类型 1是昵称 2是真实姓名
    })
  },
  onReady: function () {

  },
  onShow: function () {

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

  // },

  // 修改昵称
  editNewName(e) {
    let newName = e.detail.value
    this.setData({
      'newName': newName
    })
  },
  confirmBtnClick() {
    let that = this
    if (!that.data.newName) {
      wx.showToast({
        title: '请输入新的昵称',
        icon: 'none',
        duration: 1000
      })
      return false
    }
    let url = `${app.baseUrl}/userinfo/edit`, data = {}
    if (that.data.nameType == 1) {
      data = {
        'nickname': that.data.newName
      }
    } else {
      data = {
        'truename': that.data.newName
      }
    }
    app.wxRequest(url, data, (res) => {
      console.log('修改昵称', res)
      if (res.data.error_code == 'SUCCESS') {
        wx.navigateBack({
          delta: 1
        })
      } else {
        wx.showToast({
          title: res.data.reason,
          icon: 'none',
          duration: 1000
        })
      }
    })
  }
})