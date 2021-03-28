import React, { Component, useRef } from 'react';
import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import "moment-timezone";
import _ from "lodash";
import HTML from '../../HTML';
import styles from '../styles/card-style';
import Carousel, { Pagination } from 'react-native-snap-carousel';

const { width, height } = Dimensions.get('window');

export default class CardRow extends Component {  

    constructor(props) {
        super(props)
        this.state = {
            scrollPosition: 0
          }
    }

    render() {
        const { data, renderItem, title, onPress } = this.props;
        
        return (
            <View style={styles.content}>
                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                    <HTML containerStyle={styles.titleContainer} baseFontStyle={styles.header} html={title} />
                    <TouchableOpacity style={styles.more} onPress={onPress}>
                        <Text style={styles.titleContainer, styles.titleFont, styles.seeAll}>See All</Text>
                    </TouchableOpacity>
                </View>
                <FlatList
                    style={styles.videos_flatList}
                    horizontal={true}
                    data={data}
                    snapToAlignment={"start"}
                    snapToInterval={width/2}
                    decelerationRate={"fast"}
                    showsHorizontalScrollIndicator={false}
                    pagingEnabled
                    renderItem={renderItem}
                    onScroll={e => {this.setState({scrollPosition: e.nativeEvent.contentOffset.x})}}
                />
                {data &&
                    <Pagination activeDotIndex={Math.round(this.state.scrollPosition/width)} dotsLength={Object.keys(data).length/2} containerStyle={{ paddingVertical: 5 }}/>
                }
            </View>
        );
      }
}