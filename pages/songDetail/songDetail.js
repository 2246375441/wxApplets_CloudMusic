import request from '../../utils/request'
// 获取全局实例 app.js中实例对象
const appInstance = getApp()
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
		
		// 判断当前页面是否在播放--取全局app实例中的isMusicPlay和musicId
		if(appInstance.globalData.isMusicPlay && appInstance.globalData.musicId === musicId){
			// 全局中的isMusicPlay为true  且 全局的musicId和onLoad下的musicId一致触发 
			// 当前音乐为 已经正在播放的音乐 --> 修改页面初始化
			this.setData({
				isPlay:true
			})
		}
		
		// 创建控制音乐播放的实例对象
		this.backgroundAudioManager = wx.getBackgroundAudioManager()
		
		// 监听背景音乐播放
		this.backgroundAudioManager.onPlay(()=>{
			// 封装方法 修改实例的isPlay
			this.changePlayState(true)
			// 修改app.js全局音乐播放的状态
			// appInstance.globalData.isMusicPlay = true; 封装在 changePlayState方法中
			appInstance.globalData.musicId = musicId
		})
		
		// 监听背景音乐暂停
		this.backgroundAudioManager.onPause(()=>{
			// 封装方法 修改实例的isPlay
			this.changePlayState(false)
			// 修改app.js全局音乐播放的状态
		})
		
		// 监听移动端 浮框音乐关闭
		this.backgroundAudioManager.onStop(()=>{
			// 封装方法 修改实例的isPlay
			this.changePlayState(false)
			// 修改app.js全局音乐播放的状态
		})
  },
	
	// 修改播放状态功能函数
	changePlayState(isPlay){
		this.setData({
			isPlay:isPlay
		})
		appInstance.globalData.isMusicPlay = isPlay;
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