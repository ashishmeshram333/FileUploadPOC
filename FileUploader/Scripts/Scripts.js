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
        alert("Could now transmit to server: " + ko.utils.stringifyJson(self.gifts));
        // To actually transmit to server as a regular form post, write this: ko.utils.postJson($("form")[0], self.gifts);
    };
};

var viewModelFiles = new FileModel([
    { name: "Test File 1", created: "ABC" },
    { name: "Test File 2", created: "XYZ" }
]);


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
        }
    }
}

function uploadFiles()
{

    if (files.length > 0) {
        if (window.FormData !== undefined) {
            var data = new FormData();
            for (i = 0; i < files.length; i++) {
                //console.log(files[i]);
                data.append("file" + i, files[i]);
            }

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

}

$(document).ready(function () {
    var $box = $('#ulbox');
    $box.bind("dragenter", dragEnter);
    $box.bind("dragexit", dragLeave);
    $box.bind("drop", drop);
    ko.applyBindings(viewModelFiles);


});