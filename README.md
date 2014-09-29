fs.io
=====================
fs.io 提供基于Promise(Q Promise)的文件、目录操作类库

api参考.net Framework System.IO命名空间下的

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

#### file.copy ####
*src*  源路径

*dest* 目标路径

*isOverride* 是否覆盖目标文件

** 该api，使用`ncp`库进行复制 **

#### file.delete ####

*path* 文件路径

#### file.isExists ####

*path* 文件路径

promise在done函数从参数返回是否存在

```
	file.isExists("d:/saa.txt").done(function(exists){
		if(exists){

		}
	})
```

#### file.move ####

*src* 源路径
*dest* 目标路径


#### file.getLastAccessTime ####

获取最后访问时间

#### file.getLastModifyTime ####

获取文件最后修改时间

#### file.getCreateTime  ####

获取文件创建时间

#### file.read ####

**注意**
该函数返回值Stream.Readable对象

#### file.readAllText #### 

读取文件的所有内容

#### file.write ####

**注意**
该函数返回Stream.Wriable对象

#### file.writeAllText ####

*path* 文件路径
*text* 写入文件内容



