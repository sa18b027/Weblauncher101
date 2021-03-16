let mode = 1;
if (localStorage.getItem("mode")) {
  mode = parseInt(localStorage.getItem("mode"));
}
var selectObj = document.getElementById("mode");
for (var i = 0; i < selectObj.options.length; i++) {
  if (selectObj.options[i].value == mode) {
    selectObj.options[i].selected = true;
  }
}
//wenn ich etwas anderes auswaehle, dann wird der Wert in localStorage geschrieben
selectObj.onchange = onChange;
function onChange() {
  var selectObj = document.getElementById("mode");
  localStorage.setItem("mode", selectObj.value);
}
