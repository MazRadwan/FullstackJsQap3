document.addEventListener("DOMContentLoaded", () => {
  const calendar = document.getElementById("calendar");
  const monthYear = document.getElementById("month-year");
  const daysContainer = document.getElementById("days");
  const prevButton = document.getElementById("prev");
  const nextButton = document.getElementById("next");
  const modal = document.getElementById("myModal");
  const closeModalButton = document.querySelector(".close");

  const fetchClasses = async (month, year) => {
    const res = await fetch(`/api/fitness_classes?month=${month}&year=${year}`);
    const classes = await res.json();
    return classes;
  };

  const renderCalendar = async () => {
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

    const classes = await fetchClasses(month + 1, year);

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(
        day
      ).padStart(2, "0")}`;
      const workoutClassesForDay = classes.filter((wc) => wc.date === dateStr);
      let dayHTML = `<div>${day}`;
      workoutClassesForDay.slice(0, 4).forEach((workout) => {
        dayHTML += `<div class="workout ${workout.class_type.toLowerCase()}" data-name="${
          workout.class_name
        }" data-instructor="${workout.instructor}" data-duration="${
          workout.duration
        }" data-details="${workout.details}">${workout.class_name}</div>`;
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
  };

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

  const currentDate = new Date();
  renderCalendar();
});
