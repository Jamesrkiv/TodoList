// GLOBAL VARIABLES /////////////////////////////////////////////////////////////////////////////////////////

var tracking_num = parseInt(Date.now());
var todoData = "";

// FUNCTIONS ////////////////////////////////////////////////////////////////////////////////////////////////

// Creates a new item in the todo list
function createListItem(desc, due, priority, idnum) {
	var priorityHTML = "";
	var dueHTML = "";
	switch(priority) {
		case "Low":
			priorityHTML = '<span class="badge bg-info rounded-pill v-middle">Low</span>';
			break;
		case "Medium":
			priorityHTML = '<span class="badge bg-warning rounded-pill v-middle">Med</span>';
			break;
		case "High":
			priorityHTML = '<span class="badge bg-danger rounded-pill v-middle">High</span>';
			break;
		default:
			break;
	}
	if (due) dueHTML = '<span class="badge bg-secondary rounded-pill v-middle">'+due+'</span> ';
	var item = '<li class="d-flex list-group-item p-3 overflow-hidden" id="item'+idnum+'">'+
					'<button type="button" class="inln btn btn-outline-success" style="height: 50px; width:50px" onclick="deleteListItem('+idnum+');test();">'+
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
	var descInput = document.getElementById("inputDesc");

	if (!descInput.checkValidity()) {
		descInput.classList.add("is-invalid");
		return;
	}
	
	createListItem(desc.value, due.value, priority.value, tracking_num);
	saveData(desc.value, due.value, priority.value, tracking_num);
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

// Runs when webpage loaded
window.onload = async (event) => {
	// window.electronAPI.test("Init successful");
	todoData = await window.electronAPI.load();
	for (var i = 0; i < todoData.length; i++)
		createListItem(todoData[i]["txt"], todoData[i]["due"], todoData[i]["pri"], todoData[i]["idn"]);
};

