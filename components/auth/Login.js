import React, { Component } from 'react';
import { Text, View, StyleSheet, ActivityIndicator } from 'react-native';
import { TextInput, Image, TouchableOpacity } from 'react-native';
import { Platform, Dimensions } from 'react-native';
import { Modal, Alert, StatusBar } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Constants } from 'expo';
import * as firebase from 'firebase';
import ForgotPassword from './ForgotPassword';

export default class Login extends Component {
  state = {
    email: '',
    password: '',
    rPassword: '',
    isDisplayed: false,
    currentPage: 1,
    loading: false,
  };
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    let header = null;
    return { header };
  };

  chooseSignMethod = page => {
    this.setState({ currentPage: page });
  };

  login = e => {
    console.log('logging in');
    this.setState({
      loading: true
    });
    let arrayData = [];
    e.preventDefault();
    firebase
      .auth()
      .signInWithEmailAndPassword(this.state.email, this.state.password)
      .then(u => {
        this.setState({
          loading: false
        });
      })
      .catch(error => {
        this.setState({
          loading: false
        });
        switch (error.code) {
          case 'auth/invalid-email':
            Alert.alert('Ошибка', 'Неверный email. Попробуйте еще раз!', [
              { text: 'Ок' },
            ]);
            break;
          case 'auth/user-not-found':
            Alert.alert('Ошибка', 'Пользователь не найдено', [{ text: 'Ок' }]);
            break;
          case 'auth/wrong-password':
            Alert.alert('Ошибка', 'Неправильный пароль', [{ text: 'Ок' }]);
            break;
          case 'auth/user-disabled':
            Alert.alert('Ошибка', 'Пользователь заблокирован', [
              { text: 'Ок' },
            ]);
            break;
          default:
            Alert.alert('Неизвестная ошибка', error.message, [{ text: 'Ок' }]);
        }
      });
  };

  register = e => {
    console.log('registering in');
    this.setState({
      loading: true
    });
    e.preventDefault();
    this.state.password === this.state.rPassword
      ? firebase
          .auth()
          .createUserWithEmailAndPassword(this.state.email, this.state.password)
          .then((u)=>{
            this.setState({
              loading: false
            });
          })
          .catch(error => {
            this.setState({
              loading: false
            });
            switch (error.code) {
              case 'auth/invalid-email':
                Alert.alert('Ошибка', 'Неверный email. Попробуйте еще раз!', [
                  { text: 'Ок' },
                ]);
                break;
              case 'auth/email-already-in-use':
                Alert.alert('Ошибка', 'Пользователь уже существует', [
                  { text: 'Ок' },
                ]);
                break;
              default:
                Alert.alert('Неизвестная ошибка', error.message, [
                  { text: 'Ок' },
                ]);
            }
          })
      : Alert.alert('', 'Пароли не совпадают', [{ text: 'Ок' }]);
  };

  closeButtonForgotPassword = () => {
    this.setState({ isDisplayed: false });
  };

  gotoStartPage = () => {
    this.props.navigation.navigate('Start');
  };

  render() {
    const isEmpty = this.state.email && this.state.password;
    const myProps = Platform.select({
      android: {
        extraScrollHeight: 50,
        enableOnAndroid: true,
        keyboardShouldPersistTaps: 'handled',
      },
      ios: {},
    });
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <TouchableOpacity
          style={styles.backButton}
          onPress={this.gotoStartPage}>
          <Image
            source={require('./../../assets/left-arrow.png')}
            style={styles.imageBackButton}
          />
        </TouchableOpacity>
        <View style={styles.middleContainer}>
          <Text style={styles.textLogo}>TezTap</Text>

          <View style={styles.inputContainer}>
            <KeyboardAwareScrollView {...myProps}>
              <View style={styles.btnContainer}>
                <TouchableOpacity
                  onPress={() => this.chooseSignMethod(1)}
                  style={[
                    styles.btnLog,
                    {
                      borderRightWidth: this.state.currentPage === 1 ? 2 : 0,
                      borderBottomWidth: this.state.currentPage === 1 ? 0 : 1,
                      borderBottomColor:
                        this.state.currentPage === 1 ? '#1A1955' : '#000',
                    },
                  ]}>
                  <Text style={styles.btnText}>Логин</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => this.chooseSignMethod(2)}
                  style={[
                    styles.btnLog,
                    {
                      borderLeftWidth: this.state.currentPage === 2 ? 2 : 0,
                      borderBottomColor:
                        this.state.currentPage === 2 ? '#1A1955' : '#000',
                      borderBottomWidth: this.state.currentPage === 2 ? 0 : 1,
                    },
                  ]}>
                  <Text style={styles.btnText}>Регистрация</Text>
                </TouchableOpacity>
              </View>

              <View>
                <View style={styles.cardInput}>
                  <Image
                    style={styles.image}
                    source={require('./../../assets/man-user.png')}
                  />
                  <TextInput
                    underlineColorAndroid="transparent"
                    keyboardType="email-address"
                    style={styles.textInput}
                    autoCapitalize={'none'}
                    placeholder="Email"
                    returnKeyType="next"
                    value={this.state.email}
                    onChangeText={email => this.setState({ email })}
                  />
                </View>

                <View style={styles.cardInput}>
                  <Image
                    style={styles.image}
                    source={require('./../../assets/lock.png')}
                  />
                  <TextInput
                    underlineColorAndroid="transparent"
                    style={styles.textInput}
                    autoCapitalize={'none'}
                    secureTextEntry
                    placeholder="Password"
                    value={this.state.password}
                    returnKeyType="send"
                    onChangeText={password => this.setState({ password })}
                  />
                </View>
                {this.state.currentPage === 2 && (
                  <View style={styles.cardInput}>
                    <Image
                      style={styles.image}
                      source={require('./../../assets/lock.png')}
                    />
                    <TextInput
                      underlineColorAndroid="transparent"
                      style={styles.textInput}
                      secureTextEntry
                      placeholder="Повторите пароль"
                      value={this.state.rPassword}
                      onChangeText={rPassword => this.setState({ rPassword })}
                    />
                  </View>
                )}

                {this.state.currentPage === 1 && (
                  <View style={styles.cardLogin}>
                    <Text
                      style={styles.dopText}
                      onPress={() => {
                        this.setState({ isDisplayed: true });
                      }}>
                      Забыли пароль?
                    </Text>

                    <TouchableOpacity
                      style={styles.button}
                      onPress={this.login}>
                      {this.state.loading
                        ? <ActivityIndicator size="large" color="white"/>
                        : <Text style={styles.text}>Войти</Text> }
                    </TouchableOpacity>

                    <Text
                      style={styles.dopText}
                      onPress={() => {
                        this.setState({ currentPage: 2 });
                      }}>
                      Зарегистрироваться
                    </Text>
                  </View>
                )}
                {this.state.currentPage === 2 && (
                  <View style={styles.cardLogin}>
                    <TouchableOpacity
                      style={styles.button}
                      onPress={this.register}>
                      {this.state.loading
                        ? <ActivityIndicator size="large" color="white"/>
                        : <Text style={styles.text}>Зарегистрироваться</Text> }
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </KeyboardAwareScrollView>

            <Modal
              visible={this.state.isDisplayed}
              animationType={'slide'}
              transparent={true}
              onRequestClose={() => this.setState({ isDisplayed: false })}>
              <View
                style={styles.modalContainer}
                onPress={() => this.setState({ isDisplayed: false })}>
                <ForgotPassword
                  onModelClosePressed={this.closeButtonForgotPassword}
                />
              </View>
            </Modal>
          </View>
        </View>
      </View>
    );
  }
}

