var result = [];
function fibonacci(n, output) {
  var a = 1, b = 1, sum;
  for (var i = 0; i < n; i++) {
    output.push(a);
    sum = a + b;
    a = b;
    b = sum;
  }
}
fibonacci(16, result);
alert(result.join(', '));

var x= 21;var s=22; x+s

--
sign up form
- email, password -> generate UUID using mail+password -> unique id for user
- store that id in persistant db
- keep a session for the app using that UUID
-
SDK devolopment
--
-------------------------------------
function add(param) {
        let total = 0
        for(let elem in param) {
                total += param[elem];
        }
        return total;
}

----------------------------------------------------------------------------------
{ id: 1243,
  name: 'sentiment',
  fnc: '{"fn":"function sentiment(param) {\\r\\n    var sentiment = require(\\"node-sentiment\\")\\r\\n    console.log(sentiment(param.text))\\r\\n    return (sentiment(param.text))\\r\
\n}"}' }
----------------------------------------------------------------------------------

{
	"params": {
		"text": "this is the gbest best "
	},
	"name":"sentiment"
}
-----------------------------------------------------------------------------------
function sentiment(param) {
	var sentiment = require("node-sentiment")
	console.log(sentiment(param.text))
	return sentiment(param.text)
}

function sentimentNew(param) {
	var sentiment = require("node-sentiment")
	console.log(sentiment(param))
	return sentiment(param)
}