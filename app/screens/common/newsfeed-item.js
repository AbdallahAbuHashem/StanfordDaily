import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from 'react-native';
import moment from 'moment';
import "moment-timezone";
import styles from '../styles/newsfeeditem';
import _ from "lodash";

export const formatDate = post => moment.utc(post.postDateGmt).format('MMM D, YYYY');
export const getThumbnailURL = ({thumbnailInfo}) => thumbnailInfo ? (thumbnailInfo.urls.mediumLarge || thumbnailInfo.urls.full): null;
export const formatAuthors = ({tsdAuthors}) => (tsdAuthors || []).map(e => e.displayName).join(", ");

export default class NewsFeedItem extends Component {

  //Handles clicking on items
  toPost() {
    this.props.onPress();
  }

  toAuthor(authorID) {
    this.props.onAuthor(authorID);
  }

  render() {
    const { item } = this.props;
    let { postTitle } = item;
    const thumbnailURL = getThumbnailURL(item);
    return (
      <TouchableWithoutFeedback onPress={this.toPost.bind(this)}>
        <View style={styles.content}>
          {thumbnailURL && (
            <View style={styles.imageContainer}>
              <Image source={{ uri: thumbnailURL }} style={styles.image} borderRadius={8} />
            </View>)
          }
          {/* <HTML containerStyle={styles.titleContainer} baseFontStyle={styles.titleFont} html={postTitle} /> */}
        <Text style={styles.titleContainer} adjustsFontSizeToFit minimumFontScale={0.75} allowFontScaling numberOfLines={3}>{postTitle}</Text>
          {/* <HTML containerStyle={styles.descriptionContainer} baseFontStyle={styles.descriptionFont} html={postExcerpt} /> */}
          <View style={styles.dateAndAuthor}>
            <TouchableOpacity>
            <View style={[{ flexDirection: 'row' }, styles.author]}>{item.tsdAuthors.map((info, i) => <TouchableWithoutFeedback onPress = {() => this.toAuthor(item.tsdAuthors[i].id)}><Text style={styles.author}>{info.displayName.toUpperCase()}{i != item.tsdAuthors.length - 1 && ', '}</Text></TouchableWithoutFeedback>)}</View>
            </TouchableOpacity>
            <Text style={styles.date}> {formatDate(item)} </Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}
