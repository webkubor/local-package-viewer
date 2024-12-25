 <template>
  <div class="welcome-container">
    <div class="content">
      <h1 class="title">Package Manager Viewer</h1>
      <p class="subtitle">管理您的本地包依赖</p>
      <div class="button-group">
        <Button class="manager-btn" @click="goToYarnList">
          <img src="@/assets/yarn-logo.svg" alt="Yarn" class="logo" />
          Yarn
        </Button>
        <Button class="manager-btn" @click="goToNpmList">
          <img src="@/assets/npm-logo.svg" alt="NPM" class="logo" />
          NPM
        </Button>
        <Button class="manager-btn" @click="goToPnpmList">
          <img src="@/assets/pnpm-logo.png" alt="PNPM" class="logo" />
          PNPM
        </Button>
      </div>
    </div>
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
<style lang="scss" scoped>
// 变量定义
$primary-color: #2c3e50;
$secondary-color: #606770;
$gradient-start: #f5f7fa;
$gradient-end: #c3cfe2;
$transition-time: 0.2s;

.welcome-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, $gradient-start 0%, $gradient-end 100%);
}

.content {
  text-align: center;
  padding: 2rem;

  .title {
    font-size: 2.5rem;
    color: $primary-color;
    margin-bottom: 1rem;
    font-weight: 600;
    
    &::after {
      content: '';
      display: block;
      width: 60px;
      height: 3px;
      background: $primary-color;
      margin: 0.5rem auto;
    }
  }

  .subtitle {
    font-size: 1.2rem;
    color: $secondary-color;
    margin-bottom: 3rem;
  }
}

.button-group {
  display: flex;
  gap: 2rem;
  justify-content: center;
  flex-wrap: wrap;
  
  .manager-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 1rem 2rem;
    font-size: 1.2rem;
    border-radius: 8px;
    transition: all $transition-time ease;
    background: white;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(0, 0, 0, 0.05);
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
    }
    
    &:active {
      transform: translateY(0);
    }

    .logo {
      width: 24px;
      height: 24px;
      transition: transform $transition-time ease;
    }
    .yarn{
      width: 54px;
      height: 54px;
    }

    &:hover .logo {
      transform: scale(1.1);
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .content {
    padding: 1.5rem;
    
    .title {
      font-size: 2rem;
    }
    
    .subtitle {
      font-size: 1rem;
      margin-bottom: 2rem;
    }
  }

  .button-group {
    gap: 1rem;
    
    .manager-btn {
      padding: 0.8rem 1.5rem;
      font-size: 1rem;
    }
  }
}
</style>