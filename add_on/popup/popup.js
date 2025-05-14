// DOM Elements
const rulesContainer = document.getElementById('rules-container');
const addRowBtn = document.querySelector('.add-row-btn');
const emptyState = document.getElementById('empty-state');
const templateRow = document.querySelector('.template-row');
const themeToggleBtn = document.getElementById('theme-toggle');

// Event Listeners
addRowBtn.addEventListener('click', () => addRow());
rulesContainer.addEventListener('input', updateLocalStorage);
themeToggleBtn.addEventListener('click', toggleDarkMode);

document.addEventListener('DOMContentLoaded', () => {
    // Initialize the rules from storage and apply theme preferences
    browser.storage.local.get().then(data => {
        // Apply theme preference if it exists
        if (data.darkMode) {
            document.body.classList.add('dark-theme');
        }

        // Initialize rows
        initRows(data);
    });
});

/**
 * Initialize rows from browser storage
 * @param {Object} storage - The browser storage object
 */
function initRows(storage) {
    // Clear any existing rules (except template)
    const existingRules = rulesContainer.querySelectorAll('.rule:not(.template-row)');
    existingRules.forEach(rule => rule.remove());

    const ruleCount = storage.ruleCount || 0;

    // Show empty state if no rules
    if (ruleCount === 0) {
        emptyState.classList.remove('hidden');
    } else {
        emptyState.classList.add('hidden');

        // Add each rule from storage
        for (let i = 1; i <= ruleCount; i++) {
            const rule = storage[`replaceRule${i}`];
            if (rule) {
                addRow(rule.lhs, rule.rhs);
            }
        }
    }
}

/**
 * Delete a rule row with animation
 * @param {Event} event - The click event
 */
function deleteRow(event) {
    const row = event.currentTarget.closest('.rule');

    // Fade out animation
    row.style.transition = 'opacity 0.3s, transform 0.3s';
    row.style.opacity = '0';
    row.style.transform = 'translateX(10px)';

    // Remove after animation completes
    setTimeout(() => {
        row.remove();
        updateLocalStorage();

        // Show empty state if no rules left
        const remainingRules = rulesContainer.querySelectorAll('.rule:not(.template-row)');
        if (remainingRules.length === 0) {
            emptyState.classList.remove('hidden');
        }
    }, 300);
}

/**
 * Add a new rule row with animation
 * @param {string} lhs - Left-hand side (input text)
 * @param {string} rhs - Right-hand side (replacement text)
 */
function addRow(lhs = '', rhs = '') {
    // Hide empty state
    emptyState.classList.add('hidden');

    // Clone template row
    const row = templateRow.cloneNode(true);
    row.classList.remove('template-row', 'hidden');
    row.style.opacity = '0';
    row.style.transform = 'translateY(-10px)';

    // Insert before any other rules
    rulesContainer.insertBefore(row, rulesContainer.firstChild);

    // Set values and event handlers
    row.querySelector('.text-input').value = lhs;
    row.querySelector('.replacement').value = rhs;
    row.querySelector('.delete-rule-btn').addEventListener('click', deleteRow);

    // Fade in animation
    setTimeout(() => {
        row.style.transition = 'opacity 0.3s, transform 0.3s';
        row.style.opacity = '1';
        row.style.transform = 'translateY(0)';
    }, 10);

    // Setup drag functionality
    makeDraggable(row);

    updateLocalStorage();
}

/**
 * Make a row draggable for reordering
 * @param {HTMLElement} row - The row element to make draggable
 */
function makeDraggable(row) {
    const dragHandle = row.querySelector('.drag');

    dragHandle.addEventListener('mousedown', (e) => {
        e.preventDefault();

        // Highlight the row being dragged
        row.classList.add('dragging');

        const startY = e.clientY;
        const rowRect = row.getBoundingClientRect();
        const rowHeight = rowRect.height;
        const startTop = row.offsetTop;

        // Get all rule rows for potential swapping
        const allRows = Array.from(rulesContainer.querySelectorAll('.rule:not(.template-row)'));
        const rowIndex = allRows.indexOf(row);

        function onMouseMove(e) {
            const deltaY = e.clientY - startY;
            row.style.transform = `translateY(${deltaY}px)`;

            // Determine if we should swap with another row
            const currentIndex = Math.round((startTop + deltaY) / rowHeight);
            if (currentIndex >= 0 && currentIndex < allRows.length && currentIndex !== rowIndex) {
                // Reorder the array
                const movedRow = allRows.splice(rowIndex, 1)[0];
                allRows.splice(currentIndex, 0, movedRow);

                // Reorder in the DOM
                allRows.forEach(r => rulesContainer.appendChild(r));
            }
        }

        function onMouseUp() {
            // Reset styles
            row.classList.remove('dragging');
            row.style.transform = '';

            // Remove event listeners
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);

            // Update storage with new order
            updateLocalStorage();
        }

        // Add event listeners
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    });
}

/**
 * Update browser local storage with current rules
 */
function updateLocalStorage() {
    let ruleCount = 0;
    let rules = {};

    // Get all non-template rule rows
    const rows = rulesContainer.querySelectorAll('.rule:not(.template-row)');

    rows.forEach(row => {
        ruleCount++;
        const textInput = row.querySelector('.text-input').value;
        const replacement = row.querySelector('.replacement').value;

        rules[`replaceRule${ruleCount}`] = {
            lhs: textInput,
            rhs: replacement,
        };
    });

    rules.ruleCount = ruleCount;
    browser.storage.local.set({ ...rules });
}

/**
 * Toggle dark mode and save the preference
 */
function toggleDarkMode() {
    const isDarkMode = document.body.classList.toggle('dark-theme');

    // Save the preference to browser storage
    browser.storage.local.set({ darkMode: isDarkMode });

    // Apply visual feedback for the toggle
    themeToggleBtn.classList.add('theme-toggled');
    setTimeout(() => {
        themeToggleBtn.classList.remove('theme-toggled');
    }, 300);
}
