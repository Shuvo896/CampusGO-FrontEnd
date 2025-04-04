function toggleSidebar() {
  const sidebar = document.querySelector('.sidebar');
  const hamburger = document.getElementById('hamburger');
  sidebar.classList.toggle('active');
  hamburger.classList.toggle('active');
}


function updateDate() {
  const dateSpan = document.querySelector('.showDate');
  if (dateSpan) {
    const now = new Date();
    const formattedDate = formatDate(now);
    dateSpan.textContent = formattedDate;
  }
}


function formatDate(date) {
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString(undefined, options);
}

updateDate();

setInterval(updateDate, 60000);

// dropdown

// const dropdowns = document.querySelectorAll('.dropdown');

// dropdowns.forEach(dropdown => {
//   const select = dropdown.querySelector('.select');
//   const caret = dropdown.querySelector('.caret');
//   const menu = dropdown.querySelector('.menu');
//   const options = dropdown.querySelector('.menu li');
//   const selected = dropdown.querySelector('.selected');

//   select.addEventListener('click' , () => {
//     select.classList.toggle('select-clicked');
//     caret.classList.toggle('caret-rotate');
//     menu.classList.toggle('menu-open');
// });

//   options.forEach(option => {
//     option.addEventListener('click', ()=>{
//       selected.innerText = option.innerText;
//       select.classList.remove('select-clicked');
//       caret.classList.remove('caret-rotate');
//       menu.classList.remove('menu-open');

//       options.forEach(option => {
//         option.classList.remove('active');
//       });
//       option.classList.add('active');
//     });
//   });
// });