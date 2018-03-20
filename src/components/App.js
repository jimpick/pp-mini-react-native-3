import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import PixelDoc from '../store/pixelDoc';
import MainView from './MainView';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    console.log('Jim1');
    this.pixelDoc = new PixelDoc()
    this.pixelDoc.on('update', doc => this.setState({doc}));
    this.pixelDoc.on('ready', () => {
      this.setState({
        sourceKey: this.pixelDoc.hm.source.key.toString('hex'),
        archiverKey: this.pixelDoc.hm.getArchiverKey().toString('hex')
      });
    });
  }

  setPixelColor(x, y, color) {
    console.log('Jim setPixelColor', x, y, color)
  }
  render() {
    return (
      <MainView
        doc={this.state.doc}
        setPixelColor={this.setPixelColor.bind(this)} />
    )
    /*
    return (
      <View style={styles.app}>
        <div className="info">
          Source: {this.state.sourceKey}<br />
          Archiver: {this.state.archiverKey}<br />
        </div>
        <pre>
          {JSON.stringify(this.state.doc, null, 2)}
        </pre>
      </View>
    );
    */
  }
}

const styles = StyleSheet.create({
  app: {
    // marginHorizontal: 'auto',
    // maxWidth: 500,
    alignItems: 'center',
    marginTop: 200
  },
  logo: {
    height: 80
  },
  header: {
    padding: 20
  },
  title: {
    fontWeight: 'bold',
    fontSize: '1.5rem',
    marginVertical: '1em',
    textAlign: 'center'
  },
  text: {
    lineHeight: '1.5em',
    fontSize: '1.125rem',
    marginVertical: '1em',
    textAlign: 'center'
  },
  link: {
    color: '#1B95E0'
  },
  code: {
    fontFamily: 'monospace, monospace'
  }
});
