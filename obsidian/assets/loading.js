document.addEventListener('DOMContentLoaded', () => {
  const heroTextWrapper = document.querySelector('.loading-text-wrapper');
  const loadingContent = document.querySelector('.loading-content');
  const mainContent = document.querySelector('.main-content');
  const htmlContainer = document.querySelector('html');
  const productGridContainer = document.querySelector('.product-grid-container');

  if (loadingContent) {
    const text = heroTextWrapper.getAttribute('data-loading-title');
    heroTextWrapper.innerHTML = text
      .split('')
      .map((letter, index) => {
        if (letter === ' ') {
          return `<span class="space" style="--index: ${index}">&nbsp;</span>`;
        }
        return `<span style="--index: ${index}">${letter}</span>`;
      })
      .join('');

    const spans = heroTextWrapper.querySelectorAll('span');
    if (spans.length > 0) {
      const lastSpan = spans[spans.length - 1];

      lastSpan.addEventListener('animationend', () => {
        loadingContent.classList.add('hidden');
        setTimeout(() => {
          loadingContent.style.display = 'none';
          if (mainContent) mainContent.style.display = 'block';
          if (productGridContainer) productGridContainer.style.display = 'block';
          if (htmlContainer) htmlContainer.style.overflow = 'auto';

          requestAnimationFrame(() => {
            if (mainContent) mainContent.classList.add('shown');
          });
        }, 500);
      });
    }
  } else {
    // No loading content? Show everything immediately:
    if (mainContent) {
      mainContent.style.display = 'block';
      mainContent.classList.add('shown');
    }
    if (productGridContainer) {
      productGridContainer.style.display = 'block';
    }
    if (htmlContainer) {
      htmlContainer.style.overflow = 'auto';
    }
  }
});
