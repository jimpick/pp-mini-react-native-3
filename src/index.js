import { AppRegistry } from 'react-native';
import App from './components/App';
import PixelDoc from './store/pixelDoc';

const pixelDoc = new PixelDoc(doc => {
  console.log('Jim updated', doc);
});

AppRegistry.registerComponent('App', () => App);

AppRegistry.runApplication('App', {
  rootTag: document.getElementById('root')
});
