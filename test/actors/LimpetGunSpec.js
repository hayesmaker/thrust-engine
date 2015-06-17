var expect = require('chai').expect,
	sinon = require('sinon'),
	LimpetGun = require('../../src/actors/LimpetGun');

describe("LimpetGun tests", function() {

	var myLimpetGun, initSpy;

	before(function() {

	});

	beforeEach(function() {

		initSpy = sinon.spy(LimpetGun.prototype, 'init');
		myClass = new LimpetGun();
	});

	afterEach(function() {
		LimpetGun.prototype.init.restore();
	});

	after(function() {

	});

	describe("constructor: (*EXAMPLE* please replace with your own tests)", function() {

		it("myPublicVar is set correctly", function() {
			expect(myClass.myPublicVar).to.equal(1);
		});

		it("init is called", function() {
			expect(initSpy.called).to.equal(true);
		});

	});
});