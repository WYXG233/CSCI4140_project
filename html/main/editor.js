var server_ip = "localhost";
function draw_Image() {
    var canvas = document.getElementById('original_canvas');
    var ctx = canvas.getContext('2d');
    
    var image = new Image();
    
    image.onload = function() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        var maxWidth = canvas.width;
        var maxHeight = canvas.height;
    
        let width = image.width;
        let height = image.height;
    
        if (width > maxWidth || height > maxHeight) {
            var scale = Math.min(maxWidth / width, maxHeight / height);
            width *= scale;
            height *= scale;
        }
    
        ctx.drawImage(image, 0, 0, width, height);
        var canvas_e = document.getElementById('edit_canvas');
        var ctx_e = canvas_e.getContext('2d');
        ctx_e.drawImage(canvas, 0, 0);
    };
    var timestamp = new Date().getTime();
    image.src = '../images/editing/1.jpg?' + timestamp;
    console.log("draw editing image");
}

function uploadImage() {
    var fileInput = document.getElementById('file-input');
    var file = fileInput.files[0];

    var formData = new FormData();
    formData.append('image', file);

    $.ajax({
        url: "http://" + server_ip + ":3000/upload_style",
        type: "POST",
        data: formData,
        processData: false,
        contentType: false,
        success: function (data) {
            var imageBoxes = document.getElementById('image-boxes-upload-style');
            if (imageBoxes) {
                while (imageBoxes.firstChild) {
                    imageBoxes.removeChild(imageBoxes.firstChild);
                }
            }
            imageBoxes.classList.add('row');
            var imageBox = document.createElement('div');
            imageBox.classList.add('col-md-2', 'image-box');

            var image = document.createElement('img');
            var timestamp = new Date().getTime();
            image.src = '../images/upload_style/1.jpg?' + timestamp;
            image.classList.add('img-fluid');
            imageBox.appendChild(image);

            var checkbox = document.createElement('input');
            checkbox.type = 'radio';
            checkbox.className = 'form-check-input';
            checkbox.name = 'style_select';
            checkbox.value = 'upload_style/1.jpg';
            checkbox.classList.add('form-check-input', 'mt-2');
            imageBox.appendChild(checkbox);
            
            imageBoxes.appendChild(imageBox);
        }
    });
}

function confirmstyle() {
    var selectedRadio = $('input[name="style_select"]:checked');
    var selectedValue = selectedRadio.val();
    if (selectedValue == undefined){
        alert("You haven't select any style image!");
    }
    else {
        console.log('Image selected: ', selectedValue);
        var style_transfer = new Object();
        style_transfer.style = selectedValue;

        $.ajax({
            url: "http://" + server_ip + ":3000/style_transfer",
            type: "GET",
            contentType: "application/json",
            data: style_transfer,
        }).done(function (data) {
            var valid = data.valid;
            var message = data.message;
            if (valid == 1){
                alert("Error: " + message);
            }
            else {
                var canvas = document.getElementById('edit_canvas');
                var ctx = canvas.getContext('2d');
                
                var image = new Image();
                
                image.onload = function() {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    var maxWidth = canvas.width;
                    var maxHeight = canvas.height;
                
                    let width = image.width;
                    let height = image.height;
                
                    if (width > maxWidth || height > maxHeight) {
                        var scale = Math.min(maxWidth / width, maxHeight / height);
                        width *= scale;
                        height *= scale;
                    }
                
                    ctx.drawImage(image, 0, 0, width, height);
                };
                var timestamp = new Date().getTime();
                image.src = '../images/tmp/1.jpg?' + timestamp;
            }
        });
    }
}

function generatedownload() {
    var image = new Image();
    image.onload = function() {
        var canvas = document.getElementById('edit_canvas');
        var ctx = canvas.getContext('2d');
        var maxWidth = canvas.width;
        var maxHeight = canvas.height;
    
        let width = image.width;
        let height = image.height;
    
        if (width > maxWidth || height > maxHeight) {
            var scale = Math.min(maxWidth / width, maxHeight / height);
            width *= scale;
            height *= scale;
        }

        var tempCanvas = document.createElement('canvas');
        // var tempCanvas = document.getElementById('tmp_canvas');
        tempCanvas.width = width;
        tempCanvas.height = height;
        var tempCtx = tempCanvas.getContext('2d');

        var imageData = ctx.getImageData(0, 0, width, height);

        tempCtx.putImageData(imageData, 0, 0);

        var originalCanvas = document.createElement('canvas');
        // var originalCanvas = document.getElementById('tmp_canvas');
        originalCanvas.width = image.width;
        originalCanvas.height = image.height;
        var originalCtx = originalCanvas.getContext('2d');
        originalCtx.drawImage(
            tempCanvas,
            0,
            0,
            width,
            height,
            0,
            0,
            originalCanvas.width,
            originalCanvas.height
        );
        setTimeout(function() {
            let a  = document.createElement('a');
            a.href = originalCanvas.toDataURL('image/jpeg');
            a.download = 'csci_4140_editor_image.jpg';
            a.click();
        }.bind(this), 300);
        
    };
    var timestamp = new Date().getTime();
    image.src = '../images/editing/1.jpg?' + timestamp;
}

