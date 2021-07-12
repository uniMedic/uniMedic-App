import React, { useState, useEffect } from 'react';
import { LogBox } from 'react-native';
LogBox.ignoreLogs(['Warning: ...']);
import * as Font from 'expo-font';
import {
	useFonts,
	Montserrat_700Bold,
	Montserrat_600SemiBold,
	Montserrat_800ExtraBold
} from '@expo-google-fonts/montserrat';

// React navigation stack
import RootStack from './src/navigators/RootStack';

// apploading
import AppLoading from 'expo-app-loading';

// async-storage
import AsyncStorage from '@react-native-async-storage/async-storage';

// credentials context
import { CredentialsContext } from './src/components/CredentialsContext';

export default function App() {
	const [ appReady, setAppReady ] = useState(false);
	const [ fontReady, setFont ] = useState(false);
	const [ storedCredentials, setStoredCredentials ] = useState('');
	let [ fontsMontserratLoaded ] = useFonts({
		Montserrat_700Bold,
		Montserrat_600SemiBold,
		Montserrat_800ExtraBold
	});

	useEffect(() => {
		(async function() {
			try {
				await Font.loadAsync({
					RobotoBold: require('./src/fonts/Roboto-Bold.ttf'),
					RobotoRegular: require('./src/fonts/Roboto-Regular.ttf')
				});
				setFont(true);
			} catch (e) {
				console.error(e);
			}
		})();
	}, []);

	const checkLoginCredentials = () => {
		AsyncStorage.getItem('unimedicCredentials')
			.then((result) => {
				if (result !== null) {
					setStoredCredentials(JSON.parse(result));
				} else {
					setStoredCredentials(null);
				}
			})
			.catch((error) => console.log(error));
	};

	return fontsMontserratLoaded && fontReady && appReady ? (
		<CredentialsContext.Provider value={{ storedCredentials, setStoredCredentials }}>
			<RootStack />
		</CredentialsContext.Provider>
	) : (
		<AppLoading startAsync={checkLoginCredentials} onFinish={() => setAppReady(true)} onError={console.warn} />
	);
}
