window.addEventListener("scroll", function () {
    toggleButtonVisibility();
});

// Toggle button visibility
function toggleButtonVisibility() {
    var button = document.getElementById("btn-to-top");
    if (window.scrollY > 20) {
        button.style.display = "block";
    } else {
        button.style.display = "none";
    }
}

// Smooth scroll to top
function scrollToTop() {
    var duration = 1000; // Adjust the duration as needed
    var start = window.scrollY;
    var startTime = performance.now();

    function easeInOutQuart(t) {
        return t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;
    }

    function scrollStep(timestamp) {
        var timeElapsed = timestamp - startTime;
        var progress = Math.min(timeElapsed / duration, 1);

        var easedProgress = easeInOutQuart(progress);

        window.scrollTo(0, start - start * easedProgress);

        if (timeElapsed < duration) {
            requestAnimationFrame(scrollStep);
        }
    }
    
    requestAnimationFrame(scrollStep);
}

