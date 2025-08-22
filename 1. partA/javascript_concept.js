// Interactive demo functions
function showAlert() {
    alert('🎉 Hello from JavaScript! This is an alert dialog.');
    updateResult('Alert shown! JavaScript can display messages to users.');
}

function changeText() {
    const messages = [
        '📝 Text changed by JavaScript!',
        '✨ JavaScript can update any content!',
        '🚀 Dynamic content is powerful!',
        '🎯 This happens instantly!'
    ];
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    updateResult(randomMessage);
}

function changeColor() {
    const colors = ['#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const result = document.getElementById('demoResult');
    result.style.backgroundColor = randomColor;
    result.style.color = 'white';
    updateResult(`🌈 Background changed to ${randomColor}!`);
}

function showTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString();
    const dateString = now.toLocaleDateString();
    updateResult(`⏰ Current time: ${timeString} on ${dateString}`);
}

function calculate() {
    const num1 = Math.floor(Math.random() * 100);
    const num2 = Math.floor(Math.random() * 100);
    const sum = num1 + num2;
    updateResult(`🔢 JavaScript calculated: ${num1} + ${num2} = ${sum}`);
}

function runAnimation() {
    const result = document.getElementById('demoResult');
    
    // Reset to initial state
    result.style.transition = '';
    result.style.transform = 'scale(1) rotate(0deg)';
    result.style.backgroundColor = '';
    result.style.color = '';
    result.style.boxShadow = '';
    result.style.borderRadius = '12px';
    
    updateResult('🎬 Get ready for JavaScript animation magic!');
    
    // Create multiple floating elements around the result box
    createFloatingElements();
    
    // Start the main animation sequence
    setTimeout(() => {
        result.style.transition = 'all 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
        result.style.transform = 'scale(1.2) rotate(360deg)';
        result.style.backgroundColor = '#e74c3c';
        result.style.color = 'white';
        result.style.boxShadow = '0 20px 40px rgba(231, 76, 60, 0.4)';
        updateResult('🌟 SPINNING AND SCALING! JavaScript controls this movement!');
    }, 500);
    
    // Second animation phase
    setTimeout(() => {
        result.style.transition = 'all 0.6s ease-out';
        result.style.transform = 'scale(0.8) rotate(720deg)';
        result.style.backgroundColor = '#3498db';
        result.style.borderRadius = '50px';
        updateResult('💫 Now shrinking and turning blue! CSS controlled by JavaScript!');
    }, 1500);
    
    // Third animation phase - bounce effect
    setTimeout(() => {
        result.style.transition = 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        result.style.transform = 'scale(1.1) rotate(0deg)';
        result.style.backgroundColor = '#2ecc71';
        result.style.borderRadius = '15px';
        updateResult('🚀 BOUNCING BACK! JavaScript creates smooth transitions!');
    }, 2200);
    
    // Final phase
    setTimeout(() => {
        result.style.transition = 'all 0.5s ease-in-out';
        result.style.transform = 'scale(1) rotate(0deg)';
        result.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
        result.style.color = '';
        result.style.boxShadow = '';
        result.style.borderRadius = '12px';
        updateResult('✨ Animation Complete! JavaScript made the impossible possible! 🎯');
    }, 3000);
}

// Create floating animated elements around the result box
function createFloatingElements() {
    const container = document.querySelector('.interactive-playground');
    const emojis = ['⭐', '✨', '🌟', '💫', '🎊', '🎉', '⚡', '🔥'];
    
    // Create 8 floating elements
    for (let i = 0; i < 8; i++) {
        const element = document.createElement('div');
        element.innerHTML = emojis[i % emojis.length];
        element.style.cssText = `
            position: absolute;
            font-size: 2rem;
            pointer-events: none;
            z-index: 10;
            animation: floatAndFade 3s ease-out forwards;
            left: ${20 + Math.random() * 60}%;
            top: ${30 + Math.random() * 40}%;
        `;
        
        container.appendChild(element);
        
        // Remove element after animation
        setTimeout(() => {
            if (element.parentNode) {
                element.parentNode.removeChild(element);
            }
        }, 3000);
    }
}

