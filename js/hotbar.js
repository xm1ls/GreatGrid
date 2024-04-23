const hotbar = document.getElementById('hotbar');
const slots = document.querySelectorAll('.hotbar__slot');

let slotIndex = prevSlotIndex = 0;
const slotsNumber = 9

hotbar.addEventListener("wheel", e => {    
    prevSlotIndex = slotIndex

    slotIndex += Math.ceil(e.deltaY * .01);
    slotIndex = (slotIndex + slotsNumber) % slotsNumber;

    slots[prevSlotIndex].classList.remove('hotbar__slot--active') 
    slots[slotIndex].classList.add('hotbar__slot--active') 
})

slots.forEach((slot, index) => {
    slot.addEventListener("click", e => {
        slots[slotIndex].classList.remove('hotbar__slot--active')
        slots[index].classList.add('hotbar__slot--active') 

        slotIndex = index
    })
})