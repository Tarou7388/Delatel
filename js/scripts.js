window.addEventListener('DOMContentLoaded', event => {

    // Toggle the side navigation
    const sidebarToggle = document.body.querySelector('#sidebarToggle');
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', event => {
            event.preventDefault();
            document.body.classList.toggle('sb-sidenav-toggled');
            localStorage.setItem('sb|sidebar-toggle', document.body.classList.contains('sb-sidenav-toggled'));
        });
    }

     const togglePassword = document.getElementById('togglePassword');
     const passwordInput = document.getElementById('txtPassUser');
     const eyeIcon = document.getElementById('eyeIcon');

     togglePassword.addEventListener('click', function () {
         const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
         passwordInput.setAttribute('type', type);
         eyeIcon.classList.toggle('bi-eye');
         eyeIcon.classList.toggle('bi-eye-slash');
     });

});
