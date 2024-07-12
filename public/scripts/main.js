document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("search");
  const table = document.getElementById("data-table");
  const rows = Array.from(table.querySelectorAll("tbody tr"));
  const sortButtons = document.querySelectorAll(".sort");

  searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase();
    rows.forEach((row) => {
      const cells = Array.from(row.getElementsByTagName("td"));
      const matches = cells.some((cell) =>
        cell.textContent.toLowerCase().includes(query)
      );
      row.style.display = matches ? "" : "none";
    });
  });

  sortButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const column = button.getAttribute("data-column");
      const order = button.getAttribute("data-order");
      const sortedRows = rows.sort((a, b) => {
        const aText = a.querySelector(
          `td:nth-child(${getColumnIndex(column)})`
        ).textContent;
        const bText = b.querySelector(
          `td:nth-child(${getColumnIndex(column)})`
        ).textContent;
        return order === "asc"
          ? aText.localeCompare(bText)
          : bText.localeCompare(aText);
      });
      sortedRows.forEach((row) =>
        table.querySelector("tbody").appendChild(row)
      );
      button.setAttribute("data-order", order === "asc" ? "desc" : "asc");
      button.innerHTML = order === "asc" ? "&#x2193;" : "&#x2191;";
    });
  });

  function getColumnIndex(column) {
    switch (column) {
      case "id":
        return 1;
      case "name":
        return 2;
      case "status":
        return 3;
      case "price":
        return 4;
      default:
        return 1;
    }
  }
});
