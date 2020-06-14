import React from 'react';
import { View, Text } from 'react-native';

export default class ChangeNameScreen extends React.Component {
	static navigationOptions = ({ navigation }) => {
		return {
			title: 'Đổi tên',
		};
	};
	render() {
		return (
			<View>
				<Text>Đổi tên</Text>
			</View>
		);
	}
}
