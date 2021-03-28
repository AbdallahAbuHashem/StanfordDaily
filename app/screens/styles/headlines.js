import React from 'react-native';
const {StyleSheet, Dimensions} = React;
const {width, height} = Dimensions.get('window');
import {COLORS, FONTS, ALIGNMENTS, MARGINS, HEIGHTS, FONT_SIZES} from '../../assets/constants.js';

const top_padding = 0;

const styles= StyleSheet.create({
    container: {
        flex: 1,
        width,
        height,
    },
    loadingIndicator: {
      marginTop: MARGINS.DEFAULT_MARGIN,
      marginBottom: MARGINS.DEFAULT_MARGIN
    },
    sideMenuContainer: {
      flex: 1,
      backgroundColor: COLORS.WHITE,
      alignItems: ALIGNMENTS.CENTER,
      paddingTop: top_padding
    },
    sideBarTitle: {
      height: HEIGHTS.APP_HEADER,
      justifyContent: ALIGNMENTS.CENTER,
      borderBottomWidth: 1,
      alignSelf: 'stretch',
      flexDirection: 'column',
      paddingTop: MARGINS.NORMAL_HEADER_MARGINS,
      borderBottomColor: COLORS.LIGHT_GRAY,
    },
    sideBarTitleText: {
      color: COLORS.BLACK,
      fontFamily: FONTS.PT_SERIF_BOLD,
      fontSize: FONT_SIZES.DEFAULT_SMALL_MEDIUM,
      //textAlign: 'center',
      flex: 1,
      justifyContent: 'center',
      marginLeft: MARGINS.DEFAULT_MARGIN
    },
    flatListStyle: {
      flex: 1,
      width: '100%',
    },
    sideMenuItem: {
      width: '100%',
      flexDirection: ALIGNMENTS.ROW,
      height: HEIGHTS.SIDE_MENU_ITEM,
      alignItems:  ALIGNMENTS.CENTER,
    },
    separator: {
      borderBottomColor: COLORS.LIGHT_GRAY,
      borderBottomWidth: 1,
    },
    categoriesHeaderContainer: {
      height: 60,
      backgroundColor: COLORS.WHITE,
      alignItems: ALIGNMENTS.LEFT,
      justifyContent: ALIGNMENTS.LEFT,
    },
    categoriesText: {
      marginTop: MARGINS.DEFAULT_MARGIN,
      marginLeft: MARGINS.ARTICLE_SIDES, //match category side with article edge
      fontFamily:FONTS.CENTURY,
      fontSize:25,
      flex: 2,
    },
    header: {
      fontFamily: FONTS.PT_SERIF_BOLD,
      fontSize: FONT_SIZES.DEFAULT_LARGE + 10,
    },
    satire: {
      fontFamily: FONTS.PT_SERIF_BOLD,
      fontSize: FONT_SIZES.DEFAULT_LARGE + 10,
      color: COLORS.NEAR_WHITE
    },
    titleFont: {
      fontFamily: FONTS.PT_SERIF_BOLD,
      fontSize: FONT_SIZES.DEFAULT_MEDIUM_SMALL,
    },
    titleContainer: {
      marginTop: MARGINS.DEFAULT_SMALL_MARGIN,
      marginHorizontal: MARGINS.ARTICLE_SIDES
    },
    more: {
      backgroundColor: COLORS.LIGHT_GRAY,
      marginTop: MARGINS.DEFAULT_SMALL_MARGIN,
      marginHorizontal: MARGINS.ARTICLE_SIDES,
      justifyContent: 'center',
      borderRadius: 10
    },
    seeAll: {
      paddingHorizontal: 15,
      fontFamily: FONTS.PT_SERIF_BOLD
    }
})

module.exports = styles
