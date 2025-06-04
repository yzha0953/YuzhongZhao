import { createStore } from 'vuex';

export default createStore({
  state: {
    isAuthenticated: false,
    user: null
  },
  mutations: {
    setAuthenticated(state, isAuthenticated) {
      state.isAuthenticated = isAuthenticated;
    },
    setUser(state, user) {
      state.user = user;
    }
  },
  actions: {
    async login({ commit }, userCredentials) {
      try {
        const response = await fetch('/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userCredentials),
        });
        

        if (response.ok) {
          commit('setAuthenticated', true);
          commit('setUser', { username: userCredentials.emailAddress });
          return true;
        } else {
          return false;
        }
      } catch (error) {
        console.error("Login error: ", error);
        return false;
      }
    },
    logout({ commit }) {
      commit('setAuthenticated', false);
      commit('setUser', null);
    }
  },
  getters: {
    isAuthenticated: state => state.isAuthenticated,
    getUser: state => state.user
  }
});
