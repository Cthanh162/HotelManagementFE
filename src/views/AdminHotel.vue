<template>
    <div class="container mt-4">
      <HotelTable
        :hotels="hotels"
        @edit="openEdit"
        @delete="deleteHotel"
        @create="openCreate"
      />
      <HotelForm
        v-model="showForm"
        :initialData="selectedHotel"
        @submit="saveHotel"
      />
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from "vue";
  import axios from "@/config/axios";
  import HotelTable from "@/components/Hotel/HotelTable.vue";
  import HotelForm from "@/components/Hotel/HotelForm.vue";
  
  const hotels = ref([]);
  const showForm = ref(false);
  const selectedHotel = ref(null);
  
  const fetchHotels = async () => {
    const response = await axios.get("/hotels");
    hotels.value = response.data;
  };
  
  function openCreate() {
    selectedHotel.value = null;
    showForm.value = true;
  }
  
  function openEdit(hotel) {
    selectedHotel.value = hotel;
    showForm.value = true;
  }
  
  async function saveHotel(hotel) {
    if (hotel.id) {
      await axios.put(`/hotels/${hotel.id}`, hotel);
    } else {
      await axios.post("/hotels", hotel);
    }
    await fetchHotels();
  }
  
  async function deleteHotel(id) {
    if (confirm("Bạn có chắc muốn xoá khách sạn này?")) {
      await axios.delete(`/hotels/${id}`);
      await fetchHotels();
    }
  }
  
  onMounted(fetchHotels);
  </script>