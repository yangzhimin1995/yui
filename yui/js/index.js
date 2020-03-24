/** ================================= 等待dom加载完成 start =================================*/

if (document.readyState !== 'loading') {
    yui_init();
} else {
    document.addEventListener('DOMContentLoaded', yui_init);
}

/** ================================= 等待dom加载完成 end =================================*/


/** ================================= 初始化yui start =================================*/

function yui_init() {
    yuiAlert_init();
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


/** ================================= Alert start =================================*/

function yuiAlert_init() {
    let dom = document.querySelectorAll('[yui-alert]');
    dom.forEach(alertDom => {
        const closeDom = alertDom.querySelector('[close-text]');
        if (closeDom) {
            const domRemove = dom => {
                yui_addStyles(dom, {opacity: '0'});
                setTimeout(() => {
                    dom.remove()
                }, 200)
            };
            const {beforeClose} = yui_getAttributes(alertDom, ['before-close']);
            closeDom.addEventListener("click", function () {
                debugger
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

/** ================================= Alert end =================================*/