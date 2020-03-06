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
        result[item] = dom.getAttribute(item);
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
    let dom = document.querySelectorAll('div[yui-alert]');
    // dom.forEach(alertDom => {
    //     let attributes = yui_getAttributes(alertDom, [
    //         'type',
    //         'closable',
    //         'close-text',
    //         'show-icon',
    //         'before-close'
    //     ]);
    //     alertDom.innerHTML = '<div><div yui-alert-content>' + alertDom.innerHTML + '</div></div>';
    //     let closeDom = yuiAlert_handleCloseIcon(alertDom, attributes['closable'], attributes['close-text']);
    //     if (closeDom) {
    //         yuiAlert_handleClose(alertDom, closeDom, attributes['before-close']);
    //     }
    //     yuiAlert_handleTypeIcon(alertDom, attributes['show-icon'], attributes['type'])
    // })
}

function yuiAlert_handleTypeIcon(dom, showIcon, type) {
    if (showIcon !== null && showIcon !== 'false') {
        let iconDom = document.createElement('i');
        if (type !== 'success' && type !== 'warning' && type !== 'danger') {
            type = 'info'
        }
        yui_addClasses(iconDom, ['iconfont', `yui-icon-${type}`]);
        yui_addAttributes(iconDom, {'type-icon': ''});
        dom.firstChild.prepend(iconDom);
    }
}

function yuiAlert_handleCloseIcon(dom, closable, text) {
    if (closable !== 'false') {
        let closeDom = document.createElement('i');
        yui_addAttributes(closeDom, {'close-icon': ''});
        if (text) {
            closeDom.innerText = text;
        } else {
            yui_addClasses(closeDom, ['iconfont', 'yui-icon-closed']);
        }
        dom.appendChild(closeDom);
        return closeDom;
    }
}

function yuiAlert_handleClose(dom, closeDom, beforeClose) {
    const domRemove = dom => {
        yui_addStyles(dom, {opacity: '0'});
        setTimeout(() => {
            dom.remove()
        }, 200)
    };
    closeDom.addEventListener("click", function () {
        if (beforeClose) {
            let result = eval(`${beforeClose}(dom)`);
            if (result === false) {
                return
            }
        }
        domRemove(dom)
    });
}

/** ================================= Alert end =================================*/