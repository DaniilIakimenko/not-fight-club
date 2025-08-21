import { avatars, enemies } from "./config.js";

// Сохраняем имя персонажа
export const saveCharName = () => {
  const name = document.querySelector('[data-name]').value;

  if (name.trim() === '') return alert ('Введите имя персонажа!');

  localStorage.setItem('characterName', name);
}

// Работа с аватаркой персонажа
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


// Проверка наличия имени персонажа в ls
export const checkRegister = () => {
  const localName = localStorage.getItem('characterName');

  if (!localName) {
    window.location.href = '/register.html';
  } else if (localName && window.location.href.includes('/register.html')) {
    window.location.href = '/index.html';
  }
}

// Работа с врагами
export const saveCurrentEnemy = (enemy) => {
  localStorage.setItem('currentEnemy', JSON.stringify(enemy));
}

export const getCurrentEnemy = () => {
  const enemyData = localStorage.getItem('currentEnemy');

  return enemyData ? JSON.parse(enemyData) : null;
}

export const saveDefeatedEnemies = (defeatedIds) => {
  localStorage.setItem('defeatedEnemies', JSON.stringify(defeatedIds));
}

export const getDefeatedEnemies = () => {
  const defeated = localStorage.getItem('defeatedEnemies');

  return defeated ? JSON.parse(defeated) : [];
}

export const getRandomEnemy = () => {
  const defeatedIds = getDefeatedEnemies();
  const availableEnemies = enemies.filter(enemy => !defeatedIds.includes(enemy.id));

  if (availableEnemies.length === 0) {
    return null;
  }

  const randomIndex = Math.floor(Math.random() * availableEnemies.length);
  
  return {...availableEnemies[randomIndex]};
}