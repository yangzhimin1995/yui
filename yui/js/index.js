/** ================================= 等待dom加载完成 start =================================*/

let yuiData_index = 0;
let yuiData_scrollBarWidth = 0;
const yuiData_clientWidth = document.body.clientWidth;
let yuiData_loadingSIJson = {};

if (document.readyState !== 'loading') {
    yuiFunc_init();
} else {
    document.addEventListener('DOMContentLoaded', yuiFunc_init);
}

/** ================================= 等待dom加载完成 end =================================*/


/** ================================= 初始化yui start =================================*/

function yuiFunc_init() {
    yuiFunc_getScrollbarWidth();
    yuiAlert_init();
    yuiDialog_init();
}

/** ================================= 等待dom加载完成 end =================================*/


/** ================================= 全局方法 start =================================*/

/**
 * 参数转数字，支持百分比
 */
function yuiFunc_param2Number(param, defaultNum) {
    const type = typeof param;
    if (type === 'number') {
        return param
    }
    if (!param) {
        return defaultNum
    }
    let isPercent = false;
    if (param.indexOf('%') !== -1) {
        param = param.replace('%', '');
        isPercent = true;
    }
    if (isNaN(param)) {
        return defaultNum
    } else {
        return isPercent ? parseFloat(param) / 100 : parseFloat(param)
    }

}

/**
 * json如果没定义就使用默认值
 */
