import { checkRegister, saveCharName } from "./storage.js";

checkRegister();

const registerBtn = document.getElementById('registerBtn');

registerBtn.addEventListener('click', () => {
  saveCharName();
  window.location.href = 'index.html';
});