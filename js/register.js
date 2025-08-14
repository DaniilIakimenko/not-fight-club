const saveCharName = () => {
  const name = document.getElementById('characterName').value;

  if (name.trim() === '') return alert ('Введите имя персонажа!');

  localStorage.setItem('characterName', name);
  
  window.location.href = 'index.html';
}