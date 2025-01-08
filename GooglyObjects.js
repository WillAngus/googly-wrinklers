/*=====================================================================================
// OBJECTS
---------------------------------------------------------------------------------------
    Here are all the cosmetics for the Wrinklers. Image file name must be 
    the same as its object. Name can be anything, doesn't have to match.
=======================================================================================*/
const GooglyObjects = {
    outfits: {
        fancy: [
            'pipe', 
            'moustache', 
            'eyes', 
            'monocle', 
            'top_hat'
        ],
        scuba: [
            'blank', 
            'blank', 
            'eyes', 
            'snorkel', 
            'oxygen_tank'
        ],
        detective: [
            'cigar', 
            'moustache', 
            'eyes', 
            'sunglasses', 
            'cowboy_hat'
        ],
        charro: [
            'tongue', 
            'moustache', 
            'eyes', 
            'blank', 
            'sombrero'
        ],
    },
    blank: {
        name: 'Blank',
        img: '',
        x: 0,
        y: 0,
        wobble_x: 0,
        wobble_y: 0,
        rotation: 0,
        size: 0
    },
    eyes_icon: {
        name: 'Googly Eyes',
        img: 'eyes.png',
        slot: 2,
        size: 15,
        scale: 1,
        outline_color: '#f66',
        outer_color:   'white',
        inner_color:   'black'
    },
    eyes: {
        name: 'Googly Eyes',
        img: 'eyes.png',
        slot: 2,
        size: 15,
        scale: 1,
        outline_color: '#f66',
        outer_color:   'white',
        inner_color:   'black'
    },
    monocle: {
        name: 'Monocle',
        img: 'monocle.png',
        slot: 3,
        x:-21,
        y: 18,
        wobble_x: 1,
        wobble_y: 1,
        rotation: 180,
        size: 55
    },
    sunglasses: {
        name: 'Sunglasses',
        img: 'sunglasses.png',
        slot: 3,
        x:  0,
        y: 26,
        wobble_x: 1,
        wobble_y: 1,
        rotation: 180,
        size: 80
    },
    glasses: {
        name: 'Glasses',
        img: 'glasses.png',
        slot: 3,
        x:  0,
        y: 26,
        wobble_x: 1,
        wobble_y: 1,
        rotation: 180,
        size: 80
    },
    snorkel: {
        name: 'Snorkel',
        img: 'snorkel.png',
        slot: 3,
        x: -3,
        y: 26,
        wobble_x: 1,
        wobble_y: 1,
        rotation: 180,
        size: 85,
        particle: {
            img: 'bubble.png',
            x:-40,
            y: 70,
            size: 8,
            velocity: 2,
            direction: 1,
            health: 16,
            dither: 2,
            rate: 2,
        }
    },
    moustache: {
        name: 'Moustache',
        img: 'moustache.png',
        slot: 1,
        x: 0,
        y: 7,
        wobble_x: 0,
        wobble_y: 2,
        rotation: 180,
        size: 45
    },
    tongue: {
        name: 'Tongue',
        img: 'tongue.png',
        slot: 0,
        x:-14,
        y: -7,
        wobble_x: 3,
        wobble_y: 5,
        rotation: 0,
        size: 30
    },
    cigar: {
        name: 'Cigar',
        img: 'cigar.png',
        slot: 0,
        x:  0,
        y:-15,
        wobble_x: 1,
        wobble_y: 5,
        rotation: 0,
        size: 40,
        particle: {
            img: 'smoke.png',
            x: 0,
            y:-30,
            size: 8,
            velocity: 2,
            direction: 1,
            health: 16,
            dither: 2,
            rate: 7,
        }
    },
    pipe : {
        name: 'Pipe',
        img: 'pipe.png',
        slot: 0,
        x: 25,
        y:-15,
        wobble_x: 1,
        wobble_y: 5,
        rotation: 10,
        size: 50,
        particle: {
            img: 'smoke.png',
            x: 38,
            y:-18,
            size: 8,
            velocity: 2,
            direction: 1,
            health: 16,
            dither: 2,
            rate: 5,
        }
    },
    cowboy_hat: {
        name: 'Cowboy Hat',
        img: 'cowboy_hat.png',
        slot: 4,
        x: 0,
        y: 66,
        wobble_x: 1,
        wobble_y: 2,
        rotation: 180,
        size: 80
    },
    top_hat: {
        name: 'Top Hat',
        img: 'top_hat.png',
        slot: 4,
        x: 0,
        y: 80,
        wobble_x: 1,
        wobble_y: 2,
        rotation: 180,
        size: 75
    },
    sombrero: {
        name: 'Sombrero',
        img: 'sombrero.png',
        slot: 4,
        x: 0,
        y: 75,
        wobble_x: 1,
        wobble_y: 2,
        rotation: 180,
        size: 115
    },
    hair01: {
        name: 'Hair 01',
        img: 'hair01.png',
        slot: 4,
        x: 0,
        y: 55,
        wobble_x: 1,
        wobble_y: 2,
        rotation: 180,
        size: 100
    },
    oxygen_tank: {
        name: 'Oxygen Tank',
        img: 'oxygen_tank.png',
        slot: 4,
        x: 0,
        y: 95,
        wobble_x: 1,
        wobble_y: 1,
        rotation: 180,
        size: 95
    },
}