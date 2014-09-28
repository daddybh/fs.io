var file = require("./file"),
	fs = require('fs'),
	path = require("path");

var FileInfo = module.exports = function(filePath){
	if(!filePath){
		throw new Error("filePath not specify.");
		return;
	}
	var that = this,
		_stats;

	this.fullName = filePath;
	this.name = path.basename(filePath);
	this.extension = path.extname(filePath);
	this.directoryName = path.dirname(filePath);
	this.isStatReady = false;
	Object.defineProperty(that, "stats", {
		get : function(){
			if(that.isStatReady){
				return _stats;
			}else{
				_stats = fs.statSync(this.fullName);
				that.isStatReady = true;
				return _stats;
			}
		}
	});

	fs.stat(filePath, function(err, stats){
		if(!err && stats){
			that.isStatReady = true;
			_stats = stats;
		}
	});


	that.createTime = that.stats.ctime;
	that.lastAccessTime = that.stats.atime;
	that.lastModifyTime = that.stats.mtime;
	that.length = that.stats.size;
}

/**
 * check if file is exists
 * @return {Q.promise}
 */
FileInfo.prototype.isExists = function(){
	return file.isExists(this.path);
}

/**
 * copy file to dest path
 * @param  {String} destPath destination
 * @return {Q.promise}
 */
FileInfo.prototype.copyTo = function(destPath){
	return file.copy(this.fullName, destPath);
}

/**
 * move file to dest path
 * @param  {String} destPath destination
 * @return {Q.promise}
 */
FileInfo.prototype.moveTo = function(destPath){
	return file.move(this.fullName, destPath);
}

/**
 * open file as readable stream
 * @return {Stream} readable stream
 */
FileInfo.prototype.openRead = function(){
	return file.read(this.fullName);
}

/**
 * read file text
 * @return {Q.promise}
 */
FileInfo.prototype.openText = function(){
	return file.readAllText(this.fullName);
}

/**
 * open file as writeable stream
 * @return {Stream} writeable stream
 */
FileInfo.prototype.openWrite = function(){
	return file.write(this.fullName);
}

/**
 * delete file
 * @return {Q.promise}
 */
FileInfo.prototype.delete = function(){
	return file.delete(this.fullName);
}