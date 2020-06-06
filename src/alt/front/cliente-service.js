class ClienteService {

    constructor() {
        this.microservice = 'http://localhost:8080';
        this.endpoint = '/api/v1/clientes';

        //Migalha de pão para o pleno...
        this.token = '';
        document.addEventListener('ce-alt-sso-token', event => {
            this.token = event.detail;
        }, false);
    }

    async list(nome, endereco, cursor) {
        nome = parseInt(nome);
        endereco = parseInt(endereco);

        let queryString = '';
        if (cursor) {
            queryString = queryString + 'cursor=' + cursor;
        }
        if (nome) {
            if (queryString) {
                queryString = queryString + '&';
            }
            queryString = queryString + 'nome=' + nome;
        }
        if (endereco) {
            if (queryString) {
                queryString = queryString + '&';
            }
            queryString = queryString + 'endereco=' + endereco;
        }
        if (queryString) {
            queryString = '?' + queryString;
        }

        queryString = encodeURI(queryString);

        const init = {
            headers: {
                //Authorization: 'Bearer ' + this.token
            }
        };
        const response = await fetch(this.microservice + this.endpoint + queryString, init);
        if (response.ok) {
            return response.json();
        }
        if (response.status === 401) {
            window.location.reload(true);
        }
        throw new Error('HTTP ' + response.status);
    }

    async put(item) {
        let url = this.microservice + this.endpoint;
        let method = 'POST';

        var d = new Date();
        var n = d.getHours();
        var m = d.getMinutes();
        var s = d.getSeconds();

        var data= item.dataNascimento;//.concat(" ").concat(n).concat(":").concat(m).concat(":").concat(s);
        //2018-04-02T21:57:16.307Z
        let dto = {
            id: item.id,
            nome: item.nome,
            endereco: item.endereco,
            telefone: item.telefone,
            dataNascimento : data
        };

        if (dto.id) {
            //url = url + '/' + dto.id;
            url = url + '/';
            //method = 'PATCH';
        }

        const init = {
            headers: {
                'Content-Type': 'application/json'
            },
            method: method,
            body: JSON.stringify(dto)
        };
        const response = await fetch(url, init);
        if (response.ok) {
            return response.json();
        }
        if (response.status === 401) {
            window.location.reload(true);
        }
        throw new Error('HTTP ' + response.status);
    }

    async delete(item) {
        const init = {
            headers: {
                //Authorization: 'Bearer ' + this.token,
                'Content-Type': 'application/json'
            },
            method: 'DELETE'
        };
        const response = await fetch(this.microservice + this.endpoint + '/' + item.id, init);
        if (response.ok) {
            return response.text();
        }
        if (response.status === 401) {
            window.location.reload(true);
        }
        throw new Error('HTTP ' + response.status);
    }

}

export const clienteService = new ClienteService();
