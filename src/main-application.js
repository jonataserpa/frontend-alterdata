import { LitElement, html } from 'https://unpkg.com/lit-element?module';
import { splash } from 'https://temas.dev.pack.alterdata.com.br/alt/splash.js';
import 'https://temas.dev.pack.alterdata.com.br/alt/tema.js';
import { router } from 'https://resources-para-selecao-externa-dot-mf-common-dev.appspot.com/alt/router.js';


import './alt/front/nav.js';
import './alt/front/home.js';
import './alt/front/recursos.js';

class Frontend extends LitElement {

    static get properties() {
        return {
            route: { type: String }
        };
    }

    constructor() {
        super();
    }

    routing() {
        router
            .on(() => {
                this.route = '';
            })
            .on('/recursos', () => {
                this.route = 'recursos';
            })
            .resolve();
    }

    firstUpdated() {
        this.routing();
        splash.hide();
    }

    render() {
        return html`
        <alt-tema></alt-tema>

        <alt-front-nav></alt-front-nav>
        
        <div class="hero">
            <div class="hero-body">
                <alt-front-home ?active="${this.route === ''}"></alt-front-home>
                <alt-front-recursos ?active="${this.route === 'recursos'}"></alt-front-recursos>
            </div>
        </div>
        `;
    }

}

customElements.define('alt-front', Frontend);
