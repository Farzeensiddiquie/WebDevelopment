import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SymbolViewProps, SymbolWeight } from 'expo-symbols';
import { ComponentProps } from 'react';
import { OpaqueColorValue, StyleProp, TextStyle } from 'react-native';

const MAPPING = {
  'house.fill': 'home',
  'paperplane.fill': 'send',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.right': 'chevron-right',
  'tv.fill': 'live-tv',
  'bag.fill': 'shopping-bag',
  'person.2.fill': 'group',
  'gamecontroller.fill': 'sports-esports',
  'magnifyingglass': 'search',
  'message.fill': 'message',
  'plus.circle.fill': 'add-circle',
} as const;


type IconMapping = typeof MAPPING;
export type IconSymbolName = keyof IconMapping;

export function IconSymbol({
  name,
  size = 24,
  color,
  style,
  weight,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  return <MaterialIcons color={color} size={size} name={MAPPING[name]} style={style} />;
}
