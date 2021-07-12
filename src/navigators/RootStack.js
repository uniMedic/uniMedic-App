import React from 'react';

//colors
import { Colors } from './../components/styles';
const { darkLight, brand, primary, tertiary, secondary } = Colors;

// React Navigation
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// screens
import Login from './../screens/Login';
import Signup from './../screens/Signup';
import MedicNavigator from './MedicNavigator';
import User from './../screens/User/index';

const Stack = createStackNavigator();

// credentials context
import { CredentialsContext } from './../components/CredentialsContext';

const RootStack = () => {
	return (
		<CredentialsContext.Consumer>
			{({ storedCredentials }) => (
				<NavigationContainer style={{ backgroundColor: 'red' }}>
					<Stack.Navigator
						screenOptions={{
							headerStyle: {
								backgroundColor: 'transparent'
							},
							headerTintColor: tertiary,
							headerTransparent: true,
							headerTitle: '',
							headerLeftContainerStyle: {
								paddingLeft: 20
							}
						}}
					>
						{storedCredentials ? storedCredentials.isMedic ? (
							<Stack.Screen
								options={{
									headerTintColor: primary
								}}
								name="Medic"
								component={MedicNavigator}
							/>
						) : (
							<Stack.Screen
								options={{
									headerTintColor: primary
								}}
								name="User"
								component={User}
							/>
						) : (
							<>
                				<Stack.Screen name="Login" component={Login} />
                				<Stack.Screen name="Signup" component={Signup} />
              				</>
						)}
					</Stack.Navigator>
				</NavigationContainer>
			)}
		</CredentialsContext.Consumer>
	);
};

export default RootStack;
