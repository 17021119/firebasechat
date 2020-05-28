import React from 'react';
import {
  ActivityIndicator,
  AsyncStorage,
  StatusBar,
  View,
} from 'react-native';
import firebase from 'firebase';
import 'firebase/firestore'
import User from '../User'
// require('firebase/firestore')

export default class AuthLoadingScreen extends React.Component {
  constructor(props) {
    super(props);
    this._bootstrapAsync();
  }
  componentWillMount(){
    const firebaseConfig = {
      apiKey: "AIzaSyCUp7KNTOSl-5VhXwu82Ya4PmbFPV80f4k",
      authDomain: "fir-chat-ffbb9.firebaseapp.com",
      databaseURL: "https://fir-chat-ffbb9.firebaseio.com",
      projectId: "fir-chat-ffbb9",
      storageBucket: "fir-chat-ffbb9.appspot.com",
      messagingSenderId: "859362567665",
      appId: "1:859362567665:web:f28629f4cd245406039050",
      measurementId: "G-J28QS78ZMK"
    };
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
        // firebase.analytics();
      }
}


  _bootstrapAsync = async () => {
    User.phone = await AsyncStorage.getItem('userPhone');
    this.props.navigation.navigate(User.phone ? 'App' : 'Auth');
  };

  // Render any loading content that you like here
  render() {
    return (
      <View>
        <ActivityIndicator />
        <StatusBar barStyle="default" />
      </View>
    );
  }
}