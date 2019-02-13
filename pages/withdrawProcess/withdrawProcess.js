const app = getApp()
Page({
  data: {

  },
  onLoad: function (options) {
    this.setData({
      'id': options.id || null,  // 提现记录id
    })
  },
  onReady: function () {

  },
  onShow: function () {
    this.getWithdrawProcess()
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
  // 提现进度
  getWithdrawProcess() {
    let that = this, url = `${app.baseUrl}/wallet/cash_detail`, data = {}
    data = {
      'cash_id': that.data.id   // 提现记录id
    }
    app.wxRequest(url, data, (res) => {
      console.log('提现进度', res)
      if(res.data.error_code == 'SUCCESS') {
        res.data.result.cash_detail.count = res.data.result.cash_detail.count.slice(-4)
        that.setData({
          'processDetail': res.data.result.cash_detail
        })
      }
    })
  },

  // 完成按钮
  doneClick() {
    wx.navigateBack({
      delta: 2,
    })
  }
})