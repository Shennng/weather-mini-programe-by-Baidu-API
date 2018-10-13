const bmap = require('../../libs/bmap-wx.js')

const weatherMap = {
  '晴转': 'sunny',
  '多云': 'cloudy', 
  '阴转': 'overcast',
  '小雨': 'lightrain',
  '大雨': 'heavyrain',
  '雪': 'snow'
}

const weatherColorMap = {
  'sunny': '#cbeefd',
  'cloudy': '#deeef6',
  'overcast': '#c6ced2',
  'lightrain': '#bdd5e1',
  'heavyrain': '#c5ccd0',
  'snow': '#aae1fc'
}

const UNAUTHORIZED = 0  //被拒绝
const AUTHORIZED = 1  //已允许

Page({
  data: {
    nowTemp: "15℃",
    nowWeather: "小雨转中雨",
    nowWeatherBackground: 'heavyrain',
    fourDaysWeather: [
      {time: "今天", 
      iconPath: "/images/heavyrain-icon.png", 
      temp: "19 ~ 14℃" },
      {time: "周日", 
      iconPath: "/images/heavyrain-icon.png", 
      temp: "17 ~ 14℃" },
      {time: "周一", 
      iconPath: "/images/heavyrain-icon.png", 
      temp: "17 ~ 14℃" },
      {time: "周二", 
      iconPath: "/images/cloudy-icon.png", 
      temp: "21 ~ 15℃" }
    ],
    todayTemp: '14 ~ 19℃',
    todayDate: '周五 10月12日',
    todayPM25: '67',
    todayWind: '北风微风',
    todayTips: [],
    city:'北京市',
    locationAuthType: AUTHORIZED
  },
  onPullDownRefresh() {
    this.getWeatherDataByBaidu(() => {
      wx.stopPullDownRefresh()
    });
  },
  onLoad() {
    this.BMap = new bmap.BMapWX({
      ak: '83LNAj7kAagAcpQGhjhZ8GDGECuWW3P9'
    });
    this.getWeatherDataByBaidu();
  },
  getWeatherDataByBaidu(callback) {
    this.BMap.weather({
      success: res => {
        let todayData = res.currentWeather[0];
        let future4DaysData = 
          res.originalData.results[0].weather_data;
        this.setData({
          locationAuthType: AUTHORIZED
        });
        this.setToday(todayData);
        this.setFuture4Days(future4DaysData);
        this.setData({
          locationAuthType: AUTHORIZED
        })
      },
      fail: res => {
        this.setData({
          locationAuthType: UNAUTHORIZED
        });
      }
    });
    callback && callback() && wx.showToast({title: '刷新成功'});
  },
  onTapRegetWeather() {
    wx.getSetting({
      success: res => {
        let auth = res.authSetting["scope.userLocation"];
        this.setData({
          locationAuthType: (
            auth ? AUTHORIZED : UNAUTHORIZED)
        })
        console.log(auth);
        if (auth) {
          this.getWeatherDataByBaidu();
          wx.showToast({ title: '位置开启' });
        } else {
          wx.showToast({ 
            title: '位置未开启',
            image: '../../images/alert_icon.png'
          });
        }
      }
    });
  },
  setToday(todayData) {
    let weatherDesc = todayData.weatherDesc;
    let weather = (
      weatherDesc.slice(0, 1) === '晴' ?
        'sunny' : (weatherDesc.slice(0, 1) === '阴') ?
          'overcast' : (weatherDesc.slice(1, 2) === '云') ?
            'cloudy' : (weatherDesc.slice(1, 2) === '雨') ?
              'heavyrain' : 'snow');
    this.setData({
      nowTemp: ( 
        todayData.date.substr(-4, 3)[0] == '：' ? todayData.date.substr(-4, 3).slice(1) : todayData.date.substr(-4, 3)),
      nowWeather: weatherDesc,
      nowWeatherBackground: weather,
      todayTemp: todayData.temperature,
      todayDate: todayData.date.slice(0, 9)+' 今天',
      todayPM25: todayData.pm25,
      todayWind: todayData.wind,
      city: todayData.currentCity,
    });
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: weatherColorMap[weather],
      animation: {
        duration: 500,
        timingFunc: 'easeOut'
      }
    });
  },
  setFuture4Days(future4DaysData){
    let fourDaysWeather = [];
    for (let i = 0; i < 4; i ++) {
      let data = future4DaysData[i];
      let weather = (
        data.weather.slice(0, 1) === '晴' ?
          'sunny' : (data.weather.slice(0, 1) === '阴') ?
            'overcast' : (data.weather.slice(1, 2) === '云') ?
              'cloudy' : (data.weather.slice(1, 2) === '雨') ?
                'heavyrain' : 'snow');
      fourDaysWeather.push({
        time: data.date.slice(0,2),
        iconPath: '/images/' + weather + '-icon.png',
        temp: data.temperature
      });
    };
    fourDaysWeather[0].time = '今天';
    this.setData({
      fourDaysWeather: fourDaysWeather
    });
  }
})