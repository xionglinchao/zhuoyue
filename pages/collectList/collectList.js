const app = getApp()
Page({
  data: {
    'page': 1,   // 默认当前页码
    'pageSize': 10,  // 每页加载的数据
    'contentlist': [],
    'delPopup': true  // 隐藏删除弹窗
  },
  onLoad: function (options) {

  },
  onReady: function () {

  },
  onShow: function () {
    this.getCollectList()
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
      that.getCollectList()
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

  // }

  //按下事件开始
  mytouchstart(e) {
    let that = this;
    that.setData({
      'touch_start': e.timeStamp
    })
    console.log(e.timeStamp + '- touch-start')
  },
  //按下事件结束
  mytouchend(e) {
    let that = this;
    that.setData({
      'touch_end': e.timeStamp
    })
    console.log(e.timeStamp + '- touch-end')
  },
  // 长按删除收藏记录
  deleteTask(e) {
    let that = this
    let taskId = e.currentTarget.dataset.item.task_id
    let orgId = e.currentTarget.dataset.item.org_id
    // 触摸时间距离页面打开的毫秒数
    let touchTime = that.data.touch_end - that.data.touch_start
    console.log('333',touchTime)
    // 如果按下时间大于350为长按
    if (touchTime > 350) {
      this.setData({
        'delPopup': false,
        'taskId': taskId
      })
    } else {
      wx.navigateTo({
        url: '/pages/formDetail/formDetail?taskId=' + taskId + '&orgId=' + orgId,
      })
    }
  },
  // 隐藏删除弹窗
  hideDelPopup() {
    this.setData({
      'delPopup': true
    })
  },
  // 确定删除按钮点击
  delClick() {
    let that = this, url = `${app.baseUrl}/task/support`, data = {}
    data = {
      'taskid': that.data.taskId  // 任务id
    }
    app.wxRequest(url, data, (res) => {
      console.log('取消收藏', res)
      if (res.data.error_code == 'SUCCESS') {
        that.setData({
          'delPopup': true
        })
        // 页面刷新
        that.getCollectList()
      } else {
        wx.showToast({
          title: res.data.reason,
          icon: 'none',
          duration: 1000
        })
      }
    })
  },
  // 获取收藏列表
  getCollectList() {
    let that = this, url = `${app.baseUrl}/userinfo/my_supprot`, data = {}
    data = {
      'page': that.data.page,
      'page_size': that.data.pageSize
    }
    app.wxRequest(url, data, (res) => {
      console.log('收藏列表', res)
      if(res.data.error_code == 'SUCCESS') {
        let contentlistTem = that.data.contentlist
        if (that.data.page == 1) {
          contentlistTem = []
        }
        let contentlist = res.data.result.my_supprot
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
      } else {
        console.log('获取失败', res.data.reason)
      }
    })
  }
})