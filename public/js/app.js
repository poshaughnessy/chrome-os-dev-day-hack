var App = function() {
        
    this.ready = false;
    
    this.showForTicks = 500;
    
    this.sprites = [];
    this.parts = [];
    
    
    this.init = function() {
     
        // create the Scene object
        this.scene = sjs.Scene({w:640, h:480, parent: document.getElementById('gameCanvas')});
        this.input = this.scene.Input();
        
        console.log('input', this.input);

        var self = this;

        // load the images in parallel. When all the images are
        // ready, the callback function is called.
        this.scene.loadImages(['img/chrome-logo-100x100.png','img/ie-logo-100x100.png'], function() {    

            self.ready = true;

            self.ticker = self.scene.Ticker(function() {
        
                for( var i=0; i < self.sprites.length; i++ ) {
                 
                    var sprite = self.sprites[i];
                    
                    if( typeof sprite.shownTick == 'undefined') {
                        sprite.shownTick = this.currentTick;
                    } else if( this.currentTick > sprite.shownTick + self.showForTicks ) {
                        //sprite.remove();   
                        sprite.setOpacity(0);
                        sprite.update();
                    } 
                    
                    sprite.update();
                 
                }
                
                for( var i=0; i < self.parts.length; i++ ) {
                 
                    var part = self.parts[i];
                 
                    part.applyVelocity();
                    part.update();                        
                    
                }                    
                                    
            });                
                
            self.ticker.run();
            
        });
     
    };
    
    this.addSprite = function(isChrome, xOutOf100, yOutOf100) {
                                    
        
        var x = this.scene.w * (xOutOf100 / 100);
        var y = this.scene.h * (yOutOf100 / 100);
        
        console.log('x', x);
        console.log('y', y);
        
        if( this.ready ) {
        
            var sprite;
            
            if( isChrome ) {
                sprite = this.scene.Sprite('img/chrome-logo-100x100.png');
            } else {
                sprite = this.scene.Sprite('img/ie-logo-100x100.png');
            }
            
            sprite.size(100, 100);
                            
            sprite.move(x, y);                
            
            sprite.update();
            
            var self = this;
            
            sprite.dom.addEventListener('click', function(e) {
                
                console.log('Make sprite explode!');
                
                var parts = sprite.explode4();
                
                for(var i=0; i < parts.length; i++) {
                    var p = parts[i];
                    p.xv = 5 * (Math.random() - 0.5)
                    p.yv = -6 -5 * Math.random();
                    p.rv = Math.random() / 2;
                    p.applyVelocity();
                    self.parts.push( p );
                }                   
                
                sprite.setOpacity(0);
                sprite.update();
                
            }, true);                
            
            this.sprites.push(sprite);
            
        }
        
    };
    
    this.init();          
    
};

$(function() {
   
   var app = new App();
   
   // Test
   window.setTimeout(function() {
       app.addSprite(true, 10, 10);
   }, 1000);
   
   window.setTimeout(function() {
       app.addSprite(false, 50, 50);
   }, 2000);
   
});
   