# El Pollo Loco

A browser-based 2D side-scrolling platformer built with **vanilla JavaScript** and the **HTML5 Canvas API** — no frameworks, no dependencies.

You play as Pepe, a man lost in the Mexican desert who must fight his way through an army of mad chickens to defeat the final boss: *El Pollo Loco*.

![Game Preview](img/9_intro_outro_screens/start/startscreen.png)

---

## Gameplay

| Action | Key |
|--------|-----|
| Move left | `←` Arrow |
| Move right | `→` Arrow |
| Jump | `Space` |
| Throw bottle | `D` |

- **Stomp** regular chickens by jumping on them
- **Collect bottles** to use as projectile weapons against the boss
- **Collect coins** to fill your coin bar
- **Defeat El Pollo Loco** (the final boss) with thrown bottles to win

### Win / Lose
- Your health reaches zero → **Game Over**
- The boss is defeated → **You Win**

---

## Features

- **Custom game engine** — physics, gravity, camera scrolling, and collision detection all hand-rolled
- **Sprite-based animation** — frame cycling for walk, jump, throw, hurt, idle, and death states
- **Parallax background scrolling** — multi-layer background tiles follow the camera
- **Enemy AI** — chickens patrol; the boss alerts, attacks, and enrages as it takes hits
- **HUD** — health bar, coin counter, and bottle inventory rendered directly on canvas
- **Full audio system** — background music, per-action sound effects, and a master volume slider
- **Mobile support** — on-screen touch controls; portrait-mode rotation prompt
- **Settings persistence** — volume level saved to `localStorage`
- **Menus** — start screen, controls reference, story, and settings panels

---

## Project Structure

```
el-pollo-loco/
├── index.html              # Entry point
├── js/
│   ├── main.js             # Menu system, UI, music, game state transitions
│   └── game.js             # Keyboard input, canvas init, game loop management
├── models/
│   ├── world.class.js          # Main game engine (draw loop, camera, level management)
│   ├── character.class.js      # Player (Pepe) — movement, animation, sounds, damage
│   ├── collisions-hendler.class.js  # Collision detection and resolution
│   ├── movable-object.class.js # Base class — gravity, jumping, hitbox, animation cycling
│   ├── drawable-object.class.js    # Base class — image loading/caching, canvas draw
│   ├── keyboard.class.js       # Input state tracker
│   ├── chicken.class.js        # Standard enemy
│   ├── small-chicken.class.js  # Faster, smaller enemy variant
│   ├── endboss.class.js        # Final boss — multi-state AI
│   ├── bottle.class.js         # Ground-collectible bottle
│   ├── coin.class.js           # Collectible coin
│   ├── throwable-objects.class.js  # Thrown bottle projectile
│   ├── cloud.class.js          # Decorative background clouds
│   ├── background-object.class.js  # Tiled background layer
│   ├── status-bar.class.js         # Player health bar
│   ├── coin-status-bar.class.js    # Coin display
│   ├── bottle-status-bar.class.js  # Bottle inventory display
│   └── endboss-status-bar.class.js # Boss health indicator
├── level/
│   └── level1.js           # Level definition — enemy, item, and background placement
├── css/                    # Stylesheets (base, hero, buttons, stage, overlay, media)
├── img/                    # All sprite sheets and UI graphics
└── audio/                  # Sound effects and background music
```

---

## Architecture

### Class Hierarchy

```
DrawableObject
└── MovableObject
    ├── Character       (player)
    ├── Chicken
    ├── SmallChicken
    ├── Endboss
    ├── Bottle
    ├── Coin
    ├── ThrowableObjects
    └── Cloud

DrawableObject
├── BackgroundObject
└── StatusBar (and variants)
```

### Game Loop

The engine runs two separate loops:

1. **Logic loop** (`setInterval`, ~60 fps) — input polling, movement, physics, AI, collision detection
2. **Render loop** (`requestAnimationFrame`) — camera transform, layered draw calls

### Rendering Order (back to front)

1. Background tiles
2. Clouds
3. Ground bottles & coins
4. Enemies
5. Player character
6. Thrown bottles
7. HUD / status bars (screen-space, not world-space)

### Physics

| Parameter | Value |
|-----------|-------|
| Gravity acceleration | 2.5 units/frame |
| Jump initial velocity | 15 |
| Character speed | 5 px/frame |
| Chicken base speed | 0.15–0.45 px/frame |
| Boss enraged speed | 3.5 px/frame |

---

## Getting Started

No build step or server required for most browsers. Just open `index.html`:

```bash
# Option 1 — direct file open
open index.html

# Option 2 — local server (recommended to avoid audio autoplay restrictions)
npx serve .
# or
python -m http.server 8080
```

Then navigate to `http://localhost:8080` (or the port shown).

> **Audio note:** Browsers block autoplay until the user interacts with the page. The game waits for the first button click before starting music.

---

## Browser Compatibility

| Browser | Status |
|---------|--------|
| Chrome / Edge (latest) | Fully supported |
| Firefox (latest) | Fully supported |
| Safari (latest) | Fully supported |
| Mobile (landscape) | Touch controls enabled |
| Mobile (portrait) | Rotation prompt shown |

---

## License

This project was created as part of a web development education program. Assets (sprites, sounds) are used for educational purposes only.
