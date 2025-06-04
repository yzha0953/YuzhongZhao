<template> 
  <div class="container mt-5">
    <div class="row">
      <div class="col-md-8 offset-md-2">
        <h1 class="text-center">Register</h1>
        <form @submit.prevent="submitForm">
          <div class="row mb-3">
            <div class="col-sm-6 col-12">
              <label for="first-name" class="form-label">First Name</label>
              <input
                type="text"
                class="form-control"
                id="first-name"
                v-model="formData.firstName"
                required
                @blur="() => validateName('firstName', true)"
                @input="() => validateName('firstName', false)"
              />
              <div v-if="errors.firstName" class="text-danger">{{ errors.firstName }}</div>
            </div>
            <div class="col-sm-6 col-12">
              <label for="last-name" class="form-label">Last Name</label>
              <input
                type="text"
                class="form-control"
                id="last-name"
                v-model="formData.lastName"
                required
                @blur="() => validateName('lastName', true)"
                @input="() => validateName('lastName', false)"
              />
              <div v-if="errors.lastName" class="text-danger">{{ errors.lastName }}</div>
            </div>
          </div>
          <div class="mb-3">
            <div class="col-sm-6 col-12">
              <label for="email-address" class="form-label">Email Address</label>
              <input
                type="email"
                class="form-control"
                id="email-address"
                v-model="formData.emailAddress"
                required
                @blur="() => validateEmail(true)"
                @input="() => validateEmail(false)"
              />
              <div v-if="errors.emailAddress" class="text-danger">{{ errors.emailAddress }}</div>
            </div>
          </div>
          <div class="mb-3">
            <div class="col-sm-6 col-12">
              <label for="password" class="form-label">Password</label>
              <input
                type="password"
                class="form-control"
                id="password"
                v-model="formData.password"
                required
                @blur="() => validatePassword(true)"
                @input="() => validatePassword(false)"
              />
              <div v-if="errors.password" class="text-danger">{{ errors.password }}</div>
            </div>
          </div>
          <div class="text-center">
            <button type="submit" class="btn btn-primary" aria-label="Create an account via Firebase">CREATE AN ACCOUNT VIA FIREBASE</button>
          </div>
        </form>
        <div class="terms mt-4 text-center">
          By proceeding, you agree to Medical Home <a href="/terms" class="underline-link">Terms and Conditions</a> and <a href="/privacy" class="underline-link">Privacy Policy</a>.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'vue-router';
import { saveUserDataToFirestore } from '../firebase/init'; 

const formData = ref({
  firstName: '',
  lastName: '',
  emailAddress: '', 
  password: ''
});

const errors = ref({
  firstName: null,
  lastName: null,
  emailAddress: null,
  password: null
});

const router = useRouter();
const auth = getAuth();

const validateEmail = (blur) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!formData.value.emailAddress.match(emailRegex)) { 
    if (blur) errors.value.emailAddress = 'Please enter a valid email address';
  } else {
    errors.value.emailAddress = null; 
  }
};

const validateName = (field, blur) => {
  if (formData.value[field].length < 2) {
    if (blur) errors.value[field] = 'Must be at least 2 characters';
  } else {
    errors.value[field] = null;
  }
};

const validatePassword = (blur) => {
  const password = formData.value.password;
  const minLength = 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  if (password.length < minLength) {
    if (blur) errors.value.password = 'Password must be at least 8 characters long.';
  } else if (!hasUppercase) {
    if (blur) errors.value.password = 'Password must contain at least one uppercase letter.';
  } else if (!hasLowercase) {
    if (blur) errors.value.password = 'Password must contain at least one lowercase letter.';
  } else if (!hasNumber) {
    if (blur) errors.value.password = 'Password must contain at least one number.';
  } else if (!hasSpecialChar) {
    if (blur) errors.value.password = 'Password must contain at least one special character.';
  } else {
    errors.value.password = null;
  }
};

const submitForm = async () => {
  validateEmail(true);
  validateName('firstName', true);
  validateName('lastName', true);
  validatePassword(true);

  if (!errors.value.firstName && !errors.value.lastName && !errors.value.emailAddress && !errors.value.password) {
    try {
    const userCredential = await createUserWithEmailAndPassword(auth, formData.value.emailAddress, formData.value.password);
    const user = userCredential.user;

    await saveUserDataToFirestore(user);

    alert('Registration successful!');
    router.push("/login");

  } catch (error) {
    if (error.code === 'auth/email-already-in-use') {
      alert('The email address is already in use. Please use a different email or log in.');
    } else {
      console.error("Error registering user:", error);
      alert("Register failed.");
    }
  }
}
};
</script>

<style scoped>
.row {
  display: flex;
  flex-wrap: wrap;
  margin-right: -15px;
  margin-left: -15px;
}

.col-sm-6 {
  width: 100%; 
  padding-right: 15px;
  padding-left: 15px;
}

@media (min-width: 576px) {
  .col-sm-6 {
    flex: 0 0 50%; 
    max-width: 50%;
  }
}

.form-control {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.form-group {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
}

.text-center {
  text-align: center;
}

.underline-link {
  text-decoration: underline;
  color: #007bff;
  cursor: pointer;
}

.terms {
  font-size: 0.875rem; 
  text-align: center;
  margin-top: 1.5rem;
  color: #666;
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
