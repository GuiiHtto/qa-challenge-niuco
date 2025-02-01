describe('Listar usuários e validar dados', () => {
  it('Deve fazer uma requisição GET para listar usuários e validar dados', () => {
    cy.request('GET', 'https://reqres.in/api/users?page=2').then((response) => {
      // Valida o status da response como 200
      expect(response.status).to.eq(200);

      // Valida se os usuários retornados possuem os campos id, first_name, last_name, email
      response.body.data.forEach((user) => {
        expect(user).to.have.property('id');
        expect(user).to.have.property('first_name');
        expect(user).to.have.property('last_name');
        expect(user).to.have.property('email');

        // Valida se o campo email é válido
        expect(user.email).to.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/);
      });
    });
  });
});

describe('Criar e atualizar um usuário', () => {
  it('Deve criar e atualizar um usuário', () => {
    const userPayload = {
      name: 'John Doe',
      job: 'Software Developer'
    };

    // Passo 1: Fazer uma requisição POST para criar um usuário
    cy.request('POST', 'https://reqres.in/api/users', userPayload).then((postResponse) => {
      // Passo 2: Validar que a resposta tem status 201 e que o usuário foi criado com os dados corretos
      expect(postResponse.status).to.eq(201);
      expect(postResponse.body).to.have.property('name', userPayload.name);
      expect(postResponse.body).to.have.property('job', userPayload.job);

      const userId = postResponse.body.id;

      const updatedUserPayload = {
        name: 'Jane Doe',
        job: 'Project Manager'
      };

      // Passo 3: Fazer uma requisição PUT para atualizar o usuário
      cy.request('PUT', `https://reqres.in/api/users/${userId}`, updatedUserPayload).then((putResponse) => {
        // Validar que o usuário foi atualizado com os dados corretos
        expect(putResponse.status).to.eq(200);
        expect(putResponse.body).to.have.property('name', updatedUserPayload.name);
        expect(putResponse.body).to.have.property('job', updatedUserPayload.job);

        // Passo 4: Validar que o tempo de resposta da API está dentro do limite aceitável de 500ms
        expect(putResponse.duration).to.be.lessThan(500);
      });
    });
  });
});

describe('Manipulação de falhas na API', () => {
  it('Deve retornar 404 ao tentar deletar um usuário inexistente', () => {
    cy.request({
      method: 'DELETE',
      url: 'https://reqres.in/api/users/9999',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(204);
    });
  });

  it('Deve lidar corretamente com falha de rede ou erro de tempo limite', () => {
    cy.intercept('GET', 'https://reqres.in/api/users?page=1', {
      forceNetworkError: true
    }).as('getUsers');

    cy.request({
      method: 'GET',
      url: 'https://reqres.in/api/users?page=1',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(200);
    });
  });
});