import React, { useState, useEffect } from "react";
import { View, Animated, StyleSheet } from "react-native";

const ProgressBar = ({ duration, onClose }) => {
  const [progress, setProgress] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(progress, {
      toValue: 1,
      duration,
      useNativeDriver: true,
    }).start(onClose);
  }, []);

  const width = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ["100%", "0%"],
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.progress, { width }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 5,
    backgroundColor: "#f2f2f2",
    borderRadius: 2.5,
    overflow: "hidden",
  },
  progress: {
    height: 5,
    backgroundColor: "#ff6666",
  },
});

export default ProgressBar;
