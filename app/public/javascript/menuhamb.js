document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('menu-smart');
    const navBar = document.getElementById('menuhamb');

    menuToggle.addEventListener('click', function() {
        navBar.classList.toggle('active');
        menuToggle.classList.toggle('active');
    });
});
