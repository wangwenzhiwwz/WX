// pages/albumComment/albumComment.js


Page({

    /**
     * 页面的初始数据
     */
    data: {
        specialId: '',
        userId: '',
        active: '',
        loading: true,
        focus: false,
        placeHolder: '请输入评论内容',
        msg: '',
        isReply: false,
        replyCommentId: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.setNavigationBarTitle({
            title: options.title + '评论'
        })
        let that = this;
        wx.getStorage({
            key: 'userId',
            success: (res) => {
                console.log(res)
                if (res.data) {
                    that.setData({
                        userId: res.data
                    })
                } else {
                    app.getUserId();
                    app.getCode();
                }
            },
            fail: (res) => {
                console.log(res)
                app.getUserId();
                app.getCode();
            }
        })
        this.setData({
            specialId: options.id
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
    getComments: function () {
        let that = this;
        wx.request({
            url: HOST + '/wechat/specialComment',
            data: {
                id: this.data.specialId
            },
            success: res => {
                console.log(res);
                if (res.data.state == 1) {
                    that.setData({
                        commentList: res.data.data,
                        loading: false,
                    })

                    // 停止下拉刷新
                    wx.stopPullDownRefresh();
                } else {
                    console.log("数据查询错误！");
                }
            }
        })
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
        let text = e.detail.value;
        let that = this;

        if (text.trim() == "") {
            wx.showModal({
                title: '提示',
                showCancel: false,
                content: '内容不能为空！',
                confirmColor: '#a09fed'
            })
            return false;
        }
        // 评论内容
        if (!that.data.isReply) {
            wx.request({
                url: HOST + '/wechat/addSpecialComment',
                data: {
                    id: that.data.specialId,
                    userId: that.data.userId,
                    text: text
                },
                success: (res => {
                    that.getComments();
                    that.setData({
                        msg: '',
                        active: '',
                    })
                    console.log(res);
                })
            })
        } else {
            // 回复评论
            wx.request({
                url: HOST + '/wechat/commentSpecialReply',
                data: {
                    commentId: that.data.replyCommentId,
                    userId: that.data.userId,
                    text: text
                },
                success: (res => {
                    that.getComments();
                    that.setData({
                        msg: '',
                        active: '',
                        placeHolder: '请输入评论内容',
                        isReply: false
                    })
                    console.log(res);
                })
            })
        }

    },
})