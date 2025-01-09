const names = [
  "Гайович Ольга",
  "Гринішак Святослав",
  "Гьопфнер Романія",
  "Данилець Марта",
  "Дякун Ілля",
  "Іваньків Емма",
  "Іваськів Арсен",
  "Вецко Олексій",
  "Кирпань Анна-Марія",
  "Кльок Влад",
  "Маланюк Володимр",
  "Малишевська Єлизавета",
  "Медвідь Роман",
  "Миколаєнко Дмитро",
  "Омельченко Софія",
  "Нагірняк Денис",
  "Нетреба Саша",
  "Озарко Дарій",
  "Петрина Назар",
  "Підгурний Олег",
  "Підлеснюк Олександр",
  "Пупенко Тереза",
  "Радюк Макар",
  "Рипан Олеся",
  "Романюк Міша",
];

const TEN_MINUTES_MS = 600000; // 10 хвилин у мілісекундах

function createTable() {
  const table = document.getElementById("myTable");

  // Створюємо перший рядок з числами
  const headerRow = document.createElement("tr");
  const emptyHeader = document.createElement("th");
  headerRow.appendChild(emptyHeader); // Пустий заголовок для першого стовпця

  for (let col = 1; col <= 32; col++) {
    // 32 стовпця, з додатковим справа
    const th = document.createElement("th");
    th.textContent = col <= 31 ? col : "Новий стовпець"; // Останній стовпець з назвою
    headerRow.appendChild(th);
  }
  table.appendChild(headerRow);

  for (let row = 1; row <= 25; row++) {
    // 25 рядків, оскільки ми видаляємо 2 останні
    const tr = document.createElement("tr");

    // Створюємо перший стовпець з іменами
    const nameTd = document.createElement("td");
    nameTd.textContent = names[row - 1];
    tr.appendChild(nameTd);

    // Створюємо решту стовпців з чекбоксами
    for (let col = 2; col <= 32; col++) {
      // 32 стовпця
      const td = document.createElement("td");
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.dataset.name = names[row - 1]; // Додаємо ім'я до кожного чекбокса
      checkbox.dataset.row = row;
      checkbox.dataset.col = col;

      // Зберігаємо стан чекбокса
      if (localStorage.getItem(`checkbox-${row}-${col}`) === "true") {
        checkbox.checked = true;
      }

      checkbox.addEventListener("change", function () {
        const timestamp = Date.now();

        // Зберігаємо стан у localStorage та час позначки
        localStorage.setItem(`checkbox-${row}-${col}`, this.checked);
        if (this.checked) {
          localStorage.setItem(`timestamp-${row}-${col}`, timestamp);
        } else {
          localStorage.removeItem(`timestamp-${row}-${col}`);
        }
      });
      td.appendChild(checkbox);
      tr.appendChild(td);
    }

    table.appendChild(tr);
  }
}

// Функція для виведення результатів
function submitSelections() {
  let selectedNames = new Set();
  const checkboxes = document.querySelectorAll(
    'input[type="checkbox"]:checked'
  );
  const currentTime = Date.now();

  checkboxes.forEach((checkbox) => {
    const row = checkbox.dataset.row;
    const col = checkbox.dataset.col;
    const timestamp = localStorage.getItem(`timestamp-${row}-${col}`);

    // Перевіряємо, чи була позначка зроблена протягом останніх 10 хвилин
    if (timestamp && currentTime - timestamp <= TEN_MINUTES_MS) {
      selectedNames.add(checkbox.dataset.name);
    }
  });

  if (selectedNames.size > 0) {
    alert(
      "Ви відмітили за останні 10 хвилин наступних людей:\n" +
        Array.from(selectedNames).join("\n")
    );
  } else {
    alert("За останні 10 хвилин жодного не відмічено.");
  }
}

// Викликаємо функцію для створення таблиці після завантаження сторінки
window.onload = createTable;
