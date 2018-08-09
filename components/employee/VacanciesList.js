import React from 'react';
import { Text, View, StyleSheet, Modal, StatusBar } from 'react-native';
import { Image, TouchableOpacity } from 'react-native';
import { Dimensions, FlatList, ActivityIndicator } from 'react-native';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { SearchBar, ListItem, Avatar } from 'react-native-elements';
import Seperator from './../utils/Seperator';

export default class VacanciesList extends React.Component {
  state = {
    keyword: '',
    isDisplayed: false,
  };
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    let headerTitle = 'Все вакансии';
    let headerTitleStyle = { color: '#1A1955' };
    let headerTintColor = '#1A1955';
    let headerStyle = { backgroundColor: '#D3D3D3' };
    let headerRight = (
      <TouchableOpacity onPress={() => params.onBlackList()}>
        <Image
          source={require('./../../assets/expand-button.png')}
          style={styles.image}
        />
      </TouchableOpacity>
    );
    return {
      headerTitle,
      headerTitleStyle,
      headerStyle,
      headerTintColor,
      headerRight,
    };
  };

  openListBlackList = () => {
    this.props.navigation.navigate('BlackList');
    this.setState({ isDisplayed: false });
  };

  onBlackList = () => {
    this.setState({
      isDisplayed: !this.state.isDisplayed,
    });
  };

  componentDidMount() {
    this.props.navigation.setParams({
      onBlackList: this.onBlackList,
    });
  }

  renderItem = ({ item }) => {
    return (
      <View style={styles.flatListStyle}>
        <TouchableOpacity
          onPress={() => {
            this.props.navigation.navigate('VacancyDescription', {
              details: item,
            });
          }}>
          <ListItem
            roundAvatar
            avatar={<Avatar rounded medium source={{ uri: item.photoURL }} />}
            title={
              <Text style={{ fontSize: width / 20, marginLeft: 10 }}>
                {item.jobName}
              </Text>
            }
            subtitle={
              <Text style={{ fontSize: width / 25, marginLeft: 10 }}>
                {item.company}
              </Text>
            }
          />
          <Seperator />
        </TouchableOpacity>
      </View>
    );
  };

  renderEmptyItem = () => {
    return (
      <Text style={{ fontSize: width / 18, textAlign: 'center' }}>
        Нет вакансии. Обновляйте часто чтобы не пропустить
      </Text>
    );
  };

  renderHeader = () => {
    return (
      <SearchBar
        placeholder="Поиск..."
        lightTheme
        round
        onChangeText={this.handleSearch}
        onClear={() => this.setState({ keyword: '' })}
        clearIcon={{ width: width / 18, height: width / 18, size: 30 }}
        showLoading={true}
        inputStyle={{ fontSize: width / 24, color: '#1A1955' }}
      />
    );
  };

  handleSearch = text => {
    console.log(parseInt(timee.substring(5)))
    this.setState({ keyword: text.toLowerCase() });
  };

  onGoBlackListOffer = () => {
    this.setState({ isDisplayed: false });
    this.props.navigation.navigate('BlackListOffer');
  };

  render() {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <Query query={GET_ALL_VACANCIES}>
          {({ loading, data, error, refetch }) =>
            loading ? (
              error ? alert(error.message)
              :
              <ActivityIndicator />
            ) : (
              data ?
              <FlatList
                refreshing={data.networkStatus === 4}
                keyExtractor={item => item.id}
                extraData={this.state}
                data={
                  data
                    ? data.allVacancies.filter(vacancy =>
                        vacancy.jobName.toLowerCase().includes(this.state.keyword)
                        && (parseInt(vacancy.createdTime.substring(4))>parseInt(timee.substring(4)))).reverse()
                    : []
                }
                renderItem={this.renderItem}
                onRefresh={() => refetch()}
                ListEmptyComponent={this.renderEmptyItem}
                ListHeaderComponent={this.renderHeader}
              />
              :alert(error.message)
            )
          }
        </Query>

        <Modal
          visible={this.state.isDisplayed}
          animationType={'fade'}
          transparent={true}
          onRequestClose={() => this.setState({ isDisplayed: false })}>
          <TouchableOpacity
            onPress={() => this.setState({ isDisplayed: false })}
            style={styles.modalContainer}>
            <View style={styles.innerModalContainer}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={this.openListBlackList}>
                <Text style={styles.modalText}>
                  Черный список работадателей
                </Text>
              </TouchableOpacity>

              <Seperator />
              <TouchableOpacity
                style={styles.modalButton}
                onPress={this.onGoBlackListOffer}>
                <Text style={styles.modalText}>
                  Предложить черного работодателя
                </Text>
              </TouchableOpacity>
              <Seperator />
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={this.onBlackList}>
                <Image
                  style={styles.image}
                  source={require('./../../assets/expand-arrow.png')}
                />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>
      </View>
    );
  }
}

const GET_ALL_VACANCIES = gql`
  query GetAllRecipes {
    allVacancies {
      id
      jobName
      jobNumber
      jobDescription
      jobCost
      jobAddress
      jobTime
      userId
      company
      photoURL
      createdTime
    }
  }
`;

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  image: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  flatListStyle: {
    marginLeft: width / 18,
    marginRight: width / 18,
    marginTop: width / 50,
  },
  modalContainer: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    position: 'absolute',
    width: width,
    height: height,
  },
  innerModalContainer: {
    backgroundColor: 'white',
    marginTop: width / 5,
    padding: width / 20,
    borderRadius: 10,
  },
  modalButton: {
    paddingTop: 4,
    paddingBottom: 4,
    height: width / 10,
  },
  modalText: {
    color: '#1A1955',
    fontSize: width / 20,
  },
  cancelButton: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
});
const timee = new Date().getTime()+259200000+'';
