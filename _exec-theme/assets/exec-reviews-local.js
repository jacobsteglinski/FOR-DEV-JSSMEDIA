// GET REVIEWS
document.addEventListener('DOMContentLoaded', function () {
  const reviewsContainer = document.getElementById('exec-reviews');

  // Function to generate star ratings
  function generateStars(rating) {
    const fullStars = Math.floor(rating); // Full stars
    const halfStar = rating % 1 >= 0.5; // Half star
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0); // Empty stars

    let starsHTML = '';
    for (let i = 0; i < fullStars; i++) {
      starsHTML += '<span class="star full">&#9733;</span>'; // Full star
    }
    if (halfStar) {
      starsHTML += '<span class="star half">&#9733;</span>'; // Half star
    }
    for (let i = 0; i < emptyStars; i++) {
      starsHTML += '<span class="star empty">&#9733;</span>'; // Empty star
    }
    return starsHTML;
  }

  fetch('http://192.168.0.120/get-reviews.php')
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

      reviewsContainer.innerHTML = ''; 
      data.forEach((review) => {
        const stars = generateStars(review.rating);
        const reviewCard = `
              <div class="exec-review">
                <h3>${review.author}</h3>
                <p>${review.content}</p>
                <div class="review-rating">${stars}</div>
              </div>
            `;
        reviewsContainer.innerHTML += reviewCard;
      });
    })
    .catch((error) => {
      reviewsContainer.innerHTML = `<p>Failed to load employee data: ${error.message}</p>`;
    });
});

// ADD REVIEWS
document.addEventListener('DOMContentLoaded', function () {
  const reviewsContainer = document.getElementById('exec-reviews');
  const formContainer = document.getElementById('review-form-container');

  // Create and append the form
  const formHTML = `
    <form id="add-review-form">
      <input type="text" id="author" placeholder="Your Name" required />
      <textarea id="content" placeholder="Your Review" required></textarea>
      <input type="number" id="rating" min="1" max="5" placeholder="Rating (1-5)" required />
      <button type="submit">Submit Review</button>
    </form>
  `;
  formContainer.innerHTML = formHTML;

  document.getElementById('add-review-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const author = document.getElementById('author').value;
    const content = document.getElementById('content').value;
    const rating = parseFloat(document.getElementById('rating').value);

    fetch('http://192.168.0.120/add-review.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ author, content, rating }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          alert('Review submitted successfully!');
          location.reload();
        } else {
          alert('Failed to submit review: ' + data.error);
        }
      })
      .catch((error) => {
        alert('Error submitting review: ' + error.message);
      });
  });
});
