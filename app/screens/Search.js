import {STRINGS, REFS, COLORS, ICONS} from '../assets/constants.js';
import React, {Component, useState, useEffect} from 'react';
import {
    View,
    StatusBar,
    ActivityIndicator,
    FlatList,
    TextInput,
    Text,
    Image,
    Dimensions
} from 'react-native';
import WPAPI from "wpapi";
import SearchBar from 'react-native-elements'

import {NavigationActions} from 'react-navigation';
import { formatAuthors, getThumbnailURL, formatDate } from './common/newsfeed-item.js';

//Components for this app imports
import NewsFeedItem from './common/newsfeed-item';
import { Ionicons } from '@expo/vector-icons';
import _ from 'lodash';
import Header from './common/header';

//Styles for the page
import styles from './styles/search';

import * as Amplitude from 'expo-analytics-amplitude';
import { TouchableOpacity, TouchableWithoutFeedback } from 'react-native-gesture-handler';

// const amplitude = Amplitude.initialize(KEYS.AMPLITUDE_API);
// const selectedCategory = STRINGS.FEATURED_HEADLINES; //The currently selected category
const { width, height } = Dimensions.get('window'); //Dimensions of the current device screen
export default class Search extends Component {
    constructor(props) {
        super(props);
        this.state = {
            input: "",
            focusColor: COLORS.LIGHT_GRAY,
            refreshing: false,
            loading: false,
            page: 1,
            posts: [],
            hashed: {},
            allIsHere: false,
            item: 'ofvdhiufh',
            searchText: "",
            selectedId: -1,
            data: [],
            filteredData: []
        };
        // this.data = []; //A list of all current data
        this.currPosts = {}; //A hash of all current posts
        // console.log(this.currPosts);
        this.fetchDataIsBusy = false; //Used to handle concurrency
        // this.fetchData = _.debounce(this.fetchData, 200); //Sets a gap of at least 200ms between each call to loading more articles
        // this.loadMore = _.debounce(this.loadMore, 200); //Sets a gap of at least 200ms between each call to loading more articles
        this.goToPost = this.goToPost.bind(this); //The function that goes to the post screen
        this._renderRow = this._renderRow.bind(this); //A function used by the listView to render each row
    }

    // Given data, it passes it to Post view
    goToPost(data) {
      this.props.navigation.navigate(STRINGS.POST, { ...data });
    }

    goBack() {
      this.props.navigation.goBack();
    }

    async componentDidMount() {
      // this.refs.textInput.focus();
      // console.log('hihi');
      // tracker.setUser('12345678');
     // log an event
     // Amplitude.logEvent(STRINGS.APP_OPENED);
    //  console.log("Logged");

  //   let data = await fetch('https://jsonplaceholder.typicode.com/posts')
  //   .then(response => response.json());

  // this.setState({data: data});
  var WPAPI = require('wpapi');
  var wp = new WPAPI({ endpoint: 'http://wp.stanforddaily.com/wp-json' });
      wp.posts().embed().get()
      .then( posts => {
        this.setState({data: posts})
      })

    }

    search = (searchText) => {

      this.setState({searchText: searchText});
      // let filteredData = this.state.data.filter(function (item) {
      //   return item.id == searchText || item.title.toUpperCase().includes(searchText.toUpperCase());
      // });
  
      // this.setState({filteredData: filteredData});
      var WPAPI = require('wpapi');
      var wp = new WPAPI({ endpoint: 'http://wp.stanforddaily.com/wp-json' });
      wp.posts().search(searchText).embed().get()
      .then( posts => { 
        this.setState({filteredData: posts})
      } );
    };


    //Sends the fetch request, populates data with the new articles and alerts listView about potential change
    //Specific to category articles
    async fetchNewHeadlines(searchURL, loadMore, currText) {
      let response = await fetch(searchURL);
      let responseData = await response.json();
      var counter = 0;
      var view = this;
      var newArr = view.state.posts.slice();
      if(this.state.input !== currText) return;
      if(responseData.length === 0) this.setState({allIsHere : true});
      responseData.forEach(function(post) {
        if(view.state.hashed[post.id] === undefined) {
          view.state.hashed[post.id] = 1;
          var postObject = {postObj: post, searchTerm: currText, key: post.id};
          if(loadMore === true) {
            newArr.push(postObject);
          } else {
            newArr.splice(counter,0,postObject);
            counter += 1;
          }
        }
      });
      if(this.state.input !== currText) return;
      this.setState({posts: newArr});
      return counter;
    }

    //Determines the page and code for the category fetching, and calls the above function
    async handleFetching(counter, loadMore) {
      let searchURL = STRINGS.REQUEST_LARGE_PAGE +counter+STRINGS.SEARCH_URL+encodeURI(this.state.input);
      return await this.fetchNewHeadlines(searchURL, loadMore, this.state.input);
    }

    //Handles all requests to fetch more data, and figures out whether it should get category only or also featured headlines too
    async fetchData(loadMore) {
      if (this.state.input.length === 0 || this.state.allIsHere) return;
      // this.props.navigation.dispatch(NavigationActions.back());
      if (loadMore || this.state.page === 1) {
        await this.handleFetching(this.state.page,loadMore);
      } else {
        var counter = 1;
        while (true) {
          var refreshed = await this.handleFetching(counter,loadMore);
          if (refreshed !== 3) break;
          counter += 1;
        }
      }
      this.fetchDataIsBusy = false;
    }

    //Handles loading more articles
    async loadMore(event) {
      if(!this.state.loading && this.state.input.length !== 0) {
        this.state.loading = true;
        if(!this.fetchDataIsBusy) {
          this.fetchDataIsBusy = true;
          await this.fetchData(true);
          this.state.page += 1;
        }
        this.state.loading = false;
      }
    }

   //Handles rendering rows by calling the NewsFeedItem and passing data to it
  _renderRow(data) {
    // console.log("This is my id", data.item.key);
    if(data.item.searchTerm !== this.state.input) return null;
    if(data.item.postObj !== STRINGS.PLACEHOLDER) {
      return <NewsFeedItem key={data.item.key} postID={data.item.key} data={data.item} onPress={this.goToPost} context={STRINGS.HEADLINES}
      onAuthorPress = {authorID=>this.props.navigation.navigate("AuthorDetail", { id: authorID})} />
    }
    return null;
  }
  
  //Required ReactNative function
  //For this screen we render
  /* <View for the page>
     <Set Status Bar props>
     <Show the header>
     <MenuContext states that we will use the Menu component>
     <ListView for the articles>
  */
 
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
                                          
                                          <Text style={styles.author}> {this.state.author}</Text>
                                      </View>
                                  </View>
                              </View>
                          </View>
                      </View>
      </TouchableWithoutFeedback>
  )

    return (
      <View>
        <Header searchHandler={() => console.log("Search")} value={this.state.searchText} onChangeText={this.search} goBack={ () => this.goBack()} />
        {/* <Text>{JSON.stringify(this.state.filteredData[0])}</Text> */}
          <FlatList
              data={this.state.filteredData && this.state.filteredData.length > 0 ? this.state.filteredData : this.state.data}
              renderItem={renderItem}
          />
          
          
          
      </View>
    )
  }
}