function yuiFunc_json2Default(data = {}, defaultData = {}, returnRemain = false) {
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
function yuiFunc_hasScrollbar() {
    return document.body.scrollHeight > (window.innerHeight || document.documentElement.clientHeight);
}

/**
 * 锁定滚动条
 */
function yuiFunc_scrollBarLocked() {
    let hasScrollBar = yuiFunc_hasScrollbar();
    if (hasScrollBar) {
        yuiFunc_setStyles(document.body, {
            width: 'calc(100% - ' + yuiData_scrollBarWidth + 'px)',
            overflow: 'hidden',
        })
    }
}

/**
 * 恢复滚动条
 */
function yuiFunc_scrollBarUnlocked() {
    //处理滚动条
    let hasScrollBar = yuiFunc_hasScrollbar();
    if (hasScrollBar) {
        yuiFunc_setStyles(document.body, {
            width: '100%',
            overflow: 'auto',
        })
    }
}

/**
 * 获取浏览器滚动条宽度
 */
function yuiFunc_getScrollbarWidth() {
    let div = document.createElement('div');
    yuiFunc_setStyles(div, {
        width: '100px',
        height: '100px',
        overflowY: 'scroll'
    });
    document.body.appendChild(div);
    yuiData_scrollBarWidth = div.offsetWidth - div.clientWidth;
    div.remove();
}

/**
 * 横杠转驼峰
 */
function yuiFunc_getCamelCase(str) {
    return str.replace(/-([a-z])/g, function (all, i) {
        return i.toUpperCase();
    })
}

/**
 * 批量增加属性
 */
function yuiFunc_setAttributes(dom, attributes = {}) {
    Object.keys(attributes).forEach(key => {
        dom.setAttribute(key, attributes[key])
    })
}

// /**
//  * 批量移除属性
//  */
// function yuiFunc_removeAttributes(dom, attributes = []) {
//     attributes.forEach(attribute => {
//         dom.removeAttribute(attribute)
//     })
// }

/**
 * 批量获取dom属性
 */
function yuiFunc_getAttributes(dom, attributes = []) {
    let result = {};
    attributes.forEach(item => {
        const key = yuiFunc_getCamelCase(item);
        result[key] = dom.getAttribute(item);
    });
    return result
}

/**
 * 批量增加class
 */
function yuiFunc_setClasses(dom, classes = []) {
    classes.forEach(item => {
        if (item) {
            dom.classList.add(item)
        }
    })
}

// /**
//  * 批量增加class
//  */
// function yuiFunc_removeClasses(dom, classes = []) {
//     classes.forEach(item => {
//         if (item) {
//             dom.classList.remove(item)
//         }
//     })
// }

/**
 * 批量增加style
 */
function yuiFunc_setStyles(dom, styles = {}) {
    Object.keys(styles).forEach(key => {
        dom.style[key] = styles[key]
    })
}

/** ================================= 全局方法 end =================================*/


/** ================================= alert start =================================*/

function yuiAlert_init() {
    let dom = document.querySelectorAll('div[yui-alert]');
    dom.forEach(alertDom => {
        const closeDom = alertDom.querySelector('div[yui-close-tag]');
        if (closeDom) {
            yuiAlert_handleCloseDom(alertDom, closeDom);
        }
    })
}

function yuiAlert_handleCloseDom(alertDom, closeDom) {
    const {beforeClose} = yuiFunc_getAttributes(alertDom, ['before-close']);
    closeDom.addEventListener("click", function () {
        if (beforeClose) {
            let result = eval(`${beforeClose}(alertDom)`);
            if (result === false) {
                return
            }
        }
        yuiFunc_setStyles(alertDom, {opacity: '0'});
        setTimeout(() => {
            alertDom.remove()
        }, 200)
    });
}

/** ================================= alert end =================================*/


/** ================================= dialog end =================================*/

function yuiDialog_init() {
    let dom = document.querySelectorAll('div[yui-dialog]');
    dom.forEach(dialogDom => {
        const closeDom = dialogDom.querySelector('[yui-close-tag]');
        if (closeDom) {
            const attrs = yuiFunc_getAttributes(dialogDom, ['id']);
            closeDom.addEventListener('click', function () {
                yuiDialogClosed(attrs['id']);
            })
        }
    })
}

function yuiDialog(id) {
    let dom = document.querySelector(`div[yui-dialog][id=${id}]`);
    let options = yuiFunc_getAttributes(dom, ['top', 'fullscreen', 'modal', 'lock-scroll']);
    options = yuiFunc_json2Default(options, {
        top: '15vh', fullscreen: false, modal: true, lockScroll: true
    });
    if (options['lockScroll'] !== 'false') {
        yuiFunc_scrollBarLocked();
    }
    dom.style.visibility = 'visible';
    dom.style.opacity = '1';
    yuiDialog_handleFullscreen(id, dom, options);
}

function yuiDialog_handleFullscreen(id, dom, options) {
    if (options['fullscreen'] !== false) {
        dom.style.height = `100%`;
    } else {
        dom.style.left = `${(yuiData_clientWidth - dom.offsetWidth) / 2}px`;
        setTimeout(() => {
            dom.style.top = options['top'];
        });
        if (options['modal'] !== 'false') {
            yuiDialog_showModal(id, dom);
        }
    }
}

function yuiDialog_showModal(id, dom) {
    let modalDom = document.querySelector(`div[yui-modal][id=${id}__dialog-modal]`);
    const {closeOnClickModal} = yuiFunc_getAttributes(dom, ['close-on-click-modal']);
    if (!modalDom) {
        modalDom = yuiDialog_createModal(id, closeOnClickModal);
    }
    modalDom.style.visibility = 'visible';
    setTimeout(() => {
        modalDom.style.opacity = '.5'
    })
}

function yuiDialog_createModal(id, closeOnClickModal) {
    let dom = document.createElement('div');
    yuiFunc_setAttributes(dom, {'yui-modal': ''});
    document.body.appendChild(dom);
    yuiFunc_setAttributes(dom, {'yui-modal': '', id: id + '__dialog-modal'});
    if (closeOnClickModal !== 'false') {
        dom.addEventListener('click', function () {
            yuiDialogClosed(id);
        })
    }
    return dom;
}

function yuiDialogClosed(id) {
    yuiFunc_scrollBarUnlocked();
    let dom = document.querySelector(`div[yui-dialog][id=${id}]`);
    const {beforeClose} = yuiFunc_getAttributes(dom, ['before-close']);
    if (beforeClose) {
        let result = eval(`${beforeClose}(id,dom)`);
        if (result === false) {
            return
        }
    }
    dom.style.opacity = 0;
    dom.style.top = 0;
    dom.style.visibility = 'hidden';
    yuiDialog_modalClosed(id);
}

function yuiDialog_modalClosed(id) {
    let modalDom = document.querySelector(`div[yui-modal][id=${id}__dialog-modal]`);
    if (modalDom) {
        modalDom.style.opacity = 0;
        setTimeout(() => {
            modalDom.style.visibility = 'hidden';
        }, 300)
    }
}

/** ================================= dialog end =================================*/


/** ================================= loading start =================================*/

function yuiLoading(id) {
    const dom = document.querySelector(`div[yui-loading][id=${id}]`);
    let modalDom = dom.querySelector(`div[yui-loading-modal]`);
    if (!modalDom) {
        let options = yuiFunc_getAttributes(dom, ['text', 'icon', 'background']);
        options = yuiFunc_json2Default(options, {
            text: '', icon: ['iconfont', 'yui-icon-loading'], background: 'rgba(255, 255, 255, .8)'
        });
        modalDom = yuiLoading_createModal(id, options);
        dom.appendChild(modalDom);
    }
    yuiLoading_showModal(id, modalDom)
}

function yuiLoading_createModal(id, options) {
    const dom = document.createElement('div');
    yuiFunc_setAttributes(dom, {'yui-loading-modal': '', id: id + '__loading-modal'});
    yuiFunc_setStyles(dom, {'background': options['background']});
    const contentDom = document.createElement('div');
    yuiFunc_setAttributes(contentDom, {'content': ''});
    dom.appendChild(contentDom);
    const iconDom = document.createElement('i');
    yuiFunc_setAttributes(iconDom, {'icon': ''});
    yuiFunc_setClasses(iconDom, options['icon']);
    contentDom.appendChild(iconDom);
    if (options['text']) {
        const textDom = document.createElement('div');
        textDom.innerText = options['text'];
        yuiFunc_setAttributes(textDom, {'text': ''});
        contentDom.appendChild(textDom);
    }
    return dom;
}

function yuiLoading_showModal(id, modalDom) {
    if (yuiData_loadingSIJson[id]) {
        return
    }
    yuiFunc_setStyles(modalDom, {'visibility': 'visible'});
    const iconDom = modalDom.querySelector('i[icon]');
    let deg = 1;
    yuiData_loadingSIJson[id] = setInterval(() => {
        iconDom.style.transform = "rotate(" + deg + "deg)";
        deg++;
    }, 1);
    setTimeout(() => {
        yuiFunc_setStyles(modalDom, {'opacity': '1'});
    })
}

function yuiLoadingClosed(id) {
    const dom = document.querySelector(`div[id=${id}__loading-modal]`);
    yuiFunc_setStyles(dom, {'opacity': '0'});
    setTimeout(() => {
        clearInterval(yuiData_loadingSIJson[id]);
        delete yuiData_loadingSIJson[id];
        yuiFunc_setStyles(dom, {'visibility': 'hidden'});
    }, 300)
}

function yuiFullscreenLoading(options) {
    const id = 'yui-fullscreen-loading';
    options = yuiFunc_json2Default(options, {
        text: '', icon: ['iconfont', 'yui-icon-loading'], background: 'rgba(255, 255, 255, .8)'
    });
    let dom = document.querySelector(`div[yui-loading-modal][id=${id}__loading-modal]`);
    debugger
    if (!dom) {
        dom = yuiLoading_createModal(id, options);
        document.body.appendChild(dom);
    }
    yuiLoading_showModal(id, dom)
}

function yuiFullscreenLoadingClosed() {
    const id = 'yui-fullscreen-loading';
    yuiLoadingClosed(id)
}

/** ================================= loading end =================================*/


/** ================================= message start =================================*/

function yuiMessage(content = '', options = {}) {
    options = yuiFunc_json2Default(options, {
        type: 'info',
        effect: 'light',
        icon: ['iconfont', 'yui-icon-info'],
        duration: 3000,
        showClose: false,
        center: false,
        dangerouslyUseHTMLString: false,
        onClose: function () {
        },
    });
    const messageBoxDom = yuiMessage_createBox();
    const messageDom = yuiMessage_create(content, options);
    messageBoxDom.appendChild(messageDom);
}

function yuiMessage_createBox() {
    let dom = document.querySelector('div[yui-message-box]');
    if (!dom) {
        dom = document.createElement('div');
        yuiFunc_setAttributes(dom, {'yui-message-box': ''});
        document.body.appendChild(dom)
    }
    return dom
}

function yuiMessage_create(content, options) {
    let messageDom = document.createElement('div');
    const id = 'yui-message-' + (yuiData_index++);
    let messageAttrs = {'yui-message': '', id, type: options['type'], effect: options['effect']};
    if (options.center === true) {
        messageAttrs['center'] = ''
    }
    yuiFunc_setAttributes(messageDom, messageAttrs);
    const contentDom = yuiMessage_createContent(content, options);
    messageDom.appendChild(contentDom);
    yuiMessage_handleCloseIcon(messageDom, options);
    yuiMessage_handleDuration(messageDom, options);
    setTimeout(() => {
        yuiFunc_setStyles(messageDom, {top: '0px', opacity: 1})
    });
    return messageDom
}

function yuiMessage_handleDuration(messageDom, options) {
    let duration = options.duration;
    duration = yuiFunc_param2Number(duration, 5000);
    if (duration !== 0) {
        setTimeout(() => {
            yuiMessage_closed(messageDom)
        }, duration)
    }
}

function yuiMessage_createContent(content, options) {
    const dom = document.createElement('div');
    yuiFunc_setAttributes(dom, {'yui-message-content': ''});
    const iconDom = document.createElement('i');
    yuiFunc_setClasses(iconDom, ['iconfont', `yui-icon-${options['type']}`]);
    yuiFunc_setAttributes(iconDom, {'yui-message-type-icon': ''});
    dom.appendChild(iconDom);
    const textDom = document.createElement('span');
    if (options.dangerouslyUseHTMLString === true) {
        textDom.innerHTML = content;
    } else {
        textDom.innerText = content;
    }
    dom.appendChild(textDom);
    return dom
}

function yuiMessage_handleCloseIcon(messageDom, options) {
    if (options['showClose'] === true) {
        const closeDom = document.createElement('i');
        yuiFunc_setClasses(closeDom, ['iconfont', 'yui-icon-closed']);
        yuiFunc_setAttributes(closeDom, {'yui-message-close-icon': ''});
        messageDom.appendChild(closeDom);
        closeDom.addEventListener('click', function () {
            const flag = options['onClose'](messageDom);
            if (flag !== false) {
                yuiMessage_closed(messageDom)
            }
        })
    }
}

function yuiMessage_closed(dom) {
    yuiFunc_setStyles(dom, {marginTop: -dom.clientHeight + 'px', opacity: 0});
    setTimeout(() => {
        dom.remove()
    }, 300);
}

/** ================================= message end =================================*/


/** ================================= notify start =================================*/

function yuiNotify_createBoxDom() {
    let dom = document.querySelector('div[yui-notify-box]');
    if (!dom) {
        dom = document.createElement('div');
        yuiFunc_setAttributes(dom, {'yui-notify-box': ''});
        document.body.appendChild(dom)
    }
    return dom
}

function yuiNotify_createDom(options) {
    let dom = document.createElement('div');
    let id = 'yui-notify-' + (yuiData_index++);
    let attrs = {'yui-notify': '', id};
    if (options['type']) {
        attrs['type'] = options['type']
    }
    yuiFunc_setAttributes(dom, attrs);
    yuiFunc_setStyles(dom, {zIndex: -yuiData_index});
    return dom
}

function yuiNotify_createIconDom(notifyDom, options) {
    if (options['icon'] !== null || options['type'] !== null) {
        let iconDom = document.createElement('i');
        yuiFunc_setAttributes(iconDom, {'type-icon': ''});
        const classArray = options['type'] ? ['iconfont', `yui-icon-${options['type']}`] : options['icon'];
        yuiFunc_setClasses(iconDom, classArray);
        notifyDom.appendChild(iconDom);
    }
}

function yuiNotify_createTextDom(title, content, notifyDom) {
    let textDom = document.createElement('div');
    yuiFunc_setAttributes(textDom, {text: ''});
    notifyDom.appendChild(textDom);
    let titleDom = document.createElement('div');
    yuiFunc_setAttributes(titleDom, {title: ''});
    titleDom.innerText = title;
    textDom.appendChild(titleDom);
    let contentDom = document.createElement('div');
    yuiFunc_setAttributes(contentDom, {content: ''});
    contentDom.innerText = content;
    textDom.appendChild(contentDom);
}

function yuiNotify(title = '提示', content = '', options = {}) {
    options = yuiFunc_json2Default(options, {
        type: null,
        icon: null,
        showClose: true,
        duration: 4500,
    });
    const notifyBoxDom = yuiNotify_createBoxDom();
    const notifyDom = yuiNotify_createDom(options);
    notifyBoxDom.appendChild(notifyDom);
    setTimeout(() => {
        yuiFunc_setStyles(notifyDom, {'left': '0px', 'opacity': '1'});
    });
    yuiNotify_createIconDom(notifyDom, options);
    yuiNotify_createTextDom(title, content, notifyDom, options);
    yuiNotify_handleShowClose(notifyDom, options);
    yuiNotify_handleDuration(notifyDom, options);
}

function yuiNotify_handleDuration(notifyDom, options) {
    const duration = yuiFunc_param2Number(options['duration'], 4500);
    if (duration !== 0) {
        setTimeout(() => {
            yuiNotify_closed(notifyDom)
        }, duration)
    }
}

function yuiNotify_handleShowClose(notifyDom, options) {
    if (options['showClose'] !== false) {
        const closeIconDom = document.createElement('i');
        yuiFunc_setAttributes(closeIconDom, {'close-icon': ''});
        yuiFunc_setClasses(closeIconDom, ['iconfont', 'yui-icon-closed']);
        notifyDom.appendChild(closeIconDom);
        closeIconDom.addEventListener('click', function () {
            yuiNotify_closed(notifyDom)
        })
    }
}

function yuiNotify_closed(dom) {
    yuiFunc_setStyles(dom, {marginTop: -dom.offsetHeight - 24 + 'px', opacity: 0});
    setTimeout(() => {
        dom.remove()
    }, 300)
}

/** ================================= notify end =================================*/