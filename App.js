import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Test from './components/test'
import PostForm from './components/Post/addPostForm'
export default function App() {
  return (
    <View style={styles.container}>
      <Test />
      <StatusBar style="auto" />
      <PostForm />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
