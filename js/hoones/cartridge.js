/**
 * This object handles and represents the catridge of the NES.
 * Its responsibilities is to handle reading the byte data of the roms.
 *
 * Created by Hooman Kamran on 1/01/2016.
 */
var cartridge = {
        rawrom : '',

        //Game code
        prgrom: {
            _size: 0x4000,
            _upperIndex: 1,
            _lowerIndex: 0,

            banks : [],

            getUpperBank: function() {
                return this.banks[this._upperIndex];
            },

            getLowerBank: function() {
                return this.banks[this._lowerIndex];
            }
        },

        //PPU Code
        chrrom: {
            _size: 0x2000,
            _index: 0,

            banks: [],

            getBank: function() {
                return this.banks[this._index];
            }
        },

        meta: {
            numprgs: 0,
            numchrs: 0,
            control1: 0x00,
            control2: 0x00,
            mirror: 0,
            hasTrainer: 0,
            battery: 0,
        },

        mirroring: {
            getType : function() {
                var types = [
                    [0,0,1,1], //Horizontal
                    [0,1,0,1], //Vertical
                    [0,0,0,0], //No Screen
                    [1,1,1,1], //Single Screen
                    [0,1,2,3], //Four Screen
                ];

                return types[cartridge.meta.mirror];
            },
        },

        reset : function() {

        },

        load: function(file) {
            var b  = new BinFileReader(file);
            var rom = b.readString(b.getFileSize(), 0);
            this.rawrom = rom;

            this.meta.numprgs = rom.charCodeAt(4);
            this.meta.numchrs = rom.charCodeAt(5);
            this.meta.control1 = rom.charCodeAt(6);
            this.meta.control2 = rom.charCodeAt(7);

            this.battery = (this.meta.control1 >> 1) & 1;
            this.hasTrainer = this.meta.control1 & 0x100;

            var mirror1 = this.meta.control1 & 1;
            var mirror2 = (this.meta.control1 >> 3) & 1;
            this.mirror = mirror1 | mirror2<<1;


            var initial = 15;

            if (this.meta.hasTrainer == 1) {
                initial += 512;
            }

            var start = initial + 1;
            for (var i = 0; i < this.meta.numprgs; i++) {
                this.prgrom.banks.push(rom.substr(start, 0x4000));
                start += 0x4000;
            }

            if (this.meta.numprgs == 1) {
                this.prgrom.banks.push(this.prgrom.banks[0]);
            }

            start = initial + 1 + (0x4000 * this.meta.numprgs);
            for (var i = 0; i < this.meta.numchrs; i++) {
                this.chrrom.banks.push(rom.substr(start, 0x2000));
                start += 0x2000;
            }

            if (this.meta.numchrs == 0) {
                this.chrrom.banks.push([]);
            }

        }

}