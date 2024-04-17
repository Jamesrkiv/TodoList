// GLOBAL VARIABLES /////////////////////////////////////////////////////////////////////////////////////////

var tracking_num = parseInt(Date.now());
var currentSort = "default";
var dragEnabled = true;
var dragging = null;

// FUNCTIONS ////////////////////////////////////////////////////////////////////////////////////////////////

// Creates a new item in the todo list
function createListItem(desc, due, priority, idnum) {
	var priorityHTML = "";
	var dueHTML = "";
	switch(priority) {
		case 1:
			priorityHTML = '<span class="badge bg-info rounded-pill v-middle">Low</span>';
			break;
		case 2:
			priorityHTML = '<span class="badge bg-warning rounded-pill v-middle">Med</span>';
			break;
		case 3:
			priorityHTML = '<span class="badge bg-danger rounded-pill v-middle">High</span>';
			break;
		default:
			break;
	}
	if (due) dueHTML = '<span class="badge bg-secondary rounded-pill v-middle">'+due+'</span> ';
	var item = '<li class="d-flex list-group-item p-3 overflow-hidden" draggable="true" id="item'+idnum+'">'+
					'<button type="button" class="inln btn btn-outline-success" style="height: 50px; width:50px" onclick="deleteListItem('+idnum+');">'+
						'<svg xmlns="http://www.w3.org/2000/svg" width="25" height="34" fill="currentColor" class="bi bi-check btn-icon" viewBox="0 0 16 16">'+
							'<path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425z"/>'+
						'</svg>'+
					'</button>'+
					'<div id="todo-info-div">'+
						'<p class="inln p-2 normal-a v-middle">'+desc+'</p>'+
						dueHTML+
						priorityHTML+
					'</div>'+
				'</li>';
	var list = document.getElementById("todo-list");
	list.innerHTML += item;
}

// Deletes an existing item in the todo list
async function deleteListItem(idnum) {
	document.getElementById("item"+idnum).remove();
	await deleteData(idnum);
}

// Function to run when the form for creating a new todo list item is submitted
function submitItemForm() {
	var desc = document.getElementById("inputDesc");
	var due = document.getElementById("dueDate");
	var priority = document.getElementById("selectPriority");
	var priorityv = 0; // It's easier to sort by a number
	var descInput = document.getElementById("inputDesc");
	switch(priority.value) {
		case "High":
			priorityv = 3;
			break;
		case "Medium":
			priorityv = 2;
			break;
		case "Low":
			priorityv = 1;
			break;
		default:
			priorityv = 0;
			break;
	}
	if (!descInput.checkValidity()) {
		descInput.classList.add("is-invalid");
		return;
	}
	createListItem(desc.value, due.value, priorityv, tracking_num);
	saveData(desc.value, due.value, priorityv, tracking_num);
	resort();
	$("#item-modal").modal('hide');
	tracking_num++;
	desc.value = "";
	due.value = "";
	priority.value = "None";
	descInput.classList.remove("is-invalid");
}

// Function to run when the form for creating a new todo list item is cancelled
function cancelItemForm() {
	$("#item-modal").modal('hide');
	document.getElementById("inputDesc").value = "";
	document.getElementById("dueDate").value = "";
	document.getElementById("selectPriority").value = "None";
	document.getElementById("inputDesc").classList.remove("is-invalid");
}

// Save data to the db
function saveData(text, due, priority, idnum) {
	var doc = {
		txt: text,
		due: due,
		pri: priority,
		idn: idnum
	};
	window.electronAPI.save(doc);
}

// Remove data from the db
function deleteData(idnum) {
	window.electronAPI.delete(idnum);
}

// Sorts by ID number to put in order created
async function idSort() {
	document.getElementById("todo-list").innerHTML = "";
	var data = await window.electronAPI.load();
	data.sort(function(a,b) { 
		return a.idn - b.idn
	});
	for (var i = 0; i < data.length; i++) {
		createListItem(data[i]["txt"], data[i]["due"], data[i]["pri"], data[i]["idn"]);
	}
	currentSort = "id";
}

