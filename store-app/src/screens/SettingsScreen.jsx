import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SettingsScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
    <View>
      <Text>Example: Dark Mode switch</Text>
    </View>
    </SafeAreaView>
  );
}