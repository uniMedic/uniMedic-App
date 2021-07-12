import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Animated, Image, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { StatusBar } from 'react-native';
import axios from 'axios';

import { ScrollView } from 'react-native-gesture-handler';
import Messages from './../../components/Messages';
import config from './../../../config';

const calculateAge = (birthday) => { // birthday is a date
    var ageDifMs = Date.now() - Date.parse(birthday);
    var ageDate = new Date(ageDifMs); // miliseconds from epoch
    return Math.abs(ageDate.getUTCFullYear() - 1970);
}

const Chat = (props) => {
	const URL = `${config.urlBackendJs}/user/patients`;
	const [ data, setData ] = useState([]);
	const [ loading, setLoading ] = useState(true);
	const [ searchText, setSearchText ] = useState('');
	const [ filteredUsers, setFilteredUsers ] = useState([]);

	const pan = useRef(new Animated.ValueXY()).current;
	const list = useRef(new Animated.ValueXY()).current;

	useEffect(() => {
		//StatusBar.setBackgroundColor('#FF573300');
		StatusBar.setTranslucent(true);
	}, []);

	useEffect(function() {
		axios
			.get(URL)
			.then((response) => {
				const result = response.data;
				const { status, message, data } = result;
				setData(data);
				setLoading(false);
				
			})
			.catch((error) => {
				console.log(error);
			});
		
		Animated.timing(pan, {
			toValue: { x: -400, y: 0 },
			delay: 1000,
			useNativeDriver: false
		}).start();

		Animated.timing(list, {
			toValue: { x: 0, y: -300 },
			delay: 2000,
			useNativeDriver: false
		}).start();
	}, []);

	return (
		<LinearGradient colors={[ '#181E61', '#181E61', '#181E61' ]} style={styles.gradient}>
			<View style={styles.ops}>
				<View style={styles.col}>
					<Text style={styles.header}>Pacientes</Text>
				</View>
				<View
					style={{
						flexDirection: 'row',
						backgroundColor: '#FFF',
						borderRadius: 40,
						alignItems: 'center',
						paddingVertical: 10,
						paddingHorizontal: 20,
						marginTop: 30
					}}
				>
					<MaterialIcons name="person-search" size={24} color="#181E61" />
					<TextInput
						defaultValue={searchText}
						placeholder="Buscar paciente"
						style={{ paddingHorizontal: 20, fontSize: 15, color: '#181E61' }}
						textContentType="name"
						onChangeText={(text) => {
							setSearchText(text);
							if (text === '') {
								return setFilteredUsers([]);
							}
							const filtered_users = data.filter((item) =>
								item.name.toLowerCase().startsWith(text.toLowerCase())
							);
							setFilteredUsers(filtered_users);
						}}
						returnKeyType="search"
					/>
				</View>
				{filteredUsers.length > 0 ? (
					<ScrollView>
						{
							<Animated.View style={[ list.getLayout(), styles.list ]}>
								{filteredUsers.map((item, index) => (
									<Messages
										key={item.userID}
										username={item.name}
										uri={`data:image/jpeg;base64,${item.profileImage}`}
										age={calculateAge(item.dateOfBirth)}
										lastUse={item.lastUse}
										onPress={() => {
											props.navigation.navigate('Discussion', {
												itemId: item.userID,
												itemName: item.name,
												itemPic: `data:image/jpeg;base64,${item.profileImage}`,
												itemAge: `${calculateAge(item.dateOfBirth)} años`,
												itemDirection: item.direction,
												itemLastUse: item.lastUse
											});
										}}
									/>
								))}
							</Animated.View>
						}
						<View style={{ height: 50 }} />
					</ScrollView>
				) : searchText.length > 0 ? (
					<View
						style={{
							flex: 1,
							alignItems: 'center',
							justifyContent: 'center'
						}}
					>
						<Text
							style={{
								fontSize: 20,
								fontWeight: '500'
							}}
						>
							Usuario no encontrado
						</Text>
					</View>
				) : (
					<ScrollView>
						{loading ? (
							<ActivityIndicator size="large" color="#181E61" />
						) : (
							<Animated.View style={[ list.getLayout(), styles.list ]}>
								{data.map((item, index) => (
									<Messages
										key={item.userID}
										username={item.name}
										uri={`data:image/jpeg;base64,${item.profileImage}`}
										age={calculateAge(item.dateOfBirth)}
										lastUse={item.lastUse}
										onPress={() => {
											props.navigation.navigate('Discussion', {
												itemId: item.userID,
												itemName: item.name,
												itemPic: `data:image/jpeg;base64,${item.profileImage}`,
												itemAge: `${calculateAge(item.dateOfBirth)} años`,
												itemDirection: item.direction,
												itemLastUse: item.lastUse
											});
										}}
									/>
								))}
							</Animated.View>
						)}
					</ScrollView>
				)}
			</View>
		</LinearGradient>
	);
};
export default Chat;

const styles = StyleSheet.create({
	list: {
		marginTop: 300
	},
	card: {
		marginLeft: 400,
		width: 400,
		flexDirection: 'row'
	},
	gradient: {
		height: '100%',
		position: 'absolute',
		left: 0,
		right: 0,
		top: 0,
		paddingHorizontal: 20,
		paddingTop: 50
	},
	headerContainer: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	header: {
		fontFamily: 'RobotoRegular',
		color: '#181E61',
		flex: 1,
		fontSize: 24,
		paddingLeft: 99,
		fontWeight: 'bold'
	},
	proContainer: {
		marginRight: -20,
		alignSelf: 'center'
	},
	ops: {
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
		height: 700,
		backgroundColor: '#FFF',
		marginHorizontal: -20
	},
	col: {
		flexDirection: 'row',
		marginTop: 25,
		marginHorizontal: 20,
		alignItems: 'center'
	}
});
