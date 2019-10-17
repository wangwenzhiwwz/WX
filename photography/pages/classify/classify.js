const WXAPI = require('apifm-wxapi')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1, // 读取第几页数据，便于实现下滑分页
    articleList: [] // 文章列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad (options) {
    // 读取分类详情
    const categoryInfo = await WXAPI.cmsCategoryDetail(options.pid);
    if (categoryInfo.code != 0) {
      wx.showModal({
        title: '提示',
        content: '当前分类不存在',
        showCancel: false,
        confirmText: '返回',
        success(res) {
          wx.navigateBack()
        }
      })
      return;
    }
    // 设置小程序名称
    wx.setNavigationBarTitle({
      title: wx.getStorageSync('mallName')
    })    
    this.setData({
      categoryInfo: categoryInfo.data
    });
    // 读取分类下的文章
    this.fetchArticles(options.pid);
  },

  async fetchArticles (pid) {
    const response = await WXAPI.cmsArticles({
      page: this.data.page,
      categoryId: pid
    });
    if (response.code == 0) {
      this.setData({
        articleList: this.data.articleList.concat(response.data)
      });
    }
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