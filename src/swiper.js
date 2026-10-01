const mobileBreakpoint = window.matchMedia('(max-width: 767px)');
const sliders = [...document.querySelectorAll('.slider')].map(
  (element) => ({
    element,
    instance: null,
  })
);

function updateSliders() {
  sliders.forEach((slider) => {
    if (mobileBreakpoint.matches) {
      if (slider.instance) return;

      slider.instance = new Swiper(slider.element, {
        slidesPerView: 'auto',
        spaceBetween: 16,
        speed: 400,
        loop: false,

        pagination: {
          el: slider.element.querySelector('.swiper-pagination'),
          clickable: true,
        },
      });
    } else {
      if (!slider.instance) return;

      slider.instance.destroy(true, true);
      slider.instance = null;
    }
  });
}

updateSliders();

mobileBreakpoint.addEventListener('change', updateSliders);