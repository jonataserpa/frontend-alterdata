import { LitElement, html } from 'https://unpkg.com/lit-element?module';
import 'https://temas.dev.pack.alterdata.com.br/alt/tema.js';
import 'https://resources-para-selecao-externa-dot-mf-common-dev.appspot.com/alt/toast/bulma-toast.min.js';
import { validity } from 'https://resources-para-selecao-externa-dot-mf-common-dev.appspot.com/alt/validity.js';

import { clienteService } from './cliente-service.js';

class Cliente extends LitElement {

    static get properties() {
        return {
            item: { type: Object },
            savedCallback: { type: Object },

            id: { type: String },
            nome: { type: String },
            endereco: { type: String },
            telefone: { type: String },
            dataNascimento: { type: String }
        };
    }

    constructor() {
        super();

        this.item = null;
        this.savedCallback = null;

        this.id = null;
        this.nome = null;
        this.endereco = null;
        this.telefone = null;
        this.dataNascimento = null;

        this.form = null;

        this.setNome = event => {
            let valid = validity.check(event.target, () => event.target.value, 'Vazio não pode...');
            valid = valid && validity.check(event.target, () => event.target.value !== '0', 'Zero não pode...');
            if (!valid) {
                return;
            }

            this.nome = event.target.value;
        };

        this.setEndereco = event => {
            this.endereco = event.target.value;
        };

        this.setTelefone = event => {
            this.telefone = event.target.value;
        };

        this.setDataNascimento = event => {
            this.dataNascimento = event.target.value;
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

    getNome() {
        return this.nome;
    }


    getEndereco() {
        return this.endereco;
    }

    getTelefone() {
        return this.telefone;
    }


    getDataNascimento() {
        return this.dataNascimento;
    }

    open(item) {
        if (!item) {
            return;
        }
        this.form = this.shadowRoot.getElementById('formCliente');
        validity.clear(this.form);

        if (item.id) {
            Object.assign(this, item);
        } else {
            this.id = null;
            this.nome = null;
            this.endereco = null;
            this.telefone = null;
            this.dataNascimento = null;
        }
    }

    async save() {
        if (!this.form.reportValidity()) {
            bulmaToast.toast({ message: 'Assim não pode...', type: "is-danger" });
            return;
        }

        try {
            const puted = await clienteService.put(this);
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
            new CustomEvent('ce-alt-arquetipo-cliente-exit', {
                detail: {},
                composed: true
            })
        );
    }

    render() {
        return html`

        <alt-tema></alt-tema>

        <div class="modal animated fadeIn ${this.item ? 'is-active' : ''}" id="modalCliente">
            <div class="modal-background"></div>
            <div class="modal-card">
                <header class="modal-card-head">
                    <p class="modal-card-title">Cliente</p>
                </header>
                <section class="modal-card-body">
                    <form id="formCliente">
        
                        <div class="columns is-multiline">
        
                            <div class="field column is-4">
                                <label class="label" for="nome">Nome</label>
                                <div class="control">
                                    <input id="nome" class="input" type="text" required .value=${this.getNome()} @input=${this.setNome}>
                                </div>
                                <p class="help"></p>
                            </div>
        
                            <div class="field column is-4">
                                <label class="label" for="endereco">Endereço</label>
                                <div class="control">
                                    <input id="endereco" class="input" type="text" required .value=${this.getEndereco()} @input=${this.setEndereco}>
                                </div>
                                <p class="help"></p>
                            </div>
        
                            <div class="field column is-4" for="telefone">
                                <label class="label">Telefone</label>
                                <div class="control">
                                    <input id="telefone" class="input" type="text" required .value=${this.getTelefone()} @input=${this.setTelefone}>
                                </div>
                                <p class="help"></p>
                            </div>
        
                            <div class="field column is-12">
                                <label class="label" for="texto">Data Nascimento</label>
                                <div class="control">
                                    <input id="dataNascimento" class="input" type="date" required .value=${this.getDataNascimento()} @input=${this.setDataNascimento}>
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

customElements.define('alt-front-cliente', Cliente);
