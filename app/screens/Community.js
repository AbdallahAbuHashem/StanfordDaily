import React, { Component, SafeAreaView } from 'react';
import {
  View,
  StatusBar,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Text,
  ImageBackground,
  ActivityIndicator,
  Linking
} from 'react-native';
import styles from '../screens/styles/community';
import Header from './common/header';
import { Icon } from 'react-native-elements';
import { FONTS, COLORS, STRINGS, KEYS, MARGINS } from "../assets/constants";
import Tips from '../screens/Tips'
import { withNavigation } from 'react-navigation';
import { NavigationActions } from 'react-navigation';

const { width, height } = Dimensions.get('window');

class Community extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
          width: Dimensions.width
        };
    }

    componentDidMount() {
        console.log(STRINGS.TIPS_FORM_URL)
    }

    render() {
        return (
            <View>
                <Header />
                <View style={styles.container}>
                    <TouchableOpacity onPress={ () => {Linking.openURL('https://stanforddaily.com/about/')}} style={styles.box}>
                        <Icon name="info-circle" size={64} type="font-awesome" color={COLORS.NEAR_WHITE} />
                        <Text style={styles.titleText}>About Us</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={ () => {this.props.navigation.navigate('Tips', { link: STRINGS.TIPS_FORM_URL })}} style={styles.box}>
                        <Icon name="edit" size={64} type="font-awesome" color={COLORS.NEAR_WHITE} />
                        <Text style={styles.titleText}>Send Tips</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={ () => {this.props.navigation.navigate('Tips', { link: 'https://stanforddaily.com/donate/' })}} style={styles.box}>
                        <Icon name="dollar" size={64} type="font-awesome" color={COLORS.NEAR_WHITE} />
                        <Text style={styles.titleText}>Donate</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={ () => {Linking.openURL('https://stanforddaily.com/submitting-to-the-daily/')}} style={styles.box}>
                        <Icon name="file" size={64} type="font-awesome" color={COLORS.NEAR_WHITE} />
                        <Text style={styles.titleText}>Submit Work</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.box}>
                        <Icon name="comment" size={64} type="font-awesome" color={COLORS.NEAR_WHITE} />
                        <Text style={styles.titleText}>Give Feedback</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={ () => {Linking.openURL('https://alumni.stanforddaily.com/')}} style={styles.box}>
                        <Icon name="users" size={64} type="font-awesome" color={COLORS.NEAR_WHITE} />
                        <Text style={styles.titleText}>Alumni</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

export default withNavigation(Community)