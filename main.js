
var GW = {
	name: 	 'Googly Wrinklers',
	version: '1.000',
	debug:	  true,
};
var GooglyAssets = ['icon_winkler.png', 'icon_wrinkler.png', 'icon_special.png', 'tongue.png', 'cigar.png', 'cowboy_hat.png', 'eyes.png'];
/*=====================================================================================
// RENDERER
=======================================================================================*/
class GooglyRenderer {
	constructor() {
		for (let i in Game.wrinklers) {
			Game.wrinklers[i].inventory 	 = new GooglyInventory();
			Game.wrinklers[i].particleSystem = new GooglyParticleSystem(500);
			Game.wrinklers[i].img			 = 'winkler.png';
			Game.wrinklers[i].skin 			 = 'winkler.png';
		}
	}
	drawWrinklers(ctx, wrinklers) {
		for (var i in wrinklers) {
			let me = wrinklers[i];
			if (me.phase > 0) {
				ctx.save();
				ctx.globalAlpha = me.close;
				ctx.translate(me.x, me.y);
				// Use delta time of Smooth Render mod to ensure wrinklers wiggle at a the same speed regardless of FPS 
				if (Game.mods['Smooth Render']) {
					var sw = 100 + 2 * Math.sin( (Game.T * Game.fpsCoeff) * 0.2 + i*3);
					var sh = 200 + 5 * Math.sin( (Game.T * Game.fpsCoeff) * 0.2 - 2 + i*3);
				} else {
					var sw = 100 + 2 * Math.sin(Game.T * 0.2 + i*3);
					var sh = 200 + 5 * Math.sin(Game.T * 0.2 - 2 + i*3);
				}
				// Wrinkler shadow
				if (Game.prefs.fancy) {
					ctx.translate(0,30);
					ctx.rotate(-(me.r)*Math.PI/180);
					ctx.drawImage(this.getPic('wrinklerShadow.png'),-sw/2,-10,sw,sh);
					ctx.rotate((me.r)*Math.PI/180);
					ctx.translate(0,-30);
				}
				ctx.rotate(-(me.r)*Math.PI/180);
				// Change image if Shiny Wrinkler or Seasonal Wrinkler
				if (me.type == 1) {
					me.img = Game.WINKLERS ? 'shinyWinkler.png' : 'shinyWrinkler.png';
				} else if (Game.season == 'christmas') {
					me.img = Game.WINKLERS ? 'winterWinkler.png' : 'winterWrinkler.png';
				} else {
					me.img = me.skin;
				}
				// Draw Wrinkler, cosmetics and particles
				ctx.drawImage(this.getPic(me.img), -sw/2, -10, sw, sh);
				this.drawCosmetics(ctx, me);
				me.particleSystem.run(ctx);
				// Sparkle for Shiny Wrinkler
				if (me.type == 1) this.drawShine(ctx, 0, 86, 256, 256);
				ctx.restore();
				// Cookie particles
				if (Game.prefs.particles && me.phase==2 && Math.random()<0.03) {
					Game.particleAdd(me.x,me.y,Math.random()*4-2,Math.random()*-2-2,Math.random()*0.5+0.5,1,2);
				}
				// Eye of the Wrinkler heaveny upgrade
				if (me.selected == 1 && Game.Has('Eye of the wrinkler')) {
					this.drawEyeOfWrinkler(ctx, me);
				}
			}
		}
	}
	drawShine(ctx, x, y, width, height) {
		ctx.save();
		ctx.translate(x, y);
		ctx.rotate(Game.T*Math.PI/180);
		ctx.globalCompositeOperation = 'lighter';
		ctx.globalAlpha = 0.15;
		ctx.drawImage(Pic('shineGold.png'), -width/2, -height/2, width, height);
		if (Math.random() < 0.3 && Game.prefs.particles) {
			ctx.globalAlpha = Math.random() * 0.65 + 0.1;
			var s = Math.random() * 30 + 5;
			ctx.drawImage(Pic('glint.png'), -s/2 + Math.random() * 50-25,- s/2 + Math.random() * 200, s, s);
		}
		ctx.restore();
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

		ctx.save();
		ctx.globalAlpha = me.close;
		ctx.translate(obj.x, obj.y);
		ctx.rotate(obj.rotation*Math.PI/180);
		if (obj.img !== '') {
			ctx.drawImage(this.getPic(obj.img), -obj.size/2 -this.getWobble(obj, me).x, -obj.size/2 -this.getWobble(obj, me).y, this.getWobble(obj, me).w, this.getWobble(obj, me).h);
		}
		ctx.restore();
		// Spawn particle if object has particle data
		if (obj.particle && me.close > 0) {
			// Quick and dirty function declaration to use with the Smooth Render mod
			function createParticle() {
				// Get particle data
				let particle = obj.particle;
				// Set velocity direction to counter wrinkler rotation
				particle.direction = 0 + ( (me.r - 90) * Math.PI/180 );
				// Create new particle in selected wrinkler 
				me.particleSystem.spawnParticle(new GooglyParticle(me.particleSystem, GW.renderer.getPic(obj.particle.img), obj.particle));
			}
			// Run at set rate with random offset 
			if (Game.mods['Smooth Render']) {
				if (Game.T % Math.round(obj.particle.rate * Game.fpsCoeffInv) + Math.floor(Math.random() * (0 - 2) + 2) == 0) createParticle();
			} else {
				if (Game.T % obj.particle.rate + Math.floor(Math.random() * (0 - 2) + 2) == 0) createParticle();
			}
		}
		ctx.restore();
	}
	drawGooglyEyes(ctx, me, slot) {
		let obj = me.inventory.slot[slot];
		ctx.save();
		ctx.scale(obj.scale, obj.scale);

		ctx.save();
		ctx.globalAlpha = me.close;
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
	inRect(x, y, rect) {
		// Find out if the point x, y is in the rotated rectangle rect{w, h, r, o} (width, height, rotation in radians, y-origin) (needs to be normalized)
		// 'I found this somewhere online I guess' - Ortiel
		var dx = x+Math.sin(-rect.r)*(-(rect.h/2-rect.o)),dy=y+Math.cos(-rect.r)*(-(rect.h/2-rect.o));
		var h1 = Math.sqrt(dx*dx + dy*dy);
		var currA = Math.atan2(dy,dx);
		var newA = currA - rect.r;
		var x2 = Math.cos(newA) * h1;
		var y2 = Math.sin(newA) * h1;
		if (x2 > -0.5 * rect.w && x2 < 0.5 * rect.w && y2 > -0.5 * rect.h && y2 < 0.5 * rect.h) return true;
		return false;
	}
}
/*=====================================================================================
// MENU
---------------------------------------------------------------------------------------
	Wrinkler customization GUI. Has access to GooglyRenderer properties.
=======================================================================================*/
class GooglyMenu extends GooglyRenderer {
	constructor() {
		// Apply GooglyRenderer properties to GooglyMenu class
		super();
		// Array to store slot indexes for cosmetic selectors. slotIndex[5] used to select a wrinkler
		this.slotIndex = [0, 0, 0, 0, 0, 0];
		// Inventory to store arrays of cosmetics with their respective slot numbers
		this.inventory = new GooglyInventory();
		// Create template wrinkler to apply cosmetics to
		this.wrinkler = {
			id: 16, 
			x: 50, 
			y: 42, 
			r: 0, 
			close: 1,
			type: 0,
			size: 100,
			wobble_x: -0.5,
			wobble_y: -1,
			inventory: new GooglyInventory(),
			particleSystem: new GooglyParticleSystem(100),
			img: 'winkler.png',
			skin: 'winkler.png'
		};
		this.icon = {
			img: 'icon_special.png',
			x: 24,
			y: 24,
			w: 48,
			h: 48,
			selected: false,
		};
	}
	updateIcon() {
		if (this.icon.selected && Game.CanClick) {
			if (Game.Click && Game.lastClickedEl==l('backgroundLeftCanvas')) {
				this.show();
				Game.Click = 0;
			}
		}
	}
	drawIcon(ctx) {
		let me = this.icon;
		me.y = ctx.canvas.height - (Game.specialTabs.length*48) - 72;
		let rect = {
			w: me.w,
			h: me.h,
			r: 0,
			o: 24
		};

		if (ctx && this.inRect(Game.mouseX - me.x,Game.mouseY - me.y, rect)) {

			this.icon.selected = true;
			let r = Math.floor((Game.T*0.5)%360);

			ctx.save();
			ctx.translate(me.x, me.y);
			if (Game.prefs.fancy) ctx.rotate((r/360)*Math.PI*2);
			ctx.globalAlpha = 0.45;
			ctx.drawImage(Pic('shine.png'), -(me.w+12)/2, -(me.h+12)/2, me.w+16, me.h+16);
			ctx.restore();
		} else {
			this.icon.selected = false;
		}

		ctx.save();
		ctx.translate((me.x + (Math.sin(5 + Game.T*0.1)*3)), (me.y - (Math.abs(Math.cos(5 + Game.T*0.1))*6)));
		ctx.drawImage(this.getPic(this.icon.img), -(me.w)/2, -(me.h)/2, me.w, me.h);
		ctx.restore();
	}
	drawMenu() {
		if (!l('wrinklerPreview')) return false;
		let ctx = l('wrinklerPreview').getContext('2d');
		ctx.clearRect(0, 0, 100, 220);

		let me = Game.wrinklers[0];

		/* ctx.save();
		ctx.globalAlpha = 0.5;
		ctx.fillStyle = 'hsl(0, 100.00%, 50.00%)';
		ctx.fillRect(0, 0, 100, 220);

		ctx.globalCompositeOperation = 'destination-atop';
		ctx.globalAlpha = 1; */
		ctx.drawImage(
			this.getPic('icon_winkler.png'), 
			this.getWobble(this.wrinkler, me).x, 
			this.getWobble(this.wrinkler, me).y, 
			this.getWobble(this.wrinkler, me).w, 
			this.getWobble(this.wrinkler, me).h + 120
		);
		// ctx.restore();

		ctx.save();
		this.translateToWrinkler(ctx, this.wrinkler);
		this.drawCosmetics(ctx, this.wrinkler, 2);
		this.wrinkler.particleSystem.run(ctx);
		ctx.restore();
	}
	show() {
		this.wrinkler.inventory = Game.wrinklers[this.slotIndex[5]].inventory;
		Game.Prompt(
			'<id CustomizeYou><h3>'+loc("Customize Wrinklers")+'</h3>'+
			'<div class="block" style="text-align:center;font-size:11px;">'+loc("Spawn of the Grandmapocalypse. Shape them as you desire.")+'</div>'+
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
			this.makeSelector(5)+
			'</div>'+'',
			[loc("Done")]
		);
		this.setSelectors();
		this.drawMenu();
	}
	makeSelector(value) {
		let text;
		if (value < 5) text = this.inventory.slot[value][this.slotIndex[value]].name;
		else text = 'Wrinkler: ' + (this.slotIndex[5] + 1);
		
		return '<div style="clear:both;width:100%;margin-bottom:6px;"><a '+Game.clickStr+'="GW.menu.incrementSelector('+value+', -1)" id=" " class="framed smallFancyButton" style="float:left;margin-top:-4px;padding:2px 4px;">&lt;</a><div id="slot'+value+'" style="display:inline;">'+text+'</div><a '+Game.clickStr+'="GW.menu.incrementSelector('+value+', 1)" id=" " class="framed smallFancyButton" style="float:right;margin-top:-4px;padding:2px 4px;">&gt;</a></div>';
	}
	incrementSelector(value, amount) {
		let arr = [];
		if (value  < 5) arr = this.inventory.slot[value];
		if (value == 5) arr = Game.wrinklers;

		let index = this.slotIndex[value];
		index += amount;
		// Single cosmetic
		if (value < 5) {
			// Roll over to start or end of list 
			if (index < 0) index = arr.length-1;
			if (index > arr.length-1) index = 0;
			// Update slot index and HTML
			this.slotIndex[value] = index;
			// Update HTML
			l('slot'+value).innerHTML = arr[index].name;
			// Equip item
			if (arr[index].name !== 'Blank') {
				this.wrinkler.inventory.updateSlot(value, arr[index]);
			} else {
				this.wrinkler.inventory.clearSlot(value);
			}
		}
		// Selecting wrinkler and applying cosmetics
		if (value == 5) {
			// Roll over to start or end of list 
			if (index < 0) index = Game.getWrinklersMax()-1;
			if (index > Game.getWrinklersMax()-1) index = 0;
			// Update slot index and HTML
			this.slotIndex[value] = index;
			l('slot'+value).innerHTML = 'Wrinkler: ' + (this.slotIndex[5] + 1);
			// Update inventory of template wrinkler to the selected wrinkler
			this.wrinkler.inventory = Game.wrinklers[this.slotIndex[5]].inventory;
			// Update text and index of selectors
			this.setSelectors();
		}
		// Update canvas
		this.drawMenu();
	}
	setSelectors() {
		var inv = this.wrinkler.inventory.slot;
		for (let i = 0; i < inv.length; i++) {
			let names = this.getObjSlots(i).map(e => e.name);
			let index;
			try {
				index = names.indexOf(inv[i].name);
				if (index !== -1) {
					this.slotIndex[i] = index;
				}
				l('slot'+i).innerHTML = inv[i].name;
			} 
			catch (error) {
				if (GW.debug) console.log(inv[i]);
			}
		}
	}
	populateInventory() {
		for (let i = 0; i < this.slotIndex.length-1; i++) {
			this.inventory.slot[i] = this.getObjSlots(i);
			// Add blank object at end of inventory
			this.inventory.slot[i].push(GooglyObjects.blank);
		}
	}
	getObjSlots(value) {
		return Object.values(GooglyObjects).filter(obj => { return obj.slot === value });
	}
	getSelectedSlots() {
		let slots = [];
		for (let i = 0; i < this.slotIndex.length; i++) {
			slots[i] = this.getObjSlots(i)[this.slotIndex[i]];
		}
		return slots;
	}
	getAllSlots() {
		let slots = [];
		for (let i = 0; i < this.slotIndex.length; i++) {
			slots[i] = this.getObjSlots(i);
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
            // If particle limit reached, increase speed in which particle dies
            this.particles[this.particles.length - 1].drain = 10;
            // Spawn new particle
            this.particles.push(p);
        }
    }
    removeParticle(p) {
        // Remove particle from array
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
		// Use delta time to keep speed consistent
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
		this.wearOutfit('fancy', Game.wrinklers);
	}
	randomCosmetic() {
		let cosmetics = Object.keys(GooglyObjects);
		this.applyCosmetic(cosmetics[ Math.floor(Math.random() * (3 - cosmetics.length) + cosmetics.length) ])
	}
	randomOutfit() {
		let outfits = Object.keys(GooglyObjects.outfits);
		this.wearOutfit(outfits[ Math.round(Math.random() * outfits.length-1) ])
	}
	wearOutfit(outfit, array) {
		let fit;
		if (Array.isArray(outfit)) {
			fit = outfit;
		} else {
			fit = GooglyObjects.outfits[outfit];
		}
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
	getObjectById(id) {
		return this.slot.find(x => x.id === id)
	}
	getObjectId(obj) {
		return obj.id;
	}
	getOutfit() {
		let arr = [];
		for (let i in this.slot) {
			arr[i] = this.slot[i].id
		}
		return arr;
	}
	getAllOutfits() {
		let arr = [];
		for (let i in Game.wrinklers) {
			arr[i] = Game.wrinklers[i].inventory.getOutfit();
		}
		return arr;
	}
	saveAll() {
		return this.getAllOutfits();
	}
	loadAll(outfits) {
		for (let i in Game.wrinklers) {
			for (let j in outfits[i]) {
				try {
					if (outfits[i][j] !== undefined) Game.wrinklers[i].inventory.applyCosmetic(outfits[i][j]);
				}
				catch (error) {
					Game.wrinklers[i].inventory.clearSlot(j);
					if (GW.debug) console.warn('Could not find object: ' + outfits[i][j] + '. Cosmetic slot ' + j + ' cleared.');
				}
			}
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
Game.registerMod(GW.name, {
	init:function() {
		// Create new asset loader
		// ------------------------------
		GW.loader = new Loader();
		GW.loader.domain = this.dir + '/img/';
		GW.loader.Load(GooglyAssets);
		// Assign additional classes
		// ------------------------------
		GW.renderer  = new GooglyRenderer();
		GW.menu 	 = new GooglyMenu();
		GW.inventory = new GooglyInventory();
		GW.injector  = new GooglyCodeInjector();
		// Change wrinklers texture
		// ------------------------------
		Game.WINKLERS = 1;
		// Inject functions into the game
		// ------------------------------
		let ctx 	  = Game.LeftBackground;
		let wrinklers = Game.wrinklers;
		Game.DrawWrinklers = function() { GW.renderer.drawWrinklers(ctx, wrinklers) };
		Game.registerHook('draw',  function() { 
			if (Game.elderWrath > 0) {
				GW.menu.drawMenu();
				GW.menu.drawIcon(ctx);
				Game.specialTabs.push('wrinkler');
			}
		});
		Game.registerHook('logic', function() { if (Game.elderWrath > 0) GW.menu.updateIcon(); })
		// Game.SpawnWrinkler = GW.injector.mergeFunctions((me) => { me.inventory.randomOutfit() }, Game.SpawnWrinkler);
	},
	save:function() {
		// Store inventory slots
		let outfits = GW.inventory.getAllOutfits();
		return JSON.stringify(outfits);
	},
	load:function(str) {
		// Store save data for debugging purposes
		GW.saveData = str;
		// Load cosmetic objects stored in sperate file
		LoadScript(this.dir + '/GooglyObjects.js', () => {
			// Load outfits from save data string
			GW.inventory.loadAll(JSON.parse(GW.saveData));
			// Populate menu inventory
			GW.menu.populateInventory();
		});
	}
})