import React from 'react-native';
const {StyleSheet, Dimensions} = React;
const {width, height} = Dimensions.get('window');
//width = width <= height ? width : height;
import {COLORS, FONTS, ALIGNMENTS, MARGINS, HEIGHTS, FONT_SIZES, STRINGS} from '../../assets/constants.js';

const styles = ({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingTop: 40
  },
  box: {
    width: width/2 -2*MARGINS.DEFAULT_SMALL_MARGIN,
    height: width/2 - 2*MARGINS.DEFAULT_SMALL_MARGIN,
    backgroundColor: COLORS.CARDINAL,
    margin: MARGINS.DEFAULT_SMALL_MARGIN,
    justifyContent: 'center'
  },
  titleText: {
    fontSize: FONT_SIZES.DEFAULT_EXTRA_LARGE,
    fontFamily: FONTS.PT_SERIF_BOLD,
    color: COLORS.WHITE,
    textAlign: 'center'
  }
})

module.exports = styles