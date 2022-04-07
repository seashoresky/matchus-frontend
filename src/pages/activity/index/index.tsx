import {View} from "@tarojs/components";
import {useDispatch, useSelector} from "react-redux";
import {Image} from "@taroify/core";
import {ActivityHeaderPlaceholderImage} from "@/assets/images";
import {useEffect, useState} from "react";
import {fetchLatestActivityInfo} from "@/actions";
import Taro, {useDidShow} from "@tarojs/taro";
import {MatchCard, SurveyCard, SignUpCard, ChooseCard} from "@/components/activity-card";

import './index.scss'
import {Like} from "@taroify/icons";

const Index = () => {
  const dispatch = useDispatch()
  const {user, activity} = useSelector(state => state)
  const {nickName, avatarUrl, identified} = user
  const {id, price, wjxPath, wjxAppId, participate} = activity
  const {signUp, match, choose, fillForm} = participate

  const [payBodyPrefix, setPayBodyPrefix] = useState('')
  const [signUpStartTime, setSignUpStartTime] = useState('')
  const [matchResultShowTime, setMatchResultShowTime] = useState('')
  const [twoWayChooseStartTime, setTwoWayChooseStartTime] = useState('')
  const [twoWayChooseEndTime, setTwoWayChooseEndTime] = useState('')

  useDidShow(async () => {
    const checkUserState = async () => {
      if (!nickName || !avatarUrl) {
        await Taro.navigateTo({url: '/pages/introduction/index'})
        return
      }
      if (identified !== '已认证') {
        await Taro.navigateTo({url: '/pages/introduction/index'})
        return
      }
    }

    /**
     * 进入活动页，
     * 首先检查是否完成了基本信息的获取，依据是nickName和avatar是否存在;
     * 其次检查是否完成了必要信息的填写，如果没有，跳转到欢迎页
     */
    // await checkUserState()

    /**
     * 检查活动当前状态
     */
  })

  useEffect(() => {
    // 进入界面就获取活动的基本信息，和个人信息
    fetchData()
  }, [])

  useEffect(() => {
    // 处理时间等数据
    if (activity.signUpStartTime) {
      let t = new Date(activity.signUpStartTime)
      setSignUpStartTime(`${t.getMonth()}.${t.getDate()}`)
    }

    if (activity.matchResultShowTime) {
      let t = new Date(activity.matchResultShowTime)
      setMatchResultShowTime(`${t.getMonth()}.${t.getDate()}日${t.getHours()}点`)
    }

    if (activity.twoWayChooseStartTime) {
      let t = new Date(activity.twoWayChooseStartTime)
      setTwoWayChooseStartTime(`${t.getDate()}日${t.getHours()}时`)
    }

    if (activity.twoWayChooseEndTime) {
      let t = new Date(activity.twoWayChooseEndTime)
      setTwoWayChooseEndTime(`${t.getMonth()}.${t.getDate()}日${t.getHours()}时`)
    }

    if(activity.id && user.openid) {
      setPayBodyPrefix(`${activity.id}-${user.openid}`)
    }
  }, [activity])

  function fetchData() {
    dispatch(fetchLatestActivityInfo())
  }

  return (
    <View className='container' style={{position: 'relative'}}>
      <Image src={activity.imageUrl ? activity.imageUrl : ActivityHeaderPlaceholderImage} className='header'/>
      <View className='container wrapper'>
        <SignUpCard
          price={price}
          state={signUp.state}
          paid={signUp.paid}
          participated={signUp.participated}
          time={signUpStartTime}
          activity={id}
          bodyPrefix={payBodyPrefix}
        />

        <SurveyCard
          activity={id}
          filled={fillForm.filled}
          state={fillForm.state}
          wjxAppId={wjxAppId}
          wjxPath={wjxPath}
        />

        <MatchCard
          activity={id}
          resultShowTime={matchResultShowTime}
          state={match.state}
          matchResult={match.matchResult}
          favor={match.favor}
          lastChoose={match.lastChoose}
          left={match.left}
          filled={fillForm.filled}
        />

        <ChooseCard
          activity={id}
          startTime={twoWayChooseStartTime}
          endTime={twoWayChooseEndTime}
          state={choose.state}
          choice={choose.choice}
          message={choose.message}
          hasResult={choose.hasResult}
          chooseResult={choose.chooseResult}
        />

        <View>
          <Like />
        </View>
      </View>
    </View>
  )
}

export default Index
