//calc-a 入力するたびに計算パターン

/**
 * 名前空間
 * OD.Calc
 */
var OD = OD || {};
OD.Calc = (function(){
  "use strict";

  var Calc = {};

  var input = '';
  var current = '';
  var memory = [];
  var phase = 0;
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
      equal : $('#equal'),
      num : $('.num'),
      operator : $('.operator')
    };

    /**
     * Attach event
     */
    $elm.num.on('click', function(elm) {
      _this.inputNum(elm);
    });

    $elm.ac.on('click', function() {
      _this.allClear();
    });

    $elm.operator.on('click', function(e) {
      _this.operator(e);
    });

    $elm.equal.on('click', function() {
      _this.equal();
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
   * @param {element}
   * phase:0 数字入力
   * phase:1 演算子/イコール入力で計算する
   */
  Calc.inputNum = function(elm) {
    input += $(elm.target).val();
    input = input.replace(/^0([0-9])/,"$1"); //0の後に数字が続く場合は、先頭の0を消す
    phase = 1; //フェーズを1に
    this.renderResult(input);
  };

  /**
   * オペレーター入力
   * @param {element}
   */
  Calc.operator = function(e) {
    console.log("operator｜input="+input+"｜current="+current+"｜phase="+phase);

    var operatorStr = $(e.target).text();
    current = current || input;

    if(phase === 1) {
      this.calc().renderResult(current);
      input = "";
    }

    switch(operatorStr) {
      case '+':
        this.calc = function(){
          current = parseFloat(current) + parseFloat(input);
          return this;
        };
        break;
      case '-':
        this.calc = function(){
          current = parseFloat(current) - parseFloat(input);
          return this;
        };
        break;
      case '*':
        this.calc = function(){
          current = parseFloat(current) * parseFloat(input);
          return this;
        };
        break;
      case '/':
        this.calc = function(){
          current = parseFloat(current) / parseFloat(input);
          return this;
        };
        break;
    }

    this.renderSubView(operatorStr);

    phase = 0;
  };

  /**
   * イコール
   * return {object} this
   */
  Calc.equal = function() {
    if(phase === 1) {
      console.log("equal｜input="+input+"｜current="+current+"｜phase="+phase);
      current = current || input;
      this.calc().renderSubView().renderResult(current);
      input = "";
      phase = 0;
    }
    return this;
  };

  /**
   * 表示を初期化する
   */
  Calc.allClear = function() {
    input = "";
    current = "";
    this.calc = function() {
      return this;
    };
    this.renderSubView().renderResult(current);
  };

  /**
   * サブビューを更新する
   */
  Calc.renderSubView = function(operatorStr) {
    var subText = operatorStr || "";
    $elm.subView.text(subText);
    return this;
  };

  /**
   * 結果を更新する
   * @param {String|Number}
   */
  Calc.renderResult = function(result) {
    // console.log(typeof result); //TODO 渡ってくる値の方が2パターンある
    // console.log(result);
    $elm.mainView.text(result);
  };

  return Calc;
　
})();

OD.Calc.init();