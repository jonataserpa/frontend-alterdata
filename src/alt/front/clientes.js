import { LitElement, html } from 'https://unpkg.com/lit-element?module';
import 'https://temas.dev.pack.alterdata.com.br/alt/tema.js';
import 'https://resources-para-selecao-externa-dot-mf-common-dev.appspot.com/alt/toast/bulma-toast.min.js';
import 'https://resources-para-selecao-externa-dot-mf-common-dev.appspot.com/alt/datatable/datatable.js';
import { formatMoney, formatDateTime } from 'https://resources-para-selecao-externa-dot-mf-common-dev.appspot.com/alt/intl.js';

import { clienteService } from './cliente-service.js';
import './cliente.js';
class Clientes extends LitElement {

    static get properties() {
        return {
            active: { type: Boolean },
            status: { type: String },
            nome: { type: String },
            endereco: { type: String },
            telefone: { type: String },
            dataNascimento: { type: String },
            itens: { type: Array },
            selected: { type: Object },
            save: { type: Object }
        };
    }

    constructor() {
        super();
        this.active = false;

        this.nome = '';
        this.endereco = '';
        this.telefone = '';
        this.dataNascimento = '';

        this.columns = [
            {
                name: 'nome',
                label: 'Nome'
            },
            {
                name: 'endereco',
                label: 'Endereço'
            },
            {
                name: 'telefone',
                label: 'Telefone'
            },
            {
                name: 'dataNascimento',
                label: 'Data Nascimento'
            },
        ];

        this.itens = [];
        this.status = 'is-empty';

        this.selected = null;
        this.save = (item) => console.log('[save] ' + item);

        this.cursor = null;

        this.setNome = event => {
            this.nome = event.target.value;
        };

        this.setEndereco = event => {
            this.endereco = event.target.value;
        };
        
        this.setTelefone = event => {
            this.telefone = event.target.value;
        };
        
        this.setDataNascimentp = event => {
            this.dataNascimento = event.target.value;
        };

        document.addEventListener('ce-alt-arquetipo-cliente-exit', event => {
            this.selected = null;
        }, false);

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

    async filter() {
        this.status = 'is-loading';
        try {
            const list = await clienteService.list(this.nome, this.endereco, this.telefone, this.dataNascimento);
            this.itens = list;
            this.cursor = list.cursor;
            if(this.itens != undefined){
                this.status = this.itens.length === 0 ? 'is-empty' : '';
            }else{
                this.status = "";
            }
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
            await clienteService.delete(item);
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
            const list = await clienteService.list(this.nome, this.endereco, this.telefone, this.dataNascimento);
            button.classList.remove('is-loading');
            if (list.length === 0) {
                button.innerHTML = 'É só isso... por enquanto!';
            }

            this.cursor = list.cursor;
            this.itens = this.itens.concat(list);
        } catch (error) {
            console.error(error);
            this.status = 'is-danger';
        }
    }

    render() {
        if (!this.active) {
            return html``;
        }
        var i;
        //for (i = 0; i < list.length; i++) {
        return html`
            <alt-tema></alt-tema>

            <div class="animated fadeIn">
    
                <h1 class="subtitle">
                    Clientes
                </h1>

                <div class="columns is-mobile">
                    <div class="column field">
                        <label class="label" for="nome">Nome</label>
                        <div class="control">
                            <input id="nome" class="input" type="text" .value=${this.getNome()} @change=${this.setNome}>
                        </div>
                    </div>
                    <div class="column field">
                        <label class="label" for="endereco">Endereço</label>
                        <div class="control">
                            <input id="endereco" class="input" type="text" .value=${this.getEndereco()} @change=${this.setEndereco}>
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
                
                <alt-front-cliente .item=${this.selected} .savedCallback=${this.save} ></alt-front-cliente>
                `;
        }

}

customElements.define('alt-front-clientes', Clientes);
