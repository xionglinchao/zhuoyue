const app = getApp()

Page({
  data: {
    'page': 1,   // 默认当前页码
    'pageSize': 10,  // 每页加载的数据
    'hasMoreData': true,
    'contentlist': [],
  },
  onLoad: function (options) {

  },
  onReady: function () {

  },
  onShow: function () {
    // 获取当前时间
    let date = new Date()
    let year = date.getFullYear()
    let month = date.getMonth() + 1
    let day = date.getDate()
    let nowDate = year + "-" + (month < 10 ? "0" + month : month) + "-" + (day < 10 ? "0" + day : day)
    // 获取前30天时间
    let lastDate = new Date(date - 1000 * 60 * 60 * 24 * 30);//最后30天可以更改，意义：是获取多少天前的时间
    let lastY = lastDate.getFullYear()
    let lastM = lastDate.getMonth() + 1
    let lastD = lastDate.getDate()
    let LDate = lastY + "-" + (lastM < 10 ? "0" + lastM : lastM) + "-" + (lastD < 10 ? "0" + lastD : lastD) //得到30天前的时间
    this.setData({
      'nowDate': nowDate, // 当前时间
      'LDate': LDate   // 前30天时间
    })
    this.getCustomerList()
  },
  onHide: function () {

  },
  onUnload: function () {

  },
  onPullDownRefresh: function () {

  },
  onReachBottom: function () {
    if (this.data.hasMoreData) {
      wx.showLoading({
        title: '正在加载',
      })
      this.getCustomerList()
      setTimeout(function () {
        wx.hideLoading()
      }, 1000)
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

  // 起始日期
  chooseStartDate(e) {
    let that = this
    let startDate = e.detail.value
    if (new Date(startDate).getTime() <= new Date(that.data.nowDate).getTime()) {
      that.setData({
        'LDate': startDate,
        'page': 1
      })
      that.getCustomerList()
    } else {
      wx.showToast({
        title: '请选择正确的开始查询时间',
        icon: 'none',
        duration: 1000
      })
    }
  },
  chooseEndDate(e) {
    let that = this
    let endDate = e.detail.value
    if (new Date(that.data.LDate).getTime() <= new Date(endDate).getTime()) {
      that.setData({
        'nowDate': endDate,
        'page': 1
      })
      that.getCustomerList()
    } else {
      wx.showToast({
        title: '请选择正确的截止查询时间',
        icon: 'none',
        duration: 1000
      })
    }
  },

  // 获取已登记客户列表
  getCustomerList() {
    let that = this, url = `${app.baseUrl}/task/my_cust`, data = {}
    data = {
      'start_time': that.data.LDate,  // 开始日期
      'end_time': that.data.nowDate,   // 结束日期
      'page': that.data.page,
      'page_size': that.data.pageSize
    }
    app.wxRequest(url, data, (res) => {
      console.log('查询结果', res)
      if (res.data.error_code == 'SUCCESS') {
        let contentlistTem = that.data.contentlist
        if (that.data.page == 1) {
          contentlistTem = []
        }
        let contentlist = res.data.result.cust_list
        if (contentlist.length < that.data.pageSize) {
          that.setData({
            'contentlist': contentlistTem.concat(contentlist),
            'hasMoreData': false
          })
        } else {
          that.setData({
            'contentlist': contentlistTem.concat(contentlist),
            'hasMoreData': true,
            'page': that.data.page + 1
          })
        }
      }
    })
  }
})