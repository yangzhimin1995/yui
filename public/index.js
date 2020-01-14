addHeaderDom();
hljs.initHighlightingOnLoad();

function addHeaderDom() {
    let menuName = getCurrentMenuName();
    fetch("../../public/header/index.html").then(data => data.text()).then(data => {
        document.querySelector('.page-header').innerHTML = data;
    }).then(() => {
        let currentMenuDom = document.querySelector("#" + menuName);
        if (currentMenuDom.classList.contains("sub-menu")) {
            let moreMenuDom = document.querySelector("#menu-item-more");
            moreMenuDom.setAttribute("checked", "");
            currentMenuDom.setAttribute("text-checked", "");
        } else {
            currentMenuDom.setAttribute("checked", "");
        }
        yui_menuHoverListener()
    })
}

function getCurrentMenuName() {
    let pathname = document.location.pathname;
    let pathArray = pathname.split("/");
    let menuName = pathArray[pathArray.length - 2];
    return "menu-item-" + menuName
}