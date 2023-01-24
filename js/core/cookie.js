function readValueFromCookie(key)
{
    var CookieRecord = document.cookie;
    var IndividualCookies = CookieRecord.split(' ');
    for (var i = 0; i < IndividualCookies.length; ++i)
    {
        if (IndividualCookies[i].includes(key))
        {
            const value = (IndividualCookies[i].split('=')[1]).replace(";", "")
            return value
        }
    }
    return "none"
}

function writeValueToCookie(key, value)
{
    document.cookie = key + "=" + value
}