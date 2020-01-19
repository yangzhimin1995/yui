'use strict';

//滚动条宽度
var yui_SCROLL_BAR_WIDTH = 0;
//组件索引
var yui_INDEX = 0;

if (document.readyState !== 'loading') {
    yuiComponentsInit();
} else {
    document.addEventListener('DOMContentLoaded', yuiComponentsInit);
}

/**
 * 初始化yui组件
 */
function yuiComponentsInit() {
    yui_getScrollbarWidth();
    yui_anchorListener();
    yui_anchorMenuListener();
    yui_dialogMaskClickListener();
    yui_menuHoverListener();
    yui_radioClickListener();
    yui_ribbonLocation();
    yui_tabsClickListener();
    yui_tooltipListener();
}

// 公共方法 =================================================== start //

/**
 批量增加style
 */
function yui_bulkAddStyles(dom) {
    var styles = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    Object.keys(styles).forEach(function (key) {
        dom.style[key] = styles[key];
    });
}

/**
 批量增加class
 */
function yui_bulkAddClasses(dom) {
    var classes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
    var operator = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'add';

    classes.forEach(function (item) {
        if (item) {
            dom.classList[operator](item);
        }
    });
}

/**
 json如果没定义就使用默认值
 */
function yui_json2Default() {
    var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var defaultData = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var returnRemain = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

    var result = void 0;
    Object.keys(defaultData).forEach(function (key) {
        if (data[key] !== undefined) {
            defaultData[key] = data[key];
            delete data[key];
        }
    });
    result = defaultData;
    if (returnRemain) {
        result = Object.assign(data, defaultData);
    }
    return result;
}

/**
 批量获取属性
 */
function yui_bulkGetAttributes(dom) {
    var attributes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

    var result = {};
    attributes.forEach(function (item) {
        result[item] = dom.getAttribute(item);
    });
    return result;
}

/**
 批量增加属性
 */
function yui_bulkAddAttributes(dom) {
    var attributes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    Object.keys(attributes).forEach(function (key) {
        dom.setAttribute(key, attributes[key]);
    });
}

/**
 字符串转小数，支持百分比，错误返回null
 */
function yui_string2Number(string) {
    if (typeof string === 'number') {
        return string;
    }
    if (!string) {
        return null;
    }
    if (string.indexOf('%') !== -1) {
        string = string.replace('%', '');
        if (isNaN(string)) {
            return null;
        } else {
            return parseFloat(string) / 100;
        }
    } else {
        if (isNaN(string)) {
            return null;
        } else {
            return parseFloat(string);
        }
    }
}

/**
 获取滚动条宽度
 */
function yui_getScrollbarWidth() {
    var div = document.createElement('div'),
        i = void 0;
    yui_bulkAddStyles(div, {
        width: '100px',
        height: '100px',
        overflowY: 'scroll'
    });
    document.body.appendChild(div);
    yui_SCROLL_BAR_WIDTH = div.offsetWidth - div.clientWidth;
    div.remove();
}

/**
 判断是否有滚动条
 */
function yui_hasScrollbar() {
    return document.body.scrollHeight > (window.innerHeight || document.documentElement.clientHeight);
}

// 公共方法 =================================================== end //

// anchor =================================================== start //

/**
 锚点初始化
 */
function yui_anchorListener() {
    var anchorDom = document.querySelector('div[yui-anchor]');
    if (anchorDom === null) {
        return;
    }
    var anchorItemDom = document.querySelectorAll('div[yui-anchor]>a');
    var moduleDom = document.querySelectorAll('div[yui-anchor-module]');
    var clientHeight = document.documentElement.clientHeight;
    var attr = yui_anchorAttributeHandle(anchorDom, clientHeight);
    yui_anchorItemClick(anchorItemDom, attr);
    var scrollTop = document.documentElement.scrollTop;
    window.onscroll = function (e) {
        scrollTop = document.documentElement.scrollTop;
        yui_anchorModuleScrollHandle(moduleDom, anchorItemDom, scrollTop, attr.scrollTop);
    };
}

/**
 监听模块滚动，改变锚点选中
 */
function yui_anchorModuleScrollHandle(moduleDom, anchorItemDom, scrollTop, scrollCheckedTop) {
    moduleDom.forEach(function (item, index) {
        var value = item.getAttribute('yui-anchor-module');
        var itemDom = document.querySelector('div[yui-anchor]>a[value=' + value + ']');
        if (item.offsetTop - scrollTop < scrollCheckedTop) {
            if (!itemDom.hasAttribute('checked')) {
                yui_clearAnchorItemChecked(anchorItemDom, itemDom);
            }
        }
        if (index === 0) {
            if (item.offsetTop - scrollTop > scrollCheckedTop) {
                yui_clearAnchorItemChecked(anchorItemDom);
            }
        }
        if (index === moduleDom.length - 1) {
            if (item.offsetTop + item.clientHeight - scrollTop < scrollCheckedTop) {
                yui_clearAnchorItemChecked(anchorItemDom);
            }
        }
    });
}

/**
 监听点击锚点，改变模块位置
 */
