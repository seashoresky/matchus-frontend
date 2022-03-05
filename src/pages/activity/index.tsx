import {View} from "@tarojs/components";
import Taro, {useDidShow} from "@tarojs/taro";
import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";

import './index.scss'
import {saveGlobal} from "../../actions";
import {IdentificationModal, LoginModal} from "../../components";
import Activity from "./activity";

const Index = () => {
  const dispatch = useDispatch();
  const { global, user } = useSelector((state) => state);
  const { showLoginModal, showIdentifyModal } = global;
  const { identified } = user;

  useDidShow(() => {
    const { nickName, identified } = user;
    console.log(user)
    if (!nickName) {
      dispatch(saveGlobal({showLoginModal: true}));
      return;
    }
    if (identified !== 1) {
      dispatch(saveGlobal({showIdentifyModal: true}));
      return;
    }
  })

  useEffect(() => {

  })

  return (
    <View className='container'>
      <LoginModal opened={showLoginModal} />
      <IdentificationModal opened={showIdentifyModal} />
      {
        identified === 1 ? (
          <Activity />
        ) : (
          <View>
            Default
          </View>
        )
      }
    </View>
  )
}

export default Index
