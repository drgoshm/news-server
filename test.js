import loadtest from 'loadtest'
import http from 'http'
const options = {
    url: 'http://localhost:8080',
    maxRequests: 100000,
}
const PORT = '8070'

const requestHandler = (request, response) => {
    loadtest.loadTest(options, function(error, result)
    {
        if (error)
        {
            return console.error('Got an error: %s', error);
        }
        response.end(`Tests run successfully\nTotal requests: ${result.totalRequests}\nTotal Errors: ${result.totalErrors}\nTotal time: ${result.totalTimeSeconds}s\nRPS: ${result.rps}\nMax Latency: ${result.maxLatencyMs}ms\nMin Latency: ${result.minLatencyMs}ms`);
    })
}

const server = http.createServer(requestHandler)
server.listen(PORT, (err) => {
    if (err) {
        return console.log('something bad happened', err)
    }
    console.log(`server is listening on ${PORT}`)
})