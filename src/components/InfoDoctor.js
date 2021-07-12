import React from 'react';
import { Text, View, Image } from 'react-native';

const InfoDoctor = ({ name, actualSituation, hospital, speciality, timeContract, profileImage }) => {
	return (
		<View
			style={{
				backgroundColor: '#B8D1F4',
				height: 180,
				width: 338,
				borderRadius: 15,
				padding: 5
			}}
		>
			<View
				style={{
					flexDirection: 'row',
					width: 338,
					alignItems: 'center'
				}}
			>
				<View
					style={{
						paddingTop: 20,
						paddingLeft: 10
					}}
				>
					{profileImage != '' ? (
						<Image
							style={{
								width: 130,
								height: 130,
								borderRadius: 65
							}}
							source={{ uri: `data:image/jpeg;base64,${profileImage}` }}
							resizeMode={'cover'}
						/>
					) : (
						<Image
							style={{
								width: 130,
								height: 130,
								borderRadius: 65
							}}
							source={require('./../images/doctor2.png')}
							resizeMode={'cover'}
						/>
					)}
				</View>
				<View
					style={{
						paddingLeft: 8
					}}
				>
					<View
						style={{
							width: 200
						}}
					>
						<Text
							style={{
								fontFamily: 'RobotoRegular',
								textAlign: 'left',
								color: '#F5F9FD',
								fontSize: 17,
								fontWeight: 'bold',
								paddingRight: 5,
								paddingTop: 1
							}}
						>
							{name}
						</Text>
					</View>

					<Text
						style={{
							fontFamily: 'RobotoRegular',
							textAlign: 'left',
							color: '#0BD081',
							fontSize: 12,
							fontWeight: 'bold',
							paddingLeft: 10,
							paddingTop: 1
						}}
					>
						{actualSituation}
					</Text>
					<Text
						style={{
							fontFamily: 'RobotoRegular',
							textAlign: 'left',
							color: '#F2F2F2',
							fontSize: 10,
							paddingLeft: 10,
							paddingTop: 8
						}}
					>
						Hospital
					</Text>
					<Text
						style={{
							fontFamily: 'RobotoRegular',
							textAlign: 'left',
							color: '#F5F9FD',
							fontSize: 11,
							paddingLeft: 10,
							paddingTop: 1
						}}
					>
						{hospital}
					</Text>
					<View
						style={{
							flexDirection: 'row'
						}}
					>
						<View>
							<Text
								style={{
									fontFamily: 'RobotoRegular',
									textAlign: 'left',
									color: '#F2F2F2',
									fontSize: 10,
									paddingLeft: 10,
									paddingTop: 8
								}}
							>
								Especialidad
							</Text>
							<Text
								style={{
									fontFamily: 'RobotoRegular',
									textAlign: 'left',
									color: '#F5F9FD',
									fontSize: 11,
									paddingLeft: 10,
									paddingTop: 1
								}}
							>
								{speciality}
							</Text>
						</View>
						<View
							style={{
								paddingLeft: 3,
								width: 98
							}}
						>
							<Text
								style={{
									fontFamily: 'RobotoRegular',
									textAlign: 'left',
									color: '#F2F2F2',
									fontSize: 10,
									paddingLeft: 10,
									paddingTop: 8
								}}
							>
								Contrato
							</Text>
							<Text
								style={{
									fontFamily: 'RobotoRegular',
									textAlign: 'left',
									color: '#F5F9FD',
									fontSize: 11,
									paddingLeft: 10,
									paddingTop: 1
								}}
							>
								{timeContract}
							</Text>
						</View>
					</View>
				</View>
			</View>
		</View>
	);
};

export default InfoDoctor;
