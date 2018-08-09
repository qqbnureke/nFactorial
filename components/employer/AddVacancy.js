import React from 'react';
import { View, StyleSheet, TouchableOpacity, AsyncStorage } from 'react-native';
import { Text, ActivityIndicator, Dimensions,Alert } from 'react-native';
import { TextInput } from 'react-native-paper';
import { HeaderBackButton } from 'react-navigation';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import * as firebase from 'firebase';
import moment from 'moment/src/moment';
import Contacts from './../utils/Contacts';

const PHOTO_URL = 'https://files.graph.cool/cjjxy3ttk197w0114byeqsp9e/cjkjfa50o0xfp0184lo7cep7y';

export default class AddVacancy extends React.Component {
  constructor(props) {
    super();
    this.state = {
      jobName: '',
      jobDescription: '',
      jobCost: 0,
      jobAddress: '',
      employerContacts: [],
      createdTime: (new Date).getTime()+'',
      isVisible: false,
      jobTime: '',
      photoURL: this.user.photoURL,
    };
  }

  user = firebase.auth().currentUser

  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    let headerTitle = 'Добавить вакансию';
    let headerTitleStyle = {color: '#1A1955'};
    let headerLeft = <HeaderBackButton tintColor="#1A1955" onPress={() => navigation.goBack()} />;
    let headerStyle = styles.headerStylee;

    return {
      headerTitle,
      headerTitleStyle,
      headerStyle,
      headerLeft,
    };
  };

  hidePicker = () => {
    this.setState({
      isVisible: false,
    });
  };

  handlePicker = datetime => {
    console.log('dsdsds',datetime)
    this.setState({
      isVisible: false,
      jobTime: moment(datetime).format('YYYY-MM-DD HH:mm'),
    });
  };

  showPicker = async () => {
    this.setState({
      isVisible: true,
    });
  };

  handleContacts = items => {
    this.setState({ employerContacts: items });
  };

  render() {
    const isEmpty =
      this.state.jobName &&
      this.state.jobDescription &&
      this.state.jobTime &&
      this.state.jobCost &&
      this.state.jobAddress &&
      this.state.employerContacts.length;

    return (
      <View style={styles.container}>
        <KeyboardAwareScrollView
          extraScrollHeight={100}
          enableOnAndroid={true}
          keyboardShouldPersistTaps="handled">
          <View>
            <View>
              <TextInput
                style={styles.inputContainerStyle}
                maxLength={20}
                label="Вакансия"
                value={this.state.jobName}
                underlineColorAndroid="transparent"
                onChangeText={jobName => this.setState({ jobName })}
              />
            </View>
            <View>
              <TextInput
                multiline={true}
                style={styles.inputContainerStyle}
                label="Описание, требования..."
                returnKeyType="go"
                value={this.state.jobDescription}
                underlineColorAndroid="transparent"
                onChangeText={jobDescription =>
                  this.setState({ jobDescription })
                }
              />
            </View>
            <View style={styles.styleTime}>
              <Text style={styles.time}>{this.state.jobTime}</Text>
              <TouchableOpacity style={styles.button} onPress={this.showPicker}>
                <Text style={styles.text}>Выбрать время</Text>
              </TouchableOpacity>
              <DateTimePicker
                isVisible={this.state.isVisible}
                onConfirm={this.handlePicker}
                onCancel={this.hidePicker}
                mode={'datetime'}
                is24hour={true}
                minimumDate = {new Date()}
                maximumDate= {new Date(timee)}
              />
            </View>

            <View>
              <TextInput
                keyboardType="numeric"
                style={styles.inputContainerStyle}
                underlineColorAndroid="transparent"
                label="Стоимость"
                maxLength={7}
                value={`${this.state.jobCost}`}
                onChangeText={jobCost => this.setState({ jobCost })}
              />
            </View>

            <View>
              <TextInput
                multiline={true}
                style={styles.inputContainerStyle}
                label="Адрес"
                underlineColorAndroid="transparent"
                value={this.state.jobAddress}
                onChangeText={jobAddress => this.setState({ jobAddress })}
              />
            </View>

            <View>
              <Contacts onAdded={this.handleContacts} />
            </View>

            <Mutation mutation={CREATE_VACANCY}>
              {(createVacancy, { data, loading, error }) => (
                <View style={styles.btnRegisterContainer}>
                  <TouchableOpacity
                    disabled={loading}
                    onPress={() => {
                      isEmpty
                        ? createVacancy({
                            variables: {
                              createdTime: this.state.createdTime,
                              jobAddress: this.state.jobAddress,
                              jobCost: parseInt(this.state.jobCost, 10),
                              jobDescription: this.state.jobDescription,
                              jobName: this.state.jobName,
                              jobNumber: this.state.employerContacts,
                              jobTime: this.state.jobTime,
                              userId: this.user.uid,
                              company: this.user.displayName,
                              photoURL: this.user.photoURL + ''
                            },
                          }) &&
                          this.props.navigation.goBack() &&
                          Alert.alert('Успешно', 'Вакансия была добавлена. Обновите список.',[{text: 'Ок'}])
                        : Alert.alert('Ошибка','Заполните все поля',[{text:'Ок'}]);
                    }}
                    style={styles.btnRegister}>
                    {loading ? (
                      <ActivityIndicator />
                    ) : (
                      <Text style={styles.text}>Зарегистрироваться</Text>
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
const CREATE_VACANCY = gql`
  mutation addVacancy(
    $createdTime: String!,
    $jobAddress: String!,
    $jobCost: Int!,
    $jobDescription: String!,
    $jobName: String!,
    $jobNumber: [String!]!,
    $jobTime: String!,
    $userId: String!,
    $company: String!,
    $photoURL: String!,
  ){
    createVacancy(
      createdTime: $createdTime,
      jobAddress: $jobAddress,
      jobCost: $jobCost,
      jobDescription: $jobDescription,
      jobName: $jobName,
      jobNumber: $jobNumber,
      jobTime: $jobTime,
      userId: $userId,
      company: $company,
      photoURL: $photoURL,
    ){
      createdTime
      jobAddress
      jobCost
      jobDescription
      jobName
      jobNumber
      jobTime
      userId
      company
      photoURL
    }
  }
`;
const {width, height} = Dimensions.get('window');
const styles = StyleSheet.create({
  headerStylee: {
    backgroundColor: 'rgb(211,211,211)',
    borderBottomColor: 'white',
  },
  container: {
    width: width,
    alignItems: 'center',
  },
  button: {
    width: width / 1.5,
    height: width / 7,
    backgroundColor: '#1A1955',
    borderRadius: width / 15,
    justifyContent: 'center',
    marginTop: 10,
  },
  text: {
    fontSize: width / 22,
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
    marginTop: 10,
    height: width/8,
    width: width*0.7,
    backgroundColor: '#1A1955',
  },
  inputContainerStyle: {
    width: (width * 3) / 4,
  },
  styleTime: {
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  time: {
    color: '#1A1955',
    fontSize: width / 20,
  },
});

const timee = new Date().getTime()+259200000;
