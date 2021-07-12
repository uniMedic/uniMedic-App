import React, { useContext, useState, useCallback, useEffect } from 'react';
import { LogBox } from "react-native"
LogBox.ignoreAllLogs(true)
import * as FileSystem from 'expo-file-system';
import axios from 'axios';
import { StatusBar } from 'react-native';
import {
	Icon,
	MenuItem,
	OverflowMenu,
	TopNavigation,
	TopNavigationAction,
	Avatar,
	Modal,
	Card,
	Button,
	Popover
} from '@ui-kitten/components';
import { StyleSheet, View, Image, Alert, Linking, Platform, TouchableOpacity } from 'react-native';
import { ChatStyle } from './../../../components';
//import PhotoUpload from 'react-native-photo-upload';
import * as ImagePicker from 'expo-image-picker';
import { FontAwesome } from '@expo/vector-icons';

import { GiftedChat, Bubble, Send } from 'react-native-gifted-chat';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { templates, GetReplyContent, get_pretty_category, qaid_user } from './data.js';
import { MenuIcon, InfoIcon, ShareIcon, LogoutIcon, PhotoIcon, HeartIcon, LightIcon } from './icons.js';
import { ChatContext } from './context.js';
import { CredentialsContext } from './../../../components/CredentialsContext';
import { Context } from './../../../components';
//import { User } from "./user.js";
import { Models } from './models.js';
import { CreateAlert, TranslateEnglish, TranslateSpanish } from './utils.js';
import { Wiki } from './wiki.js';
import config from './../../../../config';

var replyIdx = 1;
var ctx = new ChatContext();
//var user_ctx = new User();
var models = new Models();
var wiki = new Wiki();

