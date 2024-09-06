import { createApp } from 'vue'
import i18n from './i18n'
import { createVuestic } from 'vuestic-ui'
import 'mosha-vue-toastify/dist/style.css'
import storesV1 from './stores/v1'
import storesV2 from './stores/v2'
import router from './router'
import vuesticGlobalConfig from './services/vuestic-ui/global-config'
import { VueQueryPlugin } from 'vue-query'
import VueAwesomePaginate from "vue-awesome-paginate";
import VueNativeSock from "vue-native-websocket-vue3";
import "vue-awesome-paginate/dist/style.css";
import App from './App.vue'
import { useSocketStoreWithOut } from "./stores/v2/webSocketStore";
const WEBSOCKET_URL = import.meta.env.VITE_WEBSOCKET_URL
const IS_WEBSOCKET_ENABLE = import.meta.env.VITE_IS_WEBSOCKET_ENABLE

const app = createApp(App)
app.use(storesV1)
app.use(storesV2)
app.use(router)
app.use(i18n)
app.use(createVuestic({ config: vuesticGlobalConfig }))
app.use(VueQueryPlugin)
app.use(VueAwesomePaginate)

app.mount('#app')

if (IS_WEBSOCKET_ENABLE.toLowerCase() === 'true') {
  const piniaSocketStore = useSocketStoreWithOut(app);
  app.use(
    VueNativeSock,
    WEBSOCKET_URL,
    {
      store: piniaSocketStore,
      format: "string",
      connectManually: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 3000
    }
  );
}
export default app;
