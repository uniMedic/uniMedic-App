import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Image, StyleSheet, Alert, BackHandler, ScrollView, StatusBar, Linking } from 'react-native';
import { WebView } from 'react-native-webview';
import { LinearGradient } from 'expo-linear-gradient';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

import InfoPatient from './../../components/InfoPatient';
import Sent from './../../components/Sent';
import Data from './../../dummy/Data.json';
import config from './../../../config';
import { CredentialsContext } from './../../components/CredentialsContext';

const urlAddWaitingPatient = `${config.urlBackendJs}/stadistic/addWaitingPatient`;
const urlChangeStateWaintingPatient = `${config.urlBackendJs}/stadistic/changeStateWaitingPatient`;
const urlDownloadPDF = `${config.urlBackendJs}/diagnosis/downloadPDF`;
const urlUpdateDiagnosis = `${config.urlBackendJs}/diagnosis/update`;
const urlGetLastDiagnosis = `${config.urlBackendJs}/diagnosis/lastDiagnosis`;

const Discussion = ({ route, navigation }) => {
	const { itemId, itemName, itemPic, itemAge, itemDirection, itemLastUse } = route.params;
	const { storedCredentials, setStoredCredentials } = useContext(CredentialsContext);

	const addWaitingPatient = () => {
		axios
			.post(urlAddWaitingPatient, { medicID: storedCredentials.userID, waitingPatientID: itemId })
			.then((response) => {
				const result = response.data;
				const { status, message, data } = result;
				if (status == 'SUCCESS') {
					var storedCredentialsExpanded = {
						...storedCredentials,
						waitingPatientsID: data.waitingPatientsID,
						successPatientsID: data.successPatientsID
					};
					setStoredCredentials(storedCredentialsExpanded);
					console.log(`Agregando nuevo PACIENTE ESPERA (${itemId})`);
				} else {
					console.log(`Error al intentar actualizar PACIENTES ESPERA (${itemId})`);
				}
			})
			.catch((error) => {
				console.log('Ocurrio un error al momento de registar al PACIENTE ESPERA');
				console.log(error);
			});
	};

	const validatePatient = () => {
		axios
			.get(`${urlGetLastDiagnosis}?patientID=${itemId}`)
			.then((response) => {
				const result = response.data;
				const { status, message, data } = result;
				var dataUpdated = {
					...data,
					medicValidatorID: storedCredentials.userID,
					dateOfDiagnosis: new Date()
				};

				if (status == 'SUCCESS') {
					console.log(`Obtención de diagnóstico satisfactorio`);
					axios
						.post(urlUpdateDiagnosis, dataUpdated)
						.then((response) => {
							const result = response.data;
							const { status, message, data } = result;
							if (status == 'SUCCESS') {
								console.log(
									`\nEl doctor ${storedCredentials.userID} validó el diagnóstico del paciente ${itemId}`
								);
							} else {
								console.log(`\nError mientras el doctor intentaba validar al paciente ${itemId}`);
							}
						})
						.catch((error) => {
							console.log('Ocurrio un error de red al intentar actualizar el diagnóstico del paciente');
							console.log(error);
						});
				} else {
					console.log(`\nFallo al obtener el diagnóstico paciente ${itemId}`);
				}
			})
			.catch((error) => {
				console.log('Ocurrio un error de red al intentar obtener el diagnóstico paciente');
				console.log(error);
			});
	};

	const changeStateWaitingPatient = () => {
		axios
			.post(urlChangeStateWaintingPatient, { medicID: storedCredentials.userID, waitingPatientID: itemId })
			.then((response) => {
				const result = response.data;
				const { status, message, data } = result;
				if (status == 'SUCCESS') {
					var storedCredentialsExpanded = {
						...storedCredentials,
						waitingPatientsID: data.waitingPatientsID,
						successPatientsID: data.successPatientsID
					};
					setStoredCredentials(storedCredentialsExpanded);
					console.log(`Cambio estado del PACIENTE ESPERA -> SUCCESS (${itemId})`);
					validatePatient();
				} else {
					console.log(`Error al intentar cambiar al estado PACIENTE SUCCESS (${itemId})`);
					validatePatient();
				}
			})
			.catch((error) => {
				console.log('Ocurrio un error al momento de cambiar el estado del paciente');
				console.log(error);
			});
	};

	useEffect(() => {
		//StatusBar.setBackgroundColor('#FF573300');
		StatusBar.setTranslucent(true);
	}, []);

	const checkDiagnosisAlert = () => {
		Alert.alert('Validación', '¿Desea validar el diagnóstico?', [
			{
				text: 'En espera',
				onPress: () => addWaitingPatient(),
				style: 'cancel'
			},
			{
				text: 'Confirmar',
				onPress: () => changeStateWaitingPatient()
			}
		]);
	};

	//const { uri: localUri } = await FileSystem.downloadAsync(remoteUri, FileSystem.documentDirectory + 'name.ext');

	const backApp = () => {
		BackHandler.goBack;
	};

	var txt = [];
	for (var i = 5; i < Data.length; i++) {
		txt.push(<Sent key={Data[i].id} message={Data[i].message} />);
	}

	return (
		<LinearGradient colors={[ '#181E61', '#181E61', '#181E61' ]} style={styles.container}>
			<View style={styles.main}>
				<View style={styles.headerContainer}>
					<TouchableOpacity onPress={() => navigation.goBack()}>
						<Ionicons.Button
							name="chevron-back"
							transparent
							backgroundColor="#FFFFFF"
							color="#181E61"
							size={30}
							onPress={backApp}
						/>
					</TouchableOpacity>
					<Text style={styles.username}>{itemName}</Text>
					{itemPic == 'data:image/jpeg;base64,' ? (
						<Image source={require('./../../images/userDefault.png')} style={styles.avatar} />
					) : (
						<Image source={{ uri: itemPic }} style={styles.avatar} />
					)}
				</View>

				<View
					style={{
						flexDirection: 'row',
						marginTop: 20
					}}
				>
					<View
						style={{
							marginLeft: 70,
							alignItems: 'center',
							paddingRight: 50,
							marginTop: -10
						}}
					>
						<MaterialCommunityIcons.Button
							name="file-download-outline"
							size={40}
							color="#86A0F7"
							backgroundColor="#FFFFFF"
							onPress={() => {
								Linking.openURL(
									`${urlDownloadPDF}?patientID=${itemId}&patientName=${String(itemName).replace(
										/ /g,
										'%20'
									)}&patientAge=${itemAge}`
								);
							}}
						/>
						<Text
							style={{
								fontFamily: 'RobotoRegular',
								textAlign: 'left',
								color: '#86A0F7',
								fontSize: 12,
								paddingTop: 0,
								marginLeft: -10
							}}
						>
							Diagnóstico
						</Text>
					</View>
					<View
						style={{
							alignItems: 'center',
							marginTop: -10,
							marginLeft: 5
						}}
					>
						<Ionicons.Button
							name="md-checkmark-done-circle-outline"
							size={40}
							color="#86A0F7"
							onPress={checkDiagnosisAlert}
							backgroundColor="#FFFFFF"
						/>
						<Text
							style={{
								fontFamily: 'RobotoRegular',
								textAlign: 'left',
								color: '#86A0F7',
								fontSize: 12,
								marginTop: -1,
								marginLeft: -10
							}}
						>
							Validar
						</Text>
					</View>
				</View>
				<InfoPatient tag="ID del paciente" value={itemId} />
				<InfoPatient tag="Edad" value={itemAge} />
				<InfoPatient tag="Dirección" value={itemDirection} />
				<InfoPatient tag="Acceso reciente" value={itemLastUse} />
				{/* <InfoPatient tag="Último médico tratante" value="Ronaldo Lopez" /> */}
			</View>
		</LinearGradient>
	);
};
export default Discussion;

const styles = StyleSheet.create({
	container: {
		height: '100%',
		position: 'absolute',
		left: 0,
		right: 0,
		top: 0,
		paddingTop: 50
	},
	main: {
		backgroundColor: '#FFF',
		height: '100%',
		paddingHorizontal: 20,
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
		paddingTop: 40
	},
	headerContainer: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	username: {
		color: '#181E61',
		fontFamily: 'Montserrat_700Bold',
		fontSize: 20,
		paddingRight: 20,
		flex: 1,
		textAlign: 'center'
	},
	avatar: {
		width: 40,
		height: 40,
		borderRadius: 20
	}
});
