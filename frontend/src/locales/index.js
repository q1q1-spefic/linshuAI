import { zh } from './zh';
import { en } from './en';

// 可用语言列表
export const LANGUAGES = {
  zh: { code: 'zh', name: '中文', nativeName: '中文' },
  en: { code: 'en', name: 'English', nativeName: 'English' }
};

// 语言包映射
export const LOCALE_MESSAGES = {
  zh,
  en
};

// 默认语言
export const DEFAULT_LANGUAGE = 'zh';

// 获取浏览器首选语言
export const getBrowserLanguage = () => {
  const language = navigator.language || navigator.userLanguage;
  const langCode = language.split('-')[0];
  return LANGUAGES[langCode] ? langCode : DEFAULT_LANGUAGE;
};

// 从localStorage获取保存的语言设置
export const getSavedLanguage = () => {
  const saved = localStorage.getItem('language');
  return saved && LANGUAGES[saved] ? saved : getBrowserLanguage();
};

// 保存语言设置到localStorage
export const saveLanguage = (language) => {
  if (LANGUAGES[language]) {
    localStorage.setItem('language', language);
  }
};