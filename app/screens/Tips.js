import React, { useRef } from "react";
import { View, Text, Linking } from 'react-native';
import { WebView } from "react-native-webview";
import { STRINGS } from "../assets/constants";
import Header from './common/header';

/*
 * Tips page.
 * Embeds a Google Form whose URL is hardcoded in STRINGS.TIPS_FORM_URL.
 * This same Google Form also shows up at https://www.stanforddaily.com/tips/
 */
const Tips = (props) => {
  const webview = useRef();
  return (
    <View style={{ flex: 1 }}>
      <Header goBack={() => props.navigation.goBack()} />
      <WebView
      ref={webview}
      source={{ uri: props.navigation.state.params.link }}
      // onNavigationStateChange={(event) => {
      //   // Open all links in a new window, except for the "Submit another response" link:
      //   if (!event.url.startsWith(STRINGS.TIPS_FORM_URL_PREFIX)) {
      //     webview.current.stopLoading();
      //     Linking.openURL(event.url);
      //   }
      // }}
    />
      
    </View>
  );
}

export default Tips