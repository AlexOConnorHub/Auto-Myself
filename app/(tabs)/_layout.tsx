import { Ionicons } from '@app/components/elements';
import { useTheme } from '@react-navigation/native';
import { Tabs } from 'expo-router';

function HomeLogo(props): React.ReactNode {
  return <Ionicons size={28} name={props.focused ? 'car-sharp' : 'car-outline'} />;
}

function SettingLogo(props): React.ReactNode {
  return <Ionicons size={28} name={props.focused ? 'settings-sharp' : 'settings-outline'} />;
}

export default function TabLayout() {
  const theme = useTheme();

  return (
    <Tabs screenOptions={{
      tabBarStyle: {
        borderTopWidth: 0,
      },
      tabBarShowLabel: false,
      headerTitleStyle: {
        color: theme.colors.text,
      },
      headerStyle: {
        backgroundColor: theme.colors.border,
      },
      sceneStyle: {
        backgroundColor: theme.colors.background,
      },
    }}>
      <Tabs.Screen name='vehicle' options={{
        tabBarIcon: HomeLogo,
        tabBarAccessibilityLabel: 'Index',
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.colors.border,
        },
      }}/>
      <Tabs.Screen name='settings' options={{
        tabBarIcon: SettingLogo,
        tabBarAccessibilityLabel: 'Settings',
        headerTitle: 'Settings',
        tabBarStyle: {
          backgroundColor: theme.colors.border,
        },
      }}/>
      <Tabs.Screen name='index' options={{
        href: null,
      }}/>
    </Tabs>
  );
}
