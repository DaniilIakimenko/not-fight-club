import { saveAvatar, getAvatar, checkRegister } from './storage.js';
import { avatars } from './config.js';

checkRegister();

// Устанавливаем имя персонажа
const setName = () => {
  const displayName = document.querySelector('#character-name span');

  displayName.innerHTML = localStorage.getItem('characterName');
}

setName();


// Слайдер для выбора аватара
const slider = document.getElementById('characterSlider');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

export let currentIndex = 0;

const setupSlides = () => {
  avatars.forEach((imageUrl, index) => {
    const img = document.createElement('img');
    img.src = imageUrl;
    img.className = 'character-img';
    img.dataset.index = index;
    img.alt = `slide ${index + 1}`;

    slider.appendChild(img);
  })

  const firstClone = slider.firstElementChild.cloneNode(true);
  const lastClone = slider.lastElementChild.cloneNode(true);

  slider.appendChild(firstClone);
  slider.insertBefore(lastClone, slider.firstChild);
}

const initSlider = () => {
  currentIndex = getAvatar();

  const slideWidth = slider.firstElementChild.offsetWidth;

  slider.style.transition = 'none';
  slider.style.translate = `-${slideWidth * (currentIndex + 1)}px`;
}

const goToPrevSlide = () => {
  const slideWidth = slider.firstElementChild.offsetWidth;

  currentIndex--;
  slider.style.transition = `translate 0.5s ease-in-out`;
  slider.style.translate = `-${slideWidth * (currentIndex + 1)}px`;

  slider.addEventListener(
    'transitionend',
    () => {
      if (currentIndex < 0) {
        currentIndex = avatars.length - 1;
        slider.style.transition = 'none';
        slider.style.translate = `-${slideWidth * (currentIndex + 1)}px`;
      }
    },
    { once: true }
  )
}

const goToNextSlide = () => {
  const slideWidth = slider.firstElementChild.offsetWidth;

  currentIndex++;
  slider.style.transition = `translate 0.5s ease-in-out`;
  slider.style.translate = `-${slideWidth * (currentIndex + 1)}px`;

  if (currentIndex >= avatars.length) {
    nextBtn.disabled = true;
  }

  slider.addEventListener(
    'transitionend',
    () => {
      if (currentIndex >= avatars.length) {
        currentIndex = 0;
        slider.style.transition = 'none';
        slider.style.translate = `-${slideWidth * (currentIndex + 1)}px`;
        nextBtn.disabled = false;
      }
    },
    { once: true }
  )
}

nextBtn.addEventListener('click', goToNextSlide);
prevBtn.addEventListener('click', goToPrevSlide);

setupSlides();
initSlider();

window.addEventListener('resize', initSlider);
// Конец слайдера

// Кнопка сохранения аватара
document.getElementById('btnAvatar').addEventListener('click', () => {
  saveAvatar(currentIndex);
})