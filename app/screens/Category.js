import { STRINGS, CATEGORIES, HOME_SECTIONS, CATEGORY_ICONS, KEYS, FONTS, COLORS, MARGINS } from '../assets/constants.js';
import React, { useState, useRef, useEffect, Component } from 'react';
import { Image } from 'react-native';
import {
  View,
  Text,
  Dimensions,
  StatusBar,
  FlatList,
  TouchableOpacity,
  TouchableHighlight,
  ScrollView
} from 'react-native';
import Drawer from 'react-native-drawer'

//Components for this app imports
import Header from './common/header';
import NewsFeedItem from './common/newsfeed-item';
import Separator from './common/Separator';
import SettingsPage from './SettingsPage.js';
import _ from 'lodash';
import { Ionicons } from '@expo/vector-icons';
import Carousel from 'react-native-snap-carousel';
import CardRow from './common/card-row';
import Card from './common/Card'
import Column from './common/column';
import HTML from '../HTML';

import { getHomeAsync, getCategoryAsync, getHomeMoreAsync } from '../helper/wpapi.js';

const { width, height } = Dimensions.get('window'); //Dimensions of the current device screen

export default class Category extends Component {

    constructor(props) {
        super(props);
        this.goBack = this.goBack.bind(this);
        this.state = {
          item: null,
          width: width <= height ? width : height,
          height: Dimensions.get('window').height,
        }
        Dimensions.addEventListener('change', () => {
          const { width, height } = Dimensions.get('window')
          this.setState({ width: width <= height ? width : height, height: height });
          // console.warn("orientation changed");
        });
      }
    
      //A function that triggers going back to headlines
      goBack() {
        this.props.navigation.goBack();
      }

      // Still need to load extra articles somewhere in here.

    render() {
        const { data, title, navigation } = this.props.navigation.state.params;
        console.log(data[0]);
        const renderItem = ({item}) => (
            <NewsFeedItem
            key={"article-" + item.id}
            item={item}
            onPress={ () => navigation.navigate(STRINGS.POST, { postID: item.id })}
            />
        )

        return (
            <View>
                <Header title={title} ref='postHeader' share={true} goBack={this.goBack} />
                <FlatList
                    data={data}
                    renderItem={renderItem}
                />
            </View>
        );
      }
}