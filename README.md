fs.io
=====================
fs.io 提供基于Promise(Q Promise)的文件、目录操作类库

api参考.net Framework System.IO命名空间下的

http://msdn.microsoft.com/en-us/library/System.IO(v=vs.110).aspx

`File` `FileInfo` 和`Directory`类

## 使用方法 ##

```
	var file = require('fs.io').file;
	var dict = require('fs.io').directory;
	file.copy(from,to)
		.done(function(){})
		.fail(function(){});
	...
```

## file ##

#### file.copy(src, dest, isOverride) ####
*src*  源路径

*dest* 目标路径

*isOverride* 是否覆盖目标文件

** 该api，使用`ncp`库进行复制 **

#### file.delete(path) ####

*path* 文件路径

#### file.isExists(path) ####

*path* 文件路径

promise在done函数从参数返回是否存在

```
	file.isExists("d:/saa.txt").done(function(exists){
		if(exists){

		}
	})
```

#### file.move(src, dest) ####

*src* 源路径
*dest* 目标路径


#### file.getLastAccessTime(path) ####

获取最后访问时间

#### file.getLastModifyTime(path) ####

获取文件最后修改时间

#### file.getCreateTime(path)  ####

获取文件创建时间

#### file.read(path) ####

**注意**
该函数返回值Stream.Readable对象

#### file.readAllText(path) #### 

读取文件的所有内容

#### file.write(path) ####

**注意**
该函数返回Stream.Wriable对象

#### file.writeAllText(path, text) ####

*path* 文件路径
*text* 写入文件内容

## directory ##

####  directory.createDirectory(path) ####

根据提供路径创建目录结构，路径中如果有任何目录不存在，则创建相应的目录

path 可为相对路径或绝对路径

相对路径则基于当前工作目录创建子目录

#### directory.delete(path, recursive) ####

删除文件目录，删非空目录时，recursive为true

#### directory.isExists(path) ####

目录是否存在，在resolve函数中，返回目录是否存在

#### directory.move(srcDir, destDir, override) ####

移动源目录到指定路径， overrid 可选，为true时覆盖目标路径内容

该函数封装`fs-extra`类库的`move`函数

#### directory.isDirectory(path) ####

指定路径是否为目录

#### directory.getDirectories(path, pattern) ####

*pattern* 目录搜索模式，支持 `glob`搜索方式，可选项，默认返回根目录下的第一级子目录，即 `pattern = "*"`

```
	directory.getDirectories("tmp/","**/*");//返回所有子目录
	directory.getDirectories("tmp/","**/abc*");//返回abc开头的所有子目录

```

#### directory.getFiles(path, pattern) ####

获取文件夹下所有文件路径，返回所有符合条件的文件地址

*pattern* 文件搜索模式，默认为 `**/*.*`，即返回所有文件

```
	directory.getFiles("path");//返回所有文件
	directory.getFiles("path","*.js");//返回根目录的js文件
	directory.getFiles("path","**/*.js");//返会目录下的所有js文件
```







