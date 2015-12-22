var playState = {
    player: null,
    platforms: null,
    cursors: null,
    prizeButton: null,
    grounds: null,
    prize: null,


    //snow
    max: 0,
    front_emitter: null,
    mid_emitter: null,
    back_emitter: null,
    update_interval: 4 * 60,
    i: 0,


    game_over: function () {
        alert('GAME OVER!');
        game.state.restart();
    },

    preload: function () {

        game.stage.backgroundColor = '#729fcf';

        game.load.baseURL = 'http://dev.flashtown.ru/games/flying_santa/';
        game.load.crossOrigin = 'anonymous';

        game.load.image('player', 'santa.png');
        game.load.image('present1', 'present1.png');
        game.load.image('present2', 'present2.png');
        game.load.image('present3', 'present3.png');
        game.load.image('platform', 'platform.png');
        game.load.image('ground', 'ground.png');

        game.load.image('sky', 'sky.png');
        game.load.spritesheet('snowflakes', 'snowflakes.png', 17, 17);
        game.load.spritesheet('snowflakes_large', 'snowflakes_large.png', 64, 64);

        game.load.image('baby', 'baby.png');
    },

    createMain: function () {

        game.add.sprite(0, 0, 'sky');
        this.player = game.add.sprite(0, 0, 'player');


        game.physics.arcade.enable(this.player);

        this.player.body.collideWorldBounds = true;
        this.player.body.gravity.y = 300;

        this.platforms = game.add.physicsGroup();

        this.platforms.create(265, 0, 'platform');
        this.platforms.create(535, 80, 'platform');

        this.createPlatform();


        this.grounds = game.add.physicsGroup();
        // Here we create the ground.
        var ground = this.grounds.create(0, game.world.height - 60, 'ground');
        this.grounds.setAll('body.immovable', true);

        //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
        ground.scale.setTo(2, 2);

        //  This stops it from falling away when you jump on it
        ground.body.immovable = true;

        this.cursors = game.input.keyboard.createCursorKeys();
        this.prizeButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);


        game.add.sprite(0, 0, 'baby');


    },


    createPlatform: function () {
        if (this.getRandomInt(0, 1) == 0) {
            this.platforms.create(game.world.width, 0, 'platform');
        } else {
            this.platforms.create(game.world.width, 80, 'platform');
        }
        this.platforms.setAll('body.immovable', true);
        this.platforms.setAll('body.velocity.x', -40);
    },

    // использование Math.round() даст неравномерное распределение!
    getRandomInt: function (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },


    pauseKey: null,

    create: function () {

        this.createMain();
        this.createSnow();
// Create a label to use as a button
        var pause_label = game.add.text(game.world.width - 100, 10, 'Pause', {font: '24px Arial', fill: '#ff0'});
        pause_label.inputEnabled = true;

        this.pauseKey = game.input.keyboard.addKey(Phaser.Keyboard.ESC);
        this.pauseKey.onDown.add(this.pauseGame, this);
        //pause.onInputUp.add(pause, this);

        pause_label.events.onInputUp.add(this.pauseGame);

        // Add a input listener that can help us return from being paused
        game.input.onDown.add(this.unpause, self);


    },


    pauseGame: function () {
        game.paused = true;
    },

