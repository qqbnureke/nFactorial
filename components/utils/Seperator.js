import React from 'react';
import { View, StyleSheet } from 'react-native';

export default class Seperator extends React.Component {
  render() {
    return <View style={styles.container} />;
  }
}
const styles = StyleSheet.create({
  container: {
    borderBottomColor: 'grey',
    borderBottomWidth: 1,
  },
});
