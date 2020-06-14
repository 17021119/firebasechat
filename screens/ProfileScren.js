import React from 'react';
import { SafeAreaView, Text, Image, View, TextInput, Alert, AsyncStorage } from 'react-native';
import User from '../User';
import * as ImagePicker from 'expo-image-picker';
import styles from '../constants/style';
import { TouchableOpacity } from 'react-native-gesture-handler';
import firebase from 'firebase';
import Loading from 'react-native-whc-loading';

export default class ProfileScreen extends React.Component {
	static navigationOptions = {
		title: 'Profile',
	};

	state = {
		name: User.name,
		url: 'https://firebasestorage.googleapis.com/v0/b/fir-chat-ffbb9.appspot.com/o/images%2Favatar%2Fdf.png?alt=media&token=c17a4c1b-f661-4e8e-80ed-4edeb56173b2'
	};
	_logOut = async () => {
		await AsyncStorage.clear();
		this.props.navigation.navigate('Auth');
	};
	// handleChange = (key) => (val) => {
	// 	this.setState({ [key]: val });
	// };
	// changeName = async () => {
	// 	if (this.state.name.length < 3) {
	// 		Alert.alert('Lỗi', 'Tên phải từ 2 kí tự trở lên');
	// 	} else if (User.name != this.state.name) {
	// 		firebase
	// 			.database()
	// 			.ref('users')
	// 			.child(User.username)
	// 			.update({ name: this.state.name }, function (error) {
	// 				if (error) {
	// 					Alert.alert('Thất bại', 'Thay đổi không thành công');
	// 				} else {
	// 					Alert.alert('Thành công', 'Thay đổi thành công');
	// 				}
	// 			});
	// 		User.name = this.state.name;
	// 	}
	// };
	getURL(){
		var renderImg = firebase.database().ref('users/' + User.username + '/avatar');
		renderImg.once('value', (snapshot) => {
			this.state.url = snapshot.val();
		});
		
	}
	componentWillMount() {
		this.getURL();
	}
	onChooseImagePress = async () => {
		// let result = await ImagePicker.launchCameraAsync();
		let result = await ImagePicker.launchImageLibraryAsync();
		// console.log(result.uri)

		if (!result.cancelled) {
			this.uploadImage(result.uri, this.state.name)
				.then(() => {
					this.props.navigation.navigate('Home');
					this.props.navigation.navigate('Profile');
					Alert.alert('Success');
					this.refs.loading.show(false);
					console.log(this.state.url);
					
				})
				.catch((error) => {
					this.refs.loading.show(false);
					Alert.alert(error);
				});
		}
	};

	uploadImage = async (uri, imageName) => {
		this.refs.loading.show();
		const response = await fetch(uri);
		const blob = await response.blob();

		var ref = await firebase
			.storage()
			.ref()
			.child('images/avatar/' + imageName);
		// ghi vào storage
		firebase.storage().ref().child('images/avatar/' + imageName)
			.getDownloadURL().then(function(url){
				firebase.database().ref('users').child(User.username).update({ avatar: url});
			});
		// ghi vào realtime database
		return ref.put(blob);
	};
	render() {
		return (
			<SafeAreaView style={styles.container}>
				<TouchableOpacity onPress={this.onChooseImagePress}>
					<Image
						style={{ width: 150, height: 150, resizeMode: 'cover', marginBottom: 10, borderRadius: 75 }}
						source={{ uri: this.state.url }}
						// source={this.state.imageSource}
					/>
				</TouchableOpacity>
				<Text style={{ fontSize: 20 }}>{this.state.name}</Text>
				{/* <TextInput
					value={this.state.name}
					onChangeText={this.handleChange('name')}
					style={styles.input}
					textAlign={'center'}
				/> */}
				<TouchableOpacity style={styles.btnTouch} onPress={() => this.props.navigation.navigate('ChangeName')}>
					<Text style={styles.btnChange}>Đổi tên</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={styles.btnTouch}
					onPress={() => this.props.navigation.navigate('ChangePassword')}
				>
					<Text style={styles.btnChange}>Đổi mật khẩu</Text>
				</TouchableOpacity>
				{/* <TouchableOpacity>
					<Text onPress={this.changeName} style={styles.btnText}>
						Lưu
					</Text>
				</TouchableOpacity> */}
				<TouchableOpacity>
					<Text onPress={this._logOut} style={styles.btnText}>
						Đăng xuất
					</Text>
				</TouchableOpacity>
				<Loading ref="loading" backgroundColor="#ffffff" indicatorColor=" #00ffcc" />
			</SafeAreaView>
		);
	}
}

