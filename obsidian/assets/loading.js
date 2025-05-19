document.addEventListener('DOMContentLoaded', () => {
  const heroTextWrapper = document.querySelector('.loading-text-wrapper');

  if (heroTextWrapper) {
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
        const heroContent = document.querySelector('.loading-content');
        const mainContent = document.querySelector('.main-content');
        const htmlContainer = document.querySelector('html');
        const productGridContainer = document.querySelector('.product-grid-container');

        heroContent.classList.add('hidden');
        setTimeout(() => {
          heroContent.style.display = 'none';
          mainContent.style.display = 'block';
          productGridContainer.style.display = 'block';
          htmlContainer.style.overflow = 'auto';

          requestAnimationFrame(() => {
            mainContent.classList.add('shown');
          });
        }, 500);
      });
    }
  }
});
