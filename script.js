function openModal(title, price, imageSrc, desc) {
    
    var modal = document.getElementById("productModal");
    
    document.getElementById("m-title").innerText = title;
    document.getElementById("m-price").innerText = price;
    document.getElementById("m-img").src = imageSrc;
    document.getElementById("m-desc").innerText = desc;

    modal.style.display = "flex";
}

function closeModal() {
    var modal = document.getElementById("productModal");
    modal.style.display = "none";
}

window.onclick = function(event) {
    var modal = document.getElementById("productModal");
    if (event.target == modal) {
        modal.style.display = "none";
    }

}
