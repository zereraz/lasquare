$(document).ready(function(){
    $('form').submit(function(e){
        var userName = $('#username').val();
        var room = $('#room').val();
        if(userName.length == 0 || room.length == 0){
            alert("Both fields need to be filled");
            e.preventDefault();
        }
    });
});
