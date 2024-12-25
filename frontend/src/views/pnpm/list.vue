<template>
  <div class="pnpm-list">
    <Card>
      <template #title>
        <div class="flex align-items-center gap-2">
          <i class="pi pi-box text-xl"></i>
          <span class="text-xl">PNPM 全局包管理</span>
        </div>
      </template>
      
      <!-- 操作区域 -->
      <div class="flex mb-4 gap-2">
        <span class="p-input-icon-right flex-1">
          <i class="pi pi-search" />
          <InputText 
            v-model="searchKeyword" 
            placeholder="搜索包名"
            class="w-full"
            @keyup.enter="handleSearch"
          />
        </span>
        <Button 
          label="安装新包" 
          icon="pi pi-plus" 
          @click="showInstallModal"
        />
        <Button 
          icon="pi pi-refresh" 
          @click="fetchPackages"
          :loading="loading"
        />
      </div>

      <!-- 包列表 -->
      <DataTable 
        :value="packages" 
        :loading="loading"
        stripedRows
        :paginator="true" 
        :rows="10"
        dataKey="name"
        responsiveLayout="scroll"
      >
        <Column field="name" header="包名" :sortable="true"></Column>
        <Column field="version" header="版本" :sortable="true"></Column>
        <Column header="操作" style="min-width:8rem">
          <template #body="slotProps">
            <div class="flex gap-2">
              <Button 
                icon="pi pi-info-circle"
                text 
                rounded
                @click="showPackageInfo(slotProps.data)"
                tooltip="查看详情"
              />
              <Button 
                icon="pi pi-trash" 
                text 
                rounded
                severity="danger"
                @click="confirmRemove(slotProps.data)"
                tooltip="删除包"
              />
            </div>
          </template>
        </Column>
      </DataTable>
    </Card>

    <!-- 安装包对话框 -->
    <Dialog 
      v-model:visible="installModalVisible"
      header="安装 PNPM 全局包"
      modal
      :style="{ width: '450px' }"
    >
      <div class="flex flex-column gap-2">
        <div class="field">
          <label for="packageName" class="font-bold">包名</label>
          <InputText 
            id="packageName"
            v-model="installForm.packageName" 
            class="w-full"
            autofocus
          />
        </div>
        <div class="field">
          <label for="version" class="font-bold">版本（可选）</label>
          <InputText 
            id="version"
            v-model="installForm.version" 
            class="w-full"
            placeholder="例如：1.0.0"
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
          :loading="installing"
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
      <div v-if="currentPackageInfo" class="flex flex-column gap-3">
        <div class="field">
          <label class="font-bold block mb-1">名称：</label>
          <span>{{ currentPackageInfo.name }}</span>
        </div>
        <div class="field">
          <label class="font-bold block mb-1">版本：</label>
          <span>{{ currentPackageInfo.version }}</span>
        </div>
        <div class="field">
          <label class="font-bold block mb-1">描述：</label>
          <span>{{ currentPackageInfo.description }}</span>
        </div>
        <div class="field">
          <label class="font-bold block mb-1">许可证：</label>
          <span>{{ currentPackageInfo.license }}</span>
        </div>
        <div class="field">
          <label class="font-bold block mb-1">主页：</label>
          <a :href="currentPackageInfo.homepage" target="_blank">
            {{ currentPackageInfo.homepage }}
          </a>
        </div>
      </div>
    </Dialog>
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
const installing = ref(false);
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
    const res = await packageApi.getGlobalDependencies('pnpm');
    packages.value = Array.isArray(res.dependencies) 
      ? res.dependencies 
      : Object.entries(res.dependencies).map(([name, version]) => ({ name, version }));
      console.log(packages.value,res.dependencies)
  } catch (error) {
    toast.add({ 
      severity: 'error', 
      summary: '错误', 
      detail: '获取包列表失败',
      life: 3000
    });
  } finally {
    loading.value = false;
  }
};

// 搜索包
const handleSearch = async () => {
  if (!searchKeyword.value) return;
  loading.value = true;
  try {
    const res = await packageApi.searchPackage(searchKeyword.value, 'pnpm');
    toast.add({ 
      severity: 'success', 
      summary: '成功', 
      detail: '搜索完成',
      life: 3000 
    });
  } catch (error) {
    toast.add({ 
      severity: 'error', 
      summary: '错误', 
      detail: '搜索失败',
      life: 3000 
    });
  } finally {
    loading.value = false;
  }
};

// 确认删除
const confirmRemove = (data: any) => {
  confirm.require({
    message: `确定要删除 ${data.name} 吗？`,
    header: '删除确认',
    icon: 'pi pi-exclamation-triangle',
    acceptClass: 'p-button-danger',
    accept: () => handleRemove(data.name),
    reject: () => {
      toast.add({ 
        severity: 'info', 
        summary: '取消', 
        detail: '已取消删除',
        life: 3000 
      });
    }
  });
};

// 删除包
const handleRemove = async (packageName: string) => {
  try {
    await packageApi.removeGlobalPackage(packageName, 'pnpm');
    toast.add({ 
      severity: 'success', 
      summary: '成功', 
      detail: '删除成功',
      life: 3000 
    });
    fetchPackages();
  } catch (error) {
    toast.add({ 
      severity: 'error', 
      summary: '错误', 
      detail: '删除失败',
      life: 3000 
    });
  }
};

// 安装包
const handleInstall = async () => {
  if (!installForm.value.packageName) {
    toast.add({ 
      severity: 'warn', 
      summary: '警告', 
      detail: '请输入包名',
      life: 3000 
    });
    return;
  }

  installing.value = true;
  try {
    await packageApi.installGlobalPackage({
      packageName: installForm.value.packageName,
      version: installForm.value.version,
      type: 'pnpm'
    });
    toast.add({ 
      severity: 'success', 
      summary: '成功', 
      detail: '安装成功',
      life: 3000 
    });
    installModalVisible.value = false;
    installForm.value = { packageName: '', version: '' };
    fetchPackages();
  } catch (error) {
    toast.add({ 
      severity: 'error', 
      summary: '错误', 
      detail: '安装失败',
      life: 3000 
    });
  } finally {
    installing.value = false;
  }
};

// 显示包详情
const showPackageInfo = async (record: any) => {
  try {
    const info = await packageApi.getPackageInfo(record.name, 'pnpm');
    currentPackageInfo.value = info;
    infoModalVisible.value = true;
  } catch (error) {
    toast.add({ 
      severity: 'error', 
      summary: '错误', 
      detail: '获取包信息失败',
      life: 3000 
    });
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
.pnpm-list {
  padding: 1.5rem;
}
</style>