document.addEventListener("DOMContentLoaded", () => {
  const formSection = document.getElementById("form-section");
  const queryResults = document.getElementById("query-results");

  const setupFormSubmit = (method) => {
    const form = document.getElementById("fitness-class-form");
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const formData = new FormData(form);
      const classData = Object.fromEntries(formData.entries());

      try {
        const res = await fetch("/api/fitness_classes", {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(classData),
        });

        const data = await res.json();
        if (res.ok) {
          alert("Operation successful!");
          form.reset();
          // Only call queryClasses if the search form elements exist
          if (
            document.getElementById("query-field") &&
            document.getElementById("query-attribute")
          ) {
            queryClasses();
          }
        } else {
          alert("Error: " + (data.message || "Unknown error occurred"));
        }
      } catch (error) {
        console.error("Error submitting form:", error);
        alert("An error occurred. Please check the console for details.");
      }
    });
  };

  const setupQueryForm = () => {
    document
      .getElementById("search-button")
      .addEventListener("click", async () => {
        await queryClasses();
      });
  };

  function formatDate(dateString) {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }

  function formatTime(timeString) {
    const [hours, minutes] = timeString.split(":").map(Number);
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
  }

  async function queryClasses() {
    const queryField = document.getElementById("query-field").value;
    const queryAttribute = document.getElementById("query-attribute").value;
    if (!queryField || !queryAttribute) {
      queryResults.innerHTML =
        "<p>Please enter a query and select an attribute to search.</p>";
      return;
    }
    queryResults.innerHTML = "<p>Loading...</p>"; // Provide immediate feedback
    try {
      const res = await fetch(
        `/api/fitness_classes/search?query=${encodeURIComponent(
          queryField
        )}&attribute=${encodeURIComponent(queryAttribute)}`
      );
      if (res.ok) {
        const results = await res.json();
        queryResults.innerHTML = results.length
          ? results
              .map(
                (result) => `
                <div class="query-result-item">
                  <h3>${
                    result.class_name
                  } <span class="badge ${result.class_type.toLowerCase()}">${
                  result.class_type
                }</span></h3>
                  <p><strong>Instructor:</strong> ${result.instructor}</p>
                  <p><strong>Date:</strong> ${formatDate(result.date)}</p>
                  <p><strong>Time:</strong> ${formatTime(result.time)}</p>
                  <p><strong>Duration:</strong> ${result.duration} minutes</p>
                  <p><strong>Details:</strong> ${result.details}</p>
                </div>
              `
              )
              .join("")
          : "<p>No results found.</p>";
      } else {
        const errorData = await res.json();
        queryResults.innerHTML = `<p>Error: ${
          errorData.message || "Unknown error occurred"
        }</p>`;
      }
    } catch (error) {
      console.error("Error querying classes:", error);
      queryResults.innerHTML =
        "<p>An error occurred. Please check the console for details.</p>";
    }
  }

  // Set default state to search classes
  formSection.innerHTML = `
      <h2>Search Classes</h2>
      <div id="search-bar">
        <input type="text" id="query-field" placeholder="Search...">
        <select id="query-attribute">
          <option value="class_name">Class Name</option>
          <option value="instructor">Instructor</option>
          <!-- Add more options as needed -->
        </select>
        <button id="search-button">Search</button>
      </div>
    `;
  setupQueryForm();

  document
    .getElementById("search-classes-btn")
    .addEventListener("click", () => {
      formSection.innerHTML = `
        <h2>Search Classes</h2>
        <div id="search-bar">
          <input type="text" id="query-field" placeholder="Search...">
          <select id="query-attribute">
            <option value="class_name">Class Name</option>
            <option value="instructor">Instructor</option>
            <!-- Add more options as needed -->
          </select>
          <button id="search-button">Search</button>
        </div>
      `;
      queryResults.innerHTML = ""; // Clear query results
      setupQueryForm();
    });

  document.getElementById("add-class-btn").addEventListener("click", () => {
    formSection.innerHTML = `
        <h2>Add New Class</h2>
        <form id="fitness-class-form">
          <div>
            <label for="class_name">Class Name:</label>
            <input type="text" id="class_name" name="class_name" required>
          </div>
          <div>
            <label for="instructor">Instructor:</label>
            <input type="text" id="instructor" name="instructor" required>
          </div>
          <div>
            <label for="date">Date:</label>
            <input type="date" id="date" name="date" required>
          </div>
          <div>
            <label for="time">Time:</label>
            <input type="time" id="time" name="time" required>
          </div>
          <div>
            <label for="duration">Duration (minutes):</label>
            <input type="number" id="duration" name="duration" required>
          </div>
          <div>
            <label for="details">Details:</label>
            <textarea id="details" name="details"></textarea>
          </div>
          <div>
            <label for="class_type">Class Type:</label>
            <select id="class_type" name="class_type" required>
              <option value="Yoga">Yoga</option>
              <option value="Pilates">Pilates</option>
              <option value="Spinning">Spinning</option>
              <option value="CrossFit">CrossFit</option>
              <option value="Aerobics">Aerobics</option>
              <option value="Zumba">Zumba</option>
              <option value="Boxing">Boxing</option>
            </select>
          </div>
          <button type="submit">Submit</button>
        </form>
      `;
    queryResults.innerHTML = ""; // Clear query results
    setupFormSubmit("POST");
  });

  document.getElementById("update-class-btn").addEventListener("click", () => {
    formSection.innerHTML = `
        <h2>Update Class</h2>
        <form id="fitness-class-form">
          <!-- Form fields for updating a class -->
          <button type="submit">Update</button>
        </form>
      `;
    queryResults.innerHTML = ""; // Clear query results
    setupFormSubmit("PUT");
  });

  document
    .getElementById("update-class-field-btn")
    .addEventListener("click", () => {
      formSection.innerHTML = `
        <h2>Update Class Field</h2>
        <form id="fitness-class-form">
          <!-- Form fields for updating a specific field of a class -->
          <button type="submit">Update Field</button>
        </form>
      `;
      queryResults.innerHTML = ""; // Clear query results
      setupFormSubmit("PATCH");
    });

  // Initial load of classes
  queryClasses();
});
