async function Ping(req,res) {
    res.status(200).send("hello world")
}

module.exports = { Ping };