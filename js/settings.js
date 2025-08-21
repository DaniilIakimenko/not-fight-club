import { checkRegister, saveCharName } from "./storage.js";

checkRegister();

const setPlaceholder = () => {
  const input = document.getElementById('characterNameSet');

  input.placeholder = localStorage.getItem('characterName');
}

setPlaceholder();

const changeNameBtn = document.getElementById('changeNameBtn');

changeNameBtn.addEventListener('click', () => {
  saveCharName();
  setPlaceholder();
});