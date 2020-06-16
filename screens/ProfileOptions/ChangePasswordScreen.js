import React from 'react';
import { View, Text, TextInput, Alert } from 'react-native';
import styles from '../../constants/style';
import { TouchableOpacity } from 'react-native-gesture-handler';
import firebase from 'firebase';
import User from '../../User';
import SweetAlert from 'react-native-sweet-alert';
import Loading from 'react-native-whc-loading';

export default class ChangePasswordScreen extends React.Component {
	static navigationOptions = ({ navigation }) => {
		return {
			title: 'Đổi mật khẩu',
		};
	};
	// constructor(props){
	// 	super(props);
	// 	this.state = {
	// 		passwordCurrent: '',
	// 		password: '',
	// 		rePassword: '',
	// 		checkPassword:'',
	// 	};
	// }

	state = {
			passwordCurrent: '',
			password: '',
			rePassword: '',
			checkPassword:'',
		};
	
	handleChange = (key) => (val) => {
		this.setState({ [key]: val });
	};
	changePassword= async() =>{
		if(this.state.password != this.state.rePassword){
			Alert.alert('Lỗi', 'Mật khẩu nhập lại chưa trùng!')
		}else if(this.state.password.length< 4){
			Alert.alert('Lỗi', 'Mật khẩu phải từ 4 kí tự trở lên!');
		}else{
			this.refs.loading.show();
			await firebase
				.database()
				.ref('users/' + User.username)
				.child('password')
				.once('value', (snapshot) => {
					this.state.checkPassword = snapshot.val();
				});
			if(this.state.checkPassword == this.state.passwordCurrent){
				firebase
					.database()
					.ref('users/' + User.username)
					.update({ password: this.state.password }, function (error) {
						if (error) {
							// this.refs.loading.show(false);
							Alert.alert('Thất bại', 'Thay đổi không thành công!');
							console.log(error);
							
						} else {
							// this.refs.loading.show(false);
							Alert.alert('Thành công', 'Thay đổi mật khẩu thành công!');
							console.log(error);
						}
					});
			}else if(this.state.checkPassword != this.state.passwordCurrent){
				// this.refs.loading.show(false);
				Alert.alert('Thất bại', 'Bạn nhập chưa đúng mật khẩu cũ!');
			}
			this.refs.loading.show(false);
		}
	}
	render() {
		return (
			<View style={styles.container}>
				<TextInput
					placeholder="Mật khẩu hiện tại"
					style={styles.input}
					autoFocus={true}
					secureTextEntry={true}
					value={this.state.passwordCurrent}
					onChangeText={this.handleChange('passwordCurrent')}
				/>
				<TextInput
					placeholder="Mật khẩu mới"
					style={styles.input}
					secureTextEntry={true}
					value={this.state.password}
					onChangeText={this.handleChange('password')}
				/>
				<TextInput
					placeholder="Nhập lại mật khẩu mới"
					style={styles.input}
					secureTextEntry={true}
					value={this.state.rePassword}
					onChangeText={this.handleChange('rePassword')}
				/>
				<TouchableOpacity>
					<Text style={styles.btnChange} onPress={this.changePassword} >
						Lưu
					</Text>
				</TouchableOpacity>
				<Loading ref="loading" backgroundColor="#ffffff" indicatorColor=" #00ffcc" />
			</View>
		);
	}
}

