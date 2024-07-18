document.addEventListener("DOMContentLoaded", () => {
  const monthYear = document.getElementById("month-year");
  const daysContainer = document.getElementById("days");
  const prevButton = document.getElementById("prev");
  const nextButton = document.getElementById("next");
  const modal = document.getElementById("myModal");
  const closeModalButton = document.querySelector(".close");

  let currentDate = new Date();

  const fetchClasses = async (month, year) => {
    try {
      const timestamp = new Date().getTime();
      const res = await fetch(
        `/api/class?month=${month}&year=${year}&_=${timestamp}`
      );
      if (!res.ok) {
        throw new Error(
          `Failed to fetch classes: ${res.status} ${res.statusText}`
        );
      }
      const data = await res.json();
      return data;
    } catch (error) {
      console.error("Error fetching classes:", error);
      return [];
    }
  };

  const formatTime = (timeString) => {
    const [hours, minutes, seconds] = timeString.split(":").map(Number);
    let period = "AM";
    let hoursFormatted = hours;

    if (hours >= 12) {
      period = "PM";
      if (hours > 12) {
        hoursFormatted = hours - 12;
      }
    } else if (hours === 0) {
      hoursFormatted = 12;
    }

    return `${hoursFormatted}:${String(minutes).padStart(2, "0")} ${period}`;
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

    // Add empty cells for days before the 1st of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      daysContainer.innerHTML += "<div></div>";
    }

    const classes = await fetchClasses(month + 1, year);

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(
        day
      ).padStart(2, "0")}`;
      const workoutClassesForDay = classes.filter(
        (wc) => formatDate(wc.date) === dateStr
      );

      // Sort classes by time
      workoutClassesForDay.sort((a, b) => {
        const timeA = a.time.split(":").map(Number);
        const timeB = b.time.split(":").map(Number);
        return timeA[0] - timeB[0] || timeA[1] - timeB[1];
      });

      let dayHTML = `<div>${day}`;
      workoutClassesForDay.slice(0, 4).forEach((workout) => {
        dayHTML += `
          <div class="workout ${workout.class_type.toLowerCase()}" 
               title="${workout.class_name} - ${formatTime(workout.time)}"
               data-name="${workout.class_name}" 
               data-instructor="${workout.instructor}" 
               data-duration="${workout.duration}" 
               data-details="${workout.details}"
               data-time="${formatTime(workout.time)}">
            ${workout.class_name} - ${formatTime(workout.time)}
          </div>`;
      });
      if (workoutClassesForDay.length > 4) {
        dayHTML += `<div class="workout more">+${
          workoutClassesForDay.length - 4
        } more</div>`;
      }
      dayHTML += "</div>";
      daysContainer.innerHTML += dayHTML;
    }

    // Fill the remaining cells to complete the last row if necessary
    const totalCells = firstDayOfMonth + daysInMonth;
    const remainingCells = (7 - (totalCells % 7)) % 7;
    for (let i = 0; i < remainingCells; i++) {
      daysContainer.innerHTML += "<div></div>";
    }

    addWorkoutEventListeners();
  };

  function formatDate(dateString) {
    const date = new Date(dateString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(date.getDate()).padStart(2, "0")}`;
  }

  const addWorkoutEventListeners = () => {
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

  renderCalendar();
});
