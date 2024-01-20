const crawlButton = document.getElementById('crawlButton');
crawlButton.addEventListener('click', function(e) {
  const url = document.getElementById('inputUrl').value;
  fetch('/crawl', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
    })
    .then(function(response) {
      if(response.ok) {
        return;
      }
      throw new Error('Request failed.');
    })
    .catch(function(error) {
      console.log(error);
    });
});

const queryButton = document.getElementById('queryButton');
queryButton.addEventListener('click', function(e) {
  const query = document.getElementById('inputQuery').value;
  fetch('/query', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
    })
    .then(function(response) {
      if(response.ok) {
        return;
      }
      throw new Error('Request failed.');
    })
    .catch(function(error) {
      console.log(error);
    });
});
