console.log('radio check!!')
//Make AJAX call to get all scraped data from the BSON 

$(()=>{


// function grabData(){
//     $.getJSON("/scraped", (data)=> {
//         console.log(data);
    
//         for (let i = 0 ; i < data.length; i++){

//             $("#results").append(
//                 `
//                <tr><td>${data[i].title}</td></tr>
//                <tr><td>${data[i].link}</td></tr>
//                <tr><td><button class="saveBtn" data-title="${data[i].title}"  data-link="${data[i].link}">Save</button></td></tr>
//                 `
//             )
//         }
//     });
// }

// //grab data with grabdata button 
// $("#grabBtn").click(()=>{
//     alert("Grab Button Clicked")
//     grabData();
// });

$(document).on('click', ".saveBtn", function(){
    $('#notes').empty();
    var thisID = $(this).attr('data-id');

    $.ajax({
        method: "GET",
        url: "/articles/"+thisId
    })
    .then((data)=>{
        console.log('inside the ajax call app.js' + data)
        $('#notes').append("<h2>" + data.title + "</h2>");
        $("#notes").append("<input id='titleinput' name='title' >");
        $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
      $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");
      if (data.note) {
        $("#titleinput").val(data.note.title);
        $("#bodyinput").val(data.note.body);
      }
    })
})


$(document).on("click", "#saveNote", function() {
    var thisId = $(this).attr("data-id");
  
    $.ajax({
      method: "POST",
      url: "/articles/" + thisId,
      data: {
        title: $("#titleinput").val(),
        body: $("#bodyinput").val()
      }
    })
      .then(function(data) {
        console.log(data);
        $("#notes").empty();
      });
  
    $("#titleinput").val("");
    $("#bodyinput").val("");
  });



});//End OF document.ready()






