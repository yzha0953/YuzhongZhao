<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col-md-8 offset-md-2">
        <h1 class="text-center">Log in to Medical Home</h1>
        <form @submit.prevent="submitForm" class="form-horizontal">
          <div class="form-group row">
            <label for="email-address" class="col-sm-4 col-form-label">Email Address</label>
            <div class="col-sm-8">
              <input
                type="email"
                class="form-control custom-input"
                id="email-address"
                @blur="validateEmailAddress(true)"
                @input="validateEmailAddress(false)"
                v-model="email"
                required
              />
              <div v-if="errors.email" class="text-danger">{{ errors.email }}</div>
            </div>
          </div>
          <div class="form-group row">
            <label for="password" class="col-sm-4 col-form-label">Password</label>
            <div class="col-sm-8">
              <input
                type="password"
                class="form-control custom-input"
                id="password"
                @blur="validatePassword(true)"
                @input="validatePassword(false)"
                v-model="password"
                required
              />
              <div v-if="errors.password" class="text-danger">{{ errors.password }}</div>
            </div>
          </div>
          <div class="form-actions">
            <button type="submit" class="btn btn-primary me-2" aria-label="Sign in your account">Sign in via Firebase</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'vue-router';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '../firebase/init'; 

const email = ref('');
const password = ref('');
const errors = ref({
  email: null,
  password: null,
});
const router = useRouter();
const auth = getAuth();

const submitForm = () => {
  validateEmailAddress(true);
  validatePassword(true);
  if (errors.value.email || errors.value.password) {
    return;
  }

  signInWithEmailAndPassword(auth, email.value, password.value)
  .then(async (data) => {
    console.log('Firebase Sign in Successful!');
    const user = data.user;
    console.log('Logged in user:', user);

    const userDocRef = doc(db, "users", user.uid);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      const userData = userDocSnap.data();
      console.log('User data from Firestore:', userData);

      if (userData.role === 'admin') {
        alert('Welcome, Admin!');
        router.push('/admin-dashboard');
      } else if (userData.role === 'user') {
        alert('Sign in successful!');
        router.push('/user-dashboard');
      } else {
        console.error('Unrecognized user role');
        alert('Sign in failed due to invalid role.');
      }
    } else {
      console.log('No such document!');
    }
  })
  .catch((error) => {
    console.log(error.code);
    alert('Sign in failed.');
  });
};

const validateEmailAddress = (blur) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email.value.match(emailRegex)) {
    if (blur) errors.value.email = 'Please enter a valid email address';
  } else {
    errors.value.email = null;
  }
};

const validatePassword = (blur) => {
  const minLength = 8;
  if (password.value.length < minLength) {
    if (blur) errors.value.password = `Password must be at least ${minLength} characters long.`;
  } else {
    errors.value.password = null;
  }
};
</script>

<style scoped>
.form-horizontal .form-group {
  margin-bottom: 10px;
}

.col-form-label {
  text-align: right;
  margin-top: 20px;
}

.form-control {
  width: 100%;
  margin-top: 25px;
}

.custom-input {
  max-width: 250px;
}

.text-danger {
  margin-top: 15px;
}

.form-actions {
  text-align: center;
  margin-top: 40px;
}

.button, .btn {
  padding: 10px 20px;
  margin: 0.5rem 0;
  cursor: pointer;
  font-size: 16px; 
  width: 100%; 
}

@media (min-width: 768px) {
  .button, .btn {
    width: auto; 
  }
}
</style>
