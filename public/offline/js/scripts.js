(function() {

    const online = document.querySelector("#online");

    // aplikacja odzyskuje połączenie z Internetem
    window.addEventListener("online", () => {
        online.style.display = "block";
    }, false);

})();