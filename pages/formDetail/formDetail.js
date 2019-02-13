const app = getApp()
var WxParse = require('../../wxParse/wxParse.js')

Page({
  data: {
    'getPopup': true, // 隐藏领取提示弹窗
    'isApply': true,  // 是否隐藏申请成功
  },
  onLoad: function (options) {
    let that = this
    this.setData({
      'taskId': options.taskId || null,  // 登记表Id
      'orgId': options.orgId || null,  // 机构id
    })
    if (options.extendman) {
      setTimeout(function () {
        that.bindSuperior(options.extendman)
      }, 10000)
    }
  },
  onReady: function () {

  },
  onShow: function () {
    this.getTaskDetailInfo()
    this.getMoreTasks()
  },
  onHide: function () {

  },
  onUnload: function () {

  },
  onPullDownRefresh: function () {

  },
  onReachBottom: function () {

  },
  onShareAppMessage: function (res) {
    let that = this
    let extendman = wx.getStorageSync('bindId')
    let taskId = that.data.taskId, orgId = that.data.orgId
    console.log('extendman', extendman)
    if (res.from === 'menu') {
      return {
        title: '一个会帮你赚钱的小程序',
        path: '/pages/formDetail/formDetail?extendman=' + extendman + '&taskId=' + taskId + '&orgId=' + orgId,
        imageUrl: '../../images/share_cover.png'
      }
    }
  },
  // 绑定上级
  bindSuperior(id) {
    let that = this, url = `${app.baseUrl}/register/band_uid`
    let data = {
      uid: id
    }
    app.wxRequest(url, data, (res) => {
      console.log('绑定上级', res)
    })
  },
  // 显示领取提示弹窗
  showGetPopup() {
    let that = this
    that.setData({
      'getPopup': false
    })
  },
  // 隐藏领取提示弹窗
  hideGetPopup() {
    this.setData({
      'getPopup': true
    })
  },
  // 领取确定点击
  applyBtnClick() {
    this.setData({
      'getPopup': true
    })
    let that = this, url = `${app.baseUrl}/task/get_task`, data = {}
    data = {
      'task_id': that.data.taskId
    }
    app.wxRequest(url, data, (res) => {
      console.log('任务领取', res)
      if(res.data.error_code == "SUCCESS") {
        that.setData({
          'isApply': false,
        })
        // 更新页面
        that.getTaskDetailInfo()
      } else {
        wx.showToast({
          title: res.data.reason,
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  // 隐藏领取成功弹窗
  hideApplySuccess() {
    this.setData({
      'isApply': true,
    })
  },
  // 获取任务详情
  getTaskDetailInfo() {
    let that = this, url = `${app.baseUrl}/task/task_detail`, data = {}
    data = {
      'task_id': that.data.taskId
    }
    app.wxRequest(url, data, (res) => {
      console.log('任务详情',res)
      if(res.data.error_code == "SUCCESS") {
        let article = res.data.result.task_detail.content
        WxParse.wxParse('article', 'html', article, that, 5)
        res.data.result.task_detail.image = app.baseImgUrl + res.data.result.task_detail.image
        res.data.result.task_detail.logo = app.baseImgUrl + res.data.result.task_detail.logo
        that.setData({
          'taskDetail': res.data.result.task_detail,
          'count': res.data.result.count
        })
      }
    })
  },
  // 获取更多任务
  getMoreTasks() {
    let that = this, url = `${app.baseUrl}/task/more_task`, data = {}
    data = {
      'org_id': that.data.orgId,   // 机构id
    }
    app.wxRequest(url, data, (res) => {
      console.log('更多任务', res)
      that.setData({
        'moreTasks': res.data.result.task_list
      })
    })
  },
  // 更多内容 页面跳转
  toTaskDetail(e) {
    let taskId = e.currentTarget.dataset.item.task_id
    let orgId = e.currentTarget.dataset.item.orgid
    wx.redirectTo({
      url: '/pages/formDetail/formDetail?taskId=' + taskId + '&orgId=' + orgId,
    })
  },
  // 收藏按钮点击
  likeBtnClick(e) {
    let taskId = e.currentTarget.dataset.id  
    let that = this, url = `${app.baseUrl}/task/support`, data = {}
    data = {
      'taskid': taskId   // 任务id
    }
    app.wxRequest(url, data, (res) => {
      console.log('收藏', res)
      if (res.data.error_code == 'SUCCESS') {
        wx.showToast({
          title: res.data.reason,
          icon: 'none',
          duration: 1000
        })
        // 页面刷新
        that.getTaskDetailInfo()
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