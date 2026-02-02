import { Ionicons } from '@app/components/elements';
import { useKeyboardVisible } from '@app/components/hooks/keyboardVisible';
import { Tabs } from 'expo-router';

function HomeLogo(props): React.ReactNode {
  return <Ionicons size={28} name={props.focused ? 'car-sharp' : 'car-outline'} />;
}

function SettingLogo(props): React.ReactNode {
  return <Ionicons size={28} name={props.focused ? 'settings-sharp' : 'settings-outline'} />;
}

export default function TabLayout() {
  const keyboardVisible = useKeyboardVisible();

  return (
    <Tabs screenOptions={{
      tabBarStyle: {
        borderTopWidth: 0,
        display: keyboardVisible ? 'none' : 'flex',
      },
      tabBarShowLabel: false,
    }}>
      <Tabs.Screen name='vehicle' options={{
        tabBarIcon: HomeLogo,
        tabBarAccessibilityLabel: 'Index',
        headerShown: false,
      }}/>
      <Tabs.Screen name='settings' options={{
        tabBarIcon: SettingLogo,
        tabBarAccessibilityLabel: 'Settings',
        headerTitle: 'Settings',
      }}/>
      <Tabs.Screen name='index' options={{
        href: null,
      }}/>
    </Tabs>
  );
}
