import React, { useContext, useEffect } from 'react';
import { Image, StyleSheet, Text, PanResponder, View, PanResponderInstance } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

import CirclesStats from './../../components/CirclesStats';
// credentials context
import { CredentialsContext } from './../../components/CredentialsContext';
import InfoDoctor from './../../components/InfoDoctor';
import { StyledButton, ButtonText } from './../../components/styles';
import { StatusBar } from 'react-native';

const Profile = () => {
	useEffect(() => {
		//StatusBar.setBackgroundColor('#FF573300');
		StatusBar.setTranslucent(true);
	}, []);
	const { storedCredentials, setStoredCredentials } = useContext(CredentialsContext);

	return (
		<View
			style={{
				flex: 1,
				alignItems: 'center',
				justifyContent: 'center'
			}}
		>
			<Text
				style={{
					fontFamily: 'RobotoRegular',
					fontSize: 25,
					color: '#181E61',
					paddingBottom: 5,
					paddingTop: 5,
					fontWeight: 'bold'
				}}
			>
				Performance
			</Text>

			<InfoDoctor
				name={storedCredentials.name}
				actualSituation="Médico suplente"
				hospital={storedCredentials.hospital}
				speciality={storedCredentials.speciality}
				timeContract={storedCredentials.timeContract}
				profileImage={storedCredentials.profileImage}
			/>

			<Text
				style={{
					fontFamily: 'RobotoRegular',
					fontSize: 18,
					color: '#181E61',
					paddingBottom: 10,
					paddingTop: 4,
					paddingRight: 215,
					fontWeight: 'bold'
				}}
			>
				Estadísticas
			</Text>

			<CirclesStats
				percent1={!storedCredentials.demandability ? 0 : storedCredentials.demandability}
				percent2={!storedCredentials.disponibility ? 0 : storedCredentials.disponibility}
				percent3={!storedCredentials.expertise ? 0 : storedCredentials.expertise}
			/>

			<View
				style={{
					flexDirection: 'row',
					width: 338,
					paddingTop: 10
				}}
			>
				<View
					style={{
						backgroundColor: '#B8D1F4',
						height: 120,
						width: 150,
						borderRadius: 15,
						padding: 5
					}}
				>
					<Text
						style={{
							fontFamily: 'RobotoRegular',
							textAlign: 'left',
							color: '#181E61',
							fontSize: 12,
							fontWeight: 'bold',
							paddingTop: 5,
							paddingLeft: 3
						}}
					>
						Pacientes atendidos
					</Text>
					<View
						style={{
							flexDirection: 'row',
							width: 150,
							alignItems: 'center'
						}}
					>
						<FontAwesome5
							name="user-check"
							size={24}
							color="#181E61"
							style={{
								paddingTop: 22,
								paddingLeft: 20
							}}
						/>
						<Text
							style={{
								fontFamily: 'RobotoRegular',
								textAlign: 'right',
								color: '#0BD081',
								fontSize: 30,
								fontWeight: 'bold',
								paddingLeft: 30,
								paddingTop: 15
							}}
						>
							{!storedCredentials.successPatientsID ? 0 : storedCredentials.successPatientsID.length - 1}
						</Text>
					</View>
				</View>
				<View
					style={{
						backgroundColor: '#B8D1F4',
						height: 120,
						width: 150,
						borderRadius: 15,
						padding: 5,
						marginLeft: 38
					}}
				>
					<Text
						style={{
							fontFamily: 'RobotoRegular',
							textAlign: 'left',
							color: '#181E61',
							fontSize: 12,
							fontWeight: 'bold',
							paddingTop: 5,
							paddingLeft: 3
						}}
					>
						Pacientes en espera
					</Text>
					<View
						style={{
							flexDirection: 'row',
							width: 150,
							alignItems: 'center'
						}}
					>
						<FontAwesome5
							name="user-clock"
							size={24}
							color="#181E61"
							style={{
								paddingTop: 22,
								paddingLeft: 20
							}}
						/>
						<Text
							style={{
								fontFamily: 'RobotoRegular',
								textAlign: 'right',
								color: '#0BD081',
								fontSize: 30,
								fontWeight: 'bold',
								paddingLeft: 30,
								paddingTop: 15
							}}
						>
							{!storedCredentials.waitingPatientsID ? 0 : storedCredentials.waitingPatientsID.length - 1}
						</Text>
					</View>
				</View>
			</View>
		</View>
	);
};
export default Profile;
