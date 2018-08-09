import React from 'react';
import { FlatList, View, Text, AsyncStorage } from 'react-native';
import { StyleSheet, TouchableOpacity, Image, TextInput } from 'react-native';
import { ActivityIndicator, Dimensions, Alert } from 'react-native';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import ActionButton from 'react-native-action-button';
import * as firebase from 'firebase';
import Seperator from './../utils/Seperator';

export default class MyVacancies extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userInfa: '',
      emptyData: true,
    };
  }

  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    let headerTitle = 'Мои вакансии';
    let headerTitleStyle = { color: '#1A1955' };
    let headerStyle = styles.headerStyle;

    let headerLeft = (
      <TouchableOpacity
        style={{ backgroundColor: 'rgb(211,211,211)' }}
        onPress={() => navigation.navigate('MyProfile')}>
        <Image
          source={require('./../../assets/man-user.png')}
          style={styles.headerImageStyle}
        />
      </TouchableOpacity>
    );

    let headerRight = (
      <TouchableOpacity
        style={{ backgroundColor: 'rgb(211,211,211)' }}
        onPress={() => params.onSignout()}>
        <Image
          source={require('./../../assets/logout.png')}
          style={styles.headerImageStyle}
        />
      </TouchableOpacity>
    );

    return {
      headerTitle,
      headerTitleStyle,
      headerStyle,
      headerLeft,
      headerRight,
    };
  };

  onAdd = () => {
    this.state.userInfa.username
      ? this.props.navigation.navigate('AddVacancy')
      : Alert.alert('', 'Чтобы добавить вакансию, нужно создать профиль.', [
          { text: 'Ок' },
        ]);
  };

  userInfo = {};
  onSignout = () => {
    Alert.alert('', 'Выйти из аккаунта?', [
      { text: 'Нет', onPress: () => console.log('выход отменено') },
      {
        text: 'Да',
        onPress: () => {
          AsyncStorage.setItem('userInfo', JSON.stringify(this.userInfo));
          firebase.auth().signOut();
        },
      },
    ]);
  };

  onEditClicked = () => {
    this.props.navigation.navigate('SeeMyVacancy', { details: this.info });
  };

  componentDidMount() {
    this.props.navigation.setParams({
      onSignout: this.onSignout,
    });
    this.readFile();
  }

  async readFile() {
    const myArray = await AsyncStorage.getItem('userInfo');
    const d = JSON.parse(myArray);
    this.setState({ userInfa: d });
  }

  renderItem = ({ item }) => (
    <View style={styles.flatListStyle}>
      <TouchableOpacity
        onPress={() => {
          this.props.navigation.navigate('SeeMyVacancy', {
            userInfo: this.state.userInfa,
            vacancyInfo: item,
          });
        }}>
        <View style={styles.flatListText}>
          <Text style={styles.textConst}>{item.jobName}</Text>
        </View>
        <Text
          style={styles.flatListDescription}
          numberOfLines = {3}
          >
          {item.jobDescriptio}
        </Text>
        <Seperator />
      </TouchableOpacity>
    </View>
  );

  renderEmptyItem = () => {
    return (
      <View style={styles.emptyItemContainer}>
        <Text style={styles.emptyItemText}>Вы не предложили вакансию</Text>
        <Text style={styles.emptyItemText}>Добавьте вакансию</Text>
      </View>
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <Query query={GET_ALL_VACANCIES}>
          {({ loading, data, error, refetch }) =>
            loading ? (
              <ActivityIndicator size="large" color="blue"/>
            ) : (
              <FlatList
                onRefresh={() => refetch()}
                refreshing={data.networkStatus === 4}
                keyExtractor={item => item.id}
                extraData={this.state}
                data={
                  data
                    ? data.allVacancies.filter(
                        item => item.userId === this.state.userInfa.userId
                      )
                    : []
                }
                renderItem={this.renderItem}
                ListEmptyComponent={this.renderEmptyItem}
              />
            )
          }
        </Query>
        <ActionButton buttonColor="rgba(26,25,85,1)" onPress={this.onAdd} />
      </View>
    );
  }
}
const GET_ALL_VACANCIES = gql`
  query GetAllRecipes {
    allVacancies {
      id jobName jobNumber jobDescription
      jobCost jobAddress jobTime
      userId company
    }
  }
`;

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  headerStyle: {
    backgroundColor: 'rgb(211,211,211)',
    borderBottomColor: 'white',
  },
  headerImageStyle: {
    width: width / 12,
    height: width / 12,
    marginLeft: width / 36,
    marginRight: width / 36,
  },
  container: {
    flex: 1,
  },
  flatListStyle: {
    marginLeft: width / 19,
    marginRight: width / 19,
    marginTop: width / 50,
  },
  flatListText: {
    justifyContent: 'center',
  },
  textConst: {
    fontSize: width / 19,
    color: '#1A1955',
    margin: 2,
    fontWeight: 'bold',
  },
  flatListDescription: {
    fontSize: width / 24,
    marginLeft: 4,
    color: '#1A1955',
  },
  emptyItemContainer: {
    marginTop: height / 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: height / 10,
  },
  emptyItemText: {
    color: '#1A1955',
    fontSize: width / 22,
  },
});
