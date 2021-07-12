import React from 'react';
import { Text, View } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';

const CirclesStats = ({percent1, percent2, percent3}) => {
    return (
        <View
				style={{
					backgroundColor: '#B8D1F4',
					height: 200,
					width: 338,
					borderRadius: 15,
					padding: 5
				}}
			>
				<View
					style={{
						flexDirection: 'row',
						width: 150,
						alignItems: 'center'
					}}
				>
					<View
						style={{
							paddingHorizontal: 5,
							paddingVertical: 5,
							paddingTop: -10
						}}
					>
						<Text
							style={{
								fontFamily: 'RobotoRegular',
								fontSize: 11,
								color: '#F5F9FD',
								paddingBottom: 10,
								paddingTop: 2,
								textAlign: 'center'
							}}
						>
							Demandabilidad
						</Text>
						<AnimatedCircularProgress
							duration={600}
							size={90}
							width={8}
							fill={percent1}
							backgroundWidth={8}
							tintColor="#0BD081"
							tintColorSecondary="#ff0000"
							backgroundColor="#D2E2F8"
							arcSweepAngle={360}
							rotation={180}
							lineCap="round"
						>
							{() => (
								<View
									style={{
										flexDirection: 'row'
									}}
								>
									<Text
										style={{
											textAlign: 'center',
											color: '#F5F9FD',
											fontSize: 18,
											fontWeight: '100'
										}}
									>
										{percent1}
									</Text>
									<Text
										style={{
											textAlign: 'center',
											color: '#F5F9FD',
											fontSize: 13,
											fontWeight: '100'
										}}
									>
										%
									</Text>
								</View>
							)}
						</AnimatedCircularProgress>
					</View>

					<View
						style={{
							paddingHorizontal: 5,
							paddingVertical: 5,
							paddingTop: 30
						}}
					>
						<Text
							style={{
								fontFamily: 'RobotoRegular',
								fontSize: 11,
								color: '#F5F9FD',
								paddingBottom: 8,
								textAlign: 'center'
							}}
						>
							Disponibilidad
						</Text>
						<AnimatedCircularProgress
							duration={600}
							size={120}
							width={12}
							backgroundWidth={12}
							fill={percent2}
							tintColor="#0BD081"
							tintColorSecondary="#ff0000"
							backgroundColor="#D2E2F8"
							arcSweepAngle={360}
							rotation={180}
							lineCap="round"
						>
							{() => (
								<View
									style={{
										flexDirection: 'row'
									}}
								>
									<Text
										style={{
											textAlign: 'center',
											color: '#F5F9FD',
											fontSize: 30,
											fontWeight: '100'
										}}
									>
										{percent2}
									</Text>
									<Text
										style={{
											textAlign: 'center',
											color: '#F5F9FD',
											fontSize: 18,
											fontWeight: '100'
										}}
									>
										%
									</Text>
								</View>
							)}
						</AnimatedCircularProgress>
					</View>
					<View
						style={{
							paddingHorizontal: 5,
							paddingVertical: 5,
							paddingTop: -10
						}}
					>
						<Text
							style={{
								fontFamily: 'RobotoRegular',
								fontSize: 11,
								color: '#F5F9FD',
								paddingBottom: 10,
								paddingTop: 2,
								textAlign: 'center'
							}}
						>
							Expertis
						</Text>
						<AnimatedCircularProgress
							duration={600}
							size={90}
							width={8}
							backgroundWidth={8}
							fill={percent3}
							tintColor="#0BD081"
							tintColorSecondary="#ff0000"
							backgroundColor="#D2E2F8"
							arcSweepAngle={360}
							rotation={180}
							lineCap="round"
						>
							{() => (
								<View
									style={{
										flexDirection: 'row'
									}}
								>
									<Text
										style={{
											textAlign: 'center',
											color: '#F5F9FD',
											fontSize: 18,
											fontWeight: '100'
										}}
									>
										{percent3}
									</Text>
									<Text
										style={{
											textAlign: 'center',
											color: '#F5F9FD',
											fontSize: 13,
											fontWeight: '100'
										}}
									>
										%
									</Text>
								</View>
							)}
						</AnimatedCircularProgress>
					</View>
				</View>
			</View>
    );
}

export default CirclesStats;