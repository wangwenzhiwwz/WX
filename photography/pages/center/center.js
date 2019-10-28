const WXAPI = require('apifm-wxapi')
Page({

  

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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
    let fileNumber = 0;
    let newsNumber = 0;
    let views = 0;
    const res = await WXAPI.siteStatistics();
    if (res.code == 0) {
      fileNumber = res.data.dfs.count
      newsNumber = res.data.cmsArticle.numbers
      views = res.data.cmsArticle.views
    }
    this.setData({
      mylogo: wx.getStorageSync('mylogo'),
      myname: wx.getStorageSync('myname'),
      fileNumber,
      newsNumber,
      views,
    })
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