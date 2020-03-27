/** ================================= 等待dom加载完成 start =================================*/

let yuiIndex = 0;
const windowWidth = document.body.clientWidth;

if (document.readyState !== 'loading') {
    yui_init();
} else {
    document.addEventListener('DOMContentLoaded', yui_init);
}

/** ================================= 等待dom加载完成 end =================================*/


/** ================================= 初始化yui start =================================*/

function yui_init() {
    yui_alertInit();
    yui_dialogInit();
}

/** ================================= 等待dom加载完成 end =================================*/


/** ================================= 全局方法 start =================================*/

/**
 * 横杠转驼峰
 */
function yui_getCamelCase(str) {
    return str.replace(/-([a-z])/g, function (all, i) {
        return i.toUpperCase();
    })
}

/**
 * 批量增加属性
 */
function yui_addAttributes(dom, attributes = {}) {
    Object.keys(attributes).forEach(key => {
        dom.setAttribute(key, attributes[key])
    })
}

/**
 * 批量获取dom属性
 */
function yui_getAttributes(dom, attributes = []) {
    let result = {};
    attributes.forEach(item => {
        const key = yui_getCamelCase(item);
        result[key] = dom.getAttribute(item);
    });
    return result
}

/**
 * 批量增加或者移除class
 */
function yui_addClasses(dom, classes = [], operator = 'add') {
    classes.forEach(item => {
        if (item) {
            dom.classList[operator](item)
        }
    })
}

/**
 * 批量增加style
 */
function yui_addStyles(dom, styles = {}) {
    Object.keys(styles).forEach(key => {
        dom.style[key] = styles[key]
    })
}

/** ================================= 全局方法 end =================================*/


/** ================================= alert start =================================*/

function yui_alertInit() {
    let dom = document.querySelectorAll('div[yui-alert]');
    dom.forEach(alertDom => {
        const closeDom = alertDom.querySelector('div[yui-close-tag]');
        if (closeDom) {
            const domRemove = dom => {
                yui_addStyles(dom, {opacity: '0'});
                setTimeout(() => {
                    dom.remove()
                }, 200)
            };
            const {beforeClose} = yui_getAttributes(alertDom, ['before-close']);
            closeDom.addEventListener("click", function () {
                if (beforeClose) {
                    let result = eval(`${beforeClose}(alertDom)`);
                    if (result === false) {
                        return
                    }
                }
                domRemove(alertDom)
            });
        }
    })
}

/** ================================= alert end =================================*/


/** ================================= dialog end =================================*/

function yui_dialogInit() {
    let dom = document.querySelectorAll('div[yui-dialog]');
    dom.forEach(dialogDom => {
        const closeDom = dialogDom.querySelector('[yui-close-tag]');
        if (closeDom) {
            const attrs = yui_getAttributes(dialogDom, ['id']);
            closeDom.addEventListener('click', function () {
                closeYuiDialog(attrs['id']);
            })
        }
    })
}

function closeYuiDialog(id) {
    let dom = document.querySelector(`div[yui-dialog][id=${id}]`);
    const {beforeClose} = yui_getAttributes(dom, ['before-close']);
    if (beforeClose) {
        if (beforeClose) {
            let result = eval(`${beforeClose}(id,dom)`);
            if (result === false) {
                return
            }
        }
    }
    let modalDom = document.querySelector('div[yui-modal]');
    dom.style.opacity = 0;
    dom.style.top = 0;
    modalDom.style.opacity = 0;
    setTimeout(() => {
        dom.style.visibility = 'hidden';
        modalDom.style.visibility = 'hidden';
    }, 300)
}

function openYuiDialog(id) {
    let dom = document.querySelector(`div[yui-dialog][id=${id}]`);
    yui_showModal(id, dom);
    dom.style.visibility = 'visible';
    dom.style.left = `${(windowWidth - dom.offsetWidth) / 2}px`;
    setTimeout(() => {
        dom.style.opacity = '1';
        dom.style.top = '15vh';
    })
}

function yui_showModal(id, dom) {
    let modalDom = document.querySelector('div[yui-modal]');
    if (!modalDom) {
        modalDom = document.createElement('div');
        yui_addAttributes(modalDom, {'yui-modal': ''});
        document.body.appendChild(modalDom);
    }
    yui_addAttributes(modalDom, {'yui-modal': '', id});
    const {closeOnClickModal} = yui_getAttributes(dom, ['close-on-click-modal']);
    if (closeOnClickModal !== 'false') {
        modalDom.addEventListener('click', function () {
            closeYuiDialog(id);
        })
    }
    modalDom.style.visibility = 'visible';
    setTimeout(() => {
        modalDom.style.opacity = '.5'
    })
}

/** ================================= dialog end =================================*/


/** ================================= loading start =================================*/

function startYuiLoading(id) {
    const dom = document.querySelector(`div[yui-loading][id=${id}]`);
    const loadingTagDom = document.createElement('div');
    yui_addAttributes(loadingTagDom, {'yui-loading-tag': ''});
    const iconDom = document.createElement('i');
    yui_addClasses(iconDom, ['iconfont', 'yui-icon-closed']);
    const textDom = document.createElement('div');
    yui_addAttributes(textDom, {'yui-loading-text': ''});
    textDom.innerText = '加载中...';
    loadingTagDom.appendChild(iconDom);
    loadingTagDom.appendChild(textDom);
    dom.appendChild(loadingTagDom);
    loadingTagDom.style.left = (dom.clientWidth - loadingTagDom.clientWidth) / 2 + 'px';
    loadingTagDom.style.top = (dom.clientHeight - loadingTagDom.clientHeight) / 2 + 'px';
}

/** ================================= loading end =================================*/