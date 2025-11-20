class Endboss extends MovableObject {
  height = 400;
  width = 250;
  y = 60;

  hitboxOffsetX = 10;
  hitboxOffsetY = 10;
  hitboxWidth = this.width - 20;
  hitboxHeight = this.height - 20;

  baseSpeed = 0.6;
  enragedSpeed = 3.5;
  hitsTaken = 0;
  isEnraged = false;
  isEnragedIntroPlaying = false;
  isAlertPlayed = false;
  isAlertPlaying = false;
  alertRange = 400;
  attackRange = 250;

  deathSound = new Audio('audio/chicken-boss.mp3');
  deathSounds = new Audio('audio/chicken-deads.mp3');
  hitSound   = new Audio('audio/chicken-die.mp3');

  IMAGES_WALKING = [
    "img/4_enemie_boss_chicken/1_walk/G1.png",
    "img/4_enemie_boss_chicken/1_walk/G2.png",
    "img/4_enemie_boss_chicken/1_walk/G3.png",
    "img/4_enemie_boss_chicken/1_walk/G4.png",
  ];

  IMAGES_ALERT = [
    "img/4_enemie_boss_chicken/2_alert/G5.png",
    "img/4_enemie_boss_chicken/2_alert/G6.png",
    "img/4_enemie_boss_chicken/2_alert/G7.png",
    "img/4_enemie_boss_chicken/2_alert/G8.png",
    "img/4_enemie_boss_chicken/2_alert/G9.png",
    "img/4_enemie_boss_chicken/2_alert/G10.png",
    "img/4_enemie_boss_chicken/2_alert/G11.png",
    "img/4_enemie_boss_chicken/2_alert/G12.png",
  ];

  IMAGES_HURT = [
    "img/4_enemie_boss_chicken/4_hurt/G21.png",
    "img/4_enemie_boss_chicken/4_hurt/G22.png",
    "img/4_enemie_boss_chicken/4_hurt/G23.png",
  ];

  IMAGES_ATTACK = [
    "img/4_enemie_boss_chicken/3_attack/G13.png",
    "img/4_enemie_boss_chicken/3_attack/G14.png",
    "img/4_enemie_boss_chicken/3_attack/G15.png",
    "img/4_enemie_boss_chicken/3_attack/G16.png",
    "img/4_enemie_boss_chicken/3_attack/G17.png",
    "img/4_enemie_boss_chicken/3_attack/G18.png",
    "img/4_enemie_boss_chicken/3_attack/G19.png",
    "img/4_enemie_boss_chicken/3_attack/G20.png",
  ];

  IMAGES_DEAD = [
    "img/4_enemie_boss_chicken/5_dead/G24.png",
    "img/4_enemie_boss_chicken/5_dead/G25.png",
    "img/4_enemie_boss_chicken/5_dead/G26.png",
  ];

  constructor() {
    super().loadImage(this.IMAGES_WALKING[0]);
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_ALERT);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_ATTACK);
    this.loadImages(this.IMAGES_DEAD);
    this.x = 2500;
    this.speed = 0; 
    this.maxHealth = 5;
    this.health = this.maxHealth;
    this.animate();
  }

  getCurrentAnimationState() {
    if (this.health <= 0) return "dead";
    if (this.isEnragedIntroPlaying) return "enraged_intro";
    if (this.isAlertPlaying) return "alert";
    const char = this.world?.character;
    if (!char) return "walking";
    const distance = Math.abs(char.x - this.x);
    if (distance <= this.attackRange) return "attack";
    if (this.isEnraged) return "enraged_chase";
    return "walking";
  }

  playDeathAnimation() {
    if (this.currentImage < this.IMAGES_DEAD.length - 1) {
      this.currentImage++;
    }
    const i = Math.min(this.currentImage, this.IMAGES_DEAD.length - 1);
    const path = this.IMAGES_DEAD[i];
    this.img = this.imageCache[path];
  }

  takeDamage(damage = 1) {
    if (this.health <= 0) return;
    this.health -= damage;
    this.hitsTaken++;
    if (this.health <= 0) {this.health = 0; 
      this.die();
      return;
    }
    this.playSound(this.hitSound);
    if (!this.isEnraged && this.hitsTaken >= 2) {
      this.startEnrage();
    }
  }

  startEnrage() {
    this.isEnraged = true;
    this.isEnragedIntroPlaying = true;
    this.speed = 0;
    const enragedIntroDuration = this.IMAGES_HURT.length * 250;
    this.playSound(this.deathSound);
    setTimeout(() => {
      this.isEnragedIntroPlaying = false;
      this.speed = this.enragedSpeed;
    }, enragedIntroDuration);
  }

  die() {
    this.speed = 0;
    this.currentImage = 0;
    this.playSound(this.deathSounds);
  }

  animate() {
    this.startMovementLoop();
    this.startAnimationLoop();
  }

  startMovementLoop() {
    setStopableIntervall(() => {
      if (this.health <= 0) return;
      const char = this.world?.character;
      if (!char) return;
      const distance = Math.abs(char.x - this.x);
      if (!this.isAlertPlayed && !this.isAlertPlaying && distance <= this.alertRange) {
        this.startAlert();
        return;
      }
      if (this.isAlertPlaying) return;
      if (this.isEnragedIntroPlaying) return;

      this.updateMovement(char);
    }, 1000 / 60);
  }

  updateMovement(char) {
    if (!this.isAlertPlayed) return;
    this.speed = this.isEnraged ? this.enragedSpeed : this.baseSpeed;
    if (char.x < this.x) {
      this.otherDirection = false;
      this.moveLeft();
    } else {
      this.otherDirection = true;
      this.moveRight();
    }
  }

  startAnimationLoop() {
    setStopableIntervall(() => {
      const state = this.getCurrentAnimationState();
      if (state === "dead") {
        this.playDeathAnimation();
        return;
      }
      const images = this.getImagesForState(state);
      if (images) {
        this.playAnimation(images);
      }
    }, 500);
  }

  getImagesForState(state) {
    const stateToImages = {
      enraged_intro: this.IMAGES_HURT,
      enraged_chase: this.IMAGES_WALKING,
      alert: this.IMAGES_ALERT,
      walking: this.IMAGES_WALKING,
      attack: this.IMAGES_ATTACK,
    };
    return stateToImages[state] || null;
  }

  startAlert() {
    this.isAlertPlaying = true;
    this.speed = 0;
    const alertDuration = this.IMAGES_ALERT.length * 150;
    setTimeout(() => {
      this.isAlertPlaying = false;
      this.isAlertPlayed = true;
    }, alertDuration);
  }
}