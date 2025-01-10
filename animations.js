class AnimationEffects {
    constructor() {
        this.bubbleCount = 0;
        this.maxBubbles = 15;
        this.showIntro();
        setTimeout(() => {
            this.initCursor();
            this.initBubbles();
        }, 5000); // Reduced to 5 seconds
    }

    showIntro() {
        const intro = document.createElement('div');
        intro.className = 'intro-screen';
        
        // Add floating particles
        this.addFloatingParticles(intro);
        
        // Add Mini Project text
        const miniProjectDiv = document.createElement('div');
        miniProjectDiv.className = 'mini-project-text';
        
        const miniText = document.createElement('div');
        miniText.className = 'mini-text';
        miniText.textContent = 'Mini';
        miniText.style.animationDelay = '0.5s';
        
        const projectText = document.createElement('div');
        projectText.className = 'project-text';
        projectText.textContent = 'Project';
        projectText.style.animationDelay = '0.8s';
        
        miniProjectDiv.appendChild(miniText);
        miniProjectDiv.appendChild(projectText);
        intro.appendChild(miniProjectDiv);

        // Add "Submitted By:" text
        const submittedText = document.createElement('div');
        submittedText.className = 'intro-text submitted-text';
        submittedText.textContent = 'Submitted By:';
        submittedText.style.animationDelay = '1.2s';
        submittedText.style.animation = 'fadeInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards';
        intro.appendChild(submittedText);

        const names = [
            'Shaurya Srivastava',
            'Suhani Sharma',
            'Nitya Umrao',
            'Vedansh Gupta',
            'Sheetal'
        ];

        // Create and add name elements with alternating directions
        names.forEach((name, index) => {
            const nameEl = document.createElement('div');
            nameEl.className = 'intro-text';
            nameEl.textContent = name;
            nameEl.style.animationDelay = `${1.5 + index * 0.3}s`;
            nameEl.style.animation = `${index % 2 === 0 ? 'slideInLeft' : 'slideInRight'} 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards, float 2s infinite ease-in-out ${1.5 + index * 0.3}s`;
            intro.appendChild(nameEl);
        });

        // Add college name
        const college = document.createElement('div');
        college.className = 'intro-text college-text';
        college.textContent = 'PSIT Kanpur';
        college.style.animationDelay = '3s';
        college.style.animation = 'slideInRight 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards, float 2s infinite ease-in-out 3s';
        intro.appendChild(college);

        // Add section
        const section = document.createElement('div');
        section.className = 'intro-text section-text';
        section.textContent = 'CS-CYS-2B';
        section.style.animationDelay = '3.3s';
        section.style.animation = 'slideInLeft 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards, float 2s infinite ease-in-out 3.3s';
        intro.appendChild(section);

        document.body.appendChild(intro);

        // Start butterfly effect
        setTimeout(() => {
            this.createButterflies(intro);
        }, 4000);
    }

    addFloatingParticles(intro) {
        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.className = 'floating-particle';
            
            const size = Math.random() * 4 + 2;
            const tx = (Math.random() - 0.5) * 200;
            const ty = (Math.random() - 0.5) * 200;
            
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = `${Math.random() * 100}%`;
            particle.style.setProperty('--tx', `${tx}px`);
            particle.style.setProperty('--ty', `${ty}px`);
            particle.style.animationDelay = `${Math.random() * 2}s`;
            
            intro.appendChild(particle);
        }
    }

    createButterflies(intro) {
        const elements = intro.querySelectorAll('.intro-text');
        const butterflies = [];
        
        elements.forEach(element => {
            const rect = element.getBoundingClientRect();
            const numParticles = 30;
            
            for (let i = 0; i < numParticles; i++) {
                const butterfly = document.createElement('div');
                butterfly.className = 'butterfly';
                
                butterfly.style.left = `${rect.left + Math.random() * rect.width}px`;
                butterfly.style.top = `${rect.top + Math.random() * rect.height}px`;
                butterfly.style.backgroundColor = `hsl(${Math.random() * 360}, 80%, 60%)`;
                
                intro.appendChild(butterfly);
                butterflies.push(butterfly);
            }
        });

        requestAnimationFrame(() => {
            butterflies.forEach(butterfly => {
                const angle = Math.random() * Math.PI * 2;
                const distance = Math.random() * 1000 + 500;
                
                butterfly.style.transform = `translate(
                    ${Math.cos(angle) * distance}px,
                    ${Math.sin(angle) * distance}px
                ) rotate(${Math.random() * 720}deg) scale(0)`;
                butterfly.style.opacity = '0';
                butterfly.style.transition = 'all 1.5s cubic-bezier(0.4, 0, 0.2, 1)';
            });
        });

        setTimeout(() => {
            intro.classList.add('fade-out');
            setTimeout(() => intro.remove(), 800);
        }, 1000);
    }

    initCursor() {
        const cursor = document.createElement('div');
        cursor.classList.add('cursor-effect');
        document.body.appendChild(cursor);

        let cursorX = 0;
        let cursorY = 0;
        let currentX = 0;
        let currentY = 0;
        let lastSparkleTime = 0;
        let lastTrailTime = 0;
        const sparkleInterval = 40; // More frequent sparkles
        const trailInterval = 15; // More frequent trails

        // Rainbow colors array
        const colors = [
            '#FF0000', // Red
            '#FF7F00', // Orange
            '#FFFF00', // Yellow
            '#00FF00', // Green
            '#0000FF', // Blue
            '#4B0082', // Indigo
            '#9400D3', // Violet
            '#FF1493', // Pink
            '#00FFFF', // Cyan
            '#FF4500', // Orange Red
            '#1DB954'  // Spotify Green
        ];

        // Create sparkle with spread
        const createSparkle = (x, y) => {
            const sparkle = document.createElement('div');
            sparkle.className = 'sparkle';
            sparkle.style.left = `${x}px`;
            sparkle.style.top = `${y}px`;
            sparkle.style.color = colors[Math.floor(Math.random() * colors.length)];
            document.body.appendChild(sparkle);

            // Random spread direction
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * 100 + 50; // Increased spread distance
            const tx = Math.cos(angle) * distance;
            const ty = Math.sin(angle) * distance;
            
            sparkle.animate([
                { transform: 'translate(0, 0) scale(1) rotate(0deg)' },
                { transform: `translate(${tx}px, ${ty}px) scale(0) rotate(${360 + Math.random() * 720}deg)` }
            ], {
                duration: 1000 + Math.random() * 500,
                easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
                fill: 'forwards'
            });

            setTimeout(() => sparkle.remove(), 1500);
        };

        // Create trail with color
        const createTrail = (x, y) => {
            const trail = document.createElement('div');
            trail.className = 'cursor-trail';
            trail.style.left = `${x}px`;
            trail.style.top = `${y}px`;
            trail.style.color = colors[Math.floor(Math.random() * colors.length)];
            document.body.appendChild(trail);

            // Random spread for trail
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * 30 + 10;
            const tx = Math.cos(angle) * distance;
            const ty = Math.sin(angle) * distance;

            trail.animate([
                { transform: 'translate(0, 0) scale(1)', opacity: 0.6 },
                { transform: `translate(${tx}px, ${ty}px) scale(0)`, opacity: 0 }
            ], {
                duration: 800,
                easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
                fill: 'forwards'
            });

            setTimeout(() => trail.remove(), 800);
        };

        // Create multiple trails for spread effect
        const createTrailSpread = (x, y) => {
            for (let i = 0; i < 3; i++) {
                setTimeout(() => createTrail(x, y), i * 50);
            }
        };

        document.addEventListener('mousemove', (e) => {
            cursorX = e.clientX;
            cursorY = e.clientY;

            const now = Date.now();
            if (now - lastSparkleTime > sparkleInterval) {
                createSparkle(cursorX, cursorY);
                lastSparkleTime = now;
            }

            if (now - lastTrailTime > trailInterval) {
                createTrailSpread(cursorX, cursorY);
                lastTrailTime = now;
            }
        });

        // Smooth cursor movement
        const updateCursor = () => {
            const dx = cursorX - currentX;
            const dy = cursorY - currentY;
            
            currentX += dx * 0.15;
            currentY += dy * 0.15;
            
            cursor.style.transform = `translate3d(${currentX - cursor.offsetWidth/2}px, ${currentY - cursor.offsetHeight/2}px, 0)`;
            
            requestAnimationFrame(updateCursor);
        };

        updateCursor();

        // Enhanced hover effect
        const interactiveElements = document.querySelectorAll('a, button, .nav-option, .song-row');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                // Make cursor 5 times bigger
                cursor.style.transform = `translate3d(${currentX - cursor.offsetWidth/2}px, ${currentY - cursor.offsetHeight/2}px, 0) scale(5)`;
                cursor.style.background = 'rgba(29, 185, 84, 0.15)';
                cursor.style.border = '2px solid rgba(29, 185, 84, 0.5)';
                cursor.style.backdropFilter = 'blur(4px)';
                cursor.classList.add('hover');
                
                // Create enhanced burst effect
                for (let i = 0; i < 16; i++) { // More particles
                    setTimeout(() => {
                        createSparkle(currentX, currentY);
                        createTrailSpread(currentX, currentY);
                    }, i * 40); // Faster spread
                }

                // Add magnetic effect with larger range
                el.addEventListener('mousemove', (e) => {
                    const rect = el.getBoundingClientRect();
                    const centerX = rect.left + rect.width / 2;
                    const centerY = rect.top + rect.height / 2;
                    const distanceX = e.clientX - centerX;
                    const distanceY = e.clientY - centerY;
                    
                    el.style.transform = `
                        scale(1.05) 
                        translate(
                            ${distanceX * 0.15}px, 
                            ${distanceY * 0.15}px
                        )
                    `;
                });
            });
            
            el.addEventListener('mouseleave', () => {
                // Reset cursor
                cursor.style.transform = `translate3d(${currentX - cursor.offsetWidth/2}px, ${currentY - cursor.offsetHeight/2}px, 0) scale(1)`;
                cursor.style.background = 'rgba(29, 185, 84, 0.3)';
                cursor.style.border = '2px solid rgba(255, 255, 255, 0.4)';
                cursor.style.backdropFilter = 'blur(2px)';
                cursor.classList.remove('hover');
                
                // Reset card position with smooth transition
                el.style.transform = 'scale(1) translate(0, 0)';
            });
        });
    }

    initBubbles() {
        this.createBubbles();
        this.startBubbleRefresh();
    }

    createBubble() {
        if (this.bubbleCount >= this.maxBubbles) return;

        const bubble = document.createElement('div');
        bubble.classList.add('bubble');
        
        const colors = [
            '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', 
            '#FFEEAD', '#D4A5A5', '#9B59B6', '#3498DB', 
            '#E67E22', '#1DB954'
        ];

        const size = Math.random() * 300 + 200;
        const color1 = colors[Math.floor(Math.random() * colors.length)];
        const color2 = colors[Math.floor(Math.random() * colors.length)];
        const gradientAngle = Math.random() * 360;

        Object.assign(bubble.style, {
            width: `${size}px`,
            height: `${size}px`,
            background: `linear-gradient(${gradientAngle}deg, ${color1}, ${color2})`,
            left: `${Math.random() * 100}vw`,
            top: `${Math.random() * 100}vh`,
            animationDuration: `${Math.random() * 4 + 6}s`,
            animationDelay: `-${Math.random() * 2}s`
        });

        bubble.style.opacity = '0';
        document.body.appendChild(bubble);
        
        requestAnimationFrame(() => {
            bubble.style.opacity = '0.12';
        });

        this.bubbleCount++;
        return bubble;
    }

    createBubbles() {
        for (let i = 0; i < this.maxBubbles; i++) {
            setTimeout(() => {
                this.createBubble();
            }, i * 200);
        }
    }

    startBubbleRefresh() {
        setInterval(() => {
            const bubbles = document.querySelectorAll('.bubble');
            
            bubbles.forEach(bubble => {
                if (Math.random() < 0.1) {
                    bubble.style.opacity = '0';
                    setTimeout(() => {
                        bubble.remove();
                        this.bubbleCount--;
                        this.createBubble();
                    }, 500);
                }
            });
        }, 3000);
    }

    handleResize() {
        window.addEventListener('resize', () => {
            const bubbles = document.querySelectorAll('.bubble');
            bubbles.forEach(bubble => {
                bubble.style.left = `${Math.random() * 100}vw`;
                bubble.style.top = `${Math.random() * 100}vh`;
            });
        });
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    const animations = new AnimationEffects();
    animations.handleResize();
}); 