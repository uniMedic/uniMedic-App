import React from 'react';
import { View, Text, StyleSheet, Dimensions, Image, ImageBackground } from 'react-native';

export const SLIDER_WIDTH = Dimensions.get('window').width;
export const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.7);

const CarouselCardItem = ({ item, index }) => {
	return (
		<ImageBackground source={{ uri: item.imgUrl }} imageStyle={{ borderRadius: 8 }} style={styles.image}>
			<View
				style={{
					position: 'absolute',
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					justifyContent: 'center',
					alignItems: 'center'
				}}
			>
				<Text style={styles.body}>{item.body}</Text>
			</View>
		</ImageBackground>
	);
};
const styles = StyleSheet.create({
	image: {
		width: ITEM_WIDTH + 20,
		height: 150,
		marginTop: 35,
	},
	body: {
		color: '#FFF',
		fontSize: 10,
		paddingLeft: 20,
		paddingRight: 20
	}
});

export default CarouselCardItem;
