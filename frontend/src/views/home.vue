<template>
    <div class="welcome">
      <h1>local-package-viewer</h1>
      <Button @click="goToYarnList">Yarn List</Button>
      <Button @click="goToNpmList">NPM List</Button>
      <Button @click="goToPnpmList">PNPM List</Button>
    </div>
  </template>
  <script setup lang="ts">
import {useRouter} from "vue-router";

import { useToast } from 'primevue/usetoast';

const toast = useToast();
let router = useRouter()


toast.success('Welcome to local-package-viewer')
function goToYarnList() {
    router.push('/yarn/list')
}

function goToNpmList() {
  router.push('/npm/list')
}

function goToPnpmList() {
  router.push('/pnpm/list')
}
</script>