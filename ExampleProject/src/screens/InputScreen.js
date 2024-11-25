import React, { useState, useEffect } from 'react';
import {
	View,
	Text,
	TextInput,
	StyleSheet,
	Button,
	Image,
	Alert,
	Switch,
	TouchableOpacity,
	ScrollView,
} from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { Picker } from '@react-native-picker/picker';
import Slider from '@react-native-community/slider';
// import CheckBox from '@react-native-community/checkbox';

export const InputScreen = () => {
	const [text, setText] = useState('');
	const [imageUri, setImageUri] = useState(null);
	const [isSwitchOn, setIsSwitchOn] = useState(false);
	const [selectedOption, setSelectedOption] = useState('');
	// const [toggleCheckBox, setToggleCheckBox] = useState(false)
	const [options, setOptions] = useState([
		{ id: 1, label: 'Опция 1', isChecked: false },
		{ id: 2, label: 'Опция 2', isChecked: false },
		{ id: 3, label: 'Опция 3', isChecked: false },
	]);
	const [sliderValue, setSliderValue] = useState(50);
	const [isButtonDisabled, setIsButtonDisabled] = useState(true);
	const [timeLeft, setTimeLeft] = useState(15);

	const selectedOptions = options.filter((option) => option.isChecked);

	useEffect(() => {
		const timer = setInterval(() => {
			setTimeLeft((prevTime) => {
				if (prevTime <= 1) {
					clearInterval(timer);
					setIsButtonDisabled(false);
					return 0;
				}
				return prevTime - 1;
			});
		}, 1000);

		return () => clearInterval(timer);
	}, []);

	const handlePress = () => {
		Alert.alert('Кнопка нажата!');
	};


	const toggleCheckbox = (id) => {
		setOptions((prevOptions) =>
			prevOptions.map((option) =>
				option.id === id
					? { ...option, isChecked: !option.isChecked }
					: option
			)
		);
	};

	const requestCameraPermission = async () => {
		try {
			const permission = await request(PERMISSIONS.ANDROID.CAMERA);
			if (permission === RESULTS.GRANTED) {
				console.log('Разрешение на камеру получено');
				takePhoto();
			} else {
				Alert.alert('Ошибка', 'Разрешение на использование камеры не получено');
			}
		} catch (error) {
			console.log('Ошибка при запросе разрешения:', error);
		}
	};

	const selectImage = async () => {
		const result = await launchImageLibrary({
			mediaType: 'photo',
			includeBase64: false,
		});
		handleImageResult(result);
	};

	const takePhoto = async () => {
		const result = await launchCamera({
			mediaType: 'photo',
			saveToPhotos: true,
		});
		handleImageResult(result);
	};

	const handleImageResult = (result) => {
		if (result.didCancel) {
			Alert.alert('Отмена', 'Вы не выбрали изображение.');
		} else if (result.errorMessage) {
			Alert.alert('Ошибка', result.errorMessage);
		} else {
			setImageUri(result.assets[0].uri);
		}
	};

	const toggleSwitch = () => {
		setIsSwitchOn((previousState) => !previousState);
	};

	return (
		<ScrollView style={styles.container}>
			<Text style={styles.label}>Введите текст:</Text>
			<TextInput
				style={styles.input}
				placeholder="Введите текст..."
				value={text}
				onChangeText={setText}
			/>

			<Button title="Выбрать фото из галереи" onPress={selectImage} />
			<Button title="Сделать фото" onPress={requestCameraPermission} />

			{imageUri && (
				<Image source={{ uri: imageUri }} style={styles.image} />
			)}

			<View style={styles.switchContainer}>
				<Text style={styles.label}>Переключатель:</Text>
				<Switch value={isSwitchOn} onValueChange={toggleSwitch} />
				<Text>{isSwitchOn ? 'Включено' : 'Выключено'}</Text>
			</View>

			<View>
				<Text style={styles.label}>Выберите опцию:</Text>
				<Picker
					selectedValue={selectedOption}
					onValueChange={(itemValue) => setSelectedOption(itemValue)}
					style={styles.picker}
				>
					<Picker.Item label="Опция 1" value="option1" />
					<Picker.Item label="Опция 2" value="option2" />
					<Picker.Item label="Опция 3" value="option3" />
				</Picker>
			</View>

			{/* <View style={styles.multiSelectContainer}>
				<Text style={styles.label}>Checkbox:</Text>
				<CheckBox
					disabled={false}
					value={toggleCheckBox}
					onValueChange={(newValue) => setToggleCheckBox(newValue)}
				/>
			</View> */}

			<View>
				<Text style={styles.label}>Множественный выбор:</Text>
				{options.map((option) => (
					<View key={option.id} style={styles.checkboxContainer}>
						<TouchableOpacity
							style={[
								styles.checkbox,
								option.isChecked && styles.checked,
							]}
							onPress={() => toggleCheckbox(option.id)}
						/>
						<Text style={styles.checkboxLabel}>{option.label}</Text>
					</View>
				))}
				<Text>Выбранные опции:</Text>
				{selectedOptions.length > 0 ? (
					selectedOptions.map((option) => (
						<Text key={option.id}>
							{option.label}
						</Text>
					))
				) : (
					<Text>Нет выбранных опций</Text>
				)}
			</View>

			<View style={styles.container}>
				<Text style={styles.label}>Выберите значение: {sliderValue}</Text>
				<Slider
					style={styles.slider}
					minimumValue={0}
					maximumValue={100}
					step={1}
					value={sliderValue}
					onValueChange={(newValue) => setSliderValue(newValue)}
				/>
			</View>

			<View>
				<Text style={[styles.timer, { color: isButtonDisabled ? 'red' : 'green' }]}>
					{isButtonDisabled
						? `Кнопка станет доступной через ${timeLeft} секунд`
						: 'Кнопка доступна'}
				</Text>
				<Button
					title="Нажать кнопку"
					onPress={handlePress}
					disabled={isButtonDisabled}
				/>
			</View>
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 16,
		backgroundColor: '#fff',
	},
	label: {
		fontSize: 16,
		marginBottom: 8,
	},
	input: {
		borderWidth: 1,
		borderColor: '#ccc',
		padding: 10,
		marginBottom: 16,
		borderRadius: 5,
	},
	image: {
		width: '100%',
		height: 200,
		marginTop: 16,
	},
	checkbox: {
		width: 20,
		height: 20,
		borderWidth: 1,
		borderColor: '#000',
		marginRight: 8,
	},
	checked: {
		backgroundColor: '#000',
	},
	picker: {
		borderWidth: 1,
		borderColor: '#ccc',
	},
	checkboxContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 8,
	},
	slider: {
		width: '100%',
		height: 40,
	},
	timer: {
		fontSize: 18,
		marginBottom: 16,
	},
});
