const SoundEffects = {
    audioCtx: null,

    init() {
        if (!this.audioCtx) {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            if (AudioContextClass) {
                this.audioCtx = new AudioContextClass();
            }
        }
        if (this.audioCtx && this.audioCtx.state === 'suspended') {
            this.audioCtx.resume();
        }
    },

    playBGM() {
        if (typeof game !== 'undefined' && game.sound) {
            let bgm = game.sound.get('sound-game');
            if (!bgm) {
                bgm = game.sound.add('sound-game', { loop: true, volume: 0.35 });
                bgm.play();
            } else if (!bgm.isPlaying) {
                bgm.play();
            }
        }
    },

    stopBGM() {
        if (typeof game !== 'undefined' && game.sound) {
            let bgm = game.sound.get('sound-game');
            if (bgm && bgm.isPlaying) {
                bgm.stop();
            }
        }
    },

    playClick() {
        this.init();
        if (!this.audioCtx) return;
        let ctx = this.audioCtx;

        let osc = ctx.createOscillator();
        let gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1000, ctx.currentTime + 0.05);

        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 0.05);
    },

    playCorrect() {
        this.init();
        if (!this.audioCtx) return;
        let ctx = this.audioCtx;

        let now = ctx.currentTime;
        [523.25, 659.25, 783.99].forEach((freq, idx) => {
            let osc = ctx.createOscillator();
            let gain = ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, now + idx * 0.08);

            gain.gain.setValueAtTime(0, now + idx * 0.08);
            gain.gain.linearRampToValueAtTime(0.12, now + idx * 0.08 + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.15);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(now + idx * 0.08);
            osc.stop(now + idx * 0.08 + 0.15);
        });
    },

    playIncorrect() {
        this.init();
        if (!this.audioCtx) return;
        let ctx = this.audioCtx;

        let osc = ctx.createOscillator();
        let gain = ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(80, ctx.currentTime + 0.25);

        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.25);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 0.25);
    },

    playHit() {
        if (typeof game !== 'undefined' && game.sound) {
            game.sound.play('under-attack', { volume: 0.95 });
        }
    },

    playCoin() {
        this.init();
        if (!this.audioCtx) return;
        let ctx = this.audioCtx;

        let osc = ctx.createOscillator();
        let gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(987.77, ctx.currentTime);
        osc.frequency.setValueAtTime(1318.51, ctx.currentTime + 0.08);

        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.setValueAtTime(0.08, ctx.currentTime + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 0.25);
    },

    playBark() {
        if (typeof game !== 'undefined' && game.sound) {
            game.sound.play('dog', { volume: 0.9 });
        }
    },

    playVictory() {
        this.stopBGM();
        if (typeof game !== 'undefined' && game.sound) {
            game.sound.play('gamecomplete', { volume: 0.95 });
        }
    },

    playSlash() {
        if (typeof game !== 'undefined' && game.sound) {
            let randIdx = Math.floor(Math.random() * 3) + 1;
            game.sound.play('player-attack' + randIdx, { volume: 0.9 });
        }
    },

    playEnemyAttack() {
        if (typeof game !== 'undefined' && game.sound) {
            let randIdx = Math.floor(Math.random() * 4) + 1;
            game.sound.play('enemy-attack' + randIdx, { volume: 0.85 });
        }
    },

    playGameOver() {
        this.stopBGM();
        if (typeof game !== 'undefined' && game.sound) {
            game.sound.play('gameover', { volume: 0.95 });
        }
    },

    playNextStage() {
        if (typeof game !== 'undefined' && game.sound) {
            game.sound.play('next-stage', { volume: 0.9 });
        }
    },

    playBossWarning() {
        if (typeof game !== 'undefined' && game.sound) {
            game.sound.play('wave-boss', { volume: 0.95 });
        }
    }
};

function drawThaiFrame(graphics, x, y, w, h, radius = 16) {
    // 1. Sleek soft drop shadow
    graphics.fillStyle(0x000000, 0.15);
    graphics.fillRoundedRect(x + 2, y + 4, w, h, radius);

    // 2. Thin premium gold border
    graphics.fillStyle(0xd97706, 1); 
    graphics.fillRoundedRect(x, y, w, h, radius);
    
    // 3. Clean inside container (creamy warm white)
    graphics.fillStyle(0xfffbeb, 0.98); 
    graphics.fillRoundedRect(x + 2, y + 2, w - 4, h - 4, radius - 2);
}

class IntroScene extends Phaser.Scene {
    constructor() {
        super({ key: 'IntroScene' });
    }

    preload() {
        let loadingText = this.add.text(500, 300, 'กำลังโหลด... กรุณารอสักครู่', { fontFamily: 'Kanit, sans-serif', fontSize: '36px', color: '#ffffff' }).setOrigin(0.5);
        this.load.on('complete', () => {
            loadingText.destroy();
        });

        this.load.image('lvl_menu_bg', 'assets/homepage/homepage.png');
        this.load.image('player_idle_intro', 'assets/main-character/idle/idle1.png');
        
        // Preload player run frames for click animation
        for (let i = 1; i <= 26; i++) {
            let numStr = (i === 18) ? '17' : i;
            this.load.image('player_run_' + i, 'assets/main-character/run/run' + numStr + '.png');
        }

        // Preload audio assets
        this.load.audio('sound-game', 'assets/sound-effect/sound-game.mp3');
        this.load.audio('gamecomplete', 'assets/sound-effect/gamecomplete.wav');
        this.load.audio('gameover', 'assets/sound-effect/gameover.wav');
        this.load.audio('under-attack', 'assets/sound-effect/under-attack.wav');
        this.load.audio('dog', 'assets/sound-effect/dog.wav');
        this.load.audio('next-stage', 'assets/sound-effect/next-stage.wav');
        this.load.audio('wave-boss', 'assets/sound-effect/wave-boss.wav');
        
        for (let i = 1; i <= 4; i++) {
            this.load.audio('enemy-attack' + i, 'assets/sound-effect/enemy-attack' + i + '.wav');
        }
        for (let i = 1; i <= 3; i++) {
            this.load.audio('player-attack' + i, 'assets/sound-effect/player-attack' + i + '.wav');
        }
    }

