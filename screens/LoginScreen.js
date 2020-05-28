import React from 'react';
import { Alert,AsyncStorage, Text,TextInput, View,TouchableOpacity } from 'react-native';
import firebase from 'firebase';
import User from '../User';
import styles from '../constants/style';


export default class App extends React.Component{
  static navigationOptions ={
    header: null,
  }
  state={
    phone: '',
    name:''
  }
  handleChange= key=> val=> {
    this.setState({[key]: val})
  }
  // componentDidMount(){
  //   AsyncStorage.getItem('userPhone').then(val=>{
  //     if(val){ 
  //       this.setState({phone: val})
  //     }
  //   })
  // }
  submitForm= async()=>{
    if(this.state.phone.length <10 ){
      Alert.alert('Error', 'wrong phone number')
    }
    else if(this.state.name.length<3){
      Alert.alert('Error', 'Wrong name')
    }
    else{
      await AsyncStorage.setItem('userPhone', this.state.phone);
      User.phone=this.state.phone;
      firebase.database().ref('users/'+ User.phone).set({name:  this.state.name});
      this.props.navigation.navigate('App');
    }
  }
  render(){
    return (
      <View style={styles.container}>
        <TextInput
          placeholder="Phone number"
          keyboardType='number-pad'
          style={styles.input}
          value={this.state.phone}
          onChangeText={this.handleChange('phone')}
        />
        <TextInput
          placeholder="Name"
          style={styles.input}
          value={this.state.name}
          onChangeText={this.handleChange('name')}
        />
        <TouchableOpacity onPress={this.submitForm}>
          <Text style={styles.btnText} >Enter</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
}


