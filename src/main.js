import { createApp } from 'troisjs'
import { provide } from "vue"
import App from './App.vue'

import { store } from './store/storeMain'

import mitt from 'mitt'

const app = createApp(App)

const emitter = mitt()

app.provide("STORE", store)
app.provide("BUS", emitter)


app.mount('#app')
