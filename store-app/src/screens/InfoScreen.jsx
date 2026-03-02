import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function InfoScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
    <View>
      <Text>Info Screen....</Text>
    </View>
    </SafeAreaView>
  );
}