var loadState = {
    
    preload: function() {
        /*
        var loadingLabel = game.add.text(game.world.centerX, 150, 'loading...', { font: '30px Arial', fill: '#333333' });
        loadingLabel.anchor.setTo(0.5, 0.5);
        
        document.body.style.backgroundColor = '#729fcf';
        var progressBar = game.add.sprite(game.world.centerX, 200, 'progressBar');
        progressBar.anchor.setTo(0.5, 0.5);
        game.load.setPreloadSprite(progressBar);


        game.load.image('player', 'assets/img/blue_block.png');
        game.load.image('block', 'assets/img/orange_block.png');          
        game.load.image('background', 'assets/img/grid.png');
        game.load.image('title', 'assets/img/gametitle.png');
        game.load.image('instructions', 'assets/img/howtoplay.png');
        game.load.image('overlay', 'assets/img/overlay.png');
        game.load.image('gameover', 'assets/img/gameover.png');
        game.load.image('retry', 'assets/img/retry_button.png');
        game.load.image('quit', 'assets/img/quit_button.png');
        
        game.load.bitmapFont('square', 'assets/fonts/square.png', 'assets/fonts/square.fnt');
        */

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
    
    create: function() {
        game.state.start('play');
    }
};