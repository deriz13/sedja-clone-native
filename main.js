const pdfFile = document.getElementById('pdf-file');
const pdfCanvas = document.getElementById('pdf-canvas');
const pdfContext = pdfCanvas.getContext('2d');
const itemCanvas = document.getElementById('item-canvas');
const itemContext = itemCanvas.getContext('2d');
var settingsPanel = document.getElementById('action');
// const selectedMenu = document.getElementById('selected').value;
var items = [];
var editingItem = null;
var mouse = {
	x: 0,
	y: 0,
};
var startX, startY, endX, endY;
var isDrawing = false;

pdfFile.addEventListener('change', function() {
	const file = pdfFile.files[0];
	const fileReader = new FileReader();

	fileReader.onload = function() {
		const typedArray = new Uint8Array(this.result);
		pdfjsLib.getDocument(typedArray).promise.then(function(pdf) {
			pdf.getPage(1).then(function(page) {
				const viewport = page.getViewport({scale: 1});
				pdfCanvas.width = viewport.width;
				pdfCanvas.height = viewport.height;

				itemCanvas.width = viewport.width;
				itemCanvas.height = viewport.height;

				page.render({
					canvasContext: pdfContext,
					viewport: viewport
				});
			});
		});
	};

	fileReader.readAsArrayBuffer(file);
});

itemCanvas.addEventListener('click', function(event) {
	const selectedMenu = document.getElementById('selected').value;
  // var x = event.pageX - itemCanvas.offsetLeft;
  // var y = event.pageY - itemCanvas.offsetTop;
	var x = event.offsetX;
	var y = event.offsetY;
  for (var i = items.length - 1; i >= 0; i--) {
	console.log(items)
    var item = items[i];
    var itemX = item.x;
    var itemY = item.y;
    var itemWidth = itemContext.measureText(item.text).width;
    var itemHeight = parseInt(item.fontSize);
    if (x >= itemX && x <= itemX + itemWidth && y >= itemY && y <= itemY + itemHeight) {
      	editingItem = item;
		showSettings(item);
      	return;
    }
  }
	if (selectedMenu == "text") {
		const itemText = addText(x, y);
		if (itemText) {
			items.push(itemText);
		}
    	drawItems();
	}
	hideSettings();
});

itemCanvas.addEventListener("mousedown", function (evt) {
    const selectedMenu = document.getElementById('selected').value;
	mouse = getMousePos(itemCanvas, evt);
    checkForSelectedItem();

	if (selectedMenu == "links") {
		startDraw(evt);
	}
	if (editingItem) {
		itemCanvas.addEventListener("mousemove", moveSelectedItem(evt));
	} else {
		itemCanvas.addEventListener("mousemove", draw(evt));
	}
  }, false);

itemCanvas.addEventListener("mouseup", function (evt) {
	const selectedMenu = document.getElementById('selected').value;

	if (editingItem) {
		itemCanvas.addEventListener("mousemove", moveSelectedItem(evt));
	} else {
		itemCanvas.addEventListener("mousemove", draw(evt));
	}
	if (selectedMenu == "links") {
		endDraw(evt);
	}
}, false);

function startDraw(e) {
	startX = e.offsetX;
	startY = e.offsetY;
	isDrawing = true;
}

function draw(e) {
	if (!isDrawing) return;
	itemContext.beginPath();
}

function endDraw(e) {
	const selectedMenu = document.getElementById('selected').value;
	
	endX = e.offsetX;
	endY = e.offsetY;
	var width = endX - startX;
	var height = endY - startY;
	itemContext.rect(startX, startY, width, height);
	itemContext.stroke();
	isDrawing = false;
	// drawLinks();
	if (selectedMenu == "links") {
		var item = {
			x: startX,
			y: startY,
			width: endX - startX, 
			height: endY - startY, 
			link_type: "external", 
			link: "",
			type: "links",
		};
		items.push(item);
		drawItems();
	}
}

