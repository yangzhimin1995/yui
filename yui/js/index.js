/** ================================= 等待dom加载完成 start =================================*/

let yuiData_index = 0;
let yuiData_scrollBarWidth = 0;
const yuiData_clientWidth = document.body.clientWidth;
let yuiData_loadingSIJson = {};

const yui = {
    checkbox: {
        data: (id) => {
            return yuiCheckbox_getData(id)
        }
    },
    dialog: {
        open: (id) => {
            yuiDialog_show(id);
        },
        close: (id) => {
            yuiDialog_close(id);
        }
    },
    loading: {
        start: (id) => {
            yuiLoading_start(id)
        },
        close: (id) => {
            yuiLoading_close(id)
        },
        fullscreen: {
            start: (id) => {
                yuiLoading_fullscreenStart(id)
            },
            close: (id) => {
                yuiLoading_fullscreenClose(id)
            },
        }
    },
    message: {
        info: (message = '', option = {}) => {
            option['type'] = 'info';
            yuiMessage(message, option)
        },
        success: (message = '', option = {}) => {
            option['type'] = 'success';
            yuiMessage(message, option)
        },
        warning: (message = '', option = {}) => {
            option['type'] = 'warning';
            yuiMessage(message, option)
        },
        danger: (message = '', option = {}) => {
            option['type'] = 'danger';
            yuiMessage(message, option)
        },
    },
    messageBox: {
        alert: (message = '', title = '提示', options = {}) => {
            options['showCancelBtn'] = false;
            return yuiMessageBox(message, title, options)
        },
        confirm: (message = '', title = '提示', options = {}) => {
            options['showCancelBtn'] = true;
            return yuiMessageBox(message, title, options)
        },
    },
    notify: {
        info: (options = {}) => {
            options['type'] = 'info';
            yuiNotify(options)
        },
        success: (options = {}) => {
            options['type'] = 'success';
            yuiNotify(options)
        },
        warning: (options = {}) => {
            options['type'] = 'warning';
            yuiNotify(options)
        },
        danger: (options = {}) => {
            options['type'] = 'danger';
            yuiNotify(options)
        },
    },
    radio: {
        data: (id) => {
            return yuiRadio_getData(id)
        }
    },
    select: {
        data: (id) => {
            return yuiSelect_getData(id)
        }
    },
    switch: {
        data: (id) => {
            return yuiSwitch_getData(id)
        }
    },
};

if (document.readyState !== 'loading') {
    yuiFunc_init();
} else {
    document.addEventListener('DOMContentLoaded', yuiFunc_init);
}

/** ================================= 等待dom加载完成 end =================================*/


/** ================================= 初始化yui start =================================*/

function yuiFunc_init() {
    yuiFunc_getScrollbarWidth();
    yuiBackTop_init();
    yuiCheckbox_init();
    yuiDialog_init();
    yuiDropdown_init();
    yuiMenu_init();
    yuiRadio_init();
    yuiSelect_init();
    yuiSwitch_init();
    yuiTabs_init();
    //某些组件依赖popover,此方法放在最后执行
    yuiPopover_init();
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


/** ================================= backTop start =================================*/

function yuiBackTop_init() {
    const dom = document.querySelector('div[yui-back-top]');
    if (dom) {
        yuiBackTop_handleClick(dom);
        let top = document.documentElement.scrollTop;
        let isHide = top === 0;
        if (top > 0) {
            yuiFunc_setStyles(dom, {opacity: '1', visibility: 'visible'});
        } else {
            yuiFunc_setStyles(dom, {opacity: '0', visibility: 'hidden'});
        }
        window.onscroll = function () {
            top = document.documentElement.scrollTop;
            if (top > 0 && isHide) {
                yuiFunc_setStyles(dom, {opacity: '1', visibility: 'visible'});
                isHide = false
            }
            if (top === 0) {
                yuiFunc_setStyles(dom, {opacity: '0', visibility: 'hidden'});
                isHide = true
            }
        }
    }
}

function yuiBackTop_handleClick(dom) {
    dom.addEventListener('click', function () {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        })
    })
}

/** ================================= backTop end =================================*/


/** ================================= checkbox start =================================*/

function yuiCheckbox_init() {
    const dom = document.querySelectorAll('div[yui-checkbox-group]');
    dom.forEach(groupDom => {
        const {change} = yuiFunc_getAttributes(groupDom, ['change']);
        const checkboxesDom = groupDom.querySelectorAll('a[yui-checkbox]');
        yuiCheckbox_handleGroupDom(checkboxesDom, change)
    })
}

