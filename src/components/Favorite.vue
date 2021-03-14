<template>
  <li class="favorite-element" ref="elem">
    <div v-bind:class="[highlighted ? 'highlighted' : '']">
      <span :href="fav.url">{{ fav.name }}<br />{{ fav.id }}</span>
      <div>{{ highlighted }}</div>
      <button @click="onClickRemove(fav.id)">Löschen</button>
    </div>
  </li>
</template>

<script>
export default {
  name: "Favorite",
  props: {
    fav: {
      type: Object,
      required: true,
    },
    highlighted: Boolean,
  },
  data() {
    return {
      xMin: 0, //getBoundingClientRect.x/getBoundingClient.left
      xMax: 0, //.right
      yMin: 0, //.y/.top
      yMax: 0, //.bottom
    };
  },
  methods: {
    updateBoundingBox() {
      //const rect = this.$refs.elem.getBoundingClientRect();
      /* console.log(rect);
      console.log("favorite");
      console.log(this.fav);*/
    },
    onClickRemove(favoriteId) {
      this.$store.commit("removeFav", favoriteId);
    },
  },
  mounted() {
    this.updateBoundingBox();
  },
  // highlightFavs(){
  //   //const middle = elem.getBoundingClientRect().left + (2 * elem.getBoundingClientRect().width)
  //   if(this.currentX < innerWidth/2){

  //   }
  // },
};
</script>

<style lang="stylus" scoped></style>
