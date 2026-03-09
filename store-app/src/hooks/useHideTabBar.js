import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

export function useHideTabBar(navigation) {
  useFocusEffect(
    useCallback(() => {
      navigation.getParent()?.setOptions({ tabBarStyle: { display: 'none' } });
      return () => {
        navigation.getParent()?.setOptions({ tabBarStyle: undefined });
      };
    }, [navigation])
  );
}