import React, { Component } from 'react';
import { SafeAreaView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { RootNavigator } from './navigators/RootNavigator';

export default class App extends Component {
	render = () => {
		return (
			<SafeAreaView style={{ flex: 1 }}>
				<NavigationContainer>
					<RootNavigator />
				</NavigationContainer>
			</SafeAreaView>
		);
	};
}
