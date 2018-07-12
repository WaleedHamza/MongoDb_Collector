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
        url: "/all/" + thisId,
        data: {saved: true }
    })
    .then((data)=>{
        console.log('inside the ajax call app.js' + data)

    })
});

$(document).on('click', ".deleteNoteBtn", function(){
    var thisId = $(this).attr('data-id');
    console.log('getting article id :'+thisId);

    $.ajax({
        method: "POST",
        url: "/all/" + thisId,
        data: {saved: false }
    })
    .then((data)=>{
        console.log('inside the ajax call app.js' + data)

    })
});


$(document).on("click", ".saveNote", function(data) {
    var thisId = $(this).attr("data-id");
  console.log("savedbtn clicked", thisId)
    $.ajax({
      method: "POST",
      url: "/notes",
      data: {
          noteId: thisId,
        // noteTitle: $("#titleInput").val(),
        note: $("#bodyInput").val()
      }
    })
      .then(function(data) {
          console.log("after the ajax call",data)
          $("#bodyInput").empty();
      });
  
    $("#bodyInput").empty();
  });



  $(document).on('click', ".addNoteBtn", function(){
    var thisId = $(this).attr('data-id');
    console.log('getting article id :'+thisId);

    $.ajax({
        method: "GET",
        url: "/all/" + thisId
    })
    .then((data)=>{
        console.log('inside the ajax call app.js' + JSON.stringify(data) )
        // res.render("")
    })
});



});//end of document.ready()