function yuiCheckbox_handleGroupDom(dom, change) {
    dom.forEach(checkboxDom => {
        const boxDom = document.createElement('div');
        yuiFunc_setAttributes(boxDom, {'box': ''});
        checkboxDom.insertBefore(boxDom, checkboxDom.firstChild);
        yuiCheckbox_handleClick(checkboxDom, change);
    })
}

function yuiCheckbox_handleClick(checkboxDom, change) {
    const {disabled, value} = yuiFunc_getAttributes(checkboxDom, ['disabled', 'value']);
    if (disabled === null) {
        checkboxDom.addEventListener('click', function () {
            const {checked} = yuiFunc_getAttributes(checkboxDom, ['checked']);
            let flag = true;
            if (change) {
                const state = checked !== null;
                flag = eval(change + `(value,state)`);
            }
            if (flag !== false) {
                if (checked === null) {
                    yuiFunc_setAttributes(checkboxDom, {'checked': ''})
                } else {
                    yuiFunc_removeAttributes(checkboxDom, ['checked'])
                }
            }
        })
    }
}

function yuiCheckbox_getData(id) {
    const dom = document.querySelector(`div[yui-checkbox-group][id=${id}]`);
    if (!dom) {
        return
    }
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
    const dom = document.querySelectorAll('div[yui-dialog]');
    dom.forEach(dialogDom => {
        const {id, fullscreen} = yuiFunc_getAttributes(dialogDom, ['id', 'fullscreen']);
        if (fullscreen !== null) {
            return
        }
        const modalDom = document.createElement('div');
        yuiFunc_setAttributes(modalDom, {'yui-modal': '', id: id + '__modal'});
        modalDom.appendChild(dialogDom);
        yuiFunc_setStyles(dialogDom, {display: 'block'});
        document.body.appendChild(modalDom);
    })
}

function yuiDialog_show(id) {
    const dom = document.querySelector(`div[yui-modal][id=${id}__modal]`);
    if (!dom) {
        yuiDialog_showFullscreen(id);
        return
    }
    const dialogDom = dom.querySelector(`div[yui-dialog][id=${id}]`);
    yuiFunc_setStyles(dom, {display: 'flex'});
    yuiFunc_scrollBarLocked();
    setTimeout(() => {
        yuiFunc_setStyles(dom, {opacity: '1'});
        yuiFunc_setStyles(dialogDom, {top: '15vh'});
    })
}

function yuiDialog_showFullscreen(id) {
    const dom = document.querySelector(`div[yui-dialog][fullscreen][id=${id}]`);
    if (!dom) {
        return
    }
    yuiFunc_scrollBarLocked();
    yuiFunc_setStyles(dom, {display: 'block'});
    setTimeout(() => {
        yuiFunc_setStyles(dom, {opacity: '1', top: '0'});
    })
}

function yuiDialog_close(id) {
    const dom = document.querySelector(`div[yui-modal][id=${id}__modal]`);
    if (!dom) {
        yuiDialog_closeFullscreen(id);
        return
    }
    const dialogDom = dom.querySelector(`div[yui-dialog][id=${id}]`);
    yuiFunc_setStyles(dom, {opacity: '0'});
    yuiFunc_setStyles(dialogDom, {top: ''});
    setTimeout(() => {
        yuiFunc_setStyles(dom, {display: 'none'});
        yuiFunc_scrollBarUnlocked();
    }, 300)
}

function yuiDialog_closeFullscreen(id) {
    const dom = document.querySelector(`div[yui-dialog][fullscreen][id=${id}]`);
    if (!dom) {
        return
    }
    yuiFunc_setStyles(dom, {opacity: '0', top: ''});
    setTimeout(() => {
        yuiFunc_setStyles(dom, {display: 'none'});
        yuiFunc_scrollBarUnlocked();
    }, 300)
}

/** ================================= dialog end =================================*/


/** ================================= dropdown start =================================*/

function yuiDropdown_init() {
    const dom = document.querySelectorAll('div[yui-dropdown]');
    dom.forEach(dropdownDom => {
        let options = yuiFunc_getAttributes(dropdownDom, ['trigger']);
        if (!options['trigger']) {
            options['trigger'] = 'hover'
        }
        options['placement'] = 'bottom';
        options['yui-popover'] = '';
        yuiFunc_setAttributes(dropdownDom, options);
    });
}

/** ================================= dropdown end =================================*/


/** ================================= loading start =================================*/

const yuiLoadingSI = {};

function yuiLoading_start(id) {
    const dom = document.querySelector(`div[yui-loading][id=${id}]`);
    const {modalDom, contentDom, iconDom, textDom} = yuiLoading_getModalDom(dom);
    yuiLoading_showLoading(id, modalDom, iconDom);
}

