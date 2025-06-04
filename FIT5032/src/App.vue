<script setup>
import BHeader from './components/BHeader.vue'
</script>

<template>
  <div class="main-container">
    <header>
      <div class="logo">Medical Home</div>
      <BHeader />
    </header>

    <main class="main-box">
      <router-view></router-view>
    </main> 
  </div>
</template>

<style scoped>
body {
  font-size: 24px;  
  line-height: 1.6; 
  font-family: Arial, sans-serif;
}

.main-container {
  max-width: 1600px; 
  margin: 40px auto;
  padding: 20px;
  border-radius: 8px;
}

.logo {
  font-size: 55px; 
  font-weight: bold; 
  color: #007bff;
  margin-left: 10px; 
}

h1 {
  font-size: 40px; 
}

h2 {
  font-size: 36px; 
}

h3 {
  font-size: 32px; 
}

p {
  font-size: 24px; 
  color: #333;
}
</style>
