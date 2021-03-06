// Floor Item class
class FloorItem {
    constructor(img, pos, animInterval){        
        this.img = img

        this.img instanceof SpriteSheet ? this.width = this.img.cropWidth : this.width = this.img.naturalWidth
        this.img instanceof SpriteSheet ? this.height = this.img.cropHeight : this.height = this.img.naturalHeight
        this.posDim = [pos[0], pos[1], this.width, this.height]

        animInterval ? this.animInterval = animInterval : this.animInterval = null
        this.itemCropIndex = 0
        if (this.animInterval && this.img instanceof SpriteSheet){
            this.itemAnimInterval = setInterval(()=>{
                this.itemCropIndex++
                if (this.itemCropIndex > img.totalCrops-1){
                    this.itemCropIndex = 0
                }
            }, this.animInterval)
        }
        
        this.active = false
    }
    
    displayFloorItem = ()=>{
        if (this.animInterval){
            ctx.drawImage(this.img.sheet, 
                this.img.crops[this.itemCropIndex].x, this.img.crops[this.itemCropIndex].y, 
                this.img.crops[this.itemCropIndex].w, this.img.crops[this.itemCropIndex].h,
                this.posDim[0], this.posDim[1], 
                this.img.crops[this.itemCropIndex].w, this.img.crops[this.itemCropIndex].h)
        } else {
            if (this.active){
                ctx.drawImage(this.img.sheet, 
                    this.img.crops[1].x, this.img.crops[1].y, 
                    this.img.crops[1].w, this.img.crops[1].h, 
                    this.posDim[0], this.posDim[1], 
                    this.width, this.height)
            } else {
                ctx.drawImage(this.img.sheet, 
                    this.img.crops[0].x, this.img.crops[0].y,
                    this.img.crops[0].w, this.img.crops[0].h,
                    this.posDim[0], this.posDim[1], 
                    this.width, this.height)
            }
        }
    }
}  

// Inventory Item class
class InventoryItem {
    constructor(state){
        this.img
        this.width
        this.height
        this.posDim
        
        this.description
        this.boxWidth = 130
        this.boxHeight = 80
        this.showBox = false

        this.calories

        state ? this.state = state : this.state = 'raw'

        this.cookCounter = 0
        this.cookedCount = 0
        this.stateBuffer = 'raw'
    }

    getInitialVariables = ()=>{
        this.img instanceof SpriteSheet ? this.width = this.img.cropWidth : this.width = this.img.naturalWidth
        this.img instanceof SpriteSheet ? this.height = this.img.cropHeight : this.height = this.img.naturalHeight
        this.posDim = [0, 0, this.width, this.height]
        // this.boxWidth = ctx.measureText(' ').width*this.longestText
    }

    displayInvItem = (mousePos)=>{
        if (mousePos){
            if (this.state === 'burned'){
                ctx.drawImage(this.img.sheet, this.img.crops[2].x, this.img.crops[2].y,
                    this.img.crops[2].w, this.img.crops[2].h,
                    mousePos[0]-this.width*0.5,  mousePos[1]-this.height*0.5, this.width, this.height)
            } else if (this.state === 'cooked') {
                ctx.drawImage(this.img.sheet, this.img.crops[1].x, this.img.crops[1].y,
                    this.img.crops[1].w, this.img.crops[1].h,
                    mousePos[0]-this.width*0.5,  mousePos[1]-this.height*0.5, this.width, this.height)
            } else {
                ctx.drawImage(this.img.sheet, this.img.crops[0].x, this.img.crops[0].y,
                    this.img.crops[0].w, this.img.crops[0].h,
                    mousePos[0]-this.width*0.5,  mousePos[1]-this.height*0.5, this.width, this.height)
            }
        } else {
            if (this.state === 'burned'){
                ctx.drawImage(this.img.sheet, this.img.crops[2].x, this.img.crops[2].y,
                    this.img.crops[2].w, this.img.crops[2].h,
                    this.posDim[0], this.posDim[1], this.width, this.height)
            } else if (this.state === 'cooked') {
                ctx.drawImage(this.img.sheet, this.img.crops[1].x, this.img.crops[1].y,
                    this.img.crops[1].w, this.img.crops[1].h,
                    this.posDim[0], this.posDim[1], this.width, this.height)
            } else {
                ctx.drawImage(this.img.sheet, this.img.crops[0].x, this.img.crops[0].y,
                    this.img.crops[0].w, this.img.crops[0].h,
                    this.posDim[0], this.posDim[1], this.width, this.height)
            }
        }
    }

