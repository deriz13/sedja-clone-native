const menu = document.querySelectorAll('.btn-menu');
const submenu = document.getElementById('submenu');

menu.forEach(item => {
  item.addEventListener('click', () => {
    if (!item.classList.contains('active')) {
      menu.forEach(btn => {
        btn.classList.remove('active');
      });
      item.classList.add('active');
      document.querySelector('#selected').value = item.value;
      if (submenuItem[item.value]) {
        submenu.innerHTML = submenuItem[item.value];
      }
    } else {
      item.classList.remove('active');
      document.querySelector('#selected').value = "";
    }
  
    console.log(item.value);
  });
});

const submenuItem = {
  forms: `<button id="checkButton" onclick="setSymbol('check')"><i class="fas fa-check"></i></button>
    <button id="crossButton" onclick="setSymbol('cross')"><i class="fas fa-times"></i></button>
    <button id="dotButton" onclick="setSymbol('dot')"><i class="fas fa-circle"></i></button>`
}