document.onkeydown = shortCuts;
const desc = document.getElementById("desc");
const heading = document.getElementById("heading");
const descCount = document.getElementById("desc-count");
const prevBlogUrl = document.getElementById("prev-blog-url");
const prevBlogTitle = document.getElementById("prev-blog-title");
const nextBlogUrl = document.getElementById("next-blog-url");
const nextBlogTitle = document.getElementById("next-blog-title");
const readJsonInput = document.getElementById("read-json-input");

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

        // Next blog
        if(nextBlogUrl.value && nextBlogTitle.value) {
            const nextBlog = {};
            nextBlog["url"] = nextBlogUrl.value;
            nextBlog["title"] = nextBlogTitle.value;
            jsonData["nextBlog"] = nextBlog;
        }

        // Prev blog
        if(prevBlogUrl.value && prevBlogTitle.value) {
            const prevBlog = {};
            prevBlog["url"] = prevBlogUrl.value;
            prevBlog["title"] = prevBlogTitle.value;
            jsonData["prevBlog"] = prevBlog;
        }

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

function createPostContentRow(preSelectOption = "p", text = "") {
    const optionsList = ["p", "ul", "h2", "h3", "codeblock"];
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
        option.selected = item === preSelectOption;
        dropdown.appendChild(option);
    });

    // text element
    const textArea = document.createElement("textarea");
    textArea.cols = 50;
    textArea.rows = 7
    textArea.value = text;

    // delete row button
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete Row";
    deleteBtn.classList.add("delete-btn");
    deleteBtn.classList.add("enlarge-btn");
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

function readJson() {
	const jsonString = readJsonInput.value;
	if(!jsonString) {
		return;
	}

    const data = JSON.parse(jsonString);

    // read heading data
    const headingData = data["heading"];
    heading.value = headingData;

    // read description data
    const descData = data["desc"];
    desc.value = descData;
    descCount.textContent = descData.length;

    // log date data;
    const publishedOnData = data["publishedOn"];
    console.log(publishedOnData);

    // read prev blog data
    const prevBlogData = data["prevBlog"];
    if(prevBlogData) {
        prevBlogUrl.value = prevBlogData["url"];
        prevBlogTitle.value = prevBlogData["title"];
    }
    
    // read next blog data
    const nextBlogData = data["nextBlog"];
    if(nextBlogData) {
        nextBlogUrl.value = nextBlogData["url"];
        nextBlogTitle.value = nextBlogData["title"];
    }

    const postContentData = data["postContent"];
    for(let row = 0 ; row < postContentData.length ; row++) {
        for(let tag in postContentData[row]) {
            if(tag === "ul") {
                const listItems = postContentData[row][tag];
                for(let j = 0 ; j < listItems.length ; j++) {
                    createPostContentRow(tag, listItems[j]);
                }
            } else {
                createPostContentRow(tag, postContentData[row][tag]);
            }
        }
    }
}