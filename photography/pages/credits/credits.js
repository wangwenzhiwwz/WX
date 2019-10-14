// pages/credits/credits.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        credits: '0',
        level: '入门新手'
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            credits: options.credits,
            level: options.level
        })
    }
})