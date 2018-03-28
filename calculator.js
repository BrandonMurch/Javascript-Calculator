/*
  @description - a simple javascript calculator to mimic a real world example.
  @input - based solely on clicking the GUI to use the calculator.
  @author - Brandon - Brandon.Murch@protonmail.com.
*/
$(document).ready(function(){


let operators = { // a object holding the possible operators used in the calculator.
  "/": function(a,b){return a / b;},
  "*": function(a,b){return a * b;},
  "-": (a,b) => {return a-b;},
  "+": function(a,b){return a+b;},
  "squareRoot": function(a){return Math.sqrt(a);},
  "percent" : function(a,b){return a*(b/100)}
};

/*
  @calculator - calculator object where all the calculations are done
  @screenNum - holds what is currently on the screen. Used to build the numbers.
  @calculation - is an array where the calculation is built. ex '3' '*' '4'.
  @previous - holds the last time an equation was completed
  @memory - used to hold the number currently in the memory function
  @decimalActive - used to switch into entering to the right of the decimal
                   once the decimal button is pressed.
  @decCounter - used to count the decimal places being entered to prevent
                rounding errors in Javascript
*/
  var calculator = { //
    screenNum : 0,
    calculation : [],
    previous : 0,
    memory : 0,
    decimalActive : true,
    decCounter : 1,


    displayNumber : function(display) { // displays any information to the calculator screen.
      document.getElementsByClassName("calculator__screenText")[0].innerHTML = display;
    },

    clearSome : function() { // same as the C button on the calculator, clears to the last time an equation was completed
      this.calculation = [this.previous];
      this.screenNum = this.previous;
      this.decCounter = 1;
      this.decimalActive = true;
      this.displayNumber(this.previous);
    },

    clearAll : function() { // resets the calculator
      this.calculation = [];
      this.screenNum = 0;
      this.displayNumber(0);
      this.decCounter = 1;
      this.decimalActive = true;
    },

    memRecall : function() { // displays the number that is currently in memory
      this.displayNumber(this.memory);
      this.screenNum = this.memory;
    },

    memPlus : function() { // adds the current number to the number in memory
      this.memory += this.screenNum;
    },

    memMinus : function() { // subtracts the current number from the number in memory
      this.memory -= this.screenNum;
    },
                    /*
                    percentage takes the current number on the screen,
                    and takes that percentage from the first number inputted
                    eg. 70 + 5% = 73.5
                    */
    percentage : function(){
      this.displayNumber(this.screenNum + '&#37');
      this.screenNum = operators["percent"](this.calculation[0],this.screenNum);
    },

    squareRoot : function(){ // Square roots the number currently on screen
      this.screenNum = operators["percent"](this.screenNum);
      this.displayNumber(this.screenNum);
    },
                    /* executes the operation, then updates
                    the screenNum, & returns the answer*/
    calculateExecute : function(value, op) {
      let temp;
      if (op == "squareRoot"){
        temp = Math.round(operators["squareRoot"](value[0])*100000000)/100000000;
      } else {
        temp = Math.round(operators[op](value[0],value[2])*100000000)/100000000;
      };
      if (temp.length > 14){
        alert("Error: Length is too long for calculator");
      } else {
        this.previous = temp;
        this.displayNumber(temp);
        return temp;
      }
    },
                    /*
                    @input - this is what handles the input from the GUI.
                     -  First we check whether it is a number, or operation being
                        entered
                     -  If an operation, we reset the decimal so the following
                        entry will return to normal integers.
                     -  The initial data input ensures that the zero index of the
                        calculation array is populated first from the number on
                        the screen, afterwards the calculator will place the
                        responses in the zero index, the new operators in the
                        first index and the new numbers in the second index.
                     -  Before executing the operation, the second index is
                        checked to ensure that it is a number. If not, the
                        new operator is shifted to the first index. If the user
                        presses a new operator, that one will be used.
                        e.g: + is presses, followed directly by -, - will be used.
                     -  If the operator isn't "=" it is placed into the first index.
                     -  otherwise we reset the array with only the current answer.
                     -  Finally we build the numbers on screen by adding the current
                        number multiplied by 10 to the new number. If the decimal
                        button is pressed, we start building to the right of the
                        decimal by dividing by 10 to the power of x (decCounter).

                    */
    input : function(id, value, posOrNeg){
      if (id == 'op'){
        this.decimalActive = true;   // decimal reset
        if (this.calculation[0] != 0){  //does nothing if operator is pushed first
          if (this.calculation.length < 2){    // initial data input
            this.calculation[0] = this.screenNum;
            this.screenNum = 0;
          }
          else if (this.calculation.length >= 2 && this.screenNum != 0){
              this.calculation[2] = this.screenNum;
              this.screenNum = 0;
                    // checks that the second number is indeed a number
              if(Number.isInteger(Math.round(this.calculation[2]))){
                this.calculation = [this.calculateExecute(this.calculation,this.calculation[1])];
              }else{// shifts the new operator into position
                this.calculation[1] = this.calculation[2];
                this.calculation[2] = 0;
              }
          }
          if(this.calculation[1] != "=" && value != "="){
            this.calculation[1] = (value)
          } else {
            let temp = this.calculation[0];
            this.calculation = [temp];
            this.screenNum = temp;
          }
      }
    } else if (id == 'num'){ // number builder
        if (this.screenNum.length >= 14){
          alert("Too many numbers! I'm but a wee calculator!")
        } else if (!this.decimalActive) { // check if decimal has been pressed
          this.screenNum = Math.round((this.screenNum + (value/Math.pow(10,this.decCounter)))
            *Math.pow(10,this.decCounter))/Math.pow(10,this.decCounter);
          this.decCounter++;
          this.displayNumber(this.screenNum);
        }else{
          this.screenNum = (this.screenNum * 10) + value;
          this.displayNumber(this.screenNum);
        }}
      },
};

       // a series of input listeners for each button on the calculator.

  $(document).on("click",".calculator__button--off",function searchQuery(){
    calculator.clearAll();
    calculator.displayNumber('');
  });
  $(document).on("click",".calculator__button--MRC",function searchQuery(){
    calculator.memRecall();
  });
  $(document).on("click",".calculator__button--mMinus",function searchQuery(){
    calculator.memMinus();
  });
  $(document).on("click",".calculator__button--mPlus",function searchQuery(){
    calculator.memPlus();
  });
  $(document).on("click",".calculator__button--divide",function searchQuery(){
    calculator.input('op', "/");
  });
  $(document).on("click",".calculator__button--percent",function searchQuery(){
    calculator.percentage();
  });
  $(document).on("click",".calculator__button--seven",function searchQuery(){
    calculator.input('num', 7);
  });
  $(document).on("click",".calculator__button--eight",function searchQuery(){
    calculator.input('num', 8);
  });
  $(document).on("click",".calculator__button--nine",function searchQuery(){
    calculator.input('num', 9);
  });
  $(document).on("click",".calculator__button--multiply",function searchQuery(){
    calculator.input('op', "*");
  });
  $(document).on("click",".calculator__button--squareRoot",function searchQuery(){
    calculator.squareRoot();
  });
  $(document).on("click",".calculator__button--four",function searchQuery(){
    calculator.input('num', 4);
  });
  $(document).on("click",".calculator__button--five",function searchQuery(){
    calculator.input('num', 5);
  });
  $(document).on("click",".calculator__button--six",function searchQuery(){
    calculator.input('num', 6);
  });
  $(document).on("click",".calculator__button--subtract",function searchQuery(){
    calculator.input('op', "-");
  });
  $(document).on("click",".calculator__button--clear",function searchQuery(){
    calculator.clearSome();
  });
  $(document).on("click",".calculator__button--one",function searchQuery(){
    calculator.input('num', 1);
  });
  $(document).on("click",".calculator__button--two",function searchQuery(){
    calculator.input('num', 2);
  });
  $(document).on("click",".calculator__button--three",function searchQuery(){
    calculator.input('num', 3);
  });
  $(document).on("click",".calculator__button--plus",function searchQuery(){
    calculator.input('op', "+");
  });
  $(document).on("click",".calculator__button--allClear",function searchQuery(){
    calculator.clearAll();
  });
  $(document).on("click",".calculator__button--zero",function searchQuery(){
    calculator.input('num', 0);
  });
  $(document).on("click",".calculator__button--decimal",function searchQuery(){
    calculator.decimalActive = false;
  });
  $(document).on("click",".calculator__button--equal",function searchQuery(){
    calculator.input("op", "=");
  });
});
