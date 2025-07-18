<template>
  <div class="container py-5">
    <h3 class="mb-4">Thống kê doanh thu</h3>

    <!-- Bộ lọc thời gian -->
    <div class="row g-3 align-items-end mb-4">
      <div class="col-md-3">
        <label for="from">Từ ngày:</label>
        <input id="from" type="date" v-model="filters.from" class="form-control" />
      </div>
      <div class="col-md-3">
        <label for="to">Đến ngày:</label>
        <input id="to" type="date" v-model="filters.to" class="form-control" />
      </div>
      <div class="col-md-3">
        <label for="type">Kiểu thống kê:</label>
        <select id="type" v-model="filters.type" class="form-select">
          <option value="day">Ngày</option>
          <option value="month">Tháng</option>
          <option value="year">Năm</option>
        </select>
      </div>
      <div class="col-md-3">
        <button class="btn btn-primary w-100 nomargin" @click="fetchStats">Thống kê</button>
      </div>
    </div>

    <!-- Biểu đồ & bảng -->
    <div class="row">
      <div class="col-md-8 mb-4">
        <Bar v-if="chartData" :data="chartData" :options="chartOptions" />
      </div>
      <div class="col-md-4">
        <table class="table table-bordered table-sm">
          <thead class="table-light">
            <tr>
              <th>Thời gian</th>
              <th>Doanh thu</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in stats" :key="item.label">
              <td>{{ item.label }}</td>
              <td>{{ formatCurrency(item.revenue) }}</td>
            </tr>
            <tr v-if="stats.length === 0">
              <td colspan="2" class="text-center text-muted">Không có dữ liệu</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from '@/config';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import { Bar } from 'vue-chartjs';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);
dayjs.extend(isoWeek);

const token = localStorage.getItem('accessToken');

const startOfWeek = dayjs().startOf('isoWeek').format('YYYY-MM-DD');
const endOfWeek = dayjs().endOf('isoWeek').format('YYYY-MM-DD');

const filters = ref({
  from: startOfWeek,
  to: endOfWeek,
  type: 'day',
  status: ['confirmed', 'completed'],
  paymentStatus: 'paid',
  hotelId: 1
});

const stats = ref([]);
const chartData = ref(null);
const chartOptions = {
  responsive: true,
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: (ctx) => `${ctx.raw.toLocaleString('vi-VN')} đ`
      }
    }
  },
  scales: {
    y: {
      ticks: {
        callback: (val) => `${val.toLocaleString('vi-VN')} đ`
      }
    }
  }
};

function fetchStats() {
  axios.get('/stats/revenue', {
    params: filters.value,
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
    .then(res => {
      stats.value = res.data;
      chartData.value = {
  labels: stats.value.map(s => s.label),
  datasets: [{
    label: 'Doanh thu',
    backgroundColor: '#4e73df',
    data: stats.value.map(s => s.revenue),
    barThickness: 40,       // ← GIẢM giá trị này để cột hẹp lại
    maxBarThickness: 50     // ← Không cho cột to hơn mức này
  }]
};

    })
    .catch(err => {
      console.error(err);
      alert('Lỗi khi lấy thống kê');
    });
}

function formatCurrency(val) {
  return Number(val || 0).toLocaleString('vi-VN') + ' đ';
}

onMounted(() => {
  fetchStats();
});
</script>

<style scoped>
table td {
  vertical-align: middle;
}
.nomargin {
  margin-bottom: 0 !important;
}
</style>
