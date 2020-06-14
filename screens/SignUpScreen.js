import React from 'react';
import { Alert, AsyncStorage, Text, TextInput, View, TouchableOpacity } from 'react-native';
import firebase from 'firebase';
import User from '../User';
import styles from '../constants/style';
import Loading from 'react-native-whc-loading';

export default class SignUpScreen extends React.Component {
	static navigationOptions = {
		header: null,
	};
	state = {
        username: '',
        name:'',
        password:'',
		rePassword:'',
		checkExisted: null,
		userID: 0,
		listFriend: ['user1', 'user2', 'user3'],
		listBan:['user4'],
		listRequest:['user5'],
		avatar: "https://firebasestorage.googleapis.com/v0/b/fir-chat-ffbb9.appspot.com/o/images%2Favatar%2Fdf.png?alt=media&token=c17a4c1b-f661-4e8e-80ed-4edeb56173b2",
	};
	handleChange = (key) => (val) => {
		this.setState({ [key]: val });
	};
	submitForm= async()=>{
    if(this.state.username.length < 4 ){
      Alert.alert('Error', 'Tài khoản phải có ít nhất 4 kí tự')
    }
    else if(this.state.password.length < 4){
      Alert.alert('Error', 'Mật khẩu phải chứa ít nhất 4 kí tự')
    }
    else if(this.state.password!= this.state.rePassword){
        Alert.alert('Error', 'Mật khẩu nhập lại chưa trùng khớp!')
    }
    else{
		await AsyncStorage.setItem('username', this.state.username);
		User.username = this.state.username;
		await firebase
			.database()
			.ref('users/' + User.username)
			.child('password')
			.once('value', (snapshot) => {
				this.state.checkExisted = snapshot.val();
			});
		this.refs.loading.show();
		if(this.state.checkExisted != null ){
			Alert.alert('Error', 'Username đã được sử dụng');
			this.refs.loading.show(false);
		}
		else{
			
			await firebase.database()
				.ref('users/')
				.once('value')
				.then((snapshot) => {
					this.state.userID = snapshot.numChildren()+1;
					this.state.userID = '000000' + this.state.userID;
					this.state.userID = this.state.userID.substr(-6);
				});
			await firebase
				.database()
				.ref('users/' + User.username)
				.set({
					name: this.state.name,
					password: this.state.password,
					userID: this.state.userID,
					listFriend: this.state.listFriend,
					listBan: this.state.listBan,
					listRequest: this.state.listRequest,
					avatar: this.state.avatar,
				});
			const response = await fetch(
				'https://firebasestorage.googleapis.com/v0/b/fir-chat-ffbb9.appspot.com/o/images%2Favatar%2Fdf.png?alt=media&token=c17a4c1b-f661-4e8e-80ed-4edeb56173b2'
			);
			const blob = await response.blob();

			var ref = await firebase
				.storage()
				.ref()
				.child('images/avatar/' + this.state.name);
			ref.put(blob);
			this.refs.loading.show(false);
			// console.log(this.state.userID);
			this.props.navigation.navigate('App');
		}
		
    }
  }
    goToLogin=()=>{
        this.props.navigation.navigate('Auth');
    }
	render() {
		return (
			<View style={styles.container}>
				<TextInput
					placeholder="Tài khoản"
					style={styles.input}
					value={this.state.username}
					onChangeText={this.handleChange('username')}
				/>
				<TextInput
					placeholder="Tên hiển thị"
					style={styles.input}
					value={this.state.name}
					onChangeText={this.handleChange('name')}
				/>
				<TextInput
					placeholder="Mật khẩu"
					style={styles.input}
					secureTextEntry={true}
					value={this.state.password}
					onChangeText={this.handleChange('password')}
				/>
				<TextInput
					placeholder="Nhập lại mật khẩu"
					style={styles.input}
					secureTextEntry={true}
					value={this.state.rePassword}
					onChangeText={this.handleChange('rePassword')}
				/>
				<TouchableOpacity onPress={this.submitForm}>
					<Text style={styles.btnText}>Đăng kí</Text>
				</TouchableOpacity>
				<TouchableOpacity onPress={this.goToLogin}>
					<Text style={styles.btnText}>Quay lại màn hình đăng nhập</Text>
				</TouchableOpacity>
				<Loading
					ref="loading"
					backgroundColor="#ffffff"
					indicatorColor= ' #00ffcc'
				/>
			</View>
		);
	}
}
