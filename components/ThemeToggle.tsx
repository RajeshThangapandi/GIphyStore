import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <TouchableOpacity onPress={toggleTheme}>
      <Ionicons
        name={theme === 'light' ? 'moon' : 'sunny'}
        size={24}
        color={theme === 'light' ? 'black' : 'white'}
      />
    </TouchableOpacity>
  );
};

export default ThemeToggle;

