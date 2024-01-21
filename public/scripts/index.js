const crawlButton = document.getElementById('crawlButton');
crawlButton.addEventListener('click', function(e) {
  const url = document.getElementById('inputUrl').value;
  $.ajax({
    method: "POST",
    url: "/crawl",
    contentType: 'application/json',
    data: JSON.stringify({ url })
  }).done(function( response ) {
    if(response) {
      $("#answer").html("Crawling successful.");
    }
  }).fail(function (xhr, textStatus, error) {
    $("#error").html("Something went wrong!");
    console.log(xhr.status);
    console.log(error);
  });
});

const queryButton = document.getElementById('queryButton');
queryButton.addEventListener('click', function(e) {
  const query = document.getElementById('inputQuery').value;
    $.ajax({
      method: "POST",
      url: "/query",
      contentType: 'application/json',
      data: JSON.stringify({ query })
    }).done(function( response ) {
      if(response) {
        $("#answer").html(response.data.text);
      }
    }).fail(function (xhr, textStatus, error) {
      $("#error").html("Something went wrong!");
      console.log(xhr.status);
      console.log(error);
    });
});

var $loading = $('.loader').hide();
$(document)
  .ajaxStart(function () {
    $loading.show();
  })
  .ajaxStop(function () {
    $loading.hide();
  });
