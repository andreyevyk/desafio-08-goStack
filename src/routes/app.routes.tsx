import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { Image, View } from 'react-native';

import FeatherIcon from 'react-native-vector-icons/Feather';

import Dashboard from '../pages/Dashboard';
import Cart from '../pages/Cart';

import Logo from '../assets/logo.png';

const App = createStackNavigator();

const AppRoutes: React.FC = () => (
  <App.Navigator
    screenOptions={{
      headerShown: true,
      cardStyle: { backgroundColor: '#EBEEF8' },
      headerTitle: () => <Image source={Logo} />,
      headerTitleAlign: 'center',
    }}
    initialRouteName="Dashboard"
  >
    <App.Screen
      options={{
        headerShown: true,
        headerTransparent: true,
      }}
      name="Dashboard"
      component={Dashboard}
    />
    <App.Screen
      options={{
        headerTransparent: true,
        headerBackTitleVisible: false,
        headerLeftContainerStyle: {
          marginLeft: 20,
        },

        headerBackImage: () => <FeatherIcon name="chevron-left" size={24} />,
      }}
      name="Cart"
      component={Cart}
    />
  </App.Navigator>
);

export default AppRoutes;
