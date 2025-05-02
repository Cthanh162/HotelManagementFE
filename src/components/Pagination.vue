<script setup>
import { defineProps, computed } from 'vue';
import PaginationItem from '@/components/PaginationItem.vue';

const props = defineProps({
  pagination: {
    type: Object,
    required: true,
    default: () => ({
      pageNumber: 1,
      totalPages: 1,
      totalCount: 0,
      hasPreviousPage: false,
      hasNextPage: false
    })
  },
  color: {
    type: String,
    default: "success",
  },
  size: {
    type: String,
    default: "md",
  }
});

const getClasses = (color, size) => {
  return `pagination-${color} pagination-${size}`;
};

const pagesToShow = computed(() => {
  const total = props.pagination.totalPages;
  const current = props.pagination.pageNumber;
  const delta = 2;
  const range = [];
  if(props.pagination.totalPages <=5 && props.pagination.totalPages >=2){
    for(let i = 2; i < props.pagination.totalPages; i++){
      range.push(i)
    }
    return range;
  }
  for (let i = Math.max(2, current - delta); i <= Math.min(total - 1, current + delta); i++) {
    range.push(i);
  }
  
  return range;
});
</script>

<template>
  <ul class="pagination" :class="getClasses(color, size)">
    <pagination-item 
      :disabled="!pagination.hasPreviousPage" 
      @click="$emit('previous-page')" 
      prev 
    />
    
    <pagination-item
      v-if="pagination.pageNumber >= 1"
      :label="'1'.toString()"
      :active="1 === pagination.pageNumber"
      @click="$emit('change-page', 1)"
    />
    
    <pagination-item 
      v-if="pagination.pageNumber >= 5" 
      :label="'...'" 
      disabled 
    />
    
    <pagination-item
      v-for="page in pagesToShow"
      :key="page"
      :label="page.toString()"
      :active="page === pagination.pageNumber"
      @click="$emit('change-page', page)"
    />
    
    <pagination-item 
      v-if="pagination.pageNumber <= pagination.totalPages - 4 && pagination.totalPages > 5" 
      :label="'...'" 
      disabled 
    />
    
    <pagination-item
      v-if="pagination.pageNumber <= pagination.totalPages"
      :label="pagination.totalPages.toString()"
      :active="pagination.totalPages === pagination.pageNumber"
      @click="$emit('change-page', pagination.totalPages)"
    />
    
    <pagination-item 
      :disabled="!pagination.hasNextPage" 
      @click="$emit('next-page')" 
      next 
    />
  </ul>
</template>

<script>

</script>
