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
	return Q.nfcall(fs.mkdir, path);
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
		exists ? def.resolve() : def.reject();
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
			stats.isDirectory() ? def.resolve(path) : def.reject();
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
	var results = [];

	if(!pattern){
		pattern = "*";
	}
	if (!path) {
		path = directory.getCurrentDirecotry();
	}

	return Q.nfcall(glob, pattern, {cwd: path, root: path, nounique : false}).then(function(files){
		var opts = files.map(function(filePath){
				var def = Q.defer();
				var realPath = require('path').resolve(path, filePath);
				directory.isDirectory(realPath)
					.then(function(dict){
						def.resolve(dict);
					}, function(){
						def.reject();
					});
				return def.promise;
			});
		return Q.allSettled(opts).then(function(results){
			var dicts = [];
			results.forEach(function(ele){
				if(ele.state === "fulfilled"){
					dicts.push(ele.value);
				}
			});
			return dicts;
		});
	});
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
