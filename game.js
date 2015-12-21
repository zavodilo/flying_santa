
window.onload = function () {
    var xScene = 800; //сделать константой
    var yScene = 640; //сделать константой


    var game = new Phaser.Game(xScene, yScene, Phaser.AUTO, '', {preload: preload, create: create, update: update, render: render});

    function game_over() {
        alert('GAME OVER!');
        game.state.restart();
    }

    function preload() {

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
    }

    var player;
    var platforms;
    var cursors;
    var prizeButton;
    var grounds;
    var prize;


    //snow
    var max = 0;
    var front_emitter;
    var mid_emitter;
    var back_emitter;
    var update_interval = 4 * 60;
    var i = 0;

    function createPlatform() {
        if(getRandomInt(0, 1) == 0) {
            platforms.create(game.world.width, 0, 'platform');
        } else {
            platforms.create(game.world.width, 80, 'platform');
        }
        platforms.setAll('body.immovable', true);
        platforms.setAll('body.velocity.x', -40);
    }

    // использование Math.round() даст неравномерное распределение!
    function getRandomInt(min, max)
    {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function createMain() {
        game.add.sprite(0, 0, 'sky');
        player = game.add.sprite(0, 0, 'player');

        game.physics.arcade.enable(player);

        player.body.collideWorldBounds = true;
        player.body.gravity.y = 300;

        platforms = game.add.physicsGroup();

        platforms.create(265, 0, 'platform');
        platforms.create(535, 80, 'platform');
        //platforms.create(-200, 300, 'platform');
        //platforms.create(400, 450, 'platform');

        //platforms.create(100, 50, 'platform');

        //platforms.create(0, game.world.height - 50, 'platform');

        createPlatform();
        //platforms.setAll('body.immovable', true);



        grounds = game.add.physicsGroup();
        // Here we create the ground.
        var ground = grounds.create(0, game.world.height - 60, 'ground');
        grounds.setAll('body.immovable', true);

        //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
        ground.scale.setTo(2, 2);

        //  This stops it from falling away when you jump on it
        ground.body.immovable = true;

        cursors = game.input.keyboard.createCursorKeys();
        prizeButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);



        game.add.sprite(0, 0, 'baby');

    }

    var pauseKey;
    function create() {

        createMain();
        createSnow();
// Create a label to use as a button
        var pause_label = game.add.text(game.world.width - 100, 10, 'Pause', { font: '24px Arial', fill: '#ff0' });
        pause_label.inputEnabled = true;

        pauseKey = game.input.keyboard.addKey(Phaser.Keyboard.ESC);
        pauseKey.onDown.add(pause, this);
        //pause.onInputUp.add(pause, this);

        pause_label.events.onInputUp.add(function () {
            pause();
        });

        // Add a input listener that can help us return from being paused
        game.input.onDown.add(unpause, self);


    }

    function pause(){
        game.paused = true;
    }

    // And finally the method that handels the pause menu
    function unpause(event){
        // Only act if paused
        if(game.paused){

            // Remove the menu and the label
            //menu.destroy();
            //choiseLabel.destroy();

            // Unpause the game
            game.paused = false;

        }
    };

    function createSnow() {
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

        changeWindDirection();

        back_emitter.start(false, 14000, 20);
        mid_emitter.start(false, 12000, 40);
        front_emitter.start(false, 6000, 1000);


    }

    function playerControls() {
        /*
        if (pauseKey.up.isDown) {
            pause();
        }
*/

        game.physics.arcade.collide(player, platforms);
        game.physics.arcade.collide(player, grounds);

        player.body.velocity.x = 40;



        if (cursors.up.isDown) {
            player.body.velocity.y = -200;
        }

        if (cursors.left.isDown) {
            player.body.velocity.x = -25;
        }
        else if (cursors.right.isDown) {
            player.body.velocity.x = 200;
        }

        if (player.body.velocity.y <0) {
            player.angle = -2;
        } else if (player.body.velocity.y >0) {
            player.angle = 2;
        } else {
            player.angle = 0;
        }




    }

    function update() {
        updateSnow();
        updateMain();
    }

    function updateSnow() {
        i++;

        if (i === update_interval)
        {
            changeWindDirection();
            update_interval = Math.floor(Math.random() * 20) * 60; // 0 - 20sec @ 60fps
            i = 0;
        }
    }

    function updateMain() {
        playerControls();
        platforms.setAll('body.velocity.x', -40);

        if(player.body.touching.right) {
            game_over();
        }
    }

    var prizeDown = false;

    function addPrize() {
        var random = getRandomInt(0, 2);
        if(random  == 0) {
            prize = game.add.sprite(player.x, player.y+25, 'present1');
        } else if (random  == 1) {
            prize = game.add.sprite(player.x, player.y+25, 'present2');
        } else {
            prize = game.add.sprite(player.x, player.y+25, 'present3');
        }
        platforms.setAll('body.immovable', true);
        platforms.setAll('body.velocity.x', -40);
    }

    function render() {
        renderMain();
    }

    function renderMain() {
        if (prizeButton.isDown && !prizeDown) {
            prizeDown = true;
            addPrize();
            game.physics.arcade.enable(prize);

            prize.body.collideWorldBounds = true;
            prize.body.gravity.y = 400;
            prize.body.velocity.y = player.body.velocity.y+50;

        }

        if (prize && prize.body.onFloor()) {
            prize.destroy();
            prize = null;
            prizeDown = false
        }

        platforms.forEach(function(item) {
            if (item.x < -64) {
                item.destroy();
                //item.kill();
                platforms.remove(item);
                createPlatform();
            }
        }, this);

    }



    function changeWindDirection() {

        var multi = Math.floor((max + 200) / 4),
            frag = (Math.floor(Math.random() * 100) - multi);
        max = max + frag;

        if (max > 200) max = 150;
        if (max < -200) max = -150;

        setXSpeed(back_emitter, max);
        setXSpeed(mid_emitter, max);
        setXSpeed(front_emitter, max);

    }

    function setXSpeed(emitter, max) {

        emitter.setXSpeed(max - 20, max);
        emitter.forEachAlive(setParticleXSpeed, this, max);

    }

    function setParticleXSpeed(particle, max) {

        particle.body.velocity.x = max - Math.floor(Math.random() * 30);

    }
};
