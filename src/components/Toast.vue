<template>
  <div class="container my-4">
    <div class="toast-container position-fixed m-2" :class="position">
      <div class="toast" :class="show">
        <ToastHeader 
          :toast="toast"
          @hide="hideToast"
        />
        <ToastBody :message="toast.message" />
      </div>
    </div>
  </div>
</template>

<script>
import ToastHeader from './ToastHeader.vue';
import ToastBody from './ToastBody.vue';
import EventBus from "@/services/EventBus";

export default {
  props: {
    action: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      toast: {
        icon: '',
        title: '',
        time: '',
        message: '',
        bgColor: '',
      },
      show: '',
      position: '',
      timeout: null
    }
  },
  components: {
    ToastHeader,
    ToastBody
  },
  created() {
    EventBus.on("showToast", this.triggerToast);
  },
  beforeUnmount() {
    EventBus.off("showToast", this.triggerToast);
  },
  watch: {
    action: {
      immediate: true,
      handler(newAction) {
        if (newAction) {
          this.triggerToast(newAction, this.message);
        }
      }
    },
    show() {
      if (this.timeout) {
        clearTimeout(this.timeout);
      }
      this.timeout = setTimeout(() => {
        this.show = '';
        this.position = '';
      }, 3000);
    }
  },
  methods: {
    triggerToast(action, message) {
      if (action === 'info' && !message) {
        message = this.$t("toast.newNotification");
      }
      const toastSettings = {
        success: {
          icon: 'fa-solid fa-check me-2',
          title: this.$t('toast.success'),
          bgColor: 'bg-success',
          position: 'top-0 end-0'
        },
        danger: {
          icon: 'fa-solid fa-bolt me-2',
          title: this.$t('toast.danger'),
          bgColor: 'bg-danger',
          position: 'top-0 end-0'
        },
        warning: {
          icon: 'fa-solid fa-exclamation me-2',
          title: this.$t('toast.warning'),
          bgColor: 'bg-warning',
          position: 'top-0 end-0'
        },
        info: {
          icon: 'fa-solid fa-info me-2',
          title: this.$t('toast.infor'),
          bgColor: 'bg-info',
          position: 'bottom-0 end-0'
        }
      };

      const settings = toastSettings[action];
      this.show = 'show';
      this.position = settings.position;
      this.toast = {
        icon: settings.icon,
        time: this.getRelativeTime(new Date()),
        title: settings.title,
        bgColor: settings.bgColor,
        message: message
      };
    },
    hideToast() {
      this.show = '';
      this.position = '';
    },
    getRelativeTime(date) {
      const now = new Date();
      const diff = now - date;

      const seconds = Math.floor(diff / 1000);
      if (seconds < 60) return this.$t('toast.now');

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
  }
}
</script>

<style scoped>
.toast-container {
  z-index: 1100;
}
.toast {
  transition: opacity 0.5s ease-in-out;
}
.show {
  opacity: 1;
}
</style>
