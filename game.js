class MainMenu extends Phaser.Scene {
    constructor() {
        super({ key: 'MainMenu' });
    }

    preload() {
        let loadingText = this.add.text(500, 300, 'Loading Game... Please wait.', { fontFamily: '"PixelGame", Kanit', fontSize: '40px', color: '#ffffff' }).setOrigin(0.5);
        this.load.on('complete', () => {
            loadingText.destroy();
        });

        this.load.image('lvl_menu_bg', 'assets/back/bg2.png');
        
        // Load specific idle frames for animated title screen and character select
        for (let i = 0; i <= 9; i++) {
            this.load.image('k1_idle' + i, 'assets/pl/_PNG/1_KNIGHT/Knight_01__IDLE_00' + i + '.png');
            this.load.image('k2_idle' + i, 'assets/pl/_PNG/2_KNIGHT/Knight_02__IDLE_00' + i + '.png');
            this.load.image('k3_idle' + i, 'assets/pl/_PNG/3_KNIGHT/Knight_03__IDLE_00' + i + '.png');
        }
    }

    create() {
        let bg = this.add.image(500, 300, 'lvl_menu_bg');
        bg.setDisplaySize(1000, 600);
        
        let overlay = this.add.graphics();
        overlay.fillStyle(0x000000, 0.4);
        overlay.fillRect(0, 0, 1000, 600);

        // Setup Animations if they don't exist globally yet
        if (!this.anims.exists('menu_k1_idle')) {
            this.anims.create({ key: 'menu_k1_idle', frames: Array.from({length: 10}, (_, i) => ({ key: 'k1_idle' + i })), frameRate: 15, repeat: -1 });
            this.anims.create({ key: 'menu_k2_idle', frames: Array.from({length: 10}, (_, i) => ({ key: 'k2_idle' + i })), frameRate: 15, repeat: -1 });
            this.anims.create({ key: 'menu_k3_idle', frames: Array.from({length: 10}, (_, i) => ({ key: 'k3_idle' + i })), frameRate: 15, repeat: -1 });
        }



        // Bouncing/Breathing Title
        let titleBlock = this.add.container(500, 160);
        
        let titleText = this.add.text(0, 0, 'ENGLISH SLAYER', {
            fontFamily: '"PixelGame", "Courier New", Courier',
            fontSize: '96px',
            color: '#b6ff00',
             strokeThickness: 0
        }).setOrigin(0.5).setShadow(6, 8, '#000000', 0, false, true);

        titleBlock.add(titleText);

        this.tweens.add({
            targets: titleBlock,
            y: 145, 
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        this.add.text(500, 260, 'เกมคำศัพท์พื้นฐาน', {
            fontFamily: '"PixelGame", "Courier New", Courier, Kanit',
            fontSize: '44px',
            color: '#ffffff',
            strokeThickness: 0
        }).setOrigin(0.5).setShadow(4, 6, '#000000', 0, false, true);

        // Start Button 
        let btnStart = createChoiceButton(this, 500, 400, 'เริ่มเล่น', () => {
            this.scene.start('CategoryMenu', { charId: 'pl2' }); 
        });

        // Settings Button
        let btnSettings = createChoiceButton(this, 500, 520, 'ตั้งค่า', () => {
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
        this.gameState.charId = data && data.charId ? data.charId : 2; // Default to Knight 02 if missing
    }

    preload() {
        let loadingText = this.add.text(500, 300, 'Loading Assets...', { fontFamily: '"PixelGame", Kanit', fontSize: '40px', color: '#ffffff' }).setOrigin(0.5);
        this.load.on('complete', () => {
            loadingText.destroy();
        });

        this.load.image('lvl_menu_bg', 'assets/back/bg2.png');
        
        // Match specific physical files that exist in the back folder
        const bgFiles = ['bg2.png', 'bg8.png', 'bg9.png', 'bg10.png', 'bg11.png'];
        bgFiles.forEach((filename, index) => {
            this.load.image('lvl_bg' + index, 'assets/back/' + filename);
        });
        
        // Load the gui2 buttons as a spritesheet (assuming 400 width, 132 height per frame for 4 rows)
        this.load.spritesheet('btn_gui', 'assets/gui2/PNG/Buttons.png', { frameWidth: 400, frameHeight: 132 });
        
        // Load pl2 character assets
        let idleIds = ['1540','1541','1542','1543','1544','1545','1546','1547'];
        idleIds.forEach((id, i) => { this.load.image(`pl2_idle${i}`, `assets/pl2/idle/IMG_${id}.PNG`); });

        // Load all dash/attack frames from assets/ef2/dash/
        const dashIds = ['1567', '1568', '1569', '1570', '1571', '1572', '1574', '1575', '1576', '1577', '1578', '1579', '1580', '1581', '1582', '1583'];
        dashIds.forEach((id) => {
            this.load.image(`pl2_dash_${id}`, `assets/ef2/dash/IMG_${id}.PNG`);
        });

        let deadIds = ['1586', '1587'];
        deadIds.forEach((id, i) => { this.load.image(`pl2_dead${i}`, `assets/pl2/dead eraser/IMG_${id}.PNG`); });
        
        // Single dummy frame for hurt
        this.load.image('pl2_hurt0', `assets/pl2/dead eraser/IMG_1586.PNG`);

        // Load skill frames
        const skillIds = ['1597', '1598', '1599'];
        skillIds.forEach(id => {
            this.load.image(`pl2_skill_${id}`, `assets/pl2/skill/IMG_${id}.PNG`);
        });

        // Load close-effect frames
        const closeEffectIds = ['1600', '1601', '1602'];
        closeEffectIds.forEach(id => {
            this.load.image(`pl2_close_${id}`, `assets/pl2/close-effect/IMG_${id}.PNG`);
        });

        // Load run frames
        const runIds = ['1607', '1608', '1609', '1610'];
        runIds.forEach(id => {
            this.load.image(`pl2_run_${id}`, `assets/pl2/run/IMG_${id}.PNG`);
        });

        for (let i = 0; i <= 9; i++) {
            this.load.image('t1_attack' + i, 'assets/en1/_PNG/1_TROLL/Troll_01_1_ATTACK_00' + i + '.png');
            this.load.image('t1_walk' + i, 'assets/en1/_PNG/1_TROLL/Troll_01_1_WALK_00' + i + '.png');
            this.load.image('t1_dead' + i, 'assets/en1/_PNG/1_TROLL/Troll_01_1_DIE_00' + i + '.png');
            this.load.image('t2_attack' + i, 'assets/en1/_PNG/2_TROLL/Troll_02_1_ATTACK_00' + i + '.png');
            this.load.image('t2_walk' + i, 'assets/en1/_PNG/2_TROLL/Troll_02_1_WALK_00' + i + '.png');
            this.load.image('t2_dead' + i, 'assets/en1/_PNG/2_TROLL/Troll_02_1_DIE_00' + i + '.png');
            this.load.image('t3_attack' + i, 'assets/en1/_PNG/3_TROLL/Troll_03_1_ATTACK_00' + i + '.png');
            this.load.image('t3_walk' + i, 'assets/en1/_PNG/3_TROLL/Troll_03_1_WALK_00' + i + '.png');
            this.load.image('t3_dead' + i, 'assets/en1/_PNG/3_TROLL/Troll_03_1_DIE_00' + i + '.png');
        }

        // Skeleton enemies for alternating stages
        for (let t = 1; t <= 3; t++) {
            for (let i = 0; i <= 23; i++) {
                let pad = i < 10 ? '0' + i : i;
                this.load.image('s' + t + '_walk' + i, 'assets/en2/Skeleton_Crusader_' + t + '/PNG/PNG Sequences/Walking/0_Skeleton_Crusader_Walking_0' + pad + '.png');
            }
            for (let i = 0; i <= 11; i++) {
                let pad = i < 10 ? '0' + i : i;
                this.load.image('s' + t + '_attack' + i, 'assets/en2/Skeleton_Crusader_' + t + '/PNG/PNG Sequences/Slashing/0_Skeleton_Crusader_Slashing_0' + pad + '.png');
            }
            for (let i = 0; i <= 14; i++) {
                let pad = i < 10 ? '0' + i : i;
                this.load.image('s' + t + '_dead' + i, 'assets/en2/Skeleton_Crusader_' + t + '/PNG/PNG Sequences/Dying/0_Skeleton_Crusader_Dying_0' + pad + '.png');
            }
        }

        // Golem enemies for Stage 3
        for (let t = 1; t <= 3; t++) {
            for (let i = 0; i <= 17; i++) {
                let pad = i < 10 ? '0' + i : i;
                this.load.image('g' + t + '_walk' + i, 'assets/en3/PNG/Golem_0' + t + '/PNG Sequences/Walking/Golem_0' + t + '_Walking_0' + pad + '.png');
            }
            for (let i = 0; i <= 11; i++) {
                let pad = i < 10 ? '0' + i : i;
                this.load.image('g' + t + '_attack' + i, 'assets/en3/PNG/Golem_0' + t + '/PNG Sequences/Attacking/Golem_0' + t + '_Attacking_0' + pad + '.png');
            }
            for (let i = 0; i <= 14; i++) {
                let pad = i < 10 ? '0' + i : i;
                this.load.image('g' + t + '_dead' + i, 'assets/en3/PNG/Golem_0' + t + '/PNG Sequences/Dying/Golem_0' + t + '_Dying_0' + pad + '.png');
            }
        }

        // Wraith enemies for Stage 4
        for (let t = 1; t <= 3; t++) {
            for (let i = 0; i <= 11; i++) {
                let pad = i < 10 ? '0' + i : i;
                this.load.image('w' + t + '_walk' + i, 'assets/en4/PNG/Wraith_0' + t + '/PNG Sequences/Walking/Wraith_0' + t + '_Moving Forward_0' + pad + '.png');
                this.load.image('w' + t + '_attack' + i, 'assets/en4/PNG/Wraith_0' + t + '/PNG Sequences/Attacking/Wraith_0' + t + '_Attack_0' + pad + '.png');
            }
            for (let i = 0; i <= 14; i++) {
                let pad = i < 10 ? '0' + i : i;
                this.load.image('w' + t + '_dead' + i, 'assets/en4/PNG/Wraith_0' + t + '/PNG Sequences/Dying/Wraith_0' + t + '_Dying_0' + pad + '.png');
            }
        }
        
        for (let i = 1; i <= 8; i++) {
            let pI = i < 10 ? '0' + i : i;
            this.load.image('ef_fireball' + i, 'assets/ef2/Fire Ball/PNG/Fire Ball_Frame_' + pI + '.png');
            this.load.image('ef_firearrow' + i, 'assets/ef2/Fire Arrow/PNG/Fire Arrow_Frame_' + pI + '.png');
        }
        for (let i = 1; i <= 12; i++) {
            let pI = i < 10 ? '0' + i : i;
            this.load.image('ef_waterball' + i, 'assets/ef2/Water Ball/PNG/Water Ball_Frame_' + pI + '.png');
        }
        for (let i = 1; i <= 10; i++) {
            this.load.image('ef3_exp' + i, 'assets/ef3/PNG/Explosion/Explosion' + i + '.png');
            this.load.image('ef3_blue' + i, 'assets/ef3/PNG/Explosion_blue_circle/Explosion_blue_circle' + i + '.png');
            this.load.image('ef3_nuke' + i, 'assets/ef3/PNG/Nuclear_explosion/Nuclear_explosion' + i + '.png');
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
        this.game.loop.targetFps = 60; // Restore standard framerate on damage/gameover
        if (this.gameState.isGameOver) return;
        this.gameState.hp--;
        this.updateHpBar();
        
        // Flash screen red
        let dmgOverlay = this.add.graphics().fillStyle(0xff0000, 0.3).fillRect(0,0,1000,600);
        this.tweens.add({ targets: dmgOverlay, alpha: 0, duration: 400, onComplete: ()=>dmgOverlay.destroy() });

        if (this.gameState.hp <= 0) {
            this.gameState.isGameOver = true;
            this.gameState.player.play(this.gameState.animHurt);
            let doom = this.add.sprite(this.gameState.player.x, this.gameState.player.y - 160, 'lt_b1').setOrigin(0.5).setDepth(20);
            doom.setScale(2.5); 
            doom.play('ef_lightning');
            doom.once('animationcomplete', () => { 
                doom.destroy(); 
                this.gameOver();
            });
        } else {
            // Take hit but survive
            this.gameState.player.play(this.gameState.animHurt);
            this.cameras.main.shake(200, 0.01);
            
            // Fade out the current enemy and spawn a fresh one for the next question
            this.tweens.add({
                targets: this.gameState.zombie,
                alpha: 0,
                duration: 600,
                onComplete: () => {
                    this.gameState.player.play(this.gameState.animIdle);
                    this.gameState.isAnimating = false;
                    this.nextQuiz(true); // pass true or false doesn't matter, force new question
                }
            });
        }
    }

    create() {
        let safeBgIdx = this.gameState.currentStageIdx % 5;
        this.gameState.bg = this.add.image(500, 300, 'lvl_bg' + safeBgIdx);
        this.gameState.bg.setDisplaySize(1000, 600);

        // --- STYLIZED RPG HUD ---
        
        // 1. Player Info Frame (Top Left)
        let hudFrame = this.add.graphics();
        hudFrame.fillStyle(0x222222, 0.85);
        hudFrame.fillRoundedRect(15, 15, 300, 80, 12);
        hudFrame.lineStyle(4, 0x51b87a);
        hudFrame.strokeRoundedRect(15, 15, 300, 80, 12);
        
        // Avatar
        let avatarKey = this.gameState.charId === 'pl2' ? 'pl2_idle0' : `k${this.gameState.charId}_idle0`;
        this.add.image(55, 55, avatarKey).setScale(0.18).setOrigin(0.5);
        
        // HP Label
        this.add.text(100, 35, 'HP', { fontFamily: 'Kanit', fontSize: '26px', color: '#ff5555', padding: { top: 5, bottom: 5 } });

        // Health Bar Implementation
        let hpBg = this.add.graphics().fillStyle(0x440000, 1).fillRect(140, 42, 140, 20);
        this.gameState.hpBar = this.add.graphics();
        this.updateHpBar = () => {
            this.gameState.hpBar.clear();
            this.gameState.hpBar.fillStyle(0xff3333, 1);
            let w = (this.gameState.hp / this.gameState.maxHp) * 140;
            if (w > 0) this.gameState.hpBar.fillRect(140, 42, w, 20);
        };
        this.updateHpBar();
        
        // Removed Exp Bar as requested

        // 2. Stage/Level Box (Center)
        let stageFrame = this.add.graphics();
        stageFrame.fillStyle(0x111111, 0.85);
        stageFrame.fillRoundedRect(350, 15, 300, 45, 10);
        stageFrame.lineStyle(2, 0x51b87a);
        stageFrame.strokeRoundedRect(350, 15, 300, 45, 10);

        this.gameState.stageText = this.add.text(500, 36, this.gameState.vocabData[this.gameState.currentStageIdx].stageName, {
            fontFamily: 'Kanit', fontSize: '28px', color: '#ffffff', padding: { top: 10, bottom: 10 }
        }).setOrigin(0.5);

        // 3. Score & Settings Box (Top Right)
        let scoreFrame = this.add.graphics();
        scoreFrame.fillStyle(0x222222, 0.85);
        scoreFrame.fillRoundedRect(720, 15, 200, 50, 10);
        scoreFrame.lineStyle(4, 0x51b87a);
        scoreFrame.strokeRoundedRect(720, 15, 200, 50, 10);
        
        this.gameState.scoreText = this.add.text(820, 40, 'SCORE: 0', {
            fontFamily: '"PixelGame", Kanit', fontSize: '28px', color: '#ffea00'
        }).setOrigin(0.5);

        // Pause Button
        let pauseBtn = this.add.text(960, 40, '⏸', { fontSize: '40px', color: '#ffffff' })
            .setOrigin(0.5)
            .setInteractive({useHandCursor: true});

        pauseBtn.on('pointerdown', () => {
            pauseBtn.setAlpha(0.6);
            setTimeout(() => pauseBtn.setAlpha(1), 100);
            this.scene.pause();
            this.scene.launch('PauseMenu');
        });

        this.gameState.wordText = this.add.text(500, 155, 'Start', { 
            fontSize: '65px', 
            fontFamily: 'Mitr', 
            fontWeight: 'bold',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 10,
            padding: { top: 15, bottom: 15 }
        }).setOrigin(0.5);

        // Setup Player Animation (pl2 eraser)
        this.gameState.animIdle = `pl2_idle`;
        this.gameState.animAttack = `pl2_attack`;
        this.gameState.animDead = `pl2_dead`;
        this.gameState.animHurt = `pl2_hurt`;

        if (!this.anims.exists(this.gameState.animIdle)) {
            this.anims.create({
                key: this.gameState.animIdle,
                frames: Array.from({length: 8}, (_, i) => ({ key: `pl2_idle${i}` })),
                frameRate: 2.5, // Reduced to 1 frame per second
                repeat: -1
            });
        }

        // Projectile skill animation
        if (!this.anims.exists('pl2_skill_anim')) {
            this.anims.create({
                key: 'pl2_skill_anim',
                frames: [
                    { key: 'pl2_skill_1597' },
                    { key: 'pl2_skill_1598' },
                    { key: 'pl2_skill_1599' }
                ],
                frameRate: 10,
                repeat: -1
            });
        }

        // Close-effect hit animation
        if (!this.anims.exists('pl2_close_effect_anim')) {
            this.anims.create({
                key: 'pl2_close_effect_anim',
                frames: [
                    { key: 'pl2_close_1600' },
                    { key: 'pl2_close_1601' },
                    { key: 'pl2_close_1602' }
                ],
                frameRate: 15,
                repeat: 0
            });
        }

        // Run animation
        if (!this.anims.exists('pl2_run_anim')) {
            this.anims.create({
                key: 'pl2_run_anim',
                frames: [
                    { key: 'pl2_run_1607' },
                    { key: 'pl2_run_1608' },
                    { key: 'pl2_run_1609' },
                    { key: 'pl2_run_1610' }
                ],
                frameRate: 10,
                repeat: -1
            });
        }
        // 1. Charge animation
        if (!this.anims.exists('pl2_charge')) {
            this.anims.create({
                key: 'pl2_charge',
                frames: [{ key: 'pl2_dash_1572' }],
                frameRate: 15,
                repeat: 0
            });
        }

        // 2. Dash animation
        if (!this.anims.exists('pl2_dash_anim')) {
            this.anims.create({
                key: 'pl2_dash_anim',
                frames: [
                    { key: 'pl2_dash_1574' },
                    { key: 'pl2_dash_1575' },
                    { key: 'pl2_dash_1576' }
                ],
                frameRate: 15,
                repeat: -1
            });
        }

        // 3. Melee attack animations
        const meleeFrames = ['1577', '1578', '1580', '1581', '1583'];
        meleeFrames.forEach(id => {
            if (!this.anims.exists(`pl2_melee_${id}`)) {
                this.anims.create({
                    key: `pl2_melee_${id}`,
                    frames: [{ key: `pl2_dash_${id}` }],
                    frameRate: 15,
                    repeat: 0
                });
            }
        });

        // 4. Ranged Charge animation (IMG_1567 to IMG_1570)
        if (!this.anims.exists('pl2_ranged_charge')) {
            this.anims.create({
                key: 'pl2_ranged_charge',
                frames: [
                    { key: 'pl2_dash_1567' },
                    { key: 'pl2_dash_1568' },
                    { key: 'pl2_dash_1569' },
                    { key: 'pl2_dash_1570' }
                ],
                frameRate: 15,
                repeat: 0
            });
        }

        // 5. Ranged Release animations (IMG_1571, IMG_1579, IMG_1582)
        const rangedReleaseFrames = ['1571', '1579', '1582'];
        rangedReleaseFrames.forEach(id => {
            if (!this.anims.exists(`pl2_ranged_release_${id}`)) {
                this.anims.create({
                    key: `pl2_ranged_release_${id}`,
                    frames: [{ key: `pl2_dash_${id}` }],
                    frameRate: 15,
                    repeat: 0
                });
            }
        });
        if (!this.anims.exists(this.gameState.animDead)) {
            this.anims.create({
                key: this.gameState.animDead,
                frames: Array.from({length: 2}, (_, i) => ({ key: `pl2_dead${i}` })),
                frameRate: 5,
                repeat: 0
            });
        }
        if (!this.anims.exists(this.gameState.animHurt)) {
            this.anims.create({
                key: this.gameState.animHurt,
                frames: [ { key: 'pl2_hurt0' } ],
                frameRate: 10,
                repeat: 0
            });
        }
        
        for (let t = 1; t <= 3; t++) {
            if (!this.anims.exists('troll' + t + '_walk')) {
                this.anims.create({
                    key: 'troll' + t + '_walk',
                    frames: Array.from({length: 10}, (_, i) => ({ key: 't' + t + '_walk' + i })),
                    frameRate: 15,
                    repeat: -1
                });
                this.anims.create({
                    key: 'troll' + t + '_attack',
                    frames: Array.from({length: 10}, (_, i) => ({ key: 't' + t + '_attack' + i })),
                    frameRate: 15,
                    repeat: 0
                });
                this.anims.create({
                    key: 'troll' + t + '_dead',
                    frames: Array.from({length: 10}, (_, i) => ({ key: 't' + t + '_dead' + i })),
                    frameRate: 15,
                    repeat: 0
                });
            }

            if (!this.anims.exists('skel' + t + '_walk')) {
                this.anims.create({
                    key: 'skel' + t + '_walk',
                    frames: Array.from({length: 24}, (_, i) => ({ key: 's' + t + '_walk' + i })),
                    frameRate: 20,
                    repeat: -1
                });
                this.anims.create({
                    key: 'skel' + t + '_attack',
                    frames: Array.from({length: 12}, (_, i) => ({ key: 's' + t + '_attack' + i })),
                    frameRate: 15,
                    repeat: 0
                });
                this.anims.create({
                    key: 'skel' + t + '_dead',
                    frames: Array.from({length: 15}, (_, i) => ({ key: 's' + t + '_dead' + i })),
                    frameRate: 15,
                    repeat: 0
                });
                
                // Golem
                this.anims.create({ key: 'golem' + t + '_walk', frames: Array.from({length: 18}, (_, i) => ({ key: 'g' + t + '_walk' + i })), frameRate: 20, repeat: -1 });
                this.anims.create({ key: 'golem' + t + '_attack', frames: Array.from({length: 12}, (_, i) => ({ key: 'g' + t + '_attack' + i })), frameRate: 15, repeat: 0 });
                this.anims.create({ key: 'golem' + t + '_dead', frames: Array.from({length: 15}, (_, i) => ({ key: 'g' + t + '_dead' + i })), frameRate: 15, repeat: 0 });
                
                // Wraith
                this.anims.create({ key: 'wraith' + t + '_walk', frames: Array.from({length: 12}, (_, i) => ({ key: 'w' + t + '_walk' + i })), frameRate: 15, repeat: -1 });
                this.anims.create({ key: 'wraith' + t + '_attack', frames: Array.from({length: 12}, (_, i) => ({ key: 'w' + t + '_attack' + i })), frameRate: 15, repeat: 0 });
                this.anims.create({ key: 'wraith' + t + '_dead', frames: Array.from({length: 15}, (_, i) => ({ key: 'w' + t + '_dead' + i })), frameRate: 15, repeat: 0 });
            }
        }

        let createEf2 = (key, framesKey, length) => {
            if (!this.anims.exists(key)) {
                this.anims.create({
                    key: key,
                    frames: Array.from({length: length}, (_, i) => ({ key: framesKey + (i + 1) })),
                    frameRate: 10,
                    repeat: -1
                });
            }
        };
        createEf2('ef2_fireball_anim', 'ef_fireball', 8);
        createEf2('ef2_waterball_anim', 'ef_waterball', 12);
        createEf2('ef2_firearrow_anim', 'ef_firearrow', 8);

        let createEf3 = (key, framesKey) => {
            if (!this.anims.exists(key)) {
                this.anims.create({
                    key: key,
                    frames: Array.from({length: 10}, (_, i) => ({ key: framesKey + (i + 1) })),
                    frameRate: 20,
                    repeat: 0
                });
            }
        };
        createEf3('ef3_exp_anim', 'ef3_exp');
        createEf3('ef3_blue_anim', 'ef3_blue');
        createEf3('ef3_nuke_anim', 'ef3_nuke');

        if (!this.anims.exists('ef_lightning')) {
            this.anims.create({
                key: 'ef_lightning',
                frames: [
                    { key: 'lt_b1' }, { key: 'lt_b2' }, { key: 'lt_b3' }, { key: 'lt_b4' }, { key: 'lt_b5' },
                    { key: 'lt_c1' }, { key: 'lt_c2' }, { key: 'lt_c3' }, { key: 'lt_c4' }, { key: 'lt_c5' }, { key: 'lt_c6' },
                    { key: 'lt_c1' }, { key: 'lt_c2' }, { key: 'lt_c3' }, { key: 'lt_c4' }, { key: 'lt_c5' }, { key: 'lt_c6' },
                    { key: 'lt_e1' }, { key: 'lt_e2' }, { key: 'lt_e3' }
                ],
                frameRate: 20,
                repeat: 0
            });
        }

        // Set origin to bottom (0.5, 1) and Y position to 515 so characters are always grounded.
        this.gameState.player = this.add.sprite(200, 515, `pl2_idle0`).setOrigin(0.5, 1).setDepth(2);
        
        let origPlay = this.gameState.player.play.bind(this.gameState.player);
        this.gameState.player.play = (key, ignoreIfPlaying) => {
            // Normalize scales based on frame dimensions to keep height uniform (approx. 240px)
            if (key === this.gameState.animIdle) {
                this.gameState.player.setScale(1.0);
            } else if (key === 'pl2_run_anim') {
                this.gameState.player.setScale(1.33); // 240 / 180 = 1.33
            } else if (key === this.gameState.animDead || key === this.gameState.animHurt) {
                this.gameState.player.setScale(1.3); // 240 / 186 = 1.30
            } else if (
                key === 'pl2_charge' || 
                key === 'pl2_dash_anim' || 
                key === 'pl2_ranged_charge' || 
                key.startsWith('pl2_melee_') || 
                key.startsWith('pl2_ranged_release_')
            ) {
                this.gameState.player.setScale(1.80); // Reduced by 0.5 (was 2.55)
            } else {
                this.gameState.player.setScale(1.0);
            }
            return origPlay(key, ignoreIfPlaying);
        };
        
        this.gameState.player.play(this.gameState.animIdle);
        
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
            // Trigger Boss Fight instead of just moving to next stage
            this.gameState.isBossFight = true;
            this.gameState.bossHp = this.gameState.bossMaxHp;
            
            let bossWarning = this.add.text(500, 300, 'WARNING: MINI-BOSS!', { 
                fontFamily: '"PixelGame", Kanit', fontSize: '70px', color: '#ff0000', stroke: '#fff', strokeThickness: 8 
            }).setOrigin(0.5).setDepth(20);
            
            // Flash red
            let flash = this.add.graphics().fillStyle(0xff0000, 0.4).fillRect(0,0,1000,600).setDepth(19);
            this.tweens.add({ targets: flash, alpha: 0, duration: 200, yoyo: true, repeat: 3, onComplete: () => flash.destroy() });
            
            this.tweens.add({
                targets: bossWarning, scale: 1.2, alpha: 0, duration: 2000, ease: 'Power2',
                onComplete: () => bossWarning.destroy()
            });
            
            this.gameState.stageText.setText('BOSS: ' + currentStageData.stageName);
            this.gameState.stageText.setColor('#ff4444');
        } else if (this.gameState.isBossFight && this.gameState.bossHp <= 0) {
            // Defeated Boss -> Next Stage transition
            this.gameState.isAnimating = true; // Block UI clicks during transition
            this.gameState.isBossFight = false;
            this.gameState.scoreInStage = 0;
            this.gameState.currentStageIdx++;
            
            if (this.gameState.currentStageIdx >= this.gameState.vocabData.length) {
                this.gameState.currentStageIdx = 0; // Loop back
            }
            this.gameState.quizQueue = []; // Clear queue

            let nsText = this.add.text(500, 300, 'STAGE CLEAR!', { fontFamily: '"PixelGame", Kanit', fontSize: '80px', color: '#00ff00', stroke: '#000', strokeThickness: 8 }).setOrigin(0.5).setDepth(20);
            this.tweens.add({
                targets: nsText, y: 200, alpha: 0, duration: 2000,
                onComplete: () => nsText.destroy()
            });

            // Player plays run animation and runs off-screen to the right
            this.gameState.player.play('pl2_run_anim');
            this.tweens.add({
                targets: this.gameState.player,
                x: 1100,
                duration: 1500,
                ease: 'Linear',
                onComplete: () => {
                    // Update Background and Stage labels
                    let bgIndex = this.gameState.currentStageIdx % 4; 
                    this.gameState.bg.setTexture('lvl_bg' + bgIndex);
                    
                    let stageName = this.gameState.vocabData[this.gameState.currentStageIdx].stageName;
                    this.gameState.stageText.setText(stageName);
                    this.gameState.stageText.setColor('#ffffff');

                    // Player spawns off-screen left and runs back to x = 200
                    this.gameState.player.x = -100;
                    this.tweens.add({
                        targets: this.gameState.player,
                        x: 200,
                        duration: 1000,
                        ease: 'Linear',
                        onComplete: () => {
                            this.gameState.player.play(this.gameState.animIdle);
                            this.gameState.isAnimating = false; // Enable UI clicks
                            this.nextQuiz(); // Set up new question
                        }
                    });
                }
            });
            return; // Wait for tween completion callback to execute nextQuiz
        }

        // Fill and shuffle the queue if it's empty
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

        // Generate 4 English Choices (1 correct, 3 wrong from same stage)
        let choices = [];
        choices.push({ text: quiz.eng, isCorrect: true });

        // Get pool of ALL words in current stage to pick wrong choices
        let allWords = this.gameState.vocabData[this.gameState.currentStageIdx].words;
        let wrongCandidates = allWords.filter(w => w.eng !== quiz.eng);
        
        // Shuffle wrong candidates and pick 3
        for (let i = wrongCandidates.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [wrongCandidates[i], wrongCandidates[j]] = [wrongCandidates[j], wrongCandidates[i]];
        }
        
        choices.push({ text: wrongCandidates[0].eng, isCorrect: false });
        choices.push({ text: wrongCandidates[1].eng, isCorrect: false });
        choices.push({ text: wrongCandidates[2].eng, isCorrect: false });

        // Shuffle the 4 choices
        for (let i = choices.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [choices[i], choices[j]] = [choices[j], choices[i]];
        }

        // Apply choices to buttons
        this.gameState.btn1.text.setText(choices[0].text);
        this.gameState.btn2.text.setText(choices[1].text);
        this.gameState.btn3.text.setText(choices[2].text);
        this.gameState.btn4.text.setText(choices[3].text);

        // Record which button is correct
        this.gameState.correctBtn = choices.findIndex(c => c.isCorrect) + 1;

        if (this.gameState.zombie) {
            this.gameState.zombie.destroy();
        }
        
        // Spawn Monster based on Stage
        let safeIdx = this.gameState.currentStageIdx % 4; // Safely map 6 stages to 4 monster types
        let tIdx = Math.floor(Math.random() * 3) + 1; // Random 1, 2, or 3
        
        // Original Scales
        let monsterMap = [
            { key: 'troll', prefix: 't', baseScale: 0.35 },
            { key: 'skel', prefix: 's', baseScale: 0.28 },
            { key: 'golem', prefix: 'g', baseScale: 0.38 },
            { key: 'wraith', prefix: 'w', baseScale: 0.38 } 
        ];

        let mConfig = monsterMap[safeIdx] || monsterMap[0]; // safety fallback
        
        this.gameState.currentMonsterKey = mConfig.key + tIdx;
        
        // If Boss Fight, scale up the monster!
        let finalScale = this.gameState.isBossFight ? (mConfig.baseScale * 1.5) : mConfig.baseScale;
        
        // Custom Y positions for each stage (Stage 1 to 6)
        let stageYCoords = [380, 420, 430, 420, 420, 420];
        let spawnY = stageYCoords[this.gameState.currentStageIdx] || 420; // fallback to 420

        this.gameState.zombie = this.add.sprite(950, spawnY, mConfig.prefix + tIdx + '_walk0').setOrigin(0.5).setDepth(2);
        this.gameState.zombie.setFlipX(true); 
        this.gameState.zombie.setScale(finalScale); 
        this.gameState.zombie.play(this.gameState.currentMonsterKey + '_walk');
        
        // Boss HP Bar visuals above boss head
        if (this.gameState.bossHpGroup) this.gameState.bossHpGroup.destroy(true);
        if (this.gameState.isBossFight) {
            this.gameState.bossHpGroup = this.add.group();
            let bHpBg = this.add.graphics();
            bHpBg.fillStyle(0x000000, 0.8).fillRect(-50, -100, 100, 10);
            let bHpFill = this.add.graphics();
            bHpFill.fillStyle(0xff0000, 1).fillRect(-50, -100, (this.gameState.bossHp / this.gameState.bossMaxHp) * 100, 10);
            
            // Container to sync with zombie movement
            let hpContainer = this.add.container(this.gameState.zombie.x, this.gameState.zombie.y);
            hpContainer.add([bHpBg, bHpFill]);
            this.gameState.bossHpGroup.add(hpContainer);
            this.gameState.zombie.hpContainer = hpContainer; // link it
        }
        
        // Zombie walks towards player using setting speed
        let walkDuration = parseInt(localStorage.getItem('zombieDifficulty')) || 10000;
        if (this.gameState.isBossFight) walkDuration *= 1.5; // Boss walks a bit slower so player has time to answer 3 questions
        
        this.gameState.zombieTween = this.tweens.add({
            targets: this.gameState.zombie,
            x: 330, 
            y: spawnY,
            duration: walkDuration, // dynamic difficulty
            onUpdate: () => {
                if(this.gameState.zombie && this.gameState.zombie.hpContainer) {
                    this.gameState.zombie.hpContainer.x = this.gameState.zombie.x;
                }
            },
            onComplete: () => {
                if (!this.gameState.isAnimating && !this.gameState.isGameOver) {
                    this.gameState.isAnimating = true;

                    // Enemy strikes!
                    this.game.loop.targetFps = 15; // Reduce framerate to 15 during attack
                    this.gameState.zombie.play(this.gameState.currentMonsterKey + '_attack');

                    // Call integrated damage logic at the apex of attack
                    setTimeout(() => {
                        // Boss deals 2 damage!
                        if (this.gameState.isBossFight) {
                            this.gameState.hp--;
                            this.updateHpBar();
                        }
                        this.playerTakeDamage();
                        this.game.loop.targetFps = 60; // Restore standard framerate
                    }, 350); 
                }
            }
        });
    }

    dealAttackDamage() {
        if (this.gameState.isGameOver) return;

        // Play pl2 close-effect directly on the zombie (grounded and scaled up)
        let boom = this.add.sprite(this.gameState.zombie.x, 515, 'pl2_close_1600').setOrigin(0.5, 1).setDepth(15);
        boom.setScale(2.5); // Scale up for larger visual impact
        boom.play('pl2_close_effect_anim');
        boom.once('animationcomplete', () => { boom.destroy(); });

        if (this.gameState.isBossFight) {
            this.gameState.bossHp--;
            // Flash boss white for damage indication
            this.gameState.zombie.setTintFill(0xffffff);
            setTimeout(() => this.gameState.zombie.clearTint(), 150);
            
            if (this.gameState.bossHp > 0) {
                // Boss still ALIVE - Reload another question immediately
                setTimeout(() => {
                    this.nextQuiz(); // Note: we bypassed the scoreInStage logic in nextQuiz, it will preserve isBossFight
                }, 500);
                return; // Stop here, don't play dead anim yet
            }
        }

        // NORMAL KILL OR BOSS DEFEATED
        if (this.gameState.bossHpGroup) this.gameState.bossHpGroup.destroy(true); // Clear boss HP bar

        this.gameState.zombie.play(this.gameState.currentMonsterKey + '_dead');
        this.tweens.add({
            targets: this.gameState.zombie,
            alpha: 0,
            y: this.gameState.zombie.y + 20, 
            duration: 800, 
            onComplete: () => {
                if (this.gameState.isBossFight) {
                    this.gameState.coins += 50; // Boss gives 50 coins
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
            // Correct
            if (this.gameState.zombieTween) this.gameState.zombieTween.stop();

            // Randomly choose between Melee (dash) or Ranged (projectile)
            let isMelee = Math.random() < 0.5;

            this.game.loop.targetFps = 15; // Reduce framerate to 15 during attack

            if (isMelee) {
                // --- MELEE FLOW ---
                // Charge phase: play pl2_charge and stay still for 150ms
                this.gameState.player.play('pl2_charge');

                this.time.delayedCall(150, () => {
                    if (this.gameState.isGameOver) return;

                    // Dash phase: play pl2_dash_anim and tween to zombie
                    this.gameState.player.play('pl2_dash_anim');
                    let targetX = Math.max(200, this.gameState.zombie.x - 80);

                    this.tweens.add({
                        targets: this.gameState.player,
                        x: targetX,
                        duration: 150,
                        ease: 'Cubic.easeOut',
                        onComplete: () => {
                            // Melee Hit phase: reach target, play random melee animation
                            const meleeKeys = ['pl2_melee_1577', 'pl2_melee_1578', 'pl2_melee_1580', 'pl2_melee_1581', 'pl2_melee_1583'];
                            let randMeleeKey = meleeKeys[Math.floor(Math.random() * meleeKeys.length)];
                            this.gameState.player.play(randMeleeKey);

                            // Apply hit explosion and damage on the zombie immediately
                            this.dealAttackDamage();

                            // Hold melee position for 200ms, then return back to original position
                            this.time.delayedCall(200, () => {
                                if (this.gameState.isGameOver) return;

                                // Tween back playing idle
                                this.gameState.player.play(this.gameState.animIdle);
                                this.tweens.add({
                                    targets: this.gameState.player,
                                    x: 200,
                                    duration: 150,
                                    ease: 'Cubic.easeIn',
                                    onComplete: () => {
                                        this.game.loop.targetFps = 60; // Restore standard framerate
                                    }
                                });
                            });
                        }
                    });
                });
            } else {
                // --- RANGED FLOW ---
                // Charge phase: play pl2_ranged_charge at x = 200
                this.gameState.player.play('pl2_ranged_charge');

                // When the charge animation completes, play the ranged release animation and fire the projectile
                this.gameState.player.once('animationcomplete-pl2_ranged_charge', () => {
                    if (this.gameState.isGameOver) return;

                    // Release phase: play random ranged release posture
                    let releaseKeys = ['pl2_ranged_release_1571', 'pl2_ranged_release_1579', 'pl2_ranged_release_1582'];
                    let randReleaseKey = releaseKeys[Math.floor(Math.random() * releaseKeys.length)];
                    this.gameState.player.play(randReleaseKey);

                    // When release animation completes, go back to idle and restore target FPS
                    this.gameState.player.once('animationcomplete', () => {
                        this.gameState.player.play(this.gameState.animIdle);
                        this.game.loop.targetFps = 60; // Restore standard framerate
                    });

                    // Spawn and shoot a projectile (using pl2_skill_anim)
                    let bullet = this.add.sprite(280, 400, 'pl2_skill_1597').setOrigin(0.5).setDepth(5);
                    bullet.setScale(0.8);
                    bullet.play('pl2_skill_anim');

                    this.tweens.add({
                        targets: bullet,
                        x: this.gameState.zombie.x,
                        duration: 250,
                        onComplete: () => {
                            bullet.destroy();
                            this.dealAttackDamage(); // reuse same damage & death trigger logic
                        }
                    });
                });
            }
        } else {
            // Wrong: Zombie casts lightning on the player
            if (this.gameState.zombieTween) this.gameState.zombieTween.stop();
            
            // Enemy strikes instantly due to wrong answer!
            this.game.loop.targetFps = 15; // Reduce framerate to 15 during attack
            this.gameState.zombie.play(this.gameState.currentMonsterKey + '_attack');
            setTimeout(() => {
                if (this.gameState.isBossFight) {
                    this.gameState.hp--; // Boss hits harder
                    this.updateHpBar();
                }
                this.playerTakeDamage();
                this.game.loop.targetFps = 60; // Restore standard framerate
            }, 350);
        }
    }

    gameOver() {
        this.gameState.isGameOver = true;
        
        // Play Dead Animation and bring character forward
        this.gameState.player.play(this.gameState.animDead);
        this.gameState.player.setDepth(11);
        if (this.gameState.zombie) {
            this.gameState.zombie.setDepth(11); // Bring zombie forward too so interaction looks consistent
        }

        let stageStr = this.gameState.vocabData[this.gameState.currentStageIdx].stageName;

        this.gameState.player.once('animationcomplete', () => {
            setTimeout(() => {
                this.scene.start('GameOverScene', { 
                    score: this.gameState.coins, 
                    stageName: stageStr 
                });
            }, 500); // 0.5s dramatic pause after dying
        });
    }
}

class PauseMenu extends Phaser.Scene {
    constructor() {
        super({ key: 'PauseMenu' });
    }

    create() {
        // Pause Background
        let bg = this.add.image(500, 300, 'lvl_menu_bg');
        bg.setDisplaySize(1000, 600);
        
        // Dim background overlay
        let overlay = this.add.graphics();
        overlay.fillStyle(0x000000, 0.7);
        overlay.fillRect(0, 0, 1000, 600);

        this.add.text(500, 150, 'หยุดเกมชั่วคราว', {
            fontFamily: '"PixelGame", "Courier New", Courier, Kanit',
            fontSize: '60px',
            color: '#ffea00',
            strokeThickness: 0
        }).setOrigin(0.5).setShadow(4, 6, '#000000', 0, false, true);

        // Resume Button
        createChoiceButton(this, 500, 300, 'เล่นต่อ', () => {
            this.scene.stop();
            this.scene.resume('GamePlay');
        });

        // Restart Button
        createChoiceButton(this, 300, 450, 'เริ่มใหม่', () => {
            this.scene.stop();
            this.scene.get('GamePlay').scene.restart();
        });

        // Main Menu Button
        createChoiceButton(this, 700, 450, 'เมนูหลัก', () => {
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
    shadow.fillStyle(0x000000, 0.3);
    shadow.fillRoundedRect(cx + 6, cy + 8, w, h, 6);

    // Black Outer Border
    let bOuter = scene.add.graphics();
    bOuter.fillStyle(0x1a1a1a, 1);
    bOuter.fillRoundedRect(cx, cy, w, h, 6);
    
    // Dark Green lower shadow
    let bDark = scene.add.graphics();
    bDark.fillStyle(0x367f57, 1);
    bDark.fillRoundedRect(cx + 4, cy + 4, w - 8, h - 8, 4);

    // Main Green Base
    let bBase = scene.add.graphics();
    bBase.fillStyle(0x51b87a, 1);
    bBase.fillRoundedRect(cx + 4, cy + 4, w - 8, h - 14, 4);

    // Top Light Green Highlight
    let bLight = scene.add.graphics();
    bLight.fillStyle(0x88dbac, 1);
    bLight.fillRoundedRect(cx + 4, cy + 4, w - 8, 8, 4);

    let btnText = scene.add.text(0, -2, textStr, {
        fontSize: fSize,
        fontFamily: 'Kanit',
        fontWeight: 'bold',
        color: '#000000',
        padding: { top: 10, bottom: 10 },
        strokeThickness: 0 
    }).setOrigin(0.5);

    container.add([shadow, bOuter, bDark, bBase, bLight, btnText]);

    let hitZone = scene.add.zone(0, 0, w, h).setInteractive({ useHandCursor: true });
    hitZone.on('pointerdown', () => {
        bBase.fillStyle(0x367f57, 1); bBase.fillRoundedRect(cx + 4, cy + 4, w - 8, h - 14, 4);
        bLight.fillStyle(0x51b87a, 1); bLight.fillRoundedRect(cx + 4, cy + 4, w - 8, 8, 4);
        container.y += 4;
        setTimeout(() => { 
            bBase.fillStyle(0x51b87a, 1); bBase.fillRoundedRect(cx + 4, cy + 4, w - 8, h - 14, 4);
            bLight.fillStyle(0x88dbac, 1); bLight.fillRoundedRect(cx + 4, cy + 4, w - 8, 8, 4);
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
        let bg = this.add.image(500, 300, 'lvl_menu_bg');
        bg.setDisplaySize(1000, 600);
        let overlay = this.add.graphics();
        overlay.fillStyle(0x000000, 0.85);
        overlay.fillRect(0, 0, 1000, 600);

        this.add.text(500, 100, 'ตั้งค่าความยาก', {
            fontFamily: '"PixelGame", "Courier New", Courier, Kanit',
            fontSize: '60px',
            color: '#ffea00',
            strokeThickness: 0
        }).setOrigin(0.5).setShadow(4, 6, '#000000', 0, false, true);

        // Difficulty Setting
        let difficulty = parseInt(localStorage.getItem('zombieDifficulty')) || 10000;
        let diffLabel = this.add.text(500, 230, 'ความเร็วซอมบี้: ' + (difficulty === 10000 ? 'ช้า (10วิ)' : (difficulty === 6000 ? 'ปานกลาง (6วิ)' : 'เร็วทะลุนรก (3วิ)')), {
            fontFamily: '"PixelGame", Kanit',
            fontSize: '36px',
            color: '#ffffff',
            strokeThickness: 0
        }).setOrigin(0.5).setShadow(2, 4, '#000', 0, false, true);

        createChoiceButton(this, 500, 320, 'เปลี่ยนระดับ', () => {
            if(difficulty === 10000) difficulty = 6000;
            else if(difficulty === 6000) difficulty = 3000;
            else difficulty = 10000;
            localStorage.setItem('zombieDifficulty', difficulty);
            diffLabel.setText('ความเร็วซอมบี้: ' + (difficulty === 10000 ? 'ช้า (10วิ)' : (difficulty === 6000 ? 'ปานกลาง (6วิ)' : 'เร็วทะลุนรก (3วิ)')));
        });

        // Reset Score Button
        createChoiceButton(this, 500, 420, 'รีเซ็ตคะแนน', () => {
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
        createChoiceButton(this, 500, 520, 'ย้อนกลับ', () => {
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
        // RPG-themed Dark Void + Bloody Horizon Grid effect (Simplified to dark gradient)
        let bg = this.add.graphics();
        bg.fillGradientStyle(0x111111, 0x111111, 0x330000, 0x330000, 1);
        bg.fillRect(0, 0, 1000, 600);

        // RPG Embers/Ashes rising
        let particles = this.add.particles(0, 0, 'btn_gui', { 
            x: { min: 0, max: 1000 },
            y: { min: 600, max: 620 },
            lifespan: { min: 2000, max: 4000 },
            speedY: { min: -100, max: -20 },
            speedX: { min: -20, max: 20 },
            scale: { start: 0.1, end: 0 }, // tiny dots
            alpha: { start: 0.8, end: 0 },
            tint: 0xff3300,
            blendMode: 'ADD'
        });

        // Title: GAME OVER (Retro Style: Thick Stroke, Yellow Top, Red Bottom)
        let titleText = this.add.text(500, 150, 'GAME OVER', {
            fontFamily: '"PixelGame", "Courier New", Courier',
            fontSize: '120px',
            stroke: '#000000',
            strokeThickness: 16
        }).setOrigin(0.5).setShadow(0, 8, '#000', 0, false, true);

        // Create Gradient Fill for the Title
        let gradient = titleText.context.createLinearGradient(0, 0, 0, titleText.height);
        gradient.addColorStop(0, '#ffff00');
        gradient.addColorStop(0.5, '#ffff00');
        gradient.addColorStop(0.51, '#ff0000');
        gradient.addColorStop(1, '#ff0000');
        titleText.setFill(gradient);

        this.add.text(500, 280, 'จบเกมที่ด่าน: ' + this.stageName, {
            fontFamily: '"PixelGame", Kanit',
            fontSize: '32px',
            color: '#dddddd',
            strokeThickness: 0
        }).setOrigin(0.5).setShadow(2, 4, '#000', 0, false, true);

        this.add.text(500, 330, 'คะแนนสะสม: ' + this.finalScore, {
            fontFamily: '"PixelGame", Kanit',
            fontSize: '36px',
            color: '#ffea00',
            strokeThickness: 0
        }).setOrigin(0.5).setShadow(2, 4, '#000', 0, false, true);

        let highScore = parseInt(localStorage.getItem('zombieHighScore')) || 0;
        if (this.finalScore > highScore) {
            highScore = this.finalScore;
            localStorage.setItem('zombieHighScore', highScore);
            this.add.text(500, 380, 'NEW HIGH SCORE!', {
                fontFamily: '"PixelGame", Courier',
                fontSize: '28px',
                color: '#00ffcc',
                strokeThickness: 0
            }).setOrigin(0.5).setShadow(2, 4, '#000', 0, false, true);
        }

        // Retro 'CONTINUE ?' Prompt
        this.add.text(500, 460, 'CONTINUE?', { 
            fontFamily: '"PixelGame", "Courier New", Courier', fontSize: '40px', color: '#ffffff', strokeThickness: 0
        }).setOrigin(0.5).setShadow(3, 5, '#000', 0, false, true);

        // YES / NO Cursor Menu
        let yesBtn = this.add.text(420, 520, 'YES', { fontFamily: '"PixelGame", Courier', fontSize: '40px', color: '#ffffff', strokeThickness: 0 }).setOrigin(0.5).setInteractive({ useHandCursor: true }).setShadow(2, 4, '#000', 0, false, true);
        let noBtn = this.add.text(580, 520, 'NO', { fontFamily: '"PixelGame", Courier', fontSize: '40px', color: '#ffffff', strokeThickness: 0 }).setOrigin(0.5).setInteractive({ useHandCursor: true }).setShadow(2, 4, '#000', 0, false, true);

        let cursor = this.add.text(0, 0, '►', { fontFamily: '"PixelGame", Courier', fontSize: '36px', color: '#ffffff', strokeThickness: 0 }).setOrigin(1, 0.5).setShadow(2, 4, '#000', 0, false, true);
        // Default point to YES
        cursor.setPosition(yesBtn.x - 50, yesBtn.y);

        yesBtn.on('pointerover', () => cursor.setPosition(yesBtn.x - 50, yesBtn.y));
        noBtn.on('pointerover', () => cursor.setPosition(noBtn.x - 40, noBtn.y));

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
        let bg = this.add.image(500, 300, 'lvl_menu_bg');
        bg.setDisplaySize(1000, 600);
        let overlay = this.add.graphics();
        overlay.fillStyle(0x000000, 0.85);
        overlay.fillRect(0, 0, 1000, 600);

        this.add.text(500, 70, 'SELECT STAGE', {
            fontFamily: '"PixelGame", "Courier New", Courier, Kanit',
            fontSize: '60px',
            color: '#b6ff00',
            strokeThickness: 0
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
            
            // Premium Card Frame
            let cardBg = this.add.graphics();
            cardBg.fillStyle(0x1a1a1a, 1);
            cardBg.fillRoundedRect(cx - 120, cy - 70, 240, 140, 10);
            
            let cardInner = this.add.graphics();
            cardInner.fillStyle(0x2d3436, 1);
            cardInner.fillRoundedRect(cx - 116, cy - 66, 232, 132, 8);
            
            // Big Number 
            let numTxt = this.add.text(cx, cy - 15, st.num, {
                fontFamily: '"PixelGame", "Courier New", Courier, Kanit',
                fontSize: '80px',
                color: '#666666'
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
                cardInner.fillStyle(0x51b87a, 1);
                cardInner.fillRoundedRect(cx - 116, cy - 66, 232, 132, 8);
                title.setColor('#000000');
                numTxt.setColor('#000000');
                this.tweens.add({ targets: numTxt, y: cy - 25, duration: 100 });
            });
            
            zone.on('pointerout', () => {
                cardInner.clear();
                cardInner.fillStyle(0x2d3436, 1);
                cardInner.fillRoundedRect(cx - 116, cy - 66, 232, 132, 8);
                title.setColor('#ffffff');
                numTxt.setColor('#666666');
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