    displayInfoBox = (mousePos)=>{

        ctx.fillStyle = 'rgb(0, 0, 0, .7)'
        ctx.fillRect(mousePos[0]+5, mousePos[1]+5, this.boxWidth*2, this.boxHeight)
        ctx.font = '20px AlbertTextBold'
        ctx.fillStyle = 'rgb(255, 255, 255, 1)'
        ctx.fillText(this.description, mousePos[0]+this.boxWidth, mousePos[1]+32)
        ctx.font = '15px AlbertTextBold'
        ctx.fillStyle = 'grey'
        ctx.fillText(`(${this.state.charAt(0).toUpperCase() + this.state.slice(1)}) ${this.calories} calories`, mousePos[0]+this.boxWidth, mousePos[1]+64)
    }

    pickUpItem = (index)=>{
        game.cursor = this
        itemsInvGrid[index] = 0
    }

    swapItem = (index)=>{
        const itemBuffer = game.cursor
        game.cursor = this
        itemsInvGrid[index] = itemBuffer
    }

    cookItem = (cookingSpeed)=>{
        this.cookingCounter += cookingSpeed
        if (this.cookingCounter > this.cookingTime){
            if (this.cookingTime > 0){
                this.state = 'cooked'
            } else {
                this.state = 'burned'
            }
        }
        if (this.cookingCounter > this.cookingTime+250){
            this.state = 'burned'
        }
        if (this.stateBuffer !== this.state){
            if (this.state === 'cooked'){
                sounds.hissSound.play()
                this.calories = this.baseCalories*(Math.floor(Math.random()*4)+2)
            } else if (this.state === 'burned'){
                sounds.hissSound.play()
                this.calories = this.baseCalories*(Math.floor(Math.random()*0.1)+0.05)
            }
        }
        this.stateBuffer = this.state
    }
}

class Acorns extends InventoryItem{
    constructor(){
        super()
        this.name = 'acorns'
        this.type = 'fruit'
        this.img = new SpriteSheet(images.acornsImg, [3, 1])
        this.description = 'Couple of acorns'
        this.baseCalories = 60
        this.calories = 60
        this.cookingTime = 1500
        this.cookingCounter = 0
        this.state = 'raw'
        this.rarity = 75
        this.getInitialVariables()
    }
}

class Beehive extends InventoryItem{
    constructor(){
        super()
        this.name = 'beehive'
        this.type = 'misc'
        this.img = new SpriteSheet(images.beehiveImg, [3, 1])
        this.description = 'Abandoned beehive'
        this.baseCalories = 1200
        this.calories = 1200
        this.cookingTime = 0
        this.cookingCounter = 0
        this.state = 'raw'
        this.rarity = 5
        this.getInitialVariables()
    }
}

class Bird extends InventoryItem{
    constructor(){
        super()
        this.name = 'bird'
        this.type = 'meat'
        this.img = new SpriteSheet(images.birdImg, [3, 1])
        this.description = 'Plucked bird'
        this.baseCalories = 100
        this.calories = 100
        this.cookingTime = 4500
        this.cookingCounter = 0
        this.state = 'raw'
        this.rarity = 45
        this.getInitialVariables()
    }
}

class Chestnut extends InventoryItem{
    constructor(){
        super()
        this.name = 'chestnut'
        this.type = 'fruit'
        this.img = new SpriteSheet(images.chestnutImg, [3, 1])
        this.description = 'Mature chestnut'
        this.baseCalories = 75
        this.calories = 75
        this.cookingTime = 1500
        this.cookingCounter = 0
        this.state = 'raw'
        this.rarity = 70
        this.getInitialVariables()
    }
}

