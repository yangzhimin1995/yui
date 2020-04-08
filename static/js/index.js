addPageHeader();
hljs.initHighlightingOnLoad();

function addPageHeader() {
    const headerDom = document.createElement('div');
    yuiFunc_setClasses(headerDom, ['page-header']);
    document.body.insertBefore(headerDom, document.body.firstChild);
    fetch('/yui/page/header.html').then(data => data.text()).then(data => {
        document.querySelector('.page-header').innerHTML = data
    }).then(() => {
        console.log('页面头部加载完成！');
        yuiMenu_init();
        pageMenuChecked(headerDom);
    })
}

function pageMenuChecked(dom) {
    let pathname = location.pathname;
    pathname = pathname.replace('/index.html', '');
    if (pathname.substr(pathname.length - 1, pathname.length) === "/") {
        pathname = pathname.substr(0, pathname.length - 1);
    }
    const menuItem = dom.querySelector(`a[menu-item][href='${pathname}']`);
    const parentDom = menuItem.parentNode;
    if (parentDom.classList.contains('submenu-list')) {
        yuiFunc_setAttributes(menuItem, {'text-checked': ''});
        const moreDom = dom.querySelector(`a[menu-item][id='menu-item-more-component']`);
        yuiFunc_setAttributes(moreDom, {'checked': ''});
    } else {
        yuiFunc_setAttributes(menuItem, {'checked': ''});
    }
}