function yui_anchorItemClick(anchorItemDom, attr) {
    anchorItemDom.forEach(function (item) {
        item.addEventListener('click', function () {
            var value = item.getAttribute('value');
            var moduleDom = document.querySelector('div[yui-anchor-module=' + value + ']');
            if (attr['yui-click']) {
                var result = eval(attr['yui-click'] + '(\'' + value + '\')');
                if (result === false) {
                    return;
                }
            }
            yui_clearAnchorItemChecked(anchorItemDom, item);
            window.scroll({
                left: 0,
                top: moduleDom.offsetTop - attr['clickTop'],
                behavior: 'smooth'
            });
        });
    });
}

/**
 清除所有锚点选中
 */
function yui_clearAnchorItemChecked(anchorItemDom, dom) {
    anchorItemDom.forEach(function (item) {
        item.removeAttribute('checked');
    });
    if (dom) {
        dom.setAttribute('checked', '');
    }
}

/**
 处理锚点菜单属性
 */
function yui_anchorAttributeHandle(anchorDom, clientHeight) {
    var attr = yui_bulkGetAttributes(anchorDom, ['align-center', 'scroll-top', 'click-top', 'yui-click']);
    //处理位置是否需要垂直居中
    if (attr['align-center'] !== null) {
        var top = (clientHeight - anchorDom.clientHeight) / 2;
        yui_bulkAddStyles(anchorDom, { top: top + 'px' });
    }
    //模块滚动触发选中时对视窗上部的距离
    var scrollTop = attr['scroll-top'];
    if (scrollTop && scrollTop.indexOf('%') !== -1) {
        scrollTop = yui_string2Number(scrollTop);
        scrollTop = scrollTop ? scrollTop * clientHeight : clientHeight / 2;
    } else {
        scrollTop = yui_string2Number(scrollTop);
        scrollTop = scrollTop || clientHeight / 2;
    }
    //点击时对应模块滚动到视窗上部的距离
    var clickTop = attr['click-top'];
    if (clickTop && clickTop.indexOf('%') !== -1) {
        clickTop = yui_string2Number(clickTop);
        clickTop = clickTop ? clickTop * clientHeight : clientHeight / 4;
    } else {
        clickTop = yui_string2Number(clickTop);
        clickTop = clickTop || clientHeight / 4;
    }
    return { scrollTop: scrollTop, clickTop: clickTop, 'yui-click': attr['yui-click'] };
}

// anchor =================================================== end //

// anchorMenu =================================================== start //
/**
 监听锚点菜单事件
 */
function yui_anchorMenuListener() {
    var menuDom = document.querySelector('div[yui-anchor-menu]');
    if (menuDom === null) {
        return;
    }
    var menuItemDom = document.querySelectorAll('div[yui-anchor-menu]>a');
    var modulesDom = document.querySelectorAll('div[yui-anchor-menu-module]');
    var blankDivDom = yui_appendBlankDiv(menuDom);
    var checkedLineDom = yui_appendCheckedLine(menuDom);
    var scrollTop = document.documentElement.scrollTop;
    var menuDomOT = menuDom.offsetTop;
    var clientHeight = document.documentElement.clientHeight;
    var attr = handleAttr(menuDom, clientHeight);
    handleMenuClick(menuItemDom, attr, checkedLineDom);
    yui_handleMenuRoll(scrollTop, menuDomOT, menuDom, blankDivDom, attr);
    window.onscroll = function (e) {
        scrollTop = document.documentElement.scrollTop;
        yui_handleMenuRoll(scrollTop, menuDomOT, menuDom, blankDivDom, attr);
        yui_handleModuleRoll(scrollTop, modulesDom, menuItemDom, checkedLineDom, attr['scrollTop']);
    };
}

/**
 *监听模块滚动改变锚点选中
 */
function yui_handleModuleRoll(scrollTop, modulesDom, menuItemDom, checkedLineDom, top) {
    modulesDom.forEach(function (module, index) {
        var value = module.getAttribute('yui-anchor-menu-module');
        var menuDom = document.querySelector('div[yui-anchor-menu]>a[value=' + value + ']');
        if (module.offsetTop - scrollTop < top) {
            if (!menuDom.hasAttribute('checked')) {
                yui_menuCheck(menuItemDom, menuDom);
                //控制选中线
                yui_menuCheckLine(checkedLineDom, menuDom);
            }
        }
        if (index === 0) {
            if (module.offsetTop - scrollTop > top) {
                //清除所有选中，选中当前
                yui_menuCheck(menuItemDom);
                //控制选中线
                yui_menuCheckLine(checkedLineDom);
            }
        }
        if (index === modulesDom.length - 1) {
            if (module.offsetTop + module.clientHeight - scrollTop < top) {
                //清除所有选中，选中当前
                yui_menuCheck(menuItemDom);
                //控制选中线
                yui_menuCheckLine(checkedLineDom);
            }
        }
    });
}

/**
 *点击菜单时模块跳转
 */
