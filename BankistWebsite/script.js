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

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// LECTURES

// LECTURE 197
// DOM review
// each element is represented as a node, which these nodes has multiple attributes like .textContent and others
// has multiple types such as elements, text, comment, document

// LECTURE 198
// Selecting, Creating, and Deleting Elements

// // selecting the whole document
// console.log(document.documentElement);
// console.log(document.head);
// console.log(document.body);

// // selecting certain elements
// const header = document.querySelector('.header');
// const allSections = document.querySelectorAll('.section');
// console.log(allSections); // returns a node list that returns all elements that are a section

// document.getElementById('section--1');
// const allButtons = document.getElementsByTagName('button'); // getting all elements which contain buttons
// console.log(allButtons); // returns an html collection, it updates automatically, whereas node list does not update automatically

// console.log(document.getElementsByClassName('btn')); // returns html collection too

// // Creating & inserting elements
// // we can use insert adjacent
// const message = document.createElement('div'); // not yet in the dom, it just represents the dom
// message.classList.add('cookie-message'); // add class
// message.innerHTML =
//   'We use cookies for improved functionality and analytics<button class="btn btn--close-cookie">Got it!</button>'; // write HTML
// // header.prepend(message); // inserting message which contains html code into header section as header's first child
// header.append(message); // same as prepend but as the last child

// // message is only inserted once, it cannot be at more than one place at the same time

// // header.prepend(message.cloneNode(true)); // to add in more than one place

// // before & after -> adds before / after header as sibling of header rather than a child of header

// // before
// header.before(message);

// // after
// // header.after(message);

// // delete elements
// document
//   .querySelector('.btn--close-cookie')
//   .addEventListener('click', function () {
//     message.remove(); // no need to do query selector again
//   });

// // message.parentElement.removeChild(message); -> old way of doing remove, does DOM traversing

// LECTURE 199
// Styles, Attributes and Classes

// // styles
// message.style.backgroundColor = '#37383d';
// message.style.width = '120%';

// // getting styles we set in this file (?)
// console.log(message.style.backgroundColor);

// // getting styles already set in css or non existent
// console.log(getComputedStyle(message).color); // .color is to take certain properties

// message.style.height =
//   Number.parseFloat(getComputedStyle(message).height, 10) + 30 + 'px';

// // document.documentElement.style.setProperty('--color-primary', 'orangered'); // changing properties in root

// // attributes
// const logo = document.querySelector('.nav__logo');
// console.log(logo.alt); // taking standard attributes of elements
// console.log(logo.src); // returns the absolute (real) url
// console.log(logo.getAttribute('src')); // relative url -> img / logo.png et cetera
// console.log(logo.className);

// // to take non standard attributes
// // console.log(logo.getAttribute('...'))

// // changing values of properties
// logo.alt = 'Beautiful minimalist logo';
// console.log(logo.alt);

// // creating attributes
// logo.setAttribute('company', 'Bankist');

// // data attributes
// // attributes that starts with the word data
// console.log(logo.dataset.versionNumber); // the words after 'data' written in camel case

// // classes
// // better work with this because it does not interfere existing class
// // logo.classList.add('');
// // logo.classList.remove('');
// // logo.classList.toggle('');
// // logo.classList.contains('');

// // dont use because will overwrite class
// // logo.className = 'jonas'

// LECTURE 200
// smooth scrolling

// old way
// const btnScrollTo = document.querySelector('.btn--scroll-to');
// const section1 = document.querySelector('#section--1');

// btnScrollTo.addEventListener('click', function (e) {
//   const s1coords = section1.getBoundingClientRect(); // getting the coordinates
//   console.log(s1coords);
//   console.log(e.target.getBoundingClientRect);
//   console.log('Current scroll (X/Y)', window.pageXOffset, window.pageYOffset);
//   console.log(
//     'height/width viewport',
//     document.documentElement.clientHeight,
//     document.documentElement.clientWidth
//   );

//   // scrolling -> pass the left and then top value
//   // window.scrollTo(
//   //   s1coords.left + window.pageXOffset, // added the distance according to the current scroll position
//   //   s1coords.top + window.pageYOffset
//   // );

//   // window.scrollTo({
//   //   left: s1coords.left + window.pageXOffset, // added the distance according to the current scroll position
//   //   top: s1coords.top + window.pageYOffset,
//   //   behavior: 'smooth',
//   // });

//   // modern (way easier and straight forward)
//   section1.scrollIntoView({ behavior: 'smooth' });
// });

// LECTURE 201
// an event is a signal from the DOM that something is happening, either a click, user triggering full screen

// // mouse enter event (similar to hover)
// const h1 = document.querySelector('h1');

// const alerth1 = function (e) {
//   alert('addEventListener : Great! You are reading the heading :D');
//   // h1.removeEventListener('mouseenter', alerth1); // removing event listener
// };
// h1.addEventListener('mouseenter', alerth1);
// setTimeout(() => h1.removeEventListener('mouseenter', alerth1), 3000);

// // https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Events