function returntomain() {
    location.href = "index.html";
}

function object_detect() {
    var textInput = document.getElementById('text-input').value.toLowerCase();
    var detect_content = new Object();
    detect_content.object_name = textInput;

    $.ajax({
        url: "http://" + server_ip + ":3000/object_detection",
        type: "GET",
        contentType: "application/json",
        data: detect_content,
    }).done(function (data) {
        var valid = data.valid;
        var message = data.message;
        if (valid == 1){
            alert("Error: " + message);
        }
        else {
            var isexist = parseInt(data.isexist);
            if (isexist == 0){
                var object_list = data.uniqueContent;
                alert("Target element not found. Ojects found: " + object_list);
            }
            else {
                var imageBoxes = document.getElementById('image-boxes-object');
                if (imageBoxes) {
                    while (imageBoxes.firstChild) {
                        imageBoxes.removeChild(imageBoxes.firstChild);
                    }
                }
                imageBoxes.classList.add('row');
                for (let i = 1; i <= isexist; i++) {
                    var imageBox = document.createElement('div');
                    imageBox.classList.add('col-md-2', 'image-box');

                    var image = document.createElement('img');
                    var timestamp = new Date().getTime();
                    image.src = '../images/detected/' + textInput + '_' + i + '.jpg?' + timestamp;
                    image.classList.add('img-fluid');
                    imageBox.appendChild(image);

                    var checkbox = document.createElement('input');
                    checkbox.type = 'radio';
                    checkbox.className = 'form-check-input';
                    checkbox.name = 'object_select';
                    checkbox.value = 'detected/' + textInput + '_' + i + '.jpg';
                    checkbox.classList.add('form-check-input', 'mt-2');
                    imageBox.appendChild(checkbox);
                    
                    imageBoxes.appendChild(imageBox);
                }
                var check_button = document.getElementById('object_btns');
                check_button.style.display = 'block';
            }
        }
    });
}

function restartediting(){
    var canvas = document.getElementById('original_canvas');
    var canvas_e = document.getElementById('edit_canvas');
    var ctx_e = canvas_e.getContext('2d');
    ctx_e.drawImage(canvas, 0, 0);
}

function object_style() {
    var contentRadio = $('input[name="object_select"]:checked');
    var contentValue = contentRadio.val();
    if (contentValue == undefined){
        alert("You haven't select any object image!");
    }
    else {
        var styleRadio = $('input[name="style_select"]:checked');
        var styleValue = styleRadio.val();
        if (styleValue == undefined){
            alert("You haven't select any style image!");
        }
        else {
            var style_transfer = new Object();
            style_transfer.content = contentValue;
            style_transfer.style = styleValue;

            $.ajax({
                url: "http://" + server_ip + ":3000/object_transfer",
                type: "GET",
                contentType: "application/json",
                data: style_transfer,
            }).done(function (data) {
                console.log("received data", data);
                var valid = data.valid;
                var message = data.message;
                if (valid == 1){
                    alert("Error: " + message);
                }
                else {
                    var canvas = document.getElementById('show_canvas');
                    var ctx = canvas.getContext('2d');
                    
                    var image = new Image();
                    
                    image.onload = function() {
                        ctx.clearRect(0, 0, canvas.width, canvas.height);
                        var maxWidth = canvas.width;
                        var maxHeight = canvas.height;
                    
                        let width = image.width;
                        let height = image.height;
                    
                        if (width > maxWidth || height > maxHeight) {
                            var scale = Math.min(maxWidth / width, maxHeight / height);
                            width *= scale;
                            height *= scale;
                        }
                        ctx.drawImage(image, 0, 0, width, height);
                    };
                    var timestamp = new Date().getTime();
                    image.src = '../images/tmp_o/1.jpg?' + timestamp;
                    var check_button = document.getElementById('object_style');
                    check_button.style.display = 'block';
                }
            });
        }
    }
}

function object_caman() {
    var selectedRadio = $('input[name="object_select"]:checked');
    var selectedValue = selectedRadio.val();
    if (selectedValue == undefined){
        alert("You haven't select any object image!");
    }
    else {
        var canvas = document.getElementById('object_canvas');
        
        
        var image = new Image();
        
        image.onload = function() {
            let width = image.width;
            let height = image.height;
            canvas.width = width;
            canvas.height = height;

            var ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(image, 0, 0, width, height);
        };
        var timestamp = new Date().getTime();
        image.src = '../images/' + selectedValue + '?' + timestamp;
        var check_button = document.getElementById('object_caman');
        check_button.style.display = 'block';
    }
}

