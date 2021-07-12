import React from 'react';
import { Alert } from 'react-native';
import translate from 'translate-google-api';

module.exports.CreateAlert = function(msg) {
	Alert.alert(
		msg.title,
		msg.description,
		[
			{
				text: 'Entiendo!',
				onPress: () => console.log('Cancelar Presionado'),
				style: 'cancel'
			}
		],
		{ cancelable: false }
	);
};

async function TranslateEnglish(msg) {
	const resultSpanish = await translate(msg, {
		to: 'es'
	});
	return resultSpanish[0];
};

module.exports.TranslateEnglish = TranslateEnglish;

async function TranslateSpanish(msg) {
	const resultEnglish = await translate(msg, {
		tld: 'es',
		to: 'en'
	});
	return resultEnglish[0];
};

module.exports.TranslateSpanish = TranslateSpanish;
