const app = getApp()
Page({
  data: {

  },
  onLoad: function (options) {

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
  // 获取用户信息
  getInfo(e) {
    if (!e.detail.iv) {
      wx.showModal({
        title: '提示',
        content: '请先允许授权用户信息',
        showCancel: false,
        success: function () {}
      })
      return false
    }
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              console.log('用户信息',res)
              // 可以将 res 发送给后台解码出 unionId
              app.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
              wx.setStorage({
                key: 'iv',
                data: res.iv,
                success: () => {
                  wx.navigateBack()
                }
              })
              return false
            }
          })
        }
      }
    })
  }
})