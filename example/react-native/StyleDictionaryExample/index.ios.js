/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  View
} from 'react-native';
import * as COLORS from './styleDictionary/colors';

export default class StyleDictionaryExample extends Component {
  render() {
    const colors = Object.keys(COLORS);
    return (
      <View style={styles.container}>
        {colors.map((color) => {
          return (
            <View key={color} style={[styles.colorBox, {backgroundColor: COLORS[color]}]} />
          );
        })}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  colorBox: {
    flex: 1
  }
});

AppRegistry.registerComponent('StyleDictionaryExample', () => StyleDictionaryExample);
