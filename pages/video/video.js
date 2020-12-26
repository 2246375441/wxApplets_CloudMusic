import request from '../../utils/request'
import config from '../../utils/config'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    videoGroupList:[], //导航的标签数据
    navId:'',//导航标识
    videoList:[], //视频列表数据
    videoId:'',//视频id标识
    videoUpdateTime:[] //记录video播放时长
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
  // 点击播放/继续播放 处理回调
  handlePlay(event){
    // 需求
    //    1.在点击播放的事件中需要找到上一个播放的视频
    //    2.在播放新的视频之前关闭上一个正在播放的视频
    // 注意点
    //    1.如何找到上一个视频的实例对象
    //    2.如何确认点击播放的视频和正在播放的视频不是同一个视频
    // 思路 
    //    1.把实例绑定在this上面,每次点击都会先触发实例的视频关闭(先判断当前vid跟上个视频vid是否一样)
    //    2.不一样则先把视频关闭 然后重新创建新视频的实例 绑定在this上面 ,一样则不关闭视频视频 继续播放
    // 单例模式：
    //    1. 需要创建多个对象的场景下，通过一个变量接收，始终保持只有一个对象，
    //    2. 节省内存空间

    let vid = event.currentTarget.id //获取视频的id 
    this.vid !== vid && this.videoContext && this.videoContext.stop();//先判断是否是上一个视频 是关闭暂停,否则跳过此操作
    this.vid = vid //赋值 在全局上绑定 播放视频的id
    this.setData({  //更新data中的videoId
      videoId:vid 
    })
    this.videoContext = wx.createVideoContext(vid) //创建新的video实例控制/覆盖全局的视频实例

    // 判断当前视频是否播放过 是否有播放记录 有的话则跳转 没有则开始播放
    let _videoUpdateTime = this.data.videoUpdateTime
    let videoItem = _videoUpdateTime.find(item=>item.vid === vid)
    if(videoItem){
      this.videoContext.seek(videoItem.currentTime)
    }
    this.videoContext.play()
  },
  // 监听视频播放进度条
  handleTimeUpdate(event){
    // console.log(event)
    // 存放当前视频id 和 视频播放进度
    let videoTimeObj = {
      vid:event.currentTarget.id, 
      currentTime: event.detail.currentTime
    } 
    // 获取this.data中的videoUpdateTime数据
    let _videoUpdateTime = this.data.videoUpdateTime
    // 进行查找 是否 之前播放过
    let videoItem = _videoUpdateTime.find(item=> item.vid===videoTimeObj.vid)
    if(videoItem){
      // 之前有记录
      videoItem.currentTime = event.detail.currentTime
    }else{
      // 之前没有
      _videoUpdateTime.push(videoTimeObj)
    }
    // 统一更新this.data中的状态
    this.setData({
      videoUpdateTime:_videoUpdateTime
    })
  },
  // 视频播放结束调用
  handleEnd(event){
    // 移除记录播放时长数组中当前视频对象
    let _videoUpdateTime = this.data.videoUpdateTime
    // 获得该视频对象 在数组中的下标值
    var index =  _videoUpdateTime.findIndex(item => item.vid ===event.currentTarget.id)
    // 移除该 视频对象
    _videoUpdateTime.splice(index,1)
    // 修改data中数据
    this.setData({
      videoUpdateTime:_videoUpdateTime
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