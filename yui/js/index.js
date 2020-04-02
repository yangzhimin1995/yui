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
    yuiCheckbox_init();
    yuiDialog_init();
    yuiRadio_init();
    yuiTag_init();
    yuiTooltip_init();
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

/**
 * 批量移除属性
 */
function yuiFunc_removeAttributes(dom, attributes = []) {
    attributes.forEach(attribute => {
        dom.removeAttribute(attribute)
    })
}

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

/**
 * 批量移除class
 */
function yuiFunc_removeClasses(dom, classes = []) {
    classes.forEach(item => {
        if (item) {
            dom.classList.remove(item)
        }
    })
}

/**
 * 批量增加style
 */
function yuiFunc_setStyles(dom, styles = {}) {
    if (!styles) {
        return
    }
    Object.keys(styles).forEach(key => {
        dom.style[key] = styles[key]
    })
}

/** ================================= 全局方法 end =================================*/


/** ================================= alert start =================================*/

function yuiAlert_init() {
    let dom = document.querySelectorAll('div[yui-alert]');
    dom.forEach(alertDom => {
        const closeDom = alertDom.querySelector('div[close-icon]');
        if (closeDom) {
            yuiAlert_handleClose(alertDom, closeDom);
        }
    })
}

function yuiAlert_handleClose(alertDom, closeDom) {
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


/** ================================= checkbox start =================================*/

function yuiCheckbox_init() {
    const dom = document.querySelectorAll('div[yui-checkbox-group]');
    dom.forEach(groupDom => {
        const checkboxesDom = groupDom.querySelectorAll('a[yui-checkbox]');
        yuiCheckbox_handleGroupDom(checkboxesDom)
    })
}

function yuiCheckbox_handleGroupDom(dom) {
    dom.forEach(checkboxDom => {
        const boxDom = document.createElement('div');
        yuiFunc_setAttributes(boxDom, {'box': ''});
        checkboxDom.insertBefore(boxDom, checkboxDom.firstChild);
        yuiCheckbox_handleClick(checkboxDom);
    })
}

function yuiCheckbox_handleClick(checkboxDom) {
    const {disabled} = yuiFunc_getAttributes(checkboxDom, ['disabled']);
    if (disabled === null) {
        checkboxDom.addEventListener('click', function () {
            const {checked} = yuiFunc_getAttributes(checkboxDom, ['checked']);
            if (checked === null) {
                yuiFunc_setAttributes(checkboxDom, {'checked': ''})
            } else {
                yuiFunc_removeAttributes(checkboxDom, ['checked'])
            }
        })
    }
}

function getYuiCheckboxState(id) {
    const dom = document.querySelector(`div[yui-checkbox-group][id=${id}]`);
    const checkboxesDom = dom.querySelectorAll('a[yui-checkbox]');
    let data = {checked: [], unchecked: []};
    checkboxesDom.forEach(checkboxDom => {
        const {checked, value} = yuiFunc_getAttributes(checkboxDom, ['checked', 'value']);
        if (checked === null) {
            data.unchecked.push(value)
        } else {
            data.checked.push(value)
        }
    });
    return data
}

/** ================================= checkbox end =================================*/


/** ================================= dialog start =================================*/

function yuiDialog_init() {
    let dom = document.querySelectorAll('div[yui-dialog]');
    dom.forEach(dialogDom => {
        const closeDom = dialogDom.querySelector('[close-icon]');
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
        modalDom = yuiDialog_createModalDom(id, closeOnClickModal);
    }
    modalDom.style.visibility = 'visible';
    setTimeout(() => {
        modalDom.style.opacity = '1'
    })
}

function yuiDialog_createModalDom(id, closeOnClickModal) {
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


// /** ================================= input start =================================*/
//
// function yuiInput_init() {
//     const dom = document.querySelectorAll('div[yui-input]');
//     dom.forEach(inputDom => {
//         const {clearable} = yuiFunc_getAttributes(inputDom, ['clearable']);
//     })
// }
//
// /** ================================= input end =================================*/


/** ================================= loading start =================================*/

function yuiLoading(id) {
    const dom = document.querySelector(`div[yui-loading][id=${id}]`);
    let modalDom = dom.querySelector(`div[yui-loading-modal]`);
    if (!modalDom) {
        let options = yuiFunc_getAttributes(dom, ['text', 'icon', 'background']);
        options = yuiFunc_json2Default(options, {
            text: '', icon: ['iconfont', 'yui-icon-loading'], background: 'rgba(0, 0, 0, .5)'
        });
        modalDom = yuiLoading_createModalDom(id, options);
        dom.appendChild(modalDom);
    }
    yuiLoading_showModal(id, modalDom)
}

function yuiLoading_createModalDom(id, options) {
    const dom = document.createElement('div');
    yuiFunc_setAttributes(dom, {'yui-loading-modal': '', id: id + '__loading-modal'});
    yuiFunc_setStyles(dom, {'background': options['background']});
    const bodyDom = document.createElement('div');
    yuiFunc_setAttributes(bodyDom, {'body': ''});
    dom.appendChild(bodyDom);
    const iconDom = document.createElement('i');
    yuiFunc_setAttributes(iconDom, {'icon': ''});
    yuiFunc_setClasses(iconDom, options['icon']);
    bodyDom.appendChild(iconDom);
    if (options['text']) {
        const contentDom = document.createElement('div');
        contentDom.innerText = options['text'];
        yuiFunc_setAttributes(contentDom, {'text': ''});
        bodyDom.appendChild(contentDom);
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
        text: '', icon: ['iconfont', 'yui-icon-loading'], background: 'rgba(0, 0, 0, .5)'
    });
    let dom = document.querySelector(`div[yui-loading-modal][id=${id}__loading-modal]`);
    if (!dom) {
        dom = yuiLoading_createModalDom(id, options);
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

const $yuiMessage = {
    info: (content = '', options = {}) => {
        options['type'] = 'info';
        yuiMessage(content, options)
    },
    success: (content = '', options = {}) => {
        options['type'] = 'success';
        yuiMessage(content, options)
    },
    warning: (content = '', options = {}) => {
        options['type'] = 'warning';
        yuiMessage(content, options)
    },
    danger: (content = '', options = {}) => {
        options['type'] = 'danger';
        yuiMessage(content, options)
    },
};

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
    const messageBoxDom = yuiMessage_createDomBoxDom();
    const messageDom = yuiMessage_createDom(content, options);
    messageBoxDom.appendChild(messageDom);
}

function yuiMessage_createDomBoxDom() {
    let dom = document.querySelector('div[yui-message-container]');
    if (!dom) {
        dom = document.createElement('div');
        yuiFunc_setAttributes(dom, {'yui-message-container': ''});
        document.body.appendChild(dom)
    }
    return dom
}

function yuiMessage_createDom(content, options) {
    let messageDom = document.createElement('div');
    const id = 'yui-message-' + (yuiData_index++);
    let messageAttrs = {'yui-message': '', id, type: options['type'], effect: options['effect']};
    if (options.center === true) {
        messageAttrs['center'] = ''
    }
    yuiFunc_setAttributes(messageDom, messageAttrs);
    const contentDom = yuiMessage_createBodyDom(content, options);
    messageDom.appendChild(contentDom);
    yuiMessage_handleShowClose(messageDom, options);
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

function yuiMessage_createBodyDom(content, options) {
    const dom = document.createElement('div');
    yuiFunc_setAttributes(dom, {'body': ''});
    const iconDom = document.createElement('i');
    yuiFunc_setClasses(iconDom, ['iconfont', `yui-icon-${options['type']}`]);
    yuiFunc_setAttributes(iconDom, {'icon': ''});
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

function yuiMessage_handleShowClose(messageDom, options) {
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


/** ================================= messageBox start =================================*/

const $yuiMessageBox = {
    alert: (title, message, options) => {
        options['showCancelBtn'] = false;
        yuiMessageBox(title, message, options);
    },
    confirm: (title, message, options) => {
        options['showTypeIcon'] = true;
        options['showCancelBtn'] = true;
        yuiMessageBox(title, message, options);
    }
};

function yuiMessageBox(title, message, options) {
    options = yuiFunc_json2Default(options, {
        showClose: true,
        showTypeIcon: false,
        icon: ['iconfont', 'yui-icon-warning'],
        iconColor: '#e6a23c',
        confirmBtnText: '确定',
        confirmBtnAttrs: {},
        showCancelBtn: false,
        cancelBtnText: '取消',
        cancelBtnAttrs: {},
        callback: null,
    });
    const modalDom = yuiMessageBox_createModal();
    yuiFunc_setStyles(modalDom, {'visibility': 'visible'});
    const {dom, closeIconDom, confirmBtnDom, cancelBtnDom} = yuiMessageBox_createDom(title, message, options);
    modalDom.appendChild(dom);
    setTimeout(() => {
        yuiFunc_setStyles(modalDom, {'opacity': '1'});
        yuiFunc_setStyles(dom, {'opacity': '1', 'top': '0'});
    });
    yuiMessageBox_handleConfirmClick(modalDom, dom, confirmBtnDom, options);
    yuiMessageBox_handleCancelClick(modalDom, dom, cancelBtnDom, options);
    yuiMessageBox_handleCloseIconClick(modalDom, dom, closeIconDom, options);
}

function yuiMessageBox_handleConfirmClick(modalDom, dom, confirmBtnDom, options) {
    confirmBtnDom.addEventListener('click', function () {
        const callback = options['callback'];
        if (callback) {
            callback('confirm');
        }
        yuiMessageBox_closed(modalDom, dom);
    })
}

function yuiMessageBox_handleCancelClick(modalDom, dom, cancelBtnDom, options) {
    if (cancelBtnDom) {
        cancelBtnDom.addEventListener('click', function () {
            const callback = options['callback'];
            if (callback) {
                callback('cancel');
            }
            yuiMessageBox_closed(modalDom, dom);
        });
    }
}

function yuiMessageBox_handleCloseIconClick(modalDom, dom, closeIconDom, options) {
    closeIconDom.addEventListener('click', function () {
        const callback = options['callback'];
        if (callback) {
            callback('close');
        }
        yuiMessageBox_closed(modalDom, dom);
    });
}

function yuiMessageBox_closed(modalDom, dom) {
    yuiFunc_setStyles(modalDom, {'opacity': '0'});
    yuiFunc_setStyles(dom, {'opacity': '0', 'top': '-30px'});
    setTimeout(() => {
        modalDom.remove();
    }, 300)
}

function yuiMessageBox_createModal() {
    const dom = document.createElement('div');
    yuiFunc_setAttributes(dom, {'yui-modal': ''});
    document.body.appendChild(dom);
    return dom
}

function yuiMessageBox_createDom(title, message, options) {
    const dom = document.createElement('div');
    yuiFunc_setAttributes(dom, {'yui-message-box': ''});
    const headerDomJson = yuiMessageBox_createHeaderDom(title, options);
    dom.appendChild(headerDomJson['headerDom']);
    const bodyDom = yuiMessageBox_createBodyDom(message, options);
    dom.appendChild(bodyDom);
    const footerDomJson = yuiMessageBox_createFooterDom(options);
    dom.appendChild(footerDomJson['footerDom']);
    return {dom, ...headerDomJson, ...footerDomJson}
}

function yuiMessageBox_createFooterDom(options) {
    const footerDom = document.createElement('div');
    yuiFunc_setAttributes(footerDom, {'footer': ''});
    const confirmBtnDom = yuiMessageBox_createConfirmBtnDom(footerDom, options);
    const cancelBtnDom = yuiMessageBox_createCancelBtnDom(footerDom, options);
    return {footerDom, confirmBtnDom, cancelBtnDom}
}

function yuiMessageBox_createCancelBtnDom(dom, options) {
    let cancelBtnDom;
    if (options['showCancelBtn'] === true) {
        cancelBtnDom = document.createElement('a');
        cancelBtnDom.innerText = options['cancelBtnText'];
        let cancelBtnAttrs = {'yui-button': '', 'size': 'small'};
        cancelBtnAttrs = Object.assign(cancelBtnAttrs, options['cancelBtnAttrs']);
        yuiFunc_setAttributes(cancelBtnDom, cancelBtnAttrs);
        dom.appendChild(cancelBtnDom);
    }
    return cancelBtnDom
}

function yuiMessageBox_createConfirmBtnDom(dom, options) {
    const confirmBtnDom = document.createElement('a');
    confirmBtnDom.innerText = options['confirmBtnText'];
    let confirmBtnAttrs = {'yui-button': '', 'type': 'primary', 'size': 'small'};
    confirmBtnAttrs = Object.assign(confirmBtnAttrs, options['confirmBtnAttrs']);
    yuiFunc_setAttributes(confirmBtnDom, confirmBtnAttrs);
    dom.appendChild(confirmBtnDom);
    return confirmBtnDom
}

function yuiMessageBox_createBodyDom(message, options) {
    const dom = document.createElement('div');
    yuiFunc_setAttributes(dom, {'body': ''});
    if (options['showTypeIcon'] === true) {
        const typeIconDom = document.createElement('i');
        yuiFunc_setAttributes(typeIconDom, {'type-icon': ''});
        yuiFunc_setClasses(typeIconDom, options['icon']);
        yuiFunc_setStyles(typeIconDom, {color: options['iconColor']});
        dom.appendChild(typeIconDom);
    }
    const messageDom = document.createElement('div');
    yuiFunc_setAttributes(messageDom, {'message': ''});
    messageDom.innerText = message;
    dom.appendChild(messageDom);
    return dom
}

function yuiMessageBox_createHeaderDom(title, options) {
    const headerDom = document.createElement('div');
    yuiFunc_setAttributes(headerDom, {'header': ''});
    const titleDom = document.createElement('div');
    yuiFunc_setAttributes(titleDom, {'title': ''});
    titleDom.innerText = title;
    headerDom.appendChild(titleDom);
    let closeIconDom;
    if (options['showClose'] === true) {
        closeIconDom = document.createElement('i');
        yuiFunc_setAttributes(closeIconDom, {'close-icon': ''});
        yuiFunc_setClasses(closeIconDom, ['iconfont', 'yui-icon-closed']);
        headerDom.appendChild(closeIconDom);
    }
    return {headerDom, closeIconDom}
}

/** ================================= messageBox end =================================*/


/** ================================= notify start =================================*/

const $yuiNotify = {
    info: (title = '提示', message = '', options = {}) => {
        options['type'] = 'info';
        yuiNotify(title, message, options)
    },
    success: (title = '提示', message = '', options = {}) => {
        options['type'] = 'success';
        yuiNotify(title, message, options)
    },
    warning: (title = '提示', message = '', options = {}) => {
        options['type'] = 'warning';
        yuiNotify(title, message, options)
    },
    danger: (title = '提示', message = '', options = {}) => {
        options['type'] = 'danger';
        yuiNotify(title, message, options)
    },
};

function yuiNotify(title = '提示', message = '', options = {}) {
    options = yuiFunc_json2Default(options, {
        type: null,
        icon: null,
        showClose: true,
        duration: 4500,
        position: 'top-right',
        dangerouslyUseHTMLString: false
    });
    const notifyBoxDom = yuiNotify_createBoxDom(options['position']);
    const notifyDom = yuiNotify_createDom(options);
    yuiNotify_insert2BoxDom(notifyBoxDom, notifyDom, options['position']);
    yuiNotify_createIconDom(notifyDom, options);
    yuiNotify_createBodyDom(title, message, notifyDom, options);
    yuiNotify_handleShowClose(notifyDom, options);
    yuiNotify_handleDuration(notifyDom, options);
    setTimeout(() => {
        yuiFunc_setStyles(notifyDom, {'left': '0px', 'opacity': '1'});
    }, 10);
}

function yuiNotify_insert2BoxDom(notifyBoxDom, notifyDom, position) {
    switch (position) {
        case 'bottom-right':
            notifyBoxDom.insertBefore(notifyDom, notifyBoxDom.childNodes[0]);
            break;
        case 'bottom-left':
            notifyBoxDom.insertBefore(notifyDom, notifyBoxDom.childNodes[0]);
            break;
        case 'top-left':
            notifyBoxDom.appendChild(notifyDom);
            break;
        default:
            notifyBoxDom.appendChild(notifyDom);
            break
    }
}

function yuiNotify_createBoxDom(position) {
    let dom = document.querySelector(`div[yui-notify-container][position=${position}]`);
    if (!dom) {
        dom = document.createElement('div');
        yuiFunc_setAttributes(dom, {'yui-notify-container': '', position});
        switch (position) {
            case 'bottom-right':
                yuiFunc_setStyles(dom, {bottom: '26px', right: '16px'});
                break;
            case 'bottom-left':
                yuiFunc_setStyles(dom, {bottom: '26px', left: '16px'});
                break;
            case 'top-left':
                yuiFunc_setStyles(dom, {top: '26px', left: '16px'});
                break;
            default:
                yuiFunc_setStyles(dom, {top: '26px', right: '16px'});
                break
        }
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
    switch (options['position']) {
        case 'bottom-left':
            yuiFunc_setStyles(dom, {left: '-330px'});
            break;
        case 'top-left':
            yuiFunc_setStyles(dom, {left: '-330px'});
            break;
    }
    return dom
}

function yuiNotify_createIconDom(notifyDom, options) {
    if (options['icon'] !== null || options['type'] !== null) {
        let iconDom = document.createElement('i');
        yuiFunc_setAttributes(iconDom, {'icon': ''});
        const classArray = options['type'] ? ['iconfont', `yui-icon-${options['type']}`] : options['icon'];
        yuiFunc_setClasses(iconDom, classArray);
        notifyDom.appendChild(iconDom);
    }
}

function yuiNotify_createBodyDom(title, message, notifyDom, options) {
    let textDom = document.createElement('div');
    yuiFunc_setAttributes(textDom, {body: ''});
    notifyDom.appendChild(textDom);
    let titleDom = document.createElement('div');
    yuiFunc_setAttributes(titleDom, {title: ''});
    titleDom.innerText = title;
    textDom.appendChild(titleDom);
    let messageDom = document.createElement('div');
    yuiFunc_setAttributes(messageDom, {message: ''});
    if (options['dangerouslyUseHTMLString'] === true) {
        messageDom.innerHTML = message;
    } else {
        messageDom.innerText = message;
    }
    textDom.appendChild(messageDom);
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


/** ================================= radio start =================================*/

function yuiRadio_init() {
    let dom = document.querySelectorAll('div[yui-radio-group]');
    dom.forEach(groupDom => {
        let options = yuiFunc_getAttributes(groupDom, ['change']);
        yuiRadio_handleGroup(groupDom, options['change']);
    })
}

function yuiRadio_handleGroup(dom, change) {
    let radiosDom = dom.querySelectorAll('a[yui-radio]');
    if (radiosDom.length === 0) {
        radiosDom = dom.querySelectorAll('a[yui-radio-button]');
    }
    radiosDom.forEach(radioDom => {
        let options = yuiFunc_getAttributes(radioDom, ['disabled', 'value']);
        if (options['disabled'] === null) {
            radioDom.addEventListener('click', function () {
                let flag = true;
                if (change) {
                    flag = eval(change + `('${options['value']}')`);
                }
                if (flag !== false) {
                    yuiRadio_changeChecked(radiosDom, radioDom);
                }
            })
        } else {
            yuiFunc_removeAttributes(radioDom, ['onclick'])
        }
    })
}

function yuiRadio_changeChecked(radiosDom, dom) {
    radiosDom.forEach(radioDom => {
        yuiFunc_removeAttributes(radioDom, ['checked'])
    });
    yuiFunc_setAttributes(dom, {'checked': ''})
}

/** ================================= radio end =================================*/


/** ================================= tag start =================================*/

function yuiTag_init() {
    let dom = document.querySelectorAll('div[yui-tag]');
    dom.forEach(tagDom => {
        const options = yuiFunc_getAttributes(tagDom, ['closable']);
        if (options['closable'] !== null) {
            const closeIconDom = document.createElement('i');
            yuiFunc_setAttributes(closeIconDom, {'close-icon': ''});
            yuiFunc_setClasses(closeIconDom, ['iconfont', 'yui-icon-closed']);
            tagDom.appendChild(closeIconDom);
            yuiTag_handleEvent(tagDom, closeIconDom)
        }
    })
}

function yuiTag_handleEvent(tagDom, closeIconDom) {
    closeIconDom.addEventListener('mouseenter', function () {
        yuiFunc_removeClasses(closeIconDom, ['yui-icon-closed']);
        yuiFunc_setClasses(closeIconDom, ['yui-icon-danger'])
    });
    closeIconDom.addEventListener('mouseleave', function () {
        yuiFunc_removeClasses(closeIconDom, ['yui-icon-danger']);
        yuiFunc_setClasses(closeIconDom, ['yui-icon-closed'])
    });
    closeIconDom.addEventListener('click', function () {
        yuiFunc_setStyles(tagDom, {'transform': 'rotateY(90deg)'});
        setTimeout(() => {
            tagDom.remove();
        }, 300)
    })
}

/** ================================= tag end =================================*/


/** ================================= tooltip start =================================*/

function yuiTooltip_init() {
    const dom = document.querySelectorAll('div[yui-tooltip]');
    const placementArray = ['top-start', 'top', 'top-end', 'left-start', 'left', 'left-end',
        'right-start', 'right', 'right-end', 'bottom-start', 'bottom', 'bottom-end'];
    dom.forEach(tooltipDom => {
        let {placement, effect} = yuiFunc_getAttributes(tooltipDom, ['placement', 'effect']);
        if (placementArray.indexOf(placement) === -1) {
            placement = 'bottom';
            yuiFunc_setAttributes(tooltipDom, {placement})
        }
        const pointDom = document.createElement('div');
        yuiFunc_setAttributes(pointDom, {'point': ''});
        tooltipDom.appendChild(pointDom);
        yuiTooltip_handleCenter(tooltipDom, pointDom, placement);
        yuiTooltip_handlePointDom(pointDom, placement);
    })
}

function yuiTooltip_handlePointDom(pointDom, placement) {
    const firstPlacement = placement.split('-')[0];
    let style = {};
    let key = firstPlacement.replace(firstPlacement[0], firstPlacement[0].toUpperCase());
    key = 'border' + key + 'Color';
    style[key] = '#303133';
    yuiFunc_setStyles(pointDom, style)
}

function yuiTooltip_handleCenter(tooltipDom, pointDom, placement) {
    if (placement.indexOf('-') === -1) {
        let pointDomStyle;
        let textDomStyle;
        const textDom = tooltipDom.querySelector('div[text]');
        if (placement === 'top' || placement === 'bottom') {
            pointDomStyle = {left: `${(tooltipDom.clientWidth) / 2 - 6}px`};
            textDomStyle = {left: `${(tooltipDom.clientWidth - textDom.clientWidth) / 2}px`};
        } else {
            pointDomStyle = {top: `${(tooltipDom.clientHeight) / 2 - 6}px`};
            textDomStyle = {top: `${(tooltipDom.clientHeight - textDom.clientHeight) / 2}px`};
        }
        yuiFunc_setStyles(pointDom, pointDomStyle);
        yuiFunc_setStyles(textDom, textDomStyle);
    }
}

/** ================================= tooltip end =================================*/