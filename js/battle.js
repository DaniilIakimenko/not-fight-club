import { avatars } from './config.js';
import { checkRegister, getAvatar } from './storage.js'

checkRegister();

const setupAvatar = () => {
  const avatarWrapper = document.getElementById('characterImgWrapper');
  const index = getAvatar();
  const img = document.createElement('img');
  img.src = avatars[index];
  img.className = 'character-img'

  avatarWrapper.appendChild(img);
}

setupAvatar();