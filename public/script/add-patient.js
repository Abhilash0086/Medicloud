const addcta = document.querySelector(".addcta");
const box = document.querySelector(".box");
const cancelbtn = document.querySelector(".cancelbtn");

addcta.addEventListener("click",() =>{
    box.style.display = "flex";
});

cancelbtn.addEventListener("click", () => {
    box.style.display = "none";
});