function drawLinks() {
	// ctx.clearRect(0, 0, itemCanvas.width, itemCanvas.height);
	// for (var i = 0; i < links.length; i++) {
	// var link = links[i];
	// ctx.beginPath();
	// ctx.rect(link.x, link.y, link.width, link.height);
	// ctx.fillStyle = "rgba(0, 0, 255, 0.1)";
	// ctx.fill();
	// ctx.strokeStyle = "blue";
	// ctx.stroke();
	// if (link.type === "external") {
	// ctx.font = "12px Arial";
	// ctx.fillStyle = "blue";
	// ctx.fillText("External Link", link.x + 5, link.y + 15);
	// ctx.fillText(link.url, link.x + 5, link.y + 30);
	// } else if (link.type === "email") {
	// ctx.font = "12px Arial";
	// ctx.fillStyle = "blue";
	// ctx.fillText("Email Link", link.x + 5, link.y + 15);
	// ctx.fillText(link.url, link.x + 5, link.y + 30);
	// } else if (link.type === "phone") {
	// ctx.font = "12px Arial";
	// ctx.fillStyle = "blue";
	// ctx.fillText("Phone Link", link.x + 5, link.y + 15);
	// ctx.fillText(link.url, link.x + 5, link.y + 30);
	// } else if (link.type === "pdf") {
	// ctx.font = "12px Arial";
	// ctx.fillStyle = "blue";
	// ctx.fillText("Internal PDF Link", link.x + 5, link.y + 15);
	// }
	// }
	}

function getMousePos(canvas, evt) {
	var rect = canvas.getBoundingClientRect();
	return {
	  x: evt.clientX - rect.left,
	  y: evt.clientY - rect.top,
	};
}

function checkForSelectedItem() {
	for (var i = items.length - 1; i >= 0; i--) {
	  var item = items[i];
	  var x = item.x;
	  // var y = item.y - parseInt(item.fontSize);
	  var y = item.y;
	  var width = itemContext.measureText(item.text).width;
	  var height = parseInt(item.fontSize);
	  if (
		mouse.x >= x &&
		mouse.x <= x + width &&
		mouse.y >= y &&
		mouse.y <= y + height
	  ) {
		editingItem = item;
		return;
	  }
	}
	editingItem = null;
}

function moveSelectedItem(evt) {
	var mousePos = getMousePos(itemCanvas, evt);
	var dx = mousePos.x - mouse.x;
	var dy = mousePos.y - mouse.y;
  
	if (editingItem) {
	  // selectedTextItem.x = mouse.x;
	  // selectedTextItem.y = mouse.y;
	  editingItem.x += dx;
	  editingItem.y += dy;
	  mouse.x = mousePos.x;
	  mouse.y = mousePos.y;
	  drawItems();
	}
}

function deleteItem() {
  var index = items.indexOf(editingItem);
  items.splice(index, 1);
  drawItems();
	editingItem = null;
	hideSettings();
}

function showSettings(item) {
	const selectedMenu = document.getElementById('selected').value;
	if (selectedMenu == "text") {
		settingsPanel.innerHTML = generateTextSettings(item);
	}
}

function hideSettings() {
	settingsPanel.innerHTML = '';
}

function drawItems() {
  itemContext.clearRect(0, 0, itemCanvas.width, itemCanvas.height);
  for (var i = 0; i < items.length; i++) {
    var item = items[i];
		if (item.type == "text") {
			itemContext.font = item.fontStyle + " " + item.fontWeight + " " + item.fontSize + " " + item.font;
			itemContext.fillStyle = item.color;
			itemContext.textBaseline = "top";
			itemContext.textAlign = "left";
			itemContext.fillText(item.text, item.x, item.y);
		} else if (item.type == "links") {
			itemContext.beginPath();
			itemContext.rect(item.x, item.y, item.width, item.height);
			itemContext.fillStyle = "rgba(0, 0, 255, 0.1)";
			itemContext.fill();
			itemContext.strokeStyle = "blue";
			itemContext.stroke();
		}
  }
}
