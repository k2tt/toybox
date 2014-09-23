//calc-a 入力するたびに計算パターン

//名前空間
var OD = OD || {};
OD.Calc = OD.Calc || {};

;(function(){

  var Calc = OD.Calc,
      input = '',
      current = '',
      memory = [],
      phase = 0,
      $elm = null;

  /* 初期化
  --------------------------*/
  Calc.init = function() {

    var _this = this;

    //$elm代入
    $elm = this.elm = {
      mainView : $('#main-view'),
      subView : $('#sub-view'),
      ac : $('#ac'),
      equal : $('#equal'),
      num : $('.num'),
      oper : $('.oper')
    };

    //add event
    $elm.num.on('click', function(e) {
      _this.getNum(e);
    });

    $elm.ac.on('click', function() {
      _this.allClear();
    });

    $elm.oper.on('click', function(e) {
      _this.oper(e);
    });

    $elm.equal.on('click', function() {
      _this.equal();
    });

  };

  /* calc初期化
  --------------------------*/
  Calc.calc = function() {
    return this;
  };

  /* 数字入力
   * phase:0 数字入力
   * phase:1 演算子/イコール入力で計算する
  --------------------------*/
  Calc.getNum = function(e) {
    input += $(e.target).val();
    input = input.replace(/^0([0-9])/,"$1"); //0の後に数字が続く場合は、先頭の0を消す
    phase = 1; //フェーズを1に
    this.showResult(input);
  };

  Calc.oper = function(e) {
    console.log("oper｜input="+input+"｜current="+current+"｜phase="+phase);
    var op = $(e.target).text();
    current = current || input;
    if(phase === 1) {
      this.calc().showResult(current);
      input = "";
    }
    switch(op) {
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
    phase = 0;
  };

  Calc.equal = function() {
    if(phase === 1) {
      console.log("equal｜input="+input+"｜current="+current+"｜phase="+phase);
      this.calc().showResult(current);
      input = "";
      phase = 0;
    }
    return this;
  };

  Calc.allClear = function() {
    input = "";
    current = "";
    this.calc = function() {
      return this;
    };
    this.showResult(current);
  };

  Calc.showResult = function(result) {
    $elm.mainView.text(result);
  };
　
})();



/*----------------------------------------------
*
*   jQuery ready
*
----------------------------------------------*/

$(function(){

  OD.Calc.init();

});
