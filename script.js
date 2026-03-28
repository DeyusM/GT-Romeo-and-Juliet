document.addEventListener('DOMContentLoaded', () => {
    // 1. Spawning Dynamic Rose Petals / Sparks Effect
    const particlesContainer = document.getElementById('particles');

    function createParticle() {
        if (!particlesContainer) return;
        const particle = document.createElement('div');
        particle.classList.add('ember'); 
        const size = Math.random() * 8 + 10; 
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${Math.random() * 100}vw`;
        particle.style.top = `-20px`; 
        const duration = Math.random() * 6 + 6; 
        particle.style.animationDuration = `${duration}s`;
        particlesContainer.appendChild(particle);
        setTimeout(() => {
            if (particlesContainer.contains(particle)) { particle.remove(); }
        }, duration * 1000);
    }
    setInterval(createParticle, 400);

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
                window.scrollTo({
                    top: targetElem.offsetTop - 80, // strict 80px navbar offset
                    behavior: 'smooth'
                });
            }
        });
    });

    // 5. Interactive 3D Balcony
    const scene = document.getElementById('balcony-scene');
    const balcony = document.getElementById('balcony-model');
    let isDragging = false;
    let startX = 0, startY = 0;
    let rotX = -15, rotY = -20; // Matches initial CSS transform
    
    if(scene && balcony) {
        scene.addEventListener('mousedown', (e) => {
            isDragging = true;
            startX = e.clientX; startY = e.clientY;
        });
        document.addEventListener('mouseup', () => isDragging = false);
        // Fallback for if mouse leaves the bounding area while dragging down
        document.addEventListener('mouseleave', () => isDragging = false);
        
        scene.addEventListener('mousemove', (e) => {
            if(!isDragging) return;
            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;
            rotY += deltaX * 0.5;
            rotX -= deltaY * 0.5;
            rotX = Math.max(-45, Math.min(45, rotX)); // limit X rotation (up/down pitch)
            balcony.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;
            startX = e.clientX; startY = e.clientY;
        });
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
});
