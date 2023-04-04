const menu = document.querySelectorAll('.btn-menu');

menu.forEach(item => {
  item.addEventListener('click', () => {
    if (!item.classList.contains('active')) {
      menu.forEach(btn => {
        btn.classList.remove('active');
      });
      item.classList.add('active');
      document.querySelector('#selected').value = item.value;
    } else {
      item.classList.remove('active');
      document.querySelector('#selected').value = "";
    }
  
    console.log(item.value);
  });
});