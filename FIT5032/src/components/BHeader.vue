<template>
  <!-- Using Bootstrap's Header template (starter code) -->
  <!-- https://getbootstrap.com/docs/5.0/examples/headers/ -->
  <div class="container">
    <header class="d-flex justify-content-center py-3">
      <ul class="nav nav-pills">
        <li class="nav-item">
          <router-link to="/" class="nav-link" active-class="active" aria-current="page"  
           tabindex="1">Home </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/table" class="nav-link" active-class="active" aria-current="page"
           tabindex="2" >Community Engagement </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/rating" class="nav-link" active-class="active" tabindex="3">Rating</router-link>
        </li>
        <li class="nav-item">
          <router-link to="/map" class="nav-link" active-class="active" tabindex="4" >Map</router-link>
        </li>
        <li class="nav-item">
          <router-link to="/login" class="nav-link" active-class="active" tabindex="5" >Login</router-link>
        </li>
        <li class="nav-item">
          <router-link to="/register" class="nav-link" active-class="active" tabindex="6" >Register</router-link>
        </li>
        <li class="nav-item">
          <router-link to="/user-dashboard" class="nav-link" active-class="active" tabindex="7" >User Dashboard</router-link>
        </li>
        <li class="nav-item">
          <router-link to="/admin-dashboard" class="nav-link" active-class="active" tabindex="8" >Admin Dashboard</router-link>
        </li>
      </ul>
    </header>
  </div>
</template>

<style scoped>
header {
  padding: 2rem 0; 
}

.nav-pills {
  display: flex;
  flex-wrap: nowrap; 
  justify-content: center;
  overflow-x: auto; 
}

.nav-pills .nav-link {
  font-size: 2rem; 
  padding: 1rem 1.25rem; 
}

.nav-pills .nav-link.active {
  background-color: #007bff; 
  color: #fff;
}

.b-example-divider {
  height: 3rem;
  background-color: rgba(0, 0, 0, 0.1);
  border: solid rgba(0, 0, 0, 0.15);
  border-width: 1px 0;
  box-shadow:
    inset 0 0.5em 1.5em rgba(0, 0, 0, 0.1),
    inset 0 0.125em 0.5em rgba(0, 0, 0, 0.15);
}

.form-control-dark {
  color: #fff;
  background-color: var(--bs-dark);
  border-color: var(--bs-gray);
}

.form-control-dark:focus {
  color: #fff;
  background-color: var(--bs-dark);
  border-color: #fff;
  box-shadow: 0 0 0 0.25rem rgba(255, 255, 255, 0.25);
}

.bi {
  vertical-align: -0.125em;
  fill: currentColor;
}

.text-small {
  font-size: 85%;
}

.dropdown-toggle {
  outline: 0;
}
</style>
