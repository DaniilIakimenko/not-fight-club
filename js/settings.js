import { name, checkRegister } from "./storage.js";

checkRegister();

const setPlaceholder = () => {
  const input = document.getElementById('characterNameSet');

  input.placeholder = name;
}

setPlaceholder();