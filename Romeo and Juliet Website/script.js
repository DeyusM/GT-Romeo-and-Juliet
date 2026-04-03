document.addEventListener('DOMContentLoaded', () => {
    // 0. Trigger Hero Animations on Load
    const heroReveal = document.querySelector('.hero-content.reveal');
    if (heroReveal) {
        setTimeout(() => {
            heroReveal.classList.add('active');
        }, 100);
    }

    // 1. Global Interactive Particle Physics Canvas
    const canvas = document.getElementById('global-physics-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        const particles = [];
        const numParticles = 800; // Native Canvas can handle hundreds easily without lag

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.size = Math.random() * 1.5 + 0.5; // Tiny embers
                // A beautiful, soft palette of romantic pinks, magentas, and deep rose-golds
                this.color = Math.random() > 0.5 ? `rgba(235, 177, 186, ${Math.random() * 0.7 + 0.3})` : `rgba(224, 23, 83, ${Math.random() * 0.7 + 0.3})`;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = Math.random() * -1.5 - 0.5; // Float upwards fairly quickly
            }
            update() {
                // If the global cursor is nearby, apply heavy repulsion force
                if (window.mouseX !== undefined && window.mouseY !== undefined) {
                    const dx = this.x - window.mouseX;
                    const dy = this.y - window.mouseY;
                    const dist = Math.sqrt(dx*dx + dy*dy);
                    if (dist < 150) {
                        const force = (150 - dist) / 150;
                        this.vx += (dx / dist) * force * 1.8;
                        this.vy += (dy / dist) * force * 1.8;
                    }
                }
                
                // Natural deceleration physics (Friction) back to constant drift
                this.vx *= 0.95; 
                this.vy = this.vy * 0.95 + (-0.8 * 0.05); 
                
                this.x += this.vx;
                this.y += this.vy;
                
                // Continuous global screen wrapping
                if (this.y < -10) this.y = height + 10;
                if (this.x < -10) this.x = width + 10;
                if (this.x > width + 10) this.x = -10;
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.fill();
            }
        }
        for(let i=0; i<numParticles; i++) particles.push(new Particle());

        function animateCanvas() {
            ctx.clearRect(0, 0, width, height);
            for(let i=0; i<particles.length; i++) {
                particles[i].update();
                particles[i].draw();
            }
            requestAnimationFrame(animateCanvas);
        }
        animateCanvas();

        // Dynamically resize physics bounds when window resizes
        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            // Respawn particles out of bounds
            particles.forEach(p => { if(p.x > width) p.x = Math.random() * width; if(p.y > height) p.y = height + 10; });
        });

        // Track global mouse
        window.addEventListener('mousemove', (e) => {
            window.mouseX = e.clientX;
            window.mouseY = e.clientY;
        });
        window.addEventListener('mouseleave', () => {
            window.mouseX = undefined;
            window.mouseY = undefined;
        });
    }

    // 2. House Allegiance Toggle Logic
    const toggle = document.getElementById('house-toggle');
    const labelCap = document.querySelector('.house-label.capulet');
    const labelMon = document.querySelector('.house-label.montague');
    
    if (toggle && labelCap && labelMon) {
        toggle.addEventListener('change', () => {
            if(toggle.checked) {
                document.body.classList.add('theme-montague');
                labelMon.classList.add('active');
                labelCap.classList.remove('active');
            } else {
                document.body.classList.remove('theme-montague');
                labelCap.classList.add('active');
                labelMon.classList.remove('active');
            }
        });
        labelCap.classList.add('active'); // Initial state
    }

    // 3. Navbar scroll effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) { navbar.classList.add('scrolled'); } 
        else { navbar.classList.remove('scrolled'); }
    });

    // 4. Smooth scroll for anchor links
    document.querySelectorAll('.nav-links a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElem = document.querySelector(targetId);
            if(targetElem) {
                const targetPosition = targetElem.getBoundingClientRect().top + window.scrollY - 80;
                window.scrollTo({
                    top: targetPosition, // accurate 80px navbar offset
                    behavior: 'smooth'
                });
            }
        });
    });

    // 4.5. Scroll Reveal Intersection Observer (Shopify-like animations)
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Animates only once
            }
        });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    revealElements.forEach(el => revealObserver.observe(el));

    // 5. Interactive "Star-Crossed" Constellations
    const constelContainer = document.getElementById('constellation-container');
    const constelCanvas = document.getElementById('constellation-canvas');
    if (constelContainer && constelCanvas) {
        const cCtx = constelCanvas.getContext('2d');
        let cWidth = constelCanvas.width = constelContainer.clientWidth;
        let cHeight = constelCanvas.height = constelContainer.clientHeight;

        const stars = [];
        const numStars = 150;
        
        // Mouse tracking local to this box
        const cMouse = { x: -9999, y: -9999 };

        class Star {
            constructor() {
                this.x = Math.random() * cWidth;
                this.y = Math.random() * cHeight;
                this.size = Math.random() * 2 + 0.5;
                this.vx = (Math.random() - 0.5) * 0.4;
                this.vy = (Math.random() - 0.5) * 0.4;
            }
            update() {
                this.x += this.vx;
                this.y += this.vy;
                if (this.x < 0 || this.x > cWidth) this.vx *= -1;
                if (this.y < 0 || this.y > cHeight) this.vy *= -1;
            }
            draw() {
                cCtx.beginPath();
                cCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                cCtx.fillStyle = 'rgba(235, 177, 186, 0.8)'; // Rose gold
                cCtx.fill();
            }
        }

        for (let i = 0; i < numStars; i++) {
            stars.push(new Star());
        }

        function drawConstellations() {
            cCtx.clearRect(0, 0, cWidth, cHeight);
            
            for (let i = 0; i < stars.length; i++) {
                stars[i].update();
                stars[i].draw();
                
                // Only draw lines if mouse is actively in the section
                if (cMouse.x !== -9999) {
                    const dxMouse = stars[i].x - cMouse.x;
                    const dyMouse = stars[i].y - cMouse.y;
                    const distMouse = Math.sqrt(dxMouse*dxMouse + dyMouse*dyMouse);
                    
                    // If star is near cursor, attempt to link it to other nearby stars
                    if (distMouse < 180) {
                        for (let j = i + 1; j < stars.length; j++) {
                            const dx = stars[i].x - stars[j].x;
                            const dy = stars[i].y - stars[j].y;
                            const dist = Math.sqrt(dx*dx + dy*dy);
                            
                            // Link distance radius between two stars
                            if (dist < 100) {
                                cCtx.beginPath();
                                cCtx.moveTo(stars[i].x, stars[i].y);
                                cCtx.lineTo(stars[j].x, stars[j].y);
                                
                                // Opacity fades out the further they stretch or further from mouse
                                const opacity = (1 - dist/100) * (1 - distMouse/180) * 0.8;
                                cCtx.strokeStyle = `rgba(235, 177, 186, ${opacity})`;
                                cCtx.lineWidth = 1;
                                cCtx.stroke();
                            }
                        }
                    }
                }
            }
            requestAnimationFrame(drawConstellations);
        }
        drawConstellations();

        constelContainer.addEventListener('mousemove', (e) => {
            const rect = constelContainer.getBoundingClientRect();
            cMouse.x = e.clientX - rect.left;
            cMouse.y = e.clientY - rect.top;
        });
        constelContainer.addEventListener('mouseleave', () => {
            cMouse.x = -9999;
            cMouse.y = -9999;
        });

        // Resize natively
        const observer = new ResizeObserver(() => {
            if(constelContainer.clientWidth && constelContainer.clientHeight) {
                cWidth = constelCanvas.width = constelContainer.clientWidth;
                cHeight = constelCanvas.height = constelContainer.clientHeight;
            }
        });
        observer.observe(constelContainer);
    }

    // 6. Character Connections Web
    const characters = {
        juliet: { name: "Juliet Capulet", desc: "The fiery, pragmatic daughter of Lord Capulet. Her fatal loyalties are tested by love.", links: ["Romeo (Secret Husband)", "The Nurse (Confidante / Surrogate Mother)", "Tybalt (Cousin)"], targets: ['romeo', 'nurse', 'tybalt'] },
        romeo: { name: "Romeo Montague", desc: "A passionate but impulsive young Montague. Driven entirely by his heart, ignoring the ancient feud.", links: ["Juliet (Secret Wife)", "Mercutio (Best Friend)", "Friar Laurence (Mentor / Conspirator)"], targets: ['juliet', 'mercutio', 'friar'] },
        tybalt: { name: "Tybalt Capulet", desc: "Juliet's hot-headed cousin. The embodiment of the pure hatred between the two families.", links: ["Juliet (Cousin)", "Romeo (Mortal Enemy)", "Mercutio (Victim)"], targets: ['juliet', 'romeo', 'mercutio'] },
        mercutio: { name: "Mercutio", desc: "Romeo's volatile, witty best friend. He cynically mocks love and loyalty, only to die for it.", links: ["Romeo (Best Friend)", "Tybalt (His Murderer)"], targets: ['romeo', 'tybalt'] },
        nurse: { name: "The Nurse", desc: "Juliet's loyal surrogate mother, providing comic relief but ultimately failing to support Juliet's ultimate defiance.", links: ["Juliet (Surrogate Daughter)"], targets: ['juliet'] },
        friar: { name: "Friar Laurence", desc: "The well-meaning but disastrous orchestrator. He hopes their forbidden love will end the feud.", links: ["Romeo (Mentee)", "Juliet (Accomplice)"], targets: ['romeo', 'juliet'] }
    };

    const nodes = document.querySelectorAll('.character-node');
    const panel = document.getElementById('char-panel');
    
    if(panel) {
        nodes.forEach(node => {
            node.addEventListener('click', () => {
                const charId = node.getAttribute('data-char');
                const data = characters[charId];
                
                // UI States
                nodes.forEach(n => {
                    n.classList.remove('active', 'highlight', 'dimmed');
                    const otherCharId = n.getAttribute('data-char');
                    if(n === node) {
                        n.classList.add('active');
                    } else if(data.targets.includes(otherCharId)) {
                        n.classList.add('highlight');
                    } else {
                        n.classList.add('dimmed');
                    }
                });
                
                // Populate Panel
                panel.querySelector('h3').textContent = data.name;
                panel.querySelector('.char-desc').textContent = data.desc;
                const ul = panel.querySelector('.char-connections');
                ul.innerHTML = '';
                data.links.forEach(link => {
                    const li = document.createElement('li');
                    const parts = link.split(' (');
                    if(parts.length > 1) {
                        li.innerHTML = `<strong>${parts[0]}</strong> (${parts[1]}`;
                    } else {
                        li.innerHTML = `<strong>${link}</strong>`;
                    }
                    ul.appendChild(li);
                });
            });
        });
    }

    // 7. "Wow" Factor Custom Cursor & Hover Physics
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorRing = document.querySelector('.cursor-ring');
    let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
    let ringX = mouseX, ringY = mouseY;

    if (cursorDot && cursorRing) {
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
        });
        
        // Physics for ring lagging behind
        const renderCursor = () => {
            ringX += (mouseX - ringX) * 0.2; // Spring physics
            ringY += (mouseY - ringY) * 0.2;
            cursorRing.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
            requestAnimationFrame(renderCursor);
        };
        requestAnimationFrame(renderCursor);

        // Hover expand effects on interactive items
        const interactibles = document.querySelectorAll('a, button, input[type="checkbox"], .character-node, .flip-container, .scene');
        interactibles.forEach(el => {
            el.addEventListener('mouseenter', () => cursorRing.classList.add('hovered'));
            el.addEventListener('mouseleave', () => cursorRing.classList.remove('hovered'));
        });
    }

    // 8. Hero Section Mouse Parallax
    const heroContent = document.querySelector('.hero-content');
    const heroBg = document.querySelector('.hero');
    if (heroContent && heroBg) {
        document.addEventListener('mousemove', (e) => {
            const xPos = (e.clientX / window.innerWidth - 0.5) * 20; // -10 to 10
            const yPos = (e.clientY / window.innerHeight - 0.5) * 20;
            // Move text opposite to mouse
            heroContent.style.transform = `translate(${-xPos}px, ${-yPos}px)`;
            // Tweak background slightly
            heroBg.style.backgroundPosition = `calc(50% + ${xPos*2}px) calc(50% + ${yPos*2}px)`;
        });
    }

    // 9. Magnetic Hover on navbar Links
    const magneticLinks = document.querySelectorAll('.nav-links a');
    magneticLinks.forEach(link => {
        link.addEventListener('mousemove', (e) => {
            const pos = link.getBoundingClientRect();
            const x = e.clientX - pos.left - pos.width/2;
            const y = e.clientY - pos.top - pos.height/2;
            link.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px) scale(1.1)`;
            link.style.transition = 'transform 0.1s ease-out';
            link.style.display = 'inline-block'; // Required for transform
        });
        link.addEventListener('mouseleave', () => {
            link.style.transform = 'translate(0px, 0px) scale(1)';
            link.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
        });
    });

    // 10. Interactive Card Glare
    const cards = document.querySelectorAll('.glass-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });

});
