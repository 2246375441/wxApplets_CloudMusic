import request from '../../../utils/request'
import PubSub from 'pubsub-js';
import moment from 'moment';
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
		musicLink:'', //音乐的链接
		currentTime:'00:00', //开始时长|实时时长
		durationTime:'00:00',//结束时长|总时长
		currentWidth:0, //实时进度条宽度
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
		
		/*
		*
		* 下面为 全局音频控制 ↓
		* 
		*/
		
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
		
		// 监听音乐播放结束 自动下一首
		this.backgroundAudioManager.onEnded(()=>{
			// 切换下一首音乐 并且自动播放
			PubSub.publish('switchType','next')
			// 还原进度条长度
			this.setData({
				currentWidth:0,
				currentTime:'00:00'
			})
		})
		
		// 监听音乐实时播放进度
		this.backgroundAudioManager.onTimeUpdate(()=>{
			// console.log(`总时长`,this.backgroundAudioManager.duration)
			// console.log(`实时时长`,this.backgroundAudioManager.currentTime)
			// 获取的值单位是秒s 需要 转换为毫秒ms
			// 格式化实时的播放时间
			let currentTime = moment(this.backgroundAudioManager.currentTime*1000).format('mm:ss')
			// 计算进度条长度
			let currentWidth = this.backgroundAudioManager.currentTime/this.backgroundAudioManager.duration * 450 
			// 更新页面数据
			this.setData({
				currentTime,
				currentWidth
			})
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
		let {musicId,musicLink} = this.data
		this.musicControl(isPlay,musicId,musicLink)
	},
	
	// 获取音乐详情的功能函数
	async getMusicInfo(musicId){
		// 发送请求音乐详情
		let songData = await request('/song/detail',{ids:musicId})
		// 处理页面的开始时长和总时长
		// songData.songs[0].dt 请求返回数据的总时长 单位ms
		let durationTime = moment(songData.songs[0].dt).format('mm:ss')
		this.setData({
			song:songData.songs[0],
			durationTime
		})
		
		
		// 动态修改窗口标题
		wx.setNavigationBarTitle({
			title:this.data.song.name
		})
	},
	
	// 控制音乐播放/暂停的功能函数
	async musicControl(isPlay,musicId,musicLink){
		if(isPlay){
			// 播放
			// 获取音乐的播放链接
			// 判断 当用户没有传入musicLink则发送请求 请求路径及数据
			// 判断 当用户传入musicLink则不发送请求,用之前存储下来的数据
			if(!musicLink){
				let musicLinkData = await request('/song/url',{id:musicId})
				musicLink = musicLinkData.data[0].url
				
				this.setData({
					musicLink
				})
			}
			// 设置音乐链接
			this.backgroundAudioManager.src = musicLink;
			// 设置歌曲名称(不设置无法播放歌曲)
			this.backgroundAudioManager.title = this.data.song.name
		}else{
			// 暂停
			this.backgroundAudioManager.pause()
		}
	},
	
	// 点击切换歌曲
	handleSwitch(e){
		// 获取事件中绑定的id值 判断是上一首还是下一首 e.target.id 中获取
		let type = e.target.id
		// 关闭当前播放的音乐
		this.backgroundAudioManager.stop()
		// npm/发布消息数据给recommendSong/参数可以是对象
		PubSub.publish('switchType',type)
		
		// 订阅recommendSong发布的musicId事件
		PubSub.subscribe('musicId',(msg,data)=>{
			// data => musicId
			// 获取音乐详情信息
			this.getMusicInfo(data)
			// 自动播放歌曲
			this.musicControl(true,data)
			
			// 取消订阅 防止堆栈叠加
			PubSub.unsubscribe('musicId')
		})	
	},
	
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