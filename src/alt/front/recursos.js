import { LitElement, html } from 'https://unpkg.com/lit-element?module';
import 'https://temas.dev.pack.alterdata.com.br/alt/tema.js';
import 'https://resources-para-selecao-externa-dot-mf-common-dev.appspot.com/alt/toast/bulma-toast.min.js';
import 'https://resources-para-selecao-externa-dot-mf-common-dev.appspot.com/alt/datatable/datatable.js';
import { formatMoney, formatDateTime } from 'https://resources-para-selecao-externa-dot-mf-common-dev.appspot.com/alt/intl.js';

import { recursoService } from './recurso-service.js';
import './recurso.js';

class Recursos extends LitElement {

    static get properties() {
        return {
            active: { type: Boolean },
            status: { type: String },
            longo: { type: Number },
            inteiro: { type: Number },
            itens: { type: Array },
            selected: { type: Object },
            save: { type: Object }
        };
    }

    constructor() {
        super();
        this.active = false;

        this.longo = '';
        this.inteiro = '';

        this.columns = [
            {
                name: 'inteiro',
                label: 'Inteiro'
            },
            {
                name: 'longo',
                label: 'Longo'
            },
            {
                name: 'decimalGrande',
                label: 'Decimal Grande',
                format: formatMoney
            },
            {
                name: 'texto',
                label: 'Texto'
            },
            {
                name: 'data',
                label: 'Data',
                format: formatDateTime
            },
        ];

        this.itens = [];
        this.status = 'is-empty';

        this.selected = null;
        this.save = (item) => console.log('[save] ' + item);

        this.cursor = null;

        this.setInteiro = event => {
            this.inteiro = event.target.value;
        };

        this.setLongo = event => {
            this.longo = event.target.value;
        };

        document.addEventListener('ce-alt-arquetipo-recurso-exit', event => {
            this.selected = null;
        }, false);

    }

    getInteiro() {
        return this.inteiro;
    }

    getLongo() {
        return this.longo;
    }

    async filter() {
        this.status = 'is-loading';
        try {
            const list = await recursoService.list(this.inteiro, this.longo, null);
            this.itens = list.data;
            this.cursor = list.cursor;
            this.status = this.itens.length === 0 ? 'is-empty' : '';
        } catch (error) {
            console.error(error);
            this.status = 'is-danger';
        }
    }

    add() {
        this.selected = {};
        this.save = saved => {
            const itens = [...this.itens];
            itens.unshift(saved);
            this.itens = itens;
        };
    }

    select(item) {
        this.selected = item;
        this.save = saved => {
            const itens = [...this.itens];
            const finded = itens.find(i => {
                return i.id == saved.id;
            });
            const index = itens.indexOf(finded);
            itens[index] = saved;
            this.itens = itens;
        };
    }

    async delete(item) {
        try {
            await recursoService.delete(item);
            bulmaToast.toast({ message: 'Excluímos!', type: "is-info" });

            const itens = [...this.itens];
            const finded = itens.find(i => {
                return i.id == item.id;
            });
            const index = itens.indexOf(finded);
            itens.splice(index, 1);
            this.itens = itens;
        } catch (error) {
            console.error(error);
            this.status = 'is-danger';
        }
    }

    async loadMore(event) {
        const button = event.target;
        button.classList.add('is-loading');
        try {
            const list = await recursoService.list(this.longo, this.inteiro, this.cursor);
            button.classList.remove('is-loading');
            if (list.data.length === 0) {
                button.innerHTML = 'É só isso... por enquanto!';
            }

            this.cursor = list.cursor;
            this.itens = this.itens.concat(list.data);
        } catch (error) {
            console.error(error);
            this.status = 'is-danger';
        }
    }

    render() {
        if (!this.active) {
            return html``;
        }

        return html`
        <alt-tema></alt-tema>

        <div class="animated fadeIn">
    
            <h1 class="subtitle">
                Recursos
            </h1>

            <div class="columns is-mobile">
                <div class="column field">
                    <label class="label" for="longo">Longo</label>
                    <div class="control">
                        <input id="longo" class="input" type="number" .value=${this.getLongo()} @change=${this.setLongo}>
                    </div>
                </div>
                <div class="column field">
                    <label class="label" for="inteiro">Inteiro</label>
                    <div class="control">
                        <input id="inteiro" class="input" type="number" .value=${this.getInteiro()} @change=${this.setInteiro}>
                    </div>
                </div>
                <div class="column">
                    <button class="button is-primary" @click=${() => this.filter()}>
                        <span class="icon">
                            <i class="material-icons">filter_list</i>
                        </span>
                    </button>
                    <button class="button" @click=${() => this.add()}>
                        <span class="icon">
                            <i class="material-icons">add</i>
                        </span>
                    </button>
                </div>
            </div>  

            <alt-datatable .status=${this.status} .dataSource=${this} .data=${this.itens}></alt-datatable>

        </div>

        <alt-front-recurso .item=${this.selected} .savedCallback=${this.save} ></alt-front-recurso>
        `;
    }

}

customElements.define('alt-front-recursos', Recursos);
