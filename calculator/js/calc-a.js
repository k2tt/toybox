/**
 * 名前空間
 * OD.Calc
 */
var OD = OD || {};
OD.Calc = (function(){
  'use strict';

  var Calc = {};

  /**
   * @type string|number
   * input - 入力中の数字
   * current - 現在の計算結果
   * phase:0 - 数字入力
   * phase:1 - 演算子/イコール入力で計算する
   * phase:2 - イコール後 次の入力が数字ならAC
   */
  var state = {
    input : '',
    current : '',
    phase : 0,
    shortMemory : ['0'],
    longMemory : ['0']
  };

  var $elm = null;

  /**
   * 初期化
   */
  Calc.init = function() {

    var _this = this;

    /**
     * $elm代入
     * @type element
     */
    $elm = _this.elm = {
      mainView : $('#main-view'),
      subView : $('#sub-view'),
      ac : $('#ac'),
      ce : $('#ce'),
      equal : $('#equal'),
      num : $('.num'),
      point : $('#point'),
      operator : $('.operator'),
      signInversion : $('#signInversion')
    };

    /**
     * Attach event
     */
    $elm.num.on('click', function(elm) {
      _this.inputNum(elm);
    });

    $elm.point.on('click', function() {
      _this.inputPoint();
    });

    $elm.ac.on('click', function() {
      _this.allClear();
    });

    $elm.ce.on('click', function() {
      _this.clearEntry();
    });

    $elm.operator.on('click', function(e) {
      _this.operator(e);
    });

    $elm.equal.on('click', function() {
      _this.equal();
    });

    $elm.signInversion.on('click', function() {
      _this.signInversion();
    });

    Mousetrap.bind(['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'], function(e, key) {
      _this.inputNum(key);
    }).bind('.', function() {
      _this.inputPoint();
    }).bind(['+', '-', '*', '/'], function(e, key) {
      _this.operator(key);
    }).bind(['=', 'return', 'enter'], function(e) {
      e.preventDefault();
      _this.equal();
    }).bind('c', function() {
      _this.allClear();
    }).bind(['del', 'backspace'], function() {
      _this.clearEntry();
    });

  };

  /**
   * 計算処理の初期化
   */
  Calc.calc = function() {
    return this;
  };

  /**
   * 数字入力
   * @param {object|string}
   */
  Calc.inputNum = function(e) {
    var num = state.input;

    //イコール直後なら一度ACを挟む
    if(state.phase === 2) {
      this.allClear();
    }

    //クリックとキープレスで処理を分ける
    if(typeof e === 'object') {
      num += $(e.target).val();
    }
    else if(typeof e === 'string') {
      num += e;
    }

    //0の後に数字が続く場合は、数字の前の0を消す
    state.input = num.replace(/^0+([0-9])/,'$1');
    state.phase = 1;
    this.addMemory(state.input).renderResult(state.input);
  };

  /**
   * 小数点入力
   * @param {element}
   */
  Calc.inputPoint = function() {
    var num = state.input;

    //イコール直後なら一度ACを挟む
    if(state.phase === 2) {
      this.allClear();
    }

    //既に小数点が含まれていれば return
    if(num.indexOf('.') >= 0) {
      return this;
    }

    num = num || '0';
    num += '.';
    state.input = num;

    state.phase = 1;
    this.addMemory(state.input).renderResult(state.input);
  };

  /**
   * オペレーター入力
   * @param {element}
   */
  Calc.operator = function(e) {
    // console.log('operator｜input='+state.input+'｜current='+state.current+'｜phase='+state.phase);

    var operatorStr = '';

    //クリックとキープレスで処理を分ける
    if(typeof e === 'object') {
      // console.log('object'+$(e.target).text());
      operatorStr = $(e.target).text();
    }
    else if(typeof e === 'string') {
      // console.log('string'+ e);
      operatorStr = e;
    }

    state.input = state.input || '0';

    //最後が小数点なら少数点を省く
    if(state.input.slice(-1) === '.') {
      state.input = state.input.slice(0, -1);
    }

    // state.current = (state.current === '') ? state.input : state.current;

    //state.current にまだ値がない場合は履歴に追加しない
    if (state.current === '') {
      state.current = state.input;
    }
    else if (state.phase === 1) {
      this.calc().addMemory(state.current).renderResult(state.current);
    }

    console.log('operator｜input='+state.input+'｜current='+state.current+'｜phase='+state.phase);

    switch(operatorStr) {
      case '+':
        this.calc = function(){
          var currentNum = parseFloat(state.current) + parseFloat(state.input);
          state.current = currentNum + '';
          return this;
        };
        break;
      case '-':
        this.calc = function(){
          var currentNum = parseFloat(state.current) - parseFloat(state.input);
          state.current = currentNum + '';
          return this;
        };
        break;
      case '*':
        this.calc = function(){
          var currentNum = parseFloat(state.current) * parseFloat(state.input);
          state.current = currentNum + '';
          return this;
        };
        break;
      case '/':
        this.calc = function(){
          var currentNum = parseFloat(state.current) / parseFloat(state.input);
          state.current = currentNum + '';
          return this;
        };
        break;
    }

    state.input = '';
    state.phase = 0;
    this.renderSubView(operatorStr);
  };

  /**
   * 符号反転
   * return {object} this
   */
  Calc.signInversion = function() {
    if (state.phase === 0 || state.phase === 2) {
      if (state.current === '') {
        return;
      }
      state.current = -state.current + '';
      this.addMemory(state.current).renderResult(state.current);
    }
    else if (state.phase === 1) {
      state.input = -state.input + "";
      this.addMemory(state.input).renderResult(state.input);
    }
    return this;
  };

  /**
   * イコール
   * return {object} this
   */
  Calc.equal = function() {
    if(state.phase === 1) {
      console.log('equal｜input='+state.input+'｜current='+state.current+'｜phase='+state.phase);

      //state.current にまだ値がない場合は履歴に追加しない
      if (state.current === '') {
        state.current = state.input;
      }
      else {
        this.calc().addMemory(state.current).renderSubView().renderResult(state.current);
      }

      state.shortMemory = [];
      state.input = '';
      state.phase = 2;
    }
    return this;
  };

  /**
   * 一つ前の結果に戻る
   */
  Calc.clearEntry = function() {
    state.shortMemory.pop();
    state.input = state.shortMemory[state.shortMemory.length - 1] || '0';
    $('#memory').text(state.shortMemory);
    return this.renderResult(state.input);
  };

  /**
   * 表示を初期化する
   */
  Calc.allClear = function() {
    this.calc = function() {
      return this;
    };
    state.current = '';
    state.input = '';
    state.shortMemory = [];
    this.renderSubView().addMemory('0').renderResult('0');
  };

  /**
   * 履歴を追加
   * @param {String}
   */
  Calc.addMemory = function(result) {

    //立て続けの0は履歴に入れない
    if (result === '0' && state.shortMemory[state.shortMemory.length - 1] === '0') {
      return this;
    }

    state.shortMemory.push(result);
    state.longMemory.push(result);
    $('#memory').text(state.shortMemory); //test
    return this;
  };

  /**
   * サブビューを更新する
   */
  Calc.renderSubView = function(opt_operatorStr) {
    var subText = opt_operatorStr || '';
    // console.log('renderSubView' + subText);
    $elm.subView.text(subText);
    return this;
  };

  /**
   * 数字のカンマ区切り
   * @param  {String} num
   * @return {String}
   */
  Calc.separate = function(num){
    return String(num).replace( /(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
  };

  /**
   * 結果を更新する
   * @param {String}
   */
  Calc.renderResult = function(result) {
    // console.log(typeof result);
    var separateResult = this.separate(result);
    $elm.mainView.text(separateResult);
    console.log('renderResult｜input='+state.input+'｜current='+state.current+'｜phase='+state.phase);
    return this;
  };

  return Calc;

  //TODO
  // ・長履歴をどこかに表示させる？
  // ・CE時にオペレーターも消す？
  // ・%対応
  // ・モデルとビューコントロールに分離する？

})();

OD.Calc.init();
