/*Animated actions*/
const respBtns = document.querySelectorAll(".responsive-btn");
const stylesM = document.querySelector("#styles_m");
const stylesD = document.querySelector("#styles_d");

respBtns.forEach(el => {
    const iconEl = el.children[0];
    const spanEl = el.children[1];
    /*CLICK */
    el.addEventListener("click", function () {
        //Change icon
        for (let btn of respBtns) {
            btn.classList.toggle("hidden");
            btn.classList.toggle("flexible");
        }
        //add/remove responsive
        if (!iconEl.classList.contains("fa-desktop")) {
            stylesD.insertAdjacentElement('afterend', stylesM);
        } else {
            stylesM.parentNode.removeChild(stylesM);
        }
    });

    /*ANIMATIONS */
    el.addEventListener("mouseover", function () {
        spanEl.className = "";
        spanEl.classList.toggle("bounce-in-left");
        iconEl.classList.remove("flip-scale-2-ver-right");

        setTimeout(() => {
            iconEl.classList.add("flip-scale-2-ver-right");
        }, 600);
    });

    el.addEventListener("mouseout", () => {
        setTimeout(() => {
            spanEl.className = "";
            spanEl.classList.toggle("roll-out-right");
        }, 1000);
    });
});

/*Dropdown menu*/
const dropDownBtn = document.querySelector(".drop-down-menu-btn");
const closeDropDown = document.querySelector(".drop-down-menu-close");
const dropDownMenu = document.querySelector(".drop-down-menu");

dropDownBtn.addEventListener("mouseover", () => {
    dropDownMenu.style.display = 'block';
    dropDownMenu.classList.remove("slide-out-bottom");
    dropDownMenu.classList.add("scale-in-hor-right");
});

closeDropDown.addEventListener("click", () => {
    dropDownMenu.classList.toggle("scale-in-hor-right");
    dropDownMenu.classList.toggle("slide-out-bottom");
    setTimeout(() => {
        dropDownMenu.style.display = 'none';
    }, 1000);
});