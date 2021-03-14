<template>
  <div @click="handleClick">
    {{ getCurrentCoor }} <br />
    <!-- Eigenschaft die sich ändert um vue upzudaten -->

    <div :class="keyboardClass" ref="parent"></div>
    <HalfFavourite
      :fav-index="determineFirstHalf()"
      :x1="xMin"
      :y1="yMin"
      :x2="xMax"
      :y2="yMax"
      :sizex="16"
      :sizey="4"
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
      :sizex="16"
      :sizey="4"
      :position="determinePos(1)"
      :mode="mode"
      @highlighted="handleHighlighted"
      :arrow="arrow"
    />
  </div>
</template>

<script>
import Keyboard from "simple-keyboard";
import "simple-keyboard/build/css/index.css";
import { mapGetters } from "vuex";
import { mapMutations } from "vuex";
import HalfFavourite from "./HalfFavourite.vue";

export default {
  name: "Tastatur",
  components: { HalfFavourite },
  props: {
    keyboardClass: {
      default: "simple-keyboard",
      type: String
    },
    input: {
      type: String
    }
  },

  computed: {
    ...mapGetters([
      "getCurrentCoor",
      "getSelected",
      "getHighlighted",
      "getArrowDirection"
    ]),
    //array mit a b c,...
    arrButton: function() {
      if (this.keySchalter) {
        return this.buttons1.split(" ");
      } else {
        return this.buttons2.split(" ");
      }
    }
  },

  data: () => ({
    keyboard: null,
    xMin: 0, //getBoundingClientRect.left, großes Rechteck
    xMax: 0, //.right
    yMin: 0, //.top
    yMax: 0, //.bottom
    //selectionRunning: 0,
    selected: [], //die Tatsten die in Frage kommen, am Anfang 64
    isAppOn: false,
    selq: "keyboard-input-vue-0",
    mode: 1, // 1 absolute 2 relative 3 arrows
    arrow: "",
    storeInput: {},
    keySchalter: true,
    buttons1:
      "a b c d e f g h 1 2 3 4 5 6 7 8 i j k l m n o p 9 0 + - / * = % q r s t u v w x , ; . ? ! tab ( ) y z {shift} {space} @ _ : {enter} [ ] \u00E4 \u00F6 \u00FC \u00DF home {bksp}",
    buttons2:
      "A B C D E F G H 1 2 3 4 5 6 7 8 I J K L M N O P 9 0 + - / * = % Q R S T U V W X , ; . ? ! \u00A7 ( ) Y Z {shift} {space} @ _ : {enter} [ ] \u00C4 \u00D6 \u00DC \u00DF {shift2} {bksp}"
  }),
  mounted() {
    //console.log(this.arrButton);
    if (localStorage.getItem("mode")) {
      this.mode = parseInt(localStorage.getItem("mode"));
    } else {
      this.mode = 1;
    }
    window.addEventListener("keyup", this.onKeyup);
    //////////////////////////////////////////////   \u00A7
    this.keyboard = new Keyboard({
      onChange: this.onChange,
      //onKeyPress: this.onKeyPress,
      theme: "hg-theme-default hg-layout-default myTheme",
      layout: {
        default: [
          "a b c d e f g h 1 2 3 4 5 6 7 8",
          "i j k l m n o p 9 0 + - / * = %",
          "q r s t u v w x , ; . ? ! tab ( )",
          "y z {shift} {space} @ _ : {enter} [ ] \u00E4 \u00F6 \u00FC \u00DF home {bksp}"
        ],
        shift: [
          "A B C D E F G H 1 2 3 4 5 6 7 8",
          "I J K L M N O P 9 0 + - / * = %",
          "Q R S T U V W X , ; . ? ! \u00A7 ( )",
          "Y Z {shift} {space} @ _ : {enter} [ ] \u00C4 \u00D6 \u00DC \u00DF {shift2} {bksp}"
        ]
      },
      buttonTheme: [
        {
          class: "sameSize",
          buttons:
            "a b c d e f g h A B C D E F G H I J K L M N O P Q R S T U V W X Y Z 1 2 3 4 5 6 7 8 i j k l m n o p 9 0 + - / * = % q r s t u v w x , ; . ? ! @ ( ) y z {shift} {space} U+0040 _ : {enter} [ ] \u00E4 \u00F6 \u00FC \u00DF \u00C4 \u00D6 \u00DC \u00A7 {shift2} {bksp} tab home"
        },
        {
          class: "atButton",
          buttons: " @ "
        }
      ]
    });
    //Gell all Text fields
    const arrAllInput = document.querySelectorAll("input");
    //add genuine class to enabled text fields
    let i1 = 0;
    for (let i = 0; i < arrAllInput.length; i++) {
      if (
        arrAllInput[i].type == "text" &&
        !arrAllInput[i].disabled &&
        window.getComputedStyle(arrAllInput[i]).display != "none"
      ) {
        arrAllInput[i].classList.add("keyboard-input-vue-" + i1);
        /* arrAllInput[i].addEventListener('focus', () => {
             this.selq =  "keyboard-input-vue-" + i1;
          }); */
        i1++;
      }
    }
    if (i1 > 0) {
      //document.querySelector(".keyboard-input-vue-0").focus();
      this.selq = "keyboard-input-vue-0";
    }
  },
  methods: {
    ...mapMutations(["setSelected", "setArrowDirection"]),
    //64,32,16
    determineFirstHalf() {
      let result = [];
      let selected = this.getSelected;
      if (selected.length >= 16) {
        let cellsInRow = 8; //when 64 cells
        let cellsInColumn = 4;
        if (selected.length == 32) {
          cellsInRow = 8;
          cellsInColumn = 2;
        } else if (selected.length == 16) {
          cellsInRow = 4;
          cellsInColumn = 2;
        }
        for (let i = 0; i < cellsInColumn; i++) {
          for (let j = 0; j < cellsInRow; j++) {
            result.push(selected[0] + i * 16 + j);
          }
        }
        //<=8,nächste Stufe nur eine Reihe
      } else if (selected.length <= 8) {
        for (let j = 0; j < selected.length / 2; j++) {
          result.push(selected[0] + j);
        }
      }
      //console.log(result);
      return result;
    },
    determineSecondHalf() {
      let result = [];
      let selected = this.getSelected;
      if (selected.length == 64 || selected.length == 16) {
        let startIndex = 8;
        let cellsInRow = 8;
        let cellsInColumn = 4;
        if (selected.length == 16) {
          startIndex = 4;
          cellsInRow = 4;
          cellsInColumn = 2;
        }
        for (let i = 0; i < cellsInColumn; i++) {
          for (let j = 0; j < cellsInRow; j++) {
            result.push(selected[startIndex] + i * 16 + j);
          }
        }
      } else {
        let startIndex = selected.length / 2;
        for (let j = 0; j < selected.length / 2; j++) {
          result.push(selected[startIndex + j]);
        }
      }
      //console.log(result);
      return result;
    },
    //relative und Pfeiltasten
    determinePos(index) {
      let arrPosition = ["", ""]; //top bottom right left
      if (this.mode == 1) {
        return arrPosition[index];
      }
      //alterniert zwischen links,rechts und obern,unten
      if (this.mode == 2 || this.mode == 3) {
        let selected = this.getSelected;
        if (selected.length == 32 || selected.length == 8) {
          arrPosition = ["top", "bottom"];
        } else {
          arrPosition = ["left", "right"];
        }
      }

      return arrPosition[index];
    },
    handleHighlighted: function(arrHighlighted) {
      let selected = this.getSelected;
      let arrNotHighlighted = selected.filter(n => !arrHighlighted.includes(n));
      this.keyboard.addButtonTheme(
        this.translateIndexToButton(arrHighlighted),
        "highlighted"
      );
      //console.log(arrNotHighlighted);
      this.keyboard.removeButtonTheme(
        this.translateIndexToButton(arrNotHighlighted),
        "highlighted"
      );
      if (this.mode == 3) {
        this.xMin = 6; // any random value to refreh the child component. xMin does not play any role in mode 3, damit vue das Bild neuzeichnet
      }

      //console.log(this.selected);
    },
    handleClick: function() {
      if (this.selected.length > 1) {
        this.selected = this.getHighlighted;
        this.setSelected(this.selected);
        if (this.selected.length == 1) {
          this.handleClick();
        }
      } else if (this.selected.length == 1) {
        //if(this.mode == 3 || this.mode == 2){
        this.onKeyPress(this.arrButton[this.selected[0]]);
        //this.onChange(this.arrButton[this.selected[0]]) ;
        //}
        //console.log("click");
        this.selected = [];
        this.setSelected(this.selected);
      }
    },
    onKeyup(e) {
      //9 13
      console.log(e);
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
    translateIndexToButton(arrIndex) {
      let s = "";
      for (let i = 0; i < arrIndex.length; i++) {
        if (i > 0) {
          s += " ";
        }
        s += this.arrButton[arrIndex[i]];
      }
      return s;
    },
    onChange(input) {
      let key = this.selq;
      let val = "";
      if (typeof this.storeInput[key] != "undefined") {
        val = this.storeInput[key];
      }
      if (this.selected.length != 2) {
        this.keyboard.setInput(val);
      } else {
        if (input.replace(val, "") == "tab") {
          let index = Number(key.replace("keyboard-input-vue-", "")) + 1;
          const next = document.querySelector(".keyboard-input-vue-" + index);
          this.storeInput[key] = input.replace(val, "");
          if (next) {
            this.selq = "keyboard-input-vue-" + index;
          } else {
            //document.querySelector(".keyboard-input-vue-0").focus();
            this.selq = "keyboard-input-vue-0";
          }
          return;
        }
        if (input.replace(val, "") == "home") {
          window.open(chrome.runtime.getURL("index.html"), "_blank");
          location.reload();
        }
        this.storeInput[key] = input;
        document.querySelector("." + this.selq).value = input;
      }
      this.$emit("onChange", val);
    },
    onKeyPress(button) {
      //console.log(button);
      this.$emit("onKeyPress", button);
      /**
       * If you want to handle the shift and caps lock buttons
       */
      if (button === "{shift}" || button === "{shift2}" || button === "{lock}")
        this.handleShift();
    },
    handleShift() {
      console.log("Shift");
      this.keySchalter = !this.keySchalter;
      let currentLayout = this.keyboard.options.layoutName;
      let shiftToggle = currentLayout === "default" ? "shift" : "default";
      this.keyboard.setOptions({
        layoutName: shiftToggle
      });
    }
  },
  watch: {
    input(input) {
      this.keyboard.setInput(input);
    }
  },
  updated() {
    if (
      this.getCurrentCoor.x != 0 ||
      this.getCurrentCoor.y != 0 ||
      this.mode == 3
    ) {
      //mouse moved, Approximation kann laufen
      this.isAppOn = true;
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
    //wenn eineTaste gewählt, kommen alle wieder in Frage
    if (selected.length == 0) {
      for (let i = 0; i < 64; i++) {
        selected.push(i);
      }
      this.setSelected(selected);
    }
    this.selected = selected;
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.sameSize {
  width: 0.0625%;
}
.atButton {
  max-width: 800px;
  width: 0.0625%;
}
.highlighted {
  background-color: coral !important;
}
</style>
