const parse = require("marked").parse;
const electron = require("electron");

let editor = document.querySelector(".editor");
let textfield = document.querySelector(".textfield");
let renderview = document.querySelector(".renderview");
let resizehandle = document.querySelector(".resizehandle");
let draghandle = document.querySelector(".toolbar");

function render() {
    parse(textfield.value, (err, res) => {
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