document.addEventListener('DOMContentLoaded', () => {
  const heroTextWrapper = document.querySelector('.hero-text-wrapper');
  if (heroTextWrapper) {
    const text = heroTextWrapper.getAttribute('data-hero-title');
    heroTextWrapper.innerHTML = text
      .split('')
      .map((letter, index) => {
        if (letter === ' ') {
          return `<span class="space" style="--index: ${index}">&nbsp;</span>`; // Add a span for spaces
        }
        return `<span style="--index: ${index}">${letter}</span>`;
      })
      .join('');
  }
});
