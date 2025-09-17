describe('Signup flow', () => {
  it('shows email verification overlay after signup', () => {
    cy.visit('/register');
    cy.get('input[type="email"]').type('test+e2e@example.com');
    cy.get('input[type="text"]').type('e2euser');
    cy.get('input[placeholder="Create a password"]').type('password1234');
    cy.get('input[placeholder="Confirm your password"]').type('password1234');
    cy.contains('Register').click();
    // In real run this hits Firebase; for CI users should mock or stub network
    // We simply assert overlay placeholder text presence for UX
    cy.contains('Check your email', { timeout: 15000 });
  });
});