function yuiLoading_close(id) {
    const dom = document.querySelector(`div[yui-loading][id=${id}]`);
    yuiLoading_closeLoading(id, dom)
}

function yuiLoading_fullscreenStart() {
    let dom = document.querySelector(`div[yui-loading][fullscreen]`);
    if (!dom) {
        dom = document.createElement('div');
        yuiFunc_setAttributes(dom, {'yui-loading': '', 'fullscreen': ''});
        document.body.appendChild(dom)
    }
    yuiFunc_setStyles(dom, {visibility: 'visible'});
    const {modalDom, contentDom, iconDom, textDom} = yuiLoading_getModalDom(dom);
    yuiFunc_scrollBarLocked();
    yuiLoading_showLoading('yui-fullscreen-loading-si', modalDom, iconDom);
}

function yuiLoading_fullscreenClose() {
    const dom = document.querySelector(`div[yui-loading][fullscreen]`);
    yuiLoading_closeLoading('yui-fullscreen-loading-si', dom);
    setTimeout(() => {
        yuiFunc_scrollBarUnlocked();
        yuiFunc_setStyles(dom, {visibility: 'hidden'});
    }, 300)
}

function yuiLoading_showLoading(id, modalDom, iconDom) {
    if (yuiLoadingSI[id]) {
        return
    }
    yuiFunc_setStyles(modalDom, {visibility: 'visible'});
    let deg = 1;
    yuiLoadingSI[id] = setInterval(() => {
        yuiFunc_setStyles(iconDom, {transform: 'rotate(' + deg + 'deg)'});
        deg++
    });
    setTimeout(() => {
        yuiFunc_setStyles(modalDom, {opacity: '1'});
    }, 10)
}

function yuiLoading_closeLoading(id, dom) {
    if (!yuiLoadingSI[id]) {
        return
    }
    const modalDom = dom.querySelector('div[modal]');
    yuiFunc_setStyles(modalDom, {opacity: '0'});
    setTimeout(() => {
        yuiFunc_setStyles(modalDom, {visibility: 'hidden'});
        clearInterval(yuiLoadingSI[id]);
        delete yuiLoadingSI[id]
    }, 300)
}

function yuiLoading_getModalDom(dom) {
    const modalDom = dom.querySelector('div[modal]');
    if (modalDom) {
        const contentDom = modalDom.querySelector('div[content]');
        const iconDom = modalDom.querySelector('i.yui-icon.loading');
        const textDom = modalDom.querySelector('div[text]');
        return {modalDom, contentDom, iconDom, textDom}
    } else {
        const {modalDom, contentDom, iconDom, textDom} = yuiLoading_createModalDom();
        dom.appendChild(modalDom);
        return {modalDom, contentDom, iconDom, textDom}
    }
}

function yuiLoading_createModalDom() {
    const modalDom = document.createElement('div');
    yuiFunc_setAttributes(modalDom, {modal: ''});
    const contentDom = document.createElement('div');
    yuiFunc_setAttributes(contentDom, {content: ''});
    const iconDom = document.createElement('i');
    yuiFunc_setClasses(iconDom, ['yui-icon', 'loading']);
    const textDom = document.createElement('div');
    yuiFunc_setAttributes(textDom, {text: ''});
    textDom.innerText = '加载中';
    contentDom.appendChild(iconDom);
    contentDom.appendChild(textDom);
    modalDom.appendChild(contentDom);
    return {modalDom, contentDom, iconDom, textDom}
}

/** ================================= loading end =================================*/


/** ================================= menu start =================================*/

function yuiMenu_init() {
    const dom = document.querySelectorAll('div[yui-menu] div[submenu]');
    dom.forEach(submenuDom => {
        const panelDom = submenuDom.querySelector('div[panel]');
        const menuItemDom = submenuDom.querySelector('a[menu-item]');
        yuiMenu_handleMouseMove(dom, submenuDom, menuItemDom, panelDom);
    })
}

function yuiMenu_handleMouseMove(dom, submenuDom, menuItemDom, panelDom) {
    const {disabled} = yuiFunc_getAttributes(menuItemDom, ['disabled']);
    if (disabled !== null) {
        return
    }
    let hideTO;
    submenuDom.addEventListener('mouseenter', function () {
        if (hideTO) {
            clearTimeout(hideTO);
        }
        yuiMenu_hidePanel(dom);
        yuiFunc_setStyles(panelDom, {display: 'block'});
        const height = panelDom.clientHeight;
        yuiFunc_setStyles(panelDom, {height: '0px'});
        setTimeout(() => {
            yuiFunc_setStyles(panelDom, {height: height - 10 + 'px', opacity: '1'});
        }, 10)
    });
    submenuDom.addEventListener('mouseleave', function () {
        hideTO = setTimeout(() => {
            yuiFunc_setStyles(panelDom, {height: '0px', opacity: '0'});
            hideTO = setTimeout(() => {
                yuiFunc_setStyles(panelDom, {display: 'none', height: ''})
            }, 300)
        }, 200);
    })
}

