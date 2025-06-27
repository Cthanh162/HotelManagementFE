<template>
  <div class="toast-container position-fixed m-2" :class="position">
    <div class="toast" :class="{ show: isVisible }">
      <ToastHeader :toast="toast" @hide="hideToast" />
      <ToastBody :message="toast.message" />
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import ToastHeader from './ToastHeader.vue';
import ToastBody from './ToastBody.vue';
import EventBus from '@/services/EventBus';

const props = defineProps({
  action: { type: String, default: '' },
  message: { type: String, default: '' }
});

const { t } = useI18n();
const toast = ref({
  icon: '',
  title: '',
  time: '',
  message: '',
  bgColor: ''
});
const isVisible = ref(false);
const position = ref('');
let timeout = null;

function triggerToast(action, message) {
  if (action === 'info' && !message) {
    message = t('toast.newNotification');
  }

  const toastSettings = {
    success: {
      icon: 'fa-solid fa-check me-2',
      title: t('toast.success'),
      bgColor: 'bg-success',
      position: 'top-0 end-0'
    },
    danger: {
      icon: 'fa-solid fa-bolt me-2',
      title: t('toast.danger'),
      bgColor: 'bg-danger',
      position: 'top-0 end-0'
    },
    warning: {
      icon: 'fa-solid fa-exclamation me-2',
      title: t('toast.warning'),
      bgColor: 'bg-warning',
      position: 'top-0 end-0'
    },
    info: {
      icon: 'fa-solid fa-info me-2',
      title: t('toast.infor'),
      bgColor: 'bg-info',
      position: 'bottom-0 end-0'
    }
  };

  const settings = toastSettings[action];
  position.value = settings.position;
  toast.value = {
    icon: settings.icon,
    title: settings.title,
    time: getRelativeTime(new Date()),
    message,
    bgColor: settings.bgColor
  };

  isVisible.value = true;
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    isVisible.value = false;
    position.value = '';
  }, 3000);
}

function hideToast() {
  isVisible.value = false;
  position.value = '';
}

function getRelativeTime(date) {
  const now = new Date();
  const diff = now - date;
  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) return t('toast.now');
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minutes ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hours ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} months ago`;
  const years = Math.floor(months / 12);
  return `${years} years ago`;
}

watch(() => props.action, (newAction) => {
  if (newAction) {
    triggerToast(newAction, props.message);
  }
}, { immediate: true });

EventBus.on("showToast", triggerToast);
</script>

<style scoped>
.toast-container {
  z-index: 1100;
}
.toast {
  transition: opacity 0.5s ease-in-out;
  opacity: 0;
}
.toast.show {
  opacity: 1;
}
</style>