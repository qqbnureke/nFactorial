import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { TouchableOpacity, FlatList } from 'react-native';
import { TextInput } from 'react-native-paper';

export default class AddVacanccy extends React.Component {
  state = {
    number: '',
    contacts: [],
  };

  handleButton = async () => {
    this.state.number &&
      (await this.setState(prevState => ({
        contacts: [...prevState.contacts, this.state.number],
        number: '',
      })));
    this.props.onAdded(this.state.contacts);
  };

  renderItem = ({ item }) => (
    <View style={{ flexDirection: 'row' }}>
      <Text style={styles.items}>
        {'\u2022'} {item}
      </Text>
    </View>
  );

  render() {
    return (
      <View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
          <TextInput
            keyboardType="numeric"
            underlineColorAndroid="transparent"
            style={styles.textInputStyle}
            label="Контакт"
            maxLength={12}
            value={`${this.state.number}`}
            onChangeText={number => this.setState({ number })}
          />
          <TouchableOpacity onPress={this.handleButton} style={styles.btnAdd}>
            <Text style={styles.addText}>+</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          inverted
          keyExtractor={(item, index) => index.toString()}
          data={this.state.contacts}
          renderItem={this.renderItem}
        />
      </View>
    );
  }
}
const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
  btnAdd: {
    backgroundColor: '#1A1955',
    width: width * 0.15,
    height: width / 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: width / 15,
  },
  addText: {
    fontSize: width / 12,
    color: 'white',
  },
  textInputStyle: {
    width: width * 0.5,
  },
  items: {
    fontSize: width / 18,
    color: '#1A1955',
  },
});
