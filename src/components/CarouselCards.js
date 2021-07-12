import React from 'react';
import { View } from 'react-native';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import CarouselCardItem, { SLIDER_WIDTH, ITEM_WIDTH } from './CarouselCardItem';
import data from './data';

const CarouselCards = () => {
	const isCarousel = React.useRef(null);

	return (
		<View style={{ marginLeft: -32 }}>
			<Carousel
				layout="tinder"
				layoutCardOffset={9}
				ref={isCarousel}
				data={data}
				renderItem={CarouselCardItem}
				sliderWidth={SLIDER_WIDTH}
				itemWidth={ITEM_WIDTH}
				autoplay={true}
				loop={true}
				enableSnap={true}
        autoplayInterval={5500}
			/>
		</View>
	);
};

export default CarouselCards;
