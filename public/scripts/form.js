document
  .getElementById("staff-form")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = {
      name: document.getElementById("name").value,
      status: document.getElementById("status").value,
    };

    const response = await fetch("/api/data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      alert("Data submitted successfully!");
      document.getElementById("staff-form").reset();
    } else {
      alert("Error submitting data.");
    }
  });
