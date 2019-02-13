const app = getApp()
var WxParse = require('../../wxParse/wxParse.js')
Page({
  data: {

  },
  onLoad: function(options) {
    this.setData({
      'questionId': options.questionId
    })
    this.getAnswerDetail()
  },
  onReady: function() {

  },
  onShow: function() {

  },
  onHide: function() {

  },
  onUnload: function() {

  },
  onPullDownRefresh: function() {

  },
  onReachBottom: function() {

  },
  // onShareAppMessage: function () {

  // }

  // 获取问题详情
  getAnswerDetail() {
    let that = this,
      url = `${app.baseUrl}/userinfo/help_detail`,
      data = {}
    data = {
      'help_id': that.data.questionId
    }
    app.wxRequest(url, data, (res) => {
      console.log('问题答案', res)
      if (res.data.error_code == 'SUCCESS') {
        let article = res.data.result.help_detail.content
        WxParse.wxParse('article', 'html', article, that, 5)
        that.setData({
          'answer': res.data.result.help_detail
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