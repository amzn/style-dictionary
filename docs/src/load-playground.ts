import '@shoelace-style/shoelace/dist/themes/dark.css';

document.documentElement.classList.add('sl-theme-dark');

// Conditionally load the sd-playground Web Component definition if we find an instance of it.
const firstPlaygroundEl = document.querySelector('sd-playground');

if (firstPlaygroundEl) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        import('./components/sd-playground.ts');
      }
    });
  });
  observer.observe(firstPlaygroundEl);
}
