import {useEffect, useState} from "react";
import {MovableArea, MovableView, View} from "@tarojs/components";
import {Button, Image, SwipeCell} from "@taroify/core";
import {SurveySortBtn} from "@/assets/images";
import {IOptionalItem} from "@/typings/types";
import {generateAnswerString, generateViewString} from "@/utils/fcheck";
import MultiChoicePopup from "@/components/survey-info-item/multi-choice-popup";
import {QUESTION_TYPE, TOAST_SHOW_TIME} from "@/utils/constant";
import classnames from "classnames";
import Taro from "@tarojs/taro";

import './index.scss'

export interface DragSortProps {
  dragList: { question: IOptionalItem, y: number }[]
  onConfirm: any
  onConfirmOrder: any
  isChangeable: boolean
}

const DragSort = (props: DragSortProps) => {

  const [changeId, setChangeId] = useState<number>();
  const [initData, setInitData] = useState<{ question: IOptionalItem, y: number }[]>([]);
  const [dragList, setDragList] = useState<{ question: IOptionalItem, y: number }[]>([]);
  const [itemHeight, setItemHeight] = useState(60);

  const [movableY, setMovableY] = useState(0);
  const [popUpProps, setPopUpProps] = useState({
    open: false,
    answer: "",
    depends: undefined,
    limit: 0,
    option: [],
    order: 0,
    otherType: undefined,
    properAnswer: [],
    questionId: 0,
    questionIndex: 0,
    questionType: QUESTION_TYPE.MULTI_CHOICE,
    rangeAnswer: [],
    required: false,
    title: ""
  })
  const [swipeCellId, setSwipeCellId] = useState(-1)

  const initMove = () => {
    setInitData(dragList.map((item, index) => {
      if (index) {
        item.y = index * (itemHeight + 16 * 2);
      } else {
        item.y = 0
      }
      return item
    }))
  }

  useEffect(() => {
    setDragList(props.dragList)
  }, [])

  useEffect(() => {
    setDragList([...props.dragList])
  }, [props.dragList])

  useEffect(() => {
    initMove();
  }, [dragList])

  const deleteItem = (item: IOptionalItem) => {
    const newDragList = dragList.map((_item) => {
      if (_item.question.questionId === item.questionId) {
        return {
          ..._item.question,
          order: null,
          answer: null
        }
      }else if (_item.question.order > item.order) {
        return {
          ..._item.question,
          order: _item.question.order - 1
        }
      } else {
        return _item.question
      }
    })
    props.onConfirmOrder(newDragList)
  }

  return (<>
      <MovableArea
        className='movable-container'
        style={{
          height: `${(itemHeight + 16 * 2) * dragList.length}px`
        }}

      >
        {initData.map((item, index) => {
          return (<>
              <MovableView
                disabled={!props.isChangeable || item.question.questionId !== changeId}
                className={classnames('row movable-item', {'touch-movable-item': item.question.questionId === changeId})}
                onLongPress={() => {
                  setChangeId(item.question.questionId);
                }}
                onTouchEnd={() => {
                  if (props.isChangeable) {
                    const newDragList = dragList.map(_item => {
                      if (_item.question.questionId == changeId) {
                        _item.y = movableY;
                      }
                      return _item;
                    }).sort((a, b) => {
                      if (a.question.questionId === changeId) return a.y - b.y - itemHeight / 2; else if (b.question.questionId === changeId) return a.y - b.y - itemHeight / 2;
                      return a.y - b.y - itemHeight
                    }).map((_item, order) => {
                      return {..._item.question, order: order + 1}
                    })

                    if (newDragList.filter((_item, i) => _item.questionId !== dragList[i].question.questionId).length > 0) {
                      props.onConfirmOrder([...newDragList])
                    }

                    setChangeId(-1);
                    setMovableY(0);
                  }
                }}
                onChange={(e) => {
                  setMovableY(e.detail.y)
                }}
                direction='all'
                animation
                y={item.y}
                style={{
                  height: `${itemHeight + 16 * 2}px`, zIndex: item.question.questionId == changeId ? 3 : 2,
                }}

                onClick={async () => {
                  if (props.isChangeable) {
                    setPopUpProps({...item.question, open: true})
                  } else {
                    await Taro.showToast({
                      title: "您已提交本期活动问卷，暂时不可修改～", duration: TOAST_SHOW_TIME, icon: 'none'
                    })
                  }
                }}
              >
                <SwipeCell className='row swipe-cell-custom' defaultOpen='outside'
                  onOpen={() => setSwipeCellId(item.question.questionId)}
                  open={item.question.questionId === swipeCellId ? 'right' : 'outside'}
                >
                  <View className='row swipe-card' style={{padding: '16px'}}>
                    <View className='col left-card' style={{height: `${itemHeight}px`}}>
                      <View className='row title-bar'>
                        <View className='sort'>{item.question.order}</View>
                        <View className='title'>{item.question.title}</View>
                      </View>
                      <View className='answer'>{generateViewString(item.question, item.question.questionType)}</View>
                    </View>
                    <Image
                      className='col right-icon' src={SurveySortBtn}
                    />
                  </View>
                  <SwipeCell.Actions side='right'>
                    <Button variant='contained' shape='square' onClick={async () => {
                      if (props.isChangeable)
                        deleteItem(item.question)
                      else {
                        await Taro.showToast({
                          title: "您已提交本期活动问卷，暂时不可修改～", duration: TOAST_SHOW_TIME, icon: 'none'
                        })
                      }
                    }}
                    >
                      删除
                    </Button>
                  </SwipeCell.Actions>
                </SwipeCell>

              </MovableView>

            </>)
        })}
      </MovableArea>
      <MultiChoicePopup
        type={popUpProps.questionType}
        open={popUpProps.open}
        title={popUpProps.title}
        modifiable
        multiChoices={popUpProps.properAnswer}
        multiChoiceLimitRestrict={popUpProps.limit}
        rangeQuestion={popUpProps.questionType === QUESTION_TYPE.RANGE ? popUpProps : undefined}
        onConfirm={(value) => {
          if (value.choice) {
            props.onConfirm({...popUpProps, answer: generateAnswerString(value.choice, popUpProps.questionType)})
          }
          setPopUpProps({...popUpProps, open: false})
        }}
        onClose={() => setPopUpProps({...popUpProps, open: false})}
      />
    </>)
}

export default DragSort;