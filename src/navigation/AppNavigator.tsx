import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { RootTabParamList } from '../types';

import DashboardScreen from '../screens/DashboardScreen';
import EventsScreen from '../screens/EventsScreen';
import CheckInScreen from '../screens/CheckInScreen';
import OrdersScreen from '../screens/OrdersScreen';
import PromotersScreen from '../screens/PromotersScreen';
import AnalyticsScreen from '../screens/AnalyticsScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Tab = createBottomTabNavigator<RootTabParamList>();

const tabConfig: {
  name: keyof RootTabParamList;
  component: React.ComponentType<any>;
  icon: keyof typeof Ionicons.glyphMap;
  iconFocused: keyof typeof Ionicons.glyphMap;
}[] = [
  {
    name: 'Dashboard',
    component: DashboardScreen,
    icon: 'grid-outline',
    iconFocused: 'grid',
  },
  {
    name: 'Events',
    component: EventsScreen,
    icon: 'calendar-outline',
    iconFocused: 'calendar',
  },
  {
    name: 'CheckIn',
    component: CheckInScreen,
    icon: 'scan-outline',
    iconFocused: 'scan',
  },
  {
    name: 'Orders',
    component: OrdersScreen,
    icon: 'receipt-outline',
    iconFocused: 'receipt',
  },
  {
    name: 'Promoters',
    component: PromotersScreen,
    icon: 'people-outline',
    iconFocused: 'people',
  },
  {
    name: 'Analytics',
    component: AnalyticsScreen,
    icon: 'bar-chart-outline',
    iconFocused: 'bar-chart',
  },
  {
    name: 'Settings',
    component: SettingsScreen,
    icon: 'settings-outline',
    iconFocused: 'settings',
  },
];

export default function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: 85,
          paddingBottom: 28,
          paddingTop: 8,
        },
        tabBarActiveTintColor: colors.violet,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
        },
      }}
    >
      {tabConfig.map((tab) => (
        <Tab.Screen
          key={tab.name}
          name={tab.name}
          component={tab.component}
          options={{
            tabBarLabel: tab.name === 'CheckIn' ? 'Check-In' : tab.name,
            tabBarIcon: ({ focused, color, size }) => (
              <Ionicons
                name={focused ? tab.iconFocused : tab.icon}
                size={22}
                color={color}
              />
            ),
          }}
        />
      ))}
    </Tab.Navigator>
  );
}
