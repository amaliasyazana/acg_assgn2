/**
 * main.js - Main entry point for the AR storytelling experience
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the AR experience when the page loads
    initARExperience();
});

// Initialize the AR experience
function initARExperience() {
    const scene = document.querySelector('a-scene');
    const loadingScreen = document.getElementById('loading-screen');
    const sceneInfo = document.getElementById('scene-info');
    const fallbackUI = document.getElementById('fallback-ui');
    
    // Hide scene info and fallback UI initially
    sceneInfo.classList.add('hidden');
    fallbackUI.classList.add('hidden');
    
    // Track AR initialization status
    let arInitialized = false;
    let arErrorOccurred = false;
    
    // Initialize managers
    InteractionManager.init();
    SceneManager.init();
    
    // Listen for AR.js initialization
    scene.addEventListener('loaded', function() {
        console.log('A-Frame scene loaded');
    });
    
    // Listen for AR ready state
    scene.addEventListener('arjs-nft-loaded', function() {
        console.log('AR.js NFT loaded');
    });
    
    // Listen for camera permissions
    scene.addEventListener('camera-init', function() {
        console.log('Camera initialized');
    });
    
    // Listen for camera permission errors
    scene.addEventListener('camera-error', function(event) {
        console.error('Camera error:', event);
        arErrorOccurred = true;
        document.getElementById('error-message').textContent = 'Camera permission denied or error accessing camera';
        document.getElementById('error-container').style.display = 'block';
    });
    
    // Listen for surface detection
    scene.addEventListener('ar-hit-test-start', function() {
        console.log('AR hit test started - looking for surfaces');
    });
    
    // When a surface is found
    scene.addEventListener('ar-hit-test-achieved', function() {
        console.log('Surface detected');
        arInitialized = true;
        
        // Hide loading screen
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
        
        // Start the story with the first scene
        setTimeout(() => {
            SceneManager.loadScene(0);
        }, 1000);
    });
    
    // Handle errors
    scene.addEventListener('ar-hit-test-failed', function() {
        console.error('Surface detection failed');
        arErrorOccurred = true;
        document.getElementById('error-message').textContent = 'Surface detection failed. Try pointing your camera at a different flat surface.';
        document.getElementById('error-container').style.display = 'block';
    });
    
    // Fallback if AR doesn't initialize after a timeout
    setTimeout(() => {
        if (!arInitialized) {
            console.log('AR initialization timeout - offering fallback mode');
            
            // Show fallback UI if AR didn't initialize
            fallbackUI.classList.remove('hidden');
            
            // If no specific error occurred, show a generic message
            if (!arErrorOccurred) {
                document.getElementById('error-message').textContent = 'AR initialization timed out. Your device may not support AR features.';
                document.getElementById('error-container').style.display = 'block';
            }
        }
    }, 8000); // 8 second timeout
    
    // Force start in non-AR mode for development/testing
    // Uncomment this to bypass AR and test the story flow directly
    /*
    setTimeout(() => {
        loadingScreen.style.display = 'none';
        SceneManager.setNonARMode(true);
        SceneManager.loadScene(0);
    }, 1000);
    */
}

// Handle window resize
window.addEventListener('resize', function() {
    // Update any size-dependent elements
    const scene = document.querySelector('a-scene');
    if (scene.renderer) {
        scene.renderer.setSize(window.innerWidth, window.innerHeight);
    }
});

// Handle device orientation changes
window.addEventListener('orientationchange', function() {
    // Update any orientation-dependent elements
    setTimeout(() => {
        const scene = document.querySelector('a-scene');
        if (scene.renderer) {
            scene.renderer.setSize(window.innerWidth, window.innerHeight);
        }
    }, 200);
});
