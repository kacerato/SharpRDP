import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';

export function InputOverlay({ onJoystickMove, onInteractPress, onInteractRelease }) {

  const onGestureEvent = (event) => {
    const { translationX, translationY } = event.nativeEvent;
    // Normalize logic (simplified for prototype)
    const maxRange = 50;
    const x = Math.max(-1, Math.min(1, translationX / maxRange));
    const y = Math.max(-1, Math.min(1, translationY / maxRange));
    onJoystickMove(x, y);
  };

  const onHandlerStateChange = (event) => {
      // Reset when finger lifts
      if (event.nativeEvent.state === 5) { // END state
          onJoystickMove(0, 0);
      }
  }

  return (
    <View style={styles.overlay} pointerEvents="box-none">
        {/* Virtual Joystick Zone (Left) */}
        <PanGestureHandler onGestureEvent={onGestureEvent} onHandlerStateChange={onHandlerStateChange}>
            <View style={styles.joystickArea}>
                <View style={styles.joystickThumb} />
            </View>
        </PanGestureHandler>

        {/* Action Buttons (Right) */}
        <View style={styles.actionsArea}>
            <TouchableOpacity
                style={styles.actionButton}
                onPressIn={onInteractPress}
                onPressOut={onInteractRelease}
            >
                <Text style={styles.buttonText}>GRAB</Text>
            </TouchableOpacity>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 30,
  },
  joystickArea: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 'auto',
  },
  joystickThumb: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  actionsArea: {
    marginTop: 'auto',
  },
  actionButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(150, 50, 50, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(200, 100, 100, 0.8)',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  }
});
