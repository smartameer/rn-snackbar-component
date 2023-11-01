import React, { Component, Fragment } from 'react'
import { Text, Animated, Easing } from 'react-native'

import Tap from './components/Tap'
import styles from './common/style'
import { SnackbarProps, SnackbarDefaultProps } from './common/properties'

/*
 * Values are from https://material.io/guidelines/motion/duration-easing.html#duration-easing-dynamic-durations
 */
const easingValues = {
  entry: Easing.bezier(0.0, 0.0, 0.2, 1),
  exit: Easing.bezier(0.4, 0.0, 1, 1),
}

const durationValues = {
  entry: 225,
  exit: 195,
}

class Snackbar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      translateValue: new Animated.Value(0),
      hideDistance: 9999,
    }
  }

  handleLayoutChange(event) {
    this.setState({ hideDistance: event.nativeEvent.layout.height })
  }


  componentDidMount() {
    this.state.translateValue.setValue(this.props.visible ? 1 : 0)
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps(nextProps) {
    const { visible, native } = this.props

    if (nextProps.visible && !visible) {
      Animated.timing(this.state.translateValue, {
        duration: durationValues.entry,
        toValue: 1,
        easing: easingValues.entry,
        useNativeDriver: native,
      }).start()
      if (nextProps.autoHidingTime) {
        const hideFunc = this.hideSnackbar.bind(this)
        setTimeout(hideFunc, nextProps.autoHidingTime)
      }
    } else if (!nextProps.visible && visible) {
      this.hideSnackbar()
    }
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillUpdate(nextProps, nextState) {
    const { visible, distanceCallback, bottom } = this.props

    if (nextProps.visible !== visible
      || nextState.hideDistance !== this.state.hideDistance) {
      if (nextProps.visible) {
        distanceCallback(nextState.hideDistance + bottom)
      } else {
        distanceCallback(bottom)
      }
    }
  }

  /**
   * Starting te animation to hide the snack bar.
   * @return {null} No return.
  */
  hideSnackbar() {
    Animated.timing(this.state.translateValue, {
      duration: durationValues.exit,
      toValue: 0,
      easing: easingValues.exit,
      useNativeDriver: this.props.native,
    }).start()
  }

  render() {
    const {
      position, message, messageStyle, containerStyle,
      action, actionHandler, actionContainerStyle,
      actionTextStyle,
    } = this.props

    return (
      <Animated.View
        style={[
          styles.limit_container,
          {
            height: this.state.translateValue.interpolate({
              inputRange: [0, 1],
              outputRange: [0, this.state.hideDistance],
            }),
          },
          { [position]: this.props[position] },
        ]}
      >
        <Animated.View
          style={[
            styles.container,
            {
              [position]: this.state.translateValue.interpolate({
                inputRange: [0, 1],
                outputRange: [this.state.hideDistance * -1, 0],
              }),
            },
            containerStyle,
          ]}
          onLayout={this.handleLayoutChange}
        >
          {String(message) === message ? (
            <Text style={[styles.text_msg, messageStyle]}>
              {message}
            </Text>
          ) : (
            <Fragment>
              {message}
            </Fragment>
          )}
          {actionHandler && !!action ? (
            <Tap
              onPress={actionHandler}
              style={[styles.action_button, actionContainerStyle]}
            >
              {String(action) === action ? (
                <Text style={[styles.action_text, actionTextStyle]}>
                  {action.toUpperCase()}
                </Text>
              ) : (
                <Fragment>
                  {action}
                </Fragment>
              )}
            </Tap>
          ) : null}
        </Animated.View>
      </Animated.View>
    )
  }
}

Snackbar.defaultProps = SnackbarDefaultProps
Snackbar.propTypes = SnackbarProps

export default Snackbar
