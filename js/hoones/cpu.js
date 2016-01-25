var cpu = {

	cycles : 0,
	ticks : 0,
	stall : 0,

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
				this.val = val;
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
				this.val = val;
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
				this.val = val;
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
				this.val = val;
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
				this.val = val;
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
				return flags;				
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
			index : 0,

			pushByte : function(val) {
				if (this.data.length > 0xFF) {
					this.index = 0;
				}

				this.data[this.index] = val;
				this.index += 1;
				this.index &= 0xFF;
			},

			popByte : function() {
				var result = this.data[this.index];

				this.index--;
				this.index &= 0xFF;
				return result;
			},

		},

		ram : {
			data : [],

			readByte : function(addr) {
				if (addr > 0x0800) {
					asdasdasdasd;
				}

				addr -= 0x200;

				if (addr > 0x599) {
					asdasdasasd;
				}

				var result = this.data[addr];

				if (typeof result === 'undefined') {
					result = 0x0;
				}

				return result;
			},

			writeByte: function(addr, val) {
				if (addr > 0x0800) {
					asdasdasdasd;
				}

				addr -= 0x200;

				if (addr > 0x599) {
					asdasdasasd;
				}

				this.data[addr] = val;
			},
		},

		//PPU
		io : {

			readByte : function(addr) {

			},

			writeByte : function(addr, val) {

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
			bank : [[], []],

			readByte : function(addr) {
				if (addr < 0x8000 || addr >= 0x10000) {
					asdasdasda
				}

				addr -= 0x8000;
				var offset = addr % 0x4000;

				if (addr < 0x4000) {
					return this.bank[0][offset];
				} else {

					return this.bank[1][offset];
				}
			},

			writeByte : function(addr, val) {
				if (addr < 0x8000 || addr > 0x10000) {
					asdasdasda
				}

				addr -= 0x8000;
				var offset = addr % 0x4000;

				if (addr < 0x4000) {
					this.bank[0][offset] = val;
				} else {
					this.bank[1][offset] = val;
				}
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
					asdasdasdasdas;
				} else if (addr < 0x800) {
					return this.ram.readByte(addr);
				} else {
					asdasdasdasdasd;
				}
			} else if (addr < 0x4000) {
				return ppu.registers.readByte(addr);
			} else if (addr < 0x4020) {
				//TODO look over this
				return ppu.registers.readByte(addr);
			} else if (addr < 0x6000) {
				return this.erom.readByte(addr);
			} else if (addr < 0x8000) {
				return this.sram.readByte(addr);
			} else if (addr < 0x10000) {
				return this.prgrom.readByte(addr);
			} else {
				asdasdasdasd;
			}
			asdasdasasdasd;
		},

		writeByte : function(addr, val) {
			if (addr < 0x2000) {
				//Mimic mirrors 0000-07FF
				addr  = addr % 0x800;

				if (addr < 0x100) {
					this.zeropage.writeByte(addr, val);
					return;
				} else if (addr < 0x200) {
					asdasdasdasdas;
				} else if (addr < 0x800) {
					this.ram.writeByte(addr, val);
					return;
				} else {
					asdasdasdasdasd;
				}
			} else if (addr < 0x4000) {
				ppu.registers.writeByte(addr, val);
				return;
			} else if (addr < 0x4020) {
				//TODO look over this
				ppu.registers.writeByte(addr, val);
				return;
			} else if (addr < 0x6000) {
				this.erom.writeByte(addr, val);
				return;
			} else if (addr < 0x8000) {
				this.sram.writeByte(addr, val);
				return;
			} else if (addr < 0x10000) {
				this.prgrom.writeByte(addr, val);
				return;
			} else {
				asdasdasdasd;
			}
			asdasdassaasd
		},

		readWord : function(addr) {
			var low = this.readByte(addr);
			var high = this.readByte(addr +  1);
			return high << 0xFF | low;
		},

		writeWord : function(addr, val) {
			var low = val & 0x00FF;
			var high = val >> 0xFF;

			this.writeByte(addr, low);
			this.writeByte(addr + 1, high);
		}
	},
	
	interrupts : {
		val : "NONE";
		
		types : {
			none : "NONE",
			nmi  : "NMI",
			irq  : "IRQ",
		},
		
		set : function(type) {
			this.val = type;
		},
		
		get : function() {
			return val;
		},
		
		tick : function() {
			if (this.val.localeCompare(this.types.nmi) == 0) {
				this.triggerNMI();
			} else if (this.val.localeCompare(this.types.irq) == 0) {
				if (this.registers.p.i == 0) {
					this.triggerIRQ();			
				}
			}
			val = this.types.none;
		},
		
		triggerNMI : function() {
			this.mmu.pushWord(cpu.registers.pc.get());
			this.instructions.ops.php({});
			this.registers.pc.set(this.mmu.readWord(0xFFFA));
			this.registers.p.i = 1;
			this.cycles += 7;			
		},
		
		triggerIRQ : function() {
			this.mmu.pushWord(cpu.registers.pc.get());
			this.instructions.ops.php({});
			this.registers.pc.set(this.mmu.readWord(0xFFFE));
			this.registers.p.i = 1;
			this.cycles += 7;
		},
		
	},
	
	tick : function() {

		var opcode = nes.mmu.readByte(this.registers.pc.get());
		var op = this.instructions.get(opcode);
		var cycles = this.cycles;

		//Interrupt


		var addr = null;
		var isPageDifferent = false;

		// Absolute
		if (this.instructions.modes.equals(op.mode, this.instructions.modes.abs)) {
			addr = this.mmu.readWord(this.registers.pc.get() + 1 & 0xFFFF);

		// Absolute X
		} else if (this.instructions.modes.equals(op.mode, this.instructions.modes.abx)) {
			var val = this.mmu.readWord(this.registers.pc.get() + 1);
			addr = val + this.registers.x.get();
			addr &= 0xFFFF;
			isPageDifferent = this.instructions.isPageDifferent(val, addr);

		// Absolute Y
		} else if (this.instructions.modes.equals(op.mode, this.instructions.modes.aby)) {
			var val = this.mmu.readWord(this.registers.pc.get() + 1);
			addr = val + this.registers.y.get();
			addr &= 0xFFFF;
			isPageDifferent = this.instructions.isPageDifferent(val, addr);

		//Accumulator
		} else if (this.instructions.modes.equals(op.mode, this.instructions.modes.acc)) {
			addr = this.registers.a.get();

		//Immediate
		} else if (this.instructions.modes.equals(op.mode, this.instructions.modes.imm)) {
			addr = this.registers.pc.get() + 1 & 0xFFFF;

		//Implied
		} else if (this.instructions.modes.equals(op.mode, this.instructions.modes.imp)) {
			addr = 0;

		//Indirect X (Indexed Indirect)
		} else if (this.instructions.modes.equals(op.mode, this.instructions.modes.ini)) {
			addr = this.mmu.readByte(this.registers.pc.get() + 1 & 0xFFFF);
			addr += this.registers.x.get();
			addr &= 0xFF;
			addr = this.mmu.readWord(addr);

		//Indirect
		} else if (this.instructions.modes.equals(op.mode, this.instructions.modes.ind)) {
			addr = this.mmu.readByte(this.registers.pc.get() + 1 & 0xFFFF);
			addr = this.mmu.readWord(addr);
			
		//Indirect Y (Indirect Indexed)
		} else if (this.instructions.modes.equals(op.mode, this.instructions.modes.inr)) {
			var val = this.mmu.readByte(this.registers.pc.get() + 1 & 0xFFFF);
			val = this.mmu.readWord(val);
			addr += this.registers.y.get(); 
			addr &= 0xFFFF;
			isPageDifferent = this.instructions.isPageDifferent(val, addr);

		//Relative
		} else if (this.instructions.modes.equals(op.mode, this.instructions.modes.rel)) {
			var offset = this.mmu.readByte(this.registers.pc.get() + 1 & 0xFFFF);
			if (offset < 0x80) {
				addr = this.registers.pc.get() + 2 + offset;
			} else {
				addr = this.registers.pc.get() + 2 + offset - 0x100;
			}

		//Zero page
		} else if (this.instructions.modes.equals(op.mode, this.instructions.modes.zer)) {
			addr = cpu.mmu.readByte(this.registers.pc.get() + 1 & 0xFFFF);

		//Zero page X
		} else if (this.instructions.modes.equals(op.mode, this.instructions.modes.zex)) {
			addr = this.mmu.readByte(this.registers.pc.get() + 1 & 0xFFFF);
			addr += this.registers.x.get();

		//Zero page y
		} else if (this.instructions.modes.equals(op.mode, this.instructions.modes.zey)) {
			addr = this.mmu.readByte(this.registers.pc.get() + 1 & 0xFFFF);
			addr += this.registers.y.get();

		}
		
		//Increment PC
		var pc = this.registers.pc.get();
		this.registers.pc.set(pc + op.size);

		//Increment Cycles
		this.cycles += op.cycles;
		if (isPageDifferent) {
			this.cycles += op.cross;
		}
		
		//Execute operation
		var info = {
			address : addr,
			pc : this.registers.pc.get(),
			op : op,
		};
		op.func(info);
		
		//Update cpu information
		this.ticks++;
		var difference = this.cycles - cycles;
		
		return difference;
	},
	
	//operations
	instructions : {
		map : [],
		
		//Addressing Modes
		modes : {
            abs: "absolute",
            abx: "absolute x",
            aby: "absolute y",
            acc: "accumulator",
            imm: "immediate",
            imp: "implied",
            ini: "indexed indirect", //indirect X
            ind: "indirect",         //indirect
            inr: "indirect indexed", //indirect y
            rel: "relative",
            zer: "zeropage",
            zex: "zeropage x",
            zey: "zeropage y",

			equals : function(a, b) {
				var result = a.localeCompare(b);
				if (result == 0) {
					return true;
				}
				return false;
			}
		},
		
		ops : {

			adc : function(info) {
				var a = cpu.registers.a.get();
				var b = cpu.mmu.readByte(info.address);
				var c = cpu.registers.p.c;

				var sum = a + b + c;
				cpu.registers.p.v = ((((a ^ b) & 0x80==0) && ((a ^ sum) & 0x80)) !=0)? 1:0;
				cpu.registers.p.c = (sum > 255 ? 1:0);
				cpu.registers.p.n = (sum >> 7) & 1;
				cpu.registers.p.z = ((sum & 0xFF) == 0)? 1:0;

				cpu.registers.a.set(sum & 0xFF);
			},

			and : function(info) {
				var temp = cpu.registers.a & cpu.mmu.readByte(info.address);

				cpu.registers.p.n = (temp>>7)&1;
				cpu.registers.p.z = ((temp&0xFF) == 0)? 1:0;

				cpu.registers.a.set(temp);
			},

			asl : function(info) {
				if (this.modes.equals(info.opcode.mode, this.modes.acc)) {
					var temp = cpu.registers.a;

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
					this.addBranchCycles(info);
				}
			},

			//branch when carry flag is set
			bcs : function(info) {
				if (cpu.registers.p.c == 1) {
					cpu.registers.pc.set(info.address);
					this.addBranchCycles(info);
				}
			},

			//Branch if zero flag is not zero
			beq: function(info) {
				if (cpu.registers.p.z != 0) {
					cpu.registers.pc.set(info.address);
					this.addBranchCycles(info);
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
					this.addBranchCycles(info);
				}
			},

			//branch when zero flag is 0
			bne : function(info) {
				if (cpu.registers.p.z == 0) {
					cpu.registers.pc.set(info.address);
					this.addBranchCycles(info);
				}
			},

			//Branch if negative
			bpl : function(info) {
				if (cpu.registers.p.n == 0) {
					cpu.registers.pc.set(info.address);
					this.addBranchCycles(info);
				}
			},

			brk : function(info) {
				cpu.mmu.pushWord(cpu.registers.pc);
				cpu.ops.php(info);
				cpu.ops.sei(info);
				cpu.registers.pc.set(cpu.mmu.readWord(0xFFFE));
			},

			bvc: function(info) {
				if (cpu.registers.p.v == 0) {
					cpu.registers.pc.set(info.address);
					this.addBranchCycles(info);
				}
			},

			bvs: function(info) {
				if (cpu.registers.p.v == 1) {
					cpu.registers.pc.set(info.address);
					this.addBranchCycles(info);
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
				cpu.mmu.pushWord(cpu.registers.pc - 1);
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
				if (this.modes.equals(info.opcode.mode, this.modes.acc)) {
					temp = cpu.registers.a.get() && 0xFF;
					cpu.registers.p.c = temp & 1;
					temp >>= 1;
					cpu.registers.a.set(temp);
				} else {
					temp = cpu.mmu.readByte(info.address) && 0xFF;
					cpu.registers.p.c = temp & 1;
					temp >>= 1;
					cpu.registers.a.set(temp);
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
				if (this.modes.equals(info.opcode.mode, this.modes.acc)) {
					var temp = cpu.registers.a.get();
					var add = cpu.registers.p.c;

					cpu.registers.p.c = (temp>>7) & 1;
					temp = ((temp<<1)&0xFF) | add;

					cpu.registers.a.set(temp);

					cpu.registers.p.n = (temp>>7)&1;
					cpu.registers.p.z = ((temp&0xFF) == 0)? 1:0;

				} else {
					var temp = cpu.mmu.readByte(info.address);
					var add = cpu.registers.p.c;

					cpu.registers.p.c = (temp>>7) & 1;
					temp = ((temp<<1)&0xFF) | add;

					cpu.mmu.writeByte(info.addr, temp);

					cpu.registers.p.n = (temp>>7)&1;
					cpu.registers.p.z = ((temp&0xFF) == 0)? 1:0;
				}
			},

			ror: function(info) {
				if (this.modes.equals(info.opcode.mode, this.modes.acc)) {
					var temp = cpu.registers.a.get();
					var c = cpu.registers.p.c;

					cpu.registers.p.c = temp & 1;
					temp = (temp>>1) | (c << 7);

					cpu.registers.a.set(temp);

					cpu.registers.p.n = (temp>>7)&1;
					cpu.registers.p.z = ((temp&0xFF) == 0)? 1:0;
				} else {
					var temp = cpu.mmu.readByte(info.address);
					var c = cpu.registers.p.c;

					cpu.registers.p.c = temp & 1;
					temp = (temp>>1) | (c << 7);

					cpu.mmu.writeByte(info.address, temp);

					cpu.registers.p.n = (temp>>7)&1;
					cpu.registers.p.z = ((temp&0xFF) == 0)? 1:0;
				}
			},

			rti: function(info) {
				cpu.registers.p.set(cpu.mmu.stack.popByte() & 0xEF | 0x20);
				cpu.registers.pc = cpu.mmu.stack.popWord();
			},

			// RTS - Return from Subroutine
			rts : function(info) {
				cpu.registers.pc = cpu.mmu.stack.popWord() + 1;
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
				//TODO interrupt
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
				var temp = cpu.registers.sp;

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
				cpu.registers.sp = cpu.registers.x.get() & 0xFF;
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
			
		},
		
		init : function() {

			this.map = [
				{name: 'BRK', cycles : 7, cross : 0, size: 1, mode: this.modes.imp, func: this.brk},
				{name: 'ORA', cycles : 6, cross : 0, size: 2, mode: 6, func: this.ora},
				{name: 'KIL', cycles : 2, cross : 0, size: 0, mode: 5, func: this.kil},
				{name: 'SLO', cycles : 8, cross : 0, size: 0, mode: 6, func: this.slo},
				{name: 'NOP', cycles : 3, cross : 0, size: 2, mode: 10, func: this.nop},
				{name: 'ORA', cycles : 3, cross : 0, size: 2, mode: 10, func: this.ora},
				{name: 'ASL', cycles : 5, cross : 0, size: 2, mode: 10, func: this.asl},
				{name: 'SLO', cycles : 5, cross : 0, size: 0, mode: 10, func: this.slo},

				{name: 'PHP', cycles : 3, cross : 0, size: 1, mode: 5, func: this.php},
				{name: 'ORA', cycles : 2, cross : 0, size: 2, mode: 4, func: this.ora},
				{name: 'ASL', cycles : 2, cross : 0, size: 1, mode: 3, func: this.asl},
				{name: 'ANC', cycles : 2, cross : 0, size: 0, mode: 4, func: this.anc},
				{name: 'NOP', cycles : 4, cross : 0, size: 3, mode: 0, func: this.nop},
				{name: 'ORA', cycles : 4, cross : 0, size: 3, mode: 0, func: this.ora},
				{name: 'ASL', cycles : 6, cross : 0, size: 3, mode: 0, func: this.asl},
				{name: 'SLO', cycles : 6, cross : 0, size: 0, mode: 0, func: this.slo},

				{name: 'BPL', cycles : 2, cross : 1, size: 2, mode: 9, func: this.bpl},
				{name: 'ORA', cycles : 5, cross : 1, size: 2, mode: 8, func: this.ora},
				{name: 'KIL', cycles : 2, cross : 0, size: 0, mode: 5, func: this.kil},
				{name: 'SLO', cycles : 8, cross : 0, size: 0, mode: 8, func: this.slo},
				{name: 'NOP', cycles : 4, cross : 0, size: 2, mode: 11, func: this.nop},
				{name: 'ORA', cycles : 4, cross : 0, size: 2, mode: 11, func: this.ora},
				{name: 'ASL', cycles : 6, cross : 0, size: 2, mode: 11, func: this.asl},
				{name: 'SLO', cycles : 6, cross : 0, size: 0, mode: 11, func: this.slo},

				{name: 'CLC', cycles : 2, cross : 0, size: 1, mode: 5, func: this.clc},
				{name: 'ORA', cycles : 4, cross : 1, size: 3, mode: 2, func: this.ora},
				{name: 'NOP', cycles : 2, cross : 0, size: 1, mode: 5, func: this.nop},
				{name: 'SLO', cycles : 7, cross : 0, size: 0, mode: 2, func: this.slo},
				{name: 'NOP', cycles : 4, cross : 1, size: 3, mode: 1, func: this.nop},
				{name: 'ORA', cycles : 4, cross : 1, size: 3, mode: 1, func: this.ora},
				{name: 'ASL', cycles : 7, cross : 0, size: 3, mode: 1, func: this.asl},
				{name: 'SLO', cycles : 7, cross : 0, size: 0, mode: 1, func: this.slo},

				{name: 'JSR', cycles : 6, cross : 0, size: 3, mode: 0, func: this.jsr},
				{name: 'AND', cycles : 6, cross : 0, size: 2, mode: 6, func: this.and},
				{name: 'KIL', cycles : 2, cross : 0, size: 0, mode: 5, func: this.kil},
				{name: 'RLA', cycles : 8, cross : 0, size: 0, mode: 6, func: this.rla},
				{name: 'BIT', cycles : 3, cross : 0, size: 2, mode: 10, func: this.bit},
				{name: 'AND', cycles : 3, cross : 0, size: 2, mode: 10, func: this.and},
				{name: 'ROL', cycles : 5, cross : 0, size: 2, mode: 10, func: this.rol},
				{name: 'RLA', cycles : 5, cross : 0, size: 0, mode: 10, func: this.rla},

				{name: 'PLP', cycles : 4, cross : 0, size: 1, mode: 5, func: this.plp},
				{name: 'AND', cycles : 2, cross : 0, size: 2, mode: 4, func: this.and},
				{name: 'ROL', cycles : 2, cross : 0, size: 1, mode: 3, func: this.rol},
				{name: 'ANC', cycles : 2, cross : 0, size: 0, mode: 4, func: this.anc},
				{name: 'BIT', cycles : 4, cross : 0, size: 3, mode: 0, func: this.bit},
				{name: 'AND', cycles : 4, cross : 0, size: 3, mode: 0, func: this.and},
				{name: 'ROL', cycles : 6, cross : 0, size: 3, mode: 0, func: this.rol},
				{name: 'RLA', cycles : 6, cross : 0, size: 0, mode: 0, func: this.rla},

				{name: 'BMI', cycles : 2, cross : 1, size: 2, mode: 9, func: this.bmi},
				{name: 'AND', cycles : 5, cross : 1, size: 2, mode: 8, func: this.and},
				{name: 'KIL', cycles : 2, cross : 0, size: 0, mode: 5, func: this.kil},
				{name: 'RLA', cycles : 8, cross : 0, size: 0, mode: 8, func: this.rla},
				{name: 'NOP', cycles : 4, cross : 0, size: 2, mode: 11, func: this.nop},
				{name: 'ORA', cycles : 4, cross : 0, size: 2, mode: 11, func: this.ora},
				{name: 'ROL', cycles : 6, cross : 0, size: 2, mode: 11, func: this.rol},
				{name: 'RLA', cycles : 6, cross : 0, size: 0, mode: 11, func: this.rla},

				{name: 'SEC', cycles : 2, cross : 0, size: 1, mode: 5, func: this.sec},
				{name: 'AND', cycles : 4, cross : 1, size: 3, mode: 2, func: this.adc},
				{name: 'NOP', cycles : 2, cross : 0, size: 1, mode: 5, func: this.nop},
				{name: 'RLA', cycles : 7, cross : 0, size: 0, mode: 2, func: this.rla},
				{name: 'NOP', cycles : 4, cross : 1, size: 3, mode: 1, func: this.nop},
				{name: 'AND', cycles : 4, cross : 1, size: 3, mode: 1, func: this.and},
				{name: 'ROL', cycles : 7, cross : 0, size: 3, mode: 1, func: this.rol},
				{name: 'RLA', cycles : 7, cross : 0, size: 0, mode: 1, func: this.rla},

				{name: 'RTI', cycles : 6, cross : 0, size: 1, mode: 5, func: this.rti},
				{name: 'EOR', cycles : 6, cross : 0, size: 2, mode: 6, func: this.eor},
				{name: 'KIL', cycles : 2, cross : 0, size: 0, mode: 5, func: this.kil},
				{name: 'SRE', cycles : 8, cross : 0, size: 0, mode: 6, func: this.sre},
				{name: 'NOP', cycles : 3, cross : 0, size: 2, mode: 10, func: this.nop},
				{name: 'EOR', cycles : 3, cross : 0, size: 2, mode: 10, func: this.eor},
				{name: 'LSR', cycles : 5, cross : 0, size: 2, mode: 10, func: this.lsr},
				{name: 'SRE', cycles : 5, cross : 0, size: 0, mode: 10, func: this.sre},

				{name: 'PHA', cycles : 3, cross : 0, size: 1, mode: 5, func: this.pha},
				{name: 'EOR', cycles : 2, cross : 0, size: 2, mode: 4, func: this.eor},
				{name: 'LSR', cycles : 2, cross : 0, size: 1, mode: 3, func: this.lsr},
				{name: 'ALR', cycles : 2, cross : 0, size: 0, mode: 4, func: this.alr},
				{name: 'JMP', cycles : 3, cross : 0, size: 3, mode: 0, func: this.jmp},
				{name: 'EOR', cycles : 4, cross : 0, size: 3, mode: 0, func: this.eor},
				{name: 'LSR', cycles : 6, cross : 0, size: 3, mode: 0, func: this.lsr},
				{name: 'SRE', cycles : 6, cross : 0, size: 0, mode: 0, func: this.sre},

				{name: 'BVC', cycles : 2, cross : 1, size: 2, mode: 9, func: this.bvc},
				{name: 'EOR', cycles : 5, cross : 1, size: 2, mode: 8, func: this.eor},
				{name: 'KIL', cycles : 2, cross : 0, size: 0, mode: 5, func: this.kil},
				{name: 'SRE', cycles : 8, cross : 0, size: 0, mode: 8, func: this.sre},
				{name: 'NOP', cycles : 4, cross : 0, size: 2, mode: 11, func: this.nop},
				{name: 'EOR', cycles : 4, cross : 0, size: 2, mode: 11, func: this.eor},
				{name: 'LSR', cycles : 6, cross : 0, size: 2, mode: 11, func: this.lsr},
				{name: 'SRE', cycles : 6, cross : 0, size: 0, mode: 11, func: this.sre},

				{name: 'CLI', cycles : 2, cross : 0, size: 1, mode: 5, func: this.cli},
				{name: 'EOR', cycles : 4, cross : 1, size: 3, mode: 2, func: this.eor},
				{name: 'NOP', cycles : 2, cross : 0, size: 1, mode: 5, func: this.nop},
				{name: 'SRE', cycles : 7, cross : 0, size: 0, mode: 2, func: this.sre},
				{name: 'NOP', cycles : 4, cross : 1, size: 3, mode: 1, func: this.nop},
				{name: 'EOR', cycles : 4, cross : 1, size: 3, mode: 1, func: this.eor},
				{name: 'LSR', cycles : 7, cross : 0, size: 3, mode: 1, func: this.lsr},
				{name: 'SRE', cycles : 7, cross : 0, size: 0, mode: 1, func: this.sre},

				{name: 'RTS', cycles : 6, cross : 0, size: 1, mode: 5, func: this.rts},
				{name: 'ADC', cycles : 6, cross : 0, size: 2, mode: 6, func: this.adc},
				{name: 'KIL', cycles : 2, cross : 0, size: 0, mode: 5, func: this.kil},
				{name: 'RRA', cycles : 8, cross : 0, size: 0, mode: 6, func: this.rra},
				{name: 'NOP', cycles : 3, cross : 0, size: 2, mode: 10, func: this.nop},
				{name: 'ADC', cycles : 3, cross : 0, size: 2, mode: 10, func: this.adc},
				{name: 'ROR', cycles : 5, cross : 0, size: 2, mode: 10, func: this.ror},
				{name: 'RRA', cycles : 5, cross : 0, size: 0, mode: 10, func: this.rra},

				{name: 'PLA', cycles : 4, cross : 0, size: 1, mode: 5, func: this.pla},
				{name: 'ADC', cycles : 2, cross : 0, size: 2, mode: 4, func: this.adc},
				{name: 'ROR', cycles : 2, cross : 0, size: 1, mode: 3, func: this.ror},
				{name: 'ARR', cycles : 2, cross : 0, size: 0, mode: 4, func: this.arr},
				{name: 'JMP', cycles : 5, cross : 0, size: 3, mode: 7, func: this.jmp},
				{name: 'ADC', cycles : 4, cross : 0, size: 3, mode: 0, func: this.adc},
				{name: 'ROR', cycles : 6, cross : 0, size: 3, mode: 0, func: this.ror},
				{name: 'RRA', cycles : 6, cross : 0, size: 0, mode: 0, func: this.rra},

				{name: 'BVS', cycles : 2, cross : 1, size: 2, mode: 9, func: this.bvs},
				{name: 'ADC', cycles : 5, cross : 1, size: 2, mode: 8, func: this.adc},
				{name: 'KIL', cycles : 2, cross : 0, size: 0, mode: 5, func: this.kil},
				{name: 'RRA', cycles : 8, cross : 0, size: 0, mode: 8, func: this.rra},
				{name: 'NOP', cycles : 4, cross : 0, size: 2, mode: 11, func: this.nop},
				{name: 'ADC', cycles : 4, cross : 0, size: 2, mode: 11, func: this.adc},
				{name: 'ROR', cycles : 6, cross : 0, size: 2, mode: 11, func: this.ror},
				{name: 'RRA', cycles : 6, cross : 0, size: 0, mode: 11, func: this.rra},

				{name: 'SEI', cycles : 2, cross : 0, size: 1, mode: 5, func: this.sei},
				{name: 'ADC', cycles : 4, cross : 1, size: 3, mode: 2, func: this.adc},
				{name: 'NOP', cycles : 2, cross : 0, size: 1, mode: 5, func: this.nop},
				{name: 'RRA', cycles : 7, cross : 0, size: 0, mode: 2, func: this.rra},
				{name: 'NOP', cycles : 4, cross : 1, size: 3, mode: 1, func: this.nop},
				{name: 'ADC', cycles : 4, cross : 1, size: 3, mode: 1, func: this.adc},
				{name: 'ROR', cycles : 7, cross : 0, size: 3, mode: 1, func: this.ror},
				{name: 'RRA', cycles : 7, cross : 0, size: 0, mode: 1, func: this.rra},

				{name: 'NOP', cycles : 2, cross : 0, size: 2, mode: 4, func: this.nop},
				{name: 'STA', cycles : 6, cross : 0, size: 2, mode: 6, func: this.sta},
				{name: 'NOP', cycles : 2, cross : 0, size: 0, mode: 4, func: this.nop},
				{name: 'SAX', cycles : 6, cross : 0, size: 0, mode: 6, func: this.sax},
				{name: 'STY', cycles : 3, cross : 0, size: 2, mode: 10, func: this.sty},
				{name: 'STA', cycles : 3, cross : 0, size: 2, mode: 10, func: this.sta},
				{name: 'STX', cycles : 3, cross : 0, size: 2, mode: 10, func: this.stx},
				{name: 'SAX', cycles : 3, cross : 0, size: 0, mode: 10, func: this.sax},

				{name: 'DEY', cycles : 2, cross : 0, size: 1, mode: 5, func: this.dey},
				{name: 'NOP', cycles : 2, cross : 0, size: 0, mode: 4, func: this.nop},
				{name: 'TXA', cycles : 2, cross : 0, size: 1, mode: 5, func: this.txa},
				{name: 'XAA', cycles : 2, cross : 0, size: 0, mode: 4, func: this.xaa},
				{name: 'STY', cycles : 4, cross : 0, size: 3, mode: 0, func: this.sty},
				{name: 'STA', cycles : 4, cross : 0, size: 3, mode: 0, func: this.sta},
				{name: 'STX', cycles : 4, cross : 0, size: 3, mode: 0, func: this.stx},
				{name: 'SAX', cycles : 4, cross : 0, size: 0, mode: 0, func: this.sax},

				{name: 'BCC', cycles : 2, cross : 1, size: 2, mode: 9, func: this.bcc},
				{name: 'STA', cycles : 6, cross : 0, size: 2, mode: 8, func: this.sta},
				{name: 'KIL', cycles : 2, cross : 0, size: 0, mode: 5, func: this.kil},
				{name: 'AHX', cycles : 6, cross : 0, size: 0, mode: 8, func: this.ahx},
				{name: 'STY', cycles : 4, cross : 0, size: 2, mode: 11, func: this.sty},
				{name: 'STA', cycles : 4, cross : 0, size: 2, mode: 11, func: this.sta},
				{name: 'STX', cycles : 4, cross : 0, size: 2, mode: 12, func: this.stx},
				{name: 'SAX', cycles : 4, cross : 0, size: 0, mode: 12, func: this.sax},

				{name: 'TYA', cycles : 2, cross : 0, size: 1, mode: 5, func: this.tya},
				{name: 'STA', cycles : 5, cross : 0, size: 3, mode: 2, func: this.sta},
				{name: 'TXS', cycles : 2, cross : 0, size: 1, mode: 5, func: this.txs},
				{name: 'TAS', cycles : 5, cross : 0, size: 0, mode: 2, func: this.tas},
				{name: 'SHY', cycles : 5, cross : 0, size: 0, mode: 1, func: this.shy},
				{name: 'STA', cycles : 5, cross : 0, size: 3, mode: 1, func: this.sta},
				{name: 'SHX', cycles : 5, cross : 0, size: 0, mode: 2, func: this.shx},
				{name: 'AHX', cycles : 5, cross : 0, size: 0, mode: 2, func: this.ahx},

				{name: 'LDY', cycles : 2, cross : 0, size: 2, mode: 4, func: this.ldy},
				{name: 'LDA', cycles : 6, cross : 0, size: 2, mode: 6, func: this.lda},
				{name: 'LDX', cycles : 2, cross : 0, size: 2, mode: 4, func: this.ldx},
				{name: 'LAX', cycles : 6, cross : 0, size: 0, mode: 6, func: this.lax},
				{name: 'LDY', cycles : 3, cross : 0, size: 2, mode: 10, func: this.ldy},
				{name: 'LDA', cycles : 3, cross : 0, size: 2, mode: 10, func: this.lda},
				{name: 'LDX', cycles : 3, cross : 0, arams: 2, mode: 10, func: this.ldx},
				{name: 'LAX', cycles : 3, cross : 0, size: 0, mode: 10, func: this.lax},

				{name: 'TAY', cycles : 2, cross : 0, size: 1, mode: 5, func: this.tay},
				{name: 'LDA', cycles : 2, cross : 0, size: 2, mode: 4, func: this.lda},
				{name: 'TAX', cycles : 2, cross : 0, size: 1, mode: 5, func: this.tax},
				{name: 'LAX', cycles : 2, cross : 0, size: 0, mode: 4, func: this.lax},
				{name: 'LDY', cycles : 4, cross : 0, size: 3, mode: 0, func: this.ldy},
				{name: 'LDA', cycles : 4, cross : 0, size: 3, mode: 0, func: this.lda},
				{name: 'LDX', cycles : 4, cross : 0, size: 3, mode: 0, func: this.ldx},
				{name: 'LAX', cycles : 4, cross : 0, size: 0, mode: 0, func: this.lax},

				{name: 'BCS', cycles : 2, cross : 1, size: 2, mode: 9, func: this.bcs},
				{name: 'LDA', cycles : 5, cross : 1, size: 2, mode: 8, func: this.lda},
				{name: 'KIL', cycles : 2, cross : 0, size: 2, mode: 5, func: this.kil},
				{name: 'LAX', cycles : 5, cross : 1, size: 0, mode: 8, func: this.lax},
				{name: 'LDY', cycles : 4, cross : 0, size: 2, mode: 11, func: this.ldy},
				{name: 'LDA', cycles : 4, cross : 0, size: 2, mode: 11, func: this.lda},
				{name: 'LDX', cycles : 4, cross : 0, size: 2, mode: 12, func: this.ldx},
				{name: 'LAX', cycles : 4, cross : 0, size: 0, mode: 12, func: this.lax},

				{name: 'CLV', cycles : 2, cross : 0, size: 1, mode: 5, func: this.clv},
				{name: 'LDA', cycles : 4, cross : 1, size: 3, mode: 2, func: this.lda},
				{name: 'TSX', cycles : 2, cross : 0, size: 1, mode: 5, func: this.tsx},
				{name: 'LAS', cycles : 4, cross : 1, size: 0, mode: 2, func: this.las},
				{name: 'LDY', cycles : 4, cross : 1, size: 3, mode: 1, func: this.ldy},
				{name: 'LDA', cycles : 4, cross : 1, size: 3, mode: 1, func: this.lda},
				{name: 'LDX', cycles : 4, cross : 1, size: 3, mode: 2, func: this.ldx},
				{name: 'LAX', cycles : 4, cross : 1, size: 0, mode: 2, func: this.lax},

				{name: 'CPY', cycles : 2, cross : 0, size: 2, mode: 4, func: this.cpy},
				{name: 'CMP', cycles : 6, cross : 0, size: 2, mode: 6, func: this.cmp},
				{name: 'NOP', cycles : 2, cross : 0, size: 0, mode: 4, func: this.nop},
				{name: 'DCP', cycles : 8, cross : 0, size: 0, mode: 6, func: this.dcp},
				{name: 'CPY', cycles : 3, cross : 0, size: 2, mode: 10, func: this.cpy},
				{name: 'CMP', cycles : 3, cross : 0, size: 2, mode: 10, func: this.cmp},
				{name: 'DEC', cycles : 5, cross : 0, size: 2, mode: 10, func: this.dec},
				{name: 'DCP', cycles : 5, cross : 0, size: 0, mode: 10, func: this.dcp},

				{name: 'INY', cycles : 2, cross : 0, size: 1, mode: 5, func: this.iny},
				{name: 'CMP', cycles : 2, cross : 0, size: 2, mode: 4, func: this.cmp},
				{name: 'DEX', cycles : 2, cross : 0, size: 1, mode: 5, func: this.dex},
				{name: 'AXS', cycles : 2, cross : 0, size: 0, mode: 4, func: this.axs},
				{name: 'CPY', cycles : 4, cross : 0, size: 3, mode: 0, func: this.cpy},
				{name: 'CMP', cycles : 4, cross : 0, size: 3, mode: 0, func: this.cmp},
				{name: 'DEC', cycles : 6, cross : 0, size: 3, mode: 0, func: this.dec},
				{name: 'DCP', cycles : 6, cross : 0, size: 0, mode: 0, func: this.dcp},

				{name: 'BNE', cycles : 2, cross : 1, size: 2, mode: 9, func: this.bne},
				{name: 'CMP', cycles : 5, cross : 1, size: 2, mode: 8, func: this.cmp},
				{name: 'KIL', cycles : 2, cross : 0, size: 0, mode: 5, func: this.kil},
				{name: 'DCP', cycles : 8, cross : 0, size: 0, mode: 8, func: this.dcp},
				{name: 'NOP', cycles : 4, cross : 0, size: 2, mode: 11, func: this.nop},
				{name: 'CMP', cycles : 4, cross : 0, size: 2, mode: 11, func: this.cmp},
				{name: 'DEC', cycles : 6, cross : 0, size: 2, mode: 11, func: this.dec},
				{name: 'DCP', cycles : 6, cross : 0, size: 0, mode: 11, func: this.dcp},

				{name: 'CLD', cycles : 2, cross : 0, size: 1, mode: 5, func: this.cld},
				{name: 'CMP', cycles : 4, cross : 1, size: 3, mode: 2, func: this.cmp},
				{name: 'NOP', cycles : 2, cross : 0, size: 1, mode: 5, func: this.nop},
				{name: 'DCP', cycles : 7, cross : 0, size: 0, mode: 2, func: this.dcp},
				{name: 'NOP', cycles : 4, cross : 0, size: 3, mode: 1, func: this.nop},
				{name: 'CMP', cycles : 4, cross : 1, size: 3, mode: 1, func: this.cmp},
				{name: 'DEC', cycles : 7, cross : 1, size: 3, mode: 1, func: this.dec},
				{name: 'DCP', cycles : 7, cross : 0, size: 0, mode: 1, func: this.dcp},

				{name: 'CPX', cycles : 2, cross : 0, size: 2, mode: 4, func: this.cpx},
				{name: 'SBC', cycles : 6, cross : 0, size: 2, mode: 6, func: this.sbc},
				{name: 'NOP', cycles : 2, cross : 0, size: 0, mode: 4, func: this.nop},
				{name: 'ISC', cycles : 8, cross : 0, size: 0, mode: 6, func: this.isc},
				{name: 'CPX', cycles : 3, cross : 0, size: 2, mode: 10, func: this.cpx},
				{name: 'SBC', cycles : 3, cross : 0, size: 2, mode: 10, func: this.sbc},
				{name: 'INC', cycles : 5, cross : 0, size: 2, mode: 10, func: this.inc},
				{name: 'ISC', cycles : 5, cross : 0, size: 0, mode: 10, func: this.isc},

				{name: 'INX', cycles : 2, cross : 0, size: 1, mode: 5, func: this.inx},
				{name: 'SBC', cycles : 2, cross : 0, size: 2, mode: 4, func: this.sbc},
				{name: 'NOP', cycles : 2, cross : 0, size: 1, mode: 5, func: this.kil},
				{name: 'SBC', cycles : 2, cross : 0, size: 0, mode: 4, func: this.isc},
				{name: 'CPX', cycles : 4, cross : 0, size: 3, mode: 0, func: this.nop},
				{name: 'SBC', cycles : 4, cross : 0, size: 3, mode: 0, func: this.sbc},
				{name: 'INC', cycles : 6, cross : 0, size: 3, mode: 0, func: this.inc},
				{name: 'ISC', cycles : 6, cross : 0, size: 0, mode: 0, func: this.isc},

				{name: 'BEQ', cycles : 2, cross : 1, size: 2, mode: 9, func: this.beq},
				{name: 'SBC', cycles : 5, cross : 1, size: 2, mode: 8, func: this.sbc},
				{name: 'KIL', cycles : 2, cross : 0, size: 0, mode: 5, func: this.kil},
				{name: 'ISC', cycles : 8, cross : 0, size: 0, mode: 8, func: this.isc},
				{name: 'NOP', cycles : 4, cross : 0, size: 2, mode: 11, func: this.nop},
				{name: 'SBC', cycles : 4, cross : 0, size: 2, mode: 11, func: this.sbc},
				{name: 'INC', cycles : 6, cross : 0, size: 2, mode: 11, func: this.inc},
				{name: 'ISC', cycles : 6, cross : 0, size: 0, mode: 11, func: this.isc},

				{name: 'SED', cycles : 2, cross : 0, size: 1, mode: 5, func: this.sed},
				{name: 'SBC', cycles : 4, cross : 1, size: 3, mode: 2, func: this.sbc},
				{name: 'NOP', cycles : 2, cross : 0, size: 1, mode: 5, func: this.nop},
				{name: 'ISC', cycles : 7, cross : 0, size: 0, mode: 2, func: this.isc},
				{name: 'NOP', cycles : 4, cross : 1, size: 3, mode: 1, func: this.nop},
				{name: 'SBC', cycles : 4, cross : 1, size: 3, mode: 1, func: this.sbc},
				{name: 'INC', cycles : 7, cross : 0, size: 3, mode: 1, func: this.inc},
				{name: 'ISC', cycles : 7, cross : 0, size: 0, mode: 1, func: this.isc},
			];
		},
		
		get : function(id) {
			
		},
	},
	
};