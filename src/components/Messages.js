import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const lastTime = (date) => {
	var current = new Date();
	var lastUse = new Date(Date.parse(date));
	if (date) {
		var hours = lastUse.getHours();
		var minutes = lastUse.getMinutes();
		var ampm = hours >= 12 ? 'pm' : 'am';
		hours = hours % 12;
		hours = hours ? hours : 12; // the hour '0' should be '12'
		minutes = minutes < 10 ? '0' + minutes : minutes;
		var strTime = hours + ':' + minutes + ' ' + ampm;
		return String(strTime);
	} else {
		var hours = current.getHours();
		var minutes = current.getMinutes();
		var ampm = hours >= 12 ? 'pm' : 'am';
		hours = hours % 12;
		hours = hours ? hours : 12; // the hour '0' should be '12'
		minutes = minutes < 10 ? '0' + minutes : minutes;
		var strTime = hours + ':' + minutes + ' ' + ampm;
		return String(strTime);
	}
};

const Messages = ({ username, uri, age, lastUse, onPress }) => {
	return (
		<TouchableOpacity onPress={onPress} style={styles.container}>
			{uri == 'data:image/jpeg;base64,' ? (
				<Image source={require('./../images/userDefault.png')} style={styles.image} />
			) : (
				<Image source={{ uri: uri }} style={styles.image} />
			)}

			<View style={{ marginLeft: 10 }}>
				<Text style={styles.username}>{username}</Text>
				<Text style={styles.text}>{age} años</Text>
			</View>
			<Text style={styles.duration}>{lastTime(lastUse)}</Text>
		</TouchableOpacity>
	);
};
export default Messages;

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		paddingHorizontal: 20,
		alignItems: 'center',
		marginTop: 30
	},
	gradientStyle: {
		height: 20,
		width: 20,
		borderRadius: 10,
		alignItems: 'center',
		justifyContent: 'center',
		marginRight: 20
	},
	count: {
		color: '#fff',
		fontFamily: 'RobotoRegular'
	},
	image: {
		width: 60,
		height: 60,
		borderRadius: 30
	},
	text: {
		color: '#b6b6b6',
		fontFamily: 'RobotoRegular',
		fontSize: 11
	},
	duration: {
		color: '#000119',
		fontSize: 12,
		flex: 1,
		marginLeft: 280,
		position: 'absolute',
		fontFamily: 'RobotoRegular'
	},
	username: {
		color: '#000119',
		fontFamily: 'RobotoRegular',
		fontWeight: 'bold'
	}
});
