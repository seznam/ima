const IS_ACTIVE_CLASS = 'is-active';

window.addEventListener('load', () => {
  var burger = document.querySelector('.navbar-burger');
  if (burger) {
    burger.addEventListener('click', event => {
      event.preventDefault();
      const target = document.getElementById(burger.dataset.target);

      if (target) {
        burger.classList.toggle(IS_ACTIVE_CLASS);
        target.classList.toggle(IS_ACTIVE_CLASS);
      }
    });
  }
});
