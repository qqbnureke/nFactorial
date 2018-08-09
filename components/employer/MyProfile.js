import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { TouchableOpacity, Modal, Dimensions } from 'react-native';
import ActionButton from 'react-native-action-button';
import { Constants } from 'expo';
import { HeaderBackButton } from 'react-navigation';
import * as firebase from 'firebase';
import UserProfile from './UserProfile';
import ChangePasswordView from './ChangePasswordView';
import ChangeProfileView from './ChangeProfileView';

export default class MyProfile extends React.Component {
  state = {
    isDisplayed: false,
    modalView: 0,
  };
  user = firebase.auth().currentUser;
  changeModalVisibility = () => {
    this.setState({ isDisplayed: !this.state.isDisplayed });
  };

  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    let headerTitle = 'Мой профиль';
    let headerTitleStyle = { color: '#1A1955' };
    let headerStyle = styles.headerStyle;
    let headerLeft = (
      <HeaderBackButton
        tintColor="#1A1955"
        onPress={() => navigation.goBack()}
      />
    );
    return {
      headerTitle,
      headerLeft,
      headerTitleStyle,
      headerStyle,
    };
  };
  renderIcon = () => {
    return (
      <Image
        source={require('../../assets/settings.png')}
        style={styles.settingsActionButtonIcon}
      />
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <UserProfile />

        <ActionButton
          buttonColor="rgba(26,25,85,1)"
          renderIcon={this.renderIcon}>
          <ActionButton.Item
            buttonColor="#4F92FF"
            title="Профиль"
            onPress={() =>this.setState({ isDisplayed: true, modalView: 2 }) }>
            <Image
              source={require('../../assets/changeUser.png')}
              style={styles.actionButtonIcon}
            />
          </ActionButton.Item>
          <ActionButton.Item
            buttonColor="#0E2038"
            title="Пароль"
            onPress={() => this.setState({ isDisplayed: true, modalView: 1 })}>
            <Image
              source={require('../../assets/padlock.png')}
              style={styles.actionButtonIcon}
            />
          </ActionButton.Item>
        </ActionButton>

        <Modal
          visible={this.state.isDisplayed}
          animationType={'slide'}
          transparent={true}
          onRequestClose={() => this.setState({ isDisplayed: false })}>
          <View style={styles.modalContainer}>
            {this.state.modalView === 1 && (
              <ChangePasswordView
                closeChangePasswordView={this.changeModalVisibility}
              />
            )}
            {this.state.modalView === 2 && (
              <ChangeProfileView
                closeChangeProfileView={this.changeModalVisibility}
              />
            )}
          </View>
        </Modal>
      </View>
    );
  }
}
const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: height / 20,
    marginRight: 1,
  },
  headerStyle: {
    backgroundColor: 'rgb(211,211,211)',
    borderBottomColor: 'white',
  },
  modalContainer: {
    height: height,
    width: width,
    paddingTop: Constants.statusBarHeight,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonIcon: {
    width: width / 7.2,
    height: width / 7.2,
  },
  settingsActionButtonIcon: {
    width: width / 14,
    height: width / 14,
  },
});
