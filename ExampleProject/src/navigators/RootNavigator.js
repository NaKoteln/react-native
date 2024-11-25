import * as React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {PersonListScreen} from '../screens/PersonListScreen';
import {PersonInfoScreen} from '../screens/PersonInfoScreen';
import { InputScreen } from '../screens/InputScreen';

const Stack = createStackNavigator();

export const RootNavigator = () => {
	return (
	<Stack.Navigator initialRouteName={'list'}>
		<Stack.Screen name={'list'} component={PersonListScreen} />
		<Stack.Screen name={'info'} component={PersonInfoScreen} />
		<Stack.Screen name={'input'} component={InputScreen} />
	</Stack.Navigator>
	);
};