    create() {
        if (!this.textures.exists('particle_glow')) {
            let canvas = this.textures.createCanvas('particle_glow', 32, 32);
            let ctx = canvas.context;
            let gradient = ctx.createRadialGradient(16, 16, 2, 16, 16, 16);
            gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
            gradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.8)');
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, 32, 32);
            canvas.refresh();
        }

        // Dark premium gradient background
        let bgGraphics = this.add.graphics();
        bgGraphics.fillGradientStyle(0x0c071a, 0x0c071a, 0x1f0624, 0x1f0624, 1);
        bgGraphics.fillRect(0, 0, 1000, 600);

        // Faint glowing glassmorphic elements
        this.add.graphics().fillStyle(0xffaa00, 0.02).fillCircle(180, 180, 280);
        this.add.graphics().fillStyle(0xa855f7, 0.02).fillCircle(820, 420, 320);

        // Magical rising particle system
        this.add.particles(0, 0, 'particle_glow', {
            x: { min: 0, max: 1000 },
            y: 620,
            scale: { start: 0.35, end: 0 },
            speedY: { min: -110, max: -45 },
            speedX: { min: -25, max: 25 },
            lifespan: { min: 3500, max: 6500 },
            alpha: { start: 0.6, end: 0 },
            tint: [0xa855f7, 0xf59e0b, 0x06b6d4, 0xec4899], // Indigo, Amber, Cyan, Pink
            blendMode: 'ADD',
            frequency: 120
        });

        // Main Character teaser (breathing in center)
        let playerIntro = this.add.sprite(500, 410, 'player_idle_intro').setOrigin(0.5).setScale(0.55);
        let breathingTween = this.tweens.add({
            targets: playerIntro,
            scaleY: 0.53,
            y: 414,
            duration: 900,
            yoyo: true,
            repeat: -1,
            ease: 'Quad.easeInOut'
        });

        // Register running anim if not exists
        if (!this.anims.exists('player_run_anim')) {
            this.anims.create({
                key: 'player_run_anim',
                frames: Array.from({length: 26}, (_, i) => ({ key: 'player_run_' + (i + 1) })),
                frameRate: 16,
                repeat: -1
            });
        }

        // Floating Title Container
        let titleContainer = this.add.container(500, 220);

        let titleGlow = this.add.text(0, 0, 'ENGLISH SLAYER', {
            fontFamily: 'Mitr, Kanit, sans-serif',
            fontSize: '84px',
            fontWeight: 'bold',
            color: '#f59e0b'
        }).setOrigin(0.5).setAlpha(0.2).setShadow(0, 0, '#f59e0b', 16, true, true);

        let titleText = this.add.text(0, 0, 'ENGLISH SLAYER', {
            fontFamily: 'Mitr, Kanit, sans-serif',
            fontSize: '80px',
            fontWeight: 'bold',
            color: '#ffffff',
            stroke: '#7f1d1d',
            strokeThickness: 8
        }).setOrigin(0.5).setShadow(0, 6, 'rgba(0,0,0,0.4)', 8);

        // Apply visual gradient to title text
        let titleCtx = titleText.context.createLinearGradient(0, 0, 0, titleText.height);
        titleCtx.addColorStop(0, '#fef08a');
        titleCtx.addColorStop(0.5, '#f59e0b');
        titleCtx.addColorStop(1, '#b45309');
        titleText.setFill(titleCtx);

        let subTitleText = this.add.text(0, 72, 'THE PATH OF WORD MASTERY', {
            fontFamily: 'Kanit, sans-serif',
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#38bdf8',
            stroke: '#0f172a',
            strokeThickness: 4
        }).setOrigin(0.5).setShadow(0, 2, 'rgba(0,0,0,0.5)', 2);

        titleContainer.add([titleGlow, titleText, subTitleText]);

        // Floating animation
        this.tweens.add({
            targets: titleContainer,
            y: 200,
            duration: 2200,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Pulsing Start Instruction
        let startText = this.add.text(500, 520, '— CLICK ANYWHERE TO START —', {
            fontFamily: 'Kanit, sans-serif',
            fontSize: '22px',
            fontWeight: 'bold',
            color: '#ffffff'
        }).setOrigin(0.5).setShadow(0, 2, 'rgba(0,0,0,0.5)', 2);

        this.tweens.add({
            targets: startText,
            alpha: { start: 0.35, end: 1 },
            scale: { start: 0.98, end: 1.02 },
            duration: 1100,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Click Action
        let hasClicked = false;
        this.input.on('pointerdown', (pointer) => {
            if (hasClicked) return;
            hasClicked = true;
            SoundEffects.playClick();
            SoundEffects.playBGM();

            // Flash effect
            this.cameras.main.flash(350, 255, 255, 255);

            // Explosion particle burst
            this.add.particles(pointer.x, pointer.y, 'particle_glow', {
                scale: { start: 0.35, end: 0 },
                speed: { min: 60, max: 220 },
                angle: { min: 0, max: 360 },
                lifespan: 500,
                alpha: { start: 1, end: 0 },
                tint: 0xf59e0b,
                blendMode: 'ADD',
                maxParticles: 25
            });

            // Stop breathing tween and play running anim
            if (breathingTween) breathingTween.stop();
            playerIntro.play('player_run_anim');

            // Character slides off
            playerIntro.setScale(0.55);
            this.tweens.add({
                targets: playerIntro,
                x: 1100,
                scaleX: 0.62,
                duration: 850,
                ease: 'Power2.easeIn'
            });

            // Camera Fade transition to Main Menu
            this.cameras.main.fadeOut(750, 12, 6, 21); // Dark fade
            this.cameras.main.once('camerafadeoutcomplete', () => {
                this.scene.start('MainMenu');
            });
        });
    }
}

class CutsceneScene extends Phaser.Scene {
    constructor() {
        super({ key: 'CutsceneScene' });
    }

    preload() {
        let loadingText = this.add.text(500, 300, 'กำลังโหลดเนื้อเรื่อง... กรุณารอสักครู่', { fontFamily: 'Kanit, sans-serif', fontSize: '36px', color: '#ffffff' }).setOrigin(0.5);
        this.load.on('complete', () => {
            loadingText.destroy();
        });

        this.load.image('lvl_menu_bg', 'assets/homepage/homepage.png');
        for (let i = 1; i <= 10; i++) {
            this.load.image('cutscene_' + i, 'assets/cutscene/cutscene' + i + '.png');
        }
    }

    create() {
        SoundEffects.playBGM();
        this.currentPage = 1;
        this.activeElements = [];
        this.drawPage();
    }

    clearPage() {
        this.activeElements.forEach(el => el.destroy());
        this.activeElements = [];
    }

    drawPage() {
        this.clearPage();

        let bg = this.add.image(500, 300, 'lvl_menu_bg').setDisplaySize(1000, 600);
        this.activeElements.push(bg);

        let overlay = this.add.graphics();
        overlay.fillStyle(0x000000, 0.85);
        overlay.fillRect(0, 0, 1000, 600);
        this.activeElements.push(overlay);

        if (this.currentPage === 1) {
            // Page 1: Panels 1-6 in 2x3 grid
            const cols = [290, 710];
            const rows = [100, 260, 420];

            const panels = [];
            const borders = [];

            for (let i = 0; i < 6; i++) {
                let colIdx = i % 2;
                let rowIdx = Math.floor(i / 2);
                let px = cols[colIdx];
                let py = rows[rowIdx];

                let key = 'cutscene_' + (i + 1);
                let texture = this.textures.get(key).getSourceImage();
                let ratio = texture.width / texture.height;
                
                // Fit to max size 360x135
                let maxW = 360;
                let maxH = 135;
                let w = maxW;
                let h = maxW / ratio;
                if (h > maxH) {
                    h = maxH;
                    w = maxH * ratio;
                }

                // Border graphics fitted around image
                let border = this.add.graphics();
                border.lineStyle(3, 0xffffff, 0.9);
                border.strokeRect(px - w/2 - 2, py - h/2 - 2, w + 4, h + 4);
                border.fillStyle(0x111827, 1);
                border.fillRect(px - w/2 - 2, py - h/2 - 2, w + 4, h + 4);
                border.setDepth(1);
                border.alpha = 0;
                borders.push(border);
                this.activeElements.push(border);

                // Cutscene image
                let img = this.add.image(px, py, key).setDisplaySize(w, h);
                img.setDepth(2);
                img.alpha = 0;
                panels.push(img);
                this.activeElements.push(img);
            }

            // Sequential Fade-in Tweens
            panels.forEach((panel, index) => {
                this.tweens.add({
                    targets: [panel, borders[index]],
                    alpha: 1,
                    duration: 500,
                    delay: index * 600,
                    ease: 'Power2.easeOut'
                });
            });

            // Back button (left)
            let btnBack = createChoiceButton(this, 180, 560, 'ย้อนกลับ (BACK)', () => {
                this.scene.start('MainMenu');
            }, 180, 44, '18px');
            btnBack.container.setDepth(10);
            this.activeElements.push(btnBack.container);

            // Next button (right)
            let btnNext = createChoiceButton(this, 820, 560, 'ถัดไป (NEXT)', () => {
                this.currentPage = 2;
                this.drawPage();
            }, 180, 44, '18px');
            btnNext.container.setDepth(10);
            this.activeElements.push(btnNext.container);

        } else if (this.currentPage === 2) {
            // Page 2: Panels 7-10 in 2x2 grid with subtitles
            const cols = [290, 710];
            const rows = [140, 360];
            const subtitles = [
                "ณ สวนสาธารณะแห่งหนึ่ง",
                "ช่วยด้วยค่ะ!!! น้องหมาหลุด",
                "ช่วยจับน้องหมาทีค่ะ!!!",
                "กลับมานี่นะเจ้าหมา"
            ];

            const panels = [];
            const borders = [];
            const texts = [];

            for (let i = 0; i < 4; i++) {
                let colIdx = i % 2;
                let rowIdx = Math.floor(i / 2);
                let px = cols[colIdx];
                let py = rows[rowIdx];

                let key = 'cutscene_' + (7 + i);
                let texture = this.textures.get(key).getSourceImage();
                let ratio = texture.width / texture.height;
                
                // Fit to max size 360x170
                let maxW = 360;
                let maxH = 170;
                let w = maxW;
                let h = maxW / ratio;
                if (h > maxH) {
                    h = maxH;
                    w = maxH * ratio;
                }

                // Border graphics fitted around image
                let border = this.add.graphics();
                border.lineStyle(3, 0xffffff, 0.9);
                border.strokeRect(px - w/2 - 2, py - h/2 - 12, w + 4, h + 4);
                border.fillStyle(0x111827, 1);
                border.fillRect(px - w/2 - 2, py - h/2 - 12, w + 4, h + 4);
                border.setDepth(1);
                border.alpha = 0;
                borders.push(border);
                this.activeElements.push(border);

                // Cutscene image (shifted up slightly to leave space for text)
                let img = this.add.image(px, py - 10, key).setDisplaySize(w, h);
                img.setDepth(2);
                img.alpha = 0;
                panels.push(img);
                this.activeElements.push(img);

                // Caption text positioned below image
                let capText = this.add.text(px, py + h/2 + 2, subtitles[i], {
                    fontFamily: 'Kanit, sans-serif',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    color: '#ffffff',
                    stroke: '#000000',
                    strokeThickness: 4
                }).setOrigin(0.5).setDepth(3);
                capText.alpha = 0;
                texts.push(capText);
                this.activeElements.push(capText);
            }

            // Sequential Fade-in Tweens
            panels.forEach((panel, index) => {
                this.tweens.add({
                    targets: [panel, borders[index], texts[index]],
                    alpha: 1,
                    duration: 500,
                    delay: index * 800,
                    ease: 'Power2.easeOut'
                });
            });

            // Back button (left)
            let btnBack = createChoiceButton(this, 180, 560, 'ย้อนกลับ (BACK)', () => {
                this.currentPage = 1;
                this.drawPage();
            }, 180, 44, '18px');
            btnBack.container.setDepth(10);
            this.activeElements.push(btnBack.container);

            // Start Game button (right) - Starts CategoryMenu stage selection
            let btnStart = createChoiceButton(this, 820, 560, 'เริ่มเกม (START)', () => {
                this.scene.start('CategoryMenu', { charId: 'thai' });
            }, 180, 44, '18px');
            btnStart.container.setDepth(10);
            this.activeElements.push(btnStart.container);
        }
    }
}

class EndCutsceneScene extends Phaser.Scene {
    constructor() {
        super({ key: 'EndCutsceneScene' });
    }

    preload() {
        let loadingText = this.add.text(500, 300, 'กำลังโหลดฉากจบ... กรุณารอสักครู่', { fontFamily: 'Kanit, sans-serif', fontSize: '36px', color: '#ffffff' }).setOrigin(0.5);
        this.load.on('complete', () => {
            loadingText.destroy();
        });

        this.load.image('lvl_menu_bg', 'assets/homepage/homepage.png');
        for (let i = 11; i <= 13; i++) {
            this.load.image('cutscene_' + i, 'assets/cutscene/cutscene' + i + '.png');
        }
    }

    init(data) {
        this.finalScore = data ? (data.score || 0) : 0;
    }

    create() {
        let bg = this.add.image(500, 300, 'lvl_menu_bg').setDisplaySize(1000, 600);
        let overlay = this.add.graphics();
        overlay.fillStyle(0x000000, 0.85);
        overlay.fillRect(0, 0, 1000, 600);

        // Panel positions:
        // 11 and 12 side-by-side in Row 1 (y = 140)
        // 13 centered in Row 2 (y = 360)
        const coords = [
            { x: 290, y: 140, key: 'cutscene_11', text: "มานี่มาเจ้าหมา" },
            { x: 710, y: 140, key: 'cutscene_12', text: "เก่งมากเด็กดี" },
            { x: 500, y: 360, key: 'cutscene_13', text: "ผู้หญิง: ขอบคุณมากนะคะ" }
        ];

        const panels = [];
        const borders = [];
        const texts = [];

        coords.forEach((coord, index) => {
            let texture = this.textures.get(coord.key).getSourceImage();
            let ratio = texture.width / texture.height;

            // Fit to max size 360x170
            let maxW = 360;
            let maxH = 170;
            let w = maxW;
            let h = maxW / ratio;
            if (h > maxH) {
                h = maxH;
                w = maxH * ratio;
            }

            // Border graphics
            let border = this.add.graphics();
            border.lineStyle(3, 0xffffff, 0.9);
            border.strokeRect(coord.x - w/2 - 2, coord.y - h/2 - 12, w + 4, h + 4);
            border.fillStyle(0x111827, 1);
            border.fillRect(coord.x - w/2 - 2, coord.y - h/2 - 12, w + 4, h + 4);
            border.setDepth(1);
            border.alpha = 0;
            borders.push(border);

            // Cutscene image (shifted up slightly to leave space for text)
            let img = this.add.image(coord.x, coord.y - 10, coord.key).setDisplaySize(w, h);
            img.setDepth(2);
            img.alpha = 0;
            panels.push(img);

            // Caption text
            let capText = this.add.text(coord.x, coord.y + h/2 + 2, coord.text, {
                fontFamily: 'Kanit, sans-serif',
                fontSize: '18px',
                fontWeight: 'bold',
                color: '#ffffff',
                stroke: '#000000',
                strokeThickness: 4
            }).setOrigin(0.5).setDepth(3);
            capText.alpha = 0;
            texts.push(capText);
        });

        // Sequential Fade-in Tweens
        panels.forEach((panel, index) => {
            this.tweens.add({
                targets: [panel, borders[index], texts[index]],
                alpha: 1,
                duration: 500,
                delay: index * 900,
                ease: 'Power2.easeOut'
            });
        });

        // Continue button
        let btnNext = createChoiceButton(this, 500, 560, 'แสดงผลสรุป (CONTINUE)', () => {
            this.showMissionComplete();
        }, 260, 44, '18px');
        btnNext.container.setDepth(10);
        btnNext.container.alpha = 0;

        this.tweens.add({
            targets: btnNext.container,
            alpha: 1,
            duration: 800,
            delay: 3 * 900
        });
    }

    showMissionComplete() {
        SoundEffects.playVictory();
        this.children.removeAll();

        let bg = this.add.image(500, 300, 'lvl_menu_bg').setDisplaySize(1000, 600);
        let overlay = this.add.graphics();
        overlay.fillStyle(0x000000, 0.7);
        overlay.fillRect(0, 0, 1000, 600);
        overlay.setDepth(20);

        let winFrame = this.add.graphics();
        winFrame.setDepth(21);
        drawThaiFrame(winFrame, 180, 80, 640, 440, 18);

        let titleText = this.add.text(500, 160, 'MISSION COMPLETE', {
            fontFamily: 'Mitr, Kanit, sans-serif',
            fontSize: '56px',
            fontWeight: 'bold',
            color: '#fbbf24',
            stroke: '#1e3e6b',
            strokeThickness: 6
        }).setOrigin(0.5).setDepth(22).setShadow(2, 4, 'rgba(0,0,0,0.3)', 2, false, true);

        let subText = this.add.text(500, 250, 'ยินดีด้วย! ท่านปราบจอมมารและผ่านด่านทั้งหมดสำเร็จ', {
            fontFamily: 'Kanit, sans-serif',
            fontSize: '22px',
            fontWeight: 'bold',
            color: '#1e293b'
        }).setOrigin(0.5).setDepth(22);

        let scoreText = this.add.text(500, 320, 'คะแนนสะสมสุดท้าย: ' + this.finalScore, {
            fontFamily: 'Kanit, sans-serif',
            fontSize: '32px',
            fontWeight: 'bold',
            color: '#b45309'
        }).setOrigin(0.5).setDepth(22);

        let playAgainBtnObj = createChoiceButton(this, 360, 430, 'เล่นอีกครั้ง', () => {
            this.scene.start('GamePlay', { startStageIdx: 0, charId: 'thai' });
        }, 220, 60, '26px');
        playAgainBtnObj.container.setDepth(22);

        let mainMenuBtnObj = createChoiceButton(this, 640, 430, 'เมนูหลัก', () => {
            this.scene.start('MainMenu');
        }, 220, 60, '26px');
        mainMenuBtnObj.container.setDepth(22);
    }
}

class CategoryMenu extends Phaser.Scene {
    constructor() {
        super({ key: 'CategoryMenu' });
    }

    init(data) {
        this.charId = data && data.charId ? data.charId : 'thai';
    }

    create() {
        SoundEffects.playBGM();

        let bg = this.add.image(500, 300, 'lvl_menu_bg').setDisplaySize(1000, 600);
        let overlay = this.add.graphics();
        overlay.fillStyle(0x0f172a, 0.7); // Friendly slate blue overlay
        overlay.fillRect(0, 0, 1000, 600);

        this.add.text(500, 70, 'WORD RUSH - เลือกด่าน', {
            fontFamily: 'Mitr, Kanit, sans-serif',
            fontSize: '54px',
            fontWeight: 'bold',
            color: '#ffffff',
            stroke: '#1e3e6b',
            strokeThickness: 6
        }).setOrigin(0.5).setShadow(2, 4, 'rgba(0,0,0,0.15)', 2, false, true);

        let unlockedStageIdx = parseInt(localStorage.getItem('unlockedStageIdx')) || 0;

        let stages = [
            { name: 'ด่าน 1: สัตว์', num: '1' },
            { name: 'ด่าน 2: ร่างกาย', num: '2' },
            { name: 'ด่าน 3: ผักและผลไม้', num: '3' },
            { name: 'ด่าน 4: วิทยาศาสตร์', num: '4' },
            { name: 'ด่าน 5: คอมพิวเตอร์', num: '5' },
            { name: 'ด่าน 6: ครอบครัว', num: '6' }
        ];
        
        let startX = 220;
        let startY = 180;
        let spacingX = 280;
        let spacingY = 180;
        
        stages.forEach((st, i) => {
            let row = Math.floor(i / 3);
            let col = i % 3;
            let cx = startX + (col * spacingX);
            let cy = startY + (row * spacingY);
            
            // Check if this stage is unlocked
            let isUnlocked = i <= unlockedStageIdx;

            // Premium Slate Card Frame
            let cardBg = this.add.graphics();
            cardBg.fillStyle(0x000000, 0.15);
            cardBg.fillRoundedRect(cx - 118, cy - 66, 240, 140, 12);
            cardBg.fillStyle(isUnlocked ? 0xd97706 : 0x475569, 1);
            cardBg.fillRoundedRect(cx - 120, cy - 70, 240, 140, 12);

            let cardInner = this.add.graphics();
            cardInner.fillStyle(isUnlocked ? 0x1e293b : 0x0f172a, 1);
            cardInner.fillRoundedRect(cx - 118, cy - 68, 236, 136, 10);
            
            // Big Number 
            let numTxt = this.add.text(cx, cy - 15, st.num, {
                fontFamily: 'Kanit, sans-serif',
                fontWeight: 'bold',
                fontSize: '80px',
                color: isUnlocked ? '#ffffff' : '#475569'
            }).setOrigin(0.5);
            
            // Name Text
            let titleText = isUnlocked ? st.name : st.name + ' 🔒';
            let title = this.add.text(cx, cy + 40, titleText, {
                fontFamily: 'Kanit, sans-serif',
                fontWeight: 'bold',
                fontSize: '24px',
                color: isUnlocked ? '#e2e8f0' : '#475569'
            }).setOrigin(0.5);

            if (isUnlocked) {
                let zone = this.add.zone(cx, cy, 240, 140).setInteractive({ useHandCursor: true });
                
                zone.on('pointerover', () => {
                    cardInner.clear();
                    cardInner.fillStyle(0x334155, 1);
                    cardInner.fillRoundedRect(cx - 118, cy - 68, 236, 136, 10);
                    title.setColor('#fbbf24');
                    numTxt.setColor('#fbbf24');
                    this.tweens.add({ targets: [numTxt, title], scale: 1.04, duration: 100 });
                });
                
                zone.on('pointerout', () => {
                    cardInner.clear();
                    cardInner.fillStyle(0x1e293b, 1);
                    cardInner.fillRoundedRect(cx - 118, cy - 68, 236, 136, 10);
                    title.setColor('#e2e8f0');
                    numTxt.setColor('#ffffff');
                    this.tweens.add({ targets: [numTxt, title], scale: 1.0, duration: 100 });
                });
                
                zone.on('pointerdown', () => {
                    SoundEffects.playClick();
                    this.scene.start('GamePlay', { startStageIdx: i, charId: this.charId });
                });
            }
        });

        createChoiceButton(this, 500, 520, 'ย้อนกลับ', () => {
            this.scene.start('MainMenu');
        });
    }
}

class MainMenu extends Phaser.Scene {
    constructor() {
        super({ key: 'MainMenu' });
    }

    preload() {
        let loadingText = this.add.text(500, 300, 'กำลังโหลดเกม... กรุณารอสักครู่', { fontFamily: 'Kanit, sans-serif', fontSize: '40px', color: '#ffffff' }).setOrigin(0.5);
        this.load.on('complete', () => {
            loadingText.destroy();
        });

        this.load.image('lvl_menu_bg', 'assets/homepage/homepage.png');
        this.load.image('game_logo', 'assets/logo/logo.png');
    }

    create() {
        // Unlock all stages for testing
        localStorage.setItem('unlockedStageIdx', 5);
        SoundEffects.playBGM();

        let bg = this.add.image(500, 300, 'lvl_menu_bg').setDisplaySize(1000, 600);
        
        let overlay = this.add.graphics();
        overlay.fillStyle(0x000000, 0.4);
        overlay.fillRect(0, 0, 1000, 600);

        // Bouncing/Breathing Title Logo (Centered directly on screen)
        let titleBlock = this.add.container(500, 160);
        
        let logoImg = this.add.image(0, 0, 'game_logo').setDisplaySize(360, 240);
        titleBlock.add(logoImg);

        this.tweens.add({
            targets: titleBlock,
            y: 150, 
            duration: 1800,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });



        // Start Button 
        let btnStart = createChoiceButton(this, 500, 350, 'เริ่มเล่นเกม (START GAME)', () => {
            this.scene.start('CutsceneScene'); 
        });

        // Select Stage Button
        let btnSelect = createChoiceButton(this, 500, 435, 'เลือกด่าน (SELECT STAGE)', () => {
            this.scene.start('CategoryMenu', { charId: 'thai' });
        });

        // Settings Button
        let btnSettings = createChoiceButton(this, 500, 520, 'ตั้งค่าความยาก', () => {
            this.scene.start('SettingsMenu');
        });
    }
}

const ENEMY_TYPES_DATA = {
    'dog': {
        walkCount: 20,
        walkFiles: Array.from({length: 20}, (_, i) => `assets/enemy/stage1/dog/dog-walk/dog-walk${i + 1}.png`),
        attackCount: 4,
        attackFiles: Array.from({length: 4}, (_, i) => `assets/enemy/stage1/dog/dog-attack/dog-attack${i + 1}.png`),
        scale: 0.85,
        yOffset: 0
    },
    'duck': {
        walkCount: 20,
        walkFiles: Array.from({length: 20}, (_, i) => `assets/enemy/stage1/duck/duck-walk/duck-walk${i + 1}.png`),
        attackCount: 4,
        attackFiles: Array.from({length: 4}, (_, i) => `assets/enemy/stage1/duck/duck-attack/duck-attack${i + 1}.png`),
        scale: 0.85,
        yOffset: 0
    },
    'lion': {
        walkCount: 19,
        walkFiles: Array.from({length: 19}, (_, i) => `assets/enemy/stage1/lion/lion-walk/lion-walk${i + 1}.png`),
        attackCount: 4,
        attackFiles: Array.from({length: 4}, (_, i) => `assets/enemy/stage1/lion/lion-attack/lion-attack${i + 1}.png`),
        scale: 0.85,
        yOffset: 0
    },
    'elephant': {
        walkCount: 20,
        walkFiles: Array.from({length: 20}, (_, i) => `assets/enemy/stage1/elephant/elephant-walk/elephant-walk${i + 1}.png`),
        attackCount: 4,
        attackFiles: Array.from({length: 4}, (_, i) => `assets/enemy/stage1/elephant/elephant-attack/elephant-attack${i + 1}.png`),
        scale: 0.85,
        yOffset: 0
    },
    'pig': {
        walkCount: 20,
        walkFiles: Array.from({length: 20}, (_, i) => `assets/enemy/stage1/pig/pig-walk/pig-walk${i + 1}.png`),
        attackCount: 4,
        attackFiles: Array.from({length: 4}, (_, i) => `assets/enemy/stage1/pig/pig-attack/pig-attack${i + 1}.png`),
        scale: 0.85,
        yOffset: 0
    },
    'apple': {
        walkCount: 19,
        walkFiles: Array.from({length: 19}, (_, i) => `assets/enemy/stage3/apple/apple-walk/apple-walk${i + 1}.png`),
        attackCount: 4,
        attackFiles: Array.from({length: 4}, (_, i) => `assets/enemy/stage3/apple/apple-attack/apple-attack${i + 1}.png`),
        scale: 0.85,
        yOffset: 0
    },
    'banana': {
        walkCount: 20,
        walkFiles: Array.from({length: 20}, (_, i) => `assets/enemy/stage3/banana/banana-walk/banana-walk${i + 1}.png`),
        attackCount: 4,
        attackFiles: Array.from({length: 4}, (_, i) => `assets/enemy/stage3/banana/banana-attack/banana-attack${i + 1}.png`),
        scale: 0.85,
        yOffset: 0
    },
    'coconut': {
        walkCount: 20,
        walkFiles: Array.from({length: 20}, (_, i) => `assets/enemy/stage3/coconut/coconut-walk/coconut-walk${i + 1}.png`),
        attackCount: 4,
        attackFiles: Array.from({length: 4}, (_, i) => `assets/enemy/stage3/coconut/coconut-attack/coconut-attack${i + 1}.png`),
        scale: 0.85,
        yOffset: 0
    },
    'orange': {
        walkCount: 20,
        walkFiles: Array.from({length: 20}, (_, i) => `assets/enemy/stage3/orange/orange-walk/orange-walk${i + 1}.png`),
        attackCount: 4,
        attackFiles: Array.from({length: 4}, (_, i) => `assets/enemy/stage3/orange/orange-attack/orange-attack${i + 1}.png`),
        scale: 0.85,
        yOffset: 0
    },
    'watermelon': {
        walkCount: 20,
        walkFiles: Array.from({length: 20}, (_, i) => `assets/enemy/stage3/watermelon/watermelon-walk/watermelon-walk${i + 1}.png`),
        attackCount: 4,
        attackFiles: Array.from({length: 4}, (_, i) => `assets/enemy/stage3/watermelon/watermelon-attack/watermelon-attack${i + 1}.png`),
        scale: 0.85,
        yOffset: 0
    },
    'brain': {
        walkCount: 18,
        walkFiles: Array.from({length: 18}, (_, i) => `assets/enemy/stage2/brain/brain-walk/brain-walk${i + 1}.png`),
        attackCount: 2,
        attackFiles: Array.from({length: 2}, (_, i) => `assets/enemy/stage2/brain/brain-attack/brain-attack${i + 1}.png`),
        scale: 0.85,
        yOffset: 0
    },
    'heart': {
        walkCount: 17,
        walkFiles: Array.from({length: 17}, (_, i) => `assets/enemy/stage2/heart/heart-walk/heart-walk${i + 1}.png`),
        attackCount: 4,
        attackFiles: Array.from({length: 4}, (_, i) => `assets/enemy/stage2/heart/heart-attack/heart-attack${i + 1}.png`),
        scale: 0.85,
        yOffset: 0
    },
    'nose': {
        walkCount: 18,
        walkFiles: Array.from({length: 18}, (_, i) => `assets/enemy/stage2/nose/nose-walk/nose-walk${i + 1}.png`),
        attackCount: 5,
        attackFiles: Array.from({length: 5}, (_, i) => `assets/enemy/stage2/nose/nose-attack/nose-attack${i + 1}.png`),
        scale: 0.85,
        yOffset: 0
    },
    'boss': {
        walkCount: 15,
        walkFiles: Array.from({length: 15}, (_, i) => `assets/enemy/boss/boss-run/boss-run${i + 1}.png`),
        attackCount: 2,
        attackFiles: [
            'assets/enemy/boss/boss-attack/boss-attack1.png',
            'assets/enemy/boss/boss-attack/boss-attack2.png'
        ],
        scale: 1.0
    },
    'glass-tube': {
        walkCount: 20,
        walkFiles: Array.from({length: 20}, (_, i) => `assets/enemy/stage4/glass-tube/glass-tube-walk/glass-tube-walk${i + 1}.png`),
        attackCount: 4,
        attackFiles: Array.from({length: 4}, (_, i) => `assets/enemy/stage4/glass-tube/glass-tube-attack/glass-tube-attack${i + 1}.png`),
        scale: 0.85
    },
    'scientist': {
        walkCount: 20,
        walkFiles: Array.from({length: 20}, (_, i) => `assets/enemy/stage4/scientist/scientist-walk/scientist-walk${i + 1}.png`),
        attackCount: 5,
        attackFiles: Array.from({length: 5}, (_, i) => `assets/enemy/stage4/scientist/scientist-attack/scientist-attack${i + 1}.png`),
        scale: 0.85
    },
    'slime': {
        walkCount: 20,
        walkFiles: Array.from({length: 20}, (_, i) => `assets/enemy/stage4/slime/slime-walk/slime-walk${i + 1}.png`),
        attackCount: 4,
        attackFiles: Array.from({length: 4}, (_, i) => `assets/enemy/stage4/slime/slime-attack/slime-attack${i + 1}.png`),
        scale: 0.85
    },
    'VGA': {
        walkCount: 17,
        walkFiles: Array.from({length: 17}, (_, i) => `assets/enemy/stage5/VGA/VGA-walk/VGA-walk${i + 1}.png`),
        attackCount: 4,
        attackFiles: Array.from({length: 4}, (_, i) => `assets/enemy/stage5/VGA/VGA-attack/VGA-attack${i + 1}.png`),
        scale: 0.85
    },
    'keyboard': {
        walkCount: 20,
        walkFiles: Array.from({length: 20}, (_, i) => `assets/enemy/stage5/keyboard/keyboard-fly/keyboard-fly${i + 1}.png`),
        attackCount: 4,
        attackFiles: Array.from({length: 4}, (_, i) => `assets/enemy/stage5/keyboard/keyboard-attack/keyboard-attack${i + 1}.png`),
        scale: 0.85,
        yOffset: 0
    },
    'mouse': {
        walkCount: 20,
        walkFiles: Array.from({length: 20}, (_, i) => `assets/enemy/stage5/mouse/mouse-walk/mouse-walk${i + 1}.png`),
        attackCount: 4,
        attackFiles: Array.from({length: 4}, (_, i) => `assets/enemy/stage5/mouse/mouse-attack/mouse-attack${i + 1}.png`),
        scale: 0.85,
        yOffset: 0
    },
    'ram': {
        walkCount: 14,
        walkFiles: [
            ...Array.from({length: 9}, (_, i) => `assets/enemy/stage5/ram/ram-walk/ram-walk${i + 1}.png`),
            ...Array.from({length: 5}, (_, i) => `assets/enemy/stage5/ram/ram-walk/ram-walk${i + 11}.png`)
        ],
        attackCount: 3,
        attackFiles: Array.from({length: 3}, (_, i) => `assets/enemy/stage5/ram/ram-attack/ram-attack${i + 1}.png`),
        scale: 0.85,
        yOffset: 0
    },
    'family': {
        walkCount: 20,
        walkFiles: Array.from({length: 20}, (_, i) => `assets/enemy/stage6/family/family-walk/family-walk${i + 1}.png`),
        attackCount: 3,
        attackFiles: Array.from({length: 3}, (_, i) => `assets/enemy/stage6/family/family-attack/family-attack${i + 1}.png`),
        scale: 0.85,
        yOffset: 0
    },
    'familytwo': {
        walkCount: 18,
        walkFiles: Array.from({length: 18}, (_, i) => `assets/enemy/stage6/familytwo/familytwo-walk/familytwo-walk${i + 1}.png`),
        attackCount: 3,
        attackFiles: Array.from({length: 3}, (_, i) => `assets/enemy/stage6/familytwo/familytwo-attack/familytwo-attack${i + 1}.png`),
        scale: 0.85,
        yOffset: 0
    },
    'ghostgirl': {
        walkCount: 20,
        walkFiles: Array.from({length: 20}, (_, i) => {
            let num = i + 1;
            if (num === 19) return 'assets/enemy/stage6/ghostgirl/ghostgirl-fly/ghostgirl-fly219.png';
            return `assets/enemy/stage6/ghostgirl/ghostgirl-fly/ghostgirl-fly${num}.png`;
        }),
        attackCount: 4,
        attackFiles: Array.from({length: 4}, (_, i) => `assets/enemy/stage6/ghostgirl/ghostgirl-attack/ghostgirl-attack${i + 1}.png`),
        scale: 0.85,
        yOffset: 0,
        float: true
    }
};

class GamePlay extends Phaser.Scene {
    constructor() {
        super({ key: 'GamePlay' });
    }

    init(data) {
        this.gameState = {
            coins: 0,
            ammo: 3,
            zombie: null,
            player: null,
            quizTextGroup: null,
            buttonGroup: null,
            isAnimating: false,
            isGameOver: false,
            zombieTween: null,
            quizQueue: [],
            currentStageIdx: 0,
            scoreInStage: 0,
            vocabData: [
                {
                    stageName: "ด่าน 1: สัตว์ (Animals)",
                    wordsToPass: 10,
                    words: [
                        { eng: 'Cat', c1: 'แมว', c2: 'หมู', ans: 1 },
                        { eng: 'Dog', c1: 'นก', c2: 'หมา', ans: 2 },
                        { eng: 'Bird', c1: 'นก', c2: 'ปลา', ans: 1 },
                        { eng: 'Fish', c1: 'ไก่', c2: 'ปลา', ans: 2 },
                        { eng: 'Bear', c1: 'หมี', c2: 'เสือ', ans: 1 },
                        { eng: 'Tiger', c1: 'สิงโต', c2: 'เสือ', ans: 2 },
                        { eng: 'Lion', c1: 'สิงโต', c2: 'ลิง', ans: 1 },
                        { eng: 'Elephant', c1: 'ช้าง', c2: 'ม้า', ans: 1 },
                        { eng: 'Monkey', c1: 'กระต่าย', c2: 'ลิง', ans: 2 },
                        { eng: 'Snake', c1: 'งู', c2: 'กบ', ans: 1 },
                        { eng: 'Rabbit', c1: 'กระต่าย', c2: 'หนู', ans: 1 },
                        { eng: 'Horse', c1: 'วัว', c2: 'ม้า', ans: 2 },
                        { eng: 'Cow', c1: 'วัว', c2: 'แกะ', ans: 1 },
                        { eng: 'Pig', c1: 'ช้าง', c2: 'หมู', ans: 2 },
                        { eng: 'Sheep', c1: 'แกะ', c2: 'เต่า', ans: 1 },
                        { eng: 'Duck', c1: 'เป็ด', c2: 'ไก่', ans: 1 },
                        { eng: 'Chicken', c1: 'นก', c2: 'ไก่', ans: 2 },
                        { eng: 'Mouse', c1: 'หนู', c2: 'แมว', ans: 1 },
                        { eng: 'Turtle', c1: 'เต่า', c2: 'กบ', ans: 1 },
                        { eng: 'Frog', c1: 'งู', c2: 'กบ', ans: 2 }
                    ]
                },
                {
                    stageName: "ด่าน 2: ร่างกาย (Body)",
                    wordsToPass: 12,
                    words: [
                        { eng: 'Head', c1: 'หัว', c2: 'แขน', ans: 1 },
                        { eng: 'Hand', c1: 'ขา', c2: 'มือ', ans: 2 },
                        { eng: 'Eye', c1: 'ตา', c2: 'จมูก', ans: 1 },
                        { eng: 'Leg', c1: 'แขน', c2: 'ขา', ans: 2 },
                        { eng: 'Mouth', c1: 'ปาก', c2: 'หู', ans: 1 },
                        { eng: 'Nose', c1: 'ตา', c2: 'จมูก', ans: 2 },
                        { eng: 'Ear', c1: 'หู', c2: 'ผม', ans: 1 },
                        { eng: 'Hair', c1: 'นิ้ว', c2: 'ผม', ans: 2 },
                        { eng: 'Arm', c1: 'แขน', c2: 'ขา', ans: 1 },
                        { eng: 'Foot', c1: 'มือ', c2: 'เท้า', ans: 2 },
                        { eng: 'Finger', c1: 'นิ้วมือ', c2: 'นิ้วเท้า', ans: 1 },
                        { eng: 'Toe', c1: 'คอ', c2: 'นิ้วเท้า', ans: 2 },
                        { eng: 'Face', c1: 'ใบหน้า', c2: 'ไหล่', ans: 1 },
                        { eng: 'Neck', c1: 'หลัง', c2: 'คอ', ans: 2 },
                        { eng: 'Shoulder', c1: 'ไหล่', c2: 'ท้อง', ans: 1 },
                        { eng: 'Back', c1: 'หัวเข่า', c2: 'หลัง', ans: 2 },
                        { eng: 'Stomach', c1: 'ท้อง', c2: 'ฟัน', ans: 1 },
                        { eng: 'Knee', c1: 'ลิ้น', c2: 'หัวเข่า', ans: 2 },
                        { eng: 'Tooth', c1: 'ฟัน', c2: 'จมูก', ans: 1 },
                        { eng: 'Tongue', c1: 'แขน', c2: 'ลิ้น', ans: 2 }
                    ]
                },
                {
                    stageName: "ด่าน 3: ผักและผลไม้ (Fruits & Vegetables)",
                    wordsToPass: 12,
                    words: [
                        { eng: 'Apple', c1: 'แอปเปิล', c2: 'ส้ม', ans: 1 },
                        { eng: 'Banana', c1: 'แตงโม', c2: 'กล้วย', ans: 2 },
                        { eng: 'Orange', c1: 'ส้ม', c2: 'มะละกอ', ans: 1 },
                        { eng: 'Grape', c1: 'ข้าว', c2: 'องุ่น', ans: 2 },
                        { eng: 'Watermelon', c1: 'แตงโม', c2: 'มะพร้าว', ans: 1 },
                        { eng: 'Mango', c1: 'มะม่วง', c2: 'ส้มโอ', ans: 1 },
                        { eng: 'Coconut', c1: 'มะละกอ', c2: 'มะพร้าว', ans: 2 },
                        { eng: 'Pineapple', c1: 'สับปะรด', c2: 'เชอร์รี', ans: 1 },
                        { eng: 'Strawberry', c1: 'กล้วย', c2: 'สตรอว์เบอร์รี', ans: 2 },
                        { eng: 'Papaya', c1: 'มังคุด', c2: 'มะละกอ', ans: 2 },
                        { eng: 'Carrot', c1: 'แครอท', c2: 'มันฝรั่ง', ans: 1 },
                        { eng: 'Tomato', c1: 'แตงกวา', c2: 'มะเขือเทศ', ans: 2 },
                        { eng: 'Potato', c1: 'มันฝรั่ง', c2: 'หัวหอม', ans: 1 },
                        { eng: 'Pumpkin', c1: 'ผักโขม', c2: 'ฟักทอง', ans: 2 },
                        { eng: 'Cabbage', c1: 'กะหล่ำปลี', c2: 'บรอกโคลี', ans: 1 },
                        { eng: 'Onion', c1: 'กระเทียม', c2: 'หอมหัวใหญ่', ans: 2 },
                        { eng: 'Garlic', c1: 'กระเทียม', c2: 'แตงกวา', ans: 1 },
                        { eng: 'Cucumber', c1: 'พริก', c2: 'แตงกวา', ans: 2 },
                        { eng: 'Spinach', c1: 'ผักโขม', c2: 'ผักกาดขาว', ans: 1 },
                        { eng: 'Broccoli', c1: 'แครอท', c2: 'บรอกโคลี', ans: 2 }
                    ]
                },
                {
                    stageName: "ด่าน 4: วิทยาศาสตร์ (Science)",
                    wordsToPass: 12,
                    words: [
                        { eng: 'Atom', c1: 'อะตอม', c2: 'โมเลกุล', ans: 1 },
                        { eng: 'Cell', c1: 'เนื้อเยื่อ', c2: 'เซลล์', ans: 2 },
                        { eng: 'Energy', c1: 'พลังงาน', c2: 'แรงดัน', ans: 1 },
                        { eng: 'Gravity', c1: 'แรงดึงดูด', c2: 'แรงโน้มถ่วง', ans: 2 },
                        { eng: 'Oxygen', c1: 'ออกซิเจน', c2: 'คาร์บอน', ans: 1 },
                        { eng: 'Planet', c1: 'ดาวฤกษ์', c2: 'ดาวเคราะห์', ans: 2 },
                        { eng: 'Chemical', c1: 'สารเคมี', c2: 'สารละลาย', ans: 1 },
                        { eng: 'Fossil', c1: 'แร่ธาตุ', c2: 'ฟอสซิล', ans: 2 },
                        { eng: 'Galaxy', c1: 'กาแล็กซี', c2: 'ระบบสุริยะ', ans: 1 },
                        { eng: 'Magnet', c1: 'เหล็ก', c2: 'แม่เหล็ก', ans: 2 },
                        { eng: 'Force', c1: 'แรง', c2: 'ความเร็ว', ans: 1 },
                        { eng: 'Acid', c1: 'ด่าง', c2: 'กรด', ans: 2 },
                        { eng: 'Bacteria', c1: 'แบคทีเรีย', c2: 'ไวรัส', ans: 1 },
                        { eng: 'Evolution', c1: 'วิวัฒนาการ', c2: 'การกลายพันธุ์', ans: 1 },
                        { eng: 'Element', c1: 'สารประกอบ', c2: 'ธาตุ', ans: 2 },
                        { eng: 'Experiment', c1: 'การทดลอง', c2: 'ทฤษฎี', ans: 1 },
                        { eng: 'Microscope', c1: 'กล้องส่องทางไกล', c2: 'กล้องจุลทรรศน์', ans: 2 },
                        { eng: 'Organism', c1: 'สิ่งมีชีวิต', c2: 'สภาพแวดล้อม', ans: 1 },
                        { eng: 'Temperature', c1: 'ความร้อน', c2: 'อุณหภูมิ', ans: 2 },
                        { eng: 'Universe', c1: 'จักรวาล', c2: 'อวกาศ', ans: 1 }
                    ]
                },
                {
                    stageName: "ด่าน 5: อุปกรณ์คอมพิวเตอร์ (Computer Equipment)",
                    wordsToPass: 12,
                    words: [
                        { eng: 'Computer', c1: 'คอมพิวเตอร์', c2: 'โทรทัศน์', ans: 1 },
                        { eng: 'Keyboard', c1: 'เมาส์', c2: 'คีย์บอร์ด', ans: 2 },
                        { eng: 'Mouse', c1: 'เมาส์', c2: 'แป้นพิมพ์', ans: 1 },
                        { eng: 'Monitor', c1: 'หน้าจอ', c2: 'ลำโพง', ans: 1 },
                        { eng: 'Printer', c1: 'สแกนเนอร์', c2: 'เครื่องพิมพ์', ans: 2 },
                        { eng: 'Speaker', c1: 'ลำโพง', c2: 'หูฟัง', ans: 1 },
                        { eng: 'Headphones', c1: 'ไมโครโฟน', c2: 'หูฟัง', ans: 2 },
                        { eng: 'Microphone', c1: 'ไมโครโฟน', c2: 'กล้อง', ans: 1 },
                        { eng: 'Webcam', c1: 'กล้องเว็บแคม', c2: 'โปรเจคเตอร์', ans: 1 },
                        { eng: 'Router', c1: 'โมเด็ม', c2: 'เราเตอร์', ans: 2 },
                        { eng: 'Hard drive', c1: 'ฮาร์ดไดรฟ์', c2: 'แฟลชไดรฟ์', ans: 1 },
                        { eng: 'Keyboard pad', c1: 'แผ่นรองเมาส์', c2: 'แผ่นรองคีย์บอร์ด', ans: 2 },
                        { eng: 'CPU', c1: 'ซีพียู', c2: 'เมนบอร์ด', ans: 1 },
                        { eng: 'Motherboard', c1: 'การ์ดจอ', c2: 'เมนบอร์ด', ans: 2 },
                        { eng: 'Graphics card', c1: 'การ์ดจอ', c2: 'แรม', ans: 1 },
                        { eng: 'RAM', c1: 'ฮาร์ดดิสก์', c2: 'แรม', ans: 2 },
                        { eng: 'Power supply', c1: 'พาวเวอร์ซัพพลาย', c2: 'สายไฟ', ans: 1 },
                        { eng: 'USB flash drive', c1: 'เมมโมรี่การ์ด', c2: 'แฟลชไดรฟ์', ans: 2 },
                        { eng: 'Scanner', c1: 'เครื่องสแกน', c2: 'เครื่องแฟกซ์', ans: 1 },
                        { eng: 'Projector', c1: 'จอภาพ', c2: 'เครื่องโปรเจคเตอร์', ans: 2 }
                    ]
                },
                {
                    stageName: "ด่าน 6: ครอบครัว (Family)",
                    wordsToPass: 12,
                    words: [
                        { eng: 'Father', c1: 'พ่อ', c2: 'แม่', ans: 1 },
                        { eng: 'Mother', c1: 'พี่สาว', c2: 'แม่', ans: 2 },
                        { eng: 'Brother', c1: 'พี่ชาย', c2: 'น้องสาว', ans: 1 },
                        { eng: 'Sister', c1: 'ลุง', c2: 'พี่สาว', ans: 2 },
                        { eng: 'Son', c1: 'ลูกชาย', c2: 'ลูกสาว', ans: 1 },
                        { eng: 'Daughter', c1: 'หลาน', c2: 'ลูกสาว', ans: 2 },
                        { eng: 'Uncle', c1: 'ลุง', c2: 'ป้า', ans: 1 },
                        { eng: 'Aunt', c1: 'ยาย', c2: 'ป้า', ans: 2 },
                        { eng: 'Grandfather', c1: 'ปู่/ตา', c2: 'ลุง', ans: 1 },
                        { eng: 'Grandmother', c1: 'ป้า', c2: 'ย่า/ยาย', ans: 2 },
                        { eng: 'Cousin', c1: 'ลูกพี่ลูกน้อง', c2: 'เพื่อน', ans: 1 },
                        { eng: 'Husband', c1: 'ภรรยา', c2: 'สามี', ans: 2 },
                        { eng: 'Wife', c1: 'ภรรยา', c2: 'สามี', ans: 1 },
                        { eng: 'Nephew', c1: 'หลานชาย', c2: 'หลานสาว', ans: 1 },
                        { eng: 'Niece', c1: 'ลูกสาว', c2: 'หลานสาว', ans: 2 },
                        { eng: 'Relatives', c1: 'ญาติ', c2: 'เพื่อน', ans: 1 },
                        { eng: 'Child', c1: 'ผู้ใหญ่', c2: 'เด็ก', ans: 2 },
                        { eng: 'Parent', c1: 'ผู้ปกครอง', c2: 'ญาติ', ans: 1 },
                        { eng: 'Family', c1: 'เพื่อน', c2: 'ครอบครัว', ans: 2 },
                        { eng: 'Twin', c1: 'แฝด', c2: 'พี่น้อง', ans: 1 }
                    ]
                }
            ],
            currentQuiz: null,
            isBossFight: false,
            bossHp: 0,
            bossMaxHp: 3,
            isFinalRound: false,
            finalRoundWave: 0,
            finalRoundEnemies: []
        };
        this.selectedStartStage = data && data.startStageIdx !== undefined ? data.startStageIdx : 0;
        this.gameState.charId = 'thai';
    }

    preload() {
        let loadingText = this.add.text(500, 300, 'กำลังโหลดทรัพยากร...', { fontFamily: 'Kanit, sans-serif', fontSize: '40px', color: '#ffffff' }).setOrigin(0.5);
        this.load.on('complete', () => {
            loadingText.destroy();
        });

        // Load Stage Backgrounds (stage1.png to stage6.png)
        for (let i = 0; i < 6; i++) {
            this.load.image('lvl_bg' + i, 'assets/background/stage' + (i + 1) + '.png');
        }

        // Load Main Character frames
        this.load.image('player_idle', 'assets/main-character/idle/idle1.png');
        for (let i = 1; i <= 10; i++) {
            this.load.image('player_idle_' + i, 'assets/main-character/idle/idle' + i + '.png');
        }
        for (let i = 1; i <= 8; i++) {
            this.load.image('player_charge_' + i, 'assets/main-character/charge/charge' + i + '.png');
        }
        for (let i = 1; i <= 26; i++) {
            let numStr = (i === 18) ? '17' : i;
            this.load.image('player_run_' + i, 'assets/main-character/run/run' + numStr + '.png');
        }
        for (let i = 1; i <= 9; i++) {
            this.load.image('player_attack_' + i, 'assets/main-character/attack/att' + i + '.png');
        }
        for (let i = 1; i <= 3; i++) {
            this.load.image('player_dash_' + i, 'assets/main-character/dash/dash' + i + '.png');
        }
        for (let i = 1; i <= 12; i++) {
            this.load.image('player_dead_' + i, 'assets/main-character/main-dead/dead' + i + '.png');
        }

        // Load Lucky the Dog frames
        for (let i = 1; i <= 20; i++) {
            this.load.image('lucky_stand_' + i, 'assets/pet/lucky/lucky-stand/lucky-stand' + i + '.png');
        }
        for (let i = 1; i <= 21; i++) {
            this.load.image('lucky_run_' + i, 'assets/pet/lucky/lucky-run/lucky-run' + i + '.png');
        }
        for (let i = 1; i <= 10; i++) {
            this.load.image('luacky_escape_' + i, 'assets/pet/lucky/luacky-escape/luacky-escape' + i + '.png');
        }


        // Load Enemy frames (ghost-girl, ghost-water, skeleton: walk, charge, attack)
        Object.keys(ENEMY_TYPES_DATA).forEach(typeKey => {
            const data = ENEMY_TYPES_DATA[typeKey];
            data.walkFiles.forEach((file, idx) => {
                this.load.image(`${typeKey}_walk_${idx + 1}`, file);
            });
            if (data.attackFiles) {
                data.attackFiles.forEach((file, idx) => {
                    this.load.image(`${typeKey}_attack_${idx + 1}`, file);
                });
            }
        });

        // Load Boss hurt frames
        for (let i = 1; i <= 15; i++) {
            this.load.image(`boss_hurt_${i}`, `assets/enemy/boss/boss-hurt/boss-hurt${i}.png`);
        }

        // Load Boss dead frames
        for (let i = 1; i <= 7; i++) {
            this.load.image(`boss_dead_${i}`, `assets/enemy/boss/boss-dead/boss-dead${i}.png`);
        }


        // Load Spells and Explosions
        for (let i = 1; i <= 10; i++) {
            this.load.image('ef3_exp' + i, 'assets/ef3/PNG/Explosion/Explosion' + i + '.png');
        }

        // Lightning for player death
        for (let i = 1; i <= 5; i++) this.load.image('lt_b' + i, 'assets/ef3/PNG/Lightning/Lightning_beginning' + i + '.png');
        for (let i = 1; i <= 6; i++) this.load.image('lt_c' + i, 'assets/ef3/PNG/Lightning/Lightning_cycle' + i + '.png');
        for (let i = 1; i <= 3; i++) this.load.image('lt_e' + i, 'assets/ef3/PNG/Lightning/Lightning_end' + i + '.png');

        // Initialize Base Stats
        this.gameState.maxHp = 3;
        this.gameState.hp = 3;
        this.gameState.currentStageIdx = this.selectedStartStage;
        this.gameState.scoreInStage = 0;
    }

    playerTakeDamage() {
        if (this.gameState.isGameOver) return;
        this.gameState.hp--;
        SoundEffects.playHit();
        this.updateHpBar();
        
        // Flash screen red
        let dmgOverlay = this.add.graphics().fillStyle(0xff0000, 0.45).fillRect(0,0,1000,600).setDepth(20);
        this.tweens.add({ targets: dmgOverlay, alpha: 0, duration: 400, onComplete: ()=>dmgOverlay.destroy() });

        // Stop current idle breathing and sway tweens
        if (this.gameState.playerIdleTween) this.gameState.playerIdleTween.pause();
        if (this.gameState.playerSwayTween) this.gameState.playerSwayTween.pause();

        // Flash player red
        this.gameState.player.setTint(0xff3333);
        this.cameras.main.shake(250, 0.02);

        // Knockback animation
        this.tweens.add({
            targets: this.gameState.player,
            x: 130,
            angle: -25,
            duration: 150,
            yoyo: true,
            repeat: 0,
            onComplete: () => {
                this.gameState.player.clearTint();
                this.gameState.player.setAngle(0);
                this.gameState.player.setX(130);

                if (this.gameState.hp <= 0) {
                    this.gameState.isGameOver = true;
                    
                    // Death animation using main-character dead frames
                    if (this.gameState.auraParticles) this.gameState.auraParticles.stop();
                    if (this.gameState.playerIdleTween) this.gameState.playerIdleTween.stop();
                    if (this.gameState.playerSwayTween) this.gameState.playerSwayTween.stop();
                    if (this.gameState.flareTimer) this.gameState.flareTimer.destroy();
                    
                    this.gameState.player.play('player_dead_anim');
                    this.gameState.player.once('animationcomplete-player_dead_anim', () => {
                        this.gameState.player.setTint(0x555555);
                        
                        // Lightning strike on body
                        let doom = this.add.sprite(this.gameState.player.x, this.gameState.player.y - 120, 'lt_b1').setOrigin(0.5).setDepth(20).setScale(3);
                        doom.play('ef_lightning');
                        doom.once('animationcomplete', () => { 
                            doom.destroy(); 
                            this.gameOver();
                        });
                    });
                } else {
                    if (this.gameState.playerIdleTween) this.gameState.playerIdleTween.resume();
                    if (this.gameState.playerSwayTween) this.gameState.playerSwayTween.resume();

                    if (this.gameState.isFinalRound) {
                        this.gameState.isAnimating = false;
                        // Resume other enemies' walk tweens
                        if (this.gameState.finalRoundEnemies) {
                            this.gameState.finalRoundEnemies.forEach(e => {
                                if (e && e.moveTween) e.moveTween.resume();
                            });
                        }
                        this.nextQuiz();
                    } else {
                        // Fade out the current enemy and spawn a fresh one for the next question
                        this.tweens.add({
                            targets: this.gameState.zombie,
                            alpha: 0,
                            duration: 600,
                            onComplete: () => {
                                this.gameState.isAnimating = false;
                                this.nextQuiz();
                            }
                        });
                    }
                }
            }
        });
    }

    create() {
        SoundEffects.playBGM();
        // Create a dynamic radial glow texture for particles
        if (!this.textures.exists('particle_glow')) {
            let canvas = this.textures.createCanvas('particle_glow', 32, 32);
            let ctx = canvas.context;
            let gradient = ctx.createRadialGradient(16, 16, 2, 16, 16, 16);
            gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
            gradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.8)');
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, 32, 32);
            canvas.refresh();
        }

        let safeBgIdx = this.gameState.currentStageIdx % 6;
        this.gameState.bg = this.add.image(500, 300, 'lvl_bg' + safeBgIdx).setDisplaySize(1000, 600);

        // --- STYLIZED RPG HUD (Thai Red/Gold Design) ---
        
        // --- STYLIZED RPG HUD (Zero Overlap Layout) ---
        
        // 1. Player Info Frame (Top Left: x 15..245, y 12..66)
        let hudFrame = this.add.graphics();
        drawThaiFrame(hudFrame, 15, 12, 230, 54, 10);
        
        // Avatar (Main Character)
        let avatar = this.add.image(42, 39, 'player_idle').setScale(0.20).setOrigin(0.5);
        
        // HP Label
        this.add.text(75, 39, 'HP', { fontFamily: 'Kanit, sans-serif', fontWeight: 'bold', fontSize: '20px', color: '#1e293b' }).setOrigin(0, 0.5);

        // Health Bar Implementation
        let hpBg = this.add.graphics().fillStyle(0xe2e8f0, 1).fillRoundedRect(110, 29, 125, 20, 4);
        this.gameState.hpBar = this.add.graphics();
        this.updateHpBar = () => {
            this.gameState.hpBar.clear();
            this.gameState.hpBar.fillStyle(0x22c55e, 1); // Emerald green for HP
            let w = (this.gameState.hp / this.gameState.maxHp) * 125;
            if (w > 0) this.gameState.hpBar.fillRoundedRect(110, 29, w, 20, 4);
        };
        this.updateHpBar();
        
        // 2. Stage/Level Box (Center Top: x 260..740, y 12..66)
        let stageFrame = this.add.graphics();
        drawThaiFrame(stageFrame, 260, 12, 480, 54, 12);

        this.gameState.stageText = this.add.text(500, 39, this.gameState.vocabData[this.gameState.currentStageIdx].stageName, {
            fontFamily: 'Kanit, sans-serif', fontWeight: 'bold', fontSize: '19px', color: '#1e293b'
        }).setOrigin(0.5).setAlign('center');

        // 3. Score Box (Top Right: x 755..930, y 12..66)
        let scoreFrame = this.add.graphics();
        drawThaiFrame(scoreFrame, 755, 12, 175, 54, 12);
        
        this.gameState.scoreText = this.add.text(842, 39, 'SCORE: 0', {
            fontFamily: 'Kanit, sans-serif', fontWeight: 'bold', fontSize: '22px', color: '#1e293b'
        }).setOrigin(0.5);

        // Pause Button (Far Right: x 940..980, y 39)
        let pauseBtn = this.add.text(962, 39, '⏸', { fontSize: '38px', color: '#d97706' })
            .setOrigin(0.5)
            .setInteractive({useHandCursor: true});

        pauseBtn.on('pointerdown', () => {
            pauseBtn.setAlpha(0.6);
            setTimeout(() => pauseBtn.setAlpha(1), 100);
            this.scene.pause();
            this.scene.launch('PauseMenu');
        });

        // Sign signboard for current word (Cleanly separated below HUD: x 240..760, y 80..190)
        let wordSign = this.add.graphics();
        drawThaiFrame(wordSign, 240, 80, 520, 110, 16);

        this.gameState.wordText = this.add.text(500, 135, 'เริ่มศึก', { 
            fontSize: '42px', 
            fontFamily: 'Mitr, Kanit, sans-serif', 
            fontWeight: 'bold',
            color: '#1e293b',
            align: 'center',
            padding: { top: 6, bottom: 6 }
        }).setOrigin(0.5).setAlign('center');

        // Setup Player (Main Character) - starts at far left
        this.gameState.player = this.add.sprite(130, this.getBaseY(), 'player_idle').setOrigin(0.5, 1).setDepth(2);
        this.gameState.player.setScale(0.6);

        // Gold Aura Foot Particles (Using dynamic glow texture)
        this.gameState.auraParticles = this.add.particles(130, this.getBaseY(), 'particle_glow', {
            scale: { start: 0.2, end: 0 },
            speedY: { min: -120, max: -40 },
            speedX: { min: -25, max: 25 },
            lifespan: 800,
            alpha: { start: 0.6, end: 0 },
            tint: 0xffd700, // Golden aura
            blendMode: 'ADD',
            frequency: 120
        }).setDepth(1);

        // Breathing Idle Tween (scale only, no Y movement)
        this.gameState.playerIdleTween = this.tweens.add({
            targets: this.gameState.player,
            scaleY: 0.63,
            scaleX: 0.57,
            duration: 1100,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Stance Sway Tween (Weapon angle sway only, no horizontal drifting)
        this.gameState.playerSwayTween = this.tweens.add({
            targets: this.gameState.player,
            angle: 4,
            duration: 2200,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Periodic Combat Stance Flare (Surges gold energy ring every 6 seconds)
        this.gameState.flareTimer = this.time.addEvent({
            delay: 6000,
            loop: true,
            callback: () => {
                if (this.gameState.isAnimating || this.gameState.isGameOver) return;

                if (this.gameState.playerIdleTween) this.gameState.playerIdleTween.pause();
                if (this.gameState.playerSwayTween) this.gameState.playerSwayTween.pause();

                this.tweens.add({
                    targets: this.gameState.player,
                    scaleY: 0.56,
                    scaleX: 0.75,
                    angle: -8,
                    duration: 250,
                    yoyo: true,
                    repeat: 0,
                    ease: 'Quad.easeInOut',
                    onComplete: () => {
                        this.cameras.main.shake(100, 0.005);

                        let ring = this.add.circle(this.gameState.player.x, this.gameState.player.y - 45, 20).setStrokeStyle(4, 0xffd700).setDepth(1);
                        this.tweens.add({
                            targets: ring,
                            radius: 80,
                            alpha: 0,
                            duration: 350,
                            onComplete: () => ring.destroy()
                        });

                        let burst = this.add.particles(this.gameState.player.x, this.gameState.player.y - 20, 'particle_glow', {
                            scale: { start: 0.3, end: 0 },
                            speed: { min: 80, max: 200 },
                            lifespan: 400,
                            alpha: { start: 0.8, end: 0 },
                            tint: 0xffd700,
                            blendMode: 'ADD',
                            maxParticles: 15
                        }).setDepth(1);

                        this.tweens.add({
                            targets: this.gameState.player,
                            scaleY: 0.6,
                            scaleX: 0.6,
                            angle: 0,
                            x: 130,
                            y: this.getBaseY(),
                            duration: 200,
                            onComplete: () => {
                                if (this.gameState.playerIdleTween) this.gameState.playerIdleTween.resume();
                                if (this.gameState.playerSwayTween) this.gameState.playerSwayTween.resume();
                            }
                        });
                    }
                });
            }
        });

        // Define keyframe animations for Main Character
        if (!this.anims.exists('player_idle_anim')) {
            this.anims.create({
                key: 'player_idle_anim',
                frames: Array.from({length: 10}, (_, i) => ({ key: 'player_idle_' + (i + 1) })),
                frameRate: 10,
                repeat: -1
            });
            this.anims.create({
                key: 'player_charge_anim',
                frames: Array.from({length: 8}, (_, i) => ({ key: 'player_charge_' + (i + 1) })),
                frameRate: 12,
                repeat: 0
            });
            this.anims.create({
                key: 'player_run_anim',
                frames: Array.from({length: 26}, (_, i) => ({ key: 'player_run_' + (i + 1) })),
                frameRate: 16,
                repeat: -1
            });
            this.anims.create({
                key: 'player_dash_anim',
                frames: Array.from({length: 3}, (_, i) => ({ key: 'player_dash_' + (i + 1) })),
                frameRate: 12,
                repeat: -1
            });
            this.anims.create({
                key: 'player_dead_anim',
                frames: Array.from({length: 12}, (_, i) => ({ key: 'player_dead_' + (i + 1) })),
                frameRate: 10,
                repeat: 0
            });
        }


        // Define keyframe animations for Enemy types (dog, duck, lion, elephant, pig, boss)
        Object.keys(ENEMY_TYPES_DATA).forEach(typeKey => {
            const data = ENEMY_TYPES_DATA[typeKey];

            const walkAnimKey = `${typeKey}_walk_anim`;
            if (!this.anims.exists(walkAnimKey)) {
                this.anims.create({
                    key: walkAnimKey,
                    frames: Array.from({length: data.walkCount}, (_, i) => ({ key: `${typeKey}_walk_${i + 1}` })),
                    frameRate: 14,
                    repeat: -1
                });
            }

            // Attack animation for non-boss enemies (plays all attack frames in sequence)
            if (typeKey !== 'boss') {
                const attackAnimKey = `${typeKey}_attack_anim`;
                if (!this.anims.exists(attackAnimKey)) {
                    this.anims.create({
                        key: attackAnimKey,
                        frames: Array.from({length: data.attackCount}, (_, i) => ({ key: `${typeKey}_attack_${i + 1}` })),
                        frameRate: 10,
                        repeat: 0
                    });
                }
            }
        });

        // Define Boss hurt animation
        if (!this.anims.exists('boss_hurt_anim')) {
            this.anims.create({
                key: 'boss_hurt_anim',
                frames: Array.from({length: 15}, (_, i) => ({ key: `boss_hurt_${i + 1}` })),
                frameRate: 15,
                repeat: 0
            });
        }
        if (!this.anims.exists('boss_hurt_run_anim')) {
            this.anims.create({
                key: 'boss_hurt_run_anim',
                frames: Array.from({length: 15}, (_, i) => ({ key: `boss_hurt_${i + 1}` })),
                frameRate: 15,
                repeat: -1
            });
        }

        // Define Boss dead animation
        if (!this.anims.exists('boss_dead_anim')) {
            this.anims.create({
                key: 'boss_dead_anim',
                frames: Array.from({length: 7}, (_, i) => ({ key: `boss_dead_${i + 1}` })),
                frameRate: 8,
                repeat: 0
            });
        }

        // Play initial idle animation on Hanuman
        if (this.gameState.player) {
            this.gameState.player.play('player_idle_anim');
        }

        // Yaksa uses native animations, so no flipbook timer is needed.

        // Setup Spell/Explosion Animations if they don't exist yet
        if (!this.anims.exists('ef3_exp_anim')) {
            this.anims.create({
                key: 'ef3_exp_anim',
                frames: Array.from({length: 10}, (_, i) => ({ key: 'ef3_exp' + (i + 1) })),
                frameRate: 15,
                repeat: 0
            });
        }
        if (!this.anims.exists('ef_lightning')) {
            this.anims.create({
                key: 'ef_lightning',
                frames: [
                    { key: 'lt_b1' }, { key: 'lt_b2' }, { key: 'lt_b3' }, { key: 'lt_b4' }, { key: 'lt_b5' },
                    { key: 'lt_c1' }, { key: 'lt_c2' }, { key: 'lt_c3' }, { key: 'lt_c4' }, { key: 'lt_c5' }, { key: 'lt_c6' },
                    { key: 'lt_e1' }, { key: 'lt_e2' }, { key: 'lt_e3' }
                ],
                frameRate: 20,
                repeat: 0
            });
        }
        
        if (!this.anims.exists('lucky_stand_anim')) {
            this.anims.create({
                key: 'lucky_stand_anim',
                frames: Array.from({length: 20}, (_, i) => ({ key: 'lucky_stand_' + (i + 1) })),
                frameRate: 12,
                repeat: -1
            });
        }
        if (!this.anims.exists('lucky_run_anim')) {
            this.anims.create({
                key: 'lucky_run_anim',
                frames: Array.from({length: 20}, (_, i) => ({ key: 'lucky_run_' + (i + 1) })),
                frameRate: 14,
                repeat: -1
            });
        }
        if (!this.anims.exists('luacky_escape_anim')) {
            this.anims.create({
                key: 'luacky_escape_anim',
                frames: Array.from({length: 10}, (_, i) => ({ key: 'luacky_escape_' + (i + 1) })),
                frameRate: 14,
                repeat: -1
            });
        }
        
        // Setup Action Buttons (4 Buttons, Horizontal Row at the Bottom)
        let bw = 230; 
        let bh = 60;
        let bf = '28px';
        this.gameState.btn1 = createChoiceButton(this, 140, 560, 'A', () => this.checkAnswer(1), bw, bh, bf);
        this.gameState.btn2 = createChoiceButton(this, 380, 560, 'B', () => this.checkAnswer(2), bw, bh, bf);
        this.gameState.btn3 = createChoiceButton(this, 620, 560, 'C', () => this.checkAnswer(3), bw, bh, bf);
        this.gameState.btn4 = createChoiceButton(this, 860, 560, 'D', () => this.checkAnswer(4), bw, bh, bf);

        // Setup Keyboard Shortcuts A, B, C, D
        this.input.keyboard.on('keydown', (event) => {
            if (this.gameState.isAnimating || this.gameState.isGameOver) return;
            const key = event.key.toLowerCase();
            if (key === 'a') {
                if (this.gameState.btn1 && this.gameState.btn1.press) this.gameState.btn1.press();
            } else if (key === 'b') {
                if (this.gameState.btn2 && this.gameState.btn2.press) this.gameState.btn2.press();
            } else if (key === 'c') {
                if (this.gameState.btn3 && this.gameState.btn3.press) this.gameState.btn3.press();
            } else if (key === 'd') {
                if (this.gameState.btn4 && this.gameState.btn4.press) this.gameState.btn4.press();
            }
        });

        this.triggerLuckyStartAnimation(() => {
            this.nextQuiz();
        });
    }

    showMissionBriefing(onComplete) {
        this.gameState.isAnimating = true;

        const STAGE_MISSIONS = [
            {
                title: "ภารกิจด่านที่ 1: ตามล่าหาเพื่อนสี่ขา",
                desc: "ตามหา 'หมา (Dog)' ที่หลงทางในป่าลึกอันตราย!\nจงสะกดคำศัพท์สัตว์ต่าง ๆ เพื่อเปิดทางตามหามันให้เจอ!",
                icon: "🐕"
            },
            {
                title: "ภารกิจด่านที่ 2: ร่างกายที่แข็งแกร่ง",
                desc: "ตามหา 'หัวใจ (Heart)' เพื่อฟื้นฟูพลังชีวิตและร่างกาย!\nจงฝ่าฟันเหล่าซอมบี้อวัยวะต่าง ๆ และกู้ชีพพลังชีวิตขึ้นมา!",
                icon: "❤️"
            },
            {
                title: "ภารกิจด่านที่ 3: แหล่งพลังงานจากธรรมชาติ",
                desc: "ตามหา 'ผลไม้ (Fruits)' แสนหวานเพื่อเติมพลังงานที่สูญเสียไป!\nจัดการกับปีศาจผักผลไม้เพื่อเก็บเสบียงในการเดินทาง!",
                icon: "🍎"
            },
            {
                title: "ภารกิจด่านที่ 4: ความลับใต้แล็บวิจัย",
                desc: "ตามหา 'อุปกรณ์วิทยาศาสตร์ (Science Equipment)' เพื่อไขปริศนาไวรัส!\nพิชิตสิ่งประดิษฐ์และสไลม์เคมีทดลองที่ขัดขวางคุณ!",
                icon: "🧪"
            },
            {
                title: "ภารกิจด่านที่ 5: ยุทโธปกรณ์เทคโนโลยี",
                desc: "ตามหา 'อุปกรณ์คอมพิวเตอร์ (Computer Equipment)' เพื่อเปิดระบบสื่อสาร!\nปราบเหล่าฮาร์ดแวร์ไอทีที่คลุ้มคลั่งและเปิดใช้งานระบบหลัก!",
                icon: "💻"
            },
            {
                title: "ภารกิจด่านที่ 6: สายสัมพันธ์ที่ขาดหาย",
                desc: "ตามหา 'พี่ชายที่หายตัวไป (The Missing Brother)' ในปราสาทผีสิง!\nนี่คือด่านสุดท้ายที่จะนำครอบครัวกลับมารวมกันอีกครั้ง!",
                icon: "👦"
            }
        ];

        let stageIdx = this.gameState.currentStageIdx;
        let mission = STAGE_MISSIONS[stageIdx % 6];

        let overlay = this.add.graphics();
        overlay.fillStyle(0x070c18, 0.85);
        overlay.fillRect(0, 0, 1000, 600);
        overlay.setDepth(60);
        overlay.alpha = 0;

        let modalContainer = this.add.container(500, 300);
        modalContainer.setDepth(61);
        modalContainer.alpha = 0;
        modalContainer.scale = 0.8;

        let modalFrame = this.add.graphics();
        modalFrame.fillStyle(0x000000, 0.35);
        modalFrame.fillRoundedRect(-302, -196, 604, 404, 20);
        modalFrame.fillStyle(0xd97706, 1);
        modalFrame.fillRoundedRect(-300, -200, 600, 400, 20);
        modalFrame.fillStyle(0xfffbeb, 0.98);
        modalFrame.fillRoundedRect(-297, -197, 594, 394, 18);
        
        modalContainer.add(modalFrame);

        let iconText = this.add.text(0, -115, mission.icon, {
            fontSize: '80px'
        }).setOrigin(0.5);
        modalContainer.add(iconText);

        let titleText = this.add.text(0, -35, mission.title, {
            fontFamily: 'Kanit, sans-serif',
            fontSize: '30px',
            fontWeight: 'bold',
            color: '#7f1d1d'
        }).setOrigin(0.5);
        modalContainer.add(titleText);

        let descText = this.add.text(0, 45, mission.desc, {
            fontFamily: 'Kanit, sans-serif',
            fontSize: '20px',
            color: '#334155',
            align: 'center',
            lineSpacing: 8
        }).setOrigin(0.5);
        modalContainer.add(descText);

        this.tweens.add({
            targets: overlay,
            alpha: 1,
            duration: 300,
            ease: 'Quad.easeOut'
        });

        this.tweens.add({
            targets: modalContainer,
            alpha: 1,
            scale: 1,
            duration: 400,
            ease: 'Back.easeOut'
        });

        let btnStart = createChoiceButton(this, 500, 420, 'เริ่มภารกิจ (START)', () => {
            btnStart.container.destroy();
            
            this.tweens.add({
                targets: modalContainer,
                alpha: 0,
                scale: 0.85,
                duration: 250,
                ease: 'Quad.easeIn',
                onComplete: () => {
                    modalContainer.destroy();
                }
            });

            this.tweens.add({
                targets: overlay,
                alpha: 0,
                duration: 200,
                ease: 'Quad.easeIn',
                onComplete: () => {
                    overlay.destroy();
                    this.gameState.isAnimating = false;
                    if (onComplete) onComplete();
                }
            });
        }, 260, 60, '24px');
        
        btnStart.container.setDepth(62);
        btnStart.container.alpha = 0;
        
        this.tweens.add({
            targets: btnStart.container,
            alpha: 1,
            duration: 400,
            delay: 150
        });
    }

    getBaseY() {
        let stageIdx = this.gameState.currentStageIdx;
        if (stageIdx === 1) {
            return 450; // Stage 2
        } else if (stageIdx === 0 || stageIdx === 2) {
            return 440; // Stage 1, 3
        }
        return 420; // Stage 4, 5, 6
    }

    triggerLuckyStartAnimation(onComplete) {
        if (this.gameState.currentStageIdx !== 0) {
            // Only play start animation on Stage 1
            if (onComplete) onComplete();
            return;
        }

        this.gameState.isAnimating = true;
        let floorY = this.getBaseY();
        
        // Spawn Lucky at left offscreen
        let lucky = this.add.sprite(-100, floorY, 'luacky_escape_1').setOrigin(0.5, 1).setScale(0.5).setDepth(3);
        lucky.play('luacky_escape_anim');

        // Run across the screen to the right
        this.tweens.add({
            targets: lucky,
            x: 1100,
            duration: 2200,
            ease: 'Linear',
            onComplete: () => {
                lucky.destroy();
                this.gameState.isAnimating = false;
                if (onComplete) onComplete();
            }
        });
    }

    triggerLuckyEndAnimation(onComplete) {
        this.gameState.isAnimating = true;
        let floorY = this.getBaseY();
        let isStage6 = (this.gameState.currentStageIdx === 5);

        // Spawn Lucky at right offscreen
        let lucky = this.add.sprite(1100, floorY, 'lucky_run_1').setOrigin(0.5, 1).setScale(0.5).setDepth(3);
        lucky.setFlipX(false); // Face left (original sprite faces left)
        lucky.play('lucky_run_anim');

        // Step 1: Run to x = 230
        this.tweens.add({
            targets: lucky,
            x: 230,
            duration: 1200,
            ease: 'Power1.easeOut',
            onComplete: () => {
                // Step 2: Play stand animation
                lucky.setFlipX(false); // Face left
                lucky.play('lucky_stand_anim');

                // Small bark bubble
                SoundEffects.playBark();
                let barkBubble = this.add.text(230, floorY - 90, 'โฮ่ง! (Lucky!)', {
                    fontFamily: 'Kanit, sans-serif',
                    fontSize: '20px',
                    fontWeight: 'bold',
                    color: '#ffffff',
                    backgroundColor: '#1e293b',
                    padding: { x: 8, y: 4 },
                    borderRadius: 4
                }).setOrigin(0.5).setDepth(4);
                
                barkBubble.setScale(0);
                this.tweens.add({
                    targets: barkBubble,
                    scale: 1,
                    duration: 200,
                    ease: 'Back.easeOut'
                });

                if (isStage6) {
                    // Stage 6: Stand still forever next to player
                    this.time.delayedCall(2500, () => {
                        this.tweens.add({
                            targets: barkBubble,
                            alpha: 0,
                            scale: 0.5,
                            duration: 200,
                            onComplete: () => barkBubble.destroy()
                        });
                        this.gameState.isAnimating = false;
                        if (onComplete) onComplete();
                    });
                } else {
                    // Stages 1-5: Wait 1.5 seconds, then run away to the right, and player runs after him
                    this.time.delayedCall(1500, () => {
                        this.tweens.add({
                            targets: barkBubble,
                            alpha: 0,
                            scale: 0.5,
                            duration: 200,
                            onComplete: () => barkBubble.destroy()
                        });

                        // Face right and run away
                        lucky.setFlipX(false); // Original sprite in luacky-escape already faces right
                        lucky.play('luacky_escape_anim');

                        // Lucky runs to 1100
                        this.tweens.add({
                            targets: lucky,
                            x: 1100,
                            duration: 1500,
                            ease: 'Power1.easeIn',
                            onComplete: () => {
                                lucky.destroy();
                            }
                        });

                        // Player chases Lucky after the dog runs off first (600ms delay)
                        this.time.delayedCall(600, () => {
                            if (this.gameState.playerIdleTween) this.gameState.playerIdleTween.pause();
                            if (this.gameState.playerSwayTween) this.gameState.playerSwayTween.pause();
                            this.gameState.player.play('player_run_anim');
                            this.tweens.add({
                                targets: this.gameState.player,
                                x: 1100,
                                duration: 1100,
                                ease: 'Power1.easeIn',
                                onComplete: () => {
                                    this.gameState.isAnimating = false;
                                    if (onComplete) onComplete();
                                }
                            });
                        });
                    });
                }
            }
        });
    }

    generateBlankQuiz(quiz) {
        let fullWord = quiz.eng;
        let thaiMeaning = quiz['c' + quiz.ans];

        let alphaIndices = [];
        for (let i = 0; i < fullWord.length; i++) {
            if (/[a-zA-Z]/.test(fullWord[i])) {
                alphaIndices.push(i);
            }
        }

        let blankIdx = alphaIndices[Math.floor(Math.random() * alphaIndices.length)];
        let missingChar = fullWord[blankIdx];
        let missingCharLower = missingChar.toLowerCase();

        let blankedWord = fullWord.substring(0, blankIdx) + '_' + fullWord.substring(blankIdx + 1);

        let alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('').filter(c => c !== missingCharLower);
        for (let i = alphabet.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [alphabet[i], alphabet[j]] = [alphabet[j], alphabet[i]];
        }

        let choices = [
            { text: missingCharLower, isCorrect: true },
            { text: alphabet[0], isCorrect: false },
            { text: alphabet[1], isCorrect: false },
            { text: alphabet[2], isCorrect: false }
        ];

        for (let i = choices.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [choices[i], choices[j]] = [choices[j], choices[i]];
        }

        return {
            fullWord: fullWord,
            blankedWord: blankedWord,
            missingChar: missingCharLower,
            blankIdx: blankIdx,
            thaiMeaning: thaiMeaning,
            choices: choices
        };
    }

    clearStage() {
        this.gameState.isAnimating = true; 
        this.gameState.isFinalRound = false;
        this.gameState.isBossFight = false;
        this.gameState.scoreInStage = 0;

        // Unlock next stage!
        let nextStageIdx = this.gameState.currentStageIdx + 1;
        let currentUnlocked = parseInt(localStorage.getItem('unlockedStageIdx')) || 0;
        if (nextStageIdx > currentUnlocked) {
            localStorage.setItem('unlockedStageIdx', nextStageIdx);
        }

        if (this.gameState.currentStageIdx === 5) {
            // Stage 6 complete -> Trigger Lucky End (stands still) -> Transition to EndCutsceneScene
            this.triggerLuckyEndAnimation(() => {
                this.scene.start('EndCutsceneScene', { score: this.gameState.coins });
            });
        } else {
            // Stage 1-5 complete -> Trigger Lucky End (runs off, Player runs after him) -> Transition directly to next stage
            this.triggerLuckyEndAnimation(() => {
                SoundEffects.playNextStage();
                this.gameState.currentStageIdx++;
                if (this.gameState.currentStageIdx >= this.gameState.vocabData.length) {
                    this.gameState.currentStageIdx = 0;
                }
                this.gameState.quizQueue = [];

                // Fade camera out and transition
                this.cameras.main.fade(800, 0, 0, 0, false, (camera, progress) => {
                    if (progress === 1) {
                        let bgIndex = this.gameState.currentStageIdx % 6;
                        this.gameState.bg.setTexture('lvl_bg' + bgIndex);
                        
                        let stageName = this.gameState.vocabData[this.gameState.currentStageIdx].stageName;
                        this.gameState.stageText.setText(stageName);
                        this.gameState.stageText.setColor('#ffffff');

                        this.gameState.player.x = -100;
                        this.gameState.player.y = this.getBaseY();
                        
                        this.cameras.main.fadeIn(800, 0, 0, 0);

                        this.tweens.add({
                            targets: this.gameState.player,
                            x: 130,
                            duration: 1000,
                            ease: 'Power2.easeOut',
                            onComplete: () => {
                                this.gameState.player.play('player_idle_anim');
                                if (this.gameState.playerIdleTween) this.gameState.playerIdleTween.resume();
                                this.triggerLuckyStartAnimation(() => {
                                    this.gameState.isAnimating = false;
                                    this.nextQuiz();
                                });
                            }
                        });
                    }
                });
            });
        }
    }

    nextQuiz() {
        let currentStageData = this.gameState.vocabData[this.gameState.currentStageIdx];
        
        if (this.gameState.isFinalRound && this.gameState.finalRoundWave === 3 && this.gameState.finalRoundEnemies.length === 0 && !this.gameState.isBossFight) {
            this.gameState.isAnimating = true;
            this.gameState.isBossFight = true;
            this.gameState.bossHp = this.gameState.bossMaxHp;

            let bossWarningText = this.gameState.currentStageIdx === 5 ? 'ระวัง! จอมมารทศกัณฐ์ปรากฏตัว!' : 'ระวัง! มินิบอสปรากฏตัว!';
            let bossWarning = this.add.text(500, 300, bossWarningText, { 
                fontFamily: 'Kanit, sans-serif', fontSize: '60px', fontWeight: 'bold', color: '#ff0000', stroke: '#ffffff', strokeThickness: 8 
            }).setOrigin(0.5).setDepth(20);
            
            // Play boss warning sound
            SoundEffects.playBossWarning();

            // Flash red
            let flash = this.add.graphics().fillStyle(0xff0000, 0.4).fillRect(0,0,1000,600).setDepth(19);
            this.tweens.add({ targets: flash, alpha: 0, duration: 200, yoyo: true, repeat: 3, onComplete: () => flash.destroy() });
            
            this.tweens.add({
                targets: bossWarning, scale: 1.15, alpha: 0, duration: 2500, ease: 'Power2',
                onComplete: () => {
                    bossWarning.destroy();
                    this.gameState.isAnimating = false;
                    this.nextQuiz();
                }
            });
            return;
        }

        // --- CHECK STAGE PROGRESS & FINAL ROUND SPAWN ---
        if (!this.gameState.isFinalRound && this.gameState.scoreInStage >= currentStageData.wordsToPass) {
            this.gameState.isFinalRound = true;
            this.gameState.finalRoundWave = 1;
            this.gameState.finalRoundEnemies = [];

            let finalWarning = this.add.text(500, 300, 'รอบสุดท้าย! เผชิญหน้าฝูงศัตรู!', { 
                fontFamily: 'Kanit, sans-serif', fontSize: '56px', fontWeight: 'bold', color: '#ff9900', stroke: '#ffffff', strokeThickness: 8 
            }).setOrigin(0.5).setDepth(20);
            
            // Flash orange
            let flash = this.add.graphics().fillStyle(0xffaa00, 0.4).fillRect(0,0,1000,600).setDepth(19);
            this.tweens.add({ targets: flash, alpha: 0, duration: 200, yoyo: true, repeat: 3, onComplete: () => flash.destroy() });
            
            this.tweens.add({
                targets: finalWarning, scale: 1.15, alpha: 0, duration: 2500, ease: 'Power2',
                onComplete: () => {
                    finalWarning.destroy();
                    this.spawnFinalRoundWave();
                }
            });
            
            this.gameState.stageText.setText(`FINAL ROUND: Wave 1/3 (ศัตรูเหลือ: 0)`);
            this.gameState.stageText.setColor('#ff9900');
            return;
        }

        // Fill and shuffle queue
        if (!this.gameState.quizQueue || this.gameState.quizQueue.length === 0) {
            let pool = [...this.gameState.vocabData[this.gameState.currentStageIdx].words];
            for (let i = pool.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [pool[i], pool[j]] = [pool[j], pool[i]];
            }
            this.gameState.quizQueue = pool;
        }

        this.gameState.isAnimating = false;
        let quiz = this.gameState.quizQueue.pop();
        this.gameState.currentQuiz = quiz;

        let isFillBlank = Math.random() < 0.5; // 50% chance for Fill-in-the-blank challenge

        if (isFillBlank) {
            let qData = this.generateBlankQuiz(quiz);
            qData.isFillBlank = true;
            this.gameState.currentQuizData = qData;

            // Display Word & Translation on signboard
            this.gameState.wordText.setText(qData.blankedWord + '\n(' + qData.thaiMeaning + ')');
            this.gameState.wordText.setFontSize('36px');
            this.gameState.wordText.setAlign('center');
            this.gameState.wordText.setColor('#1e293b');

            // Apply choices to 4 buttons (show ONLY the single letter, without choice prefix)
            qData.choices.forEach((c, idx) => {
                let btn = this.gameState['btn' + (idx + 1)];
                btn.text.setText(c.text.toUpperCase());
            });

            this.gameState.correctBtn = qData.choices.findIndex(c => c.isCorrect) + 1;
        } else {
            // Original Mode: Display Thai word, choices are full English words
            let correctThaiWord = quiz['c' + quiz.ans];
            this.gameState.wordText.setText(correctThaiWord);
            this.gameState.wordText.setFontSize('52px');
            this.gameState.wordText.setColor('#1e293b');

            let choices = [];
            choices.push({ text: quiz.eng, isCorrect: true });

            let allWords = this.gameState.vocabData[this.gameState.currentStageIdx].words;
            let wrongCandidates = allWords.filter(w => w.eng !== quiz.eng);
            
            for (let i = wrongCandidates.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [wrongCandidates[i], wrongCandidates[j]] = [wrongCandidates[j], wrongCandidates[i]];
            }
            
            choices.push({ text: wrongCandidates[0].eng, isCorrect: false });
            choices.push({ text: wrongCandidates[1].eng, isCorrect: false });
            choices.push({ text: wrongCandidates[2].eng, isCorrect: false });

            // Shuffle choices
            for (let i = choices.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [choices[i], choices[j]] = [choices[j], choices[i]];
            }

            let optionLabels = ['A', 'B', 'C', 'D'];
            choices.forEach((c, idx) => {
                let btn = this.gameState['btn' + (idx + 1)];
                btn.text.setText(optionLabels[idx] + '.  ' + c.text);
            });

            this.gameState.currentQuizData = {
                isFillBlank: false,
                choices: choices,
                fullWord: quiz.eng,
                thaiMeaning: correctThaiWord
            };

            this.gameState.correctBtn = choices.findIndex(c => c.isCorrect) + 1;
        }

        if (this.gameState.isFinalRound) {
            // Update stageText with remaining enemies
            this.gameState.stageText.setText(`FINAL ROUND: Wave ${this.gameState.finalRoundWave}/3 (ศัตรูเหลือ: ${this.gameState.finalRoundEnemies.length})`);
            this.gameState.stageText.setColor('#ff9900');

            // Resume walking tweens for all final round enemies
            if (this.gameState.finalRoundEnemies) {
                this.gameState.finalRoundEnemies.forEach((enemy) => {
                    if (enemy && enemy.moveTween) {
                        enemy.moveTween.resume();
                    }
                });
            }
        } else {
            if (this.gameState.zombie) {
                if (this.gameState.zombieMoveTween) this.gameState.zombieMoveTween.stop();
                if (this.gameState.zombieFloatTween) this.gameState.zombieFloatTween.stop();
                if (this.gameState.zombieTrail) this.gameState.zombieTrail.destroy();
                this.gameState.zombie.destroy();
            }
            
            // Spawn Enemy (Random pick: ghost-girl, ghost-water, skeleton; except boss)
            if (this.gameState.isBossFight) {
                this.gameState.currentEnemyType = 'boss';
            } else {
                let enemyKeys;
                if (this.gameState.currentStageIdx === 1) {
                    enemyKeys = ['brain', 'heart', 'nose'];
                } else if (this.gameState.currentStageIdx === 2) {
                    enemyKeys = ['apple', 'banana', 'coconut', 'orange', 'watermelon'];
                } else if (this.gameState.currentStageIdx === 3) {
                    enemyKeys = ['glass-tube', 'scientist', 'slime'];
                } else if (this.gameState.currentStageIdx === 4) {
                    enemyKeys = ['VGA', 'keyboard', 'mouse', 'ram'];
                } else if (this.gameState.currentStageIdx === 5) {
                    enemyKeys = ['family', 'familytwo', 'ghostgirl'];
                } else {
                    enemyKeys = ['dog', 'duck', 'lion', 'elephant', 'pig'];
                }
                this.gameState.currentEnemyType = enemyKeys[Math.floor(Math.random() * enemyKeys.length)];
            }

            let enemyType = this.gameState.currentEnemyType;
            const config = ENEMY_TYPES_DATA[enemyType];
            let spawnY = (enemyType === 'boss') ? 310 : (this.getBaseY() + (config.yOffset || 0));

            let baseScale = (enemyType === 'boss') ? (config.scale || 1.0) : 0.9;
            this.gameState.zombie = this.add.sprite(950, spawnY, `${enemyType}_walk_1`).setOrigin(0.5, (enemyType === 'boss') ? 0.5 : 1).setDepth(2);
            this.gameState.zombie.setScale(baseScale);
            this.gameState.zombie.setFlipX(false);
            this.gameState.zombie.play(`${enemyType}_walk_anim`);

            // Reset player to idle position at far left
            if (this.gameState.player && !this.gameState.isAnimating) {
                this.gameState.player.x = 130;
                this.gameState.player.y = this.getBaseY();
                this.gameState.player.setScale(0.6);
            }

            // Ghostly particle trail (blue/cyan ethereal glow using dynamic glow texture)
            this.gameState.zombieTrail = this.add.particles(950, spawnY, 'particle_glow', {
                scale: { start: 0.25, end: 0 },
                speedY: { min: -20, max: 20 },
                speedX: { min: 30, max: 100 },
                lifespan: 600,
                alpha: { start: 0.5, end: 0 },
                tint: 0x88ccff, // Icy ghost blue glow
                blendMode: 'ADD',
                frequency: 60
            }).setDepth(1);

            // Floating tween for floating enemies
            if (config.float) {
                this.gameState.zombieFloatTween = this.tweens.add({
                    targets: this.gameState.zombie,
                    y: spawnY - 15,
                    duration: 1000,
                    yoyo: true,
                    repeat: -1,
                    ease: 'Sine.easeInOut'
                });
            } else {
                this.gameState.zombieFloatTween = null;
            }

            // Boss HP Bar visual above head
            if (this.gameState.bossHpGroup) this.gameState.bossHpGroup.destroy(true);
            if (this.gameState.isBossFight) {
                this.gameState.bossHpGroup = this.add.group();
                let bHpBg = this.add.graphics();
                bHpBg.fillStyle(0x000000, 0.8).fillRect(-50, -140, 100, 10);
                let bHpFill = this.add.graphics();
                bHpFill.fillStyle(0xff0000, 1).fillRect(-50, -140, (this.gameState.bossHp / this.gameState.bossMaxHp) * 100, 10);
                
                let hpContainer = this.add.container(this.gameState.zombie.x, this.gameState.zombie.y);
                hpContainer.add([bHpBg, bHpFill]);
                this.gameState.bossHpGroup.add(hpContainer);
                this.gameState.zombie.hpContainer = hpContainer;
            }
            
            // Ghost floats/flies towards player
            let walkDuration = parseInt(localStorage.getItem('zombieDifficulty')) || 10000;
            if (this.gameState.isBossFight) walkDuration *= 1.4;
            
            this.gameState.zombieMoveTween = this.tweens.add({
                targets: this.gameState.zombie,
                x: 210, 
                duration: walkDuration,
                onUpdate: () => {
                    if(this.gameState.zombie) {
                        if (this.gameState.zombie.hpContainer) {
                            this.gameState.zombie.hpContainer.x = this.gameState.zombie.x;
                            this.gameState.zombie.hpContainer.y = this.gameState.zombie.y;
                        }
                        if (this.gameState.zombieTrail) {
                            this.gameState.zombieTrail.setPosition(this.gameState.zombie.x + 30, this.gameState.zombie.y);
                        }
                    }
                },
                onComplete: () => {
                    if (!this.gameState.isAnimating && !this.gameState.isGameOver) {
                        this.gameState.isAnimating = true;

                        this.performEnemyAttack(null, () => {
                            if (this.gameState.isBossFight) {
                                this.gameState.hp--;
                                this.updateHpBar();
                            }
                            this.playerTakeDamage();
                        });
                    }
                }
            });
        }
    }

    cancelAllEnemyAttacks() {
        let enemies = this.gameState.isFinalRound ? (this.gameState.finalRoundEnemies || []) : [this.gameState.zombie];
        enemies.forEach(enemy => {
            if (!enemy) return;
            let enemyType = enemy.enemyType || this.gameState.currentEnemyType || 'ghost-girl';
            
            // Stop attack/lunge/retreat tweens, pause walking tweens
            if (enemy.moveTween) enemy.moveTween.pause();
            if (enemy.lungeTween) enemy.lungeTween.stop();
            if (enemy.retreatTween) enemy.retreatTween.stop();
            if (enemy.floatTween) enemy.floatTween.pause();
            
            // Remove attack animation completion listeners
            enemy.off(`animationcomplete-${enemyType}_attack_anim`);
            
            // Revert back to walking animation
            enemy.play(`${enemyType}_walk_anim`);
        });

        // Also pause normal round zombie move tween
        if (!this.gameState.isFinalRound) {
            if (this.gameState.zombieMoveTween) this.gameState.zombieMoveTween.pause();
        }
    }

    pauseAllEnemyMovement() {
        if (this.gameState.isFinalRound) {
            // Freeze only the targeted foremost enemy
            let foremostEnemy = this.gameState.zombie;
            if (foremostEnemy) {
                if (foremostEnemy.moveTween) foremostEnemy.moveTween.pause();
                if (foremostEnemy.lungeTween) foremostEnemy.lungeTween.stop();
                if (foremostEnemy.retreatTween) foremostEnemy.retreatTween.stop();
            }
        } else {
            if (this.gameState.zombieMoveTween) this.gameState.zombieMoveTween.pause();
            if (this.gameState.zombie && this.gameState.zombie.lungeTween) this.gameState.zombie.lungeTween.stop();
            if (this.gameState.zombie && this.gameState.zombie.retreatTween) this.gameState.zombie.retreatTween.stop();
        }
    }

    spawnFinalRoundWave() {
        // Clear any old enemies
        if (this.gameState.finalRoundEnemies) {
            this.gameState.finalRoundEnemies.forEach(enemy => {
                if (enemy) {
                    if (enemy.moveTween) enemy.moveTween.stop();
                    if (enemy.floatTween) enemy.floatTween.stop();
                    if (enemy.trail) enemy.trail.destroy();
                    enemy.destroy();
                }
            });
        }
        this.gameState.finalRoundEnemies = [];

        let numEnemies = Phaser.Math.Between(2, 4);
        
        let enemyKeys;
        if (this.gameState.currentStageIdx === 1) {
            enemyKeys = ['brain', 'heart', 'nose'];
        } else if (this.gameState.currentStageIdx === 2) {
            enemyKeys = ['apple', 'banana', 'coconut', 'orange', 'watermelon'];
        } else if (this.gameState.currentStageIdx === 3) {
            enemyKeys = ['glass-tube', 'scientist', 'slime'];
        } else if (this.gameState.currentStageIdx === 4) {
            enemyKeys = ['VGA', 'keyboard', 'mouse', 'ram'];
        } else if (this.gameState.currentStageIdx === 5) {
            enemyKeys = ['family', 'familytwo', 'ghostgirl'];
        } else {
            enemyKeys = ['dog', 'duck', 'lion', 'elephant', 'pig'];
        }

        let walkDuration = parseInt(localStorage.getItem('zombieDifficulty')) || 10000;

        for (let i = 0; i < numEnemies; i++) {
            let enemyType = enemyKeys[Math.floor(Math.random() * enemyKeys.length)];
            const config = ENEMY_TYPES_DATA[enemyType];
            let spawnY = this.getBaseY() + (config.yOffset || 0);
            let startX = 950 + i * 110; // Stagger spacing

            let baseScale = 0.9;
            
            let enemySprite = this.add.sprite(startX, spawnY, `${enemyType}_walk_1`).setOrigin(0.5, 1).setDepth(2);
            enemySprite.setScale(baseScale);
            enemySprite.setFlipX(false);
            enemySprite.play(`${enemyType}_walk_anim`);
            enemySprite.enemyType = enemyType;

            // Ghostly particle trail
            enemySprite.trail = this.add.particles(startX, spawnY, 'particle_glow', {
                scale: { start: 0.25, end: 0 },
                speedY: { min: -20, max: 20 },
                speedX: { min: 30, max: 100 },
                lifespan: 600,
                alpha: { start: 0.5, end: 0 },
                tint: 0x88ccff, // Icy ghost blue glow
                blendMode: 'ADD',
                frequency: 60
            }).setDepth(1);

            // Movement tween
            this.startEnemyMovement(enemySprite, walkDuration);

            // Floating tween for floating enemies
            if (config.float) {
                enemySprite.floatTween = this.tweens.add({
                    targets: enemySprite,
                    y: spawnY - 15,
                    duration: 1000,
                    yoyo: true,
                    repeat: -1,
                    ease: 'Sine.easeInOut'
                });
            }

            this.gameState.finalRoundEnemies.push(enemySprite);
        }

        // Set the active zombie to be the foremost enemy
        this.gameState.zombie = this.gameState.finalRoundEnemies[0];

        // Trigger the next question
        this.nextQuiz();
    }

    startEnemyMovement(enemySprite, walkDuration) {
        if (!enemySprite || !enemySprite.active) return;
        
        // Calculate duration relative to distance to maintain constant speed
        // Reference distance is 950 - 210 = 740
        let currentDist = enemySprite.x - 210;
        let adjustedDuration = walkDuration * (currentDist / 740);
        if (adjustedDuration <= 0) adjustedDuration = 100;

        enemySprite.moveTween = this.tweens.add({
            targets: enemySprite,
            x: 210,
            duration: adjustedDuration,
            onUpdate: () => {
                if (enemySprite && enemySprite.active) {
                    if (enemySprite.trail) {
                        enemySprite.trail.setPosition(enemySprite.x + 30, enemySprite.y);
                    }
                }
            },
            onComplete: () => {
                if (!this.gameState.isAnimating && !this.gameState.isGameOver) {
                    this.performEnemyAttack(enemySprite, () => {
                        this.gameState.isAnimating = true; // Block input only when hit lands!
                        this.gameState.hp--;
                        this.updateHpBar();
                        this.playerTakeDamage();
                    });
                }
            }
        });
    }

    restartEnemyMovement(enemySprite) {
        if (!enemySprite || !enemySprite.active) return;
        if (enemySprite.moveTween) {
            enemySprite.moveTween.stop();
        }
        let walkDuration = parseInt(localStorage.getItem('zombieDifficulty')) || 10000;
        this.startEnemyMovement(enemySprite, walkDuration);
    }

    dealAttackDamage() {
        if (this.gameState.isGameOver) return;

        SoundEffects.playSlash();

        // Flash enemy white for damage indication
        this.gameState.zombie.setTintFill(0xffffff);
        setTimeout(() => { if (this.gameState.zombie) this.gameState.zombie.clearTint(); }, 150);

        if (this.gameState.isFinalRound) {
            let currentEnemy = this.gameState.zombie;
            if (currentEnemy) {
                if (currentEnemy.moveTween) currentEnemy.moveTween.stop();
                if (currentEnemy.floatTween) currentEnemy.floatTween.stop();
                if (currentEnemy.trail) {
                    currentEnemy.trail.destroy();
                    currentEnemy.trail = null;
                }

                // Play death fadeout
                this.tweens.add({
                    targets: currentEnemy,
                    alpha: 0,
                    scale: 0,
                    duration: 350,
                    ease: 'Quad.easeOut',
                    onComplete: () => {
                        currentEnemy.destroy();
                    }
                });

                // Remove from finalRoundEnemies array
                this.gameState.finalRoundEnemies = this.gameState.finalRoundEnemies.filter(e => e !== currentEnemy);
                this.gameState.coins += 15;
                this.gameState.scoreText.setText('SCORE: ' + this.gameState.coins);
                SoundEffects.playCoin();
            }

            if (this.gameState.finalRoundEnemies.length > 0) {
                // Set the next foremost enemy as the target
                this.gameState.zombie = this.gameState.finalRoundEnemies[0];
                setTimeout(() => { 
                    this.gameState.isAnimating = false;
                    this.nextQuiz(); 
                }, 500);
            } else {
                // Wave is cleared!
                if (this.gameState.finalRoundWave < 3) {
                    this.gameState.finalRoundWave++;
                    
                    let waveText = this.add.text(500, 300, `รอบที่ ${this.gameState.finalRoundWave - 1} สำเร็จ!`, {
                        fontFamily: 'Kanit, sans-serif', fontWeight: 'bold', fontSize: '60px', color: '#ffcc00', stroke: '#000000', strokeThickness: 8
                    }).setOrigin(0.5).setDepth(20);
                    
                    this.tweens.add({
                        targets: waveText,
                        y: 200,
                        alpha: 0,
                        duration: 1500,
                        onComplete: () => {
                            waveText.destroy();
                            // Spawn next wave
                            this.spawnFinalRoundWave();
                        }
                    });
                } else {
                    // All waves complete, trigger stage pass
                    setTimeout(() => {
                        this.nextQuiz();
                    }, 500);
                }
            }
            return;
        }

        if (this.gameState.isBossFight) {
            this.gameState.bossHp--;
            if (this.gameState.bossHp > 0) {
                // Update boss HP bar
                if (this.gameState.zombie.hpContainer) {
                    this.gameState.zombie.hpContainer.destroy();
                }
                let bHpBg = this.add.graphics();
                bHpBg.fillStyle(0x000000, 0.8).fillRect(-50, -140, 100, 10);
                let bHpFill = this.add.graphics();
                bHpFill.fillStyle(0xff0000, 1).fillRect(-50, -140, (this.gameState.bossHp / this.gameState.bossMaxHp) * 100, 10);
                
                let hpContainer = this.add.container(this.gameState.zombie.x, this.gameState.zombie.y);
                hpContainer.add([bHpBg, bHpFill]);
                this.gameState.bossHpGroup.add(hpContainer);
                this.gameState.zombie.hpContainer = hpContainer;

                // Reload question immediately
                setTimeout(() => { this.nextQuiz(); }, 500);
                return;
            } else if (this.gameState.currentStageIdx < 5) {
                // Stage 1-5 boss HP <= 0 -> Play Hurt anim, Flip, Run Away!
                if (this.gameState.bossHpGroup) this.gameState.bossHpGroup.destroy(true); 

                if (this.gameState.zombieFloatTween) this.gameState.zombieFloatTween.stop();
                if (this.gameState.zombieMoveTween) this.gameState.zombieMoveTween.stop();
                if (this.gameState.zombieTrail) {
                    this.gameState.zombieTrail.destroy();
                    this.gameState.zombieTrail = null;
                }

                this.gameState.isAnimating = true;

                // Play boss hurt animation
                this.gameState.zombie.play('boss_hurt_anim');
                
                // Once hurt animation completes, flip and run away
                this.gameState.zombie.once('animationcomplete-boss_hurt_anim', () => {
                    if (!this.gameState.zombie) return;
                    this.gameState.zombie.setFlipX(true);
                    this.gameState.zombie.play('boss_hurt_run_anim');

                    this.tweens.add({
                        targets: this.gameState.zombie,
                        x: 1100,
                        duration: 1500,
                        ease: 'Power2.easeIn',
                        onComplete: () => {
                            if (this.gameState.zombie) {
                                this.gameState.zombie.destroy();
                                this.gameState.zombie = null;
                            }
                            this.gameState.coins += 50; 
                            this.gameState.scoreText.setText('SCORE: ' + this.gameState.coins);
                            SoundEffects.playCoin();
                            this.clearStage();
                        }
                    });
                });
                return;
            } else if (this.gameState.currentStageIdx === 5) {
                // Stage 6 boss HP <= 0 -> Play Dead anim, Freeze, Mission Complete!
                if (this.gameState.bossHpGroup) this.gameState.bossHpGroup.destroy(true); 

                if (this.gameState.zombieFloatTween) this.gameState.zombieFloatTween.stop();
                if (this.gameState.zombieMoveTween) this.gameState.zombieMoveTween.stop();
                if (this.gameState.zombieTrail) {
                    this.gameState.zombieTrail.destroy();
                    this.gameState.zombieTrail = null;
                }

                this.gameState.isAnimating = true;
                this.gameState.coins += 50;
                this.gameState.scoreText.setText('SCORE: ' + this.gameState.coins);
                SoundEffects.playCoin();

                // Align boss to the ground during death animation
                this.gameState.zombie.setOrigin(0.5, 1);
                this.gameState.zombie.y = this.getBaseY();

                // Play boss dead animation
                this.gameState.zombie.play('boss_dead_anim');
                
                // Once dead animation completes, trigger Lucky end-stage animation and then transition to EndCutsceneScene
                this.gameState.zombie.once('animationcomplete-boss_dead_anim', () => {
                    this.time.delayedCall(500, () => {
                        this.clearStage();
                    });
                });
                return;
            }
        }

        // Defeated - enemy fades out directly without floating up
        if (this.gameState.bossHpGroup) this.gameState.bossHpGroup.destroy(true); 

        if (this.gameState.zombieFloatTween) this.gameState.zombieFloatTween.stop();
        if (this.gameState.zombieTrail) {
            this.gameState.zombieTrail.destroy();
            this.gameState.zombieTrail = null;
        }
        this.tweens.add({
            targets: this.gameState.zombie,
            alpha: 0,
            duration: 350, 
            ease: 'Quad.easeOut',
            onComplete: () => {
                if (this.gameState.isBossFight) {
                    this.gameState.coins += 50; 
                } else {
                    this.gameState.coins += 10;
                    this.gameState.scoreInStage++;
                }
                
                this.gameState.scoreText.setText('SCORE: ' + this.gameState.coins);
                SoundEffects.playCoin();
                this.nextQuiz();
            }
        });
    }

    checkAnswer(choiceNumber) {
        if (this.gameState.isAnimating || this.gameState.isGameOver) return;
        this.gameState.isAnimating = true;

        let qData = this.gameState.currentQuizData;

        if (this.gameState.correctBtn === choiceNumber) {
            SoundEffects.playCorrect();
            // Correct answer - cancel all enemy attacks immediately!
            this.cancelAllEnemyAttacks();

            let triggerAttack = () => {
                let attackStyle = Math.floor(Math.random() * 3);
                if (attackStyle === 0) {
                    this.playTridentTyphoon();
                } else if (attackStyle === 1) {
                    this.playThunderMonkey();
                } else {
                    this.playApeDashCombo();
                }
            };

            if (qData.isFillBlank) {
                let clickedBtn = this.gameState['btn' + choiceNumber];
                let chosenLetter = qData.choices[choiceNumber - 1].text.toUpperCase();

                // Create Flying Text without box frame
                let flyingText = this.add.text(clickedBtn.x, clickedBtn.y, chosenLetter, {
                    fontFamily: 'Kanit, sans-serif',
                    fontWeight: 'bold',
                    fontSize: '48px',
                    color: '#fbbf24',
                    stroke: '#7f1d1d',
                    strokeThickness: 6
                }).setOrigin(0.5).setDepth(30);

                // Fly letter text up into wordSign blank slot position (500, 135)
                this.tweens.add({
                    targets: flyingText,
                    x: 500,
                    y: 135,
                    scaleX: 1.4,
                    scaleY: 1.4,
                    duration: 600,
                    ease: 'Cubic.easeOut',
                    onUpdate: () => {
                        // Sparkles particle trail (using dynamic glow texture)
                        this.add.particles(flyingText.x, flyingText.y, 'particle_glow', {
                            scale: { start: 0.25, end: 0 },
                            speed: { min: 20, max: 80 },
                            lifespan: 300,
                            alpha: { start: 0.8, end: 0 },
                            tint: 0xfbbf24,
                            blendMode: 'ADD',
                            maxParticles: 4
                        }).setDepth(29);
                    },
                    onComplete: () => {
                        // Impact flash & star burst
                        this.cameras.main.shake(120, 0.01);

                        let burst = this.add.graphics().fillStyle(0xffd700, 0.85).fillCircle(500, 135, 40).setDepth(31);
                        this.tweens.add({ targets: burst, alpha: 0, scale: 2, duration: 300, onComplete: () => burst.destroy() });

                        // Reveal completed full word on signboard
                        this.gameState.wordText.setText(qData.fullWord + '\n(' + qData.thaiMeaning + ')');
                        this.gameState.wordText.setAlign('center');
                        this.gameState.wordText.setColor('#b45309');

                        flyingText.destroy();

                        // Player attacks after letter fills slot
                        this.time.delayedCall(200, () => {
                            triggerAttack();
                        });
                    }
                });
            } else {
                // Original full word mode: trigger attack directly
                triggerAttack();
            }
        } else {
            // Wrong answer
            SoundEffects.playIncorrect();
            if (this.gameState.isFinalRound) {
                // Only pause the foremost enemy that will lunge and attack
                let foremostEnemy = this.gameState.zombie;
                if (foremostEnemy && foremostEnemy.moveTween) {
                    foremostEnemy.moveTween.pause();
                }
            } else {
                if (this.gameState.zombieMoveTween) this.gameState.zombieMoveTween.stop();
            }

            this.performEnemyAttack(this.gameState.zombie, () => {
                this.playerTakeDamage();
            });
        }
    }

    performEnemyAttack(enemy, onAttackHit) {
        if (!enemy) enemy = this.gameState.zombie;
        if (!enemy || this.gameState.isGameOver) return;
        SoundEffects.playEnemyAttack();

        let enemyType = enemy.enemyType || this.gameState.currentEnemyType || 'ghost-girl';

        const config = ENEMY_TYPES_DATA[enemyType];
        if (!config) return;

        if (enemy.floatTween) enemy.floatTween.pause();
        else if (this.gameState.zombieFloatTween && enemy === this.gameState.zombie) this.gameState.zombieFloatTween.pause();

        if (enemyType === 'boss') {
            // Boss: show random attack frame (static) then lunge
            let randAttackIdx = Math.floor(Math.random() * config.attackCount) + 1;
            enemy.anims.stop();
            enemy.setTexture(`${enemyType}_attack_${randAttackIdx}`);
            this._doEnemyLunge(enemy, enemyType, onAttackHit);
        } else {
            // Normal enemy: play full attack animation then lunge
            enemy.play(`${enemyType}_attack_anim`);
            enemy.once(`animationcomplete-${enemyType}_attack_anim`, () => {
                if (!enemy || this.gameState.isGameOver) return;
                this._doEnemyLunge(enemy, enemyType, onAttackHit);
            });
        }
    }

    _doEnemyLunge(enemy, enemyType, onAttackHit) {
        if (!enemy) enemy = this.gameState.zombie;
        if (!enemy || this.gameState.isGameOver) return;

        // Fail red flash screen
        let failFlash = this.add.graphics().fillStyle(0xcc0000, 0.5).fillRect(0, 0, 1000, 600).setDepth(20);
        this.tweens.add({ targets: failFlash, alpha: 0, duration: 300, onComplete: () => failFlash.destroy() });

        let targetY = (enemyType === 'boss') ? 330 : (this.getBaseY() + (ENEMY_TYPES_DATA[enemyType]?.yOffset || 0));
        let retreatY = (enemyType === 'boss') ? 310 : (this.getBaseY() + (ENEMY_TYPES_DATA[enemyType]?.yOffset || 0));

        // Lunge forward to hit player
        let startX = enemy.x;
        enemy.lungeTween = this.tweens.add({
            targets: enemy,
            x: this.gameState.player.x + 50,
            y: targetY,
            angle: -15,
            duration: 180,
            ease: 'Cubic.easeOut',
            onComplete: () => {
                if (enemy) enemy.setAngle(0);

                if (onAttackHit) onAttackHit();

                // Retreat back after hitting player
                if (enemy && !this.gameState.isGameOver) {
                    enemy.retreatTween = this.tweens.add({
                        targets: enemy,
                        x: Math.max(startX, 280),
                        y: retreatY,
                        duration: 250,
                        ease: 'Quad.easeIn',
                        onComplete: () => {
                            if (enemy && !this.gameState.isGameOver) {
                                enemy.play(`${enemyType}_walk_anim`);
                                if (enemy.floatTween) enemy.floatTween.resume();
                                else if (this.gameState.zombieFloatTween && enemy === this.gameState.zombie) this.gameState.zombieFloatTween.resume();

                                // Restart movement tween if in final round and was stopped
                                if (this.gameState.isFinalRound && enemy.moveTween) {
                                    this.restartEnemyMovement(enemy);
                                }
                            }
                        }
                    });
                }
            }
        });
    }

    playTridentTyphoon() {
        if (this.gameState.playerIdleTween) this.gameState.playerIdleTween.pause();
        if (this.gameState.playerSwayTween) this.gameState.playerSwayTween.pause();

        // 1. Charge animation first (adjusted to 0.9)
        this.gameState.player.setScale(0.9);
        this.gameState.player.play('player_charge_anim');
        this.gameState.player.once('animationcomplete-player_charge_anim', () => {
            let randAttackIdx = Math.floor(Math.random() * 9) + 1;

            // 2. Dash forward with dash animation
            this.gameState.player.play('player_dash_anim');
            this.tweens.add({
                targets: this.gameState.player,
                x: (130 + this.gameState.zombie.x) / 2,
                y: 320,
                duration: 250,
                ease: 'Quad.easeOut',
                onComplete: () => {
                    // 3. Slam Down Strike with random attack frame
                    this.gameState.player.anims.stop();
                    this.gameState.player.setTexture('player_attack_' + randAttackIdx);

                    this.pauseAllEnemyMovement();
                    this.tweens.add({
                        targets: this.gameState.player,
                        x: this.gameState.zombie.x - 45,
                        y: this.getBaseY(),
                        duration: 180,
                        ease: 'Quad.easeIn',
                        onComplete: () => {
                            // Impact
                            this.cameras.main.shake(250, 0.03);
                            let flash = this.add.graphics().fillStyle(0xffffff, 0.6).fillRect(0,0,1000,600).setDepth(20);
                            this.tweens.add({ targets: flash, alpha: 0, duration: 180, onComplete: () => flash.destroy() });

                            // Shockwave rings
                            let ring = this.add.circle(this.gameState.zombie.x - 45, this.getBaseY(), 20).setStrokeStyle(4, 0xffffff, 0.8).setDepth(1);
                            this.tweens.add({ targets: ring, radius: 100, alpha: 0, duration: 300, onComplete: () => ring.destroy() });

                            // Contact explosion
                            let exp = this.add.sprite(this.gameState.zombie.x, this.gameState.zombie.y - 60, 'ef3_exp1').setScale(3.5).setDepth(5);
                            exp.play('ef3_exp_anim');
                            exp.once('animationcomplete', () => exp.destroy());

                            this.dealAttackDamage();

                            // 4. Return with run animation (scale back to idle size 0.6)
                            this.gameState.player.play('player_run_anim');
                            this.tweens.add({
                                targets: this.gameState.player,
                                x: 130,
                                y: this.getBaseY(),
                                scaleX: 0.6,
                                scaleY: 0.6,
                                duration: 300,
                                ease: 'Power2.easeOut',
                                onComplete: () => {
                                    this.gameState.player.setScale(0.6);
                                    this.gameState.player.play('player_idle_anim');
                                    if (this.gameState.playerIdleTween) this.gameState.playerIdleTween.resume();
                                    if (this.gameState.playerSwayTween) this.gameState.playerSwayTween.resume();
                                }
                            });
                        }
                    });
                }
            });
        });
    }

    playThunderMonkey() {
        if (this.gameState.playerIdleTween) this.gameState.playerIdleTween.pause();
        if (this.gameState.playerSwayTween) this.gameState.playerSwayTween.pause();

        // 1. Charge animation (adjusted to 0.9)
        this.gameState.player.setScale(0.9);
        this.gameState.player.play('player_charge_anim');
        this.gameState.player.once('animationcomplete-player_charge_anim', () => {
            let randAttackIdx = Math.floor(Math.random() * 9) + 1;

            // 2. Dash next to enemy
            this.gameState.player.play('player_dash_anim');
            this.pauseAllEnemyMovement();
            this.tweens.add({
                targets: this.gameState.player,
                x: this.gameState.zombie.x - 45,
                y: this.getBaseY(),
                duration: 250,
                ease: 'Quad.easeOut',
                onComplete: () => {
                    // Set random attack frame
                    this.gameState.player.anims.stop();
                    this.gameState.player.setTexture('player_attack_' + randAttackIdx);

                    // Lightning strike and screen flash
                    this.cameras.main.shake(200, 0.02);
                    let lightningFlash = this.add.graphics().fillStyle(0x00ffff, 0.5).fillRect(0,0,1000,600).setDepth(20);
                    this.tweens.add({ targets: lightningFlash, alpha: 0, duration: 300, onComplete: () => lightningFlash.destroy() });

                    let bolt = this.add.sprite(this.gameState.zombie.x, this.gameState.zombie.y - 120, 'lt_b1').setOrigin(0.5).setDepth(20).setScale(3.5);
                    bolt.play('ef_lightning');
                    bolt.once('animationcomplete', () => {
                        bolt.destroy();
                        
                        let exp = this.add.sprite(this.gameState.zombie.x, this.gameState.zombie.y - 60, 'ef3_exp1').setScale(3.5).setDepth(5);
                        exp.play('ef3_exp_anim');
                        exp.once('animationcomplete', () => exp.destroy());

                        this.dealAttackDamage();

                        // Return with run animation (scale back to idle size 0.6)
                        this.gameState.player.play('player_run_anim');
                        this.tweens.add({
                            targets: this.gameState.player,
                            x: 130,
                            y: this.getBaseY(),
                            scaleX: 0.6,
                            scaleY: 0.6,
                            duration: 250,
                            onComplete: () => {
                                this.gameState.player.setScale(0.6);
                                this.gameState.player.play('player_idle_anim');
                                if (this.gameState.playerIdleTween) this.gameState.playerIdleTween.resume();
                                if (this.gameState.playerSwayTween) this.gameState.playerSwayTween.resume();
                            }
                        });
                    });
                }
            });
        });
    }

    playApeDashCombo() {
        if (this.gameState.playerIdleTween) this.gameState.playerIdleTween.pause();
        if (this.gameState.playerSwayTween) this.gameState.playerSwayTween.pause();

        // 1. Charge animation (adjusted to 0.9)
        this.gameState.player.setScale(0.9);
        this.gameState.player.play('player_charge_anim');
        this.gameState.player.once('animationcomplete-player_charge_anim', () => {
            let zombieX = this.gameState.zombie.x;

            // 1. Dash strike 1
            this.gameState.player.play('player_dash_anim');
            this.pauseAllEnemyMovement();
            this.tweens.add({
                targets: this.gameState.player,
                x: zombieX - 70,
                duration: 150,
                ease: 'Quad.easeOut',
                onComplete: () => {
                    this.gameState.player.anims.stop();
                    this.gameState.player.setTexture('player_attack_' + (Math.floor(Math.random() * 9) + 1));
                    this.cameras.main.shake(100, 0.01);
                    let exp1 = this.add.sprite(zombieX, this.gameState.zombie.y - 60, 'ef3_exp1').setScale(2).setDepth(5);
                    exp1.play('ef3_exp_anim');
                    exp1.once('animationcomplete', () => exp1.destroy());

                    // 2. Dash strike 2
                    this.gameState.player.play('player_dash_anim');
                    this.tweens.add({
                        targets: this.gameState.player,
                        x: zombieX - 45,
                        duration: 150,
                        ease: 'Quad.easeOut',
                        onComplete: () => {
                            this.gameState.player.anims.stop();
                            this.gameState.player.setTexture('player_attack_' + (Math.floor(Math.random() * 9) + 1));
                            this.cameras.main.shake(150, 0.015);
                            let exp2 = this.add.sprite(zombieX, this.gameState.zombie.y - 60, 'ef3_exp1').setScale(3).setDepth(5);
                            exp2.play('ef3_exp_anim');
                            exp2.once('animationcomplete', () => exp2.destroy());

                            this.dealAttackDamage();

                            // 3. Return with run animation (scale back to idle size 0.6)
                            this.gameState.player.play('player_run_anim');
                            this.tweens.add({
                                targets: this.gameState.player,
                                x: 130,
                                y: this.getBaseY(),
                                scaleX: 0.6,
                                scaleY: 0.6,
                                duration: 250,
                                onComplete: () => {
                                    this.gameState.player.setScale(0.6);
                                    this.gameState.player.play('player_idle_anim');
                                    if (this.gameState.playerIdleTween) this.gameState.playerIdleTween.resume();
                                    if (this.gameState.playerSwayTween) this.gameState.playerSwayTween.resume();
                                }
                            });
                        }
                    });
                }
            });
        });
    }

    gameOver() {
        this.gameState.isGameOver = true;
        this.gameState.player.setDepth(11);
        if (this.gameState.zombie) {
            this.gameState.zombie.setDepth(11);
        }

        let stageStr = this.gameState.vocabData[this.gameState.currentStageIdx].stageName;

        setTimeout(() => {
            this.scene.start('GameOverScene', { 
                score: this.gameState.coins, 
                stageName: stageStr 
            });
        }, 800);
    }

    showMissionComplete() {
        this.gameState.isGameOver = true;
        
        if (this.gameState.zombie && this.gameState.zombie.hpContainer) {
            this.gameState.zombie.hpContainer.destroy();
        }

        // 1. Semi-transparent black overlay
        let overlay = this.add.graphics();
        overlay.fillStyle(0x000000, 0.7);
        overlay.fillRect(0, 0, 1000, 600);
        overlay.setDepth(20);
        
        overlay.alpha = 0;
        this.tweens.add({
            targets: overlay,
            alpha: 1,
            duration: 800
        });

        // 2. Grand Thai Signboard Panel Frame
        let winFrame = this.add.graphics();
        winFrame.setDepth(21);
        drawThaiFrame(winFrame, 180, 80, 640, 440, 18);
        
        winFrame.alpha = 0;
        this.tweens.add({
            targets: winFrame,
            alpha: 1,
            duration: 800
        });

        // 3. Title Text: MISSION COMPLETE
        let titleText = this.add.text(500, 160, 'MISSION COMPLETE', {
            fontFamily: 'Mitr, Kanit, sans-serif',
            fontSize: '56px',
            fontWeight: 'bold',
            color: '#fbbf24', // premium gold color
            stroke: '#1e3e6b',
            strokeThickness: 6
        }).setOrigin(0.5).setDepth(22).setShadow(2, 4, 'rgba(0,0,0,0.3)', 2, false, true);

        // Subtitle text: ยินดีด้วย! คุณผ่านด่านสำเร็จ
        let subTextStr = (this.gameState.currentStageIdx === 5)
            ? 'ยินดีด้วย! ท่านปราบจอมมารและผ่านด่านทั้งหมดสำเร็จ'
            : `ยินดีด้วย! ท่านผ่านด่านที่ ${this.gameState.currentStageIdx + 1} สำเร็จ`;

        let subText = this.add.text(500, 250, subTextStr, {
            fontFamily: 'Kanit, sans-serif',
            fontSize: '22px',
            fontWeight: 'bold',
            color: '#1e293b'
        }).setOrigin(0.5).setDepth(22);

        // Stats: Coins / Score
        let scoreText = this.add.text(500, 320, 'คะแนนสะสมสุดท้าย: ' + this.gameState.coins, {
            fontFamily: 'Kanit, sans-serif',
            fontSize: '32px',
            fontWeight: 'bold',
            color: '#b45309'
        }).setOrigin(0.5).setDepth(22);

        titleText.alpha = 0;
        subText.alpha = 0;
        scoreText.alpha = 0;

        this.tweens.add({
            targets: [titleText, subText, scoreText],
            alpha: 1,
            duration: 800,
            delay: 300
        });

        // 4. Buttons: Next Stage / Play Again / Back to Menu
        let playAgainBtnObj;
        if (this.gameState.currentStageIdx === 5) {
            playAgainBtnObj = createChoiceButton(this, 360, 430, 'เล่นอีกครั้ง', () => {
                this.scene.start('GamePlay', { startStageIdx: 0, charId: this.gameState.charId });
            }, 220, 60, '26px');
        } else {
            playAgainBtnObj = createChoiceButton(this, 360, 430, 'ด่านถัดไป', () => {
                SoundEffects.playNextStage();
                this.gameState.isGameOver = false;
                this.gameState.isAnimating = false;
                
                // Increment currentStageIdx
                this.gameState.currentStageIdx++;
                if (this.gameState.currentStageIdx >= this.gameState.vocabData.length) {
                    this.gameState.currentStageIdx = 0;
                }
                this.gameState.quizQueue = [];

                // Reset player position and change stage
                this.cameras.main.fade(800, 0, 0, 0, false, (camera, progress) => {
                    if (progress === 1) {
                        let bgIndex = this.gameState.currentStageIdx % 6;
                        this.gameState.bg.setTexture('lvl_bg' + bgIndex);
                        
                        let stageName = this.gameState.vocabData[this.gameState.currentStageIdx].stageName;
                        this.gameState.stageText.setText(stageName);
                        this.gameState.stageText.setColor('#ffffff');

                        this.gameState.player.x = -100;
                        this.gameState.player.y = this.getBaseY();
                        
                        // Fade camera back in
                        this.cameras.main.fadeIn(800, 0, 0, 0);

                        this.tweens.add({
                            targets: this.gameState.player,
                            x: 130,
                            duration: 1000,
                            ease: 'Power2.easeOut',
                            onComplete: () => {
                                this.gameState.player.play('player_idle_anim');
                                if (this.gameState.playerIdleTween) this.gameState.playerIdleTween.resume();
                                this.triggerLuckyStartAnimation(() => {
                                    this.gameState.isAnimating = false;
                                    this.nextQuiz();
                                });
                            }
                        });
                    }
                });
            }, 220, 60, '26px');
        }
        playAgainBtnObj.container.setDepth(22);
        playAgainBtnObj.container.alpha = 0;

        let mainMenuBtnObj = createChoiceButton(this, 640, 430, 'เมนูหลัก', () => {
            this.scene.start('MainMenu');
        }, 220, 60, '26px');
        mainMenuBtnObj.container.setDepth(22);
        mainMenuBtnObj.container.alpha = 0;

        this.tweens.add({
            targets: [playAgainBtnObj.container, mainMenuBtnObj.container],
            alpha: 1,
            duration: 800,
            delay: 500
        });
    }
}

class PauseMenu extends Phaser.Scene {
    constructor() {
        super({ key: 'PauseMenu' });
    }

    create() {
        // Pause Background
        let bg = this.add.image(500, 300, 'lvl_menu_bg').setDisplaySize(1000, 600);
        
        // Dim background overlay
        let overlay = this.add.graphics();
        overlay.fillStyle(0x000000, 0.6);
        overlay.fillRect(0, 0, 1000, 600);

        // Center Panel Frame
        let panelFrame = this.add.graphics();
        drawThaiFrame(panelFrame, 180, 80, 640, 440, 18);

        this.add.text(500, 150, 'หยุดเกมชั่วคราว', {
            fontFamily: 'Mitr, Kanit, sans-serif',
            fontSize: '48px',
            fontWeight: 'bold',
            color: '#7f1d1d',
        }).setOrigin(0.5);

        // Resume Button
        createChoiceButton(this, 500, 240, 'เล่นต่อ', () => {
            this.scene.stop();
            this.scene.resume('GamePlay');
        }, 260, 60, '26px');

        // Restart Button
        createChoiceButton(this, 360, 360, 'เริ่มใหม่', () => {
            this.scene.stop();
            this.scene.get('GamePlay').scene.restart();
        }, 230, 60, '26px');

        // Main Menu Button
        createChoiceButton(this, 640, 360, 'เมนูหลัก', () => {
            this.scene.stop();
            this.scene.stop('GamePlay');
            this.scene.start('MainMenu');
        }, 230, 60, '26px');
    }
}

function createChoiceButton(scene, x, y, textStr, onClick, w = 340, h = 66, fSize = '28px') {
    let container = scene.add.container(x, y);
    container.setDepth(10); // Bring buttons to the front (above characters which are depth 2)

    let cx = -(w/2);
    let cy = -(h/2);

    // 1. Sleek soft drop shadow
    let shadow = scene.add.graphics();
    shadow.fillStyle(0x000000, 0.15);
    shadow.fillRoundedRect(cx + 2, cy + 4, w, h, 12);

    // 2. Thin gold/amber border outline
    let border = scene.add.graphics();
    border.fillStyle(0xd97706, 1);
    border.fillRoundedRect(cx, cy, w, h, 12);

    // 3. Flat premium button body (deep dark slate blue)
    let body = scene.add.graphics();
    body.fillStyle(0x1e293b, 1);
    body.fillRoundedRect(cx + 2, cy + 2, w - 4, h - 4, 10);

    let btnText = scene.add.text(0, 0, textStr, {
        fontSize: fSize,
        fontFamily: 'Kanit, sans-serif',
        fontWeight: 'bold',
        color: '#ffffff', // Clean white text
    }).setOrigin(0.5);

    container.add([shadow, border, body, btnText]);

    let hitZone = scene.add.zone(0, 0, w, h).setInteractive({ useHandCursor: true });
    
    // Modern hover animations
    hitZone.on('pointerover', () => {
        body.clear();
        body.fillStyle(0x334155, 1); // Lighter slate on hover
        body.fillRoundedRect(cx + 2, cy + 2, w - 4, h - 4, 10);
        btnText.setColor('#fbbf24'); // Gold text on hover
        scene.tweens.add({
            targets: container,
            scaleX: 1.04,
            scaleY: 1.04,
            duration: 100,
            ease: 'Quad.easeOut'
        });
    });
    
    hitZone.on('pointerout', () => {
        body.clear();
        body.fillStyle(0x1e293b, 1);
        body.fillRoundedRect(cx + 2, cy + 2, w - 4, h - 4, 10);
        btnText.setColor('#ffffff');
        scene.tweens.add({
            targets: container,
            scaleX: 1.0,
            scaleY: 1.0,
            duration: 100,
            ease: 'Quad.easeOut'
        });
    });

    let triggerPress = () => {
        // Press feedback
        body.clear();
        body.fillStyle(0x0f172a, 1); // Darkest slate
        body.fillRoundedRect(cx + 2, cy + 2, w - 4, h - 4, 10);
        container.y += 2;
        setTimeout(() => { 
            body.clear();
            body.fillStyle(0x1e293b, 1);
            body.fillRoundedRect(cx + 2, cy + 2, w - 4, h - 4, 10);
            container.y -= 2; 
        }, 80);
        SoundEffects.playClick();
        onClick();
    };

    hitZone.on('pointerdown', () => {
        triggerPress();
    });
    
    container.add(hitZone);

    return { container, text: btnText, press: triggerPress };
}

class SettingsMenu extends Phaser.Scene {
    constructor() {
        super({ key: 'SettingsMenu' });
    }

    create() {
        // Pause Background
        let bg = this.add.image(500, 300, 'lvl_menu_bg').setDisplaySize(1000, 600);
        let overlay = this.add.graphics();
        overlay.fillStyle(0x000000, 0.6);
        overlay.fillRect(0, 0, 1000, 600);

        // Center Panel Frame
        let panelFrame = this.add.graphics();
        drawThaiFrame(panelFrame, 200, 40, 600, 520, 16);

        this.add.text(500, 90, 'ตั้งค่าความยาก', {
            fontFamily: 'Mitr, Kanit, sans-serif',
            fontSize: '50px',
            fontWeight: 'bold',
            color: '#7f1d1d',
        }).setOrigin(0.5);

        // Difficulty Setting
        let difficulty = parseInt(localStorage.getItem('zombieDifficulty')) || 10000;
        let diffLabel = this.add.text(500, 215, 'ความเร็วซอมบี้: ' + (difficulty === 10000 ? 'ช้า (10วิ)' : (difficulty === 6000 ? 'ปานกลาง (6วิ)' : 'เร็วทะลุนรก (3วิ)')), {
            fontFamily: 'Kanit, sans-serif',
            fontSize: '28px',
            fontWeight: 'bold',
            color: '#1e293b',
        }).setOrigin(0.5);

        createChoiceButton(this, 500, 300, 'เปลี่ยนระดับ', () => {
            if(difficulty === 10000) difficulty = 6000;
            else if(difficulty === 6000) difficulty = 3000;
            else difficulty = 10000;
            localStorage.setItem('zombieDifficulty', difficulty);
            diffLabel.setText('ความเร็วซอมบี้: ' + (difficulty === 10000 ? 'ช้า (10วิ)' : (difficulty === 6000 ? 'ปานกลาง (6วิ)' : 'เร็วทะลุนรก (3วิ)')));
        });

        // Reset Score Button
        createChoiceButton(this, 500, 400, 'รีเซ็ตคะแนน', () => {
            localStorage.setItem('zombieHighScore', 0);
            let prevText = diffLabel.text;
            diffLabel.setText('ล้างข้อมูลเรียบร้อย!');
            diffLabel.setColor('#16a34a');
            setTimeout(() => {
                diffLabel.setText(prevText);
                diffLabel.setColor('#1e293b');
            }, 1000);
        });

        // Back Button
        createChoiceButton(this, 500, 500, 'ย้อนกลับ', () => {
            this.scene.start('MainMenu');
        });
    }
}

class GameOverScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameOverScene' });
    }

    init(data) {
        this.finalScore = data.score || 0;
        this.stageName = data.stageName || '';
    }

    create() {
        // Dramatic background using temple menu background
        let bg = this.add.image(500, 300, 'lvl_menu_bg').setDisplaySize(1000, 600);
        
        let overlay = this.add.graphics();
        overlay.fillStyle(0x0f172a, 0.7); // Friendly slate blue overlay
        overlay.fillRect(0, 0, 1000, 600);

        SoundEffects.playGameOver();

        // Grand Thai Signboard Frame for Stats (Wider 800px to fit long stage names)
        let statsFrame = this.add.graphics();
        drawThaiFrame(statsFrame, 100, 160, 800, 240, 18);

        // Title: พ่ายแพ้ศึก (DEFEATED / GAME OVER)
        let titleText = this.add.text(500, 95, 'พ่ายแพ้ศึก', {
            fontFamily: 'Mitr, Kanit, sans-serif',
            fontSize: '76px',
            fontWeight: 'bold',
            color: '#ef4444' // clean red
        }).setOrigin(0.5).setShadow(2, 4, 'rgba(0,0,0,0.2)', 2);

        this.add.text(500, 215, 'จบเกมที่ด่าน: ' + this.stageName, {
            fontFamily: 'Kanit, sans-serif',
            fontSize: '22px',
            fontWeight: 'bold',
            color: '#1e293b', // Deep slate on cream frame
        }).setOrigin(0.5);

        this.add.text(500, 275, 'คะแนนสะสม: ' + this.finalScore, {
            fontFamily: 'Kanit, sans-serif',
            fontSize: '30px',
            fontWeight: 'bold',
            color: '#b45309', // Sleek warm amber
        }).setOrigin(0.5);

        let highScore = parseInt(localStorage.getItem('zombieHighScore')) || 0;
        if (this.finalScore > highScore) {
            highScore = this.finalScore;
            localStorage.setItem('zombieHighScore', highScore);
            this.add.text(500, 335, '★ สถิติใหม่ยุทธภพ! ★', {
                fontFamily: 'Kanit, sans-serif',
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#16a34a', // Emerald green
            }).setOrigin(0.5);
        }

        // 'สู้ต่อหรือไม่?' Prompt
        this.add.text(500, 445, 'ต้องการสู้ต่ออีกครั้งหรือไม่?', { 
            fontFamily: 'Kanit, sans-serif', fontSize: '28px', fontWeight: 'bold', color: '#ffffff'
        }).setOrigin(0.5).setShadow(2, 3, 'rgba(0,0,0,0.5)', 2);

        // YES / NO modern choice buttons
        createChoiceButton(this, 370, 520, 'สู้ต่อ (YES)', () => this.scene.start('GamePlay'), 220, 60, '26px');
        createChoiceButton(this, 630, 520, 'ยอมแพ้ (NO)', () => this.scene.start('MainMenu'), 220, 60, '26px');
    }
}

// Game Configuration
const config = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.FIT,
        parent: 'gameContainer',
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 1000,
        height: 600
    },
    fps: {
        target: 60,
        forceSetTimeOut: true
    },
    backgroundColor: '#000000',
    scene: [IntroScene, MainMenu, CutsceneScene, CategoryMenu, EndCutsceneScene, GamePlay, PauseMenu, SettingsMenu, GameOverScene]
};

const game = new Phaser.Game(config);

