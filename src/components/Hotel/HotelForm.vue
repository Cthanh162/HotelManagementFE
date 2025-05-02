<template>
    <argon-modal v-model:visible="visible">
      <template #header>
        <h5>{{ isEdit ? 'Cập nhật khách sạn' : 'Thêm khách sạn' }}</h5>
      </template>
  
      <template #body>
        <form @submit.prevent="submitForm">
          <div class="form-group">
            <label>Tên khách sạn</label>
            <input v-model="hotel.name" type="text" class="form-control" required />
          </div>
          <div class="form-group mt-3">
            <label>Địa chỉ</label>
            <input v-model="hotel.address" type="text" class="form-control" required />
          </div>
        </form>
      </template>
  
      <template #footer>
        <argon-button color="secondary" @click="close">Hủy</argon-button>
        <argon-button color="primary" @click="submitForm">{{ isEdit ? 'Lưu' : 'Thêm' }}</argon-button>
      </template>
    </argon-modal>
  </template>
  
  <script setup>
  import { ref, watch } from "vue";
  import ArgonModal from "@/components/ArgonModal.vue";
  import ArgonButton from "@/components/ArgonButton.vue";
  
  const props = defineProps(["modelValue", "initialData"]);
  const emit = defineEmits(["update:modelValue", "submit"]);
  
  const visible = ref(props.modelValue);
  const hotel = ref({ name: "", address: "" });
  
  const isEdit = ref(false);
  
  watch(() => props.modelValue, (val) => {
    visible.value = val;
  });
  watch(() => visible.value, (val) => {
    emit("update:modelValue", val);
  });
  
  watch(() => props.initialData, (data) => {
    if (data) {
      hotel.value = { ...data };
      isEdit.value = true;
    } else {
      hotel.value = { name: "", address: "" };
      isEdit.value = false;
    }
  }, { immediate: true });
  
  function submitForm() {
    emit("submit", hotel.value);
    visible.value = false;
  }
  
  function close() {
    visible.value = false;
  }
  </script>