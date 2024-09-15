import { StyleSheet } from 'react-native';

export const Styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  innerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginVertical: 120,
  },
  footerContainer: {
    flex: 1 / 3,
    alignItems: 'center',
  },
  text: {
      color: '#000',
      fontSize: 36,
      textTransform: 'uppercase',
  },
});
