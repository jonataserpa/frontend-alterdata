import { LitElement, html } from 'https://unpkg.com/lit-element?module';
import 'https://temas.dev.pack.alterdata.com.br/alt/tema.js';

class Home extends LitElement {

    static get properties() {
        return {
            active: { type: Boolean }
        };
    }

    constructor() {
        super();
    }

    render() {
        if (!this.active) {
            return html``;
        }

        return html`
        <alt-tema></alt-tema>

        <div class="animated fadeIn">

            <h1 class="title">
                Olá e boa sorte!
            </h1>

            <h2 class="subtitle">
                Esta é uma avaliação de recrutamento para a Alterdata Software:
            </h2>

            <p>O código fornecido aqui tem como único objetivo auxiliar na avaliação de um candidato e é de propriedade intelectual da Alterdata; isto inclui todo e qualquer recurso originado do domínio <strong>alterdata.com.br</strong>.</p>
            <p>O material de propriedade intelectual da Alterdata não é licenciado para que seja utilizado por você ou quem quer que seja fora desta avaliação.</p>
            <p>As ferramentas e códigos de terceiros são regidos por suas próprias licenças.</p>

        </div>
        `;
    }

}

customElements.define('alt-front-home', Home);
