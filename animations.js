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
        
        const names = [
            'Shaurya Srivastava',
            'Suhani Sharma',
            'Nitya Umrao',
            'Vedansh Gupta',
            'Sheetal'
        ];

        // Create and add name elements with faster sequence
        names.forEach((name, index) => {
            const nameEl = document.createElement('div');
            nameEl.className = 'intro-text';
            nameEl.textContent = name;
            nameEl.style.animationDelay = `${index * 0.4}s`; // Faster sequence
            nameEl.style.animation = 'fadeInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards, float 2s infinite ease-in-out';
            intro.appendChild(nameEl);
        });

        // Add college name
        const college = document.createElement('div');
        college.className = 'intro-text college-text';
        college.textContent = 'PSIT Kanpur';
        college.style.animationDelay = '2.2s';
        college.style.animation = 'fadeInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards, float 2s infinite ease-in-out';
        intro.appendChild(college);

        // Add section
        const section = document.createElement('div');
        section.className = 'intro-text section-text';
        section.textContent = 'CS-CYS-2B';
        section.style.animationDelay = '2.6s';
        section.style.animation = 'fadeInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards, float 2s infinite ease-in-out';
        intro.appendChild(section);

        document.body.appendChild(intro);

        // Start butterfly effect
        setTimeout(() => {
            this.createButterflies(intro);
        }, 3500);
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

        document.addEventListener('mousemove', (e) => {
            cursorX = e.clientX;
            cursorY = e.clientY;
        });

        // Add hover effect for interactive elements
        const interactiveElements = document.querySelectorAll('a, button, .nav-option, .song-row');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
        });

        const animateCursor = () => {
            const currentX = parseFloat(cursor.style.left) || cursorX;
            const currentY = parseFloat(cursor.style.top) || cursorY;
            
            const dx = cursorX - currentX;
            const dy = cursorY - currentY;
            
            cursor.style.left = `${currentX + dx * 0.2}px`;
            cursor.style.top = `${currentY + dy * 0.2}px`;
            
            requestAnimationFrame(animateCursor);
        };

        animateCursor();
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