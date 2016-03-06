/**
 * This object handles and represents the CPU (central processing unit).
 * Its responsibilities is to handle all the calculations done in the NES.
 *
 * Created by Hooman Kamran on 1/01/2016.
 */
var cpu = {

	cycles : 0,
	ticks : 0,
	op : null,
	log : "",

	setCartidge : function(cartridge) {
		this.mmu.prgrom.mapper = cartridge.mapper.prgs;
	},

	registers : {
		//Accumulator 	  (8 bits)
		a : {
			val : 0,
			
			add : function(val) {
				this.val += val;
				this.val &= 0xFF;
			},
			 
			sub : function(val) {
				this.val -= val;
				this.val &= 0xFF;
			},
			
			get : function() {
				return this.val;
			},
			
			set : function(val) {
				this.val = val & 0xFF;
			},
			
		},	    
		
		//Misc		  	  (8 bits)
		x : {
			val : 0,
			
			add : function(val) {
				this.val += val;
				this.val &= 0xFF;
			},
			 
			sub : function(val) {
				this.val -= val;
				this.val &= 0xFF;
			},
			
			get : function() {
				return this.val;
			},
			
			set : function(val) {
				this.val = val & 0xFF;
			},			
		},	 
		
		//Misc		 	  (8 bits)
		y : {
			val : 0,
			
			add : function(val) {
				this.val += val;
				this.val &= 0xFF;
			},
			 
			sub : function(val) {
				this.val -= val;
				this.val &= 0xFF;
			},
			
			get : function() {
				return this.val;
			},
			
			set : function(val) {
				this.val = val & 0xFF;
			},				
		},      
		
		//Stack Pointer	  (8 bits)
		sp : {
			val : 0,
			
			add : function(val) {
				this.val += val;
				this.val &= 0xFF;
			},
			 
			sub : function(val) {
				this.val -= val;
				this.val &= 0xFF;
			},
			
			get : function() {
				return this.val;
			},
			
			set : function(val) {
				this.val = val & 0xFF;
			},	
		},   
		
		//Program Counter (16 bits)
		pc: {
			val : 0,
			
			add : function(val) {
				this.val += val;
				this.val &= 0xFFFF;
			},
			 
			sub : function(val) {
				this.val -= val;
				this.val &= 0xFFFF;
			},
			
			get : function() {
				return this.val;
			},
			
			set : function(val) {
				this.val = val & 0xFFFF;
			},	
		}, 
		
		//Program Counter (8 bits)
		p : {
			c: 0,       //carry flag
			z: 0,       //zero flag
			i: 0,       //interrupts
			d: 0,       //decimal mode
			b: 0,       //break
			v: 0,       //overflow flag
			n: 0,       //negative flag			
			
			set : function(val) {
				val &= 0xFF;

				this.c = (val >> 0) & 1;
				this.z = (val >> 1) & 1;
				this.i = (val >> 2) & 1;
				this.d = (val >> 3) & 1;
				this.b = (val >> 4) & 1;
				this.u = (val >> 5) & 1;
				this.v = (val >> 6) & 1;
				this.n = (val >> 7) & 1;
			},
			
			get : function() {
				var flags = 0x0;
				flags |= this.c << 0;
				flags |= this.z << 1;
				flags |= this.i << 2;
				flags |= this.d << 3;
				flags |= this.b << 4;
				flags |= this.u << 5;
				flags |= this.v << 6;
				flags |= this.n << 7;
				return flags & 0xFF;				
			}
		},
	},

	mmu : {

		zeropage : {
			data : [],

			readByte : function(addr) {
				if (addr > 0x0100) {
					asdasdasdasd;
				}

				var result = this.data[addr];

				if (typeof result === 'undefined') {
					result = 0x0;
				}

				return result;
			},

			writeByte: function(addr, val) {
				if (addr >= 0x0100) {
					asdasdasdasd;
				}

				this.data[addr] = val;
			},
		},

		stack : {
			data : [],

			pushByte : function(val) {
				this.data[cpu.registers.sp.get()] = val;
				cpu.registers.sp.val -= 1;

				if (typeof result == 'undefined') {
					return 0x0;
				}

				if (cpu.registers.sp.val < 0) {
					cpu.registers.sp.val = 0;
				}

			},

			popByte : function() {
				cpu.registers.sp.val++;

				if (cpu.registers.sp.val > 0xFF) {
					cpu.registers.sp.val == 0xFF;
				}

				var result = this.data[cpu.registers.sp.get()];

				if (typeof result == 'undefined') {
					return 0x0;
				}

				return result;
			},

			pushWord: function(val) {
				var low = val & 0x00FF;
				var high = val >> 8;

				this.pushByte(high);
				this.pushByte(low);
			},

			popWord: function(addr) {
				var low = this.popByte(addr);
				var high = this.popByte(addr) << 8;

				var result = high | low;
				return result;
			},

			readByte: function(addr) {
				addr -= 0x100;

				var result = this.data[addr];

				if (typeof result == 'undefined') {
					return 0x0;
				}
				return result;
			},

			writeByte: function(addr, val) {
				addr -= 0x100;
				if (addr > 0x100) {
					asdasdasdasdasd;
				}
				this.data[addr] = val;
			},

		},

		ram : {
			data : [],

			readByte : function(addr) {
				if (addr > 0x0800) {
					asdasdasdasd;
				}

				addr -= 0x200;

				if (addr > 0x5FF) {
					asdasdasasd;
				}

				var result = this.data[addr];

				if (typeof result === 'undefined') {
					//console.log("ERROR READING " + addr.toString(16));
					return 0;
				}

				return result;
			},

			writeByte: function(addr, val) {
				if (addr > 0x0800) {
					asdasdasdasd;
				}

				addr -= 0x200;

				if (addr > 0x5FF) {
					asdasdasasd;
				}

				this.data[addr] = val;
			},
		},

		//PPU
		io : {

			readByte : function(addr) {
				return ppu.registers.readByte(addr);
			},

			writeByte : function(addr, val) {
				ppu.registers.writeByte(addr, val);
			},

		},

		//Audio
		erom : {
			data : [],

			readByte : function(addr) {

			},

			writeByte : function(addr, val) {

			},
		},

		//Save Ram
		sram : {
			data : [],

			readByte : function(addr) {
				if (addr < 0x6000 || addr >= 0x8000) {
					asdasdasdaasd;
				}

				addr -= 0x6000;

				var result = this.data[addr];

				return result;
			},

			writeByte : function(addr, val) {
				if (addr < 0x6000 || addr >= 0x8000) {
					asdasdasdaasd;
				}

				addr -= 0x6000;

				this.data[addr] = val;

			},
		},

		//Game Code
		prgrom : {
			mapper : {},

			readByte : function(addr) {
				if (addr < 0x8000 || addr >= 0x10000) {
					asdasdasda
				}

				return this.mapper.readByte(addr);
			},

			writeByte : function(addr, val) {
				if (addr < 0x8000 || addr > 0x10000) {
					asdasdasda
				}

				return this.mapper.writeByte(addr, val);
			},
		},

		readByte : function(addr) {
			if (typeof addr != 'number') {
				asdasdasdasddas;
			}

			if (addr < 0x2000) {
				//Mimic mirrors 0000-07FF
				addr  = addr % 0x800;

				if (addr < 0x100) {
					return this.zeropage.readByte(addr);
				} else if (addr < 0x200) {
					return this.stack.readByte(addr);
				} else if (addr < 0x800) {
					return this.ram.readByte(addr);
				} else {
					asdasdasdasdasd;
				}

			} else if (addr < 0x4000) {

				return ppu.registers.readByte(addr);

			} else if (addr < 0x4021) {

				if (addr < 0x4014) {
					//TODO APU
					return 0x0;
				} else if (addr == 0x4014) {
					return ppu.registers.readByte(addr);
				} else if (addr == 0x4015) {
					//TODO APU
					return 0x0;
				} else if (addr == 0x4016) {
					return player1.readByte();
				} else if (addr == 0x4017) {
					//TODO Controller 2
					return 0x0;
				} else if (addr < 0x4020) {
					//TODO APU
					return 0x0;
				} else {
					return 0x0;
				}

			} else if (addr < 0x8000) {


				if (addr < 0x6000) {
					return this.erom.readByte(addr);
				} else if (addr < 0x8000) {
					return this.sram.readByte(addr);
				} else {
					asdasdasdasd;
				}

			} else if (addr < 0x10000) {


				return this.prgrom.readByte(addr);

			} else {

				console.log(addr.toString(16));
				asdasdasasdasd;
			}
		},

		writeByte : function(addr, val) {


			if (addr < 0x2000) {
				//Mimic mirrors 0000-07FF
				addr  = addr % 0x800;

				if (addr < 0x100) {
					this.zeropage.writeByte(addr, val);
					return;
				} else if (addr < 0x200) {
					this.stack.writeByte(addr, val);
					return;
				} else if (addr < 0x800) {
					this.ram.writeByte(addr, val);
					return;
				} else {
					asdasdasdasdasd;
				}

			} else if (addr < 0x4000) {

				return ppu.registers.writeByte(addr, val);

			} else if (addr < 0x4021) {

				if (addr < 0x4014) {
					//TODO APU
					return 0x0;
				} else if (addr == 0x4014) {
					return ppu.registers.writeByte(addr, val);
				} else if (addr == 0x4015) {
					//TODO APU
					return 0x0;
				} else if (addr == 0x4016) {
					//TODO Controller
					return player1.writeByte(val);
				} else if (addr == 0x4017) {
					//TODO Controller
					return 0x0;
				} else if (addr < 0x4020) {
					//TODO APU
					return 0x0;
				} else {
					return 0;
				}
			} else if (addr < 0x8000) {
				if (addr < 0x6000) {
					this.erom.writeByte(addr, val);
					return;
				} else if (addr < 0x8000) {
					this.sram.writeByte(addr, val);
					return;
				}
			} else if (addr < 0x10000) {
				this.prgrom.writeByte(addr, val);
				return;
			} else {
				console.log("ERROR: " + addr.toString(16) + ":" + val.toString(16));
				asdasdasdasd;
			}
			asdasdassaasd
		},

		readWord : function(addr) {
			var low = this.readByte(addr);
			var high = this.readByte(addr +  1);

			return (high << 8 | low) & 0xFFFF;
		},

		readWordBug: function(addr) {
			var a = addr;
			var b = (a & 0xFF00) | (a + 1 & 0xFF);

			var low = this.readByte(a);
			var high = this.readByte(b);

			return (high << 8 | low) & 0xFFFF;
		},

		writeWord : function(addr, val) {
			var low = val & 0x00FF;
			var high = val >> 8;

			this.writeByte(addr, low);
			this.writeByte(addr + 1, high);
		}
	},
	
	interrupts : {
		val : "NONE",
		
		types : {
			none : 0,
			nmi  : 1,
			irq  : 2,
		},
		
		set : function(type) {
			this.val = type;
		},
		
		get : function() {
			return this.val;
		},
		
		tick : function() {
			if (this.val == this.types.nmi) {
				this.doNMI();
			} else if (this.val == this.types.irq) {
				if (this.registers.p.i == 0) {
					this._triggerIRQ();
				}
			}
			this.val = this.types.none;
		},

		setNMI : function() {
			this.val = this.types.nmi;
		},

		doNMI : function() {
			cpu.mmu.stack.pushWord(cpu.registers.pc.get());
			cpu.instructions.ops.php({});
			cpu.registers.pc.set(cpu.mmu.readWord(0xFFFA));
			cpu.registers.p.i = 1;
			cpu.cycles += 7;
		},
		
		_triggerIRQ : function() {
			cpu.mmu.stack.pushWord(cpu.registers.pc.get());
			cpu.instructions.ops.php({});
			cpu.registers.pc.set(cpu.mmu.readWord(0xFFFE));
			cpu.registers.p.i = 1;
			cpu.cycles += 7;
		},
		
	},
	
	tick : function() {

		//Handle Interrupts first
		this.interrupts.tick();

		//CPU Execution
		var opcode = this.mmu.readByte(this.registers.pc.get());
		var op = this.instructions.get(opcode);
		var cycles = this.cycles;

		//Increment PC
		var opaddr = this.registers.pc.get();
		this.registers.pc.set(opaddr + op.size);

		//Get Execution Address
		var result = op.mode.getResult(opaddr);
		var addr = result.addr;
		var isPageDifferent = result.isDifferent;

		//Increment Cycles
		this.cycles += op.cycles;
		if (isPageDifferent) {
			this.cycles += op.cross;
		}
		
		//Prepare argument
		var info = {
			address : addr,
			pc : this.registers.pc.get(),
			op : op,
			opcode : opcode,
		};
		this.op = info;

		//Execute operation
		op.func(info);
		
		//Update cpu information
		this.ticks++;
		var difference = this.cycles - cycles;
		return difference;
	},

	reset : function() {
		this.instructions.init();

		this.registers.sp.set(0xFD);
		//this.registers.pc.set(0xC000);
		this.registers.pc.set(this.mmu.readWord(0xFFFC));

		this.registers.p.set(0x24);

		this.cycles += 7;
	},

	//operations
	instructions : {
		map : [],
		
		//Addressing Modes
		modes : {
            abs: {
				name : "absolute",
				id : 0,

				getResult : function(opaddr) {
					var addr = cpu.mmu.readWord(opaddr + 1 & 0xFFFF);

					return {
						addr : addr,
						isDifferent : false,
					};
				},

			},
            abx: {
				name : "absolute x",
				id : 1,

				getResult : function(opaddr) {
					var val = cpu.mmu.readWord(opaddr + 1);
					var addr = val + cpu.registers.x.get();
					addr &= 0xFFFF;
					var isDifferent = cpu.instructions.isPageDifferent(val, addr);

					return {
						addr : addr,
						isDifferent : isDifferent,
					};
				},

			},
            aby: {
				name : "absolute y",
				id : 2,

				getResult : function(opaddr) {
					var val = cpu.mmu.readWord(opaddr + 1);
					var addr = val + cpu.registers.y.get();
					addr &= 0xFFFF;
					var isDifferent = cpu.instructions.isPageDifferent(val, addr);

					return {
						addr : addr,
						isDifferent : isDifferent,
					};
				}
			},
            acc: {
				name : "accumulator",
				id : 3,

				getResult : function(opaddr) {
					var addr = cpu.registers.a.get();

					return {
						addr : addr,
						isDifferent : false,
					};
				}
			},
            imm: {
				name : "immediate",
				id : 4,

				getResult : function(opaddr) {
					var addr = opaddr + 1 & 0xFFFF;

					return {
						addr : addr,
						isDifferent : false,
					};
				}
			},
            imp: {
				name : "implied",
				id : 5,

				getResult : function(opaddr) {
					var addr = 0;

					return {
						addr : addr,
						isDifferent : false,
					};
				}
			},
            ini: {
				name : "indexed indirect",  //indirect X
				id : 6,

				getResult : function(opaddr) {
					var addr = cpu.mmu.readByte(opaddr + 1 & 0xFFFF);
					addr += cpu.registers.x.get();
					addr &= 0xFF;
					addr = cpu.mmu.readWordBug(addr);

					return {
						addr : addr,
						isDifferent : false,
					};
				}
			},
            ind: {
				name : "indirect", //indirect
				id : 7,

				getResult : function(opaddr) {
					var addr = cpu.mmu.readWord(opaddr + 1 & 0xFFFF);
					addr = cpu.mmu.readWordBug(addr);

					return {
						addr : addr,
						isDifferent : false,
					};
				}
			},
            inr: {
				name : "indirect indexed", //indirect y
				id : 8,

				getResult : function(opaddr) {
					var val = cpu.mmu.readByte(opaddr + 1 & 0xFFFF);
					val = cpu.mmu.readWordBug(val);
					var addr = val;
					addr += cpu.registers.y.get();
					addr &= 0xFFFF;
					var isDifferent = cpu.instructions.isPageDifferent(val, addr);

					return {
						addr : addr,
						isDifferent : isDifferent,
					};
				},

			},
            rel: {
				name : "relative",
				id : 9,

				getResult : function(opaddr) {
					var addr = cpu.mmu.readByte(opaddr + 1 & 0xFFFF) & 0xFF;
					if (addr < 0x80) {
						addr += cpu.registers.pc.get() ;
					} else {
						addr += cpu.registers.pc.get() - 0x100;
					}

					return {
						addr : addr,
						isDifferent : false,
					};
				}
			},
            zer: {
				name : "zeropage",
				id : 10,

				getResult : function(opaddr) {
					var addr = cpu.mmu.readByte(opaddr + 1 & 0xFFFF);

					return {
						addr : addr,
						isDifferent : false,
					};
				}
			},
            zex: {
				name : "zeropage x",
				id : 11,

				getResult : function(opaddr) {
					var addr = cpu.mmu.readByte(opaddr + 1 & 0xFFFF);
					addr += cpu.registers.x.get();
					addr &= 0xFF;

					return {
						addr : addr,
						isDifferent : false,
					};
				},
			},
            zey: {
				name : "zeropage y",
				id : 12,

				getResult : function(opaddr) {
					var addr = cpu.mmu.readByte(opaddr + 1 & 0xFFFF);
					addr += cpu.registers.y.get();
					addr &= 0xFF;

					return {
						addr : addr,
						isDifferent : false,
					};
				},
			},
			err: {
				name : "Not Implemented",
				id : 13,

				getResult : function(opaddr) {
					asdasdasdasdasd;
					console.log("error");
				},
			},

			equals : function(a, b) {
				var result = (a.id == b.id);
				if (result) {
					return true;
				}
				return false;
			}

		},

		/**
		 * Helpers
		 */

		addBranchCycles : function(info) {
			//info holds the old pc address

			cpu.cycles++;
			if (this.isPageDifferent(info.pc, info.address)) {
				cpu.cycles++;
			}
		},

		isPageDifferent : function(a, b) {
			return (a & 0xFF00) != (b & 0xFF00);
		},
		
		ops : {

			adc : function(info) {

				var a = cpu.registers.a.get();
				var b = cpu.mmu.readByte(info.address);
				var c = cpu.registers.p.c;

				var sum = a + b + c;
				cpu.registers.p.v = ((!(((a ^ b) & 0x80)!=0) && (((a ^ sum) & 0x80)) !=0)? 1:0);
				cpu.registers.p.c = (sum > 255 ? 1:0);
				cpu.registers.p.n = (sum >> 7) & 1;
				cpu.registers.p.z = ((sum & 0xFF) == 0)? 1:0;

				cpu.registers.a.set(sum & 0xFF);
			},

			and : function(info) {
				var temp = cpu.registers.a.get() & cpu.mmu.readByte(info.address);
				cpu.registers.p.n = (temp>>7)&1;
				cpu.registers.p.z = ((temp&0xFF) == 0)? 1:0;

				cpu.registers.a.set(temp);
			},

			asl : function(info) {
				if (cpu.instructions.modes.equals(info.op.mode, cpu.instructions.modes.acc)) {
					var temp = cpu.registers.a.get();

					cpu.registers.p.c = (temp >> 7) & 1;
					temp = (temp << 1) & 255;

					cpu.registers.p.n = (temp >> 7) & 1;
					cpu.registers.p.z = ((temp & 0xFF) == 0)? 1:0;

					cpu.registers.a.set(temp & 0xFF);
				} else {
					var temp = cpu.mmu.readByte(info.address);

					cpu.registers.p.c = (temp >> 7) & 1;
					temp = (temp << 1) & 255;

					cpu.registers.p.n = (temp >> 7) & 1
					cpu.registers.p.z = ((temp & 0xFF) == 0)? 1:0;

					cpu.mmu.writeByte(info.address, temp);
				}
			},

			//branch when carry flag is not set
			bcc : function(info) {
				if (cpu.registers.p.c == 0) {
					cpu.registers.pc.set(info.address);
					cpu.instructions.addBranchCycles(info);
				}
			},

			//branch when carry flag is set
			bcs : function(info) {
				if (cpu.registers.p.c == 1) {
					cpu.registers.pc.set(info.address);
					cpu.instructions.addBranchCycles(info);
				}
			},

			//Branch if zero flag is not zero
			beq: function(info) {
				if (cpu.registers.p.z != 0) {
					cpu.registers.pc.set(info.address);
					cpu.instructions.addBranchCycles(info);
				}
			},

			//Test bits in memory with a
			bit : function(info) {
				var temp = cpu.mmu.readByte(info.address);

				cpu.registers.p.n = (temp>>7)&1;
				cpu.registers.p.v = (temp>>6)&1;

				temp &= cpu.registers.a.get();
				//TODO look over this
				cpu.registers.p.z = ((temp & 0xFF) == 0)? 1:0;
			},

			//branch if zero flag is set
			bmi : function(info) {
				if (cpu.registers.p.n == 1) {
					cpu.registers.pc.set(info.address);
					cpu.instructions.addBranchCycles(info);
				}
			},

			//branch when zero flag is 0
			bne : function(info) {
				if (cpu.registers.p.z == 0) {
					cpu.registers.pc.set(info.address);
					cpu.instructions.addBranchCycles(info);
				}
			},

			//Branch if negative
			bpl : function(info) {
				if (cpu.registers.p.n == 0) {
					cpu.registers.pc.set(info.address);
					cpu.instructions.addBranchCycles(info);
				}
			},

			brk : function(info) {
				cpu.mmu.stack.pushWord(cpu.registers.pc);
				cpu.instructions.ops.php(info);
				cpu.instructions.ops.sei(info);
				cpu.registers.pc.set(cpu.mmu.readWord(0xFFFE));
			},

			bvc: function(info) {
				if (cpu.registers.p.v == 0) {
					cpu.registers.pc.set(info.address);
					cpu.instructions.addBranchCycles(info);
				}
			},

			bvs: function(info) {
				if (cpu.registers.p.v == 1) {
					cpu.registers.pc.set(info.address);
					cpu.instructions.addBranchCycles(info);
				}
			},

			//Clear carry flag
			clc: function(info) {
				cpu.registers.p.c = 0;
			},

			//clear decimal flag
			cld: function(info) {
				cpu.registers.p.d = 0;
			},

			//Clear interupt flag
			cli: function(info) {
				cpu.registers.p.i = 0;
			},

			//Clear overflow flag
			clv: function(info) {
				cpu.registers.p.v = 0;
			},

			// Compare memory and accumulator:
			cmp: function(info) {

				var temp = cpu.registers.a.get() - cpu.mmu.readByte(info.address);

				cpu.registers.p.c = (temp >=0 ? 1:0);
				cpu.registers.p.n = (temp >> 7) &1;
				cpu.registers.p.z = ((temp & 0xFF) == 0) ? 1:0;

			},

			// Compare memory and index X:
			cpx: function(info) {
				var temp = cpu.registers.x.get() - cpu.mmu.readByte(info.address);

				cpu.registers.p.c = (temp >=0 ? 1:0);
				cpu.registers.p.n = (temp >> 7) &1;
				cpu.registers.p.z = ((temp & 0xFF) == 0) ? 1:0;
			},

			cpy: function(info) {
				var temp = cpu.registers.y.get() - cpu.mmu.readByte(info.address);

				cpu.registers.p.c = (temp >=0 ? 1:0);
				cpu.registers.p.n = (temp >> 7) &1;
				cpu.registers.p.z = ((temp & 0xFF) == 0) ? 1:0;
			},

			dec: function(info) {
				var temp = (cpu.mmu.readByte(info.address) - 1) & 0xFF;

				cpu.registers.p.n = (temp >> 7) &1;
				cpu.registers.p.z = ((temp & 0xFF) == 0) ? 1:0;

				cpu.mmu.writeByte(info.address, temp);
			},

			dex: function(info) {
				var temp = (cpu.registers.x.get() - 1) &0xFF;

				cpu.registers.p.n = (temp>>7)&1;
				cpu.registers.p.z = ((temp&0xFF) == 0)? 1:0;

				cpu.registers.x.set(temp);
			},

			dey: function(info) {
				var temp = (cpu.registers.y.get() - 1) &0xFF;

				cpu.registers.p.n = (temp>>7)&1;
				cpu.registers.p.z = ((temp&0xFF) == 0)? 1:0;

				cpu.registers.y.set(temp);
			},

			eor: function(info) {
				var temp = (cpu.mmu.readByte(info.address) ^ cpu.registers.a.get()) & 0xFF;

				cpu.registers.p.n = (temp>>7)&1;
				cpu.registers.p.z = ((temp&0xFF) == 0)? 1:0;

				cpu.registers.a.set(temp);
			},

			//Increment memory by one
			inc: function(info) {
				var temp = (cpu.mmu.readByte(info.address) + 1) & 0xFF;

				cpu.registers.p.n = (temp>>7)&1;
				cpu.registers.p.z = ((temp&0xFF) == 0)? 1:0;

				cpu.mmu.writeByte(info.address, temp);
			},


			//Increment X register
			inx : function(info) {
				var temp = (cpu.registers.x.get() + 1) & 0xFF;

				cpu.registers.p.n = (temp>>7)&1;
				cpu.registers.p.z = ((temp&0xFF) == 0)? 1:0;

				cpu.registers.x.set(temp);
			},

			//Increment Y register
			iny: function(info) {
				var temp = (cpu.registers.y.get() + 1) & 0xFF;

				cpu.registers.p.n = (temp>>7)&1;
				cpu.registers.p.z = ((temp&0xFF) == 0)? 1:0;

				cpu.registers.y.set(temp);
			},

			//Jump to address
			jmp : function(info) {
				cpu.registers.pc.set(info.address);
			},

			//Jump to subroutine
			jsr: function(info) {
				cpu.mmu.stack.pushWord((cpu.registers.pc.get() - 1) & 0xFFFF);
				cpu.registers.pc.set(info.address);
			},

			//Load Accumulator with m
			lda: function(info) {
				var temp = cpu.mmu.readByte(info.address);
				cpu.registers.p.n = (temp>>7)&1;
				cpu.registers.p.z = ((temp&0xFF) == 0)? 1:0;

				cpu.registers.a.set(temp);
			},

			//load X with m with memory
			ldx: function(info) {
				var temp = cpu.mmu.readByte(info.address);

				cpu.registers.p.n = (temp>>7)&1;
				cpu.registers.p.z = ((temp&0xFF) == 0)? 1:0;

				cpu.registers.x.set(temp);

			},

			//Load Y Register with memory
			ldy : function(info) {
				var temp = cpu.mmu.readByte(info.address);

				cpu.registers.p.n = (temp>>7)&1;
				cpu.registers.p.z = ((temp&0xFF) == 0)? 1:0;

				cpu.registers.y.set(temp);
			},

			//Shift Right one bit
			lsr: function(info) {
				var temp;
				if (cpu.instructions.modes.equals(info.op.mode, cpu.instructions.modes.acc)) {
					temp = cpu.registers.a.get() & 0xFF;
					cpu.registers.p.c = temp & 1;
					temp = temp >> 1 & 0xFF;
					cpu.registers.a.set(temp);
				} else {
					temp = cpu.mmu.readByte(info.address) & 0xFF;
					cpu.registers.p.c = temp & 1;
					temp = temp >> 1 & 0xFF;
					cpu.mmu.writeByte(info.address, temp);
				}
				cpu.registers.p.n = (temp>>7)&1;
				cpu.registers.p.z = ((temp&0xFF) == 0)? 1:0;
			},

			//No operation
			nop : function(info) {

			},

			// Or memory with accumulator, store in accumulator
			ora : function(info) {
				var temp = (cpu.mmu.readByte(info.address) | cpu.registers.a.get()) & 0xFF;

				cpu.registers.p.n = (temp>>7)&1;
				cpu.registers.p.z = ((temp&0xFF) == 0)? 1:0;

				cpu.registers.a.set(temp);
			},

			pha: function(info) {
				cpu.mmu.stack.pushByte(cpu.registers.a.get());
			},

			php: function(info) {
				cpu.mmu.stack.pushByte(cpu.registers.p.get() | 0x10);
			},

			pla : function(info) {
				var temp = cpu.mmu.stack.popByte();
				cpu.registers.p.n = (temp>>7)&1;
				cpu.registers.p.z = ((temp&0xFF) == 0)? 1:0;

				cpu.registers.a.set(temp);
			},

			plp: function(info) {
				cpu.registers.p.set(cpu.mmu.stack.popByte() & 0xEF | 0x20);
			},

			rol: function(info) {
				if (cpu.instructions.modes.equals(info.op.mode, cpu.instructions.modes.acc)) {
					var temp = cpu.registers.a.get();
					var add = cpu.registers.p.c;

					cpu.registers.p.c = (temp>>7) & 1;
					temp = ((temp<<1)&0xFF) + add;

					cpu.registers.a.set(temp);

					cpu.registers.p.n = (temp>>7)&1;
					cpu.registers.p.z = ((temp&0xFF) == 0)? 1:0;

				} else {
					var temp = cpu.mmu.readByte(info.address);
					var add = cpu.registers.p.c;

					cpu.registers.p.c = (temp>>7) & 1;
					temp = ((temp<<1)&0xFF) + add;

					cpu.mmu.writeByte(info.address, temp);

					cpu.registers.p.n = (temp>>7)&1;
					cpu.registers.p.z = ((temp&0xFF) == 0)? 1:0;
				}
			},

			ror: function(info) {
				if (cpu.instructions.modes.equals(info.op.mode, cpu.instructions.modes.acc)) {
					var temp = cpu.registers.a.get();
					var c = cpu.registers.p.c;
					var add = c << 7;

					cpu.registers.p.c = temp & 1;
					temp = (temp>>1) + add;

					cpu.registers.a.set(temp);

					cpu.registers.p.n = (temp>>7)&1;
					cpu.registers.p.z = ((temp&0xFF) == 0)? 1:0;
				} else {
					var temp = cpu.mmu.readByte(info.address);
					var c = cpu.registers.p.c;
					var add = c << 7;

					cpu.registers.p.c = temp & 1;
					temp = (temp>>1) + add;

					cpu.mmu.writeByte(info.address, temp);

					cpu.registers.p.n = (temp>>7)&1;
					cpu.registers.p.z = ((temp&0xFF) == 0)? 1:0;
				}
			},

			rti: function(info) {
				cpu.registers.p.set(cpu.mmu.stack.popByte() & 0xEF | 0x20);
				cpu.registers.pc.set(cpu.mmu.stack.popWord());
			},

			// RTS - Return from Subroutine
			rts : function(info) {
				cpu.registers.pc.set(cpu.mmu.stack.popWord() + 1);
			},

			sbc: function(info) {
				var a = cpu.registers.a.get();
				var b = cpu.mmu.readByte(info.address);
				var c = cpu.registers.p.c;

				var temp = a - b - (1-c);

				cpu.registers.p.n = (temp>>7)&1;
				cpu.registers.p.z = ((temp&0xFF) == 0)? 1:0;
				cpu.registers.p.v = ((((a^b)&0x80)!=0 && ((a^temp)&0x80)!=0)?1:0);
				cpu.registers.p.c = (temp>=0?1:0);
				cpu.registers.a.set(temp&0xFF);

			},

			//Set carry flag
			sec: function(info) {
				cpu.registers.p.c = 1;
			},

			//Set decimal flag
			sed: function(info) {
				cpu.registers.p.d = 1;
			},

			//Set i flag
			sei: function(info) {
				cpu.registers.i = 1;
			},

			//Store accumulator
			sta: function(info) {

				cpu.mmu.writeByte(info.address, cpu.registers.a.get());
			},

			//Store X to M
			stx : function(info) {
				cpu.mmu.writeByte(info.address, cpu.registers.x.get());
			},

			//Write y register to m
			sty: function(info) {
				cpu.mmu.writeByte(info.address, cpu.registers.y.get());
			},


			//Transfer accumulator to index X
			tax: function(info) {
				var temp = cpu.registers.a.get();

				cpu.registers.p.n = (temp>>7)&1;
				cpu.registers.p.z = ((temp&0xFF) == 0)? 1:0;

				cpu.registers.x.set(temp);
			},

			//Transfer accumulator to index Y
			tay: function(info) {
				var temp = cpu.registers.a.get();

				cpu.registers.p.n = (temp>>7)&1;
				cpu.registers.p.z = ((temp&0xFF) == 0)? 1:0;

				cpu.registers.y.set(temp);
			},

			// Transfer stack pointer to index X:
			tsx: function(info) {
				var temp = cpu.registers.sp.get();

				cpu.registers.p.n = (temp>>7)&1;
				cpu.registers.p.z = ((temp&0xFF) == 0)? 1:0;

				cpu.registers.x.set(temp);
			},

			// Transfer index X to accumulator:
			txa: function(info) {
				var temp = cpu.registers.x.get();

				cpu.registers.p.n = (temp>>7)&1;
				cpu.registers.p.z = ((temp&0xFF) == 0)? 1:0;

				cpu.registers.a.set(temp);
			},

			//transfer x to sp
			txs: function(info) {
				//TODO
				cpu.registers.sp.set(cpu.registers.x.get() & 0xFF);
			},

			// Transfer index Y to accumulator:
			tya: function(info) {
				var temp = cpu.registers.y.get();

				cpu.registers.p.n = (temp>>7)&1;
				cpu.registers.p.z = ((temp&0xFF) == 0)? 1:0;

				cpu.registers.a.set(temp);
			},


			/**
			 * Unused opcodes
			 */

			ahx: function() {

			},

			alr: function() {

			},

			anc: function() {

			},

			arr: function() {

			},

			axs: function() {

			},

			dcp: function() {

			},

			isc: function() {

			},

			kil: function() {

			},

			las: function() {

			},

			lax: function() {

			},

			rla: function() {

			},

			rra: function() {

			},

			sax: function() {

			},

			shx: function() {

			},

			shy: function() {

			},

			slo: function() {

			},

			sre : function() {

			},

			tas: function() {

			},

			xaa: function() {

			},


			
		},
		
		init : function() {

			this.map = [
				{name: 'BRK', cycles : 7, cross : 0, size: 1, mode: this.modes.imp, func: this.ops.brk},
				{name: 'ORA', cycles : 6, cross : 0, size: 2, mode: this.modes.ini, func: this.ops.ora},
				{name: 'KIL', cycles : 2, cross : 0, size: 0, mode: this.modes.err, func: this.ops.kil},
				{name: 'SLO', cycles : 8, cross : 0, size: 0, mode: this.modes.err, func: this.ops.slo},
				{name: 'NOP', cycles : 3, cross : 0, size: 2, mode: this.modes.err, func: this.ops.nop},
				{name: 'ORA', cycles : 3, cross : 0, size: 2, mode: this.modes.zer, func: this.ops.ora},
				{name: 'ASL', cycles : 5, cross : 0, size: 2, mode: this.modes.zer, func: this.ops.asl},
				{name: 'SLO', cycles : 5, cross : 0, size: 0, mode: this.modes.err, func: this.ops.slo},

				{name: 'PHP', cycles : 3, cross : 0, size: 1, mode: this.modes.imp, func: this.ops.php},
				{name: 'ORA', cycles : 2, cross : 0, size: 2, mode: this.modes.imm, func: this.ops.ora},
				{name: 'ASL', cycles : 2, cross : 0, size: 1, mode: this.modes.acc, func: this.ops.asl},
				{name: 'ANC', cycles : 2, cross : 0, size: 0, mode: this.modes.acc, func: this.ops.anc},
				{name: 'NOP', cycles : 4, cross : 0, size: 3, mode: this.modes.err, func: this.ops.nop},
				{name: 'ORA', cycles : 4, cross : 0, size: 3, mode: this.modes.abs, func: this.ops.ora},
				{name: 'ASL', cycles : 6, cross : 0, size: 3, mode: this.modes.abs, func: this.ops.asl},
				{name: 'SLO', cycles : 6, cross : 0, size: 0, mode: this.modes.err, func: this.ops.slo},

				{name: 'BPL', cycles : 2, cross : 1, size: 2, mode: this.modes.rel, func: this.ops.bpl},//0x10
				{name: 'ORA', cycles : 5, cross : 1, size: 2, mode: this.modes.inr, func: this.ops.ora},
				{name: 'KIL', cycles : 2, cross : 0, size: 0, mode: this.modes.err, func: this.ops.kil},
				{name: 'SLO', cycles : 8, cross : 0, size: 0, mode: this.modes.err, func: this.ops.slo},
				{name: 'NOP', cycles : 4, cross : 0, size: 2, mode: this.modes.err, func: this.ops.nop},
				{name: 'ORA', cycles : 4, cross : 0, size: 2, mode: this.modes.zex, func: this.ops.ora},
				{name: 'ASL', cycles : 6, cross : 0, size: 2, mode: this.modes.zex, func: this.ops.asl},
				{name: 'SLO', cycles : 6, cross : 0, size: 0, mode: this.modes.err, func: this.ops.slo},

				{name: 'CLC', cycles : 2, cross : 0, size: 1, mode: this.modes.imp, func: this.ops.clc},
				{name: 'ORA', cycles : 4, cross : 1, size: 3, mode: this.modes.aby, func: this.ops.ora},
				{name: 'NOP', cycles : 2, cross : 0, size: 1, mode: this.modes.err, func: this.ops.nop},
				{name: 'SLO', cycles : 7, cross : 0, size: 0, mode: this.modes.err, func: this.ops.slo},
				{name: 'NOP', cycles : 4, cross : 1, size: 3, mode: this.modes.err, func: this.ops.nop},
				{name: 'ORA', cycles : 4, cross : 1, size: 3, mode: this.modes.abx, func: this.ops.ora},
				{name: 'ASL', cycles : 7, cross : 0, size: 3, mode: this.modes.abx, func: this.ops.asl},
				{name: 'SLO', cycles : 7, cross : 0, size: 0, mode: this.modes.err, func: this.ops.slo},

				{name: 'JSR', cycles : 6, cross : 0, size: 3, mode: this.modes.abs, func: this.ops.jsr}, //0x20
				{name: 'AND', cycles : 6, cross : 0, size: 2, mode: this.modes.ini, func: this.ops.and},
				{name: 'KIL', cycles : 2, cross : 0, size: 0, mode: this.modes.err, func: this.ops.kil},
				{name: 'RLA', cycles : 8, cross : 0, size: 0, mode: this.modes.err, func: this.ops.rla},
				{name: 'BIT', cycles : 3, cross : 0, size: 2, mode: this.modes.zer, func: this.ops.bit},
				{name: 'AND', cycles : 3, cross : 0, size: 2, mode: this.modes.zer, func: this.ops.and},
				{name: 'ROL', cycles : 5, cross : 0, size: 2, mode: this.modes.zer, func: this.ops.rol},
				{name: 'RLA', cycles : 5, cross : 0, size: 0, mode: this.modes.err, func: this.ops.rla},

				{name: 'PLP', cycles : 4, cross : 0, size: 1, mode: this.modes.imm, func: this.ops.plp},
				{name: 'AND', cycles : 2, cross : 0, size: 2, mode: this.modes.imm, func: this.ops.and},
				{name: 'ROL', cycles : 2, cross : 0, size: 1, mode: this.modes.acc, func: this.ops.rol},
				{name: 'ANC', cycles : 2, cross : 0, size: 0, mode: this.modes.err, func: this.ops.anc},
				{name: 'BIT', cycles : 4, cross : 0, size: 3, mode: this.modes.abs, func: this.ops.bit},
				{name: 'AND', cycles : 4, cross : 0, size: 3, mode: this.modes.abs, func: this.ops.and},
				{name: 'ROL', cycles : 6, cross : 0, size: 3, mode: this.modes.abs, func: this.ops.rol},
				{name: 'RLA', cycles : 6, cross : 0, size: 0, mode: this.modes.err, func: this.ops.rla},

				{name: 'BMI', cycles : 2, cross : 1, size: 2, mode: this.modes.rel, func: this.ops.bmi}, //0x30
				{name: 'AND', cycles : 5, cross : 1, size: 2, mode: this.modes.inr, func: this.ops.and},
				{name: 'KIL', cycles : 2, cross : 0, size: 0, mode: this.modes.err, func: this.ops.kil},
				{name: 'RLA', cycles : 8, cross : 0, size: 0, mode: this.modes.err, func: this.ops.rla},
				{name: 'NOP', cycles : 4, cross : 0, size: 2, mode: this.modes.err, func: this.ops.nop},
				{name: 'AND', cycles : 4, cross : 0, size: 2, mode: this.modes.zex, func: this.ops.and},
				{name: 'ROL', cycles : 6, cross : 0, size: 2, mode: this.modes.zex, func: this.ops.rol},
				{name: 'RLA', cycles : 6, cross : 0, size: 0, mode: this.modes.err, func: this.ops.rla},

				{name: 'SEC', cycles : 2, cross : 0, size: 1, mode: this.modes.imp, func: this.ops.sec}, //38
				{name: 'AND', cycles : 4, cross : 1, size: 3, mode: this.modes.aby, func: this.ops.and},
				{name: 'NOP', cycles : 2, cross : 0, size: 1, mode: this.modes.err, func: this.ops.nop},
				{name: 'RLA', cycles : 7, cross : 0, size: 0, mode: this.modes.err, func: this.ops.rla},
				{name: 'NOP', cycles : 4, cross : 1, size: 3, mode: this.modes.err, func: this.ops.nop},
				{name: 'AND', cycles : 4, cross : 1, size: 3, mode: this.modes.abx, func: this.ops.and}, //3d
				{name: 'ROL', cycles : 7, cross : 0, size: 3, mode: this.modes.abx, func: this.ops.rol},
				{name: 'RLA', cycles : 7, cross : 0, size: 0, mode: this.modes.err, func: this.ops.rla},

				{name: 'RTI', cycles : 6, cross : 0, size: 1, mode: this.modes.imp, func: this.ops.rti}, //40
				{name: 'EOR', cycles : 6, cross : 0, size: 2, mode: this.modes.ini, func: this.ops.eor},
				{name: 'KIL', cycles : 2, cross : 0, size: 0, mode: this.modes.err, func: this.ops.kil},
				{name: 'SRE', cycles : 8, cross : 0, size: 0, mode: this.modes.err, func: this.ops.sre},
				{name: 'NOP', cycles : 3, cross : 0, size: 2, mode: this.modes.err, func: this.ops.nop},
				{name: 'EOR', cycles : 3, cross : 0, size: 2, mode: this.modes.zer, func: this.ops.eor}, //45
				{name: 'LSR', cycles : 5, cross : 0, size: 2, mode: this.modes.zer, func: this.ops.lsr},
				{name: 'SRE', cycles : 5, cross : 0, size: 0, mode: this.modes.err, func: this.ops.sre},

				{name: 'PHA', cycles : 3, cross : 0, size: 1, mode: this.modes.imp, func: this.ops.pha}, //48
				{name: 'EOR', cycles : 2, cross : 0, size: 2, mode: this.modes.imm, func: this.ops.eor},
				{name: 'LSR', cycles : 2, cross : 0, size: 1, mode: this.modes.acc, func: this.ops.lsr},
				{name: 'ALR', cycles : 2, cross : 0, size: 0, mode: this.modes.err, func: this.ops.alr},
				{name: 'JMP', cycles : 3, cross : 0, size: 3, mode: this.modes.abs, func: this.ops.jmp},
				{name: 'EOR', cycles : 4, cross : 0, size: 3, mode: this.modes.abs, func: this.ops.eor},
				{name: 'LSR', cycles : 6, cross : 0, size: 3, mode: this.modes.abs, func: this.ops.lsr},
				{name: 'SRE', cycles : 6, cross : 0, size: 0, mode: this.modes.err, func: this.ops.sre},

				{name: 'BVC', cycles : 2, cross : 1, size: 2, mode: this.modes.rel, func: this.ops.bvc}, //0x50
				{name: 'EOR', cycles : 5, cross : 1, size: 2, mode: this.modes.inr, func: this.ops.eor},
				{name: 'KIL', cycles : 2, cross : 0, size: 0, mode: this.modes.err, func: this.ops.kil},
				{name: 'SRE', cycles : 8, cross : 0, size: 0, mode: this.modes.err, func: this.ops.sre},
				{name: 'NOP', cycles : 4, cross : 0, size: 2, mode: this.modes.err, func: this.ops.nop},
				{name: 'EOR', cycles : 4, cross : 0, size: 2, mode: this.modes.zex, func: this.ops.eor},
				{name: 'LSR', cycles : 6, cross : 0, size: 2, mode: this.modes.zex, func: this.ops.lsr},
				{name: 'SRE', cycles : 6, cross : 0, size: 0, mode: this.modes.err, func: this.ops.sre},

				{name: 'CLI', cycles : 2, cross : 0, size: 1, mode: this.modes.imp, func: this.ops.cli}, //0x58
				{name: 'EOR', cycles : 4, cross : 1, size: 3, mode: this.modes.aby, func: this.ops.eor},
				{name: 'NOP', cycles : 2, cross : 0, size: 1, mode: this.modes.err, func: this.ops.nop},
				{name: 'SRE', cycles : 7, cross : 0, size: 0, mode: this.modes.err, func: this.ops.sre},
				{name: 'NOP', cycles : 4, cross : 1, size: 3, mode: this.modes.err, func: this.ops.nop},
				{name: 'EOR', cycles : 4, cross : 1, size: 3, mode: this.modes.abx, func: this.ops.eor}, //5d
				{name: 'LSR', cycles : 7, cross : 0, size: 3, mode: this.modes.abx, func: this.ops.lsr},
				{name: 'SRE', cycles : 7, cross : 0, size: 0, mode: this.modes.err, func: this.ops.sre},

				{name: 'RTS', cycles : 6, cross : 0, size: 1, mode: this.modes.imp, func: this.ops.rts}, //60
				{name: 'ADC', cycles : 6, cross : 0, size: 2, mode: this.modes.ini, func: this.ops.adc},
				{name: 'KIL', cycles : 2, cross : 0, size: 0, mode: this.modes.err, func: this.ops.kil},
				{name: 'RRA', cycles : 8, cross : 0, size: 0, mode: this.modes.err, func: this.ops.rra},
				{name: 'NOP', cycles : 3, cross : 0, size: 2, mode: this.modes.err, func: this.ops.nop},
				{name: 'ADC', cycles : 3, cross : 0, size: 2, mode: this.modes.zer, func: this.ops.adc},
				{name: 'ROR', cycles : 5, cross : 0, size: 2, mode: this.modes.zer, func: this.ops.ror},
				{name: 'RRA', cycles : 5, cross : 0, size: 0, mode: this.modes.err, func: this.ops.rra},

				{name: 'PLA', cycles : 4, cross : 0, size: 1, mode: this.modes.imp, func: this.ops.pla},
				{name: 'ADC', cycles : 2, cross : 0, size: 2, mode: this.modes.imm, func: this.ops.adc},
				{name: 'ROR', cycles : 2, cross : 0, size: 1, mode: this.modes.acc, func: this.ops.ror},
				{name: 'ARR', cycles : 2, cross : 0, size: 0, mode: this.modes.err, func: this.ops.arr}, //6b
				{name: 'JMP', cycles : 5, cross : 0, size: 3, mode: this.modes.ind, func: this.ops.jmp},
				{name: 'ADC', cycles : 4, cross : 0, size: 3, mode: this.modes.abs, func: this.ops.adc},
				{name: 'ROR', cycles : 6, cross : 0, size: 3, mode: this.modes.abs, func: this.ops.ror},
				{name: 'RRA', cycles : 6, cross : 0, size: 0, mode: this.modes.err, func: this.ops.rra},

				{name: 'BVS', cycles : 2, cross : 1, size: 2, mode: this.modes.rel, func: this.ops.bvs}, //70
				{name: 'ADC', cycles : 5, cross : 1, size: 2, mode: this.modes.inr, func: this.ops.adc},
				{name: 'KIL', cycles : 2, cross : 0, size: 0, mode: this.modes.err, func: this.ops.kil},
				{name: 'RRA', cycles : 8, cross : 0, size: 0, mode: this.modes.err, func: this.ops.rra},
				{name: 'NOP', cycles : 4, cross : 0, size: 2, mode: this.modes.err, func: this.ops.nop},
				{name: 'ADC', cycles : 4, cross : 0, size: 2, mode: this.modes.zex, func: this.ops.adc},
				{name: 'ROR', cycles : 6, cross : 0, size: 2, mode: this.modes.zex, func: this.ops.ror},
				{name: 'RRA', cycles : 6, cross : 0, size: 0, mode: this.modes.err, func: this.ops.rra},

				{name: 'SEI', cycles : 2, cross : 0, size: 1, mode: this.modes.imp, func: this.ops.sei}, //78
				{name: 'ADC', cycles : 4, cross : 1, size: 3, mode: this.modes.aby, func: this.ops.adc},
				{name: 'NOP', cycles : 2, cross : 0, size: 1, mode: this.modes.err, func: this.ops.nop},
				{name: 'RRA', cycles : 7, cross : 0, size: 0, mode: this.modes.err, func: this.ops.rra},
				{name: 'NOP', cycles : 4, cross : 1, size: 3, mode: this.modes.err, func: this.ops.nop},
				{name: 'ADC', cycles : 4, cross : 1, size: 3, mode: this.modes.abx, func: this.ops.adc},
				{name: 'ROR', cycles : 7, cross : 0, size: 3, mode: this.modes.abx, func: this.ops.ror},
				{name: 'RRA', cycles : 7, cross : 0, size: 0, mode: this.modes.err, func: this.ops.rra},

				{name: 'NOP', cycles : 2, cross : 0, size: 2, mode: this.modes.err, func: this.ops.nop},
				{name: 'STA', cycles : 6, cross : 0, size: 2, mode: this.modes.ini, func: this.ops.sta}, //81
				{name: 'NOP', cycles : 2, cross : 0, size: 0, mode: this.modes.err, func: this.ops.nop},
				{name: 'SAX', cycles : 6, cross : 0, size: 0, mode: this.modes.err, func: this.ops.sax},
				{name: 'STY', cycles : 3, cross : 0, size: 2, mode: this.modes.zer, func: this.ops.sty},
				{name: 'STA', cycles : 3, cross : 0, size: 2, mode: this.modes.zer, func: this.ops.sta},
				{name: 'STX', cycles : 3, cross : 0, size: 2, mode: this.modes.zer, func: this.ops.stx},
				{name: 'SAX', cycles : 3, cross : 0, size: 0, mode: this.modes.err, func: this.ops.sax},

				{name: 'DEY', cycles : 2, cross : 0, size: 1, mode: this.modes.imp, func: this.ops.dey}, //88
				{name: 'NOP', cycles : 2, cross : 0, size: 0, mode: this.modes.err, func: this.ops.nop},
				{name: 'TXA', cycles : 2, cross : 0, size: 1, mode: this.modes.imp, func: this.ops.txa},
				{name: 'XAA', cycles : 2, cross : 0, size: 0, mode: this.modes.err, func: this.ops.xaa},
				{name: 'STY', cycles : 4, cross : 0, size: 3, mode: this.modes.abs, func: this.ops.sty},
				{name: 'STA', cycles : 4, cross : 0, size: 3, mode: this.modes.abs, func: this.ops.sta},
				{name: 'STX', cycles : 4, cross : 0, size: 3, mode: this.modes.abs, func: this.ops.stx},
				{name: 'SAX', cycles : 4, cross : 0, size: 0, mode: 0, func: this.ops.sax},

				{name: 'BCC', cycles : 2, cross : 1, size: 2, mode: this.modes.rel, func: this.ops.bcc}, //90
				{name: 'STA', cycles : 6, cross : 0, size: 2, mode: this.modes.inr, func: this.ops.sta},
				{name: 'KIL', cycles : 2, cross : 0, size: 0, mode: this.modes.err, func: this.ops.kil},
				{name: 'AHX', cycles : 6, cross : 0, size: 0, mode: this.modes.err, func: this.ops.ahx},
				{name: 'STY', cycles : 4, cross : 0, size: 2, mode: this.modes.zex, func: this.ops.sty},
				{name: 'STA', cycles : 4, cross : 0, size: 2, mode: this.modes.zex, func: this.ops.sta},
				{name: 'STX', cycles : 4, cross : 0, size: 2, mode: this.modes.zey, func: this.ops.stx},
				{name: 'SAX', cycles : 4, cross : 0, size: 0, mode: this.modes.err, func: this.ops.sax},

				{name: 'TYA', cycles : 2, cross : 0, size: 1, mode: this.modes.imp, func: this.ops.tya},
				{name: 'STA', cycles : 5, cross : 0, size: 3, mode: this.modes.aby, func: this.ops.sta},
				{name: 'TXS', cycles : 2, cross : 0, size: 1, mode: this.modes.imp, func: this.ops.txs}, //9a
				{name: 'TAS', cycles : 5, cross : 0, size: 0, mode: this.modes.err, func: this.ops.tas},
				{name: 'SHY', cycles : 5, cross : 0, size: 0, mode: this.modes.err, func: this.ops.shy},
				{name: 'STA', cycles : 5, cross : 0, size: 3, mode: this.modes.abx, func: this.ops.sta},
				{name: 'SHX', cycles : 5, cross : 0, size: 0, mode: this.modes.err, func: this.ops.shx},
				{name: 'AHX', cycles : 5, cross : 0, size: 0, mode: this.modes.err, func: this.ops.ahx},

				{name: 'LDY', cycles : 2, cross : 0, size: 2, mode: this.modes.imm, func: this.ops.ldy},  //A0
				{name: 'LDA', cycles : 6, cross : 0, size: 2, mode: this.modes.ini, func: this.ops.lda},
				{name: 'LDX', cycles : 2, cross : 0, size: 2, mode: this.modes.imm, func: this.ops.ldx},
				{name: 'LAX', cycles : 6, cross : 0, size: 0, mode: this.modes.err, func: this.ops.lax},
				{name: 'LDY', cycles : 3, cross : 0, size: 2, mode: this.modes.zer, func: this.ops.ldy},
				{name: 'LDA', cycles : 3, cross : 0, size: 2, mode: this.modes.zer, func: this.ops.lda},
				{name: 'LDX', cycles : 3, cross : 0, size: 2, mode: this.modes.zer, func: this.ops.ldx},
				{name: 'LAX', cycles : 3, cross : 0, size: 0, mode: this.modes.err, func: this.ops.lax},

				{name: 'TAY', cycles : 2, cross : 0, size: 1, mode: this.modes.imp, func: this.ops.tay}, //a8
				{name: 'LDA', cycles : 2, cross : 0, size: 2, mode: this.modes.imm, func: this.ops.lda},
				{name: 'TAX', cycles : 2, cross : 0, size: 1, mode: this.modes.imp, func: this.ops.tax},
				{name: 'LAX', cycles : 2, cross : 0, size: 0, mode: this.modes.err, func: this.ops.lax},
				{name: 'LDY', cycles : 4, cross : 0, size: 3, mode: this.modes.abs, func: this.ops.ldy},
				{name: 'LDA', cycles : 4, cross : 0, size: 3, mode: this.modes.abs, func: this.ops.lda},
				{name: 'LDX', cycles : 4, cross : 0, size: 3, mode: this.modes.abs, func: this.ops.ldx},
				{name: 'LAX', cycles : 4, cross : 0, size: 0, mode: this.modes.err, func: this.ops.lax},

				{name: 'BCS', cycles : 2, cross : 1, size: 2, mode: this.modes.rel, func: this.ops.bcs}, //b0
				{name: 'LDA', cycles : 5, cross : 1, size: 2, mode: this.modes.inr, func: this.ops.lda},
				{name: 'KIL', cycles : 2, cross : 0, size: 2, mode: this.modes.err, func: this.ops.kil},
				{name: 'LAX', cycles : 5, cross : 1, size: 0, mode: this.modes.err, func: this.ops.lax},
				{name: 'LDY', cycles : 4, cross : 0, size: 2, mode: this.modes.zex, func: this.ops.ldy},
				{name: 'LDA', cycles : 4, cross : 0, size: 2, mode: this.modes.zex, func: this.ops.lda},
				{name: 'LDX', cycles : 4, cross : 0, size: 2, mode: this.modes.zey, func: this.ops.ldx},
				{name: 'LAX', cycles : 4, cross : 0, size: 0, mode: this.modes.err, func: this.ops.lax},

				{name: 'CLV', cycles : 2, cross : 0, size: 1, mode: this.modes.imp, func: this.ops.clv}, //b8
				{name: 'LDA', cycles : 4, cross : 1, size: 3, mode: this.modes.aby, func: this.ops.lda},
				{name: 'TSX', cycles : 2, cross : 0, size: 1, mode: this.modes.imp, func: this.ops.tsx},
				{name: 'LAS', cycles : 4, cross : 1, size: 0, mode: this.modes.err, func: this.ops.las},
				{name: 'LDY', cycles : 4, cross : 1, size: 3, mode: this.modes.abx, func: this.ops.ldy},
				{name: 'LDA', cycles : 4, cross : 1, size: 3, mode: this.modes.abx, func: this.ops.lda},
				{name: 'LDX', cycles : 4, cross : 1, size: 3, mode: this.modes.aby, func: this.ops.ldx},
				{name: 'LAX', cycles : 4, cross : 1, size: 0, mode: this.modes.err, func: this.ops.lax},

				{name: 'CPY', cycles : 2, cross : 0, size: 2, mode: this.modes.imm, func: this.ops.cpy}, //c0
				{name: 'CMP', cycles : 6, cross : 0, size: 2, mode: this.modes.ini, func: this.ops.cmp},
				{name: 'NOP', cycles : 2, cross : 0, size: 0, mode: this.modes.err, func: this.ops.nop},
				{name: 'DCP', cycles : 8, cross : 0, size: 0, mode: this.modes.err, func: this.ops.dcp},
				{name: 'CPY', cycles : 3, cross : 0, size: 2, mode: this.modes.zer, func: this.ops.cpy},
				{name: 'CMP', cycles : 3, cross : 0, size: 2, mode: this.modes.zer, func: this.ops.cmp},
				{name: 'DEC', cycles : 5, cross : 0, size: 2, mode: this.modes.zer, func: this.ops.dec},
				{name: 'DCP', cycles : 5, cross : 0, size: 0, mode: this.modes.err, func: this.ops.dcp},

				{name: 'INY', cycles : 2, cross : 0, size: 1, mode: this.modes.imp, func: this.ops.iny}, //c8
				{name: 'CMP', cycles : 2, cross : 0, size: 2, mode: this.modes.imm, func: this.ops.cmp},
				{name: 'DEX', cycles : 2, cross : 0, size: 1, mode: this.modes.imp, func: this.ops.dex},
				{name: 'AXS', cycles : 2, cross : 0, size: 0, mode: this.modes.err, func: this.ops.axs},
				{name: 'CPY', cycles : 4, cross : 0, size: 3, mode: this.modes.abs, func: this.ops.cpy},
				{name: 'CMP', cycles : 4, cross : 0, size: 3, mode: this.modes.abs, func: this.ops.cmp},
				{name: 'DEC', cycles : 6, cross : 0, size: 3, mode: this.modes.abs, func: this.ops.dec},
				{name: 'DCP', cycles : 6, cross : 0, size: 0, mode: this.modes.err, func: this.ops.dcp},

				{name: 'BNE', cycles : 2, cross : 1, size: 2, mode: this.modes.rel, func: this.ops.bne}, //d0
				{name: 'CMP', cycles : 5, cross : 1, size: 2, mode: this.modes.inr, func: this.ops.cmp},
				{name: 'KIL', cycles : 2, cross : 0, size: 0, mode: this.modes.err, func: this.ops.kil},
				{name: 'DCP', cycles : 8, cross : 0, size: 0, mode: this.modes.err, func: this.ops.dcp},
				{name: 'NOP', cycles : 4, cross : 0, size: 2, mode: this.modes.err, func: this.ops.nop},
				{name: 'CMP', cycles : 4, cross : 0, size: 2, mode: this.modes.zex, func: this.ops.cmp},
				{name: 'DEC', cycles : 6, cross : 0, size: 2, mode: this.modes.zex, func: this.ops.dec},
				{name: 'DCP', cycles : 6, cross : 0, size: 0, mode: this.modes.err, func: this.ops.dcp},

				{name: 'CLD', cycles : 2, cross : 0, size: 1, mode: this.modes.imp, func: this.ops.cld}, //d8
				{name: 'CMP', cycles : 4, cross : 1, size: 3, mode: this.modes.aby, func: this.ops.cmp},
				{name: 'NOP', cycles : 2, cross : 0, size: 1, mode: this.modes.err, func: this.ops.nop},
				{name: 'DCP', cycles : 7, cross : 0, size: 0, mode: this.modes.err, func: this.ops.dcp},
				{name: 'NOP', cycles : 4, cross : 0, size: 3, mode: this.modes.err, func: this.ops.nop},
				{name: 'CMP', cycles : 4, cross : 1, size: 3, mode: this.modes.abx, func: this.ops.cmp},
				{name: 'DEC', cycles : 7, cross : 1, size: 3, mode: this.modes.abx, func: this.ops.dec},
				{name: 'DCP', cycles : 7, cross : 0, size: 0, mode: this.modes.err, func: this.ops.dcp},

				{name: 'CPX', cycles : 2, cross : 0, size: 2, mode: this.modes.imm, func: this.ops.cpx}, //e0
				{name: 'SBC', cycles : 6, cross : 0, size: 2, mode: this.modes.ini, func: this.ops.sbc},
				{name: 'NOP', cycles : 2, cross : 0, size: 0, mode: this.modes.err, func: this.ops.nop},
				{name: 'ISC', cycles : 8, cross : 0, size: 0, mode: this.modes.err, func: this.ops.isc},
				{name: 'CPX', cycles : 3, cross : 0, size: 2, mode: this.modes.zer, func: this.ops.cpx},
				{name: 'SBC', cycles : 3, cross : 0, size: 2, mode: this.modes.zer, func: this.ops.sbc},
				{name: 'INC', cycles : 5, cross : 0, size: 2, mode: this.modes.zer, func: this.ops.inc},
				{name: 'ISC', cycles : 5, cross : 0, size: 0, mode: this.modes.err, func: this.ops.isc},

				{name: 'INX', cycles : 2, cross : 0, size: 1, mode: this.modes.imp, func: this.ops.inx},
				{name: 'SBC', cycles : 2, cross : 0, size: 2, mode: this.modes.imm, func: this.ops.sbc},
				{name: 'NOP', cycles : 2, cross : 0, size: 1, mode: this.modes.imp, func: this.ops.nop},
				{name: 'SBC', cycles : 2, cross : 0, size: 0, mode: this.modes.err, func: this.ops.sbc},
				{name: 'CPX', cycles : 4, cross : 0, size: 3, mode: this.modes.abs, func: this.ops.cpx},
				{name: 'SBC', cycles : 4, cross : 0, size: 3, mode: this.modes.abs, func: this.ops.sbc},
				{name: 'INC', cycles : 6, cross : 0, size: 3, mode: this.modes.abs, func: this.ops.inc},
				{name: 'ISC', cycles : 6, cross : 0, size: 0, mode: this.modes.err, func: this.ops.isc},

				{name: 'BEQ', cycles : 2, cross : 1, size: 2, mode: this.modes.rel, func: this.ops.beq}, //f0
				{name: 'SBC', cycles : 5, cross : 1, size: 2, mode: this.modes.inr, func: this.ops.sbc},
				{name: 'KIL', cycles : 2, cross : 0, size: 0, mode: this.modes.err, func: this.ops.kil},
				{name: 'ISC', cycles : 8, cross : 0, size: 0, mode: this.modes.err, func: this.ops.isc},
				{name: 'NOP', cycles : 4, cross : 0, size: 2, mode: this.modes.err, func: this.ops.nop},
				{name: 'SBC', cycles : 4, cross : 0, size: 2, mode: this.modes.zex, func: this.ops.sbc},
				{name: 'INC', cycles : 6, cross : 0, size: 2, mode: this.modes.zex, func: this.ops.inc},
				{name: 'ISC', cycles : 6, cross : 0, size: 0, mode: this.modes.err, func: this.ops.isc},

				{name: 'SED', cycles : 2, cross : 0, size: 1, mode: this.modes.imp, func: this.ops.sed},
				{name: 'SBC', cycles : 4, cross : 1, size: 3, mode: this.modes.aby, func: this.ops.sbc},
				{name: 'NOP', cycles : 2, cross : 0, size: 1, mode: this.modes.err, func: this.ops.nop},
				{name: 'ISC', cycles : 7, cross : 0, size: 0, mode: this.modes.err, func: this.ops.isc},
				{name: 'NOP', cycles : 4, cross : 1, size: 3, mode: this.modes.err, func: this.ops.nop},
				{name: 'SBC', cycles : 4, cross : 1, size: 3, mode: this.modes.abx, func: this.ops.sbc},
				{name: 'INC', cycles : 7, cross : 0, size: 3, mode: this.modes.abx, func: this.ops.inc},
				{name: 'ISC', cycles : 7, cross : 0, size: 0, mode: this.modes.err, func: this.ops.isc},
			];
		},
		
		get : function(id) {
			return this.map[id];
		},
	},
	
	
};
var debug = false;
var log = function(msg) {
	//if (debug) {
		//console.log(msg);
	//}
};