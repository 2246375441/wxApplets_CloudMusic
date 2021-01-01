// pages/index/index.js
import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bannerList:[], //轮播图数据
    recommendList:[], //推荐歌单数据
    topList:[] //排行榜数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    // 发送请求轮播图
    let bannerListData = await request('/banner',{type:2})
    this.setData({
      bannerList:bannerListData.banners
    })
    // 请求推荐歌单数据
    let recommendListData = await request('/personalized',{limit:10})
    this.setData({
      recommendList:recommendListData.result
    })
    // 请求排行榜数据
    // http://localhost:3000/top/list?idx=0   idx为第几个排行榜数据
    // 目的需求 需要五个排行榜 则需要发送五次排行榜请求数据 idx为0-4  idx范围(0-20)
    let idxIndex = 0  //当前请求第几个排行榜
    let idxIndexMax = 4 //请求到第几个排行榜结束
    let idxIndexMuiscCount = 3 //每个排行榜取多少首歌曲
    let resultArr = []
    for (let i = 0; i < idxIndexMax+1; i++) {
      let topListData = await request('/top/list',{idx:i})
      let topListItem = {
        name:topListData.playlist.name,
        tracks:topListData.playlist.tracks.slice(0,idxIndexMuiscCount)
      }
      resultArr.push(topListItem)
      // 更新获取的排行榜数据 ----用户体验＋,渲染次数多,发送完毕响应数据之后就开始渲染
      this.setData({
        topList:resultArr
      })
    }
    // 更新获取的排行榜数据 ----用户体验-,渲染次数少,需要等待所有请求结束渲染页面
    // this.setData({
    //   topList:resultArr
    // })
  },
	// 路由跳转至 每日推荐
	routerRecommendSong(){
		wx.navigateTo({
			url:'/songPackage/pages/recommendSong/recommendSong'
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