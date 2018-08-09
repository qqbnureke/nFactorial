import React from 'react';
import { Text, View, TouchableOpacity, } from 'react-native';
import {StyleSheet, Image, StatusBar,Dimensions } from 'react-native';

export default class StartPage extends React.Component {

  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    let header = null;
    return { header };
  };
  render() {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <Image
          source={require('./../../assets/logo.png')}
          style={styles.logo}
        />
        <Text style={styles.text}>TezTap</Text>
          <View>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                this.props.navigation.navigate('VacanciesList');
              }}>
              <Image
                source={require('./../../assets/man-user.png')}
                style={styles.image}
              />
              <Text style={styles.btnText}>Ищу работу</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                this.props.navigation.navigate('Login');
              }}>
              <Image
                source={require('./../../assets/man-user.png')}
                style={styles.image}
              />
              <Text style={styles.btnText}>Работодатель</Text>
            </TouchableOpacity>
          </View>
      </View>
    );
  }
}
const {width, height} = Dimensions.get('window')
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1A1955',
  },
  text: {
    fontSize: width/10,
    color: 'white',
  },
  button: {
    height: width/3.5,
    width: width*0.6,
    borderRadius: 15,
    backgroundColor: 'white',
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'column',
    marginTop: width/10,
  },
  btnText: {
    color: '#1A1955',
    fontSize: width/15,
  },
  image: {
    height: 32,
    width: 32,
  },
  logo: {
    width: width/4,
    height: width/4,
  }
});
