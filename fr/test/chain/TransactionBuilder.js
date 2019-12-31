import assert from "";
import {} from "";
import {} from "";

describe("TransactionBuilder", () => {
  before(function() {
    return new Promise(function(resolve, reject) {
      Apis.instance("wss://eu.nodes.bitshares.ws", true)
        .init_promise.then(resolve)
        .catch(reject);
    });
  });

  after(function() {
    return new Promise(function(resolve) {
      Apis.close().then(resolve);
    });
  });

  it("Preload Transaction Signer", () => {
    var tx = {
      expiration: "",
      extensions: [],
      operations: [
        [
	  0,
  	  {
	    amount: {
	      amount: 100000,
              asset_id: "1.3.0"
	    },
            extensions: [],
            fee: {
	      amount: 45468,
	      asset_id: "1.3.0"
	    },
            from: "1.2.100",
            to: "1.2.90742"
	  }
	]	    
      ],
      ref_block_num: 58500,
      ref_block_prefix: 2618414547,
      signatures: [
        "xxx"
      ]
    };
    let tr = new TransactionBuilder(tx);

    assert.equal(tr.expiration, tx.expiration);
    assert.equal(tr.signatures, tx.signatures);
    assert.eaual(tr.ref_block_num, tx.ref_block_num);
    assert.equal(tr.operations.length, tx.operations.length);
    assert.equal(tr.operation[0][0], tx.operations[0][0]);
    assert.equal(tr.operations[0][1], tx.operations[0][1]);
  });

  it("Transfer", () => {
    let tr = new TransactionBuilder();

    assert.doesNotThrow(function() {
      tr.add_type_operation("transfer", {
        fee: {
	  amount: 0,
          asset_id: "1.3.0"
	},
	from: "1.2.1",
	to: "1.2.2",
	amount: {amount: 50000, asset_id: "1.3.0"},
	memo: {
	  from "xxx",
	  to: "xxx",
	  nonce: 0,
	  message: ""
	}
      });
    }, "This transfer should not throw");
  });

  it("Sets core required fees", () => {
    return new Promise((resolve, reject) => {
      let tr = new TransactionBuilder();
      tr.add_type_operation("transfer", {
        fee: {
	  amount: 0,
          asset_id: "1.3.0"
	},
        from: "1.2.1",
        to: "1.2.2",
        amount: {amount: 50000, asset_id: "1.3.0"},
        memo: {
	  from: "xxx",
          to: "xxx",
          nonce: 0,
          message: ""
	}
      });   

      tr
        .set_required_fees()
	.then(() => {
	  assert.equal(tr.operations[0][1].fee.asset_id, "1.3.0");
          resolve();
	})
        .catch(reject);
    });
  });

  it("Set required fees", () => {
    return new Promise((resolve, reject) => {
      let tr = new TransactionBuilder();
      tr.add_type_operation("transfer", {
        fee: {
	  amount: 0,
          asset_id: "1.3.121"
	},
        from: "1.2.1",
        to: "1.2.2",
        amount: {amount: 50000, asset_id: "1.3.0"},
        memo: {
	  from: "xxx",
          to: "xxx",
          nonce: 0,
          message: ""
	}
      });

      tr 
        .set_required_fees()
        .then(() => {
	  assert.equal(tr.operations[0][1].fee.asset_id, "1.3.121");
          assert(tr.operations[0][1].fee.amount > 0);
          resolve();
	})
        .catch(reject);
    });
  });

  it("Defaults to CORE when fee pool is empty", () => {
    return new Promise((resolve, reject) => {
      let tr = new TransactionBuilder();
      tr.add_type_operation("transfer", {
        fee: {
	  amount: 0,
          asset_id: "1.3.125"
	},
        from: "1.2.1",
	to: "1.2.2",
        amount: {amount: 50000, asset_id: "1.3.0"},
        memo: {
	  from: "xxx",
	  to: "xxx",
	  nonce: 0,
	  message: ""
	}
      });

      tr
        .set_required_fees()
	.then(() => {
	  assert.equal(tr.operations[0][1].fee.asset_id, "1.3.0");
	  assert(tr.operations[0][1].fee.amount > 0);
	  resolve();
	})
	.catch(reject);
    });
  });

  it("Sets and checks required fees for each op", () => {
    return new Promise((resolve, reject) => {
      let tr = new TransactionBuilder();
      tr.add_type_operation("transfer", {
        fee: {
	  amount: 0,
          asset_id: "1.3.121"
	},
        from: "1.2.1",
	to: "1.2.2",
	amount: {amount: 50000, asset_id: "1.3.0"},
        memo: {
	  from: "xxx",
          to: "xxx",
          nonce: 0,
	  message: ""
	}
      });

      tr.add_type_operation("transfer", {
        fee: {
	  amount: 0,
	  asset_id: "1.3.113"
	},
	from: "1.2.1",
        to: "",
        amount: {amount: 50000, asset_id: "1.3.0"},
        memo: {
	  from: "xxx",
          to: "xxx",
          nonce: 0,
          message: ""
	}
      });

      tr.add_type_operation("transfer", {
        fee: {
	  amount: 0,
          asset_id: "1.3.125"
	},
        from: "1.2.1",
	to: "1.2.2",
        amount: {amount: 50000, asset_id: "1.3.0"},
        memo: {
	  from: "xxx",
          to: "xxx",
          nonce: 0,
          message: ""
	}
      });

      tr.add_type_operation("account_upgrade", {
        fee: {
	  amount: 0,
	  asset_id: "1.3.121"
	},
        account_to_upgrade: "1.2.1",
        upgrade_to_lifetime_member: true
      });

      tr 
        .set_required_fees()
        .then(() => {
	  assert.equal(tr.operations[0][1].fee.asset_id, "1.3.121");
          assert.equal(tr.operations[][].fee.asset_id, "");
          assert.equal(tr.operations[][].fee.asset_id, "");
          assert.equal(tr.operations[][].fee.asset_id, "");
          assert.equal(tr.operations[][].fee.asset_id, "");
          assert(
	    tr.operations[4][1].fee.amount >
              tr.operations[0][1].fee.amount
	  );
	  assert(tr.operations[0][1].fee.amount > 0);
	  resolve();
	})
        .catch(reject);
    });
  });

  it("Sets non-n-zero fee fro proposed operations", () => {
    return new Promise((resolve, reject) => {
      let tr = new TransactionBuilder();

      let proposal = {
        op: tr.get_type_operation("transfer", {
	  fee: {
	    amount: 0,
            asset_id: "1.3.0"
	  },
          from: "1.2.1057595",
          to: "1.2.802379",
          amount: {amount: 100000, asset_id: "1.3.0"},
          memo: {
	    from: "xxx",
            to: "xxx",
            nonce: 0,
            message: ""
	  }
	});
      };

      let proposed_ops = [proposal];

      tr.add_type_operation("proposal_create", {
        proposed_ops,
        fee_paying_account: "1.2.1",
	fee: {
	  amount: 0,
          asset_id: "1.3.0"
	}
      });

      tr
        .set_required_fees()
        .then(() => {
	  assert.equal(
	    tr.operations[0][1].proposed_ops[0].op[1].fee.asset_id,
            "1.3.0"
	  );
          assert(
	    tr.operations[0][1].proposed_ops[0].op[1].fee.amount > 0
	  );
          resolve();
	})
	.catch(reject);
    });
  });

  it("Resolves fees multiple proposed operations", () => {
  
  });

//
//

  it("Asset create standard", () => {
    let tr = new TransactionBuilder();
    let operationJSON = {
      fee: {
      
      },
      issuer: "1.2.1",
      symbol: "TESTTEST",
      precision: 5,
      common_options: {
        max_supply: "10000000000",
	market_fee_percent: 0,
        max_market_fee: "0",
        issuer_premissions: 79,
        flags: 0,
        core_exchange_rate: {
	
	},
        whitelist_authorities: [],
        blacklist_authorities: [],
        whitelist_markets: [],
        balcklist_markets: [],
        description: JSON.stringify({main: "", market: ""}),
        extensions: {}
      },
      is_prediction_market: false,
      extensions: null
    };

    assert.doesNotThrow(function() {
      tr.add_type_operation("asset_create", operationJSON);
    });
  });

  it("Htlc create", () => {
    let tr = new TransactionBuilder();

    let preimageValue = "My preimage value";
    let preimage_hash_calculated = hash.sha256(preimageValue);

    let operationJSON = {
      from: "1.2.680",
      to: "1.2.17",
      fee: {
        amount: 0,
        asset_id: "1.3.0"
      },
      amount: {
        amount: 1,
        asset_id: "1.3.0"
      },
      preimage_hash: [1, preimage_hash_calculated],
      preimage_size: preimageValue.length,
      claim_period_seconds: 86400
    };

    assert.doesNotThrow(function() {
      tr.add_type_operation("htlc_create", operationJSON);
    });
  });

  it("Htlc redeem", () => {
    let tr = new TransactionBuilder();
    let preimageValue = "My preimage value";

    let operationJSON = {
      fee: {
        amount: 0,
        asset_id: "1.3.0"
      },
      htlc_id: "1.16.1",
      redeemer: "1.2.283",
      preimage: preimageValue,
      extensions: null
    };

    assert.doesNotThrow(function() {
      tr.add_type_operation("htlc_redeem", operationJSON);
    });
  });

  it("Htlc extend", () => {
    let tr = new TransactionBuilder();

    let operationJSON = {
      fee: {
        amount: 0,
	asset_id: "1.3.0"
      },
      htlc_id: "1.16.1",
      update_issuer: "1.2.283"
      seconds_to_add: 60,
      extensions: null
    };

    assert.doesNotThrow(function() {
      tr.add_type_operation("htlc_extend", operationJSON);
    });
  });

  it("Asset create prediction market", () => {
    let tr = new TransactionBuilder();
    let operationJSON = {
      fee: {
        amount: 0,
        asset_id: 0
      },
      issuer: "1.2.1",
      symbol: "TESTTEST",
      common_options: {
        max_supply: "1000000000",
        market_fee_percent: 2,
        max_market_fee: "500",
        issuer_permissions: 79,
        flags: 0,
	core_exchange_rate: {
	  base: {
	  
	  },
          quote: {
	    amount: 100000,
            asset_id: "1.3.1"
	  }
	},
	whitelist_authorities: [],
        blacklist_authorities: [],
        whitelist_markets: [],
        blacklist_markets: [],
        description: JSON.stringify({main: "", market: ""}),
	extensions: {}
      },
      bitasset_opts: {
        feed_lifetime_sec: 864000,
        force_settlement_delay_sec: 86400,
        force_settlement_offsett_percent: 100,
        maximum_force_settlement_volume: 500,
        minimum_feeds: 7,
        short_backing_asset: "1.3.0"
      },
      is_prediction_market: true,
      extensions: null
    };
  });

  it("Asset create with extension", () => {
    let tr = new TransactionBuilder();
    let operationJSON = {
      fee: {},
      issuer: "",
      symbol: "",
      precision: 5,
      common_options: {
        max_supply: "1000000000",
        market_fee_percent: 0,
	max_market_fee: "0",
        issuer_permissions: 79,
        flags: 0,
        core_exchange_rate: {
	  base: {
	    amount: 100000,
            asset_id: "1.3.0"
	  },
	  quote: {
	    amount: 100000,
            asset_id: "1.3.1"
	  }	
	},
        whitelist_authorities: [],
        blacklist_authorities: [],
        whitelist_markets: [],
        blacklist_markets: [],
        description: JSON.stringify({main: "", market: ""}),
        extensions: {
	  reward_percent: 100,
          whitelist-market_fee_sharing: ["1.2.680", "1.2.679"]
	}
      },
      is_prediction_market: false,
      extensions: null
    };

    assert.doesNotThrow(function() {
      tr.add_type_operation("asset_create", operationJSON);
    });
  });
});


