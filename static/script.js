// Smooth scrolling and navigation
document.addEventListener('DOMContentLoaded', function() {
    // Navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    const pages = document.querySelectorAll('.page');
    const dots = document.querySelectorAll('.dot');

    // Handle navigation clicks
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            
            if (targetId.startsWith('#') && targetId.length > 1) {
                const targetPage = document.querySelector(targetId);
                if (targetPage) {
                    targetPage.scrollIntoView({ behavior: 'smooth' });
                    updateActiveNav(targetId.substring(1));
                }
            }
        });
    });

    // Handle dot navigation
    dots.forEach(dot => {
        dot.addEventListener('click', function() {
            const pageId = this.getAttribute('data-page');
            const targetPage = document.getElementById(pageId);
            if (targetPage) {
                targetPage.scrollIntoView({ behavior: 'smooth' });
                updateActiveNav(pageId);
            }
        });
    });

    // Update active navigation
    function updateActiveNav(activePageId) {
        // Update nav links
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${activePageId}`) {
                link.classList.add('active');
            }
        });

        // Update dots
        dots.forEach(dot => {
            dot.classList.remove('active');
            if (dot.getAttribute('data-page') === activePageId) {
                dot.classList.add('active');
            }
        });
    }

    // Scroll spy functionality
    function handleScroll() {
        const scrollPosition = window.scrollY + window.innerHeight / 2;

        pages.forEach(page => {
            const pageTop = page.offsetTop;
            const pageBottom = pageTop + page.offsetHeight;

            if (scrollPosition >= pageTop && scrollPosition <= pageBottom) {
                updateActiveNav(page.id);
            }
        });
    }

    window.addEventListener('scroll', handleScroll);
    
    // Modal functionality
    const loginModal = document.getElementById('loginModal');
    const registerModal = document.getElementById('registerModal');
    const loginBtn = document.getElementById('loginBtn');
    const loginFooter = document.getElementById('loginFooter');
    const showRegister = document.getElementById('showRegister');
    const showLogin = document.getElementById('showLogin');
    const backToLogin = document.getElementById('backToLogin');
    const closeBtns = document.querySelectorAll('.close');

    // Show login modal
    function showLoginModal() {
        loginModal.style.display = 'flex';
        registerModal.style.display = 'none';
    }

    // Show register modal
    function showRegisterModal() {
        registerModal.style.display = 'flex';
        loginModal.style.display = 'none';
    }

    // Hide all modals
    function hideModals() {
        loginModal.style.display = 'none';
        registerModal.style.display = 'none';
    }

    // Event listeners for modals
    if (loginBtn) loginBtn.addEventListener('click', showLoginModal);
    if (loginFooter) loginFooter.addEventListener('click', showLoginModal);
    if (showRegister) showRegister.addEventListener('click', showRegisterModal);
    if (showLogin) showLogin.addEventListener('click', showLoginModal);
    if (backToLogin) backToLogin.addEventListener('click', showLoginModal);

    // Close modal buttons
    closeBtns.forEach(btn => {
        btn.addEventListener('click', hideModals);
    });

    // Close modals when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === loginModal || e.target === registerModal) {
            hideModals();
        }
    });

    // Handle user type selection for login
    const loginUserTypeRadios = document.querySelectorAll('#loginModal input[name="userType"]');
    const adminNameField = document.getElementById('adminNameField');
    
    loginUserTypeRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.value === 'admin') {
                adminNameField.style.display = 'block';
                document.getElementById('adminName').required = true;
            } else {
                adminNameField.style.display = 'none';
                document.getElementById('adminName').required = false;
            }
        });
    });

    // Handle user type selection for registration
    const regUserTypeRadios = document.querySelectorAll('#registerModal input[name="userType"]');
    const regAdminNameField = document.getElementById('regAdminNameField');
    
    regUserTypeRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.value === 'admin') {
                regAdminNameField.style.display = 'block';
                document.getElementById('regAdminName').required = true;
            } else {
                regAdminNameField.style.display = 'none';
                document.getElementById('regAdminName').required = false;
            }
        });
    });

    // Form validation
    const loginForm = document.querySelector('#loginModal form');
    const registerForm = document.querySelector('#registerModal form');

    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            const username = document.getElementById('loginUsername').value.trim();
            const password = document.getElementById('loginPassword').value.trim();
            const userType = document.querySelector('#loginModal input[name="userType"]:checked').value;
            
            if (!username || !password) {
                e.preventDefault();
                alert('Please fill in all required fields.');
                return;
            }

            if (userType === 'admin') {
                const adminName = document.getElementById('adminName').value.trim();
                if (!adminName) {
                    e.preventDefault();
                    alert('Admin name is required for admin login.');
                    return;
                }
            }
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            const username = document.getElementById('regUsername').value.trim();
            const email = document.getElementById('regEmail').value.trim();
            const password = document.getElementById('regPassword').value.trim();
            const userType = document.querySelector('#registerModal input[name="userType"]:checked').value;
            
            if (!username || !email || !password) {
                e.preventDefault();
                alert('Please fill in all required fields.');
                return;
            }

            if (userType === 'admin') {
                const adminName = document.getElementById('regAdminName').value.trim();
                if (!adminName) {
                    e.preventDefault();
                    alert('Admin name is required for admin registration.');
                    return;
                }
            }

            // Basic email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                e.preventDefault();
                alert('Please enter a valid email address.');
                return;
            }

            // Basic password validation
            if (password.length < 6) {
                e.preventDefault();
                alert('Password must be at least 6 characters long.');
                return;
            }
        });
    }

    // Auto-hide flash messages after 5 seconds
    const flashMessages = document.querySelectorAll('.alert');
    flashMessages.forEach(message => {
        setTimeout(() => {
            if (message) {
                message.classList.remove('show');
                setTimeout(() => {
                    if (message.parentNode) {
                        message.parentNode.removeChild(message);
                    }
                }, 300);
            }
        }, 5000);
    });

    // Initialize page
    handleScroll(); // Set initial active nav
});
