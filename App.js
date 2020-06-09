import React from 'react';
import {Image} from 'react-native';
import { createSwitchNavigator, createAppContainer} from 'react-navigation';
import { createStackNavigator  } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import AuthLoadingScreen from './screens/AuthLoadingScreen';
import ChatScreen from './screens/ChatScreen';
import ProfileScreen from './screens/ProfileScren';
import SignUpScreen from './screens/SignUpScreen';
import FriendScreen from './screens/FriendScreen';

import ListScreen from './screens/FriendOptions/ListScreen';
import FindScreen from './screens/FriendOptions/FindScreen';
import BanScreen from './screens/FriendOptions/BanScreen';

const AppStack = createStackNavigator({
	Home: HomeScreen,
	Chat: ChatScreen,
	Profile: ProfileScreen,
});

const FriendStack = createStackNavigator({
	Friend: FriendScreen,
	List: ListScreen,
	Find: FindScreen,
	Ban: BanScreen,
	
});

AppStack.navigationOptions=({navigation})=>{
  let tabBarVisible = navigation.state.index===0;
  return {
    tabBarVisible
  }
}

const AuthStack = createStackNavigator({ Login: LoginScreen });
const SignUpStack = createStackNavigator({ SignUp: SignUpScreen });



const TabNavigator = createBottomTabNavigator(
	{
		Chats: AppStack,
		Friends: FriendStack,
	},
	{
		defaultNavigationOptions: ({ navigation }) => ({
			tabBarIcon: ({ focused, horizontalm, tintColor }) => {
				const { routeName } = navigation.state;
				let imageName = require('./images/chats.png');
				if (routeName === 'Friends') {
					imageName = require('./images/friends.png');
				}
				return <Image source={imageName} style={{ width: 25, resizeMode: 'contain', tintColor }} />;
			},
		}),
		tabBarOptions: {
			activeTintColor: 'tomato',
			inactiveTintColor: 'gray',
		},
	}
);

export default createAppContainer(
	createSwitchNavigator(
		{
			AuthLoading: AuthLoadingScreen,
			App: TabNavigator,
			Auth: AuthStack,
			SignUp: SignUpStack,
		},
		{
			initialRouteName: 'AuthLoading',
		}
	)
);