import React, { useState, useContext, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import * as FileSystem from 'expo-file-system';

// formik
import { Field, Formik } from 'formik';

import {
	StyledContainer,
	PageTitle,
	StyledInputLabel,
	StyledFormArea,
	StyledButton,
	StyledTextInput,
	LeftIcon,
	RightIcon,
	InnerContainer,
	ButtonText,
	MsgBox,
	Line,
	ExtraView,
	ExtraText,
	TextLink,
	TextLinkContent,
	SubTitle,
	Colors
} from './../components/styles';
import {
	Button,
	Image,
	Platform,
	CheckBox,
	Text,
	View,
	TouchableOpacity,
	ActivityIndicator,
	ImageBackground
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

//colors
const { darkLight, brand, primary } = Colors;

// icon
import { MaterialIcons, FontAwesome, Ionicons } from '@expo/vector-icons';

// Datetimepicker
import DateTimePicker from '@react-native-community/datetimepicker';

// keyboard avoiding view
import KeyboardAvoidingWrapper from './../components/KeyboardAvoidingWrapper';

// api client
import axios from 'axios';

// Async storage
import AsyncStorage from '@react-native-async-storage/async-storage';

// credentials context
import { CredentialsContext } from './../components/CredentialsContext';

import config from './../../config';

const Signup = ({ navigation }) => {
	const [ hidePassword, setHidePassword ] = useState(true);
	const [ show, setShow ] = useState(false);
	const [ isMedic, setMedic ] = useState(false);
	const [ date, setDate ] = useState(new Date(2000, 0, 1));
	const [ message, setMessage ] = useState();
	const [ messageType, setMessageType ] = useState();
	const [ image, setImage ] = useState('');
	const [ img64, setImg64 ] = useState('');

	const [ dob, setDob ] = useState('');

	const onChange = (event, selectedDate) => {
		const currentDate = selectedDate || date;
		setShow(false);
		setDate(currentDate);
		setDob(currentDate);
	};

	const showDatePicker = () => {
		setShow('date');
	};

	// credentials context
	const { storedCredentials, setStoredCredentials } = useContext(CredentialsContext);

	// Form handling
	const handleSignup = (credentials, setSubmitting) => {
		console.log(`Registrando nuevo usuario con ID: ${credentials.userID}`);

		handleMessage(null);
		const urlSignup = `${config.urlBackendJs}/user/signup`;
		const urlCreateStadistic = `${config.urlBackendJs}/stadistic/register`;
		const urlCreateHistory = `${config.urlBackendJs}/history/register`;

		axios
			.post(urlSignup, credentials)
			.then((response) => {
				const result = response.data;
				const { status, message, data } = result;
				if (status !== 'SUCCESS') {
					setSubmitting(false);
					handleMessage(message, status);
				} else {
					persistLogin({ ...data }, message, status);

					// Creamos las estadísticas iniciales para el médico
					let initialStadistic = {
						medicID: credentials.userID,
						disponibility: '10',
						demandability: '20',
						expertise: '50'
					};
					if (credentials.isMedic) {
						axios
							.post(urlCreateStadistic, initialStadistic)
							.then((response) => {
								const result = response.data;
								const { status, message, data } = result;
								if (status == 'SUCCESS') {
									console.log(
										`Estadística inicial para el médico ${credentials.userID} registrada satisfactoriamente`
									);
								} else {
									console.log('Error al intentar registrar la estadística del médico');
								}
							})
							.catch((error) => {
								setSubmitting(false);
								handleMessage('Hay un error de red en la creación de la estadística inicial');
								console.log(error);
							});
					} else {
						// creamos el historial inicial para el paciente
						let initialHistory = {
							patientID: credentials.userID,
							diagnosisID: ""
						};
						axios
							.post(urlCreateHistory, initialHistory)
							.then((response) => {
								const result = response.data;
								const { status, message, data } = result;
								if (status == 'SUCCESS') {
									console.log(
										`Historial inicial para el paciente ${credentials.userID} registrado satisfactoriamente`
									);
								} else {
									console.log('Fallo al intentar registrar el historial inicial del paciente');
								}
							})
							.catch((error) => {
								setSubmitting(false);
								handleMessage('Hay un error de red en la creación de la estadística inicial');
								console.log(error);
							});
					}
				}
			})
			.catch((error) => {
				setSubmitting(false);
				handleMessage('Hay un error de red en resgitro');
				console.log(error);
			});
	};

	const handleMessage = (message, type = '') => {
		setMessage(message);
		setMessageType(type);
	};

	// Persisting login after signup
	const persistLogin = (credentials, message, status) => {
		AsyncStorage.setItem('unimedicCredentials', JSON.stringify(credentials))
			.then(() => {
				handleMessage(message, status);
				setStoredCredentials(credentials);
			})
			.catch((error) => {
				handleMessage('Persisting login failed');
				console.log(error);
			});
	};

	useEffect(() => {
		(async () => {
			if (Platform.OS !== 'web') {
				const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
				if (status !== 'granted') {
					alert('Necesita permiso para acceder a la galería!');
				}
			}
		})();
	}, []);

	const pickImage = async () => {
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.All,
			allowsEditing: true,
			aspect: [ 4, 3 ],
			quality: 0.3
		});

		if (!result.cancelled) {
			setImage(result.uri);
			// Convertimos la imagen a base64
			var base64 = await FileSystem.readAsStringAsync(result.uri, { encoding: 'base64' });
			//base64 = new Buffer(base64, 'base64');
			setImg64(base64);
		}
	};

	return (
		<KeyboardAvoidingWrapper>
			<StyledContainer>
				<StatusBar style="dark" />
				<InnerContainer>
					<PageTitle>uniMedic</PageTitle>
					<SubTitle>Registro de Cuenta</SubTitle>
					{show && (
						<DateTimePicker
							testID="dateTimePicker"
							value={date}
							mode="date"
							is24Hour={true}
							display="default"
							onChange={onChange}
							style={{
								backgroundColor: 'yellow'
							}}
						/>
					)}

					<Formik
						initialValues={{
							name: '',
							email: '',
							dateOfBirth: '',
							password: '',
							confirmPassword: '',
							direction: '',
							hospital: '',
							speciality: '',
							timeContract: ''
						}}
						onSubmit={(values, { setSubmitting }) => {
							// Aqui crearemos el userID
							var userID = dob.toDateString() + values.name;
							userID = userID.replace(/\s/g, '');

							values = {
								...values,
								dateOfBirth: dob,
								isMedic: isMedic,
								profileImage: img64,
								userID: userID
							};
							if (
								values.email == '' ||
								values.password == '' ||
								values.name == '' ||
								values.dateOfBirth == '' ||
								values.confirmPassword == '' ||
								values.direction == ''
							) {
								handleMessage('Complete todos los campos');
								setSubmitting(false);
							} else if (values.password !== values.confirmPassword) {
								handleMessage('Las contraseñas no coinciden');
								setSubmitting(false);
							} else if (
								isMedic &&
								(values.hospital == '' || values.speciality == '' || values.timeContract == '')
							) {
								handleMessage('Complete todos los campos médicos');
								setSubmitting(false);
							} else {
								handleSignup(values, setSubmitting);
							}
						}}
					>
						{({ handleChange, handleBlur, handleSubmit, values, isSubmitting }) => (
							<StyledFormArea>
								<MyTextInput
									label="Nombre Completo"
									placeholder="Cristhian Wiki"
									placeholderTextColor={darkLight}
									onChangeText={handleChange('name')}
									onBlur={handleBlur('name')}
									value={values.name}
									icon="user"
								/>
								<MyTextInput
									label="Correo Electrónico"
									placeholder="skynet@gmail.com"
									placeholderTextColor={darkLight}
									onChangeText={handleChange('email')}
									onBlur={handleBlur('email')}
									value={values.email}
									keyboardType="email-address"
									icon="envelope-o"
								/>
								<MyTextInput
									label="Fecha de Cumpleaños"
									placeholder="YYYY - MM - DD"
									placeholderTextColor={darkLight}
									onChangeText={handleChange('dateOfBirth')}
									onBlur={handleBlur('dateOfBirth')}
									value={dob ? dob.toDateString() : ''}
									icon="calendar"
									editable={false}
									isDate={true}
									showDatePicker={showDatePicker}
								/>
								<MyTextInput
									label="Contraseña"
									placeholder="* * * * * * * *"
									placeholderTextColor={darkLight}
									onChangeText={handleChange('password')}
									onBlur={handleBlur('password')}
									value={values.password}
									secureTextEntry={hidePassword}
									icon="lock"
									isPassword={true}
									hidePassword={hidePassword}
									setHidePassword={setHidePassword}
								/>
								<MyTextInput
									label="Confirmar Contraseña"
									placeholder="* * * * * * * *"
									placeholderTextColor={darkLight}
									onChangeText={handleChange('confirmPassword')}
									onBlur={handleBlur('confirmPassword')}
									value={values.confirmPassword}
									secureTextEntry={hidePassword}
									icon="lock"
									isPassword={true}
									hidePassword={hidePassword}
									setHidePassword={setHidePassword}
								/>

								<MyTextInput
									label="Dirección"
									placeholder="Puente Piedra"
									placeholderTextColor={darkLight}
									onChangeText={handleChange('direction')}
									onBlur={handleBlur('direction')}
									value={values.direction}
									icon="home"
								/>

								<Text style={{ fontSize: 13, color: '#1F2937', marginTop: 3, marginBottom: 10 }}>
									Subir foto de perfil
								</Text>

								<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
									<MaterialIcons.Button
										name="add-photo-alternate"
										size={24}
										color="#181E61"
										backgroundColor="#FFF"
										onPress={pickImage}
									/>
									{image != '' && (
										<ImageBackground
											source={{ uri: image }}
											imageStyle={{ borderRadius: 8 }}
											style={{ width: 278, height: 200, marginBottom: 10, marginTop: 10 }}
										/>
									)}
								</View>

								<View style={{ flexDirection: 'row', marginBottom: 20 }}>
									<CheckBox
										value={isMedic}
										onValueChange={setMedic}
										tintColors={{ true: '#181E61', false: 'black' }}
										style={{ alignSelf: 'center' }}
									/>
									<Text style={{ margin: 8, color: '#1F2937', fontSize: 13 }}>Soy un médico</Text>
								</View>

								{isMedic && (
									<View>
										<MyTextInput
											label="Hospital laboral"
											placeholder="Rezola"
											placeholderTextColor={darkLight}
											onChangeText={handleChange('hospital')}
											onBlur={handleBlur('hospital')}
											value={values.hospital}
											icon="hospital-o"
										/>

										<MyTextInput
											label="Especialidad"
											placeholder="Neurología"
											placeholderTextColor={darkLight}
											onChangeText={handleChange('speciality')}
											onBlur={handleBlur('speciality')}
											value={values.speciality}
											icon="user-md"
										/>

										<MyTextInput
											label="Tiempo de contrato"
											placeholder="Hasta el 2022"
											placeholderTextColor={darkLight}
											onChangeText={handleChange('timeContract')}
											onBlur={handleBlur('timeContract')}
											value={values.timeContract}
											icon="clock-o"
										/>
									</View>
								)}

								<MsgBox type={messageType}>{message}</MsgBox>

								{!isSubmitting && (
									<StyledButton onPress={handleSubmit}>
										<ButtonText>Registrarse</ButtonText>
									</StyledButton>
								)}
								{isSubmitting && (
									<StyledButton disabled={true}>
										<ActivityIndicator size="large" color={primary} />
									</StyledButton>
								)}

								<Line />
								<ExtraView>
									<ExtraText>Ya tienes una cuenta? </ExtraText>
									<TextLink onPress={() => navigation.navigate('Login')}>
										<TextLinkContent>Login</TextLinkContent>
									</TextLink>
								</ExtraView>
							</StyledFormArea>
						)}
					</Formik>
				</InnerContainer>
			</StyledContainer>
		</KeyboardAvoidingWrapper>
	);
};

const MyTextInput = ({ label, icon, isPassword, hidePassword, setHidePassword, isDate, showDatePicker, ...props }) => {
	return (
		<View>
			<LeftIcon>
				<FontAwesome name={icon} size={30} color={brand} />
			</LeftIcon>
			<StyledInputLabel>{label}</StyledInputLabel>

			{isDate && (
				<TouchableOpacity onPress={showDatePicker}>
					<StyledTextInput {...props} />
				</TouchableOpacity>
			)}
			{!isDate && <StyledTextInput {...props} />}

			{isPassword && (
				<RightIcon
					onPress={() => {
						setHidePassword(!hidePassword);
					}}
				>
					<Ionicons name={hidePassword ? 'md-eye-off' : 'md-eye'} size={30} color={darkLight} />
				</RightIcon>
			)}
		</View>
	);
};

export default Signup;
