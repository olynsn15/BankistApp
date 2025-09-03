'use strict';

///////////////////////////////////////

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const nav = document.querySelector('.nav');
const tabs = document.querySelectorAll('.operations__tab'); // this is each of the buttons
const tabsContainer = document.querySelector('.operations__tab-container'); // button container
const tabsContent = document.querySelectorAll('.operations__content'); // contents

// MODAL WINDOW
const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

// BUTTON SCROLLING
btnScrollTo.addEventListener('click', function (e) {
  const s1coords = section1.getBoundingClientRect(); // getting the coordinates
  console.log(s1coords);
  console.log(e.target.getBoundingClientRect);
  console.log('Current scroll (X/Y)', window.pageXOffset, window.pageYOffset);
  console.log(
    'height/width viewport',
    document.documentElement.clientHeight,
    document.documentElement.clientWidth
  );

  // scrolling -> pass the left and then top value
  // window.scrollTo(
  //   s1coords.left + window.pageXOffset, // added the distance according to the current scroll position
  //   s1coords.top + window.pageYOffset
  // );

  // window.scrollTo({
  //   left: s1coords.left + window.pageXOffset, // added the distance according to the current scroll position
  //   top: s1coords.top + window.pageYOffset,
  //   behavior: 'smooth',
  // });

  // modern (way easier and straight forward)
  section1.scrollIntoView({ behavior: 'smooth' });
});

// PAGE NAVIGATION
// document.querySelectorAll('.nav__link').forEach(function (el) {
//   el.addEventListener('click', function (e) {
//     e.preventDefault();
//     const id = this.getAttribute('href');
//     console.log(id);
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });

//     // but the code above is not really efficient for lots of elements
//     // we use event delegation
//     // we put the event listener on a parent?
//   });
// });

// 1. add event listener to common parent element
// 2. determine what element originated the event

document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();

  // matching strategy
  // current target is the parent that owns the listener
  // target is the element clicked
  // so the child element is clicked, event bubbles up and reaches the parent, function runs, prevent default runs, then checking and run the scrollIntoView
  // https://chatgpt.com/share/68ab2bc5-560c-8008-9ce6-6141d11dc98d

  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

// TABBED COMPONENT
tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab'); // when clicking on the numbers which is a span, using this closest method it will search for the nearest operations__tab element (which is the button)

  // guard clause for clicking in the empty area between buttons
  if (!clicked) return;

  // remove active classes
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));
  clicked.classList.add('operations__tab--active');

  // active tab
  // activate content area
  // attributes that starts with the word data
  // the idea is always similar to add and remove active classes
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active'); // changing the display property from none to another
});

// MENU FADE ANIMATION
const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    // we dont use closest because there is no child class that can be accidentally clicked
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

// use mouseover because it will bubble up
// bind returns a new function with the this keyword being the opacity
// will work on a certain event because this is just the same as usual event listener
// .bind(0.5) creates a new function where this is permanently set to 0.5
// it gets e from the event listener
nav.addEventListener('mouseover', handleHover.bind(0.5));

// undo what we did in mouseover
nav.addEventListener('mouseout', handleHover.bind(1));

// STICKY NAVIGATION
// old way

// Element.getBoundingClientRect() is a DOM method that tells you where an element is on the screen and how big it is, relative to the viewport
// const initialCoords = section1.getBoundingClientRect();

// but this is actual a bad performance because scroll events happens all the time
// window.addEventListener('scroll', function (e) {
//   console.log(window.scrollY);

//   if (window.scrollY > initialCoords.top) nav.classList.add('sticky');
//   else nav.classList.remove('sticky');
// });

// intersection oberserver API
// observes changes to the way that a certain target element intersect another element or the viewport
// when 10% of the elements is visible, the function will run
// *section 1 is the features section not the hero
// const obsCallback = function (entries, observer) {
//   // so whenever section 1 intersects with the viewport as much as 10%, the function will execute
//   entries.forEach(entry => {
//     console.log(entry);
//   });
// };

// const obsOptions = {
//   root: null, // this means section 1 is intersecting with the viewport
//   threshold: [0, 0.2], // we can have multiple threshold written as an array
//   // this array means that function will be called when element is out of view and entering the view too
// };

// const observer = new IntersectionObserver(obsCallback, obsOptions);

// // callback will be executed when the element we are observing intersects with the root & threshold we defined
// observer.observe(section1);

const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height; // returns a DOMRect object with properties

const stickyNav = function (entries) {
  const [entry] = entries;
  if (!entry.isIntersecting) nav.classList.add('sticky');
  // isIntersecting is one of the properties to know that the header is in the viewport or not, only when isIntersecting is 0, add the sticky class
  else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0, // when 0% of the header is visible, we want something to happen *btw this is just creating the options object directly
  rootMargin: `-${navHeight}px`, // adds space so it is as if the header ends a bit earlier, 90 is the height of the navigation bar
});

headerObserver.observe(header);
// we dont add unobserve because for navigation bar it always needs to be observed

// REVEAL SECTIONS
const allSections = document.querySelectorAll('.section');

const revealSection = function (entries, observer) {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    entry.target.classList.remove('section--hidden');
    observer.unobserve(entry.target);
  });

  // the previous method of using const [entry] = entries wont work
  // that is because two sections intersected at the same time (or on reload both are inside the viewport at once), you’ll process only one of them and ignore the other.
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(function (section) {
  sectionObserver.observe(section);
  // section.classList.add('section--hidden');
});

// LAZY LOADING IMAGES
// getting images that has the property data-src?
// We select using img[data-src] because all lazy-loadable images are guaranteed to have data-src, but not all of them share the same CSS class
const imgTargets = document.querySelectorAll('img[data-src]');

const loadImg = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  // replace src with data-src
  entry.target.src = entry.target.dataset.src;

  // listening for the image loading event
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '50px', // the observer considers the image “intersecting” when it’s within 200px outside the visible screen
});

imgTargets.forEach(img => imgObserver.observe(img));

// SLIDER
const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');

  let curSlide = 0;
  const maxSlide = slides.length;

  // const slider = document.querySelector('.slider');
  // slider.style.transform = 'scale(0.4) translateX(-300px)';
  // slider.style.overflow = 'visible';

  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const activateDot = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    // checking first if it is the dot for the current slide
    // then adding the active class
    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  const goToSlide = function (slide) {
    // giving each slide a transform value
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`) // starting at 0, when we move to image 1, then image 0's index will be 0-1 = -1
    );
  };

  /*
    Example (3 slides, current = 0):
    Slide 0: (0 - 0) * 100 = 0% → centered.
    Slide 1: (1 - 0) * 100 = 100% → pushed right.
    Slide 2: (2 - 0) * 100 = 200% → further right.
  */

  // next slide
  const nextSlide = function () {
    if (curSlide === maxSlide - 1) {
      curSlide = 0; // returning back to the start
    } else {
      curSlide++; // increasing the index of the current slide as the button is pressed
    }

    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const prevSlide = function () {
    if (curSlide === 0) {
      // already reaches first image again
      curSlide = maxSlide - 1;
    } else {
      curSlide--;
    }

    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const init = function () {
    goToSlide(0); // starting at the first image
    createDots();
    activateDot(0); // activating dots
  };
  init();

  // event handlers
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') prevSlide();
    if (e.key === 'ArrowRight') nextSlide();
  });

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      curSlide = Number(e.target.dataset.slide);
      goToSlide(curSlide);
      activateDot(curSlide);
    }
  });
};
slider();
