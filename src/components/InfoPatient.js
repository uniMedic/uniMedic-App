import { View, Text } from 'react-native';
import React from 'react';

const InfoPatient = ({ tag, value }) =>  {
	return (
		<View>
			<View
				style={{
					borderBottomColor: '#D6DBE9',
					borderBottomWidth: 2,
					marginTop: 15
				}}
			/>
			<View>
				<Text
					style={{
						fontFamily: 'RobotoRegular',
						textAlign: 'left',
						color: '#B9B9B9',
						fontSize: 14,
						paddingLeft: 10,
						paddingTop: 15
					}}
				>
					{tag}
				</Text>
				<Text
					style={{
						fontFamily: 'RobotoRegular',
						textAlign: 'left',
						color: '#000000',
						fontSize: 18,
						paddingLeft: 10,
						paddingTop: 5
					}}
				>
					{value}
				</Text>
			</View>
		</View>
	);
}

export default InfoPatient;
