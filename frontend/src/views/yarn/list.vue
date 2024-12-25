<template>
  <div class="yarn-list">
    <Card>
      <template #title>
        全局包管理
      </template>
      
      <!-- 搜索和安装区域 -->
      <div class="flex mb-4 gap-2">
        <span class="p-input-icon-right">
          <i class="pi pi-search" />
          <InputText 
            v-model="searchKeyword" 
            placeholder="搜索包名"
            @keyup.enter="handleSearch"
          />
        </span>
        <Button 
          label="安装新包" 
          icon="pi pi-plus" 
          @click="showInstallModal"
        />
      </div>

      <!-- 包列表 -->
      <DataTable 
        :value="packages" 
        :loading="loading"
        stripedRows
        :paginator="true" 
        :rows="10"
      >
        <Column field="name" header="包名"></Column>
        <Column field="version" header="版本"></Column>
        <Column header="操作">
          <template #body="slotProps">
            <div class="flex gap-2">
              <Button 
                icon="pi pi-info-circle"
                text 
                @click="showPackageInfo(slotProps.data)"
              />
              <Button 
                icon="pi pi-trash" 
                text 
                severity="danger"
                @click="confirmRemove(slotProps.data)"
              />
            </div>
          </template>
        </Column>
      </DataTable>
    </Card>

    <!-- 安装包对话框 -->
    <Dialog 
      v-model:visible="installModalVisible"
      header="安装全局包"
      modal
      :style="{ width: '450px' }"
    >
      <div class="flex flex-column gap-2">
        <div class="field">
          <label for="packageName">包名</label>
          <InputText 
            id="packageName"
            v-model="installForm.packageName" 
            class="w-full"
          />
        </div>
        <div class="field">
          <label for="version">版本（可选）</label>
          <InputText 
            id="version"
            v-model="installForm.version" 
            class="w-full"
          />
        </div>
      </div>
      <template #footer>
        <Button 
          label="取消" 
          icon="pi pi-times" 
          text 
          @click="installModalVisible = false"
        />
        <Button 
          label="安装" 
          icon="pi pi-check" 
          @click="handleInstall"
        />
      </template>
    </Dialog>

    <!-- 包详情对话框 -->
    <Dialog 
      v-model:visible="infoModalVisible"
      header="包信息"
      modal
      :style="{ width: '500px' }"
    >
      <div v-if="currentPackageInfo" class="flex flex-column gap-2">
        <div class="field">
          <label>名称：</label>
          <span>{{ currentPackageInfo.name }}</span>
        </div>
        <div class="field">
          <label>版本：</label>
          <span>{{ currentPackageInfo.version }}</span>
        </div>
        <div class="field">
          <label>描述：</label>
          <span>{{ currentPackageInfo.description }}</span>
        </div>
        <div class="field">
          <label>许可证：</label>
          <span>{{ currentPackageInfo.license }}</span>
        </div>
        <div class="field">
          <label>主页：</label>
          <a :href="currentPackageInfo.homepage" target="_blank">
            {{ currentPackageInfo.homepage }}
          </a>
        </div>
      </div>
    </Dialog>
    <ConfirmPopup id="confirm" aria-label="popup" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';
import packageApi from '@/api/package';

const toast = useToast();
const confirm = useConfirm();

const loading = ref(false);
const packages = ref<any[]>([]);
const searchKeyword = ref('');
const installModalVisible = ref(false);
const infoModalVisible = ref(false);
const currentPackageInfo = ref<any>(null);
const installForm = ref({
  packageName: '',
  version: '',
});

// 获取包列表
const fetchPackages = async () => {
  loading.value = true;
  try {
    const res = await packageApi.getGlobalDependencies('yarn');
    packages.value = res.dependencies || [];
  } catch (error) {
    toast.add({ severity: 'error', summary: '错误', detail: '获取包列表失败' });
  } finally {
    loading.value = false;
  }
};

// 搜索包
const handleSearch = async () => {
  if (!searchKeyword.value) return;
  loading.value = true;
  try {
    const res = await packageApi.searchPackage(searchKeyword.value);
    toast.add({ severity: 'success', summary: '成功', detail: '搜索完成' });
  } catch (error) {
    toast.add({ severity: 'error', summary: '错误', detail: '搜索失败' });
  } finally {
    loading.value = false;
  }
};

// 确认删除
const confirmRemove = (data: any) => {
  confirm.require({
    message: '确定要删除这个包吗？',
    header: '删除确认',
    icon: 'pi pi-exclamation-triangle',
    accept: () => handleRemove(data.name)
  });
};

// 删除包
const handleRemove = async (packageName: string) => {
  try {
    await packageApi.removeGlobalPackage(packageName);
    toast.add({ severity: 'success', summary: '成功', detail: '删除成功' });
    fetchPackages();
  } catch (error) {
    toast.add({ severity: 'error', summary: '错误', detail: '删除失败' });
  }
};

// 安装包
const handleInstall = async () => {
  if (!installForm.value.packageName) {
    toast.add({ severity: 'warn', summary: '警告', detail: '请输入包名' });
    return;
  }
  try {
    await packageApi.installGlobalPackage({
      packageName: installForm.value.packageName,
      version: installForm.value.version,
    });
    toast.add({ severity: 'success', summary: '成功', detail: '安装成功' });
    installModalVisible.value = false;
    installForm.value = { packageName: '', version: '' };
    fetchPackages();
  } catch (error) {
    toast.add({ severity: 'error', summary: '错误', detail: '安装失败' });
  }
};

// 显示包详情
const showPackageInfo = async (record: any) => {
  try {
    const info = await packageApi.getPackageInfo(record.name);
    currentPackageInfo.value = info;
    infoModalVisible.value = true;
  } catch (error) {
    toast.add({ severity: 'error', summary: '错误', detail: '获取包信息失败' });
  }
};

const showInstallModal = () => {
  installModalVisible.value = true;
};

onMounted(() => {
  fetchPackages();
});
</script>

<style scoped>
.yarn-list {
  padding: 1.5rem;
}
.field {
  margin-bottom: 1rem;
}
.field label {
  font-weight: bold;
  margin-right: 0.5rem;
}
</style>