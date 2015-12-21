
window.onload = function () {
    var xScene = 800; //сделать константой
    var yScene = 640; //сделать константой


    var game = new Phaser.Game(xScene, yScene, Phaser.AUTO, '', {preload: preload, create: create, update: update, render: render});

    function preload() {

        game.stage.backgroundColor = '#FFFFFF';

        game.load.baseURL = 'http://dev.flashtown.ru/games/flying_santa/';
        game.load.crossOrigin = 'anonymous';

        game.load.image('player', 'ufo.png');
        game.load.image('prize', 'ufo.png');
        game.load.image('platform', 'platform.png');
        game.load.image('ground', 'ground.png');
        game.load.image('sky', 'sky.png');
    }

    var player;
    var platforms;
    var cursors;
    var prizeButton;
    var grounds;
    var prize;




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


    function create() {

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

    }

    function playerControls() {
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
            player.body.velocity.x = 250;
        }

    }

    function update() {
        playerControls();
        platforms.setAll('body.velocity.x', -40);
    }

    var prizeDown = false;

    function render() {
        if (prizeButton.isDown && !prizeDown) {
            prizeDown = true;
            prize = game.add.sprite(player.x, player.y, 'prize');
            game.physics.arcade.enable(prize);

            prize.body.collideWorldBounds = true;
            prize.body.gravity.y = 400;
            prize.body.velocity.y = player.body.velocity.y+50;

        }

        if (prize && prize.body.onFloor()) {
            prize.kill();
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
};