export function Main() {

	const [ menuVisible, setMenuVisible ] = useState(false);
	const [ messages, setMessages ] = useState([]);
	const [ isTyping, setIsTyping ] = useState(false);
	const [ textDiagnosis, setTextDiagnosis ] = useState("SIN DIAGNÓSTICO");
	const [ imageReply, setImageReply ] = useState("");
	const { storedCredentials, setStoredCredentials } = useContext(CredentialsContext);

	async function getTextSpanish(msg) {
		try {
			let textSpanish = await TranslateEnglish(msg);
			return textSpanish;
		} catch (e) {
			console.log('error', err);
			return 'No se puede traducir al español';
		}
	}

	const registerDiagnosis = (diagnosis) => {
		const urlHistoryUpdate = `${config.urlBackendJs}/history/update`;
		const urlDiagnosisRegister = `${config.urlBackendJs}/diagnosis/register`;
		axios
			.post(urlHistoryUpdate, { patientID: storedCredentials.userID, diagnosisID: diagnosis.diagnosisID })
			.then((response) => {
				const result = response.data;
				const { status, message, data } = result;

				if (status == 'SUCCESS') {
					console.log(`Diagnóstico ID añadido al historial del paciente ${storedCredentials.userID}`);
					axios
						.post(urlDiagnosisRegister, diagnosis)
						.then((response) => {
							const result = response.data;
							console.log(result)
							const { status, message, data } = result;

							if (status == 'SUCCESS') {
								console.log(
									`Diagnóstico del paciente ${storedCredentials.userID} registrado satisfactoriamente`
								);
							} else {
								console.log('Fallo al registar el diagnóstico del paciente');
							}
						})
						.catch((error) => {
							console.log('Ocurrio un error de red al intentar registar el diagnóstico del paciente');
						});
				} else {
					console.log('Fallo al actualizar el historial del paciente');
				}
			})
			.catch((error) => {
				console.log('Ocurrio un error de red al intentar actualizar el historial del paciente');
			});
	};

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

	useEffect(() => {
		(async () => {
			if (Platform.OS !== 'web') {
				const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
				if (status !== 'granted') {
					alert('La cámara necesita permisos!');
				}
			}
		})();
		checkLoginCredentials();
		setMessages([ generateReply(GetReplyContent('intro')) ]);
	}, []);

	useEffect(() => {
		//StatusBar.setBackgroundColor('#FF573300');
		StatusBar.setTranslucent(true);
	});


	const clearLogin = () => {

		const diagnosis = {
			diagnosisID: `diagnosis_${storedCredentials.userID}_${storedCredentials.lastUse}`,
			textDiagnosis: textDiagnosis,
			imageDiagnosis: imageReply,
			dateOfDiagnosis: new Date(),
			medicValidatorID: ''
		};

		registerDiagnosis(diagnosis);

		AsyncStorage.removeItem('unimedicCredentials')
			.then(() => {
				setStoredCredentials('');
			})
			.catch((error) => console.log(error));

		Context['Onboarding']['SkipOnboarding'] = false;
		AsyncStorage.setItem('skipOnboarding', '0').catch((err) =>
			console.log('no se pudo guardar el estado de skip', err)
		);
		console.log('Cerrando sesión');
	};

	const pickImage = async () => {
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.All,
			aspect: [ 4, 3 ],
			quality: 1
		});

		if (!result.cancelled) {
			ctx.reset();
			var bs64img = await FileSystem.readAsStringAsync(result.uri, { encoding: 'base64' });
			ctx.on_source(bs64img);

			console.log('usando imagen subida ');
			setMessages([ generateReply(GetReplyContent('intro')) ]);
			onImageRequest(result.uri);
			setIsTyping(true);


			models.prefilter(bs64img, function(err, answer) {
				setIsTyping(false);
				if (err) {
					console.log('falló el prefiltro ', err);
					CreateAlert(templates.messages.on_error);
					return;
				}
				ctx.on_prefilter(bs64img, answer);

				if (!ctx.valid) {
					ctx.reset();
					setMessages([ generateReply(GetReplyContent('intro')) ]);
					CreateAlert(templates.messages.on_invalid_input);
					return;
				}
				return handlePrefilter(bs64img);
			});
		} else {
			console.log('falla al cargar el archivo ', result);
			return;
		}
	};

	const toggleMenu = () => {
		setMenuVisible(!menuVisible);
	};

	const renderMenuAction = () => <TopNavigationAction icon={MenuIcon} onPress={toggleMenu} />;

	const renderOverflowMenuAction = () => (
		<React.Fragment>
			<OverflowMenu anchor={renderMenuAction} visible={menuVisible} onBackdropPress={toggleMenu}>
				<MenuItem
					accessoryLeft={LightIcon}
					title="Motivación"
					onPress={() => {
						Linking.openURL('https://github.com/uniMedic/uniMedic-Motivation');
					}}
				/>
				<MenuItem
					accessoryLeft={HeartIcon}
					title="Modelos"
					onPress={() => {
						Linking.openURL('https://github.com/uniMedic/uniMedic-Models');
					}}
				/>
				<MenuItem
					accessoryLeft={InfoIcon}
					title="Acerca de"
					onPress={() => {
						Linking.openURL('https://github.com/uniMedic/uniMedic-App');
					}}
				/>
				<MenuItem accessoryLeft={LogoutIcon} title="Salir" onPress={clearLogin} />
			</OverflowMenu>
		</React.Fragment>
	);

	const handleSegmentation = async (bs64img) => {
		console.log('run segm');
		models.segmentation(bs64img, async function(err, answer) {
			if (err || !answer['hip']) {
				console.log('segmentation failed ', err);
				return;
			}

			var results = answer['hip'];
			var count = Object.keys(results).length;
			if (count == 0) {
				console.log('no output for segmentation');
				return;
			}

			for (var h in results) {
				if (!results[h]['segmentation']) continue;
				// guardmos la imagen respuesta del chatbot para ser 
				// posteriormente agregada al diagnóstico
				setImageReply(results[h]['segmentation']);
				var segmentation = 'data:image/png;base64,' + results[h]['segmentation'];

				var template = GetReplyContent('on_segmentation');
				template = template.replace('%s', count);

				var user_id = 3;
				getTextSpanish(template).then(( msg ) => {
					setMessages((previousMessages) => GiftedChat.append(previousMessages, generateReply(msg, user_id)));
				});

				onImageReply(segmentation, user_id);
				break;
			}
		});
	};

	const handlePrefilter = async (bs64img) => {
		setIsTyping(true);

		if (ctx.topic) {
			var template = GetReplyContent('on_upload');
			template = template.replace('%s', ctx.topic);

			getTextSpanish(template).then(( msg ) => {
				setMessages((previousMessages) => GiftedChat.append(previousMessages, generateReply(msg)));
			});
		}

		const done = async function() {
			setIsTyping(false);
			handleSegmentation(bs64img);
		};

		await new Promise((r) => setTimeout(r, 1000));

		if (ctx.total_sources == 0) {
			getTextSpanish(GetReplyContent('on_no_hip')).then(( msg ) => {
				setMessages((previousMessages) => GiftedChat.append(previousMessages, generateReply(msg)));
			});
			return done();
		}

		if (ctx.anomalies.total_sources == 0) {
			var template = GetReplyContent('on_hip_no_anomalies');
			template = template.replace('%s', ctx.total_sources);
			getTextSpanish(template).then(( msg ) => {
				setMessages((previousMessages) => GiftedChat.append(previousMessages, generateReply(msg)));
			});
			return done();
		}

		var template = GetReplyContent('on_hip_anomalies');
		template = template.replace('%s', ctx.anomalies.total_sources);
		template = template.replace('%s', ctx.total_sources);

		getTextSpanish(template).then(( msg ) => {
			setMessages((previousMessages) => GiftedChat.append(previousMessages, generateReply(msg)));
		});

		await new Promise((r) => setTimeout(r, 1000));

		var template = GetReplyContent('on_prefilter_anomaly');
		template = template.replace('%s', ctx.anomalies['what']);
		template = template.replace('%s', ctx.anomalies['where']);
		template = template.replace('%s', ctx.anomalies['why']);

		getTextSpanish(template).then(( msg ) => {
			setMessages((previousMessages) => GiftedChat.append(previousMessages, generateReply(msg)));
		});

		await new Promise((r) => setTimeout(r, 2000));
		wiki.ask(ctx.anomalies['why'], (err, explanation) => {
			if (err) {
				done();
				return;
			}
			getTextSpanish(explanation).then(( msg ) => {
				setMessages((previousMessages) => GiftedChat.append(previousMessages, generateReply(msg)));
			});
			done();
		});
	};

	const renderImagePicker = () => {
		const [ modalVisible, setModalVisible ] = React.useState(false);

		return (
			<View style={ChatStyle.container}>
				<Button
					appearance="ghost"
					status="basic"
					size="large"
					accessoryLeft={PhotoIcon}
					onPress={() => setModalVisible(true)}
				/>

				<Modal
					visible={modalVisible}
					backdropStyle={ChatStyle.backdrop}
					onBackdropPress={() => setModalVisible(false)}
				>
					<Card disabled={true}>
						<TouchableOpacity onPress={pickImage}>
							<Image source={require("./../../../images/upload.png")} style={ChatStyle.modalImage} />
						</TouchableOpacity>
					</Card>
				</Modal>
			</View>
		);
	};

	const renderTitle = (props) => (
		<View style={ChatStyle.titleContainer}>
			<Avatar style={ChatStyle.logo} source={require('./../../../images/logo.png')} />
		</View>
	);

	const renderBubble = (props) => {
		return <Bubble {...props} wrapperStyle={ChatStyle.bubble} />;
	};

	const generateReply = (msg, user_id = 2) => {
		setTextDiagnosis(msg);
		replyIdx += 1;
		return {
				_id: replyIdx,
				text: msg,
				createdAt: new Date(),
				user: qaid_user(user_id),
				seen: true
		};
	};

	const onImageRequest = (img_src) => {
		replyIdx += 1;
		var msg = {
			_id: replyIdx,
			image: img_src,
			createdAt: new Date(),
			user: {
				_id: storedCredentials.userID,
				name: storedCredentials.name
			},
			seen: true
		};

		setMessages((previousMessages) => GiftedChat.append(previousMessages, msg));
	};

	const onImageReply = (img_data, user_id = 2) => {
		// imagen generado por el chatbot
		replyIdx += 1;
		var msg = {
			_id: replyIdx,
			image: img_data,
			createdAt: new Date(),
			user: qaid_user(user_id),
			seen: true
		};

		setMessages((previousMessages) => GiftedChat.append(previousMessages, msg));
	};

	const onReply = (cat) => {
		var msg = GetReplyContent(cat);
		getTextSpanish(msg).then(( msg ) => {
			setMessages((previousMessages) => GiftedChat.append(previousMessages, generateReply(msg)));
		});
	};

	const onQuestion = (query, cbk) => {
		if (!ctx.valid) {
			return cbk('error', 'invalid input');
		}

		models.vqa(ctx.image_value, query, function(err, answer) {
			if (err) {
				return cbk('error', err);
			}
			if (answer != null) {
				return cbk('hit', answer);
			}
			return cbk('miss', 'no data');
		});
	};

	const handleRequest = (query, type, nlpData) => {
		setIsTyping(true);
		switch (type) {
			case 'greeting': {
				setIsTyping(false);
				return onReply('on_greeting');
				break;
			}
			case 'vqa': {
				onQuestion(query, (status, data) => {
					setIsTyping(false);
					switch (status) {
						case 'hit': {
							if (!data.total || !data.data) {
								return getTextSpanish(GetReplyContent('on_empty_vqa')).then(( msg ) => {
									setMessages((previousMessages) => GiftedChat.append(previousMessages, generateReply(msg)));
								});
							}

							var template = GetReplyContent('on_vqa');
							template = template.replace('%s', data.total);
							template = template.replace('%s', data.data);

							return getTextSpanish(template).then(( msg ) => {
								setMessages((previousMessages) => GiftedChat.append(previousMessages, generateReply(msg)));
							});
						}
						default: {
							return onReply('on_miss');
						}
					}
				});
				break;
			}
			case 'wiki': {
				wiki.ask(nlpData, (err, message) => {
					setIsTyping(false);

					return getTextSpanish(message).then(( msg ) => {
						setMessages((previousMessages) => GiftedChat.append(previousMessages, generateReply(msg)));
					});
				});
				break;
			}
			default: {
				setIsTyping(false);
				return onReply('on_invalid_input');
			}
		}
	};

	const onSend = useCallback((messages = []) => {
		if (messages.length == 0) return;

		setMessages((previousMessages) => GiftedChat.append(previousMessages, messages));
		
		TranslateSpanish(messages[0].text)
				.then(query => {
					models.nlp(query, handleRequest);
			 	})
				.catch(err=> {
			  		console.log("Ocurrio un error mientras se traducía de español a inglés" + err);
		})

	}, []);

	return (
		<>
			<TopNavigation
				alignment="center"
				accessoryLeft={renderImagePicker}
				title={renderTitle}
				accessoryRight={renderOverflowMenuAction}
				style={{ 
					marginTop: 20, 
					paddingRight: 20, 
					paddingTop: 18,
					borderRadius: 20
				}}
			/>
			<GiftedChat
				placeholder="Escribe un mensaje"
				useNativeDriver={true}
				messages={messages}
				isTyping={isTyping}
				onSend={(messages) => onSend(messages)}
				user={{
					_id: storedCredentials.userID,
					name: storedCredentials.name
				}}
				renderUsernameOnMessage
				renderBubble={renderBubble}
				showUserAvatar={true}
				renderSend={(props) => (
					<Send
					  {...props}
					  containerStyle={{
						height: 60,
						width: 60,
						justifyContent: 'center',
						alignItems: 'center',
					  }}
					>
					  <FontAwesome name="send" size={24} color="#181E61" />
					</Send> )}
			/>
		</>
	);
}