// And finally the method that handels the pause menu
    unpause: function (event) {
        // Only act if paused
        if (game.paused) {

            // Remove the menu and the label
            //menu.destroy();
            //choiseLabel.destroy();

            // Unpause the game
            game.paused = false;

        }
    },


    createSnow: function () {
        back_emitter = game.add.emitter(game.world.centerX, -32, 600);
        back_emitter.makeParticles('snowflakes', [0, 1, 2, 3, 4, 5]);
        back_emitter.maxParticleScale = 0.6;
        back_emitter.minParticleScale = 0.2;
        back_emitter.setYSpeed(20, 100);
        back_emitter.gravity = 0;
        back_emitter.width = game.world.width * 1.5;
        back_emitter.minRotation = 0;
        back_emitter.maxRotation = 40;

        mid_emitter = game.add.emitter(game.world.centerX, -32, 250);
        mid_emitter.makeParticles('snowflakes', [0, 1, 2, 3, 4, 5]);
        mid_emitter.maxParticleScale = 1.2;
        mid_emitter.minParticleScale = 0.8;
        mid_emitter.setYSpeed(50, 150);
        mid_emitter.gravity = 0;
        mid_emitter.width = game.world.width * 1.5;
        mid_emitter.minRotation = 0;
        mid_emitter.maxRotation = 40;

        front_emitter = game.add.emitter(game.world.centerX, -32, 50);
        front_emitter.makeParticles('snowflakes_large', [0, 1, 2, 3, 4, 5]);
        front_emitter.maxParticleScale = 1;
        front_emitter.minParticleScale = 0.5;
        front_emitter.setYSpeed(100, 200);
        front_emitter.gravity = 0;
        front_emitter.width = game.world.width * 1.5;
        front_emitter.minRotation = 0;
        front_emitter.maxRotation = 40;

        this.changeWindDirection();

        back_emitter.start(false, 14000, 20);
        mid_emitter.start(false, 12000, 40);
        front_emitter.start(false, 6000, 1000);


    },


    playerControls: function () {


        game.physics.arcade.collide(this.player, this.platforms);
        game.physics.arcade.collide(this.player, this.grounds);

        this.player.body.velocity.x = 40;


        if (this.cursors.up.isDown) {
            this.player.body.velocity.y = -200;
        }

        if (this.cursors.left.isDown) {
            this.player.body.velocity.x = -25;
        }
        else if (this.cursors.right.isDown) {
            this.player.body.velocity.x = 200;
        }

        if (this.player.body.velocity.y < 0) {
            this.player.angle = -2;
        } else if (this.player.body.velocity.y > 0) {
            this.player.angle = 2;
        } else {
            this.player.angle = 0;
        }


    },

    update: function () {
        this.updateSnow();
        this.updateMain();
    },


    updateSnow: function () {
        this.i++;

        if (this.i === this.update_interval) {
            this.changeWindDirection();
            this.update_interval = Math.floor(Math.random() * 20) * 60; // 0 - 20sec @ 60fps
            this.i = 0;
        }
    },

    updateMain: function () {
        this.playerControls();
        this.platforms.setAll('body.velocity.x', -40);

        if (this.player.body.touching.right) {
            this.game_over();
        }
    },

    prizeDown: false,

    addPrize: function () {
        var random = this.getRandomInt(0, 2);
        if (random == 0) {
            this.prize = game.add.sprite(this.player.x, this.player.y + 25, 'present1');
        } else if (random == 1) {
            this.prize = game.add.sprite(this.player.x, this.player.y + 25, 'present2');
        } else {
            this.prize = game.add.sprite(this.player.x, this.player.y + 25, 'present3');
        }
        this.platforms.setAll('body.immovable', true);
        this.platforms.setAll('body.velocity.x', -40);
    },

    render: function () {
        this.renderMain();
    },

    renderMain: function () {
        if (this.prizeButton.isDown && !this.prizeDown) {
            this.prizeDown = true;
            this.addPrize();
            game.physics.arcade.enable(this.prize);

            this.prize.body.collideWorldBounds = true;
            this.prize.body.gravity.y = 400;
            this.prize.body.velocity.y = this.player.body.velocity.y + 50;

        }

        if (this.prize && this.prize.body.onFloor()) {
            this.prize.destroy();
            this.prize = null;
            this.prizeDown = false
        }

        this.platforms.forEach(function (item) {
            if (item.x < -64) {
                item.destroy();
                //item.kill();
                this.platforms.remove(item);
                this.createPlatform();
            }
        }, this);

    },


    changeWindDirection: function () {

        var multi = Math.floor((this.max + 200) / 4),
            frag = (Math.floor(Math.random() * 100) - multi);
        this.max = this.max + frag;

        if (this.max > 200) this.max = 150;
        if (this.max < -200) this.max = -150;

        this.setXSpeed(back_emitter, this.max);
        this.setXSpeed(mid_emitter, this.max);
        this.setXSpeed(front_emitter, this.max);

    },

    setXSpeed: function (emitter, max) {

        emitter.setXSpeed(max - 20, max);
        emitter.forEachAlive(this.setParticleXSpeed, this, max);

    },

    setParticleXSpeed: function (particle, max) {

        particle.body.velocity.x = max - Math.floor(Math.random() * 30);

    },
};
