const app = getApp()
Page({
  data: {
    'pics': [],
    'picsUrl': []
  },
  onLoad: function (options) {

  },
  onReady: function () {

  },
  onShow: function () {
    this.getFeedbackType()
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

  // 反馈内容输入
  contentInput(e) {
    let inputValue = e.detail.value
    let inputNum = e.detail.cursor
    this.setData({
      'inputValue': inputValue,
      'inputNum': inputNum
    })
  },

  // 上传图片
  btn_image() {
    let that = this, pics = this.data.pics, picsUrl = this.data.picsUrl
    let token = wx.getStorageSync('x-Ticket')
    if (pics.length < 9) {
      wx.chooseImage({
        count: 9 - pics.length,
        success: function (res) {
          // tempFilePath可以作为img标签的src属性显示图片
          let imgsrc = res.tempFilePaths;
          for (let i = 0; i < imgsrc.length; ++i) {
            wx.uploadFile({
              url: 'https://www.hzsimple.com/api/image/upload',
              filePath: imgsrc[i],
              name: 'image',
              formData: {
                'type': '1'
              },
              header: {
                "Content-Type": "application/json",
                'X-Ticket': token
              },
              success: function (res) {
                console.log('上传图片', JSON.parse(res.data))
                if (JSON.parse(res.data).error_code != 'SUCCESS') {
                  wx.showToast({
                    title: JSON.parse(res.data).reason,
                    icon: 'none',
                    duration: 1000
                  })
                  return false
                }
                let imgUrl = JSON.parse(res.data).result.url, feedbackPic = JSON.parse(res.data).result.picture
                pics = pics.concat(feedbackPic)
                picsUrl = picsUrl.concat(imgUrl)
                that.setData({
                  'pics': pics,
                  'picsUrl': picsUrl
                })
              }
            })
          }
        }
      })
    }
  },

  // 图片删除
  btn_delete: function (e) {
    let that = this;
    let index = e.target.dataset.index;
    let pics = that.data.pics;
    let picsUrl = that.data.picsUrl;
    for (let i = 0; i < pics.length; i++) {
      if (i == index) {
        pics.splice(i, 1);
        picsUrl.splice(i, 1);
        break;
      }
    }
    console.log('图片删除', picsUrl);
    that.setData({
      'pics': pics,
      'picsUrl': picsUrl
    })
  },

  // 图片预览
  picturePreview(e) {
    let item = e.currentTarget.dataset.item
    let pics = this.data.pics
    wx.previewImage({
      current: item,
      urls: pics,
    })
  },

  // 获取反馈类型
  getFeedbackType() {
    let that = this, url = `${app.baseUrl}/userinfo/feedttype`, data = {}
    app.wxRequest(url, data, (res) => {
      console.log('反馈类型', res)
      if(res.data.error_code == 'SUCCESS') {
        that.setData({
          'feedbackList': res.data.result.list
        })
      }
    })
  },

  // 选择反馈类型
  chooseFeedbackType(e) {
    let feedbackId = e.currentTarget.dataset.id
    let idx = e.currentTarget.dataset.idx
    this.setData({
      'feedbackId': feedbackId,
      'idx': idx
    })
  },

  // 反馈提交
  feedbackBtnClick() {
    let that = this
    if (!that.data.feedbackId) {
      wx.showToast({
        title: '请选择反馈问题类型',
        icon: 'none',
        duration: 1000
      })
      return false
    }
    if (!that.data.inputValue) {
      wx.showToast({
        title: '请输入反馈内容',
        icon: 'none',
        duration: 1000
      })
      return false
    }
    let url = `${app.baseUrl}/userinfo/feekback`, data = {}
    data = {
      'feedid': that.data.feedbackId, // 反馈类型
      'img': that.data.picsUrl,  // 上传图片
      'content': that.data.inputValue  // 反馈内容
    }
    app.wxRequest(url, data, (res) => {
      console.log('反馈提交', res)
      if(res.data.error_code == 'SUCCESS') {
        wx.showToast({
          title: res.data.reason,
          icon: 'none',
          duration: 1000
        })
        setTimeout(function() {
          wx.navigateBack({
            delta: 1
          })
        }, 1500)
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