var chai = require('chai'),
	assert = chai.assert,
	should = chai.should,
	expect = chai.expect,
	file = require('../fs.io').file,
	fs = require('fs'),
	dir = require('../fs.io').directory;

var chaiAsPromised = require("chai-as-promised");
chai.should();
chai.use(chaiAsPromised);

describe("file.copy", function(){
	before(function(){
		file.writeAllText('tmp/abc.txt',"hello world!");
	});

	after(function(){
		file.delete("tmp/abc.txt")
			.then(file.delete("tmp/abc2.txt"));
	})
	it("should copy successfully without error",function(done){
		file.copy("tmp/abc.txt","tmp/abc2.txt")
			.should.eventually.be.fulfilled.and.notify(done);
	});
});


describe("file.delete", function(){
	before(function(){
		file.writeAllText("tmp/delete.txt", "to be deleted");
	});
	it("should be deleted without error", function(done){
		file.delete("tmp/delete.txt")
			.should.eventually.be.fulfilled.and.notify(done);
	});
	it("should be silent when file not exists", function(done){
		file.delete("tmp/delete.txt")
			.should.eventually.be.fulfilled.and.notify(done);
	});
});

describe("file.isExists", function(){
	before(function(){
		file.writeAllText("tmp/exists.txt","dd");
	});
	after(function(){
		file.delete("tmp/exists.txt");
	})
	it("should be done without error when file not exists", function(done){
		file.isExists("tmp/no-exists.txt")
			.should.eventually.be.fulfilled.and.be.false.and.notify(done);
	});
	it("should return true", function(done){
		file.isExists("tmp/exists.txt")
			.should.eventually.be.true.and.notify(done);
	});
});

describe("file.move", function(){
	before(function(){
		file.writeAllText("tmp/file.txt","aaa");
	});
	after(function(){
		file.delete("tmp/file2.txt");
	})
	it("should be done successfully and file2.txt should exists", function(done){
		file.move("tmp/file.txt", "tmp/file2.txt")
			.should.eventually.be.fulfilled.and.notify(function(){
				file.isExists("tmp/file2.txt").should.eventually.be.true.and.notify(done);
			});

	});
});

describe("file.getLastAccessTime, getLastModifyTime, getCreateTime", function(){
	before(function(done){
		file.writeAllText("tmp/date.txt",new Date()).then(done);
	});
	after(function(){
		file.delete("tmp/date.txt");
	});
	it("getLastAccessTime successfully", function(done){
		file.getLastAccessTime("tmp/date.txt")
			.should.eventually.be.fulfilled.and.an.instanceOf(Date).and.notify(done);
	});
	it("getLastModifyTime successfully", function(done){
		file.getLastModifyTime("tmp/date.txt")
			.should.eventually.be.fulfilled.and.an.instanceOf(Date).and.notify(done);
	});
	it("getCreateTime successfully", function(done){
		file.getCreateTime("tmp/date.txt")
			.should.eventually.be.fulfilled.and.an.instanceOf(Date).and.notify(done);
	});	
});

describe("file.read", function(){
	before(function(done){
		file.writeAllText("tmp/read.txt","hihi").then(done);
	});
	after(function(done){
		file.delete("tmp/read.txt").then(done);
	})
	it("should return valid stream", function(done){
		var tmpResutl = "";
		file.read("tmp/read.txt").on("data", function(str){
			tmpResutl += str;
		})
		.on("end", function(){
			if(tmpResutl === "hihi"){
				done();
			}else{
				done(new Error(tmpResutl));
			}
		})
		;
	});
});

describe("file.readAllText", function(){
	before(function(done){
		file.writeAllText("tmp/readAllText.txt","hihi").then(done);
	});
	after(function(done){
		file.delete("tmp/readAllText.txt").then(done);
	})
	it("should not be empty and promised fulfilled", function(done){
		file.readAllText("tmp/readAllText.txt")
			.should.eventually.be.fulfilled.and.not.be.empty.and.notify(done);
	});

	it("should return error when file not exists", function(done){
		file.readAllText("tmp/read2.txt")
			.should.eventually.be.rejectedWith(Error).and.notify(done);
	});
});

describe("file.write", function(){

	after(function(done){
		file.delete("tmp/ooxx.txt").then(file.delete('tmp/haha.txt')).then(done);
	})
	it("should create write stream", function(){
		assert.instanceOf(file.write("tmp/ooxx.txt"),require('stream').Writable, "created stream.Wriable object");
	});
});

describe("file.writeAllText", function(){
	after(function(done){
		dir.delete("tmp/write/", true)
			.then(file.delete("tmp/write.txt"))
			.then(done);
	});
	before(function(done){
		dir.createDirectory("tmp/write").then(function(){
			done();
		});
	});
	it("should write all text to file", function(done){
		file.writeAllText("tmp/write.txt","hello world")
			.should.eventually.be.fulfilled.and.notify(function(){
				file.readAllText("tmp/write.txt")
					.should.eventually.be.fulfilled.and.not.be.empty.and.notify(done);
			});
	});
	it("can write file in same path mutiple times", function(done){
		file.writeAllText("tmp/write/aaa.txt","hello")
			.then(file.writeAllText("tmp/write/bbb.txt","hello"))
			.then(file.writeAllText("tmp/write/ccc.txt","hello"))
			.then(file.writeAllText("tmp/write/ddd.txt","hello"))
			.then(file.writeAllText("tmp/write/eee.txt","hello"))
			.then(file.writeAllText("tmp/write/fff.txt","hello"))
			.then(file.writeAllText("tmp/write/ggg.txt","hello"))
			.then(file.writeAllText("tmp/write/hhh.txt","hello"))
			.then(file.writeAllText("tmp/write/iii.txt","hello"))
			.should.eventually.be.fulfilled.and.notify(done);
	})
});

describe("file.appendText", function(){
	it("should be ok if file not exists", function(done){
		file.appendText("tmp/haha.txt","ddd")
			.should.eventually.be.fulfilled.and.notify(done);
	});
	it("should append file success", function(done){
		file.appendText("tmp/haha.txt", "ddd")
			.should.eventually.be.fulfilled.and.notify(function(){
				file.readAllText("tmp/haha.txt")
					.should.eventually.be.fulfilled.and.be.equal("dddddd").and.notify(done);
			})
	})
});
