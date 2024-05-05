var server_ip = "localhost";
function uploadImage() {
    var fileInput = document.getElementById('file-input');
    var file = fileInput.files[0];

    var formData = new FormData();
    formData.append('image', file);

    $.ajax({
        url: "http://" + server_ip + ":3000/upload_content",
        type: "POST",
        data: formData,
        processData: false,
        contentType: false,
        success: function (data) {
            console.log("Response: ", data);
            var filename = data.filename;
            var move_edit = new Object();
            move_edit.original = 'upload_content/'+filename;
            $.ajax({
                url: "http://" + server_ip + ":3000/move_edit",
                type: "GET",
                contentType: "application/json",
                data: move_edit,
            }).done(function (data) {
                setTimeout(() => {
                    window.location.href = 'editor.html';
                }, 1000);
            });
        },
        error: function (xhr, status, error) {
            console.error("Upload failed: ", error);
        }
    });
}

function confirmsearch() {
    var textInput = document.getElementById('text-input').value;
    var search_content = new Object();
    search_content.keyword = textInput;
    search_content.method = 'content';
    $.ajax({
        url: "http://" + server_ip + ":3000/search_content",
        type: "GET",
        contentType: "application/json",
        data: search_content,
    }).done(function (data) {
        console.log("received data", data);
        var valid = data.valid;
        // var response = data.response;
        if (valid == 1){
            alert("Google API error. Please wait and try again later.");
        }
        else {
            var imageBoxes = document.getElementById('image-boxes');
            imageBoxes.innerHTML = '';
            imageBoxes.classList.add('row');
            for (let i = 1; i < 6; i++) {
                var imageBox = document.createElement('div');
                imageBox.classList.add('col-md-2', 'image-box');
        
                var image = document.createElement('img');
                var timestamp = new Date().getTime();
                image.src = '../images/google_content/' +i+'.jpg?' + timestamp;
                image.classList.add('img-fluid');
                imageBox.appendChild(image);

                var checkbox = document.createElement('input');
                checkbox.type = 'radio';
                checkbox.className = 'form-check-input';
                checkbox.name = 'search_content_select';
                checkbox.value = "google_content/"+ i+".jpg";
                checkbox.classList.add('form-check-input', 'mt-2');
                imageBox.appendChild(checkbox);
                
                imageBoxes.appendChild(imageBox);
            }
            var check_button = document.getElementById('select_content btn');
            check_button.style.display = 'block';
        }
    });
    console.log('Search keyword: ', textInput);
}

function confirmSelection() {
    var selectedRadio = $('input[name="search_content_select"]:checked');
    var selectedValue = selectedRadio.val();
    if (selectedValue == undefined){
        alert("You haven't select any images!");
    }
    else {
        console.log('Image selected: ', selectedValue);
        var move_edit = new Object();
        move_edit.original = selectedValue;
        $.ajax({
            url: "http://" + server_ip + ":3000/move_edit",
            type: "GET",
            contentType: "application/json",
            data: move_edit,
        }).done(function (data) {
            setTimeout(() => {
                window.location.href = 'editor.html';
            }, 1000);
        });
        
    }
}