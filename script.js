 const heroSection = document.getElementById('hero-section');
        const particleCanvas = document.getElementById('particleCanvas');
        let scene, camera, renderer, particles;
        let mouseX = 0, mouseY = 0;

        function initParticles() {
            if (!heroSection || !particleCanvas) return;

            scene = new THREE.Scene();
            camera = new THREE.PerspectiveCamera(75, heroSection.clientWidth / heroSection.clientHeight, 0.1, 1000);
            renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, canvas: particleCanvas });
            renderer.setClearColor(0x000000, 0);
            renderer.setSize(heroSection.clientWidth, heroSection.clientHeight); // Initial size setup

            let particlesCount = 3000;
            let geometry = new THREE.BufferGeometry();
            let positions = new Float32Array(particlesCount * 3);
            let opacities = new Float32Array(particlesCount);

            for (let i = 0; i < particlesCount; i++) {
                positions[i * 3] = (Math.random() - 0.5) * 800;
                positions[i * 3 + 1] = (Math.random() - 0.5) * 800;
                positions[i * 3 + 2] = (Math.random() - 0.5) * 800;
                opacities[i] = Math.random();
            }

            geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            geometry.setAttribute('alpha', new THREE.BufferAttribute(opacities, 1));

            let material = new THREE.PointsMaterial({
                size: 1.5,
                transparent: true,
                opacity: 1,
                color: 0xdda15e,
                blending: THREE.AdditiveBlending
            });

            particles = new THREE.Points(geometry, material);
            scene.add(particles);
            camera.position.z = 200;

            heroSection.addEventListener('mousemove', (event) => {
                const rect = heroSection.getBoundingClientRect();
                mouseX = ((event.clientX - rect.left) / rect.width) - 0.5;
                mouseY = ((event.clientY - rect.top) / rect.height) - 0.5;
            });

            function animateParticles() {
                if (!particles || !renderer) return;

                requestAnimationFrame(animateParticles);
                particles.rotation.y += 0.0005;
                particles.rotation.x += 0.0003;

                let positionsAttr = particles.geometry.attributes.alpha;
                for (let i = 0; i < particlesCount; i++) {
                    positionsAttr.array[i] += (Math.random() - 0.5) * 0.02;
                    if (positionsAttr.array[i] > 1) positionsAttr.array[i] = 1;
                    if (positionsAttr.array[i] < 0.2) positionsAttr.array[i] = 0.2;
                }
                positionsAttr.needsUpdate = true;

                camera.position.x += (mouseX * 100 - camera.position.x) * 0.05;
                camera.position.y += (-mouseY * 100 - camera.position.y) * 0.05;
                camera.lookAt(scene.position);

                renderer.render(scene, camera);
            }
            animateParticles();
        }

        function onParticleCanvasResize() {
            if (!heroSection || !camera || !renderer) return;
            camera.aspect = heroSection.clientWidth / heroSection.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(heroSection.clientWidth, heroSection.clientHeight);
        }
        window.addEventListener('resize', onParticleCanvasResize);


        document.addEventListener('DOMContentLoaded', function () {
            initParticles();
            onParticleCanvasResize();

            // Navbar & Mobile Menu Logic
            const navbar = document.getElementById("navbar");
            const servicesToggle = document.getElementById("servicesToggle");
            const servicesMenu = document.getElementById("servicesMenu");
            const menuToggle = document.getElementById("menuToggle");
            const navLinks = document.getElementById("navLinks");

            servicesToggle.addEventListener("click", (e) => {
                if (window.innerWidth > 991) {
                    e.preventDefault();
                    e.stopPropagation();
                    servicesMenu.classList.toggle("show");
                }
            });

            function openMenu() {
                navbar.classList.add("menu-open");
                document.body.classList.add("lock-scroll");
                menuToggle.setAttribute("aria-expanded", "true");
            }

            function closeMenu() {
                navbar.classList.remove("menu-open");
                document.body.classList.remove("lock-scroll");
                menuToggle.setAttribute("aria-expanded", "false");
            }
            menuToggle.addEventListener("click", () => {
                if (navbar.classList.contains("menu-open")) {
                    closeMenu();
                } else {
                    openMenu();
                }
            });

            navLinks.querySelectorAll("a").forEach(a => {
                a.addEventListener("click", (e) => {
                    if (a.id === 'servicesToggle' && window.innerWidth < 992) {
                        e.preventDefault(); // Prevent dropdown toggle on mobile if services menu is desired to be handled differently
                        return;
                    }
                    if (navbar.classList.contains("menu-open")) {
                        closeMenu();
                    }
                    // Handle "Home" link specifically to clear hash and scroll to top
                    if (a.getAttribute('href') === '#hero-section') {
                        e.preventDefault();
                        window.location.hash = ''; // Clear hash if any
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                        return;
                    }
                });
            });

            document.addEventListener("click", (e) => {
                if (servicesMenu.classList.contains("show") && !servicesMenu.contains(e.target) && !servicesToggle.contains(e.target)) {
                    servicesMenu.classList.remove("show");
                }
                if (navbar.classList.contains("menu-open") && !navLinks.contains(e.target) && e.target !== menuToggle && !menuToggle.contains(e.target)) {
                    closeMenu();
                }
            });


            // Smooth Scrolling for specific buttons/links
            document.querySelectorAll('.scroll-to-projects').forEach(button => {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    document.getElementById('projects').scrollIntoView({ behavior: 'smooth' });
                    closeMenu();
                });
            });

            document.querySelectorAll('.scroll-to-education').forEach(button => {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    document.getElementById('education').scrollIntoView({ behavior: 'smooth' });
                    closeMenu();
                });
            });

            document.querySelectorAll('.scroll-to-contact').forEach(button => {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    document.getElementById('contact-section-final').scrollIntoView({ behavior: 'smooth' });
                    closeMenu();
                });
            });

            document.querySelectorAll('.scroll-to-about').forEach(button => {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    document.getElementById('about-section').scrollIntoView({ behavior: 'smooth' });
                    closeMenu();
                });
            });

            // "View All Services" from mega dropdown
            const viewAllServicesLink = document.querySelector('.mega-dropdown .view-all a');
            if (viewAllServicesLink) {
                viewAllServicesLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    document.getElementById('services-section').scrollIntoView({ behavior: 'smooth' });
                    servicesMenu.classList.remove("show"); // Close the mega dropdown
                    closeMenu(); // Close mobile menu if open
                });
            }


            // Typewriter Effect
            const roles = [
                "Full Stack Developer", "PHP & Laravel Expert", "WordPress Expert", "E-commerce Developer",
                "Logic Builder", "Frontend Developer", "Backend Developer", "SEO Specialist",
                "UI/UX Designer", "Data Base Expert", "Website Designer"
            ];

            const typewriterElement = document.getElementById('typewriter');
            let roleIndex = 0;
            let charIndex = 0;
            let isDeleting = false;
            const typingSpeed = 100;
            const deletingSpeed = 50;
            const pauseDuration = 1500;

            function type() {
                const currentRole = roles[roleIndex];
                let displayText = '';
                if (!isDeleting) {
                    displayText = currentRole.substring(0, charIndex + 1);
                    typewriterElement.textContent = displayText;
                    charIndex++;
                    if (charIndex === currentRole.length) {
                        isDeleting = true;
                        setTimeout(type, pauseDuration);
                        return;
                    }
                } else {
                    displayText = currentRole.substring(0, charIndex - 1);
                    typewriterElement.textContent = displayText;
                    charIndex--;
                    if (charIndex === 0) {
                        isDeleting = false;
                        roleIndex = (roleIndex + 1) % roles.length;
                    }
                }
                const speed = isDeleting ? deletingSpeed : typingSpeed;
                setTimeout(type, speed);
            }
            if (typewriterElement) {
                type();
            }

            // Star Animation (Hero)
            const starContainer = document.getElementById('star-container');
            if (starContainer) {
                const numberOfStars = 60;

                for (let i = 0; i < numberOfStars; i++) {
                    const star = document.createElement('div');
                    star.classList.add('star');
                    const size = Math.random() * 2 + 1;
                    const x = Math.random() * 100;
                    const y = Math.random() * 100;
                    const animationDelay = Math.random() * 5;
                    const animationDuration = Math.random() * 3 + 2;
                    star.style.width = `${size}px`;
                    star.style.height = `${size}px`;
                    star.style.left = `${x}%`;
                    star.style.top = `${y}%`;
                    star.style.animationDelay = `${animationDelay}s`;
                    star.style.animationDuration = `${animationDuration}s`;
                    starContainer.appendChild(star);
                }
            }

            // GSAP Animations (About Section)
            gsap.registerPlugin(ScrollTrigger);
            const aboutSection = document.querySelector('.about-section');

            if (aboutSection) {
                let tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: aboutSection,
                        start: "top 70%",
                        end: "bottom top",
                        toggleActions: "play none none none"
                    }
                });

                tl.to('.about-section .about-tag', {
                    autoAlpha: 1,
                    y: 0,
                    duration: 0.6,
                    ease: 'power2.out'
                })
                    .to('.about-section .about-content h2', {
                        autoAlpha: 1,
                        y: 0,
                        duration: 0.8,
                        ease: 'power2.out'
                    }, "-=0.4")
                    .to('.about-section .about-content p', {
                        autoAlpha: 1,
                        y: 0,
                        duration: 0.7,
                        stagger: 0.2,
                        ease: 'power2.out'
                    }, "-=0.5")
                    .to('.about-section .learn-more-btn', {
                        autoAlpha: 1,
                        y: 0,
                        duration: 0.6,
                        ease: 'power2.out'
                    }, "-=0.4");
            }

            // Process Section Logic
            const processData = [{
                step: 1,
                title: 'Discovery',
                description: 'Deeply understanding your vision, goals, and challenges through consultation and research.',
                details: ['Initial Consultation', 'Requirements Analysis', 'Market & Competitor Research', 'Defining Success Metrics', 'Goal Setting'],
                icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>`
            }, {
                step: 2,
                title: 'Planning',
                description: 'Creating a detailed, strategic roadmap and architecture for the project to ensure success.',
                details: ['Project Scope Definition', 'Timeline & Milestone Creation', 'Resource Allocation', 'Technology Stack Selection', 'Risk Assessment'],
                icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></polyline><polyline points="10 9 9 9 8 9"></polyline></svg>`
            }, {
                step: 3,
                title: 'Design',
                description: 'Crafting visually stunning, intuitive, and user-centric interfaces that engage and convert.',
                details: ['Wireframing & Prototyping', 'UI/UX Design Systems', 'Interactive Prototyping', 'Feedback & Iteration Cycle', 'Finalizing High-Fidelity Designs'],
                icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>`
            }, {
                step: 4,
                title: 'Development',
                description: 'Building the core functionality with clean, scalable, and efficient code based on best practices.',
                details: ['Frontend Development (HTML / CSS / JS / Bootstrap.)', 'Backend Development (PHP / LARAVEL.)', 'Database Integration (MySQL)', 'API Implementation (JSON /  XML.)', 'Continuous Integration'],
                icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>`
            }, {
                step: 5,
                title: 'Testing',
                description: 'Rigorously ensuring functionality, performance, and compatibility across all devices and platforms.',
                details: ['Unit & Integration Testing', 'Performance Optimization', 'Cross-Browser Compatibility', 'Mobile Responsiveness Checks', 'Security Audits'],
                icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`
            }, {
                step: 6,
                title: 'Launch',
                description: 'Deploying the project with a smooth transition to the live environment, followed by monitoring.',
                details: ['Final Review & Sign-off', 'Server Deployment', 'Go-Live Execution', 'Post-Launch Monitoring', 'Handover & Documentation'],
                icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path><polyline points="16 6 12 2 8 6"></polyline><line x1="12" y1="2" x2="12" y2="15"></line></svg>`
            }];

            const processSection = document.getElementById('process-section');
            const stepperContainer = document.getElementById('process-stepper');
            const contentWrapper = document.getElementById('process-content-wrapper');
            const lineProgress = document.getElementById('stepper-line-progress');

            if (processSection && stepperContainer && contentWrapper && lineProgress) {
                let currentStep = 0;
                const totalSteps = processData.length;
                const AUTO_ADVANCE_DELAY = 3000;
                let autoAdvanceInterval = null;

                const stopAutoAdvance = () => {
                    clearInterval(autoAdvanceInterval);
                    autoAdvanceInterval = null;
                    const activeTimer = document.querySelector('.stepper-item.active .timer-ring circle');
                    if (activeTimer) activeTimer.style.animation = 'none';
                };

                const startAutoAdvance = () => {
                    stopAutoAdvance();
                    const activeTimer = document.querySelector('.stepper-item.active .timer-ring circle');
                    if (activeTimer) {
                        activeTimer.style.animation = 'none';
                        void activeTimer.offsetWidth;
                        activeTimer.style.animation = `timer-animation ${AUTO_ADVANCE_DELAY / 1000}s linear forwards`;
                    }

                    autoAdvanceInterval = setInterval(() => {
                        const nextStep = (currentStep % totalSteps) + 1;
                        updateActiveStep(nextStep);
                    }, AUTO_ADVANCE_DELAY);
                };

                const generateUI = () => {
                    processData.forEach(item => {
                        const stepperItem = document.createElement('div');
                        stepperItem.className = 'stepper-item';
                        stepperItem.dataset.step = item.step;
                        stepperItem.innerHTML = `
                        <div class="step-circle">
                           ${item.step}
                           <svg class="timer-ring">
                                <circle stroke-dasharray="125.6" stroke-dashoffset="125.6" r="20" cx="22" cy="22"></circle>
                           </svg>
                        </div>
                        <div class="step-name">${item.title}</div>`;
                        stepperContainer.appendChild(stepperItem);

                        const contentPanel = document.createElement('div');
                        contentPanel.className = 'process-content';
                        contentPanel.dataset.step = item.step;
                        contentPanel.innerHTML = `
                        <div class="content-details">
                            <div class="step-heading">
                                <span class="icon-wrapper">${item.icon}</span>
                                <div class="title-group">
                                    <h3>Step &bull; 0${item.step}</h3>
                                    <h2>${item.title}</h2>
                                </div>
                            </div>
                            <p>${item.description}</p>
                            <ul>
                                ${item.details.map(detail => `<li>${detail}</li>`).join('')}
                            </ul>
                        </div>
                        <div class="content-card">
                            <div class="card-icon-wrapper">${item.icon}</div>
                            <h4>${item.title}</h4>
                            <p>${item.description}</p>
                            <div class="step-number-box"><p>0${item.step}</p></div>
                        </div>`;
                        contentWrapper.appendChild(contentPanel);
                    });
                };

                const updateActiveStep = (newStep) => {
                    if (newStep === currentStep) return;

                    const oldStep = currentStep;

                    if (oldStep > 0) {
                        document.querySelector(`.stepper-item[data-step="${oldStep}"]`)?.classList.remove('active');
                        const oldContent = document.querySelector(`.process-content[data-step="${oldStep}"]`);
                        if (oldContent) {
                            oldContent.classList.add('is-exiting');
                            oldContent.classList.remove('active');
                            setTimeout(() => oldContent.classList.remove('is-exiting'), 500);
                        }
                    }

                    document.querySelector(`.stepper-item[data-step="${newStep}"]`)?.classList.add('active');
                    document.querySelector(`.process-content[data-step="${newStep}"]`)?.classList.add('active');

                    const progress = ((newStep - 1) / (totalSteps - 1)) * 100;
                    lineProgress.style.width = `${progress}%`;

                    processSection.dataset.activeStep = newStep;

                    currentStep = newStep;

                    if (autoAdvanceInterval) {
                        startAutoAdvance();
                    }
                };

                stepperContainer.addEventListener('click', (e) => {
                    const stepItem = e.target.closest('.stepper-item');
                    if (stepItem) {
                        stopAutoAdvance();
                        const stepNumber = parseInt(stepItem.dataset.step);
                        updateActiveStep(stepNumber);
                    }
                });

                processSection.addEventListener('mouseenter', stopAutoAdvance);
                processSection.addEventListener('mouseleave', startAutoAdvance);

                const processObserver = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            processSection.classList.add('is-visible');
                            startAutoAdvance();
                            processObserver.unobserve(entry.target);
                        }
                    });
                }, {
                    threshold: 0.2
                });

                generateUI();
                updateActiveStep(1);
                processObserver.observe(processSection);
            }

            // Services Carousel
            const servicesTrack = document.querySelector('.services-section .carousel-track');
            if (servicesTrack) {
                const items = Array.from(servicesTrack.children);
                items.forEach(item => {
                    const clone = item.cloneNode(true);
                    servicesTrack.appendChild(clone);
                });

                const scrollWidth = items.reduce((total, item) => {
                    const style = window.getComputedStyle(item);
                    const marginRight = parseInt(style.marginRight, 10) || 0;
                    return total + item.offsetWidth + marginRight;
                }, 0);

                servicesTrack.style.setProperty('--scroll-width', `${scrollWidth}px`);
                const speed = 60;
                const animationDuration = scrollWidth / speed;
                servicesTrack.style.animationDuration = `${animationDuration}s`;
            }

            // Projects Carousel
            const projectData = [{
                title: "Furniture Website",
                description: "Design Full Animated Furniture Website beautiful landing page.",
                category: "WEB DEVELOPMENT",
                tags: ["HTML", "CSS", "JavaScript", "Bootstrap"],
                image: "project/8.JPEG",
                url: "https://hassan-shirazi.github.io/Furniture-Website/"
            }, {
                title: "GYM Website",
                description: "Ultimate Gym Website a beautiful landing page of a gym website.",
                category: "WEB DEVELOPMENT",
                tags: ["HTML", "CSS", "JavaScript", "Bootstrap"],
                image: "project/9.JPEG",
                url: "https://hassan-shirazi.github.io/Gym-Website/"
            }, {
                title: "Watch Website",
                description: "Beautiful Design with Fully animation by Ai and GSAP",
                category: "WEB DEVELOPMENT",
                tags: ["HTML", "CSS", "JavaScript", "Ai"],
                image: "project/17.JPEG",
                url: "https://hassan-shirazi.github.io/3D-Watch-Website/"
            }, {
                title: "Smart Phones Website",
                description: "Beautiful Animated 3D Website of Smart Phones By Using Ai.",
                category: "WEB DEVELOPMENT",
                tags: ["Ai", "JavaScript", "CSS", "GSAP"],
                image: "project/11.JPEG",
                url: "https://hassan-shirazi.github.io/Smart-Phones-Website/"
            }, {
                title: "Fast Food Website",
                description: "Animated Fast Food a landing page of a Website",
                category: "WEB DEVELOPMENT",
                tags: ["GSAP", "JavaScript", "CSS", "Ai"],
                image: "project/6.JPEG",
                url: "https://hassan-shirazi.github.io/Fast-Food-Website/"
            }, {
                title: "Fruit & Vegetables Website",
                description: "Ultimate Fruit and vegetables website by using HTML CSS JavaScript and Ai",
                category: "WEB DEVELOPMENT",
                tags: ["CSS", "JavaScript", "GSAP", "HTML"],
                image: "project/7.JPEG",
                url: "https://hassan-shirazi.github.io/Fruit-Vegetables-Website/"
            }, {
                title: "Clothes Website",
                description: "Clone of Kapray Website with Html Css JavaScript",
                category: "WEB DEVELOPMENT",
                tags: ["HTML", "CSS", "JavaScript", "JQuery"],
                image: "project/5.JPEG",
                url: "https://hassan-shirazi.github.io/Clothes-Website/"
            }, {
                title: "Car Website",
                description: "Landing Page of BMW Cars With smooth Animation and Transitions",
                category: "WEB DEVELOPMENT",
                tags: ["HTML", "JavaScript", "GSAP", "CSS"],
                image: "project/2.PNG",
                url: "https://hassan-shirazi.github.io/Car-Website/"
            }, {
                title: "Travel Website",
                description: "Beautiful Travel Website for Turisom with fully animation",
                category: "WEB DEVELOPMENT",
                tags: ["Bootstrap", "CSS", "JavaScript", "HTML"],
                image: "project/16.JPEG",
                url: "https://hassan-shirazi.github.io/Travel-Website/"
            }, {
                title: "Shoes Website",
                description: "A landing page of a shoes Website user attractive and Fully animated",
                category: "WEB DEVELOPMENT",
                tags: ["GSAP", "Ai", "JavaScript", "CSS"],
                image: "project/13.PNG",
                url: "https://hassan-shirazi.github.io/Shoes-Website/"
            },];

            let projectActiveIndex = 0;
            let isProjectCarouselHovering = false;
            let projectAutoRotateInterval;
            let projectTouchStart = null;
            let projectTouchEnd = null;
            const projectMinSwipeDistance = 50;

            const projectCarouselTrack = document.querySelector('.projects-section .carousel-track');
            const projectDotsContainer = document.querySelector('.carousel-dots');
            const projectPrevButton = document.querySelector('.projects-section .prev-btn');
            const projectNextButton = document.querySelector('.projects-section .next-btn');
            const projectCarouselWrapper = document.querySelector('.carousel-wrapper');

            const projectsModal = document.getElementById('projects-modal');
            const closeModalBtn = document.getElementById('close-modal-btn');
            const modalProjectGrid = document.getElementById('modal-project-grid');

            function renderProjectCarousel() {
                if (!projectCarouselTrack) return;
                projectCarouselTrack.innerHTML = '';
                projectDotsContainer.innerHTML = '';

                projectData.forEach((project, index) => {
                    const cardWrapper = document.createElement('div');
                    cardWrapper.className = 'card-wrapper';
                    cardWrapper.dataset.index = index;

                    const tagsHTML = project.tags.map(tag => `<span class="tag">${tag}</span>`).join('');

                    cardWrapper.innerHTML = `
                    <div class="project-card">
                        <div class="card-image-placeholder">
                            <img src="${project.image}" alt="${project.title}" loading="lazy">
                            <span class="image-label">${project.category}</span>
                        </div>
                        <div class="card-content">
                            <h3 class="card-title">${project.title}</h3>
                            <p class="card-description">${project.description}</p>
                            <div class="card-tags">${tagsHTML}</div>
                            <a href="${project.url}" target="_blank" rel="noopener noreferrer" class="view-project-btn">
                                <span>View Project</span>
                                <svg class="arrow-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    <path d="M12 5L19 12L12 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                            </a>
                        </div>
                    </div>
                `;
                    projectCarouselTrack.appendChild(cardWrapper);

                    const dot = document.createElement('button');
                    dot.className = 'dot';
                    dot.dataset.index = index;
                    dot.setAttribute('aria-label', `Go to item ${index + 1}`);
                    projectDotsContainer.appendChild(dot);
                });
            }

            function updateProjectCarousel() {
                const cardWrappers = document.querySelectorAll('.card-wrapper');
                const dots = document.querySelectorAll('.dot');

                cardWrappers.forEach((wrapper, i) => {
                    wrapper.classList.remove('active', 'next', 'prev', 'hidden-card');
                    if (i === projectActiveIndex) wrapper.classList.add('active');
                    else if (i === (projectActiveIndex + 1) % projectData.length) wrapper.classList.add('next');
                    else if (i === (projectActiveIndex - 1 + projectData.length) % projectData.length) wrapper.classList.add('prev');
                    else wrapper.classList.add('hidden-card');
                });

                dots.forEach((dot, i) => dot.classList.toggle('active', i === projectActiveIndex));
            }

            function populateModalProjectGrid() {
                if (!modalProjectGrid) return;
                modalProjectGrid.innerHTML = `
                <div class="modal-project-item">
                    <img src="project/calculat.PNG" alt="Calculator Web App" loading="lazy">
                    <button class="modal-view-btn" data-url="https://hassan-shirazi.github.io/Calculator-App/">Calculator Web App</button>
                </div>
                <div class="modal-project-item">
                    <img src="project/memo.PNG" alt="Memory Card Game" loading="lazy">
                    <button class="modal-view-btn" data-url="https://hassan-shirazi.github.io/Memory-Card-Game/">Memory Card Game</button>
                </div>
                <div class="modal-project-item">
                    <img src="project/rock.PNG" alt="Rock Paper Scissors Game" loading="lazy">
                    <button class="modal-view-btn" data-url="https://hassan-shirazi.github.io/Rock-Paper-Scissors-Game/">Rock Paper Scissors</button>
                </div>
                <div class="modal-project-item">
                    <img src="project/tic.PNG" alt="Tic Tac Toe Game" loading="lazy">
                    <button class="modal-view-btn" data-url="https://hassan-shirazi.github.io/Tic-Tac-Toe-Game/">Tic Tac Toe</button>
                </div>
                <div class="modal-project-item">
                    <img src="project/TODO.PNG" alt="TO-DO App List" loading="lazy">
                    <button class="modal-view-btn" data-url="https://hassan-shirazi.github.io/To-do-App-List/">TO-DO App List</button>
                </div>
                <div class="modal-project-item">
                    <img src="project/time.PNG" alt="Real Time Clock" loading="lazy">
                    <button class="modal-view-btn" data-url="https://hassan-shirazi.github.io/Real-Time-Clock/">Real Time Clock</button>
                </div>
            `;
            }

            function startProjectAutoRotate() {
                if (!true || isProjectCarouselHovering) return; // AutoRotate is always true for projects
                stopProjectAutoRotate();
                projectAutoRotateInterval = setInterval(goToNextProject, 5000); // 5 seconds
            }

            function stopProjectAutoRotate() {
                clearInterval(projectAutoRotateInterval);
            }

            function goToNextProject() {
                projectActiveIndex = (projectActiveIndex + 1) % projectData.length;
                updateProjectCarousel();
            }

            function goToPrevProject() {
                projectActiveIndex = (projectActiveIndex - 1 + projectData.length) % projectData.length;
                updateProjectCarousel();
            }

            function resetProjectAutoRotate() {
                stopProjectAutoRotate();
                startProjectAutoRotate();
            }

            if (projectPrevButton) {
                projectPrevButton.addEventListener('click', () => {
                    goToPrevProject();
                    resetProjectAutoRotate();
                });
            }
            if (projectNextButton) {
                projectNextButton.addEventListener('click', () => {
                    goToNextProject();
                    resetProjectAutoRotate();
                });
            }
            if (projectDotsContainer) {
                projectDotsContainer.addEventListener('click', (e) => {
                    if (e.target.classList.contains('dot')) {
                        projectActiveIndex = parseInt(e.target.dataset.index);
                        updateProjectCarousel();
                        resetProjectAutoRotate();
                    }
                });
            }
            if (projectCarouselWrapper) {
                projectCarouselWrapper.addEventListener('mouseenter', () => {
                    isProjectCarouselHovering = true;
                    stopProjectAutoRotate();
                });
                projectCarouselWrapper.addEventListener('mouseleave', () => {
                    isProjectCarouselHovering = false;
                    startProjectAutoRotate();
                });

                // Mobile swipe functionality for project carousel
                projectCarouselWrapper.addEventListener('touchstart', e => {
                    projectTouchStart = e.targetTouches[0].clientX;
                    projectTouchEnd = null;
                });
                projectCarouselWrapper.addEventListener('touchmove', e => {
                    projectTouchEnd = e.targetTouches[0].clientX;
                });
                projectCarouselWrapper.addEventListener('touchend', () => {
                    if (!projectTouchStart || !projectTouchEnd) return;
                    const distance = projectTouchStart - projectTouchEnd;
                    if (distance > projectMinSwipeDistance) goToNextProject();
                    else if (distance < -projectMinSwipeDistance) goToPrevProject();
                    resetProjectAutoRotate();
                });
            }

            const openModalBtn = document.querySelector('.view-all-btn');
            if (openModalBtn) {
                openModalBtn.addEventListener('click', () => projectsModal.classList.add('is-open'));
            }
            if (closeModalBtn) {
                closeModalBtn.addEventListener('click', () => projectsModal.classList.remove('is-open'));
            }
            if (projectsModal) {
                projectsModal.addEventListener('click', (e) => {
                    if (e.target === projectsModal) {
                        projectsModal.classList.remove('is-open');
                    }
                });
                document.addEventListener('keydown', (e) => {
                    if (e.key === 'Escape' && projectsModal.classList.contains('is-open')) {
                        projectsModal.classList.remove('is-open');
                    }
                });
            }
            if (modalProjectGrid) {
                modalProjectGrid.addEventListener('click', (e) => {
                    const button = e.target.closest('.modal-view-btn');
                    if (button) {
                        const url = button.dataset.url;
                        if (url) {
                            window.open(url, '_blank', 'noopener,noreferrer');
                        }
                    }
                });
            }

            const projectsSection = document.getElementById('projects');
            if (projectsSection) {
                const projectsObserver = new IntersectionObserver((entries) => {
                    if (entries[0].isIntersecting) {
                        projectsSection.classList.add('is-visible');
                        projectsObserver.unobserve(entries[0].target);
                    }
                }, {
                    threshold: 0.1
                });
                projectsObserver.observe(projectsSection);
            }

            renderProjectCarousel();
            populateModalProjectGrid();
            updateProjectCarousel();
            startProjectAutoRotate();


            // Skills Showcase Logic
            const orbitConfigs = [{
                radius: 120,
                orbitClass: 'orbit-1'
            }, {
                radius: 190,
                orbitClass: 'orbit-2'
            }, {
                radius: 260,
                orbitClass: 'orbit-3'
            }];

            const skillsConfig = [{
                label: "HTML",
                imageSrc: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg"
            }, {
                label: "CSS",
                imageSrc: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg"
            }, {
                label: "JavaScript",
                imageSrc: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg"
            }, {
                label: "jQuery",
                imageSrc: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jquery/jquery-original.svg"
            }, {
                label: "Bootstrap",
                imageSrc: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bootstrap/bootstrap-original.svg"
            }, {
                label: "Git",
                imageSrc: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg"
            }, {
                label: "GitHub",
                imageSrc: "https://img.icons8.com/?size=96&id=AZOZNnY73haj&format=png"
            }, {
                label: "SEO",
                imageSrc: "https://img.icons8.com/?size=96&id=12814&format=png"
            }, {
                label: "WordPress",
                imageSrc: "https://img.icons8.com/?size=96&id=13664&format=png"
            }, {
                label: "Figma",
                imageSrc: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg"
            }, {
                label: "API",
                imageSrc: "https://img.icons8.com/?size=96&id=RlIXjuTUrwoX&format=png"
            }, {
                label: "PHP",
                imageSrc: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg"
            }, {
                label: "MySQL",
                imageSrc: "https://img.icons8.com/?size=96&id=UFXRpPFebwa2&format=png"
            }, {
                label: "Laravel",
                imageSrc: "https://cdn4.iconfinder.com/data/icons/logos-and-brands/512/194_Laravel_logo_logos-128.png"
            }, {
                label: "JSON",
                imageSrc: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/json/json-original.svg"
            }].map((skill, index) => {
                const orbitIndex = Math.floor(index / 5) % orbitConfigs.length;
                const orbit = orbitConfigs[orbitIndex];
                const skillsPerOrbit = 5;
                const positionInOrbit = index % skillsPerOrbit;
                return {
                    ...skill,
                    id: skill.label.toLowerCase().replace(/ /g, '-'),
                    orbitRadius: orbit.radius,
                    orbitClass: orbit.orbitClass,
                    size: 50,
                    speed: orbitIndex % 2 === 0 ? 0.5 : -0.5,
                    phaseShift: (2 * Math.PI / skillsPerOrbit) * positionInOrbit,
                };
            });

            let skillsTime = 0;
            let skillsLastTime = 0;
            let skillsIsPaused = false;
            let skillsAnimationFrameId;

            const orbitContainer = document.getElementById('orbit-container');
            if (orbitContainer) {
                function initializeSkills() {
                    orbitConfigs.forEach(config => {
                        const path = document.createElement('div');
                        path.className = `glowing-orbit-path ${config.orbitClass}`;
                        path.style.width = `${config.radius * 2}px`;
                        path.style.height = `${config.radius * 2}px`;
                        path.innerHTML = `<div class="glow-ring"></div><div class="border-ring"></div>`;
                        orbitContainer.appendChild(path);
                    });

                    skillsConfig.forEach(config => {
                        const wrapper = document.createElement('div');
                        wrapper.id = `skill-${config.id}`;
                        wrapper.className = 'skill-wrapper';
                        wrapper.style.width = `${config.size}px`;
                        wrapper.style.height = `${config.size}px`;
                        wrapper.dataset.orbitRadius = config.orbitRadius;
                        wrapper.dataset.speed = config.speed;
                        wrapper.dataset.phaseShift = config.phaseShift;
                        wrapper.innerHTML = `
                        <div class="skill-icon-container">
                        <img src="${config.imageSrc}" alt="${config.label} Icon">
                        <div class="skill-label">${config.label}</div>
                        </div>
                    `;
                        orbitContainer.appendChild(wrapper);
                        const iconContainer = wrapper.querySelector('.skill-icon-container');
                        wrapper.addEventListener('mouseenter', () => {
                            wrapper.classList.add('is-hovered');
                            iconContainer.classList.add(`${config.orbitClass}-shadow`);
                        });
                        wrapper.addEventListener('mouseleave', () => {
                            wrapper.classList.remove('is-hovered');
                            iconContainer.classList.remove(`${config.orbitClass}-shadow`);
                        });
                    });
                }

                function animateSkills(currentTime) {
                    if (skillsLastTime === 0) {
                        skillsLastTime = currentTime;
                    }
                    const deltaTime = (currentTime - skillsLastTime) / 1000;
                    skillsLastTime = currentTime;

                    if (!skillsIsPaused) {
                        skillsTime += deltaTime;
                        document.querySelectorAll('#skills-showcase .skill-wrapper').forEach(wrapper => {
                            const radius = parseFloat(wrapper.dataset.orbitRadius);
                            const speed = parseFloat(wrapper.dataset.speed);
                            const phaseShift = parseFloat(wrapper.dataset.phaseShift);
                            const angle = skillsTime * speed + phaseShift;
                            const x = Math.cos(angle) * radius;
                            const y = Math.sin(angle) * radius;
                            wrapper.style.transform = `translate(calc(${x}px - 50%), calc(${y}px - 50%))`;
                        });
                    }
                    skillsAnimationFrameId = requestAnimationFrame(animateSkills);
                }

                orbitContainer.addEventListener('mouseenter', () => {
                    skillsIsPaused = true;
                });
                orbitContainer.addEventListener('mouseleave', () => {
                    skillsIsPaused = false;
                    skillsLastTime = 0;
                });

                initializeSkills();
                skillsAnimationFrameId = requestAnimationFrame(animateSkills);
            }

            // Blog Carousel
            const blogProjectsData = [{
                title: "How Ai is Changing The World",
                description: "how ai is changing the world and how ai is eating humans jobs.",
                category: "BLOG , ARTICLE",
                tags: ["Ai", "CSS", "JavaScript", "HTML"],
                image: "blog/b1.png",
                url: "https://hassan-shirazi.github.io/Blog_1-How-Ai-is-Changing-the-World./"
            }, {
                title: "How Social Media Impacting",
                description: "how can socail media impact on young generations and how world is changing due to social media.",
                category: "BLOG , ARTICLE",
                tags: ["HTML", "CSS", "JavaScript", "JQuery"],
                image: "blog/b2.png",
                url: "https://hassan-shirazi.github.io/Blog_2-How-Social-Media-Impacting-on-Young-Generations/"
            }, {
                title: "Education And Learning",
                description: "why education and learning is important to be success in life.",
                category: "BLOG , ARTICLE",
                tags: ["HTML", "CSS", "JavaScript", "Bootstrap"],
                image: "blog/b3.png",
                url: "https://hassan-shirazi.github.io/Blog_3-Education-And-Learning/"
            }];

            const blogSection = document.getElementById('blog-section');
            if (blogSection) {
                const blogContainer = blogSection.querySelector('.bl4-container');
                const blogDotsContainer = blogSection.querySelector('.bl11-dots');
                const blogPrevButton = blogSection.querySelector('.bl10-nav-button.prev-btn');
                const blogNextButton = blogSection.querySelector('.bl10-nav-button.next-btn');

                let blogActiveIndex = 0;
                let blogAutoRotateInterval;
                let isBlogCarouselActive = false;
                const blogMediaQuery = window.matchMedia('(max-width: 768px)');

                function renderBlogProjects() {
                    blogContainer.innerHTML = '';
                    blogDotsContainer.innerHTML = '';
                    blogProjectsData.forEach((project, index) => {
                        const tagsHTML = project.tags.map(tag => `<span class="bl9-tag-item">${tag}</span>`).join('');

                        const card = document.createElement('div');
                        card.className = 'bl5-card';
                        card.dataset.index = index;
                        card.innerHTML = `
                        <div class="bl6-image-wrapper">
                            <img src="${project.image}" alt="${project.title}" loading="lazy">
                            <span class="bl7-image-label">${project.category}</span>
                        </div>
                        <div class="bl8-content">
                            <h3 class="bl9-title">${project.title}</h3>
                            <p class="bl9-description">${project.description}</p>
                            <div class="bl9-tags">${tagsHTML}</div>
                            <a href="${project.url}" target="_blank" rel="noopener noreferrer" class="bl9-view-btn">
                                <span>View Project</span>
                                <svg class="arrow-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    <path d="M12 5L19 12L12 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                            </a>
                        </div>
                    `;
                        blogContainer.appendChild(card);

                        const dot = document.createElement('button');
                        dot.className = 'bl11-dot-item';
                        dot.dataset.index = index;
                        dot.setAttribute('aria-label', `Go to item ${index + 1}`);
                        blogDotsContainer.appendChild(dot);
                    });
                }

                function updateBlogCarousel() {
                    if (!isBlogCarouselActive) return;
                    const cards = blogSection.querySelectorAll('.bl5-card');
                    const dots = blogSection.querySelectorAll('.bl11-dot-item');

                    cards.forEach((card, i) => {
                        card.classList.remove('active', 'next', 'prev', 'hidden-card');
                        if (i === blogActiveIndex) card.classList.add('active');
                        else if (i === (blogActiveIndex + 1) % blogProjectsData.length) card.classList.add('next');
                        else if (i === (blogActiveIndex - 1 + blogProjectsData.length) % blogProjectsData.length) card.classList.add('prev');
                        else card.classList.add('hidden-card');
                    });
                    dots.forEach((dot, i) => dot.classList.toggle('active', i === blogActiveIndex));
                }

                function startBlogAutoRotate() {
                    stopBlogAutoRotate();
                    blogAutoRotateInterval = setInterval(() => {
                        blogActiveIndex = (blogActiveIndex + 1) % blogProjectsData.length;
                        updateBlogCarousel();
                    }, 5000);
                }

                function stopBlogAutoRotate() {
                    clearInterval(blogAutoRotateInterval);
                }

                const handleBlogNext = () => {
                    blogActiveIndex = (blogActiveIndex + 1) % blogProjectsData.length;
                    updateBlogCarousel();
                    startBlogAutoRotate();
                };
                const handleBlogPrev = () => {
                    blogActiveIndex = (blogActiveIndex - 1 + blogProjectsData.length) % blogProjectsData.length;
                    updateBlogCarousel();
                    startBlogAutoRotate();
                };
                const handleBlogDotClick = (e) => {
                    if (e.target.matches('.bl11-dot-item')) {
                        blogActiveIndex = parseInt(e.target.dataset.index);
                        updateBlogCarousel();
                        startBlogAutoRotate();
                    }
                };

                let blogTouchStart = null;
                const handleBlogTouchStart = (e) => {
                    blogTouchStart = e.targetTouches[0].clientX;
                };
                const handleBlogTouchMove = (e) => {
                    if (blogTouchStart === null) return;
                    const touchEnd = e.targetTouches[0].clientX;
                    const distance = blogTouchStart - touchEnd;
                    if (distance > 50) {
                        handleBlogNext();
                        blogTouchStart = null;
                    } else if (distance < -50) {
                        handleBlogPrev();
                        blogTouchStart = null;
                    }
                };

                function setupBlogCarousel() {
                    if (isBlogCarouselActive) return;
                    isBlogCarouselActive = true;
                    if (blogNextButton) blogNextButton.addEventListener('click', handleBlogNext);
                    if (blogPrevButton) blogPrevButton.addEventListener('click', handleBlogPrev);
                    if (blogDotsContainer) blogDotsContainer.addEventListener('click', handleBlogDotClick);
                    if (blogContainer) {
                        blogContainer.addEventListener('touchstart', handleBlogTouchStart);
                        blogContainer.addEventListener('touchmove', handleBlogTouchMove);
                    }
                    updateBlogCarousel();
                    startBlogAutoRotate();
                }

                function destroyBlogCarousel() {
                    if (!isBlogCarouselActive) return;
                    isBlogCarouselActive = false;
                    stopBlogAutoRotate();
                    blogSection.querySelectorAll('.bl5-card').forEach(card => card.classList.remove('active', 'next', 'prev', 'hidden-card'));
                    if (blogNextButton) blogNextButton.removeEventListener('click', handleBlogNext);
                    if (blogPrevButton) blogPrevButton.removeEventListener('click', handleBlogPrev);
                    if (blogDotsContainer) blogDotsContainer.removeEventListener('click', handleBlogDotClick);
                    if (blogContainer) {
                        blogContainer.removeEventListener('touchstart', handleBlogTouchStart);
                        blogContainer.removeEventListener('touchmove', handleBlogTouchMove);
                    }
                }

                function handleBlogScreenChange(e) {
                    if (e.matches) {
                        setupBlogCarousel();
                    } else {
                        destroyBlogCarousel();
                    }
                }

                renderBlogProjects();
                blogMediaQuery.addEventListener('change', handleBlogScreenChange);
                handleBlogScreenChange(blogMediaQuery);

                const blogObserver = new IntersectionObserver((entries) => {
                    if (entries[0].isIntersecting) {
                        blogSection.classList.add('is-visible');
                        blogObserver.unobserve(entries[0].target);
                    }
                }, {
                    threshold: 0.1
                });
                blogObserver.observe(blogSection);
            }

            // Education Accordion
            const accordionHeaders = document.querySelectorAll('.accordion-header');
            accordionHeaders.forEach(header => {
                header.addEventListener('click', () => {
                    const accordionItem = header.closest('.accordion-item');
                    accordionItem.classList.toggle('active');

                    accordionHeaders.forEach(otherHeader => {
                        const otherItem = otherHeader.closest('.accordion-item');
                        if (otherItem !== accordionItem && otherItem.classList.contains('active')) {
                            otherItem.classList.remove('active');
                        }
                    });
                });
            });

            // Socials Section (Fade-in)
            const socialCards = document.querySelectorAll('.socials-container .social-card');
            if (socialCards.length > 0) {
                if (!('IntersectionObserver' in window)) {
                    socialCards.forEach(card => card.classList.add('visible'));
                } else {
                    const socialsObserver = new IntersectionObserver((entries) => {
                        entries.forEach((entry, index) => {
                            if (entry.isIntersecting) {
                                setTimeout(() => {
                                    entry.target.classList.add('visible');
                                }, index * 100);
                                socialsObserver.unobserve(entry.target);
                            }
                        });
                    }, {
                        threshold: 0.1
                    });

                    socialCards.forEach(card => {
                        socialsObserver.observe(card);
                    });
                }
            }

            // Contact Form Logic
            const form = document.getElementById('contactForm');
            const fullNameInput = document.getElementById('fullName');
            const emailAddressInput = document.getElementById('emailAddress');
            const phoneNumberInput = document.getElementById('phoneNumber');
            const messageInput = document.getElementById('message');
            const submitButton = form ? form.querySelector('.submit-btn') : null;
            const formStatusDiv = document.getElementById('formStatus');

            const showError = (input, message) => {
                const formGroup = input.parentElement;
                const errorMessage = formGroup.querySelector('.error-message');
                input.classList.add('invalid');
                errorMessage.textContent = message;
                errorMessage.style.display = 'block';
                input.setAttribute('aria-invalid', 'true');
                input.setAttribute('aria-errormessage', errorMessage.id);
            };

            const clearError = (input) => {
                const formGroup = input.parentElement;
                const errorMessage = formGroup.querySelector('.error-message');
                input.classList.remove('invalid');
                errorMessage.textContent = '';
                errorMessage.style.display = 'none';
                input.setAttribute('aria-invalid', 'false');
                input.removeAttribute('aria-errormessage');
            };

            const validateFullName = () => {
                if (fullNameInput.value.trim() === '') {
                    showError(fullNameInput, 'Full Name is required.');
                    return false;
                } else if (fullNameInput.value.trim().length < 3) {
                    showError(fullNameInput, 'Full Name must be at least 3 characters.');
                    return false;
                } else {
                    clearError(fullNameInput);
                    return true;
                }
            };

            const validateEmail = () => {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (emailAddressInput.value.trim() === '') {
                    showError(emailAddressInput, 'Email Address is required.');
                    return false;
                } else if (!emailRegex.test(emailAddressInput.value.trim())) {
                    showError(emailAddressInput, 'Please enter a valid email address.');
                    return false;
                } else {
                    clearError(emailAddressInput);
                    return true;
                }
            };

            const validatePhoneNumber = () => {
                const phoneRegex = /^[\s()+-]*([0-9][\s()+-]*){6,20}$/;
                if (phoneNumberInput.value.trim() === '') {
                    clearError(phoneNumberInput);
                    return true;
                } else if (!phoneRegex.test(phoneNumberInput.value.trim())) {
                    showError(phoneNumberInput, 'Please enter a valid phone number (e.g., +1 (555) 123-4567).');
                    return false;
                } else {
                    clearError(phoneNumberInput);
                    return true;
                }
            };

            const validateMessage = () => {
                if (messageInput.value.trim() === '') {
                    showError(messageInput, 'Message is required.');
                    return false;
                } else if (messageInput.value.trim().length < 10) {
                    showError(messageInput, 'Message should be at least 10 characters long.');
                    return false;
                } else {
                    clearError(messageInput);
                    return true;
                }
            };

            const validateForm = () => {
                const isFullNameValid = fullNameInput ? validateFullName() : true;
                const isEmailValid = emailAddressInput ? validateEmail() : true;
                const isPhoneNumberValid = phoneNumberInput ? validatePhoneNumber() : true;
                const isMessageValid = messageInput ? validateMessage() : true;

                return isFullNameValid && isEmailValid && isPhoneNumberValid && isMessageValid;
            };

            if (fullNameInput) fullNameInput.addEventListener('input', validateFullName);
            if (emailAddressInput) emailAddressInput.addEventListener('input', validateEmail);
            if (phoneNumberInput) phoneNumberInput.addEventListener('input', validatePhoneNumber);
            if (messageInput) messageInput.addEventListener('input', validateMessage);

            if (form) {
                form.addEventListener('submit', async function (event) {
                    event.preventDefault();

                    if (!validateForm()) {
                        displayFormStatus('Please correct the errors in the form.', 'error');
                        const firstInvalid = document.querySelector('.invalid');
                        if (firstInvalid) {
                            firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            firstInvalid.focus();
                        }
                        return;
                    }

                    if (submitButton) {
                        submitButton.disabled = true;
                        submitButton.textContent = 'Sending...';
                        submitButton.prepend(createLoadingSpinner());
                    }
                    clearFormStatus();

                    try {
                        const formData = new FormData(form);
                        const response = await fetch(form.action, {
                            method: 'POST',
                            body: formData,
                            headers: {
                                'Accept': 'application/json'
                            }
                        });

                        if (response.ok) {
                            displayFormStatus('Thank you for your message! We will get back to you soon.', 'success');
                            form.reset();
                            [fullNameInput, emailAddressInput, phoneNumberInput, messageInput].forEach(input => {
                                if (input) clearError(input);
                            });
                        } else {
                            const errorData = await response.json();
                            let errorMessage = 'Oops! There was an issue sending your message.';
                            if (errorData && errorData.errors) {
                                errorMessage += ' ' + errorData.errors.map(e => `${e.field}: ${e.message}`).join(', ');
                            } else if (errorData && errorData.error) {
                                errorMessage += ' ' + errorData.error;
                            }
                            displayFormStatus(errorMessage, 'error');
                        }
                    } catch (error) {
                        console.error('Network or Submission error:', error);
                        displayFormStatus('Network error. Please check your internet connection and try again.', 'error');
                    } finally {
                        if (submitButton) {
                            submitButton.disabled = false;
                            submitButton.textContent = 'Send Message';
                            removeLoadingSpinner();
                        }
                    }
                });
            }

            function displayFormStatus(message, type) {
                if (!formStatusDiv) return;
                formStatusDiv.textContent = message;
                formStatusDiv.className = `form-status-message ${type}`;
                void formStatusDiv.offsetWidth;
                formStatusDiv.style.opacity = '1';
                formStatusDiv.style.transform = 'translateY(0)';
            }

            function clearFormStatus() {
                if (!formStatusDiv) return;
                formStatusDiv.textContent = '';
                formStatusDiv.className = 'form-status-message';
                formStatusDiv.style.opacity = '0';
                formStatusDiv.style.transform = 'translateY(10px)';
            }

            function createLoadingSpinner() {
                const spinner = document.createElement('i');
                spinner.classList.add('fas', 'fa-spinner', 'fa-spin', 'loading-spinner');
                return spinner;
            }

            function removeLoadingSpinner() {
                const spinner = form ? form.querySelector('.loading-spinner') : null;
                if (spinner) {
                    spinner.remove();
                }
            }

           
            const currentYearSpan = document.getElementById('current-year');
            if (currentYearSpan) {
                currentYearSpan.textContent = new Date().getFullYear();
            }
        });
        