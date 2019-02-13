const app = getApp()

Page({
  data: {
    'isChoosed': true,  // 是否不设置默认
  },
  onLoad: function (options) {
    
  },
  onReady: function () {

  },
  onShow: function () {
    this.getMyTaskInfo()
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
  // 已领取的登记表
  getMyTaskInfo() {
    let that = this, url = `${app.baseUrl}/task/my_task`, data = {}
    app.wxRequest(url, data, (res) => {
      console.log('已领取的登记表', res)
      if (res.data.error_code == 'SUCCESS') {
        that.setData({
          'myTask': res.data.result.mydetail
        })
      }
    })
  },

  // 选择默认表
  chooseDefaultForm(e) {
    let idx = e.currentTarget.dataset.idx
    let taskId = e.currentTarget.dataset.id
    let that = this, url = `${app.baseUrl}/task/default_task`, data = {}
    data = {
      'task_id': taskId,  // 登记表id
    }
    app.wxRequest(url, data, (res) => {
      console.log('选择默认表', res)
      if(res.data.error_code == 'SUCCESS') {
        wx.showToast({
          title: '设置成功',
          icon: 'none',
          duration: 1000
        })
        that.setData({
          'idx': idx
        })
        setTimeout(function () {
          wx.navigateBack({
            delta: 1
          })
        }, 1000)
      }
    })
  },

  // 查看登记表
  checkFormDetail(e) {
    let taskId = e.currentTarget.dataset.id  // 登记表id
    wx.navigateTo({
      url: '/pages/checkFormDetail/checkFormDetail?taskId=' + taskId,
    })
  },
  
  // 删除登记表
  delTaskClick(e) {
    let that = this
    let taskId = e.currentTarget.dataset.id
    wx.showModal({
      title: '提示',
      content: '是否确认删除？',
      success(res) {
        if(res.confirm) {
          let url = `${app.baseUrl}/task/del_task`, data = {}
          data = {
            'task_id': taskId,  // 登记表id
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
              that.getMyTaskInfo()
            } else {
              wx.showToast({
                title: res.data.reason,
                icon: 'none',
                duration: 1000
              })
            }
          })
        }
      }
    })
  }
})