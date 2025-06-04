<template>
    <div class="user-dashboard">
      <div v-if="user">
        <h1>Welcome, {{ user.firstName }} {{ user.lastName }}</h1>
        <p>This is your dashboard. You can see your activities and settings here.</p>
        <button @click="logout" aria-label="Log out of your account">Log Out</button>
      </div>
      <div v-else>
        <p>Loading user data...</p>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { getAuth } from 'firebase/auth';
  import { doc, getDoc } from 'firebase/firestore';
  import { db } from '../firebase/init'; 
  
  const router = useRouter();
  const user = ref(null);
  const auth = getAuth();
  
  const fetchUserData = async (uid) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        user.value = userDoc.data(); 
      } else {
        console.log('No such user!');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };
  
  onMounted(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      fetchUserData(currentUser.uid); 
    } else {
      router.push('/login'); 
    }
  });
  
  function logout() {
    auth.signOut().then(() => {
      router.push('/login');
    });
  }
  </script>
  
  <style scoped>
  .user-dashboard {
    padding: 20px;
    background-color: #f4f4f4;
    border-radius: 8px;
    text-align: center;
  }
  </style>
  