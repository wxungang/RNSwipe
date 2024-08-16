import PropTypes from 'prop-types';
import React, { useRef, useMemo, useEffect } from 'react';
import { Animated, PanResponder, View } from 'react-native';

export const SwipeStatus = {
    open: 1,
    close: -1,
    hold: 0
};

// 侧滑组件：1、右=>左
const RNSwipe = ({
    children,
    opened = false,
    swipeEnd = (e) => e,
    thresholdX = 86,
    style,
    animatedStyle,
    actionStyle
}) => {
    // 如果需要 2d 方向动画,使用 Animated.ValueXY
    const pan = useRef(new Animated.Value(0)).current;

    const panResponder = useMemo(
        () =>
            PanResponder.create({
                // onStartShouldSetPanResponderCapture: () => true,
                onStartShouldSetPanResponder: () => true,
                // onMoveShouldSetPanResponderCapture: () => true,
                onMoveShouldSetPanResponder: (event, gestureState) => {
                    //当垂直滑动的距离<10 水平滑动的距离>10的时候才让捕获事件
                    return Math.abs(gestureState.dy) < 10 && Math.abs(gestureState.dx) > 10;
                },
                onPanResponderMove: (event, gestureState) => {
                    if (!opened && gestureState.dx >= 0) {
                        // 非开启状态，右滑时
                        return;
                    }

                    pan.setValue((opened ? -thresholdX : 0) + gestureState.dx);
                },
                onPanResponderTerminate: (event, gestureState) => {
                    // 触摸事件被中断时
                    _handlePanResponderEnd(event, gestureState);
                },
                onPanResponderRelease: (event, gestureState) => {
                    // 触摸事件结束时
                    _handlePanResponderEnd(event, gestureState);
                }
            }),
        [opened]
    );

    const _handlePanResponderEnd = (event, gestureState) => {
        if (opened) {
            if (gestureState.dx > 0) {
                _animateTo();
                // 关闭
                swipeEnd(SwipeStatus.close);
            } else {
                // 开启继续侧滑，还是开启状态
                _animateTo(-thresholdX);
                swipeEnd(SwipeStatus.hold);
            }
        } else {
            if (gestureState.dx >= 0) {
                // 关闭状态，右滑时
                return;
            }

            if (gestureState.dx < -(thresholdX / 3)) {
                _animateTo(-thresholdX);
                // 开启
                swipeEnd(SwipeStatus.open);
            } else {
                // 滑动位置不够，还是关闭状态
                _animateTo();
                swipeEnd(SwipeStatus.hold);
            }
        }
    };

    const _animateTo = (toValue = 0) => {
        Animated.spring(pan, {
            toValue
        }).start();
    };

    useEffect(() => {
        if (opened) {
            // 初始化时开启
            _animateTo(-thresholdX);
        }
    }, []);

    useEffect(() => {
        if (!opened) {
            // 只能开启一个时
            _animateTo();
        }
    }, [opened]);

    return (
        <View style={[{ position: 'relative', flexDirection: 'row' }, style]}>
            <Animated.View
                {...panResponder.panHandlers}
                style={[
                    {
                        transform: [{ translateX: pan }],
                        flex: 1,
                        zIndex: 10
                    },
                    animatedStyle
                ]}
            >
                {React.Children.map(children, (item) => item?.props?.slot === 'Animated' && item)}
            </Animated.View>
            {opened && (
                <View
                    style={[
                        {
                            flexDirection: 'row-reverse',
                            overflow: 'hidden',
                            position: 'absolute',
                            right: 0,
                            top: 0,
                            bottom: 0,
                            left: 0
                        },
                        actionStyle
                    ]}
                >
                    {React.Children.map(children, (item) => item?.props?.slot !== 'Animated' && item)}
                </View>
            )}
        </View>
    );
};

RNSwipe.propTypes = {
    // props?.slot: 'Animated' 是左侧可滑动内容，其它的是右侧的
    children: PropTypes.arrayOf(PropTypes.element),
    // 是否开启状态
    opened: PropTypes.bool,
    // 1:开启 | -1：关闭 | 0：原状态(侧滑距离不够)
    swipeEnd: PropTypes.func,
    // 开启状态下的位置
    thresholdX: PropTypes.number,
    // 父容器(最外层)样式
    style: PropTypes.oneOfType([PropTypes.object, PropTypes.string, PropTypes.array]),
    // 可滑动容器的样式
    animatedStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.string, PropTypes.array]),
    // 开启后的侧边容器样式
    actionStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.string, PropTypes.array])
};

export default RNSwipe;
