<template>
  <form
    class="add-favorite-modal"
    v-show="showAddFavoritesModal"
    @submit.prevent="onSubmit"
  >
    <div class="input">
      <label for="add-favorites-name">Name</label>
      <input type="text" v-model="name" id="add-favorites-name" />
    </div>
    <div class="input">
      <label for="add-favorites-url">Link</label>
      <input type="text" v-model="url" id="add-favorites-url" />
    </div>
    <button @click="onClickOk">Ok</button>
    <button @click="onClickCancel">Cancel</button>
  </form>
</template>

<script>
import { mapState, mapMutations } from "vuex";

export default {
  name: "AddFavoritesModal",
  data() {
    return {
      name: "",
      url: "",
    };
  },
  computed: {
    ...mapState(["showAddFavoritesModal"]),
  },

  methods: {
    ...mapMutations(["addFavorite", "hideModal"]),
    onClickOk() {
      console.log(this.name, this.url);
      this.$store.commit("addFavorite", {
        name: this.name,
        url: this.url,
        highlighted: false,
      });
      /*this.addFavorite({
                name: this.name,
                url: this.url
            })*/
      this.onClickCancel();
    },
    onClickCancel() {
      this.name = "";
      this.url = "";
      this.hideModal();
    },
    onSubmit() {},
  },
};
</script>

<style lang="scss" scoped>
.add-favorite-modal {
  width: calc(100% - 4rem);
  height: calc(100% - 4rem);
  background: black;

  position: absolute;
  left: 0;
  top: 0;
  padding: 2rem;
}
label {
  padding: 0.5rem 1rem;
  width: 40%;
}
input {
  padding: 0.5rem 1rem;
  width: 60%;
}
.input {
  width: 100%;
}
</style>
