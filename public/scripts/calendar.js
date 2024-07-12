document.addEventListener("DOMContentLoaded", () => {
  const calendar = document.getElementById("calendar");
  const monthYear = document.getElementById("month-year");
  const daysContainer = document.getElementById("days");
  const prevButton = document.getElementById("prev");
  const nextButton = document.getElementById("next");
  const modal = document.getElementById("myModal");
  const closeModalButton = document.querySelector(".close");

  const workoutClasses = [
    {
      date: "2024-07-10",
      name: "Yoga",
      type: "yoga",
      instructor: "Alice",
      duration: "1 hour",
      details: "A relaxing yoga class.",
    },
    {
      date: "2024-07-10",
      name: "Pilates",
      type: "pilates",
      instructor: "Bob",
      duration: "45 minutes",
      details: "A core-strengthening pilates session.",
    },
    {
      date: "2024-07-10",
      name: "Spinning",
      type: "spinning",
      instructor: "Charlie",
      duration: "30 minutes",
      details: "A high-intensity spinning class.",
    },
    {
      date: "2024-07-15",
      name: "CrossFit",
      type: "crossfit",
      instructor: "Dave",
      duration: "1 hour",
      details: "A CrossFit workout.",
    },
    {
      date: "2024-07-15",
      name: "Aerobics",
      type: "aerobics",
      instructor: "Eve",
      duration: "45 minutes",
      details: "A fun aerobics session.",
    },
    {
      date: "2024-07-15",
      name: "Zumba",
      type: "zumba",
      instructor: "Fay",
      duration: "1 hour",
      details: "A Zumba dance workout.",
    },
    {
      date: "2024-07-20",
      name: "Boxing",
      type: "boxing",
      instructor: "Gina",
      duration: "1 hour",
      details: "A boxing class.",
    },
    {
      date: "2024-07-20",
      name: "HIIT",
      type: "hiit",
      instructor: "Henry",
      duration: "30 minutes",
      details: "A high-intensity interval training session.",
    },
    {
      date: "2024-07-20",
      name: "Swimming",
      type: "swimming",
      instructor: "Isla",
      duration: "1 hour",
      details: "A swimming workout.",
    },
    // Add more workout classes for other dates
  ];

  let currentDate = new Date();

  function renderCalendar() {
    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();

    monthYear.textContent = `${currentDate.toLocaleString("default", {
      month: "long",
    })} ${year}`;

    daysContainer.innerHTML = "";

    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < firstDayOfMonth; i++) {
      daysContainer.innerHTML += "<div></div>";
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(
        day
      ).padStart(2, "0")}`;
      const workoutClassesForDay = workoutClasses.filter(
        (wc) => wc.date === dateStr
      );
      let dayHTML = `<div>${day}`;
      workoutClassesForDay.slice(0, 4).forEach((workout) => {
        dayHTML += `<div class="workout ${workout.type}" data-name="${workout.name}" data-instructor="${workout.instructor}" data-duration="${workout.duration}" data-details="${workout.details}">${workout.name}</div>`;
      });
      if (workoutClassesForDay.length > 4) {
        dayHTML += `<div class="workout more">+${
          workoutClassesForDay.length - 4
        } more</div>`;
      }
      dayHTML += "</div>";
      daysContainer.innerHTML += dayHTML;
    }

    document.querySelectorAll(".workout").forEach((item) => {
      item.addEventListener("click", function () {
        const name = this.getAttribute("data-name");
        const instructor = this.getAttribute("data-instructor");
        const duration = this.getAttribute("data-duration");
        const details = this.getAttribute("data-details");

        document.getElementById("modal-class-name").innerText = name;
        document.getElementById("modal-instructor").innerText = instructor;
        document.getElementById("modal-duration").innerText = duration;
        document.getElementById("modal-details").innerText = details;

        modal.style.display = "block";
      });
    });
  }

  prevButton.addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
  });

  nextButton.addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
  });

  closeModalButton.addEventListener("click", () => {
    modal.querySelector(".modal-content").style.animation =
      "zoomOut 0.3s ease-out";
    setTimeout(() => {
      modal.style.display = "none";
      modal.querySelector(".modal-content").style.animation =
        "zoomIn 0.3s ease-out";
    }, 300);
  });

  window.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.querySelector(".modal-content").style.animation =
        "zoomOut 0.3s ease-out";
      setTimeout(() => {
        modal.style.display = "none";
        modal.querySelector(".modal-content").style.animation =
          "zoomIn 0.3s ease-out";
      }, 300);
    }
  });

  renderCalendar();
});