function yuiMenu_hidePanel(dom) {
    dom.forEach(submenuDom => {
        const panelDom = submenuDom.querySelector('div[panel]');
        yuiFunc_setStyles(panelDom, {display: 'none', height: ''})
    })
}

/** ================================= menu end =================================*/


/** ================================= message start =================================*/

function yuiMessage(message = '', options = {}) {
    options = yuiFunc_json2Default(options, {
        type: 'info',
        effect: 'light'
    });
    const containerDom = yuiMessage_getContainerDom();
    const messageDom = yuiMessage_createDom(message, options);
    containerDom.appendChild(messageDom);
    yuiMessage_show(messageDom);
}

function yuiMessage_autoClose(dom) {
    yuiFunc_setStyles(dom, {opacity: '0', marginTop: -dom.clientHeight + 'px',});
    setTimeout(() => {
        dom.remove();
    }, 350)
}


function yuiMessage_show(dom) {
    setTimeout(() => {
        yuiFunc_setStyles(dom, {opacity: '1', top: '0'})
    });
    setTimeout(() => {
        yuiMessage_autoClose(dom)
    }, 3000);
}

function yuiMessage_createDom(message, options) {
    const {type, effect} = options;
    const dom = document.createElement('div');
    yuiFunc_setAttributes(dom, {'yui-message': '', type, effect});
    const iconDom = document.createElement('i');
    yuiFunc_setClasses(iconDom, ['yui-icon', type]);
    dom.appendChild(iconDom);
    const textDom = document.createElement('span');
    textDom.innerText = message;
    dom.appendChild(textDom);
    return dom
}

function yuiMessage_getContainerDom() {
    let dom = document.querySelector('div[yui-message-container]');
    if (!dom) {
        dom = document.createElement('div');
        yuiFunc_setAttributes(dom, {'yui-message-container': ''});
        document.body.appendChild(dom);
    }
    return dom
}

/** ================================= message end =================================*/


/** ================================= messageBox start =================================*/

function yuiMessageBox(message = '', title = '提示', options = {}) {
    options = yuiFunc_json2Default(options, {
        type: null,
        showCancelBtn: false,
        callback: null,
    });
    const modalDom = yuiMessageBox_createModalDom();
    document.body.appendChild(modalDom);
    const dom = yuiMessageBox_createDom(options['type']);
    modalDom.appendChild(dom);
    const {headerDom, closeIconDom} = yuiMessageBox_createHeaderDom(title);
    dom.appendChild(headerDom);
    const bodyDom = yuiMessageBox_createBodyDom(message, options['type']);
    dom.appendChild(bodyDom);
    const {footerDom, confirmBtnDom, cancelBtnDom} = yuiMessageBox_createFooterDom(options['showCancelBtn']);
    dom.appendChild(footerDom);
    yuiMessageBox_show(modalDom, dom);
    const callback = options['callback'];
    if (callback) {
        yuiMessageBox_handleClick(modalDom, dom, closeIconDom, 'close', callback);
        yuiMessageBox_handleClick(modalDom, dom, confirmBtnDom, 'confirm', callback);
        yuiMessageBox_handleClick(modalDom, dom, cancelBtnDom, 'cancel', callback);
        return
    }
    return new Promise(function (resolve, reject) {
        closeIconDom.addEventListener('click', function () {
            yuiMessageBox_close(modalDom, dom);
            reject('close')
        });
        confirmBtnDom.addEventListener('click', function () {
            yuiMessageBox_close(modalDom, dom);
            resolve('confirm')
        });
        if (cancelBtnDom) {
            cancelBtnDom.addEventListener('click', function () {
                yuiMessageBox_close(modalDom, dom);
                reject('cancel')
            })
        }
    });
}

function yuiMessageBox_handleClick(modalDom, dom, clickDom, text, callback) {
    if (!clickDom) {
        return
    }
    clickDom.addEventListener('click', function () {
        let flag = true;
        if (callback) {
            flag = callback(text);
        }
        if (flag !== false) {
            yuiMessageBox_close(modalDom, dom)
        }
    })
}

function yuiMessageBox_close(modalDom, dom) {
    setTimeout(() => {
        yuiFunc_setStyles(modalDom, {opacity: '0'});
        yuiFunc_setStyles(dom, {top: '-20px'});
    });
    setTimeout(() => {
        modalDom.remove();
    }, 300)
}

