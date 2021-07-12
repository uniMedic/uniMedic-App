import React, { useContext, useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { View, Text, Image, ImageBackground, TextInput } from 'react-native';
import RecientPatient from './../../components/RecientPatient';
import CarouselCards from './../../components/CarouselCards';
import { CredentialsContext } from './../../components/CredentialsContext';
import config from './../../../config';

const urlGetStadistic = `${config.urlBackendJs}/stadistic/data`;

export default function Home() {
	const { storedCredentials, setStoredCredentials } = useContext(CredentialsContext);

	useEffect(() => {
		//StatusBar.setBackgroundColor('#FF573300');
		//StatusBar.setTranslucent(true);
		axios
			.post(urlGetStadistic, { medicID: storedCredentials.userID })
			.then((response) => {
				const result = response.data;
				const { status, message, data } = result;
				if (status == 'SUCCESS') {
					var storedCredentialsExpanded = {
						...storedCredentials,
						demandability: data.demandability,
						disponibility: data.disponibility,
						expertise: data.expertise,
						waitingPatientsID: data.waitingPatientsID,
						successPatientsID: data.successPatientsID
					};
					setStoredCredentials(storedCredentialsExpanded);
					console.log('Estadísticas actualizadas');
				} else {
					console.log('Error al intentar obtener la estadística del médico');
				}
			})
			.catch((error) => {
				console.log(error);
			});
	}, []);

	const clearLogin = () => {
		AsyncStorage.removeItem('unimedicCredentials')
			.then(() => {
				setStoredCredentials('');
			})
			.catch((error) => console.log(error));
	};

	return (
		<LinearGradient
			colors={[ '#D8DFF6', '#D8DFF6', '#D8DFF6' ]}
			style={{
				height: '120%',
				position: 'absolute',
				left: 0,
				right: 0,
				top: 0,
				paddingTop: 0
			}}
		>
			<View
				style={{
					flexDirection: 'row',
					marginTop: 50,
					paddingLeft: 290
				}}
			>
				<Ionicons.Button
					name="md-exit-outline"
					transparent
					backgroundColor="#D8DFF6"
					color="black"
					size={30}
					onPress={clearLogin}
				/>
			</View>

			<View style={{ marginTop: 25, marginLeft: 25 }}>
				<Text
					style={{
						fontSize: 20,
						color: '#000',
						fontFamily: 'RobotoRegular'
					}}
				>
					Bienvenido de nuevo
				</Text>

				<Text
					style={{
						fontSize: 20,
						paddingVertical: 10,
						lineHeight: 22,
						fontFamily: 'RobotoBold',
						color: '#000'
					}}
				>
					Dr(a) {storedCredentials.name}
				</Text>
				<View
					style={{
						borderWidth: 4,
						borderColor: '#DAA623',
						marginRight: 240,
						borderRadius: 200
					}}
				/>

				{storedCredentials.waitingPatientsID != undefined &&
					(storedCredentials.waitingPatientsID[1] != null && (
						<RecientPatient idPatient={storedCredentials.waitingPatientsID[1]} />
					))}

				<CarouselCards />
			</View>
		</LinearGradient>
	);
}
