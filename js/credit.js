let buttons = [
    ["Оформить", "credit.html#order"],
    ["Оформить", "credit.html#order"],
    ["Оформить", "credit.html#order"],
    ["Оставить заявку", "FORM"],
    ["Скачать", "app.html"],
];
let colors = ["white", "white", "white", "black", "black"];

// Калькулятор кредитного лимита
(() => {
    const slider = document.getElementById("limit-slider");
    const limitValue = document.getElementById("limit-value");
    const minPay = document.getElementById("min-pay");
    const coffeeNote = document.getElementById("coffee-note");
    if (!slider) return;

    const COFFEE_PRICE = 500; // ₽ за чашку

    const fmt = (n) => n.toLocaleString("ru-RU");

    // склонение «чашка / чашки / чашек»
    const cupWord = (n) => {
        const mod100 = n % 100;
        const mod10 = n % 10;
        if (mod100 >= 11 && mod100 <= 14) return "чашек";
        if (mod10 === 1) return "чашка";
        if (mod10 >= 2 && mod10 <= 4) return "чашки";
        return "чашек";
    };

    const update = () => {
        const limit = Number(slider.value);
        limitValue.textContent = fmt(limit);
        // минимальный платёж ≈ 5% от лимита, округляем до 100 ₽
        const pay = Math.round((limit * 0.05) / 100) * 100;
        minPay.textContent = fmt(pay);
        // тот же платёж в чашках кофе
        const cups = Math.round(pay / COFFEE_PRICE);
        coffeeNote.textContent = `☕ это всего ${fmt(cups)} ${cupWord(cups)} кофе в месяц`;
        // заливка трека до ползунка
        const pct =
            ((limit - slider.min) / (slider.max - slider.min)) * 100;
        slider.style.background = `linear-gradient(to right, #fff 0%, #fff ${pct}%, rgba(255,255,255,0.25) ${pct}%, rgba(255,255,255,0.25) 100%)`;
    };

    slider.addEventListener("input", update);
    update();
})();
