document.addEventListener('DOMContentLoaded', function () {
  const reviewsContainer = document.getElementById('exec-reviews');
  fetch('http://192.168.0.120/db.php')
    .then((response) => response.json())
    .then((data) => {
      if (!Array.isArray(data)) {
        reviewsContainer.innerHTML = `<p>Error: Unexpected data format received from the server.</p>`;
        return;
      }

      if (data.length === 0) {
        reviewsContainer.innerHTML = `<p>No employees found.</p>`;
        return;
      }

      reviewsContainer.innerHTML = ''; // Clear any existing content
      data.forEach((review) => {
        const reviewCard = `
              <div class="exec-review">
                <h3>${review.author}</h3>
                <p>${review.content}</p>
                <p><strong>Rating:</strong> ${review.rating}</p>
              </div>
            `;
        reviewsContainer.innerHTML += reviewCard;
      });
    })
    .catch((error) => {
      reviewsContainer.innerHTML = `<p>Failed to load employee data: ${error.message}</p>`;
    });
});
