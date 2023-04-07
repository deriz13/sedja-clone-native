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
		if (item.type == "text") {
			var itemWidth = itemContext.measureText(item.text).width;
			var itemHeight = parseInt(item.fontSize);
		} else if (item.type == "links") {
			var itemWidth = item.width;
			var itemHeight = item.height;
		} else {
			var itemWidth = 0
			var itemHeight = 0;
		}	

    if (x >= itemX && x <= itemX + itemWidth && y >= itemY && y <= itemY + itemHeight) {
			editingItem = item;
			console.log(item.type);
			hideSettings();
			showSettings(item);
      return;
    }
  }
	if (selectedMenu == "text") {
		createItem("text", x, y);
	} else if (selectedMenu == "links") {
		return;
	}
	hideSettings();
});

itemCanvas.addEventListener("mousedown", function (evt) {
  const selectedMenu = document.getElementById('selected').value;
	mouse = getMousePos(itemCanvas, evt);
  checkForSelectedItem();

	if (editingItem) {
		itemCanvas.addEventListener("mousemove", moveSelectedItem(evt));
	} else {
		if (selectedMenu == "links") {
			startDraw(evt);
		}
	}
}, false);

itemCanvas.addEventListener("mousemove", draw);

itemCanvas.addEventListener("mouseup", function (evt) {
	const selectedMenu = document.getElementById('selected').value;
	if (editingItem) {
		itemCanvas.addEventListener("mousemove", moveSelectedItem(evt));
	} else {
		if (selectedMenu == "links") {
			endDraw(evt);
		}
	}

}, false);

function startDraw(e) {
	startX = e.offsetX;
	startY = e.offsetY;
	isDrawing = true;
}

function draw(e) {
	if (!isDrawing) return;
	endX = e.offsetX;
	endY = e.offsetY;
  var width = endX - startX;
  var height = endY - startY;
  itemContext.clearRect(0, 0, itemCanvas.width, itemCanvas.height);
	drawItems();
  itemContext.beginPath();
  itemContext.rect(startX, startY, width, height);
  itemContext.stroke();
}

function endDraw(e) {
	const selectedMenu = document.getElementById('selected').value;
	isDrawing = false;
	if (selectedMenu == "links") {
		showSettings({type: "links"});
	}
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
	  // var width = itemContext.measureText(item.text).width;
	  // var height = parseInt(item.fontSize);
		if (item.type == "text") {
			var width = itemContext.measureText(item.text).width;
			var height = parseInt(item.fontSize);
		} else if (item.type == "links") {
			var width = item.width;
			var height = item.height;
		} else {
			var width = 0
			var height = 0;
		}	
		
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
	console.log("move")
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
	var confirmed = confirm("Are you sure you want to delete this item?");
  if (confirmed) {
		var index = items.indexOf(editingItem);
  	items.splice(index, 1);
  	drawItems();
		editingItem = null;
		hideSettings();
	}
}

function showSettings(item) {
	// const selectedMenu = document.getElementById('selected').value;
	if (item.type == "text") {
		settingsPanel.innerHTML = generateTextSettings(item);
	} else if (item.type == "links") {
		settingsPanel.innerHTML = generateLinkSettings(item);
	}
}

function createItem(type, x = 0, y = 0) {
	let newitem = null;
	if (type == "text") {
		newitem = addText(x, y);
	} else if (type == "links") {
		newitem = addLink(startX, startY, endX, endY) ;
	}

	if (newitem) {
		items.push(newitem);
	}
	hideSettings();
	drawItems();
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

			if (item.link_type === "external") {
				itemContext.font = "12px Arial";
				itemContext.fillStyle = "blue";
				itemContext.fillText("External Link", item.x + 5, item.y + 15);
				itemContext.fillText(item.link, item.x + 5, item.y + 30);
			} else if (item.link_typ === "email") {
				itemContext.font = "12px Arial";
				itemContext.fillStyle = "blue";
				itemContext.fillText("Email Link", item.x + 5, item.y + 15);
				itemContext.fillText(item.link, item.x + 5, item.y + 30);
			} else if (item.link_typ === "phone") {
				itemContext.font = "12px Arial";
				itemContext.fillStyle = "blue";
				itemContext.fillText("Phone Link", item.x + 5, item.y + 15);
				itemContext.fillText(item.link, item.x + 5, item.y + 30);
			} else if (item.link_typ === "pdf") {
				itemContext.font = "12px Arial";
				itemContext.fillStyle = "blue";
				itemContext.fillText("Internal PDF Link", item.x + 5, item.y + 15);
			}
		}
  }
}
