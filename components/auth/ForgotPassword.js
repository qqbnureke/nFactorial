import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { StyleSheet, Dimensions, Alert } from 'react-native';
import { Image } from 'react-native';
import { TextInput } from 'react-native-paper';
import * as firebase from 'firebase';

export default class ForgotPassword extends React.Component {
  state = {
    email: '',
    isDisplayed: true,
  };

  onPasswordReset = () => {
    firebase
      .auth()
      .sendPasswordResetEmail(this.state.email)
      .then((user)=> {
        Alert.alert(
          'Сброс пароля',
          'Инструкции для сброса пароля отправлены на вашу почту. Проверьте пожалуйста вашу почту',
          [
            {
              text: 'Ок',
              onPress: this.onClose(),
            },
          ]
        );
      })
      .catch(function(error) {
        switch (error.code) {
          case 'auth/invalid-email':
            Alert.alert('Ошибка', 'Неверный email. Попробуйте еще раз!', [
              { text: 'Ок' },
            ]);
            break;
          case 'auth/user-not-found':
            Alert.alert('Ошибка', 'Пользователь не найдено', [{ text: 'Ок' }]);
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

  onClose = () => {
    console.log('dsdsdsd');
    this.props.onModelClosePressed();
  };

  render() {
    return (
      <View style={styles.modalInnerContainer}>
        <TouchableOpacity style={styles.close} onPress={this.onClose}>
          <Image
            style={styles.modalimage}
            source={require('./../../assets/cross-remove-sign.png')}
          />
        </TouchableOpacity>
        <Text style={styles.forgotText}>Забыли пароль?</Text>
        <TextInput
          keyboardType="email-address"
          underlineColorAndroid="transparent"
          autoCapitalize={'none'}
          style={styles.modaltextInput}
          label="Электронная почта"
          value={this.state.email}
          onChangeText={email => this.setState({ email })}
        />
        <TouchableOpacity
          style={styles.modalbutton}
          onPress={this.onPasswordReset}>
          <Text style={styles.buttonText}>Воcстановить</Text>
        </TouchableOpacity>
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
    height: height / 3,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: width / 32,
  },
  modalbutton: {
    width: width / 2,
    height: width / 7,
    backgroundColor: '#1A1955',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: width / 20,
    color: 'white',
  },
  modaltextInput: {
    width: width * 0.6,
  },
  forgotText: {
    color: '#1A1955',
    fontSize: width / 17,
  },
  close: {
    marginLeft: width / 1.5,
  },
  modalimage: {
    width: 20,
    height: 20,
  },
});
