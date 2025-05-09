(() => {
    if (window.hasRun) {
        return;
    }
    window.hasRun = true;

    let replaceRules = [
        { lhs: 'Is domos working?', rhs: 'No user-defined rules have been set!' },
    ];

    let ruleCount = 1;

    init();

    function init() {
        browser.storage.local.get().then(initReplaceRules);

        browser.storage.local.onChanged.addListener(updateReplaceRules);

        replaceRules.sort((a, b) => a.lhs.length + b.lhs.length)
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
        for (let index = 1; index <= ruleCount; index++) {
            const lhs = replaceRules[index].lhs
            const rhs = replaceRules[index].rhs
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

    function initReplaceRules(storage) {
        if (storage.ruleCount) {
            ruleCount = storage.ruleCount;
        }
        replaceRules = [];
        for (let i = 1; i <= ruleCount; i++) {
            let currRule = `replaceRule${i}`; 
            if (storage[currRule]) {
                replaceRules.push(storage[currRule]);
            }
        }
    }

    function updateReplaceRules(changes) {
        if (changes.ruleCount) {
            ruleCount = changes.ruleCount.newValue;
        }
        replaceRules = [];
        for (let i = 1; i <= ruleCount; i++) {
            replaceRules.push(changes[`replaceRule${i}`].newValue);
        }
    }

})();
