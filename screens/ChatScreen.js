import React from 'react';
import {
	SafeAreaView,
	Text,
	KeyboardAvoidingView,
	Dimensions,
	Animated,
	Platform,
	Keyboard,
	TextInput,
	TouchableOpacity,
	Image,
	Alert,
	View,
	Linking,
} from 'react-native';
import styles from '../constants/style';
import User from '../User';
import firebase from 'firebase';
import * as ImagePicker from 'expo-image-picker';
import { FlatList } from 'react-native-gesture-handler';
import Images from 'react-native-chat-images';
import Loading from 'react-native-whc-loading';
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';
// import RNLocation from 'react-native-location';
import Hyperlink from 'react-native-hyperlink';
import { log } from 'react-native-reanimated';

const isIOS = Platform.OS === 'ios';

export default class ChatScreen extends React.Component {
	static navigationOptions = ({ navigation }) => {
		return {
			title: navigation.getParam('name'),
			// headerRight: (
			// 	<TouchableOpacity
			// 		onPress={() =>
			// 			Alert.alert(
			// 				'Xóa tin nhắn',
			// 				'Bạn có muốn xóa hết tin nhắn không?',
			// 				[
			// 					{
			// 						text: 'Có',
			// 						onPress: async() => {
			// 							await firebase.database().ref('messages/'+ User.username+'/'+this.state.person.username).remove();
			// 							console.log('test')
			// 						}
			// 					},
			// 					{
			// 						text: 'Không',
			// 						style: 'cancel',
			// 					},
			// 				],
			// 				{ cancelable: false }
			// 			)
			// 		}
			// 	>
			// 		<Image
			// 			style={{
			// 				width: 32,
			// 				height: 32,
			// 				marginRight: 10,
			// 				resizeMode: 'cover',
			// 				tintColor: '#999',
			// 			}}
			// 			source={require('../images/trash.png')}
			// 		/>
			// 	</TouchableOpacity>
			// ),
		};
	};
	yesDelete= () => {
		Alert.alert('Test')
	}
	constructor(props) {
		super(props);
		this.state = {
			person: {
				name: props.navigation.getParam('name'),
				username: props.navigation.getParam('username'),
			},
			textMessage: '',
			messageList: [],
			dbRef: firebase.database().ref('messages'),
			latitude: null,
			longitude: null,
			error: null,
			location: {},
		};
		this.keyboardHeight = new Animated.Value(0);
		this.bottomPadding = new Animated.Value(80);
	}
	componentDidMount() {
		this.keyboardShowListener = Keyboard.addListener(isIOS ? 'keyboardWillShow' : 'keyboardDidShow', (e) =>
			this.keyboardEvent(e, true)
		);
		this.keyboardHideListener = Keyboard.addListener(isIOS ? 'keyboardWillHide' : 'keyboardDidHide', (e) =>
			this.keyboardEvent(e, false)
		);

		this.state.dbRef
			.child(User.username)
			.child(this.state.person.username)
			.on('child_added', (value) => {
				this.setState((prevState) => {
					return {
						messageList: [...prevState.messageList, value.val()],
					};
				});
			});
	}
	componentWillUnmount() {
		this.state.dbRef.off();
		this.keyboardShowListener.remove();
		this.keyboardHideListener.remove();
	}
	keyboardEvent = (event, isShow) => {
		let heightOS = isIOS ? 60 : 80;
		let bottomOS = isIOS ? 120 : 140;
		Animated.parallel([
			Animated.timing(this.keyboardHeight, {
				duration: event.duration,
				toValue: isShow ? heightOS : 0,
			}),
			Animated.timing(this.bottomPadding, {
				duration: event.duration,
				toValue: isShow ? bottomOS : 60,
			}),
		]).start();
	};
	handleChange = (key) => (val) => {
		this.setState({ [key]: val });
	};

	convertTime = (time) => {
		var d = new Date(time);
		var c = new Date();
		var hours = d.getHours();
		var minutes = '0' + d.getMinutes();
		var formattedTime = hours + ':' + minutes.substr(-2);
		if (d.getDate() != c.getDate()) {
			formattedTime = formattedTime + ' ∙ ' + d.getDate() + '/' + ('0' + (d.getMonth() + 1)).substr(-2);
		}
		return formattedTime;
	};

