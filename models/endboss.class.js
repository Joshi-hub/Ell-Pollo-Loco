class Endboss extends MovableObject {
  height = 400;
  width = 250;
  y = 60;

  hitboxOffsetX = 10;
  hitboxOffsetY = 10;
  hitboxWidth = this.width - 20;
  hitboxHeight = this.height - 20;

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
    this.speed = 0.3;
    this.maxHealth = 5;
    this.health = this.maxHealth;
    this.animate();
  }

  takeDamage(damage = 1) {
    this.health -= damage;
    if (this.health <= 0) {
      this.health = 0;
      this.die();
    }
  }

  die() {
    this.speed = 0;
    this.currentImage = 0;
  }

  isCharacterNearby() {
    if (!this.world || !this.world.character) {
      return "walking";
    }

    const distance = Math.abs(this.world.character.x - this.x);
    if (distance < 200) return "attack";
    if (distance < 400) return "alert";
    return "walking";
  }
  getCurrentAnimationState() {
    if (this.health <= 0) {
      return "dead";
    } else {
      return this.isCharacterNearby();
    }
  }

  playDeathAnimation() {
    if (this.currentImage < this.IMAGES_DEAD.length - 1) {
      this.currentImage++;
    }
    let i = Math.min(this.currentImage, this.IMAGES_DEAD.length - 1);
    let path = this.IMAGES_DEAD[i];
    this.img = this.imageCache[path];
  }

  // endboss.class.js
  takeDamage(damage = 1) {
    this.health -= damage;
    if (this.health <= 0) {
      this.health = 0;
      this.die();
      this.world?.handleGameOver(true); // Sieg
    }
  }

  animate() {
    setStopableIntervall(() => {
      if (this.health > 0) {
        this.moveLeft();
      }
    }, 1000 / 60);

    setStopableIntervall(() => {
      const animationState = this.getCurrentAnimationState();

      switch (animationState) {
        case "dead":
          this.playDeathAnimation();
          break;
        case "alert":
          this.playAnimation(this.IMAGES_ALERT);
          break;
        case "walking":
          this.playAnimation(this.IMAGES_WALKING);
          break;
        case "attack":
          this.playAnimation(this.IMAGES_ATTACK);
          break;
      }
    }, 200);
  }
}
