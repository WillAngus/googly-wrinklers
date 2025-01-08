
var GW;
// Renderer for drawing objects managed by the inventory
class GooglyRenderer {
	constructor() {
		// Note: Image file name must be the same as object
		this.assets = ['tongue.png', 'cigar.png', 'cowboy_hat.png', 'eyes.png'];
		this.inventory 		= new GooglyInventory();
		this.particleSystem = new GooglyParticleSystem(1000);
		this.codeInjector 	= new GooglyCodeInjector();

		for (let i in Game.wrinklers) {
			Game.wrinklers[i].inventory = new GooglyInventory();
			Game.wrinklers[i].particleSystem = new GooglyParticleSystem(100);
		}
	}
	draw(ctx) {
		for (let i in Game.wrinklers) {
			let me = Game.wrinklers[i];
			for (let j in this.inventory.slot) {
				// if (this.inventory.slot[j].name !== 'Googly Eyes') this.drawObject(ctx, me, j);
				// else this.drawGooglyEyes(ctx, me, j);
			}
		}

		for (let i in Game.wrinklers) {
			let me = Game.wrinklers[i];
			for (let j in me.inventory.slot) {
				if (me.inventory.slot[j].name !== 'Googly Eyes') this.drawObject(ctx, me, j);
				else this.drawGooglyEyes(ctx, me, j);
			}
			me.particleSystem.run();
		}

		this.particleSystem.run();
	}
	drawObject(ctx, me, slot) {
		let obj = me.inventory.slot[slot];
		ctx.save();
		ctx.globalAlpha = me.close;

		this.translateToWrinkler(ctx, me);

		ctx.save();
		ctx.globalAlpha = me.close;
		ctx.translate(obj.x, obj.y);
		ctx.rotate(obj.rotation*Math.PI/180);
		if (obj.img !== '') {
			ctx.drawImage(this.getPic(obj.img), -obj.size/2 -this.getWobble(obj, me).x, -obj.size/2 -this.getWobble(obj, me).y, this.getWobble(obj, me).w, this.getWobble(obj, me).h);
		}
		ctx.restore();

		ctx.restore();

		if (obj.particle && me.close == 1) {
			// Particle(parent, sprite, x, y, w, h, velocity, direction, health, dither)
			this.particleSystem.spawnParticle(
				new GooglyParticle(this.particleSystem, this.getPic(obj.particle.img), me.x + obj.particle.x,me.y + obj.particle.y, obj.particle.size, obj.particle.size, -1, 0.5, obj.particle.size, 1)
			)
		}
	}
	drawGooglyEyes(ctx, me, slot) {
		let obj = me.inventory.slot[slot];
		ctx.save();
		ctx.globalAlpha = me.close;
		this.translateToWrinkler(ctx, me);

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
		this.translateToWrinkler(ctx, me);

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
		this.translateToWrinkler(ctx, me);

		ctx.translate(20, 26);
		ctx.rotate( (Game.T+me.id*10) * Math.PI/180 );

		ctx.fillStyle = obj.inner_color;
		ctx.beginPath();
		ctx.arc(-obj.size*0.3, 0, obj.size*0.75, 0, 2 * Math.PI);
		ctx.fill();
		ctx.restore();
	}
	translateToWrinkler(ctx, me) {
		ctx.translate(me.x,me.y);
		if (Game.prefs.fancy)
		{
			ctx.translate(0,30);
			ctx.rotate(-(me.r)*Math.PI/180);
			ctx.rotate((me.r)*Math.PI/180);
			ctx.translate(0,-30);
		}
		ctx.rotate(-(me.r)*Math.PI/180);
	}
	getPic(what) {
		if (this.Loader.assetsLoaded.indexOf(what)!=-1) return this.Loader.assets[what];
		else if (this.Loader.assetsLoading.indexOf(what)==-1) this.Loader.Load([what]);
		return this.Loader.blank;
	}
	getWobble(obj, me) {
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
	}
}
// Inventory Class
class GooglyInventory {
	constructor() {
		this.slot = [];
		this.objects = {};
	}
	updateSlot(slot, obj) {
		if (typeof obj == 'object') this.slot[slot] = obj;
		else console.log('Expecting object, but instead recieved: ' + obj);
	}
	applyCosmetic(slot, cosmetic) {
		this.updateSlot(slot, GooglyObjects[cosmetic]);
	}
	applyCosmeticToAll(slot, cosmetic, arr) {
		for (let i in arr) {
			arr[i].inventory.applyCosmetic(slot, cosmetic);
		}
	}
	removeCosmetic(slot) {
		this.updateSlot(slot, GooglyObjects['blank']);
	}
	removeCosmeticById(id) {
		let index = this.slot.indexOf(this.slot.find(({ img }) => img === id + '.png'))
		this.removeCosmetic(index);
	}
	applyDefault() {
		this.slot = [];
		this.updateSlot(0, GooglyObjects.moustache);
		this.updateSlot(1, GooglyObjects.pipe);
		this.updateSlot(2, GooglyObjects.eyes);
		this.updateSlot(3, GooglyObjects.top_hat);
	}
	getObjString(obj) {
		return obj.img.replace('.png', '');
	}
	load(slots) {
		if (slots.length !== 0) {
			for (let i in slots) {
				if (slots[i].name === 'Blank') {
					this.removeCosmetic(i);
				} else {
					this.updateSlot(i, GooglyObjects[this.getObjString(slots[i])]);
				}
			}
		} else {
			this.applyDefault();
		}
	}
}
// ParticleSystem : GooglyParticleSystem(Maximum_Particles)
class GooglyParticleSystem {
    constructor(max) {
        this.max = max;
        this.particles = [];
    }
    run() {
        // Loop through particles array
        for (let i = this.particles.length - 1; i >= 0; i--) {
            var p = this.particles[i];

            p.update();
            p.display(Game.LeftBackground);
        }
    }
    spawnParticle(p) {
        // p = new Particle(id, spr, x, y, width, height, velocity, direction, health, dither);
        if (this.particles.length < this.max) {
            this.particles.push(p);
        } else {
            // If particle limit reached increase speen in which particle dies
            this.particles[this.particles.length - 1].drain = 10;
            // Spawn new particle
            this.particles.push(p);
        }
    }
    removeParticle(p) {
        // Remove particle from array when killed
        let i = this.particles.indexOf(p);
        return this.particles.splice(i, 1);
    }
}
// Particle : Particle(parent, sprite, x, y, w, h, velocity, angle, health, dither)
class GooglyParticle  {
    constructor(parent, sprite, x, y, width, height, velocity, direction, health, dither) {
        this.parent = parent;
        // this.id = id;
        this.sprite = sprite;
        this.pos = new GooglyVector(x, y);
        this.vel = new GooglyVector(
            Math.cos(direction) * velocity + (Math.random() * (dither - (-dither)) + (-dither)),
            Math.sin(direction) * velocity + (Math.random() * (dither - (-dither)) + (-dither))
        );
        this.width = width;
        this.height = height;
        this.health = health;
        this.dither = dither;
        this.drain = 1;
        this.angle = 0;
        this.friction = 0.75;
    }
    update() {
        this.pos.add(this.vel);
        this.vel.dampen(this.friction);
        this.vel.y -= 0.75;

        this.health -= this.drain;

        if (this.health <= 0) this.destroy();
    }
    display(ctx) {
        ctx.save();

    	ctx.translate(this.pos.x, this.pos.y);
    	ctx.rotate(this.angle);
    	ctx.drawImage(this.sprite, -(this.width + this.health) / 2, -(this.height + this.health) / 2, this.width + this.health, this.height + this.health);

        ctx.restore();
    }
    destroy() {
        // Destroy particle
        this.parent.removeParticle(this);
    }
    run() {
        this.update();
        this.display();
    }
}

