import request from '../../utils/request'
import config from '../../utils/config'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    videoGroupList:[], //导航的标签数据
    navId:'',//导航标识
    videoList:[] //视频列表数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取导航数据
    let navSliceMax = config.navSliceMax  //截取多少个导航数据
    // 获取导航数据
    this.getVideoGroupListData(navSliceMax)
  },

  // 获取导航数据
  async getVideoGroupListData(max){
    let VideoGroupListData = await request('/video/group/list')
    this.setData({
      videoGroupList:VideoGroupListData.data.slice(0,max),
      navId:VideoGroupListData.data[0].id
    })
    // 获取视频列表数据
    this.getVideoList(this.data.navId)
  },
  // 点击切换导航事件
  changeNav(event){
    let navId = event.currentTarget.id
    this.setData({
      navId:navId*1,
      videoList:[]
    })
    // 显示正在加载
    wx.showLoading({
      title:'正在努力加载！'
    })

    // 动态获取当前导航的视频数据
    this.getVideoList(this.data.navId)
  },
  // 获取视频列表数据
  async getVideoList(navId){
    // 当navId为空的时候不发送请求
    if(!navId){
      return
    }
    // 发送请求
    let videoListData = await request('/video/group',{id:navId})
    // 关闭动态加载提示框
    wx.hideLoading()
    // 添加独立的index
    let index = 0
    let videoList = videoListData.datas.map(item=>{
      item.id = index ++
      return item
    })
    this.setData({
      videoList:videoList
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