# RNSwipe

react native swipe

## propTypes

```jsx
RNSwipe.propTypes = {
    // props?.slot: 'Animated' 是左侧可滑动内容，其它的是右侧的
    children: PropTypes.arrayOf(PropTypes.element),
    // 是否开启状态
    opened: PropTypes.bool,
    // 1:开启 | -1：关闭 | 0：原状态(侧滑距离不够)
    swipeEnd: PropTypes.func,
    // 开启状态下的偏移的位置
    thresholdX: PropTypes.number,
    // 父容器(最外层)样式
    style: PropTypes.oneOfType([PropTypes.object, PropTypes.string, PropTypes.array]),
    // 可滑动容器的样式
    animatedStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.string, PropTypes.array]),
    // 开启后的侧边容器样式
    actionStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.string, PropTypes.array])
};
```

## use

```jsx
<RNSwipe
    opened={isOpen} 
    thresholdX={styles.thresholdXWidth} 
    swipeEnd={(status) => {
        // do something
    }}>
        <View 
            style={styles.AnimatedContainer} 
            slot={'Animated'} >
        </View>
        {isOpen && <DeleteView />}
</RNSwipe>
```
