var playState = {
    score: 0,
    scoreLabel: null,
    player: null,
    platforms: null,
    cursors: null,
    prizeButton: null,
    grounds: null,
    clouds: null,
    prize: null,
    houses: null,
    airplanes: null,
    balloons: null,

    //snow
    max: 0,
    front_emitter: null,
    mid_emitter: null,
    back_emitter: null,
    update_interval: 4 * 60,
    i: 0,


    game_over: function () {
        game.paused = true;
        //alert('GAME OVER!');
        /*
        label = game.add.text(game.world.width / 2 ,game.world.height / 2, 'Score: '+score+'\nGAME OVER\nPress SPACE to restart',{ font: '22px Lucida Console', fill: '#fff', align: 'center'});
        label.anchor.setTo(0.5, 0.5);
        */
        //game.state.restart();

        var game_over_label = game.add.text(game.world.width / 2 , game.world.height / 2, 'GAME OVER\nClick to restart\nScore: ' + this.score, {font: '24px Arial', fill: '#f00'});
        //game_over_label.inputEnabled = true;
        //game_over_label.events.onInputUp.add(this.restartGame);
        //this.pauseGame();
        game.state.restart();

    },
    /*
    restartGame: function () {
        //game.paused = false;
        //game.state.start('play');
        game.state.restart();
    },*/

    preload: function () {

        game.stage.backgroundColor = '#729fcf';

        game.load.baseURL = 'http://dev.flashtown.ru/games/flying_santa/';
        game.load.crossOrigin = 'anonymous';

        game.load.image('player', 'santa.png');
        game.load.image('present1', 'present1.png');
        game.load.image('present2', 'present2.png');
        game.load.image('present3', 'present3.png');
        game.load.image('platform', 'trees2.png');
        game.load.image('ground', 'ground.png');

        game.load.image('sky', 'sky.png');
        game.load.spritesheet('snowflakes', 'snowflakes.png', 17, 17);
        game.load.spritesheet('snowflakes_large', 'snowflakes_large.png', 64, 64);

        game.load.image('baby', 'baby.png');

        game.load.image('cloud1', 'cloud1.png');
        game.load.image('cloud2', 'cloud2.png');
        game.load.image('cloud3', 'cloud3.png');
        game.load.image('cloud4', 'cloud4.png');
        game.load.image('cloud5', 'cloud5.png');

        game.load.image('house', 'house.png');

        game.load.image('airplane', 'airplane.png');
        game.load.image('balloon', 'balloon.png');
    },

    createMain: function () {

        game.add.sprite(0, 0, 'sky');

        this.clouds = game.add.physicsGroup();
        this.clouds.create(100, 60, 'cloud1');
        this.clouds.create(470, 80, 'cloud2');
        this.clouds.create(320, 150, 'cloud3');
        this.clouds.create(520, 200, 'cloud4');
        this.clouds.create(720, 110, 'cloud4');
        this.clouds.setAll('body.velocity.x', -15);

        this.grounds = game.add.physicsGroup();
        // Here we create the ground.
        var ground = this.grounds.create(0, game.world.height - 60, 'ground');
        this.grounds.setAll('body.immovable', true);

        //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
        ground.scale.setTo(2, 2);

        //  This stops it from falling away when you jump on it
        ground.body.immovable = true;



        this.platforms = game.add.physicsGroup();

        //this.platforms.create(100, 540, 'house');
        //this.platforms.create(265, 0, 'platform');
        this.platforms.create(265, 230, 'platform');
        this.platforms.create(535, 230, 'platform');
        this.platforms.setAll('body.immovable', true);
        this.platforms.setAll('body.velocity.x', -40);

        //this.createPlatform();

        this.houses = game.add.physicsGroup();
        this.houses.create(100, 540, 'house');
        this.houses.setAll('body.immovable', true);
        this.houses.setAll('body.velocity.x', -40);

        this.cursors = game.input.keyboard.createCursorKeys();
        this.prizeButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);


        game.add.sprite(10, 10, 'baby');
        this.scoreLabel = game.add.text(40 , 12, this.score, {font: '20px Arial', fill: '#f00'});


        this.player = game.add.sprite(0, 0, 'player');
        game.physics.arcade.enable(this.player);
        this.player.body.collideWorldBounds = true;
        this.player.body.gravity.y = 300;

        this.airplanes = game.add.physicsGroup();
        this.balloons = game.add.physicsGroup();
/*
        game.physics.arcade.collide(this.player, this.platforms);
        game.physics.arcade.collide(this.player, this.grounds);
        game.physics.arcade.collide(this.player, this.houses);
        game.physics.arcade.collide(this.player, this.balloons);
        game.physics.arcade.collide(this.player, this.airplanes);
        */
    },


    createPlatform: function () {
        this.platforms.create(game.world.width, 230, 'platform');
/*
        if (this.getRandomInt(0, 1) == 0) {
            this.platforms.create(game.world.width, 540, 'house');
            //this.platforms.create(game.world.width, 0, 'platform'); TODO ispravit
        } else {
            this.platforms.create(game.world.width, 230, 'platform');
        }*/

        this.platforms.setAll('body.immovable', true);
        this.platforms.setAll('body.velocity.x', -40);

        //game.physics.arcade.collide(this.player, this.platforms);
    },

    createHouse: function () {
        this.houses.create(game.world.width+100, 540, 'house');
        this.houses.setAll('body.immovable', true);
        this.houses.setAll('body.velocity.x', -40);

        switch (this.getRandomInt(0, 1)) {
            case 0:
                this.createBalloon();
                break;
            case 1:
                this.createAirplane();
                break;
            default:
                this.createAirplane();
        }

        //game.physics.arcade.collide(this.player, this.houses);
    },

    createBalloon: function () {
        this.balloons.create(game.world.width+5, 500, 'balloon');
        this.balloons.setAll('body.immovable', true);
        this.balloons.setAll('body.velocity.x', -40);
        this.balloons.setAll('body.velocity.y', -30);

        //game.physics.arcade.collide(this.player, this.balloons);
    },

    createAirplane: function () {
        this.airplanes.create(game.world.width+5, 150, 'airplane');
        this.airplanes.setAll('body.immovable', true);
        this.airplanes.setAll('body.velocity.x', -200);

        //game.physics.arcade.collide(this.player, this.airplanes);
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
        var pause_label = game.add.text(game.world.width - 100, 10, 'Pause', {font: '24px Arial', fill: '#f00'});
        pause_label.inputEnabled = true;

        this.pauseKey = game.input.keyboard.addKey(Phaser.Keyboard.ESC);
        this.pauseKey.onDown.add(this.pauseGame, this);
        //pause.onInputUp.add(pause, this);

        pause_label.events.onInputUp.add(this.pauseGame);

        // Add a input listener that can help us return from being paused
        //game.input.onDown.add(this.unpause, self);


    },


    pauseGame: function () {
        game.paused = true;
        game.input.onDown.add(this.unpause, self);
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

        /* hz pohodu bez etogo ne rabotaet*/
        game.physics.arcade.collide(this.player, this.platforms);
        game.physics.arcade.collide(this.player, this.grounds);
        game.physics.arcade.collide(this.player, this.houses);
        game.physics.arcade.collide(this.player, this.balloons);
        game.physics.arcade.collide(this.player, this.airplanes);

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
        //this.platforms.setAll('body.velocity.x', -40);
        game.physics.arcade.collide(this.prize, this.houses);
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
        //this.prize.body.collideWorldBounds = true;
        /*
        this.platforms.setAll('body.immovable', true);
        this.platforms.setAll('body.velocity.x', -40);
        */
        //game.physics.arcade.collide(this.prize, this.houses); TODO collide prize
    },

    render: function () {
        this.renderMain();
        if (this.player.body.touching.right) {
            this.pauseGame();
            this.game_over();
        }
        this.scoreLabel.text = this.score;
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


        if (this.prize && this.prize.body.touching.down) {
            this.score++;
            this.prize.destroy();
            this.prize = null;
            this.prizeDown = false
        }


        /* TODO score
        if (this.prize && this.prize.body.touching) {
         this.score++;
         this.prize.destroy();
         this.prize = null;
         this.prizeDown = false
         }
        */


        if (this.prize && this.prize.body.onFloor()) {
            this.prize.destroy();
            this.prize = null;
            this.prizeDown = false
        }

        this.platforms.forEach(function (item) {
            if (item.x < -274) {
                item.destroy();
                //item.kill();
                this.platforms.remove(item);
                this.createSwitchItem();
            }
        }, this);

        this.houses.forEach(function (item) {
            if (item.body.touching.up && !this.prizeDown) {
                this.player.body.velocity.x = 200;
                this.player.body.velocity.y = -500;
            }
            if (item.x < -70) {
                item.destroy();
                //item.kill();
                this.houses.remove(item);
                this.createSwitchItem();
            }
        }, this);


        this.clouds.forEach(function (item) {
            if (item.x < -70) {
                item.x = game.world.width;
            }
        }, this);

        this.balloons.forEach(function (item) {
            if (item.x < -70) {
                item.destroy();
            }
        }, this);

        this.airplanes.forEach(function (item) {
            if (item.x < -70) {
                item.destroy();
            }
        }, this);
    },


    createSwitchItem: function () {
        switch (this.getRandomInt(0, 1)) {
            case 0:
                this.createPlatform();
                    break;
            case 1:
                this.createHouse();
                    break;
            default:
                this.createHouse();
        }
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

    }
};
