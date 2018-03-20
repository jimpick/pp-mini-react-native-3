import React, { Component } from 'react';
import {
  Dimensions,
  Text,
  TouchableHighlight,
  TouchableWithoutFeedback,
  View,
  StyleSheet,
} from 'react-native';

const colors = ['r', 'g', 'b', 'w'];
const cssColorMap = {
  r: 'red',
  g: 'green',
  b: 'blue',
  w: 'white',
};

export default class MainView extends Component {
  constructor(props) {
    super(props);
    this.state = { selectedColor: 'r' };
  }
  render() {
    const { doc, setPixelColor } = this.props;
    const { width, height } = Dimensions.get('window');
    console.log('Jim dimensions', width, height);
    const palette = colors.map(color => {
      const style = {
        backgroundColor: cssColorMap[color],
      };
      if (color === this.state.selectedColor) {
        style.borderWidth = 6;
      }
      return (
        <TouchableHighlight
          key={color}
          underlayColor="white"
          onPress={() => this.setState({ selectedColor: color })}>
          <View style={[styles.paletteColor, style]} />
        </TouchableHighlight>
      );
    });
    const pixels = [];
    for (let y = 0; y <= 1; y++) {
      for (let x = 0; x <= 1; x++) {
        const pixelStyle = {
          width: width / 3,
          height: width / 3,
          backgroundColor: cssColorMap[doc[`x${x}y${y}`]]
        };
        pixels.push(
          <TouchableWithoutFeedback
            key={`x${x}y${y}`}
            onPress={() => setPixelColor(x, y, this.state.selectedColor)}>
            <View style={[styles.pixel, pixelStyle]} />
          </TouchableWithoutFeedback>
        );
      }
    }
    return (
      <View style={styles.container}>
        <View style={styles.infoBox}>
          <Text style={styles.info}>Source:</Text>
          <Text style={styles.info}>
            8b641b23d0d39aae04b037107e69e43d240fca9c13c79f3f22218ae84c152ac9
          </Text>
          <Text style={styles.info}>Archiver:</Text>
          <Text style={styles.info}>
            e6d7c38645abdeea15966d3dcb0ed1e9a1f2e7c9e95b786f23ab4519f7f109dc
          </Text>
          <View style={styles.divider} />
          <Text style={styles.info}>
            8b641b23d0d39aae04b037107e69e43d240fca9c13c79f3f22218ae84c152ac9
          </Text>
          <Text style={styles.info}>
            b9c5b1..e8 63
          </Text>
          <Text style={styles.info}>
            3a411fe668f12e7ecd6c6fd4c1e509441bfabf6ff0a4aa29076345b2c81b2ad3
          </Text>
          <Text style={styles.info}>
            c2d9cc..76 64
          </Text>
          <Text style={styles.info}>
            d2035befde293bc4e90e0302e355e9c0223bf5992ef907827a5d080331c8192e
          </Text>
          <Text style={styles.info}>
            8d0c15..b0 15
          </Text>
          <Text style={styles.info}>
            9adbd2605c1affa99ca2290753b7a250c496c6ca59d69ef6c14aadb307d503aa
          </Text>
          <Text style={styles.info}>
            f4b291..91 37
          </Text>
          <Text style={styles.info}>
            19012a0c11b391c68dbe1a0d4224664ba783f04a3f0a57bc4a8b462657ed0f1f
          </Text>
          <Text style={styles.info}>
            5f4082..ca 68
          </Text>
        </View>
        <View style={styles.palette}>
          {palette}
        </View>
        <View style={styles.pixels}>
          {pixels}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
  },
  infoBox: {
    flex: 0,
    width: '100%',
    padding: 10,
  },
  info: {
    fontSize: 7,
  },
  divider: {
    borderBottomWidth: 1,
    width: '100%',
    margin: 5,
  },
  palette: {
    flex: 0,
    borderWidth: 1,
    width: '100%',
    padding: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  paletteColor: {
    width: 60,
    height: 60,
  },
  pixels: {
    flex: 1,
    width: '100%',
    padding: 40,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  pixel: {
    width: 120,
    height: 120,
    margin: 10,
  },
});
