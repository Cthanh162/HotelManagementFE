<template>
    <label :for="forName" class="d-flex align-items-center">
      <span>{{ text }}</span>
      <div v-if="isRequired" class="text-danger ms-1">(*)</div>
      <span>:</span>
    </label>
  </template>
  
  <script>
  export default {
    props: {
      text: {
        type: String,
        required: true
      },
      forName: {
        type: String,
        required: true
      },
      isRequired: {
        type: Boolean,
        default: false
      }
    },
  }
  </script>
  