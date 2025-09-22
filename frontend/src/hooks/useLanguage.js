import { useState, useEffect, createContext, useContext } from 'react';
import {
  LOCALE_MESSAGES,
  getSavedLanguage,
  saveLanguage,
  DEFAULT_LANGUAGE
} from '../locales';

// 语言上下文
const LanguageContext = createContext();

// 语言Provider组件
export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState(getSavedLanguage());

  // 切换语言
  const changeLanguage = (language) => {
    setCurrentLanguage(language);
    saveLanguage(language);
  };

  // 获取翻译文本
  const t = (path, defaultValue = '') => {
    const keys = path.split('.');
    let current = LOCALE_MESSAGES[currentLanguage] || LOCALE_MESSAGES[DEFAULT_LANGUAGE];

    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = current[key];
      } else {
        return defaultValue || path;
      }
    }

    return current !== undefined ? current : defaultValue || path;
  };

  const value = {
    currentLanguage,
    changeLanguage,
    t,
    isZh: currentLanguage === 'zh',
    isEn: currentLanguage === 'en'
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

// 使用语言hook
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};