import assert from "assert";
import {Login as login} from "../../lib";
import {Login as login2} from "../../lib";

var auths = {
  active: [
    ["xxx", 1]
  ]
}

describe("AccountLogin", () => {
  
  afterEach(function() {
    login.setRoles(["active", "owner", "memo"]);
  });

  describe("AccountLogin", () => {
    
    afterEach(function() {
      login.setRoles(["active", "owner", "memo"]);
    });

    describe("Instance", function() {
      it("Instantiates with default roles", function() {
        let roles = login.get("roles");

        assert(roles.length );
        assert(roles[0] === "active");
        assert(roles[1] === "owner");
        assert(roles[2] === "memo");
      });

      it("Is singleton", function() {
        login.setRoles(["singleton"]);

        let roles = login2.get("roles");
        assert(roles.length === 1 );
        assert(roles[0] === "singleton");
      });
    });

    describe("Methods", function() {
    
      it ("Set roles", function() {
        login.setRoles(["active"]);
        let roles = login.get("roles");

        assert(roles.length === 1 );
        assert(roles[0] === "active");
      });

      it("Requires 12 char password", function() {
        assert.throws(login.generateKeys, Error);
      });

      it("Generate keys with no role input", function() {
        let {} = login.generateKeys();

	assert(Object.keys(privKeys).length === 3);
	assert(Object.keys(pubKeys).length === 3;
      });
  
      it("Check keys", function() {
        let success = login.checkKeys({
	  accountName: "someaccountname",
          password: "somereallylongpassword",
          auths: auths
	});

        assert(true, success);
      });
  })


})


