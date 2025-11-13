class SoundManager {
    constructor() {
      // Kurz-Sounds (SFX)
      this.sounds = {
        jump:          this.create('audio/character/jump.wav',        0.25),
        characterHurt: this.create('audio/character/hurt.wav',        0.3),
        coin:          this.create('audio/items/coin.wav',            0.3),
        bottlePickup:  this.create('audio/items/chili.wav',           0.3),
        bottleBreak:   this.create('audio/items/bottle_break.wav',    0.4),
        bossAlert:     this.create('audio/boss/alert.wav',            0.4),
        bossHurt:      this.create('audio/boss/hurt.wav',             0.4),
        bossDead:      this.create('audio/boss/dead.wav',             0.4),
      };
  
      // Musik-Loops
      this.music = {
        level: this.create('audio/music/level_theme.mp3', 0.2, true),
        boss:  this.create('audio/music/boss_theme.mp3',  0.25, true),
        win:   this.create('audio/music/win_theme.mp3',   0.25, false),
      };
    }
  
    create(path, volume = 1, loop = false) {
      const audio = new Audio(path);
      audio.volume = volume;
      audio.loop = loop;
      return audio;
    }
  
    // Generischer Play-Helper
    play(name) {
      const sound = this.sounds[name];
      if (!sound) return;
      sound.currentTime = 0;
      sound.play();
    }
  
    // Bequeme Wrapper
    playJump()             { this.play('jump'); }
    playCharacterHurt()    { this.play('characterHurt'); }
    playCoin()             { this.play('coin'); }
    playBottlePickup()     { this.play('bottlePickup'); }
    playBottleBreak()      { this.play('bottleBreak'); }
    playBossAlert()        { this.play('bossAlert'); }
    playBossHurt()         { this.play('bossHurt'); }
    playBossDead()         { this.play('bossDead'); }
  
    // Musik-Steuerung
    playLevelMusic() {
      this.stopAllMusic();
      this.music.level.currentTime = 0;
      this.music.level.play();
    }
  
    playBossMusic() {
      this.stopAllMusic();
      this.music.boss.currentTime = 0;
      this.music.boss.play();
    }
  
    playWinMusic() {
      this.stopAllMusic();
      this.music.win.currentTime = 0;
      this.music.win.play();
    }
  
    stopAllMusic() {
      Object.values(this.music).forEach((m) => m.pause());
    }
  }
  