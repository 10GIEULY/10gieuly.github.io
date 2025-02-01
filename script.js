const yesBtn = document.querySelector(".yes-btn");
const noBtn = document.querySelector(".no-btn");
const question = document.querySelector(".question");
function showGif(gifUrl) {
    gif.src = gifUrl; // Définit l'URL du GIF
    gif.style.display = "block"; // Affiche le GIF
}



// Change text and hide the No button when the Yes button is clicked
yesBtn.addEventListener("click", () => {
    question.innerHTML = "HAHAHAHAHAHAHAAAAAAA Je suis trop fort, youpi youpi youpi !";
    noBtn.style.display = "none"; // Fait disparaître le bouton "Non"
    showGif("https://media.giphy.com/media/zrxazUScjhxo4/giphy.gif?cid=790b7611oqgmnom9fzs33o1zfk9xr6nqb74zav21dzsueuuk&ep=v1_gifs_search&rid=giphy.gif&ct=g")
});

// Make the No button move randomly on hover
noBtn.addEventListener("mouseover", () => {
    const wrapper = document.querySelector(".wrapper");
    const wrapperRect = wrapper.getBoundingClientRect();
    const noBtnRect = noBtn.getBoundingClientRect();

    // Calculate max positions to ensure the button stays within the wrapper
    const maxX = wrapperRect.width - noBtnRect.width;
    const maxY = wrapperRect.height - noBtnRect.height;

    // Generate random positions with a larger range
    const randomX = Math.floor(Math.random() * (maxX * 2)) - maxX / 2;
    const randomY = Math.floor(Math.random() * (maxY * 2)) - maxY / 2;

    // Ensure the button stays within the wrapper bounds
    const boundedX = Math.max(0, Math.min(randomX, maxX));
    const boundedY = Math.max(0, Math.min(randomY, maxY));

    noBtn.style.position = "absolute";
    noBtn.style.left = boundedX + "px";
    noBtn.style.top = boundedY + "px";
});
