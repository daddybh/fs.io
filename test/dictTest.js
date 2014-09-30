var dict = require('../fs.io').directory,
	file = require('../fs.io').file,
	chai = require('chai'),
	assert = chai.assert;

describe('directory.createDirectory', function(){
	after(function(done){
		dict.delete("tmp/newdir")
			.then(done);
	});
	it('should create directory successfully', function(done){
		dict.createDirectory("tmp/newdir")
			.should.eventually.be.fulfilled.and.notify(done);
	});
});

describe("directory.delete",function(){
	before(function(done){
		dict.createDirectory("tmp/newdir")
			.then(function(){
				file.writeAllText("tmp/newdir/abc.txt","hello world")
					.then(done);
			});
	});

	it("should report error if recursive is false or not imply", function(done){
		dict.delete("tmp/newdir")
			.should.eventually.be.rejectedWith(Error).and.notify(done);
	});

	it("should delete successfully if recursive is true", function(done){
		dict.delete("tmp/newdir", true)
			.should.eventually.be.fulfilled.and.notify(function(){
				dict.isExists("tmp/newdir")
					.then(function(exist){
						if(exist){
							done(new Error("directory still there"));
						}else{
							done();
						}
					}, function(err){
						console.log(err);
					});
			})
	});
});

describe("directory.isExists", function(){
	before(function(done){
		dict.createDirectory("tmp/newdir")
			.then(function(){
				done();
			});
	});

	after(function(done){
		dict.delete("tmp/newdir")
			.then(done);
	});

	it("should be true when directory exists", function(done){
		dict.isExists('tmp/newdir')
			.should.eventually.be.fulfilled.and.be.true.and.notify(done);
	});
	it("should be false when directory not exists", function(done){
		dict.isExists('tmp/newdir2')
			.should.eventually.be.fulfilled.and.be.false.and.notify(done);
	});

});

describe("directory.move", function(){
	before(function(done){
		dict.createDirectory("tmp/movedir")
			.then(dict.createDirectory("tmp/movedir3"))
			.then(file.writeAllText("tmp/movedir3/aa.txt","hello world"))
			.then(function(){
				done();
			});
	});

	after(function(done){
		dict.delete("tmp/movedir2")
			.then(dict.delete("tmp/movedir4", true))
			.then(function(){
				done();
			});
	});

	it("empty dir should be move successfully", function(done){
		dict.move("tmp/movedir","tmp/movedir2")
			.should.eventually.be.fulfilled.and.notify(function(){
				dict.isExists("tmp/movedir2")
					.then(function(exist){
						if(exist){
							done();
						}else{
							done(new Error("movedir2 not found, move failed"));
						}
					})
			});
	});

	it("not empty dir should be move successfully", function(done){
		dict.move("tmp/movedir3", "tmp/movedir4")
			.should.eventually.be.fulfilled.and.notify(function(){
				dict.isExists("tmp/movedir4")
					.then(function(exist){
						if(exist){
							done();
						}else{
							done(new Error("movedir4 not found, move failed"));
						}
					});
			});
	});

});

describe("directory.isDirectory", function(){
	before(function(done){
		dict.createDirectory("tmp/isDirectory")
			.then(file.writeAllText("tmp/file.txt","hello world"))
			.then(function(){
				done();
			});
	});
	after(function(done){
		dict.delete("tmp/isDirectory")
			.then(file.delete("tmp/file.txt"))
			.then(function(){
				done();
			});
	});
	it("should return true if it is a directory", function(done){
		dict.isDirectory("tmp/isDirectory")
			.should.eventually.be.fulfilled.and.be.true.and.notify(done);
	});


	it("should return false if it is a file", function(done){
		dict.isDirectory("tmp/file.txt")
			.should.eventually.be.fulfilled.and.be.false.and.notify(done);
	});
});

describe("directory.getDirectories", function(){
	before(function(done){

		dict.createDirectory("tmp/leverdir/level/lever3")
			.then(function(){ return dict.createDirectory("tmp/leverdir/abcd");})
			.then(function(){
					done();
				}, function(err){
				console.log(err);
			});
	});

	after(function(done){
		dict.delete("tmp/leverdir", true)
			.then(done);
	});

	it("should return two folder", function(done){
		dict.getDirectories("tmp/leverdir")
			.should.eventually.be.fulfilled.and.be.length(2).and.notify(done);
	});

	it("should return one folder", function(done){
		dict.getDirectories("tmp/leverdir","abc*")
			.should.eventually.be.fulfilled.and.be.length(1).and.notify(done);
	})
});

describe("directory.getFiles", function(){
	before(function(done){
		require('fs').mkdir("tmp/getFiles/",function(){
			file.writeAllText("tmp/getFiles/abc.txt","aaa")
			.then(file.writeAllText("tmp/getFiles/abd.txt","aaa"),error)
			.then(file.writeAllText("tmp/getFiles/acc.txt","aaa"),error)
			.then(function(){
				done();
			},error);
		});
	});

	function error(err){
		console.log(err)
	}

	after(function(done){
		dict.delete("tmp/getFiles", true)
			.then(done);
	});
	it("should return three files", function(done){
		dict.getFiles("tmp/getFiles","**/*.txt")
			.should.eventually.be.fulfilled.and.be.length(3).and.notify(done);
	});
});

describe("directory.getCurrentDirecotry", function(){
	it("should not be empty", function(){
		assert.ok(dict.getCurrentDirecotry().length >0, "current dir length >0");
	})
});