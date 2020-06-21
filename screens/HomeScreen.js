import React from 'react';
import { SafeAreaView, Dimensions, Image, Text, FlatList, TouchableOpacity } from 'react-native';
import User from '../User';
import firebase from 'firebase';
import { Avatar } from 'react-native-elements';
import { ListItem } from 'react-native-elements';
// import { TextInput } from 'react-native-gesture-handler';
// import styles from '../constants/style';

import ChatScreen from './ChatScreen'

export default class HomeScreen extends React.Component {
	static navigationOptions = ({ navigation }) => {
		return {
			title: 'Chats',
			headerRight: (
				<TouchableOpacity onPress={() => navigation.navigate('Profile')}>
					<Image
						style={{ width: 32, height: 32, marginRight: 10, resizeMode: 'cover', tintColor: '#999' }}
						source={require('../images/user.png')}
					/>
				</TouchableOpacity>
			),
		};
	};

	state = {
		users: [],
		dbRef: firebase.database().ref('users'),
		messageList: [],
		dbRefMess: firebase.database().ref('messages'),
		messageLast: []
	};
	componentDidMount() {
		this.state.dbRef.on('child_added', (val) => {
			let person = val.val();	
			person.username = val.key;
			if (person.username === User.username) {
				User.name = person.name;
			} else {
				this.setState((prevState) => {
					this.state.dbRefMess
						.child(User.username)
						.child(person.username)
						.limitToLast(1)
						.once('value', (snapshot) => {
							var key = Object.keys(snapshot.val())[0];
							this.state.dbRefMess
								.child(User.username)
								.child(person.username)
								.child(key)
								.once('value', (snap) => {
									// console.log(snap.val().from);
									// console.log(snap.val().message);
									// console.log(snap.val().time);

									var mess = [
										person.username,
										// snap.val().from,
										snap.val().message,
										// snap.val().time,
									]
									// var mess = snap.val().message;
									this.state.messageLast.push(mess);
									// console.log(this.state.messageLast)
									// const result = this.state.messageLast.filter((word) => word[0] =="user8");
									// result_final = result[0];
									// console.log(result[0][2]);
									var result = this.state.messageLast.find((MESSS) => MESSS[0] == 'user8');
									console.log(result);
									// console.log(this.state.messageLast.find((MESS) => MESS[0] == 'user8')[1]);
									// console.log(this.state.messageLast);
									

									
									// this.state.messageLast.push({
									// 	[person.username]: [
									// 		snap.val().from,
									// 		snap.val().message,
									// 		snap.val().time,
									// 	]
									// })

									// this.state.messageLast.push(snap.val().message);

									// this.state.messageLast.push(
									// 	[
									// 		person.userID,
									// 		snap.val().from,
									// 		snap.val().message,
									// 		snap.val().time,
									// 	]
									// );

								});
								// console.log(this.state.messageLast);
								// console.log(this.state.messageLast['user1']);
								
						});	
					return {
						users: [...prevState.users, person],
					};
				});
			}
		});
	}
	componentWillUnmount() {
		this.state.dbRef.off();
	}
	renderItem = ({ item }) => (
		
		<TouchableOpacity
				onPress={() => this.props.navigation.navigate('Chat', item)}
				style={{borderBottomColor: '#ccc'}}
			>
			<ListItem
				title={item.name}
				// subtitle={this.getMessageLast(item.username)}
				// subtitle={this.state.messageLast.find((MESS) => MESS[0] == item.username)[1]}
				subtitle={item.username}
				leftAvatar={{ source: { uri: item.avatar } }}
				bottomDivider
				chevron
			/>
		</TouchableOpacity>
	)
	_logOut = async () => {
		await AsyncStorage.clear();
		this.props.navigation.navigate('Auth');
	};
	render() {
		const { height } = Dimensions.get('window');
		return (
			<SafeAreaView>
				<FlatList
					data={this.state.users}
					renderItem={this.renderItem}
					keyExtractor={(item) => item.username}
				/>
				
			</SafeAreaView>
		);
	}
}