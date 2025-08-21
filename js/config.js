export const avatars = [
  '../assets/img/human.webp',
  '../assets/img/orc.webp',
  '../assets/img/undead.webp',
];

export const enemies = [
  {
    id: 1,
    name: 'Король Лич',
    maxHp: 90,
    currentHp: 90,
    damage: 15,
    attackZones: 2,
    defendZones: 2,
    avatar: '../assets/img/lich-king.jpg'
  },
  {
    id: 2,
    name: 'Рагнарос',
    maxHp: 100,
    currentHp: 100,
    damage: 20,
    attackZones: 1,
    defendZones: 3,
    avatar: '../assets/img/ragnaros.webp'
  },
  {
    id: 3,
    name: 'Иллидан',
    maxHp: 80,
    currentHp: 80,
    damage: 10,
    attackZones: 3,
    defendZones: 1,
    avatar: '../assets/img/illidan.jpg'
  }
]

export const heroes = [
  {
    id: 0,
    name: 'Герой',
    maxHp: 100,
    currentHp: 100,
    damage: 20
  }
]

export const BATTLE_CONFIG = {
  maxAttackZones: 1,
  maxDefenseZones: 2
}