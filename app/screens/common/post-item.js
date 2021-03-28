
 import React, {Component} from 'react';
 import firebase from 'firebase';
 import styles from '../styles/postitem.js';
 import moment from 'moment';

 import {
   Text,
   View,
   TouchableHighlight,
   Image,
   TouchableWithoutFeedback
 } from 'react-native';

import {STRINGS, KEYS, COLORS, Images} from '../../assets/constants.js'; //Constants

import * as Amplitude from 'expo-analytics-amplitude';

const amplitude = Amplitude.initialize(KEYS.AMPLITUDE_API);

moment().format();
export default class PostItem extends Component {
    constructor() {
        super();
        this.state = { //Default empty values
          body: "",
          repliesCount: -1,
          votes: -1,
          long: STRINGS.NO,
          timeStamp : -1,
          anon: STRINGS.YES,
          key: "",
          sortDate: -1,
          author: "",
          userVote: -2,
          hide: false,
          imageExists: false,
          imageURI: ""
        }
        this._mounted = false;
        this.hiddenRefs = {};
    }

    getData() {
      var firebaseApp = firebase.apps[0]; //Gets the configurations for the firebase
      var view = this;
      firebaseApp.database().ref().child(STRINGS.POSTS).child(this.props.item.key).once(STRINGS.VAL).then(function(snap){ //Gets the post data once using the passed key
          var childJSON = snap.val(); //The data from firebase as JSON
          // console.log("JSON", childJSON);
          var body = STRINGS.POSTS_BODIES + '/' + childJSON.body; //A reference to where the body is in firebase
          var author = STRINGS.ANON; //Default author is anon
          if (childJSON.anon === STRINGS.NO) {
            author = childJSON.author;
          }
          var userVote = view.currUserVote(childJSON);
          //For body and author, they are initially fetched as references from Firebase. To not allow user to view the references, they are
          //saved as hidden values till the actual values are fetched
          view.hiddenRefs.body = body;
          view.hiddenRefs.author = author;
          view.hiddenRefs.timeStamp = childJSON.TimeStamp;

          //All the remaining data is saved in a format ready to be viewed
          view.setState({
            body: "",
            repliesCount: childJSON.repliesCount,
            votes: childJSON.votes,
            long: childJSON.long,
            anon: childJSON.anon,
            key: view.props.item.key,
            sortDate: childJSON.sortDate,
            author: "",
            userVote: userVote
          });

          //Notify the app that the component data is now ready
          view.componentDidMount();
      });
    }

    componentWillMount() {
      this._mounted = true;
      console.log("mounting");
      // this.propsCopy = this.props;
      this.setState({body: "", author: ""}); //Make sure that no references show up
      this.hiddenRefs.timeStamp = this.state.timeStamp;
      this.getData(); // Send a request to firebase
      var view = this;
      setInterval(function(){
        view.calculateTime(view.hiddenRefs.timeStamp);
      },60000);
    }

    currUserVote(childJSON, currUser) { //Get the current user vote as a string
      if (typeof childJSON.voters !== STRINGS.UNDEFINED) {
        if (currUser in childJSON.voters) {
          return childJSON.voters[currUser];
        }
      }
      return "0";
    }

    componentDidMount() {
      this._mounted = true;
      if (this.hiddenRefs.body !== undefined) { //Once hidden refs has a value for body, we can attempt loading the author and body texts
        // console.log(this.state);
        var view = this;
        this.calculateTime(this.hiddenRefs.timeStamp); //Format the timestamp
        firebase.database().ref(view.hiddenRefs.body).once(STRINGS.VAL).then(function(snapshot) { //Get the body text
            view.setState({body : snapshot.val().body});
        });
        if(this.state.anon === STRINGS.NO) { // Get the author info
          firebase.database().ref(STRINGS.USERS).child(this.hiddenRefs.author).once(STRINGS.VAL).then(function(snapshot) {
              view.setState({author : snapshot.val().name, userId: view.hiddenRefs.author});
          });
          firebase.storage().ref(STRINGS.PROFILE_PICTURES).child(view.hiddenRefs.author).getDownloadURL()
            .then(function(url) {
              view.setState({imageURI: url, imageExists: true});
            })
            .catch(function(error){

            });
        } else {
          this.setState({author: STRINGS.ANON}) //Set user to anonyomous if the post is authored anonymously
        }

        if(this.state.long === STRINGS.YES && (this.props.context === STRINGS.LIST || this.props.context === STRINGS.PROFILE)) { //Decides whether to start with post collapsed or not
          this.setState({collapsed : true});
        } else {
          this.setState({collapsed : false});
        }

        //Puts a listener for votes and repliesCount to update them as soon as they change
        firebase.database().ref(STRINGS.POSTS).child(this.state.key).on(STRINGS.VAL, function(snapshot) {
          if(snapshot.val() !== null && view._mounted) {
            view.setState({
              repliesCount: snapshot.val().repliesCount,
              votes: snapshot.val().votes,
              userVote: view.currUserVote(snapshot.val(), view.props.currUser),
            });
          }
        });

        //Puts a listener for deletes
        firebase.database().ref(STRINGS.POSTS).on(STRINGS.CHILD_REMOVED, function(snapshot) {
          console.log(snapshot.val());
          if(snapshot.child('body').val() === view.state.key && view._mounted) {
            view.setState({hide: true});
          }
          // if(!snapshot.child('body').exists()) view.setState({hide: true});
        });
      }
    }

