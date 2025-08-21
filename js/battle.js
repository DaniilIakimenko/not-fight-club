import { avatars, heroes } from './config.js';
import { checkRegister, getAvatar, getCurrentEnemy, getRandomEnemy, saveCurrentEnemy, saveDefeatedEnemies, getDefeatedEnemies } from './storage.js'

checkRegister();

// Устанавливаем аватар персонажа по индексу из ls
const setupAvatar = () => {
  const avatarWrapper = document.getElementById('characterImgWrapper');
  const index = getAvatar();
  const img = document.createElement('img');
  img.src = avatars[index];
  img.className = 'character-img'

  avatarWrapper.appendChild(img);
}

setupAvatar();

// Отображаем hp персонажа (в будущем объединить с аватаром, сделав полноценный выбор персонажа с разными хар-ми)
const renderHero = (hero) => {
  document.querySelector('#characterHp').textContent = `${hero.currentHp}/${hero.maxHp}`;
}

renderHero(heroes[0]);

let currentEnemy = null;

// Инициализируем бой
const initBattle = () => {
  currentEnemy = getCurrentEnemy();

  if (!currentEnemy) {
    currentEnemy = getRandomEnemy();

    if (currentEnemy) {
      saveCurrentEnemy(currentEnemy);
    }
  }

  if (currentEnemy) {
    renderEnemy(currentEnemy);
  } else {
    showVictoryMessage();
  }
}

// Победа над врагом
const onEnemyDefeated = () => {
  const defeatedEnemies = getDefeatedEnemies();
  defeatedEnemies.push(currentEnemy.id);
  saveDefeatedEnemies(defeatedEnemies);

  currentEnemy = getRandomEnemy();
  if (currentEnemy) {
    saveCurrentEnemy(currentEnemy);
    renderEnemy(currentEnemy);
  } else {
    showVictoryMessage();
  }
}

// Отображаем врага
const renderEnemy = (enemy) => {
  document.querySelector('#enemyHp').textContent = `${enemy.currentHp}/${enemy.maxHp}`;
  document.querySelector('#enemyImg').src = enemy.avatar;

  updateHealthBar('enemy', enemy.currentHp, enemy.maxHp);
}

initBattle();