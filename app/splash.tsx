import { router } from 'expo-router';
import * as SplashScreenAPI from 'expo-splash-screen';
import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, Easing, Image, SafeAreaView, StyleSheet, View } from 'react-native';

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

export default function SplashRoute() {
	const pulse = useRef(new Animated.Value(0)).current;

	useEffect(() => {
		// keep native splash visible until we explicitly hide it
		// start just above 0 and slowly fill to 100% with a gentle easing and a long initial delay
		pulse.setValue(0.01);

		Animated.sequence([
			Animated.delay(5000), // keep splash static for 5s (adjust as needed)
			Animated.timing(pulse, {
				toValue: 1,
				duration: 12000, // slow 12-second fill (adjust as needed)
				easing: Easing.out(Easing.quad),
				useNativeDriver: false,
			}),
		]).start(async () => {
			// hide the native splash AFTER the loader completes, then navigate
			try {
				await SplashScreenAPI.hideAsync();
			} catch (err) {
				// eslint-disable-next-line no-console
				console.warn('[SplashRoute] hideAsync failed', err);
			}
			// navigate to login (or "(tabs)" if you want to auto-route to main)
			router.replace('/auth/login');
		});
	}, [pulse]);

	const loaderWidth = pulse.interpolate({
		inputRange: [0, 1],
		outputRange: [width * 0.01, width * 0.75],
	});

	return (
		<LinearGradient colors={['#0f0520', '#2e0d5a', '#5a0fcf']} style={styles.root}>
			<SafeAreaView style={styles.safe}>
				<View style={styles.logoWrap}>
					<Image source={require('@/src/components/ui/logosss.png')} style={styles.logo} resizeMode="contain" />
				</View>

				<View style={styles.loaderWrap}>
					<Animated.View style={[styles.loader, { width: loaderWidth }]} />
				</View>
			</SafeAreaView>
		</LinearGradient>
	);
}

const styles = StyleSheet.create({
	root: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#12121bff' },
	safe: { flex: 1, width: '100%', justifyContent: 'center', alignItems: 'center' },
	logoWrap: { alignItems: 'center', marginBottom: 40 },
	logo: { width: 300, height: 300, marginBottom: 118 },
	loaderWrap: { position: 'absolute', bottom: 80, width: '100%', alignItems: 'center' },
	loader: { height: 30, borderRadius: 999, backgroundColor: '#2c92ffff', opacity: 0.95 },
});