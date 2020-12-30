import request from '../../utils/request'
var isSend = false
Page({

  /**
   * 页面的初始数据
   */
  data: {
    placeholderContent:'' , //placeholder默认值
		hotList:[], //热搜榜数据
		searchContent:'', //用户输入表单项数据
		searchList:[], //搜索数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
		// 获取初始化数据---调用方法
		this.getInitData()
  },
	// 获取初始化的数据
	async getInitData(){
		let placeholderData = await request('/search/default')
		let hotListData = await request('/search/hot/detail')
		this.setData({
			placeholderContent:placeholderData.data.showKeyword,
			hotList:hotListData.data
		})
	},
	
	// 表单项内容发生改变的回调
	handleInputChange(e){
		// 动态修改表单项
		this.setData({
			searchContent:e.detail.value.trim()
		})
		
		// 函数节流
		// isSend为true时 请求不发送  为false发送请求
		if(isSend){
			return
		}else{
			isSend = true
			this.getSearchList()
		}
		setTimeout(()=>{
			isSend = false
		},1000)
		
	},
	
	// 获取搜索数据
	async getSearchList(){
		// 发送请求 获取关键字 模糊请求匹配数据
		let searchListData = await request('/search',{keywords:this.data.searchContent,limit:10})
		this.setData({
			searchList:searchListData.result.songs
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