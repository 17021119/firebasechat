import React from 'react'
import { SafeAreaView, Text, TextInput, Alert, AsyncStorage } from 'react-native';
import User from '../User'
import styles from '../constants/style'
import { TouchableOpacity } from 'react-native-gesture-handler'
import firebase from 'firebase'

export default class ProfileScreen extends React.Component{
    static navigationOptions={
        title:'Profile'
    }

    state={
        name: User.name
    }
    _logOut= async () =>{
        await AsyncStorage.clear();
        this.props.navigation.navigate('Auth');
    }
    handleChange= key => val =>{
        this.setState({[key] : val})
    }
    changeName= async () => {
        if(this.state.name.length< 3){
            Alert.alert('Error', 'Please enter valid name' );
        }
        else if(User.name!= this.state.name){
            firebase.database().ref('users').child(User.phone).set({ name: this.state.name });
            User.name=this.state.name;
            Alert.alert('Success', 'Name changed successfull');
        }
    }
    render(){
        return (
			<SafeAreaView style={styles.container}>
				<Text style={{fontSize: 20}}>
                    {User.phone}
                </Text>
                <TextInput
                    value={this.state.name}
                    onChangeText={this.handleChange('name')}
                    style= {styles.input}
                />
                <TouchableOpacity>
                    <Text onPress={this.changeName} style={styles.btnText}>Change Name</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                    <Text onPress={this._logOut} style={styles.btnText}>LogOut</Text>
                </TouchableOpacity>
			</SafeAreaView>
		);
    }
}