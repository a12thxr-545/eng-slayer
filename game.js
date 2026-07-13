function drawThaiFrame(graphics, x, y, w, h, radius = 12) {
    graphics.fillStyle(0x2b0d06, 0.95);
    graphics.fillRoundedRect(x, y, w, h, radius);
    
    graphics.lineStyle(4, 0xd4af37, 1);
    graphics.strokeRoundedRect(x, y, w, h, radius);

    graphics.lineStyle(1.5, 0xffd700, 0.75);
    graphics.strokeRoundedRect(x + 4, y + 4, w - 8, h - 8, radius - 2);

    graphics.fillStyle(0xffd700, 1);
    graphics.fillCircle(x + 8, y + 8, 4);
    graphics.fillCircle(x + w - 8, y + 8, 4);
    graphics.fillCircle(x + 8, y + h - 8, 4);
    graphics.fillCircle(x + w - 8, y + h - 8, 4);
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

        this.load.image('lvl_menu_bg', 'assets/thai/background1.png');
    }

    create() {
        let bg = this.add.image(500, 300, 'lvl_menu_bg').setDisplaySize(1000, 600);
        
        let overlay = this.add.graphics();
        overlay.fillStyle(0x000000, 0.4);
        overlay.fillRect(0, 0, 1000, 600);

        // Grand Thai Signboard Frame for Title & Subtitle
        let signboard = this.add.graphics();
        drawThaiFrame(signboard, 180, 50, 640, 250, 18);

        // Bouncing/Breathing Title
        let titleBlock = this.add.container(500, 150);
        
        let titleText = this.add.text(0, 0, 'อักษรพิฆาต', {
            fontFamily: 'Mitr, Kanit, sans-serif',
            fontSize: '85px',
            fontWeight: 'bold',
            color: '#ffd700', // Gold
            stroke: '#4a1212', // Deep red stroke
            strokeThickness: 12
        }).setOrigin(0.5).setShadow(6, 8, '#000000', 0, false, true);

        titleBlock.add(titleText);

        this.tweens.add({
            targets: titleBlock,
            y: 135, 
            duration: 1800,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        this.add.text(500, 245, 'ศึกรามเกียรติ์คำศัพท์ภาษาอังกฤษ', {
            fontFamily: 'Kanit, sans-serif',
            fontSize: '32px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 6
        }).setOrigin(0.5).setShadow(4, 6, '#000000', 0, false, true);

        // Start Button 
        let btnStart = createChoiceButton(this, 500, 390, 'เข้าสู่ยุทธภพ (เริ่มเล่น)', () => {
            this.scene.start('CategoryMenu', { charId: 'thai' }); 
        });

        // Settings Button
        let btnSettings = createChoiceButton(this, 500, 500, 'ตั้งค่าความยาก', () => {
            this.scene.start('SettingsMenu');
        });
    }
}

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
                    stageName: "ด่าน 2: ผลไม้ (Fruits)",
                    wordsToPass: 10,
                    words: [
                        { eng: 'Apple', c1: 'แอปเปิล', c2: 'ส้ม', ans: 1 },
                        { eng: 'Banana', c1: 'แตงโม', c2: 'กล้วย', ans: 2 },
                        { eng: 'Orange', c1: 'ส้ม', c2: 'มะละกอ', ans: 1 },
                        { eng: 'Grape', c1: 'ข้าว', c2: 'องุ่น', ans: 2 },
                        { eng: 'Melon', c1: 'เมลอน', c2: 'มะม่วง', ans: 1 },
                        { eng: 'Watermelon', c1: 'แตงโม', c2: 'มะพร้าว', ans: 1 },
                        { eng: 'Papaya', c1: 'มังคุด', c2: 'มะละกอ', ans: 2 },
                        { eng: 'Mango', c1: 'มะม่วง', c2: 'ส้มโอ', ans: 1 },
                        { eng: 'Coconut', c1: 'มะละกอ', c2: 'มะพร้าว', ans: 2 },
                        { eng: 'Pineapple', c1: 'สับปะรด', c2: 'เชอร์รี', ans: 1 },
                        { eng: 'Strawberry', c1: 'กล้วย', c2: 'สตรอว์เบอร์รี', ans: 2 },
                        { eng: 'Cherry', c1: 'เชอร์รี', c2: 'แอปเปิล', ans: 1 },
                        { eng: 'Peach', c1: 'ลิ้นจี่', c2: 'พีช', ans: 2 },
                        { eng: 'Pear', c1: 'สาลี่', c2: 'ฝรั่ง', ans: 1 },
                        { eng: 'Kiwi', c1: 'กีวี', c2: 'องุ่น', ans: 1 },
                        { eng: 'Lemon', c1: 'ส้ม', c2: 'มะนาว', ans: 2 },
                        { eng: 'Pomelo', c1: 'ส้มโอ', c2: 'มะพร้าว', ans: 1 },
                        { eng: 'Guava', c1: 'ฝรั่ง', c2: 'แตงโม', ans: 1 },
                        { eng: 'Lychee', c1: 'เชอร์รี', c2: 'ลิ้นจี่', ans: 2 },
                        { eng: 'Mangosteen', c1: 'มังคุด', c2: 'ส้ม', ans: 1 }
                    ]
                },
                {
                    stageName: "ด่าน 3: กริยา (Verbs)",
                    wordsToPass: 15,
                    words: [
                        { eng: 'Run', c1: 'เดิน', c2: 'วิ่ง', ans: 2 },
                        { eng: 'Eat', c1: 'กิน', c2: 'ดื่ม', ans: 1 },
                        { eng: 'Drink', c1: 'นอน', c2: 'ดื่ม', ans: 2 },
                        { eng: 'Sleep', c1: 'นอนหลับ', c2: 'ตื่น', ans: 1 },
                        { eng: 'Walk', c1: 'วิ่ง', c2: 'เดิน', ans: 2 },
                        { eng: 'Jump', c1: 'กระโดด', c2: 'ว่ายน้ำ', ans: 1 },
                        { eng: 'Swim', c1: 'กระโดด', c2: 'ว่ายน้ำ', ans: 2 },
                        { eng: 'Read', c1: 'อ่าน', c2: 'เขียน', ans: 1 },
                        { eng: 'Write', c1: 'พูด', c2: 'เขียน', ans: 2 },
                        { eng: 'Speak', c1: 'พูด', c2: 'ฟัง', ans: 1 },
                        { eng: 'Listen', c1: 'มอง', c2: 'ฟัง', ans: 2 },
                        { eng: 'Look', c1: 'มอง', c2: 'เห็น', ans: 1 },
                        { eng: 'See', c1: 'คิด', c2: 'เห็น', ans: 2 },
                        { eng: 'Think', c1: 'คิด', c2: 'ทำงาน', ans: 1 },
                        { eng: 'Work', c1: 'เล่น', c2: 'ทำงาน', ans: 2 },
                        { eng: 'Play', c1: 'เล่น', c2: 'ซื้อ', ans: 1 },
                        { eng: 'Stand', c1: 'นั่ง', c2: 'ยืน', ans: 2 },
                        { eng: 'Sit', c1: 'นั่ง', c2: 'เดิน', ans: 1 },
                        { eng: 'Buy', c1: 'ขาย', c2: 'ซื้อ', ans: 2 },
                        { eng: 'Sell', c1: 'ขาย', c2: 'ทำงาน', ans: 1 }
                    ]
                },
                {
                    stageName: "ด่าน 4: ร่างกาย (Body)",
                    wordsToPass: 15,
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
                    stageName: "ด่าน 5: สี (Colors)",
                    wordsToPass: 12,
                    words: [
                        { eng: 'Red', c1: 'แดง', c2: 'เขียว', ans: 1 },
                        { eng: 'Blue', c1: 'เหลือง', c2: 'น้ำเงิน', ans: 2 },
                        { eng: 'Green', c1: 'เขียว', c2: 'ม่วง', ans: 1 },
                        { eng: 'Yellow', c1: 'ส้ม', c2: 'เหลือง', ans: 2 },
                        { eng: 'White', c1: 'ขาว', c2: 'ดำ', ans: 1 },
                        { eng: 'Black', c1: 'น้ำตาล', c2: 'ดำ', ans: 2 },
                        { eng: 'Pink', c1: 'ชมพู', c2: 'แดง', ans: 1 },
                        { eng: 'Purple', c1: 'น้ำเงิน', c2: 'ม่วง', ans: 2 },
                        { eng: 'Orange', c1: 'ส้ม', c2: 'เหลือง', ans: 1 },
                        { eng: 'Brown', c1: 'เทา', c2: 'น้ำตาล', ans: 2 },
                        { eng: 'Gray', c1: 'เทา', c2: 'ขาว', ans: 1 },
                        { eng: 'Gold', c1: 'เงิน', c2: 'ทอง', ans: 2 },
                        { eng: 'Silver', c1: 'เงิน', c2: 'ทอง', ans: 1 },
                        { eng: 'Cream', c1: 'น้ำตาล', c2: 'ครีม', ans: 2 },
                        { eng: 'Violet', c1: 'ม่วงอ่อน', c2: 'ชมพู', ans: 1 },
                        { eng: 'Cyan', c1: 'เขียว', c2: 'ฟ้าอมเขียว', ans: 2 },
                        { eng: 'Maroon', c1: 'แดงเข้ม', c2: 'ส้ม', ans: 1 },
                        { eng: 'Navy', c1: 'ม่วง', c2: 'กรมท่า', ans: 2 },
                        { eng: 'Beige', c1: 'เบจ', c2: 'เทา', ans: 1 },
                        { eng: 'Scarlet', c1: 'ชมพู', c2: 'แดงสด', ans: 2 }
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
                        { eng: 'Baby', c1: 'ทารก', c2: 'เด็ก', ans: 1 },
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
            bossMaxHp: 3
        };
        this.selectedStartStage = data && data.startStageIdx !== undefined ? data.startStageIdx : 0;
        this.gameState.charId = 'thai';
    }

    preload() {
        let loadingText = this.add.text(500, 300, 'กำลังโหลดทรัพยากร...', { fontFamily: 'Kanit, sans-serif', fontSize: '40px', color: '#ffffff' }).setOrigin(0.5);
        this.load.on('complete', () => {
            loadingText.destroy();
        });

        // Load Thai Backgrounds (background1.png to background6.png)
        for (let i = 0; i < 6; i++) {
            this.load.image('lvl_bg' + i, 'assets/thai/background' + (i + 1) + '.png');
        }

        // Load Hanuman Player frames
        this.load.image('player_idle', 'assets/hanuman/idle/idle1.png'); // Fallback base key
        for (let i = 1; i <= 8; i++) {
            this.load.image('player_idle_' + i, 'assets/hanuman/idle/idle' + i + '.png');
        }
        for (let i = 1; i <= 6; i++) {
            this.load.image('player_charge_' + i, 'assets/hanuman/charge/charge' + i + '.png');
        }
        for (let i = 1; i <= 10; i++) {
            this.load.image('player_run_' + i, 'assets/hanuman/run/run' + i + '.png');
        }
        for (let i = 1; i <= 4; i++) {
            this.load.image('player_attack_custom_' + i, 'assets/hanuman/attack/attack' + i + '.png');
        }

        // Load Thai Enemies and frames
        this.load.image('enemy_yaksa', 'assets/yak/yakwalk/walk1.png'); // Fallback base key
        for (let i = 1; i <= 10; i++) {
            this.load.image('yaksa_walk_' + i, 'assets/yak/yakwalk/walk' + i + '.png');
        }
        for (let i = 1; i <= 8; i++) {
            this.load.image('yaksa_run_' + i, 'assets/yak/yakrun/run' + i + '.png');
        }
        this.load.image('yaksa_charge_1', 'assets/yak/yakcharge/charge1.png');
        this.load.image('yaksa_charge_2', 'assets/yak/yakcharge/chrage2.png');
        this.load.image('yaksa_attack_1', 'assets/yak/yakattack/attack1.png');
        this.load.image('yaksa_attack_2', 'assets/yak/yakattack/attack2.png');


        // Load Spells and Explosions
        for (let i = 1; i <= 8; i++) {
            let pI = i < 10 ? '0' + i : i;
            this.load.image('ef_fireball' + i, 'assets/ef2/Fire Ball/PNG/Fire Ball_Frame_' + pI + '.png');
            this.load.image('ef_firearrow' + i, 'assets/ef2/Fire Arrow/PNG/Fire Arrow_Frame_' + pI + '.png');
        }
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
                this.gameState.player.setX(200);

                if (this.gameState.hp <= 0) {
                    this.gameState.isGameOver = true;
                    
                    // Advanced death animation: spin and float up then crash down
                    if (this.gameState.auraParticles) this.gameState.auraParticles.stop();
                    if (this.gameState.playerIdleTween) this.gameState.playerIdleTween.stop();
                    if (this.gameState.playerSwayTween) this.gameState.playerSwayTween.stop();
                    if (this.gameState.flareTimer) this.gameState.flareTimer.destroy();
                    
                    this.tweens.add({
                        targets: this.gameState.player,
                        y: 320,
                        angle: -360,
                        scaleX: 0.25,
                        scaleY: 0.25,
                        duration: 600,
                        ease: 'Quad.easeOut',
                        onComplete: () => {
                            // Crash down
                            this.tweens.add({
                                targets: this.gameState.player,
                                y: 480,
                                angle: -90,
                                duration: 250,
                                ease: 'Bounce.easeOut',
                                onComplete: () => {
                                    this.gameState.player.setTint(0x333333);
                                    
                                    // Lightning strike on body
                                    let doom = this.add.sprite(this.gameState.player.x, this.gameState.player.y - 120, 'lt_b1').setOrigin(0.5).setDepth(20).setScale(3);
                                    doom.play('ef_lightning');
                                    doom.once('animationcomplete', () => { 
                                        doom.destroy(); 
                                        this.gameOver();
                                    });
                                }
                            });
                        }
                    });
                } else {
                    if (this.gameState.playerIdleTween) this.gameState.playerIdleTween.resume();
                    if (this.gameState.playerSwayTween) this.gameState.playerSwayTween.resume();

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
        });
    }

    create() {
        let safeBgIdx = this.gameState.currentStageIdx % 6;
        this.gameState.bg = this.add.image(500, 300, 'lvl_bg' + safeBgIdx).setDisplaySize(1000, 600);

        // --- STYLIZED RPG HUD (Thai Red/Gold Design) ---
        
        // 1. Player Info Frame (Top Left)
        let hudFrame = this.add.graphics();
        drawThaiFrame(hudFrame, 15, 15, 300, 80, 12);
        
        // Avatar (Hanuman)
        let avatar = this.add.image(55, 55, 'player_idle').setScale(0.08).setOrigin(0.5);
        
        // HP Label
        this.add.text(100, 35, 'HP', { fontFamily: 'Kanit, sans-serif', fontWeight: 'bold', fontSize: '26px', color: '#ffea00', padding: { top: 5, bottom: 5 } });

        // Health Bar Implementation
        let hpBg = this.add.graphics().fillStyle(0x5c0905, 1).fillRect(140, 42, 140, 20);
        this.gameState.hpBar = this.add.graphics();
        this.updateHpBar = () => {
            this.gameState.hpBar.clear();
            this.gameState.hpBar.fillStyle(0xff3333, 1);
            let w = (this.gameState.hp / this.gameState.maxHp) * 140;
            if (w > 0) this.gameState.hpBar.fillRect(140, 42, w, 20);
        };
        this.updateHpBar();
        
        // 2. Stage/Level Box (Center)
        let stageFrame = this.add.graphics();
        drawThaiFrame(stageFrame, 350, 15, 300, 45, 10);

        this.gameState.stageText = this.add.text(500, 36, this.gameState.vocabData[this.gameState.currentStageIdx].stageName, {
            fontFamily: 'Kanit, sans-serif', fontWeight: 'bold', fontSize: '24px', color: '#ffffff', padding: { top: 10, bottom: 10 }
        }).setOrigin(0.5);

        // 3. Score & Settings Box (Top Right)
        let scoreFrame = this.add.graphics();
        drawThaiFrame(scoreFrame, 720, 15, 200, 50, 10);
        
        this.gameState.scoreText = this.add.text(820, 40, 'SCORE: 0', {
            fontFamily: 'Kanit, sans-serif', fontWeight: 'bold', fontSize: '26px', color: '#ffd700'
        }).setOrigin(0.5);

        // Pause Button
        let pauseBtn = this.add.text(960, 40, '⏸', { fontSize: '40px', color: '#ffd700' })
            .setOrigin(0.5)
            .setInteractive({useHandCursor: true});

        pauseBtn.on('pointerdown', () => {
            pauseBtn.setAlpha(0.6);
            setTimeout(() => pauseBtn.setAlpha(1), 100);
            this.scene.pause();
            this.scene.launch('PauseMenu');
        });

        // Wood texture Sign for current word
        let wordSign = this.add.graphics();
        drawThaiFrame(wordSign, 300, 115, 400, 80, 15);

        this.gameState.wordText = this.add.text(500, 155, 'เริ่มศึก', { 
            fontSize: '56px', 
            fontFamily: 'Mitr, Kanit, sans-serif', 
            fontWeight: 'bold',
            color: '#ffd700',
            stroke: '#000000',
            strokeThickness: 8,
            padding: { top: 15, bottom: 15 }
        }).setOrigin(0.5);

        // Setup Player (Hanuman) - starts at far left
        this.gameState.player = this.add.sprite(130, 427, 'player_idle').setOrigin(0.5, 1).setDepth(2);
        this.gameState.player.setScale(1.2);

        // Gold Aura Foot Particles
        this.gameState.auraParticles = this.add.particles(200, 475, 'ef_fireball1', {
            scale: { start: 0.08, end: 0 },
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
            scaleY: 1.26,
            scaleX: 1.14,
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
                    scaleY: 0.96,
                    scaleX: 1.3,
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

                        let burst = this.add.particles(this.gameState.player.x, this.gameState.player.y - 20, 'ef_fireball1', {
                            scale: { start: 0.12, end: 0 },
                            speed: { min: 80, max: 200 },
                            lifespan: 400,
                            alpha: { start: 0.8, end: 0 },
                            tint: 0xffd700,
                            blendMode: 'ADD',
                            maxParticles: 15
                        }).setDepth(1);

                        this.tweens.add({
                            targets: this.gameState.player,
                            scaleY: 1.2,
                            scaleX: 1.2,
                            angle: 0,
                            x: 200,
                            y: 480,
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

        // Define keyframe animations for Hanuman
        if (!this.anims.exists('player_idle_anim')) {
            this.anims.create({
                key: 'player_idle_anim',
                frames: Array.from({length: 8}, (_, i) => ({ key: 'player_idle_' + (i + 1) })),
                frameRate: 10,
                repeat: -1
            });
            this.anims.create({
                key: 'player_charge_anim',
                frames: Array.from({length: 6}, (_, i) => ({ key: 'player_charge_' + (i + 1) })),
                frameRate: 12,
                repeat: 0
            });
            this.anims.create({
                key: 'player_run_anim',
                frames: Array.from({length: 10}, (_, i) => ({ key: 'player_run_' + (i + 1) })),
                frameRate: 12,
                repeat: -1
            });
        }

        // Define keyframe animations for Yaksa
        if (!this.anims.exists('yak_walk_anim')) {
            this.anims.create({
                key: 'yak_walk_anim',
                frames: Array.from({length: 10}, (_, i) => ({ key: 'yaksa_walk_' + (i + 1) })),
                frameRate: 10,
                repeat: -1
            });
            this.anims.create({
                key: 'yak_run_anim',
                frames: Array.from({length: 8}, (_, i) => ({ key: 'yaksa_run_' + (i + 1) })),
                frameRate: 12,
                repeat: -1
            });
            this.anims.create({
                key: 'yak_charge_anim',
                frames: [
                    { key: 'yaksa_charge_1' },
                    { key: 'yaksa_charge_2' }
                ],
                frameRate: 6,
                repeat: -1
            });
            this.anims.create({
                key: 'yak_attack_anim',
                frames: [
                    { key: 'yaksa_attack_1' },
                    { key: 'yaksa_attack_2' }
                ],
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
        if (!this.anims.exists('ef2_fireball_anim')) {
            this.anims.create({
                key: 'ef2_fireball_anim',
                frames: Array.from({length: 8}, (_, i) => ({ key: 'ef_fireball' + (i + 1) })),
                frameRate: 10,
                repeat: -1
            });
        }
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
        
        // Setup Action Buttons (4 Buttons, Horizontal Row at the Bottom)
        let bw = 230; 
        let bh = 60;
        let bf = '28px';
        this.gameState.btn1 = createChoiceButton(this, 140, 560, 'A', () => this.checkAnswer(1), bw, bh, bf);
        this.gameState.btn2 = createChoiceButton(this, 380, 560, 'B', () => this.checkAnswer(2), bw, bh, bf);
        this.gameState.btn3 = createChoiceButton(this, 620, 560, 'C', () => this.checkAnswer(3), bw, bh, bf);
        this.gameState.btn4 = createChoiceButton(this, 860, 560, 'D', () => this.checkAnswer(4), bw, bh, bf);

        this.nextQuiz();
    }

    nextQuiz() {
        let currentStageData = this.gameState.vocabData[this.gameState.currentStageIdx];
        
        // --- CHECK STAGE PROGRESS & BOSS SPAWN ---
        if (!this.gameState.isBossFight && this.gameState.scoreInStage >= currentStageData.wordsToPass) {
            // Trigger Boss Fight
            this.gameState.isBossFight = true;
            this.gameState.bossHp = this.gameState.bossMaxHp;
            
            let bossWarning = this.add.text(500, 300, 'ระวัง! แม่ทัพยักษ์ทศกัณฐ์!', { 
                fontFamily: 'Kanit, sans-serif', fontSize: '60px', fontWeight: 'bold', color: '#ff0000', stroke: '#ffffff', strokeThickness: 8 
            }).setOrigin(0.5).setDepth(20);
            
            // Flash red
            let flash = this.add.graphics().fillStyle(0xff0000, 0.4).fillRect(0,0,1000,600).setDepth(19);
            this.tweens.add({ targets: flash, alpha: 0, duration: 200, yoyo: true, repeat: 3, onComplete: () => flash.destroy() });
            
            this.tweens.add({
                targets: bossWarning, scale: 1.15, alpha: 0, duration: 2500, ease: 'Power2',
                onComplete: () => bossWarning.destroy()
            });
            
            this.gameState.stageText.setText('BOSS: ' + currentStageData.stageName);
            this.gameState.stageText.setColor('#ff3333');
        } else if (this.gameState.isBossFight && this.gameState.bossHp <= 0) {
            // Defeated Boss -> Next Stage transition
            this.gameState.isAnimating = true; 
            this.gameState.isBossFight = false;
            this.gameState.scoreInStage = 0;
            this.gameState.currentStageIdx++;
            
            if (this.gameState.currentStageIdx >= this.gameState.vocabData.length) {
                this.gameState.currentStageIdx = 0; // Loop back
            }
            this.gameState.quizQueue = []; 

            let nsText = this.add.text(500, 300, 'ผ่านด่านสำเร็จ!', { fontFamily: 'Kanit, sans-serif', fontWeight: 'bold', fontSize: '80px', color: '#00ff00', stroke: '#000000', strokeThickness: 8 }).setOrigin(0.5).setDepth(20);
            this.tweens.add({
                targets: nsText, y: 200, alpha: 0, duration: 2000,
                onComplete: () => nsText.destroy()
            });

            // Player slides off-screen right
            this.gameState.playerIdleTween.pause();
            this.gameState.player.play('player_run_anim');
            this.tweens.add({
                targets: this.gameState.player,
                x: 1100,
                duration: 1200,
                ease: 'Power2.easeIn',
                onComplete: () => {
                    // Update Background
                    let bgIndex = this.gameState.currentStageIdx % 6; 
                    this.gameState.bg.setTexture('lvl_bg' + bgIndex);
                    
                    let stageName = this.gameState.vocabData[this.gameState.currentStageIdx].stageName;
                    this.gameState.stageText.setText(stageName);
                    this.gameState.stageText.setColor('#ffffff');

                    // Player spawns off-screen left and moves back to x = 130
                    this.gameState.player.x = -100;
                    this.gameState.player.y = 427;
                    this.tweens.add({
                        targets: this.gameState.player,
                        x: 130,
                        duration: 1000,
                        ease: 'Power2.easeOut',
                        onComplete: () => {
                            this.gameState.player.play('player_idle_anim');
                            this.gameState.playerIdleTween.resume();
                            this.gameState.isAnimating = false;
                            this.nextQuiz();
                        }
                    });
                }
            });
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

        // Display Thai Word
        let correctThaiWord = quiz['c' + quiz.ans];
        this.gameState.wordText.setText(correctThaiWord);

        // Generate 4 English Choices
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

        // Apply choices to buttons
        this.gameState.btn1.text.setText(choices[0].text);
        this.gameState.btn2.text.setText(choices[1].text);
        this.gameState.btn3.text.setText(choices[2].text);
        this.gameState.btn4.text.setText(choices[3].text);

        this.gameState.correctBtn = choices.findIndex(c => c.isCorrect) + 1;

        if (this.gameState.zombie) {
            if (this.gameState.zombieMoveTween) this.gameState.zombieMoveTween.stop();
            if (this.gameState.zombieFloatTween) this.gameState.zombieFloatTween.stop();
            if (this.gameState.zombieTrail) this.gameState.zombieTrail.destroy();
            this.gameState.zombie.destroy();
        }
        
        // Spawn Enemy (Exclusively Yaksa for all stages)
        let isFloating = false;
        let mKey = 'enemy_yaksa';
        let spawnY = 427;
        let baseScale = this.gameState.isBossFight ? 1.6 : 1.25;

        this.gameState.zombie = this.add.sprite(950, spawnY, mKey).setOrigin(0.5, 1).setDepth(2);
        this.gameState.zombie.setScale(baseScale);
        if (this.gameState.isBossFight) {
            this.gameState.zombie.play('yak_run_anim');
        } else {
            this.gameState.zombie.play('yak_walk_anim');
        }
        // Reset player to idle position at far left
        if (this.gameState.player && !this.gameState.isAnimating) {
            this.gameState.player.x = 130;
            this.gameState.player.y = 480;
        }

        // Hover sine wave with glowing trail for Krasue, heavy walking stomp for Giants
        if (isFloating) {
            // Eerie glowing red organ particles trail for Krasue
            this.gameState.zombieTrail = this.add.particles(950, spawnY - 60, 'ef_fireball1', {
                scale: { start: 0.08, end: 0 },
                speedY: { min: 40, max: 120 },
                speedX: { min: -20, max: 20 },
                lifespan: 500,
                alpha: { start: 0.5, end: 0 },
                tint: 0xff3300, // Crimson red organs glow
                blendMode: 'ADD',
                frequency: 80
            }).setDepth(1);

            this.gameState.zombieFloatTween = this.tweens.add({
                targets: this.gameState.zombie,
                y: spawnY - 25,
                angle: 8,
                duration: 1200,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        } else {
            // Giants walk with heavy stomp squash-and-stretch (no Y float)
            this.gameState.zombieFloatTween = this.tweens.add({
                targets: this.gameState.zombie,
                scaleX: baseScale * 0.94,
                scaleY: baseScale * 1.06,
                duration: 350,
                yoyo: true,
                repeat: -1,
                ease: 'Quad.easeOut',
                onYoyo: () => {
                    if (!this.gameState.isGameOver && this.gameState.zombie && this.gameState.zombie.x > 220) {
                        // Ground stomp shake & dust cloud
                        this.cameras.main.shake(60, 0.003);
                        let dust = this.add.circle(this.gameState.zombie.x, spawnY, 8, 0xaaaaaa, 0.6).setDepth(1);
                        this.tweens.add({
                            targets: dust,
                            scale: 2.5,
                            alpha: 0,
                            duration: 250,
                            onComplete: () => dust.destroy()
                        });
                    }
                }
            });
        }

        // Boss HP Bar visual above head
        if (this.gameState.bossHpGroup) this.gameState.bossHpGroup.destroy(true);
        if (this.gameState.isBossFight) {
            this.gameState.bossHpGroup = this.add.group();
            let bHpBg = this.add.graphics();
            bHpBg.fillStyle(0x000000, 0.8).fillRect(-50, -180, 100, 10);
            let bHpFill = this.add.graphics();
            bHpFill.fillStyle(0xff0000, 1).fillRect(-50, -180, (this.gameState.bossHp / this.gameState.bossMaxHp) * 100, 10);
            
            let hpContainer = this.add.container(this.gameState.zombie.x, this.gameState.zombie.y);
            hpContainer.add([bHpBg, bHpFill]);
            this.gameState.bossHpGroup.add(hpContainer);
            this.gameState.zombie.hpContainer = hpContainer;
        }
        
        // Zombie walks towards player
        let walkDuration = parseInt(localStorage.getItem('zombieDifficulty')) || 10000;
        if (this.gameState.isBossFight) walkDuration *= 1.4; // Boss walks slightly slower
        
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
                        this.gameState.zombieTrail.setPosition(this.gameState.zombie.x, this.gameState.zombie.y - 60);
                    }
                    // Player stays at far left during idle - no follow
                }
            },
            onComplete: () => {
                if (!this.gameState.isAnimating && !this.gameState.isGameOver) {
                    this.gameState.isAnimating = true;

                    // Monster Windup & Heavy Lunge Strike
                    if (this.gameState.zombieFloatTween) this.gameState.zombieFloatTween.pause();

                    this.tweens.add({
                        targets: this.gameState.zombie,
                        scaleX: this.gameState.zombie.scaleX * 1.15,
                        scaleY: this.gameState.zombie.scaleY * 0.85,
                        angle: isFloating ? 15 : -15,
                        duration: 150,
                        yoyo: true,
                        repeat: 0,
                        onComplete: () => {
                            // High speed strike lunge
                            this.tweens.add({
                                targets: this.gameState.zombie,
                                x: 260,
                                duration: 180,
                                ease: 'Cubic.easeOut',
                                onComplete: () => {
                                    if (this.gameState.isBossFight) {
                                        this.gameState.hp--;
                                        this.updateHpBar();
                                    }
                                    this.playerTakeDamage();

                                    // Lurch return
                                    this.tweens.add({
                                        targets: this.gameState.zombie,
                                        x: 330,
                                        duration: 250,
                                        ease: 'Quad.easeIn',
                                        onComplete: () => {
                                            if (this.gameState.zombieFloatTween) this.gameState.zombieFloatTween.resume();
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            }
        });
    }

    dealAttackDamage() {
        if (this.gameState.isGameOver) return;

        // Flash enemy white for damage indication
        this.gameState.zombie.setTintFill(0xffffff);
        setTimeout(() => { if (this.gameState.zombie) this.gameState.zombie.clearTint(); }, 150);

        if (this.gameState.isBossFight) {
            this.gameState.bossHp--;
            if (this.gameState.bossHp > 0) {
                // Update boss HP bar
                if (this.gameState.zombie.hpContainer) {
                    this.gameState.zombie.hpContainer.destroy();
                }
                let bHpBg = this.add.graphics();
                bHpBg.fillStyle(0x000000, 0.8).fillRect(-50, -180, 100, 10);
                let bHpFill = this.add.graphics();
                bHpFill.fillStyle(0xff0000, 1).fillRect(-50, -180, (this.gameState.bossHp / this.gameState.bossMaxHp) * 100, 10);
                
                let hpContainer = this.add.container(this.gameState.zombie.x, this.gameState.zombie.y);
                hpContainer.add([bHpBg, bHpFill]);
                this.gameState.bossHpGroup.add(hpContainer);
                this.gameState.zombie.hpContainer = hpContainer;

                // Reload question immediately
                setTimeout(() => { this.nextQuiz(); }, 500);
                return;
            }
        }

        // Defeated
        if (this.gameState.bossHpGroup) this.gameState.bossHpGroup.destroy(true); 

        // Spin and fade out enemy
        if (this.gameState.zombieFloatTween) this.gameState.zombieFloatTween.stop();
        this.tweens.add({
            targets: this.gameState.zombie,
            alpha: 0,
            angle: 180,
            y: this.gameState.zombie.y + 40,
            duration: 800, 
            onComplete: () => {
                if (this.gameState.isBossFight) {
                    this.gameState.coins += 50; 
                } else {
                    this.gameState.coins += 10;
                    this.gameState.scoreInStage++;
                }
                
                this.gameState.scoreText.setText('SCORE: ' + this.gameState.coins);
                this.nextQuiz();
            }
        });
    }

    checkAnswer(choiceNumber) {
        if (this.gameState.isAnimating || this.gameState.isGameOver) return;
        this.gameState.isAnimating = true;

        if (this.gameState.correctBtn === choiceNumber) {
            // Correct answer
            if (this.gameState.zombieMoveTween) this.gameState.zombieMoveTween.stop();

            // Randomly choose from 3 premium custom attack moves
            let attackStyle = Math.floor(Math.random() * 3);
            if (attackStyle === 0) {
                this.playTridentTyphoon();
            } else if (attackStyle === 1) {
                this.playThunderMonkey();
            } else {
                this.playApeDashCombo();
            }
        } else {
            // Wrong answer - Enemy strikes instantly!
            if (this.gameState.zombieMoveTween) this.gameState.zombieMoveTween.stop();

            let performLunge = () => {
                // Red screen border alert flash
                let failFlash = this.add.graphics().fillStyle(0xcc0000, 0.5).fillRect(0, 0, 1000, 600).setDepth(20);
                this.tweens.add({ targets: failFlash, alpha: 0, duration: 300, onComplete: () => failFlash.destroy() });

                // Stop active walk/run animations and set randomly chosen attack texture
                this.gameState.zombie.anims.stop();
                let randAttack = Math.random() < 0.5 ? 'yaksa_attack_1' : 'yaksa_attack_2';
                this.gameState.zombie.setTexture(randAttack);

                this.tweens.add({
                    targets: this.gameState.zombie,
                    x: this.gameState.player.x + 70,
                    duration: 200,
                    yoyo: true,
                    repeat: 0,
                    onComplete: () => {
                        if (this.gameState.isBossFight) {
                            this.gameState.zombie.play('yak_run_anim');
                            this.gameState.hp--;
                            this.updateHpBar();
                        } else {
                            this.gameState.zombie.play('yak_walk_anim');
                        }
                        this.playerTakeDamage();
                    }
                });
            };

            if (this.gameState.isBossFight) {
                // Boss charges first before lunging!
                this.gameState.zombie.play('yak_charge_anim');
                this.time.delayedCall(500, () => {
                    performLunge();
                });
            } else {
                performLunge();
            }
        }
    }

    playTridentTyphoon() {
        if (this.gameState.playerIdleTween) this.gameState.playerIdleTween.pause();
        if (this.gameState.playerSwayTween) this.gameState.playerSwayTween.pause();

        // 1. Play charge animation first
        this.gameState.player.play('player_charge_anim');
        this.gameState.player.once('animationcomplete-player_charge_anim', () => {
            let randAttackIdx = Math.floor(Math.random() * 4) + 1;

            // 2. Anticipation (Squash)
            this.tweens.add({
                targets: this.gameState.player,
                scaleY: 0.8,
                scaleX: 1.4,
                duration: 150,
                onComplete: () => {
                    // 3. High Leap Spin
                    this.tweens.add({
                        targets: this.gameState.player,
                        x: (200 + this.gameState.zombie.x) / 2,
                        y: 240,
                        angle: 360,
                        scaleY: 1.2,
                        scaleX: 1.2,
                        duration: 300,
                        ease: 'Quad.easeOut',
                        onComplete: () => {
                            // Set texture to randomized attack frame right before hitting
                            this.gameState.player.anims.stop();
                            this.gameState.player.setTexture('player_attack_custom_' + randAttackIdx);

                            // 4. Slam Down Strike (shorter offset to be closer to enemy)
                            this.tweens.add({
                                targets: this.gameState.player,
                                x: this.gameState.zombie.x - 45,
                                y: 480,
                                angle: 720,
                                duration: 180,
                                ease: 'Quad.easeIn',
                                onComplete: () => {
                                    // Impact
                                    this.cameras.main.shake(250, 0.03);
                                    let flash = this.add.graphics().fillStyle(0xffffff, 0.6).fillRect(0,0,1000,600).setDepth(20);
                                    this.tweens.add({ targets: flash, alpha: 0, duration: 180, onComplete: () => flash.destroy() });

                                    // Dust shockwave rings
                                    let ring = this.add.circle(this.gameState.zombie.x - 45, 480, 20).setStrokeStyle(4, 0xffffff, 0.8).setDepth(1);
                                    this.tweens.add({ targets: ring, radius: 100, alpha: 0, duration: 300, onComplete: () => ring.destroy() });

                                    // Contact explosion
                                    let exp = this.add.sprite(this.gameState.zombie.x, this.gameState.zombie.y - 60, 'ef3_exp1').setScale(3.5).setDepth(5);
                                    exp.play('ef3_exp_anim');
                                    exp.once('animationcomplete', () => exp.destroy());

                                    this.dealAttackDamage();

                                    // 5. Leap Return to far-left idle position
                                    this.tweens.add({
                                        targets: this.gameState.player,
                                        x: 130,
                                        y: 480,
                                        angle: 0,
                                        duration: 350,
                                        ease: 'Bounce.easeOut',
                                        onComplete: () => {
                                            this.gameState.player.play('player_idle_anim');
                                            if (this.gameState.playerIdleTween) this.gameState.playerIdleTween.resume();
                                            if (this.gameState.playerSwayTween) this.gameState.playerSwayTween.resume();
                                        }
                                    });
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

        // 1. Play charge animation first
        this.gameState.player.play('player_charge_anim');
        this.gameState.player.once('animationcomplete-player_charge_anim', () => {
            let randAttackIdx = Math.floor(Math.random() * 4) + 1;

            // 2. Charge Pose (Lean back, float up and dash next to enemy)
            this.tweens.add({
                targets: this.gameState.player,
                y: 440,
                x: this.gameState.zombie.x - 45,
                angle: -20,
                duration: 300,
                ease: 'Quad.easeOut',
                onComplete: () => {
                    // Set texture to randomized attack frame right before hitting
                    this.gameState.player.anims.stop();
                    this.gameState.player.setTexture('player_attack_custom_' + randAttackIdx);

                    // 3. Blue screen border alert flash and lightning strike
                    this.cameras.main.shake(200, 0.02);
                    let lightningFlash = this.add.graphics().fillStyle(0x00ffff, 0.5).fillRect(0,0,1000,600).setDepth(20);
                    this.tweens.add({ targets: lightningFlash, alpha: 0, duration: 300, onComplete: () => lightningFlash.destroy() });

                    // Spawn Lightning
                    let bolt = this.add.sprite(this.gameState.zombie.x, this.gameState.zombie.y - 120, 'lt_b1').setOrigin(0.5).setDepth(20).setScale(3.5);
                    bolt.play('ef_lightning');
                    bolt.once('animationcomplete', () => {
                        bolt.destroy();
                        
                        // Contact explosion
                        let exp = this.add.sprite(this.gameState.zombie.x, this.gameState.zombie.y - 60, 'ef3_exp1').setScale(3.5).setDepth(5);
                        exp.play('ef3_exp_anim');
                        exp.once('animationcomplete', () => exp.destroy());

                        this.dealAttackDamage();

                        // Float back down to far-left idle position
                        this.tweens.add({
                            targets: this.gameState.player,
                            x: 130,
                            y: 480,
                            angle: 0,
                            duration: 250,
                            onComplete: () => {
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

        // 1. Play charge animation first
        this.gameState.player.play('player_charge_anim');
        this.gameState.player.once('animationcomplete-player_charge_anim', () => {
            let zombieX = this.gameState.zombie.x;

            // 1. Dash 1 (High speed slash close next to enemy)
            this.gameState.player.anims.stop();
            this.gameState.player.setTexture('player_attack_custom_' + (Math.floor(Math.random() * 4) + 1));
            this.tweens.add({
                targets: this.gameState.player,
                x: zombieX - 70,
                duration: 120,
                ease: 'Quad.easeOut',
                onComplete: () => {
                    this.cameras.main.shake(100, 0.01);
                    let exp1 = this.add.sprite(zombieX, this.gameState.zombie.y - 60, 'ef3_exp1').setScale(2).setDepth(5);
                    exp1.play('ef3_exp_anim');
                    exp1.once('animationcomplete', () => exp1.destroy());

                    // Retreat
                    this.tweens.add({
                        targets: this.gameState.player,
                        x: zombieX - 180,
                        duration: 100,
                        onComplete: () => {
                            // 2. Dash 2 (Angle tilt slash closer)
                            this.gameState.player.setTexture('player_attack_custom_' + (Math.floor(Math.random() * 4) + 1));
                            this.tweens.add({
                                targets: this.gameState.player,
                                x: zombieX - 55,
                                angle: 25,
                                duration: 120,
                                ease: 'Quad.easeOut',
                                onComplete: () => {
                                    this.cameras.main.shake(100, 0.01);
                                    let exp2 = this.add.sprite(zombieX, this.gameState.zombie.y - 60, 'ef3_exp1').setScale(2).setDepth(5);
                                    exp2.play('ef3_exp_anim');
                                    exp2.once('animationcomplete', () => exp2.destroy());

                                    // Retreat
                                    this.tweens.add({
                                        targets: this.gameState.player,
                                        x: zombieX - 140,
                                        angle: 0,
                                        duration: 100,
                                        onComplete: () => {
                                            // 3. Final slam Dash 3 (Huge spin right next to enemy)
                                            this.gameState.player.setTexture('player_attack_custom_' + (Math.floor(Math.random() * 4) + 1));
                                            this.tweens.add({
                                                targets: this.gameState.player,
                                                x: zombieX - 40,
                                                angle: -45,
                                                duration: 120,
                                                ease: 'Cubic.easeOut',
                                                onComplete: () => {
                                                    this.cameras.main.shake(200, 0.02);
                                                    let exp3 = this.add.sprite(zombieX, this.gameState.zombie.y - 60, 'ef3_exp1').setScale(3.5).setDepth(5);
                                                    exp3.play('ef3_exp_anim');
                                                    exp3.once('animationcomplete', () => exp3.destroy());

                                                    this.dealAttackDamage();

                                                    // Jump back to far-left idle position
                                                    this.tweens.add({
                                                        targets: this.gameState.player,
                                                        x: 130,
                                                        y: 480,
                                                        angle: 0,
                                                        duration: 250,
                                                        onComplete: () => {
                                                            this.gameState.player.play('player_idle_anim');
                                                            if (this.gameState.playerIdleTween) this.gameState.playerIdleTween.resume();
                                                            if (this.gameState.playerSwayTween) this.gameState.playerSwayTween.resume();
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    });
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
        drawThaiFrame(panelFrame, 200, 80, 600, 440, 16);

        this.add.text(500, 160, 'หยุดเกมชั่วคราว', {
            fontFamily: '"PixelGame", "Courier New", Courier, Kanit',
            fontSize: '60px',
            color: '#ffea00',
            strokeThickness: 0
        }).setOrigin(0.5).setShadow(4, 6, '#000000', 0, false, true);

        // Resume Button
        createChoiceButton(this, 500, 270, 'เล่นต่อ', () => {
            this.scene.stop();
            this.scene.resume('GamePlay');
        });

        // Restart Button
        createChoiceButton(this, 350, 400, 'เริ่มใหม่', () => {
            this.scene.stop();
            this.scene.get('GamePlay').scene.restart();
        });

        // Main Menu Button
        createChoiceButton(this, 650, 400, 'เมนูหลัก', () => {
            this.scene.stop();
            this.scene.stop('GamePlay');
            this.scene.start('MainMenu');
        });
    }
}

function createChoiceButton(scene, x, y, textStr, onClick, w = 340, h = 66, fSize = '32px') {
    let container = scene.add.container(x, y);
    container.setDepth(10); // Bring buttons to the front (above characters which are depth 2)

    let cx = -(w/2);
    let cy = -(h/2);

    // Drop Shadow
    let shadow = scene.add.graphics();
    shadow.fillStyle(0x000000, 0.4);
    shadow.fillRoundedRect(cx + 6, cy + 8, w, h, 8);

    // Black Outer Border
    let bOuter = scene.add.graphics();
    bOuter.fillStyle(0x3a1007, 1); // Dark teak wood brown
    bOuter.fillRoundedRect(cx, cy, w, h, 8);
    
    // Dark Red lower shadow
    let bDark = scene.add.graphics();
    bDark.fillStyle(0x5c0905, 1); // Deep blood red
    bDark.fillRoundedRect(cx + 4, cy + 4, w - 8, h - 8, 6);

    // Main Red Base
    let bBase = scene.add.graphics();
    bBase.fillStyle(0x9e100b, 1); // Rich crimson red
    bBase.fillRoundedRect(cx + 4, cy + 4, w - 8, h - 14, 6);

    // Top Gold Highlight (Thai Temple Accent)
    let bLight = scene.add.graphics();
    bLight.fillStyle(0xd4af37, 1); // Temple gold
    bLight.fillRoundedRect(cx + 4, cy + 4, w - 8, 8, 6);

    let btnText = scene.add.text(0, -2, textStr, {
        fontSize: fSize,
        fontFamily: 'Kanit, sans-serif',
        fontWeight: 'bold',
        color: '#ffd700', // Gold text
        padding: { top: 10, bottom: 10 },
        stroke: '#000000',
        strokeThickness: 4
    }).setOrigin(0.5);

    container.add([shadow, bOuter, bDark, bBase, bLight, btnText]);

    let hitZone = scene.add.zone(0, 0, w, h).setInteractive({ useHandCursor: true });
    hitZone.on('pointerdown', () => {
        bBase.fillStyle(0x5c0905, 1); bBase.fillRoundedRect(cx + 4, cy + 4, w - 8, h - 14, 6);
        bLight.fillStyle(0x9e100b, 1); bLight.fillRoundedRect(cx + 4, cy + 4, w - 8, 8, 6);
        container.y += 4;
        setTimeout(() => { 
            bBase.fillStyle(0x9e100b, 1); bBase.fillRoundedRect(cx + 4, cy + 4, w - 8, h - 14, 6);
            bLight.fillStyle(0xd4af37, 1); bLight.fillRoundedRect(cx + 4, cy + 4, w - 8, 8, 6);
            container.y -= 4; 
        }, 100);
        onClick();
    });
    container.add(hitZone);

    return { container, text: btnText };
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

        this.add.text(500, 95, 'ตั้งค่าความยาก', {
            fontFamily: '"PixelGame", "Courier New", Courier, Kanit',
            fontSize: '60px',
            color: '#ffea00',
            strokeThickness: 0
        }).setOrigin(0.5).setShadow(4, 6, '#000000', 0, false, true);

        // Difficulty Setting
        let difficulty = parseInt(localStorage.getItem('zombieDifficulty')) || 10000;
        let diffLabel = this.add.text(500, 215, 'ความเร็วซอมบี้: ' + (difficulty === 10000 ? 'ช้า (10วิ)' : (difficulty === 6000 ? 'ปานกลาง (6วิ)' : 'เร็วทะลุนรก (3วิ)')), {
            fontFamily: '"PixelGame", Kanit',
            fontSize: '32px',
            color: '#ffffff',
            strokeThickness: 0
        }).setOrigin(0.5).setShadow(2, 4, '#000', 0, false, true);

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
            diffLabel.setColor('#00ff00');
            setTimeout(() => {
                diffLabel.setText(prevText);
                diffLabel.setColor('#ffffff');
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
        overlay.fillStyle(0x1c0505, 0.75); // Blood teak wood tone
        overlay.fillRect(0, 0, 1000, 600);

        // Grand Thai Signboard Frame for Stats
        let statsFrame = this.add.graphics();
        drawThaiFrame(statsFrame, 220, 190, 560, 220, 16);

        // Title: พ่ายแพ้ศึก (DEFEATED / GAME OVER)
        let titleText = this.add.text(500, 110, 'พ่ายแพ้ศึก', {
            fontFamily: 'Mitr, Kanit, sans-serif',
            fontSize: '90px',
            fontWeight: 'bold',
            stroke: '#2b0202',
            strokeThickness: 12
        }).setOrigin(0.5).setShadow(0, 8, '#000', 0, false, true);

        // Create beautiful gold-to-red gradient for title text
        let gradient = titleText.context.createLinearGradient(0, 0, 0, titleText.height);
        gradient.addColorStop(0, '#ffd700'); // Gold
        gradient.addColorStop(0.5, '#ffd700');
        gradient.addColorStop(0.51, '#9e100b'); // Crimson
        gradient.addColorStop(1, '#9e100b');
        titleText.setFill(gradient);

        this.add.text(500, 240, 'จบเกมที่ด่าน: ' + this.stageName, {
            fontFamily: 'Kanit, sans-serif',
            fontSize: '32px',
            fontWeight: 'bold',
            color: '#ffffff',
        }).setOrigin(0.5).setShadow(2, 4, '#000', 0, false, true);

        this.add.text(500, 295, 'คะแนนสะสม: ' + this.finalScore, {
            fontFamily: 'Kanit, sans-serif',
            fontSize: '36px',
            fontWeight: 'bold',
            color: '#ffd700',
        }).setOrigin(0.5).setShadow(2, 4, '#000', 0, false, true);

        let highScore = parseInt(localStorage.getItem('zombieHighScore')) || 0;
        if (this.finalScore > highScore) {
            highScore = this.finalScore;
            localStorage.setItem('zombieHighScore', highScore);
            this.add.text(500, 355, '★ สถิติใหม่ยุทธภพ! ★', {
                fontFamily: 'Kanit, sans-serif',
                fontSize: '28px',
                fontWeight: 'bold',
                color: '#00ffcc',
            }).setOrigin(0.5).setShadow(2, 4, '#000', 0, false, true);
        }

        // 'สู้ต่อหรือไม่?' Prompt
        this.add.text(500, 450, 'ต้องการสู้ต่ออีกครั้งหรือไม่?', { 
            fontFamily: 'Kanit, sans-serif', fontSize: '32px', fontWeight: 'bold', color: '#ffffff'
        }).setOrigin(0.5).setShadow(3, 5, '#000', 0, false, true);

        // YES / NO Cursor Menu
        let yesBtn = this.add.text(400, 520, 'สู้ต่อ (YES)', { fontFamily: 'Kanit, sans-serif', fontSize: '36px', fontWeight: 'bold', color: '#ffd700' }).setOrigin(0.5).setInteractive({ useHandCursor: true }).setShadow(2, 4, '#000', 0, false, true);
        let noBtn = this.add.text(600, 520, 'ยอมแพ้ (NO)', { fontFamily: 'Kanit, sans-serif', fontSize: '36px', fontWeight: 'bold', color: '#ff4444' }).setOrigin(0.5).setInteractive({ useHandCursor: true }).setShadow(2, 4, '#000', 0, false, true);

        // Hanuman's Trident selector cursor
        let cursor = this.add.text(0, 0, '🔱', { fontFamily: 'Kanit, sans-serif', fontSize: '38px', color: '#ffd700' }).setOrigin(1, 0.5).setShadow(2, 4, '#000', 0, false, true);
        cursor.setPosition(yesBtn.x - 100, yesBtn.y);

        yesBtn.on('pointerover', () => cursor.setPosition(yesBtn.x - 100, yesBtn.y));
        noBtn.on('pointerover', () => cursor.setPosition(noBtn.x - 100, noBtn.y));

        yesBtn.on('pointerdown', () => this.scene.start('GamePlay'));
        noBtn.on('pointerdown', () => this.scene.start('MainMenu'));
    }
}

class CategoryMenu extends Phaser.Scene {
    constructor() {
        super({ key: 'CategoryMenu' });
    }

    init(data) {
        this.charId = data && data.charId ? data.charId : 2;
    }

    create() {
        let bg = this.add.image(500, 300, 'lvl_menu_bg').setDisplaySize(1000, 600);
        let overlay = this.add.graphics();
        overlay.fillStyle(0x000000, 0.85);
        overlay.fillRect(0, 0, 1000, 600);

        this.add.text(500, 70, 'เลือกด่าน (SELECT STAGE)', {
            fontFamily: 'Mitr, Kanit, sans-serif',
            fontSize: '54px',
            fontWeight: 'bold',
            color: '#ffd700',
            stroke: '#4a1212',
            strokeThickness: 8
        }).setOrigin(0.5).setShadow(4, 6, '#000', 0, false, true);

        let stages = [
            { name: 'ด่าน 1: สัตว์', num: '1' },
            { name: 'ด่าน 2: ผลไม้', num: '2' },
            { name: 'ด่าน 3: กริยา', num: '3' },
            { name: 'ด่าน 4: ร่างกาย', num: '4' },
            { name: 'ด่าน 5: สี', num: '5' },
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
            
            // Premium Thai Card Frame
            let cardBg = this.add.graphics();
            drawThaiFrame(cardBg, cx - 120, cy - 70, 240, 140, 12);
            
            let cardInner = this.add.graphics();
            cardInner.fillStyle(0x3a1007, 1);
            cardInner.fillRoundedRect(cx - 114, cy - 64, 228, 128, 10);
            
            // Big Number 
            let numTxt = this.add.text(cx, cy - 15, st.num, {
                fontFamily: '"PixelGame", "Courier New", Courier, Kanit',
                fontSize: '80px',
                color: '#a08070'
            }).setOrigin(0.5);
            
            // Name Text
            let title = this.add.text(cx, cy + 40, st.name, {
                fontFamily: '"PixelGame", Kanit',
                fontSize: '26px',
                color: '#ffffff'
            }).setOrigin(0.5);

            // Interaction Zone
            let zone = this.add.zone(cx, cy, 240, 140).setInteractive({ useHandCursor: true });
            
            zone.on('pointerover', () => {
                cardInner.clear();
                cardInner.fillStyle(0x7a0c08, 1); // glowing crimson on hover
                cardInner.fillRoundedRect(cx - 114, cy - 64, 228, 128, 10);
                title.setColor('#ffd700'); // Gold text on hover
                numTxt.setColor('#ffffff');
                this.tweens.add({ targets: numTxt, y: cy - 25, duration: 100 });
            });
            
            zone.on('pointerout', () => {
                cardInner.clear();
                cardInner.fillStyle(0x3a1007, 1);
                cardInner.fillRoundedRect(cx - 114, cy - 64, 228, 128, 10);
                title.setColor('#ffffff');
                numTxt.setColor('#a08070');
                this.tweens.add({ targets: numTxt, y: cy - 15, duration: 100 });
            });
            
            zone.on('pointerdown', () => {
                this.scene.start('GamePlay', { startStageIdx: i, charId: this.charId });
            });
        });

        createChoiceButton(this, 500, 520, 'ย้อนกลับ', () => {
            this.scene.start('MainMenu');
        });
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
    scene: [MainMenu, CategoryMenu, GamePlay, PauseMenu, SettingsMenu, GameOverScene]
};

const game = new Phaser.Game(config);