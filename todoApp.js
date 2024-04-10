//

function createListItem(text, desc, due, priority)
{
	var priorityHTML = "";
	switch(priority)
	{
		case "low":
			priorityHTML = ' <span class="badge bg-info rounded-pill v-middle">Low</span>';
			break;
		case "med":
			priorityHTML = ' <span class="badge bg-warning rounded-pill v-middle">Med</span>';
			break;
		case "high":
			priorityHTML = ' <span class="badge bg-danger rounded-pill v-middle">High</span>';
			break;
		default:
			break;
	}
	var item = '<li class="d-flex list-group-item p-3 overflow-hidden">'+
					'<button type="button" class="inln btn btn-outline-success" style="height: 50px; width:50px">'+
						'<svg xmlns="http://www.w3.org/2000/svg" width="25" height="34" fill="currentColor" class="bi bi-check btn-icon" viewBox="0 0 16 16">'+
							'<path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425z"/>'+
						'</svg>'+
					'</button>'+
					'<div id="todo-info-div">'+
						'<a class="inln p-2 normal-a v-middle" href="#">'+text+'</a>'+
						'<span class="badge bg-secondary rounded-pill v-middle">'+due+'</span>'+
						priorityHTML+
					'</div>'+
				'</li>';
	var list = document.getElementById("todo-list");
	list.innerHTML = item;
}

window.onload = function ()
{
	createListItem("Test list item", "Test", "04/08/24", "high");
}