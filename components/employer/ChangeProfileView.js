import React from 'react';
import { View, Button, Alert, Text } from 'react-native';
import {
  TouchableOpacity,
  AsyncStorage,
  ActivityIndicator,
} from 'react-native';
import {
  StyleSheet,
  Dimensions,
  Image,
  Platform,
  ToastAndroid,
} from 'react-native';
import { TextInput } from 'react-native-paper';
import { Permissions } from 'expo';
import { ImagePicker } from 'expo';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import * as firebase from 'firebase';

const FILE_UPLOAD_URL =
  'https://api.graph.cool/file/v1/cjjxy3ttk197w0114byeqsp9e';

export default class ChangeProfileView extends React.Component {
  state = {
    companyName: '',
    photoUrl: '',
    userInfa: '',
    loading: false,
  };

  onChangePicture = value => {
    this.setState(prevState => ({
      photoUrl: value,
    }));
    console.disableYellowBox = true
  };

  handleButtonUploadImage = async () => {
    Permissions.askAsync(Permissions.CAMERA_ROLL);
    const photo = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
    });
    let formData = new FormData();
    formData.append('data', {
      uri: photo.uri,
      name: 'image.png',
      type: 'multipart/form-data',
    });

    try {
      const res = await fetch(FILE_UPLOAD_URL, {
        method: 'POST',
        body: formData,
      });
      const resJson = await res.json();
      this.onChangePicture(resJson.url);
    } catch (error) {
      Alert.alert('Неизвестная ошибка', error.message, [{ text: 'Ок' }]);
    }
  };

  componentDidMount() {
    this.readFile();
  }
  async readFile() {
    const myArray = await AsyncStorage.getItem('userInfo');
    const d = JSON.parse(myArray);
    this.setState({ userInfa: d });
  }

  onClose = () => {
    this.props.closeChangeProfileView();
  };
  user = firebase.auth().currentUser;
  onCreateProfile = () => {
    this.setState({
      loading: true,
    });
    this.state.companyName
      ? this.user
          .updateProfile({
            displayName: this.state.companyName,
            photoURL: this.state.photoUrl ? this.state.photoUrl : PHOTO_URL,
          })
          .then(async () => {
            this.setState({
              loading: false,
            });
            Platform.OS === 'android'
              ? ToastAndroid.show(
                  'Профиль изменено успешно',
                  ToastAndroid.SHORT
                ) && this.onClose()
              : Alert.alert('', 'Профиль изменено успешно', [{ text: 'Oк' }]);
            const userInfo = {
              username: this.user.displayName,
              emailVerified: this.user.emailVerified,
              photoURL: this.user.photoURL,
              userId: this.user.uid,
            };
            await AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));

          })
          .catch(function(error) {
            this.setState({
              loading: false,
            });
            alert(error.message);
          })
      : Alert.alert('', 'Имя пользователя не может быть пустой', [
          { text: 'Oк' },
        ]);
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
          <View
            style={[
              {
                height: this.state.photoUrl ? height / 1.5 : height / 2,
                alignItems: 'center',
              },
            ]}>
            <TouchableOpacity style={styles.close} onPress={this.onClose}>
              <Image source={require('./../../assets/cross-remove-sign.png')} />
            </TouchableOpacity>
            <TextInput
              underlineColorAndroid="transparent"
              style={styles.textInput}
              label="Название организации"
              autoCorrect={false}
              value={this.state.companyName}
              onChangeText={companyName => this.setState({ companyName })}
            />

            <View>
              <Button
                style={styles.chooseImageButton}
                title="Выбрать фото"
                onPress={this.handleButtonUploadImage}
              />
              {this.state.photoUrl ? (
                <Image
                  source={{ uri: this.state.photoUrl }}
                  style={styles.imageStyle}
                />
              ) : null}
            </View>

            <TouchableOpacity
              style={styles.button}
              onPress={this.onCreateProfile}>
              {this.state.loading ? (
                <ActivityIndicator size="large" color="white" />
              ) : (
                <Text style={styles.buttonText}>Поменять профиль</Text>
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
    backgroundColor: 'white',
    width: width * 0.8,
    alignItems: 'center',
  },
  button: {
    marginTop: 10,
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
  imageStyle: {
    width: width / 2.4,
    height: width / 2.4,
    marginTop: width / 33,
  },
  close: {
    marginTop: 5,
    marginLeft: width / 1.5,
  },
  chooseImageButton: {
    width: width / 2.8,
    height: width / 8,
  },
});

const PHOTO_URL =
  'https://files.graph.cool/cjjxy3ttk197w0114byeqsp9e/cjkjfa50o0xfp0184lo7cep7y';
