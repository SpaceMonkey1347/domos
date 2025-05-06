(() => {
    if (window.hasRun) {
        return;
    }
    window.hasRun = true;

    let replaceInputStrs = [
        { lhs: 'foo', rhs: 'ℕ' },
        { lhs: 'foobar', rhs: 'this should not work because we already have foo!' },
        { lhs: 'est', rhs: 'There\'s an "est" in "test"' },
        { lhs: 'test', rhs: 'This is a test!' },
        { lhs: 'mult', rhs: 'multi\nline test' },
    ];

    init();

    function init() {
        browser.storage.local.get('config').then(TODO);

        browser.storage.local.onChanged.addListener(() => {
            browser.storage.local.get('config').then(TODO)
        });

        replaceInputStrs.sort((a, b) => a.lhs.length + b.lhs.length)
        document.addEventListener('input', processInput, true);
    }

    function processInput(event) {
        const allowedInputTypes = [
            'insertText',
            'insertLineBreak',
        ]

        if (!allowedInputTypes.includes(event.inputType)) {
            return;
        }

        let preCarotText;
        let replaceInputFn;
        const tagName = event.target.tagName;
        if (tagName === 'TEXTAREA' || tagName === 'INPUT') {
            preCarotText = getTextUntilCaretValue(event);
            replaceInputFn = replaceInputValue
        } else {
            preCarotText = getTextUntilCaretTextNode(event);
            replaceInputFn = replaceInputTextNode
        }
        for (const index in replaceInputStrs) {
            const lhs = replaceInputStrs[index].lhs
            const rhs = replaceInputStrs[index].rhs
            if (preCarotText.endsWith(lhs)) {
                replaceInputFn(event, lhs, rhs);
                return;
            }
        }
    }

    function replaceInputValue(event, lhs, rhs) {
        const currCaret = event.target.selectionStart;
        const nextCaret = currCaret - lhs.length + rhs.length;
        const lhsStart = currCaret - lhs.length;
        const lhsEnd = currCaret;

        event.target.value = replaceSubstring(event.target.value, rhs, lhsStart, lhsEnd);
        event.target.selectionStart = nextCaret;
        event.target.selectionEnd = nextCaret;
    }

    function replaceInputTextNode(_, lhs, rhs) {
        const selection = window.getSelection();

        const currNode = selection.focusNode;
        const currCaret = selection.focusOffset;
        const nextCaret = currCaret - lhs.length + rhs.length;
        
        const lhsStart = currCaret - lhs.length;
        const lhsEnd = currCaret;

        currNode.nodeValue = replaceSubstring(currNode.nodeValue, rhs, lhsStart, lhsEnd);
        const range = document.createRange();
        range.setStart(currNode, nextCaret);
        range.setEnd(currNode, nextCaret);
        selection.removeAllRanges();
        selection.addRange(range);
    }

    function getTextUntilCaretValue(event) {
        const selectionStart = event.target.selectionStart;
        return event.target.value.substring(0, selectionStart);
    }

    function getTextUntilCaretTextNode(_) {
        const selection = window.getSelection();
        const focusOffset = selection.focusOffset;
        const currNode = selection.focusNode;

        return currNode.nodeValue.substring(0, focusOffset);
    }

    function replaceSubstring(original, replacement, startIndex, endIndex) {
        const res = original.substring(0, startIndex)
            + replacement + original.substring(endIndex);
        return res;
    }

    function TODO() {}

    function logStorageChange(changes) {
        const changedItems = Object.keys(changes);
        for (const item of changedItems) {
            console.log('Old value: ', changes[item].oldValue);
            console.log('New value: ', changes[item].newValue);
        }
    }

})();
