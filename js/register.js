import { saveCharName } from "./storage.js";

const btnRegister = document.querySelector('#btnRegister');

btnRegister.addEventListener('click', () => {
  saveCharName();
  window.location.href = 'index.html';
});