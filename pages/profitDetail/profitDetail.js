const app = getApp()

Page({
  data: {
    'page': 1,   // 默认当前页码
    'pageSize': 10,  // 每页加载的数据
    'hasMoreData': true,
    'contentlist': [],
  },
  onLoad: function (options) {
    let myDate = new Date()  //获取系统当前时间
    let year = myDate.getFullYear(), month = myDate.getMonth() + 1
    let currentDate = year + '-' + month
    this.setData({
      'currentYear': year,
      'currentMonth': month,
      'currentDate': currentDate
    })
  },
  onReady: function () {

  },
  onShow: function () {
    this.getCurrentMonthInfo()
  },
  onHide: function () {

  },
  onUnload: function () {

  },
  onPullDownRefresh: function () {

  },
  onReachBottom: function () {
    if (this.data.hasMoreData) {
      this.getCurrentMonthInfo()
    } else {
      wx.showToast({
        title: '没有更多数据',
        icon: 'none',
        duration: 1000
      })
    }
  },
  // onShareAppMessage: function () {

  // },
  // 获取当前月份明细
  getCurrentMonthInfo() {
    let that = this, url = `${app.baseUrl}/wallet/useramt`, data = {}
    data = {
      'date': that.data.currentDate,  // 当前月份
      'page': that.data.page,
      'page_size': that.data.pageSize
    }
    app.wxRequest(url, data, (res) => {
      console.log('当前月份', res)
      if(res.data.error_code == 'SUCCESS') {
        let contentlistTem = that.data.contentlist
        if (that.data.page == 1) {
          contentlistTem = []
        }
        let contentlist = res.data.result.amtlist
        if (contentlist.length < that.data.pageSize) {
          that.setData({
            'spending': res.data.result.outamt,  // 支出
            'income': res.data.result.inamt,  // 收入
            'contentlist': contentlistTem.concat(contentlist),
            'hasMoreData': false
          })
        } else {
          that.setData({
            'spending': res.data.result.outamt,  // 支出
            'income': res.data.result.inamt,  // 收入
            'contentlist': contentlistTem.concat(contentlist),
            'hasMoreData': true,
            'page': that.data.page + 1
          })
        }
      } else {
        wx.showToast({
          title: res.data.reason,
          icon: 'none',
          duration: 1000
        })
      }
    })
  },
  // 选择查看月份
  chooseDate(e) {
    let checkDate = e.detail.value
    let chooseDate = checkDate.split("-")
    this.setData({
      'currentYear': chooseDate[0],
      'currentMonth': chooseDate[1],
      'currentDate': checkDate,
      'page': 1
    })
    this.getCurrentMonthInfo()
  },
  // 跳转首页
  toHomepage() {
    wx.reLaunch({
      url: '/pages/homePage/homePage',
    })
  }
})