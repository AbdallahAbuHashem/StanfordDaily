/**
 * Created by ggoma on 12/17/16.
 */
 import React, {Component} from 'react';
 import firebase from 'firebase';
 import moment from 'moment';
 import styles from '../styles/replyitem.js';
 moment().format();

 import {
   Text,
   View,
   TouchableHighlight,
   Image,
   TouchableOpacity,
 } from 'react-native';

import {STRINGS, Images} from '../../assets/constants.js'; //Constants
export default class ReplyItem extends Component {
    constructor() {
        super();
        this._mounted = false;
        this.state = {
          body: '',
          preview: '',
          imageExists: false,
          imageURI: ""
        }
    }

    componentWillMount() {
      this.setState(this.props.item);
      var view = this;
      setInterval(function(){ //Updates the timestamp
        view.calculateTime(view.props.item.timeStamp);
      },60000);
      this.setState({body: "", author: ""});
    }

    componentDidMount() {
      // console.log("mounted");
      this._mounted = true;
      var view = this;
      this.calculateTime(this.state.timeStamp);
      //Fetches the body of the reply
      this.props.firebase.database().ref(this.props.item.body).once(STRINGS.VAL).then(function(snapshot) {
          view.setState({body : snapshot.val().body});
      });

      //Handles whether or not to display the user
      if(this.state.anon === STRINGS.NO) {
        this.props.firebase.database().ref(STRINGS.USERS).child(this.props.item.author).once(STRINGS.VAL).then(function(snapshot) {
            view.setState({author : snapshot.val().name, userId: view.props.item.author});
        });
        firebase.storage().ref(STRINGS.PROFILE_PICTURES).child(view.props.item.author).getDownloadURL()
          .then(function(url) {
            view.setState({imageURI: url, imageExists: true});
          })
          .catch(function(error){

          });
      } else {
        this.setState({author: STRINGS.ANON})
      }

      //Deals with collapsing and view more
      if(this.state.long === STRINGS.YES) {
        this.setState({collapsed : true});
      } else {
        this.setState({collapsed : false});
      }
    }

    componentWillUnmount() {
      this._mounted = false;
      clearInterval();
    }

    viewMoreStyle() {
      var style = styles.messageText;
      style.fontWeight = STRINGS.BOLD;
    }

    calculateTime(TimeStamp) {
      var time = moment(TimeStamp).fromNow();
      if(this._mounted) {
        this.setState({timeStamp: time});
      }
    }

    toProfile() {
      // console.log(this.state);
      if (this.state.userId) this.props.goToProfile(this.state.userId);
    }

    render() {
      this.state.preview = this.state.body;
      if (this.state.long === STRINGS.YES) {
        this.state.preview = this.state.preview.substring(0, 180);
        this.state.preview += STRINGS.MORE_TEXT;
      }

      /* Breakdown
       * A container that has a touchable for the profile picture then a view that has style of "post"
       * Post has a touchable for the name of the user and the timeStamp
       * Then there is a view and a text for the reply body
      */
      return (
          <View style={styles.container}>
            <TouchableOpacity onPress={this.toProfile.bind(this)}>
              <View>
                {!this.state.imageExists && <Image style={styles.authorImage} source={Images.ANON_SMALL}/>}
                {this.state.imageExists && <Image style={styles.authorImage} defaultSource={STRINGS.ANON_SMALL} source={{uri: this.state.imageURI}}/>}
              </View>
            </TouchableOpacity>
            <View style={styles.post}>
              <TouchableOpacity onPress={this.toProfile.bind(this)}>
                <View style={styles.postInfo}>
                  <Text style={styles.authorName}>{this.state.author}</Text>
                  <Text style={styles.timeStamp}>{this.state.timeStamp}</Text>
                </View>
              </TouchableOpacity>
              <View style={styles.message}>
                <Text style={styles.messageText}>
                  {this.state.collapsed && this.state.preview + " "}
                  {!this.state.collapsed && this.state.body}
                  {this.state.collapsed && (
                    <View style={styles.viewMoreStyle}>
                      <TouchableHighlight underlayColor={COLORS.PLACEHOLDER_DARK} onPress={(event) => this.setState({collapsed : false})} activeOpacity={1}>
                        <Text style={this.viewMoreStyle()}>
                          View more
                        </Text>
                      </TouchableHighlight>
                    </View>
                  )}
                </Text>
              </View>
            </View>
          </View>
      );
    }
}
