/**
 * Created by HK on 1/26/2016.
 */

var nes = {


    load : function(file) {
        cartridge.load(file);

        cpu.mmu.prgrom.setLowerBank(cartridge.prgrom.getLowerBank());
        cpu.mmu.prgrom.setUpperBank(cartridge.prgrom.getUpperBank());

        ppu.nametables.setMirrorType(cartridge.mirroring.getType());
        //ppu.pattern.set(cartridge.chrrom.getBank());
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
    }

};