document.addEventListener("DOMContentLoaded", () => {
    // Select all elements to be animated on scroll
    const reveals = document.querySelectorAll(".reveal");

    // Configure the observer
    const revealOptions = {
        threshold: 0.1, // Trigger when 10% is visible
        rootMargin: "0px 0px -50px 0px" // Slight offset for a smoother effect
    };

    // The Intersection Observer logic
    const revealOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
                // Stop observing once animated for a clean 'one-time' slide-in
                observer.unobserve(entry.target); 
            }
        });
    }, revealOptions);

    // Attach observer to each element
    reveals.forEach(reveal => {
        revealOnScroll.observe(reveal);
    });

    // Motion-Sensitive Parallax Effect for 3D Technical Elements
    document.addEventListener("mousemove", (e) => {
        const parallaxElements = document.querySelectorAll(".parallax-el");
        
        // Calculate mouse position relative to the center of the viewport (increased sensitivity: /25)
        const xPos = (window.innerWidth / 2 - e.pageX) / 25; 
        const yPos = (window.innerHeight / 2 - e.pageY) / 25; 

        parallaxElements.forEach((el) => {
            const speed = parseFloat(el.getAttribute("data-speed"));
            const rotateSpeed = parseFloat(el.getAttribute("data-rotate") || speed);
            
            // X and Y translation
            const tX = xPos * speed;
            const tY = yPos * speed;
            
            // Dynamic rotation based on movement trajectory
            const rotation = (xPos + yPos) * rotateSpeed;

            // Apply all transforms together smoothly
            el.style.transform = `translateX(${tX}px) translateY(${tY}px) rotate(${rotation}deg)`;
        });
    });
});
