import { StyleSheet } from 'react-native'

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
    position: 'absolute',
  },
  text_msg: {
    fontSize: 14,
    flex: 1,
    paddingLeft: 20,
    paddingVertical: 14,
  },
  action_text: {
    alignSelf: 'center',
    fontSize: 14,
    fontWeight: '600',
    paddingRight: 20,
    paddingVertical: 14,
  },
  action_button: {
    padding: 4,
  },
})

export default styles
