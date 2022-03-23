export default defineAppConfig({
  pages: [
    'pages/home/index',
    'pages/activity/index/index',
    'pages/user/index/index',

    'pages/activity/page-1/index',
    'pages/activity/page-2/index',
    'pages/activity/page-3/index',

    'pages/user/help/index',
    'pages/user/record/index',
    'pages/user/about/index',
    'pages/user/information/index',
    'pages/user/privacy/index',
    'pages/user/agreement/index',

    'pages/identify/index',

    'pages/introduction/index',
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#918AE3',
    navigationBarTitleText: 'MatchUs',
    navigationBarTextStyle: 'white'
  },
  tabBar: {
    selectedColor: '#918AE3',
    borderStyle: 'black',
    list: [
      {
        text: '首页',
        pagePath: 'pages/home/index',
        iconPath: 'assets/images/tablist/home.png',
        selectedIconPath: 'assets/images/tablist/home-s.png',
      },
      {
        text: '活动',
        pagePath: 'pages/activity/index/index',
        iconPath: 'assets/images/tablist/activity.png',
        selectedIconPath: 'assets/images/tablist/activity-s.png',
      },
      {
        text: '我的',
        pagePath: 'pages/user/index/index',
        iconPath: 'assets/images/tablist/my.png',
        selectedIconPath: 'assets/images/tablist/my-s.png',
      },
    ],
  },
  navigateToMiniProgramAppIdList: ["wxd947200f82267e58"]
})
