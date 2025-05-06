
const tabBar = document.querySelector('#tab-bar');
const tablinks = document.querySelectorAll('button.tab-link');
const newTabBtn = document.querySelector('.new-tab');
const delTabBtn = document.querySelector('#delete-tab');
const tabContents = document.querySelectorAll('tab-content');

tablinks.forEach((tablink) => {
    tablink.onclick = () => { onTabLinkClick(tablink) } 
});
newTabBtn.onclick = createTab;
delTabBtn.onclick = deleteActiveTabLink;

function onTabLinkClick(tablink) {
    if (tablink.classList.contains('active-tab-link')) {
        enterRenamingTab(tablink);
        return;
    }
    switchTabs(tablink);
}

function createTab() {
    const cloneMe = tabBar.querySelector('.clone-me')
    const tablink = cloneMe.cloneNode(true);
    tablink.classList.remove('clone-me');
    tabBar.insertBefore(tablink, cloneMe);
    tablink.onclick = () => { onTabLinkClick(tablink) }
    switchTabs(tablink);
    enterRenamingTab(tablink);
}

function deleteActiveTabLink() {
    const activeTabLink = tabBar.querySelector('.active-tab-link');
    activeTabLink.remove();
    const firstTab = tabBar.querySelector('.tab-link');
    if (firstTab.classList.contains('clone-me')) {
        createTab();
    } else {
        switchTabs(firstTab);
    }
}

function switchTabs(tablink) {
    const activeTabLink = tabBar.querySelector('.active-tab-link');
    if (activeTabLink) {
        activeTabLink.classList.remove('active-tab-link');
    }
    tablink.classList.add('active-tab-link');
}

function enterRenamingTab(tablink) {
    const tabTittle = tablink.querySelector('.tab-link-tittle');
    tabTittle.contentEditable = true;
    tabTittle.focus();
    tabTittle.addEventListener('keydown', exitRenamingTab)
    tabTittle.addEventListener('focusout', exitRenamingTab);
    selectText(tabTittle);
}

function exitRenamingTab(event) {
    if (event.key && event.key !== 'Enter') { return }
    event.preventDefault();
    event.target.contentEditable = false;
    if (event.target.innerText.length === 0) {
        event.target.innerText = 'New Tab';
    }
    event.target.removeEventListener('keydown', exitRenamingTab);
    event.target.removeEventListener('focusout', exitRenamingTab);
    deselectText();
}

function selectText(element) {
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(element);
    selection.removeAllRanges();
    selection.addRange(range);
}

function deselectText() {
    const selection = window.getSelection();
    selection.removeAllRanges();
}

