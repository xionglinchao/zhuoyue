const app = getApp()

Page({
  data: {
    'gender': 1,  // 性别选择
  },
  onLoad: function (options) {
    let that = this
    if (options.extendman) {
      setTimeout(function () {
        that.bindSuperior(options.extendman)
      }, 10000)
    }
  },
  onReady: function () {

  },
  onShow: function () {
    this.getMyTaskInfo()
    this.getLocationInfo()
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
        path: '/pages/registrationForm/registrationForm?extendman=' + extendman,
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

  // 获取地理位置
  getLocationInfo() {
    let that = this
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        that.setData({
          'location.lat': res.latitude,
          'location.lng': res.longitude
        })
        // let url = 'https://apis.map.qq.com/ws/geocoder/v1/?location=' + res.latitude + ',' + res.longitude + '&key=EDUBZ-AMNW3-H2A3K-YK3ZK-XNSRQ-E3BVZ'
        // wx.request({
        //   method: 'GET',
        //   url: url,
        //   data: {},
        //   success: function (ops) {
        //     if (ops.data.status == 0) {
        //       let location = ops.data.result.address_component
        //       that.data.region = []
        //       that.data.region.push(location.province, location.city, location.district)
        //       console.log('逆解析地址', that.data.region)
        //       that.setData({
        //         'registerRegion': that.data.region
        //       })
        //     }
        //   }
        // })
      },
      fail() {
        wx.showModal({
          title: '提示',
          content: '您未授权获取地理信息，该功能将无法使用',
          showCancel: false,
          confirmText: '授权',
          confirmColor: '#1eac58',
          success() {
            wx.openSetting({})
          }
        })
      }
    })
  },
  
  // 选择登记表
  chooseFormClick() {
    wx.navigateTo({
      url: '/pages/chooseFormList/chooseFormList',
    })
  },

  // 默认登记表
  getMyTaskInfo() {
    let that = this, url = `${app.baseUrl}/task/my_task`, data = {}, defaultOption = null
    app.wxRequest(url, data, (res) => {
      if (res.data.error_code == 'SUCCESS') {
        for (let i = 0; i < res.data.result.mydetail.length; ++i) {
          if (res.data.result.mydetail[i].isdefault == 1) {
            defaultOption = res.data.result.mydetail[i]
          }
        }
        console.log('默认登记表', defaultOption)
        that.setData({
          'defaultOption': defaultOption,
          'taskId': defaultOption.task_id
        })
      }
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
    if(!that.data.taskId) {
      wx.showToast({
        title: '请选择登记表',
        icon: 'none',
        duration: 1000
      })
      return false
    }
    if (!that.data.nameValue) {
      wx.showToast({
        title: '请输入姓名',
        icon: 'none',
        duration: 1000
      })
      return false
    }
    if (that.data.phoneValue.length != 11) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none',
        duration: 1000
      })
      return false
    }
    if (!that.data.ageValue) {
      wx.showToast({
        title: '请输入年龄',
        icon: 'none',
        duration: 1000
      })
      return false
    }
    data = {
      'taskid': that.data.taskId,  // 任务id
      'name': that.data.nameValue,  // 用户姓名
      'sex': that.data.gender,  // 0女 1男
      'telephone': that.data.phoneValue,  // 手机号
      'age': that.data.ageValue,  // 年龄
      'remark': that.data.noteValue,  // 备注(选填)
      'long': that.data.location.lng,  // 经度
      'lat': that.data.location.lat  // 纬度
    }
    app.wxRequest(url, data, (res) => {
      console.log('登记表提交',res)
      if(res.data.error_code == 'SUCCESS') {
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
          title: res.data.reason,
          icon: 'none',
          duration: 1000
        })
      }
    })
  }
})