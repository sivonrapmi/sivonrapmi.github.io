/* =========================================================
   RESPONSIVE MENU
   ========================================================= */

function myFunction() {
  var x = document.getElementById("myTopnav");

  x.classList.toggle("responsive");
}


/* =========================================================
   LOAD NAVIGATION
   ========================================================= */

fetch("nav.html")
  .then(function(response) {

    if (!response.ok) {
      throw new Error(
        "Failed to load nav: " + response.status
      );
    }

    return response.text();
  })

  .then(function(navHTML) {

    var placeholder =
      document.getElementById("navbar-placeholder");

    if (placeholder) {
      placeholder.innerHTML = navHTML;
    }

  })

  .catch(function(error) {

    console.error(
      "Error loading navigation:",
      error
    );

  });
