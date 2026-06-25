let currentIndex = 0;

document.querySelector("#menu").addEventListener("click", () => {
    document.querySelector(".header").classList.toggle("open");
    document.querySelector(".fab").classList.toggle("open");
    document.querySelector(".container").classList.toggle("open");
    document.querySelector("#menu-burger").classList.toggle("open");
});

document.querySelector(".fab").addEventListener("click", () => {
    if (buttons[currentIndex][1] != "FORM") {
        window.location.href = buttons[currentIndex][1];
    } else {
        alert(
            "Спасибо за заявку! В ближайшее время с вами свяжется сотрудник банка.",
        );
    }
});

document.body.addEventListener("scroll", () => {
    let index = Math.round(
        document.body.scrollTop / document.body.clientHeight,
    );

    let offset =
        (document.body.scrollTop - currentIndex * document.body.clientHeight) *
        -0.7;
    let slide = document.querySelector(".container").children[currentIndex];

    slide.querySelector("h2").style.transform = "translateY(" + offset + "px)";
    if (slide.classList.contains("hero")) {
        slide.querySelector("p").style.transform =
            "translateY(" + offset + "px)";
    }

    if (index !== currentIndex) {
        currentIndex = index;
        document.querySelector(".fab p").innerHTML = buttons[currentIndex][0];
        document.querySelector(".fab p").style.color = colors[currentIndex];
        if (colors[currentIndex] == "black") {
            document.querySelector("#header-contents").style.filter =
                "invert(1)";
        } else {
            document.querySelector("#header-contents").style.filter =
                "invert(0)";
        }
    }
});
