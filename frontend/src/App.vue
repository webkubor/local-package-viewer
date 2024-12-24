
<template>
  <Toast/>
  <router-view/>
</template>
<script setup>
import Toast from 'primevue/toast';
import { initToast } from '@/utils/sysToast';
initToast();
</script>

