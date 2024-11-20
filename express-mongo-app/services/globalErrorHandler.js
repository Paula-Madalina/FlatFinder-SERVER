const errorHandler = (error,req,res) => {
    console.log('error handler called')
    console.log(error)
    if(error.statusCode) {
        console.warn(`HTTP ${err.statusCode} on ${req,url}`)
        res.status(statusCode).json({error:error.name, message:error.message})
    }else {
        console.error('unhandled error: ', error.message)
        res.status(500).json({error:"internal server error",message:error.message})
    }
}
module.exports = {errorHandler} 