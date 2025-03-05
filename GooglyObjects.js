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
            'blank', 
            'chevron', 
            'eyes', 
            'glasses', 
            'hair01'
        ],
        sheriff: [
            'cigar', 
            'chevron', 
            'eyes', 
            'aviators', 
            'cowboy_hat'
        ],
        charro: [
            'tongue', 
            'moustache', 
            'eyes', 
            'blank', 
            'sombrero'
        ],
        clown: [
            'tongue', 
            'blank', 
            'eyes', 
            'clown_glasses', 
            'clown_wig'
        ]
    },
    skins: [
        'dark_winkler.png'
    ],
    blank: {
        name: 'Blank',
        id: 'blank',
        img: '',
        x: 0,
        y: 0,
        wobble_x: 0,
        wobble_y: 0,
        rotation: 0,
        size: 0
    },
    eyes: {
        name: 'Googly Eyes',
        id: 'eyes',
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
        id: 'monocle',
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
        id: 'sunglasses',
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
        id: 'glasses',
        img: 'glasses.png',
        slot: 3,
        x:  0,
        y: 26,
        wobble_x: 1,
        wobble_y: 1,
        rotation: 180,
        size: 80
    },
    aviators: {
        name: 'Aviators',
        id: 'aviators',
        img: 'aviators.png',
        slot: 3,
        x:  0,
        y: 25.5,
        wobble_x: 0,
        wobble_y: 0,
        rotation: 180,
        size: 80
    },
    clown_glasses: {
        name: 'Clown Glasses',
        id: 'clown_glasses',
        img: 'clown_glasses.png',
        slot: 3,
        x:  0,
        y: 25,
        wobble_x: 1,
        wobble_y:-1,
        rotation: 180,
        size: 80
    },
    snorkel: {
        name: 'Snorkel',
        id: 'snorkel',
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
        id: 'moustache',
        img: 'moustache.png',
        slot: 1,
        x: 0,
        y: 7,
        wobble_x: 0,
        wobble_y: 2,
        rotation: 180,
        size: 45
    },
    chevron: {
        name: 'Chevron',
        id: 'chevron',
        img: 'chevron.png',
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
        id: 'tongue',
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
        id: 'cigar',
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
        id: 'pipe',
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
        id: 'cowboy_hat',
        img: 'cowboy_hat.png',
        slot: 4,
        x: 0,
        y: 64,
        wobble_x: 1,
        wobble_y: 2,
        rotation: 180,
        size: 86
    },
    top_hat: {
        name: 'Top Hat',
        id: 'top_hat',
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
        id: 'sombrero',
        img: 'sombrero.png',
        slot: 4,
        x: 0,
        y: 75,
        wobble_x: 1,
        wobble_y: 2,
        rotation: 180,
        size: 115
    },
    clown_wig: {
        name: 'Clown Wig',
        id: 'clown_wig',
        img: 'clown_wig.png',
        slot: 4,
        x: 0,
        y: 70,
        wobble_x: 2,
        wobble_y: 5,
        rotation: 180,
        size: 110
    },
    hair01: {
        name: 'Hair 01',
        id: 'hair01',
        img: 'hair01.png',
        slot: 4,
        x: -2,
        y: 55,
        wobble_x: 1,
        wobble_y: 2,
        rotation: 180,
        size: 100
    },
    oxygen_tank: {
        name: 'Oxygen Tank',
        id: 'oxygen_tank',
        img: 'oxygen_tank.png',
        slot: 4,
        x: 0,
        y: 95,
        wobble_x: 1,
        wobble_y: 1,
        rotation: 180,
        size: 95
    },
    getAllObjects:function() {
        return Object.keys(GooglyObjects).map(function(k) { return GooglyObjects[k] })
    }
}