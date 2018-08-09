import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Dimensions, Image, Alert, ToastAndroid, Platform } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { TextInput } from 'react-native-paper';
import * as firebase from 'firebase';

export default class ChangePasswordView extends React.Component {
  state = {
    currentPassword: '',
    newPassword: '',
    repeatNewPassword: '',
    loading: false,
  };

  reauthenticate = currentPassword => {
    const user = firebase.auth().currentUser;
    const cred = firebase.auth.EmailAuthProvider.credential(
      user.email,
      currentPassword
    );
    return user.reauthenticateAndRetrieveDataWithCredential(cred);
  };

  onChangePasswordPress = () => {
    this.setState({
      loading: true,
    });
    this.state.currentPassword !== this.state.newPassword
      ? this.state.newPassword === this.state.repeatNewPassword
        ? this.reauthenticate(this.state.currentPassword)
            .then(() => {
              const user = firebase.auth().currentUser;
              user
                .updatePassword(this.state.newPassword)
                .then(() => {
                  this.setState({
                    loading: false,
                  });
                  Platform.OS === 'android'
                    ? ToastAndroid.show(
                        'Пароль изменено успешно',
                        ToastAndroid.SHORT
                      ) && this.onClose()
                    : Alert.alert('', 'Пароль изменено успешно', [
                        { text: 'Oк' },
                      ]);
                })
                .catch(error => {
                  this.setState({
                    loading: false,
                  });
                  switch (error.code) {
                    case 'auth/weak-password':
                      Alert.alert(
                        'Ошибка',
                        'Пароль должен состоять минимум из 6 символов',
                        [{ text: 'Ок' }]
                      );
                      break;
                    default:
                      Alert.alert('Неизвестная ошибка', error.message, [
                        { text: 'Ок' },
                      ]);
                  }
                });
            })
            .catch(error => {
              switch (error.code) {
                case 'auth/wrong-password':
                  Alert.alert('Ошибка', 'Неправильный текущий пароль', [
                    { text: 'Ок' },
                  ]);
                  break;
                default:
                  Alert.alert('Неизвестная ошибка', error.message, [
                    { text: 'Ок' },
                  ]);
              }
            })
        : Alert.alert('Ошибка', 'Пароли не совпадают', [{ text: 'Ок' }])
      : Alert.alert(
          'Ошибка',
          'Текущий пароль и новый пароль не может быть одинаковыми',
          [{ text: 'Ок' }]
        );
  };

  onClose = () => {
    this.props.closeChangePasswordView();
  };

  render() {
    const myProps = Platform.select({
      android: {
        extraScrollHeight: 20,
        enableOnAndroid: true,
        keyboardShouldPersistTaps: 'handled',
      },
      ios: {},
    });
    return (
      <View style={styles.modalInnerContainer}>
        <KeyboardAwareScrollView {...myProps}>
          <View style={{ alignItems: 'center' }}>
            <TouchableOpacity style={styles.close} onPress={this.onClose}>
              <Image source={require('./../../assets/cross-remove-sign.png')} />
            </TouchableOpacity>
            <TextInput
              secureTextEntry={true}
              underlineColorAndroid="transparent"
              style={styles.textInput}
              label="Старый пароль"
              autoCapitalize="none"
              value={this.state.currentPassword}
              onChangeText={currentPassword =>
                this.setState({ currentPassword })
              }
            />
            <TextInput
              secureTextEntry={true}
              underlineColorAndroid="transparent"
              style={styles.textInput}
              label="Новый пароль"
              autoCapitalize="none"
              value={this.state.newPassword}
              onChangeText={newPassword => this.setState({ newPassword })}
            />
            <TextInput
              secureTextEntry={true}
              underlineColorAndroid="transparent"
              style={styles.textInput}
              label="Повторите пароль"
              autoCapitalize="none"
              value={this.state.repeatNewPassword}
              onChangeText={repeatNewPassword =>
                this.setState({ repeatNewPassword })
              }
            />
            <TouchableOpacity
              style={styles.button}
              onPress={this.onChangePasswordPress}>
              {this.state.loading ? (
                <ActivityIndicator size="large" color="white" />
              ) : (
                <Text style={styles.buttonText}>Поменять пароль</Text>
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAwareScrollView>
      </View>
    );
  }
}
const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
  modalInnerContainer: {
    flexDirection: 'column',
    backgroundColor: 'white',
    width: width * 0.8,
    alignItems: 'center',
    borderRadius: 10,
  },
  button: {
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 10,
    width: width / 2,
    height: width / 8,
    backgroundColor: '#1A1955',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: width / 20,
    color: 'white',
  },
  textInput: {
    width: width * 0.6,
  },
  close: {
    marginLeft: width / 1.5,
    marginTop: 10,
  },
});
