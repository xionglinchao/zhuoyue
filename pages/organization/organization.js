const app = getApp()

Page({
  data: {
    'tab': ['全部', '有效', '审核中', '已结算', '拒绝'],  // 选项卡
    'isChoosed': true,  // 是否不设置默认
    'page': 1,   // 默认当前页码
    'pageSize': 10,  // 每页加载的数据
    'contentlist': []
  },
  onLoad: function (options) {
    this.setData({
      'tabIdx': options.tabIdx ? options.tabIdx : '0',  // 选项卡下标
    })
  },
  onReady: function () {

  },
  onShow: function () {
    this.getAllOrganization()
  },
  onHide: function () {

  },
  onUnload: function () {

  },
  onPullDownRefresh: function () {

  },
  onReachBottom: function () {
    let that = this
    if (that.data.hasMoreData) {
      wx.showLoading({
        title: '正在加载',
      })
      that.setData({
        'tabIdx': that.data.tabIdx
      })
      that.getAllOrganization()
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
  // 选项卡点击事件
  tabClick(e) {
    let tabIdx = e.currentTarget.dataset.tabIdx
    this.setData({
      'tabIdx': tabIdx
    })
    this.getAllOrganization()
  },

  // 获取所有机构信息
  getAllOrganization() {
    let that = this, url = `${app.baseUrl}/org/my_org`, data = {}, status = ''
    if (that.data.tabIdx == 0) {
      status = ''
    } else if (that.data.tabIdx == 1) {
      status = 'pass'
    } else if (that.data.tabIdx == 2) {
      status = 'ready'
    } else if (that.data.tabIdx == 3) {
      status =  'clear'
    } else if (that.data.tabIdx == 4) {
      status = 'nopass'
    }
    data = {
      'status': status,  // 机构状态
      'page': that.data.page,
      'page_size': that.data.pageSize
    }
    app.wxRequest(url, data, (res) => {
      console.log('所有机构', res)
      if(res.data.error_code == 'SUCCESS') {
        let contentlistTem = that.data.contentlist
        if (that.data.page == 1) {
          contentlistTem = []
        }
        let contentlist = res.data.result.myorg
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