document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("fitness-class-form");
  const queryForm = document.getElementById("query-form");
  const queryResults = document.getElementById("query-results");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const classData = Object.fromEntries(formData.entries());

    const res = await fetch("/api/fitness_classes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(classData),
    });

    if (res.ok) {
      alert("Class added successfully!");
      form.reset();
    } else {
      const errorData = await res.json();
      alert("Error: " + errorData.message);
    }
  });

  queryForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const queryField = document.getElementById("query-field").value;
    const res = await fetch(`/api/fitness_classes?query=${queryField}`);

    if (res.ok) {
      const results = await res.json();
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
    } else {
      queryResults.innerHTML = "<p>No results found.</p>";
    }
  });
});
