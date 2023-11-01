import { ViewPropTypes } from 'deprecated-react-native-prop-types'
import PropTypes from 'prop-types'

import { noop } from '../utils'


export const SnackbarProps = {
  actionTextStyle: PropTypes.object,
  actionContainerStyle: PropTypes.object,
  messageStyle: PropTypes.object,
  containerStyle: PropTypes.object,
  distanceCallback: PropTypes.func,
  actionHandler: PropTypes.func,
  bottom: PropTypes.number,
  // eslint-disable-next-line
  top: PropTypes.number,
  visible: PropTypes.bool,
  action: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  message: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  position: PropTypes.oneOf(['bottom', 'top']), // bottom (default), top
  autoHidingTime: PropTypes.number, // How long (in milliseconds) the snack bar will be hidden.
  native: PropTypes.bool,
}

export const SnackbarDefaultProps = {
  actionTextStyle: { color: 'orange' },
  actionContainerStyle: {},
  messageStyle: { color: '#FFFFFF' },
  containerStyle: {},
  distanceCallback: noop,
  actionHandler: noop,
  bottom: 0,
  // eslint-disable-next-line
  top: 0,
  visible: false,
  position: 'bottom',
  action: '',
  message: '',
  autoHidingTime: 0, // Default value will not auto hide the snack bar as the old version.
  native: true,
}

export const TapProps = {
  onPress: PropTypes.func,
  style: ViewPropTypes.style,
  children: PropTypes.node.isRequired,
}

export const TapDefaultProps = {
  onPress: noop,
  style: {},
}
