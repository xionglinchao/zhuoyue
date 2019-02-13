const app = getApp()
Page({
  data: {
    'bankCardIdx': 0,
    'money': '',  // 默认value值
    'manageIdx': false  // 管理银行卡页面展示
  },
  onLoad: function(options) {
    this.setData({
      'allMoney': options.allMoney,  // 累计收益
    })
  },
  onReady: function() {

  },
  onShow: function() {
    this.getBindBankCardInfo()
  },
  onHide: function() {

  },
  onUnload: function() {

  },
  onPullDownRefresh: function() {

  },
  onReachBottom: function() {

  },
  // onShareAppMessage: function() {

  // },
  // 管理银行卡列表
  manageBtnClick() {
    this.setData({
      'manageIdx': !this.data.manageIdx
    })
  },
  // 删除银行卡
  delBtnClick(e) {
    let that = this
    let id = e.currentTarget.dataset.id  // 银行卡列表id
    wx.showModal({
      title: '提示',
      content: '是否确认解绑此银行卡',
      success(res) {
        if(res.confirm) {
          let url = `${app.baseUrl}/wallet/unband_bank`, data = {}
          data = {
            'id': id // 银行卡列表id
          }
          app.wxRequest(url, data, (res) => {
            console.log('解绑银行卡',res)
            wx.showToast({
              title: res.data.reason,
              icon: 'none',
              duration: 1000
            })
            // 更新银行卡列表
            that.getBindBankCardInfo()
          })
        }
      }
    })
  },
  // 全部提现
  chooseAllMoney() {
    let money = this.data.allMoney
    this.setData({
      'money': money
    })
  },
  // 提现金额输入
  moneyInput(e) {
    this.setData({
      'money': e.detail.value
    })
  },
  // 提现按钮点击
  withdrawBtnClick(e) {
    let bankId = e.currentTarget.dataset.id
    if (!bankId) {
      wx.showToast({
        title: '请选择银行卡',
        icon: 'none',
        duration: 1000
      })
      return false
    }
    if (this.data.money <= 0) {
      wx.showToast({
        title: '请输入提现金额',
        icon: 'none',
        duration: 1000
      })
      return false
    }
    let that = this, url = `${app.baseUrl}/wallet/deposit`, data = {}
    data = {
      'id': bankId,   // 绑定的银行卡id
      'amt': that.data.money,   // 提现金额
    }
    app.wxRequest(url, data, (res) => {
      console.log('提现',res)
      if(res.data.error_code == 'SUCCESS') {
        let cashId = res.data.result.cash_id  // 提现记录id
        that.setData({
          'money': ''
        })
        wx.navigateTo({
          url: '/pages/withdrawProcess/withdrawProcess?id=' + cashId,
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

  // 底部弹窗
  //显示对话框
  showModal: function() {
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
    setTimeout(function() {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)
  },
  //隐藏对话框
  hideModal: function() {
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
    setTimeout(function() {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: false,
        manageIdx: false
      })
    }.bind(this), 200)
  },

  // 选择银行卡
  chooseBankCardClick(e) {
    let idx = e.currentTarget.dataset.idx
    this.setData({
      'bankCardIdx': idx,
      'showModalStatus': false
    })
  },
  // 添加新银行卡
  addNewCard() {
    this.setData({
      // 'bankCardIdx': -1,
      'showModalStatus': false
    })
    setTimeout((res) => {
      wx.navigateTo({
        url: '/pages/addBankCard/addBankCard',
      })
    }, 1000)
  },

  // 获取已绑定银行卡列表信息
  getBindBankCardInfo() {
    let that = this,
      url = `${app.baseUrl}/wallet/mybank_list`,
      data = {}
    app.wxRequest(url, data, (res) => {
      console.log('已绑定银行卡', res)
      if (res.data.error_code == 'SUCCESS') {
        for(let i = 0; i < res.data.result.mybank.length; ++i) {
          let account = res.data.result.mybank[i].account
          res.data.result.mybank[i].lastFourNumber = account.substr(account.length - 4)
        }
        that.setData({
          'myBank': res.data.result.mybank
        })
      }
    })
  },

  // 提现记录页面跳转
  toWithdrawRecord() {
    wx.navigateTo({
      url: '/pages/withdrawRecord/withdrawRecord',
    })
  }
})