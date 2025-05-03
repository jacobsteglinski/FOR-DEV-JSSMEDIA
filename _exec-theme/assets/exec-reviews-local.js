// GET REVIEWS
document.addEventListener('DOMContentLoaded', function () {
  const reviewsContainer = document.getElementById('exec-reviews');

  // Function to generate star ratings
  function generateStars(rating) {
    const fullStars = Math.round(rating); // Round to the nearest full star
    const emptyStars = 5 - fullStars; // Remaining empty stars

    let starsHTML = '';
    for (let i = 0; i < fullStars; i++) {
      starsHTML += '<span class="star full">&#9733;</span>'; // Full star
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
        reviewsContainer.innerHTML = `<p>No reviews found.</p>`;
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
      reviewsContainer.innerHTML = `<p>Failed to load review data: ${error.message}</p>`;
    });
});

// ADD REVIEWS
document.addEventListener('DOMContentLoaded', function () {
  const formContainer = document.getElementById('review-form-container');

  // Create and append the form
  const formHTML = `
    <form id="add-review-form">
      <h2>Share Your Experience<h2>
      <input type="text" id="author" placeholder="Your Name" required autocomplete=off />
      <textarea id="content" placeholder="Describe your thoughts"></textarea>
      <div class="rating-stars" id="rating-stars">
        ${Array.from({ length: 5 }, (_, i) => `<span class="star" data-value="${i + 1}">&#9733;</span>`).join('')}
      </div>
      <input type="hidden" id="rating" required />
      <button type="submit">Submit Review</button>
    </form>
  `;
  formContainer.innerHTML = formHTML;

  // Handle star rating selection
  const stars = document.querySelectorAll('#rating-stars .star');
  const ratingInput = document.getElementById('rating');

  stars.forEach((star) => {
    star.addEventListener('mouseover', function () {
      // Highlight stars up to the hovered one
      stars.forEach((s) => s.classList.remove('selected'));
      this.classList.add('selected');
      let previousSibling = this.previousElementSibling;
      while (previousSibling) {
        previousSibling.classList.add('selected');
        previousSibling = previousSibling.previousElementSibling;
      }
    });

    star.addEventListener('click', function () {
      const value = parseFloat(this.getAttribute('data-value'));
      ratingInput.value = value;

      // Lock the selected stars
      stars.forEach((s) => s.classList.remove('selected'));
      this.classList.add('selected');
      let previousSibling = this.previousElementSibling;
      while (previousSibling) {
        previousSibling.classList.add('selected');
        previousSibling = previousSibling.previousElementSibling;
      }
    });
  });

  // Handle form submission
  document.getElementById('add-review-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const author = document.getElementById('author').value;
    const content = document.getElementById('content').value;
    const rating = parseFloat(ratingInput.value);

    if (isNaN(rating)) {
      alert('Please select a rating.');
      return;
    }

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
