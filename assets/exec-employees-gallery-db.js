document.addEventListener('DOMContentLoaded', function () {
  const galleryContainer = document.getElementById('employees-gallery');
  fetch('http://192.168.0.106/db.php')
    .then((response) => response.json())
    .then((data) => {
      if (!Array.isArray(data)) {
        galleryContainer.innerHTML = `<p>Error: Unexpected data format received from the server.</p>`;
        return;
      }

      if (data.length === 0) {
        galleryContainer.innerHTML = `<p>No employees found.</p>`;
        return;
      }

      galleryContainer.innerHTML = ''; // Clear any existing content
      data.forEach((employee) => {
        const employeeCard = `
            <div class="employee-card">
              <h3>${employee.first_name} ${employee.last_name}</h3>
              <p>${employee.department}</p>
            </div>
          `;
        galleryContainer.innerHTML += employeeCard;
      });
    })
    .catch((error) => {
      galleryContainer.innerHTML = `<p>Failed to load employee data: ${error.message}</p>`;
    });
});
