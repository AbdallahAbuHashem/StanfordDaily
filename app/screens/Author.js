import React, { Component, SafeAreaView } from 'react';
import {
  View,
  StatusBar,
  ScrollView,
  Dimensions,
  Text,
  ImageBackground,
  ActivityIndicator,
  FlatList,
  Image,
  useState
} from 'react-native';

import { WebView } from 'react-native-webview'
import WPAPI from "wpapi";
//Components for this app imports
import Header from './common/header';
import * as Amplitude from 'expo-analytics-amplitude';
import { FONTS, COLORS, STRINGS, KEYS, MARGINS } from "../assets/constants";
import styles from './styles/column-style.js';
import _ from "lodash";
import HTML from '../HTML.js';
import striptags from 'striptags';
import { getPostByIdAsync } from '../helper/wpapi.js';
import { formatAuthors, getThumbnailURL, formatDate } from './common/newsfeed-item.js';
import Placeholder from './common/placeholder.js';
import NewsFeedItem from './common/newsfeed-item';
import { auth } from 'firebase';
import { TouchableOpacity, TouchableWithoutFeedback } from 'react-native-gesture-handler';

const amplitude = Amplitude.initialize(KEYS.AMPLITUDE_API);
const { width, height } = Dimensions.get('window'); //Dimensions of the current device screen

export default class Author extends Component {
    constructor(props) {
        super(props);
        this.goBack = this.goBack.bind(this);
        this.state = {
          item: null,
          author: null,
          width: width <= height ? width : height,
          height: Dimensions.get('window').height,
        }
        Dimensions.addEventListener('change', () => {
          const { width, height } = Dimensions.get('window')
          this.setState({ width: width <= height ? width : height, height: height });
          // console.warn("orientation changed");
        });
    }

      goBack() {
        this.props.navigation.goBack();
      }

      async componentDidMount() {
        const { authorID } = this.props.navigation.state.params;
        var WPAPI = require('wpapi');
        var wp = new WPAPI({ endpoint: 'http://wp.stanforddaily.com/wp-json' });
        wp.posts().param('author', authorID).embed().get()
        .then( posts => { 
          this.setState({ item: posts })
        } );

        wp.users().id(authorID).get()
        .then( data => {
          this.setState({ author: data.name })
        })
      }

      render() {
        const renderItem = ({item}) => (
            <TouchableWithoutFeedback onPress={() => this.props.navigation.navigate(STRINGS.POST, { postID: item.id })}>
                <View style={{flexDirection: 'column'}}>
                                <View style={{flexDirection: 'row', width: width}}>
                                    {item._embedded['wp:featuredmedia'][0].source_url && ( // This line is super glitchy.
                                        <View style={{padding: 10}}>
                                            <Image resizeMode={'cover'} source={{ uri: item._embedded['wp:featuredmedia'][0].source_url }} style={{width: width/3, height: 3/4 * width/3}} borderRadius={8} />
                                        </View>)
                                    }
                                    <View style={{flexShrink: 1}}>
                                        <View style={{flex: 1, flexDirection: 'column', justifyContent: 'space-between'}}>
                                            <View>
                                                <Text style={styles.titleContainer}>{item.title.rendered}</Text>
                                                {/* <Text style={{ fontSize: 60*(1/2)^item.postTitle.split(' ').length }}>{item.postTitle.length}</Text> */}
                                                <Text style={styles.author}> {this.state.author} • {formatDate(item)} </Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </View>
            </TouchableWithoutFeedback>
        )
        
          return(
                <View>
                    <Header title={this.state.author} goBack={this.goBack} />
                    <FlatList
                    style={{ marginHorizontal: MARGINS.ARTICLE_SIDES/2, height: height }}
                    data={this.state.item}
                    renderItem={renderItem}
                    />
                </View>
          )
      }
};