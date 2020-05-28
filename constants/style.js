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
	btnText: {
		color: 'darkblue',
		fontSize: 20,
	},
	bottomBar: { 
        flexDirection: 'row', 
		alignItems: 'center', 
        padding: 5,
        position: "absolute",
        bottom: 0,
        left: 0,
        right:0,
        zIndex: 2,
        height: 60 
    },
});
export default styles;
