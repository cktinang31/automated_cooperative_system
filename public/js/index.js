document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('nav ul li a');
    const sections = document.querySelectorAll('section');

    navLinks.forEach(link => {
        link.addEventListener('click', function () {
            navLinks.forEach(navLink => {
                navLink.classList.remove('active', 'hover-color');
            });
            this.classList.add('active', 'hover-color');
        });
    });

function throttle(func, limit) {
    let lastFunc;
    let lastRan;
    return function() {
        const context = this;
        const args = arguments;
        if (!lastRan) {
            func.apply(context, args);
            lastRan = Date.now();
        } else {
            clearTimeout(lastFunc);
            lastFunc = setTimeout(function() {
                if ((Date.now() - lastRan) >= limit) {
                    func.apply(context, args);
                    lastRan = Date.now();
                }
            }, limit - (Date.now() - lastRan));
        }
    };
}

const handleScroll = () => {
    let currentSection = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;

        if (window.pageYOffset >= sectionTop - 50 && window.pageYOffset < sectionTop + sectionHeight - 50) {
            currentSection = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active', 'hover-color');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active', 'hover-color'); 
        }
    });

    // Ensure homepage link is active when scrolled to top
    if (window.pageYOffset === 0) {
        navLinks.forEach(link => {
            if (link.getAttribute('href') === '/') {
                link.classList.add('active', 'hover-color');
            }
        });
    }
};

    window.addEventListener('scroll', throttle(handleScroll, 100));
});