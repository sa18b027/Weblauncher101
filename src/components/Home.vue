<template>
  <div class="home">
    <Favorites>
      <AddFavorites />
    </Favorites>
    <AddFavoritesModal />
  </div>
</template>

<script>
import Favorites from "./Favorites.vue";
import AddFavorites from "./AddFavorites.vue";
import AddFavoritesModal from "./AddFavoritesModal.vue";

export default {
  name: "Home",
  components: {
    Favorites,
    AddFavorites,
    AddFavoritesModal,
  },
};
</script>
