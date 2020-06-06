class RecursoService {

    constructor() {
        this.microservice = 'http://localhost:8080';
        this.endpoint = '/api/v1/recursos';

        //Migalha de pão para o pleno...
        this.token = '';
        document.addEventListener('ce-alt-sso-token', event => {
            this.token = event.detail;
        }, false);
    }

    async list(longo, inteiro, cursor) {
        longo = parseInt(longo);
        inteiro = parseInt(inteiro);

        let queryString = '';
        if (cursor) {
            queryString = queryString + 'cursor=' + cursor;
        }
        if (inteiro) {
            if (queryString) {
                queryString = queryString + '&';
            }
            queryString = queryString + 'inteiro=' + inteiro;
        }
        if (longo) {
            if (queryString) {
                queryString = queryString + '&';
            }
            queryString = queryString + 'longo=' + longo;
        }
        if (queryString) {
            queryString = '?' + queryString;
        }

        queryString = encodeURI(queryString);

        const init = {
            headers: {
                Authorization: 'Bearer ' + this.token
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

        let dto = {
            id: item.id,
            longo: item.longo,
            inteiro: item.inteiro,
            decimalGrande: item.decimalGrande,
            texto: item.texto,
            data: item.data
        };

        if (dto.id) {
            url = url + '/' + dto.id;
            method = 'PATCH';
        }

        const init = {
            headers: {
                Authorization: 'Bearer ' + this.token,
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
                Authorization: 'Bearer ' + this.token,
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

export const recursoService = new RecursoService();
