document.addEventListener('DOMContentLoaded', () => {
  const heroTextWrapper = document.querySelector('.hero-text-wrapper');

  if (heroTextWrapper) {
    const text = heroTextWrapper.getAttribute('data-hero-title');
    heroTextWrapper.innerHTML = text
      .split('')
      .map((letter, index) => {
        if (letter === ' ') {
          return `<span class="space" style="--index: ${index}">&nbsp;</span>`;
        }
        return `<span style="--index: ${index}">${letter}</span>`;
      })
      .join('');

    setTimeout(() => {
      const spans = heroTextWrapper.querySelectorAll('span');
      if (spans.length > 0) {
        const lastSpan = spans[spans.length - 1];

        lastSpan.addEventListener('animationend', () => {
          const heroContent = document.querySelector('.hero-content');
          const newContent = `
            <h1 class="obsidian">OBSIDIAN</h1>
          `;
          heroContent.innerHTML = '';
          heroContent.innerHTML += newContent;
          heroContent.classList.add('fade-in');
        });
      }
    }, 3000);
  }
});
