const WXAPI = require('apifm-wxapi')
const WxParse = require('../../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    articleDetail: undefined // 文章详情
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad (options) {
    const key = options.key;
    // 读取文章详情信息
    const articleDetail = await WXAPI.cmsPage(key);
    if (articleDetail.code != 0) {
      wx.showModal({
        title: '提示',
        content: '当前文章不存在',
        showCancel: false,
        confirmText: '返回',
        success(res) {
          wx.navigateBack()
        }
      })
      return;
    }
    this.setData({
      articleDetail: articleDetail.data
    });
    // 设置小程序名称
    wx.setNavigationBarTitle({
      title: articleDetail.data.info.title
    })
    // 文章详情
    WxParse.wxParse('article', 'html', articleDetail.data.info.content, this, 5);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})