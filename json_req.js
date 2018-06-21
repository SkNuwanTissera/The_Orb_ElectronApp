const fn = (function sentiment(param) {
    var sentiment = require("node-sentiment")
    console.log(sentiment(param.text))
    return (sentiment(param.text))
})
const tf = fn.toString

const obj = {
    id:1243,
    name: "sentiment",
    fnc: JSON.stringify({fn:fn.toString()})
}
console.log(obj)


function sentiment(param) {
    var sentiment = require('node-sentiment')
    console.log(sentiment(param.text))
    return sentiment(param.text)
}

const param = {
    text: "this is a mountain, a very good weather yet the environment is polluted"
}
sentiment(param)