// main variables that used in code
const slideContainer = document.querySelector('.slide__container')
const rotateBlock = document.querySelector('.rotate__block');
const agreementButton = document.querySelector('.agree');
const nextSlideButton = document.querySelector('.arrow--next');
const prevSlideButton = document.querySelector('.arrow--prev');

// additional variables for timeout Ids
let nextButtonTimeout;
let prevButtonTimeout;
let lastSlideActionTimeout;

// additional variables for arrows
const hiddenArrowClass = 'hidden';
let nextArrowDelay = 2.5;

// additional varibles for slides
const totalSlideAmount = 16;
const pathNames = Array.from(
  { length: totalSlideAmount }, (_, i) => ({ count: i + 1, pathName:`./slides/slide--${i + 1}.html` })
);

// additional function for detecting correct font-size
function heightDetect(percent) {
  const height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

  return (percent * (height - 6)) / 100;
}
function widthDetect(percent) {
  const width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);

  return (percent * width) / 100;
}
function setResponsiveFontSize() {
  $('.slide__container').css({
    'font-size': `clamp(1px, ${heightDetect(0.925925)}px,${widthDetect(0.520833)}px)`
  });
  $('.arrows').css({
    'font-size': `clamp(1px, ${heightDetect(0.925925)}px,${widthDetect(0.520833)}px)`
  });
}

// function for action after last slide
function lastSlideAction() {
  let id = $('#presentation', window.parent.document).attr('data-id');
  let $url = $('#presentation', window.parent.document).attr('data-request-url');
  let href = $('#presentation', window.parent.document).attr('data-href');
  let $token = $('meta[name="csrf-token"]', window.parent.document).attr('content');
  $.ajaxSetup({
    headers: {
      'X-CSRF-TOKEN': $token
    }
  });
  $.ajax({
    type: "POST",
    url: $url,
    data: {"id": id},
    success: function (data) {
      if (data !== false) {
        parent.location.href = href;
      }
    },
    error: function (data) {
      console.log(data);
    }
  });
}

// function that animate number from 0 to correct num
function animateNumber(delay, className) {
  const allElements = document.querySelectorAll(`${className}[data-number]`);

  allElements.forEach(el => {
    const targetNumber = Number(el.getAttribute('data-number'));

    gsap.to(el, {
      duration: 2.5,
      innerHTML: targetNumber,
      delay,
      onUpdate: () => {
        el.innerHTML = Math.round(el.innerHTML);
      },
      onComplete: () => {
        el.innerHTML = targetNumber;
      }
    });
  });
}

// function that type text from scretch
function typewriterEffect(selector, duration, delay) {
  const el = document.querySelector(selector);
  const innerText = el.getAttribute('data-text');

  gsap.to(el, {
    duration: duration,
    text: innerText,
    ease: 'none',
    delay,
  });
}

