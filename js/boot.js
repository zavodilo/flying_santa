var bootState = {
    
    preload: function(){
        game.load.image('progressBar', 'assets/img/progressBar.png');
        game.load.bitmapFont('square', 'assets/fonts/square.png', 'assets/fonts/square.fnt');
    },
    
    create: function(){
        game.stage.backgroundColor = '#729fcf';
        game.physics.startSystem(Phaser.Physics.ARCADE);
        /*
        if (!game.device.desktop){
            game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            
            document.body.style.backgroundColor = '#FFFFFF';
            
            game.scale.minWidth = 250;
            game.scale.minHeight = 170;
            game.scale.maxWidth = 1000;
            game.scale.maxHeight = 680;
            
            game.scale.pageAlignHorizontally = true;
            game.scale.pageAlignVertically = true;
            
            game.scale.setScreenSize(true);
        }
        */
        game.state.start('load');
    }
};