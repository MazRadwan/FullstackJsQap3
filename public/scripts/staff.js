document.addEventListener("DOMContentLoaded", () => {
  const formSection = document.getElementById("form-section");
  const queryResults = document.getElementById("query-results");

  document.getElementById("add-class-btn").addEventListener("click", () => {
    formSection.innerHTML = `
        <h2>Add New Class</h2>
        <form id="fitness-class-form">
          <!-- Form fields for adding a new class -->
          <button type="submit">Submit</button>
        </form>
      `;
    setupFormSubmit("POST");
  });

  document
    .getElementById("search-classes-btn")
    .addEventListener("click", () => {
      formSection.innerHTML = `
        <h2>Search Classes</h2>
        <form id="query-form">
          <!-- Form fields for searching classes -->
          <button type="submit">Search</button>
        </form>
      `;
      setupQueryForm();
    });

  document.getElementById("update-class-btn").addEventListener("click", () => {
    formSection.innerHTML = `
        <h2>Update Class</h2>
        <form id="fitness-class-form">
          <!-- Form fields for updating a class -->
          <button type="submit">Update</button>
        </form>
      `;
    setupFormSubmit("PATCH");
  });

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
          queryClasses();
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
    const queryForm = document.getElementById("query-form");
    queryForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      await queryClasses();
    });
  };

  async function queryClasses() {
    const queryField = document.getElementById("query-field").value;
    try {
      const res = await fetch(
        `/api/fitness_classes${queryField ? `?query=${queryField}` : ""}`
      );
      if (res.ok) {
        const results = await res.json();
        queryResults.innerHTML = results.length
          ? results
              .map(
                (result) => `
                <div>
                  <h3>${result.class_name}</h3>
                  <p><strong>Instructor:</strong> ${result.instructor}</p>
                  <p><strong>Date:</strong> ${result.date}</p>
                  <p><strong>Time:</strong> ${result.time}</p>
                  <p><strong>Duration:</strong> ${result.duration} minutes</p>
                  <p><strong>Details:</strong> ${result.details}</p>
                  <p><strong>Type:</strong> ${result.class_type}</p>
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

  // Initial load of classes
  queryClasses();
});
