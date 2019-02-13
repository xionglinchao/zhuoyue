const app = getApp()

Page({
  data: {
    'gender': 1,  // 性别选择
  },
  onLoad: function (options) {
    let that = this
    let scene = decodeURIComponent(options.scene)
    console.log('场景值', scene)
    if (scene != 'undefined') {
      var task_id = scene.split('&')[1].split('=')[1]
      that.setData({
        taskId: task_id
      })
      this.getMyTaskInfo()
    } else {
      wx.showToast({
        title: '未获取到任务id',
        icon: 'none',
        duration: 1000
      })
    }
  },
  onReady: function () {

  },
  onShow: function () {
    
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

  // 默认登记表
  getMyTaskInfo() {
    let that = this, url = `${app.baseUrl}/task/task_detail`, data = {}
    data = {
      task_id: that.data.taskId
    }
    app.wxRequest(url, data, (res) => {
      if (res.data.error_code != 'SUCCESS') {
        wx.showToast({
          title: res.data.reason,
          icon: 'none',
          duration: 1000
        })
        return false
      }
      that.setData({
        'taskDetail': res.data.result.task_detail
      })
    })
  },

  // 姓名输入
  nameInput(e) {
    let nameValue = e.detail.value
    this.setData({
      'nameValue': nameValue
    })
  },
  // 电话输入
  phoneInput(e) {
    let phoneValue = e.detail.value
    this.setData({
      'phoneValue': phoneValue
    })
  },
  // 年龄输入
  ageInput(e) {
    let ageValue = e.detail.value
    this.setData({
      'ageValue': ageValue
    })
  },
  // 备注
  noteInput(e) {
    let noteValue = e.detail.value
    this.setData({
      'noteValue': noteValue
    })
  },
  // 性别选择
  chooseMan() {
    this.setData({
      'gender': 1,
    })
  },
  chooseWoman() {
    this.setData({
      'gender': 0,
    })
  },
  // 提交登记表
  confirmBtnClick() {
    let that = this, url = `${app.baseUrl}/task/add_cust`, data = {}
    if (!that.data.taskId) {
      wx.showToast({
        title: '请选择登记表',
        icon: 'none',
        duration: 1000
      })
    } else if (!that.data.nameValue) {
      wx.showToast({
        title: '请输入姓名',
        icon: 'none',
        duration: 1000
      })
    } else if (that.data.phoneValue.length != 11) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none',
        duration: 1000
      })
    } else if (!that.data.ageValue) {
      wx.showToast({
        title: '请输入年龄',
        icon: 'none',
        duration: 1000
      })
    }
    data = {
      'taskid': that.data.taskId,  // 任务id
      'name': that.data.nameValue,  // 用户姓名
      'sex': that.data.gender,  // 0女 1男
      'telephone': that.data.phoneValue,  // 手机号
      'age': that.data.ageValue,  // 年龄
      'remark': that.data.noteValue,  // 备注(选填)
    }
    app.wxRequest(url, data, (res) => {
      console.log('登记表提交', res)
      if (res.data.error_code == 'SUCCESS') {
        wx.showToast({
          title: res.data.reason,
          icon: 'none',
          duration: 1000
        })
        that.setData({
          'nameValue': '',
          'phoneValue': '',
          'ageValue': '',
          'noteValue': ''
        })
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
          duration: 1000
        })
      }
    })
  }
})