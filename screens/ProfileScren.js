import React from 'react'
import { SafeAreaView, Text,Image,View, TextInput, Alert, AsyncStorage } from 'react-native';
import User from '../User'
// import ImagePicker from 'react-native-image-picker';
import styles from '../constants/style'
import { TouchableOpacity } from 'react-native-gesture-handler'
import firebase from 'firebase'

// const options = {
// 	title: 'my pic app',
// 	takePhotoButtonTitle: 'Take photo',
// 	chooseFromLibraryButtonTitle: 'chose photo from library',
// };


export default class ProfileScreen extends React.Component{
    static navigationOptions={
        title:'Profile'
    }
    state={
        name: User.name,
        imageSource: require('../images/user.png')
    }
    _logOut= async () =>{
        await AsyncStorage.clear();
        this.props.navigation.navigate('Auth');
    }
    handleChange= key => val =>{
        this.setState({[key] : val})
    }
    changeName= async () => {
        if(this.state.name.length< 3){
            Alert.alert('Lỗi', 'Tên phải từ 2 kí tự trở lên' );
        }
        else if(User.name!= this.state.name){
            firebase.database().ref('users').child(User.username).update({ name: this.state.name },function(error){
                if(error){
                    Alert.alert('Thất bại', 'Thay đổi không thành công');
                }
                else{
                    Alert.alert('Thành công', 'Thay đổi thành công');
                }
            });
            User.name=this.state.name;
            // var updates = {};
			// updates['/posts/' + newPostKey] = postData;
			// updates['/user-posts/' + uid + '/' + newPostKey] = postData;

			// return firebase.database().ref('users').child(User.username).update(updates);
            
        }
    }
    componentDidMount(){
        // this.state.name = firebase.database().ref('users').child(User.username).child(this.state.name);
    }

    // changeImage= ()=> {
    //     const options={
    //         quality: 0.7, allowsEditing: true, mediaType: 'photo', noData: true,
    //         storageOptions: {
    //             skipBackup: true,
    //             waitUntilSaved: true,
    //             path: 'images',
    //             cameraRoll: true,
    //         }
    //     }
    //     ImagePicker.showImagePicker(options, response =>{
    //         if(response.error){
    //             console.log(error)
    //         }
    //         else if(!response.didCancel){
    //             this.setState({
    //                 imageSource:{uri: response.uri}
    //             })
    //         }
    //     })
    // }
    render(){
        return (
			<SafeAreaView style={styles.container}>
				<TouchableOpacity onPress={this.changeImage}>
					<Image
						style={{ width: 100, height: 100, resizeMode: 'cover', tintColor: '#999', marginBottom: 10 }}
						source={this.state.imageSource}
					/>
				</TouchableOpacity>
				<Text style={{ fontSize: 20 }}>{this.state.name}</Text>
				<TextInput
					value={this.state.name}
					onChangeText={this.handleChange('name')}
					style={styles.input}
					textAlign={'center'}
				/>
				<TouchableOpacity>
					<Text onPress={this.changeName} style={styles.btnText}>
						Lưu
					</Text>
				</TouchableOpacity>
				<TouchableOpacity>
					<Text onPress={this._logOut} style={styles.btnText}>
						Đăng xuất
					</Text>
				</TouchableOpacity>
			</SafeAreaView>
		);
    }
}