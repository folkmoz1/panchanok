const cloudinary = require('cloudinary').v2


cloudinary.config({
    cloud_name:  process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API,
    api_secret: process.env.CLOUD_SECRET
})

const deleteImage = async public_id => {
    return  await cloudinary.uploader.destroy(public_id,(err, result) => {
        if (err) throw err

        return  true
    })
}

module.exports = {
    cloudinary,
    deleteImage
}
