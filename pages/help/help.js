const app = getApp()
var WxParse = require('../../wxParse/wxParse.js')
Page({
  data: {
    
  },
  onLoad: function (options) {

  },
  onReady: function () {

  },
  onShow: function () {
    this.getHelpInfo()
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

  // 获取帮助页面信息
  getHelpInfo() {
    let that = this, url = `${app.baseUrl}/userinfo/myhelp`, data = {}
    app.wxRequest(url, data, (res) => {
      console.log('帮助页面', res)
      if(res.data.error_code == 'SUCCESS') {
        let questionList = res.data.result.help_list
        // for (let i = 0; i < questionList.length;++i) {
        //   let article = questionList[i].content
        //   WxParse.wxParse('article' + i, 'html', article, that, 5)
        //   questionList[i].showAnswer = 0
        //   questionList[i].article = that.data['article' + i]
        // }
        that.setData({
          'questionList': questionList
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

  // 显示问题答案
  showAnswerClick(e) {
    // let that = this
    // let item = e.currentTarget.dataset.item
    // let index = e.currentTarget.dataset.idx
    // let dom = `questionList[${index}].showAnswer`
    // let show = item.showAnswer == 0 ? 1 : 0
    // that.setData({
    //   [dom]: show
    // })
    console.log(e)
    let questionId = e.currentTarget.dataset.item.id
    wx.navigateTo({
      url: '/pages/helpAnswer/helpAnswer?questionId=' + questionId,
    })
  }
})