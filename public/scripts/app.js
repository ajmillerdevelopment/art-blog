const addImagesForm = $('#add-images-btn');
const imgDiv = $('#image-urls');
let idCounter = 1;

function addImgForm() {
    imgDiv.append(`<label for="image${idCounter}">Image URL: </label>`)
    imgDiv.append(`<input type="text" name="images" id="image${idCounter}"><br>`);
    imgDiv.append(`<label for="caption${idCounter}">Caption: </label>`)
    imgDiv.append(`<input type="text" name="captions" id="caption${idCounter}"><br>`)
    idCounter +=1;
    console.log('Youre not crazy')
}

function sanityCheck() {
    console.log('Youre not crazy');
}

addImagesForm.on('click', addImgForm)