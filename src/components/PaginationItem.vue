<script setup>
import { defineProps } from 'vue';

defineProps({
    label: {
        type: String,
        default: "",
    },
    active: {
        type: Boolean,
        default: false,
    },
    disabled: {
        type: Boolean,
        default: false,
    },
    prev: {
        type: Boolean,
        default: false,
    },
    next: {
        type: Boolean,
        default: false,
    },
});

const getClasses = (active, disabled) => {
    return `${active ? 'active' : ''} ${disabled ? 'disabled' : ''}`;
};
</script>

<template>
    <li class="page-item" :class="getClasses(active, disabled)">
        <a class="page-link" href="javascript:;" @click.stop="$emit('click')">
            <i v-if="prev"><i class="fa fa-angle-left"></i></i>
            <i v-else-if="next"><i class="fa fa-angle-right"></i></i>
            <a>{{ label }}</a>
        </a>
    </li>
</template>

<style scoped>
.page-item {
    cursor: pointer;
}

.page-item.disabled {
    cursor: not-allowed;
}
</style>
