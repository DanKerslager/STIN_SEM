// script.test.js

// Import the functions to test
import { showForm, hideForm } from './script.js';

// Mock the HTML elements
document.body.innerHTML = `
    <div id="registrationForm" class="hidden"></div>
    <form id="paymentForm"></form>
`;

describe('showForm', () => {
    test('should remove the hidden class from registrationForm', () => {
        showForm();
        const form = document.getElementById('registrationForm');
        expect(form.classList.contains('hidden')).toBe(false);
    });
});

describe('hideForm', () => {
    test('should add the hidden class to registrationForm', () => {
        hideForm();
        const form = document.getElementById('registrationForm');
        expect(form.classList.contains('hidden')).toBe(true);
    });
});
