import { avatars, heroes, BATTLE_CONFIG } from './config.js';
import { checkRegister, getAvatar, saveHero, getHero, getCurrentEnemy, getRandomEnemy, saveCurrentEnemy, saveDefeatedEnemies, getDefeatedEnemies } from './storage.js'

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

let currentEnemy = null;

// Инициализируем бой
const initBattle = () => {
  renderHero(heroes[0]);
  saveHero(heroes[0]);

  setupCheckboxLimits('.attack-checkbox', BATTLE_CONFIG.maxAttackZones, true);
  setupCheckboxLimits('.defense-checkbox', BATTLE_CONFIG.maxDefenseZones, true);

  updateAttackButtonState();

  const isBattleStarted = localStorage.getItem('battleStarted') === 'true';

  currentEnemy = getCurrentEnemy();

  if (!currentEnemy || !isBattleStarted) {
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

// Устанавливаем максимум для выбора зон атаки и защиты
const setupCheckboxLimits = (checkboxSelector, maxCount, updateAttackButton) => {
  const checkboxes = document.querySelectorAll(checkboxSelector);

  checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', () => {
      const checkedCount = document.querySelectorAll(`${checkboxSelector}:checked`).length;

      checkboxes.forEach(cb => {
        cb.disabled = checkedCount >= maxCount && !cb.checked;
      })

      if (updateAttackButton) {
        updateAttackButtonState();
      }
    })
  })
}

// Проверяем кнопку атаки
const updateAttackButtonState = () => {
  const attackChecked = document.querySelectorAll('.attack-checkbox:checked').length;
  const defenseChecked = document.querySelectorAll('.defense-checkbox:checked').length;
  const attackButton = document.querySelector('.attack-btn');

  const canAttack = attackChecked === BATTLE_CONFIG.maxAttackZones && defenseChecked === BATTLE_CONFIG.maxDefenseZones;

  attackButton.disabled = !canAttack;
  attackButton.classList.toggle('.disabled-btn', !canAttack);
}

initBattle();