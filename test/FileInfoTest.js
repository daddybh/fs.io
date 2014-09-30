var FileInfo = require('../fs.io').FileInfo,
	chai = require('chai'),
	assert = chai.assert,
	should = chai.should,
	expect = chai.expect,
	file = require('../fs.io').file,
	fs = require('fs'),
	dir = require('../fs.io').directory;

var chaiAsPromised = require("chai-as-promised");
chai.should();
chai.use(chaiAsPromised);


describe("File not exists", function(){
	it("should not error", function(done){
		try{
			var file = new FileInfo("d:/www/whatever.txt");	
			done();
		}catch(err){
			done(err);
		}
	});

	it("still can read fullName, name, extension, directoryName property", function(){
		var file = new FileInfo("d:/www/whatever.txt");
		assert.ok(file.fullName.length >0, "fullName read");
		assert.ok(file.name.length >0, "name read");
		assert.ok(file.extension.length >0, "extension read");
		assert.ok(file.directoryName.length >0, "directoryName read");
	});
});

describe("stats fields reading", function(){
	before(function(done){
		file.writeAllText("tmp/fileInfo.txt","hello world.")
			.then(done);
	});

	after(function(done){
		file.delete("tmp/fileInfo.txt")
			.then(done);
	})

	it("can ready stat property", function(){
		var file = new FileInfo("tmp/fileInfo.txt");
		expect(file.createTime).to.be.an.instanceOf(Date);
		expect(file.lastAccessTime).to.be.an.instanceOf(Date);
		expect(file.lastModifyTime).to.be.an.instanceOf(Date);
		expect(file).to.have.length.above(0);
	});
});

describe("FileInfo.isExists", function(){
	var info;
	before(function(done){
		file.writeAllText("tmp/fileInfo.txt","hello world.")
			.then(function(){
				info = new FileInfo("tmp/fileInfo.txt");
				done();
			});
		});
	after(function(done){
		file.delete("tmp/fileInfo.txt")
			.then(done);
	})
	it("isExists", function(done){
		info.isExists()
			.should.eventually.be.fulfilled.and.be.true.and.notify(done);
	});

	it("copyTo", function(done){
		info.copyTo("tmp/fileInfo2.txt")
			.should.eventually.be.fulfilled.and.notify(function(){
				file.isExists("tmp/fileInfo2.txt")
					.then(function(exist){
						if(exist){
							done();
						}else{
							done(new Error("tmp/fileInfo2.txt not found."));
						}
					})
			});
	});

	it("moveTo", function(done){
		new FileInfo("tmp/fileInfo2.txt").moveTo('tmp/fileInfo3.txt')
			.should.eventually.be.fulfilled.and.notify(function(){
				file.isExists("tmp/fileInfo3.txt")
					.then(function(exist){
						if(exist){
							done();
						}else{
							done(new Error("tmp/fileInfo2.txt not found."));
						}
					})
			});
	});

	it("openRead", function(done){
		var result = "";
		info.openRead().on("data", function(str){
			result += str;
		})
		.on("end", function(){
			if(result === "hello world."){
				done();
			}else{
				done(new Error(result));
			}
		})
	});

	it("openText", function(done){
		info.openText()
			.should.eventually.be.fulfilled.and.not.be.empty.and.notify(done);
	});

	it("openWrite", function(){
		assert.instanceOf(info.openWrite(), require('stream').Writable,"Writable stream");
	});

	it("writeAllText", function(done){
		info.writeAllText("hihi")
			.should.eventually.be.fulfilled.and.notify(done);
	});

	it("appendText", function(done){
		info.appendText("hihi")
			.should.eventually.be.fulfilled.and.notify(done);
	})

	it("delete", function(done){

		new FileInfo("tmp/fileInfo3.txt")
			.delete()
			.should.eventually.be.fulfilled.and.notify(function(){
				file.isExists("tmp/fileInfo3.txt")
					.then(function(exist){
						if(!exist){
							done();
						}else{
							done(new Error("file still there"));
						}
					});
			})
	})

})