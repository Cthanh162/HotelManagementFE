<template>
    <argon-card>
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h4 class="mb-0">Danh sách khách sạn</h4>
        <argon-button color="success" @click="$emit('create')">+ Thêm khách sạn</argon-button>
      </div>
  
      <div class="table-responsive">
        <table class="table align-items-center mb-0">
          <thead>
            <tr>
              <th>Tên</th>
              <th>Địa chỉ</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="hotel in hotels" :key="hotel.id">
              <td>{{ hotel.name }}</td>
              <td>{{ hotel.address }}</td>
              <td>
                <argon-button color="info" size="sm" @click="$emit('edit', hotel)">Sửa</argon-button>
                <argon-button color="danger" size="sm" class="ms-2" @click="$emit('delete', hotel.id)">Xoá</argon-button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </argon-card>
  </template>
  
  <script setup>
  import ArgonCard from "@/components/ArgonCard.vue";
  import ArgonButton from "@/components/ArgonButton.vue";
  defineProps(["hotels"]);
  defineEmits(["edit", "delete", "create"]);
  </script>