//Make AJAX call to get all scraped data from the BSON 

$(()=>{

    // $.getJSON("/all", (data)=> {
    //     console.log("this is data",data);
    //     for (let i = 0 ; i < data.length; i++){
    //         link.push(dbArticle.data[i].link)
    //         $("#results").append(
    //             `
    //            <tr><td>${data[i].title}</td></tr>
    //            <tr><td>${data[i].link}</td></tr>
    //            <tr><td><button class="saveBtn" data-title="${data[i].title}"  data-link="${data[i].link}">Save</button></td></tr>
    //             `
    //         )
    //     }
    // });
   

$(document).on('click', ".saveBtn", function(){
    $('#notes').empty();
    var thisId = $(this).attr('data-id');
    console.log('getting article id :'+thisId);

    $.ajax({
        method: "PUT",
        url: "/all/" + thisId,
      data: {saved: true}
    })
    .then((data)=>{
        console.log('inside the ajax call app.js' + data)
      //   $('#notes').append("<h2>" + data.title + "</h2>");
      //   $("#notes").append("<input id='titleinput' name='title' >");
      //   $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
      // $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");
      // if (data.note) {
      //   $("#titleinput").val(data.note.title);
      //   $("#bodyinput").val(data.note.body);
      // }
    })
})


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






