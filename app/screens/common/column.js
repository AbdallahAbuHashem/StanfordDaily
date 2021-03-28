import React, { Component, useState } from 'react';
import {
  View,
  Text,
  Image,
  Dimensions,
  TouchableWithoutFeedback,
  FlatList,
  PixelRatio
} from 'react-native';
import moment from 'moment';
import "moment-timezone";
import _ from "lodash";
import styles from '../styles/column-style';
import Separator from './Separator';
import { STRINGS, CATEGORIES, HOME_SECTIONS, CATEGORY_ICONS, KEYS, FONTS, COLORS, MARGINS } from '../../assets/constants';

const { width, height } = Dimensions.get('window');
// export const formatDate = post => moment.utc(post.postDateGmt).tz("America/Los_Angeles").toDate().toLocaleDateString();
export const formatDate = post => moment.utc(post.postDateGmt).format('MMM D, YYYY').toUpperCase();
export const getThumbnailURL = ({thumbnailInfo}) => thumbnailInfo ? (thumbnailInfo.urls.mediumLarge || thumbnailInfo.urls.full): null;
export const formatAuthors = ({tsdAuthors}) => (tsdAuthors || []).map(e => e.displayName).join(", ");

export default class Column extends Component {

    toPost() {
        this.props.onPress();
      }
    
      toAuthor() {
        this.props.onAuthorPress(authorID);
      }

    render() {
        const { item, navigation } = this.props;
        return (
                <FlatList
                    style={styles.videos_flatList}
                    data={item}
                    renderItem={({ item, index }) => (
                        <TouchableWithoutFeedback onPress={() => navigation.navigate(STRINGS.POST, { postID: item.id })}>
                            <View style={{flexDirection: 'column'}}>
                                <View style={{flexDirection: 'row', width: width}}>
                                    {getThumbnailURL(item) && (
                                        <View style={{padding: 10}}>
                                            <Image resizeMode={'cover'} source={{ uri: getThumbnailURL(item) }} style={{width: width/3, height: 3/4 * width/3}} borderRadius={8} />
                                        </View>)
                                    }
                                    <View style={{flexShrink: 1}}>
                                        <View style={{flex: 1, flexDirection: 'column', justifyContent: 'space-between'}}>
                                            <View>
                                                <Text adjustsFontSizeToFit numberOfLines={3} minimumFontScale={0.75} allowFontScaling style={styles.titleContainer}>{item.postTitle}</Text>
                                                {/* <Text style={{ fontSize: 60*(1/2)^item.postTitle.split(' ').length }}>{item.postTitle.length}</Text> */}
                                                <Text style={styles.author}> {formatAuthors(item).toUpperCase()} • {formatDate(item)} </Text>
                                            </View>
                                            {index != 2 && (
                                                <Separator />
                                            )}
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    )}
                    scrollEnabled={false}
                />
          );

    }
}