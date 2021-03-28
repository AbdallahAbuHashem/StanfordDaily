/*
 * Styles used in the individual post view (Post.js).
 */
import { COLORS, FONTS, ALIGNMENTS, MARGINS, HEIGHTS, FONT_SIZES, STRINGS } from '../../assets/constants.js';
import { Dimensions } from 'react-native'
const { width, height } = Dimensions.get('window'); //Dimensions of the current device screen
export default {
  title: {
    marginTop: MARGINS.ARTICLE_SIDES,
    marginHorizontal: MARGINS.ARTICLE_SIDES,
  },
  titleText: {
    fontSize: FONT_SIZES.DEFAULT_EXTRA_LARGE,
    fontFamily: FONTS.PT_SERIF_BOLD,
    color: COLORS.WHITE,
    textShadowColor: 'rgba(0, 0, 0, 1)',
  textShadowOffset: {width: -1, height: 1},
  textShadowRadius: 10
  },
  imageBackground: {
    width: width,
    height: 240,
    flex: 1,
    resizeMode: 'cover'
  },
  caption: { 
    marginHorizontal: MARGINS.ARTICLE_SIDES, 
    marginTop: MARGINS.DEFAULT_SMALL_MARGIN,
    marginBottom: 0,
    fontFamily: FONTS.OPEN_SANS, 
    fontSize: FONT_SIZES.DEFAULT_SMALL, 
    color: COLORS.DARK_GRAY,
    lineHeight: FONT_SIZES.DEFAULT_SMALL + 4,
  },
  subtitleText: {
    fontSize: FONT_SIZES.DEFAULT_MEDIUM,
    fontFamily: FONTS.PT_SERIF,
    color: COLORS.DARK_GRAY,
  },
  authorAndDate: {
    marginHorizontal: MARGINS.ARTICLE_SIDES,
    marginBottom: MARGINS.DEFAULT_LARGE_MARGIN,
  },
  date: { 
    marginTop: MARGINS.DEFAULT_SMALL_MARGIN, 
    fontFamily: FONTS.OPEN_SANS, 
    color: COLORS.DARK_GRAY, 
    fontSize: FONT_SIZES.DEFAULT_SMALL 
  },
  category: {
    marginTop: MARGINS.DEFAULT_SMALL_MARGIN,
    fontFamily: FONTS.PT_SERIF,
    color: 'black',
    fontSize: FONT_SIZES.DEFAULT_SMALL_MARGIN,
    backgroundColor: COLORS.LIGHT_GRAY,
    padding: 5,
  },
  articleText: {
    fontSize: FONT_SIZES.DEFAULT_SMALL_MEDIUM,
    lineHeight: 26,
  },
};