class GooglyVector {
    constructor(x, y) {
        this.x = x || 0;
        this.y = y || 0;
    }
    add(vec, mult) {
        let m = mult || 1;
        this.x += (vec.x * m);
        this.y += (vec.y * m);
    }
    dampen(value) {
        this.x *= value;
        this.y *= value;
    }
}

class GooglyCodeInjector {
	constructor() {
	}
	insertInbetween(arr, value, index) {
		var inserted, i, newarr = [];
		for (i = 0; i < arr.length; i++) {
			if(i == index && !inserted) {
				newarr[i] = value;
				inserted = true;
			}
			newarr.push(arr[i]);
		}
		return newarr;
	}
	mergeFunctions(function1, function2, instance1, instance2, numberOfArgumentsToPassToFunc1) {
		let mod = this;
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
}

// Launch Mod
Game.registerMod("Googly Wrinklers", {
	init:function() {
		GW = new GooglyRenderer();
		// Create new asset loader
		GW.Loader = new Loader();
		GW.Loader.domain = this.dir + '/img/';
		GW.Loader.Load(GW.assets);
		// Change wrinklers texture
		Game.WINKLERS = 1;
		// Merge wrinkler draw function with renderer draw function
		Game.DrawWrinklers = GW.codeInjector.mergeFunctions(Game.DrawWrinklers, () => { GW.draw(Game.LeftBackground) });
	},
	save:function() {
		// Store inventory slots
		return JSON.stringify(GW.inventory.slot);
	},
	load:function(str) {
		// Populate inventory from save data
		LoadScript(this.dir + '/GooglyObjects.js', 	 () => { GW.inventory.load(JSON.parse(str)) });
	}
})