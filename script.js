function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const hamburger = document.getElementById('hamburger');
    sidebar.classList.toggle('active');
    hamburger.classList.toggle('active');
}