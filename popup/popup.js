// browser.storage.local.get("config").then(init)

const table = document.querySelector('table');
const tbody = document.querySelector('tbody');
const deleteRuleBtns = document.querySelectorAll('.delete-rule-btn');
const dragEls = document.querySelectorAll('.drag');
const addRowBtn = document.querySelector('.add-row-btn');
const rowClone = table.querySelector('.clone-me');

deleteRuleBtns.forEach(btn => {
    btn.onclick = deleteRow;
})

addRowBtn.onclick = createRow;

tbody.addEventListener('input', updateLocalStorage)

function deleteRow(event) {
    event.target.parentElement.parentElement.parentElement.remove();
}

function createRow() {
    const row = rowClone.cloneNode(true);
    row.classList.remove('clone-me');
    tbody.insertBefore(row, rowClone);
    row.querySelector('.delete-rule-btn').onclick = deleteRow;
}

function updateLocalStorage() {
    let ruleCount = 0;
    let rules = {};
    tbody.childNodes.forEach(row => {
        if (!row.classList || !row.classList.contains('rule')
            || row.classList.contains('clone-me')) {
            return;
        }
        ruleCount++;
        const textInput = row.querySelector('.text-input').value
        const replacement = row.querySelector('.replacement').value
        rules[`replaceRule${ruleCount}`] = {
            lhs: textInput,
            rhs: replacement,
        }
    })
    rules.ruleCount = ruleCount;
        
    for (const key in rules) {
        const value = rules[key]
        browser.storage.local.set({ [key]: value });
    }
    browser.storage.local.set({ ruleCount: ruleCount });
    browser.storage.local.get().then(console.log)
}
