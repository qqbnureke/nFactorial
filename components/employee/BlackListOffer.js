import React from 'react';
import { View, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { ActivityIndicator, Dimensions, Text, Alert } from 'react-native';
import { TextInput } from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { HeaderBackButton } from 'react-navigation';

export default class BlackListOffer extends React.Component {
  userInfo = this.props.navigation.getParam('userInfo');

  state = {
    companyName: '',
    address: '',
    reason: '',
  };
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    let headerTitle = 'Черный список';
    let headerTitleStyle = { color: '#1A1955' };
    let headerLeft = (
      <HeaderBackButton
        tintColor="#1A1955"
        onPress={() => navigation.goBack()}
      />
    );
    let headerStyle = styles.headerStyle;

    return {
      headerTitle,
      headerTitleStyle,
      headerStyle,
      headerLeft,
    };
  };

  render() {
    const isEmpty =
      this.state.companyName && this.state.address && this.state.reason;
    const myProps = Platform.select({
      android: {
        extraScrollHeight: 20,
        enableOnAndroid: true,
        keyboardShouldPersistTaps: 'handled',
      },
      ios: {},
    });
    return (
      <View style={styles.container}>
        <KeyboardAwareScrollView {...myProps}>
          <View>
            <TextInput
              style={styles.inputContainerStyle}
              label="Организация"
              value={this.state.companyName}
              underlineColorAndroid="transparent"
              onChangeText={companyName => this.setState({ companyName })}
            />
            <TextInput
              multiline={true}
              style={styles.inputContainerStyle}
              label="Адрес"
              value={this.state.address}
              underlineColorAndroid="transparent"
              onChangeText={address => this.setState({ address })}
            />
            <TextInput
              multiline={true}
              style={styles.inputContainerStyle}
              label="Причина"
              underlineColorAndroid="transparent"
              value={this.state.reason}
              onChangeText={reason => this.setState({ reason })}
            />

            <Mutation mutation={CREATE_BlackLIST}>
              {(createBlackList, { data, loading, error }) => (
                <View style={styles.btnRegisterContainer}>
                  <TouchableOpacity
                    disabled={loading}
                    onPress={() => {
                      isEmpty
                        ? createBlackList({
                            variables: {
                              companyName: this.state.companyName,
                              address: this.state.address,
                              reason: this.state.reason,
                            },
                          }) &&
                          this.props.navigation.goBack() &&
                          Alert.alert('', 'Жалоба было отправлено', [
                            { text: 'Ок' },
                          ])
                        : Alert.alert('Ошибка', 'Заполните все поля', [
                            { text: 'Ок' },
                          ]);
                    }}
                    style={styles.btnRegister}>
                    {loading ? (
                      <ActivityIndicator />
                    ) : (
                      <Text style={styles.text}>Предложить</Text>
                    )}
                  </TouchableOpacity>
                </View>
              )}
            </Mutation>
          </View>
        </KeyboardAwareScrollView>
      </View>
    );
  }
}
const CREATE_BlackLIST = gql`
  mutation addBlackList(
    $address: String!,
    $companyName: String!,
    $reason: String!,
  ){
    createBlackList(
      address: $address,
      companyName: $companyName,
      reason: $reason,
    ){
      address
      companyName
      reason
    }
  }
`;
const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
  headerStyle: {
    backgroundColor: 'rgb(211,211,211)',
    borderBottomColor: 'white',
  },
  container: {
    width: width,
    height: height,
    alignItems: 'center',
  },
  text: {
    fontSize: width / 17,
    color: 'white',
    textAlign: 'center',
  },
  btnRegisterContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnRegister: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: width / 36,
    height: width / 7.2,
    width: width / 1.8,
    backgroundColor: '#1A1955',
  },
  inputContainerStyle: {
    width: (width * 3) / 4,
  },
});
