import { RootState } from '@/src/store';
import { useColorScheme as _useSystemColorScheme } from 'react-native';
import { useSelector } from 'react-redux';

export function useColorScheme(): 'light' | 'dark' {
  const themeMode = useSelector((state: RootState) => state.theme?.mode ?? 'system');
  const systemScheme = _useSystemColorScheme(); // 'light' | 'dark' | null
  if (themeMode === 'system') return (systemScheme as 'light' | 'dark') ?? 'light';
  return themeMode as 'light' | 'dark';
}

export default useColorScheme;
