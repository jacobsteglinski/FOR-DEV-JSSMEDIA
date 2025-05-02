document.addEventListener('DOMContentLoaded', function () {
  const relatedProductsContainer = document.getElementById('related-products-container');
  const headingElement = document.querySelector('.related-products-heading');
  const productId = relatedProductsContainer.dataset.productId;

  // Get the heading text from the data attribute
  const headingText = relatedProductsContainer.dataset.heading;

  // Set the heading text dynamically
  headingElement.textContent = headingText;

  // Fetch related products
  fetch(`/recommendations/products.json?product_id=${productId}&limit=4`)
    .then((response) => response.json())
    .then((data) => {
      if (!data.products || data.products.length === 0) {
        console.log('No recommendations found, showing Featured Products.');

        fetch('/products.json')
          .then((response) => response.json())
          .then((productsData) => {
            if (!productsData.products || productsData.products.length === 0) {
              relatedProductsContainer.innerHTML = '<p>No products available.</p>';
              return;
            }

            const filteredProducts = productsData.products
              .filter((product) => product.id !== parseInt(productId))
              .slice(0, 4);

            if (filteredProducts.length === 0) {
              relatedProductsContainer.innerHTML = '<p>No featured products available.</p>';
              return;
            }

            relatedProductsContainer.innerHTML = filteredProducts
              .map((product) => {
                return `
                  <div class="related-product">
                    <a href="/products/${product.handle}">
                      <img src="${product.images[0]?.src || ''}" alt="${product.title}">
                    </a>
                    <div class="related-product-title">${product.title}</div>
                    <button onclick="addToCart(${product.variants[0].id})">
                      Add to Cart
                      <i class="fas fa-shopping-cart" style="margin-left: 8px"></i>
                    </button>
                  </div>
                `;
              })
              .join('');
          })
          .catch((error) => {
            relatedProductsContainer.innerHTML = '<p>Failed to load featured products.</p>';
            console.error('Error fetching featured products:', error);
          });
        return;
      }

      relatedProductsContainer.innerHTML = data.products
        .map((product) => {
          return `
            <div class="related-product">
              <a href="${product.url}">
                <img src="${product.featured_image}" alt="${product.title}">
              </a>
              <div class="related-product-title">${product.title}</div>
              <button onclick="addToCart(${product.variants[0].id})">
                Add to Cart
                <i class="fas fa-shopping-cart" style="margin-left: 8px"></i>
              </button>
            </div>
          `;
        })
        .join('');
    })
    .catch((error) => {
      relatedProductsContainer.innerHTML = '<p>Failed to load recommendations.</p>';
      console.error('Error fetching recommendations:', error);
    });
});

// Add to Cart function
function addToCart(variantId) {
  fetch('/cart/add.js', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: variantId, quantity: 1 }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Failed to add product to cart.');
      }
      return response.json();
    })
    .then(() => {
      alert('Product added to cart!');
    })
    .catch((error) => {
      console.error('Error adding to cart:', error);
      alert('Failed to add product to cart. Please try again.');
    });
}
