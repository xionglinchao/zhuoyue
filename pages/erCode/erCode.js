const app = getApp()

Page({
  data: {

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
        path: '/pages/erCode/erCode?extendman=' + extendman,
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
            console.log('默认登记表', defaultOption)
            that.setData({
              'defaultOption': defaultOption,
              'taskId': defaultOption.task_id,
              'utaskId': defaultOption.utid  // 用户领取的任务的列表id
            })
            that.getErCode()
            return false
          }
        }
      }
    })
  },
  // 二维码
  getErCode() {
    if (this.data.utaskId) {
      let that = this, url = `${app.baseUrl}/task/wx_code`, data = {}
      data = {
        'id': that.data.utaskId  // 用户领取的任务的列表id
      }
      app.wxRequest(url, data, (res) => {
        console.log('二维码',res)
        if (res.data.error_code == 'SUCCESS') {
          res.data.result.path = app.baseImgUrl + '/' + res.data.result.path
          that.setData({
            'erCode': res.data.result.path
          })
        }
      })
    }
  },
  // 图片预览
  previewImage(e) {
    console.log(e)
    let imgArr = []
    let itemUrl = e.currentTarget.dataset.src
    imgArr.push(itemUrl)
    wx.previewImage({
      current: itemUrl, // 当前显示图片的http链接
      urls: imgArr, // 需要预览的图片http链接列表
    })
  }
})