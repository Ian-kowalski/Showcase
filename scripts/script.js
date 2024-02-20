fetch("nav.html")
  .then(response => {
    return response.text()
  })
  .then(data => {
    document.querySelector("nav").innerHTML = data;
  }); 

  fetch("personalia.html")
  .then(response => {
    return response.text()
  })
  .then(data => {
    document.querySelector("personalia").innerHTML = data;
  }); 