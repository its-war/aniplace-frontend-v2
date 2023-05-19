import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import limitarTexto from "@/utils/limitarTexto";

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'

const vuetify = createVuetify({
    components,
    directives,
    icons: {
        defaultSet: 'mdi'
    },
    theme: {
        defaultTheme: 'dark'
    }
})

const app = createApp(App)

app.config.globalProperties.$limitarTexto = limitarTexto

app.use(vuetify)
app.use(createPinia())
app.use(router)

app.mount('#app')
