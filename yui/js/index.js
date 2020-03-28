/** ================================= 等待dom加载完成 start =================================*/

let yuiIndex = 0;
let yuiScrollBarWidth = 0;
const windowWidth = document.body.clientWidth;
let loadingSIjSON = {};

if (document.readyState !== 'loading') {
    yui_init();
} else {
    document.addEventListener('DOMContentLoaded', yui_init);
}

/** ================================= 等待dom加载完成 end =================================*/


/** ================================= 初始化yui start =================================*/

function yui_init() {
    yui_getScrollbarWidth();
    yui_alertInit();
    yui_dialogInit();
}

/** ================================= 等待dom加载完成 end =================================*/


/** ================================= 全局方法 start =================================*/

/**
 * 字符串转数字
 */
function yui_string2Number() {
    return 3000
}

/**
 * json如果没定义就使用默认值
 */
function yui_json2Default(data = {}, defaultData = {}, returnRemain = false) {
    debugger
    let result = defaultData;
    if (returnRemain) {
        result = Object.assign(defaultData, data);
    } else {
        Object.keys(defaultData).forEach(key => {
            if (data[key] !== undefined && data[key] !== null) {
                result[key] = data[key];
            }
        });
    }
    return result
}

/**
 * 判断是否有滚动条
 */
function yui_hasScrollbar() {
    return document.body.scrollHeight > (window.innerHeight || document.documentElement.clientHeight);
}

/**
 * 锁定滚动条
 */
function yui_scrollBarLocked() {
    //处理滚动条
    let hasScrollBar = yui_hasScrollbar();
    if (hasScrollBar) {
        yui_addStyles(document.body, {
            width: 'calc(100% - ' + yuiScrollBarWidth + 'px)',
            overflow: 'hidden',
        })
    }
}

/**
 * 恢复滚动条
 */
function yui_scrollBarUnlocked() {
    //处理滚动条
    let hasScrollBar = yui_hasScrollbar();
    if (hasScrollBar) {
        yui_addStyles(document.body, {
            width: '100%',
            overflow: 'auto',
        })
    }
}

/**
 * 获取浏览器滚动条宽度
 */
function yui_getScrollbarWidth() {
    let div = document.createElement('div'), i;
    yui_addStyles(div, {
        width: '100px',
        height: '100px',
        overflowY: 'scroll'
    });
    document.body.appendChild(div);
    yuiScrollBarWidth = div.offsetWidth - div.clientWidth;
    div.remove();
}

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
 * 批量移除属性
 */
