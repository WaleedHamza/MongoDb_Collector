//Make AJAX call to get all scraped data from the BSON 

$(()=>{
//Bootstrap Modal Function
$('#myModal').on('shown.bs.modal', ()=> {
    $('#myInput').trigger('focus')
  });



$(document).on('click', ".saveBtn", function(){
    var thisId = $(this).attr('data-id');
    console.log('getting article id :'+thisId);

    $.ajax({
        method: "POST",
        // url: thisId,
        url: "/all/" + thisId,

        data: {
            // articleId: thisId,
            title: "Beginner Questions - June 15, 2018 (self.webdev)'" }

    })
    .then((data)=>{
        console.log('inside the ajax call app.js' + data)

    })
});


// $(document).on("click", "#saveNote", function() {
//     var thisId = $(this).attr("data-id");
  
//     $.ajax({
//       method: "POST",
//       url: "/articles/" + thisId,
//       data: {
//         title: $("#titleinput").val(),
//         body: $("#bodyinput").val()
//       }
//     })
//       .then(function(data) {
//         // console.log(data);
//         $("#notes").empty();
//       });
  
//     $("#titleinput").val("");
//     $("#bodyinput").val("");
//   });



});//end of document.ready()






