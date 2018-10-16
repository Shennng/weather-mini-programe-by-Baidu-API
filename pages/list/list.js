// pages/list/list.js
const iconPathMap = {
  '穿衣': 'wear',
  '洗车': 'car',
  '感冒': 'influenza',
  '运动': 'sport',
  '紫外线强度': 'uv'
}


Page({
  data: {
    todayTips: [
      {
        des: "------------------------------------------------------------------------------------------------------------",
        title: "穿衣" + "指数",
        zs: "XXX",
        iconPath: '/images/list-icon/wear.png'
      },
      {
        des: "------------------------------------------------------------------------------------------------------------",
        title: "洗车" + "指数",
        zs: "XX",
        iconPath: '/images/list-icon/car.png'
      },
      {
        des: "------------------------------------------------------------------------------------------------------------",
        title: "感冒" + "指数",
        zs: "XX",
        iconPath: '/images/list-icon/influenza.png'
      },
      {
        des: "------------------------------------------------------------------------------------------------------------",
        title: "运动" + "指数",
        zs: "XXX",
        iconPath: '/images/list-icon/sport.png'
      },
      {
        des: "------------------------------------------------------------------------------------------------------------",
        title: "U V " + "指数",
        zs: "XX",
        iconPath: '/images/list-icon/uv.png'
      }
    ]
  },
  onLoad(options) {
  this.setData({
        todayTips: [ {
          des: options.wearDesc,
          title: "穿衣" + "指数",
          iconPath: '/images/list-icon/wear.png',
          zs: options.wearZs
        },
        {
          des: options.carDesc,
          title: "洗车" + "指数",
          iconPath: '/images/list-icon/car.png',
          zs: options.carZs
        },
        {
          des: options.influenzaDesc,
          title: "感冒" + "指数",
          iconPath: '/images/list-icon/influenza.png',
          zs: options.influenzaZs
        },
        {
          des: options.sportDesc,
          title: "运动" + "指数",
          iconPath: '/images/list-icon/sport.png',
          zs: options.sportZs
        },
        {
          des: options.uvDesc,
          title: "U V " + "指数",
          iconPath: '/images/list-icon/uv.png',
          zs: options.uvZs
        }
      ]});
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: "#010101",
      animation: {
        duration: 500,
        timingFunc: 'easeOut'
      }
    });
  },
  onPullDownRefresh() {
    this.meaningless(() => {wx.stopPullDownRefresh()})
  },
  meaningless(callback) {
    callback && (callback(), wx.showToast({title: '刷新成功'}));
  }
})