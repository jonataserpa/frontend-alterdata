import { LitElement, html } from 'https://unpkg.com/lit-element?module';
import 'https://temas.dev.pack.alterdata.com.br/alt/tema.js';
import 'https://resources-para-selecao-externa-dot-mf-common-dev.appspot.com/alt/toast/bulma-toast.min.js';
import { validity } from 'https://resources-para-selecao-externa-dot-mf-common-dev.appspot.com/alt/validity.js';

import { recursoService } from './recurso-service.js';

class Recurso extends LitElement {

    static get properties() {
        return {
            item: { type: Object },
            savedCallback: { type: Object },

            id: { type: String },
            longo: { type: Number },
            inteiro: { type: Number },
            decimalGrande: { type: Number },
            texto: { type: String }
        };
    }

    constructor() {
        super();

        this.item = null;
        this.savedCallback = null;

        this.id = null;
        this.longo = null;
        this.inteiro = null;
        this.decimalGrande = null;
        this.texto = null;

        this.form = null;

        this.setLongo = event => {
            let valid = validity.check(event.target, () => event.target.value, 'Vazio não pode...');
            valid = valid && validity.check(event.target, () => event.target.value !== '0', 'Zero não pode...');
            if (!valid) {
                return;
            }

            this.longo = event.target.value;
        };

        this.setInteiro = event => {
            this.inteiro = event.target.value;
        };

        this.setDecimalGrande = event => {
            this.decimalGrande = event.target.value;
        };

        this.setTexto = event => {
            this.texto = event.target.value;
        };
    }

    set item(val) {
        const old = this._item;
        this._item = val;

        if (this._item) {
            this.open(this._item);
        }

        this.requestUpdate('item', old);
    }

    get item() {
        return this._item;
    }

    getLongo() {
        return this.longo;
    }


    getInteiro() {
        return this.inteiro;
    }

    getDecimalGrande() {
        return this.decimalGrande;
    }


    getTexto() {
        return this.texto;
    }

    open(item) {
        if (!item) {
            return;
        }
        this.form = this.shadowRoot.getElementById('formRecurso');
        validity.clear(this.form);

        if (item.id) {
            Object.assign(this, item);
        } else {
            this.id = null;
            this.longo = null;
            this.inteiro = null;
            this.decimalGrande = null;
            this.texto = null;
            this.data = new Date();
        }
    }

    async save() {
        if (!this.form.reportValidity()) {
            bulmaToast.toast({ message: 'Assim não pode...', type: "is-danger" });
            return;
        }

        try {
            const puted = await recursoService.put(this);
            this.savedCallback(puted);
            bulmaToast.toast({ message: 'Salvamos!', type: "is-info" });

            this.exit();
        } catch (error) {
            bulmaToast.toast({ message: 'Não conseguimos salvar: ' + error.message, type: "is-danger" });
            console.error(error);
        }
    }

    exit() {
        this.item = null;

        document.dispatchEvent(
            new CustomEvent('ce-alt-arquetipo-recurso-exit', {
                detail: {},
                composed: true
            })
        );
    }

    render() {
        return html`

        <alt-tema></alt-tema>

        <div class="modal animated fadeIn ${this.item ? 'is-active' : ''}" id="modalRecurso">
            <div class="modal-background"></div>
            <div class="modal-card">
                <header class="modal-card-head">
                    <p class="modal-card-title">Recurso</p>
                </header>
                <section class="modal-card-body">
                    <form id="formRecurso">
        
                        <div class="columns is-multiline">
        
                            <div class="field column is-4">
                                <label class="label" for="longo">Longo</label>
                                <div class="control">
                                    <input id="longo" class="input" type="number" required .value=${this.getLongo()} @input=${this.setLongo}>
                                </div>
                                <p class="help"></p>
                            </div>
        
                            <div class="field column is-4">
                                <label class="label" for="inteiro">Inteiro</label>
                                <div class="control">
                                    <input id="inteiro" class="input" type="number" required .value=${this.getInteiro()} @input=${this.setInteiro}>
                                </div>
                                <p class="help"></p>
                            </div>
        
                            <div class="field column is-4" for="decimalGrande">
                                <label class="label">Decimal Grande</label>
                                <div class="control">
                                    <input id="decimalGrande" class="input" type="number" step="any" required .value=${this.getDecimalGrande()} @input=${this.setDecimalGrande}>
                                </div>
                                <p class="help"></p>
                            </div>
        
                            <div class="field column is-12">
                                <label class="label" for="texto">Texto</label>
                                <div class="control">
                                    <input id="texto" class="input" type="text" required .value=${this.getTexto()} @input=${this.setTexto}>
                                </div>
                                <p class="help"></p>
                            </div>
        
                        </div>
        
                    </form>
        
                </section>
                <footer class="modal-card-foot">
                    <button class="button is-primary" @click=${() => this.save()}>Salvar</button>
                    <button class="button" @click=${() => this.exit()}>Sair</button>
                </footer>
            </div>
        </div>
        
        `;
    }

}

customElements.define('alt-front-recurso', Recurso);
