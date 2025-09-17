describe('Login flow', () => {
  it('logs in and redirects to home', () => {
    cy.visit('/');
    cy.get('input[type="email"]').type('existing@example.com');
    cy.get('input[type="password"]').type('password1234');
    cy.get('#agree').check();
    cy.contains('Log In').click();
    cy.location('pathname', { timeout: 15000 }).should('eq', '/home');
  });
});


