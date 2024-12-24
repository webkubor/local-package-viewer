
<template>
  <Toast/>
  <Message v-if="messageInstance.show" :severity="messageInstance.severity" :life="messageInstance.life" variant="outlined" closable>{{messageInstance.content}}</Message>
  <router-view/>
</template>
<script setup>
import Toast from 'primevue/toast';
import { initToast } from '@/utils/sysToast';
import { useMessage } from './hooks/useMessage';
const {initMessage, messageInstance} = useMessage();
initToast();
initMessage()
</script>

