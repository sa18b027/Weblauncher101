<template>
  <div id="insertedKeyboard">
    <tastatur></tastatur>
  </div>
</template>

<script>
//import WebGazer from "./components/WebGazer.vue";
//import WebGazer from "./webgazer";
import Tastatur from "./components/Tastatur.vue";
import { mapMutations } from "vuex";

export default {
  name: "App",
  components: {Tastatur },
  data: () => ({
    windowHeight: 0,
    windowWidth: 0,
    currentX: 0,
    currentY: 0,
    x: 0,
    y: 0,
  }),
  computed: {

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
  },
  mounted() {
    /*this.mode = 1;
    let thiz = this;
    chrome.extension.sendMessage({subject:"mode"}, function(response) {
      console.log("a " + response.mode)
      if(response.mode == 4){
        console.log("b  gazer on" + response.mode)
        thiz.gazeroff = false;
      }
    });*/

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
