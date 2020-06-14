import React from 'react';
import { SafeAreaView, Dimensions, Image, View, Text, FlatList, TouchableOpacity } from 'react-native';
import User from '../User';
import firebase from 'firebase';
// import { TextInput } from 'react-native-gesture-handler';
import styles from '../constants/style';

export default class HomeScreen extends React.Component {
	static navigationOptions = ({ navigation }) => {
		return {
			title: 'Friends',
		};
	};

	state = {
		users: [],
		dbRef: firebase.database().ref('users'),
		input: '',
		numFriend: 23,
	};

	// componentDidMount() {
	// 	this.state.dbRef.on('child_added', (val) => {
	// 		let person = val.val();
	// 		person.username = val.key;
	// 		if (person.username === User.username) {
	// 			User.name = person.name;
	// 		} else {
	// 			this.setState((prevState) => {
	// 				return {
	// 					users: [...prevState.users, person],
	// 				};
	// 			});
	// 		}
	// 	});
	// }
	componentWillUnmount() {
		this.state.dbRef.off();
	}
	renderRow = ({ item }) => {
		return (
			<TouchableOpacity
				onPress={() => this.props.navigation.navigate('Chat', item)}
				style={{ padding: 10, borderBottomColor: '#ccc', borderBottomWidth: 1 }}
			>
				<Text style={{ fontSize: 20 }}>{item.name}</Text>
			</TouchableOpacity>
		);
	};
	render() {
		return (
			<SafeAreaView style={styles.containerFriendScreen}>
				<TouchableOpacity
					style={styles.boxFriendOptions}
					onPress={() => this.props.navigation.navigate('List')}
				>
					<Image style={styles.friendScreenIcon} source={require('../images/friend_1.png')} />
					<Text style={styles.friendScreenText}>
						Bạn bè <Text style={{ color: 'red' }}>{this.state.numFriend}</Text>
					</Text>
				</TouchableOpacity>

				<TouchableOpacity
					style={styles.boxFriendOptions}
					onPress={() => this.props.navigation.navigate('Find')}
				>
					<Image style={styles.friendScreenIcon} source={require('../images/search.png')} />
					<Text style={styles.friendScreenText}>Tìm bạn bè</Text>
				</TouchableOpacity>

				<TouchableOpacity
					style={styles.boxFriendOptions}
					onPress={() => this.props.navigation.navigate('Ban')}
				>
					<Image style={styles.friendScreenIcon} source={require('../images/ban.png')} />
					<Text style={styles.friendScreenText}>Bạn bè đã chặn</Text>
				</TouchableOpacity>
			</SafeAreaView>
		);
	}
}
