import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import RatingView from '../views/RatingView.vue';
import LoginView from '../views/LoginView.vue';
import RegisterView from '../views/RegisterView.vue';
import TablesView from '../views/TablesView.vue';
import UserDashboard from '../views/UserDashboard.vue';
import AdminDashboard from '../views/AdminDashboard.vue';
import { getAuth } from 'firebase/auth';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '../firebase/init'; 
import MapView from '../views/MapView.vue';

const auth = getAuth();

const routes = [
  { 
    path: '/',
    name: 'Home',
    component: HomeView 
  },
  { 
    path: '/table',
    name: 'Community Engagement',
    component: TablesView
  },
  { 
    path: '/rating',
    name: 'Rating',
    component: RatingView 
  },
  { 
    path: '/map',
    name: 'Map',
    component: MapView 
  },
  { 
    path: '/login',
    name: 'Login',
    component: LoginView 
  },
  { 
    path: '/register',
    name: 'Register',
    component: RegisterView
  },
  { 
    path: '/user-dashboard',
    name: 'User Dashboard',
    component: UserDashboard,
    meta: { requiresAuth: true, requiresUser: true}  
  },
  {
    path: '/admin-dashboard',
    name: 'Admin Dashboard',
    component: AdminDashboard,
    meta: { requiresAuth: true, requiresAdmin: true },  
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach(async (to, from, next) => {
  const currentUser = auth.currentUser;

  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!currentUser) {
      next('/login');
    } else {
      const userDocRef = doc(db, "users", currentUser.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();

        if (to.matched.some(record => record.meta.requiresAdmin)) {
          if (userData.role === 'admin') {
            next();
          } else {
            alert("You do not have permission to access this page.");
            next('/user-dashboard'); 
          }
        } else if (to.matched.some(record => record.meta.requiresUser)) {
          if (userData.role === 'user') {
            next();
          } else {
            alert("You do not have permission to access this page.");
            next('/admin-dashboard'); 
          }
        } else {
          next(); 
        }
      } else {
        console.log("No such document!");
        next('/login');
      }
    }
  } else {
    next();
  }
});

export default router;
