import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  StyleSheet, Text, Animated, Easing,
} from 'react-native'
import { Touchable } from './src'
import { noop } from './src/utils'
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
  constructor (props) {
    super(props)
    this.state = {
      translateValue: new Animated.Value(0),
      hideDistance: 9999
    }
  }

  render () {
    return (
      <Animated.View
        style={[
          styles.limit_container,
          {
            height: this.state.translateValue.interpolate({
              inputRange: [0, 1],
              outputRange: [0, this.state.hideDistance],
            })
          },
          { [this.props.position]: this.props[this.props.position] },
        ]}
      >
        <Animated.View
          style={[
            styles.container,
            {
              [this.props.position]: this.state.translateValue.interpolate({
                inputRange: [0, 1],
                outputRange: [this.state.hideDistance * -1, 0],
              }),
            },
            this.props.containerStyle
          ]}
          onLayout={(event) => {
            this.setState({ hideDistance: event.nativeEvent.layout.height })
          }}
        >
          {String(message) === message ? (
            <Text style={[styles.text_msg, this.props.messageStyle]}>
              {this.props.message}
            </Text>
          ) : (
            <>
              {this.props.message}
            </>
          )}
          {this.props.actionHandler && !!this.props.action ? (
            <Touchable onPress={this.props.actionHandler} style={[style.action_button, this.props.actionContainerStyle]}>
              {String(action) === action ? (
                <Text style={[styles.action_text, this.props.actionTextStyle]} >
                  {this.props.action.toUpperCase()}
                </Text>
              ) : (
                <>
                  {this.props.action}
                </>
              )}
            </Touchable>
          ) : null}
        </Animated.View>
      </Animated.View>
    )
  }

  componentDidMount () {
    this.state.translateValue.setValue(this.props.visible ? 1 : 0)
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.visible && !this.props.visible) {
      Animated.timing(this.state.translateValue, {
        duration: durationValues.entry,
        toValue: 1,
        easing: easingValues.entry,
      }).start()
      if (nextProps.autoHidingTime) {
        const hideFunc = this.hideSnackbar.bind(this)
        setTimeout(hideFunc, nextProps.autoHidingTime)
      }
    } else if (!nextProps.visible && this.props.visible) {
      this.hideSnackbar()
    }
  }

  componentDidUpdate (prevProps, prevState) {
    if (prevProps.visible !== this.props.visible || prevState.hideDistance !== this.state.hideDistance) {
      if (prevProps.visible) {
        this.props.distanceCallback(prevState.hideDistance + this.props.bottom)
      } else {
        this.props.distanceCallback(this.props.bottom)
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
    }).start()
  }
}

Snackbar.defaultProps = {
  actionTextStyle: { color: 'orange' },
  actionContainerStyle: {},
  messageStyle: { color: '#FFFFFF' },
  containerStyle: {},
  distanceCallback: noop,
  actionHandler: noop,
  bottom: 0,
  top: 0,
  visible: false,
  position: 'bottom',
  action: '',
  message: '',
  autoHidingTime: 0, // Default value will not auto hide the snack bar as the old version.
}

Snackbar.propTypes = {
  actionTextStyle: PropTypes.object,
  actionContainerStyle: PropTypes.object,
  messageStyle: PropTypes.object,
  containerStyle: PropTypes.object,
  distanceCallback: PropTypes.func,
  actionHandler: PropTypes.func,
  bottom: PropTypes.number,
  top: PropTypes.number,
  visible: PropTypes.bool,
  action: PropTypes.oneOfType([ PropTypes.string, PropTypes.element ]).isRequired,
  message: PropTypes.oneOfType([ PropTypes.string, PropTypes.element ]).isRequired,
  position: PropTypes.oneOf(['bottom', 'top']), // bottom (default), top
  autoHidingTime: PropTypes.number, // How long (in milliseconds) the snack bar will be hidden.
}

const styles = StyleSheet.create({
  limit_container: {
    position: 'absolute',
    overflow: 'hidden',
    left: 0,
    right: 0,
    zIndex: 9999,
  },
  container: {
    backgroundColor: '#484848',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'absolute'
  },
  text_msg: {
    fontSize: 14,
    flex: 1,
    paddingLeft: 20,
    paddingVertical: 14
  },
  action_text: {
    alignSelf: 'center',
    fontSize: 14,
    fontWeight: '600',
    paddingRight: 20,
    paddingVertical: 14
  },
  action_button: {
    padding: 4
  }
})

export default Snackbar
