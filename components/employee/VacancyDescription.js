import React from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { TouchableOpacity, Text, Dimensions } from 'react-native';
import { HeaderBackButton } from 'react-navigation';
import Communications from 'react-native-communications';

export default class VacancyDescription extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    let headerTitle = navigation.getParam('details').jobName;
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

  renderItem = ({ item }) => (
    <View style={styles.container}>
      <Text>{item}</Text>
    </View>
  );

  render() {
    const details = this.props.navigation.getParam('details');

    const contacts = details.jobNumber.map((value, key) => {
      return (
        <TouchableOpacity
          key={key}
          onPress={() => {
            Communications.phonecall(value, true);
          }}>
          <Text style={styles.textDescrption}>{value}</Text>
        </TouchableOpacity>
      );
    });

    return (
      <View style={styles.container}>
        <View>
          <Text style={styles.textDescription}>{details.jobDescription}</Text>
          <View style={styles.infoContainer}>
            <View style={styles.infoDetail}>
              <Text style={styles.infoDetailText}>Компания: </Text>
              <Text style={styles.textDescrption}>{details.company}</Text>
            </View>
            <View style={styles.infoDetail}>
              <Text style={styles.infoDetailText}>Адрес: </Text>
              <Text style={styles.textDescrption}>{details.jobAddress}</Text>
            </View>
            <View style={styles.infoDetail}>
              <Text style={styles.infoDetailText}>Оплата: </Text>
              <Text style={styles.textDescrption}>{details.jobCost}</Text>
            </View>
            <View style={styles.infoDetail}>
              <Text style={styles.infoDetailText}>Время: </Text>
              <Text style={styles.textDescrption}>{details.jobTime}</Text>
            </View>
            <View style={styles.infoDetail}>
              <Text style={styles.infoDetailText}>Контакты: </Text>
              <View style={styles.contactsStyle}>{contacts}</View>
            </View>
          </View>
        </View>

        <View style={styles.contactMeStyle}>
          <View style={styles.contactMeInnerStyle}>
            <TouchableOpacity
              onPress={() =>
                Communications.phonecall(details.jobNumber[0], true)
              }>
              <Image
                style={styles.image}
                source={require('./../../assets/phone-1.png')}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => Communications.text(details.jobNumber[0])}>
              <Image
                style={styles.image}
                source={require('./../../assets/message.png')}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}
const { height, width } = Dimensions.get('window');
const styles = StyleSheet.create({
  headerStyle: {
    backgroundColor: '#D3D3D3',
    borderBottomColor: 'white',
  },
  container: {
    width: width,
    height: height,
    padding: width / 11,
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
  contactMeStyle: {
    alignItems: 'center',
    marginTop: height / 15,
  },
  contactMeInnerStyle: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  image: {
    marginLeft: width / 20,
    marginRight: width / 40,
  },
});
