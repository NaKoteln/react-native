import React, { Component } from 'react';
import { FlatList, View, StyleSheet, Text, Button } from 'react-native';
import { PersonListItem } from '../components/PersonListItem';

export class PersonListScreen extends Component {
	state = {
		list: [],
		isLoading: false,
	};

	componentDidMount = () => {
		this.onRefresh();
	};

	getMoreData = (isRefreshing) => {
		const limit = 15;
		const offset = isRefreshing ? 0 : this.state.list.length;
		const page = Math.ceil(offset / limit) + 1;

		this.setState({ isLoading: true });

		fetch(`https://randomuser.me/api/?seed=foobar&results=15&page=${page}`)
			.then((response) => {
				if (!response) {
					throw new Error('Response is undefined');
				}
				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}
				return response.json();
			})
			.then((json) => {
				this.setState({
					list: isRefreshing
						? json.results
						: [...this.state.list, ...json.results],
				});
			})
			.catch((error) => {
				console.log('Error fetching data:', error.message);
			})
			.finally(() => {
				this.setState({ isLoading: false });
			});
	};

	onRefresh = () => {
		this.getMoreData(true);
	};

	onScrollToEnd = ({ distanceFromEnd }) => {
		if (distanceFromEnd < 0) {
			return;
		}
		this.getMoreData(false);
	};

	onItemPress = (item) => {
		this.props.navigation.navigate('info', { person: item });
	};

	keyExtractor = (person) => person.login.uuid;

	renderItem = ({ item }) => {
		return (
			<PersonListItem
				person={item}
				onPress={this.onItemPress.bind(this, item)}
			/>
		);
	};

	onNavigateToInputPhoto = () => {
		this.props.navigation.navigate('input');
	};

	render = () => {
		const { isLoading, list } = this.state;

		if (!list.length && !isLoading) {
			return (

				<View style={styles.container}>
					<Button
						title="Перейти на экран ввода текста и загрузки фото"
						onPress={this.onNavigateToInputPhoto}
					/>
					<Text>Нет данных для отображения</Text>
				</View>
			);
		}

		return (
			<View style={styles.container}>
				<Button
					title="Перейти на экран ввода текста и загрузки фото"
					onPress={this.onNavigateToInputPhoto}
				/>
				<FlatList
					data={list}
					renderItem={this.renderItem}
					keyExtractor={this.keyExtractor}
					refreshing={isLoading}
					onRefresh={this.onRefresh}
					onEndReached={this.onScrollToEnd}
					onEndReachedThreshold={0.2}
				/>
			</View>
		);
	};
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
})