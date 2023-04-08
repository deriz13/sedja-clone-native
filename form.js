/**
 * 
 * var editingItem: from main.js
 * func drawItems(): from main.js
 * 
 * TODO:
1. Setting value on form (edit)
 */

let symbol = null;
let size = 50;
let rotation = 0;

function addSymbol(x, y) {
  if (symbol != null) {
    var item = {
      x: x,
      y: y,
      rotation: 0, 
      size: 50, 
      symbol_type: symbol, 
      type: "symbol",
    };
    return item;
  }
  return null;
}

function setSymbol(type) {
  symbol = type;
}

function generateSymbolSettings(item) {
	const html = `
    <div class="form-group">
      <label>Size:</label>
      <input type="range" min="10" max="100" value="50" id="size-range-symbol" onchange="changeSizeSymbol()">
    </div>
    <div class="form-group">
      <label>Rotate:</label>
      <input type="range" min="0" max="360" value="0" id="rotate-range-symbol" onchange="rotateSymbol()">
    </div>
    <div class="form-group">
      <button onclick="deleteItem()"><i class="fas fa-trash-alt"></i></button>
    </div>
  `;
  return html;
}

function changeSizeSymbol() {
  size = document.getElementById("size-range-symbol").value;
	editingItem.size = size;
  drawItems();
}

function rotateSymbol() {
  rotation = document.getElementById("rotate-range-symbol").value;
	editingItem.rotation = rotation;
  drawItems();
}