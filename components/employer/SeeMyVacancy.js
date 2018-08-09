import React from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { HeaderBackButton } from 'react-navigation';
import { Alert, Dimensions } from 'react-native';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

export default class SeeMyVacancy extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    let headerTitle = navigation.getParam('vacancyInfo').jobName;
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
    const vacancyInfo = this.props.navigation.getParam('vacancyInfo');
    const userInfo = this.props.navigation.getParam('userInfo');
    const contacts = vacancyInfo.jobNumber.map((value, key) => {
      return (
        <Text key={key} style={styles.textDescrption}>
          {value}
        </Text>
      );
    });
    const alertMessage = 'Удалить вакансию ' + vacancyInfo.jobName + '?';
    return (
      <View style={styles.container}>
        <View>
          <View style={styles.images}>
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.navigate('EditVacancy', {
                  vacancy: vacancyInfo,
                });
              }}>
              <Image
                source={require('./../../assets/edit.png')}
                style={styles.headerImageStyle}
              />
            </TouchableOpacity>

            <Mutation mutation={DELETE_VACANCY}>
              {(deleteVacancy, { data, loading, error }) => (
                <TouchableOpacity
                  disabled={loading}
                  onPress={() => {
                    Alert.alert('', alertMessage, [
                      { text: 'Нет', onPress: () => console.log('отмена') },
                      {
                        text: 'Да',
                        onPress: () => {
                          deleteVacancy({
                            variables: {
                              id: vacancyInfo.id,
                            },
                          }) &&
                            this.props.navigation.navigate('MyVacancies') &&
                            Alert.alert(
                              'Успешно',
                              'Вакансия была удалена. Обновите список.',
                              [{ text: 'Ок' }]
                            );
                        },
                      },
                    ]);
                  }}>
                  {loading ? (
                    <ActivityIndicator />
                  ) : (
                    <Image
                      source={require('./../../assets/delete.png')}
                      style={styles.headerImageStyle}
                    />
                  )}
                </TouchableOpacity>
              )}
            </Mutation>
          </View>
          <Text style={styles.textDescription}>
            {vacancyInfo.jobDescription}
          </Text>

          <View style={styles.infoContainer}>
            <View style={styles.infoDetail}>
              <Text style={styles.infoDetailText}>Компания: </Text>
              <Text style={styles.textDescrption}>{vacancyInfo.company}</Text>
            </View>
            <View style={styles.infoDetail}>
              <Text style={styles.infoDetailText}>Адрес: </Text>
              <Text style={styles.textDescrption}>
                {vacancyInfo.jobAddress}
              </Text>
            </View>
            <View style={styles.infoDetail}>
              <Text style={styles.infoDetailText}>Оплата: </Text>
              <Text style={styles.textDescrption}>{vacancyInfo.jobCost}</Text>
            </View>
            <View style={styles.infoDetail}>
              <Text style={styles.infoDetailText}>Время: </Text>
              <Text style={styles.textDescrption}>{vacancyInfo.jobTime}</Text>
            </View>
            <View style={styles.infoDetail}>
              <Text style={styles.infoDetailText}>Контакты: </Text>
              <View style={styles.contactsStyle}>{contacts}</View>
            </View>
          </View>
        </View>
      </View>
    );
  }
}
const DELETE_VACANCY = gql`
mutation deleteOfVacancy($id: ID!) {
 deleteVacancy(id: $id){id}
}`;

const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
  headerStyle: {
    backgroundColor: '#D3D3D3',
    borderBottomColor: 'white',
  },
  container: {
    width: width,
    height: height,
    padding: width / 15,
  },
  textDescription: {
    fontSize: width / 22,
    color: '#1A1955',
  },
  textDescrption: {
    fontSize: width / 22,
    color: '#1A1955',
    width: width / 2,
  },
  infoContainer: {
    flexDirection: 'column',
    width: width * 0.8,
    marginTop: height / 15,
  },
  infoDetail: {
    flexDirection: 'row',
    width: width * 0.8,
  },
  infoDetailText: {
    fontSize: width / 23,
    color: '#0053FF',
    width: width / 4,
  },
  contactsStyle: {
    flexDirection: 'column',
  },
  images: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerImageStyle: {
    width: width / 8,
    height: width / 8,
    margin: width / 36,
  },
});
