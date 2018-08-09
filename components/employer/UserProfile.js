import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  Dimensions,
  TextInput,
} from 'react-native';
import * as firebase from 'firebase';

export default class UserProfile extends React.Component {
  user = firebase.auth().currentUser;
  render() {
    return (
      <View>
        <View style={{ flexDirection: 'column' }}>
          <Text style={styles.constText}>Имя пользователя:</Text>
          <TextInput
            style={styles.text}
            value={this.user.displayName ? this.user.displayName : 'Неизвестно'}
            editable={false}
            multiline={true}
            underlineColorAndroid="transparent"
          />
        </View>
        <View style={{ flexDirection: 'column' }}>
          <Text style={styles.constText}>Фото пользователя:</Text>
          <Image
            style={styles.image}
            source={
              this.user.photoURL
                ? { uri: this.user.photoURL }
                : require('./../../assets/user.png')
            }
          />
        </View>
        <View style={{ flexDirection: 'column' }}>
          <Text style={styles.constText}>Электронная почта:</Text>
          <TextInput
            style={styles.text}
            value={this.user.email ? this.user.email : ''}
            editable={false}
            underlineColorAndroid="transparent"
          />
        </View>
      </View>
    );
  }
}
const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
  constText: {
    fontSize: width / 22,
    color: '#0053FF',
    width: height / 3,
  },
  text: {
    marginLeft: 10,
    fontSize: width / 21,
    color: '#1A1955',
    width: height / 2,
  },
  image: {
    marginTop: 10,
    width: width / 2,
    height: width / 2,
    marginLeft: height / 10,
  },
});
