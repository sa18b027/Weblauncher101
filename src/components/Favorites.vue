<template>
  <div>
    <div>
      {{ getCurrentCoor }} <br />
      <br />
      Mode:<br />
      <select name="mode" id="mode" :value="mode" @change="changeMode">
        <option value="1">Absolut</option>
        <option value="2">Relativ</option>
        <option value="3">Tasten</option>
        <option value="4">WebGazer</option>
      </select>
    </div>
    <ul
      ref="parent"
      style="background-color: blue !important"
      @click="handleClick"
    >
      <Favorite
        v-for="(favorite, index) in favorites"
        :key="index"
        :highlighted="arrIsHighlighted[index]"
        :fav="favorite"
      />
      <li v-show="favorites.length < 8" class="favorite-element">
        <div v-bind:class="[isSlotHighlighted ? 'highlighted' : '']">
          <slot></slot>
        </div>
      </li>
    </ul>
    <HalfFavourite
      :fav-index="determineFirstHalf()"
      :x1="xMin"
      :y1="yMin"
      :x2="xMax"
      :y2="yMax"
      :sizex="4"
      :sizey="2"
      :position="determinePos(0)"
      :mode="mode"
      @highlighted="handleHighlighted"
      :arrow="arrow"
    />
    <HalfFavourite
      :fav-index="determineSecondHalf()"
      :x1="xMin"
      :y1="yMin"
      :x2="xMax"
      :y2="yMax"
      :sizex="4"
      :sizey="2"
      :position="determinePos(1)"
      :mode="mode"
      @highlighted="handleHighlighted"
      :arrow="arrow"
    />
  </div>
</template>

