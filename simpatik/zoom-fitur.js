// zoom-fitur.js
document.addEventListener("DOMContentLoaded", function() {
    // 1. Buat elemen modal secara otomatis
    const modal = document.createElement("div");
    modal.className = "image-modal";
    modal.innerHTML = `
        <span class="image-modal-close">&times;</span>
        <img class="image-modal-content" id="zoomedImgSrc">
    `;
    document.body.appendChild(modal);

    const closeBtn = modal.querySelector(".image-modal-close");
    const modalImg = document.getElementById("zoomedImgSrc");

    // 2. Event listener untuk buka modal
    document.addEventListener("click", function(e) {
        if (e.target.classList.contains("img-soal")) {
            modal.style.display = "flex";
            modalImg.src = e.target.src;
        }
    });

    // 3. Event listener untuk tutup modal
    closeBtn.onclick = () => modal.style.display = "none";
    modal.onclick = (e) => { if(e.target !== modalImg) modal.style.display = "none"; };
});
