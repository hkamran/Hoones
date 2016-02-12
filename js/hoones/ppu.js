var ppu = {
	
	cycle : 340,
	scanline : 241,
	frame : 0,
		
	//NTSC 
	screen: {
	
		canvas : null,
		pixelSize : 2,
		spacer: 1,
		height : 240,
		width : 255,
				
		colors:[
			"#666666", "#002A88", "#1412A7", "#3B00A4", "#5C007E", "#6E0040", "#6C0600", "#561D00",
			"#333500", "#0B4800", "#005200", "#004F08", "#00404D", "#000000", "#000000", "#000000",
			"#ADADAD", "#155FD9", "#4240FF", "#7527FE", "#A01ACC", "#B71E7B", "#B53120", "#994E00",
			"#6B6D00", "#388700", "#0C9300", "#008F32", "#007C8D", "#000000", "#000000", "#000000",
			"#FFFEFF", "#64B0FF", "#9290FF", "#C676FF", "#F36AFF", "#FE6ECC", "#FE8170", "#EA9E22",
			"#BCBE00", "#88D800", "#5CE430", "#45E082", "#48CDDE", "#4F4F4F", "#000000", "#000000",
			"#FFFEFF", "#C0DFFF", "#D3D2FF", "#E8C8FF", "#FBC2FF", "#FEC4EA", "#FECCC5", "#F7D8A5",
			"#E4E594", "#CFEF96", "#BDF4AB", "#B3F3CC", "#B5EBF2", "#B8B8B8", "#000000", "#000000"
		],
		
		
		reset : function() {
			var c = document.getElementById('screen');	
			c.width  = this.width * (this.pixelSize + this.spacer);
			c.height = this.height * (this.pixelSize + this.spacer);
			this.canvas = c.getContext('2d');	
			
			this.clear();
		},
		
		clear : function() {
			var randomPixel = function() {
				//return (Math.floor(Math.random() * (0xffffff - 0x000000) + 0x000000)).toString(16);
				//return 0xffffff.toString(16);
				return ppu.screen.colors[(Math.floor(Math.random() * (64 - 0) + 0))];
			};
			for (var x = 0; x < this.width; x++) {
				for (var y = 0; y < this.height; y++) {
					this.setPixel(x, y, randomPixel());
				}
			}
		},
		
		getColor : function(val) {
			if (val > 0x40) {
				console.log("ERROR COLOR " + val.toString(16));
				asdasdasd.asdasdasd;
			}
			return this.colors[val];
		},
		
		setPixel : function(x, y, hex) {
			var padHex = function(num) {
				var color = num.toString(16);
				var diff = 6 - color.length;
				if (diff > 0) {
					var padding = "";
					for (var i = 0; i < diff; i++) {
						padding += "0";
					}
					color = padding + color;
				}
				return color = "#" + color;
			}
			
			var color = hex;

			this.canvas.fillStyle = color;
			this.canvas.fillRect(
				x * (this.pixelSize + this.spacer), 
				y * (this.pixelSize + this.spacer), 
				(this.pixelSize),
				(this.pixelSize)
			);
		},
	},
	
	palette : {
		
		//Background colours
		image : {
			data: [],
			
			reset : function() {
				this.data = new Array(0xf);
                for (var i = 0; i != 0xf; ++i) {
                    this.data[i] = 0;
                }
			},
			
			write : function(addr, val) {
				this.data[addr] = val;
			},
			
			read : function(addr) {
				return this.data[addr];
			},
		},
		
		//Sprite colours
		sprite : {
			data: [],
			
			reset : function() {
				this.data = new Array(0xf);
                for (var i = 0; i != 0xf; ++i) {
                    this.data[i] = 0;
                }
			},
			
			write : function(addr, val) {
				this.data[addr] = val;
			},
			
			read : function(addr) {
				return this.data[addr];
			},
		
		},
		
		reset : function() {
			this.image.reset();
			this.sprite.reset();
		},
		
		writeByte : function(addr, val) {
			addr = addr % 0x20;
			if (addr >= 0x10) {
				return this.sprite.write(addr % 0x10, val % 0x40);
			}
			return this.image.write(addr % 0x10, val % 0x40);
		},
		
		readByte : function(addr) {
			addr = addr % 0x20;
			if (addr >= 0x10) {
				return this.sprite.read(addr % 0x10);
			}
			return this.image.read(addr % 0x10);
		},
	},
	
	pattern : {
		data : [[],[]],

		set : function(val) {
			this.data[0] = val[0x0, 0x1000];
			this.data[1] = val[0x1000, 0x2000];
		},

		readByte : function(addr) {
			if (addr >= 0x2000) {
				console.log("Error " + addr.toString(16));
				asdadasdsad.asdasdsa;
				return 0x0;
			}

			var segment = Math.floor(addr / 0x1000);
			var offset = addr % 0x1000;
			
			
			var result = this.data[segment][offset];
			if (typeof result === 'undefined') {
				result = 0x0;
			}

			return result;
		},
		
		writeByte : function(addr, val) {
			if (addr >= 0x2000) {
				asdadsasdsad.asdasdsad;
				return;
			}

			var segment = Math.floor(addr / 0x1000);
			var offset = addr % 0x1000;
			this.data[segment][offset] = val;
		},
		
	},
	
	nametables : {
		table : 	[[],[],[],[]],
		attribute : [[],[],[],[]],
		mirror : [0, 0, 0, 0],
		
		reset : function() {
			for (var i = 0; i < 4; i++) {
				this.table[i] = [];
				this.attribute[i] = [];
			}
		},

		setMirrorType : function(val) {
			this.mirror = val;
		},

		getAddress: function(addr) {
			addr = (addr - 0x2000) % 0x1000;
			var table = Math.floor(addr / 0x0400);
			var offset = addr % 0x0400;
			return 0x2000 + this.mirror[table]*0x0400 + offset;
		},
		
		readByte : function(addr) {

			if (addr > 0x3f00 || addr < 0x2000) {
				console.log("error " + addr.toString(16));
				asdasdasd.asdasdasdasd;
			}

			addr = this.getAddress(addr);
			addr = ((addr - 0x2000) % 0x1000); //Mimic mirrors from 0x3000 to 0x3f00
			
			var index = Math.floor(addr / 0x400); //Segment
			var offset = addr % 0x400; //offset inside the segment
			
			var result;
			if (offset >= 0x3c0) {
				//console.log("Attribute Table " + index);
				result = this.attribute[index][offset & 0x0FF - 0xc0];
			} else {
				//console.log("Name Table " + index + ":" + this.table[index][offset]);
				result = this.table[index][offset];
			}
			
			if(typeof result === 'undefined') {
				result = 0x0;
			}
			return result;
		},
		
		writeByte: function(addr, val) {
			
			if (addr > 0x3f00 || addr < 0x2000) {
				console.log("error " + addr.toString(16));
				asdasdasd.asdasdasdasd;
			}
			
			var addr = ((addr - 0x2000) % 0x1000); //Mimic mirrors from 0x3000 to 0x3f00
			var index = Math.floor(addr / 0x400); //Segment
			var offset = addr % 0x400; //offset inside the segment
			
			
			if (offset >= 0x3c0) {
				this.attribute[index][offset & 0x0FF - 0xc0] = val;
			} else {
				this.table[index][offset] = val;
			}
			
		},
		
	},
	
	oam : {
		addr : 0x0,
		data : [],
	},
	
	reset : function () {
		this.screen.reset(); 
		this.palette.reset();
		//this.scanline = 241;
		//this.cycle = 0;
		this.scanline = 239;
		this.cycle = 340;
		this.vars.f = 1;
		this.registers.cntrl.write(0);
		this.registers.mask.write(0);
		this.registers.oamaddr.write(0);
	},
	
	vars : {
		v: 0x0,			//VRAM Address
		t: 0x0,			//TEMP Address (Latch)
		w: 0,			//WRITABLE used to minic double writes 
		x: 0x0,			//X-SCROLL POS
		l: 0x0,			//LAST WRITE
		f: 0,			//EVEN/ODD frame flag  
	},
	
	nmi : {
		occurred  : false,
		previous  : false,
		output    : false,
		delay 	  : 0,
		
		change : function() {
			var result = this.output && this.occurred;
			if (result && !this.previous) {
                this.delay = 15;
            }
			this.previous = result;
		},
		
		setVerticalBlank : function() {
			this.occurred = true;
			this.change();
		},
		
		clearVerticalBlank : function() {
			this.occurred = false;
			this.change();
		},
		
	},
	
	mmu : {
		
		readByte : function(addr) {
			addr = addr % 0x4000;
			if (addr < 0x2000) {
				return ppu.pattern.readByte(addr);
			} else if (addr < 0x3F00) {
				return ppu.nametables.readByte(addr);
			} else if (addr < 0x4000) {
				return ppu.palette.readByte(addr);
			} else {
				//console.log("ERROR READING " + addr.toString(16));
			}
			
		},
		
		writeByte : function(addr, val) {
			addr = addr % 0x4000;
			if (addr < 0x2000) {
				return ppu.pattern.writeByte(addr, val);
			} else if (addr < 0x3F00) {
				return ppu.nametables.writeByte(addr, val);
			} else if (addr < 0x4000) {
				return ppu.palette.writeByte(addr, val);
			} else {
				//console.log("ERROR WRITING " + addr.toString(16));
			}
		}
	},
	
	registers : {
		
		//0x2000
		cntrl : {
			nametable: 0,
			increment: 0,
			spritetable: 0,
			backgroundtable: 0,
			spritesize: 0,
			masterslave: 0,
			nmi: 0,
			
			write: function(val) {
				this.nametable =       (val >> 0) & 3;
				this.increment =       (val >> 2) & 1;
				this.spritetable =     (val >> 3) & 1;
				this.backgroundtable = (val >> 4) & 1;
				this.spritesize =      (val >> 5) & 1;
				this.masterslave =     (val >> 6) & 1;
				this.nmi =             (val >> 7) & 1;
				
				//NMI Setup
				ppu.nmi.output = (this.nmi == 1);
				ppu.nmi.change();
				
				//Clear bits
				ppu.vars.t = (ppu.vars.t & 0xF3FF) | ((val & 0x03) << 10);
			},
			
			read: function(val) {
				//Not Used
				return 0x0;
			}
		},
		
		//0x2001
		mask : {
			greyscale: 0,
			showbgleft: 0,
			showspleft: 0,
			showbg: 0,
			showsprites: 0,
			increds: 0,
			incgreens: 0,
			incblues: 0,
			
			write : function(val) {
				this.greyscale =   (val >> 0) & 1;
				this.showbgleft =  (val >> 1) & 1;
				this.showspleft =  (val >> 2) & 1;
				this.showbg =      (val >> 3) & 1;
				this.showsprites = (val >> 4) & 1;
				this.increds =     (val >> 5) & 1;
				this.incgreens =   (val >> 6) & 1;
				this.incblues =    (val >> 7) & 1;				
			},
			
			read: function(val) {
				//Not Used
				return 0x0;
			}
		},
		
		//0x2002
		status : {
            unimplemented: 0,
            spriteoverflow: 0,         //TRIGGERS WHEN 9 SPRITESSSSSSSS
            spritehit: 0,          //Sprite 0 HIT
            vblank: 0,
			
			write : function(val) {
				
			},
			
			read: function(val) {
				var result = 0x1F; //0001 1111
				result |= this.spriteoverflow << 5;
				result |= this.spritehit << 6;		
				
				if (ppu.nmi.occurred) {
					result |= 1 << 7;
				}
				
				//Clear NMI
				ppu.nmi.occurred = false;
				ppu.nmi.change();
				
				//Toggle Write
				ppu.vars.w = 0;
				
				return result;
			}
		},
		
		//0x2003
		oamaddr : {
			
			write : function(val) {
				ppu.oam.addr = val;
			},
			
			read: function(val) {
				//Not used
				return 0x0;
			}
		},
		
		//0x2004
		oamdata : {
			
			write : function(val) {
				ppu.oam.data[ppu.oam.addr] = val;
				ppu.oam.addr = (ppu.oam.addr + 1) & 0xFF;	
			},
			
			read: function(val) {
				return ppu.oam.data[ppu.oam.addr];
			}
		},
		
		//0x2005
		scroll : {
			data : 0,
			
			write : function(val) {
				if (ppu.vars.w == 0) {
					ppu.vars.t = (ppu.vars.t & 0xFFE0) | (val >> 3); 
					ppu.vars.x = val & 0x07;
					ppu.vars.w = 1;
				} else {
					ppu.vars.t = (ppu.vars.t & 0x8FFF) | ((val >> 0x07) << 12); 
					ppu.vars.t = (ppu.vars.t & 0xFC1F) | ((val >> 0xF8) << 2); 					
					ppu.vars.w = 0;
				}
			},
			
			read: function(val) {
				//Not Used
				return 0x0;
			}
		},
		
		//0x2006
		addr : {
			
			write : function(val) {
				if (ppu.vars.w == 0) {
					ppu.vars.t = (ppu.vars.t & 0x80FF) | ((val & 0x3F) << 8);
					ppu.vars.w = 1;
				} else {
					ppu.vars.t = (ppu.vars.t & 0xFF00) | val;
					ppu.vars.v = ppu.vars.t;
					ppu.vars.w = 0;
				}
			},
			
			read: function(val) {
				//Not used
				return 0x0;
			}
		},
		
		//0x2007
		data : {
			buffer : 0x0,
			
			write : function(val) {
				ppu.mmu.writeByte(ppu.vars.v, val);
				
				//Increment vram addr
				if (ppu.registers.cntrl.increment == 0) {
					ppu.vars.v += 1;
				} else {
					ppu.vars.v += 32;
				}				
			},
			
			read: function(val) {
				var result;
				
				//Before palette
				if ((ppu.vars.v % 0x4000) < 0x3F00) {
						//Delay the read
						var temp = this.buffer;
						this.buffer = ppu.mmu.readByte(ppu.vars.v);
						result = temp;
				} 
				//After palette
				else if ((ppu.vars.v % 0x4000) >= 0x3F00) {
						//Instant read
						this.buffer = ppu.mmu.readByte(ppu.vars.v);
						result = this.buffer;	
				}
				
				//Increment vram addr
				if (ppu.registers.cntrl.increment == 0) {
					ppu.vars.v += 1;
				} else {
					ppu.vars.v += 32;
				}
				ppu.vars.v &= 0xFFFF;
				
				return result;
			}
		},
		
		//0x4014
		dma : {
			write : function(val) {
				var addr = val << 8;
				
				//Copy from PROG
				for (var i = 0; i < 256; i++) {
					ppu.oam.data[ppu.oam.addr] = 0x0; //TODO read
					ppu.oam.addr = (ppu.oam.addr + 1) & 0xFF;	
					addr++;
				}
				
				//TODO Stall?
			},
			
			read: function(val) {
				//Not Used
				return 0x0;
			}
		},
		
		readByte : function(addr) {
			if (addr == 0x4014) {
				return ppu.vars.l;
			}
			
			addr = 0x2000 + addr % 8;
			
			if (addr == 0x2000) {
				return ppu.vars.l;
			} else if (addr == 0x2001) {
				return ppu.vars.l;
			} else if (addr == 0x2002) {
				return this.status.read(addr);
			} else if (addr == 0x2003) {
				return ppu.vars.l;
			} else if (addr == 0x2004) {
				return this.oamdata.read(addr);
			} else if (addr == 0x2005) {
				return ppu.vars.l;
			} else if (addr == 0x2006) {
				return ppu.vars.l;
			} else if (addr == 0x2007) {
				return this.data.read(addr);
			}
		},
		
		writeByte : function(addr, val) {
			
			ppu.vars.l = val;
			
			if (addr == 0x4014) {
				this.dma.write(val);
			}
			
			addr = 0x2000 + addr % 8;
			
			//console.log("Writing " + addr.toString(16) + ":" + val.toString(16) + ":"+ nes.cpu.cycles);
			
			if (addr == 0x2000) {
				this.cntrl.write(val);
			} else if (addr == 0x2001) {
				this.mask.write(val);
			} else if (addr == 0x2002) {
				//Not used
			} else if (addr == 0x2003) {
				this.oamaddr.write(val);
			} else if (addr == 0x2004) {
				this.oamdata.write(val);
			} else if (addr == 0x2005) {
				this.scroll.write(val);
			} else if (addr == 0x2006) {
				this.addr.write(val);
			} else if (addr == 0x2007) {
				this.data.write(val);
			}
		}
	},
	
	background : {
		
		attributeTableByte : 0x00,
		nameTableAddr : 0x0,
		nameTableByte : 0x00,

		lowTileByte   : 0x0,
		highTileByte  : 0x0,

		tileData : 0x0,
		lowTileData : 0x0,
		highTileData : 0x0,

		xpos: 0,
		ypos: 0,
		
		// V ADDRESS
		// yyy NNYY YYYX  XXXX
		// ||| |||| |||+--++++- coarse X scroll
		// ||| ||++-+++-------- coarse Y scroll
		// ||| ++-------------- nametable select
		// +++----------------- fine Y scroll
		
		//Increment coarse X scroll
		incrementX :  function() {
			if ((ppu.vars.v & 0x001F) == 31) {
				ppu.vars.v &= 0xFFE0; //Set X=0
				ppu.vars.v ^= 0x0400; //Switch horizontal nametable
			} else {
				ppu.vars.v = ppu.vars.v + 1; //increase X
			}
		},
		
		//Increment fine Y scroll
		incrementY : function() {
			if ((ppu.vars.v & 0x7000) != 0x7000) {
				ppu.vars.v += 0x1000;
			} else {
				//set y=0
				ppu.vars.v &= 0x8FFF;
				
				var y = (ppu.vars.v & 0x03E0) >> 5;
				if (y == 29) {
					//Set coarse y=0
					y = 0;
					//switch vertical nametable
					ppu.vars.v ^= 0x0800;
				} else if (y == 31) {
					y = 0;
				} else {
					//increment coarse y
					y++;
				}
				//place y to v
				ppu.vars.v = (ppu.vars.v & 0xFC1F) | (y << 5);
			}
		},
		
		//Copy T to V (X pos)
		setX : function() {
			ppu.vars.v = (ppu.vars.v & 0xFBE0) | (ppu.vars.t & 0x041F); 
		},
		
		//Copy T to V (Y pos)
		setY : function() {
			ppu.vars.v = (ppu.vars.v & 0x841F) | (ppu.vars.t & 0x7BE0);
		},
		
		fetchNameTableByte : function() {
			var v = ppu.vars.v;
			var address = 0x2000 | (v & 0x0FFF);

			ppu.background.nameTableByte = ppu.mmu.readByte(address);
			this.nameTableAddr = address;
		},
		
		fetchAttributeTableByte : function() {
			var v = ppu.vars.v;
			var addr = 0x23C0 | (v & 0x0C00) | ((v >> 4) & 0x38) | ((v >> 2) & 0x07);
			var shift = ((v >> 4) & 4) | (v & 2);
			ppu.background.attributeTableByte = ((ppu.mmu.readByte(addr) >> shift) & 3) << 2;
			//log("ATTRIBUTE " + ppu.background.attributeTableByte + ":" + addr.toString(16));
		},
		
		fetchLowTileByte : function() {
			var addr = this.fetchTileAddr();
			ppu.background.lowTileByte  = ppu.mmu.readByte(addr);
		},
		
		fetchHighTyleByte : function() {
			var addr = this.fetchTileAddr() + 8;
			ppu.background.highTileByte = ppu.mmu.readByte(addr);
		},
		
		fetchTileAddr : function() {
			var fineY = (ppu.vars.v >> 12) & 7;
			var table = ppu.registers.cntrl.backgroundtable;
			var tile = ppu.background.nameTableByte;
			var address = (0x1000*table) + (tile*16) + fineY;
			return address;
		},
		
		storeTileData : function() {
			var data = 0x0;
				
			for (var i = 0; i < 8; i++) {
				var a = ppu.background.attributeTableByte;
				
				var p1 = (ppu.background.lowTileByte & 0x80) >> 7;
				var p2 = (ppu.background.highTileByte & 0x80) >> 6;

				ppu.background.lowTileByte  <<= 1;
				ppu.background.highTileByte <<= 1;
				log("A: " + a.toString(2) + " low: " + p1.toString(2) + " high: " + p2.toString(2) + ": data" + data.toString(2));
				data <<= 4;
				data |= (a | p1 | p2) & 0xf;
			}
			log("STORING " + "LOW " + ppu.background.lowTileData.toString(2) + ":" + data.toString(2));
			ppu.background.lowTileData |= data;
			ppu.background.tileData |= data;

		},
		
		fetchTileData : function() {
			return ppu.background.lowTileData;
		},
		
		getPixelByte: function() {
			if (ppu.registers.mask.showbg == 0) {
				return 0x0;
			}
			var data = this.fetchTileData() >> ((7 - ppu.vars.x) * 4);
			return data;
		}
	},
		
	sprites : {
		
	},
		
	renderPixel : function() {
		var x = this.cycle - 2;
		var y = this.scanline;
		ppu.background.xpos = x;
		ppu.background.ypos = y;

		var background = ppu.background.getPixelByte();
		if (x < 8 && ppu.registers.mask.showbg == 0) {
			background = 0;
		}
		
		var b = background % 4 != 0;
		if (!b) {
			background = 0;
		}
		
		var pallete = ppu.palette.readByte(background);
		var color = ppu.screen.getColor(pallete);
		ppu.screen.setPixel(x, y, color);
	},

	
	tick : function() {
		
		//Note: [0-261], 0-239 visible, 240 post, 241-260 vblank, 261 preLine
		
		var preLine = this.scanline == 261;
		var visibleLine = this.scanline < 240;
		var renderLine = preLine || visibleLine;
		
		var preCycle = this.cycle >= 321 && this.cycle <= 336;
		var visibleCycle = this.cycle >= 1 && this.cycle <= 256;
		var fetchCycle = preCycle || visibleCycle;
		
		var renderingEnabled  = ppu.registers.mask.showbg != 0 || ppu.registers.mask.showsprites != 0;
		
		//Trigger NMI
		if (ppu.nmi.delay  > 0) {
			ppu.nmi.delay--;
			if (ppu.nmi.delay == 0 && ppu.nmi.output && ppu.nmi.occurred) {
				console.log("TRIGGER");
				cpu.interrupts.triggerIRQ();
			}
		}

		//Update Cycle/Scanlines/Frame information
		if (renderingEnabled &&
			((ppu.vars.f == 1) && (ppu.scanline == 261) && (ppu.cycle == 340))) {
				ppu.cycle = 0;
				ppu.scanline = 0;
				ppu.frame++;
				ppu.vars.f ^= 1;

		} else {
			ppu.cycle++;
			if (ppu.cycle > 340) {
				ppu.cycle = 0;
				ppu.scanline++;
				if (ppu.scanline > 261) {
					ppu.scanline = 0;
					ppu.frame++;
					ppu.vars.f ^= 1;
				}
			}
		}
		
		//Print Pixel
		if (renderingEnabled) {
			if (visibleLine && visibleCycle) {
				this.renderPixel();
			}
		}
		
		//Prepare Background Pixel
		if (renderingEnabled) {
			if (renderLine && fetchCycle) {
				log("BEFORE LOW: "  + ppu.background.lowTileData.toString(2));
				log("BEFORE HIGH: " + ppu.background.highTileData.toString(2));
				log("REAL BEFORE " + ppu.background.tileData.toString(2));
				if (ppu.background.lowTileData > 0x80000000) {
					console.log("error");
				}
				ppu.background.tileData <<= 4;
				var transfer = (ppu.background.lowTileData >> 28) & 0xF;

                ppu.background.lowTileData &= 0xFFFFFFF;
				ppu.background.lowTileData <<= 4;
				ppu.background.highTileData &= 0xFFFFFFF;
				ppu.background.highTileData <<= 4;
				ppu.background.highTileData |= transfer;

				log("AFTER LOW: "  + ppu.background.lowTileData.toString(2));
				log("AFTER HIGH: " + ppu.background.highTileData.toString(2));
				log("REAL AFTER: " + ppu.background.tileData.toString(2));
                var remainder = this.cycle % 8;
				log("Remainder " + remainder);
				switch (remainder) {
					case 1:
						ppu.background.fetchNameTableByte();
						break;
					case 3:
						ppu.background.fetchAttributeTableByte();
						break;
					case 5:
						ppu.background.fetchLowTileByte();
						break;
					case 7:
						ppu.background.fetchHighTyleByte();
						break;
					case 0:
						ppu.background.storeTileData();
						break;
				}
			}
			if (preLine && (ppu.cycle >= 280) && (ppu.cycle <= 304)) {
				ppu.background.setY();
			}
			if (renderLine) {
				if (fetchCycle && ((ppu.cycle % 8) == 0)) {
					ppu.background.incrementX();
				}
				if (ppu.cycle == 256) {
					ppu.background.incrementY();
				}
				if (ppu.cycle == 257) {
					ppu.background.setX();
				}
			}
		}

		if ((ppu.scanline == 241) && (ppu.cycle == 1)) {
			ppu.nmi.setVerticalBlank();
		}
		if (preLine && ppu.cycle == 1) {
			ppu.nmi.clearVerticalBlank();
            ppu.registers.status.spriteoverflow = 0;
			ppu.registers.status.spritehit = 0;
		}
	},
	
	tickFor : function(cycles) {
		var start = 0;
		var end = cycles;
		for (var i = 0; i <= end; i++) {
			this.tick();

		}
	},
}