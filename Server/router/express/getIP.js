require('dotenv').config()

module.exports = (PORT) => {
    try{
        const nets = require('os').networkInterfaces()
        const results = {}
        for (const name of Object.keys(nets)) {
            for (const net of nets[name]) {
                // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
                if (net.family === 'IPv4' && !net.internal) {
                    if (!results[name]) {
                        results[name] = [];
                    }
                    results[name].push(`http://${net.address}:${PORT}`);
                }
            }
        }
        console.log(results)
        const wifi = process.env["wifi"] || 'en0' || '乙太網路'
        return results[wifi][0]
    }catch (e){
        console.log('no wifi connection')
        console.log('########### catching ###########')
        console.log(e)
        return 'http://localhost:4000'
    }
}