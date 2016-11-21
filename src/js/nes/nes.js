/**
 * This object handles and represents the the NES.
 * Its responsibilities is to handle CPU and the PPU of the NES.
 *
 * Created by Hooman Kamran on 1/01/2016.
 */

var nes = {

    interval : 1,    //lower means faster emulation (default is 20)
    rate : 29829,    //Tick Rate per frame
    url : "",
    timeout : null,  //timeout function to run nes

    cpu : cpu,
    ppu : ppu,
    controller2 : null,
    controller1 : null,

    init : function(cpu, ppu, controller1, controller2) {
        this.cpu = cpu;
        this.ppu = ppu;
        this.controller1 = controller1;
        this.controller2 = controller2
    },

    load : function(file) {
        this.url = file;

        cartridge.load(file);

        this.cpu.setCartidge(cartridge);
        this.ppu.setCartidge(cartridge);

        this.reset();
    },

    reset : function() {
        this.cpu.reset();
        this.ppu.reset();
        cartridge.reset();
    },

    tick : function() {
        var cpuCycles = this.cpu.tick();
        var ppuCycles = cpuCycles * 3;
        for (var i = 0; i < ppuCycles; i++) {
            this.ppu.tick();
        }
    },

    tickFor : function(val) {
        for (var i = 0; i < val; i++) {
            this.tick();
        }
    },

    loadState : function(state) {
        var data = state;
        var url = data.nes.url;

        this.stop();

        this.load(url);


        this.cpu.loadState(state.cpu);
        this.ppu.loadState(state.ppu);
        this.controller1.loadState(state.controller1);
        this.controller2.loadState(state.controller2);
    },


    getState : function() {
        this.stop();

        var json = {
            nes : {
                url : nes.url
            },
            cpu : this.cpu.getState(),
            ppu : this.ppu.getState(),
            controller1: this.controller1.getState(),
            controller2: this.controller2.getState()
        };

        return json;
    },

    start : function() {
        this.rate = nes.DEFAULT_RATE;
        if (this.timeout == null) {
            this._run();
        }
    },

    _run : function() {
        this.timeout = function() {
            window.requestAnimationFrame(nes._run.bind(this));
            nes.tickFor(this.rate);
        }.bind(this);

        setTimeout(this.timeout, this.interval);
    },

    stop : function() {
      this.rate = 0;
    }

};

nes.DEFAULT_RATE = 29829;

