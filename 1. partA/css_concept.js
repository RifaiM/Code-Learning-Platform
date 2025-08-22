// Interactive demo functionality
const styles = {
    color: {
    title: 'color: #e91e63; text-shadow: 2px 2px 4px rgba(233,30,99,0.3);',
    text: 'color: #667eea; font-weight: 600;',
    bg: 'background: linear-gradient(135deg, #fff 0%, #f8f9ff 100%);'
    },
    size: {
    title: 'font-size: 2.5rem; font-weight: 800; transform: scale(1.1);',
    text: 'font-size: 1.3rem; line-height: 1.8;',
    bg: ''
    },
    background: {
    title: 'color: white; text-shadow: 2px 2px 4px rgba(0,0,0,0.5);',
    text: 'color: rgba(255,255,255,0.9);',
    bg: 'background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;'
    },
    animation: {
    title: 'animation: bounce 1s ease-in-out infinite;',
    text: 'animation: fadeInUp 1s ease-out;',
    bg: 'background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab); background-size: 400% 400%; animation: gradientShift 3s ease infinite;'
    }
};

function changeStyle(type) {
    const preview = document.getElementById('demoPreview');
    const title = document.getElementById('demoTitle');
    const text = document.getElementById('demoText');

    if (type === 'reset') {
    preview.style.cssText = '';
    title.style.cssText = '';
    text.style.cssText = '';
    title.textContent = 'Click buttons above to style me!';
    text.textContent = 'Watch how CSS transforms this content instantly';
    return;
    }

    const style = styles[type];
    if (style) {
    preview.style.cssText = style.bg;
    title.style.cssText = style.title;
    text.style.cssText = style.text;
    
    title.textContent = `${type.charAt(0).toUpperCase() + type.slice(1)} styling applied!`;
    text.textContent = `CSS has transformed this content with ${type} properties`;
    }
}

// Add CSS animations
const animationStyles = document.createElement('style');
animationStyles.textContent = `
    @keyframes bounce {
    0%, 20%, 60%, 100% { transform: translateY(0); }
    40% { transform: translateY(-20px); }
    80% { transform: translateY(-10px); }
    }
    
    @keyframes fadeInUp {
    from { 
        opacity: 0; 
        transform: translateY(20px); 
    }
    to { 
        opacity: 1; 
        transform: translateY(0); 
    }
    }
    
    @keyframes gradientShift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
    }
`;
document.head.appendChild(animationStyles);

// Add interactive click effects to power cards
document.querySelectorAll('.power-card').forEach(card => {
    card.addEventListener('click', function() {
    const icon = this.querySelector('.power-icon');
    const originalIcon = icon.innerHTML;
    
    // Change icon temporarily
    const icons = {
        '🌈': '✨', '📝': '🎨', '📐': '⚡', 
        '📱': '🚀', '✨': '🎯', '🎯': '💫'
    };
    
    icon.innerHTML = icons[originalIcon] || '🎉';
    
    // Reset after animation
    setTimeout(() => {
        icon.innerHTML = originalIcon;
    }, 1000);
    });
});

// Interactive concept icon
const conceptIcons = ['🎨', '🌈', '✨', '🎭', '🎪'];
let iconIndex = 0;

document.querySelectorAll('.concept-icon').forEach(icon => {
    icon.addEventListener('click', function() {
    iconIndex = (iconIndex + 1) % conceptIcons.length;
    this.innerHTML = conceptIcons[iconIndex];
    this.style.animation = 'rainbow 2s linear';
    
    setTimeout(() => {
        this.style.animation = '';
    }, 2000);
    });
});

// Add floating animation to power cards
document.querySelectorAll('.power-card').forEach((card, index) => {
    card.style.animation = `float 3s ease-in-out infinite`;
    card.style.animationDelay = `${index * 0.2}s`;
});

// CSS for floating animation
const floatStyle = document.createElement('style');
floatStyle.textContent = `
    @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-5px); }
    }
`;
document.head.appendChild(floatStyle);

// Animate example items on scroll
const observerOptions = {
    threshold: 0.3,
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

// Initialize animations for example items
document.querySelectorAll('.example-item').forEach((item, index) => {
    item.style.transform = 'translateY(30px)';
    item.style.opacity = '0.5';
    item.style.transition = 'all 0.6s ease';
    item.style.transitionDelay = `${index * 0.1}s`;
    observer.observe(item);
});

// Mark as read functionality
document.getElementById('markReadBtn').addEventListener('click', function() {
    this.innerHTML = '🎨 CSS Mastered! Returning to main page...';
    this.style.background = 'var(--success)';
    
    // Store completion
    try {
    const keyMap = { website: 'readWebsite', html: 'readHTML', css: 'readCSS', javascript: 'readJavaScript' };
    const k = keyMap['css'];
    if (k) localStorage.setItem(k, 'true');
    } catch (e) { }

    // Add to session disabled list
    try {
    let arr = [];
    try { arr = JSON.parse(sessionStorage.getItem('disabledLessons') || '[]'); } catch (e) { arr = []; }
    if (!Array.isArray(arr)) arr = [];
    if (arr.indexOf('css') === -1) arr.push('css');
    sessionStorage.setItem('disabledLessons', JSON.stringify(arr));
    } catch (e) { }

    setTimeout(() => {
    window.location.href = '../index.html#before-code';
    }, 1500);
});

// Add color-changing effect to header
let colorIndex = 0;
const colors = ['hue-rotate(0deg)', 'hue-rotate(60deg)', 'hue-rotate(120deg)', 'hue-rotate(180deg)', 'hue-rotate(240deg)', 'hue-rotate(300deg)'];

setInterval(() => {
    colorIndex = (colorIndex + 1) % colors.length;
    document.querySelector('header::before') 
}, 2000);

// Auto-demo functionality - cycle through styles
let autoDemoIndex = 0;
const demoTypes = ['color', 'size', 'background', 'animation'];

function autoDemo() {
    setTimeout(() => {
    changeStyle(demoTypes[autoDemoIndex]);
    autoDemoIndex = (autoDemoIndex + 1) % demoTypes.length;
    
    if (autoDemoIndex === 0) {
        setTimeout(() => changeStyle('reset'), 2000);
    }
    
    autoDemo();
    }, 4000);
}

// Animation control functionality
document.addEventListener('DOMContentLoaded', function() {
    const animationDemo = document.getElementById('animationDemo');
    const playButton = document.getElementById('playAnimationBtn');
    let isPlaying = false;
    
    if (animationDemo && playButton) {
        playButton.addEventListener('click', function() {
            if (!isPlaying) {
                // Start animation
                animationDemo.classList.add('playing');
                playButton.textContent = 'Stop Animation';
                playButton.classList.add('stop');
                isPlaying = true;
            } else {
                // Stop animation
                animationDemo.classList.remove('playing');
                playButton.textContent = 'Play Animation';
                playButton.classList.remove('stop');
                isPlaying = false;
            }
        });
    }
});

// Start auto demo after page loads (but disable it for now to avoid conflicts)

// setTimeout(autoDemo, 3000);
