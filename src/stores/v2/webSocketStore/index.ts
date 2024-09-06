import { App } from "vue";
import { defineStore } from "pinia";
import { setupStore } from "../index";
import { SocketStore } from "./interface";
import { useDashboardStore } from "../dashboardStore";


export const index = (app: App<Element>) => {
  return defineStore({
    id: "socket",
    state: (): SocketStore => ({
      isConnected: false,
      message: "",
      reconnectError: false,
      heartBeatInterval: 50000,
      heartBeatTimer: 0
    }),
    actions: {
      SOCKET_ONOPEN(event: any) {
        console.log("successful websocket connection", event.currentTarget.url);
        app.config.globalProperties.$socket = event.currentTarget;
        this.isConnected = true;
        // this.heartBeatTimer = window.setInterval(() => {
        //   const message = "heart beating ..";
        //   this.isConnected &&
        //     app.config.globalProperties.$socket.sendObj({
        //       code: 200,
        //       msg: message
        //     });
        // }, this.heartBeatInterval);
      },
      SOCKET_ONCLOSE(event: any) {
        this.isConnected = false;
        window.clearInterval(this.heartBeatTimer);
        this.heartBeatTimer = 0;
        console.log("SOCKET_ONCLOSE: " + new Date());
        console.log(event);
      },
      SOCKET_ONERROR(event: any) {
        console.error('SOCKET_ONERROR', event);
      },
      SOCKET_ONMESSAGE(message: any) {
        if (message.data.startsWith('42')) {
          const dashboardStore = useDashboardStore();
          dashboardStore.processRealtimeData(message.data)
        } else {
          console.log('SOCKET_ONMESSAGE', message.data)
        }
        this.message = message;
      },
      SOCKET_RECONNECT(count: any) {
        console.info("SOCKET_RECONNECT...", count);
      },
      SOCKET_RECONNECT_ERROR() {
        this.reconnectError = true;
      }
    }
  })();
};

// Need to be used outside the setup
export function useSocketStoreWithOut(app: App<Element>) {
  setupStore(app);
  return index(app);
}
