/**
 * models.js - Handles loading and managing 3D models for the AR story
 */

const ModelManager = {
    // Model definitions
    models: {
        tortoise: {
            url: 'models/tortoise.glb',
            scale: '0.5 0.5 0.5',
            position: '0 0 0',
            rotation: '0 0 0',
            animations: {
                idle: 'Idle',
                walk: 'Walk',
                blink: 'Blink',
                nod: 'Nod'
            }
        },
        hare: {
            url: 'models/hare2.glb',
            scale: '0.5 0.5 0.5',
            position: '0 0 0',
            rotation: '0 0 0',
            animations: {
                idle: 'Idle',
                run: 'Run',
                smug: 'Smug',
                sleep: 'Sleep'
            }
        },
        // Simple primitive-based models for missing assets
        tree: {
            isPrimitive: true,
            create: function(position, rotation, scale) {
                const entity = document.createElement('a-entity');
                entity.setAttribute('position', position || '0 0 0');
                entity.setAttribute('rotation', rotation || '0 0 0');
                
                // Tree trunk
                const trunk = document.createElement('a-cylinder');
                trunk.setAttribute('height', '1');
                trunk.setAttribute('radius', '0.1');
                trunk.setAttribute('color', '#8B4513');
                trunk.setAttribute('position', '0 0.5 0');
                
                // Tree top
                const top = document.createElement('a-cone');
                top.setAttribute('height', '1.5');
                top.setAttribute('radius-bottom', '0.5');
                top.setAttribute('radius-top', '0');
                top.setAttribute('color', '#228B22');
                top.setAttribute('position', '0 1.75 0');
                
                entity.appendChild(trunk);
                entity.appendChild(top);
                
                return entity;
            }
        },
        grassPatch: {
            isPrimitive: true,
            create: function(position, rotation, scale) {
                const entity = document.createElement('a-entity');
                entity.setAttribute('position', position || '0 0 0');
                entity.setAttribute('rotation', rotation || '0 0 0');
                
                // Grass plane
                const grass = document.createElement('a-circle');
                grass.setAttribute('radius', '2');
                grass.setAttribute('color', '#7CFC00');
                grass.setAttribute('rotation', '-90 0 0');
                
                entity.appendChild(grass);
                
                return entity;
            }
        },
        dirtPath: {
            isPrimitive: true,
            create: function(position, rotation, scale) {
                const entity = document.createElement('a-entity');
                entity.setAttribute('position', position || '0 0 0');
                entity.setAttribute('rotation', rotation || '0 0 0');
                
                // Dirt path
                const path = document.createElement('a-box');
                path.setAttribute('width', '0.5');
                path.setAttribute('height', '0.02');
                path.setAttribute('depth', '3');
                path.setAttribute('color', '#8B4513');
                
                entity.appendChild(path);
                
                return entity;
            }
        },
        finish: {
            url: 'models/finish.glb',
            scale: '0.3 0.3 0.3',
            position: '0 0 0',
            rotation: '0 0 0'
        }
    },

    // Keep track of loaded models
    loadedModels: {},

    // Create a model and return the entity
    createModelEntity: function(modelName, customPosition, customRotation, customScale) {
        if (!this.models[modelName]) {
            console.error(`Model ${modelName} not defined`);
            return null;
        }

        const modelDef = this.models[modelName];
        let entity;
        
        // Check if this is a primitive-based model or a GLB model
        if (modelDef.isPrimitive) {
            // Create primitive-based model
            entity = modelDef.create(customPosition, customRotation, customScale);
        } else {
            // Create GLB model entity
            entity = document.createElement('a-entity');
            entity.setAttribute('gltf-model', modelDef.url);
            entity.setAttribute('position', customPosition || modelDef.position);
            entity.setAttribute('rotation', customRotation || modelDef.rotation);
            entity.setAttribute('scale', customScale || modelDef.scale);
            
            // Add animation mixer if the model has animations
            if (modelDef.animations) {
                entity.setAttribute('animation-mixer', '');
            }
        }
        
        // Store reference to the entity
        this.loadedModels[modelName] = entity;
        
        return entity;
    },

    // Play an animation on a model
    playAnimation: function(modelName, animationName) {
        const entity = this.loadedModels[modelName];
        if (!entity) {
            console.error(`Model ${modelName} not loaded`);
            return;
        }

        const modelDef = this.models[modelName];
        if (!modelDef.animations || !modelDef.animations[animationName]) {
            console.error(`Animation ${animationName} not defined for model ${modelName}`);
            return;
        }

        // Set the animation clip
        entity.setAttribute('animation-mixer', `clip: ${modelDef.animations[animationName]}`);
    },

    // Create a 3D text entity
    createTextEntity: function(text, position, rotation, color = '#FFFFFF', width = 1, align = 'center') {
        const entity = document.createElement('a-text');
        entity.setAttribute('value', text);
        entity.setAttribute('position', position);
        entity.setAttribute('rotation', rotation || '0 0 0');
        entity.setAttribute('color', color);
        entity.setAttribute('width', width);
        entity.setAttribute('align', align);
        entity.setAttribute('side', 'double');
        
        return entity;
    },

    // Create a 3D button entity
    createButtonEntity: function(text, position, clickHandler) {
        const buttonGroup = document.createElement('a-entity');
        buttonGroup.setAttribute('position', position);
        
        // Button background
        const buttonBg = document.createElement('a-box');
        buttonBg.setAttribute('width', '0.6');
        buttonBg.setAttribute('height', '0.2');
        buttonBg.setAttribute('depth', '0.05');
        buttonBg.setAttribute('color', '#4CAF50');
        buttonBg.setAttribute('opacity', '0.9');
        buttonBg.setAttribute('class', 'interactive');
        buttonBg.setAttribute('look-at', '[camera]');
        
        // Button text
        const buttonText = document.createElement('a-text');
        buttonText.setAttribute('value', text);
        buttonText.setAttribute('position', '0 0 0.03');
        buttonText.setAttribute('color', '#FFFFFF');
        buttonText.setAttribute('width', '1');
        buttonText.setAttribute('align', 'center');
        buttonText.setAttribute('look-at', '[camera]');
        
        // Add event listener
        buttonBg.addEventListener('click', clickHandler);
        
        // Assemble button
        buttonGroup.appendChild(buttonBg);
        buttonGroup.appendChild(buttonText);
        
        return buttonGroup;
    }
};