function updateResult(message) {
    const resultElement = document.getElementById('demoResult');
    resultElement.innerHTML = message;
}

// Wait for DOM to load before adding event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Add interactive click effects to power cards
    document.querySelectorAll('.power-card').forEach(card => {
        card.addEventListener('click', function() {
            const icon = this.querySelector('.power-icon');
            const originalIcon = icon.innerHTML;
            
            // Change icon temporarily with sparks
            icon.innerHTML = '⚡';
            icon.style.animation = 'electricity 0.8s ease-in-out';
            
            // Reset after animation
            setTimeout(() => {
                icon.innerHTML = originalIcon;
                icon.style.animation = '';
            }, 800);
        });
    });

    // Interactive concept icons
    const jsIcons = ['⚡', '🧠', '🔥', '💻', '🚀'];
    let iconIndex = 0;

    document.querySelectorAll('.concept-icon').forEach(icon => {
        icon.addEventListener('click', function() {
            iconIndex = (iconIndex + 1) % jsIcons.length;
            this.innerHTML = jsIcons[iconIndex];
            this.style.animation = 'electricity 1s ease-in-out';
            
            setTimeout(() => {
                this.style.animation = '';
            }, 1000);
        });
    });

    // Add floating animation to power cards
    document.querySelectorAll('.power-card').forEach((card, index) => {
        card.style.animation = `float 3s ease-in-out infinite`;
        card.style.animationDelay = `${index * 0.3}s`;
    });

    // Animate example cards on scroll
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.transform = 'translateY(0)';
                entry.target.style.opacity = '1';
            }
        });
    }, observerOptions);

    // Initialize animations for example cards
    document.querySelectorAll('.example-card').forEach((card, index) => {
        card.style.transform = 'translateY(30px)';
        card.style.opacity = '0.5';
        card.style.transition = 'all 0.6s ease';
        card.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(card);
    });

    // Mark as read functionality - FIXED: Store the correct key
    const markReadBtn = document.getElementById('markReadBtn');
    if (markReadBtn) {
        markReadBtn.addEventListener('click', function() {
            // CRITICAL FIX: Store with the exact key that index.js expects
            localStorage.setItem('readJavaScript', 'true');
            
            this.innerHTML = '⚡ JavaScript Mastered! Redirecting...';
            this.style.background = 'var(--success)';
            
            // Add celebration effect
            const celebration = document.createElement('div');
            celebration.innerHTML = '🎉🚀✨🎯🔥';
            celebration.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                font-size: 3rem;
                animation: celebrate 2s ease-out;
                pointer-events: none;
                z-index: 1000;
            `;
            document.body.appendChild(celebration);
            
            setTimeout(() => {
                celebration.remove();
                // Redirect back to main page
                window.location.href = '../../index.html#footer';
            }, 2000);
        });
    }

    // Add sparkle effect to interactive elements
    function addSparkle(element) {
        const sparkle = document.createElement('div');
        sparkle.innerHTML = '✨';
        sparkle.style.cssText = `
            position: absolute;
            pointer-events: none;
            animation: sparkleFloat 1s ease-out forwards;
            font-size: 1.5rem;
        `;
        
        const rect = element.getBoundingClientRect();
        sparkle.style.left = rect.left + Math.random() * rect.width + 'px';
        sparkle.style.top = rect.top + Math.random() * rect.height + 'px';
        
        document.body.appendChild(sparkle);
        
        setTimeout(() => sparkle.remove(), 1000);
    }

    // Add sparkles to demo buttons
    document.querySelectorAll('.demo-btn').forEach(btn => {
        btn.addEventListener('click', () => addSparkle(btn));
    });

});

