const headerContainer = document.getElementById("header-container");
  
function swapContainer() {
    const width = window.innerWidth;
    
    if (width >= 1400) {
    headerContainer.classList.remove("container-fluid");
    headerContainer.classList.add("container");
    } else {
    headerContainer.classList.remove("container");
    headerContainer.classList.add("container-fluid");
    }
}

window.addEventListener("resize", swapContainer);

swapContainer();