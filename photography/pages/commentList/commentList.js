const WXAPI = require('apifm-wxapi')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    commentList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // options.id = 19988
    // options.title = '文章内容标题'

    wx.setNavigationBarTitle({
      title: options.title + '评论'
    })
    this.setData({
      articleId: options.id,
    })
    this.getComments()
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.getComments();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
  /**
   * 获取评论列表
   */
  async getComments () {
    // https://www.yuque.com/apifm/nu0f75/uexfid
    const res = await WXAPI.commentListV2({
      refId: this.data.articleId,
      st: '1,2'
    });
    if (res.code == 0) {
      const list = res.data.result
      list.forEach(ele => {
        if (!ele.uid) {
          const commentUserInfo = {
            avatarUrl : '../../assets/icons/guest.png',
            province : '',
            city : '',
            nick : '匿名',
          }
          ele.commentUserInfo = commentUserInfo
        }
      })
      this.setData({
        commentList: list
      })
    } else {
      this.setData({
        commentList: []
      })
    }
  },

  /**
    * 评论点赞
    */
  commentPraise: function (e) {
    let data = e.currentTarget.dataset;
    let that = this;
    wx.request({
      url: HOST + '/wechat/specialCommentPraise',
      data: {
        id: data.commentId,
        praise: data.praise + 1
      },
      success: (res) => {
        that.getComments();
      }
    })
  },
  /**
   * 弹出评论框
   */
  comment: function () {
    this.setData({
      active: 'active',
      focus: true,
      msg: '',
      placeHolder: '请输入评论内容',
      isReply: false
    })
  },
  /**
   * 失去焦点
   */
  inputBlur: function () {
    this.setData({
      focus: false,
    })
  },
  /**
   * 弹出回复框
   */
  reply: function (e) {
    let commentId = e.currentTarget.dataset.commentId;
    let user = e.currentTarget.dataset.user;
    if (this.data.focus) {
      this.setData({
        active: 'active',
        focus: false,
      })
    } else {
      this.setData({
        replyCommentId: commentId,
        active: 'active',
        focus: true,
        placeHolder: '回复 ' + user + ' :',
        isReply: true,
        msg: ''
      })
    }

  },
  /**
   * 提交评论
   */
  sendComment: function (e) {
    const text = e.detail.value;
    if (!text || !text.trim()) {
      wx.showToast({
        title: '内容不能为空',
        icon: 'none'
      })
      return false;
    }
    // 提交评论
    // https://www.yuque.com/apifm/nu0f75/xkug1y
    WXAPI.addComment({
      token: wx.getStorageSync('token'),
      refId: this.data.articleId,
      type: 3,
      content: text.trim()
    }).then(res => {
      if(res.code == 0){
        wx.showModal({
          title: '提交成功',
          content: '作者审核后即可显示',
          showCancel: false,
          confirmText: '知道了'
        })
        this.getComments()
        this.setData({
          msg: ''
        })
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    })
  },
})