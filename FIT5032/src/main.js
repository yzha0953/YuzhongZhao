import './assets/main.css'
// import './style.css'
import { createApp } from 'vue'
import App from './App.vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'
import router from './router'
import store from './store'
import { initializeApp } from "firebase/app"
import 'datatables.net-dt/css/dataTables.dataTables.min.css'
import 'datatables.net'
import jQuery from 'jquery'
import 'mapbox-gl/dist/mapbox-gl.css';

window.$ = window.jQuery = jQuery;

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBzukkKnwE3JNr4RdU-f56ukSM71hmeFBM",
  authDomain: "week7-yuzhongzhao.firebaseapp.com",
  projectId: "week7-yuzhongzhao",
  storageBucket: "week7-yuzhongzhao.appspot.com",
  messagingSenderId: "546619547760",
  appId: "1:546619547760:web:da3559440a2174ea8694b5"
};

// Initialize Firebase
initializeApp(firebaseConfig);

// Create Vue app
const app = createApp(App);

app.use(router);
app.use(store);

app.mount('#app');

