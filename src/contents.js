import Vue from 'vue'
import App from './App2.vue'
import store from './store'

let enableKeyboadr = false
const arrAllInput = document.querySelectorAll('input');    
for(let i=0; i< arrAllInput.length;i++){
    if(arrAllInput[i].type == "text" && !arrAllInput[i].disabled && window.getComputedStyle(arrAllInput[i]).display != 'none'){
        enableKeyboadr = true;
    }
}
if(enableKeyboadr){
   let g = document.createElement('div');
   g.setAttribute("id", "app2");
   document.body.appendChild(g);


    Vue.config.productionTip = false

    new Vue({
        store,
        render: h => h(App)
    }).$mount('#app2')

}