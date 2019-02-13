const app = getApp()

Page({
  data: {

  },
  onLoad: function (options) {

  },
  onReady: function () {

  },
  onShow: function () {
    this.getAllBankListInfo()
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

  // 底部弹窗
  //显示对话框
  showModal: function () {
    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
      showModalStatus: true
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)
  },
  //隐藏对话框
  hideModal: function () {
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: false
      })
    }.bind(this), 200)
  },

  // 所有银行列表
  getAllBankListInfo() {
    let that = this, url = `${app.baseUrl}/wallet/bank_list`, data = {}
    app.wxRequest(url, data, (res) => {
      console.log('所有银行', res)
      if (res.data.error_code == 'SUCCESS') {
        that.setData({
          'bankList': res.data.result.bank_list
        })
      }
    })
  },

  // 选择银行卡
  chooseBankCardClick(e) {
    let idx = e.currentTarget.dataset.idx
    let bankName = e.currentTarget.dataset.item.bank
    let bankId = e.currentTarget.dataset.item.id
    this.setData({
      'bankCardIdx': idx,
      'bankName': bankName,
      'bankId': bankId,
      'showModalStatus': false
    })
  },

  // 持卡人、卡号
  nameInput(e) {
    let userName = e.detail.value
    this.setData({
      'userName': userName
    })
  },
  cardNumberInput(e) {
    let cardNumber = e.detail.value
    this.setData({
      'cardNumber': cardNumber
    })
  },

  // 绑定银行卡
  bindBankClick() {
    let that = this
    if (!that.data.bankId) {
      wx.showToast({
        title: '请选择银行',
        icon: 'none',
        duration: 1000
      })
    } else if (!that.data.userName) {
      wx.showToast({
        title: '请填写持卡人姓名',
        icon: 'none',
        duration: 1000
      })
    } else if (!that.data.cardNumber) {
      wx.showToast({
        title: '请填写银行卡卡号',
        icon: 'none',
        duration: 1000
      })
    } else {
      let url = `${app.baseUrl}/wallet/band_bank`, data = {}
      data = {
        'id': that.data.bankId,   // 银行卡id
        'name': that.data.userName,  // 持卡人姓名
        'account': that.data.cardNumber    // 账户
      }
      app.wxRequest(url, data, (res) => {
        console.log('银行卡绑定', res)
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
          }, 500)
        } else {
          wx.showToast({
            title: res.data.reason,
            icon: 'none',
            duration: 1000
          })
        }
      })
    }
  }
})