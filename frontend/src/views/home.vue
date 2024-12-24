<template>
  <div class="welcome">
    <h1>local-package-viewer</h1>
    <Button @click="goToYarnList">Yarn List</Button>
    <Button @click="goToNpmList">NPM List</Button>
    <Button @click="goToPnpmList">PNPM List</Button>
  </div>
</template>
<script setup lang="ts">
import { useRouter } from "vue-router";
let router = useRouter()
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