<template>
  <div id="app">
    <WebGazer @onNewData="onNewData" :off="gazeroff" style="position: absolute;right: 0px;"/>
    <Home />
  </div>
</template>
<script>

import WebGazer from "./components/WebGazer.vue";
//import WebGazer from "./webgazer";
import Home from "./components/Home.vue";
import { mapMutations } from "vuex";

export default {
  name: "App",
  components: {Home, WebGazer },
  data: () => ({
    windowHeight: 0,
    windowWidth: 0,
    currentX: 0,
    currentY: 0,
    x: 0,
    y: 0,
  }),
  computed: {
    gazeroff: function() {
       //return true;
       if (localStorage.getItem("mode")) {
        if (parseInt(localStorage.getItem("mode")) == 4) return false;
      } 
      return true 
    } 
  },
  created: function() {
    this.windowHeight = window.innerHeight;
    this.windowWidth = window.innerWidth;
    window.addEventListener("mousemove", this.onUpdate);
  },
  destroyed: function() {
    window.removeEventListener("mousemove", this.onUpdate);
  },
  methods: {
    ...mapMutations(["setCurrentCoor"]),
    onUpdate(event) {
      this.currentX = event.clientX;
      this.currentY = event.clientY;
      this.setCurrentCoor({
        x: this.currentX,
        y: this.currentY,
      });
      //console.log(this.currentX, this.currentY);
    },
    onNewData(coord) {
      this.x = coord.x;
      this.y = coord.y;
      this.setCurrentCoor({
        x: coord.x,
        y: coord.y,
      });
    },
  },
};
</script>

<style>
#webgazerVideoFeed, #webgazerFaceOverlay {
  right: 0 !important;
  left:auto !important;
}
#webgazerFaceFeedbackBox{
  display:none !important;
}

</style>
