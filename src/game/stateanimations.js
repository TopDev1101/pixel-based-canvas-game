class StateAnimator{
    constructor(){
        this.animations = {};
    }

    hasConflictingAnimations(){

    }

    addStateAnimation(){

    }

    /**
     * 
     * @param {Number} startingValue 
     * @param {Number} endValue 
     * @param {Number} duration Duration of animation in ms
     * @param {Function} callback callback( currentValue )
     */
    addAsyncAnimation( identity, startingValue, endValue, duration, callback ){
        if( Object.isUndefined( this.animations[identity] )){
            // Construct new animation object
        }else{
            // Interrupt the last animation and replace it with this one
        }
        var anim = this.animations[identity] = {
            delta: endValue - startingValue,
            duration:duration,
            interrupt:false,
            currentFrame:1,
            done:false
        }

        anim.frames = 60/1000 * duration;
        anim.deltaPerFrame = anim.delta / anim.frames;
        anim.nextCall = ()=>{
            if(currentFrame > anim.frames || interrupt ){
                anim.done = true;
                return;
            }
            callback( anim.currentFrame * deltaPerFrame, anim );
            setTimeout( anim.nextCall, 1000/60 );
        }
    }
}