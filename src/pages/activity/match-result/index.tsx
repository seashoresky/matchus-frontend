import {View} from "@tarojs/components";
import {MatchResultTopImage, CopyIcon, AnonymousImage} from "@/assets/images";
import {Button, Rate, Image} from "@taroify/core"
import {ArrowLeft, Like, LikeOutlined} from '@taroify/icons';
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {fetchMatchResult, sendSatisfiedFeedback} from "@/actions";
import Taro from "@tarojs/taro";

import './index.scss';

const Index = () => {
  const dispatch = useDispatch()
  const {match, activity} = useSelector(state => state)

  const [heartValue, setHeartValue] = useState(50)
  const [heart, setHeart] = useState(2.5)
  const [isChecked, setChecked] = useState(false)

  function onHeartChange(value) {
    setHeartValue(value * 20)
  }

  function submitHeartValue() {
    dispatch(sendSatisfiedFeedback({id: activity.id, level: heartValue}))
  }

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    if(match) {
      if(match.hasFavor) {
        setHeartValue(match.favor)
        setChecked(true)
        setHeart(match.favor / 20)
      }
    }
  }, [match])

  function fetchData() {
    dispatch(fetchMatchResult(activity.id))
  }

  async function navigateBack() {
    await Taro.navigateBack()
  }

  async function copyWechatNumber() {
    await Taro.setClipboardData({
      data: match.wechatNumber,
      success: function () {
        console.log('匹配结果界面：复制微信号成功')
      },
      fail: function () {
        console.log('匹配结果界面：复制微信号失败')
      }
    })
  }

  return (
    <View className='container'>
      <View className='custom-back' onClick={navigateBack}>
        <ArrowLeft size='24px' style={{marginRight: '8px'}}/>
        匹配结果
      </View>
      <View className='header col'>
        <Image src={MatchResultTopImage} className='top-img-success'/>
        <View className='content'>
          <View className='col male'>
            <View className='male-avatar'>
              <Image
                shape='circle'
                lazyLoad
                src={match.male.avatarUrl && match.male.avatarUrl.length ? match.male.avatarUrl : AnonymousImage}
              />
            </View>
            <View className='nickName'>{match.male.nickName}</View>
          </View>
          <View className='col female'>
            <View className='female-avatar'>
              <Image
                shape='circle'
                mode='aspectFit'
                lazyLoad
                src={match.female.avatarUrl && match.female.avatarUrl.length ? match.female.avatarUrl : AnonymousImage}
                className='avatar'
              />
            </View>
            <View className='nickName'>{match.female.nickName}</View>
          </View>
        </View>
      </View>
      <View className='wrapper'>
        <View className='content margin-bottom-16'>
          <View className='wrapper-insider'>
            <View className='divider row'>
              基本信息
              <View className='line'/>
            </View>
            <View className='basic-info'>
              <View className='item'>
                <View className='title'>姓名</View>
                <View className='answer'>{match.realName}</View>
              </View>
              <View className='item'>
                <View className='title'>年龄/年级</View>
                <View className='answer'>{match.age}</View>
              </View>
              <View className='item'>
                <View className='title'>家乡</View>
                <View className='answer'>{match.hometown}</View>
              </View>
              <View className='item'>
                <View className='title'>身高</View>
                <View className='answer'>{match.height}</View>
              </View>
              <View className='item'>
                <View className='title'>校区</View>
                <View className='answer'>{match.campus}</View>
              </View>
              <View className='item'>
                <View className='title'>学院及专业</View>
                <View className='answer'>{match.faculty} {match.major}</View>
              </View>
            </View>
            <View className='divider row'>
              个性特点
              <View className='line'/>
            </View>
            <View className='character-info'>
              {match.characteristic && match.characteristic.length ?
                match.characteristic
                  .sort((o1, o2) => {
                    return o1.index - o2.index
                  })
                  .map((item, _) => {
                    return (
                      <View className='item'>
                        <View className='title'>{item.question}</View>
                        <View className='answer'>{item.answer}</View>
                      </View>
                    )
                  })
                : <></>
              }
            </View>
            <View className='divider row'>
              联系方式
              <View className='line'/>
            </View>
            <View className='contact-info'>
              <View className='item'>
                <View className='title'>微信号</View>
                <View className='answer row'>
                  {match.wechatNumber}
                  <Image src={CopyIcon} className='icon' onClick={copyWechatNumber}/>
                </View>
              </View>
              <View className='tips purple'>
                <View>温馨提示</View>
                <View> • 主动的人会获得更好的第一印象哦~</View>
                <View> • 开放朋友圈吧，展示你的小生活</View>
                <View> • 一段真诚的自我个绍可以提起对方的兴趣，解锁更多可聊的话题哦~</View>
              </View>
            </View>
            <View className='divider row'>
              个人照片
              <View className='line'/>
            </View>
            <View className='image-info'>
              <View className='text'>记录你对Ta的第一印象，记录完成后可查看照片</View>
              <View className='first-check row'>
                <View className='col center-center' style={{width: '40px'}}>
                  <View className='heart-value'>{heartValue + "%"}</View>
                  <View className='heart-text'>心动值</View>
                </View>
                <Rate
                  className='custom-color'
                  defaultValue={heart}
                  allowHalf
                  size={25}
                  icon={<Like/>}
                  emptyIcon={<LikeOutlined/>}
                  onChange={(value) => onHeartChange(value)}
                  readonly={isChecked}
                />
                {isChecked
                  ? <Button className='check-button-clicked' disabled>已确认</Button>
                  : <Button className='check-button' onClick={() => submitHeartValue()}>确认</Button>
                }
              </View>
              <View className='image-show row'>
                {isChecked ?
                  <>
                    {match.photos.map((item, _) => {
                      return (
                        <Image
                          src={item}
                          lazyLoad
                          mode='center'
                          className='img'
                        />
                      )
                    })}
                  </>
                : <>
                    <View className='img-placeholder'>照片</View>
                    <View className='img-placeholder'>照片</View>
                    <View className='img-placeholder'>照片</View>
                  </>
                }
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  )
}

export default Index
