/**
 * Represents a standard chicken enemy in the game.
 *
 * Chickens walk from right to left and damage the player upon contact.
 * They can be defeated by jumping on them ("stomp kill").
 */
class Chicken extends MovableObject {
  y = 370;
  height = 60;
  width = 60;
  hitboxOffsetX = 10;
  hitboxOffsetY = 10;
  hitboxWidth = this.width - 20;
  hitboxHeight = this.height - 20;
  deathSound = new Audio("audio/chicken-dead.mp3");
  reactionSound = new Audio("audio/chicken-die.mp3");
  lastReactionTime = 0;
  isDead = false;

  IMAGES_WALKING = [
    "img/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
    "img/3_enemies_chicken/chicken_normal/1_walk/2_w.png",
    "img/3_enemies_chicken/chicken_normal/1_walk/3_w.png",
  ];

  IMAGES_DEAD = ["img/3_enemies_chicken/chicken_normal/2_dead/dead.png"];

  /**
   * Creates a new chicken enemy with random speed and random X-position.
   */
  constructor() {
    super().loadImage(this.IMAGES_WALKING[0]);
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_DEAD);
    this.x = 300 + Math.random() * 3600;
    this.speed = 0.15 + Math.random() * 0.3;
    this.animate();
  }

  /**
 * Returns true if the chicken is currently visible on screen.
 * Uses world camera offset and canvas width.
 */
isOnScreen() {
    if (!this.world || !this.world.canvas) return false;
  
    const cameraX = this.world.camera_x;        // meist negativ
    const canvasWidth = this.world.canvas.width;
  
    // Welt-Koordinate + Kameraoffset = Bildschirmposition
    const screenLeft = this.x + cameraX;
    const screenRight = screenLeft + this.width;
  
    // sichtbar, wenn sich irgendwas im 0..canvasWidth Bereich befindet
    return screenRight > 0 && screenLeft < canvasWidth;
  }
  

  /**
   * Kills the chicken and switches sprite to its dead image.
   * Prevents repeated trigger when called multiple times.
   */
  die() {
    if (this.isDead) return;
    this.isDead = true;
    this.speed = 0;
    this.deathTime = Date.now();
    this.loadImage(this.IMAGES_DEAD[0]);
  }

  /**
 * Plays the reaction sound while walking from time to time,
 * but only if the chicken is currently visible on screen.
 */
playReaction() {
    if (typeof soundEnabled !== "undefined" && !soundEnabled) return;
    if (!this.reactionSound) return;
    if (!this.isOnScreen()) return;
    const now = Date.now();
    const minDelay = 3000; 
    const chance = 0.03;  
    if (now - this.lastReactionTime < minDelay) return;
    if (Math.random() > chance) return;
    this.lastReactionTime = now;
    this.reactionSound.currentTime = 0;
    this.reactionSound.play().catch(() => {});
  }

  /**
   * Handles both movement and animation loops.
   * Chickens walk continuously until dead.
   */
  animate() {
    setStopableIntervall(() => {
      if (!this.isDead) this.moveLeft();
    }, 1000 / 60);
    setStopableIntervall(() => {
      if (!this.isDead) {
        this.playAnimation(this.IMAGES_WALKING);
        this.playReaction();
      }
    }, 200);
  }
}