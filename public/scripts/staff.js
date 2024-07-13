document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("fitness-class-form");
  const queryForm = document.getElementById("query-form");
  const queryResults = document.getElementById("query-results");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    console.log("Form submitted");
    const formData = new FormData(form);
    const classData = Object.fromEntries(formData.entries());
    console.log("Submitting data:", classData);

    try {
      const res = await fetch("/api/fitness_classes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(classData),
      });

      console.log("Response status:", res.status);
      const data = await res.json();
      console.log("Response data:", data);

      if (res.ok) {
        alert("Class added successfully!");
        form.reset();
        // Optionally, refresh the class list here
        queryClasses();
      } else {
        alert("Error: " + (data.message || "Unknown error occurred"));
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert(
        "An error occurred while submitting the form. Please check the console for details."
      );
    }
  });

  queryForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    await queryClasses();
  });

  async function queryClasses() {
    const queryField = document.getElementById("query-field").value;
    console.log("Querying classes with:", queryField);
    try {
      const res = await fetch(
        `/api/fitness_classes${queryField ? `?query=${queryField}` : ""}`
      );
      console.log("Query response status:", res.status);

      if (res.ok) {
        const results = await res.json();
        console.log("Query results:", results);
        if (results.length === 0) {
          queryResults.innerHTML = "<p>No results found.</p>";
        } else {
          queryResults.innerHTML = results
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
            .join("");
        }
      } else {
        const errorData = await res.json();
        console.error("Error querying classes:", errorData);
        queryResults.innerHTML = `<p>Error: ${
          errorData.message || "Unknown error occurred"
        }</p>`;
      }
    } catch (error) {
      console.error("Error querying classes:", error);
      queryResults.innerHTML =
        "<p>An error occurred while querying classes. Please check the console for details.</p>";
    }
  }

  // Initial load of classes
  queryClasses();
});
