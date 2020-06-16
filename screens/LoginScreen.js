import React from 'react';
import { Alert, AsyncStorage, Text, TextInput, View, TouchableOpacity } from 'react-native';
import firebase from 'firebase';
import User from '../User';
import styles from '../constants/style';
import Loading from 'react-native-whc-loading';

export default class App extends React.Component {
	static navigationOptions = {
		header: null,
	};
	state = {
		username: '',
		password: '',
		checkPass: '',
	};
	handleChange = (key) => (val) => {
		this.setState({ [key]: val });
	};
	submitForm = async() => {
		if (this.state.username.length < 4) {
			Alert.alert('Error', 'Tài khoản phải có ít nhất 4 kí tự');
		} else if (this.state.password.length < 4) {
			Alert.alert('Error', 'Mật khẩu phải chứa ít nhất 4 kí tự');
		} else {
			this.refs.loading.show();
			await AsyncStorage.setItem('username', this.state.username);
			User.username = this.state.username;
			await firebase
				.database()
				.ref('users/' + User.username)
				.child('password')
				.once('value', (snapshot) => {
					this.state.checkPass = snapshot.val();
				});
			this.refs.loading.show(false);
			if (this.state.password == this.state.checkPass) {
				this.props.navigation.navigate('App');
			} else {
				Alert.alert('Đăng nhập không thành công', 'Tài khoản hoặc mật khẩu bạn nhập chưa đúng');
			}
		}
	};
	singUp = () => {
		this.props.navigation.navigate('SignUp');
	};
	render() {
		return (
			<View style={styles.container}>
				<TextInput
					placeholder="Tài khoản"
					autoFocus={true}
					style={styles.input}
					value={this.state.username}
					onChangeText={this.handleChange('username')}
				/>
				<TextInput
					placeholder="Mật khẩu"
					secureTextEntry={true}
					style={styles.input}
					value={this.state.password}
					onChangeText={this.handleChange('password')}
				/>
				<TouchableOpacity onPress={this.submitForm}>
					<Text style={styles.btnChange}>Đăng nhập</Text>
				</TouchableOpacity>
				<TouchableOpacity onPress={this.singUp}>
					<Text style={styles.btnText}>Bạn chưa có tài khoản? Đăng kí tại đây</Text>
				</TouchableOpacity>
				<Loading ref="loading" backgroundColor="#ffffff" indicatorColor=" #00ffcc" />
			</View>
		);
	}
}
