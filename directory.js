var Q = require('q'),
	fs = require('fs'),
	fsExtra = require('fs-extra'),
	glob = require('glob'),
	path = require('path');

var directory = module.exports = {};

/**
 * create directory in specify path or name
 * @param  {String} path directory path
 * @return {Q.Promise}
 */
directory.createDirectory = function(path){
	var pathArray = getPathArray(path);
	var def = Q.defer(), results = [];
	def.resolve();
	var promise = def.promise;
	pathArray.forEach(function(path){
		promise = promise.then(function(){
			return createPath(path);
		}).then(function(str){
			results.push(str);
		});
	});
	return promise.then(function(){
		return results;
	})

	function createPath(curPath){
		var def = Q.defer();

		directory.isExists(curPath)
			.then(function(exists){
					if(exists){
						def.resolve(curPath);
					}else{
						fs.mkdir(curPath, function(err){
							if(err){
								def.reject(err);
							}else{
								def.resolve(curPath);
							}
						});
					}
				});
		return def.promise;
	}
}
/**
 * get every path layer of a specific path
 * @example 
 * 	c:/www/php/doc will return array
 *  ["c:","c:/www","c:/www/php","c:/www/php/doc"]
 *  /www/php/doc will return
 *  [cwd+"www",cwd+"www/php",cwd+"www/php/doc"]
 * @param  {String} currPath 
 * @return {Q.Promise}
 */
function getPathArray(currPath){
	var cwd = directory.getCurrentDirecotry();
	currPath = path.normalize(currPath);
	var newPath = path.resolve(cwd, currPath);
	var pathItems = [], result = [];
	result = getPathList(currPath, false);
	return result;

	function getPathList(curPath){
		var pathItems = curPath.split(path.sep), result = [];
		pathItems = pathItems.filter(function(n){ 
			return n !== "" && n !== undefined;
		});

		for (var i = 0, len = pathItems.length; i< len;  i++) {
			
			var tmpPath = pathItems[i];
			if(i === 0 && tmpPath.indexOf(":")>0){
				tmpPath = path.join(tmpPath, "/");
			}else{
				tmpPath = path.join.apply(null,pathItems.slice(0,i+1));
			}
			result.push(path.resolve(cwd,tmpPath));
		}
		return result;
	}
}

/**
 * remove a direcotry from disk
 * @param  {String} path      folder to deleted
 * @param  {Boolean} recursive whether delete subdirecoties or files recursively
 * @return {Q.promise}
 */
directory.delete = function(path, recursive){
	if(!recursive){
		return Q.nfcall(fs.rmdir, path);
	}else{
		return Q.nfcall(fsExtra.remove, path);
	}
}

/**
 * check if direcotry exists
 * @param  {String}  path direcotry path
 * @return {Q.Promise}      success if exist, failed if none
 */
directory.isExists = function(path){
	var def = Q.defer();
	fs.exists(path, function(exists){
		def.resolve(exists);
	});
	return def.promise;
}

/**
 * move srcDir to destDir
 * @param  {String} srcDir   source directory
 * @param  {String} destDir  destination directory
 * @param  {Boolean} override is override dest path
 * @return {Q.Promise}
 */
directory.move = function(srcDir, destDir, override){
	return Q.nfcall(fsExtra.move, srcDir, destDir, {clobber: !!override});
}

/**
 * check if a path is a direcotry
 * @param  {String}  path direcotry path
 * @return {Q.Promise}      
 * success if is a direcotry,
 * failed if error occurs or not exists
 */
directory.isDirectory = function(path){
	var def = Q.defer();
	fs.lstat(path, function(err, stats){
		if(err){
			def.reject(err);
		} else {
			def.resolve(stats.isDirectory());
		}
	});
	return def.promise;
}

/**
 * get sub directories from specific path or current path
 * @param  {String|Optional} path    current path
 * @param  {String|Optional} pattern search pattern
 * @return {Q.promise}
 */
directory.getDirectories  = function(path, pattern){
	var dicts = [],
		def = Q.defer();

	if(!pattern){
		pattern = "*";
	}
	if (!path) {
		path = directory.getCurrentDirecotry();
	}

	glob(pattern, {cwd: path, root: path, nounique : false}, function(err, files){
		if(err){
			def.reject(err);
			return;
		}
		var opts = files.map(function(filePath){
				var def = Q.defer();
				var realPath = require('path').resolve(path, filePath);
				directory.isDirectory(realPath)
					.then(function(isDir){
						if(isDir)
							def.resolve(realPath);
						else{
							def.reject();
						}
					}, function(err){
						def.reject(err);
					});
				return def.promise;
			});
		Q.all(opts).then(function(results){
			def.resolve(results);
		});
	})

	return def.promise;
}

/**
 * get all files of directory
 * @param  {String|Optional} path    direcotry to search
 * @param  {String|Optional} pattern search pattern
 * @return {Q.Promise}
 */
directory.getFiles = function(path, pattern){
	if(!pattern){
		pattern = "**/*.*";
	}
	if(!path){
		path = directory.getCurrentDirecotry();
	}
	return Q.nfcall(glob, pattern, {cwd: path, root: path, nounique : false});
}

directory.getCurrentDirecotry = function(){
	return process.cwd();
}