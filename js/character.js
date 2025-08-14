import { name, checkRegister } from "./storage.js";

checkRegister();

const setName = () => {
  const displayName = document.querySelector('#character-name span');

  displayName.innerHTML = name;
}

setName();