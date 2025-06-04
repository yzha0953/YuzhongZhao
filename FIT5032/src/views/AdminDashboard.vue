<template>
  <div class="admin-dashboard">
    <h1>Admin Dashboard</h1>
    <p>Send emails to users</p>

    <form @submit.prevent="sendBulkEmails">
      <div class="form-group">
        <label for="emails">Emails</label>
        <input
          type="text"
          v-model="form.emails"
          id="emails"
          class="form-control"
          placeholder="Enter emails separated by commas"
          required
        />
      </div>

      <div class="form-group">
        <label for="subject">Subject</label>
        <input
          type="text"
          v-model="form.subject"
          id="subject"
          class="form-control"
          placeholder="Enter email subject"
          required
        />
      </div>

      <div class="form-group">
        <label for="message">Message</label>
        <textarea
          v-model="form.message"
          id="message"
          class="form-control"
          placeholder="Enter email message"
          required
        ></textarea>
      </div>

      <div class="form-group">
        <label for="attachment">Attachment (Optional)</label>
        <input type="file" ref="fileInput" @change="handleFileUpload" style="display: none;" />
        <button type="button" @click="triggerFileInput" class="btn btn-primary" aria-label="Choose a file to upload">
          Choose File
        </button>
        <span v-if="form.attachment">{{ form.attachment.filename }}</span>
      </div>

      <button type="submit" class="btn btn-primary" aria-label="Send emails">Send Emails</button>
    </form>

    <div v-if="responseMessage" class="alert" :class="{'alert-success': success, 'alert-danger': !success}">
      {{ responseMessage }}
    </div>

    <div class="logout-section">
      <button @click="logout" class="btn btn-secondary mt-3" aria-label="Log out of your account">Log Out</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';  
import { getAuth, signOut } from 'firebase/auth';  
import axios from 'axios';

const form = ref({
  emails: '',
  subject: '',
  message: '',
  attachment: null
});

const responseMessage = ref('');
const success = ref(false);
const router = useRouter();  
const auth = getAuth();  

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  const reader = new FileReader();
  
  reader.onload = () => {
    form.value.attachment = {
      content: reader.result.split(',')[1], 
      filename: file.name,
      type: file.type,
      disposition: 'attachment'
    };
  };
  
  reader.readAsDataURL(file);
};

const triggerFileInput = () => {
  document.querySelector('input[type="file"]').click();
};

const sendBulkEmails = async () => {
  try {
    const emailList = form.value.emails.split(',').map(email => email.trim());
    const payload = {
      emails: emailList,
      subject: form.value.subject,
      message: form.value.message,
      attachment: form.value.attachment
    };

    const response = await axios.post('https://us-central1-week7-yuzhongzhao.cloudfunctions.net/sendBulkEmail', payload);

    if (response.data.success) {
      success.value = true;
      responseMessage.value = 'Emails sent successfully!';
    } else {
      success.value = false;
      responseMessage.value = 'Failed to send emails.';
    }
  } catch (error) {
    success.value = false;
    responseMessage.value = 'Error occurred while sending emails.';
    console.error('Error:', error);
  }
};

const logout = async () => {
  try {
    await signOut(auth);  
    alert('Logged out successfully!');
    router.push('/login'); 
  } catch (error) {
    console.error('Error logging out:', error);
    alert('Failed to log out.');
  }
};
</script>

<style scoped>
.admin-dashboard {
  padding: 20px;
}

.form-group {
  margin-bottom: 15px;
}

.alert {
  margin-top: 15px;
}

.alert-success {
  color: green;
}

.alert-danger {
  color: red;
}

.logout-section {
  margin-top: 20px;
}
</style>
