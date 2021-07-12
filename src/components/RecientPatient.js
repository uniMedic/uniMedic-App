import React, { useEffect, useState } from 'react';
import { Text, View, Image } from 'react-native';
import axios from 'axios';

import config from './../../config';

const RecientPatient = ({ idPatient }) => {
	const [ patientCurrent, setPatientCurrent ] = useState('');

	useEffect(() => {
		const urlGetPatient = `${config.urlBackendJs}/user/patient?userID=${idPatient}`;

		axios
			.get(urlGetPatient)
			.then((response) => {
				const result = response.data;
				const { status, message, data } = result;
				if (status == 'SUCCESS') {
					setPatientCurrent(data);
					console.log('Datos del paciente más reciente, actualizados!');
				} else {
					console.log('Error al intentar obtener los datos del paciente más reciente');
				}
			})
			.catch((error) => {
				setSubmitting(false);
				handleMessage('Hay un error de red');
				console.log(error);
			});
	}, []);

	return (
		<View
			style={{
				backgroundColor: '#FFF',
				height: 180,
				width: 310,
				borderRadius: 15,
				marginTop: 30
			}}
		>
			<View
				style={{
					backgroundColor: '#2E53DC',
					height: 55,
					width: 310,
					borderTopEndRadius: 15,
					borderTopStartRadius: 15
				}}
			>
				<Text
					style={{
						fontSize: 15,
						paddingVertical: 14,
						paddingLeft: 14,
						lineHeight: 22,
						fontFamily: 'RobotoRegular',
						color: '#FFF'
					}}
				>
					Pacientes en observación
				</Text>
			</View>
			<View
				style={{
					flexDirection: 'row',
					marginTop: 20
				}}
			>
				{patientCurrent.profileImage != '' ? (
					<Image
						style={{
							width: 60,
							height: 60,
							borderRadius: 30,
							marginLeft: 20
						}}
						source={{ uri: `data:image/jpeg;base64,${patientCurrent.profileImage}` }}
						resizeMode={'cover'}
					/>
				) : (
					<Image
						style={{
							width: 60,
							height: 60,
							borderRadius: 30,
							marginLeft: 20
						}}
						source={require('./../images/userDefault.png')}
						resizeMode={'cover'}
					/>
				)}
				<View
					style={{
						marginLeft: 15,
						alignItems: 'center',
						paddingRight: 50,
						marginTop: 8,
						marginRight: -10,
						width: 128
					}}
				>
					<Text
						style={{
							fontFamily: 'RobotoRegular',
							textAlign: 'left',
							color: '#181E61',
							fontSize: 11,
							paddingTop: 8
						}}
					>
						{patientCurrent.name}
					</Text>
				</View>
				<View
					style={{
						backgroundColor: '#2E53DC',
						height: 32,
						width: 80,
						borderRadius: 15,
						marginTop: 12,
						marginRight: 100
					}}
				>
					<Text
						style={{
							fontFamily: 'RobotoRegular',
							textAlign: 'left',
							color: '#FFF',
							fontSize: 12,
							paddingTop: 6,
							paddingLeft: 10
						}}
					>
						Continuar
					</Text>
				</View>
			</View>
			<View
				style={{
					backgroundColor: '#D1D9F8',
					marginLeft: 90,
					marginTop: 10,
					borderRadius: 200,
					height: 10,
					width: 200
				}}
			>
				<View
					style={{
						backgroundColor: '#B08008',
						marginRight: 20,
						borderRadius: 20,
						height: 10,
						width: 100
					}}
				/>
			</View>
		</View>
	);
};

export default RecientPatient;
