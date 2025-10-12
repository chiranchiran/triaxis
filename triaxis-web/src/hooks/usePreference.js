import { useState, useEffect } from 'react';
import { getPreferenceData, setPreferenceData } from '../utils/localStorage';

export const usePrefernce = () => {
  const [theme, setTheme] = useState('light');
  const [language, setLanguage] = useState('Chinese');
  useEffect(() => {
    const { theme: savedTheme, language: savedLanguage } = getPreferenceData()
    setTheme(savedTheme)
    setLanguage(savedLanguage)
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const changeTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    setPreferenceData({ theme: newTheme })
  };
  const changeLanguage = () => {
    const newLanguage = language === 'Chinese' ? 'English' : 'Chinese';
    setLanguage(newLanguage);
    setPreferenceData({ language: newLanguage })
  };
  return {
    theme,
    language,
    changeLanguage,
    changeTheme,
    isDark: theme === 'dark',
    isEnglish: language === 'English'
  };
};