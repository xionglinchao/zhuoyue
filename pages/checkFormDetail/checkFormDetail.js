const app = getApp()
var WxParse = require('../../wxParse/wxParse.js')

Page({
  data: {
    
  },
  onLoad: function (options) {
    this.setData({
      'taskId': options.taskId || null,  // 登记表id
    })
  },
  onReady: function () {

  },
  onShow: function () {
    this.getTaskDetailInfo()
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
  // 获取任务详情
  getTaskDetailInfo() {
    let that = this, url = `${app.baseUrl}/task/task_detail`, data = {}
    data = {
      'task_id': that.data.taskId
    }
    app.wxRequest(url, data, (res) => {
      console.log('任务详情', res)
      if (res.data.error_code == "SUCCESS") {
        let article = res.data.result.task_detail.content
        WxParse.wxParse('article', 'html', article, that, 5)
        res.data.result.task_detail.image = app.baseImgUrl + res.data.result.task_detail.image
        that.setData({
          'taskDetail': res.data.result.task_detail,
        })
      }
    })
  }
})