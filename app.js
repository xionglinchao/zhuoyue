//app.js
App({
  onLaunch: function () {
    var that = this
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        console.log('code app.js',res)
        let code = res.code;
        wx.request({
          method: 'POST',
          url: 'https://www.hzsimple.com/api/zuoyue/register/register',
          data: {
            'code': code
          },
          success: resOp => {
            console.log('resOp登录app.js', resOp)
            wx.setStorageSync('x-Ticket', resOp.data.result.access_token)
            let token = resOp.data.result.access_token
            // 添加登入流水
            wx.request({
              method: 'POST',
              url: 'https://www.hzsimple.com/api/zuoyue/userinfo/user_login_detail',
              header: {
                'x-Ticket': token
              },
              success: res => {
                console.log('登入流水app.js', res)
              }
            })
          }
        })
      },
      fail: res => {
        console.log('登入失败', res)
        wx.navigateTo({
          url: '/pages/login/login',
        })
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        console.log('88888888',res)
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              console.log('获取用户信息', res)
              that.globalData.userInfo = res.userInfo
              
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (that.userInfoReadyCallback) {
                that.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  /**
   * ajax请求
   * cb callback
   * url 请求地址
   * params 请求参数
   * compFunc 完成后执行的方法
   */
  wxRequest: function (url, params, cb, compFunc = null) {
    let app = getApp()
    let token = wx.getStorageSync('x-Ticket')
    wx.request({
      url: url,
      header: {
        // 'content-type': 'application/x-www-form-urlencoded'
        'x-Ticket': token
      },
      method: 'POST',
      data: params,
      success: function (res) {
        typeof cb == 'function' && cb(res)
      },
      fail: function (err) {
        console.log('请求失败.' + err)
        typeof cb == 'function' && cb(err)
      },
      complete: function () {
        typeof compFunc == 'function' && compFunc()
      }
    })
  },
  globalData: {
    userInfo: null,
    // positionSwitch: true  // 自动定位开关
  },
  baseUrl: 'https://www.hzsimple.com/api/zuoyue',
  baseImgUrl: 'https://www.hzsimple.com'
})