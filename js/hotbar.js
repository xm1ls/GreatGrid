const hotbar = document.getElementById('hotbar');
const slots = document.querySelectorAll('.hotbar__slot');

const dyes = {
    white: {r: 249, g: 255, b: 254},
    lightGray: {r: 157, g: 157, b: 151},
    gray: {r: 71, g: 79, b: 82},
    black: {r: 29, g: 29, b: 33},
    brown: {r: 131, g: 84, b: 55},
    red: {r: 176, g: 46, b: 38},
    orange: {r: 249, g: 128, b: 29},
    yellow: {r: 254, g: 216, b: 61},
    lime: {r: 128, g: 199, b: 31},
    green: {r: 94, g: 124, b: 22},
    cyan: {r: 22, g: 156, b: 156},
    lightBlue: {r: 58, g: 179, b: 218},
    blue: {r: 60, g: 68, b: 170},
    purple: {r: 137, g: 50, b: 184},
    magenta: {r: 199, g: 78, b: 189},
    pink: {r: 243, g: 139, b: 170},
}

let slotIndex = prevSlotIndex = 0;
const slotsNumber = 9

hotbar.addEventListener("wheel", e => {    
    prevSlotIndex = slotIndex

    slotIndex += Math.ceil(e.deltaY * .01);
    slotIndex = (slotIndex + slotsNumber) % slotsNumber;

    slots[prevSlotIndex].classList.remove('hotbar__slot--active') 
    slots[slotIndex].classList.add('hotbar__slot--active') 

    if(slots[slotIndex].children.length > 0) {
        if(slots[slotIndex].children[0].dataset.dye in dyes) {
            const {r, g, b} = dyes[slots[slotIndex].children[0].dataset.dye]

            drawColor = dyes[slots[slotIndex].children[0].dataset.dye]
            drawColor.a = 255

            slots[slotIndex].style.outlineColor = `rgb(${r}, ${g}, ${b})`
        } 
    } else {
        drawColor = {
            r: 0,
            g: 0,
            b: 0,
            a: 255,
        }
    }
})

slots.forEach((slot, index) => {
    slot.addEventListener("click", e => {
        slots[slotIndex].classList.remove('hotbar__slot--active')
        slots[index].classList.add('hotbar__slot--active') 

        slotIndex = index

        if(slot.children.length > 0) {
            if(slot.children[0].dataset.dye in dyes) {
                const {r, g, b} = dyes[slot.children[0].dataset.dye]

                drawColor = dyes[slot.children[0].dataset.dye]
                drawColor.a = 255

                slot.style.outlineColor = `rgb(${r}, ${g}, ${b})`
            }
        } else {
            drawColor = {
                r: 0,
                g: 0,
                b: 0,
                a: 255,
            }
        }
    })
})