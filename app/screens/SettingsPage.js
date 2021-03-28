import { MARGINS, FONTS, FONT_SIZES, COLORS, PN_RECEIVER_GROUPS } from '../assets/constants.js';
import React, { Component } from 'react';
import { Ionicons } from '@expo/vector-icons';
import Modal from "react-native-modal"
import {
    Platform,
    View,
    Text,
    TouchableOpacity,
    Switch,
} from 'react-native';
import _ from 'lodash';

import { isBeingNotified, addNotificationSetting, removeNotificationSetting } from './FollowInfoStorage.js';

const styles = {
  listItem: { 
    flex: 1, 
    maxHeight: 72, 
    flexDirection: 'row', 
    alignItems: 'center',
    borderBottomWidth: 1, 
    borderBottomColor: COLORS.LIGHT_GRAY
  },
  notifHeader: {
    fontSize: FONT_SIZES.DEFAULT_MEDIUM, 
    fontFamily: FONTS.OPEN_SANS_BOLD
  },
  notifText: {
    fontSize: 13, 
    fontFamily: FONTS.OPEN_SANS
  }
}
export default class SettingsPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOn: {
              [PN_RECEIVER_GROUPS.BREAKING]: false,
              [PN_RECEIVER_GROUPS.DAILY]: false,
              [PN_RECEIVER_GROUPS.WEEKLY]: false
            }
        };
    }

    async componentDidMount() {
      this.updateNotificationSettings();
    }

    async updateNotificationSettings() {
      this.setState({
        isOn: {
          [PN_RECEIVER_GROUPS.BREAKING]: await isBeingNotified(PN_RECEIVER_GROUPS.BREAKING),
          [PN_RECEIVER_GROUPS.DAILY]: await isBeingNotified(PN_RECEIVER_GROUPS.DAILY),
          [PN_RECEIVER_GROUPS.WEEKLY]: await isBeingNotified(PN_RECEIVER_GROUPS.WEEKLY)
        }
      });
    }

    async toggleNotificationSetting(name) {
      if (this.state.isOn[name]) {
        await removeNotificationSetting(name);
      }
      else {
        await addNotificationSetting(name);
      }
      await this.updateNotificationSettings();
    }

    ToggleSwitch = ({receiverGroup}) => {
      return <Switch
        value={this.state.isOn[receiverGroup]}
        ios_backgroundColor={COLORS.LIGHT_GRAY}
        onValueChange={ () => {this.toggleNotificationSetting(receiverGroup);} }
        style={{ transform: [{ scaleX: .8 }, { scaleY: .8 }] }}
      />
        
      {/*<ToggleSwitch // doesn't seem to work
      isOn={this.state.isOn[receiverGroup]}
      onColor='maroon'
      offColor='grey'
      size='small'
      onToggle={ () => {this.toggleNotificationSetting(receiverGroup); console.log(receiverGroup)} }
      />*/}
    }

    render() {
      return (
        <Modal
            style = {{
              backgroundColor: 'white'}}
              isVisible={this.props.visible}
              >

          {/* Header */}
          <View
            style = {{
              marginLeft: 0,
              borderBottomWidth: 1,
              borderColor: COLORS.LIGHT_GRAY,
              justifyContent: 'center',
              flex: 1,
              padding: MARGINS.ARTICLE_SIDES,
              maxHeight: 96,
            }}>

            <Text style= {{
              color: COLORS.BLACK,
              fontFamily: FONTS.OPEN_SANS_BOLD,
              fontSize: FONT_SIZES.DEFAULT_SMALL_MEDIUM,
              marginBottom: MARGINS.DEFAULT_SMALL_MARGIN,
            }}>Notifications</Text>

            <Text style= {{
              fontFamily: FONTS.OPEN_SANS
            }}>How often do you want to hear from The Daily?</Text>
          </View>

          <View
            style = {{
              flex: 2,
              backgroundColor: 'white',
            }}>

            <View style = {styles.listItem}>
              <View style = {{flex: 1, alignItems: 'center'}}>
                <Ionicons name={Platform.OS === 'ios' ? 'ios-globe' : 'md-globe'} size={24} />
              </View>

              <View style = {{flex: 4}}>
                <Text style = {styles.notifHeader}>Breaking News</Text>
                <Text style = {styles.notifText}>Important stories, as they happen</Text>
              </View>

              <View style = {{margin: 15, flex: 1, alignItems: 'center'}}>
              <this.ToggleSwitch receiverGroup={PN_RECEIVER_GROUPS.BREAKING}/>
              </View>
            </View>

            <View style = {styles.listItem}>
              <View style = {{flex: 1, alignItems: 'center'}}>
                <Ionicons name={Platform.OS === 'ios' ? 'ios-sunny' : 'md-sunny'} size={28} />
              </View>

              <View style = {{flex: 4}}>
                <Text style = {styles.notifHeader}>Every day</Text>
                <Text style = {styles.notifText}>Daily news roundup</Text>
              </View>

              <View style = {{margin: 15, flex: 1, alignItems: 'center'}}>
              <this.ToggleSwitch receiverGroup={PN_RECEIVER_GROUPS.DAILY}/>
              </View>
            </View>

            <View style = {styles.listItem}>
              <View style = {{flex: 1, alignItems: 'center'}}>
                <Ionicons name={Platform.OS === 'ios' ? 'ios-calendar' : 'md-calendar'} size={22} />
              </View>

              <View style = {{flex: 4}}>
                <Text style = {styles.notifHeader}>Every week</Text>
                <Text style = {styles.notifText}>Weekend roundup</Text>
              </View>

              <View style = {{margin: 15, flex: 1, alignItems: 'center'}}>
              <this.ToggleSwitch receiverGroup={PN_RECEIVER_GROUPS.WEEKLY}/>
              </View>
            </View>

          </View>


          <View style = {{margin: 20, alignItems: 'center'}}>
              <TouchableOpacity
                style = {{
                  alignItems: 'center',
                  justifyContent: 'center', 
                  height: 40,
                  width: 200,
                  borderRadius: 4,
                  backgroundColor: COLORS.CARDINAL}}
                onPress={() => {this.props.setModalVisible(!this.props.modalVisible);
                }}>
                <Text style={{
                  alignSelf: 'center',
                  color: 'white',
                  fontFamily: FONTS.OPEN_SANS_BOLD,
                  fontSize: FONT_SIZES.DEFAULT_MEDIUM,
                  }}>Close</Text>
              </TouchableOpacity>
            </View>
          </Modal>
      )
    }
}