	sendMessage = async () => {
		if (this.state.textMessage.length > 0) {
			let msgId = (await this.state.dbRef.child(User.username).child(this.state.person.username).push()).key;
			let updates = {};
			let message = {
				message: this.state.textMessage,
				time: firebase.database.ServerValue.TIMESTAMP,
				from: User.username,
				type: 'text',
			};
			updates[User.username + '/' + this.state.person.username + '/' + msgId] = message;
			updates[this.state.person.username + '/' + User.username + '/' + msgId] = message;
			this.state.dbRef.update(updates);
			this.setState({ textMessage: '' });
		}
	};
	getEmotion = () => {
		this.setState({
			textMessage: this.state.textMessage + '😀',
		});
	};
	onChooseImagePress = async () => {
		let result = await ImagePicker.launchImageLibraryAsync();
		this.refs.loading.show();
		var name = result.uri.substr(-40, 36);
		var linkImg;
		const response = await fetch(result.uri);
		const blob = await response.blob();
		var ref = await firebase
			.storage()
			.ref()
			.child('images/message/' + name);
		await ref.put(blob);
		await ref.getDownloadURL().then(function (url) {
			linkImg = url;
		});
		let msgId = (await this.state.dbRef.child(User.username).child(this.state.person.username).push()).key;
		let updates = {};
		let message = {
			message: linkImg,
			time: firebase.database.ServerValue.TIMESTAMP,
			from: User.username,
			type: 'image',
		};
		updates[User.username + '/' + this.state.person.username + '/' + msgId] = message;
		updates[this.state.person.username + '/' + User.username + '/' + msgId] = message;
		this.state.dbRef.update(updates);
		this.refs.loading.show(false);
	};
	getImage = () => {
		this.onChooseImagePress();
	};
	getMap = async () => {
		const { status } = await Permissions.askAsync(Permissions.LOCATION);
		this.refs.loading.show();
		if (status !== 'granted') {
			console.log('Permission not granted');
			this.setState({
				error: 'Permission not granted',
			});
		}
		const userLocation = await Location.getCurrentPositionAsync();
		this.setState({
			longitude: userLocation.coords.longitude,
			latitude: userLocation.coords.latitude,
		});
		let msgId = (await this.state.dbRef.child(User.username).child(this.state.person.username).push()).key;
		let updates = {};
		let message = {
			message: 'https://www.google.com/maps/place/' + this.state.latitude + ',' + this.state.longitude,
			time: firebase.database.ServerValue.TIMESTAMP,
			from: User.username,
			type: 'link',
		};
		updates[User.username + '/' + this.state.person.username + '/' + msgId] = message;
		updates[this.state.person.username + '/' + User.username + '/' + msgId] = message;
		this.state.dbRef.update(updates);
		this.refs.loading.show(false);
		console.log('https://www.google.com/maps/place/' + this.state.latitude + ',' + this.state.longitude);
	};
	renderMess = (item) => {
		if (item.type == 'text') {
			return (
				<Text
					style={{
						color: item.from === User.username ? '#fff' : '#000000',
						padding: 7,
						paddingBottom: 17,
						fontSize: 16,
						minWidth: '15%',
					}}
				>
					{item.message}
				</Text>
			);
		} else if (item.type == 'image') {
			return (
				<View style={{ flex: 1 }}>
					<Images
						images={[{ url: item.message }]}
						backgroundColor={item.from === User.username ? '#0078FF' : '#fff'}
						extra=" "
					/>
				</View>
			);
		} else if (item.type == 'link') {
			return (
				<Hyperlink
					onPress={(url, text) => Linking.openURL(url)}
					linkStyle={{ textDecorationLine: 'underline' }}
				>
					<Text
						style={{
							color: item.from === User.username ? '#fff' : '#000000',
							padding: 7,
							paddingBottom: 17,
							fontSize: 16,
							minWidth: '15%',
						}}
					>
						Vị trí của tôi: {'\n' + item.message}
					</Text>
				</Hyperlink>
			);
		}
	};
	renderRow = ({ item }) => {
		return (
				<SafeAreaView
					style={{
						flex: 1,
						flexDirection: 'row',
						maxWidth: '70%',
						alignSelf: item.from === User.username ? 'flex-end' : 'flex-start',
						backgroundColor: item.from === User.username ? '#0078FF' : '#fff',
						borderRadius: 5,
						marginBottom: 10,
					}}
				>
					{this.renderMess(item)}
					<Text
						style={{
							color: item.from === User.username ? '#fff' : '#000000',
							padding: 3,
							fontSize: 10,
							position: 'absolute',
							bottom: 0,
							right: 0,
						}}
					>
						{this.convertTime(item.time)}
					</Text>
				</SafeAreaView>

		);
	};
	sendLike =async () =>{
		let msgId = (await this.state.dbRef.child(User.username).child(this.state.person.username).push()).key;
		let updates = {};
		let message = {
			message: '👍',
			time: firebase.database.ServerValue.TIMESTAMP,
			from: User.username,
			type: 'text',
		};
		updates[User.username + '/' + this.state.person.username + '/' + msgId] = message;
		updates[this.state.person.username + '/' + User.username + '/' + msgId] = message;
		this.state.dbRef.update(updates);
	}
	
