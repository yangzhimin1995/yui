/** ================================= 等待dom加载完成 start =================================*/

let yuiData_index = 0;
let yuiData_scrollBarWidth = 0;
const yuiData_clientWidth = document.body.clientWidth;
let yuiData_loadingSIJson = {};

const yui = {
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
    }
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
    yuiRadio_init();
    yuiSwitch_init();
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

function yuiCheckboxData(id) {
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

function yuiRadioData(id) {
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

function yuiSwitchData(id) {
    const dom = document.querySelector(`div[yui-switch][id=${id}]`);
    if (!dom) {
        return
    }
    const {value} = yuiFunc_getAttributes(dom, ['value']);
    return value === 'true';
}

/** ================================= switch end =================================*/