    componentWillUnmount() {
      this._mounted = false;
      // firebase.database().ref(STRINGS.POSTS).child(this.state.key).off();
      // firebase.database().ref(STRINGS.POSTS).off();

      // console.log("unmounting");
    }

    //Determines color of the up and down buttons
    determineColor(vote, image) {
      if (image === STRINGS.UP) {
        if(vote === 1) {
          return {tintColor: COLORS.CARDINAL}
        }
      } else {
        if(vote === -1) {
          return {tintColor: COLORS.CARDINAL}
        }
      }
      return null;
    }

    //The style for "View More"
    viewMoreStyle() {
      var style = styles.messageText;
      style.fontWeight = STRINGS.BOLD;
    }

    //Handles changing the vote
    changeVote(newVote) {
      var refToVotes = firebase.database().ref(STRINGS.POSTS).child(this.state.key).child(STRINGS.VOTES);
      var refToVoters = firebase.database().ref(STRINGS.POSTS).child(this.state.key).child(STRINGS.VOTERS);
      var view = this;
      if(this.state.userVote === newVote) {
        this.setState({userVote : 0});
        Amplitude.logEvent(STRINGS.VOTE_CHANGED, {post: view.state.key, newVote: 0});
        refToVotes.transaction(function(currentVotes) {
          return (currentVotes || 0) - newVote;
        });
        this.props.firebase.database().ref(STRINGS.POSTS).child(this.state.key).child(STRINGS.VOTERS).child(this.props.currUser).remove();
      } else {
        refToVotes.transaction(function(currentVotes) {
          return (currentVotes || 0) + (newVote-view.state.userVote);
        });
        this.props.firebase.database().ref(STRINGS.POSTS).child(this.state.key).child(STRINGS.VOTERS).child(this.props.currUser).set(newVote);
        Amplitude.logEvent(STRINGS.VOTE_CHANGED, {post: view.state.key, newVote: newVote});
        this.setState({userVote : newVote});
      }
    }

    //Sets container style based on the context being list or detailed post
    containerStyle(context) {
      var style = styles.li;
      if(context === STRINGS.LIST || context === STRINGS.PROFILE) {
        return styles.li;
      } else {
        return styles.detailed;
      }
    }

    //Sets the timestamp in the "some time ago" format
    calculateTime(TimeStamp) {
      var time = moment(TimeStamp).fromNow();
      if (this._mounted) this.setState({timeStamp: time});
    }

    toProfile() {
      if (this.state.userId) this.props.goToProfile(this.state.userId);
    }


    deletePost() {
      this.props.deletePost(this.props.item.key);
      this.setState({hide: true});
    }


