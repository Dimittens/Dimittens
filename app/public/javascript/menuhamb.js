document.addEventListener('DOMContentLoaded', function() {
    const menuButton = document.getElementById('menu-smart');
    const menu = document.querySelector('.menu');
    const menuDevice = document.querySelector('.menu-device');

    menuButton.addEventListener('click', function() {
        menu.classList.toggle('show');
        menuDevice.classList.toggle('active');
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const menuButton = document.getElementById('menu-smart');
    const menu = document.querySelector('.menu');
    const menuDevice = document.querySelector('.menu-device');
    
    // Toggle menu visibility on button click
    menuButton.addEventListener('click', function() {
        menu.classList.toggle('show');
        menuDevice.classList.toggle('active');
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!menu.contains(event.target) && !menuButton.contains(event.target)) {
            menu.classList.remove('show');
            menuDevice.classList.remove('active');
        }
    });
});
