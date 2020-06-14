import React from 'react';
import { View, Text } from 'react-native';

export default class ChangePasswordScreen extends React.Component {
	static navigationOptions = ({ navigation }) => {
		return {
			title: 'Đổi mật khẩu',
		};
	};
	render() {
		return (
			<View>
				<Text>Đổi mật khẩu</Text>
			</View>
		);
	}
}
