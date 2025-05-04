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
              <div class="exec-review" data-id="${review.id}">
                <h3>${review.author}</h3>
                <p>${review.content}</p>
                <div class="review-rating">${stars}</div>
                <button class="delete-review">Delete</button> 
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
  const starsContainer = document.getElementById('rating-stars');

  // Create and append the form
  const ratingStarsHTML = `${Array.from(
    { length: 5 },
    (_, i) => `<span class="star" data-value="${i + 1}">&#9733;</span>`
  ).join('')}`;
  starsContainer.innerHTML = ratingStarsHTML;

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

// DELETE REVIEWS
document.addEventListener('DOMContentLoaded', function () {
  const reviewsContainer = document.getElementById('exec-reviews');

  reviewsContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('delete-review')) {
      const reviewElement = e.target.closest('.exec-review');
      const reviewId = reviewElement.getAttribute('data-id');

      if (!reviewId) {
        alert('Review ID not found.');
        return;
      }

      if (!confirm('Are you sure you want to delete this review?')) {
        return;
      }

      fetch(`http://192.168.0.120/delete-review.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: reviewId }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            alert('Review deleted successfully!');
            location.reload();
          } else {
            alert('Failed to delete review: ' + data.error);
          }
        })
        .catch((error) => {
          alert('Error deleting review: ' + error.message);
        });
    }
  });
});
