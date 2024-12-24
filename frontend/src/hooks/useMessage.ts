import { reactive } from "vue";

interface MessageInstance {
  show: boolean;
  severity: string;
  content: string;
  life: number;
}

let messageInstance = reactive<MessageInstance>({
  show: false,
  severity: "info",
  content: "",
  life: 3000,
});

export function useMessage() {
  const showMessage = (severity: string, content: string, life: number = 3000): void => {
    messageInstance.show = true;
    messageInstance.severity = severity;
    messageInstance.content = content;
    messageInstance.life = life;
  };

  const hideMessage = (): void => {
    messageInstance.show = false;
  };

  function initMessage() {
    // 初始化全局 message 对象
    if (!window.$message) {
      window.$message = {};
    }

    window.$message.success = (content: string, life: number) => showMessage("success", content, life);
    window.$message.warning = (content: string, life: number) => showMessage("warning", content, life);
    window.$message.error = (content: string, life: number) => showMessage("error", content, life);
    window.$message.info = (content: string, life: number) => showMessage("info", content, life);
    window.$message.hide = hideMessage;
    console.log("message init success");
  }

  return {
    messageInstance,
    initMessage,
    showMessage,
    hideMessage,
  };
}