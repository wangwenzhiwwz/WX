const WXAPI = require('apifm-wxapi')
const AUTH = require('utils/auth')
const CONFIG = require('config.js')

App({
  onLaunch() {
    // 启动小程序
    WXAPI.init(CONFIG.subDomain)
    WXAPI.setMerchantId(CONFIG.merchantId)
    // 检测新版本
    const updateManager = wx.getUpdateManager()
    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success(res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })
    })
  },
  onShow (e) {
    // 保存邀请人
    if (e && e.query && e.query.inviter_id) {
      wx.setStorageSync('referrer', e.query.inviter_id)
      if (e.shareTicket) {
        wx.getShareInfo({
          shareTicket: e.shareTicket,
          success: res => {
            wx.login({
              success(loginRes) {
                if (loginRes.code) {
                  WXAPI.shareGroupGetScore(
                    loginRes.code,
                    e.query.inviter_id,
                    res.encryptedData,
                    res.iv
                  ).then(_res => {
                    console.log(_res)
                  }).catch(err => {
                    console.error(err)
                  })
                } else {
                  console.error('登录失败！' + loginRes.errMsg)
                }
              }
            })
          }
        })
      }
    }
    // 自动登录
    AUTH.checkHasLogined().then(isLogined => {
      if (!isLogined) {
        AUTH.authorize()
      }
    })
  },
  globalData: {
    
  }
})