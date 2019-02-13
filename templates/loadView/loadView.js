// templates/loadView1/loadView.js
Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  /**
   * 组件的属性列表
   */
  properties: {
    tabIdx: {
      type: Number
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    bottomList: [{
      text: '登记表',
      icon: '/images/homePage/homePage.png',
      icon1: '/images/homePage/homePage2.png',
      url: '/pages/homePage/homePage'
    }, {
      text: '嗖',
      icon: '/images/homePage/rocket.png',
      icon1: '/images/homePage/rocket2.png',
      url: '/pages/registrationForm/registrationForm'
    }, {
      text: '二维码',
      icon: '/images/homePage/erCode.png',
      icon1: '/images/homePage/erCode2.png',
      url: '/pages/erCode/erCode'
    }, {
      text: '客',
      icon: '/images/homePage/increase.png',
      icon1: '/images/homePage/increase2.png',
      url: '/pages/profit/profit'
    }, {
      text: '我的',
      icon: '/images/homePage/personal.png',
      icon1: '/images/homePage/personal2.png',
      url: '/pages/personal/personal'
    }],
  },

  /**
   * 组件的方法列表
   */
  methods: {
    toast: function(e) {
      var that = this
      wx.redirectTo({
        url: that.data.bottomList[e.currentTarget.dataset.num].url
      })
    }
  }
})