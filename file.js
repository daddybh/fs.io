var Q = require('q'),
	ncp = require('ncp'),
	fs = require('fs');

var file = module.exports = {};

/**
 * 复制文件
 * @param  {String}  src        待复制文件
 * @param  {String}  dest       目标文件路径
 * @param  {Boolean} isOverride 是否覆盖
 * @return {Q.Promise}
 */
file.copy = function(src, dest, isOverride){
	var def = Q.defer();
	fs.exists(dest, function(isExists){
		if(isExists && !isOverride){ 
			def.resolve();
		}else{
			ncp(src, dest, function(err){
				if(err){
					def.reject(err);
				}else{
					def.resolve();
				}
			});
		}
	});
	return def.promise;
}

/**
 * 删除文件
 * @param  {String} path 文件路径
 * @return {Q.promise}
 */
file.delete = function(path){
	return file.isExists(path).then(function(exists){
		if(exists){
			return Q.nfcall(fs.unlink, path);
		}else{
			return;
		}
	});
}

/**
 * 判断文件是否存在
 * @param  {String} path 路径
 * @return {Q.promise}
 */
file.isExists = function(path){
	var def = Q.defer();
	fs.exists(path, function(isExists){
		def.resolve(isExists);
	});
	return def.promise;
}

/**
 * 移动文件
 * @param  {String} src  源文件
 * @param  {String} dest 目标路径
 * @return {Q.promise}
 */
file.move = function(src, dest){
	var def = Q.defer();
	fs.link(src, dest, function(err){
		if(err){
			def.reject(err);
		}else{
			fs.unlink(src, function(err){
				if(err){
					def.reject(err);
				}else{
					def.resolve();
				}
			});
		}
	});
	return def.promise;
}

/**
 * 获取Last Access Time
 * @param  {String} path 路径
 * @return {Q.Promise}
 */
file.getLastAccessTime = function(path){
	return getStat(path).then(function(stat){
		return stat.atime;
	});
}

/**
 * 获取最后修改时间
 * @param {String} path 路径
 * @return {Q.promise}
 */
file.getLastModifyTime = function(path){
	return getStat(path).then(function(stat){
		return stat.mtime;
	})
}

/**
 * 获取创建时间
 * @param {String} path 路径
 * @return {String}
 */
file.getCreateTime = function(path){
	return getStat(path).then(function(stat){
		return stat.ctime;
	})
}

function getStat(path){
	var def = Q.defer();
	fs.stat(path, function(err, stat){
		if(err){
			def.reject(err);
		}else{
			def.resolve(stat);
		}
	});
	return def.promise;
}

/**
 * 读取目录文件
 * @param  {String} path 文件路径
 * @return {Stream}      
 */
file.read = function(path){
	return fs.createReadStream(path);
}

/**
 * 读取文件内容
 * @param  {String} path 文件路径
 * @return {Q.Promise}      progress: 文件读取chunk done: 文件文本 failed： 出错信息
 */
file.readAllText = function(path){
	var stream = fs.createReadStream(path),
		result = "",
		def = Q.defer();
	stream.on("data", function(chunk){
		result += chunk;
		def.notify(chunk);
	})
	.on("end", function(){
		def.resolve(result);
	})
	.on("error", function(err){
		def.reject(err);
	});
	return def.promise;
}

/**
 * 根据路径创建一个writeStream
 * @param  {String} path 目标写入路径
 * @return {Stream}      writeable stream
 */
file.write = function(path){
	return fs.createWriteStream(path);
}

/**
 * 写入text到指定路径
 * @param  {String} path 路径
 * @param  {String} text 文本
 * @return {Q.Promise}      
 */
file.writeAllText = function(path, text){
	return Q.nfcall(fs.writeFile, path, text);
}

/**
 * append text to the end of the file.
 * @param  {String} path file location
 * @param  {String} text to append
 * @return {Q.Promise}
 */
file.appendText = function(path, text){
	return Q.nfcall(fs.appendFile, path, text);
}