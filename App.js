import React from 'react';
import {AsyncStorage, Alert, NetInfo, View, Modal}from 'react-native';
import {Text, Dimensions,BackHandler} from 'react-native';
import { createStackNavigator } from 'react-navigation';
import firebase from 'firebase';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';
import StartPage from './components/utils/StartPage';
import MyVacancies from './components/employer/MyVacancies';
import Login from './components/auth/Login';
import VacanciesList from './components/employee/VacanciesList';
import VacancyDescription from './components/employee/VacancyDescription'
import BlackList from './components/employee/BlackList';
import BlackListOffer from './components/employee/BlackListOffer';
import MyProfile from './components/employer/MyProfile';
import AddVacancy from './components/employer/AddVacancy';
import EditVacancy from './components/employer/EditVacancy';
import SeeMyVacancy from './components/employer/SeeMyVacancy'

const config = {
    apiKey: "AIzaSyDthHjFjcUjjnYBW7RKeagZy2spJCt6eZE",
    authDomain: "reactproject-2f25c.firebaseapp.com",
    databaseURL: "https://reactproject-2f25c.firebaseio.com",
    projectId: "reactproject-2f25c",
    storageBucket: "reactproject-2f25c.appspot.com",
    messagingSenderId: "145815445289"
  };
  !firebase.apps.length ? firebase.initializeApp(config) : firebase.app();
const client = new ApolloClient({
  uri: 'https://api.graph.cool/simple/v1/cjjxy3ttk197w0114byeqsp9e',
});

const screens =   {
    VacanciesList: VacanciesList,
    VacancyDescription:VacancyDescription,
    Start: StartPage,
    Login: Login,
    MyVacancies: MyVacancies,
    MyProfile: MyProfile,
    AddVacancy: AddVacancy,
    EditVacancy:EditVacancy,
    BlackList: BlackList,
    BlackListOffer: BlackListOffer,
    SeeMyVacancy: SeeMyVacancy,

  }
const AppStackNavigator = createStackNavigator(
  screens,
  {initialRouteName: 'MyVacancies'}
);
const StartNavigator = createStackNavigator(
  screens,
  {initialRouteName: 'Start'}
);
console.disableYellowBox = true

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      netAlert: false,
      lol: true,
    }
    NetInfo.isConnected.addEventListener('connectionChange', (res) => {
      if(res===false){
        this.setState({netAlert: true})
      }else{
        this.setState({netAlert: false})
      }
    })
  }

  handleBackButtonClick() {
    this.props.navigation.goBack(null);
    return true;
  }

  onBackButtonPressAndroid = () => {
    if (this.state.lol) {
      return true;
    } else {
      return false;
    }
  }

  componentDidMount() {
    this.authListener();
  }

  authListener() {
    firebase.auth().onAuthStateChanged(async user => {
      if (user) {
        if (!user.emailVerified) {
          user.sendEmailVerification()
          console.log('verification email sent')
        }

        const userInfo = {
          username: user.displayName,
          emailVerified: user.emailVerified,
          photoURL: user.photoURL,
          userId: user.uid
        }
        await AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
      }

      this.setState({ user: user || null });
    })
  }

  render() {
    const { netAlert } = this.state;

    if (netAlert) {
      return <Modal
              animationType="slide"
              transparent={true}
              visible={this.state.netAlert}
              onRequestClose={() => console.log('nothing')}
            >
              <View style={styles.modalContainer}>
                  <Text style={styles.modalText}>Интернет не подключен. Проверьте ваше соединение</Text>
              </View>
            </Modal>
    }

    return (
      <ApolloProvider client={client}>

            {this.state.user ? <AppStackNavigator /> : <StartNavigator />}
      </ApolloProvider>
    )
  }
}

const {width, height} = Dimensions.get('window')
const styles = {
  modalContainer: {
    width: width,
    height: height,
    backgroundColor: 'rgba(0,0,0,0.8)',
    flex:1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  modalText:{
    fontSize: width/10,
    color: 'white',
    padding: width/40
  },
}
