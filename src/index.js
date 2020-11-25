class Compile{
    el;
    vm;
    constructor(args){
        Object.assign(this, args);
        const {el} = args;
        if(typeof el === 'string'){
            this.el = document.querySelector(el);
        }else if(el.nodeType === 1){

        }
    }
}

class Vue{
    $el;
    constructor(args){
        Object.assign(this, args);
        const {$el} = this;
        if($el){
            window.compile = new Compile({el: $el, vm: this})
        }
    }
}