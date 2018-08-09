import React, { Component } from 'react';
import { Text, View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, TouchableOpacity } from 'react-native';
import { Dimensions, ActivityIndicator } from 'react-native';
import { HeaderBackButton } from 'react-navigation';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import * as Animatable from 'react-native-animatable';
import Accordion from 'react-native-collapsible/Accordion';
import Seperator from './../utils/Seperator';

export default class BlackList extends React.Component {
  state = {
    activeSection: false,
    collapsed: true,
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
    let headerStyle = { backgroundColor: '#D3D3D3' };
    return {
      headerTitle,
      headerTitleStyle,
      headerStyle,
      headerLeft,
    };
  };

  setSection = section => {
    this.setState({ activeSection: section });
  };

  renderHeader = (section, _, isActive) => {
    return (
      <Animatable.View
        duration={400}
        style={[
          styles.renderHeader,
          isActive ? styles.active : styles.inactive,
        ]}
        transition="backgroundColor">
        <Text style={styles.renderHeaderText}>{section.companyName}</Text>
        <Text style={styles.renderHeaderText2}>{section.address}</Text>
        <Seperator />
      </Animatable.View>
    );
  };

  renderContent(section, _, isActive) {
    return (
      <Animatable.View
        duration={400}
        style={[styles.content, isActive ? styles.active : styles.inactive]}
        transition="backgroundColor">
        <Animatable.Text animation={isActive ? 'bounceIn' : undefined}>
          {section.reason}
        </Animatable.Text>
      </Animatable.View>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView>
          <Text style={styles.title}>
            Черный список работадателей представлено анонимами
          </Text>
          <Query query={GET_Black_List}>
            {({ loading, data, error, refetch }) =>
              loading ? (
                <ActivityIndicator />
              ) : (
                <Accordion
                  activeSection={this.state.activeSection}
                  sections={data.allBlackLists}
                  touchableComponent={TouchableOpacity}
                  renderHeader={this.renderHeader}
                  renderContent={this.renderContent}
                  duration={400}
                  onChange={this.setSection}
                />
              )
            }
          </Query>
        </ScrollView>
      </View>
    );
  }
}

const GET_Black_List = gql`
  query GetAllBlackLists {
    allBlackLists {
      id
      companyName
      address
      reason
    }
  }
`;

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  title: {
    padding: width / 19,
    textAlign: 'center',
    fontSize: width / 22,
    marginBottom: width / 19,
  },
  renderHeader: {
    backgroundColor: '#F5FCFF',
    paddingLeft: width / 19,
    paddingRight: width / 19,
  },
  renderHeaderText: {
    fontSize: width / 23,
    fontWeight: '500',
  },
  renderHeaderText2: {
    fontSize: width / 27,
    fontWeight: '300',
  },
  content: {
    paddingLeft: width / 19,
    paddingRight: width / 19,
    backgroundColor: '#fff',
  },
  active: {
    backgroundColor: 'rgba(255,255,255,1)',
  },
  inactive: {
    backgroundColor: 'rgba(245,252,255,1)',
  },
});
