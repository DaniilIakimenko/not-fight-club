import { avatars, heroes, BATTLE_CONFIG, ZONES } from './config.js';
import { checkRegister, getAvatar, saveHero, getHero, getCurrentEnemy, getRandomEnemy, saveCurrentEnemy, saveDefeatedEnemies, getDefeatedEnemies } from './storage.js'

checkRegister();

const attackButton = document.querySelector('.attack-btn');
const enemyAvatar = document.querySelector('#enemyImg');

let hero = getHero();
let currentEnemy = null;

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
  document.querySelector('.character-hp-bar').value = `${hero.currentHp}`;
}

// Инициализируем бой
const initBattle = () => {
  const isBattleStarted = localStorage.getItem('battleStarted') === 'true';
  
  if (!isBattleStarted) {
    saveHero(heroes[0]);
    renderHero(heroes[0]);
  } else {
    renderHero(hero);
  }

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

  setupCheckboxLimits('.attack-checkbox', BATTLE_CONFIG.maxAttackZones, true);
  setupCheckboxLimits('.defense-checkbox', BATTLE_CONFIG.maxDefenseZones, true);

  updateAttackButtonState();
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
    saveCurrentEnemy(currentEnemy);
  }
}

const showVictoryMessage = () => {
  const victoryMessage = document.createElement('div');
  victoryMessage.textContent = 'Все враги побеждены!'

  enemyAvatar.replaceWith(victoryMessage);
}

// Отображаем врага
const renderEnemy = (enemy) => {
  document.querySelector('#enemyHp').textContent = `${enemy.currentHp}/${enemy.maxHp}`;
  enemyAvatar.src = enemy.avatar;
  document.querySelector('.enemy-hp-bar').value = `${enemy.currentHp}`;
  document.querySelector('.enemy-hp-bar').max = `${enemy.maxHp}`;

  /* updateHealthBar('enemy', enemy.currentHp, enemy.maxHp); */
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

  const canAttack = attackChecked === BATTLE_CONFIG.maxAttackZones && defenseChecked === BATTLE_CONFIG.maxDefenseZones;

  attackButton.disabled = !canAttack;
  attackButton.classList.toggle('.disabled-btn', !canAttack);
}

initBattle();

// Генерируем ход врага
const generateEnemyTurn = (enemy) => {
  const attackZones = getRandomZones(ZONES, enemy.attackZones);
  const defenseZones = getRandomZones(ZONES, enemy.defenseZones);

  console.log({ attackZones, defenseZones });
  return { attackZones, defenseZones };
}

// Считаем урон (сравниваем зоны атаки и защиты)
const calculateDamage = (attackerZones, defenderZones, baseDamage) => {
  let totalDamage = 0;
  const result = [];

  attackerZones.forEach(zone => {
    if (defenderZones.includes(zone)) {
      result.push({ zone, damage: 0, blocked: true });
    } else {
      /* const damage = calculateCriticalHit(baseDamage); */
      result.push({ zone, damage: baseDamage, blocked: false });
      totalDamage += baseDamage;
    }
  })

  return { totalDamage, result };
}

// Бой
const initBattleRound = () => {
  addToBattleLog('--- НОВЫЙ РАУНД ---', 'round');

  const playerAttack = getSelectedAttackZones();
  const playerDefense = getSelectedDefenseZones();

  addToBattleLog(`Ты атакуешь: ${playerAttack.map(getZoneName).join(', ')}`);
  addToBattleLog(`Ты защищаешь: ${playerDefense.map(getZoneName).join(', ')}`);

  const enemyTurn = generateEnemyTurn(currentEnemy);

  addToBattleLog(`${currentEnemy.name} атакует: ${enemyTurn.attackZones.map(getZoneName).join(', ')}`);
  addToBattleLog(`${currentEnemy.name} защищает: ${enemyTurn.defenseZones.map(getZoneName).join(', ')}`);

  const playerResult = calculateDamage(enemyTurn.attackZones, playerDefense, currentEnemy.damage);
  const enemyResult = calculateDamage(playerAttack, enemyTurn.defenseZones, hero.damage);

  hero = getHero();

  generateLogMessage(playerResult, false).forEach(msg => addToBattleLog(msg, 'enemy'));
  generateLogMessage(enemyResult, true).forEach(msg => addToBattleLog(msg, 'player'));

  updateHealth(playerResult, enemyResult);

  addToBattleLog(`Твое здоровье: ${hero.currentHp}/${hero.maxHp}`);
  addToBattleLog(`Здоровье ${currentEnemy.name}: ${currentEnemy.currentHp}/${currentEnemy.maxHp}`);

  console.log(playerResult, enemyResult);

  renderHero(hero);

  if (currentEnemy.currentHp <= 0) {
    onEnemyDefeated();
  } else {
    renderEnemy(currentEnemy);
  }
}

const getSelectedAttackZones = () => {
  const selected = [];

  document.querySelectorAll('.attack-checkbox:checked').forEach(checkbox => {
    selected.push(checkbox.dataset.zone);
  })

  return selected;
}

const getSelectedDefenseZones = () => {
  const selected = [];

  document.querySelectorAll('.defense-checkbox:checked').forEach(checkbox => {
    selected.push(checkbox.dataset.zone);
  })

  return selected;
}

// Генерация выбора зон для врага
const getRandomZones = (allZones, count) => {
  const shuffled = [...allZones].sort(() => Math.random() - 0.5);
  
  return shuffled.slice(0, count);
}

attackButton.addEventListener('click', initBattleRound);

// Обновляем hp героя и врага
const updateHealth = (playerData, enemyData) => {
  hero.currentHp -= playerData.totalDamage;
  console.log(hero.currentHp);
  saveHero(hero);

  currentEnemy.currentHp -= enemyData.totalDamage;
  console.log(currentEnemy.currentHp);
  saveCurrentEnemy(currentEnemy);

  if (hero.currentHp < hero.maxHp || currentEnemy.currentHp < currentEnemy.maxHp) {
    localStorage.setItem('battleStarted', true);
  }
}

// Лог боя
const generateLogMessage = (attackResult, isPlayerAttacking = true) => {
  const attacker = isPlayerAttacking ? 'Ты' : currentEnemy.name;
  const target = isPlayerAttacking ? currentEnemy.name : 'тебя';

  return attackResult.result.map(({ zone, damage, blocked}) => {
    const zoneName = getZoneName(zone);

    if (blocked) {
      return `${attacker} атаковал ${target} в ${zoneName}, но удар был заблокирован!`;
    } else {
      return `${attacker} атаковал ${target} в ${zoneName} и нанес ${damage} урона`;
    }
  })
}

const addToBattleLog = (message, type = 'info') => {
  const logContainer = document.getElementById('battleLog');
  const logEntry = document.createElement('div');

  logEntry.textContent = message;
  logEntry.className = `log-entry log-${type}`;

  logContainer.appendChild(logEntry);
  logContainer.scrollTop = logContainer.scrollHeight;
}

const getZoneName = (zone) => {
  const zoneNames = {
    head: 'голову',
    neck: 'шею',
    body: 'тело',
    hands: 'руки',
    legs: 'ноги'
  };

  return zoneNames[zone] || zone;
}