// // another way of attaching an event listener but now we usually always use addEventListener
// // h1.onmouseenter = function (e) {
// //   alert('addEventListener : Great! You are reading the heading :D');
// // };

// // addEventListener allows us to use multiple events
// // we can remove an event handler when not needed anymore

// // we can also use events directly in html like onclick on h1 tag

// LECTURE 202
// bubbling and capturing
// events are generated at the root element
// capturing -> event travels from root to the target elements, so it passes through the parents element
// target -> events handled right at the target by event listener for example which then will run the callback function
// bubbling -> event then travels back to the root, passing by the parents elements not the sibling
// it is as if the events happened in the parent elements too
// this will allow us to do very powerful patterns
// not all events have capture and bubble phase
// also called event propagating from one element to the next

// LECTURE 203
// event propagation in practice
// const randomInt = (min, max) =>
//   Math.floor(Math.random() * (max - min + 1) + min);
// const randomColor = () =>
//   `rgb(${randomInt(0, 255)}, ${randomInt(0, 255)}, ${randomInt(0, 255)})`;
// console.log(randomColor());

// document.querySelector('.nav__link').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
//   console.log('LINK', e.target, e.currentTarget);

//   // Stop propagation
//   // e.stopPropagation(); // 2 parent elements will never received the event because the event wont arrive
//   // not a good idea to stop a propagation
// });

// document.querySelector('.nav__links').addEventListener('click', function (e) {
//   // clicked an individual link will also affect this block
//   this.style.backgroundColor = randomColor(); // the link will also get a new color, because both event handlers are handling the same event, it will bubble up fromt the child to the parent element too
//   console.log('LINK', e.target, e.currentTarget);
// });

// document.querySelector('.nav').addEventListener(
//   'click',
//   function (e) {
//     this.style.backgroundColor = randomColor();
//     console.log('LINK', e.target, e.currentTarget);
//   }
//   // true // to capture event in the first phase which is capturing
// );

// // all the target is  where the event first happens
// // e.currentTarget and this keyword will be the same (different for each element)
// // so event propagation is like the event will move travelling the elements
// // therefore, triggering the event listener
// // event listener wont be capturing events when event first travels down from root to the target
// // bubbling can be used for event delegation

// LECTURE 205
// selecting an element based on another element
// for example trying on h1
// const h1 = document.querySelector('h1');

// // going downwards (child elements)
// // first way is using query selector
// // it would go down deep as necessary, not only the direct children of h1
// console.log(h1.querySelectorAll('.highlight'));
// console.log(h1.childNodes); // now this one only takes direct children
// console.log(h1.children);
// h1.firstElementChild.style.color = 'white'; // taking the first element of the child (span.highlight)
// h1.lastElementChild.style.color = 'white';

// // going upwards (parent elements)
// console.log(h1.parentNode);
// console.log(h1.parentElement);

// // taking the one not a direct parent
// h1.closest('.header').style.background = 'var(--gradient-secondary)';
// h1.closest('h1').style.background = 'var(--gradient-primary)';

// // query selector finds children
// // closest finds parents

// // going sideways (in JS we are only able to access direct sibling)
// console.log(h1.previousElementSibling);
// console.log(h1.nextElementSibling);

// // if we need all sibling, go to parent and read all the siblings from there
// console.log(h1.parentElement.children);
// [...h1.parentElement.children].forEach(function (el) {
//   if (el !== h1) el.style.transform = 'scale(0.5)';
// });

// LECTURE 206
// tabbed component

// LECTURE 215
// events that occur in the DOM during a webpage's life cycle

// DOM content loaded -> fired by document as soon as HTML is parsed (HTML downloaded and executed)
// does not wait for external resources to load (only waits for HTML & JS)
document.addEventListener('DOMContentLoaded', function (e) {
  console.log('HTML parsed and DOM tree built!', e);
});

// window load -> full content loaded
window.addEventListener('load', function (e) {
  console.log('Page fully loaded', e);
});

// checkout the network tab (beside console)

// before unload
// window.addEventListener('beforeunload', function (e) {
//   e.preventDefault();
//   console.log(e);
//   e.returnValue = '';
// });

// LECTURE 216
// efficient script loading (defer & async)
// loading a JS script in HTML
// we always use the regular way which is <script src="script.js"></script>
// but for async and defer we insert both the words after the word "script", so its like -> script async / defer src="script.js"

// regular -> when script put in head, script is fetched and executed and then html finished parsing -> not ideal
// that is why we usually add at the end, so parsing completed, script fetched, script executed

// async -> when put in the head, script is loaded at the same time HTML is parsed, but HTML parsing stops for execution, then continues again
// DOMContentLoaded does not wait for an async script to finish loading

// defer -> when put in the head, script is fetched at the same time as HTML parsing, but then executed after parsing is finished so HTML parsing is not disturbed
// DOMContentLoaded event fires after defer script is executed
// guarantees scripts are actually executed in the order that they are declared

// only modern browsers support async and defer
// this is actually an HTML5 feature not js
