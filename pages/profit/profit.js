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
    this.getPersonProfitInfo()
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
        path: '/pages/profit/profit?extendman=' + extendman,
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
  // 资金提现
  withdrawalBtnClick(e) {
    let allMoney = e.currentTarget.dataset.money  // 累计收益
    wx.navigateTo({
      url: '/pages/withdraw/withdraw?allMoney=' + allMoney,
    })
  },
  // 累计登记人查看
  checkTotalPeople() {
    wx.navigateTo({
      url: '/pages/registeredCustomers/registeredCustomers',
    })
  },
  // 收益明细
  checkProfitDetail() {
    wx.navigateTo({
      url: '/pages/profitDetail/profitDetail',
    })
  },

  // 获取我的收益基本信息
  getPersonProfitInfo() {
    let that = this, url = `${app.baseUrl}/userinfo/my_wallet`, data = {}
    app.wxRequest(url, data, (res) => {
      console.log('我的收益', res)
      if(res.data.error_code == 'SUCCESS') {
        that.setData({
          'profit': res.data.result.my_wallet
        })
      } else {
        wx.showToast({
          title: res.data.reason,
          icon: 'none',
          duration: 1000
        })
      }
    })
  },

  // 推广机构跳转
  toOrganization() {
    wx.navigateTo({
      url: '/pages/organization/organization?tabIdx=0',
    })
  }
})