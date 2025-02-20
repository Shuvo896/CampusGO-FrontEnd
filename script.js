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