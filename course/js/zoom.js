// Prevent default pinch zoom
document.addEventListener('gesturestart', (e) => {
    e.preventDefault();
});

function initCustomZoom(mainElement) {
    let scale = 1;
    const DESKTOP_SENSITIVITY = 0.0008;
    const MOBILE_SENSITIVITY = 0.002; // Higher sensitivity for mobile
    let currentScale = 1;
    
    // Desktop zoom with smooth transition
    document.addEventListener('wheel', (e) => {
        if (e.ctrlKey) {
            e.preventDefault();
            scale += e.deltaY * -DESKTOP_SENSITIVITY;
            scale = Math.min(Math.max(1, scale), 4);
            
            currentScale = scale;
            mainElement.style.transition = 'transform 0.1s ease-out';
            mainElement.style.transform = `scale(${currentScale})`;
        }
    }, { passive: false });

    // Mobile zoom with smooth transition
    let touchDistance = 0;
    document.addEventListener('touchstart', (e) => {
        if (e.touches.length === 2) {
            touchDistance = Math.hypot(
                e.touches[0].pageX - e.touches[1].pageX,
                e.touches[0].pageY - e.touches[1].pageY
            );
        }
    });

    document.addEventListener('touchmove', (e) => {
        if (e.touches.length === 2) {
            e.preventDefault();
            const newDistance = Math.hypot(
                e.touches[0].pageX - e.touches[1].pageX,
                e.touches[0].pageY - e.touches[1].pageY
            );
            
            const difference = newDistance - touchDistance;
            touchDistance = newDistance;
            scale += difference * MOBILE_SENSITIVITY;
            scale = Math.min(Math.max(1, scale), 4);
            
            currentScale = scale;
            mainElement.style.transition = 'transform 0.1s ease-out';
            mainElement.style.transform = `scale(${currentScale})`;
        }
    }, { passive: false });

    document.addEventListener('touchend', () => {
        mainElement.style.transition = '';
    });
}