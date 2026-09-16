 //responsive menu script
function myFunction() {
  var x = document.getElementById("myTopnav");
  if (x.className === "topnav") {
    x.className += " responsive";
  } else {
    x.className = "topnav";
  }
}
//responsive menu script end


// Add this at the end of the <body> in index.html, about.html, etc. 
  // Fetch the navigation component
  fetch('nav.html')
    .then(response => {
      // Check if the request was successful
      if (!response.ok) {
        throw new Error(`Failed to load nav: ${response.status}`);
      }
      return response.text(); // Convert response to text
    })
    .then(navHTML => {
      // Insert the navigation HTML into the placeholder
      document.getElementById('navbar-placeholder').innerHTML = navHTML;
    })
    .catch(error => {
      // Log errors (e.g., if nav.html is missing)
      console.error('Error loading navigation:', error);
    });
