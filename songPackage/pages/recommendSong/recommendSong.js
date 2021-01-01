// pages/recommendSong/recommendSong.js
import request from '../../../utils/request'
import PubSub from 'pubsub-js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    month:"",//月
    day:"",  //日
    recommendList:[], //推荐列表数据
		idnex:0, //点击音乐下标
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 判断用户是否登录
    let userInfo = wx.getStorageSync('userInfo')
    if(!userInfo){
      // 未登录直接跳转至 登录页面
      wx.showToast({
        title: '请先登录',
        icon:'none',
        success:()=>{
          // 跳转至登录界面
          wx.reLaunch({
            url: '/pages/login/login',
          })
        }
      })
    }
		
    // 更新日期的状态数据
    this.setData({
      month:new Date().getMonth() + 1,
      day:new Date().getDate()
    })

    // 获取每日推荐数据
    this.GetRecommendList()
		
		// npm/订阅来自songDetail页面发布的消息
		// 接受发送过来 是上一首还是下一首
		PubSub.subscribe('switchType',(msg,type)=>{
			let {recommendList,index} = this.data
			if(type==='pre'){
				// 上一首处理
				// 当前是第一首 点击上一首 回到最后一首
				(index === 0) && (index=recommendList.length)
				index = index - 1
			}else{
				// 下一首处理
				// 当前是最后一首 点击下一首 回到第一首
				(index === recommendList.length - 1) && (index=-1)
				index = index + 1
			}
			
			// 更新数据
			this.setData({
				index
			})
			let musicId = recommendList[index].id
			// 处理完毕上/下首歌曲的musicId  传给songDetail
			PubSub.publish('musicId',musicId)
		})
  },
	
  // 获取每日推荐数据
  async GetRecommendList(){
    let recommendListData = await request('/recommend/songs')
    this.setData({
      recommendList:recommendListData.recommend
    })
  },
	
	// 跳转至歌曲详情 播放器页面
	toSongDetail(event){
		// 数据绑定在data-song="{{item}}"中
		// let song = event.currentTarget.dataset.song
		// let index = event.currentTarget.dataset.index
		let {song,index} = event.currentTarget.dataset
		this.setData({
			index
		})
		wx.navigateTo({
			url:'/songPackage/pages/songDetail/songDetail?musicId=' + song.id
		})
	},
	// 
	
	// 
	
	// 
	
	// 
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