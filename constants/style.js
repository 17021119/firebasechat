import React from 'react';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center',
	},
	input: {
		padding: 10,
		borderWidth: 1,
		borderColor: '#ccc',
		width: '80%',
		marginBottom: 10,
		borderRadius: 5,
	},
	inputMessage: {
		padding: 10,
		borderWidth: 1,
		borderColor: '#ccc',
		width: '80%',
		marginBottom: 10,
		borderRadius: 20,
	},
	inputSearch: {
		marginTop: 10,
		marginBottom: 10,
		marginLeft: '5%',
		padding: 8,
		borderWidth: 1,
		borderColor: '#ccc',
		width: '90%',
		borderRadius: 40,
	},
	btnText: {
		color: 'darkblue',
		fontSize: 20,
	},
	btnChange: {
		fontSize: 20,
		color:'white'
	},
	btnTouch:{
		backgroundColor: '#5388d0',
		padding: 10,
		borderRadius: 3,
		margin: 5
	},
	bottomBar: {
		// backgroundColor: '#fff',
		flexDirection: 'row',
		alignItems: 'center',
		padding: 5,
		position: 'absolute',
		bottom: 0,
		left: 0,
		right: 0,
		zIndex: 2,
		height: 60,
	},
	sendButton: {
		alignItems: 'center',
		marginBottom: 10,
		marginLeft: 10,
		height: 40,
		width: 40,
		paddingTop: 10,
		paddingLeft: 5,
		backgroundColor: '#2196F3',
		borderRadius: 20,
	},
	friendScreenIcon: {
		width: 32,
		height: 32,
		position: 'relative',
		marginRight: 10,
		resizeMode: 'cover',
		tintColor: '#999',
		alignSelf: 'center',
	},
	friendScreenText: {
		fontSize: 20,
		top: 3,
	},
	boxFriendOptions: {
		borderWidth: 1,
		borderColor: '#999',
		padding: 10,
	},
	containerFriendScreen: {
		marginTop: '45%',
		flexDirection: 'column',
		alignItems: 'center',
		flex: 1,
		justifyContent: 'space-between',
	},
});
export default styles;
