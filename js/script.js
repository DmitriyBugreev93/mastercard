document.addEventListener("DOMContentLoaded", function () {
  const startBtn = document.querySelector(".master-top-btn");
  const restartBtn = document.querySelectorAll(".otvet-btn");
  const centerBlock = document.querySelector(".master-center");
  const scrollTo = document.querySelector(".scroll-start");
  const slideLine = document.querySelector(".slide-line-sp");
  const slideNum = document.querySelector(".slide-num");
  //================================== Start btn

  startBtn.addEventListener("click", () => {
    startBtn.classList.add("active");
    centerBlock.classList.add("active");

    scrollTo.scrollIntoView({ block: "start", behavior: "smooth" });
  });

  //================================== Restart btn

  restartBtn.forEach((btn) => {
    btn.addEventListener("click", () => {
      startBtn.classList.add("active");
      centerBlock.classList.add("active");
      scrollTo.scrollIntoView({ block: "start", behavior: "smooth" });
      document.querySelectorAll(".master-otvet").forEach((item) => {
        item.classList.remove("active");
      });
    });
  });

  //=================================== Li

  function closest(el, selector) {
    if (Element.prototype.closest) {
      return el.closest(selector);
    }
    let parent = el;
    while (parent) {
      if (parent.matches(selector)) {
        return parent;
      }
      parent = parent.parentElement;
    }
    return null;
  }

  const allLi = document.querySelectorAll(".cards li");
  const cards = document.querySelectorAll(".card");
  let counter = 0;

  const answers = [];
  const names = { a: "Турция", b: "Грузия", c: "ОАЭ", d: "Италия" };

  allLi.forEach((item) => {
    item.addEventListener("click", function () {
      if (this.classList.contains("typeA")) {
        this.classList.add("active");
        counter++;
        answers.push("a");
      } else if (this.classList.contains("typeB")) {
        this.classList.add("active");
        counter++;
        answers.push("b");
      } else if (this.classList.contains("typeC")) {
        this.classList.add("active");
        counter++;
        answers.push("c");
      } else if (this.classList.contains("typeD")) {
        this.classList.add("active");
        counter++;
        answers.push("d");
      }
      closest(item, ".card").classList.add("btn");
    });
  });

  //======================================= Filter Img & Test

  const otvet1 = document.querySelector(".master-otvet-1");
  const otvet2 = document.querySelector(".master-otvet-2");
  const otvet3 = document.querySelector(".master-otvet-3");
  const otvet4 = document.querySelector(".master-otvet-4");

  let filter = document.querySelectorAll("[data-filter]");
  let slideLineWidth = 12.5;
  let slideNumCount = 1;

  function computeWinner(answers, names = { a: "A", b: "B", c: "C", d: "D" }) {
    const letters = ["a", "b", "c", "d"];

    // Текущие счётчики
    const count = { a: 0, b: 0, c: 0, d: 0 };

    // Когда буква впервые достигла конкретного счёта:
    // reach['a'][1] = индекс шага, когда 'a' впервые получила 1 балл, reach['a'][2] — когда впервые получила 2 балла, и т.д.
    const reach = { a: [], b: [], c: [], d: [] };

    answers.forEach((letter, i) => {
      if (!count.hasOwnProperty(letter)) return; // игнор, если что-то лишнее попало
      count[letter] += 1;
      const cur = count[letter];
      if (reach[letter][cur] === undefined) reach[letter][cur] = i; // фиксируем только первый раз
    });

    // Находим максимальный счёт
    const maxScore = Math.max(...letters.map((l) => count[l]));

    // Кандидаты с максимальным счётом
    const candidates = letters.filter((l) => count[l] === maxScore);

    // Если один кандидат — победитель очевиден
    if (candidates.length === 1) {
      const winner = candidates[0];
      return {
        winnerLetter: winner,
        winnerCountry: names[winner],
        maxScore,
        reachedAtIndex: reach[winner][maxScore], // индекс вопроса (0-based), когда впервые достигнут maxScore
        details: { count, reach },
      };
    }

    // Тай-брейк: кто РАНЬШЕ достиг maxScore
    candidates.sort((l1, l2) => reach[l1][maxScore] - reach[l2][maxScore]);
    const winner = candidates[0];

    return {
      winnerLetter: winner,
      winnerCountry: names[winner],
      maxScore,
      reachedAtIndex: reach[winner][maxScore],
      details: { count, reach, tieBetween: candidates },
    };
  }

  filter.forEach(function (item) {
    item.addEventListener("click", function () {
      if (slideNumCount < 7) {
        slideNumCount++;
        slideLineWidth += 12.5;
        slideNum.innerHTML = `${slideNumCount}`;
      }

      let cat = item.dataset.filter;

      slideLine.style.cssText = `
            width: ${slideLineWidth}%;
            `;

      if (cat == "end") {
        centerBlock.classList.remove("active");

        const result = computeWinner(answers, names);
        // console.log(result);
        // console.log(answers);

        if (result.winnerLetter === "a") {
          otvet1.classList.add("active");
          setTimeout(() => {
            otvet1.classList.add("anim");
          }, 200);
          otvet1.scrollIntoView({ block: "start", behavior: "smooth" });
        } else if (result.winnerLetter === "b") {
          otvet2.classList.add("active");
          setTimeout(() => {
            otvet2.classList.add("anim");
          }, 200);
          otvet2.scrollIntoView({ block: "start", behavior: "smooth" });
        } else if (result.winnerLetter === "c") {
          otvet3.classList.add("active");
          setTimeout(() => {
            otvet3.classList.add("anim");
          }, 200);
          otvet3.scrollIntoView({ block: "start", behavior: "smooth" });
        } else if (result.winnerLetter === "d") {
          otvet4.classList.add("active");
          setTimeout(() => {
            otvet4.classList.add("anim");
          }, 200);
          otvet4.scrollIntoView({ block: "start", behavior: "smooth" });
        }

        allLi.forEach((item) => {
          item.classList.remove("active", "red", "green");
        });
        cards.forEach((item) => {
          item.classList.remove("btn");
        });

        counter = 0;
        slideLineWidth = 12.5;
        slideNumCount = 1;
        slideNum.innerHTML = `${slideNumCount}`;

        slideLine.style.cssText = `
                width: ${slideLineWidth}%;
                `;

        document.querySelectorAll("[data-cat]").forEach(function (workItem) {
          workItem.classList.remove("active");
        });
      } else {
        document.querySelectorAll("[data-cat]").forEach(function (workItem) {
          let workCat = workItem.dataset.cat;

          if (workCat == cat) {
            workItem.classList.add("active");
          }
        });
      }
    });
  });
});
