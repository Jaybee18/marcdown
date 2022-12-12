const parse = require("marked").parse;
const electron = require("electron");

let editor = document.querySelector(".editor");
let textfield = document.querySelector(".textfield");
let renderview = document.querySelector(".renderview");
let resizehandle = document.querySelector(".resizehandle");
let draghandle = document.querySelector(".toolbar");

var encodedStr = rawStr => rawStr.replace(/[\u00A0-\u9999<>\&]/g, function(i) {
  return '&#'+i.charCodeAt(0)+';';
});

function custom_parse(input) {
  let res = input;
  res = res.replaceAll("==>", "\u27f9");
  res = res.replaceAll("=>", "\u21d2");
  res = res.replaceAll("-->", "\u27f6");
  res = res.replaceAll("->", "\u2192");
  res = res.replaceAll("+-", "\u00b1");
  res = res.replaceAll("=/=", "\u2260");
  res = res.replaceAll(">=", "\u2265");
  res = res.replaceAll("<=", "\u2264");
  return encodedStr(res);
}

function render() {
  // some slight custom modifications like => and ⇒
  let input = custom_parse(textfield.value);
    parse(input, (err, res) => {
        renderview.innerHTML = res;
    });
}

// editor
textfield.addEventListener("input", (e) => {
    render();
});

// view resizing (editor / renderer)
function resize(e) {
    editor.style.width = e.x / window.innerWidth * 100 + "%";
    renderview.style.width = (1 - e.x / window.innerWidth)*100 + "%";
    draghandle.style.width = (1 - e.x / window.innerWidth)*100 + "%";
  }
  resizehandle.addEventListener("mousedown", () => {
    document.addEventListener("mousemove", resize);
  });
  document.addEventListener("mouseup", () => {
    document.removeEventListener("mousemove", resize);
  });

// close btn
let closebtn = document.querySelector(".closebtn");
closebtn.addEventListener("click", () => {
    console.log("close")
    electron.ipcRenderer.invoke("close");
});

// key events
document.addEventListener("keydown", (e) => {
  if (e.ctrlKey && e.key === "s") {
    e.preventDefault();
    electron.ipcRenderer.invoke("save", textfield.value);
  } else if (e.ctrlKey && e.key === "o") {
    e.preventDefault();
    electron.ipcRenderer.invoke("open").then((v) => {
      if (v === undefined) return;
      textfield.value = v;
      render();
    });
  }
});