function yuiMessageBox_show(modalDom, dom) {
    setTimeout(() => {
        yuiFunc_setStyles(modalDom, {opacity: '1'});
        yuiFunc_setStyles(dom, {top: '0'});
    })
}

function yuiMessageBox_createFooterDom(showCancelBtn) {
    const footerDom = document.createElement('div');
    yuiFunc_setAttributes(footerDom, {'footer': ''});
    let cancelBtnDom;
    if (showCancelBtn) {
        cancelBtnDom = document.createElement('a');
        yuiFunc_setAttributes(cancelBtnDom, {'yui-button': '', 'size': 'small'});
        cancelBtnDom.innerText = '取消';
        footerDom.appendChild(cancelBtnDom);
    }
    const confirmBtnDom = document.createElement('a');
    yuiFunc_setAttributes(confirmBtnDom, {'yui-button': '', 'size': 'small', type: 'primary'});
    confirmBtnDom.innerText = '确定';
    footerDom.appendChild(confirmBtnDom);
    return {footerDom, confirmBtnDom, cancelBtnDom};
}

function yuiMessageBox_createBodyDom(message, type) {
    const bodyDom = document.createElement('div');
    yuiFunc_setAttributes(bodyDom, {'body': ''});
    if (type) {
        const iconDom = document.createElement('i');
        yuiFunc_setClasses(iconDom, ['yui-icon', `${type}`]);
        bodyDom.appendChild(iconDom);
    }
    const messageDom = document.createElement('span');
    messageDom.innerText = message;
    bodyDom.appendChild(messageDom);
    return bodyDom;
}

function yuiMessageBox_createHeaderDom(title) {
    const headerDom = document.createElement('div');
    yuiFunc_setAttributes(headerDom, {'header': ''});
    const titleDom = document.createElement('div');
    yuiFunc_setAttributes(titleDom, {'title': ''});
    titleDom.innerText = title;
    headerDom.appendChild(titleDom);
    const closeIconDom = document.createElement('i');
    yuiFunc_setClasses(closeIconDom, ['yui-icon', 'closed']);
    headerDom.appendChild(closeIconDom);
    return {headerDom, closeIconDom};
}

function yuiMessageBox_createDom(type) {
    const dom = document.createElement('div');
    const domAttrs = {'yui-message-box': ''};
    if (type) {
        domAttrs['type'] = type;
    }
    yuiFunc_setAttributes(dom, domAttrs);
    return dom;
}

function yuiMessageBox_createModalDom() {
    const id = `yui-messageBox-modal__${yuiData_index++}`;
    const dom = document.createElement('div');
    yuiFunc_setAttributes(dom, {'yui-modal': '', id});
    yuiFunc_setStyles(dom, {display: 'flex'});
    document.body.appendChild(dom);
    return dom
}

/** ================================= messageBox end =================================*/


/** ================================= notify start =================================*/

function yuiNotify(options = {}) {
    options = yuiFunc_json2Default(options, {
        title: '提示',
        message: '',
        type: null,
        duration: 4500,
    });
    const containerDom = yuiNotify_createContainerDom(options['position']);
    const notifyDom = yuiNotify_createDom(containerDom, options);
    yuiNotify_createIconDom(notifyDom, options);
    yuiNotify_createContentDom(notifyDom, options);
    yuiNotify_createCloseDom(notifyDom);
    setTimeout(() => {
        yuiFunc_setStyles(notifyDom, {'left': '0px', 'opacity': '1'});
    });
    yuiNotify_handleDuration(notifyDom, options);
}

function yuiNotify_createContainerDom() {
    let dom = document.querySelector(`div[yui-notify-container]`);
    if (!dom) {
        dom = document.createElement('div');
        yuiFunc_setAttributes(dom, {'yui-notify-container': ''});
        document.body.appendChild(dom)
    }
    return dom
}

function yuiNotify_createDom(containerDom, options) {
    let dom = document.createElement('div');
    let attrs = {'yui-notify': ''};
    if (options['type']) {
        attrs['type'] = options['type']
    }
    yuiFunc_setAttributes(dom, attrs);
    yuiFunc_setStyles(dom, {zIndex: -yuiData_index});
    containerDom.appendChild(dom);
    yuiData_index++;
    return dom
}

function yuiNotify_createIconDom(notifyDom, options) {
    if (options['type'] !== null) {
        let iconDom = document.createElement('i');
        yuiFunc_setAttributes(iconDom, {'icon': ''});
        yuiFunc_setClasses(iconDom, ['yui-icon', `${options['type']}`]);
        notifyDom.appendChild(iconDom);
    }
}

