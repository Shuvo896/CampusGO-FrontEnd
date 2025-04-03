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

document.addEventListener("DOMContentLoaded", function () {
  // Select all dropdown buttons
  const dropdownButtons = document.querySelectorAll(".booking button");

  dropdownButtons.forEach((button) => {
      button.addEventListener("click", function (event) {
          // Close all dropdowns except the clicked one
          document.querySelectorAll(".booking .content").forEach((content) => {
              if (content !== button.nextElementSibling) {
                  content.classList.remove("show");
              }
          });

          // Toggle the clicked dropdown
          const dropdownContent = button.nextElementSibling;
          dropdownContent.classList.toggle("show");

          // Close dropdown if clicking outside
          document.addEventListener("click", function closeDropdown(e) {
              if (!button.contains(e.target) && !dropdownContent.contains(e.target)) {
                  dropdownContent.classList.remove("show");
                  document.removeEventListener("click", closeDropdown);
              }
          });
      });
  });
});
