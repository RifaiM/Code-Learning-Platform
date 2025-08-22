// Add click animations to components
document.querySelectorAll('.component').forEach(component => {
    component.addEventListener('click', function() {
    this.style.transform = 'scale(0.95) translateY(-8px)';
    setTimeout(() => {
        this.style.transform = 'translateY(-8px)';
    }, 150);
    });
});

// Animate journey steps on scroll
const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
    if (entry.isIntersecting) {
        entry.target.style.transform = 'translateX(10px)';
        entry.target.style.opacity = '1';
    }
    });
}, observerOptions);

// Initialize journey step animations
document.querySelectorAll('.journey-step').forEach((step, index) => {
    step.style.transform = 'translateX(-20px)';
    step.style.opacity = '0.7';
    step.style.transition = 'all 0.6s ease';
    step.style.transitionDelay = `${index * 0.1}s`;
    observer.observe(step);
});

// Mark as read functionality (keeping original logic)
document.getElementById('markReadBtn').addEventListener('click', function() {
    // Add completion animation
    this.innerHTML = '🎉 Completed! Returning to main page...';
    this.style.background = 'var(--success)';
    
    // Store completion
    try {
    const keyMap = { website: 'readWebsite', html: 'readHTML', css: 'readCSS', javascript: 'readJavaScript' };
    const k = keyMap['website'];
    if (k) localStorage.setItem(k, 'true');
    } catch (e) { }

    // Add to session disabled list (for this tab session)
    try {
    let arr = [];
    try { arr = JSON.parse(sessionStorage.getItem('disabledLessons') || '[]'); } catch (e) { arr = []; }
    if (!Array.isArray(arr)) arr = [];
    if (arr.indexOf('website') === -1) arr.push('website');
    sessionStorage.setItem('disabledLessons', JSON.stringify(arr));
    } catch (e) { }

    // Return to overview with delay for animation
    setTimeout(() => {
    window.location.href = '../../index.html#before-code'';
    }, 1500);
});

// Add some interactive elements
let clickCount = 0;
document.querySelector('.concept-icon').addEventListener('click', () => {
    clickCount++;
    if (clickCount >= 3) {
    const icon = document.querySelector('.concept-icon');
    icon.style.animation = 'pulse 0.5s ease-in-out 3';
    icon.innerHTML = '🎉';
    setTimeout(() => {
        icon.innerHTML = '🌐';
        clickCount = 0;
    }, 2000);
    }
});

// Add floating animation to components
document.querySelectorAll('.component').forEach((component, index) => {
    component.style.animation = `float 3s ease-in-out infinite`;
    component.style.animationDelay = `${index * 0.5}s`;
});

// CSS for floating animation
const style = document.createElement('style');
style.textContent = `
    @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-5px); }
    }
`;

document.head.appendChild(style);





