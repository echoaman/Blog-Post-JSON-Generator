document.onkeydown = shortCuts;
const desc = document.getElementById("desc");
const heading = document.getElementById("heading");
const descCount = document.getElementById("desc-count");

function createJson() {
	try {
		const jsonData = {};
	
		// basic meta
		jsonData["heading"] = heading.value;
		jsonData["desc"] = desc.value;
	
		// publish date
		const today = new Date();
		const date = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
		const formattedDate = today.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
		const publishData = {};
		publishData["dateTime"] = date;
		publishData["date"] = formattedDate;
	
		jsonData["publishedOn"] = publishData;

		// blog post content
		jsonData["postContent"] = [];

		const postContentRows = document.querySelectorAll(".post-content-row");
		let rowData = null;
		let listDataArray = null;
		let listTag = null;

		for (let index = 0; index < postContentRows.length; index++) {
			const tag = postContentRows[index].children[0].value;
			const tagValue = postContentRows[index].children[1].value;
			if(tag !== "ul") {
				if(listDataArray) {
					// if ul data is present, push it
					const listData = {};
					listData[listTag] = listDataArray;
					jsonData["postContent"].push(listData);

					// reset
					listDataArray = null;
				}
				rowData = {};
				rowData[tag] = tagValue;
				jsonData["postContent"].push(rowData);
			} else {
				if(!listDataArray) {
					// create new list data array
					listDataArray = [tagValue];
					listTag = tag;
				} else {
					listDataArray.push(tagValue);
				}
			}
		}

		if(listDataArray) {
			// if ul data is present, push it
			const listData = {};
			listData[listTag] = listDataArray;
			jsonData["postContent"].push(listData);

			// reset
			listDataArray = null;
		}
	
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

	row.scrollIntoView({behavior: "smooth"});
}

function shortCuts(evt){
	// Control + Alt + k => Create hypertext
	if (evt.ctrlKey && evt.altKey && evt.keyCode === 75){
		navigator.clipboard.writeText(`<strong><a title='text' href='href' target='_blank' rel='noopener noreferrer'>text</a></strong>`);
	}
	// Control + Alt + b => Create bold text
	if (evt.ctrlKey && evt.altKey && evt.keyCode === 66){
		navigator.clipboard.writeText(`<strong>text</strong>`);
	}
}

function updateCharCount() {
	descCount.textContent = desc.value.length;
}