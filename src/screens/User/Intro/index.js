import { Image, View, Text, StyleService } from 'react-native';

import React from 'react';
import { Context, IntroStyle, palette } from './../../../components';

import Onboarding from 'react-native-onboarding-swiper';
//import AsyncStorage from "@react-native-community/async-storage";
import AsyncStorage from '@react-native-async-storage/async-storage';

const pages = [
	{
		backgroundColor: palette.background,
		image: <Image source={Context['IntroLogo']} style={IntroStyle.image} />,
		title: 'Bienvenido a uniMedic!',
		subtitle: ' Explore los últimos avances de IA en salud. \n\n Pida una segunda opinión sobre imágenes médicas.'
	},
	{
		backgroundColor: palette.background,
		image: <Image source={Context['IntroLogo2']} style={IntroStyle.image} />,
		title: 'Bienvenido a uniMedic!',
		subtitle: 'Conéctese a varios hospitales para su tratamiento. \n\n Comencemos!'
	}
];

export default function Intro(Comp) {
	class Wrapper extends React.Component {
		constructor(props) {
			super(props);

			this.handleSkip = this.handleSkip.bind(this);
			this.state = { skip: Context['Onboarding']['SkipOnboarding'] };
		}

		componentDidMount() {
			AsyncStorage.getItem('skipOnboarding').then((cached) => {
				if (cached == 1) {
					console.log('skip cached ', cached);
					this.state.skip = true;
					Context['Onboarding']['SkipOnboarding'] = true;
				} else {
					console.log('skip cached ', cached);
				}
			});
		}

		handleSkip = (state, data) => {
			Context['Onboarding']['SkipOnboarding'] = true;
      this.state.skip = true;
			AsyncStorage.setItem('skipOnboarding', '1').catch((err) =>
				console.log('no se pudo guardar el estado ', err)
			);
			console.log('Se hizo skip done!');
      console.log("renderizando de nuevo");
      this.forceUpdate();
		};

		render() {
      var state = this.state.skip;
       return (
        <>
        {
          state ? 
           (
             
            <>
            <Comp {...this.props} />
            </>
          )
           : 
            <Onboarding
              showNext={false}
              showSkip={false}
              onDone={this.handleSkip}
              onSkip={this.handleSkip}
              titleStyles={IntroStyle.title}
              subTitleStyles={IntroStyle.subtitle}
              containerStyles={IntroStyle.container}
              imageContainerStyles={IntroStyle.image}
              bottomBarHighlight={false}
              transitionAnimationDuration={10}
              pages={pages}
            />
          
        }
        </>
				);
	}
}

	Object.keys(Comp).forEach((key) => {
		// Copy static properties in order to be as close to Comp as possible.
		// One particular case is navigationOptions
		try {
			const excludes = [ 'displayName', 'childContextTypes' ];
			if (excludes.includes(key)) {
				return;
			}

			Wrapper[key] = Comp[key];
		} catch (err) {
			logger.warn('not able to assign ' + key, err);
		}
	});

	return Wrapper;
}