    render() {
      //Handle long posts
      if(this.props.context === STRINGS.LIST || this.props.context === STRINGS.PROFILE) {
        this.state.preview = this.state.body;
        if (this.state.long === STRINGS.YES) {
          this.state.preview = this.state.preview.substring(0, 180);
          this.state.preview += STRINGS.MORE_TEXT;
        }
      }
      if (this.state.hide) {
        this.props.removeAtIndex(this.props.index);
        return null;
      }


      //Breakdown
      /*
       * The whole post item is touchable in case it is in a list. In that case, it will take you to detailedpost
       * Then there is a container for the whole component
       * Container breaks into "post" view contains the post info, body and vote controllers, as well as a "reply/delete" view for these actions
       * Post breaks into "Content" view and "UpDown" view.
       * Content has "author" and "message" views
       * Author includes image, author and timerstamp. All is clickable and redirects to profile.
       * Message includes messagetext, which deals with previewing the body in case it's collapsed or not.
       * UpDown has a 2 touchables for the 2 buttons and a text for the count
       * reply/delete only exists if the context is profile or list (it could be detailed post in that case we don't have this view)
       * In a list it has "Write a reply..." and a counter for replies
       * In a profile it changes to including delete post
       */
      return (
        <TouchableWithoutFeedback onPress={() => this.props.goToPost !== undefined ? this.props.goToPost(this.state, this.state.author) : console.log('none')}>
          <View style={this.containerStyle(this.props.context)}>
            <View style={styles.post}>
              <View style={styles.content}>
                <View style={styles.author}>
                  <TouchableWithoutFeedback onPress={this.toProfile.bind(this)}>
                    <View>
                      {!this.state.imageExists && <Image style={styles.authorImage} source={Images.ANON_SMALL}/>}
                      {this.state.imageExists && <Image style={styles.authorImage} defaultSource={Images.ANON_BIG} source={{uri: this.state.imageURI}}/>}
                    </View>
                  </TouchableWithoutFeedback>
                  <TouchableWithoutFeedback onPress={this.toProfile.bind(this)}>
                    <View style={styles.postInfo}>
                      <Text style={styles.authorName}>{this.state.author}</Text>
                      <Text style={styles.timeStamp}>{this.state.timeStamp}</Text>
                    </View>
                  </TouchableWithoutFeedback>
                </View>
                <View style={styles.message}>
                  <Text style={styles.messageText}>
                    {this.state.collapsed && this.state.preview + " "}
                    {!this.state.collapsed && this.state.body}
                    {this.state.collapsed && (
                      <View style={{width:70, height:15, marginTop:2}}>
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
              <View style={styles.upDown}>
                <TouchableWithoutFeedback onPress={this.changeVote.bind(this,1)}>
                  <Image style={this.determineColor(this.state.userVote,STRINGS.UP)} source={Images.UP_VOTE}/>
                </TouchableWithoutFeedback>
                <Text style={styles.votesCount}>{this.state.votes}</Text>
                <TouchableWithoutFeedback onPress={this.changeVote.bind(this,-1)}>
                  <Image style={this.determineColor(this.state.userVote,STRINGS.DOWN)} source={Images.DOWN_VOTE}/>
                </TouchableWithoutFeedback>
              </View>
            </View>
            {this.props.context === STRINGS.LIST && (
              <View style={styles.reply}>
                <View style={styles.writeAReply}>
                  <Image style={styles.replyIcon} source={Images.REPLIES}/>
                  <Text style={styles.replyPlaceHolder}>Write a reply…</Text>
                </View>
                <View style={styles.repliesCounter}>
                  {this.state.repliesCount === 1 && <Text style={styles.countInList}>{this.state.repliesCount + " " + STRINGS.REPLY}</Text>}
                  {this.state.repliesCount !== 1 && <Text style={styles.countInList}>{this.state.repliesCount + " " + STRINGS.REPLIES}</Text>}
                </View>
              </View>
            )}
            {this.props.context === STRINGS.PROFILE && (
              <View style={styles.reply}>
                <View style={styles.profileReplies}>
                  <Image style={styles.replyIcon} source={Images.REPLIES}/>
                  {this.state.repliesCount === 1 && <Text style={styles.countInProfile}>{this.state.repliesCount + " " + STRINGS.REPLY}</Text>}
                  {this.state.repliesCount !== 1 && <Text style={styles.countInProfile}>{this.state.repliesCount + " " + STRINGS.REPLIES}</Text>}
                </View>
                <TouchableWithoutFeedback onPress={this.deletePost.bind(this)}>
                  <View style={styles.deletePost}>
                    <Image style={styles.deleteIcon} source={Images.DELETE}/>
                    <Text style={styles.profileOptionsText}>Delete Post</Text>
                  </View>
                </TouchableWithoutFeedback>
              </View>
            )}
          </View>
          </TouchableWithoutFeedback>
      );
    }
}
