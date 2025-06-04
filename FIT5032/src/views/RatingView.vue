<template>
  <div v-if="services.length > 0" class="services-container">
    <h1>Services for Indigenous Communities</h1>
    <ul>
      <li v-for="service in services" :key="service.id">
        <h2>{{ service.name }}</h2>
        <p>{{ service.description }}</p>
        <div>
          Current average rating: {{ calculateAverageRating(service.id).toFixed(1) }} ({{ filterRatings(service.id).length }} reviews)
        </div>
        <div class="rating-area">
          <span v-for="star in 5" :key="star" 
                class="star" 
                :class="{'filled': star <= (userRatings[service.id] || 0)}" 
                @click="() => setRating(service.id, star)">
            &#9733;
          </span>
        </div>
        <input type="text" v-model="userReviews[service.id]" placeholder="Add a review" />
        <button @click="() => submitRating(service.id)" aria-label="Submit rating">Submit Rating</button>
        <div>
          <h3>Reviews</h3>
          <ul>
            <li v-for="rating in filterRatings(service.id)" :key="rating.date">
              {{ rating.date }} - {{ rating.user }} says: Rating: {{ rating.score }} - "{{ rating.review }}"
            </li>
          </ul>
        </div>
      </li>
    </ul>
    <div class="button-container">
      <button @click="exportPDF" class="btn btn-primary">Export Reviews as PDF</button>
    </div>
  </div>
  <div v-else>
    Loading services...
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue';
import jsPDF from "jspdf";
import "jspdf-autotable";

const services = ref([]);
const ratings = ref([]);

const userRatings = reactive({});
const userReviews = reactive({});

const fetchServices = async () => {
  try {
    const response = await fetch('/data/service.json');
    const data = await response.json();
    services.value = data.services;
    services.value.forEach(service => {
      userRatings[service.id] = 0;
      userReviews[service.id] = '';
    });
  } catch (error) {
    console.error('Error fetching services:', error);
  }
};

onMounted(fetchServices);

function calculateAverageRating(serviceId) {
  const filteredRatings = ratings.value.filter(r => r.serviceId === serviceId);
  const total = filteredRatings.reduce((acc, r) => acc + r.score, 0);
  return filteredRatings.length ? (total / filteredRatings.length) : 0;
}

function filterRatings(serviceId) {
  return ratings.value.filter(r => r.serviceId === serviceId);
}

function setRating(serviceId, newRating) {
  userRatings[serviceId] = newRating;
}

function submitRating(serviceId) {
  if (userRatings[serviceId] && userReviews[serviceId].trim()) {
    const newRating = {
      serviceId,
      user: 'Anonymous',
      date: new Date().toISOString().slice(0, 10),
      score: userRatings[serviceId],
      review: userReviews[serviceId]
    };
    ratings.value.push(newRating);
    userReviews[serviceId] = '';
    alert('Thank you for your rating and review!');
  } else {
    alert('Please select a rating and write a review before submitting!');
  }
}

function exportPDF() {
  const doc = new jsPDF();

  doc.text("Services for Indigenous Communities - Reviews", 10, 10);

  services.value.forEach(service => {
    const reviews = filterRatings(service.id);

    // add services into PDF
    doc.text(service.name, 10, doc.lastAutoTable ? doc.lastAutoTable.finalY + 10 : 20);
    doc.text(`Average Rating: ${calculateAverageRating(service.id).toFixed(1)}`, 10, doc.lastAutoTable ? doc.lastAutoTable.finalY + 15 : 25);

    // add review table
    if (reviews.length) {
      doc.autoTable({
        startY: doc.lastAutoTable ? doc.lastAutoTable.finalY + 20 : 30,
        head: [["Date", "User", "Rating", "Review"]],
        body: reviews.map(review => [
          review.date,
          review.user,
          `${review.score} ★`,
          review.review
        ])
      });
    } else {
      doc.text("No reviews available.", 10, doc.lastAutoTable ? doc.lastAutoTable.finalY + 30 : 40);
    }
  });

  doc.save("service_reviews.pdf");
}
</script>

<style scoped>
.star {
  cursor: pointer;
  font-size: 24px;
  color: grey;
}

.filled {
  color: orange;
}

.button-container {
  display: flex;
  justify-content: center; 
  margin-top: 20px; 
}

.btn {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.btn:hover {
  background-color: #0056b3;
}
</style>