class Cranberries extends InventoryItem{
    constructor(){
        super()
        this.name = 'cranberries'
        this.type = 'fruit'
        this.img = new SpriteSheet(images.cranberriesImg, [3, 1])
        this.description = 'Some cranberries'
        this.baseCalories = 50
        this.calories = 50
        this.cookingTime = 0
        this.cookingCounter = 0
        this.state = 'raw'
        this.rarity = 80
        this.getInitialVariables()
    }
}

class Egg extends InventoryItem{
    constructor(){
        super()
        this.name = 'egg'
        this.type = 'meat'
        this.img = new SpriteSheet(images.eggImg, [3, 1])
        this.description = 'Egg from an unknow bird'
        this.baseCalories = 90
        this.calories = 90
        this.cookingTime = 1125
        this.cookingCounter = 0
        this.state = 'raw'
        this.rarity = 55
        this.getInitialVariables()
    }
}

class Fish extends InventoryItem{
    constructor(){
        super()
        this.name = 'fish'
        this.type = 'meat'
        this.img = new SpriteSheet(images.fishImg, [3, 1])
        this.description = 'Fish recently caught'
        this.baseCalories = 110
        this.calories = 110
        this.cookingTime = 3750
        this.cookingCounter = 0
        this.state = 'raw'
        this.rarity = 60
        this.getInitialVariables()
    }
}

class Flowers extends InventoryItem{
    constructor(){
        super()
        this.name = 'flowers'
        this.type = 'plant'
        this.img = new SpriteSheet(images.flowersImg, [3, 1])
        this.description = 'A bunch of flowers'
        this.baseCalories = 20
        this.calories = 20
        this.cookingTime = 0
        this.cookingCounter = 0
        this.state = 'raw'
        this.rarity = 90
        this.getInitialVariables()
    }
}

class Frog extends InventoryItem{
    constructor(){
        super()
        this.name = 'frog'
        this.type = 'meat'
        this.img = new SpriteSheet(images.frogImg, [3, 1])
        this.description = 'Pond frog'
        this.baseCalories = 75
        this.calories = 75
        this.cookingTime = 2625
        this.cookingCounter = 0
        this.state = 'raw'
        this.rarity = 40
        this.getInitialVariables()
    }
}

class Maggot extends InventoryItem{
    constructor(){
        super()
        this.name = 'maggot'
        this.type = 'meat'
        this.img = new SpriteSheet(images.maggotImg, [3, 1])
        this.description = 'Moving maggot'
        this.baseCalories = 90
        this.calories = 90
        this.cookingTime = 1125
        this.cookingCounter = 0
        this.state = 'raw'
        this.rarity = 85
        this.getInitialVariables()
    }
}

class Meat extends InventoryItem{
    constructor(){
        super()
        this.name = 'meat'
        this.type = 'meat'
        this.img = new SpriteSheet(images.meatImg, [3, 1])
        this.description = 'A piece of meat'
        this.baseCalories = 250
        this.calories = 250
        this.cookingTime = 6000
        this.cookingCounter = 0
        this.state = 'raw'
        this.rarity = 15
        this.getInitialVariables()
    }
}

class Mushroom extends InventoryItem{
    constructor(){
        super()
        this.name = 'acorns'
        this.type = 'plant'
        this.img = new SpriteSheet(images.mushroomImg, [3, 1])
        this.description = 'Healthy mushroom'
        this.baseCalories = 75
        this.calories = 75
        this.cookingTime = 900
        this.cookingCounter = 0
        this.state = 'raw'
        this.rarity = 20
        this.getInitialVariables()
    }
}

class Roots extends InventoryItem{
    constructor(){
        super()
        this.name = 'roots'
        this.type = 'plant'
        this.img = new SpriteSheet(images.rootsImg, [3, 1])
        this.description = 'Edible roots'
        this.baseCalories = 60
        this.calories = 60
        this.cookingTime = 3000
        this.cookingCounter = 0
        this.state = 'raw'
        this.rarity = 80
        this.getInitialVariables()
    }
}

