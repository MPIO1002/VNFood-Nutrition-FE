import { Tabs } from 'expo-router';
import { View, Text, Pressable, Platform } from 'react-native';
import { Book, TrendingUp, ScanText, UtensilsCrossed, UserCircle } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PressScale } from '../../components/PressScale';

function CustomTabBar({ state, descriptors, navigation }: any) {
  const insets = useSafeAreaInsets();

  return (
    <View 
      className="absolute bottom-0 w-full flex-row bg-white border-t border-zinc-200 shadow-sm"
      style={{
        paddingBottom: Platform.OS === 'ios' ? Math.max(insets.bottom, 12) : 12,
        paddingTop: 12,
      }}
    >
      {state.routes.map((route: any, index: number) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;
        
        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        // Configuration based on route name
        let Icon = Book;
        let label = 'Nhật ký';
        
        if (route.name === 'analytics') {
          Icon = TrendingUp;
          label = 'Phân tích';
        } else if (route.name === 'scan') {
          Icon = ScanText;
          label = 'Quét AI';
        } else if (route.name === 'menu') {
          Icon = UtensilsCrossed;
          label = 'Thực đơn';
        } else if (route.name === 'profile') {
          Icon = UserCircle;
          label = 'Cá nhân';
        }

        const color = isFocused ? '#18181B' : '#71717A';

        // Special FAB layout for scan tab
        if (route.name === 'scan') {
          return (
            <View key={route.key} className="flex-1 items-center justify-start">
              <PressScale 
                onPress={onPress}
                toValue={0.95}
              >
                <View className="items-center -mt-8">
                  <View 
                    className="w-[60px] h-[60px] rounded-full bg-charcoal-pure items-center justify-center border-4 border-canvas-white shadow-lg"
                    style={{
                      shadowColor: '#18181B',
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.15,
                      shadowRadius: 12,
                      elevation: 8,
                    }}
                  >
                    <Icon size={26} color="#FFFFFF" />
                  </View>
                  <Text className="font-montserrat-semibold text-[11px] text-charcoal-pure mt-1">
                    {label}
                  </Text>
                </View>
              </PressScale>
            </View>
          );
        }

        // Normal tab layout
        return (
          <Pressable
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            onPress={onPress}
            onLongPress={onLongPress}
            className="flex-1 items-center justify-center gap-1.5 pt-1"
          >
            <Icon size={24} color={color} strokeWidth={isFocused ? 2.5 : 2} />
            <Text 
              className={`font-montserrat text-[10px] ${isFocused ? 'font-montserrat-semibold text-charcoal-pure' : 'text-zinc-500'}`}
            >
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="analytics" />
      <Tabs.Screen name="scan" />
      <Tabs.Screen name="menu" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}
