document.addEventListener("DOMContentLoaded", () => {
  const calendar = document.getElementById("calendar");
  const monthYear = document.getElementById("month-year");
  const daysContainer = document.getElementById("days");
  const prevButton = document.getElementById("prev");
  const nextButton = document.getElementById("next");
  const modal = document.getElementById("myModal");
  const closeModalButton = document.querySelector(".close");

  let currentDate = new Date();

  const fetchClasses = async (month, year) => {
    try {
      console.log(`Fetching classes for ${month}/${year}`);
      const timestamp = new Date().getTime();
      const res = await fetch(
        `/api/fitness_classes?month=${month}&year=${year}&_=${timestamp}`
      );
      if (!res.ok) {
        throw new Error(
          `Failed to fetch classes: ${res.status} ${res.statusText}`
        );
      }
      const data = await res.json();
      console.log("Fetched classes:", data);
      return data;
    } catch (error) {
      console.error("Error fetching classes:", error);
      return [];
    }
  };

  const renderCalendar = async () => {
    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();

    console.log(`Rendering calendar for ${month + 1}/${year}`);

    monthYear.textContent = `${currentDate.toLocaleString("default", {
      month: "long",
    })} ${year}`;

    daysContainer.innerHTML = "";

    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    console.log(
      `First day of month: ${firstDayOfMonth}, Days in month: ${daysInMonth}`
    );

    for (let i = 0; i < firstDayOfMonth; i++) {
      daysContainer.innerHTML += "<div></div>";
    }

    const classes = await fetchClasses(month + 1, year);
    console.log("Classes fetched for rendering:", classes);

    if (classes.length === 0) {
      console.log("No classes found for this month and year");
    } else {
      console.log("Sample class:", classes[0]);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(
        day
      ).padStart(2, "0")}`;
      console.log(`Processing date: ${dateStr}`);

      const workoutClassesForDay = classes.filter((wc) => {
        const formattedDate = formatDate(wc.date);
        console.log(`Comparing: ${formattedDate} with ${dateStr}`);
        return formattedDate === dateStr;
      });
      console.log(`Classes for ${dateStr}:`, workoutClassesForDay);

      let dayHTML = `<div>${day}`;
      workoutClassesForDay.slice(0, 4).forEach((workout) => {
        console.log(`Adding workout to calendar: ${workout.class_name}`);
        dayHTML += `
          <div class="workout ${workout.class_type.toLowerCase()}" 
               title="${workout.class_name} - ${workout.time}"
               data-name="${workout.class_name}" 
               data-instructor="${workout.instructor}" 
               data-duration="${workout.duration}" 
               data-details="${workout.details}"
               data-time="${workout.time}">

            ${workout.class_name} - ${workout.time}
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

    console.log("Calendar rendering complete");
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
        console.log("Workout clicked:", this.getAttribute("data-name"));

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
