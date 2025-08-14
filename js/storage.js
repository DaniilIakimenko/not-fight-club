export const name = localStorage.getItem('characterName');

export const checkRegister = () => {
  if (!name) {
    window.location.href = '/register.html';
  }
}