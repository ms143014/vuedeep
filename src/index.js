class CompileUtils{
    /**
     * @param expr 表达式
     */
    static getValue(target, expr){
        expr = expr.split('.');
        let property;
        while(property = expr.shift()){
            target = target[property];
        }
        return target;
    }
}
window.CompileUtils = CompileUtils;
class Compile{
    el;
    vm;
    constructor(args){
        let el = this.el = args.el;
        const vm = this.vm = args.vm;
        el = this._isDom(el) ? el: document.querySelector(el);

        //使用VDOM减少DOM回流和重绘
        const fragment = document.createDocumentFragment();
        let dom;
        while(dom = el.firstChild){
            fragment.appendChild(dom);
        }
        this._compile(fragment);
        el.appendChild(fragment);
    }
    _isDom(expr){
        return expr && expr.nodeType && expr.nodeType === 1;
    }
    /** 编译一个节点*/
    _compile(node){
        const childNodes = node.childNodes;
        [...childNodes].forEach(child=>{
            if(this._isDom(child)){
                this._renderNode(child);
                child.childNodes.length > 0 && this._compile(child);
            }else{
                this._renderText(child);
            }
        })
    }
    //处理标签和事件
    _renderNode(node){
        [...node.attributes].forEach(function(attr){
            const {name, value} = attr;
            if(name.startsWith('v-')){
                const [,dirctive] = attr.name.split('-');
                if(dirctive === 'html'){
                    node.innerHTML = CompileUtils.getValue(this.vm.$data, attr.value);
                }else if(dirctive === 'text'){
                    node.innerText = CompileUtils.getValue(this.vm.$data, attr.value);
                }
            }
        }.bind(this));
    }
    _renderText(text){
        text.textContent = text.textContent.replace(/\{\{([\w\.]+)\}\}/ig, ($0, $1)=> CompileUtils.getValue(this.vm.$data, $1));
    }
}

/**保存Vue配置信息，不涉及DOM和解析 */
class Vue{
    $el;
    $data;
    $options;
    constructor(args){
        this.$el = args.el;
        this.$data = args.data;
        this.$options = args;
        const {$el} = this;
        if($el){
            window.compile = new Compile({el: $el, vm: this})
        }
    }
}