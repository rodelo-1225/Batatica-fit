/* ========================================
   BATATICA FIT - SCRIPT GLOBAL
   Funcionalidades para todas las páginas
   ======================================== */

// ====== 1. MENÚ HAMBURGUESA ======
document.addEventListener('DOMContentLoaded', function() {
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const navMenu = document.getElementById('navMenu');

    if (hamburgerBtn && navMenu) {
        hamburgerBtn.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            hamburgerBtn.classList.toggle('active');
        });

        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                hamburgerBtn.classList.remove('active');
            });
        });

        document.addEventListener('click', function(event) {
            if (!navMenu.contains(event.target) && !hamburgerBtn.contains(event.target)) {
                navMenu.classList.remove('active');
                hamburgerBtn.classList.remove('active');
            }
        });
    }
});

// ====== 2. TEMA OSCURO/CLARO ======
document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('themeToggle');
    
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme);
        });
    }

    function updateThemeIcon(theme) {
        const icon = themeToggle.querySelector('i');
        if (icon) {
            icon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
        }
    }
});

// ====== 3. VALIDACIÓN FORMULARIO ======
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        const nombre = document.getElementById('nombre');
        const email = document.getElementById('email');
        const telefono = document.getElementById('telefono');
        const asunto = document.getElementById('asunto');
        const mensaje = document.getElementById('mensaje');
        const charCount = document.getElementById('charCount');

        // Validación en tiempo real - Nombre
        if (nombre) {
            nombre.addEventListener('blur', () => validateNombre(nombre.value));
            nombre.addEventListener('input', function() {
                if (this.value.length >= 3) {
                    clearError('nombreError');
                }
            });
        }

        // Validación en tiempo real - Email
        if (email) {
            email.addEventListener('blur', () => validateEmail(email.value));
            email.addEventListener('input', function() {
                if (isValidEmail(this.value)) {
                    clearError('emailError');
                }
            });
        }

        // Validación en tiempo real - Teléfono
        if (telefono) {
            telefono.addEventListener('input', function() {
                this.value = this.value.replace(/[^0-9+\s\-()]/g, '');
            });
            telefono.addEventListener('blur', function() {
                if (this.value && !isValidPhone(this.value)) {
                    showError('telefonoError', 'Formato de teléfono inválido');
                } else {
                    clearError('telefonoError');
                }
            });
        }

        // Validación en tiempo real - Asunto
        if (asunto) {
            asunto.addEventListener('change', function() {
                if (this.value) {
                    clearError('asuntoError');
                }
            });
        }

        // Contador de caracteres - Mensaje
        if (mensaje) {
            mensaje.addEventListener('input', function() {
                if (charCount) {
                    charCount.textContent = this.value.length + '/1000';
                }
                if (this.value.length >= 10) {
                    clearError('mensajeError');
                }
            });
        }

        // Envío del formulario
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            clearAllErrors();

            const nombreValue = nombre.value.trim();
            const emailValue = email.value.trim();
            const telefonoValue = telefono ? telefono.value.trim() : '';
            const asuntoValue = asunto.value;
            const mensajeValue = mensaje.value.trim();
            const terminosCheck = document.getElementById('terminos');

            let isValid = true;

            // Validar nombre
            if (!nombreValue) {
                showError('nombreError', 'El nombre es requerido');
                isValid = false;
            } else if (nombreValue.length < 3) {
                showError('nombreError', 'Mínimo 3 caracteres');
                isValid = false;
            } else if (!isValidName(nombreValue)) {
                showError('nombreError', 'Solo letras y espacios permitidos');
                isValid = false;
            }

            // Validar email
            if (!emailValue) {
                showError('emailError', 'El email es requerido');
                isValid = false;
            } else if (!isValidEmail(emailValue)) {
                showError('emailError', 'Email inválido');
                isValid = false;
            }

            // Validar teléfono
            if (telefonoValue && !isValidPhone(telefonoValue)) {
                showError('telefonoError', 'Formato de teléfono inválido');
                isValid = false;
            }

            // Validar asunto
            if (!asuntoValue) {
                showError('asuntoError', 'Selecciona un asunto');
                isValid = false;
            }

            // Validar mensaje
            if (!mensajeValue) {
                showError('mensajeError', 'El mensaje es requerido');
                isValid = false;
            } else if (mensajeValue.length < 10) {
                showError('mensajeError', 'Mínimo 10 caracteres');
                isValid = false;
            }

            // Validar términos
            if (terminosCheck && !terminosCheck.checked) {
                showError('terminosError', 'Debes aceptar los términos');
                isValid = false;
            }

            if (isValid) {
                submitForm();
            } else {
                scrollToFirstError();
            }
        });

        function submitForm() {
            const btn = contactForm.querySelector('.btn-submit');
            const status = document.getElementById('form-status');

            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
            btn.disabled = true;

            setTimeout(() => {
                status.innerHTML = '<i class="fas fa-check-circle"></i> ¡Mensaje enviado! Nos contactaremos pronto.';
                status.className = 'status-message success show';
                
                contactForm.reset();
                if (charCount) charCount.textContent = '0/1000';
                
                btn.innerHTML = originalText;
                btn.disabled = false;

                setTimeout(() => {
                    status.classList.remove('show');
                }, 5000);
            }, 1500);
        }

        function showError(elementId, message) {
            const errorElement = document.getElementById(elementId);
            if (errorElement) {
                errorElement.textContent = message;
                errorElement.classList.add('show');
            }
        }

        function clearError(elementId) {
            const errorElement = document.getElementById(elementId);
            if (errorElement) {
                errorElement.textContent = '';
                errorElement.classList.remove('show');
            }
        }

        function clearAllErrors() {
            const errorElements = document.querySelectorAll('.error-message');
            errorElements.forEach(error => {
                error.textContent = '';
                error.classList.remove('show');
            });
        }

        function scrollToFirstError() {
            const firstError = document.querySelector('.error-message.show');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }

        function isValidName(name) {
            const nameRegex = /^[a-zA-ZáéíóúñÁÉÍÓÚÑ\s]+$/;
            return nameRegex.test(name);
        }

        function isValidEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        }

        function isValidPhone(phone) {
            const phoneRegex = /^[0-9+\s\-()]{7,}$/;
            return phoneRegex.test(phone.replace(/\s/g, ''));
        }

        function validateNombre(value) {
            if (!value) {
                showError('nombreError', 'El nombre es requerido');
            } else if (value.length < 3) {
                showError('nombreError', 'Mínimo 3 caracteres');
            } else if (!isValidName(value)) {
                showError('nombreError', 'Solo letras y espacios permitidos');
            } else {
                clearError('nombreError');
            }
        }

        function validateEmail(value) {
            if (!value) {
                showError('emailError', 'El email es requerido');
            } else if (!isValidEmail(value)) {
                showError('emailError', 'Email inválido');
            } else {
                clearError('emailError');
            }
        }
    }
});

