/**
 * This object handles and represents the PPU (Pixel processing unit).
 * Its responsibilities is to render the screen of the NES.
 *
 * Created by Hooman Kamran on 1/01/2016.
 */
var ppu = {

	cycle : 340,
	scanline : 241,
	frame : 0,
	cartridge : {},

	/**
	 * Represents the screen of the NES, and is responsible of its functions.
	 *
	 * Source:
	 *      http://wiki.nesdev.com/w/index.php/NTSC_video
	 *
	 * Notes:
	 *      Scanline Timings
	 *          Rendering           [000-239]
	 *          Post-Render         [240-241]
	 *          Post-Render blank   [242-244]
	 *          Vertical Sync       [245-247]
	 *          Pre-render blank    [248-261]
	 *
	 */
	screen: {

		canvas : null,
		pixelSize : 2,
		spacer: 0,
		height : 240,
		width : 256,

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


		/**
		 * Resets and clears the screen to the specified width/height.
		 */
		reset : function() {
			var c = document.getElementById('screen');
			c.width  = this.width * (this.pixelSize + this.spacer);
			c.height = this.height * (this.pixelSize + this.spacer);
			this.canvas = c.getContext('2d');

			this.clear();
			ppu.renderer.buffer.reset();
		},

		/**
		 * Clears the screen (Apply a static image)
		 */
		clear : function() {
			ppu.renderer.buffer.reset();
			var randomPixel = function() {
				//return (Math.floor(Math.random() * (0xffffff - 0x000000) + 0x000000)).toString(16);
				//return 0xffffff.toString(16);
				return ppu.screen.rbgs[(Math.floor(Math.random() * (64) + 0))];
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

		/**
		 * Given a input byte (0-64) which represents the index of the screen color palette.
		 * @param val
		 *          An input byte (0-64).
		 * @returns {*}
		 *          A list containing Red, Green, Blue (RGB) values.
		 */
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

		/**
		 * Used only for debugging
		 */
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

		/**
		 * Used only for debugging
		 */
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

	/**
	 * The memory unit for the PPU
	 *
	 * Source:
	 *      http://wiki.nesdev.com/w/index.php/PPU_memory_map
	 *
	 * Notes:
	 *      Address range 	Size 	Description
	 *      --------------------------------------------
	 *        $0000-$0FFF 	$1000 	Pattern table 0                 Sprites  (Holds Tiles)
	 *        $1000-$1FFF 	$1000 	Pattern Table 1                 Sprites  (Holds Tiles)
	 *        $2000-$23FF 	$0400 	Nametable 0                     Background (Holds mapping of Tiles/Palette Colors)
	 *        $2400-$27FF 	$0400 	Nametable 1                     Background (Holds mapping of Tiles/Palette Colors)
	 *        $2800-$2BFF 	$0400 	Nametable 2                     Background (Holds mapping of Tiles/Palette Colors)
	 *        $2C00-$2FFF 	$0400 	Nametable 3                     Background (Holds mapping of Tiles/Palette Colors)
	 *        $3000-$3EFF 	$0F00 	Mirrors of $2000-$2EFF
	 *        $3F00-$3F1F 	$0020 	Palette RAM indexes             Coloring Scheme for the game
	 *        $3F20-$3FFF 	$00E0 	Mirrors of $3F00-$3F1F
	 *
	 *       OAM Memory
	 *
	 *       Address range 	Size 	Description
	 *       ----------------------------------------------
	 *        $00-$0C (0 of 4) 	$40 	Sprite Y coordinate
	 *        $01-$0D (1 of 4) 	$40 	Sprite tile #
	 *        $02-$0E (2 of 4) 	$40 	Sprite attribute
	 *        $03-$0F (3 of 4) 	$40 	Sprite X coordinate
	 *
	 */
	mmu : {

		/**
		 * Implements the palette memory.
		 *
		 * Source:
		 *      http://wiki.nesdev.com/w/index.php/PPU_palettes
		 *
		 * Notes:
		 *
		 *        Address 	Purpose
		 *        $3F00 	Universal background color
		 *        $3F01-$3F03 	Background palette 0
		 *        $3F05-$3F07 	Background palette 1
		 *        $3F09-$3F0B 	Background palette 2
		 *        $3F0D-$3F0F 	Background palette 3
		 *        $3F11-$3F13 	Sprite palette 0
		 *        $3F15-$3F17 	Sprite palette 1
		 *        $3F19-$3F1B 	Sprite palette 2
		 *        $3F1D-$3F1F 	Sprite palette 3
		 *
		 * Summary:
		 *
		 *      Each palette has three colors. Each 16x16 pixel area of the background can use the backdrop
		 *      color and the three colors from one of the four background palettes.
		 *      The choice of palette for each 16x16 pixel area is controlled by bits in the attribute table
		 *      at the end of each nametable. Each sprite can use the three colors from one of the sprite palettes.
		 *
		 */
		palette : {

			/**
			 * Background Palette
			 *
			 * Note:
			 *      Size is 0xF, holds bytes.
			 */
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

			/**
			 * Sprite Palette
			 *
			 * Note:
			 *      Size is 0xF, holds bytes.
			 */
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

			/**
			 * Clears the palette.
			 */
			reset : function() {
				this.image.reset();
				this.sprite.reset();
			},

			/**
			 * Write to the palette ram
			 *
			 * @param addr
			 *          Address to the ram.
			 * @param val
			 *          Byte value of the color selection.
			 */
			writeByte : function(addr, val) {
				addr = addr % 0x20;
				if (addr > 0x10) {
					this.sprite.write(addr % 0x10, val % 0x40);
					return;
				}
				this.image.write(addr % 0x10, val % 0x40);
			},

			/**
			 * Read a byte from the palette ram.
			 *
			 * @param addr
			 *          Address to read from
			 * @returns {*}
			 *          Byte value of the color selection.
			 */
			readByte : function(addr) {
				addr = addr % 0x20;
				if (addr > 0x10) {
					return this.sprite.read(addr % 0x10);
				}
				return this.image.read(addr % 0x10);
			},
		},

		/**
		 * Implements the pattern ram of the ppu
		 *
		 * Source:
		 *      http://wiki.nesdev.com/w/index.php/PPU_pattern_tables
		 *
		 * Summary:
		 *      The Pattern table holds tiles, and each tile is 16 bytes long. A tile is contains two
		 *      planes (16 bytes / 2 is a plane) that when combine will determine if the pixel color
		 *      is transparent or the color of the pixel (2 bits -> able to select 4 colors).
		 *      All sprite/image data are stores as 8x8 pixels which translate to 16 byte * 16 bytes tiles.
		 *
		 */
		pattern : {
			mapper : {},

			set : function(val) {
				this.data = val;
			},

			readByte : function(addr) {
				if (addr >= 0x2000) {
					asdadasdsad.asdasdsa;
					return 0x0;
				}

				return this.mapper.readByte(addr);
			},

			writeByte : function(addr, val) {
				if (addr >= 0x2000) {
					asdadsasdsad.asdasdsad;
					return;
				}

				this.mapper.writeByte(addr, val);
			},

		},

		/**
		 * Implements the nametable ram of the PPU
		 *
		 * Source:
		 * 		http://wiki.nesdev.com/w/index.php/PPU_nametables
		 * 		http://wiki.nesdev.com/w/index.php/PPU_attribute_tables
		 *
		 * Summary:
		 * 		A nametable is a 1024 byte area of memory used by the PPU to lay out backgrounds.
		 * 		Each byte in the nametable controls one 8x8 pixel character cell, and each nametable has 30 rows of
		 * 		32 tiles each, for 960 ($3C0) bytes; the rest is used by each nametable's attribute table.
		 * 		With each tile being 8x8 pixels, this makes a total of 256x240 pixels in one map,
		 * 		the same size as one full screen.
		 *
		 * 		The attribute table is a 64-byte array at the end of each nametable that controls which
		 * 		palette is assigned to each part of the background. Each attribute table,
		 * 		starting at $23C0, $27C0, $2BC0, or $2FC0, is arranged as an 8x8 byte array:
		 *
		 * 	Notes:
		 * 		There are 4 nametables arranged in 2x2 pattern. NES can only handle roughly 2000 KBs
		 * 		of vram, and each name table is 1000 KBs so we can only work with 2 nametables at a time.
		 * 		This means that 2 of the unused name tables will need to be mirrors of the other two.
		 *
		 * 		Mirror Types
		 * 		---------------------------
		 * 			Vertical mirroring: $2000 equals $2800 and $2400 equals $2C00
		 * 			Horizontal mirroring: $2000 equals $2400 and $2800 equals $2C00
		 * 			One-screen mirroring: All nametables refer to the same memory at any given time
		 *
		 *	 		   	  (0,0)     (256,0)     (511,0)
		 *	 			 +-----------+-----------+
		 *	 			 |           |           |
		 *				 |           |           |
		 *	 			 |   $2000   |   $2400   |
		 *	 			 |           |           |
		 *	 			 |           |           |
		 *	 	  (0,240)+-----------+-----------+(511,240)
		 *	 			 |           |           |
		 * 				 |           |           |
		 * 				 |   $2800   |   $2C00   |
		 * 				 |           |           |
		 * 				 |           |           |
		 * 				 +-----------+-----------+
		 * 				 (0,479)   (256,479)   (511,479)
		 *
		 */
		nametables : {
			table : 	[[],[],[],[]],
			attribute : [[],[],[],[]],
			mirror : {},

			reset : function() {
				for (var i = 0; i < 4; i++) {
					this.table[i] = [];
					this.attribute[i] = [];
				}
			},

			readByte : function(addr) {
				//TODO Implement Mirrors

				if (addr > 0x3f00 || addr < 0x2000) {
					console.log("error " + addr.toString(16));
					asdasdasd.asdasdasdasd;
				}

				addr = ((addr - 0x2000) % 0x1000); //Mimic mirrors from 0x3000 to 0x3f00

				var index = this.mirror.indexes[Math.floor(addr / 0x400)]; //Segment
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
				var index = this.mirror.indexes[Math.floor(addr / 0x400)]; //Segment
				var offset = addr % 0x400; //offset inside the segment


				if (offset >= 0x3c0) {
					this.attribute[index][offset & 0x0FF - 0xc0] = val;
				} else {
					this.table[index][offset] = val;
				}

			},

		},

		/**
		 * Implements the OAM ram of the PPU
		 *
		 * Source:
		 *  	http://wiki.nesdev.com/w/index.php/PPU_OAM
		 *
		 * Summary:
		 * 		The OAM (Object attribute Memory) holds all the sprite attributes such as position,
		 * 		tile index, and priority. The OAM can maintain up to 64 sprites.
		 *
		 *
		 *  	 OAM 4 Bytes per sprite
		 *		 -------------------------------------------------------------------
		 *		 +-Byte 0 - Y Positions of top of sprite (delay by 1 scanline)
		 *		 +-Byte 1 - Tile Index Number
		 *		 |
		 *		 |  $00: $0000-$001F
		 *		 |  $01: $1000-$101F
		 *		 |  $02: $0020-$003F
		 *		 |  $03: $1020-$103F
		 *		 |  $04: $0040-$005F
		 *		 |	   [...]
		 *		 +-Byte 2 - Attribute
		 *		 |  76543210
		 *		 |  ||||||||
		 *		 |  |||||||+- Bank ($0000 or $1000) of tiles
		 *		 |  +++++++-- Tile number of top of sprite (0 to 254; bottom half gets the next tile)
		 *		 |
		 *		 +-Byte 3 - X position of the left side of sprite
		 *
		 */
		oam : {
			addr : 0x0,
			data : [],

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

		/**
		 * Read a byte from the PPU's memory
		 * @param addr
		 * 			The address to read from
		 * @returns {*}
		 * 			A byte value
		 */
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

		/**
		 * Write a byte to the PPU's memory
		 * @param addr
		 * 			The address to read from
		 * @param val
		 * 			A byte value
		 */
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
		//this.mmu.nametables.setMirrorType(cartridge.mirroring.getType());
		this.mmu.pattern.mapper = cartridge.mapper.chrs;
		this.mmu.nametables.mirror = cartridge.mapper.prgs.mirror;
	},

	reset : function () {
		this.screen.reset();
		this.mmu.palette.reset();
		this.scanline = 0;
		this.cycle = 0;
		this.vars.f = 1;
		this.registers.cntrl.write(0);
		this.registers.mask.write(0);
		this.registers.oamaddr.write(0);
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

	/**
	 * Internal Registers of the PPU
	 *
	 * Source:
	 * 		http://wiki.nesdev.com/w/index.php/PPU_rendering
	 *
	 * Notes:
	 * 		These registers cannot be accessed by the CPU.
	 */
	vars : {

		// VRAM
		// ---------------------------------------
		// yyy NNYY YYYX  XXXX
		// ||| |||| |||+--++++- coarse X scroll
		// ||| ||++-+++-------- coarse Y scroll
		// ||| ++-------------- nametable select
		// +++----------------- fine Y scroll

		v: 0x0,			//16-bit VRAM Address (Works much like the PC in the CPU)
		t: 0x0,			//16-bit TEMP Address (Since we can only write bytes we need a temp address to hold temp values)
		w: 0,			//Acts as toggle for writing to VRAM/TEMP
		x: 0x0,			//X-SCROLL position
		l: 0x0,			//Last written value
		f: 0,			//EVEN/ODD frame flag
	},

	/**
	 * External Registers of the PPU
	 *
	 * Source:
	 *		http://wiki.nesdev.com/w/index.php/PPU_registers
	 *
	 * Notes:
	 * 		These registers are accessed from the CPU's memory, allowing the CPU
	 * 		to control the PPU. These registers are the only contact to the CPU and the PPU.
	 */
	registers : {


		/**
		 * Control register (0x2000)
		 */
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

		/**
		 * Mask register (0x2001)
		 */
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

		/**
		 * Status register (0x2002)
		 */
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

				ppu.nmi.occurred = false;
				ppu.nmi.change();

				//Toggle Write
				ppu.vars.w = 0;

				return result;
			}
		},

		/**
		 * OAM address register (0x2003)
		 */
		oamaddr : {

			write : function(val) {
				ppu.mmu.oam.setAddr(val);
			},

			read: function(val) {
				//Not used
				return 0x0;
			}
		},

		/**
		 * OAM data register (0x2004)
		 */
		oamdata : {

			write : function(val) {
				ppu.mmu.oam.writeByte(val);
			},

			read: function() {
				return ppu.mmu.oam.readByte();
			}
		},

		/**
		 * Scroll address register (0x2005)
		 */
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

		/**
		 * VRAM address register (0x2006)
		 */
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

		/**
		 * Data register (0x2007)
		 */
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

		/**
		 * DMA register (0x4014)
		 */
		dma : {
			write : function(val) {
				var addr = val << 8;

				//Copy from PROG
				for (var i = 0; i < 256; i++) {
					ppu.mmu.oam.writeByte(cpu.mmu.readByte(addr));
					addr++;
				}

				cpu.stall += 513;
				if ((cpu.cycles % 2) == 1) {
					cpu.stall++;
				}
			},

			read: function(val) {
				//Not Used
				return 0x0;
			}
		},

		/**
		 * Read a byte from the PPU registers
		 * @param addr
		 * 			Address of the register
		 * @returns {*}
		 * 			Byte value of the register
		 */
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

		/**
		 * Write a byte to a register
		 * @param addr
		 * 			Address of the register to write to
		 * @param val
		 * 			Byte value to be written
		 */
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


	/**
	 * Implements the rendering logic of the PPU.
	 *
	 */
	renderer : {

		/**
		 * Frame buffer.
		 *
		 * Function:
		 * 		Improves HTML5 Canvas performance. Rather than individually printing pixels to the
		 * 		canvas, we print a frame. Meaning, we do a single canvas function rather than
		 * 		a multitude of functions.
		 *
		 * Notes:
		 * 		Holds only one frame.
		 */
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
				var pixelWidth = (pixelSize + screen.spacer);
				var height  = ((screen.width) * pixelWidth) * 4 ;
				var width = (x * pixelWidth * 4);

				var index = (y * height * pixelWidth) + width;

				var startInter = pixelSize;
				var heightSub = height - ((4 * startInter) + 4) + (pixelSize * pixelSize);

				var cy = startInter;
				var cx = startInter;
				while (cy != 0) {

					while (cx != 0) {
						this.frame.data[index + 0] = color[0];
						this.frame.data[index + 1] = color[1];
						this.frame.data[index + 2] = color[2];
						this.frame.data[index + 3] = 255;
						index += 4;

						cx--;
					}
					index += heightSub;
					cx = startInter;
					cy--;
				}
			},

			print : function() {
				ppu.screen.canvas.putImageData(this.frame, 0, 0);
			}

		},

		/**
		 * Background rendering logic
		 *
		 * Source:
		 * 		http://wiki.nesdev.com/w/index.php/PPU_rendering
		 * 		http://wiki.nesdev.com/w/index.php/PPU_nametables
		 *
		 * Function:
		 *		The PPU contains 2 16-bit shift registers for which contains the bitmap to be drawn on the screen.
		 *		Every 8 cycles, a new bitmap is loaded into the first shift register, and the next pixel to be drawn
		 *		is fetched from the second shift register. The bitmap is loaded by getting the first phase (low phase)
		 *		and the second phase (high tile) of the 16 byte tile. Then we combine it with the attribute byte to
		 *		determine the color of the pixel. Note, combining the low tile, high tile, and the attribute byte
		 *		will result in a single byte, meaning the 16 bit register contains up to 8 pixels of data.
		 *
		 *		The fetching order is
		 *			Fetch a nametable entry from $2000-$2FBF.
		 *			Fetch the corresponding attribute table entry from $23C0-$2FFF and increment the current VRAM address within the same row.
		 *			Fetch the low-order byte of a 8x1 pixel sliver of pattern table from $0000-$0FF7 or $1000-$1FF7.
		 *			Fetch the high-order byte of this sliver from an address 8 bytes higher.
		 *		    Turn the attribute data and the pattern table data into palette indices
		 *
		 *		Each function normally takes 2 ppu cycles to achieve but since this is an emulation we can simply
		 *		grab all those data at some cycle. Note that we only execute these function during the rendering
		 *		phase.
		 *
		 */
		background : {

			attributeTableByte : 0x00,
			nameTableByte : 0x00,

			tileAddr : 0x0,

			lowTileByte   : 0x0,
			highTileByte  : 0x0,

			lowTileData : 0x0, 				//16-bit shift register 1
			highTileData : 0x0,				//16-bit shift register 2

			/**
			 * Save the low/high tile bytes
			 *
			 * Source:
			 * 		http://wiki.nesdev.com/w/index.php/PPU_pattern_tables#Addressing
			 */
			fetchTileAddr : function() {
				var fineY = (ppu.vars.v >> 12) & 7;
				var table = ppu.registers.cntrl.backgroundtable;
				var tile = this.nameTableByte;
				var addr = (0x1000*table) + (tile*16) + fineY;

				this.tileAddr = addr;
			},

			/**
			 * Fetch the low tile byte of the bitmap.
			 *
             */
			fetchLowTileByte : function() {
				this.lowTileByte  = ppu.mmu.readByte(this.tileAddr);
			},

			/**
			 * Fetch the high tile byte of the bitmap.
			 */
			fetchHighTileByte : function() {
				this.highTileByte = ppu.mmu.readByte(this.tileAddr + 8);
			},

			/**
			 * Save the attribute byte stored in the name table.
			 *
			 * Source:
			 * 		http://wiki.nesdev.com/w/index.php/PPU_attribute_tables
			 */
			fetchAttributeTableByte : function() {
				var v = ppu.vars.v;
				var addr = 0x23C0 | (v & 0x0C00) | ((v >> 4) & 0x38) | ((v >> 2) & 0x07);
				var shift = ((v >> 4) & 4) | (v & 2);
				this.attributeTableByte = ((ppu.mmu.readByte(addr) >> shift) & 3) << 2;
			},

			/**
			 * Save the tile byte stored in the name table.
			 *
			 * Source:
			 * 		http://wiki.nesdev.com/w/index.php/PPU_scrolling#Tile_and_attribute_fetching
			 */
			fetchNameTableByte : function() {
				var v = ppu.vars.v;
				var address = 0x2000 | (v & 0x0FFF);

				this.nameTableByte = ppu.mmu.readByte(address);
			},

			/**
			 * Save the tile data (Contains the pixels to be displayed).
			 * We combine the low tile, high tile and the attribute byte.
			 *
			 */
			storeTileData : function() {
				var data = 0x0;

				var i = 8;
				while (i != 0) {
					var a = this.attributeTableByte;

					var p1 = (this.lowTileByte & 0x80) >> 7;
					var p2 = (this.highTileByte & 0x80) >> 6;

					this.lowTileByte  <<= 1;
					this.highTileByte <<= 1;

					data <<= 4;
					data |= (a | p1 | p2) & 0xf;

					i--;
				}
				this.lowTileData |= data;
			},

			/**
			 * Get the current pixel to be displayed.
			 *
			 * @returns {number}
			 * 		A byte that determines the color palette.
			 */
			getPixelByte: function() {
				if (ppu.registers.mask.showbg == 0) {
					return 0x0;
				}
				var shift = (((7 - ppu.vars.x))  * 4);
				var result = this.highTileData >>> shift;

				return result & 0xF;
			}
		},

		/**
		 * Sprite rendering logic.
		 *
		 * Source:
		 *		http://wiki.nesdev.com/w/index.php/PPU_sprite_evaluation
		 *
		 * Function:
		 * 		Maintain a list of 8 sprites to draw. First, we read through the OAM checking
		 * 		which sprites to be drawn on the scanline (up to 8 sprites). If there are more than
		 * 		8 sprites to be rendered then set the sprite overflow flag. To determine if a sprite is
		 * 		going to be displayed check if the y row of the sprite is within the 8/16 pixel height range.
		 * 		During printing, we grab a pixel from the background and a pixel the sprite and determine by priority
		 * 		which one to display.
		 *
		 */
		sprites : {

			count : 0x0,
			patterns: [],			//Holds the bitmap of the sprites
			positions: [],			//Holds the position of the sprites
			priorities: [],			//Holds the priorities of the sprites
			indexes: [],			//Holds the indexes of each sprite

			/**
			 * Return the tile address of a sprite.
			 *
			 * @param spriteIndex
			 * 			The index of the sprite to grab the bitmap sliver from
			 * @param row
			 * 			The specific row in the bitmap to grab
             * @returns {*}
			 * 			An address (word) that points to the specified row of a sprite.
             */
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
						tile++;
						row -= 8;
					}
				}

				var addr = (0x1000 * table) + (tile * 16) + row;
				return addr;
			},

			/**
			 * Return the low tile byte of the sprite bitmap.
			 *
			 * @param addr
			 * 			The address pointing to the low byte of the tile.
             * @returns {*}
			 * 			A byte of the tile
             */
			fetchLowTileByte : function(addr) {
				return ppu.mmu.readByte(addr);
			},

			/**
			 * Return the high tile byte of the sprite bitmap.
			 *
			 * @param addr
			 * 			The address pointing to the high byte of the tile.
             * @returns {*}
			 * 			A byte of the tile
             */
			fetchHighTileByte : function(addr) {
				return ppu.mmu.readByte(addr + 8);
			},

			/**
			 * Return the attribute byte of the sprite
			 *
			 * @param spriteIndex
			 * 			The index of the sprite to get the attribute byte from
             * @returns {*}
			 * 			A byte that is the attribute value of the sprite
             */
			fetchAttributeByte : function(spriteIndex) {
				return ppu.mmu.oam.getAttr(spriteIndex);
			},

			/**
			 * Return the sprite bitmap data from combining the low/high and attribute byte.
			 *
			 * @param spriteIndex
			 * 			The index of the sprite to get data from.
			 * @param row
			 * 			The row of the sprite to get from
             * @returns {number}
			 * 		a 32 bit data where each 4 bit value represents a pixel's color palette.
             */
			fetchSpriteData : function(spriteIndex, row) {
				var tile = this.fetchTileAddr(spriteIndex, row)
				//console.log("TILE ADDR " + tile.toString(16));
				var lowTileByte = this.fetchLowTileByte(tile);
				var highTileByte = this.fetchHighTileByte(tile);
				var attr = this.fetchAttributeByte(spriteIndex);

				var a = (attr & 3) << 2;
				var flagged = (attr & 0x40) == 0x40;

				var data = 0;
				for (var i = 0; i < 8; i++) {
					var p1;
					var p2;
					if (flagged) {
						p1 = (lowTileByte & 1) << 0;
						p2 = (highTileByte & 1) << 1;
						lowTileByte >>>= 1;
						highTileByte >>>= 1;
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

			/**
			 * Store the sprite data
			 */
			storeSpriteData : function() {
				var height = 0;
				if (ppu.registers.cntrl.spritesize == 0) {
					height = 8;
				} else {
					height = 16;
				}
				var count = 0;
				var i = 0;
				while (i < 64) {
					var ypos = ppu.mmu.oam.getYpos(i);
					var attr = ppu.mmu.oam.getAttr(i);
					var xpos = ppu.mmu.oam.getXpos(i);

					var row = ppu.scanline - ypos;
					if (row < 0 || row >= height) {
						i++;
						continue;
					}
					if (count < 8) {
						this.patterns[count] = this.fetchSpriteData(i, row);
						this.positions[count] = xpos;
						this.priorities[count] = ((attr >> 5) & 1);
						this.indexes[count] = i;
					}
					count++;
					i++;
				}
				if (count > 8) {
					count = 8;
					ppu.registers.status.spriteoverflow = 1;
				}
				this.count = count;
			},

			/**
			 * Return the pixel byte thats going to be displayed.
			 * We determine which sprite to display by iterating through the 8 sprites
			 * if the bottom 2 bits of the byte is zero then we ignore the pixel.
			 *
			 * @returns {*}
			 * 		a byte that represents the palette selection.
             */
			getPixelByte : function() {
				if (ppu.registers.mask.showsprites == 0) {
					return [0,0];
				}
				for (var i = 0; i < this.count; i++) {
					var offset = (ppu.cycle - 1) - this.positions[i];
					if (offset < 0 || offset > 7) {
						continue;
					}
					offset = 7 - offset;
					var color = (this.patterns[i] >>> (offset * 4)) & 0xFF;
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

		/**
		 * Increment the X scroll position.
		 *
		 * Source:
		 * 		http://wiki.nesdev.com/w/index.php/PPU_scrolling#Coarse_X_increment
		 */
		incrementX :  function() {
			if ((ppu.vars.v & 0x001F) == 31) {
				ppu.vars.v &= 0xFFE0; //Set X=0
				ppu.vars.v ^= 0x0400; //Switch horizontal nametable
			} else {
				ppu.vars.v = ppu.vars.v + 1; //increase X
			}
		},

		/**
		 * Increment the Y scroll position.
		 *
		 * Source:
		 * 		wiki.nesdev.com/w/index.php/PPU_scrolling#Y_increment
		 */
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

		/**
		 * Copy T to V (X pos)
		 */
		setX : function() {
			ppu.vars.v = (ppu.vars.v & 0xFBE0) | (ppu.vars.t & 0x041F);
		},

		/**
		 * Copy T to V (Y pos)
		 */
		setY : function() {
			ppu.vars.v = (ppu.vars.v & 0x841F) | (ppu.vars.t & 0x7BE0);
		},

		/**
		 * Prints a single pixel to the frame buffer.
		 *
		 */
		renderPixel : function() {
			var x = ppu.cycle - 1;
			var y = ppu.scanline;

			var result = this.sprites.getPixelByte();
			var background = this.background.getPixelByte();
			var sprite = result[1];

			var i = result[0];

			if (x < 8) {
				if (ppu.registers.mask.showbg == 0) {
					background = 0;
				}
				if (ppu.registers.mask.showspleft == 0) {
					sprite = 0;
				}
			}

			var b = background % 4 != 0;
			var s = sprite % 4 != 0;

			var color = 0;
			if (b && s) {
				if ((this.sprites.indexes[i] == 0) && (x < 255)) {
					ppu.registers.status.spritehit = 1;
				}
				if (this.sprites.priorities[i] == 0) {
					color = sprite | 0x10;
				} else {
					color = background;
				}
			} else if (!b && s) {
				color = sprite | 0x10;
			} else if (b && !s) {
				color = background;
			}

			var palette = ppu.mmu.palette.readByte(color);
			//var hex = ppu.screen.getColorHex(palette & 0xFF);
			//ppu.screen.setPixel(x, y, hex)
			var hex = ppu.screen.getColorRBG(palette & 0xFF);
			this.buffer.setPixel(x, y, hex);
		},

		/**
		 * Execute a single rendering step of the PPU
		 *
		 * Source:
		 * 		http://wiki.nesdev.com/w/index.php/PPU_rendering
		 */
		tick : function() {

			var curCycle = ppu.cycle;

			var preLine = ppu.scanline == 261;
			var visibleLine = ppu.scanline < 240;
			var renderLine = preLine || visibleLine;

			var preCycle = curCycle >= 321 && curCycle <= 336;
			var visibleCycle = curCycle >= 1 && curCycle <= 256;
			var fetchCycle = preCycle || visibleCycle;

			if (visibleLine && visibleCycle) {
				this.renderPixel();
			}

			if (renderLine && fetchCycle) {
				var transfer = (this.background.lowTileData >> 28) & 0xF;

				this.background.lowTileData &= 0xFFFFFFF;
				this.background.lowTileData <<= 4;
				this.background.highTileData &= 0xFFFFFFF;
				this.background.highTileData <<= 4;
				this.background.highTileData |= transfer;

				//log("AFTER LOW: "  + ppu.background.lowTileData.toString(2));
				//log("AFTER HIGH: " + ppu.background.highTileData.toString(2));
				//log("REAL AFTER: " + ppu.background.tileData.toString(2));
				var remainder = curCycle % 8;
				//log("Remainder " + remainder);
				if (remainder == 0) {
					this.background.fetchNameTableByte();
					this.background.fetchAttributeTableByte();
					this.background.fetchTileAddr();
					this.background.fetchLowTileByte();
					this.background.fetchHighTileByte();
					this.background.storeTileData();
				}
			}

			if (preLine && (curCycle >= 280) && (curCycle <= 304)) {
				this.setY();
			}
			if (renderLine) {
				if (fetchCycle && ((curCycle % 8) == 0)) {
					this.incrementX();
				}
				if (ppu.cycle == 256) {
					this.incrementY();
				}
				if (ppu.cycle == 257) {
					this.setX();
				}
			}

			if (curCycle == 257) {
				if (visibleLine) {
					this.sprites.storeSpriteData();
				} else {
					this.sprites.spriteCount = 0;
				}
			}

		}

	},

	/**
	 * Executes a single PPU step.
	 */
	tick : function() {
		var renderingEnabled = ppu.registers.mask.showbg != 0 || ppu.registers.mask.showsprites != 0;
		var cycle = this.cycle;
		var scanline = this.scanline;
		var nmi = ppu.nmi;

		//Trigger NMI
		if (nmi.delay > 0) {
			nmi.delay--;
			if (nmi.delay == 0 && nmi.output && nmi.occurred) {
				cpu.interrupts.setNMI();
			}
		}

		//Update Cycle/Scanlines/Frame information
		if (renderingEnabled &&
			((ppu.vars.f == 1) && (scanline == 261) && (cycle == 340))) {
			this.cycle = 0;
			this.scanline = 0;
			this.frame++;

			this.renderer.buffer.print();
			this.vars.f ^= 1;

		} else {
			this.cycle++;
			if (cycle > 340) {
				this.cycle = 0;
				this.scanline++;
				if (scanline > 261) {
					this.scanline = 0;
					this.renderer.buffer.print();
					this.frame++;
					this.vars.f ^= 1;
				}
			}
		}

		//Renderer Cycle
		if (renderingEnabled) {
			this.renderer.tick();
		}

		if (cycle == 1) {
			if (scanline == 241) {
				this.nmi.setVerticalBlank();
			}
			if (scanline == 261) {
				ppu.nmi.clearVerticalBlank();
				ppu.registers.status.spriteoverflow = 0;
				ppu.registers.status.spritehit = 0;
			}
		}
	},

	tickFor : function(cycles) {
		var i = cycles;
		while (i != 0) {
			this.tick();
			i--;
		}
	},
}