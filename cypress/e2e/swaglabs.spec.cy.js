describe('Swag Labs UI Test Flows', () => {
    beforeEach(() => {
        cy.visit('https://www.saucedemo.com/');
    });

    it('Deve efetuar o login com sucesso', () => {
        cy.get('#user-name').type('standard_user');
        cy.get('#password').type('secret_sauce');
        cy.get('#login-button').click();
        cy.url().should('include', '/inventory.html');
    });

    it('Deve validar o login com erro', () => {
        cy.get('#user-name').type('invalid_user');
        cy.get('#password').type('invalid_password');
        cy.get('#login-button').click();
        cy.get('.error-message-container').should('be.visible');
    });

    it('Adiciona e remove produtos do carrinho', () => {
        cy.get('#user-name').type('standard_user');
        cy.get('#password').type('secret_sauce');
        cy.get('#login-button').click();

        cy.get('.inventory_item').eq(0).find('button').click();
        cy.get('.inventory_item').eq(1).find('button').click();
        cy.get('.inventory_item').eq(2).find('button').click();

        cy.get('.shopping_cart_badge').should('contain', '3');

        cy.get('.shopping_cart_link').click();
        cy.get('.cart_item').eq(0).find('.cart_button').click();
        cy.get('.cart_item').eq(1).find('.cart_button').click();

        cy.get('.shopping_cart_badge').should('contain', '1');
        cy.get('.cart_item').should('have.length', 1);
    });

    it('Exibir mensagem de erro ao efetuar o checkout', () => {
        cy.get('#user-name').type('standard_user');
        cy.get('#password').type('secret_sauce');
        cy.get('#login-button').click();

        cy.get('.inventory_item').eq(0).find('button').click();
        cy.get('.shopping_cart_link').click();
        cy.get('.checkout_button').click();
        cy.get('.cart_button').click();

        cy.get('.error-message-container').should('be.visible');
    });
});