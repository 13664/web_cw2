const description = document.querySelector('.description')
console.log('des', description)
description.defaultValue = description.dataset.value != undefined ? description.dataset.value : ''

const rating =document.querySelector('.rating')
rating.defaultValue = rating.dataset.value != undefined ? rating.dataset.value : ''