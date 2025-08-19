import { Ionicons } from '@app/components/elements';
import { Tabs } from 'expo-router';

function HomeLogo(props): React.ReactNode {
  return <Ionicons size={48} name={props.focused ? 'car-sharp' : 'car-outline'} />;
}

function SettingLogo(props): React.ReactNode {
  return <Ionicons size={48} name={props.focused ? 'settings-sharp' : 'settings-outline'} />;
}

export default function TabLayout() {
  return (
    <Tabs screenOptions={{
      tabBarActiveTintColor: 'blue',
      tabBarStyle: {
        borderTopWidth: 0,
      },
      tabBarShowLabel: false,
      headerTitleStyle: {
        fontSize: 30,
        fontWeight: 'bold',
      },
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
