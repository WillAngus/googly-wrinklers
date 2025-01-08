
var GW;
var GooglyAssets = ['icon_pipe.png', 'icon_tongue.png', 'icon_moustache.png', 'icon_monocle.png', 'icon_cowboy_hat.png', 'icon_top_hat.png', 'tongue.png', 'cigar.png', 'cowboy_hat.png', 'eyes.png'];
/*=====================================================================================
// RENDERER
=======================================================================================*/
class GooglyRenderer {
	constructor() {
		for (let i in Game.wrinklers) {
			Game.wrinklers[i].inventory 	 = new GooglyInventory();
			Game.wrinklers[i].particleSystem = new GooglyParticleSystem(500);
			Game.wrinklers[i].img			 = 'winkler.png';
			Game.wrinklers[i].skin			 = 'winkler.png';
		}
	}
	drawWrinklers(ctx, wrinklers) {
		var selected = 0;
		for (var i in wrinklers) {
			let me = wrinklers[i];
			if (me.phase > 0) {
				ctx.globalAlpha = me.close;
				ctx.save();
				ctx.translate(me.x, me.y);
				var sw = 100 + 2 * Math.sin(Game.T*0.2 + i*3);
				var sh = 200 + 5 * Math.sin(Game.T*0.2 - 2 + i*3);
				if (Game.prefs.fancy)
				{
					ctx.translate(0, 30);
					ctx.rotate(-(me.r) * Math.PI/180);
					ctx.drawImage(Pic('wrinklerShadow.png'), -sw/2, -10, sw, sh);
					ctx.rotate( (me.r) * Math.PI/180);
					ctx.translate(0,-30);
				}
				ctx.rotate(-(me.r) * Math.PI/180);
				// Change image if Shiny Wrinkler or seasonal wrinkler
				if (me.type == 1) {
					me.img = Game.WINKLERS ? 'shinyWinkler.png' : 'shinyWrinkler.png';
				} else if (Game.season == 'christmas') {
					me.img = Game.WINKLERS ? 'winterWinkler.png' : 'winterWrinkler.png';
				} else {
					me.img = me.skin;
				}
				// Draw Wrinkler, cosmetics and particles
				ctx.drawImage(Pic(me.img), -sw/2, -10, sw, sh);
				this.drawCosmetics(ctx, me);
				me.particleSystem.run(ctx);
				// Sparkle for Shiny Wrinkler
				if (me.type == 1 && Math.random() < 0.3 && Game.prefs.particles)
				{
					ctx.globalAlpha = Math.random() * 0.65 + 0.1;
					var s = Math.random() * 30 + 5;
					ctx.globalCompositeOperation = 'lighter';
					ctx.drawImage(Pic('glint.png'), -s/2 + Math.random() * 50-25,- s/2 + Math.random() * 200, s, s);
				}
				ctx.restore();
				
				if (Game.prefs.particles && me.phase==2 && Math.random()<0.03)
				{
					Game.particleAdd(me.x,me.y,Math.random()*4-2,Math.random()*-2-2,Math.random()*0.5+0.5,1,2);
				}
				if (me.selected) selected=me;
			}
		}
		if (selected && Game.Has('Eye of the wrinkler')) {
			this.drawEyeOfWrinkler(ctx, selected);
		}
	}
	drawCosmetics(ctx, me) {
		for (let j in me.inventory.slot) {
			if (me.inventory.slot[j].name !== 'Googly Eyes') this.drawObject(ctx, me, j);
			else this.drawGooglyEyes(ctx, me, j);
		}
	}
	drawObject(ctx, me, slot) {
		let obj = me.inventory.slot[slot];
		ctx.save();
		ctx.globalAlpha = me.close;

		// this.translateToWrinkler(ctx, me);

		ctx.save();
		ctx.globalAlpha = me.close;
		ctx.translate(obj.x, obj.y);
		ctx.rotate(obj.rotation*Math.PI/180);
		if (obj.img !== '') {
			ctx.drawImage(this.getPic(obj.img), -obj.size/2 -this.getWobble(obj, me).x, -obj.size/2 -this.getWobble(obj, me).y, this.getWobble(obj, me).w, this.getWobble(obj, me).h);
		}
		ctx.restore();

		ctx.restore();
		// Spawn particle if object has particle data
		if (obj.particle && me.close > 0) {
			// Quick and dirty function declaration to use with the Smooth Render mod
			function createParticle() {
				// Get particle data
				let particle = obj.particle;
				// Set velocity direction to counter wrinkler rotation
				particle.direction = (me.r - 90) * Math.PI/180;
				// Create new particle in selected wrinkler
				me.particleSystem.spawnParticle(new GooglyParticle(me.particleSystem, GW.getPic(obj.particle.img), obj.particle));
			}
			// Run at set rate with random offset 
			if (Game.mods['Smooth Render']) {
				if (Game.T % Math.round(obj.particle.rate * Game.fpsCoeffInv) + Math.floor(Math.random() * (0 - 2) + 2) == 0) createParticle();
			} else {
				if (Game.T % obj.particle.rate + Math.floor(Math.random() * (0 - 2) + 2) == 0) createParticle();
			}
		}
	}
	drawGooglyEyes(ctx, me, slot) {
		let obj = me.inventory.slot[slot];
		ctx.save();
		ctx.scale(obj.scale, obj.scale);

		ctx.save();
		ctx.globalAlpha = me.close;
		// this.translateToWrinkler(ctx, me);

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
		// this.translateToWrinkler(ctx, me);

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
		// this.translateToWrinkler(ctx, me);

		ctx.translate(20, 26);
		ctx.rotate( (Game.T+me.id*10) * Math.PI/180 );

		ctx.fillStyle = obj.inner_color;
		ctx.beginPath();
		ctx.arc(-obj.size*0.3, 0, obj.size*0.75, 0, 2 * Math.PI);
		ctx.fill();
		ctx.restore();

		ctx.restore();
	}
	drawEyeOfWrinkler(ctx, selected) {
		var x=Game.cookieOriginX;
		var y=Game.cookieOriginY;
		ctx.font='14px Merriweather';
		ctx.textAlign='center';
		var text=loc("Swallowed:");
		var width=Math.ceil(Math.max(ctx.measureText(text).width,ctx.measureText(Beautify(selected.sucked)).width));
		ctx.fillStyle='#000';
		ctx.globalAlpha=0.65;
		var xO=x-width/2-16;
		var yO=y-4;
		var dist=Math.floor(Math.sqrt((selected.x-xO)*(selected.x-xO)+(selected.y-yO)*(selected.y-yO)));
		var angle=-Math.atan2(yO-selected.y,xO-selected.x)+Math.PI/2;
		ctx.strokeStyle='#fff';
		ctx.lineWidth=1;
		for (var i=0;i<Math.floor(dist/12);i++)
		{
			var xC=selected.x+Math.sin(angle)*i*12;
			var yC=selected.y+Math.cos(angle)*i*12;
			ctx.beginPath();
			ctx.arc(xC,yC,4+(Game.prefs.fancy?2*Math.pow(Math.sin(-Game.T*0.2+i*0.3),4):0),0,2*Math.PI,false);
			ctx.fill();
			ctx.stroke();
		}
		ctx.fillRect(x-width/2-8-10,y-23,width+16+20,38);
		ctx.strokeStyle='#fff';
		ctx.lineWidth=1;
		ctx.strokeRect(x-width/2-8-10+1.5,y-23+1.5,width+16+20-3,38-3);
		ctx.globalAlpha=1;
		ctx.fillStyle='#fff';
		ctx.fillText(text,x+14,y-8);
		ctx.fillText(Beautify(selected.sucked),x+10,y+8);
		var s=54+2*Math.sin(Game.T*0.4);
		ctx.drawImage(Pic('icons.png'),27*48,26*48,48,48,x-width/2-16-s/2,y-4-s/2,s,s);
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
		if (GW.loader.assetsLoaded.indexOf(what)!=-1) return GW.loader.assets[what];
		else if (GW.loader.assetsLoading.indexOf(what)==-1) GW.loader.Load([what]);
		return GW.loader.blank;
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
/*=====================================================================================
// MENU: Wrinkler customization (pass 'this' from GooglyRenderer when declaring)
=======================================================================================*/
class GooglyMenu extends GooglyRenderer {
	constructor(renderer) {
		super();
		this.slotIndex = [0, 0, 0, 0, 0];
		this.wrinkler = {
			id: 16, 
			x: 25, 
			y: 16, 
			r: 0, 
			close: 1,
			inventory: new GooglyInventory(),
			particleSystem: new GooglyParticleSystem(100),
			img: 'winkler.png',
			skin: 'winkler.png'
		};
	}
	drawMenu(imgArr) {
		if (!l('wrinklerPreview')) return false;
		let ctx = l('wrinklerPreview').getContext('2d');
		ctx.clearRect(0, 0, 100, 220);
		// ctx.drawImage(this.getPic('icon_winkler.png'), 0, 0, 100, 220);

		this.drawWrinklers(ctx, this.wrinkler);

		// this.drawObject(ctx, this.wrinkler, 0);
		ctx.save();
		this.translateToWrinkler(ctx, this.wrinkler);
		this.drawCosmetics(ctx, this.wrinkler, 2)
		ctx.restore();
		// this.drawParticles(ctx, [this.wrinkler])

		for (let i in imgArr) {
			// ctx.drawImage(this.r.getPic(imgArr[i]), 0, 0, 100, 220);
		}
	}
	show() {
		Game.Prompt(
			'<id CustomizeYou><h3>'+loc("Customize Wrinklers")+'</h3>'+
			'<div class="block" style="text-align:center;font-size:11px;">'+loc("Spawn from the Grandmapocalypse. Shape them as you desire.")+'</div>'+
			'<div class="block" style="position:relative;">'+
			'<a style="position:absolute;left:4px;top:2px;font-size:10px;padding:2px 6px;" class="option" onclick="Game.YouCustomizer.import();PlaySound(\'snd/tick.mp3\');">'+loc("Import")+'</a>'+
			'<a style="position:absolute;right:0px;top:2px;font-size:10px;padding:2px 6px;" class="option" onclick="Game.YouCustomizer.export();PlaySound(\'snd/tick.mp3\');">'+loc("Export")+'</a>'+
			'<div style="position:relative;width:64px;height:200px;margin:0px auto 8px auto;">'+
			'<canvas style="transform:scale(1);position:absolute;left: -16px; top: -10px;" width=100 height=220 id="wrinklerPreview"></canvas>'+
			'</div>'+
			'<div style="text-align:center;clear:both;font-weight:bold;font-size:11px;" class="titleFont">'+
			'<br>'+
			this.makeSelector(0)+
			this.makeSelector(1)+
			this.makeSelector(2)+
			this.makeSelector(3)+
			this.makeSelector(4)+
			'</div>'+'',
			[loc("Done")]
		);
		this.drawMenu(this.getSelectedIcons());
	}
	makeSelector(value) {
		let text = this.getObjSlots(value)[this.slotIndex[value]].name;
		return '<div style="clear:both;width:100%;margin-bottom:6px;"><a '+Game.clickStr+'="GW.menu.incrementSelector('+value+', -1)" id=" " class="framed smallFancyButton" style="float:left;margin-top:-4px;padding:2px 4px;">&lt;</a><div id="slot'+value+'" style="display:inline;">'+text+'</div><a '+Game.clickStr+'="GW.menu.incrementSelector('+value+', 1)" id=" " class="framed smallFancyButton" style="float:right;margin-top:-4px;padding:2px 4px;">&gt;</a></div>';
	}
	incrementSelector(value, amount) {
		let arr = this.getObjSlots(value);
		let index = this.slotIndex[value];
		index += amount;

		if (index < 0) index = arr.length-1;
		if (index > arr.length-1) index = 0; 

		l('slot'+value).innerHTML = arr[ index ].name;
		this.slotIndex[value] = index;
		this.drawMenu(this.getSelectedIcons());
	}
	getObjSlots(value) {
		return Object.values(GooglyObjects).filter(obj => { return obj.slot === value });
	}
	getSelectedSlots() {
		let slots = [];
		for (let i = 0; i < this.slotIndex.length; i++) {
			slots[i] = this.getObjSlots(i)[this.slotIndex[i]]
		}
		return slots;
	}
	getSelectedIcons() {
		let icons = [];
		for (let i = 0; i < this.slotIndex.length; i++) {
			icons[i] = 'icon_' + this.getSelectedSlots()[i].img;
		}
		return icons;
	}
	getAllSlots() {
		let slots = [];
		for (let i = 0; i < this.slotIndex.length; i++) {
			slots[i] = this.getObjSlots(i)
		}
		return slots;
	}
}
/*=====================================================================================
// PARTICLE SYSTEM: Particle Manager and Particle class
=======================================================================================*/
class GooglyParticleSystem {
    constructor(max) {
        this.max = max;
        this.particles = [];
    }
    run(ctx) {
        // Loop through particles array
        for (let i = this.particles.length - 1; i >= 0; i--) {
            var p = this.particles[i];

            p.update();
            p.display(ctx);
        }
    }
    spawnParticle(p) {
        if (this.particles.length < this.max) {
            this.particles.push(p);
        } else {
            // If particle limit reached increase speed in which particle dies
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
/*=====================================================================================
// PARTICLE: Create/use an object to pass arguments eg. new GooglyParticle(parent, img, 
---------------------------------------------------------------------------------------
{ x: 0, y: 0, width: 16, height: 16, velocity: 5, direction: 1, health: 25, dither: 1 })
=======================================================================================*/
class GooglyParticle  {
    constructor(parent, img, obj) {
        this.parent = parent;
        // this.id = id;
        this.img = img;
		this.dir = new GooglyVector(Math.cos(obj.direction), Math.sin(obj.direction))
        this.pos = new GooglyVector(obj.x, obj.y);
        this.vel = new GooglyVector(
            this.dir.x * obj.velocity + (Math.random() * (obj.dither - (-obj.dither)) + (-obj.dither)),
            this.dir.y * obj.velocity + (Math.random() * (obj.dither - (-obj.dither)) + (-obj.dither))
        );
        this.width = obj.size;
        this.height = obj.size;
        this.health = obj.health;
        this.dither = obj.dither;
        this.drain = 1;
		this.angle = Math.random() * (360 - 180) + 180;
        this.friction = 0.85;
    }
    update() {
		this.vel.add(this.dir);
        this.pos.add(this.vel);
		// Use delta time if using a higher framerate
		if (Game.mods['Smooth Render']) {
			this.vel.dampen(this.friction * Game.fpsCoeff);
			this.health -= this.drain * Game.fpsCoeff;
		} else {
			this.vel.dampen(this.friction);
			this.health -= this.drain;
		}

        if (this.health <= 1) this.destroy();
    }
    display(ctx) {
		ctx.save();

		ctx.translate(this.pos.x, this.pos.y);
		ctx.rotate(this.angle);
		ctx.globalAlpha = (100/this.width) / (100/this.health);
    	ctx.drawImage(this.img, -(this.width + this.health) / 2, -(this.height + this.health) / 2, this.width + this.health, this.height + this.health);

        ctx.restore();
    }
    destroy() {
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
	angle(v) {
    	let dx = v.x - this.x;
    	let dy = v.y - this.y;
    	return Math.atan2(dy, dx);
	}
}
/*=====================================================================================
// INVENTORY
---------------------------------------------------------------------------------------
	Array argument is used for applying a cosmetic to an array of objects eg.
	GW.inventory.applyCosmetic('cigar', Game.wrinklers);  
	To apply a cosmetic to a single wrinkler use its index in the wrinkler array eg.
	Game.wrinklers[0].applyCosmetic('cigar');
=======================================================================================*/
class GooglyInventory {
	constructor(contents) {
		this.slot = contents || [];
		this.objects = {};
	}
	updateSlot(slot, obj) {
		if (typeof obj == 'object') this.slot[slot] = obj;
		else console.log('Expecting object, but instead recieved: ' + typeof obj);
	}
	applyCosmetic(cosmetic, array) {
		let obj = GooglyObjects[cosmetic];
		if (array) {
			for (let i in array) {
				array[i].inventory.updateSlot(obj.slot, obj);
			}
		} else {
			this.updateSlot(obj.slot, obj);
		}
	}
	clearSlot(slot, array) {
		if (array) {
			for (let i in array) {
				array[i].inventory.updateSlot(slot, GooglyObjects['blank']);
			}
		} else {
			this.updateSlot(slot, GooglyObjects['blank']);
		}
	}
	removeCosmeticById(id) {
		let index = this.slot.indexOf(this.slot.find(({ img }) => img === id + '.png'))
		this.clearSlot(index);
	}
	applyDefault() {
		this.slot = [];
		this.applyCosmetic('snorkel');
		this.applyCosmetic('oxygen_tank');
	}
	randomCosmetic() {
		let cosmetics = Object.keys(GooglyObjects);
		this.applyCosmetic(cosmetics[ Math.floor(Math.random() * (4 - cosmetics.length) + cosmetics.length) ])
	}
	randomOutfit() {
		let outfits = Object.keys(GooglyObjects.outfits);
		this.wearOutfit(outfits[ Math.round(Math.random() * outfits.length-1) ])
	}
	wearOutfit(outfit, array) {
		let fit = GooglyObjects.outfits[outfit];
		if (array) {
			for (let i in array) {
				array[i].inventory.slot = [];
				for (let j in fit) {
					array[i].inventory.applyCosmetic(fit[j]);
				}
			}
		} else {
			for (let i in fit) {
				if (fit[i] !== 'blank') {
					this.applyCosmetic(fit[i]);
				} else {
					this.clearSlot(i);
				}
			}
		}
	}
	getObjectSlot(value) {
		return Object.values(GooglyObjects).filter(obj => { return obj.slot === value });
	}
	getObjectString(obj) {
		return obj.img.replace('.png', '');
	}
	save() {
		return this.slot;
	}
	load(slot) {
		for (let i = 0; i < slot.length; i++) {
			if (slot[i] == undefined) this.slot[i] = GooglyObjects.blank;
			this.slot[i] = slot[i];
		}
	}
}
/*=====================================================================================
// CODE INJECTOR
---------------------------------------------------------------------------------------
	insertInbetween: https://stackoverflow.com/a/16205937
	mergeFunctions:  https://stackoverflow.com/a/20001507
=======================================================================================*/
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
		let _this = this;
		return function() {
			var _arguments  = Array.prototype.slice.apply(arguments);
			var _arguments1 = _arguments.slice(0, numberOfArgumentsToPassToFunc1);
			var _arguments2 = _arguments.slice(numberOfArgumentsToPassToFunc1);
			var that = this;
			(function(function1, function2) {
				if (typeof function1 == "function") {
					if (typeof instance1 != "undefined") function1.apply(instance1, _arguments1);
					else if (that == window) function1.apply(function1, _arguments1);
					else {
						var compare = _this.mergeFunctions(function(){}, function(){});
						if (that.toString() == compare.toString()) function1.apply(function1, _arguments1)
						else function1.apply(that, _arguments1)
					}
				}
				if (typeof function2 == "function") {
					if (typeof instance2 != "undefined") function2.apply(instance2, _arguments2)
					else if (that == window) function2.apply(function2, _arguments2);
					else {
						var compare = _this.mergeFunctions(function(){}, function(){});
						if (that.toString() == compare.toString()) function2.apply(function2, _arguments2);
						else function2.apply(that, _arguments2);
					}
				}
			})(function1, function2);
		}
	}
}
/*=====================================================================================
// LAUNCH
=======================================================================================*/
Game.registerMod("Googly Wrinklers", {
	init:function() {
		GW = new GooglyRenderer();
		// Create asset loader and assign additional classes
		GW.loader = new Loader();
		GW.loader.domain = this.dir + '/img/';
		GW.loader.Load(GooglyAssets);
		// Assign additional classes
		GW.menu 		= new GooglyMenu();
		GW.inventory 	= new GooglyInventory();
		GW.codeInjector = new GooglyCodeInjector();
		// Change wrinklers texture
		Game.WINKLERS = 1;
		// Insert GooglyRenderer draw functions at end of Game.DrawWrinklers
		let ctx = Game.LeftBackground;
		let wrinklers = Game.wrinklers;
		// Game.DrawWrinklers = GW.codeInjector.mergeFunctions(Game.DrawWrinklers, () => { GW.drawWrinklers(ctx, wrinklers) });
		Game.DrawWrinklers = function() { GW.drawWrinklers(ctx, wrinklers) }
		// Give wrinkler a random outfit when spawned
		Game.SpawnWrinkler = GW.codeInjector.mergeFunctions((me) => { me.inventory.randomOutfit() }, Game.SpawnWrinkler);
	},
	save:function() {
		// Store inventory slots
		let wrink = Game.wrinklers;
		let slots = [];
		for (let i in wrink) {
			slots[i] = wrink[i].inventory.slot;
		}
		return JSON.stringify(slots);
	},
	load:function(str) {
		// Populate inventory from save data
		let slots = JSON.parse(str);
		LoadScript(this.dir + '/GooglyObjects.js', () => {
			for (let i in Game.wrinklers) {
				Game.wrinklers[i].inventory.load(slots[i]);
			}
		});
	}
})