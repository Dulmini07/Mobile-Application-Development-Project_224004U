import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, Image, SafeAreaView, StyleSheet, Text, View } from 'react-native';
const { width } = Dimensions.get('window');

// resolve expo-linear-gradient at runtime and fallback to View if missing
let LinearGradient: any;
try {
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	LinearGradient = require('expo-linear-gradient').LinearGradient;
} catch {
	// fallback component: renders a plain View with same style/children
	// eslint-disable-next-line react/display-name
	LinearGradient = ({ children, style }: any) => {
		const { View: RNView } = require('react-native');
		return <RNView style={style}>{children}</RNView>;
	};
}

export default function SplashScreen() {
	const pulse = useRef(new Animated.Value(0)).current;

	useEffect(() => {
		// debug: ensure splash mounted on Android
		// eslint-disable-next-line no-console
		console.log('[SplashScreen] mounted');
	}, []);

	useEffect(() => {
		Animated.loop(
			Animated.sequence([
				Animated.timing(pulse, { toValue: 1, duration: 700, useNativeDriver: false }),
				Animated.timing(pulse, { toValue: 0, duration: 700, useNativeDriver: false }),
			])
		).start();
	}, [pulse]);

	// loader width interpolation (semi-rectangle center)
	const loaderWidth = pulse.interpolate({
		inputRange: [0, 1],
		outputRange: [width * 0.25, width * 0.6],
	});

	return (
		<LinearGradient colors={['#0f0520', '#2e0d5a', '#5a0fcf']} style={styles.root}>
			<SafeAreaView style={styles.safe}>
				<View style={styles.logoWrap}>
					{/* use bundled logo at src/components/ui/logo.png */}
					<Image source={require('./ui/logo.png')} style={styles.logo} resizeMode="contain" />
					{/* <Text style={styles.title}>SPORTIFY</Text>
					<Text style={styles.subtitle}>CELEBRATE EVERY SCORE</Text> */}
				</View>

				<View style={styles.loaderWrap}>
					<Animated.View style={[styles.loader, { width: loaderWidth }]} />
				</View>
			</SafeAreaView>
		</LinearGradient>
	);
}

const styles = StyleSheet.create({
	root: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#0f0520', // fallback if LinearGradient not available
	},
	safe: { flex: 1, width: '100%', justifyContent: 'center', alignItems: 'center' },
	logoWrap: {
		alignItems: 'center',
		marginBottom: 40,
	},
	logo: {
		width: 300,
		height: 300,
		marginBottom: 18,
	},
	title: {
		color: '#91FFFD',
		fontSize: 36,
		fontWeight: '800',
		letterSpacing: 2,
		textShadowColor: 'rgba(0,0,0,0.5)',
		textShadowOffset: { width: 0, height: 2 },
		textShadowRadius: 6,
	},
	subtitle: {
		color: '#e7d9ff',
		marginTop: 6,
		fontSize: 12,
		letterSpacing: 2,
	},
	loaderWrap: {
		position: 'absolute',
		bottom: 80,
		width: '100%',
		alignItems: 'center',
	},
	loader: {
		height: 14,
		borderRadius: 999,
		backgroundColor: '#9df7ff',
		opacity: 0.95,
	},
});
