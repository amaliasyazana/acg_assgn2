# The Tortoise and the Hare - AR Storytelling Experience

An interactive, markerless AR storytelling experience that brings the classic fable "The Tortoise and the Hare" to life through your phone's camera.

## Overview

This web-based AR application allows users to experience the story of the Tortoise and the Hare in their real-world environment. 3D characters appear and interact in animated scenes, with user interaction via raycasting (tap-to-select).

## Features

- Markerless AR experience (no need for printed markers)
- Auto-detection of flat surfaces to anchor the story world
- Interactive 3D characters and elements
- Raycasting-based interaction (tap to interact)
- Animated 3D models
- Text narration
- Floating 3D buttons for story progression

## Requirements

- A modern smartphone or tablet with:
  - AR-capable browser (Chrome, Safari)
  - Camera access
  - Accelerometer/gyroscope
- Internet connection

## How to Use

1. Open the application in an AR-capable browser
2. Grant camera permissions when prompted
3. Point your camera at a flat surface (floor, table, etc.)
4. Once a surface is detected, the AR experience will begin
5. Follow the on-screen instructions to interact with the story
6. Tap buttons or characters to progress through the story

## Story Scenes

1. **The First Meeting (Intro Scene)**
   - The Tortoise and Hare meet and decide to race
   
2. **The Race Begins**
   - The race starts with the Hare taking an early lead

3-6. Additional scenes to be implemented

## Technical Details

This project uses:
- A-Frame for WebXR/AR functionality
- AR.js for markerless AR capabilities
- Three.js for 3D rendering
- Custom JavaScript for interactions and scene management

## Models

The application uses the following 3D models (GLB format):
- Tortoise
- Hare
- Tree
- Grass patch
- Dirt path

## Development

To run this project locally:

1. Clone the repository
2. Set up a local web server (due to CORS restrictions when loading 3D models)
3. Access the application through the local server
4. For best results, test on an actual mobile device

## Note About 3D Models

This project requires .glb 3D models that are not included in the repository. You'll need to source or create the following models and place them in the `/models` directory:
- tortoise.glb
- hare.glb
- tree.glb
- grass_patch.glb
- dirt_path.glb
