import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    current: { x: 0, y: 0 },
    lastMouseForRelative: { x: 0, y: 0 },
    arrowDirection: "",
    favorites: [
      // {
      //   name: "YouTube",
      //   id: 1,
      //   url: "https://www.youtube.com",
      // }
    ],
    highlighted: [],
    selected: [],
    middle: {
      middle: null,
    },
    showAddFavoritesModal: false,
  },
  mutations: {
    setCurrentCoor(state, payload) {
      state.current.x = payload.x;
      state.current.y = payload.y;
    },
    setHighlighted(state, value) {
      state.highlighted = value;
    },
    setLastMouseForRelative(state, value) {
      state.lastMouseForRelative = value;
    },
    setSelected(state, value) {
      state.selected = value;
    },
    setArrowDirection(state, value) {
      state.arrowDirection = value;
    },
    showModal(state) {
      state.showAddFavoritesModal = true;
    },
    hideModal(state) {
      state.showAddFavoritesModal = false;
    },
    addFavorite(state, data) {
      console.log(data);

      console.log("add favorite");
      console.log(state.favorites);
      state.selected = [];
      if (state.favorites.length < 8) {
        state.favorites.push({
          id: state.favorites.length + 1,
          name: data.name,
          url: data.url,
        });
        localStorage.setItem("favorit", JSON.stringify(state.favorites));
        console.log(localStorage.getItem("favorit"));

        console.log(state.favorites);
      } else {
        alert("Maximum erreicht, bitte einen Favoriten löschen.");
      }
    },

    removeFav: function(state, favoriteId) {
      state.selected = [];
      const index = state.favorites.findIndex((elem) => {
        return elem.id === favoriteId;
      });
      if (index !== -1) {
        state.favorites.splice(index, 1);
        localStorage.setItem("favorit", JSON.stringify(state.favorites));
      }
    },
    coordinates_area: function(state, middle) {
      state.middle = middle;
      localStorage.setItem("middle", JSON.stringify(middle));
    },
  },
  getters: {
    favorites(state) {
      if (localStorage.getItem("favorit")) {
        state.favorites = JSON.parse(localStorage.getItem("favorit"));
      } else {
        state.favorites = [];
      }
      console.log(state.favorites);
      return state.favorites;
    },
    getCurrentCoor(state) {
      return state.current;
    },
    getHighlighted(state) {
      return state.highlighted;
    },
    getLastMouseForRelative(state) {
      return state.lastMouseForRelative;
    },
    getSelected(state) {
      return state.selected;
    },
    getArrowDirection(state) {
      return state.arrowDirection;
    },
  },
  actions: {},
  modules: {},
});