// ====== 4. TABS DE TIENDAS ======
document.addEventListener('DOMContentLoaded', function() {
    const cityTabs = document.querySelectorAll('.city-tab');
    
    cityTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const cityId = this.dataset.city;
            
            // Desactivar todos los tabs y contenidos
            document.querySelectorAll('.city-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.city-content').forEach(c => c.classList.remove('active'));
            
            // Activar el seleccionado
            this.classList.add('active');
            document.getElementById(cityId).classList.add('active');
        });
    });
});

// ====== 5. HEADER SCROLL EFFECT ======
document.addEventListener('DOMContentLoaded', function() {
    const header = document.querySelector('.main-header');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
});

// ====== 6. SCROLL SMOOTH ======
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href !== '#!') {
                e.preventDefault();
                const targetSection = document.querySelector(href);
                if (targetSection) {
                    targetSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
});

// ====== 7. ANIMACIONES AL SCROLL ======
document.addEventListener('DOMContentLoaded', function() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const cards = document.querySelectorAll(
        '.product-card, .store-card, .highlight-card, .benefit-item, .health-card, ' +
        '.platform-card, .info-card, .testimonial-card, .faq-item'
    );
    
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(card);
    });
});

// ====== 8. EFECTOS HOVER EN BOTONES ======
document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll(
        '.btn-primary, .btn-cta, .btn-submit, .btn-mayorista, .btn-store, ' +
        '.btn-buy, .btn-large, .btn-platform'
    );
    
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
});

console.log('Script cargado correctamente - Batatica Fit');