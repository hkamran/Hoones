/**
 * This object handles and represents the the NES.
 * Its responsibilities is to handle CPU and the PPU of the NES.
 *
 * Created by Hooman Kamran on 1/01/2016.
 */
var nes = {

    interval : 1000 / 60, //FPS
    rate : 29829,         //Tick Rate per frame

    load : function(file) {
        cartridge.load(file);

        cpu.setCartidge(cartridge);
        ppu.setCartidge(cartridge);

        this.reset();
    },

    reset : function() {
        cpu.reset();
        ppu.reset();
        cartridge.reset();

    },

    tick : function() {
        var cpuCycles = cpu.tick();
        var ppuCycles = cpuCycles * 3;
        for (var i = 0; i < ppuCycles; i++) {
            ppu.tick();
        }
    },

    tickFor : function(val) {
        for (var i = 0; i < val; i++) {
            this.tick();
        }
    },

    start : function() {
        setTimeout(function() {
            window.requestAnimationFrame(nes.start);
            nes.tickFor(29829);
        }, this.interval);

    }

};