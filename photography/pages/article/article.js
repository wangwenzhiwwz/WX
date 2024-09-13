const WXAPI = require('apifm-wxapi')
const WxParse = require('../../wxParse/wxParse.js');
const AUTH = require('../../utils/auth.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    actionSheetHidden: true, // 是都隐藏登录浮窗
    faved: false, // 是否已收藏    
    articleDetail: undefined // 文章详情
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad (options) {
    // options.id = 19988
    const articleId = options.id;
    // 读取文章详情信息
    // https://www.yuque.com/apifm/nu0f75/dv76qr
    const articleDetail = await WXAPI.cmsArticleDetailV3({
      id: articleId,
      token: wx.getStorageSync('token')
    });
    if (articleDetail.code != 0) {
      wx.showModal({
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
      articleId: articleId,
      articleDetail: articleDetail.data.info
    });
    // 设置小程序名称
    wx.setNavigationBarTitle({
      title: articleDetail.data.info.title
    })
    // 文章详情
    WxParse.wxParse('article', 'html', articleDetail.data.info.content, this, 5);
    // 判断是否已收藏
    this.checkFavStatus()
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
    const token = wx.getStorageSync('token')
    if (token) {
      // https://www.yuque.com/apifm/nu0f75/tpbiyc
      WXAPI.cmsArticleUseless({
        token,
        id: this.data.articleId,
        isUseful: true
      })
    }
    return {
      title: this.data.articleDetail.title + ' - ' + wx.getStorageSync('mallName'),
      imageUrl: this.data.articleDetail.pic,
      path: '/pages/article/article?id=' + this.data.articleId
    }
  },
  checkFavStatus() {
    const token = wx.getStorageSync('token')
    if (token) {
      // 判断是否已收藏
      // https://www.yuque.com/apifm/nu0f75/kgbl8x2nyhww7ghw
      WXAPI.cmsArticleFavCheck(token, this.data.articleId).then(res => {
        if (res.code == 0) {
          this.setData({
            faved: true
          })
        }
      })
    }
  },
  async fav () {
    const logined = await AUTH.checkHasLogined()    
    if (!logined){
      await AUTH.authorize()
      return;
    }
    // https://www.yuque.com/apifm/nu0f75/dsgvlrc01usqzw29
    const res = await WXAPI.cmsArticleFavPut(wx.getStorageSync('token'), this.data.articleId)
    if (res.code == 0) {
      wx.showToast({
        title: '收藏成功',
        icon: 'success'
      })
      this.checkFavStatus()
    } else {
      wx.showToast({
        title: res.msg,
        icon: 'none'
      })
    }
  },
  listenerActionSheet () {
    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden
    })
  },
  onGotUserInfo(e) {
    this.setData({
      actionSheetHidden: true
    })
    if (!e.detail.userInfo) {
      wx.showToast({
        title: '已取消登录',
        icon: 'none',
      })
      return;
    }
    wx.setStorageSync('userInfo', e.detail.userInfo)
    AUTH.login(this);
  },
})