function generate_built_style() {
    var imageBoxes = document.getElementById('image-boxes-built');
    if (imageBoxes) {
        while (imageBoxes.firstChild) {
            imageBoxes.removeChild(imageBoxes.firstChild);
        }
    }
    imageBoxes.classList.add('row');
    var image_name = ['Starry_Night', 'Spring', 'The_Scream'];
    for (let i = 0; i < 3; i++) {
        var imageBox = document.createElement('div');
        imageBox.classList.add('col-md-2', 'image-box');

        var title = document.createElement('h5');
        title.innerText = image_name[i];
        title.className = 'centered-title';
        imageBox.appendChild(title);

        var image = document.createElement('img');
        var timestamp = new Date().getTime();
        image.src = '../images/style/' + image_name[i] + '.jpg?' + timestamp;
        image.classList.add('img-fluid');
        imageBox.appendChild(image);

        var checkbox = document.createElement('input');
        checkbox.type = 'radio';
        checkbox.className = 'form-check-input';
        checkbox.name = 'style_select';
        checkbox.value = 'style/'+image_name[i] + '.jpg';
        checkbox.classList.add('form-check-input', 'mt-2');
        imageBox.appendChild(checkbox);
        
        imageBoxes.appendChild(imageBox);
    }
}

function confirmsearch() {
    var textInput = document.getElementById('text-input-1').value;
    var search_content = new Object();
    search_content.keyword = textInput;
    search_content.method = 'style';
    console.log('Search keyword: ', textInput);
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
            alert("invalid input");
        }
        else {
            var imageBoxes = document.getElementById('image-boxes');
            if (imageBoxes) {
                while (imageBoxes.firstChild) {
                    imageBoxes.removeChild(imageBoxes.firstChild);
                }
            }
            imageBoxes.classList.add('row');
            for (let i = 1; i < 6; i++) {
                var imageBox = document.createElement('div');
                imageBox.classList.add('col-md-2', 'image-box');
        
                var image = document.createElement('img');
                var timestamp = new Date().getTime();
                image.src = '../images/google_style/' +i+'.jpg?' + timestamp;
                image.classList.add('img-fluid');
                imageBox.appendChild(image);

                var checkbox = document.createElement('input');
                checkbox.type = 'radio';
                checkbox.className = 'form-check-input';
                checkbox.name = 'style_select';
                checkbox.value = 'google_style/' + i+".jpg";
                checkbox.classList.add('form-check-input', 'mt-2');
                imageBox.appendChild(checkbox);
                
                imageBoxes.appendChild(imageBox);
            }
        }
    });
}

function object_style_done() {
    var selectedRadio = $('input[name="object_select"]:checked');
    var selectedValue = selectedRadio.val();
    var combine_objecct = new Object();
    combine_objecct.target = 'tmp_o/1.jpg';
    combine_objecct.bg = 'editing/1.jpg';
    combine_objecct.original = selectedValue;
    $.ajax({
        url: "http://" + server_ip + ":3000/combine_object",
        type: "GET",
        contentType: "application/json",
        data: combine_objecct,
    }).done(function (data) {
        console.log("received data", data);
        var valid = data.valid;
        var message = data.message;
        if (valid == 1){
            alert("Error: " + message);
        }
        else {
            var canvas = document.getElementById('edit_canvas');
            var ctx = canvas.getContext('2d');
            
            var image = new Image();
            
            image.onload = function() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                var maxWidth = canvas.width;
                var maxHeight = canvas.height;
            
                let width = image.width;
                let height = image.height;
            
                if (width > maxWidth || height > maxHeight) {
                    var scale = Math.min(maxWidth / width, maxHeight / height);
                    width *= scale;
                    height *= scale;
                }
                ctx.drawImage(image, 0, 0, width, height);
            };
            var timestamp = new Date().getTime();
            image.src = '../images/editing_combine/1.jpg?' + timestamp;
            var check_button = document.getElementById('object_style');
            check_button.style.display = 'none';
            var show_button = document.getElementById('object_btns');
            show_button.style.display = 'none';
        }
    });
}

function cancel_object() {
    var check_button = document.getElementById('object_btns');
    check_button.style.display = 'none';
}

function object_style_cancel() {
    var check_button = document.getElementById('object_style');
    check_button.style.display = 'none';
}

function object_caman_cancel() {
    var check_button = document.getElementById('object_caman');
    check_button.style.display = 'none';
}

