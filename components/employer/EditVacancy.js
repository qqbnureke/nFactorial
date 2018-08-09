import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Text, Platform } from 'react-native';
import { TextInput } from 'react-native-paper';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { HeaderBackButton } from 'react-navigation';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import DateTimePicker from 'react-native-modal-datetime-picker';
import moment from 'moment/src/moment';

export default class EditVacancy extends React.Component {
  vacancyInfo = this.props.navigation.getParam('vacancy');
  state = {
    eJobTitle: this.vacancyInfo.jobName,
    eJobDescription: this.vacancyInfo.jobDescription,
    eJobAddress: this.vacancyInfo.jobAddress,
    eJobCost: this.vacancyInfo.jobCost,
    eJobTime: this.vacancyInfo.jobTime,
    ejobContact: this.vacancyInfo.jobNumber,
    isVisible: false,
  };

  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    let headerTitle = 'Редактировать';
    let headerTitleStyle = { color: '#1A1955' };
    let headerLeft = (
      <HeaderBackButton
        tintColor="#1A1955"
        onPress={() => navigation.goBack()}
      />
    );
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
    this.setState({
      isVisible: false,
      eJobTime: moment(datetime).format('YYYY-MM-DD HH:mm'),
    });
  };

  showPicker = () => {
    this.setState({
      isVisible: true,
    });
  };

  render() {
    const myProps = Platform.select({
      android: {
        extraScrollHeight: 100,
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
              label="Вакансия"
              maxLength={20}
              underlineColorAndroid="transparent"
              style={styles.textDescrption}
              value={this.state.eJobTitle}
              onChangeText={eJobTitle => this.setState({ eJobTitle })}
            />
            <TextInput
              multiline={true}
              label="Описание, требования..."
              underlineColorAndroid="transparent"
              style={styles.textDescrption}
              value={this.state.eJobDescription}
              onChangeText={eJobDescription =>
                this.setState({ eJobDescription })
              }
            />
            <View style={styles.styleTime}>
              <Text style={styles.time}>{this.state.eJobTime}</Text>
              <TouchableOpacity style={styles.button} onPress={this.showPicker}>
                <Text style={styles.text}>Выбрать время</Text>
              </TouchableOpacity>
              <DateTimePicker
                isVisible={this.state.isVisible}
                onConfirm={this.handlePicker}
                onCancel={this.hidePicker}
                mode={'datetime'}
                is24hour={true}
              />
            </View>

            <TextInput
              multiline={true}
              underlineColorAndroid="transparent"
              style={styles.textDescrption}
              value={`${this.state.eJobCost}`}
              keyboardType="numeric"
              label="Стоимость"
              onChangeText={eJobCost => this.setState({ eJobCost })}
            />

            <TextInput
              multiline={true}
              underlineColorAndroid="transparent"
              style={styles.textDescrption}
              value={this.state.eJobAddress}
              label="Адрес"
              onChangeText={eJobAddress => this.setState({ eJobAddress })}
            />

            <Mutation mutation={UPDATE_VACANCY}>
              {(updateVacancy, { data, loading, error }) => (
                <View style={styles.btnContainer}>
                  <TouchableOpacity
                    style={styles.button}
                    disabled={loading}
                    onPress={() => {
                      updateVacancy({
                        variables: {
                          id: this.vacancyInfo.id,
                          jobName: this.state.eJobTitle,
                          jobDescription: this.state.eJobDescription,
                          jobCost: parseInt(this.state.eJobCost, 10),
                          jobTime: this.state.eJobTime,
                          jobAddress: this.state.eJobAddress,
                        },
                      }) &&
                        this.props.navigation.navigate('MyVacancies') &&
                        Alert.alert('Успешно', 'Отредактировано', [
                          { text: 'Ок' },
                        ]);
                    }}>
                    {loading ? (
                      <ActivityIndicator />
                    ) : (
                      <Text style={styles.text}>Сохранить</Text>
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
const UPDATE_VACANCY = gql`
  mutation vacancyUpdate(
    $id:ID!,
    $jobName: String!,
    $jobDescription:String!
    $jobCost: Int!,
    $jobTime: String!,
    $jobAddress: String!,
    ){
    updateVacancy(
      id:$id,
      jobName: $jobName,
      jobDescription:$jobDescription,
      jobCost: $jobCost,
      jobTime: $jobTime,
      jobAddress: $jobAddress,
    ){
      id
      jobName
      jobDescription
      jobCost
      jobTime
      jobAddress
    }
  }
`;

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  headerStylee: {
    backgroundColor: '#D3D3D3',
    borderBottomColor: 'white',
  },
  container: {
    flex: 1,
    alignItems: 'center',
  },
  textDescrption: {
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
  btnContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
