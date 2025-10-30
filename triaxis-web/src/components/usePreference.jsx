// preference-context.js
import { createContext, useContext, useState, useEffect } from 'react';
import { getPreferenceData, setPreferenceData } from '../utils/localStorage';


const PreferenceContext = createContext(null);

export const PreferenceProvider = ({ children }) => {

  const [theme, setTheme] = useState('light');
  const [language, setLanguage] = useState('Chinese');


  useEffect(() => {
    const { theme: savedTheme, language: savedLanguage } = getPreferenceData();
    setTheme(savedTheme || 'light');
    setLanguage(savedLanguage || 'Chinese');
    document.documentElement.setAttribute('data-theme', savedTheme || 'light');
  }, []);

  // 切换主题
  const changeTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    setPreferenceData({ theme: newTheme });
  };

  // 切换语言
  const changeLanguage = () => {
    const newLanguage = language === 'Chinese' ? 'English' : 'Chinese';
    setLanguage(newLanguage);
    setPreferenceData({ language: newLanguage });
  };


  const value = {
    theme,
    language,
    changeLanguage,
    changeTheme,
    isDark: theme === 'dark',
    isEnglish: language === 'English'
  };

  return (
    <PreferenceContext.Provider value={value}>
      {children}
    </PreferenceContext.Provider>
  );
};

export const usePreference = () => {
  return useContext(PreferenceContext);
};