function object_caman_done() {
    var canvas = document.getElementById('object_canvas');
    canvas.toBlob(function(blob) {
        var formData = new FormData();
        formData.append('canvasImage', blob, '1.jpg');
        $.ajax({
            url: "http://" + server_ip + ":3000/img_save",
            type: "POST",
            contentType: "application/json",
            dataType: 'json',
            data: formData,
            contentType:false,
            processData:false,
            success: function(data) {
                var valid = data.valid;
                var message = data.message;
                if (valid == 1){
                    alert("Error: " + message);
                }
                else {
                    var selectedRadio = $('input[name="object_select"]:checked');
                    var selectedValue = selectedRadio.val();
                    var combine_objecct = new Object();
                    combine_objecct.target = 'tmp_c/1.jpg';
                    combine_objecct.bg = 'editing/1.jpg';
                    combine_objecct.original = selectedValue;
                    $.ajax({
                        url: "http://" + server_ip + ":3000/combine_object",
                        type: "GET",
                        contentType: "application/json",
                        data: combine_objecct,
                    }).done(function (data) {
                        console.log("received data", data);
                        var valid = data.valid;
                        var message = data.message;
                        if (valid == 1){
                            alert("Error: " + message);
                        }
                        else {
                            var canvas = document.getElementById('edit_canvas');
                            var ctx = canvas.getContext('2d');
                            
                            var image = new Image();
                            
                            image.onload = function() {
                                ctx.clearRect(0, 0, canvas.width, canvas.height);
                                var maxWidth = canvas.width;
                                var maxHeight = canvas.height;
                            
                                let width = image.width;
                                let height = image.height;
                            
                                if (width > maxWidth || height > maxHeight) {
                                    var scale = Math.min(maxWidth / width, maxHeight / height);
                                    width *= scale;
                                    height *= scale;
                                }
                                ctx.drawImage(image, 0, 0, width, height);
                            };
                            var timestamp = new Date().getTime();
                            image.src = '../images/editing_combine/1.jpg?' + timestamp;
                            var check_button = document.getElementById('object_caman');
                            check_button.style.display = 'none';
                            var show_button = document.getElementById('object_btns');
                            show_button.style.display = 'none';
                        }
                    });
                }
            }
        });
    }, 'image/jpeg');
}

function applyFilters() {
    console.log("apply fliter");
    var brightness = parseInt($('#brightness').val());
    var cntrst = parseInt($('#contrast').val());
    var saturation = parseInt($('#saturation').val());
    Caman('#edit_canvas', function() {
        this.revert(false);
        this.brightness(brightness);
        this.contrast(cntrst);
        this.saturation(saturation);
        this.render();
    });
}

function applyFilters_o() {
    console.log("apply fliter");
    var brightness = parseInt($('#brightness_o').val());
    var cntrst = parseInt($('#contrast_o').val());
    var saturation = parseInt($('#saturation_o').val());
    Caman('#object_canvas', function() {
        this.revert(false);
        this.brightness(brightness);
        this.contrast(cntrst);
        this.saturation(saturation);
        this.render();
    });
}

$(document).ready(function() {
    draw_Image();
    generate_built_style();

    $('#resetbtn').click(function() {
        $('input[type=range][name=edit]').val(0);
        Caman('#edit_canvas', function() {
            this.revert();
            this.render();
        });
    });

    $('#resetbtn_o').click(function() {
        $('input[type=range][name=object]').val(0);
        Caman('#object_canvas', function() {
            this.revert();
            this.render();
        });
    });

    $('#noisebtn').click(function() {
        Caman('#edit_canvas', function() {
            this.noise(10).render();
        });
    });

    $('#noisebtn_o').click(function() {
        Caman('#object_canvas', function() {
            this.noise(10).render();
        });
    });

    $('#pinholebtn').click(function() {
        Caman('#edit_canvas', function() {
            this.pinhole().render();
        });
    });

    $('#pinholebtn_o').click(function() {
        Caman('#object_canvas', function() {
            this.pinhole().render();
        });
    });

    $('#oldpaperbtn').click(function() {
        Caman('#edit_canvas', function() {
            this.pinhole();
            this.noise(10);
            this.orangePeel();
            this.render();
        });
    });

    $('#oldpaperbtn_o').click(function() {
        Caman('#object_canvas', function() {
            this.pinhole();
            this.noise(10);
            this.orangePeel();
            this.render();
        });
    });

    $('#pleasantbtn').click(function() {
        Caman('#edit_canvas', function() {
            this.colorize(60, 105, 218, 10);
            this.contrast(10);
            this.sunrise();
            this.hazyDays();
            this.render();
        });
    });

    $('#pleasantbtn_o').click(function() {
        Caman('#object_canvas', function() {
            this.colorize(60, 105, 218, 10);
            this.contrast(10);
            this.sunrise();
            this.hazyDays();
            this.render();
        });
    });

    $('input[type=range][name=edit]').change(applyFilters);
    $('input[type=range][name=object]').change(applyFilters_o);
});
