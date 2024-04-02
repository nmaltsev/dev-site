function emptyNode(node){
    if (!node) return;
    var 	i = node.childNodes.length;

    while (i-- > 0){
        node.removeChild(node.childNodes[i]);
    }
    return node;
}

function forEachElement(node, cb) {
	let $next = node.firstElementChild;
	if (!$next) return;
	let $current;
	do {
		$current = $next;
		$next = $next.nextElementSibling;
		cb($current);
	} while($next);
}
/**
<custom-legend 
    labels="<2;2-5;5-8;8-11;11-14;14-17;17-20;20-23;23-26;26-29;29-32;32-35;35-38;>38" 
    colors="#f1f8e9;#dcedc8;#c5e1a5;#aed581;#9ccc65;#8bc34a;#7cb342;#689f38;#558b2f;#33691e;#ccff90;#b2ff59;#76ff03;#64dd17"/>  
*/

class LegendBox extends HTMLElement {
    #$root = null;
    #$bar = null;
    #$scale = null;
    #props_colors = null;
    #props_labels = null;
    #timeout = null;
    
    constructor() {
        super();
        console.log('ABC');
    }

    static get observedAttributes() {
        return ['colors', 'labels'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        // console.log('[ATTR VALUE %s] %s -> %s', name, oldValue, newValue);
        if (name === 'colors') {
            this.#props_colors = newValue;
        }
        else if (name === 'labels') {
            this.#props_labels = newValue;
        }
        clearTimeout(this.#timeout)
        this.#timeout = setTimeout(() => this.#render(), 1);
    }

    connectedCallback() {
        const $root = this.attachShadow({mode: 'open'});
		$root.innerHTML = this.constructor.template;
        this.#$root = $root;
        this.#$bar = $root.getElementById('bar');
        this.#$scale = $root.getElementById('scale');
    }

    disconnectedCallback()  {
        // TODO
    }

 
	#render() {
        const colors = this.#props_colors.split(';');
        const n_steps = colors.length;
        const step = 100/n_steps;
        const gradient_rule = colors.map(function(color, i){
            return color + ' ' + (i * step + '%') + ', ' + color + ' ' + ((i + 1) * step + '%') 
        }).join(', ');
        this.#$bar.style.background = 'repeating-linear-gradient(' + gradient_rule + ')';

        emptyNode(this.#$scale);
        const labels = this.#props_labels.split(';');
        labels.forEach((label) => {
            let $node = document.createElement('div');
            $node.textContent = label;
            this.#$scale.appendChild($node);
        })
    }

    static template = `
<style>
:host {
    display: inline-flex;
}
#bar {
    min-height: 200px;
    width: 30px;
}
#scale {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    margin-left: .5rem;
    text-align:center;
}
</style>
<div id="bar"></div>
<div id="scale"></div>
`
};
customElements.define('custom-legend', LegendBox);