<script>
//       @keyup.native="handleKeyup($event)"
import { mapGetters } from "vuex";
import { mapMutations } from "vuex";
import Favorite from "./Favorite.vue";
import HalfFavourite from "./HalfFavourite.vue";
export default {
  name: "Favorites",
  components: { Favorite, HalfFavourite },
  computed: {
    ...mapGetters([
      "favorites",
      "getCurrentCoor",
      "getSelected",
      "getHighlighted",
      "getArrowDirection",
    ]),
  },
  data() {
    return {
      xMin: 0, //getBoundingClientRect.left
      xMax: 0, //.right
      yMin: 0, //.top
      yMax: 0, //.bottom
      //selectionRunning: 0,
      selected: [],
      arrIsHighlighted: [],
      isSlotHighlighted: 0,
      isAppOn: false,
      mode: 1, // 1 absolute 2 relative 3 arrows
      arrow: "",
      clicksGazer: 0,
    };
  },
  methods: {
    ...mapMutations(["setSelected", "setArrowDirection"]),
    changeMode: function(value) {
      this.mode = parseInt(value.target.value);
      localStorage.setItem("mode", this.mode);
      document.getElementById("mode").blur();
    },
    handleHighlighted: function(arrHighlighted) {
      //console.log(arrHighlighted);array speichert die indexe von den gehighlightetetn Kacheln
      for (let i = 0; i < this.favorites.length; i++) {
        this.arrIsHighlighted[i] = arrHighlighted.includes(i);
      }
      //ist der slot gehighlightet oder nicht
      if (
        this.favorites.length < 8 &&
        arrHighlighted.includes(this.favorites.length)
      ) {
        this.isSlotHighlighted = 1;
      } else {
        this.isSlotHighlighted = 0;
      }
      if (this.mode == 3) {
        this.xMin = 6; // any random value to refreh the child component. xMin does not play any role in mode 3, damit vue das Bild neuzeichnet
      }
      if (this.mode == 4) {
        let snapShotHighlightedSituation = this.getHighlighted;
        setTimeout(() => {
          if(snapShotHighlightedSituation == this.getHighlighted){

            if (this.selected.length == 1) {
              //console.log(this.favorites[this.selected[0]].url);
              if (this.isSlotHighlighted) {
                console.log("click add favorite");
                document.getElementById("addfav").click();
              } else {
                //this.
                window.open(this.favorites[this.selected[0]].url, "_blank");
                location.reload();
              }
            } else this.handleClick();
          }
        }, 2500);      }
      /*if (this.selectionRunning == 0 && this.selected.length > 1) {
        this.selectionRunning = 1;
        setTimeout(() => {
          this.selected = this.getHighlighted;
          this.setSelected(this.selected);
          this.selectionRunning = 0;
          //console.log(this.selected);
        }, 5000);
      } else if (this.selectionRunning == 0 && this.selected.length == 1) {
        //console.log(this.favorites[this.selected[0]].url);
        if (this.isSlotHighlighted) {
          console.log("click add favorite");
          document.getElementById("addfav").click();
        } else {
          window.open(this.favorites[this.selected[0]].url, "_blank");
          location.reload();
        }
        this.selected = [];
        this.selectionRunning = 0;
        this.arrIsHighlighted = [];
        this.setSelected(this.selected);
      } */

      //console.log(this.selected);
    },
    handleClick: function() {
      //console.log('clicked');
      if (this.selected.length > 1) {
        this.selected = this.getHighlighted;
        this.setSelected(this.selected);
        if (this.selected.length == 1) {
          this.handleClick();
        }
      } else if (this.selected.length == 1) {
        //console.log(this.favorites[this.selected[0]].url);
        if (this.isSlotHighlighted) {
          console.log("click add favorite");
          document.getElementById("addfav").click();
        } else {
          //this.
          window.open(this.favorites[this.selected[0]].url, "_blank");
          location.reload();
        }
        this.selected = [];
        this.arrIsHighlighted = [];
        this.setSelected(this.selected);
      }
    },
    determinePos(index) {
      let arrPosition = ["", ""]; //top bottom right left
      if (this.mode == 1) {
        return arrPosition[index];
      }
      if (this.mode == 2 || this.mode == 3 || this.mode == 4) {
        let selected = this.getSelected;
        if (selected.length > 4) {
          arrPosition = ["left", "right"];
        } else if (selected.length > 2) {
          if (selected[2] - selected[0] > 3) {
            arrPosition = ["top", "bottom"];
          } else {
            arrPosition = ["left", "right"];
          }
        } else if (selected.length > 0) {
          arrPosition = ["left", "right"];
        }
      }

      return arrPosition[index];
    },
    adjustGazerClick(){
       this.clicksGazer++ ;
       if( this.clicksGazer >= 5){
         this.isAppOn = true;
          //this.handleClick();
       }
    },
    //Pfeiltasten, 13=enter
    onKeyup(e) {
     // console.log(e);
      if (this.mode == 3) {
        e = e || window.event;
        if (e.keyCode == "13") {
          this.handleClick();
          return;
        }
        //console.log(e);
        let direction = "";
        if (e.keyCode == "38") {
          direction = "top";
        } else if (e.keyCode == "40") {
          direction = "bottom";
        } else if (e.keyCode == "37") {
          direction = "left";
        } else if (e.keyCode == "39") {
          direction = "right";
        }
        if (direction != "") {
          this.arrow = direction;
          this.setArrowDirection(direction);
        }
      }
    },
    determineFirstHalf() {
      let result = [];
      let selected = this.getSelected;
      if (selected.length > 4) {
        result = [0, 1, 4];
        if (selected.length > 5) {
          result.push(5);
        }
      } else if (selected.length > 2) {
        result = [selected[0], selected[1]];
      } else if (selected.length > 0) {
        result = [selected[0]];
      }
      return result;
    },
    determineSecondHalf() {
      let result = [];
      let selected = this.getSelected;
      if (selected.length == 8) {
        result = [2, 3, 6, 7];
      } else if (selected.length == 7) {
        result = [2, 3, 6];
      } else if (selected.length > 4) {
        result = [2, 3];
      } else if (selected.length == 4) {
        result = [selected[2], selected[3]];
      } else if (selected.length == 3) {
        result = [selected[2]];
      } else if (selected.length == 2) {
        result = [selected[1]];
      }
      //console.log(result);
      return result;
    },
    onClickRemove(favoriteId) {
      this.$store.commit("removeFav", favoriteId);
    },
  },
  //hier stellt man den mode ein, relative= 2,oder absolute =1,mode 3= Pfeiltasten, eventListener für mode 3
  mounted() {
    if (localStorage.getItem("mode")) {
      this.mode = parseInt(localStorage.getItem("mode"));
    } else {
      this.mode = 1;
    }
    window.addEventListener("keyup", this.onKeyup);
    if(this.mode == 4){
        window.addEventListener("click", this.adjustGazerClick);
    }
  },
  updated() {
    if (
      (this.getCurrentCoor.x != 0 ||
      this.getCurrentCoor.y != 0 ||
      this.mode == 3 ) &&  this.mode != 4  
    ) {
      //mouse moved
      this.isAppOn = true;
    }
    if (this.favorites.length == 0) {
      //no favorites stored. do nothing
      this.isAppOn = false;
    }
    if (!this.isAppOn) {
      return;
    }
    const rect = this.$refs.parent.getBoundingClientRect();

    this.xMin = rect.left;
    this.xMax = rect.right;
    this.yMin = rect.top;
    this.yMax = rect.bottom;
    let selected = this.getSelected;
    if (selected.length == 0) {
      for (let i = 0; i < this.favorites.length; i++) {
        selected.push(i);
      }
      if (this.favorites.length < 8) {
        selected.push(this.favorites.length);
      }
      this.setSelected(selected);
    }
    this.selected = selected;
  },
};
</script>

<style lang="css" >
ul {
  list-style-type: none;
  padding-left: unset;
  margin: auto;
  display: flex;
  flex-flow: row wrap;
  width: 80vw;
}
.favorite-element {
  background-color: transparent;
  height: 20vw;
  width: 20vw;
}
.favorite-element > div {
  background-color: #008000;
  height: calc(100% - 2rem);
  width: calc(100% - 2rem);
  margin: 1rem;
  display: flex;
  flex-flow: column nowrap;
}
.favorite-element > div > * {
  max-width: 80%;
  margin: 0.5rem auto;
}
 div.highlighted {
  background-color: #ff6eb4;
}
</style>
