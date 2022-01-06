document.onkeydown = keydown;

function createJson() {
	try {
		const heading = document.getElementById("heading");
		const desc = document.getElementById("desc");
		const date = document.getElementById("date");
		const dateTime = document.getElementById("dateTime");
		const jsonData = {};
	
		// basic meta
		jsonData["heading"] = heading.value;
		jsonData["desc"] = desc.value;
	
		// publish date
		const publishData = {};
		publishData["date"] = date.value;
		publishData["dateTime"] = dateTime.value;
	
		jsonData["publishedOn"] = publishData;

		// blog post content
		jsonData["postContent"] = [];
	
		navigator.clipboard.writeText(JSON.stringify(jsonData));
		alert("Blog Post JSON copied to clipboard");
	} catch (error) {
		alert("Some error occured");
	}
}

function createPostContentRow() {
	const optionsList = ["p", "ul", "h2", "h3"];
	const container = document.getElementById("container");

	// row element
	const row = document.createElement("div");
	row.classList.add("container-row");
	row.classList.add("post-content-row");

	// select element
	const dropdown = document.createElement("select");
	optionsList.forEach(item => {
		const option = document.createElement("option");
		option.value = item;
		option.text = item;
		option.selected = item === "p";
		dropdown.appendChild(option);
	});

	// text element
	const textArea = document.createElement("textarea");
	textArea.cols = 50;
	textArea.rows = 7

	// delete row button
	const deleteBtn = document.createElement("button");
	deleteBtn.textContent = "Delete Row";
	deleteBtn.classList.add("delete-btn");
	deleteBtn.addEventListener("click", () => {
		row.remove();
	});
	
	row.appendChild(dropdown);
	row.appendChild(textArea);
	row.appendChild(deleteBtn);

	container.appendChild(row);
}

function keydown(evt){
	// Control + Alt + k => Create hypertext
	if (evt.ctrlKey && evt.altKey && evt.keyCode === 75){
		navigator.clipboard.writeText(`<strong><a title='text' href='href' target='_blank' rel='noopener noreferrer'>text</a></strong>`);
	}
	// Control + Alt + b => Create bold text
	if (evt.ctrlKey && evt.altKey && evt.keyCode === 66){
		navigator.clipboard.writeText(`<strong>text</strong>`);
	}
}