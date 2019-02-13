const app = getApp()
Page({
  data: {
    'page': 1,   // 默认当前页码
    'pageSize': 10,  // 每页加载的数据
    'contentlist': []
  },
  onLoad: function (options) {

  },
  onReady: function () {

  },
  onShow: function () {
    this.getFansList()
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
  // 获取绑定下级列表
  getFansList() {
    let that = this, url = `${app.baseUrl}/userinfo/my_extend`, data = {}
    data = {
      'page': that.data.page,
      'page_size': that.data.pageSize
    }
    app.wxRequest(url, data, (res) => {
      console.log('下级列表', res)
      if (res.data.error_code == 'SUCCESS') {
        let contentlistTem = that.data.contentlist
        if (that.data.page == 1) {
          contentlistTem = []
        }
        let contentlist = res.data.result.my_extends
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