const app = getApp()

Page({
  data: {
    time: '获取验证码', //倒计时 
    currentTime: 61
  },
  onLoad: function (options) {
    if (options.phoneNum) {
      this.setData({
        'phoneNum': options.phoneNum  // 是否已绑定过手机号
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
  //验证码倒计时函数
  getCode: function (options) {
    let that = this;
    let currentTime = that.data.currentTime, interval = null
    interval = setInterval(function () {
      currentTime--;
      that.setData({
        time: currentTime + '秒'
      })
      if (currentTime <= 0) {
        clearInterval(interval)
        that.setData({
          time: '重新发送',
          currentTime: 61,
          disabled: false
        })
      }
    }, 1000)
  },
  getVerificationCode() {
    let that = this
    if (that.data.phoneNum) {  // 更换新手机号
      let url = `${app.baseUrl}/register/sendcode`, data = {}
      data = {
        'tel': that.data.phoneNum  // 手机号
      }
      app.wxRequest(url, data, (res) => {
        console.log('发送验证码', res)
        if (res.data.error_code == 'SUCCESS') {
          that.getCode()
          that.setData({
            disabled: true
          })
        } else {
          wx.showToast({
            title: res.data.reason,
            icon: 'none',
            duration: 1000
          })
        }
      })
    } else {  // 未绑定过手机
      if (!that.data.getPhoneNum) {
        wx.showToast({
          title: '请填写您的手机号',
          icon: 'none',
          duration: 1000
        })
        return false
      }
      if (that.data.getPhoneNum.length != 11) {
        wx.showToast({
          title: '请输入正确的手机号',
          icon: 'none',
          duration: 1000
        })
        return false
      }
      let url = `${app.baseUrl}/register/sendcode`, data = {}
      data = {
        'tel': that.data.getPhoneNum  // 手机号
      }
      app.wxRequest(url, data, (res) => {
        console.log('发送验证码', res)
        if (res.data.error_code == 'SUCCESS') {
          that.getCode()
          that.setData({
            disabled: true
          })
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
  // 获取输入手机号
  inputPhoneNum(e) {
    let getPhoneNum = e.detail.value
    this.setData({
      'getPhoneNum': getPhoneNum
    })
  },
  // 获取输入验证码
  inputCode(e) {
    let phoneCode = e.detail.value
    this.setData({
      'phoneCode': phoneCode
    })
  },
  // 绑定手机号
  bindPhoneClick() {
    let that = this 
    if (!that.data.getPhoneNum) {
      wx.showToast({
        title: '请填写您的手机号',
        icon: 'none',
        duration: 1000
      })
      return false
    }
    if (!that.data.phoneCode) {
      wx.showToast({
        title: '请填写验证码',
        icon: 'none',
        duration: 1000
      })
      return false
    }
    let url = `${app.baseUrl}/userinfo/update_tel`, data = {}
    data = {
      'telephone': that.data.getPhoneNum,  // 手机号
      'checkcode': that.data.phoneCode    // 验证码
    }
    app.wxRequest(url, data, (res) => {
      console.log('绑定手机号', res)
      if (res.data.error_code == 'SUCCESS') {
        wx.showToast({
          title: res.data.reason,
          icon: 'none',
          duration: 1000
        })
        setTimeout(function() {
          wx.navigateBack({
            delta: 1
          })
        }, 1000)
      } else {
        wx.showToast({
          title: res.data.reason,
          icon: 'none',
          duration: 1000
        })
      }
    })
  },
  // 更换新手机号
  changeNewPhone () {
    if (!this.data.phoneCode) {
      wx.showToast({
        title: '请输入验证码',
        icon: 'none',
        duration: 1000
      })
      return false
    }
    let that = this, url = `${app.baseUrl}/userinfo/check_tel`, data = {}
    data = {
      'telephone': that.data.phoneNum,  // 已绑定的手机号
      'checkcode': that.data.phoneCode  // 验证码
    }
    app.wxRequest(url, data, (res) => {
      console.log('验证手机号', res)
      if(res.data.error_code == 'SUCCESS') {
        that.setData({
          changePhone: 1
        })
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