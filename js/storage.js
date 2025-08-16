import { avatars } from "./config.js";

export const saveCharName = () => {
  const name = document.getElementById('characterName').value;

  if (name.trim() === '') return alert ('Введите имя персонажа!');

  localStorage.setItem('characterName', name);
}

export const saveAvatar = (index) => {
  localStorage.setItem('avatar', index);
}

export const getAvatar = () => {
  const index = localStorage.getItem('avatar');
  return index !== null ? parseInt(index) : 0;
}

export const getAvatarUrl = (index) => {
  return avatars[index];
}

export const checkRegister = () => {
  const localName = localStorage.getItem('characterName');

  if (!localName) {
    window.location.href = '/register.html';
    return false;
  }

  return true;
}