class Snails extends InventoryItem{
    constructor(){
        super()
        this.name = 'snails'
        this.type = 'meat'
        this.img = new SpriteSheet(images.snailsImg, [3, 1])
        this.description = 'Some small snails'
        this.baseCalories = 80
        this.calories = 80
        this.cookingTime = 2250
        this.cookingCounter = 0
        this.state = 'raw'
        this.rarity = 50
        this.getInitialVariables()
    }
}

class Strawberries extends InventoryItem{
    constructor(){
        super()
        this.name = 'strawberries'
        this.type = 'fruit'
        this.img = new SpriteSheet(images.strawberriesImg, [3, 1])
        this.description = 'Couple of strawberries'
        this.baseCalories = 150
        this.calories = 150
        this.cookingTime = 0
        this.cookingCounter = 0
        this.state = 'raw'
        this.rarity = 25
        this.getInitialVariables()
    }
}

class WildSpinach extends InventoryItem{
    constructor(){
        super()
        this.name = 'wild-spinach'
        this.type = 'plant'
        this.img = new SpriteSheet(images.wildSpinachImg, [3, 1])
        this.description = 'Bunch of wild spinach leaves'
        this.baseCalories = 40
        this.calories = 40
        this.cookingTime = 1125
        this.cookingCounter = 0
        this.state = 'raw'
        this.rarity = 75
        this.getInitialVariables()
    }
}

// Item generation
class ItemGeneration{
    constructor(){
        this.allItems = ['acorns', 'beehive', 'bird', 'chestnut', 'cranberries', 'egg', 'fish', 'flowers', 'frog', 'maggot', 'meat', 'mushroom', 'roots', 'snails', 'strawberries', 'wild-spinach']
        this.itemsByWeightArray = this.getItemsByWeight()
    }

    genSingleItem = (itemName)=>{
        if (itemName === 'acorns') return new Acorns()
        if (itemName === 'beehive') return new Beehive()
        if (itemName === 'bird') return new Bird()
        if (itemName === 'chestnut') return new Chestnut()
        if (itemName === 'cranberries') return new Cranberries()
        if (itemName === 'egg') return new Egg()
        if (itemName === 'fish') return new Fish()
        if (itemName === 'flowers') return new Flowers()
        if (itemName === 'frog') return new Frog()
        if (itemName === 'maggot') return new Maggot()
        if (itemName === 'meat') return new Meat()
        if (itemName === 'mushroom') return new Mushroom()
        if (itemName === 'roots') return new Roots()
        if (itemName === 'snails') return new Snails()
        if (itemName === 'strawberries') return new Strawberries()
        if (itemName === 'wild-spinach') return new WildSpinach()
    }
    
    getItemsByWeight = ()=>{
        const itemsWeightArray = []
        const itemsArray = []
        for (let itemName of this.allItems){
            const instance = this.genSingleItem(itemName)
            itemsWeightArray.push([itemName, instance.rarity])
        }
        for (let i = 0; i < itemsWeightArray.length; i++){
            for (let j = 0; j < itemsWeightArray[i][1]; j++){
                itemsArray.push(this.genSingleItem(itemsWeightArray[i][0]))
            }
        }
        return itemsArray
    }

    genItems = (maxItems)=>{
        // Every item is generated a given number of times (if not given is random until 16 -> max sockets)
        // If a generation is a success the next generation will have lower chance to generate

        let numOfItems
        if (maxItems) {
            numOfItems = Math.floor(Math.random()*maxItems)+1
        } else {
            const randomMaxItems = Math.floor(Math.random()*16)
            numOfItems = Math.floor(Math.random()*randomMaxItems)+1
        }

        const generatedItems = []
        let chance = 80
        for (let i=0; i<numOfItems;i++){
            const chanceRandom = Math.floor(Math.random()*100)
            const randomIndex = Math.floor(Math.random()*this.itemsByWeightArray.length)
            if (chanceRandom < chance) {
                generatedItems.push(this.itemsByWeightArray.splice(randomIndex, 1)[0])
                chance -= 5
            } 
        }
        return generatedItems
    }
}