function yuiNotify_createContentDom(notifyDom, options) {
    const contentDom = document.createElement('div');
    yuiFunc_setAttributes(contentDom, {content: ''});
    notifyDom.appendChild(contentDom);
    const titleDom = document.createElement('div');
    yuiFunc_setAttributes(titleDom, {title: ''});
    titleDom.innerText = options['title'];
    contentDom.appendChild(titleDom);
    const messageDom = document.createElement('div');
    yuiFunc_setAttributes(messageDom, {message: ''});
    messageDom.innerText = options['message'];
    contentDom.appendChild(messageDom);
}

function yuiNotify_handleDuration(notifyDom, options) {
    const duration = yuiFunc_param2Number(options['duration'], 4500);
    if (duration !== 0) {
        setTimeout(() => {
            yuiNotify_closed(notifyDom)
        }, duration)
    }
}

function yuiNotify_createCloseDom(notifyDom) {
    const closeIconDom = document.createElement('i');
    yuiFunc_setClasses(closeIconDom, ['yui-icon', 'closed']);
    notifyDom.appendChild(closeIconDom);
    closeIconDom.addEventListener('click', function () {
        yuiNotify_closed(notifyDom)
    })
}

function yuiNotify_closed(dom) {
    yuiFunc_setStyles(dom, {marginTop: -dom.offsetHeight - 24 + 'px', opacity: 0});
    setTimeout(() => {
        dom.remove()
    }, 300)
}

/** ================================= notify end =================================*/


/** ================================= popover start =================================*/

function yuiPopover_init(dom) {
    dom = document.querySelectorAll('div[yui-popover]');
    dom.forEach(popoverDom => {
        let options = yuiFunc_getAttributes(popoverDom, ['placement', 'trigger']);
        options = yuiFunc_json2Default(options, {
            placement: 'bottom',
            trigger: 'click',
        });
        yuiPopover_handleDom(popoverDom, options);
    })
}

function yuiPopover_handleDom(dom, options) {
    const panelDom = dom.querySelector('div[panel]');
    const arrowDom = yuiPopover_createArrowDom(panelDom);
    const placementArray = options['placement'].split('-');
    yuiPopover_addPlacementAttrs(panelDom, arrowDom, placementArray);
    yuiPopover_handlePlacement(dom, panelDom, placementArray);
    yuiPopover_handleClick(dom, panelDom, options['trigger']);
    yuiPopover_handleHover(dom, panelDom, options['trigger']);
    yuiPopover_handleFocus(dom, panelDom, options['trigger']);
}

function yuiPopover_handleFocus(dom, panelDom, trigger) {
    if (trigger === 'focus') {
        dom.addEventListener('mousedown', function () {
            yuiPopover_show(panelDom);
        });
        dom.addEventListener('mouseup', function () {
            yuiPopover_hide(panelDom);
        })
    }
}

function yuiPopover_handleHover(dom, panelDom, trigger) {
    if (trigger === 'hover') {
        let hideTO;
        dom.addEventListener('mouseenter', function () {
            if (hideTO) {
                clearTimeout(hideTO)
            }
            yuiPopover_show(panelDom);
        });
        dom.addEventListener('mouseleave', function () {
            hideTO = setTimeout(() => {
                hideTO = yuiPopover_hide(panelDom, hideTO);
            }, 300)
        })
    }
}

function yuiPopover_handlePlacement(dom, panelDom, placementArray) {
    if (placementArray.length === 1) {
        const placement = placementArray[0];
        let panelDomStyle;
        if (placement === 'top' || placement === 'bottom') {
            panelDomStyle = {left: `${(dom.clientWidth - panelDom.clientWidth) / 2}px`};
        }
        if (placement === 'left' || placement === 'right') {
            panelDomStyle = {top: `${(dom.clientHeight - panelDom.clientHeight) / 2}px`};
        }
        yuiFunc_setStyles(panelDom, panelDomStyle);
    }
}

function yuiPopover_handleClick(dom, panelDom, trigger) {
    if (trigger === 'click') {
        let hideTO, isShow = false;
        document.addEventListener('click', function (e) {
            if (isShow) {
                isShow = false;
                return
            }
            hideTO = setTimeout(() => {
                yuiPopover_hide(panelDom)
            })
        });
        dom.addEventListener('click', function (e) {
            e.preventDefault();
            isShow = true;
            if (hideTO) {
                clearTimeout(hideTO)
            }
            if (panelDom.style.visibility === 'visible') {
                hideTO = setTimeout(() => {
                    yuiPopover_hide(panelDom)
                })
            } else {
                yuiPopover_show(panelDom);
            }
        });
        panelDom.addEventListener('click', function (e) {
            e.stopPropagation();
            if (hideTO) {
                clearTimeout(hideTO)
            }
        })
    }
}

