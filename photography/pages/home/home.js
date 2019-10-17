const WXAPI = require('apifm-wxapi')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    articleList: undefined, // 推荐的文章
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad (options) {
    // 读取后台系统设置，保存在小程序的 Storage 里
    const sysConfigSettings = await WXAPI.queryConfigBatch('mallName');
    if (sysConfigSettings.code == 0) {
      sysConfigSettings.data.forEach(config => {
        wx.setStorageSync(config.key, config.value);
      })
    }
    // 设置小程序名称
    wx.setNavigationBarTitle({
      title: wx.getStorageSync('mallName')
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  async onShow () {
    // 读取后台推荐的文章列表
    const articleList = await WXAPI.cmsArticles({
      isRecommend: true
    });
    if (articleList.code == 0) {
      this.setData({
        articleList: articleList.data
      });
    }
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