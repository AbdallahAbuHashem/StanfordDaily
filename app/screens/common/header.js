/**
 * Created by ggoma on 12/17/16.
 */
import React, {Component} from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    Share,
    TextInput
} from 'react-native';
import { AndroidBackHandler } from 'react-navigation-backhandler';
import { Ionicons } from '@expo/vector-icons';
import {REFS, ICONS, Images, COLORS, ALIGNMENTS, STRINGS} from '../../assets/constants.js';
import styles from '../styles/header.js';
import { SearchBar } from 'react-native-elements';
// import ActivityView from 'react-native-activity-view';

export default class Header extends Component {
    constructor() {
        super();
    }

    toProfile() {
      // console.log(this.state);
      this.props.toProfile(null);
    }

    /*
     * Shares the current post using the native share functionality.
     */
    shareHandler() {
      let url = STRINGS.DAILY_URL;
      if (this.props.postID !== undefined) {
        url += "?p=" + this.props.postID;
      } else if (this.props.authorID !== undefined) {
        url += "?author=" + this.props.authorID;
      }
      Share.share({
        message: url,
        url: url
      })
    }
    onBackButtonPressAndroid() {
      /*
      *   Returning `true` from `onBackButtonPressAndroid` denotes that we have handled the event,
      *   and react-navigation's lister will not get called, thus not popping the screen.
      *
      *   Returning `false` will cause the event to bubble up and react-navigation's listener will pop the screen.
      * */

      if (this.props.goBack) {
        this.props.goBack();
        return true;
      }
      return false;
    };

    render() {

        return (
          <AndroidBackHandler onBackPress={() => this.onBackButtonPressAndroid()}>
            <View ref={REFS.CONTAINER}>
                <View style={styles.container}>
                  {this.props.goBack === undefined && this.props.drawerHandler === undefined && <View style={styles.leftButton}/>}
                  {this.props.goBack !== undefined && (
                      <TouchableOpacity onPress={() => this.props.goBack()}>
                        <View style={styles.leftButton}>
                          <Ionicons name={ICONS.BACK} size={32} color={COLORS.BLACK}/>
                        </View>
                      </TouchableOpacity>
                  )}
                  {this.props.drawerHandler !== undefined && (
                    <TouchableOpacity onPress={() => this.props.drawerHandler()}>
                      <View style={styles.leftButton}>
                        <Ionicons name={ICONS.MENU} size={32} color={COLORS.BLACK}/>
                      </View>
                    </TouchableOpacity>
                  )}
                  {this.props.title === undefined && this.props.searchHandler === undefined && <Image source={Images.DAILY_FULL} resizeMode='contain' style={styles.title}/>}
                  {this.props.title !== undefined && this.props.searchHandler === undefined && (
                    <View style={styles.title}>
                      <Text numberOfLines={1} ellipsizeMode={ALIGNMENTS.MIDDLE} style={styles.wordsTitle}>
                        {this.props.title}
                      </Text>
                    </View>)
                  }
                  {this.props.searchHandler !== undefined && (
                        <SearchBar
                        placeholder={"Search"}
                        containerStyle={styles.searchContainer}
                        lightTheme
                        onChangeText={this.props.onChangeText}
                        value={this.props.value}
                        autoCorrect={false}
                         />
                  )}

                  {this.props.toProfile ===  undefined &&
                    this.props.searchNavigator ===  undefined &&
                    this.props.share === undefined &&
                    <View style={styles.leftButton}/>
                  }

                  {this.props.share !== undefined &&
                    <TouchableOpacity onPress={this.shareHandler.bind(this)}>
                      <View style={styles.rightButton}>
                        <Ionicons name={ICONS.SHARE} size={32} color={COLORS.BLACK}/>
                      </View>
                    </TouchableOpacity>
                  }

                  {this.props.toProfile !== undefined && (
                    <TouchableOpacity onPress={this.toProfile.bind(this)}>
                      <View style={styles.rightButton}>
                        <Image source={Images.PROFILE} style={styles.profileImage}/>
                      </View>
                    </TouchableOpacity>
                  )}
                  {this.props.searchNavigator !== undefined && (
                    <TouchableOpacity onPress={() => this.props.searchNavigator()}>
                      <View style={styles.rightButton}>
                        <Ionicons name={ICONS.SEARCH} size={32} color={COLORS.BLACK}/>
                      </View>
                    </TouchableOpacity>
                  )}
                </View>
            </View>
          </AndroidBackHandler>
        )

    }
}