function yuiPopover_show(dom) {
    yuiFunc_setStyles(dom, {visibility: 'visible'});
    setTimeout(() => {
        yuiFunc_setStyles(dom, {opacity: '1'});
    })
}

function yuiPopover_hide(dom, hideTO) {
    yuiFunc_setStyles(dom, {opacity: '0'});
    if (hideTO !== undefined) {
        hideTO = setTimeout(() => {
            yuiFunc_setStyles(dom, {visibility: 'hidden'});
        }, 300);
        return hideTO;
    } else {
        setTimeout(() => {
            yuiFunc_setStyles(dom, {visibility: 'hidden'});
        }, 300);
    }
}

function yuiPopover_createArrowDom(dom) {
    const arrowDom = document.createElement('div');
    yuiFunc_setAttributes(arrowDom, {'arrow': ''});
    dom.appendChild(arrowDom);
    return arrowDom;
}


function yuiPopover_addPlacementAttrs(panelDom, arrowDom, array) {
    let json = {};
    array.forEach(item => {
        json[item] = '';
    });
    yuiFunc_setAttributes(panelDom, json);
    yuiFunc_setAttributes(arrowDom, json);
}

/** ================================= popover end =================================*/


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
        }
    })
}

function yuiRadio_changeChecked(radiosDom, dom) {
    radiosDom.forEach(radioDom => {
        yuiFunc_removeAttributes(radioDom, ['checked'])
    });
    yuiFunc_setAttributes(dom, {'checked': ''})
}

function yuiRadio_getData(id) {
    const dom = document.querySelector(`div[yui-radio-group][id=${id}]`);
    if (!dom) {
        return
    }
    let radiosDom = dom.querySelectorAll('a[yui-radio]');
    if (radiosDom.length === 0) {
        radiosDom = dom.querySelectorAll('a[yui-radio-button]');
    }
    let currentVal = undefined;
    radiosDom.forEach(radioDom => {
        const {checked} = yuiFunc_getAttributes(radioDom, ['checked']);
        if (checked !== null) {
            const {value} = yuiFunc_getAttributes(radioDom, ['value']);
            currentVal = value
        }
    });
    return currentVal
}

/** ================================= radio end =================================*/


/** ================================= select start =================================*/

function yuiSelect_init() {
    const dom = document.querySelectorAll('div[yui-select]');
    dom.forEach(selectDom => {
        let options = {trigger: 'click', placement: 'bottom-start', 'yui-input': '', 'yui-popover': ''};
        yuiFunc_setAttributes(selectDom, options);
        const inputDom = selectDom.querySelector('input');
        yuiFunc_setAttributes(inputDom, {readOnly: '', 'inner': ''});
        const panelDom = selectDom.querySelector('div[panel]');
        const {change} = yuiFunc_getAttributes(selectDom, ['change']);
        yuiSelect_handleClick(panelDom, inputDom, change);
    });
}

function yuiSelect_handleClick(panelDom, inputDom, change) {
    const menuItemsDom = panelDom.querySelectorAll('a[menu-item]');
    menuItemsDom.forEach(menuItemDom => {
        let {value, disabled, checked} = yuiFunc_getAttributes(menuItemDom, ['value', 'disabled', 'checked']);
        const label = menuItemDom.text;
        if (checked !== null) {
            inputDom.value = label || value;
        }
        menuItemDom.addEventListener('click', function () {
            if (disabled !== null) {
                return
            }
            if (change) {
                let flag = eval(change + `(value,label)`);
                if (flag === false) {
                    return;
                }
            }
            yuiSelect_removeChecked(menuItemsDom);
            inputDom.value = label || value;
            yuiFunc_setAttributes(menuItemDom, {checked: ''});
            yuiPopover_hide(panelDom)
        })
    })
}

function yuiSelect_removeChecked(dom) {
    dom.forEach(menuItemDom => {
        yuiFunc_removeAttributes(menuItemDom, ['checked'])
    })
}

function yuiSelect_getData(id) {
    const dom = document.querySelector(`div[yui-select][id='${id}'] a[menu-item][checked]`);
    if (dom) {
        let options = yuiFunc_getAttributes(dom, ['value']);
        options['label'] = dom.text;
        return options;
    }
    return {};
}

/** ================================= select end =================================*/


/** ================================= switch start =================================*/