const { width, height } = Dimensions.get('window');
const COLOR = '#1A1955';
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1955',
    paddingTop: Constants.statusBarHeight,
  },
  backButton: {
    position: 'absolute',
    top: Constants.statusBarHeight + height / 30,
    left: height / 30,
  },
  imageBackButton: {
    width: 20,
    height: 20,
  },
  middleContainer: {
    marginTop: height / 8,
    alignItems: 'center',
  },
  textLogo: {
    color: 'white',
    fontSize: width / 10,
  },
  inputContainer: {
    backgroundColor: 'white',
    width: width * 0.8,
    height: height * 0.6,
    marginTop: width / 15,
    borderRadius: 20,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  btnContainer: {
    width: width * 0.8,
    flexDirection: 'row',
  },
  btnLog: {
    width: width * 0.4,
    height: width / 7,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderColor: COLOR,
  },
  btnText: {
    fontSize: width / 18,
    color: COLOR,
  },
  cardInput: {
    margin: width / 30,
    flexDirection: 'row',
    borderWidth: 1,
    padding: width / 30,
    borderRadius: width / 30,
  },
  image: {
    width: width / 15,
    height: width / 15,
  },
  textInput: {
    width: width * 0.8,
    paddingLeft: width / 35,
    fontSize: width / 22,
  },
  cardLogin: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  dopText: {
    marginLeft: width / 3,
    marginBottom: width / 32,
    fontStyle: 'italic',
    marginTop: width / 32,
  },
  button: {
    backgroundColor: COLOR,
    width: width * 0.6,
    height: width / 6.5,
    borderRadius: width / 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: 'white',
    fontSize: width / 20,
  },
  modalContainer: {
    flex: 1,
    height: height,
    width: width,
    paddingTop: Constants.statusBarHeight,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
