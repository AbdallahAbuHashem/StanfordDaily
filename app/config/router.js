import React from 'react';
import { createBottomTabNavigator, createStackNavigator, createAppContainer } from 'react-navigation';
import {Image, Dimensions} from 'react-native';
import {HEIGHTS, ICONS, COLORS} from '../assets/constants.js';
import { Ionicons } from '@expo/vector-icons';
import Headlines from '../screens/Headlines';
import Search from '../screens/Search';
import Post from '../screens/Post';
import Tips from "../screens/Tips";
import Category from '../screens/Category.js';
import Community from '../screens/Community.js'
import Author from '../screens/Author.js'

const iphone_x = Dimensions.get('window').height == 812;
const labelBottomMargin = 3;
const tabBarHeight = HEIGHTS.TAB_BAR_HEIGHT;

const SearchStack = createStackNavigator({
  Search: {
    screen: Search,
    navigationOptions: {
      title: 'Search',
    },
  },
  Post: {
    screen: Post,
    navigationOptions: {
      title: 'Post',
    },
  },
}, {
  headerMode: 'none',
});

const NewsStack = createStackNavigator({
  Headlines: {
    screen: Headlines,
    navigationOptions: {
      title: 'Headlines',
    },
  },
  Search: {
    screen: Search
  },
  Post: {
    screen: Post,
    navigationOptions: {
      title: 'Post',
      headerStyle: {
        backgroundColor: 'transparent',
        position: 'absolute',
        height: 50,
        top: 0,
        left: 0,
        right: 0,
      },
    },
    headerMode: 'screen'
  },
  Category: {
    screen: Category,
    navigationOptions: {
      title: 'Category'
    }
  },
  Author: {
    screen: Author
  }
}, {
  headerMode: 'none',
});

const CommunityStack = createStackNavigator({
  Community: {
    screen: Community,
    navigationOptions: {
      title: 'Community'
    }
  },
  Tips: {
    screen: Tips,
  }
}, {
  headerMode: 'none',
});

export const Tabs = createBottomTabNavigator({
  News: {
    screen: NewsStack,
    navigationOptions: {
      tabBarLabel: 'Daily News',
      tabBarIcon: ({ tintColor }) => <Image
        source={require('../media/Daily.png')}
        style={{tintColor: tintColor, width: 25, height: 25, marginTop: 6}}
      />,
      // tabBarOnPress: (scene, jumpToIndex) => {
      //     Amplitude.logEvent(STRINGS.SWITCHED_SCREEN, {NewScreen: STRINGS.NEWS});
      //     jumpToIndex(scene.index);
      // },
    },
  },
  Community: {
    screen: CommunityStack,
    navigationOptions: {
      tabBarLabel: 'Community',
      tabBarIcon: ({ tintColor }) => <Ionicons name={ICONS.TIPS_PAGE} size={27} color={tintColor} style={{ marginTop: 5 }} />
    },
  }
},{
  tabBarOptions: {
    activeTintColor: COLORS.CARDINAL,
    inactiveTintColor: '#000000',
    inactiveBackgroundColor: 'white',
    activeBackgroundColor: 'white',
    labelStyle: {
      fontFamily: "Open Sans", // FONTS.PT_SERIF
      marginBottom: labelBottomMargin
    },
    style: {
      height: tabBarHeight,
      // Ref:
      // https://github.com/react-navigation/react-navigation/issues/3882
      // https://github.com/react-navigation/react-navigation/issues/3055
      // So we have to hard-code the marginBottom to avoid extra gap.
      marginBottom: iphone_x ? -34 : 0
    }
  },
  lazy: true
});

const Root = createStackNavigator({
  Tabs: {
    screen: Tabs,
  },
  Search: {
    screen: SearchStack,
  },
}, {
  mode: 'modal',
  headerMode: 'none'
});

// https://reactnavigation.org/docs/en/app-containers.html
export const RootContainer = createAppContainer(Root);
