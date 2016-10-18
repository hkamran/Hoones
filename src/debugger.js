/**
 * Created by HK on 2/27/2016.
 */
var debug = {

    output : false,
    counter : 1,

    log : function(val) {
        //Logger

        if (this.output) {
            document.getElementById("log").innerHTML = document.getElementById("log").innerHTML + "</br>" + this.counter + " " + val;
            this.counter++;
        }
    },

    console : function(log) {
        if (this.output) {
            console.log(log);
        }
    },

    tick :  function() {

        //CPU

        document.getElementById("carryFlag").innerHTML = cpu.registers.p.c == 1;
        document.getElementById("zeroFlag").innerHTML = cpu.registers.p.z == 1;
        document.getElementById("interruptFlag").innerHTML = cpu.registers.p.i == 1;
        document.getElementById("decimalFlag").innerHTML = cpu.registers.p.d == 1;
        document.getElementById("breakFlag").innerHTML = cpu.registers.p.b == 1;
        document.getElementById("overflowFlag").innerHTML = cpu.registers.p.v == 1;
        document.getElementById("negativeFlag").innerHTML = cpu.registers.p.n == 1;

        document.getElementById("pflags").innerHTML = "0x" + cpu.registers.p.get().toString(16).toUpperCase();
        document.getElementById("pc").innerHTML = "0x" + cpu.registers.pc.get().toString(16).toUpperCase();
        document.getElementById("acc").innerHTML = "0x" + cpu.registers.a.get().toString(16).toUpperCase();
        document.getElementById("x").innerHTML = "0x" + cpu.registers.x.get().toString(16).toUpperCase();
        document.getElementById("y").innerHTML = "0x" + cpu.registers.y.get().toString(16).toUpperCase();
        document.getElementById("sp").innerHTML = "0x" + cpu.registers.sp.get().toString(16).toUpperCase();

        //PPU

        document.getElementById("carryFlag").innerHTML = cpu.registers.p.c == 1;
        document.getElementById("zeroFlag").innerHTML = cpu.registers.p.z == 1;
        document.getElementById("interruptFlag").innerHTML = cpu.registers.p.i == 1;
        document.getElementById("decimalFlag").innerHTML = cpu.registers.p.d == 1;
        document.getElementById("breakFlag").innerHTML = cpu.registers.p.b == 1;
        document.getElementById("overflowFlag").innerHTML = cpu.registers.p.v == 1;
        document.getElementById("negativeFlag").innerHTML = cpu.registers.p.n == 1;
        document.getElementById("pflags").innerHTML = "0x" + cpu.registers.p.get().toString(16).toUpperCase();
        document.getElementById("pc").innerHTML = "0x" + cpu.registers.pc.get().toString(16).toUpperCase();
        document.getElementById("acc").innerHTML = "0x" + cpu.registers.a.get().toString(16).toUpperCase();
        document.getElementById("x").innerHTML = "0x" + cpu.registers.x.get().toString(16).toUpperCase();
        document.getElementById("y").innerHTML = "0x" + cpu.registers.y.get().toString(16).toUpperCase();
        document.getElementById("sp").innerHTML = "0x" + cpu.registers.sp.get().toString(16).toUpperCase();

        document.getElementById("nametable").innerHTML = "0x" + ppu.registers.cntrl.nametable;
        document.getElementById("increment").innerHTML = "0x" + ppu.registers.cntrl.increment;
        document.getElementById("spritetable").innerHTML = "0x" + ppu.registers.cntrl.spritetable;
        document.getElementById("backgroundtable").innerHTML = "0x" + ppu.registers.cntrl.backgroundtable;
        document.getElementById("spritesize").innerHTML = "0x" + ppu.registers.cntrl.spritesize;
        document.getElementById("masterslave").innerHTML = "0x" + ppu.registers.cntrl.masterslave;
        document.getElementById("nmi").innerHTML = "0x" + ppu.registers.cntrl.nmi;

        document.getElementById("grayscale").innerHTML = "0x" + ppu.registers.mask.greyscale;
        document.getElementById("showbgleft").innerHTML = "0x" + ppu.registers.mask.showbgleft;
        document.getElementById("showspleft").innerHTML = "0x" + ppu.registers.mask.showspleft;
        document.getElementById("showbg").innerHTML = "0x" + ppu.registers.mask.showbg;
        document.getElementById("showsprites").innerHTML = "0x" + ppu.registers.mask.showsprites;
        document.getElementById("increds").innerHTML = "0x" + ppu.registers.mask.increds;
        document.getElementById("incgreens").innerHTML = "0x" + ppu.registers.mask.incgreens;
        document.getElementById("incblues").innerHTML = "0x" + ppu.registers.mask.incblues;

        document.getElementById("spriteoverflow").innerHTML = "0x" + ppu.registers.status.spriteoverflow;
        document.getElementById("spritehit").innerHTML = "0x" + ppu.registers.status.spritehit;
        document.getElementById("vblank").innerHTML = "0x" + ppu.registers.status.vblank;
        document.getElementById("nmiOccurred").innerHTML = "0x" + ppu.nmi.occurred ? 1:0 ;
        document.getElementById("writable").innerHTML = "0x" + ppu.vars.w;
        document.getElementById("vram").innerHTML = "0x" + ppu.vars.v.toString(16).toUpperCase();
        document.getElementById("temp").innerHTML = "0x" + ppu.vars.t.toString(16).toUpperCase();

        //Stack

        var st = "";
        var comma = " ,";
        for (var i = cpu.mmu.stack.data.length - 1; i >= cpu.registers.sp.get() + 1; i--) {

            if (i == 0) {
                comma = "";
            }
            var result = cpu.mmu.stack.data[i];
            if (typeof result == 'undefined') {
                st += "0xERR" + comma;
            } else {
                st += "0x" + cpu.mmu.stack.data[i].toString(16).toUpperCase() + comma;
            }
        }

        document.getElementById("stack").innerHTML = st;

        //Operation

        var op = cpu.op;
        if (op) {
            document.getElementById("opcode").innerHTML = "0x" + cpu.op.opcode.toString(16).toUpperCase();
            document.getElementById("opname").innerHTML = cpu.op.op.name;
            document.getElementById("mode").innerHTML = cpu.op.op.mode.name.toUpperCase();
            document.getElementById("opaddr").innerHTML = "0x" + cpu.op.address.toString(16).toUpperCase();
        } else {
            document.getElementById("opcode").innerHTML = "NULL";
            document.getElementById("opname").innerHTML = "NULL";
            document.getElementById("mode").innerHTML = "NULL";
            document.getElementById("opaddr").innerHTML = "NULL";
        }

        //Console

        document.getElementById("cpucycles").innerHTML = cpu.cycles;
        document.getElementById("ppucycles").innerHTML = ppu.cycle;
        document.getElementById("scanline").innerHTML = ppu.scanline;
        document.getElementById("ticks").innerHTML = cpu.ticks;

        var eventStr = "PC:" + cpu.registers.pc.get().toString(16).toUpperCase() + " A:" + cpu.registers.a.get().toString(16).toUpperCase()
        + " X:" + cpu.registers.x.get().toString(16).toUpperCase()
        + " Y:" + cpu.registers.y.get().toString(16).toUpperCase()
        + " P:" + cpu.registers.p.get().toString(16).toUpperCase()
        + " SP:" + cpu.registers.sp.get().toString(16).toUpperCase()
        + " CYC:" + ppu.cycle
        + " SL:" + ppu.scanline;

        var eventElement = $("#Event");
        eventElement.append("<div style='float:left; clear:left; margin: 0px auto;'>"+eventStr+"</div>");
        eventElement.scrollTop(eventElement.prop("scrollHeight"));
        nes.tick();
    },

}