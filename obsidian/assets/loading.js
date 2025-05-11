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

        heroContent.classList.add('hidden');
        setTimeout(() => {
          heroContent.style.display = 'none';
          mainContent.style.display = 'block';
          requestAnimationFrame(() => {
            mainContent.classList.add('shown');
          });
        }, 500);
      });
    }
  }

  const hamburgerMenu = document.getElementById('hamburger-menu');
  if (hamburgerMenu) {
    hamburgerMenu.addEventListener('click', () => {
      const sidebar = document.getElementById('sidebar');
      if (sidebar) {
        sidebar.classList.toggle('open');
      }
    });
  }
});
