const app = getApp()

Page({
  data: {
    'tab': ['全部', '进行中', '审核中', '已过期', '拒绝'],  // 选项卡
    'isChoosed': true,  // 是否不设置默认
    'page': 1,   // 默认当前页码
    'pageSize': 10,  // 每页加载的数据
    'contentlist': [],
    'delPopup': true  // 隐藏删除弹窗
  },
  onLoad: function (options) {
    this.setData({
      'tabIdx': options.tabIdx || null  // 选项卡下标
    })
  },
  onReady: function () {

  },
  onShow: function () {
    this.getAllMyTaskInfo()
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
      that.getAllMyTaskInfo()
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
  // 选择默认表
  chooseDefaultForm(e) {
    let idx = e.currentTarget.dataset.idx
    let taskId = e.currentTarget.dataset.item.taskid
    let that = this, url = `${app.baseUrl}/task/default_task`, data = {}
    data = {
      'task_id': taskId,  // 登记表id
    }
    app.wxRequest(url, data, (res) => {
      console.log('选择默认表', res)
      if (res.data.error_code == 'SUCCESS') {
        wx.showToast({
          title: '设置成功',
          icon: 'none',
          duration: 1000
        })
        that.setData({
          'idx': idx,
          'tabIdx': that.data.tabIdx
        })
        that.getAllMyTaskInfo()
      }
    })
  },
  // 选项卡点击事件
  tabClick(e) {
    let tabIdx = e.currentTarget.dataset.tabIdx
    this.setData({
      'tabIdx': tabIdx
    })
    this.getAllMyTaskInfo()
  },

  // 获取所有任务列表
  getAllMyTaskInfo() {
    let that = this, url = `${app.baseUrl}/task/all_my_task`, data = {}
    let tabIdx = that.data.tabIdx
    if(tabIdx == 4) {
      tabIdx = 5
    }
    data = {
      'status': tabIdx,  // 0全部 1进行中 2审核总 3已过期 5拒绝
      'page': that.data.page,
      'page_size': that.data.pageSize
    }
    app.wxRequest(url, data, (res) => {
      console.log('任务列表', res)
      if(res.data.error_code == 'SUCCESS') {
        let contentlistTem = that.data.contentlist
        if (that.data.page == 1) {
          contentlistTem = []
        }
        let contentlist = res.data.result.all_task
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
  },

  // 查看登记表详情
  checkTaskDetail(e) {
    let taskId = e.currentTarget.dataset.item.taskid  // 任务id
    let orgId = e.currentTarget.dataset.item.orgid  // 机构id
    wx.navigateTo({
      url: '/pages/formDetail/formDetail?taskId=' + taskId + '&orgId=' + orgId,
    })
  },

  // 显示删除弹窗
  delTaskClick(e) {
    let taskId = e.currentTarget.dataset.item.taskid
    this.setData({
      'delPopup': false,
      'taskId': taskId  // 任务id
    })
  },
  // 隐藏删除弹窗
  hideDelPopup() {
    this.setData({
      'delPopup': true
    })
  },
  // 确认删除按钮点击
  delClick() {
    let that = this
    let url = `${app.baseUrl}/task/del_task`, data = {}
    data = {
      'task_id': that.data.taskId,  // 登记表id
    }
    app.wxRequest(url, data, (res) => {
      console.log('删除登记表', res)
      if (res.data.error_code == 'SUCCESS') {
        wx.showToast({
          title: res.data.reason,
          icon: 'none',
          duration: 1000
        })
        // 刷新页面
        that.setData({
          'delPopup': true
        })
        that.getAllMyTaskInfo()
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