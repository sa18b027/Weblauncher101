<template>
  <div></div>
</template>

<script>
import webgazer from "../webgazer";
//import webgazer from "webgazer";
export default {
  name: "WebGazer",
  props: {
    off: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    //handelt highlighted für Pfeiltasten
    off(value) {
      if (value) {
        webgazer.end();;
      }else{
        this.create();
      }
    },
  },
  data: function() {
    return {
      x: 0,
      y: 0,
    };
  },
  methods: {
    async create() {
      const thiz = this;
      window.applyCalmanFilter = true;
      window.saveDataAccrossSessions = true;
      webgazer.params.showVideoPreview = true;
      await webgazer
        .setRegression("ridge")
        .setGazeListener(function (data) {
          if (data) {
            thiz.x = data.x;
            thiz.y = data.y;
            thiz.$emit("onNewData", {x: data.x, y: data.y});
          }
        })
        .begin();
      webgazer.showPredictionPoints(true);

    },
  },
  async created() {
    if (window && !this.off) {
      this.create();
      /*const thiz = this;
      window.applyCalmanFilter = true;
      window.saveDataAccrossSessions = true;
      webgazer.params.showVideoPreview = true;
      await webgazer
        .setRegression("ridge")
        .setGazeListener(function(data) {
          //console.log(elapsedTime); //elapsedTime

          if (data) {
            thiz.x = data.x;
            thiz.y = data.y;
            //console.log({ x: data.x, y: data.y });
            thiz.$emit("onNewData", { x: data.x, y: data.y });
          }
        })
        .begin();
      //   var prediction = webgazer.getCurrentPrediction();
      //   if (prediction) {
      //     thiz.x = prediction.x;
      //     thiz.y = prediction.y;
      //     thiz.$emit("update", { x: prediction.x, y: prediction.y });
      //   }
      webgazer.showPredictionPoints(true);*/
    }
  },
  beforeDestroy() {
    webgazer.end();
  },
  //   var prediction = webgazer.getCurrentPrediction();
  //   if (prediction) {
  //       var x = prediction.x;
  //       var y = prediction.y;
  //   };
};
</script>

<style lang="scss" scoped></style>
