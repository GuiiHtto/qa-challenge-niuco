import axios from 'axios';
import { expect } from 'chai';

const BASE_URL = 'https://reqres.in/api';
const USERS_ENDPOINT = `${BASE_URL}/users`;

interface User {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
}

interface CreateUserResponse {
    name: string;
    job: string;
    id?: string;
    createdAt?: string;
}

interface UpdateUserResponse {
    name: string;
    job: string;
    updatedAt?: string;
}

describe('Reqres API Tests', () => {
    it('Listar usuários e validar dados', async () => {
        const response = await axios.get(`${USERS_ENDPOINT}?page=2`);
        expect(response.status).to.equal(200);
        expect(response.data).to.have.property('data').that.is.an('array');

        const users: User[] = response.data.data;
        expect(users).to.have.lengthOf.at.least(1);

        users.forEach(user => {
            expect(user).to.have.property('id').that.is.a('number');
            expect(user).to.have.property('first_name').that.is.a('string');
            expect(user).to.have.property('last_name').that.is.a('string');
            expect(user).to.have.property('email').that.is.a('string').and.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
        });
    });

    it('Criar e atualizar um usuário', async () => {
        const createUserPayload = {
            name: 'John Doe',
            job: 'Software Developer'
        };
        const createResponse = await axios.post<CreateUserResponse>(USERS_ENDPOINT, createUserPayload);
        expect(createResponse.status).to.equal(201);
        expect(createResponse.data).to.include(createUserPayload);
        expect(createResponse.data).to.have.property('id').that.is.a('string');

        const updateUserPayload = {
            name: 'Jane Doe',
            job: 'Project Manager'
        };
        const updateResponse = await axios.put<UpdateUserResponse>(`${USERS_ENDPOINT}/2`, updateUserPayload);
        expect(updateResponse.status).to.equal(200);
        expect(updateResponse.data).to.include(updateUserPayload);

        const getResponse = await axios.get(`${USERS_ENDPOINT}/2`);
        expect(getResponse.status).to.equal(200);
        expect(getResponse.data.data).to.include(updateUserPayload);

        const responseTime = getResponse.headers['x-response-time'];
        expect(Number(responseTime)).to.be.below(500);
    });

    it('Manipulação de falhas na API', async () => {
        try {
            await axios.delete(`${USERS_ENDPOINT}/999`);
        } catch (error) {
            expect(error.response.status).to.equal(404);
            expect(error.response.data).to.be.empty;
        }

        try {
            await axios.get(`${USERS_ENDPOINT}?page=1`, { timeout: 1 });
        } catch (error) {
            expect(error.code).to.equal('ECONNABORTED');
        }
    });
});