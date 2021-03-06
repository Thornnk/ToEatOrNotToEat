// General use utility functions

const checkHoverPos = (mousePos, posDim)=>{
    if (mousePos[0] > posDim[0] && mousePos[0] < posDim[0]+posDim[2] &&
        mousePos[1] > posDim[1] && mousePos[1] < posDim[1]+posDim[3]){
            return true
    } else {return false}
}

const checkClickPos = (mouseClickPos, posDim)=>{
    if (mouseClickPos[0] > posDim[0] && mouseClickPos[0] < posDim[0]+posDim[2] &&
        mouseClickPos[1] > posDim[1] && mouseClickPos[1] < posDim[1]+posDim[3]){
            return true
    } else {return false}
}

// General use utility classes
class SpriteSheet{
    constructor(img, dimensions){
        this.sheet = img

        this.rows = dimensions[0]
        this.columns = dimensions[1]
        this.totalCrops = this.rows*this.columns

        this.sheetWidth =  this.sheet.naturalWidth
        this.sheetHeight = this.sheet.naturalHeight

        this.cropWidth = this.sheetWidth/this.columns
        this.cropHeight = this.sheetHeight/this.rows

        this.crops = this.calculateAllCrops()
    }

    calculateAllCrops = ()=>{
        const bufferArray = []
        for(let i=0; i<this.totalCrops; i++){
            bufferArray.push(this.calculateCropData(i))
        }
        return bufferArray
    }

    calculateCropData = (index)=>{
        const bufferCollection = {}
        bufferCollection.x = (index%this.columns)*this.cropWidth
        bufferCollection.y = Math.floor(index/this.columns)*this.cropHeight
        bufferCollection.w = this.cropWidth
        bufferCollection.h = this.cropHeight
        return bufferCollection
    }
}

class Bar{
    constructor(type, img, imgBg, pos, initialValue, maxValue, textColor){
        this.type = type
        this.img = img
        this.imgBg = imgBg
        this.w = img.naturalWidth
        this.h = img.naturalHeight
        this.posDim = [pos[0], pos[1], this.w, this.h]
        this.value = initialValue
        this.maxValue = maxValue
        this.hovering = false
        textColor ? this.textColor = textColor : this.textColor = 'rgb(255, 255, 255, 1)'
    }

    displayBar = (value)=>{
        this.value = value
        ctx.drawImage(this.imgBg, this.posDim[0], this.posDim[1], this.w, this.h)
        ctx.drawImage(this.img, 0, 0, this.w*value/this.maxValue, this.h, 
            this.posDim[0], this.posDim[1], this.w*value/this.maxValue, this.h)
        
        const decs = 1
        const percentage = `${Math.floor(value/this.maxValue*100*decs)/decs}%`
        // const percentageTextWidth = ctx.measureText(percentage).width
        ctx.font = '15px AlbertTextBold'
        ctx.fillStyle = this.textColor
        if (this.hovering){
            ctx.fillText(this.type, this.posDim[0]+this.img.width*0.5, this.posDim[1]+20)
        } else {
            ctx.fillText(percentage, this.posDim[0]+this.img.width*0.5, this.posDim[1]+20)
        }
    }
}

class WoodenSign{
    constructor(img){
        this.img = img
        this.pos = [canvas.width*0.5-this.img.naturalWidth*0.5, -this.img.naturalHeight-155]
        this.animationDirection = 'down'
        this.showNewDay = false
        this.daysCount = 0
    }

    displayDays = (daysCount)=>{
        if (this.showNewDay){
            this.daysCount = daysCount
            this.animateSign(this.animationDirection)
        }
    }

    animateSign = (direction)=>{
        ctx.drawImage(this.img, this.pos[0], this.pos[1], 
            this.img.naturalWidth, this.img.naturalHeight)
        ctx.font = '40px AlbertTextBold'
        const dayText = `Day ${this.daysCount}`
        ctx.fillText(dayText, this.pos[0]+this.img.width*0.5, this.pos[1]+120)
        if (direction === 'down'){
            this.pos[1] += 3
            if (this.pos[1] >= -70){
                this.pos[1] = -70
                setTimeout(()=>{
                    this.animationDirection = 'up'
                }, 3000)
            }
        } else if (direction === 'up')
            this.pos[1] -= 3
            if (this.pos[1] <= -this.img.naturalHeight){
                this.animationDirection = 'down'
                this.showNewDay = false
            }
    }
}

class Mouth{
    constructor(img, state){
        this.img = img
        this.posDim = [360, 540, this.img.cropWidth, this.img.cropHeight]
        this.state = state
    }
}