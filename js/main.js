const anchorBackButton = document.getElementById("anchor-back-button");
let lastScrollPos = 0;

for(let anchor of document.getElementsByTagName("a")) {
    if(anchor.hash) {
        anchor.onclick = function() {
            lastScrollPos = window.scrollY;
            anchorBackButton.style.display = 'block';
        }
    }
}

anchorBackButton.onclick = function() {
    window.scrollTo(0, lastScrollPos);
    anchorBackButton.style.display = 'none';
}