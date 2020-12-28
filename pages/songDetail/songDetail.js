import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPlay:false,  //音乐是否播放
		song:{},  //歌曲详情对象
		musicId:'', //音乐id
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
		// 获取跳转过来的musicId值
		var musicId = options.musicId
		this.setData({
			musicId:musicId
		})
		// 获取音乐详情的功能函数
		this.getMusicInfo(musicId)
		
		// 创建控制音乐播放的实例对象
		this.backgroundAudioManager = wx.getBackgroundAudioManager()
		// 监听背景音乐播放
		this.backgroundAudioManager.onPlay(()=>{

			this.changePlayState(true)
		})
		// 监听背景音乐暂停
		this.backgroundAudioManager.onPause(()=>{

			this.changePlayState(false)
		})
		// 监听移动端 浮框音乐关闭
		this.backgroundAudioManager.onStop(()=>{

			this.changePlayState(false)
		})
  },
	// 修改播放状态功能函数
	changePlayState(isPlay){
		this.setData({
			isPlay:isPlay
		})
	},
	
	// 点击播放/暂停
	handleMusicPlay(){
		let isPlay = !this.data.isPlay
		// this.setData({
		// 	isPlay
		// })
		// 控制音乐播放/暂停
		// let {isPlay} = this.data
		let {musicId} = this.data
		this.musicControl(isPlay,musicId)
	},
	
	// 获取音乐详情的功能函数
	async getMusicInfo(musicId){
		let songData = await request('/song/detail',{ids:musicId})
		this.setData({
			song:songData.songs[0]
		})
		// 动态修改窗口标题
		wx.setNavigationBarTitle({
			title:this.data.song.name
		})
	},
	
	// 控制音乐播放/暂停的功能函数
	async musicControl(isPlay,musicId){
		if(isPlay){
			// 播放
			// 获取音乐的播放链接
			let musicLinkData = await request('/song/url',{id:musicId})
			let musicLink = musicLinkData.data[0].url
			// 设置音乐链接
			this.backgroundAudioManager.src = musicLink;
			// 设置歌曲名称(不设置无法播放歌曲)
			this.backgroundAudioManager.title = this.data.song.name
		}else{
			// 暂停
			this.backgroundAudioManager.pause()
		}
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