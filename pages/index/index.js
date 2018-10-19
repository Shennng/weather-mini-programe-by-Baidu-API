const bmap = require('../../libs/bmap-wx.js')

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
    nowWeather: "晴转多云",
    nowWeatherBackground: 'sunny',
    fourDaysWeather: [
      {time: "今天", 
      iconPath: "/images/sunny-icon.png", 
      temp: "14 ~ 19℃" },
      {time: "周日", 
        iconPath: "/images/overcast-icon.png", 
      temp: "14 ~ 17℃" },
      {time: "周一", 
        iconPath: "/images/snow-icon.png", 
      temp: "12 ~ 19℃" },
      {time: "周二", 
      iconPath: "/images/cloudy-icon.png", 
      temp: "15 ~ 21℃" }
    ],
    todayTemp: '14 ~ 19℃',
    todayDate: '周日 5月20日',
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
        let todayTips = res.originalData.results[0].index;

        this.setToday(todayData);
        this.setFuture4Days(future4DaysData);

        this.setData({
          todayTips: todayTips,
          locationAuthType: AUTHORIZED
        });
      },
      fail: res => {
        this.setData({
          locationAuthType: UNAUTHORIZED
        });
      }
    });
    callback && (callback(),wx.showToast({title: '刷新成功'}));
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
    let todayTemp = todayData.temperature;
    let index = todayTemp.indexOf('~');
    let weatherDesc = todayData.weatherDesc;
    let weather = (
      weatherDesc.indexOf('雷') != -1 ?
      'heavyrain' : weatherDesc.indexOf('雪') != -1 ?
      'snow' : weatherDesc.indexOf('雨') != -1 ?
      'lightrain' : weatherDesc.indexOf('阴') != -1 ?
      'overcast' : weatherDesc.indexOf('云') != -1 ?
      'cloudy' : 'sunny');
    this.setData({
      nowTemp: ( 
        todayData.date.substr(-4, 3)[0] == '：' ? todayData.date.substr(-4, 3).slice(1) : todayData.date.substr(-4, 3)),
      nowWeather: weatherDesc,
      nowWeatherBackground: weather,
      todayTemp: `${todayTemp.slice(index + 2, -1)} ~ ${todayTemp.slice(0, index - 1)}℃`,
      todayDate: todayData.date.slice(0, 9),
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
      let temp = data.temperature;
      let index = temp.indexOf('~');
      let weather = (
        data.weather.indexOf('雷') != -1 ?
        'heavyrain' : data.weather.indexOf('雪') != -1 ?
        'snow' : data.weather.indexOf('雨') != -1 ?
        'lightrain' : data.weather.indexOf('阴') != -1 ?
        'overcast' : data.weather.indexOf('云') != -1 ?
        'cloudy' : 'sunny');
      fourDaysWeather.push({
        time: data.date.slice(0,2),
        iconPath: '/images/' + weather + '-icon.png',
        temp: `${temp.slice(index + 2, -1)} ~ ${temp.slice(0, index - 1)}℃`
      });
    };
    fourDaysWeather[0].time = '今天';
    this.setData({
      fourDaysWeather: fourDaysWeather
    });
  },
  onTaptoList() {
    let data = this.data.todayTips;
    let dataString = '';
    let zsType = ['wear', 'car', 'influenza', 'sport', 'uv']
    for (let i = 0; i < data.length; i++) {
      if (!i) {
        dataString += `${zsType[i]}Tipt=${data[i].tipt}&${zsType[i]}Desc=${data[i].des}&${zsType[i]}Zs=${data[i].zs}`
      } else {
        dataString += `&${zsType[i]}Tipt=${data[i].tipt}&${zsType[i]}Desc=${data[i].des}&${zsType[i]}Zs=${data[i].zs}`
      }
    }
    wx.navigateTo({
      url: `/pages/list/list?${dataString}`
    })
  }
})