"use strict";
var aliases = require("../lib/parse/aliases");

var expect = require("chai").expect;
var fs = require("fs");
var handlebars = require("handlebars");



describe("aliases.stringify()", function()
{
	describe("comments", function()
	{
		it("should be aliased", function(done)
		{
			var hbs = "{{! comment }} content {{!-- comment --}}";
			hbs = handlebars.parse(hbs);
			
			hbs = aliases.stringify(hbs);
			
			expect(hbs).to.equal("{{alias0}} content {{alias2}}");
			
			done();
		});
	});
	
	
	
	describe("non-blocks", function()
	{
		it("should be aliased", function(done)
		{
			var hbs = "{{path}} content {{path}}";
			hbs = handlebars.parse(hbs);
			
			hbs = aliases.stringify(hbs);
			
			expect(hbs).to.equal("{{alias0}} content {{alias2}}");
			
			done();
		});
		
		
		
		it("should support dot-separations", function(done)
		{
			var hbs = "{{path.path}} content {{path.path}}";
			hbs = handlebars.parse(hbs);
			
			hbs = aliases.stringify(hbs);
			
			expect(hbs).to.equal("{{alias0}} content {{alias2}}");
			
			done();
		});
		
		
		
		it("should support whitespace-control", function(done)
		{
			var hbs = "{{path~}} content {{~path}}";
			hbs = handlebars.parse(hbs);
			
			hbs = aliases.stringify(hbs);
			
			expect(hbs).to.equal("{{alias0}} content {{alias2}}");
			
			done();
		});
	});
	
	
	
	describe("blocks", function()
	{
		it("should be aliased", function(done)
		{
			var hbs = "{{#path}} content {{/path}}";
			hbs = handlebars.parse(hbs);
			
			hbs = aliases.stringify(hbs);
			
			expect(hbs).to.equal("{{alias0}}");
			
			done();
		});
		
		
		
		it("should alias inverse blocks", function(done)
		{
			var hbs = "{{^path}} content {{/path}}";
			hbs = handlebars.parse(hbs);
			
			hbs = aliases.stringify(hbs);
			
			expect(hbs).to.equal("{{alias0}}");
			
			done();
		});
	});
	
	
	
	describe("more complex templates", function()
	{
		// TODO :: just run this test?
		it("should support everything in one template", function(done)
		{
			var hbs = __dirname + "/templates/test.hbs";
			hbs = fs.readFileSync(hbs, {encoding:"utf8"});
			hbs = handlebars.parse(hbs);
			
			hbs = aliases.stringify(hbs);
			
			var expectedResult = '';
			expectedResult += '<{{alias1}} {{alias3}} attr="{{alias5}}" attr{{alias7}}="asdf" {{alias9}}>\n';
			expectedResult += '	{{alias11}} {{alias13}}\n';
			expectedResult += '	<!-- comment -->\n';
			expectedResult += '	value1\n';
			expectedResult += '</{{alias15}}>\n';
			
			expect(hbs).to.equal(expectedResult);
			
			done();
		});
	});
});