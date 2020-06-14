import React from 'react';
import { SafeAreaView, Dimensions,Image, Text, FlatList, TouchableOpacity } from 'react-native';
import User from '../User';
import firebase from 'firebase';
// import { TextInput } from 'react-native-gesture-handler';
// import styles from '../constants/style';

export default class HomeScreen extends React.Component {
	static navigationOptions = ({navigation})=> {
        return {
			title: 'Chats',
			headerRight: (
				<TouchableOpacity onPress={()=>navigation.navigate('Profile')}>
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
		// url: "https://firebasestorage.googleapis.com/v0/b/fir-chat-ffbb9.appspot.com/o/images%2Favatar%2Fdf.png?alt=media&token=c17a4c1b-f661-4e8e-80ed-4edeb56173b2"
	};

	componentDidMount() {
		this.state.dbRef.on('child_added', (val) => {
			let person = val.val();
			person.username = val.key;
			var lists;
			if (person.username === User.username) {
				User.name = person.name;
				// firebase
				// 	.database()
				// 	.ref('users/' + User.name + '/listFriend')
				// 	.on('value', function (snap) {
				// 		lists = snap.val();
				// 		console.log(lists);
				// 	});
			}
			else {
				this.setState((prevState) => {
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
					renderItem={this.renderRow}
					keyExtractor={(item) => item.username}
				/>
			</SafeAreaView>
		);
	}
}
