import { LitElement, html } from 'https://unpkg.com/lit-element?module';
import { router } from 'https://resources-para-selecao-externa-dot-mf-common-dev.appspot.com/alt/router.js';
import 'https://temas.dev.pack.alterdata.com.br/alt/tema.js';


class Nav extends LitElement {

    constructor() {
        super();
    }

    firstUpdated() {
        this.burger = this.shadowRoot.querySelector('.navbar-burger');
        this.menu = this.shadowRoot.querySelector('#' + this.burger.dataset.target);
    }

    burgerClick(event) {
        this.burger.classList.toggle('is-active');
        this.menu.classList.toggle('is-active');
    }

    navigateTo(route) {
        router.navigate(route);
        this.burger.classList.remove('is-active');
        this.menu.classList.remove('is-active');
    }

    render() {
        return html`
        <alt-tema></alt-tema>
    
        <nav class="navbar is-primary">
            
            <div class="navbar-brand">
                <span class="navbar-item">
                    <img src="https://temas.dev.pack.alterdata.com.br/assets/logos/alterdata_small.svg" width="48" height="48" alt="logo">
                </span>
                <div class="navbar-burger" aria-label="menu" aria-expanded="false" data-target="navbar-menu" @click=${event => this.burgerClick(event)}>
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                </div>
            </div>
    
            <div id="navbar-menu" class="navbar-menu">
                <div class="navbar-start">
                    <a class="navbar-item" @click=${() => this.navigateTo('/')}>
                        Principal
                    </a>

                    <a class="navbar-item" @click=${() => this.navigateTo('/recursos')}>
                        Recursos
                    </a>
                    
                    <a class="navbar-item" @click=${() => this.navigateTo('/clientes')}>
                        Clientes
                    </a>
    
                    <a class="navbar-item" href="https://gitlab.com/alterdata1/pack/selecao/frontend"
                        target="_tab">
                        Documentação
                    </a>
    
                    <div class="navbar-item has-dropdown is-hoverable is-hidden-mobile">
                        <a class="navbar-link">
                            Mais
                        </a>
                        <div class="navbar-dropdown is-boxed">
                            <a class="navbar-item" href="https://alterdata.com.br" target="_tab">
                                Sobre
                            </a>
                            <a class="navbar-item" href="https://jobs.kenoby.com/alterdata/" target="_tab">
                                Carreira
                            </a>
                        </div>
                    </div>
                </div>
                <div class="navbar-end">
                    <button id="btn-login"  class="ui primary button" onclick="login()">Login</button>
                    <button id="btn-logout" class="ui primary button" onclick="logout()">Logout</button>
                </div>
            </div>
        </nav>
      `;
    }

}

customElements.define('alt-front-nav', Nav);
