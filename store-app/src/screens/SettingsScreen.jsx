import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SettingsScreen() {
  return (
    <SafeAreaView style={{ flex: 1, alignItems: 'center' }}>
    <View>
      <Text>Example #1: Dark Mode switch</Text>
      <Text>Example #2: Language select</Text>
    </View>
    </SafeAreaView>
  );
}