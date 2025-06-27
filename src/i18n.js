// src/i18n.js
import { createI18n } from 'vue-i18n';

const messages = {
  en: {
    toast: {
      success: 'Success',
      danger: 'Error',
      warning: 'Warning',
      infor: 'Information',
      now: 'just now',
      newNotification: 'New Notification'
    }
  },
  vi: {
    toast: {
      success: 'Thành công',
      danger: 'Thất bại',
      warning: 'Cảnh báo',
      infor: 'Thông tin',
      now: 'Vừa xong',
      newNotification: 'Thông báo mới'
    }
  }
};

const i18n = createI18n({
  legacy: false, // dùng Composition API
  locale: 'vi',
  fallbackLocale: 'en',
  messages
});

export default i18n;