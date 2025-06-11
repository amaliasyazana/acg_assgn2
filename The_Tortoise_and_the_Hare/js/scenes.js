/**
 * scenes.js - Defines and manages the different scenes in the AR story
 */

const SceneManager = {
    // Current scene index
    currentScene: 0,
    
    // Flag for non-AR mode
    nonARMode: false,
    
    // Scene definitions
    scenes: [
        // Scene 1: The First Meeting (Intro Scene)
        {
            id: 'intro',
            title: 'Scene 1: The First Meeting',
            instructions: 'Tap the "Talk" button to start the conversation',
            setup: function(arContent) {
                // Clear previous content
                while (arContent.firstChild) {
                    arContent.removeChild(arContent.firstChild);
                }
                
                // Create ground (grass patch with dirt path)
                const ground = ModelManager.createModelEntity('grassPatch', '0 0 0');
                arContent.appendChild(ground);
                
                const path = ModelManager.createModelEntity('dirtPath', '0 0.01 0');
                arContent.appendChild(path);
                
                // Create tree
                const tree = ModelManager.createModelEntity('tree', '1 0 -1', '0 45 0');
                arContent.appendChild(tree);
                
                // Create tortoise
                const tortoise = ModelManager.createModelEntity('tortoise', '-0.5 0.3 0', '0 90 0');
                ModelManager.playAnimation('tortoise', 'idle');
                arContent.appendChild(tortoise);
                
                // Create hare
                const hare = ModelManager.createModelEntity('hare', '0.5 0.5 0', '0 -90 0');
                ModelManager.playAnimation('hare', 'idle');
                arContent.appendChild(hare);
                
                // Create narration
                InteractionManager.createNarration(
                    "One sunny morning, the Tortoise and the Hare met on a forest path. They'd never raced before… but something was in the air.",
                    '0 1.5 0',
                    8000
                ).then(() => {
                    // After narration, show the talk button
                    const talkButton = ModelManager.createButtonEntity(
                        'Talk',
                        '0 0.8 0',
                        () => this.triggerDialogue(arContent)
                    );
                    talkButton.setAttribute('id', 'talk-button');
                    arContent.appendChild(talkButton);
                });
                
                // Update scene info
                document.getElementById('scene-title').textContent = this.title;
                document.getElementById('scene-instructions').textContent = this.instructions;
                document.getElementById('scene-info').classList.remove('hidden');
            },
            
            triggerDialogue: function(arContent) {
                // Remove talk button
                const talkButton = document.getElementById('talk-button');
                if (talkButton) {
                    talkButton.parentNode.removeChild(talkButton);
                }
                
                // Play animations
                ModelManager.playAnimation('hare', 'smug');
                
                // Show dialogue
                InteractionManager.createDialogue(
                    'Hare',
                    'Hey slowpoke, want to race just for fun?',
                    '0.5 1 0',
                    5000
                ).then(() => {
                    // Play tortoise animation
                    ModelManager.playAnimation('tortoise', 'blink');
                    
                    // Show tortoise dialogue
                    return InteractionManager.createDialogue(
                        'Tortoise',
                        'Sure, let\'s see who keeps going longer.',
                        '-0.5 1 0',
                        5000
                    );
                }).then(() => {
                    // Reset animations
                    ModelManager.playAnimation('hare', 'idle');
                    ModelManager.playAnimation('tortoise', 'idle');
                    
                    // Show start race button
                    const startButton = ModelManager.createButtonEntity(
                        'Start the Race',
                        '0 0.8 0',
                        () => this.nextScene()
                    );
                    arContent.appendChild(startButton);
                });
            },
            
            nextScene: function() {
                SceneManager.loadScene(1);
            }
        },
        
        // Scene 2: The Race Begins
        {
            id: 'race-begins',
            title: 'Scene 2: The Race Begins',
            instructions: 'Watch as the race begins',
            setup: function(arContent) {
                // Clear previous content
                while (arContent.firstChild) {
                    arContent.removeChild(arContent.firstChild);
                }
                
                // Create ground with longer path
                const ground = ModelManager.createModelEntity('grassPatch', '0 0 0', '0 0 0', '2 1 2');
                arContent.appendChild(ground);
                
                const path = ModelManager.createModelEntity('dirtPath', '0 0.01 0', '0 90 0', '2 1 1');
                arContent.appendChild(path);
                
                // Create trees for scenery
                const tree1 = ModelManager.createModelEntity('tree', '-1 0 -1', '0 45 0');
                arContent.appendChild(tree1);
                
                const tree2 = ModelManager.createModelEntity('tree', '1 0 -1', '0 -30 0');
                arContent.appendChild(tree2);
                
                // Create tortoise at starting position - positioned to the side
                const tortoise = ModelManager.createModelEntity('tortoise', '-1 0.3 0.6', '0 90 0');
                arContent.appendChild(tortoise);
                
                // Create hare at starting position - positioned to the other side
                const hare = ModelManager.createModelEntity('hare', '-0.8 0.5 -0.6', '0 90 0');
                arContent.appendChild(hare);
                
                // Update scene info
                document.getElementById('scene-title').textContent = this.title;
                document.getElementById('scene-instructions').textContent = this.instructions;
                
                // Start the race sequence
                InteractionManager.createNarration(
                    "The race began! The Hare took off with lightning speed while the Tortoise moved steadily.",
                    '0 1.5 0',
                    6000
                ).then(() => {
                    // Animate the hare running
                    ModelManager.playAnimation('hare', 'run');
                    
                    // Animate the tortoise walking
                    ModelManager.playAnimation('tortoise', 'walk');
                    
                    // Move the hare quickly - maintaining z-axis position
                    this.moveModel('hare', '-0.8 0.5 -0.6', '1 0.5 -0.6', 3000);
                    
                    // Move the tortoise slowly - maintaining z-axis position
                    this.moveModel('tortoise', '-1 0.3 0.6', '-0.5 0.3 0.6', 6000);
                    
                    // After animations, show continue button
                    setTimeout(() => {
                        const continueButton = ModelManager.createButtonEntity(
                            'Continue',
                            '0 0.8 0',
                            () => this.nextScene()
                        );
                        arContent.appendChild(continueButton);
                    }, 6000);
                });
            },
            
            moveModel: function(modelName, fromPosition, toPosition, duration) {
                const entity = ModelManager.loadedModels[modelName];
                if (!entity) return;
                
                const startPos = fromPosition.split(' ').map(Number);
                const endPos = toPosition.split(' ').map(Number);
                const startTime = Date.now();
                
                function animate() {
                    const now = Date.now();
                    const elapsed = now - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    
                    const currentPos = startPos.map((start, i) => 
                        start + (endPos[i] - start) * progress
                    );
                    
                    entity.setAttribute('position', currentPos.join(' '));
                    
                    if (progress < 1) {
                        requestAnimationFrame(animate);
                    }
                }
                
                animate();
            },
            
            nextScene: function() {
                SceneManager.loadScene(2);
            }
        },
        
        // Additional scenes would be defined here...
        // For now, I'm implementing just the first scene in detail as requested
        
        // Scene 3: Tortoise Keeps Going
        {
            id: 'tortoise-keeps-going',
            title: 'Scene 3: Tortoise Keeps Going',
            instructions: 'Tap on Tortoise to hear his thoughts',
            setup: function(arContent) {
                // Clear previous content
                while (arContent.firstChild) {
                    arContent.removeChild(arContent.firstChild);
                }
                
                // Create ground with longer path
                const ground = ModelManager.createModelEntity('grassPatch', '0 0 0', '0 0 0', '2 1 2');
                arContent.appendChild(ground);
                
                const path = ModelManager.createModelEntity('dirtPath', '0 0.01 0', '0 90 0', '2 1 1');
                arContent.appendChild(path);
                
                // Create trees for scenery
                const tree1 = ModelManager.createModelEntity('tree', '-1 0 -1', '0 45 0');
                arContent.appendChild(tree1);
                
                const tree2 = ModelManager.createModelEntity('tree', '1 0 -1', '0 -30 0');
                arContent.appendChild(tree2);
                
                // Create tortoise in the middle of the path
                const tortoise = ModelManager.createModelEntity('tortoise', '-0.5 0.3 0', '0 90 0');
                tortoise.setAttribute('class', 'interactive'); // Make tortoise interactive for tapping
                tortoise.setAttribute('id', 'tortoise-model');
                ModelManager.playAnimation('tortoise', 'walk'); // Start with walking animation
                arContent.appendChild(tortoise);
                
                // Add click event listener to tortoise
                tortoise.addEventListener('click', () => {
                    this.showTortoiseThoughts(arContent);
                });
                
                // Update scene info
                document.getElementById('scene-title').textContent = this.title;
                document.getElementById('scene-instructions').textContent = this.instructions;
                
                // Start the scene with narration
                InteractionManager.createNarration(
                    "As Hare speeds ahead, Tortoise stays focused, moving at his own pace.",
                    '0 1.5 0',
                    6000
                ).then(() => {
                    // Start tortoise movement animation
                    this.animateTortoiseMovement();
                });
            },
            
            // Show tortoise thoughts when tapped
            showTortoiseThoughts: function(arContent) {
                // Play tortoise animation
                ModelManager.playAnimation('tortoise', 'blink');
                
                // Show tortoise dialogue
                InteractionManager.createDialogue(
                    'Tortoise',
                    "No rush. I'll just keep moving forward.",
                    '-0.5 1 0',
                    5000
                ).then(() => {
                    // Resume walking animation
                    ModelManager.playAnimation('tortoise', 'walk');
                });
            },
            
            // Animate the tortoise moving forward slowly
            animateTortoiseMovement: function() {
                const tortoise = document.getElementById('tortoise-model');
                const startPos = '-0.5 0.3 0';
                const endPos = '0.5 0.3 0';
                const duration = 10000; // 10 seconds for slow movement
                
                const startTime = Date.now();
                const startPosArray = startPos.split(' ').map(Number);
                const endPosArray = endPos.split(' ').map(Number);
                
                const animate = () => {
                    const now = Date.now();
                    const elapsed = now - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    
                    const currentPos = startPosArray.map((start, i) => 
                        start + (endPosArray[i] - start) * progress
                    );
                    
                    tortoise.setAttribute('position', currentPos.join(' '));
                    
                    if (progress < 1) {
                        requestAnimationFrame(animate);
                    } else {
                        // When animation completes, show continue button
                        const continueButton = ModelManager.createButtonEntity(
                            'Continue',
                            '0 0.8 0',
                            () => this.nextScene()
                        );
                        document.querySelector('#ar-content').appendChild(continueButton);
                    }
                };
                
                animate();
            },
            
            nextScene: function() {
                // Move to Scene 4 when implemented
                // For now, loop back to first scene
                SceneManager.loadScene(0);
            }
        }
    ],
    
    // Initialize the scene manager
    init: function() {
        console.log('Scene Manager initialized');
    },
    
    // Set non-AR mode
    setNonARMode: function(enabled) {
        this.nonARMode = enabled;
        console.log('Non-AR mode:', enabled);
    },
    
    // Get the appropriate content container based on mode
    getContentContainer: function() {
        if (this.nonARMode) {
            return document.querySelector('#fallback-content');
        } else {
            return document.querySelector('#ar-content');
        }
    },
    
    // Load a specific scene by index
    loadScene: function(sceneIndex) {
        if (sceneIndex >= 0 && sceneIndex < this.scenes.length) {
            this.currentScene = sceneIndex;
            const contentContainer = this.getContentContainer();
            this.scenes[sceneIndex].setup(contentContainer);
        } else {
            console.error(`Scene index ${sceneIndex} out of bounds`);
        }
    },
    
    // Get the current scene
    getCurrentScene: function() {
        return this.scenes[this.currentScene];
    }
};