// object that store manipulations with slides
const slideActions = {
  1: () => {
    $('.arrow--next').addClass('arrow--white');
    gsap.from('.slide--1__bottle', { opacity: 0, duration: 0.75, delay: 1, y: '35%', });
    gsap.from('.slide--1__right h1', { opacity: 0, duration: 0.75, delay: 1.5, x: '35%', });
    nextArrowDelay = 2.5;
  },
  2: () => {
    $('.arrow--prev').removeClass('arrow--white');
    $('.arrow--next').removeClass('arrow--white');

    $('.slide--2__content .triangle').on('click', function() {
      $(this).addClass('active');
      const target = $(this).data("el-to-open");

      if ($(`h3[data-el-index="${target}"]`).length) {
        gsap.to(`div[data-el-index="${target}"]`, { opacity: 1, duration: 0.75, delay: 0.75, x: '0' });
        gsap.to(`h3[data-el-index="${target}"]`, { opacity: 1, duration: 0.75, delay: 1.25, y: '0' });
      }

      gsap.to(`div[data-el-index="${target}"]`, { opacity: 1, duration: 0.75, delay: 0.75, x: '0' });

      if ($('.slide--2__content .triangle.active').length === 4) {
        nextButtonTimeout = setTimeout(() => {
          $(nextSlideButton).removeClass(hiddenArrowClass);
          $(prevSlideButton).removeClass(hiddenArrowClass);
        }, 2.5 * 1000);
      }
    });
  },
  3: () => {
    $('.arrow--prev').addClass('arrow--white');
    $('.arrow--next').addClass('arrow--white');

    $('.slide--3__block .triangle').on('click', function() {
      $(this).addClass('active');
      const target = $(this).data("el-to-open");

      gsap.to(`[data-el-index="${target}"]`, { opacity: 1, duration: 0.75, delay: 0.75, y: '0' });

      if ($('.slide--3__block .triangle.active').length === 6) {
        nextButtonTimeout = setTimeout(() => {
          $(nextSlideButton).removeClass(hiddenArrowClass);
          $(prevSlideButton).removeClass(hiddenArrowClass);
        }, 1.95 * 1000);
      }
    });
  },
  4: () => {
    $('.arrow--prev').removeClass('arrow--white');
    $('.arrow--next').removeClass('arrow--white');
    gsap.from('.slide--4__left h3', { opacity: 0, duration: 0.75, delay: 1, y: '25%', });
    gsap.from('.slide--4__left ul li.first', { opacity: 0, duration: 0.75, delay: 1.5, y: '20%', });
    gsap.from('.slide--4__left ul li.second', { opacity: 0, duration: 0.75, delay: 1.75, y: '20%', });
    gsap.from('.slide--4__left ul li.third', { opacity: 0, duration: 0.75, delay: 2, y: '20%', });
    gsap.from('.slide--4__block', { opacity: 0, duration: 0.75, delay: 2.65, y: '25%', });
    nextArrowDelay = 3.65;
  },
  5: () => {
    $('.arrow--prev').addClass('arrow--white');
    $('.slide--5 .plus').on('click', function() {
      $(this).addClass('active');
      $(this).fadeOut(400);

      const target = $(this).data("el-to-open");

      if ($(this).closest('.slide--5__left-block').length) {
        gsap.to(`p[data-el-index="${target}"]`, { opacity: 1, duration: 0.75, delay: 0.75, x: '0' });
        gsap.to(`h4[data-el-index="${target}"]`, { opacity: 1, duration: 0.75, delay: 1.2, y: '0' });
        gsap.to(`h5[data-el-index="${target}"]`, { opacity: 1, duration: 0.75, delay: 1.65, y: '0' });
        gsap.to(`ul[data-el-index="${target}"]`, { opacity: 1, duration: 0.75, delay: 2.1, y: '0' });
      } else {
        gsap.to(`img[data-el-index="${target}"]`, { opacity: 1, duration: 0.65, delay: 0.75, scale: 1 });
        gsap.to(`p[data-el-index="${target}"]`, { opacity: 1, duration: 0.65, delay: 0.75, x: '25' });
      }

      if ($('.slide--5 .plus.active').length === 6) {
        nextButtonTimeout = setTimeout(() => {
          $(nextSlideButton).removeClass(hiddenArrowClass);
          $(prevSlideButton).removeClass(hiddenArrowClass);
        }, 2.2 * 1000);
      }
    });
  },
  6: () => {
    $('.arrow--prev').removeClass('arrow--white');
    gsap.from('.slide--6__left ul li.first', { opacity: 0, duration: 0.75, delay: 1, y: '28%', });
    gsap.from('.slide--6__left ul li.second', { opacity: 0, duration: 0.75, delay: 1.4, y: '28%', });
    gsap.from('.slide--6__left ul li.third', { opacity: 0, duration: 0.75, delay: 1.8, y: '28%', });
    gsap.from('.slide--6__left ul li.fourth', { opacity: 0, duration: 0.75, delay: 2.2, y: '28%', });
    gsap.from('.slide--6__left ul li.fifth', { opacity: 0, duration: 0.75, delay: 2.6, y: '28%', });
    gsap.from('.slide--6__left ul li.sixth', { opacity: 0, duration: 0.75, delay: 3, y: '28%', });
    gsap.from('.slide--6__left ul li.seventh', { opacity: 0, duration: 0.75, delay: 3.4, y: '28%', });
    gsap.from('.slide--6__left ul li.eight', { opacity: 0, duration: 0.75, delay: 3.8, y: '28%', });
    gsap.from('.slide--6__left ul li.nineth', { opacity: 0, duration: 0.75, delay: 4.2, y: '28%', });
    gsap.from('.slide--6__left ul li.tenth', { opacity: 0, duration: 0.75, delay: 4.6, y: '28%', });
    gsap.from('.slide--6__left ul li.elventh', { opacity: 0, duration: 0.75, delay: 5, y: '28%', });
    gsap.from('.slide--6__left ul li.twelve', { opacity: 0, duration: 0.75, delay: 5.4, y: '28%', });
    gsap.from('.slide--6__left ul li.thirteen', { opacity: 0, duration: 0.75, delay: 5.8, y: '28%', });
    gsap.from('.slide--6__left ul li.fourteen', { opacity: 0, duration: 0.75, delay: 6.2, y: '28%', });
    gsap.from('.slide--6__left ul li.fifteen', { opacity: 0, duration: 0.75, delay: 6.6, y: '28%', });
    gsap.from('.slide--6__left ul li.sixteen', { opacity: 0, duration: 0.75, delay: 7, y: '28%', });
    nextArrowDelay = 8;
  },
  7: () => {
    $('.arrow--prev').addClass('arrow--white');
    $('.slide--7__block img.icon').on('click', function() {
      $(this).closest('.slide--7__block').addClass('active');

      gsap.to($(this).closest('.slide--7__block').find('.slide--7__subblock.first'), { opacity: 1, duration: 0.75, delay: 0.75, y: '0' });
      gsap.to($(this).closest('.slide--7__block').find('.slide--7__subblock.second'), { opacity: 1, duration: 0.75, delay: 1.15, y: '0' });
      gsap.to($(this).closest('.slide--7__block').find('.slide--7__subblock.third'), { opacity: 1, duration: 0.75, delay: 1.55, y: '0' });

      if ($('.slide--7__block.active').length === 2) {
        nextButtonTimeout = setTimeout(() => {
          $(nextSlideButton).removeClass(hiddenArrowClass);
          $(prevSlideButton).removeClass(hiddenArrowClass);
        }, 2.55 * 1000);
      }
    })
  },
  8: () => {
    $('.arrow--prev').removeClass('arrow--white');
    $('.slide--8__left-block .plus').on('click', function() {
      $(this).addClass('active');
      $(this).fadeOut(400);

      const target = $(this).data("el-to-open");

      gsap.to(`img[data-el-index="${target}"]`, { opacity: 1, duration: 0.65, delay: 0.75, scale: 1 });
      gsap.to(`p[data-el-index="${target}"]`, { opacity: 1, duration: 0.65, delay: 0.75, x: '25' });

      if ($('.slide--8__left-block .plus.active').length === 5) {
        nextButtonTimeout = setTimeout(() => {
          $(nextSlideButton).removeClass(hiddenArrowClass);
          $(prevSlideButton).removeClass(hiddenArrowClass);
        }, 2 * 1000);
      }
    });
  },
  9: () => {
    $('.arrow--prev').addClass('arrow--white');
    $('.arrow--next').removeClass('arrow--white');
    $('.slide--9__left-block').on('click', function () {
      $(this).addClass('active')
      gsap.to($(this).find('p'), { opacity: 1, duration: 0.65, delay: 0.75, y: '0' });

      if ($('.slide--9__left-block.active').length === 4) {
        nextButtonTimeout = setTimeout(() => {
          $(nextSlideButton).removeClass(hiddenArrowClass);
          $(prevSlideButton).removeClass(hiddenArrowClass);
        }, 2 * 1000);
      }
    })
  },
  10: () => {
    $('.arrow--prev').addClass('arrow--white');
    $('.arrow--next').addClass('arrow--white');
    animateNumber(1, '.slide--10__block p.num span');
    nextArrowDelay = 4.2;
  },
  11: () => {
    $('.arrow--prev').removeClass('arrow--white');
    $('.arrow--next').removeClass('arrow--white');
    gsap.from('.slide--11__left ul li.first', { opacity: 0, duration: 0.75, delay: 1, y: '28%', });
    gsap.from('.slide--11__left ul li.second', { opacity: 0, duration: 0.75, delay: 1.4, y: '28%', });
    gsap.from('.slide--11__left ul li.third', { opacity: 0, duration: 0.75, delay: 1.8, y: '28%', });
    gsap.from('.slide--11__left ul li.fourth', { opacity: 0, duration: 0.75, delay: 2.2, y: '28%', });
    gsap.from('.slide--11__right-block .line', { opacity: 0, duration: 0.75, delay: 1, scaleY: 0, transformOrigin: 'top' });
    gsap.from('.slide--11__right-block .circle', { opacity: 0, duration: 0.75, delay: 1.75, scale: 0 });
    gsap.from('.slide--11__right-block p', { opacity: 0, duration: 0.75, delay: 2.25, x: '35%' });
    nextArrowDelay = 3.2;
  },
  12: () => {
    $('.arrow--prev').removeClass('arrow--white');
    $('.arrow--next').removeClass('arrow--white');
    $('.slide--12__block .plus').on('click', function() {
      $(this).addClass('active');
      $(this).fadeOut(400);

      const target = $(this).data("el-to-open");

      gsap.to(`img[data-el-index="${target}"]`, { opacity: 1, duration: 0.65, delay: 0.75, scale: 1 });
      gsap.to(`p[data-el-index="${target}"]`, { opacity: 1, duration: 0.65, delay: 0.75, x: '25' });

      if ($('.slide--12__block .plus.active').length === 4) {
        nextButtonTimeout = setTimeout(() => {
          $(nextSlideButton).removeClass(hiddenArrowClass);
          $(prevSlideButton).removeClass(hiddenArrowClass);
        }, 2 * 1000);
      }
    });
  },
  13: () => {
    $('.arrow--prev').addClass('arrow--white');
    $('.slide--13__block img.sign').on('click', function () {
      const mainBlock = $(this).closest('.slide--13__block');
      mainBlock.addClass('active')
      const modifier = mainBlock
        .attr('class')
        .split(' ')
        .find(cls => ['first', 'second', 'third'].includes(cls));

      gsap.to(mainBlock.find('h4'), { opacity: 1, duration: 0.75, delay: 0.75, y: '0' });
      gsap.to(mainBlock.find('h5'), { opacity: 1, duration: 0.75, delay: 1.25, });

      typewriterEffect(`.slide--13__block.${modifier} .text p`, 2.5, 1.75);

      if ($('.slide--13__block.active').length === 3) {
        nextButtonTimeout = setTimeout(() => {
          $(nextSlideButton).removeClass(hiddenArrowClass);
          $(prevSlideButton).removeClass(hiddenArrowClass);
        }, 4.1 * 1000);
      }
    })
  },
  14: () => {
    $('.arrow--prev').removeClass('arrow--white');
    $('.slide--14__block .plus').on('click', function() {
      $(this).addClass('active');
      $(this).fadeOut(400);

      const target = $(this).data("el-to-open");

      gsap.to(`img[data-el-index="${target}"]`, { opacity: 1, duration: 0.65, delay: 0.75, scale: 1 });
      gsap.to(`p[data-el-index="${target}"]`, { opacity: 1, duration: 0.65, delay: 0.75, x: '25' });

      if ($('.slide--14__block .plus.active').length === 3) {
        nextButtonTimeout = setTimeout(() => {
          $(nextSlideButton).removeClass(hiddenArrowClass);
          $(prevSlideButton).removeClass(hiddenArrowClass);
        }, 2 * 1000);
      }
    });
  },
  15: () => {
    clearTimeout(lastSlideActionTimeout);
    gsap.from('.slide--15__right-block .line', { opacity: 0, duration: 0.75, delay: 1, scaleY: 0, transformOrigin: 'top' });
    gsap.from('.slide--15__right-block .circle', { opacity: 0, duration: 0.75, delay: 1.75, scale: 0 });
    gsap.from('.slide--15__right-block p', { opacity: 0, duration: 0.75, delay: 2.15, x: '35%' });
    gsap.from('.slide--15__right img.newborn', { opacity: 0, duration: 0.75, delay: 2.65, scale: 0, filter: 'blur(10px)', ease: 'power2.out' });
    nextArrowDelay = 3.65;
  },
  16: () => {
    gsap.from('.slide--16__block.first', { opacity: 0, duration: 0.75, delay: 1, y: '35%', });
    gsap.from('.slide--16__plus', { opacity: 0, duration: 0.75, delay: 1.4, y: '35%', });
    gsap.from('.slide--16__block.second', { opacity: 0, duration: 0.75, delay: 1.8, y: '35%', });
    gsap.from('.slide--16__block.third', { opacity: 0, duration: 0.75, delay: 2.5, y: '35%', });
    lastSlideActionTimeout = setTimeout(() => {
      lastSlideAction();
    }, 7.5 * 1000);
  },
}
// function that add animation for element
function animateSlide(slideNum = 1) {
  gsap.from('.slide', { opacity: 0, duration: 0.75 });

  slideActions[slideNum]();
}
// function that detect oriental of device
function updateRotateBlockVisibility() {
  const isPortrait = window.matchMedia('(orientation: portrait)').matches;

  $(rotateBlock).toggleClass('visible', isPortrait);
}
// function that load slide without reloading page
async function loadComponent(componentPathName, slideNum) {
  const response = await fetch(componentPathName);
  const data = await response.text();

  slideContainer.innerHTML = data;
  animateSlide(slideNum);
}
// function that update info about prev/next button
function updateNavigationButtons(currentSlide) {
  clearTimeout(nextButtonTimeout);
  clearTimeout(prevButtonTimeout);

  $(nextSlideButton).addClass(hiddenArrowClass);
  $(prevSlideButton).addClass(hiddenArrowClass);

  switch (currentSlide) {
    case 0:
      break;
    case 1:
      nextButtonTimeout = setTimeout(() => {
        $(nextSlideButton).removeClass(hiddenArrowClass);
      }, nextArrowDelay * 1000);
      break;
    case 2:
    case 3:
    case 5:
    case 7:
    case 8:
    case 9:
    case 12:
    case 13:
    case 14:
      break;
    case totalSlideAmount:
      $(prevSlideButton).removeClass(hiddenArrowClass);
      break;
    default:
      nextButtonTimeout = setTimeout(() => {
        $(nextSlideButton).removeClass(hiddenArrowClass);
        $(prevSlideButton).removeClass(hiddenArrowClass);
      }, nextArrowDelay * 1000);
  }
}
// function that change slide on the screen
async function changeSlide(direction) {
  const currentSlideNum = slideContainer.getAttribute('data-current-slide');

  let newSlideNum;

  if (direction === 'next') {
    newSlideNum = Number(currentSlideNum) + 1;
  } else if (direction === 'prev') {
    newSlideNum = Number(currentSlideNum) - 1;
  }

  const { pathName } = pathNames.find(pathNameInfo => pathNameInfo.count === +newSlideNum);

  await loadComponent(pathName, newSlideNum);

  slideContainer.setAttribute('data-current-slide', newSlideNum);
  updateNavigationButtons(newSlideNum);
}

//window and document listeners
$(document).ready(function () {
  setResponsiveFontSize();
  updateRotateBlockVisibility();
});
$(window).on('resize', function () {
  setResponsiveFontSize();
  updateRotateBlockVisibility();
});
$(window).on('orientationchange', function () {
  updateRotateBlockVisibility();
});

// button listeners
$(agreementButton).on('click', () => {
  loadComponent(pathNames[0].pathName);
  slideContainer.setAttribute('data-current-slide', 1);
  updateNavigationButtons(1);
});
$(nextSlideButton).on('click', () => {
  changeSlide('next')
})
$(prevSlideButton).on('click', () => {
  changeSlide('prev')
});
