import http from 'http'
import fetch from 'node-fetch'
import convert from 'xml-js'

const PORT = '8080',
    URL = 'https://news.google.com/rss?hl=en-US&gl=US&ceid=US:en',
    UPDATE_PERIOD = 6e4;

const newsTitleList = []

const updateNewsTitles = async () => {
    try {
        const res = await fetch(URL),
        xml = await res.text()
        newsTitleList.length = 0
        newsTitleList.push(...convert.xml2js(xml, {compact: true, spaces: 4}).rss.channel.item)
        console.log(`${new Date()}: titles updated, now ${newsTitleList.length} items`)
    }
    catch(e) { console.log(e) }
}
updateNewsTitles()
setInterval(updateNewsTitles, UPDATE_PERIOD)

const requestHandler = (request, response) => {
    const html_list = newsTitleList.reduce((list, item) => {
        return list + `<li><a href="${item.link._text}">${item.title._text}</a></li>`
    }, '<ol>') + '</ol>';
    response.end(`<html lang="en"><head></head><body>${html_list}</body></html>`)
}

const server = http.createServer(requestHandler)
server.listen(PORT, (err) => {
    if (err) {
        return console.log('something bad happened', err)
    }
    console.log(`server is listening on ${PORT}\ntitles will be updated every ${UPDATE_PERIOD}ms`)
})