function yui_removeAttributes(dom, attributes = []) {
    attributes.forEach(attribute => {
        dom.removeAttribute(attribute)
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
 * 批量增加class
 */
function yui_addClasses(dom, classes = []) {
    classes.forEach(item => {
        if (item) {
            dom.classList.add(item)
        }
    })
}

/**
 * 批量增加class
 */
function yui_removeClasses(dom, classes = []) {
    classes.forEach(item => {
        if (item) {
            dom.classList.remove(item)
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
    yui_scrollBarUnlocked();
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
    yui_scrollBarLocked();
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

function yuiLoading(id) {
    const dom = document.querySelector(`div[yui-loading][id=${id}]`);
    let loadingModalDom = dom.querySelector(`div[id=${id}-loading-modal]`);
    let loadingTagDom = dom.querySelector(`div[id=${id}-loading-tag]`);
    let iconDom;
    let options = yui_getAttributes(dom, ['modal-color', 'text', 'color', 'icon']);
    options = yui_json2Default(options, {
        modalColor: 'rgba(255, 255, 255, .8)',
        icon: ['iconfont', 'yui-icon-loading'],
        color: '#409EFF',
        text: '',
    });
    debugger
    if (loadingModalDom) {
        loadingModalDom.style.display = 'block';
        loadingTagDom.style.display = 'block';
        yui_addStyles(loadingModalDom, {'background': options['modalColor']});
    } else {
        loadingModalDom = document.createElement('div');
        yui_addAttributes(loadingModalDom, {'yui-loading-modal': '', id: id + '-loading-modal'});
        dom.appendChild(loadingModalDom);
        setTimeout(() => {
            yui_addStyles(loadingModalDom, {'background': options['modalColor']});
        });
        loadingTagDom = yui_createLoadingTagDom(options);
        yui_addAttributes(loadingTagDom, {'yui-loading-tag': '', id: id + '-loading-tag'});
        loadingTagDom.style.left = (dom.clientWidth - loadingTagDom.clientWidth) / 2 + 'px';
        loadingTagDom.style.top = (dom.clientHeight - loadingTagDom.clientHeight) / 2 + 'px';
        dom.appendChild(loadingTagDom);
    }
    iconDom = loadingTagDom.querySelector('i');
    let deg = 1;
    loadingSIjSON[id] = setInterval(() => {
        iconDom.style.transform = "rotate(" + deg + "deg)";
        deg++;
    }, 1)
}

function yuiLoadingClosed(id) {
    const dom = document.querySelector(`div[yui-loading][id=${id}]`);
    const loadingModalDom = dom.querySelector(`div[id=${id}-loading-modal]`);
    const loadingTagDom = dom.querySelector(`div[id=${id}-loading-tag]`);
    if (loadingModalDom) {
        loadingModalDom.style.background = 'transparent';
        setTimeout(() => {
            loadingModalDom.style.display = 'none';
            loadingTagDom.style.display = 'none';
        }, 300);
        clearInterval(loadingSIjSON[id]);
    }
}

function yuiFullScreenLoading(options = {}) {
    options = yui_json2Default(options, {
        modalColor: 'rgba(255, 255, 255, .8)',
        icon: ['iconfont', 'yui-icon-loading'],
        color: '#409EFF',
        text: '',
    });
    yui_scrollBarLocked();
    let dom = document.querySelector('div[yui-full-screen-loading]');
    let loadingTagDom;
    let iconDom;
    if (dom) {
        dom.style.display = 'flex';
        loadingTagDom = dom.querySelector('div[yui-full-screen-loading-tag]');
        yui_addStyles(dom, {'background': options['modalColor']});
    } else {
        dom = document.createElement('div');
        yui_addAttributes(dom, {'yui-full-screen-loading': ''});
        setTimeout(() => {
            yui_addStyles(dom, {'background': options['modalColor']});
        });
        loadingTagDom = yui_createLoadingTagDom(options);
        yui_addAttributes(loadingTagDom, {'yui-full-screen-loading-tag': ''});
        dom.append(loadingTagDom);
        document.body.append(dom);
    }
    iconDom = loadingTagDom.querySelector('i');
    let deg = 1;
    loadingSIjSON['yuiFullScreenLoading'] = setInterval(() => {
        iconDom.style.transform = "rotate(" + deg + "deg)";
        deg++;

    }, 1)
}

function yuiFullScreenLoadingClosed() {
    yui_scrollBarUnlocked();
    const dom = document.querySelector('div[yui-full-screen-loading]');
    if (dom) {
        dom.style.background = 'transparent';
        setTimeout(() => {
            dom.style.display = 'none';
        }, 300);
        clearInterval(loadingSIjSON['yuiFullScreenLoading']);
    }
}

function yui_createLoadingTagDom(options = {}) {
    const loadingTagDom = document.createElement('div');
    const iconDom = document.createElement('i');
    yui_addStyles(iconDom, {'color': options['color']});
    yui_addClasses(iconDom, options['icon']);
    loadingTagDom.appendChild(iconDom);
    let textDom;
    if (options['text']) {
        textDom = document.createElement('div');
        yui_addAttributes(textDom, {'yui-loading-text': ''});
        textDom.innerText = options['text'];
        yui_addStyles(textDom, {'color': options['color']});
        loadingTagDom.appendChild(textDom);
    }
    return loadingTagDom
}

/** ================================= loading end =================================*/


/** ================================= message start =================================*/

function yuiMessage(content = '', options = {}) {
    options = yui_json2Default(options, {
        type: 'info',
        effect: 'light',
        showIcon: true,
        delay: 5000
    });
}

/**
 * 从dom中移除message
 */
function yui_messageClosed(dom) {

}

/** ================================= message end =================================*/