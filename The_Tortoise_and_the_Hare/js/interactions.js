/**
 * interactions.js - Handles user interactions with the AR elements
 */

// Register custom A-Frame components for interactions
AFRAME.registerComponent('gesture-detector', {
    init: function() {
        this.el.sceneEl.addEventListener('touchstart', this.onTouchStart.bind(this));
        this.el.sceneEl.addEventListener('touchend', this.onTouchEnd.bind(this));
    },
    
    onTouchStart: function(evt) {
        // Prevent default behavior to avoid scrolling
        evt.preventDefault();
    },
    
    onTouchEnd: function(evt) {
        if (evt.touches.length > 0) return;
        
        // Get touch position
        const touch = evt.changedTouches[0];
        
        // Convert touch to normalized device coordinates (-1 to +1)
        const x = (touch.clientX / window.innerWidth) * 2 - 1;
        const y = -(touch.clientY / window.innerHeight) * 2 + 1;
        
        // Emit raycaster-intersection event with the coordinates
        this.el.emit('raycaster-intersection', {
            x: x,
            y: y
        });
    }
});

// Raycaster component for detecting interactions
AFRAME.registerComponent('raycaster-listener', {
    init: function() {
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.camera = document.querySelector('a-entity[camera]').object3D;
        
        this.el.sceneEl.addEventListener('raycaster-intersection', this.onIntersection.bind(this));
    },
    
    onIntersection: function(evt) {
        // Update mouse position
        this.mouse.x = evt.detail.x;
        this.mouse.y = evt.detail.y;
        
        // Update raycaster
        this.raycaster.setFromCamera(this.mouse, this.camera);
        
        // Get intersections with interactive objects
        const interactiveEls = Array.from(document.querySelectorAll('.interactive'));
        const objects = interactiveEls.map(el => el.object3D);
        const intersects = this.raycaster.intersectObjects(objects, true);
        
        if (intersects.length > 0) {
            // Find the A-Frame entity that was intersected
            let object = intersects[0].object;
            let el;
            
            // Traverse up to find the entity
            while (object.parent && !el) {
                if (object.el) {
                    el = object.el;
                }
                object = object.parent;
            }
            
            if (el) {
                // Emit click event on the intersected entity
                el.emit('click');
            }
        }
    }
});

const InteractionManager = {
    // Initialize the interaction system
    init: function() {
        // Add raycaster-listener to the scene
        const scene = document.querySelector('a-scene');
        scene.setAttribute('raycaster-listener', '');
        
        console.log('Interaction system initialized');
    },
    
    // Create a dialogue box
    createDialogue: function(character, text, position, duration = 5000) {
        return new Promise((resolve) => {
            const dialogueEntity = document.createElement('a-entity');
            dialogueEntity.setAttribute('position', position);
            dialogueEntity.setAttribute('look-at', '[camera]');
            
            // Create the dialogue box background
            const dialogueBg = document.createElement('a-plane');
            dialogueBg.setAttribute('width', '1.5');
            dialogueBg.setAttribute('height', '0.5');
            dialogueBg.setAttribute('color', '#FFFFFF');
            dialogueBg.setAttribute('opacity', '0.8');
            
            // Create the character name text
            const characterText = document.createElement('a-text');
            characterText.setAttribute('value', character);
            characterText.setAttribute('position', '-0.65 0.15 0.01');
            characterText.setAttribute('color', '#4CAF50');
            characterText.setAttribute('width', '1.4');
            characterText.setAttribute('align', 'left');
            
            // Create the dialogue text
            const dialogueText = document.createElement('a-text');
            dialogueText.setAttribute('value', text);
            dialogueText.setAttribute('position', '-0.65 0 0.01');
            dialogueText.setAttribute('color', '#000000');
            dialogueText.setAttribute('width', '1.4');
            dialogueText.setAttribute('align', 'left');
            
            // Assemble the dialogue box
            dialogueEntity.appendChild(dialogueBg);
            dialogueEntity.appendChild(characterText);
            dialogueEntity.appendChild(dialogueText);
            
            // Add to scene
            document.querySelector('#ar-content').appendChild(dialogueEntity);
            
            // Remove after duration
            setTimeout(() => {
                dialogueEntity.parentNode.removeChild(dialogueEntity);
                resolve();
            }, duration);
        });
    },
    
    // Create a floating narration text
    createNarration: function(text, position, duration = 5000) {
        return new Promise((resolve) => {
            const narrationEntity = document.createElement('a-entity');
            narrationEntity.setAttribute('position', position);
            narrationEntity.setAttribute('look-at', '[camera]');
            
            // Create the narration background
            const narrationBg = document.createElement('a-plane');
            narrationBg.setAttribute('width', '2');
            narrationBg.setAttribute('height', '0.6');
            narrationBg.setAttribute('color', '#000000');
            narrationBg.setAttribute('opacity', '0.6');
            
            // Create the narration text
            const narrationText = document.createElement('a-text');
            narrationText.setAttribute('value', text);
            narrationText.setAttribute('position', '0 0 0.01');
            narrationText.setAttribute('color', '#FFFFFF');
            narrationText.setAttribute('width', '1.8');
            narrationText.setAttribute('align', 'center');
            
            // Assemble the narration
            narrationEntity.appendChild(narrationBg);
            narrationEntity.appendChild(narrationText);
            
            // Add to scene
            document.querySelector('#ar-content').appendChild(narrationEntity);
            
            // Remove after duration
            setTimeout(() => {
                narrationEntity.parentNode.removeChild(narrationEntity);
                resolve();
            }, duration);
        });
    }
};
