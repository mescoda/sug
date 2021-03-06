// css 需要另行设置
;(function() {

    if(!String.prototype.trim) {
        String.prototype.trim = function(str) {
            return this.replce('/^\s+|\s+$/g', '');
        }
    }

    if(!Array.prototype.indexOf) {
        Array.prototype.indexOf = function(target, start) {
            for(var i = (start || 0), len = this.length; i < len; i++) {
                if(this[i] === target) {
                    return i;
                }
            };
            return -1;
        }
    }

    function _extend(prev, add) {
        var result = prev || {},
            i;
        for(i in add) {
            if(add.hasOwnProperty(i)) {
                result[i] = add[i];
            }
        }
        return result;
    }

    function _isEmptyOrSpacing(str) {
        if(str == '' || str.match(/^\s+$/)) {
            return true;
        } else {
            return false;
        }
    }

    function _addEvent(elem, type, fn) {
        if(document.addEventListener) {
            elem.addEventListener(type, fn, false);
        } else if(document.attachEvent) {
            elem.attachEvent('on' + type, function(e) {
                e.preventDefault = function() {
                    e.returnValue = false;
                };
                e.stopPropagation = function() {
                    e.cancelBubble = true;
                };
                fn.call(elem, e);
            });
        }
    }

    function _toCamelCase(str) {
        return str.replace(/-([\da-z])/gi, function(all, letter) {
            return (letter + "").toUpperCase();
        });
    }
    function _toDashCase(str) {
        return str.replace(/([A-Z])/g, '-$1').toLowerCase();
    }
    function _checkCSSFloat() {
        var div = document.createElement('div');
        div.style.cssText = 'float:left';
        return !!div.style.cssFloat ? 'cssFloat' : 'styleFloat';
    }
    function _getStyle(elem, name) {
        var inlineName = name === 'float' ? _checkCSSFloat() : _toCamelCase(name),
            oriName = _toDashCase(name);
        if(elem.style.inlineName) {
            return elem.style[inlineName];
        } else if(document.defaultView && document.defaultView.getComputedStyle) {
            return document.defaultView.getComputedStyle(elem, null).getPropertyValue(oriName);
        } else if(elem.currentStyle) {
            return elem.currentStyle[inlineName];
        } else {
            return null;
        }
    }
    function _setStyle(elem, cssObject) {
        var name,
            inlineName,
            oriName;
        for(name in cssObject) {
            if(cssObject.hasOwnProperty(name)) {
                inlineName = (name === 'float') ? _checkCSSFloat() : _toCamelCase(name);
                elem.style[inlineName] = cssObject[name];
            }
        }
    }
    function _getOffset(elem) {
        var offsetTop = 0,
            offsetLeft = 0;
        while(elem) {
            offsetTop += elem.offsetTop;
            offsetLeft += elem.offsetLeft;
            elem = elem.offsetParent;
        }
        return {
            top: offsetTop,
            left: offsetLeft
        }
    }
    function _getBoundingClientRect(elem) {
        var temp = document.createElement('div'),
            tempTop,
            tempLeft;
        temp.style.cssText = 'position: absolute; top: 0; left: 0';
        document.body.appendChild(temp);
        tempTop = temp.getBoundingClientRect().top;
        tempLeft = temp.getBoundingClientRect().left;
        document.body.removeChild(temp);
        temp = null;
        return {
            top: elem.getBoundingClientRect().top - tempTop,
            left: elem.getBoundingClientRect().left - tempLeft,
            bottom: elem.getBoundingClientRect().bottom - tempTop,
            right: elem.getBoundingClientRect().right - tempLeft
        }
    }

    function _trim(string) {
        if(string) {
            return string.replace(/^\s+|\s+$/g, '');
        }
    }
    function _clearMultiSpace(string) {
        if(string) {
            return string.replace(/\s+/g, ' ');
        }
    }
    function _addClass(elem, className) {
        var classNameList = className,
            singleClassName,
            rSingleClassName;
        if(typeof className === 'string') {
            classNameList = classNameList.split(' ');
        }
        if(elem.nodeType === 1) {
            if(!elem.className && classNameList.length === 1) {
                elem.className = classNameList[0];
            } else {
                for(var i = 0, iLen = classNameList.length; i < iLen; i++) {
                    singleClassName = classNameList[i];
                    rSingleClassName = new RegExp('\\b(' + singleClassName + ')\\b');
                    if(rSingleClassName.test(elem.className)) {

                    } else {
                        elem.className = elem.className + ' ' + singleClassName;
                    }
                }
            }
        }
        elem.className = _trim(elem.className);
        elem.className = _clearMultiSpace(elem.className);
    }

    function _removeClass(elem, className) {
        var classNameList = className,
            singleClassName,
            rSingleClassName;
        if(typeof className === 'string') {
            classNameList = classNameList.split(' ');
        }
        if(elem.nodeType === 1 && elem.className) {
            for(var i = 0, iLen = classNameList.length; i < iLen; i++) {
                singleClassName = classNameList[i];
                rSingleClassName = new RegExp('\\b(' + singleClassName + ')\\b');
                if( rSingleClassName.test(elem.className) ) {
                    elem.className = (elem.className).replace(rSingleClassName, ' ');
                }
            }
        }
        elem.className = _trim(elem.className) || '';
        elem.className = _clearMultiSpace(elem.className) || '';
    }

    function _hasClass(elem, classname) {
        var className = " " + classname + " ",
            rclass = /[\t\r\n]/g;
        if ( elem.nodeType === 1 && (" " + elem.className + " ").replace(rclass, " ").indexOf( className ) >= 0 ) {
            return true;
        }
        return false;
    }

    function _getParents(elem) {
        var parents = [elem],
            currentElem = elem.parentNode;
        while(currentElem && currentElem.nodeType !== 9) {
            if(currentElem.nodeType === 1) {
                parents.push(currentElem);
            }
            currentElem = currentElem.parentNode;
        }
        return parents;
    }

    function _getElementsByClassName(className, elem) {
        elem = elem || document;
        if (elem.getElementsByClassName) {
            return elem.getElementsByClassName(className);
        }
        var elems = [];
        var children = elem.getElementsByTagName('*');
        var classRegExp = new RegExp('(^|\\s)' + className.replace(/\-/g, '\\-') + '(\\s|$)');
        for (var i = 0, l = children.length; i < l; i++) {
            if (classRegExp.test(children[i].className)) { elems.push(children[i]); }
        }
        return elems;
    }

    function _delegateEvent(father, type, targetClassname, fn) {
        _addEvent(father, type, function(e) {
            var target = e.target || e.srcElement;
            while( !_hasClass(target, targetClassname) && target != father) {
                target = target.parentNode;
            }
            if( _hasClass(target, targetClassname) ) {
                fn.call(target, e);
            }
        });
    }

    var ie = (function(){
        var undef,
            v = 3,
            div = document.createElement('div'),
            all = div.getElementsByTagName('i');
        while (
            div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->',
            all[0]
        );
        return v > 4 ? v : undef;
    }());

    var _tmplCache;
    function _tmpl(str, data) {
        // Simple JavaScript Templating
        // John Resig - http://ejohn.org/ - MIT Licensed
        var fn = !/\W/.test(str) ?
            _tmplCache[str] = _tmplCache[str] ||
            _tmpl(document.getElementById(str).innerHTML) :

        // Generate a reusable function that will serve as a template
        // generator (and which will be cached).
        new Function("obj",
            "var p=[],print=function(){p.push.apply(p,arguments);};" +

            // Introduce the data as local variables using with(){}
            "with(obj){p.push('" +

            // Convert the template into pure JavaScript
            str
            .replace(/[\r\t\n]/g, " ")
            .split("<%").join("\t")
            .replace(/((^|%>)[^\t]*)'/g, "$1\r")
            .replace(/\t=(.*?)%>/g, "',$1,'")
            .split("\t").join("');")
            .split("%>").join("p.push('")
            .split("\r").join("\\'") + "');}return p.join('');");

        // Provide some basic currying to the user
        return data ? fn(data) : fn;
    }

    function Sug(options) {
        var defaultOptions = {
            // sugListId: 'sug-list',
            sugListBorderWidth: 1,
            offset: {
                top: 0,
                left: 0
            },
            // input interval
            type: '',
            dataType: 'jsonp',
            // delay 是 keyup 和 blur 后两者的 delay
            delay: 150,
            completeWhenKeyUpDown: false
        };
        this.options = _extend(defaultOptions, options || {});
        // this.options.sugListElem = document.getElementById(this.options.sugListId);
        this.dataCache = {};
        this.selectedIndex = -1;
        this.inputTimer;
        this.intervalTimer;
        // 用于 check input 中的内容有无变化，是否需要发请求要数据
        // 一直是用来保存无论是 interval 还是 timeout 之前的 input value
        this.preValue;
        // 用于上下 select 的时候还原最初的 inputValue
        this.valueCache;
        this.init();
    }

    Sug.prototype.init = function() {
        this.setStyle();
        switch(this.options.type) {
            case 'input':
                this.bindInputEvent();
                break;
            case 'interval':
                this.bindIntervalEvent();
                break;
        }
        this.bindSugListItemEvent();
    };

    Sug.prototype.bindInputEvent = function() {
        var inputElem = this.options.inputElem,
            self = this,
            _keydownHandler = this.keydownHandler(),
            _keyupHandler = this.keyupHandler(),
            _inputHandler = this.inputHandler();

        _addEvent(inputElem, 'keydown', _keydownHandler);

        // _addEvent(inputElem, 'keyup', _keyupHandler);

        _addEvent(inputElem, 'input', _inputHandler);
        _addEvent(inputElem, 'propertychange', _inputHandler);

        _addEvent(inputElem, 'blur', function(e) {
            if(ie == 9) {
                if (e.type === "focus") {
                    document.addEventListener("selectionchange", _inputHandler, false);
                } else {
                    document.removeEventListener("selectionchange", _inputHandler, false);
                }
            }
            setTimeout(function() {
                self.hideSugList();
            }, self.options.delay);
        });

        _addEvent(inputElem, 'focus', function(e) {
            // 这里加 setTimeout 是解决 win 下在 focus 状态点击其他窗口然后点击浏览器空白部分时候的 sug 闪烁问题
            setTimeout(function() {
                self.prepareSug();
            }, self.options.delay);
            if(ie == 9) {
                if (e.type === "focus") {
                    document.addEventListener("selectionchange", _inputHandler, false);
                } else {
                    document.removeEventListener("selectionchange", _inputHandler, false);
                }
            }
        });

        _addEvent(this.options.sugListElem, 'mouseout', function() {
            self.selectedIndex = -1;
        });

        _addEvent(this.options.submitElem, 'click', function(e) {
            if(_isEmptyOrSpacing(self.getCurrentValue())) {
                e.preventDefault();
            }
        });
    };

    Sug.prototype.bindIntervalEvent = function() {
        var inputElem = this.options.inputElem,
            self = this,
            _keydownHandler = this.keydownHandler(),
            _inputHandler = this.inputHandler();

        _addEvent(inputElem, 'focus', function(e) {
            if(self.intervalTimer) {
                clearInterval(self.intervalTimer);
            }
            self.intervalTimer = setInterval(function() {
                self.prepareSug();
            }, 100);
        });
        _addEvent(inputElem, 'blur', function(e) {
            if(self.intervalTimer) {
                clearInterval(self.intervalTimer);
            }
            setTimeout(function() {
                self.hideSugList();
            }, self.options.delay);
        });
        _addEvent(inputElem, 'keydown', _keydownHandler);

        // mouseout 后对 selectedIndex 的 reset 防止键盘鼠标交替操作 current 不准的问题
        _addEvent(this.options.sugListElem, 'mouseout', function() {
            self.selectedIndex = -1;
        });

        _addEvent(this.options.submitElem, 'click', function(e) {
            if(_isEmptyOrSpacing(self.getCurrentValue())) {
                e.preventDefault();
            }
        });
    };

    Sug.prototype.bindSugListItemEvent = function() {
        var self = this;
        _delegateEvent(this.options.sugListElem, 'mouseover', this.options.itemClassName, function(e) {
            var target = e.target || e.srcElement;
            self.clearCurrent();
            _addClass(this, self.options.currentClassName);
            self.selectedIndex = this.getAttribute('data-index');
        });

        _delegateEvent(this.options.sugListElem, 'mouseout', this.options.itemClassName, function(e) {
            var target = e.target || e.srcElement;
            self.clearCurrent();
        });

        _delegateEvent(this.options.sugListElem, 'click', this.options.itemClassName, function() {
            self.selectCurrent();
            self.submit();
        });
    };

    Sug.prototype.setStyle = function() {
        var inputElem = this.options.inputElem,
            inputElemClientRec = _getBoundingClientRect(this.options.inputElem);

        inputElem.setAttribute('autocomplete', 'off');

        this.options.inputElemOuterHeight = inputElemClientRec.bottom - inputElemClientRec.top;
        this.options.inputElemOuterWidth = inputElemClientRec.right - inputElemClientRec.left;
        this.options.inputElemOffset = _getOffset(this.options.inputElem);

        var realSugListWidth = this.options.sugListWidth ? parseInt(this.options.sugListWidth) : this.options.inputElemOuterWidth - 2 * this.options.sugListBorderWidth;
        realSugListWidth = Math.max(realSugListWidth, 0) + 'px';

        _setStyle(this.options.sugListElem, {
            top: this.options.inputElemOffset.top + this.options.inputElemOuterHeight + this.options.offset.top - this.options.sugListBorderWidth + 'px',
            left: this.options.inputElemOffset.left + this.options.offset.left + 'px',
            // width: this.options.sugListWidth ? parseInt(this.options.sugListWidth) + 'px' : this.options.inputElemOuterWidth - 2 * this.options.sugListBorderWidth + 'px'
            width: realSugListWidth
        });
    };

    Sug.prototype.keydownHandler = function() {
        // 用于上下选中 sug item，隐藏 sug list，回车 submit
        var self = this;
        return function(e) {
            switch(e.keyCode) {
                case 27:
                    // esc
                    self.hideSugList();
                    break;
                case 38:
                    // up
                    self.selectPrev();
                    break;
                case 40:
                    // down
                    self.selectNext();
                    break;
                case 13:
                    // enter
                    self.selectCurrent();
                    self.submit();
                    break;
                default:
                    return;
            }
            e.stopPropagation();
            e.preventDefault();
        };
    };

    Sug.prototype.keyupHandler = function() {
        // keyup 的时候开始进行 sug
        var self = this;
        return function(e) {
            switch(e.keyCode) {
                case 27:
                case 38:
                case 40:
                    return;
            }
            self.startSug();
        };
    };
    Sug.prototype.inputHandler = function() {
        // input 和 propertychange 事件时候进行 sug
        var self = this;
        return function() {
            self.startSug();
        };
    };
    Sug.prototype.startSug = function() {
        var self = this;
        if(this.inputTimer) {
            clearTimeout(this.inputTimer);
        }
        this.inputTimer = setTimeout(function() {
            self.prepareSug();
        }, this.options.delay);
    };
    Sug.prototype.getCurrentValue = function() {
        return this.options.inputElem.value;
    };
    Sug.prototype.prepareSug = function() {
        var currentValue = this.getCurrentValue();
        // console.log('current:', currentValue, 'pre:', this.preValue);
        if( currentValue != this.preValue ) {
            // preValue 在三个地方可以被赋值：1. 这里的每次 input 如果又变化 2. hide 之后的重置 3. up down 时候防止触发 getData 时候的改变
            this.preValue = currentValue;
            this.selectedIndex = -1;
            if(!_isEmptyOrSpacing(currentValue)) {
                this.valueCache = currentValue;
                if(typeof this.dataCache[currentValue] == 'undefined') {
                    this.getData(currentValue);
                } else {
                    this.renderSugList(currentValue);
                }
            } else {
                this.hideSugList();
            }
        } else {
            // 这里现在已经不需要做什么处理了
            // inputHandler 的时候在用退格清空 input 中的最后一个字符 比如 s 然后又输入跟之前一样的一个字符 s 这个时候因为 currentValue 和 this.preValue 一样，现在已经做了处理：在 hide 的时候加了判断，如果判断 current 为空了就重置全部为 ''
            // 但是在 interval 的时候只会在清空后的一瞬间出现 currentValue == this.preValue
            if(!_isEmptyOrSpacing(currentValue)) {
                // this.renderSugList(this.valueCache, this.selectedIndex);
            }
        }
    };
    Sug.prototype.getData = function(currentValue) {
        var self = this,
            url = this.options.url,
            paramString = '',
            data = this.options.data || {};
        for(var i in data) {
            if(data.hasOwnProperty(i)) {
                paramString += ( '&' + i + '=' + data[i]);
            }
        }
        if(url.indexOf('?') >= 0) {
            url = this.options.url + '&' + this.options.param + '=' + encodeURIComponent(currentValue) + paramString;
        } else {
            url = this.options.url + '?' + this.options.param + '=' + encodeURIComponent(currentValue) + paramString;
        }
        FlyJSONP.get({
            url: url,
            success: function(data) {
                // config
                self.cacheData(currentValue, data);
                self.renderSugList(currentValue);
            }
        });
    };
    Sug.prototype.cacheData = function(currentValue, data) {
        this.dataCache[currentValue] = data;
    };
    Sug.prototype.clearDataCache = function(value) {
        if(value) {
            this.dataCache[value] = null;
        } else {
            this.dataCache = null;
        }
    };
    Sug.prototype.renderSugList = function(currentValue, selectedIndex) {
        if(!currentValue) {
            return;
        }
        selectedIndex = (selectedIndex == undefined) ? -1 : selectedIndex;
        var sugData = this.dataCache[currentValue];
        if(sugData && sugData.length > 0) {
            var sugListHtml = _tmpl(this.options.tmplString, {
                data: sugData,
                selectedIndex: selectedIndex,
                limit: sugData.length > this.options.sugListItemLimit ? this.options.sugListItemLimit : sugData.length
            });
            this.options.sugListElem.innerHTML = sugListHtml;
            this.showSugList();
        } else {
            this.hideSugList();
        }
    };

    Sug.prototype.dispose = function() {

    };
    Sug.prototype.hideSugList = function() {
        this.options.sugListElem.style.display = 'none';
        // hide 后的一些重置，防止重新 focus 后的问题
        if(this.getCurrentValue().length > 0) {
            this.preValue = this.valueCache;
            this.valueCache = this.getCurrentValue();
        } else {
            // input 为空了
            this.preValue = '';
            this.valueCache = '';
        }
        // 为了在 focus 的时候如果又内容就自动显示 sug 的处理
        this.preValue = '';
        this.selectedIndex = -1;
    };
    Sug.prototype.showSugList = function() {
        var sugListElem = this.options.sugListElem;
        if(sugListElem.getElementsByTagName('li').length > 0) {
            sugListElem.style.display = 'block';
        }
    };
    Sug.prototype.isShowSugList = function() {
        return _getStyle(this.options.sugListElem, 'display') != 'none';
    };
    Sug.prototype.selectNext = function() {
        var sugListElem,
            sugListItemNum,
            targetItemElem;
        if(this.isShowSugList()) {
            sugListElem = this.options.sugListElem;
            sugListItemNum = sugListElem.getElementsByTagName('li').length;
            if(this.selectedIndex == sugListItemNum - 1) {
                this.selectedIndex = -1;
            } else {
                ++this.selectedIndex;
            }
            targetItemElem = sugListElem.getElementsByTagName('li')[this.selectedIndex];
            this.clearCurrent();
            targetItemElem && _addClass(targetItemElem, this.options.currentClassName);
            if(this.options.completeWhenKeyUpDown) {
                if(this.selectedIndex == -1) {
                    this.options.inputElem.value = this.valueCache;
                    this.preValue = this.valueCache;
                } else {
                    var selectedValue = _getElementsByClassName(this.options.valueClassName, targetItemElem)[0].innerHTML;
                    this.preValue = selectedValue;
                    this.options.inputElem.value = selectedValue;
                }
            }
        }
    };
    Sug.prototype.selectPrev = function() {
        var sugListElem,
            sugListItemNum,
            targetItemElem;
        if(this.isShowSugList()) {
            sugListElem = this.options.sugListElem;
            sugListItemNum = sugListElem.getElementsByTagName('li').length;
            if(this.selectedIndex == -1) {
                this.selectedIndex = sugListItemNum - 1;
            } else {
                --this.selectedIndex;
            }
            targetItemElem = sugListElem.getElementsByTagName('li')[this.selectedIndex];
            this.clearCurrent();
            targetItemElem && _addClass(targetItemElem, this.options.currentClassName);
            if(this.options.completeWhenKeyUpDown) {
                if(this.selectedIndex == -1) {
                    this.options.inputElem.value = this.valueCache;
                    this.preValue = this.valueCache;
                } else {
                    var selectedValue = _getElementsByClassName(this.options.valueClassName, targetItemElem)[0].innerHTML;
                    this.preValue = selectedValue;
                    this.options.inputElem.value = selectedValue;
                }
            }
        }
    };
    Sug.prototype.clearCurrent = function() {
        var currentElems = _getElementsByClassName(this.options.currentClassName);
        for(var i = 0, iLen = currentElems.length; i < iLen; i++) {
            _removeClass(currentElems[i], this.options.currentClassName)
        }
    };
    Sug.prototype.getSelectedItem = function() {
        var sugListElem = this.options.sugListElem;
        if(this.isShowSugList) {
            return _getElementsByClassName(this.options.currentClassName, sugListElem)[0];
        } else {
            return null;
        }
    };
    Sug.prototype.selectCurrent = function() {
        var currentSelectedItem = this.getSelectedItem();
        if(currentSelectedItem) {
            this.options.inputElem.value = _getElementsByClassName(this.options.valueClassName, currentSelectedItem)[0].innerHTML;
            this.hideSugList();
            this.options.inputElem.blur();
        }
    };
    Sug.prototype.submit = function() {
        if(!_isEmptyOrSpacing(this.getCurrentValue())) {
            this.options.formElem.submit();
        }
    };

    window.Sug = Sug;
})();
