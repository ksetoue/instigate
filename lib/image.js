'use strict';
const azure = require('azure-storage');
const stream = require('stream');
const formidable = require('formidable');
const path = require('path')
const blobService = azure.createBlobService();
const fs = require('fs');
const ImageService = {}
ImageService.containerName = 'image'

blobService.createContainerIfNotExists(ImageService.containerName, {publicAccessLevel: 'blob'}, function(err, result, response){})

ImageService.insertImage = function(req){
  return new Promise(function(resolve, reject){
    let uploadfolder = path.join(__dirname, '../files/');
    if (mkdirsSync(uploadfolder)) {
      req.pipe(req.busboy);
      req.busboy.on('field', function(name, value){
        req.body[name] = value;
      });
      req.busboy.on('file', function(fieldname,file,filename){
        if(filename){
          req.body.file = {file, filename}
        }
      })
      req.busboy.on('file', function(fieldname,file,filename){
        if(filename){
          let fstream = fs.createWriteStream(uploadfolder + filename);
          file.pipe(fstream);
          fstream.on('close', function () {
            blobService.createBlockBlobFromLocalFile(ImageService.containerName, req.body.username, uploadfolder + filename, function (error, result, response) {
              if (!error) {
                resolve(`https://${process.env.AZURE_STORAGE_ACCOUNT}.blob.core.windows.net/${ImageService.containerName}/${req.body.username}`)
              } else {
                reject(error);
              }
            })
          });
        }else{
          resolve();
        }
      });
    }
  })
}

function mkdirsSync(dirpath, mode) {
    if (!fs.existsSync(dirpath)) {
        var pathtmp;
        dirpath.split("\\").forEach(function (dirname) {
            if (pathtmp) {
                pathtmp = path.join(pathtmp, dirname);
            }
            else {
                pathtmp = dirname;
            }
            if (!fs.existsSync(pathtmp)) {
                if (!fs.mkdirSync(pathtmp, mode)) {
                    return false;
                }
            }
        });
    }
    return true;
}

module.exports = ImageService;
