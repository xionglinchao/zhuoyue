const app = getApp()
Page({
  data: {
    'isGenderHide': true,  // 是否隐藏性别选择
    'isMale': 1,
  },
  onLoad: function (options) {
    
  },
  onReady: function () {

  },
  onShow: function () {
    this.getUserInfo()
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
  // 性别选择弹窗点击事件
  showGender() {
    this.setData({
      'isGenderHide': false
    })
  },
  hideGender() {
    this.setData({
      'isGenderHide': true
    })
  },
  // 性别修改
  maleChooseClick() {
    let that = this
    that.setData({
      'isMale': 1
    })
    let url = `${app.baseUrl}/userinfo/edit`, data = {}
    data = {
      'sex': that.data.isMale,
    }
    app.wxRequest(url, data, (res) => {
      console.log('修改性别', res)
      if (res.data.error_code == 'SUCCESS') {
        that.setData({
          'isGenderHide': true
        })
        that.getUserInfo()
      }
    })
  },
  femaleChooseClick() {
    let that = this
    that.setData({
      'isMale': 0
    })
    let url = `${app.baseUrl}/userinfo/edit`, data = {}
    data = {
      'sex': that.data.isMale,
    }
    app.wxRequest(url, data, (res) => {
      console.log('修改性别', res)
      if (res.data.error_code == 'SUCCESS') {
        that.setData({
          'isGenderHide': true
        })
        that.getUserInfo()
      }
    })
  },
  // 获取个人信息
  getUserInfo() {
    let that = this, url = `${app.baseUrl}/userinfo/user_info`, data = {}
    app.wxRequest(url, data, (res) => {
      console.log('获取个人信息', res)
      if (res.data.error_code == "SUCCESS") {
        that.setData({
          'userInfo': res.data.result.userinfo,
          'extend': res.data.result.extent
        })
      }
    })
  },
  // 头像选择
  chooseImgClick() {
    let that = this
    let token = wx.getStorageSync('x-Ticket')
    wx.chooseImage({
      count: 1,
      success: function(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths[0]
        that.setData({
          'image': tempFilePaths
        })
        wx.uploadFile({
          url: 'https://www.hzsimple.com/api/image/upload',
          filePath: that.data.image,
          name: 'image',
          formData: {
            'type': '1'
          },
          header: {
            "Content-Type": "application/json",
            'X-Ticket': token
          },
          success: function(res) {
            console.log('修改头像', res, JSON.parse(res.data))
            if (JSON.parse(res.data).error_code != 'SUCCESS') {
              wx.showToast({
                title: JSON.parse(res.data).reason,
                icon: 'none',
                duration: 1000
              })
              return false
            }
            let imgUlr = JSON.parse(res.data).result.url
            console.log('imgUlr', imgUlr)
            let url = `${app.baseUrl}/userinfo/edit`, data = {}
            data = {
              'image': imgUlr  // 用户头像
            }
            app.wxRequest(url, data, (resOps) => {
              console.log('显示修改头像', resOps)
              if (resOps.data.error_code == 'SUCCESS') {
                that.getUserInfo()
              } else {
                wx.showToast({
                  title: resOps.data.reason,
                  icon: 'none',
                  duration: 1000
                })
              }
            })
          }
        })
      },
    })
  },
  // 修改昵称
  editNickname() {
    wx.navigateTo({
      url: '/pages/personInfoNameEdit/personInfoNameEdit?nameType=1',
    })
  },
  // 修改真实姓名
  editTruename() {
    wx.navigateTo({
      url: '/pages/personInfoNameEdit/personInfoNameEdit?nameType=2',
    })
  },
  // 出生日期选择
  chooseBirthDate(e) {
    let that = this
    let birthDate = e.detail.value
    let url = `${app.baseUrl}/userinfo/edit`, data = {}
    data = {
      'birthday': birthDate,
    }
    app.wxRequest(url, data, (res) => {
      console.log('修改出生日期', res)
      if (res.data.error_code == 'SUCCESS') {
        that.getUserInfo()
      }
    })
  },
  // 修改联系电话
  editPhone() {
    let that = this
    if(that.data.userInfo.telephone) {
      let phoneNum = that.data.userInfo.telephone
      wx.navigateTo({
        url: '/pages/personInfoPhoneEdit/personInfoPhoneEdit?phoneNum=' + phoneNum
      })
    } else {
      wx.navigateTo({
        url: '/pages/personInfoPhoneEdit/personInfoPhoneEdit'
      })
    }
  },
  // 获取formId
  submit(e) {
    console.log('formId22222', e)
    let formId = e.detail.formId
    let self = this,
      url = `${app.baseUrl}/userinfo/add_formid`,
      data = {}
    data = {
      'formid': formId
    }
    console.log('3333')
    app.wxRequest(url, data, (res) => {
      console.log('获取formID', res)
    })
  }
})