// pages/list/list.js
Page({
  data: {
    todayTips: [
      {
        des: "--建议着厚外套加毛衣等服装。--",
        title: "穿衣指数",
        zs: "裸奔如何？",
        iconPath: '/images/list-icon/wear.png'
      },
      {
        des: "有雨，雨水和泥水会弄脏爱车。",
        title: "洗车指数",
        zs: "10元一次",
        iconPath: '/images/list-icon/car.png'
      },
      {
        des: "天凉，湿度大，易感冒",
        title: "感冒指数",
        zs: "非典级别",
        iconPath: '/images/list-icon/influenza.png'
      },
      {
        des: "有降水，推荐您在室内进行休闲运动。",
        title: "运动指数",
        zs: "非常适合",
        iconPath: '/images/list-icon/sport.png'
      },
      {
        des: "如果你看到这里。emmmm~那么恭喜你，数据是假的",
        title: "U V 指数",
        zs: "宇宙至强",
        iconPath: '/images/list-icon/uv.png'
      }
    ]
  },
  onLoad(options) {
    this.dealData(options)
    this.setNavigationBarColor()
  },
  setNavigationBarColor() {
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: "#5661b1",
      animation: {
        duration: 500,
        timingFunc: 'easeOut'
      }
    });
  },
  dealData(options) {
    let zsType = ['wear', 'car', 'influenza', 'sport', 'uv'];
    let todayTips = [];
    for (let i = 0; i < 5; i++) {
      let title = zsType[i] + 'Tipt';
      let zs = zsType[i] + 'Zs';
      let desc = zsType[i] + 'Desc'
      //如果options[desc]为空，则break循环
      if (!options[desc]) {
        break;
      }
      todayTips.push({
        des: options[desc],
        title: options[title],
        zs: options[zs],
        iconPath: '/images/list-icon/' + zsType[i] + '.png'
      })
    }
    if (todayTips.length !== 0) {
      this.setData({
        todayTips: todayTips
      });
    }
  },
  onPullDownRefresh() {
  //无意义的刷新
    this.meaningless(() => {wx.stopPullDownRefresh()})
  },
  meaningless(callback) {
    callback && (callback(), wx.showToast({title: '刷新成功'}));
  }
})