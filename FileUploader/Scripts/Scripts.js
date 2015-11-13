var FileModel = function (Ufiles) {
    var self = this;
    self.Ufiles = ko.observableArray(Ufiles);
    
    self.addFile = function () {
        self.Ufiles.push({
            name: "",
            created: ""
        });
    };

    self.removeFile = function (Ufile) {
        self.Ufiles.remove(Ufile);
    };

    self.save = function (form) {
        alert("Could now transmit to server: " + ko.utils.stringifyJson(self.Ufiles));
        // To actually transmit to server as a regular form post, write this: ko.utils.postJson($("form")[0], self.gifts);
        ko.utils.postJson($("form")[0], self.gifts);
    };
};

var viewModelFiles = new FileModel([
    { name: "Test File 1", created: "ABC" },
    { name: "Test File 2", created: "XYZ" }
]);
ko.applyBindings(viewModelFiles, document.getElementById('pnlFile'));


function dragEnter(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    $(evt.target).addClass('over');
}

function dragLeave(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    $(evt.target).removeClass('over');
}

$('#ulbox').on("dragover", function (e) {
    e.preventDefault();
});
var files;

function drop(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    $(evt.target).removeClass('over');

    files = evt.originalEvent.dataTransfer.files;

    if (files.length > 0) {
        for (i = 0; i < files.length; i++) {
//            $('#fileAttr').text(files[i].name);
            //            data.append("file" + i, files[i]);
            debugger;
            viewModelFiles.addFile({ name: files[i].name, created: files[i].lastModifiedDate });
        }
    }
}

function uploadFiles()
{
    alert(files[0].name + files[0].lastModifiedDate);

    if (files.length > 0) {
        if (window.FormData !== undefined) {
            var data = new FormData();
            for (i = 0; i < files.length; i++) {
                //console.log(files[i]);
                //viewModelFiles.addFile({ name: files[i].name, created: files[i].lastModifiedDate });
                data.append("file" + i, files[i]);
            }
            //append batch 
            data.append("batch", $('#sel1').val());
            //append comments
            data.append("comment", $('#comment').val());
            $.ajax({
                type: "POST",
                url: "/api/file",
                contentType: false,
                processData: false,
                data: data,
                success: function (res) {
                    $.each(res, function (i, item) {
                        viewModel.uploads.push(item);
                    });
                }
            });
        } else {
            alert("your browser does not support formData! Please upgrade");
        }
    }
    else {
        alert("Please upload atleast one file.");
    }

}

$(document).ready(function () {

    var $box = $('#ulbox');
    $box.bind("dragenter", dragEnter);
    $box.bind("dragexit", dragLeave);
    $box.bind("drop", drop);



});

// This is a simple *viewmodel* - JavaScript that defines the data and behavior of your UI
function AppViewModel() {
    this.firstName = "Bert";
    this.lastName = "Bertington";
}

// Activates knockout.js
ko.applyBindings(new AppViewModel(),document.getElementById('divTest'));