// Sorts by priority, secondary sort by ID
async function prioritySort() {
	document.getElementById("todo-list").innerHTML = "";
	var data = await window.electronAPI.load();
	data.sort(function(a,b) {
		if (b.pri > a.pri) return 1;
		else if (b.pri < a.pri) return -1;
		else {
			if (a.idn > b.idn) return 1;
			else if (a.idn < b.idn) return -1;
			else return 0;
		}
	});
	for (var i = 0; i < data.length; i++) {
		createListItem(data[i]["txt"], data[i]["due"], data[i]["pri"], data[i]["idn"]);
	}
	currentSort = "priority";
}

// Sorts by due date, secondary sort by ID
async function dateSort() {
	document.getElementById("todo-list").innerHTML = "";
	var data = await window.electronAPI.load();
	data.sort(function(a,b) { 
		if (a.due.trim() == "" && b.due.trim() != "") return 1; 
		else if (a.due.trim() != "" && b.due.trim() == "") return -1;
		else {
			if (new Date(a.due) > new Date(b.due)) return 1;
			else if (new Date(a.due) < new Date(b.due)) return -1;
			else {
				if (a.idn > b.idn) return 1;
				else if (a.idn < b.idn) return -1;
				else return 0;
			}
		}
	});
	for (var i = 0; i < data.length; i++) {
		createListItem(data[i]["txt"], data[i]["due"], data[i]["pri"], data[i]["idn"]);
	}
	currentSort = "date";
}

// Function for refreshing the list according to the current sort method
function resort() {
	switch(currentSort) {
		default:
		case "id":
			idSort();
			break;
		case "priority":
			prioritySort();
			break;
		case "date":
			dateSort();
			break;
	}
}

// DRAGGING /////////////////////////////////////////////////////////////////////////////////////////////////

document.addEventListener('dragstart', function(event) {
    var target = getLI(event.target);
    if (target.nodeName == undefined || target.classList.contains('no-drop')) return;
    dragging = target;
    event.dataTransfer.setData('text/plain', null);
    event.dataTransfer.setDragImage(self.dragging,0,0);
});

document.addEventListener('dragover', function(event) {
    event.preventDefault();
    var target = getLI(event.target);
    if (target.nodeName == undefined || target.classList.contains('no-drop')) return;
    var bounding = target.getBoundingClientRect()
    var offset = bounding.y + (bounding.height/2);
    if (event.clientY - offset > 0) {
       	target.style['border-bottom'] = 'solid 1px grey';
        target.style['border-top'] = '';
    }
    else {
        target.style['border-top'] = 'solid 1px grey';
        target.style['border-bottom'] = '';
    }
});

document.addEventListener('dragleave', function(event) {
    var target = getLI(event.target);
    if (target.nodeName == undefined || target.classList.contains('no-drop')) return;
    target.style['border-bottom'] = '';
    target.style['border-top'] = '';
});

document.addEventListener('drop', function(event) {
    event.preventDefault();
    var target = getLI(event.target);
    if (target.nodeName == undefined || target.classList.contains('no-drop')) return;
    if (target.style['border-bottom'] !== '') {
        target.style['border-bottom'] = '';
        target.parentNode.insertBefore(dragging, event.target.nextSibling);
    }
    else {
        target.style['border-top'] = '';
        target.parentNode.insertBefore(dragging, event.target);
    }
});

function getLI(target) {
    while (target.nodeName.toLowerCase() != 'li' && target.nodeName.toLowerCase() != 'body') {
        target = target.parentNode;
    }
    if (target.nodeName.toLowerCase() == 'body') {
        return false;
    }
    else {
        return target;
    }
}

// SCRIPT START /////////////////////////////////////////////////////////////////////////////////////////////

// Runs when webpage loaded
window.onload = (event) => {
	idSort();
}