function handleMenuClick(dom, attr, checkedLineDom) {
    dom.forEach(function (menu) {
        menu.addEventListener('click', function () {
            var value = menu.getAttribute('value');
            var flag = true;
            if (attr['yui-click']) {
                flag = eval(attr['yui-click'] + ('(\'' + value + '\')'));
            }
            if (flag !== false) {
                var moduleDom = document.querySelector('div[yui-anchor-menu-module=\'' + value + '\']');
                if (moduleDom) {
                    window.scroll({
                        left: 0,
                        top: moduleDom.offsetTop - attr['clickTop'],
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

/**
 *菜单选中
 */
function yui_menuCheck(items, item) {
    items.forEach(function (menu) {
        menu.removeAttribute('checked');
    });
    if (item) {
        yui_bulkAddAttributes(item, { checked: '' });
    }
}

/**
 *选中下划线
 */
function yui_menuCheckLine(checkedLineDom, menuItemDom) {
    if (menuItemDom) {
        //选线移动
        yui_bulkAddStyles(checkedLineDom, {
            display: 'block',
            width: menuItemDom.offsetWidth + 'px',
            left: menuItemDom.offsetLeft + 'px'
        });
    } else {
        yui_bulkAddStyles(checkedLineDom, {
            display: 'none'
        });
    }
}

/**
 *处理一些属性
 */
function handleAttr(dom, clientHeight) {
    var attr = yui_bulkGetAttributes(dom, ['fixed-top', 'click-top', 'scroll-top', 'yui-click', 'fixed-class']);
    //菜单滚动到距离顶部多少时固定
    var fixedTop = attr['fixed-top'];
    fixedTop = yui_string2Number(fixedTop);
    if (fixedTop && attr['fixed-top'].indexOf('%') !== -1) {
        fixedTop = fixedTop * clientHeight;
    }
    if (!fixedTop) {
        fixedTop = 0;
    }
    //点击时对应模块滚动到视窗上部的距离
    var clickTop = attr['click-top'];
    clickTop = yui_string2Number(clickTop);
    if (clickTop && attr['click-top'].indexOf('%') !== -1) {
        clickTop = clickTop * clientHeight;
    }
    if (!clickTop) {
        clickTop = clientHeight / 4;
    }
    //模块滚动触发选中时对视窗上部的距离
    var scrollTop = attr['scroll-top'];
    scrollTop = yui_string2Number(scrollTop);
    if (scrollTop && attr['scroll-top'].indexOf('%') !== -1) {
        scrollTop = scrollTop * clientHeight;
    }
    if (!scrollTop) {
        scrollTop = clientHeight / 2;
    }
    return Object.assign({ fixedTop: fixedTop, clickTop: clickTop, scrollTop: scrollTop }, attr);
}

/**
 *监听菜单滚动位置
 */
function yui_handleMenuRoll(scrollTop, menuDomOT, menuDom, blankDivDom, attr) {
    if (menuDomOT - scrollTop < attr['fixedTop']) {
        yui_bulkAddClasses(menuDom, ['yui-anchor-menu-fixed', attr['fixed-class']]);
        yui_bulkAddStyles(menuDom, { top: attr['fixedTop'] + 'px' });
        yui_bulkAddStyles(blankDivDom, { display: 'block' });
    } else {
        yui_bulkAddClasses(menuDom, ['yui-anchor-menu-fixed', attr['fixed-class']], 'remove');
        yui_bulkAddStyles(menuDom, { top: '' });
        yui_bulkAddStyles(blankDivDom, { display: 'none' });
    }
}

/**
 创建等高的空div
 */
function yui_appendBlankDiv(dom) {
    var divDom = document.createElement('div');
    yui_bulkAddStyles(divDom, {
        height: dom.offsetHeight + 'px',
        display: 'none'
    });
    dom.parentNode.insertBefore(divDom, dom);
    return divDom;
}

/**
 创建选中线div
 */
function yui_appendCheckedLine(dom) {
    var divDom = document.createElement('div');
    yui_bulkAddClasses(divDom, ['yui-anchor-menu-checked-line']);
    dom.appendChild(divDom);
    return divDom;
}

// anchorMenu =================================================== end //

// dialog =================================================== start //

/**
 监听遮罩点击事件
 */
function yui_dialogMaskClickListener() {
    var selectors = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'div[yui-dialog-mask]';
    var event = arguments[1];

    var dom = document.querySelectorAll(selectors);
    dom.forEach(function (item) {
        var dialog = item.querySelector('div[yui-dialog]');
        dialog.addEventListener('click', function (e) {
            e.stopPropagation();
        });
        item.addEventListener('click', function () {
            var attr = yui_bulkGetAttributes(item, ['click-mask-not-close', 'name']);
            if (attr['click-mask-not-close'] === null) {
                if (event) {
                    var flag = event(attr['name'], function () {
                        yuiDialogClosed(attr['name']);
                    });
                    if (flag === true) {
                        yuiDialogClosed(attr['name']);
                    }
                } else {
                    yuiDialogClosed(attr['name']);
                }
            }
        });
    });
}

/**
 打开对话框
 */
function yuiDialog(name) {
    var dom = document.querySelector('div[yui-dialog-mask][name=' + name + ']');
    if (dom) {
        //关闭其他对话框
        var allDom = document.querySelectorAll('div[yui-dialog-mask]');
        allDom.forEach(function (item) {
            yui_bulkAddStyles(item, { display: 'none' });
        });
        //添加动画
        var dialog = dom.querySelector('div[yui-dialog]');
        dialog.classList.remove('yui-dialog-closed');
        dialog.classList.add('yui-dialog-show');
        yui_bulkAddStyles(dom, { display: 'flex' });
        //处理滚动条
        var hasScrollBar = yui_hasScrollbar();
        if (hasScrollBar) {
            var bodyDom = document.body;
            yui_bulkAddStyles(bodyDom, {
                width: 'calc(100% - 17px)',
                overflow: 'hidden',
                position: 'relative'
            });
        }
    }
}

/**
 关闭对话框
 */
function yuiDialogClosed(name) {
    var dom = document.querySelector('div[yui-dialog-mask][name=' + name + ']');
    var dialog = dom.querySelector('div[yui-dialog]');
    dialog.classList.remove('yui-dialog-show');
    dialog.classList.add('yui-dialog-closed');
    setTimeout(function () {
        var bodyDom = document.body;
        yui_bulkAddStyles(bodyDom, {
            width: '',
            overflow: '',
            position: ''
        });
        if (dom.getAttribute('removeFromDom') !== null) {
            dom.remove();
        } else {
            yui_bulkAddStyles(dom, { display: 'none' });
        }
    }, 200);
}

/**
 * @description js打开消息对话框
 * @param title 标题，默认提示
 * @param content 内容
 * @param options 配置｛
 * showLeftBtn,leftBtnText,leftBtnAttr,
 * showRightBtn,rightBtnText,rightBtnAttr,
 * showCloseIcon,closeIconEventName,
 * clickMaskNotClosed
 * ｝
 * @return string 消息对话框名称
 */
function yuiMessageBox() {
    var title = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '提示';
    var content = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    // 初始化配置
    options = yui_json2Default(options, {
        showLeftBtn: false,
        leftBtnText: '取 消',
        leftBtnAttr: { size: 'mini' },
        leftBtnMethod: yuiDialogClosed,
        showRightBtn: true,
        rightBtnText: '确 定',
        rightBtnAttr: { size: 'mini', type: 'primary' },
        rightBtnMethod: yuiDialogClosed,
        showCloseIcon: true,
        beforeClose: yuiDialogClosed,
        clickMaskNotClosed: false
    });
    //生成名字
    var name = 'yui-dialog-' + yui_INDEX++;
    //新建dialog
    var newDialog = document.createElement('div');
    newDialog.innerHTML = '\n            <div yui-dialog messageBox>\n                <div yui-header>\n                    <div yui-left>\n                        ' + title + '\n                    </div>\n                    <div yui-right>\n                    </div>\n                </div>\n                <div yui-body>\n                    ' + content + '\n                </div>\n                <div yui-footer>\n                </div>\n            </div>';
    // 获取底部按钮部分
    var btnDom = newDialog.querySelector('div[yui-footer]');
    //生成按钮
    var addBtn2Dom = function addBtn2Dom(options, position, name) {
        var dom = document.createElement('a');
        var params = Object.assign({
            'yui-button': ''
        }, options[position + 'BtnAttr']);
        yui_bulkAddAttributes(dom, params);
        dom.innerText = options[position + 'BtnText'];
        dom.onclick = function () {
            options[position + 'BtnMethod'](name, function () {
                yuiDialogClosed(name);
            });
        };
        btnDom.appendChild(dom);
    };
    //生成左边按钮
    if (options['showLeftBtn'] === true) {
        addBtn2Dom(options, 'left', name);
    }
    //生成右边按钮
    if (options['showRightBtn'] === true) {
        addBtn2Dom(options, 'right', name);
    }
    //生成右上角图标
    if (options['showCloseIcon'] === true) {
        var iconDom = newDialog.querySelector('div[yui-right]');
        var closedIconDom = document.createElement('i');
        yui_bulkAddClasses(closedIconDom, ['iconfont', 'yui-closed']);
        iconDom.appendChild(closedIconDom);
        iconDom.onclick = function () {
            options['beforeClose'](name, function () {
                yuiDialogClosed(name);
            });
        };
    }
    // dialog一些属性
    var attr = {
        'removeFromDom': '',
        'yui-dialog-mask': '',
        name: name
    };
    yui_bulkAddAttributes(newDialog, attr);
    // 添加到body中
    document.body.appendChild(newDialog);
    //显示dialog
    yuiDialog(name);
    //监听点击遮罩关闭
    if (options['clickMaskNotClosed'] !== true) {
        attr['click-mask-not-close'] = '';
        if (options['beforeClose'] === yuiDialogClosed) {
            yui_dialogMaskClickListener('div[yui-dialog-mask][name=' + name + ']');
        } else {
            yui_dialogMaskClickListener('div[yui-dialog-mask][name=' + name + ']', options['beforeClose']);
        }
    }
    return name;
}

// dialog =================================================== end //

// menu =================================================== start //
/**
 * 菜单监听hover
 */
function yui_menuHoverListener() {
    var hasChildDom = document.querySelectorAll('div[contain-child-menu]');
    hasChildDom.forEach(function (childDom) {
        var parentMenuItem = childDom.querySelector('a[yui-menu-item]');
        var childPanelDom = childDom.querySelector('div[yui-child-menu]');
        var iconDom = childDom.querySelector('.yui-menu-icon');
        if (!iconDom) {
            parentMenuItem.insertAdjacentHTML('beforeEnd', '<i class=\'iconfont yui-drop-down yui-menu-icon\'></i>');
            iconDom = childDom.querySelector('.yui-menu-icon');
        }
        var childPanelDomHeight = childPanelDom.offsetHeight;
        var hideChildPanelSTO = void 0;
        var mouseListenerDom = [];
        mouseListenerDom.push(parentMenuItem, childPanelDom);
        mouseListenerDom.forEach(function (item) {
            item.addEventListener('mouseenter', function () {
                if (hideChildPanelSTO) {
                    clearTimeout(hideChildPanelSTO);
                }
                if (childPanelDom.style.visibility !== 'visible') {
                    yui_childrenMenuHide();
                    yui_bulkAddStyles(iconDom, { transform: 'rotate(180deg)' });
                    yui_bulkAddStyles(childPanelDom, { height: '0' });
                    setTimeout(function () {
                        yui_bulkAddStyles(childPanelDom, {
                            height: childPanelDomHeight + 'px',
                            visibility: 'visible'
                        });
                    }, 50);
                }
            });
            item.addEventListener('mouseleave', function () {
                hideChildPanelSTO = setTimeout(function () {
                    yui_bulkAddStyles(childPanelDom, { height: '0' });
                    setTimeout(function () {
                        yui_bulkAddStyles(childPanelDom, { visibility: 'hidden' });
                    }, 300);
                    yui_bulkAddStyles(iconDom, { transform: 'rotate(0deg)' });
                }, 300);
            });
        });
    });
}

/**
 * 隐藏所有子菜单
 */
function yui_childrenMenuHide() {
    var hasChildDom = document.querySelectorAll('div[contain-child-menu]');
    hasChildDom.forEach(function (childDom) {
        var childPanelDom = childDom.querySelector('div[yui-child-menu]');
        var iconDom = childDom.querySelector('.yui-menu-icon');
        yui_bulkAddStyles(childPanelDom, { visibility: 'hidden' });
        yui_bulkAddStyles(iconDom, { transform: 'rotate(0deg)' });
    });
}

// menu =================================================== end //

// message =================================================== start //

/**
 * @description js打开消息
 * @param content 内容
 * @param options 配置{type,theme,showIcon,delay}
 * @return string 消息对话框名称
 */
function yuiMessage() {
    var content = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    options = yui_json2Default(options, {
        type: 'info',
        theme: 'light',
        showIcon: true,
        delay: 5000
    });
    var messageBoxDom = document.querySelector('div[yui-message-box]');
    if (!messageBoxDom) {
        messageBoxDom = document.createElement('div');
        yui_bulkAddAttributes(messageBoxDom, { 'yui-message-box': '' });
        document.body.appendChild(messageBoxDom);
    }
    var messageDom = document.createElement('div');
    var name = 'yui-message-' + yui_INDEX++;
    var iconDom = '<i class=\'iconfont yui-' + options['type'] + '\'></i>';
    if (options['showIcon'] === false) {
        iconDom = '';
    }
    yui_bulkAddAttributes(messageDom, {
        'yui-message': '',
        name: name,
        type: options['type'],
        theme: options['theme']
    });
    messageDom.innerHTML = '' + iconDom + content;
    messageBoxDom.appendChild(messageDom);
    setTimeout(function () {
        yui_bulkAddStyles(messageDom, { top: '0px', opacity: 1 });
    }, 50);
    options['delay'] = yui_string2Number(options['delay']);
    setTimeout(function () {
        yui_messageRemove(messageDom);
    }, options['delay']);
    return name;
}

/**
 * 移除消息dom
 */
function yui_messageRemove(dom) {
    yui_bulkAddStyles(dom, { marginTop: -dom.clientHeight + 'px', opacity: 0 });
    setTimeout(function () {
        dom.remove();
    }, 300);
}

// message =================================================== end //

// notify =================================================== start //

/**
 * @description js打开通知
 * @param title 标题
 * @param content 内容
 * @param options 配置{type,showCloseIcon,delay}
 * @return string 消息对话框名称
 */
function yuiNotify() {
    var title = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '提示';
    var content = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    options = yui_json2Default(options, {
        type: null,
        showCloseIcon: true,
        delay: 5000,
        beforeClose: yui_notifyRemove
    });
    var notifyBoxDom = document.querySelector('div[yui-notify-box]');
    if (!notifyBoxDom) {
        notifyBoxDom = document.createElement('div');
        yui_bulkAddAttributes(notifyBoxDom, { 'yui-notify-box': '' });
        document.body.appendChild(notifyBoxDom);
    }
    var notifyDom = document.createElement('div');
    var name = 'yui-message-' + yui_INDEX++;
    yui_bulkAddAttributes(notifyDom, { 'yui-notify': '', name: name });
    yui_bulkAddStyles(notifyDom, { zIndex: -yui_INDEX });
    var typeIconDom = '';
    if (options['type']) {
        typeIconDom = '\n        <div yui-left>\n            <i class=\'iconfont yui-' + options['type'] + '\'></i>\n        </div>';
    }
    notifyDom.innerHTML = '\n        ' + typeIconDom + '\n        <div yui-center>\n            <div yui-header>\n                ' + title + '\n            </div>\n            <div yui-body>\n                ' + content + '\n            </div>\n        </div>';
    notifyBoxDom.appendChild(notifyDom);
    var yuiRightDom = '';
    if (options['showCloseIcon'] === true) {
        yuiRightDom = document.createElement('div');
        yui_bulkAddAttributes(yuiRightDom, { 'yui-right': '' });
        var iconDom = document.createElement('i');
        yui_bulkAddClasses(iconDom, ['iconfont', 'yui-closed']);
        iconDom.onclick = function () {
            options['beforeClose'](name, function () {
                yui_notifyRemove(name);
            });
        };
        yuiRightDom.appendChild(iconDom);
        notifyDom.appendChild(yuiRightDom);
    }
    setTimeout(function () {
        yui_bulkAddStyles(notifyDom, { 'left': '0px', 'opacity': 1 });
    }, 50);
    if (options['delay'] !== 0) {
        options['delay'] = yui_string2Number(options['delay']);
        setTimeout(function () {
            yui_notifyRemove(name, options['beforeClose']);
        }, options['delay']);
    }
}

/**
 * 移除通知dom
 */
function yui_notifyRemove(name, event) {
    var closed = function closed(name) {
        var dom = document.querySelector('div[yui-notify][name=' + name + ']');
        if (dom) {
            yui_bulkAddStyles(dom, { marginTop: -dom.offsetHeight - 24 + 'px', opacity: 0 });
            setTimeout(function () {
                dom.remove();
            }, 350);
        }
    };
    if (event && event !== yui_notifyRemove) {
        var returnFlag = event(name, function () {
            yui_notifyRemove(name);
        });
        if (returnFlag === true) {
            closed(name);
        }
    } else {
        closed(name);
    }
}

// notify =================================================== end //

// numberRun =================================================== start //
function yuiNumberRun(id, number, options) {
    options = yui_json2Default(options, {
        callback: null,
        count: 20
    });
    var dom = document.querySelector('#' + id);
    if (!dom) {
        yuiMessage('numberRun\u9519\u8BEF\uFF1A\u672A\u627E\u5230id=\'' + id + '\'\u7684\u5143\u7D20', { type: 'danger' });
        return;
    }
    var num = yui_string2Number(number);
    if (!num && num !== 0) {
        yuiMessage('numberRun\u9519\u8BEF\uFF1A\u975E\u6CD5\u503C\'' + num + '\'', { type: 'danger' });
        return;
    }
    var numStr = '' + num;
    var length = numStr.length;
    dom.innerText = '';

    var _loop = function _loop(i) {
        var str = numStr[i];
        var singleNum = parseInt(str);
        var numDom = document.createElement('span');
        if (str === '.') {
            numDom.innerText = str;
        } else {
            numDom.innerText = '0';
            setTimeout(function () {
                numDom.innerText = '' + singleNum;
                if (i === '0') {
                    yui_startNumberRun(numDom, singleNum, options['count'], options['callback'], num);
                } else {
                    yui_startNumberRun(numDom, singleNum, options['count']);
                }
            }, (length - i) * 150);
        }
        dom.appendChild(numDom);
    };

    for (var i in numStr) {
        _loop(i);
    }
}

function yui_startNumberRun(dom, value, count, callback, num) {
    var start = 0;
    var startCount = 0;
    var interval = setInterval(function () {
        start++;
        if (start === 10) {
            start = 0;
        }
        dom.innerText = '' + start;
        startCount++;
        if (count === startCount) {
            clearInterval(interval);
            dom.innerText = value;
            if (callback) {
                callback(num);
            }
        }
    }, 10);
}

// numberRun =================================================== end //

// radio =================================================== start //
/**
 * radio点击事件
 */
function yui_radioClickListener() {
    var dom = document.querySelectorAll('div[yui-radio]');
    dom.forEach(function (radio) {
        var clickItems = radio.querySelectorAll('a');
        clickItems.forEach(function (clickItem) {
            clickItem.addEventListener('click', function () {
                var radioAttr = yui_bulkGetAttributes(radio, ['yui-click']);
                var clickItemAttr = yui_bulkGetAttributes(clickItem, ['disabled', 'value']);
                if (clickItemAttr['disabled'] === null) {
                    if (radioAttr['yui-click']) {
                        var flag = eval(radioAttr['yui-click'] + ('(\'' + clickItemAttr['value'] + '\')'));
                        if (flag !== false) {
                            yui_radioCheckedChange(clickItems, clickItem);
                        }
                    } else {
                        yui_radioCheckedChange(clickItems, clickItem);
                    }
                }
            });
        });
    });
}

/**
 * 改变radio选中
 */
function yui_radioCheckedChange(dom, item) {
    dom.forEach(function (item) {
        item.removeAttribute('checked');
    });
    item.setAttribute('checked', '');
}

// radio =================================================== end //

// ribbon =================================================== start //
/**
 * 定位ribbon位置
 */
function yui_ribbonLocation() {
    var dom = document.querySelectorAll('div[yui-ribbon]');
    dom.forEach(function (item) {
        var position = item.getAttribute('position');
        var xOffset = item.clientWidth - item.clientWidth / 2 * Math.SQRT2;
        switch (position) {
            case 'top-left':
                yui_bulkAddStyles(item, {
                    transform: 'rotate(-45deg)',
                    transformOrigin: '100% 100%',
                    top: -item.clientHeight + 'px',
                    left: -xOffset + 'px'
                });
                break;
            case 'bottom-left':
                yui_bulkAddStyles(item, {
                    transform: 'rotate(45deg)',
                    transformOrigin: '100% 0',
                    bottom: -item.clientHeight + 'px',
                    left: -xOffset + 'px'
                });
                break;
            case 'bottom-right':
                yui_bulkAddStyles(item, {
                    transform: 'rotate(-45deg)',
                    transformOrigin: '0 0',
                    bottom: -item.clientHeight + 'px',
                    right: -xOffset + 'px'
                });
                break;
            default:
                yui_bulkAddStyles(item, {
                    transform: 'rotate(45deg)',
                    transformOrigin: '0 100%',
                    top: -item.clientHeight + 'px',
                    right: -xOffset + 'px'
                });
                break;
        }
    });
}

// ribbon =================================================== end //

// tabs =================================================== start //
/**
 * tabs点击监听
 */
function yui_tabsClickListener() {
    var dom = document.querySelectorAll('div[yui-tabs]');
    dom.forEach(function (tab) {
        var tabsAttr = yui_bulkGetAttributes(tab, ['yui-click', 'type', 'tab-position']);
        var headerDom = tab.querySelector('div[yui-header]');
        var panelsDom = tab.querySelectorAll('div[yui-body]>div[yui-tab-panel]');
        var checkedLineDom = yui_addTabsCheckedLine(tabsAttr);
        var items = headerDom.querySelectorAll('div[yui-header]>a[value]');
        items.forEach(function (item) {
            var itemAttr = yui_bulkGetAttributes(item, ['checked', 'value', 'disabled']);
            if (itemAttr['checked'] !== null && checkedLineDom) {
                if (itemAttr['disabled'] !== null) {
                    yui_bulkAddStyles(checkedLineDom, { backgroundColor: 'rgba(64, 158, 255,0.5)' });
                }
                headerDom.appendChild(checkedLineDom);
                yui_tabsCheckedLineMove(item, checkedLineDom, tabsAttr);
            }
            item.addEventListener('click', function () {
                if (itemAttr['disabled'] === null) {
                    var flag = false;
                    if (tabsAttr['yui-click']) {
                        flag = eval(tabsAttr['yui-click'] + ('(\'' + itemAttr['value'] + '\')'));
                    }
                    if (!tabsAttr['yui-click'] || flag !== false) {
                        yui_tabsChange(tabsAttr, items, item, checkedLineDom);
                        yui_tabsPanelChange(panelsDom, itemAttr['value']);
                    }
                }
            });
        });
    });
}

/**
 * 非card和border-card类型的tabs移动选中线
 */
function yui_tabsCheckedLineMove(itemDom, checkedLineDom, tabsAttr) {
    var position = tabsAttr['tab-position'];
    var disabled = itemDom.getAttribute('disabled');
    var bgc = '#409eff';
    if (disabled !== null) {
        bgc = 'rgba(64, 158, 255,0.5)';
    }
    yui_bulkAddStyles(checkedLineDom, { backgroundColor: bgc });
    if (position === 'left' || position === 'right') {
        yui_bulkAddStyles(checkedLineDom, {
            height: itemDom.clientHeight + 'px',
            top: itemDom.offsetTop + 'px'
        });
        return;
    }
    yui_bulkAddStyles(checkedLineDom, {
        width: itemDom.clientWidth + 'px',
        left: itemDom.offsetLeft + 'px'
    });
}

/**
 * 点击tab改变
 */
function yui_tabsChange(tabsAttr, items, nextItem, checkedLineDom) {
    if (checkedLineDom) {
        var preItem = '';
        items.forEach(function (item) {
            var checked = item.getAttribute('checked');
            if (checked !== null) {
                preItem = item;
            }
        });
        if (preItem) {
            yui_tabsCheckedLineMove(nextItem, checkedLineDom, tabsAttr);
            preItem.removeAttribute('checked');
        }
    } else {
        items.forEach(function (item) {
            item.removeAttribute('checked');
        });
    }
    nextItem.setAttribute('checked', '');
}

/**
 * 点击tab panel改变
 */
function yui_tabsPanelChange(panels, value) {
    panels.forEach(function (panel) {
        var name = panel.getAttribute('yui-tab-panel');
        if (name === value) {
            panel.setAttribute('checked', '');
        } else {
            panel.removeAttribute('checked');
        }
    });
}

/**
 * 非card和border-card类型的tabs添加选中线
 */
function yui_addTabsCheckedLine(tabsAttr) {
    if (tabsAttr['type'] === 'card' || tabsAttr['type'] === 'border-card') {
        return;
    }
    var checkedLineDom = document.createElement('div');
    checkedLineDom.classList.add('yui-tabs-checked-line');
    var style = void 0;
    switch (tabsAttr['tab-position']) {
        case 'left':
            style = { left: '100%', width: '2px' };
            break;
        case 'right':
            style = { right: '100%', width: '2px' };
            break;
        case 'bottom':
            style = { bottom: '100%', height: '2px' };
            break;
        default:
            style = { top: '100%', height: '2px' };
    }
    yui_bulkAddStyles(checkedLineDom, style);
    return checkedLineDom;
}

// tabs =================================================== end //
// tooltip =================================================== start //
/**
 * 监听tooltip hover
 */
function yui_tooltipListener() {
    var tooltips = document.querySelectorAll('div[yui-tooltip]');
    tooltips.forEach(function (tooltip) {
        var attr = yui_bulkGetAttributes(tooltip, ['content', 'position']);
        attr = yui_json2Default(attr, { content: '', position: 'top' });
        var textDom = tooltip.querySelector('div[yui-tooltip-text]');
        if (!textDom) {
            textDom = document.createElement('div');
            yui_bulkAddAttributes(textDom, { 'yui-tooltip-text': '' });
            textDom.innerText = attr['content'];
            tooltip.appendChild(textDom);
        }
        var pointDom = document.createElement('div');
        yui_bulkAddClasses(pointDom, ['yui-tooltip-point']);
        textDom.appendChild(pointDom);
        yui_tooltipLocation(tooltip, textDom, pointDom, attr['position']);
        var hideSTO = void 0;
        //监听hover离开
        tooltip.addEventListener('mouseleave', function () {
            hideSTO = setTimeout(function () {
                yui_bulkAddStyles(textDom, { opacity: '0' });
                setTimeout(function () {}, 500);
            }, 250);
        });
        //监听hover
        tooltip.addEventListener('mouseenter', function () {
            if (hideSTO) {
                clearTimeout(hideSTO);
            }
            yui_bulkAddStyles(textDom, { display: 'block' });
            setTimeout(function () {
                yui_bulkAddStyles(textDom, { opacity: '1' });
            }, 100);
        });
    });
}

/**
 * 位置
 * @param tooltip
 * @param textDom
 * @param pointDom
 * @param position
 */
function yui_tooltipLocation(tooltip, textDom, pointDom, position) {
    position = position || '';
    var firstPosition = position.split('-')[0];
    var secondPosition = position.split('-')[1] || '';
    var xPositionHandle = function xPositionHandle(textDom, pointDom, secondPosition) {
        switch (secondPosition) {
            case 'start':
                yui_bulkAddStyles(textDom, { left: '0' });
                yui_bulkAddStyles(pointDom, { left: '9px' });
                break;
            case 'end':
                yui_bulkAddStyles(textDom, { right: '0' });
                yui_bulkAddStyles(pointDom, { right: '9px' });
                break;
            default:
                var tooltipWidth = tooltip.clientWidth;
                var textWidth = textDom.clientWidth;
                yui_bulkAddStyles(textDom, { left: (tooltipWidth - textWidth) / 2 + 'px' });
                yui_bulkAddStyles(pointDom, { left: textWidth / 2 - 6 + 'px' });
                break;
        }
    };
    var yPositionHandle = function yPositionHandle(textDom, pointDom, secondPosition) {
        switch (secondPosition) {
            case 'start':
                yui_bulkAddStyles(textDom, { top: '0' });
                yui_bulkAddStyles(pointDom, { top: '9px' });
                break;
            case 'end':
                yui_bulkAddStyles(textDom, { bottom: '0' });
                yui_bulkAddStyles(pointDom, { bottom: '9px' });
                break;
            default:
                var tooltipHeight = tooltip.clientHeight;
                var textHeight = textDom.clientHeight;
                yui_bulkAddStyles(textDom, { top: (tooltipHeight - textHeight) / 2 + 'px' });
                yui_bulkAddStyles(pointDom, { top: textHeight / 2 - 6 + 'px' });
                break;
        }
    };
    switch (firstPosition) {
        case 'left':
            yui_bulkAddStyles(textDom, { right: 'calc(100% + 9px)' });
            yui_bulkAddStyles(pointDom, {
                left: '100%',
                borderColor: ' transparent transparent transparent #303133'
            });
            yPositionHandle(textDom, pointDom, secondPosition);
            break;
        case 'right':
            yui_bulkAddStyles(textDom, { left: 'calc(100% + 9px)' });
            yui_bulkAddStyles(pointDom, {
                right: '100%',
                borderColor: ' transparent #303133 transparent transparent'
            });
            yPositionHandle(textDom, pointDom, secondPosition);
            break;
        case 'bottom':
            yui_bulkAddStyles(textDom, { top: 'calc(100% + 9px)' });
            yui_bulkAddStyles(pointDom, {
                bottom: '100%',
                borderColor: ' transparent transparent #303133 transparent'
            });
            xPositionHandle(textDom, pointDom, secondPosition);
            break;
        default:
            yui_bulkAddStyles(textDom, { bottom: 'calc(100% + 9px)' });
            yui_bulkAddStyles(pointDom, { top: '100%' });
            xPositionHandle(textDom, pointDom, secondPosition);
    }
    yui_bulkAddStyles(textDom, { display: 'none' });
}

// tooltip =================================================== end //