function yuiSwitch_init() {
    const dom = document.querySelectorAll(`div[yui-switch]`);
    dom.forEach(yuiSwitchDom => {
        yuiSwitch_handleValueInit(yuiSwitchDom);
        const {change, disabled} = yuiFunc_getAttributes(yuiSwitchDom, ['change', 'disabled']);
        if (disabled !== null) {
            return
        }
        const inactiveTextDom = yuiSwitchDom.querySelector('span[inactive-text]');
        const activeTextDom = yuiSwitchDom.querySelector('span[active-text]');
        yuiSwitch_handleTextClick(yuiSwitchDom, inactiveTextDom, 'false', change);
        yuiSwitch_handleTextClick(yuiSwitchDom, activeTextDom, 'true', change);
        const switchDom = yuiSwitchDom.querySelector('span[switch]');
        yuiSwitch_handleSwitchClick(yuiSwitchDom, switchDom, change);
    })
}

function yuiSwitch_handleValueInit(dom) {
    const {value} = yuiFunc_getAttributes(dom, ['value']);
    if (value !== 'true' && value !== 'false') {
        yuiFunc_setAttributes(dom, {'value': 'true'})
    }
}

function yuiSwitch_handleTextClick(dom, textDom, state, change) {
    if (!textDom) {
        return
    }
    textDom.addEventListener('click', function () {
        const {value} = yuiFunc_getAttributes(dom, ['value']);
        let flag = true;
        if (change) {
            flag = eval(change + `(${value === 'true'})`)
        }
        if (flag !== false) {
            if (value !== state) {
                yuiFunc_setAttributes(dom, {'value': state})
            }
        }
    })
}

function yuiSwitch_handleSwitchClick(dom, switchDom, change) {
    switchDom.addEventListener('click', function () {
        const {value} = yuiFunc_getAttributes(dom, ['value']);
        let flag = true;
        if (change) {
            flag = eval(change + `(${value === 'true'})`)
        }
        if (flag !== false) {
            const state = value === 'true' ? 'false' : 'true';
            yuiFunc_setAttributes(dom, {'value': state})
        }
    })
}

function yuiSwitch_getData(id) {
    const dom = document.querySelector(`div[yui-switch][id=${id}]`);
    if (!dom) {
        return
    }
    const {value} = yuiFunc_getAttributes(dom, ['value']);
    return value === 'true';
}

/** ================================= switch end =================================*/


/** ================================= tabs start =================================*/

function yuiTabs_init() {
    const dom = document.querySelectorAll('div[yui-tabs]');
    dom.forEach(tabsDom => {
        const headerDom = tabsDom.querySelector('div[header]');
        const menuItemsDom = tabsDom.querySelectorAll('div[header]>a');
        const panelsDom = tabsDom.querySelectorAll('div[panel]>div');
        const lineDom = yuiTabs_createActiveLine(headerDom);
        const {change} = yuiFunc_getAttributes(tabsDom, ['change']);
        yuiTabs_handleMenuItemClick(menuItemsDom, panelsDom, lineDom, change)
    })
}

function yuiTabs_createActiveLine(headerDom) {
    const dom = document.createElement('div');
    yuiFunc_setAttributes(dom, {'active-line': ''});
    headerDom.appendChild(dom);
    return dom
}

function yuiTabs_handleMenuItemClick(menuItemsDom, panelsDom, lineDom, change) {
    menuItemsDom.forEach(menuItemDom => {
        const {checked, value, disabled} = yuiFunc_getAttributes(menuItemDom,
            ['checked', 'value', 'disabled']);
        if (checked !== null) {
            yuiTabs_lineDomChange(menuItemDom, lineDom)
        }
        menuItemDom.addEventListener('click', function () {
            if (disabled !== null) {
                return
            }
            if (change) {
                const flag = eval(change + '(value)');
                if (flag === false) {
                    return;
                }
            }
            yuiTabs_tabsChange(menuItemsDom, panelsDom, value);
            yuiTabs_lineDomChange(menuItemDom, lineDom);
        })
    })
}

function yuiTabs_tabsChange(menuItemsDom, panelsDom, val) {
    menuItemsDom.forEach(menuItemDom => {
        const {value} = yuiFunc_getAttributes(menuItemDom, ['value']);
        if (value !== val) {
            yuiFunc_removeAttributes(menuItemDom, ['checked'])
        } else {
            yuiFunc_setAttributes(menuItemDom, {checked: ''})
        }
    });
    panelsDom.forEach(panelDom => {
        const {value} = yuiFunc_getAttributes(panelDom, ['value']);
        if (value !== val) {
            yuiFunc_removeAttributes(panelDom, ['checked'])
        } else {
            yuiFunc_setAttributes(panelDom, {checked: ''})
        }
    })
}

function yuiTabs_lineDomChange(menuItem, lineDom) {
    const width = menuItem.clientWidth;
    const offsetLeft = menuItem.offsetLeft;
    yuiFunc_setStyles(lineDom, {
        width: width + 'px',
        transform: 'translateX(' + offsetLeft + 'px)'
    });
}

/** ================================= tabs end =================================*/