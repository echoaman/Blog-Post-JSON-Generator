const heading = document.getElementById("heading");
const description = document.getElementById("description");
const keywords = document.getElementById("keywords");
const date = document.getElementById("date");
const dateTime = document.getElementById("date-time");
const prevBlogTitle = document.getElementById("prev-blog-title");
const prevBlogSlug = document.getElementById("prev-blog-slug");
const nextBlogTitle = document.getElementById("next-blog-title");
const nextBlogSlug = document.getElementById("next-blog-slug");
const jsonInput = document.getElementById("json-input");
const blogContentContainer = document.querySelector(".blog-content");

function generateJson() {
    const blogJson = {};
    blogJson["heading"] = heading.value;
    blogJson["desc"] = description.value;
    blogJson["keywords"] = keywords.value;

    // publish date
    const publishDate = {};
    publishDate["date"] = date.value;
    publishDate["dateTime"] = dateTime.value;
    blogJson["publishedOn"] = publishDate;

    // Prev blog data
    if(prevBlogTitle.value && prevBlogSlug.value) {
        const prevBlog = {};
        prevBlog["slug"] = prevBlogSlug.value;
        prevBlog["title"] = prevBlogTitle.value;
        blogJson["prevBlog"] = prevBlog;
    }

    // Next blog data
    if(nextBlogSlug.value && nextBlogTitle.value) {
        const nextBlog = {};
        nextBlog["slug"] = nextBlogSlug.value;
        nextBlog["title"] = nextBlogTitle.value;
        blogJson["nextBlog"] = nextBlog;
    }

    // blog post content
    blogJson["postContent"] = [];

    const postContentRows = document.querySelectorAll(".blog-content-row");
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
                blogJson["postContent"].push(listData);

                // reset
                listDataArray = null;
            }

            rowData = {};

            if(tag === "img") {
                const imgData = {}
                imgData["path"] = postContentRows[index].children[3].value;
                imgData["alt"] = postContentRows[index].children[4].value;
                imgData["width"] = postContentRows[index].children[5].value;
                imgData["height"] = postContentRows[index].children[6].value;
                rowData["img"] = imgData;
                blogJson["postContent"].push(rowData);
                continue;
            }

            if(tag === "codeblock") {
                const codeData = {};
                const code = tagValue.replace(/</g, "&lt;").replace(/>/g, "&gt;");
                codeData["code"] = code;
                codeData["file"] = postContentRows[index].children[2].value;
                rowData["codeblock"] = codeData;
                blogJson["postContent"].push(rowData);
                continue;
            }

            rowData[tag] = tagValue;
            blogJson["postContent"].push(rowData);
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
        blogJson["postContent"].push(listData);

        // reset
        listDataArray = null;
    }
    navigator.clipboard.writeText(JSON.stringify(blogJson));
    alert("Blog post JSON copied");
}

function addContentRow(tag = "p", text = "") {
    const row = createRow(tag, text);
	blogContentContainer.appendChild(row);
	row.scrollIntoView({ behavior: "smooth" });
}

function createRow(tag = "p", text = "") {
	const row = document.createElement("div");
	row.classList.add("blog-content-row");

	// tags
	const select = document.createElement("select");
	const options = ["p", "h2", "h3", "ul", "codeblock", "img"];
	options.forEach(opt => {
        const option = document.createElement("option");
		option.value = opt;
		option.textContent = opt;
		option.selected = opt === tag;
		select.append(option);
	});

    select.addEventListener("change", function() {
        row.classList.toggle("img-data", select.value === "img");
        row.classList.toggle("code-data", select.value === "codeblock");
    });

    row.classList.toggle("img-data", tag === "img");
    row.classList.toggle("code-data", tag === "codeblock");

	row.appendChild(select);

	// input
	const input = document.createElement("textarea");
    input.classList.add("row-value");
	input.rows = 5;
    input.value = text;
	row.appendChild(input);

    // file name for code block
    const fileName = document.createElement("input");
    fileName.classList.add("file-name");
    fileName.placeholder = "File name";
    row.appendChild(fileName);

    // Images
    const imgPath = document.createElement("input");
    imgPath.classList.add("img-prop");
    imgPath.placeholder = "/image-path";
    row.appendChild(imgPath);
    
    const imgAlt = document.createElement("input");
    imgAlt.classList.add("img-prop");
    imgAlt.placeholder = "Image alt";
    row.appendChild(imgAlt);
    
    const imgWidth = document.createElement("input");
    imgWidth.classList.add("img-prop");
    imgWidth.placeholder = "Image width";
    row.appendChild(imgWidth);
    
    const imgHeight = document.createElement("input");
    imgHeight.classList.add("img-prop");
    imgHeight.placeholder = "Image height";
    row.appendChild(imgHeight);

	// delete btn
	const deleteBtn = document.createElement("button");
	deleteBtn.textContent = "Delete";
	deleteBtn.classList.add("bkg-red");
	deleteBtn.addEventListener("click", function() {
		row.remove();
	});
	row.appendChild(deleteBtn);

    // add row btn
    const addRowBtn = document.createElement("button");
    addRowBtn.innerHTML = "Add row";
    addRowBtn.classList.add("bkg-blue");
    addRowBtn.addEventListener("click", function() {
        row.parentElement.insertBefore(createRow(), row.nextElementSibling);
    });
    row.appendChild(addRowBtn);

    // up button
    const upBtn = document.createElement("button");
    upBtn.innerHTML = 'Up <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" style="fill: white;"><path d="M11 8.414V18h2V8.414l4.293 4.293 1.414-1.414L12 4.586l-6.707 6.707 1.414 1.414z"></path></svg>';
    upBtn.classList.add("up-btn");
    upBtn.classList.add("bkg-orange");
    upBtn.addEventListener("click", function() {
        row.parentElement.insertBefore(row, row.previousElementSibling);
    });
    row.appendChild(upBtn);
    
    // down button
    const downBtn = document.createElement("button");
    downBtn.innerHTML = 'Down <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" style="fill: white;"><path d="m18.707 12.707-1.414-1.414L13 15.586V6h-2v9.586l-4.293-4.293-1.414 1.414L12 19.414z"></path></svg>';
    downBtn.classList.add("down-btn");
    downBtn.classList.add("bkg-orange");
    downBtn.addEventListener("click", function() {
        row.parentElement.insertBefore(row.nextElementSibling, row);
    });
    row.appendChild(downBtn);

    return row;
}

function readBlogJson() {
    const blogJson = JSON.parse(jsonInput.value);
    heading.value = blogJson["heading"];
    description.value = blogJson["desc"];
    keywords.value = blogJson["keywords"];
    date.value = blogJson["publishedOn"].date;
    dateTime.value = blogJson["publishedOn"].dateTime;
    
    if(blogJson["prevBlog"]) {
        prevBlogSlug.value = blogJson["prevBlog"].slug;
        prevBlogTitle.value = blogJson["prevBlog"].title;
    }

    if(blogJson["nextBlog"]) {
        nextBlogSlug.value = blogJson["nextBlog"].slug;
        nextBlogTitle.value = blogJson["nextBlog"].title;
    }

    const postContentData = blogJson["postContent"];
    for(let row = 0 ; row < postContentData.length ; row++) {
        for(let tag in postContentData[row]) {
            if(tag === "ul") {
                const listItems = postContentData[row][tag];
                for(let j = 0 ; j < listItems.length ; j++) {
                    addContentRow(tag, listItems[j]);
                }
            } else {
                addContentRow(tag, postContentData[row][tag]);
            }
        }
    }
}