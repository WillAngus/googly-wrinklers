Game.registerMod("Googly Wrinklers", {
	// Note: Image file name must be the same as object
	assets: ['tongue.png', 'cigar.png', 'cowboy_hat.png', 'eyes.png'],
	slot: [],
	objects: {},
	init:function() {
		// Define context
		let M = this;
		let ctx = Game.LeftBackground;
		// Change wrinklers texture
		Game.WINKLERS = 1;
		// Merge wrinkler draw function with mod draw function
		Game.DrawWrinklers = this.mergeFunctions(M, Game.DrawWrinklers, () => { this.draw(ctx) });
	},
	save:function() {
		// Save slots in JSON format
		return JSON.stringify(this.slot);
	},
	load:function(str) {
		// Create new asset loader
		this.Loader = new Loader();
		this.Loader.domain = `${this.dir}/img/`;
		this.Loader.Load(this.assets);
		// Load script containing object config
		LoadScript(`${this.dir}/cfg.js`, () => {
			// Once loaded assign to mod objects
			Object.assign(Googly.objects, cfg);
			// Load save data
			let slots = JSON.parse(str);
			if (slots.length !== 0) {
				for (let i in slots) {
					if (slots[i].name === 'Blank') {
						this.removeCosmetic(i);
					} else {
						this.updateSlot(i, this.objects[this.getObjString(slots[i])]);
					}
				}
			} else {
				this.applyDefault();
			}
		});
	},
	updateSlot:function(slot, obj) {
		if (typeof obj == 'object') this.slot[slot] = obj;
		else console.log('Expecting object, but instead recieved: ' + obj);
	},
	applyCosmetic:function(slot, cosmetic) {
		this.updateSlot(slot, this.objects[cosmetic]);
	},
	removeCosmetic:function(slot) {
		this.updateSlot(slot, this.objects['blank']);
	},
	removeCosmeticById:function(id) {
		let index = this.slot.indexOf(this.slot.find(({ img }) => img === id + '.png'))
		this.removeCosmetic(index);
	},
	applyDefault:function() {
		this.slot = [];
		this.updateSlot(0, this.objects.moustache);
		this.updateSlot(1, this.objects.pipe);
		this.updateSlot(2, this.objects.eyes);
		this.updateSlot(3, this.objects.top_hat);
	},
	getObjString:function(obj) {
		return obj.img.replace('.png', '');
	},
	getPic:function(what) {
		if (this.Loader.assetsLoaded.indexOf(what)!=-1) return this.Loader.assets[what];
		else if (this.Loader.assetsLoading.indexOf(what)==-1) this.Loader.Load([what]);
		return this.Loader.blank;
	},
	getWobble:function(obj, me) {
		let a, b;
		if (Game.mods['Smooth Render']) {
			a = obj.wobble_x*Math.sin( (Game.T*Game.fpsCoeff) *0.2+me.id*3);
			b = obj.wobble_y*Math.sin( (Game.T*Game.fpsCoeff) *0.2-2+me.id*3);
		} else {
			a = obj.wobble_x*Math.sin(Game.T*0.2+me.id*3);
			b = obj.wobble_y*Math.sin(Game.T*0.2-2+me.id*3);
		}
		let wob = {
			x: a,
			y: b,
			w: obj.size+a,
			h: obj.size+b
		};
		return wob;
	},
	draw:function(ctx) {
		for (let i in Game.wrinklers) {
			let me = Game.wrinklers[i];
			for (let j in this.slot) {
				if (this.slot[j].name !== 'Googly Eyes') this.drawObject(ctx, me, j);
				else this.drawGooglyEyes(ctx, me, j);
			}
		}
	},
	drawObject:function(ctx, me, slot) {
		let obj = this.slot[slot];
		ctx.save();
		ctx.globalAlpha = me.close;

		ctx.translate(me.x,me.y);
		if (Game.prefs.fancy)
		{
			ctx.translate(0,30);
			ctx.rotate(-(me.r)*Math.PI/180);
			ctx.rotate((me.r)*Math.PI/180);
			ctx.translate(0,-30);
		}
		ctx.rotate(-(me.r)*Math.PI/180);

		ctx.save();
		ctx.globalAlpha = me.close;
		ctx.translate(obj.x, obj.y);
		ctx.rotate(obj.rotation*Math.PI/180);
		if (obj.img !== '') {
			ctx.drawImage(this.getPic(obj.img), -obj.size/2 -this.getWobble(obj, me).x, -obj.size/2 -this.getWobble(obj, me).y, this.getWobble(obj, me).w, this.getWobble(obj, me).h);
		}
		ctx.restore();

		ctx.restore();

		if (obj.particle && Game.T % Game.fps == 0) {
			// Game.particleAdd(obj.particle.size, obj.particle.size, Math.random()*4-2,Math.random()*-2-2,1,1,2,obj.particle.img);
			Game.particleAdd(me.x, me.y, 0, -2, 0.5, obj.particle.size, 0, Googly.getPic(obj.particle.img).src);
		}

	},
	drawGooglyEyes:function(ctx, me, slot) {
		let obj = this.slot[slot];
		ctx.save();
		ctx.globalAlpha = me.close;
		ctx.translate(me.x,me.y);
		if (Game.prefs.fancy)
		{
			ctx.translate(0,30);
			ctx.rotate(-(me.r)*Math.PI/180);
			ctx.rotate((me.r)*Math.PI/180);
			ctx.translate(0,-30);
		}
		ctx.rotate(-(me.r)*Math.PI/180);

		// outline
		ctx.strokeStyle = obj.outline_color;
		ctx.lineWidth = 3;
		ctx.beginPath();
		ctx.arc(-20, 26, obj.size, 0, 2 * Math.PI);
		ctx.stroke();
		ctx.beginPath();
		ctx.arc( 20, 26, obj.size, 0, 2 * Math.PI);
		ctx.stroke();

		// outer eye
		ctx.fillStyle = obj.outer_color;
		ctx.beginPath();
		ctx.arc(-20, 26, obj.size, 0, 2 * Math.PI);
		ctx.arc( 20, 26, obj.size, 0, 2 * Math.PI);
		ctx.fill();
		ctx.restore();

		// inner eye
		ctx.save();
		ctx.globalAlpha = me.close;
		ctx.translate(me.x, me.y);
		if (Game.prefs.fancy)
		{
			ctx.translate(0, 30);
			ctx.rotate(-(me.r)*Math.PI/180);
			ctx.rotate( (me.r)*Math.PI/180);
			ctx.translate(0,-30);
		}
		ctx.rotate(-(me.r)*Math.PI/180);

		ctx.translate(-20, 26);
		ctx.rotate( (Game.T+me.id*10) * Math.PI/180 );

		ctx.fillStyle = obj.inner_color;
		ctx.beginPath();
		ctx.arc( obj.size*0.3, 0, obj.size*0.75, 0, 2 * Math.PI);
		ctx.fill();
		ctx.restore();

		// inner eye
		ctx.save();
		ctx.globalAlpha = me.close;
		ctx.translate(me.x, me.y);
		if (Game.prefs.fancy)
		{
			ctx.translate(0, 30);
			ctx.rotate(-(me.r)*Math.PI/180);
			ctx.rotate( (me.r)*Math.PI/180);
			ctx.translate(0,-30);
		}
		ctx.rotate(-(me.r)*Math.PI/180);

		ctx.translate(20, 26);
		ctx.rotate( (Game.T+me.id*10) * Math.PI/180 );

		ctx.fillStyle = obj.inner_color;
		ctx.beginPath();
		ctx.arc(-obj.size*0.3, 0, obj.size*0.75, 0, 2 * Math.PI);
		ctx.fill();
		ctx.restore();
	},
	insertInbetween:function(arr, value, index) {
		var inserted, i, newarr = [];
		for (i = 0; i < arr.length; i++) {
			if(i == index && !inserted) {
				newarr[i] = value;
				inserted = true;
			}
			newarr.push(arr[i]);
		}
		return newarr;
	},
	mergeFunctions:function(mod, function1, function2, instance1, instance2, numberOfArgumentsToPassToFunc1) {
		return function() {
			var _arguments  = Array.prototype.slice.apply(arguments);
			var _arguments1 = _arguments.slice(0, numberOfArgumentsToPassToFunc1);
			var _arguments2 = _arguments.slice(numberOfArgumentsToPassToFunc1);
			var that = this;
			(function(function1, function2) {
				if (typeof function1 == "function") {
					if (typeof instance1 != "undefined") {
						function1.apply(instance1, _arguments1);
					}
					else if (that == window) {
						function1.apply(function1, _arguments1);
					}
					else {
						var compare = mod.mergeFunctions(function(){}, function(){});
						if (that.toString() == compare.toString()) {
							function1.apply(function1, _arguments1);
						}
						else {
							function1.apply(that, _arguments1);
						}
					}
				}
				if (typeof function2 == "function") {
					if (typeof instance2 != "undefined") {
						function2.apply(instance2, _arguments2);
					}
					else if (that == window) {
						function2.apply(function2, _arguments2);
					}
					else {
						var compare = mod.mergeFunctions(function(){}, function(){});
						if (that.toString() == compare.toString()) {
							function2.apply(function2, _arguments2);
						}
						else {
							function2.apply(that, _arguments2);
						}
					}
				}
			})(function1, function2);
		}
	}
});
// Global variable to make referencing easier
var Googly = Game.mods['Googly Wrinklers'];