	renderButtonSend =()=>{
		if(this.state.textMessage.length != 0){
			return(
				<TouchableOpacity onPress={this.sendMessage} style={styles.sendButton}>
						<Image
							source={require('../images/send.png')}
							style={{ tintColor: 'white', resizeMode: 'contain', height: 20 }}
						/>
					</TouchableOpacity>
			)
		}
		else{
			return (
				<TouchableOpacity 
					onPress={this.sendLike} 
					style={styles.sendButton} 
				>
					<Text style={{left: -2, top: -1 }}>👍</Text>
				</TouchableOpacity>
			);
		}
	}
	render() {
		let { height } = Dimensions.get('window');
		return (
			<KeyboardAvoidingView behavior="height" style={{ flex: 1 }}>
				<Animated.View style={[styles.bottomBar, { bottom: this.keyboardHeight }]}>
					<TouchableOpacity onPress={this.getMap}>
						<Image
							source={require('../images/map.png')}
							style={{
								height: 26,
								width: 26,
								tintColor: '#000',
								marginRight: 5,
								marginBottom: 8,
							}}
						/>
					</TouchableOpacity>
					<TouchableOpacity onPress={this.getImage}>
						<Image
							source={require('../images/image.png')}
							style={{
								height: 32,
								width: 32,
								tintColor: '#444',
								marginRight: 5,
								marginBottom: 6,
							}}
						/>
					</TouchableOpacity>
					<TouchableOpacity onPress={this.getEmotion}>
						<Image
							source={require('../images/smile.png')}
							style={{
								height: 28,
								width: 28,
								tintColor: '#555',
								marginRight: 5,
								marginBottom: 10,
							}}
						/>
					</TouchableOpacity>
					<TextInput
						style={styles.inputMessage}
						value={this.state.textMessage}
						placeholder="Type message..."
						onChangeText={this.handleChange('textMessage')}
						onPress={Keyboard.dismiss}
					/>
					{this.renderButtonSend()}
				</Animated.View>
				<FlatList
					ref={(ref) => (this.FlatList = ref)}
					onContentSizeChange={() => this.FlatList.scrollToEnd({ animated: true })}
					onLayout={() => this.FlatList.scrollToEnd({ animated: true })}
					style={{ paddingTop: 5, paddingHorizontal: 5, height }}
					data={this.state.messageList}
					renderItem={this.renderRow}
					keyExtractor={(item, index) => index.toString()}
					ListFooterComponent={<Animated.View style={{ height: this.bottomPadding }} />}
				/>
				<Loading ref="loading" backgroundColor="#ffffff" indicatorColor=" #0078FF" />
			</KeyboardAvoidingView>
		);
	}
}
