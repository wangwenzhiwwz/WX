const WXAPI = require('apifm-wxapi')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1, // 读取第几页数据，便于实现下滑分页
    categoryId: undefined,
    articleList: [] // 文章列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad (options) {
    // 读取分类详情
    // https://www.yuque.com/apifm/nu0f75/slu10w
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
      categoryId: options.pid,
      categoryInfo: categoryInfo.data
    });
    // 读取分类下的文章
    this.fetchArticles();
  },
  onReachBottom() {
    this.data.page++
    this.fetchArticles()
  },
  async fetchArticles () {
    // https://www.yuque.com/apifm/nu0f75/tokarq
    const response = await WXAPI.cmsArticlesV3({
      page: this.data.page,
      categoryId: this.data.categoryId,
      pageSize: 20
    });
    if (response.code == 0) {
      if (this.data.page == 1) {
        this.setData({
          articleList: response.data.result
        })
      } else {
        this.setData({
          articleList: this.data.articleList.concat(response.data.result)
        });
      }
    } else {
      if (this.data.page == 1) {
        wx.showToast({
          title: '暂无数据～',
          icon: 'none'
        })
      } else {
        wx.showToast({
          title: '没有更多了～',
          icon: 'none'
        })
      }
    }
  },
  onReady: function () {
  
  },
  onShow: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})