const console = document.getElementById("console")
console.innerHTML += "<h2>console</h2>"

function format (number)
{
    return (number < 10) ? "0" + (number).toString() : (number).toString()
}

function log (string)
{
    const date = new Date()
    const timestamp = format(date.getHours()) + ":" + format(date.getMinutes()) + ":" + format(date.getSeconds())
    console.innerHTML += "<p>" + timestamp + " : " + string + "</p>"
    console.scrollTop = console.scrollHeight - console.clientHeight;
}

window.onerror = function (msg, url, line) {
    const date = new Date()
    const timestamp = format(date.getHours()) + ":" + format(date.getMinutes()) + ":" + format(date.getSeconds())
    console.innerHTML += "<p style=\"color:#FF0000;\">" + timestamp + " : ERROR : " + msg + " " + url + " " + line + "</p>"
    console.scrollTop = console.scrollHeight - console.clientHeight;
    return true;
}