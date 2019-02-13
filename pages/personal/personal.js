const app = getApp()

Page({
  data: {
    
  },
  onLoad: function (options) {
    let that = this
    let userDetail = app.globalData.userInfo // 用户信息
    this.setData({
      'userDetail': userDetail
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
    this.saveUserInfo()
    this.getAllTaskInfo()
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
    let extendman = wx.getStorageSync('bindId')
    console.log('extendman', extendman)
    if (res.from === 'menu') {
      return {
        title: '一个会帮你赚钱的小程序',
        path: '/pages/personal/personal?extendman=' + extendman,
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
  // 所有机构页面跳转
  toAllOrganization() {
    wx.navigateTo({
      url: '/pages/organization/organization?tabIdx=0',
    })
  },
  toAllOrganization_sec() {
    wx.navigateTo({
      url: '/pages/organization/organization?tabIdx=1',
    })
  },
  toAllOrganization_third() {
    wx.navigateTo({
      url: '/pages/organization/organization?tabIdx=2',
    })
  },
  toAllOrganization_four() {
    wx.navigateTo({
      url: '/pages/organization/organization?tabIdx=3',
    })
  },
  toAllOrganization_five() {
    wx.navigateTo({
      url: '/pages/organization/organization?tabIdx=4',
    })
  },
  // 修改用户信息页面跳转
  toSetPersonalInfo_sec() {
    wx.navigateTo({
      url: '/pages/personInfo/personInfo',
    })
  },
  // 所有任务页面跳转
  toRegistrationForm() {
    wx.navigateTo({
      url: '/pages/formList/formList?tabIdx=0',
    })
  },
  toRegistrationForm_sec() {
    wx.navigateTo({
      url: '/pages/formList/formList?tabIdx=1',
    })
  },
  toRegistrationForm_third() {
    wx.navigateTo({
      url: '/pages/formList/formList?tabIdx=2',
    })
  },
  toRegistrationForm_four() {
    wx.navigateTo({
      url: '/pages/formList/formList?tabIdx=3',
    })
  },
  toRegistrationForm_five() {
    wx.navigateTo({
      url: '/pages/formList/formList?tabIdx=4',
    })
  },
  // 保存默认微信信息
  saveUserInfo() {
    let nickname = wx.getStorageSync('nickname')
    console.log('nickname333333', nickname)
    if (nickname) {
      this.getUserInfo()
      console.log(1111111111)
    } else {
      let userDetail = this.data.userDetail
      let that = this, url = `${app.baseUrl}/userinfo/edit`, data = {}
      data = {
        'image': userDetail.avatarUrl,  // 头像
        'nickname': userDetail.nickName, // 昵称
        'sex': userDetail.gender  // 性别
      }
      app.wxRequest(url, data, (res) => {
        console.log('保存默认微信信息', res)
        if (res.data.error_code == 'SUCCESS') {
          that.getUserInfo()
          console.log(2222222222)
        } else {
          wx.showToast({
            title: res.data.reason,
            icon: 'none',
            duration: 1000
          })
        }
      })
    }
  },
  // 获取个人信息
  getUserInfo() {
    console.log('userDetail', this.data.userDetail)
    let that = this, url = `${app.baseUrl}/userinfo/user_info`, data = {}
    app.wxRequest(url, data, (res) => {
      console.log('获取个人信息', res)
      if (res.data.error_code == "SUCCESS") {
        that.setData({
          'userInfo': res.data.result.userinfo
        })
        wx.setStorageSync('bindId', res.data.result.userinfo.uid)
        wx.setStorageSync('nickname', res.data.result.userinfo.nickname)
      } else {
        wx.showToast({
          title: res.data.reason,
          icon: 'none',
          duration: 1000
        })
      }
    })
  },
  // 获取任务、机构基本信息
  getAllTaskInfo() {
    let that = this, url = `${app.baseUrl}/userinfo/my_info`, data = {}
    app.wxRequest(url, data, (res) => {
      console.log('任务、机构数量', res)
      if (res.data.error_code == "SUCCESS") {
        that.setData({
          'allTasks': res.data.result.my_count
        })
      }
    })
  },
  // 下级推广员页面跳转
  toFansList() {
    wx.navigateTo({
      url: '/pages/fansList/fansList',
    })
  },
  // 收藏页面跳转
  toCollectList() {
    wx.navigateTo({
      url: '/pages/collectList/collectList',
    })
  },
  // 帮助页面跳转
  toHelp() {
    wx.navigateTo({
      url: '/pages/help/help',
    })
  },
  // 反馈页面跳转
  toFeedback() {
    wx.navigateTo({
      url: '/pages/feedback/feedback',
    })
  },
  // 机构注册页面跳转
  toOrgRegister() {
    let uid = this.data.userInfo.uid
    wx.navigateTo({
      url: '/pages/orgRegister/orgRegister?uid=' + uid,
    })
  }
})