const app = getApp()
Page({
  data: {
    'isInput': true, // 是否显示搜索输入栏
    'animate': 'myfirst',  // 顶部下拉弹窗动画
    'yesorno': 'none',
    'flag': true,
    'test': 'test1',
    'options': [   // 下拉选项卡
      '综合排序', '人气从高到低',  '距离最近'
    ],
    'idx': 0,  // 默认下拉选项卡下标
    'page': 1,   // 默认当前页码
    'pageSize': 10,  // 每页加载的数据
    'hasMoreData': true,
    'contentlist': []
  },
  onLoad: function(options) {
    let that = this
    // console.log('options.extendman', options.extendman)
    if (options.extendman) {
      setTimeout(function() {
        that.bindSuperior(options.extendman)
      }, 10000)
    }
  },
  onReady: function() {

  },
  onShow: function() {
    let that = this
    let region = wx.getStorageSync('region')
    console.log('region222222', region)
    // 查看是否授权
    wx.getStorage({
      key: 'iv',
      success: function (res) {
        if (!region) {
          that.getLocationInfo()
        }
      },
      fail: () => {
        console.log('33333333')
        wx.navigateTo({
          url: '/pages/login/login',
        })
      }
    })
    if (region) {
      that.getTaskListInfo()
    }
  },
  onHide: function() {

  },
  onUnload: function() {

  },
  onPullDownRefresh: function() {

  },
  onReachBottom: function() {
    if (this.data.hasMoreData) {
      wx.showLoading({
        title: '正在加载',
      })
      this.getTaskListInfo()
      setTimeout(function(){
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
  onShareAppMessage: function(res) {
    let extendman = wx.getStorageSync('bindId')
    console.log('extendman', extendman)
    if (res.from === 'menu') {
      return {
        title: '一个会帮你赚钱的小程序',
        path: '/pages/homePage/homePage?extendman=' + extendman,
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
  
  // 登记表详情跳转
  toFormDetail(e) {
    let taskId = e.currentTarget.dataset.item.task_id  // 任务id
    let orgId = e.currentTarget.dataset.item.orgid  // 机构id
    wx.navigateTo({
      url: '/pages/formDetail/formDetail?taskId=' + taskId + '&orgId=' + orgId,
    })
  },

  // 获取地理位置
  getLocationInfo() {
    let that = this
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        wx.setStorageSync('locationLat', res.latitude)
        wx.setStorageSync('locationLng', res.longitude)
        that.setData({
          'locationLat': res.latitude,
          'locationLng': res.longitude
        })
        let url = 'https://apis.map.qq.com/ws/geocoder/v1/?location=' + res.latitude + ',' + res.longitude + '&key=EDUBZ-AMNW3-H2A3K-YK3ZK-XNSRQ-E3BVZ'
        wx.request({
          method: 'GET',
          url: url,
          data: {},
          success: function (ops) {
            if (ops.data.status == 0) {
              let location = ops.data.result.address_component
              that.data.region = []
              that.data.region.push(location.province, location.city, location.district)
              console.log('逆解析地址', that.data.region)
              wx.setStorageSync('region', that.data.region)
              that.getTaskListInfo()
            }
          }
        })
      },
      fail(res) {
        console.log('获取地理位置失败', res)
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
  // 地理位置选择
  bindRegionChange(e) {
    let that = this
    that.setData({
      'chooseRegion': e.detail.value,
      'idx': 0,
      'page': 1
    })
    wx.setStorageSync('region', e.detail.value)
    that.getTaskListInfo()
  },
  // 重新定位
  reLocationClick() {
    let that = this
    wx.showModal({
      title: '提示',
      content: '是否切换到当前位置',
      success (res) {
        if (res.confirm) {
          that.getLocationInfo()
        }
      }
    })
  },

  // 获取任务列表
  getTaskListInfo() {
    let region = wx.getStorageSync('region')
    let that = this, url = `${app.baseUrl}/task/task_list`, data = {}
    let currentPlace = region[0] + '/' + region[1] + '/' + region[2]
    data = {
      'lng': that.data.locationLat,  // 维度
      'lat': that.data.locationLat,  // 经度
      'position': currentPlace,  // 当前选择地区
      'keywords': that.data.inputValue ? that.data.inputValue:'',      // 搜索关键字
      'search_type': that.data.idx,   // 0综合 1按人气搜索  2按好评搜索 3按距离搜索
      'page': that.data.page,
      'page_size': that.data.pageSize
    }
    app.wxRequest(url, data, (res) => {
      console.log('任务列表', res)
      if(res.data.error_code == "SUCCESS") {
        let contentlistTem = that.data.contentlist
        if (that.data.page == 1) {
          contentlistTem = []
        }
        let contentlist = res.data.result.task_list
        if (contentlist.length < that.data.pageSize) {
          that.setData({
            'contentlist': contentlistTem.concat(contentlist),
            'hasMoreData': false,
            'region': region
          })
        } else {
          that.setData({
            'contentlist': contentlistTem.concat(contentlist),
            'hasMoreData': true,
            'page': that.data.page + 1,
            'region': region
          })
        }
      } else {
        wx.showToast({
          title: res.data.reason,
          icon: 'none',
          duration: 1000
        })
      }
    })
  },

  // 顶部下拉框
  pull_down: function () {
    this.setData({
      'yesorno': 'block',
      'test': 'test1',
      'flag': false
    })
  },
  pull_up: function () {
    this.setData({
      'test': 'test2',
      'flag': true
    })
  },
  optionsClick(e) {
    let that = this
    let idx = e.currentTarget.dataset.idx
    let lng = wx.getStorageSync('locationLng')
    let lat = wx.getStorageSync('locationLat')
    that.setData({
      'locationLng': lng,  // 维度
      'locationLat': lat,  // 经度
      'idx': idx,
      'test': 'test2',
      'flag': true,
      'page': 1
    })
    that.getTaskListInfo()
  },
  
  // 搜索栏
  inputClick() {
    this.setData({
      'isInput': false,
    })
  },
  loseFocus() {
    this.setData({
      'isInput': true,
    })
  },
  inputConfirm(e) {
    let inputValue = e.detail.value
    this.setData({
      'inputValue': inputValue,
      'page': 1
    })
    this.getTaskListInfo()
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