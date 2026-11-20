let studentsData = [];

const tablesContainer =
  document.getElementById("tablesContainer") ||
  document.getElementById("tables-container");

const searchInput =
  document.getElementById("searchInput") ||
  document.getElementById("search-input");

const searchBtn =
  document.getElementById("searchBtn") ||
  document.getElementById("search-btn");

async function loadStudents() {
  if (studentsData.length > 0) {
    renderSingleTable(studentsData);
    return;
  }

  try {
    const response = await fetch("./students.json");
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    studentsData = await response.json();
    renderSingleTable(studentsData);
  } catch (error) {
    console.error("Failed to load students.json:", error);
    if (tablesContainer) {
      tablesContainer.innerHTML = `
        <p style="color: #b00020; padding: 16px; border: 1px solid #000; background: #fff;">
          <strong>Could not load students.json:</strong> Make sure <code>students.json</code> is in the same folder and you are opening <code>index.html</code> with VS Code <strong>Live Server</strong> (not double-clicking the file).
        </p>`;
    }
  }
}

function createTableElement(data) {
  const table = document.createElement("table");

  const thead = `
    <thead>
      <tr>
        <th>ID</th>
        <th>Name</th>
        <th>Gender</th>
        <th>Class</th>
        <th>Marks</th>
        <th>Passing</th>
        <th>Email</th>
      </tr>
    </thead>
  `;

  const tbodyRows = data
    .map(
      (student) => `
      <tr>
        <td>${student.id}</td>
        <td>
          <div class="name-cell">
            <img src="${student.img_src}" alt="${student.first_name} ${student.last_name}" />
            <span>${student.first_name} ${student.last_name}</span>
          </div>
        </td>
        <td>${student.gender}</td>
        <td>${student.class}</td>
        <td>${student.marks}</td>
        <td>${student.passing ? "Passing" : "Failed"}</td>
        <td>${student.email}</td>
      </tr>
    `
    )
    .join("");

  table.innerHTML = `${thead}<tbody>${tbodyRows}</tbody>`;
  return table;
}

function renderSingleTable(data) {
  if (!tablesContainer) return;
  tablesContainer.innerHTML = "";
  tablesContainer.appendChild(createTableElement(data));
}
function handleSearch() {
  if (!searchInput) return;
  const query = searchInput.value.trim().toLowerCase();

  const filteredStudents = studentsData.filter((student) => {
    const firstName = (student.first_name || "").toLowerCase();
    const lastName = (student.last_name || "").toLowerCase();
    const email = (student.email || "").toLowerCase();

    return (
      firstName.includes(query) ||
      lastName.includes(query) ||
      email.includes(query)
    );
  });

  renderSingleTable(filteredStudents);
}

if (searchInput) searchInput.addEventListener("input", handleSearch);
if (searchBtn) searchBtn.addEventListener("click", handleSearch);

document.getElementById("sortAZ")?.addEventListener("click", () => {
  const sorted = [...studentsData].sort((a, b) => {
    const fullNameA = `${a.first_name} ${a.last_name}`.toLowerCase();
    const fullNameB = `${b.first_name} ${b.last_name}`.toLowerCase();
    return fullNameA.localeCompare(fullNameB);
  });
  renderSingleTable(sorted);
});

document.getElementById("sortZA")?.addEventListener("click", () => {
  const sorted = [...studentsData].sort((a, b) => {
    const fullNameA = `${a.first_name} ${a.last_name}`.toLowerCase();
    const fullNameB = `${b.first_name} ${b.last_name}`.toLowerCase();
    return fullNameB.localeCompare(fullNameA);
  });
  renderSingleTable(sorted);
});


document.getElementById("sortMarks")?.addEventListener("click", () => {
  const sorted = [...studentsData].sort((a, b) => a.marks - b.marks);
  renderSingleTable(sorted);
});

document.getElementById("sortPassing")?.addEventListener("click", () => {
  const passingOnly = studentsData.filter((student) => student.passing === true);
  renderSingleTable(passingOnly);
});


document.getElementById("sortClass")?.addEventListener("click", () => {
  const sorted = [...studentsData].sort((a, b) => a.class - b.class);
  renderSingleTable(sorted);
});


document.getElementById("sortGender")?.addEventListener("click", () => {
  if (!tablesContainer) return;
  tablesContainer.innerHTML = "";

  const femaleStudents = studentsData.filter(
    (student) => (student.gender || "").toLowerCase() === "female"
  );
  const maleStudents = studentsData.filter(
    (student) => (student.gender || "").toLowerCase() === "male"
  );

  const femaleHeading = document.createElement("h2");
  femaleHeading.className = "table-heading";
  femaleHeading.textContent = "Female Students";
  tablesContainer.appendChild(femaleHeading);
  tablesContainer.appendChild(createTableElement(femaleStudents));


  const maleHeading = document.createElement("h2");
  maleHeading.className = "table-heading";
  maleHeading.textContent = "Male Students";
  tablesContainer.appendChild(maleHeading);
  tablesContainer.appendChild(createTableElement(maleStudents));
});


loadStudents();
