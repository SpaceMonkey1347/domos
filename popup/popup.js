const table = document.querySelector('table');
const tbody = document.querySelector('tbody');
const deleteRuleBtns = document.querySelectorAll('.delete-rule-btn');
const dragEls = document.querySelectorAll('.drag');
const addRowBtn = document.querySelector('.add-row-btn');
const rowClone = table.querySelector('.clone-me');

deleteRuleBtns.forEach(btn => {
    btn.onclick = deleteRow;
})

addRowBtn.onclick = () => addRow();

tbody.addEventListener('input', updateLocalStorage)

browser.storage.local.get().then(initRows)

function initRows(storage) {
    let ruleCount = storage.ruleCount;
    for (let i = 1; i <= ruleCount; i++) {
        let rule = storage[`replaceRule${i}`];
        addRow(rule.lhs, rule.rhs);
    }
}

function deleteRow(event) {
    let currTarget = event.target;
    while (currTarget.tagName != "TR") {
        currTarget = currTarget.parentElement;
    }
    currTarget.remove();
    updateLocalStorage();
}

function addRow(lhs = '', rhs = '') {
    const row = rowClone.cloneNode(true);
    row.classList.remove('clone-me');
    tbody.insertBefore(row, rowClone);
    row.querySelector('.delete-rule-btn').onclick = deleteRow;
    row.querySelector('.text-input').value = lhs;
    row.querySelector('.replacement').value = rhs;
    updateLocalStorage();
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
    browser.storage.local.set({ ...rules });
}
