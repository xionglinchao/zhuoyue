const app = getApp()
Page({
  data: {
    stepOne: 1,  // 信息填写第一页
    time: '获取验证码', //倒计时 
    currentTime: 60,
    resend: 1  // 是否发送验证码
  },
  onLoad: function (options) {
    let that = this
    let region = wx.getStorageSync('region')
    console.log('region222222', region)
    let scene = decodeURIComponent(options.scene)
    console.log('企业注册场景值', scene)
    if (scene != 'undefined') {
      var u_id = scene.split('&')[0].split('=')[1]
      that.bindSuperior(u_id)
    } else {
      var u_id = options.uid
    }
    console.log('u_id', u_id)
    that.setData({
      'uid': u_id,
      'address': region[0] + '/' + region[1] + '/' + region[2]
    })
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

  // }

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

  // 二维码注册
  toErcodeRegister() {
    wx.navigateTo({
      url: '/pages/ercodeRegister/ercodeRegister',
    })
  },

  // 机构名称
  orgNameInput(e) {
    this.setData({
      'orgName': e.detail.value
    })
  },
  // 机构简称
  orgShortNameInput(e) {
    this.setData({
      'orgShortName': e.detail.value
    })
  },
  // 所在区域
  chooseArea(e) {
    let address = e.detail.value
    this.setData({
      'address': address[0] + '/' + address[1] + '/' + address[2],
      'choosed': 1
    })
  },
  // 详细地址
  detailedAddressInput(e) {
    this.setData({
      'detailedAddress': e.detail.value
    })
  },
  // 联系人
  userNameInput(e) {
    this.setData({
      'userName': e.detail.value
    })
  },
  // 联系电话
  userPhoneInput(e) {
    this.setData({
      'userPhone': e.detail.value
    })
  },
  // 备注
  noteInput(e) {
    this.setData({
      'note': e.detail.value
    })
  },
  // 上传LOGO
  uploadLogo() {
    let that = this
    let token = wx.getStorageSync('x-Ticket')
    wx.chooseImage({
      count: 1,
      success: function (res) {
        // tempFilePath可以作为img标签的src属性显示图片
        let imgsrc = res.tempFilePaths[0];
        console.log('已选择的图片', imgsrc)
        wx.uploadFile({
          url: 'https://www.hzsimple.com/api/image/upload',
          filePath: imgsrc,
          name: 'image',
          formData: {
            'type': '1'
          },
          header: {
            "Content-Type": "application/json",
            'X-Ticket': token
          },
          success: function (res) {
            console.log('上传图片', res, JSON.parse(res.data))
            if (JSON.parse(res.data).error_code != 'SUCCESS') {
              wx.showToast({
                title: JSON.parse(res.data).reason,
                icon: 'none',
                duration: 1000
              })
              return false
            }
            let logoImgUrl = JSON.parse(res.data).result.url
            let logo = JSON.parse(res.data).result.picture
            that.setData({
              'logo': logo,
              'logoImgUrl': logoImgUrl
            })
          }
        })
      }
    })
  },
  // logo删除
  logo_delete() {
    let that = this;
    that.setData({
      'logo': ''
    })
  },
  // logo预览
  previewLogo(e) {
    console.log(e)
    let imgArr = []
    let itemUrl = e.currentTarget.dataset.src
    imgArr.push(itemUrl)
    wx.previewImage({
      current: itemUrl, // 当前显示图片的http链接
      urls: imgArr, // 需要预览的图片http链接列表
    })
  },
  // 上传营业执照
  uploadCer() {
    let that = this
    let token = wx.getStorageSync('x-Ticket')
    wx.chooseImage({
      count: 1,
      success: function (res) {
        // tempFilePath可以作为img标签的src属性显示图片
        let imgsrc = res.tempFilePaths[0];
        console.log('已选择的图片', imgsrc)
        wx.uploadFile({
          url: 'https://www.hzsimple.com/api/image/upload',
          filePath: imgsrc,
          name: 'image',
          formData: {
            'type': '1'
          },
          header: {
            "Content-Type": "application/json",
            'X-Ticket': token
          },
          success: function (res) {
            console.log('上传图片', res, JSON.parse(res.data))
            if (JSON.parse(res.data).error_code != 'SUCCESS') {
              wx.showToast({
                title: JSON.parse(res.data).reason,
                icon: 'none',
                duration: 1000
              })
              return false
            }
            let cerImgUrl = JSON.parse(res.data).result.url
            let cerImg = JSON.parse(res.data).result.picture
            that.setData({
              'cerImg': cerImg,
              'cerImgUrl': cerImgUrl
            })
          }
        })
      }
    })
  },
  // 营业执照删除
  cer_delete() {
    let that = this;
    that.setData({
      'cerImg': ''
    })
  },
  // 营业执照预览
  previewCerImg(e) {
    console.log(e)
    let imgArr = []
    let itemUrl = e.currentTarget.dataset.src
    imgArr.push(itemUrl)
    wx.previewImage({
      current: itemUrl, // 当前显示图片的http链接
      urls: imgArr, // 需要预览的图片http链接列表
    })
  },

  // 下一步按钮点击
  nextBtnClick() {
    let that = this
    if(!that.data.orgName) {
      wx.showToast({
        title: '请填写机构名称',
        icon: 'none',
        duration: 1000
      })
      return false
    }
    if (!that.data.orgShortName) {
      wx.showToast({
        title: '请填写机构简称',
        icon: 'none',
        duration: 1000
      })
      return false
    }
    if (!that.data.address) {
      wx.showToast({
        title: '请选择机构所在区域',
        icon: 'none',
        duration: 1000
      })
      return false
    }
    if (!that.data.detailedAddress) {
      wx.showToast({
        title: '请填写机构详细地址',
        icon: 'none',
        duration: 1000
      })
      return false
    }
    if (!that.data.userName) {
      wx.showToast({
        title: '请填写机构负责人姓名',
        icon: 'none',
        duration: 1000
      })
      return false
    }
    // 201901311628修改 需求变动 不检测手机 By 某人
    if (!that.data.userPhone) {
      wx.showToast({
        title: '请填写联系电话',
        icon: 'none',
        duration: 1000
      })
      return false
    }
    if (!that.data.logo) {
      wx.showToast({
        title: '请上传LOGO',
        icon: 'none',
        duration: 1000
      })
      return false
    }
    if (!that.data.cerImg) {
      wx.showToast({
        title: '请上传营业执照',
        icon: 'none',
        duration: 1000
      })
      return false
    }
    that.setData({
      'stepOne': 0
    })
  },

  // 管理员姓名
  managerNameInput(e) {
    this.setData({
      'managerName': e.detail.value
    })
  },
  // 管理员手机号
  managerPhoneInput(e) {
    this.setData({
      'managerPhone': e.detail.value
    })
  },
  // 短信验证码
  smsCodeInput(e) {
    this.setData({
      'smsCode': e.detail.value
    })
  },
  // 密码
  passwordInput(e) {
    this.setData({
      'password': e.detail.value
    })
  },
  // 确认密码
  passwordSecInput(e) {
    this.setData({
      'passwordSec': e.detail.value
    })
  },
  //验证码倒计时函数
  getCode: function (options) {
    let that = this
    if (!that.data.managerPhone || that.data.managerPhone.length != 11) {
      wx.showToast({
        title: '请输入正确的手机号码',
        icon: 'none',
        duration: 1000
      })
      return false
    }
    let url = `${app.baseUrl}/register/sendcode`, data = {}
    data = {
      'tel': that.data.managerPhone,
      'type': 1   // 注册的时候传过type参数
    }
    app.wxRequest(url, data, (res) => {
      console.log('发送验证码',res)
      if (res.data.error_code == 'SUCCESS') {
        let currentTime = that.data.currentTime, interval = null
        that.setData({
          time: currentTime + '秒',
          resend: 0
        })
        interval = setInterval(function () {
          currentTime--;
          that.setData({
            time: currentTime + '秒',
          })
          if (currentTime <= 0) {
            clearInterval(interval)
            that.setData({
              currentTime: 60,
              resend: 1
            })
          }
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

  // 注册按钮提交
  registerBtnClick() {
    let that = this
    if (!that.data.managerName) {
      wx.showToast({
        title: '请输入管理员姓名',
        icon: 'none',
        duration: 1000
      })
      return false
    }
    if (!that.data.managerPhone) {
      wx.showToast({
        title: '请输入管理员手机号',
        icon: 'none',
        duration: 1000
      })
      return false
    }
    if (!that.data.smsCode) {
      wx.showToast({
        title: '请输入验证码',
        icon: 'none',
        duration: 1000
      })
      return false
    }
    if (!that.data.smsCode) {
      wx.showToast({
        title: '请输入验证码',
        icon: 'none',
        duration: 1000
      })
      return false
    }
    if (!that.data.password || that.data.password.length < 6) {
      wx.showToast({
        title: '请输入6位以上密码',
        icon: 'none',
        duration: 1000
      })
      return false
    }
    if (that.data.password != that.data.passwordSec) {
      wx.showToast({
        title: '两次密码输入不一致',
        icon: 'none',
        duration: 1000
      })
      return false
    }
    let url = `${app.baseUrl}/register/mo_register`, data = {}
    data = {
      'nickname': that.data.managerName,  // 管理员姓名
      'username': that.data.managerPhone,  // 管理员手机号
      'checkcode': that.data.smsCode,  // 短信验证码
      'orgname': that.data.orgName,  // 机构名称
      'orgshortname': that.data.orgShortName, // 机构简称
      'logo': that.data.logoImgUrl, // logo
      'certimage': that.data.cerImgUrl,  // 营业执照
      'linkman': that.data.userName, // 机构负责人
      'linkphone': that.data.userPhone,  // 负责人电话
      'addr': that.data.address, // 机构所在区域
      'areadetail': that.data.detailedAddress,  // 详细地址
      'uid': that.data.uid,  // 推广人编号
      'content': that.data.note,  // 备注
      'password': that.data.password  // 密码
    }
    app.wxRequest(url, data, (res) => {
      console.log('机构注册', res)
      if(res.data.error_code == 'SUCCESS') {
        wx.showToast({
          title: res.data.reason,
          icon: 'none',
          duration: 1000
        })
        setTimeout(function(){
          wx.navigateBack({
            delta: 1
          })
        },1000)
      } else {
        wx.showToast({
          title: res.data.reason,
          icon: 'none',
          duration: 1000
        })
      }
    })
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
    app.wxRequest(url, data, (res) => {
      console.log('获取formID', res)
    })
  }
})