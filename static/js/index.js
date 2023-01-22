let date = new Date();
let hours = date.getHours();
let msg = "";
if (hours >= 3 && hours < 11) msg = "Good morning";
else if (hours >= 11 && hours < 16) msg = "Good afternoon";
else if (hours >= 16 && hours < 21) msg = "Good evening";
else msg = "Hi";

var x = document.getElementById("greeting");
x.innerText = msg;

function enableAddTasks() {
    $("#task-add-button").click(function (e) {
        let task = $("#newTask").val();
        if (task.length === 0) return;
        $.ajax({
            url: "addTask",
            type: "POST",
            data: JSON.stringify({ task: task }),
            dataType: "json",
            contentType: "application/json",
            success: function (res) {
                let new_row =
                    '<div class="checkbox-animated"><input class="checkbox-input" id="' +
                    res["id"] +
                    '" type="checkbox"><label for="' +
                    res["id"] +
                    '"><span class="check"></span><span class="box"></span>' +
                    task +
                    "</label></div>";
                $("#tasks-section").append(new_row);
                hideForm();
            },
        });
    });
}

function enableLabelClick() {
    $(document).on("click", "label", function () {
        $(this).toggleClass("strike");
        let id = $(this).attr("for");
        
        setTimeout(() => {
            $(this).hide();
            $.ajax({
                url: "markCompleted",
                type: "POST",
                data: JSON.stringify({ id: id }),
                dataType: "json",
                contentType: "application/json",
                success: function (res) {
                    
                    document.getElementById(id).parentElement.remove();
                    
                    setTimeout(() => {
                        checkEmptyList();
                    }, 100);
                },
            });
        }, 1000);
    });
}

function checkEmptyList() {
    if (document.getElementById("tasks-section").children.length === 0) {
        $("#no-task-indicator").show();
    } else {
        $("#no-task-indicator").hide();
    }
}

function showForm() {
    $("[data-toggle='tooltip']").tooltip("hide");
    $("#no-task-indicator").hide();
    $("#my-form").show(() => {
        $("#newTask").focus();
    });
    $(".task-buttons").prop("disabled", true);
}

function hideForm() {
    $("#my-form").hide(() => {
        $("#newTask").val("");
    });
    $(".task-buttons").prop("disabled", false);
    checkEmptyList();
    $('[data-toggle="tooltip"]').tooltip({ trigger: "hover" });
}

function clearAllTasks() {
    $("label").addClass("strike");
    let input = document.getElementsByClassName("checkbox-input");
    if (input.length > 0) {
        for (var i = 0; i < input.length; i++) {
            input[i].checked = true;
        }
        setTimeout(() => {
            $.ajax({
                url: "markAllCompleted",
                type: "POST",
                success: function () {
                    $("label").hide();
                    document.getElementById("tasks-section").innerHTML = "";
                    checkEmptyList();
                },
            });
        }, 1000);
    }
}

$(document).ready(function () {
    $(function () {
        $('[data-toggle="tooltip"]').tooltip({ trigger: "hover" });
    });
    enableAddTasks();
    enableLabelClick();
    checkEmptyList();
    
});
