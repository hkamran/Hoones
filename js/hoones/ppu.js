var ppu = {
	
	cycle : 340,
	scanline : 241,
	frame : 0,
		
	//NTSC 
	screen: {
	
		canvas : null,
		pixelSize : 2,
		spacer: 0,
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

		rbgs:[
			[102,102,102],
			[0,42,136],
			[20,18,167],
			[59,0,164],
			[92,0,126],
			[110,0,64],
			[108,6,0],
			[86,29,0],

			[51,53,0],
			[11,72,0],
			[0,82,0],
			[0,79,8],
			[0,64,77],
			[0,0,0],
			[0,0,0],
			[0,0,0],

			[173,173,173],
			[21,95,217],
			[66,64,255],
			[117,39,254],
			[160,26,204],
			[183,30,123],
			[181,49,32],
			[153,78,0],

			[107,109,0],
			[56,135,0],
			[12,147,0],
			[0,143,50],
			[0,124,141],
			[0,0,0],
			[0,0,0],
			[0,0,0],

			[255,254,255],
			[100,176,255],
			[146,144,255],
			[198,118,255],
			[243,106,255],
			[254,110,204],
			[254,129,112],
			[234,158,34],

			[188,190,0],
			[136,216,0],
			[92,228,48],
			[69,224,130],
			[72,205,222],
			[79,79,79],
			[0,0,0],
			[0,0,0],

			[255,254,255],
			[192,223,255],
			[211,210,255],
			[232,200,255],
			[251,194,255],
			[254,196,234],
			[254,204,197],
			[247,216,165],

			[228,229,148],
			[207,239,150],
			[189,244,171],
			[179,243,204],
			[181,235,242],
			[184,184,184],
			[0,0,0],
			[0,0,0],

		],

		
		reset : function() {
			var c = document.getElementById('screen');	
			c.width  = this.width * (this.pixelSize + this.spacer);
			c.height = this.height * (this.pixelSize + this.spacer);
			this.canvas = c.getContext('2d');

			this.clear();
			ppu.renderer.buffer.reset();
		},



		clear : function() {
			ppu.renderer.buffer.reset();
			var randomPixel = function() {
				//return (Math.floor(Math.random() * (0xffffff - 0x000000) + 0x000000)).toString(16);
				//return 0xffffff.toString(16);
				return ppu.screen.rbgs[(Math.floor(Math.random() * (63 - 0) + 0))];
			};
			for (var x = 0; x < this.width; x++) {
				for (var y = 0; y < this.height; y++) {
					var color =  randomPixel();
					//console.log(color);
					ppu.renderer.buffer.setPixel(x, y, color);
				}
			}
			ppu.renderer.buffer.print();
		},
		
		getColorRBG : function(val) {
			if (val > 0x40) {
				console.log("ERROR COLOR " + val.toString(16));
				asdasdasd.asdasdasd;
			}

			var result = this.rbgs[val];
			if (typeof result == 'undefined') {
				console.log("ERROR " + val.toString(16));
			}
			return result;
		},

		getColorHex : function(val) {
			if (val > 0x40) {
				console.log("ERROR COLOR " + val.toString(16));
				asdasdasd.asdasdasd;
			}

			var result = this.colors[val];
			if (typeof result == 'undefined') {
				console.log("ERROR " + val.toString(16));
			}
			return result;
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

	mmu : {

		//-----------------
		//Pattern 0x2000
		//----------------
		//Nametables 0x3F00
		//----------------
		//Patette 0x4000
		//------------------

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
				if (addr > 0x10) {
					return this.sprite.write(addr % 0x10, val % 0x40);
				}
				return this.image.write(addr % 0x10, val % 0x40);
			},

			readByte : function(addr) {
				addr = addr % 0x20;
				if (addr > 0x10) {
					return this.sprite.read(addr % 0x10);
				}
				return this.image.read(addr % 0x10);
			},
		},

		pattern : {
			data : [],

			set : function(val) {
				this.data = val;
			},

			readByte : function(addr) {
				if (addr >= 0x2000) {
					console.log("Error " + addr.toString(16));
					asdadasdsad.asdasdsa;
					return 0x0;
				}

				var result = this.data.charCodeAt(addr);
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

				this.data[addr] = String.fromCharCode(val);
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


			readByte : function(addr) {

				if (addr > 0x3f00 || addr < 0x2000) {
					console.log("error " + addr.toString(16));
					asdasdasd.asdasdasdasd;
				}

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

			// OAM 4 Bytes per sprite
			//-------------------------------------------------------------------
			// +-Byte 0 - Y Positions of top of sprite (delay by 1 scanline)
			// +-Byte 1 - Tile Index Number
			// |
			// |  $00: $0000-$001F
			// |  $01: $1000-$101F
			// |  $02: $0020-$003F
			// |  $03: $1020-$103F
			// |  $04: $0040-$005F
			// |	   [...]
			// +-Byte 2 - Attribute
			// |  76543210
			// |  ||||||||
			// |  |||||||+- Bank ($0000 or $1000) of tiles
			// |  +++++++-- Tile number of top of sprite (0 to 254; bottom half gets the next tile)
			// |
			// +-Byte 3 - X position of the left side of sprite

			setAddr : function(addr) {
				this.addr = addr & 0xFF;
			},

			writeByte : function(val) {
				this.data[this.addr] = val;
				this.addr = (this.addr + 1) & 0xFF;
			},

			readByte : function(val) {
				var result = this.data[val];
				if (typeof result == 'undefined') {
					result = 0xFF;
				}
				return result;
			},

			getYpos : function(spriteIndex) {
				var ypos = this.readByte(spriteIndex * 4 + 0);
				return ypos;
			},

			getTile : function(spriteIndex) {
				var tile = this.readByte(spriteIndex * 4 + 1);
				return tile;
			},

			getAttr : function(spriteIndex) {
				var attr = this.readByte(spriteIndex * 4 + 2);
				return attr;
			},

			getXpos : function(spriteIndex) {
				var xpos = this.readByte(spriteIndex * 4 + 3);
				return xpos;
			},

		},

		readByte : function(addr) {
			addr = addr % 0x4000;
			if (addr < 0x2000) {
				return this.pattern.readByte(addr);
			} else if (addr < 0x3F00) {
				return this.nametables.readByte(addr);
			} else if (addr < 0x4000) {
				return this.palette.readByte(addr);
			} else {
				//console.log("ERROR READING " + addr.toString(16));
			}

		},

		writeByte : function(addr, val) {
			addr = addr % 0x4000;
			if (addr < 0x2000) {
				return this.pattern.writeByte(addr, val);
			} else if (addr < 0x3F00) {
				return this.nametables.writeByte(addr, val);
			} else if (addr < 0x4000) {
				return this.palette.writeByte(addr, val);
			} else {
				//console.log("ERROR WRITING " + addr.toString(16));
			}
		}
	},

	setCartidge : function(cartridge) {
		this.mmu.nametables.setMirrorType(cartridge.mirroring.getType());
		this.mmu.pattern.set(cartridge.chrrom.getBank());
	},

	reset : function () {
		this.screen.reset(); 
		this.mmu.palette.reset();
		//this.scanline = 241;
		//this.cycle = 0;
		this.scanline = 0;
		this.cycle = 0;
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
				var result = 0x0; //0001 1111
				result |= this.spriteoverflow << 5;
				result |= this.spritehit << 6;		
				
				if (ppu.nmi.occurred) {
					result |= 1 << 7;
				}
				
				//Clear NMI
				if (debug.output && ppu.nmi.occurred) {
					console.log("WEREWR");
				}
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
				log("Setting OAM Addr " + val.toString(16));
				ppu.mmu.oam.setAddr(val);
			},
			
			read: function(val) {
				//Not used
				return 0x0;
			}
		},
		
		//0x2004
		oamdata : {
			
			write : function(val) {
				log("Writing to OAM " + val.toString(16) + ":" + ppu.mmu.oam.addr.toString(16));
				ppu.mmu.oam.writeByte(val);
			},
			
			read: function() {
				return ppu.mmu.oam.readByte();
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
				log("SCROLL " + ppu.vars.w);
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
					log("W=0 " + val.toString(16) + " " + ppu.vars.t.toString(16));
					ppu.vars.w = 1;
				} else {
					log("W=1 " + val.toString(16) + " " + ((ppu.vars.t & 0xFF00) | val).toString(16) + " " + ppu.vars.t.toString(16));
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
				log("WRITING: " + val.toString(16) + " at " + ppu.vars.v.toString(16));
				ppu.mmu.writeByte(ppu.vars.v, val);
				
				//Increment vram addr
				if (ppu.registers.cntrl.increment == 0) {
					ppu.vars.v += 1;
				} else {
					ppu.vars.v += 32;
				}				
			},
			
			read: function(val) {
				log(ppu.vars.v);
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
				log("READING 2007: " + result.toString(16) + " AT " + ppu.vars.v.toString(16));
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
				log("DMA " + ppu.mmu.oam.addr.toString(16) + ":" + addr.toString(16));
				//Copy from PROG
				for (var i = 0; i < 256; i++) {
					ppu.mmu.oam.writeByte(cpu.mmu.readByte(addr));
					addr++;
				}

				//cpu.stall += 513
				//if cpu.Cycles%2 == 1 {
				//	cpu.stall++
				//}
				
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
				return;
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

	renderer : {

		buffer : {
			frame : [],

			reset : function() {
				var width  = ppu.screen.width * (ppu.screen.pixelSize + ppu.screen.spacer);
				var height = ppu.screen.height * (ppu.screen.pixelSize + ppu.screen.spacer);
				this.frame = ppu.screen.canvas.getImageData(0, 0, width, height);
			},

			setPixel : function(x, y, color) {

				var screen = ppu.screen;
				var pixelSize = screen.pixelSize;
				var pixelWidth = (screen.pixelSize + screen.spacer);
				var height  = (screen.width * pixelWidth) * 4 ;
				var width = (x * pixelWidth * 4);

				var index = (y * height * pixelWidth) + width;

				var startInter = pixelSize;
				var heightSub = height - ((4 * startInter) + 4) + (pixelSize * pixelSize);


				for (var cy = startInter; cy != 0; cy--) {
					for (var cx = startInter; cx != 0; cx--) {
						this.frame.data[index + 0] = color[0];
						this.frame.data[index + 1] = color[1];
						this.frame.data[index + 2] = color[2];
						this.frame.data[index + 3] = 255;
						index += 4;
					}
					index += heightSub;
				}

			},

			print : function() {
				ppu.screen.canvas.putImageData(this.frame, 0, 0);
			}

		},

		background : {

			attributeTableByte : 0x00,
			nameTableAddr : 0x0,
			nameTableByte : 0x00,

			lowTileByte   : 0x0,
			highTileByte  : 0x0,

			lowTileData : 0x0,
			highTileData : 0x0,

			fetchNameTableByte : function() {
				var v = ppu.vars.v;
				var address = 0x2000 | (v & 0x0FFF);

				this.nameTableAddr = address;
				this.nameTableByte = ppu.mmu.readByte(address);
			},

			fetchAttributeTableByte : function() {
				var v = ppu.vars.v;
				var addr = 0x23C0 | (v & 0x0C00) | ((v >> 4) & 0x38) | ((v >> 2) & 0x07);
				var shift = ((v >> 4) & 4) | (v & 2);
				this.attributeTableByte = ((ppu.mmu.readByte(addr) >> shift) & 3) << 2;
			},

			fetchLowTileByte : function() {
				var addr = this.fetchTileAddr();
				this.lowTileByte  = ppu.mmu.readByte(addr);
			},

			fetchHighTyleByte : function() {
				var addr = this.fetchTileAddr() + 8;
				this.highTileByte = ppu.mmu.readByte(addr);
			},

			fetchTileAddr : function() {
				var fineY = (ppu.vars.v >> 12) & 7;
				var table = ppu.registers.cntrl.backgroundtable;
				var tile = this.nameTableByte;
				var address = (0x1000*table) + (tile*16) + fineY;
				log("TILE " + address.toString(16));
				return address;
			},

			storeTileData : function() {
				var data = 0x0;

				for (var i = 0; i < 8; i++) {
					var a = this.attributeTableByte;

					var p1 = (this.lowTileByte & 0x80) >> 7;
					var p2 = (this.highTileByte & 0x80) >> 6;

					this.lowTileByte  <<= 1;
					this.highTileByte <<= 1;

					data <<= 4;
					data |= (a | p1 | p2) & 0xf;
				}
				this.lowTileData |= data;
			},

			fetchTileData : function() {
				return this.highTileData;
			},

			getPixelByte: function() {
				if (ppu.registers.mask.showbg == 0) {
					return 0x0;
				}
				var shift = (((7 - ppu.vars.x))  * 4);
				var result = this.fetchTileData() >>> shift;
				log("X: " + ppu.vars.x + ":" + result.toString(2) + ":" + shift);
				return result & 0xF;
			}
		},

		sprites : {

			spriteCount : 0x0,
			spritePatterns: [],
			spritePositions: [],
			spritePriorities: [],
			spriteIndexes: [],

			// OAM 4 Bytes per sprite
			//-------------------------------------------------------------------
			// +-Byte 0 - Y Positions of top of sprite (delay by 1 scanline)
			// +-Byte 1 - Tile Index Number
			// |
			// |  $00: $0000-$001F
			// |  $01: $1000-$101F
			// |  $02: $0020-$003F
			// |  $03: $1020-$103F
			// |  $04: $0040-$005F
			// |	   [...]
			// +-Byte 2 - Attribute
			// |  76543210
			// |  ||||||||
			// |  |||||||+- Bank ($0000 or $1000) of tiles
			// |  +++++++-- Tile number of top of sprite (0 to 254; bottom half gets the next tile)
			// |
			// +-Byte 3 - X position of the left side of sprite

			fetchTileAddr : function(spriteIndex, row) {
				var table = ppu.registers.cntrl.spritetable;
				var attr = ppu.mmu.oam.getAttr(spriteIndex);
				var tile = ppu.mmu.oam.getTile(spriteIndex);

				if (ppu.registers.cntrl.spritesize == 0) {
					if ((attr & 0x80) == 0x80) {
						row = 7 - row;
					}
					table = ppu.registers.cntrl.spritetable;
				} else {
					if ((attr & 0x80) == 0x80) {
						row = 15 - row;
					}
					table = tile & 1;
					tile &= 0xFE;
					if (row > 7) {
						row -= 8;
					}
				}

				var addr = (0x1000 * table) + (tile * 16) + row;
				return addr;
			},


			fetchLowTileByte : function(addr) {
				return ppu.mmu.readByte(addr);
			},

			fetchHighTileByte : function(addr) {
				return ppu.mmu.readByte(addr + 8);
			},

			fetchAttributeByte : function(spriteIndex) {
				return ppu.mmu.oam.getAttr(spriteIndex);
			},

			fetchSpriteData : function(spriteIndex, row) {
				var tile = this.fetchTileAddr(spriteIndex, row)
				var lowTileByte = this.fetchLowTileByte(tile);
				var highTileByte = this.fetchHighTileByte(tile);
				var attr = this.fetchAttributeByte(spriteIndex);

				var a = (attr & 3) << 2;

				var data = 0;
				for (var i = 0; i < 8; i++) {
					var p1;
					var p2;
					if ((attr & 0x40) == 0x40) {
						p1 = (lowTileByte & 1) << 0;
						p2 = (highTileByte & 1) << 1;
						lowTileByte >>= 1;
						highTileByte >>= 1;
					} else {
						p1 = (lowTileByte & 0x80) >> 7;
						p2 = (highTileByte & 0x80) >> 6;

						lowTileByte <<= 1;
						highTileByte <<= 1;
					}
					data <<= 4;
					data |= (a | p1 | p2) & 0xf;

				}
				return data;
			},

			storeSpriteData : function() {
				var height = 0;
				if (ppu.registers.cntrl.spritesize == 0) {
					height = 8;
				} else {
					height = 16;
				}
				var count = 0;
				for (var i = 0; i < 64; i++) {
					var ypos = ppu.mmu.oam.getYpos(i);
					var attr = ppu.mmu.oam.getAttr(i);
					var xpos = ppu.mmu.oam.getXpos(i);

					var row = ppu.scanline - ypos;
					if (row < 0 || row >= height) {
						continue;
					}
					if (count < 8) {
						this.spritePatterns[count] = this.fetchSpriteData(i, row);
						this.spritePositions[count] = xpos;
						this.spritePriorities[count] = ((attr >> 5) & 1);
						this.spriteIndexes[count] = i;
					}
					count++;
				}
				if (count > 8) {
					count = 8;
					ppu.registers.status.spriteoverflow = 1;
				}
				this.spriteCount = count;
			},

			getPixelByte : function() {
				if (ppu.registers.mask.showsprites == 0) {
					return [0,0];
				}
				for (var i = 0; i < this.spriteCount; i++) {
					var offset = (ppu.cycle - 1) - this.spritePositions[i];
					if (offset < 0 || offset > 7) {
						continue;
					}
					offset = 7 - offset;
					var color = (this.spritePatterns[i] >>> (offset * 4)) & 0xFF;
					//console.log(this.spritePatterns[i].toString(16)  + " FETCH " + this.spritePatterns[i].toString(2) + ":" + (offset * 4)
					//	+ ":OFFSET" + offset + ":" + (color % 4 == 0) + ":" + color.toString(16));
					if ((color % 4) == 0) {
						continue;
					}

					return [i, color];
				}
				return [0,0];
			},
		},



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


		tick : function() {
			var x = ppu.cycle - 2;
			var y = ppu.scanline;

			var result = this.sprites.getPixelByte();

			var background = this.background.getPixelByte();

			var sprite = result[1];

			var i = result[0];


			if (x < 8 && ppu.registers.mask.showbg == 0) {
				background = 0;
			}
			if (x < 8 && ppu.registers.mask.showspleft == 0) {
				sprite = 0;
			}

			var b = background % 4 != 0;
			var s = sprite % 4 != 0;
			var color;
			if (!b && !s) {
				color = 0;
			} else if (!b && s) {
				color = sprite | 0x10;
			} else if (b && !s) {
				color = background;
			} else {
				if ((ppu.renderer.sprites.spriteIndexes[i] == 0) && (x < 255)) {
					ppu.registers.status.spritehit = 1;
				}
				if (ppu.renderer.sprites.spritePriorities[i] == 0) {
					color = sprite | 0x10;
				} else {
					color = background;
				}
			}

			var palette = ppu.mmu.palette.readByte(color);

			//var hex = ppu.screen.getColorHex(palette & 0xFF);
			//ppu.screen.setPixel(x, y, hex)
			var hex = ppu.screen.getColorRBG(palette & 0xFF);
			this.buffer.setPixel(x, y, hex);
		},



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

		var cycle = this.cycle % 8;

		//Trigger NMI
		if (ppu.nmi.delay  > 0) {
			ppu.nmi.delay--;
			if (ppu.nmi.delay == 0 && ppu.nmi.output && ppu.nmi.occurred) {
				cpu.interrupts.triggerNMI();
			}
		}

		//Update Cycle/Scanlines/Frame information
		if (renderingEnabled &&
			((ppu.vars.f == 1) && (ppu.scanline == 261) && (ppu.cycle == 340))) {
				ppu.cycle = 0;
				ppu.scanline = 0;
				ppu.frame++;

				ppu.renderer.buffer.print();
				ppu.vars.f ^= 1;

		} else {
			ppu.cycle++;
			if (ppu.cycle > 340) {
				ppu.cycle = 0;
				ppu.scanline++;
				if (ppu.scanline > 261) {
					ppu.scanline = 0;
					ppu.renderer.buffer.print();
					ppu.frame++;
					ppu.vars.f ^= 1;
				}
			}
		}


		//Print Pixel
		if (renderingEnabled) {
			if (visibleLine && visibleCycle) {
				ppu.renderer.tick();
			}
		}

		//Prepare Background Pixel
		if (renderingEnabled) {
			if (renderLine && fetchCycle) {
				//log("BEFORE LOW: "  + ppu.background.lowTileData.toString(2));
				//log("BEFORE HIGH: " + ppu.background.highTileData.toString(2));
				//log("REAL BEFORE " + ppu.background.tileData.toString(2));s

				var transfer = (ppu.renderer.background.lowTileData >> 28) & 0xF;

                ppu.renderer.background.lowTileData &= 0xFFFFFFF;
				ppu.renderer.background.lowTileData <<= 4;
				ppu.renderer.background.highTileData &= 0xFFFFFFF;
				ppu.renderer.background.highTileData <<= 4;
				ppu.renderer.background.highTileData |= transfer;

				//log("AFTER LOW: "  + ppu.background.lowTileData.toString(2));
				//log("AFTER HIGH: " + ppu.background.highTileData.toString(2));
				//log("REAL AFTER: " + ppu.background.tileData.toString(2));
                var remainder = this.cycle % 8;
				//log("Remainder " + remainder);

				if (remainder == 1) {
					ppu.renderer.background.fetchNameTableByte();
				} else if (remainder == 3) {
					ppu.renderer.background.fetchAttributeTableByte();
				} else if (remainder == 5) {
					ppu.renderer.background.fetchLowTileByte();
				} else if (remainder == 7) {
					ppu.renderer.background.fetchHighTyleByte();
				} else if (remainder == 0) {
					ppu.renderer.background.storeTileData();
				}


			}
			if (preLine && (ppu.cycle >= 280) && (ppu.cycle <= 304)) {
				ppu.renderer.setY();
			}
			if (renderLine) {
				if (fetchCycle && ((ppu.cycle % 8) == 0)) {
					ppu.renderer.incrementX();
				}
				if (ppu.cycle == 256) {
					ppu.renderer.incrementY();
				}
				if (ppu.cycle == 257) {
					ppu.renderer.setX();
				}
			}
		}


		if (renderingEnabled) {
			if (ppu.cycle == 257) {
				if (visibleLine) {
					ppu.renderer.sprites.storeSpriteData();
				} else {
					ppu.renderer.sprites.spriteCount = 0;
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