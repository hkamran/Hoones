/**
 * This object handles and represents the catridge of the NES.
 * Its responsibilities is to handle reading the byte data of the roms.
 *
 * Created by Hooman Kamran on 1/01/2016.
 */
var cartridge = {

        rom : '',
        prgs : [],
        chrs : [],
        mapper : {},
        mirror : {},

        vars : {
            control1 : 0x0,
            control1 : 0x0,
            battery : 0x0,
            trainer : 0x0,
            mapper : 0x0,
            numprgs : 0,
            numchrs : 0,
        },

        mirrors : [
            {
                name : "Vertical",
                indexes : [0, 0, 1, 1],
            },
            {
                name : "Horizontal",
                indexes : [0, 1, 0, 1],
            },
            {
                name : "No Screen",
                indexes : [0, 0, 0, 0],
            },
            {
                name : "Single",
                indexes : [0, 0, 0, 0],
            },
            {
                name : "Four Screen",
                indexes : [0, 1, 2, 3],
            }
        ],

        reset : function() {
            this.rom = '';
            this.prgs = [];
            this.chrs = [];
            this.mapper = {};
        },

        load: function(file) {
            this.reset();

            var b  = new BinFileReader(file);
            var rom = b.readString(b.getFileSize(), 0);
            this.rom = rom;

            this.vars.numprgs = rom.charCodeAt(4);
            this.vars.numchrs = rom.charCodeAt(5);
            this.vars.control1 = rom.charCodeAt(6);
            this.vars.control2 = rom.charCodeAt(7);

            this.battery = (this.vars.control1 >> 1) & 1;
            this.trainer = this.vars.control1 & 0x100;

            //Get Mirror Type
            var mirror1 = this.vars.control1 & 1;
            var mirror2 = (this.vars.control1 >> 3) & 1;
            this.mirror = this.mirrors[mirror1 | mirror2 << 1];
            console.log(this.mirror);

            //Get Mapper Type
            var mapper1 = this.vars.control1 >> 4;
            var mapper2 = this.vars.control2 >> 4;
            this.vars.mapper =  mapper1 | mapper2 << 3;

            console.log("Mapper: " + this.vars.mapper);
            console.log("PRGS: " + this.vars.numprgs);
            console.log("CHRS: " + this.vars.numchrs);


            this.setPrgs();
            this.setChrs();
            this.setMapper();
        },

        setPrgs : function() {
            var index = 16;
            if (this.vars.trainer == 1) {
                index += 512;
            }

            for (var i = 0; i < this.vars.numprgs; i++) {
                this.prgs.push(this.rom.substr(index, 0x4000));
                index += 0x4000;
            }

            if (this.vars.numprgs == 1) {
                this.prgs.push(this.prgs[0]);
            }

        },

        setChrs : function() {
            var index = 16;
            if (this.vars.trainer == 1) {
                index += 512;
            }

            index += 0x4000 * this.vars.numprgs;
            for (var i = 0; i < this.vars.numchrs; i++) {
                this.chrs.push(this.rom.substr(index, 0x2000).split(''));
                index += 0x2000;
            }

            if (this.vars.numchrs == 0) {
                this.chrs.push([]);
            }

        },

        setMapper : function() {
            var mapperNum = this.vars.mapper;

            var mapper = this.mappers[mapperNum]

            if (typeof mapper === 'undefined') {
                asdasdasdad.asdasdasd;
            }

            console.log(mapper);

            mapper.prgs.data = this.prgs;
            mapper.chrs.data = this.chrs;

            this.mapper = mapper;
            this.mapper.init();
        },

        mappers : [
            {
                name : 'NROM',
                sram : '',
                mirror : {},
                prgs : {
                    data : [],

                    readByte : function(addr) {
                        addr -= 0x8000;
                        var index = Math.floor(addr / 0x4000);
                        var offset = addr % 0x4000;

                        var bank = this.data[index];

                        return bank.charCodeAt(offset);
                    },

                    writeByte : function(addr, val) {
                        addr -= 0x8000;
                        var index = Math.floor(addr / 0x4000);
                        var offset = addr % 0x4000;

                        var bank = this.data[index];
                        bank[offset] = String.fromCharCode(val);
                    },

                    init : function() {
                        this.mirror = cartridge.mirror;
                    },
                },
                chrs : {
                    data : [],

                    readByte : function(addr) {
                        var bank = this.data[0];
                        var result = bank[addr];
                        if (typeof result === 'undefined') {
                            return 0x0;
                        }

                        return result.charCodeAt(0);
                    },

                    writeByte : function(addr, val) {
                        this.data[0][addr] = String.fromCharCode(val);
                    },

                },

                init : function() {
                    this.prgs.init();
                }
            },
            null,
            {
                name : "UxROM",
                sram : '',
                prgs : {
                    data : [],
                    mirror : {},
                    index1 : 0,
                    index2 : 0,

                    readByte : function(addr) {
                        addr -= 0x8000;
                        var index = Math.floor(addr / 0x4000);
                        var offset = addr % 0x4000;

                        var bank;
                        if (index == 0) {
                            bank = this.data[this.index1];
                        } else {
                            bank = this.data[this.index2];
                        }

                        return bank.charCodeAt(offset);
                    },

                    writeByte : function(addr, val) {
                        this.index1 = val % (this.data.length - 1);
                    },

                    init : function() {
                        this.index1 = 0;
                        this.index2 = this.data.length - 1;
                        this.mirror = cartridge.mirror;
                    }
                },
                chrs : {
                    data : [],

                    readByte : function(addr) {
                        var bank = this.data[0][addr];
                        if (typeof bank === 'undefined') {
                            return 0x0;
                        }

                        var result = bank.charCodeAt(0);

                        return result;
                    },

                    writeByte : function(addr, val) {
                        this.data[0][addr] = String.fromCharCode(val);
                    },
                },

                init : function() {
                    this.prgs.init();
                }
            }
        ],

}