import React from 'react';
import { View, Text, TextInput, Alert } from 'react-native';
import styles from '../../constants/style';
import { TouchableOpacity } from 'react-native-gesture-handler';
import firebase from 'firebase';
import User from '../../User'

export default class ChangeNameScreen extends React.Component {
	static navigationOptions = ({ navigation, route }) => {
		return {
			title: 'Đổi tên',
		};
	};
	state={
		name: User.name,
	}
	handleChange = (key) => (val) => {
		this.setState({ [key]: val });
	};
	changeName = async () => {
		if (this.state.name.length < 3) {
			Alert.alert('Lỗi', 'Tên phải từ 2 kí tự trở lên');
		} else if (User.name != this.state.name) {
			await firebase
				.database()
				.ref('users')
				.child(User.username)
				.update({ name: this.state.name }, function (error) {
					if (error) {
						Alert.alert('Thất bại', 'Thay đổi không thành công');
					} else {
						Alert.alert('Thành công', 'Thay đổi tên thành công');
					}
				});
			this.props.navigation.navigate('Home');
			User.name = this.state.name;
		}else if(User.name == this.state.name){
			Alert.alert('Đây là tên của bạn')
		}
	};
	render() {
		return (
			<View style={styles.container}>
				<TextInput
					value={this.state.name}
					onChangeText={this.handleChange('name')}
					style={styles.input}
					autoFocus={true}
					textAlign={'center'}
				/>
				<TouchableOpacity>
					<Text style={styles.btnChange} onPress={this.changeName}>
						Lưu
					</Text>
				</TouchableOpacity>
			</View>
		);
	}
}
