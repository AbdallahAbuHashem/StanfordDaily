/*
Note: using the post.js as a template for this page; hoping it mostly works!
Each time to run again: call "npm run ios"
*/
'use strict';
import React, { Component } from 'react';
import NestedListView, { NestedRow } from 'react-native-nested-listview';
import {
  View,
  StatusBar,
  ScrollView,
  Dimensions,
  Text,
  Image
} from 'react-native';

import {
  COLORS,
  FONTS,
  FONT_SIZES,
  STRINGS
} from '../../assets/constants';

import Header from '../common/header';

const { width, height } = Dimensions.get('window'); //Dimensions of the current device screen

const styles = {
  header: {
    borderRadius: 8,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.LIGHT_GRAY,
  },
  headerText: {
    fontSize: FONT_SIZES.DEFAULT_MEDIUM,
    fontFamily: FONTS.PT_SERIF_BOLD,
  },
  author: {
    borderRadius: 10,
    borderBottomColor: COLORS.LIGHT_GRAY,
    borderBottomWidth: 0.5,
  },
  authorText: {
    fontSize: FONT_SIZES.DEFAULT_SMALL_MEDIUM,
    fontFamily: FONTS.PT_SERIF,
  }
}

class Post extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      post: {},
      width: width <= height ? width : height,
      height: Dimensions.get('window').height,
    }
    Dimensions.addEventListener('change', () => {
      const { width, height } = Dimensions.get('window')
      this.setState({ width: width <= height ? width : height, height: height });
    });
  }

  //Once components load, load data. All data is passed down from previous screen
  componentDidMount() {
    this.fetchData();
  }

  //Gets data and makes it look as expected
  fetchData() {
    fetch(STRINGS.DAILY_URL + "wp-json/tsd/v1/authors/")
      .then(e => e.json()) //convert to json
      .then(e => {
        this.setState({ data: e });
      })
  }

  createMarkup(text) {
    return text;
  }
  render() {
    //Find a way to include this dummy data on the side of the author profiles (with the name/profile)
    //perhaps dummy for now, but how to link to direct images? 
    {/* Bitmoji */ }

    return (
      <View style={{ flex: 1 }}>
        <Header ref='postHeader' postID={this.state.id} />
        <View style={{ flex: 1, alignItems: 'center' }}>
          <StatusBar
            barStyle="light-content"
          />
          <ScrollView style={{ flex: 1, flexDirection: "row", backgroundColor: "white" }}
            contentContainerStyle={{ flexGrow: 1, justifyContent: 'space-between' }}>

            <NestedListView
              data={this.state.data}
              getChildrenName={(node) => 'members'} //children of the categories
              onNodePressed={
                (node) => node.id && this.props.navigation.navigate("AuthorDetail", { id: node.id })
              }
              renderNode={(node, level) => (
                <NestedRow
                  level={level}
                  style={level == 1 ? styles.header : styles.author}>
                  <View style={{ flex: 1 }}>
                    {level != 1 &&
                      <View
                        style={{ flex: 1 }}>>
                      <Image
                          style={{ marginLeft: 2, marginTop: 5, width: 30, height: 30 }}
                          source={{ uri: node.profileImage}}
                        //source={require('../../media/bitmoji.png')}
                        />
                      </View>}
                    <View
                      style={{ flex: 1 }}>
                      <Text style={level == 1 ? styles.headerText : styles.authorText}>{node.name}
                      </Text>
                    </View>
                  </View>
                </NestedRow>
              )}
            />
          </ScrollView>
        </View>
      </View>
    );
  }
};

export default Post;