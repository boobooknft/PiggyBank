const Bank = artifacts.require('EmrinRemixTest4.sol');

contract("Bank", async (accounts) => {
    it("allows a user to create an account", async () => {
        const bank = await Bank.new();
        const accountCreator = accounts[0];
        const theTokenId = 0;

        const withdrawTime =  1661827937;
        const initial_ = 1;

        await bank.setInitialDeposit(initial_)
        const initialDeposit = web3.utils.toWei("0.01", 'ether');        

        await bank.formingDiamondHands(withdrawTime, { 
            from: accountCreator,
            value: initialDeposit
        });

        let balance = await bank.getAccountBalance(theTokenId);
        balance = parseInt(web3.utils.fromWei(balance, 'ether'));
        
        assert.equal(balance, 0.01); 
        console.log("Bank Balance: ",balance)
    })

    xit("allows a user to deposit to an account", async () => {
        const bank = await Bank.new();
        const accountCreator = accounts[0];
        //const theTokenId = 0;

        const withdrawTime =  1661664038;
        const initialDeposit = web3.utils.toWei("2", 'ether'); 
        const deposit = web3.utils.toWei("2", 'ether');       

        const result = await bank.formingDiamondHands(withdrawTime, { 
            from: accountCreator,
            value: initialDeposit
        });

        const theTokenId = result.logs[0].args.tokenId.toNumber();
        
        let balance = await bank.getAccountBalance(theTokenId);
        balance = parseInt(web3.utils.fromWei(balance, 'ether'));
        
        assert.equal(balance, 2); 
        console.log("Bank Balance: ",balance)

        await bank.deposit(theTokenId, {
            from: accounts[1],
            value: deposit
        });


        balance = await bank.getAccountBalance(theTokenId);
        balance = parseInt(web3.utils.fromWei(balance, 'ether'));
        console.log("Bank Balance: ",balance)

        assert.equal(balance, 4); 

    })

    xit("allows a user to withdraw", async () => {
        const bank = await Bank.new();
        const accountCreator = accounts[0];
        //const theTokenId = 0;

        const withdrawTime =  1661664038;
        const initialDeposit = web3.utils.toWei("2", 'ether'); 
        const deposit = web3.utils.toWei("2", 'ether');       

        const result = await bank.formingDiamondHands(withdrawTime, { 
            from: accountCreator,
            value: initialDeposit
        });

        const theTokenId = result.logs[0].args.tokenId.toNumber();
        
        let balance = await bank.getAccountBalance(theTokenId);
        balance = parseInt(web3.utils.fromWei(balance, 'ether'));
        
        assert.equal(balance, 2); 
        console.log("Bank Balance: ",balance)

        await bank.deposit(theTokenId, {
            from: accounts[1],
            value: deposit
        });


        balance = await bank.getAccountBalance(theTokenId);
        balance = parseInt(web3.utils.fromWei(balance, 'ether'));
        console.log("Bank Balance: ",balance)

        assert.equal(balance, 4); 

        await bank.withdraw(theTokenId, {
            from: accounts[0]
        });

        balance = await bank.getAccountBalance(theTokenId);
        balance = parseInt(web3.utils.fromWei(balance, 'ether'));
        console.log("New Balance: ", 0);

    })

    xit("allows the baseURI to be changed", async () => {
        const bank = await Bank.new();
        const accountCreator = accounts[0];
        //const theTokenId = 0;

        const withdrawTime =  1661664038;
        const initialDeposit = web3.utils.toWei("2", 'ether'); 
        //const deposit = web3.utils.toWei("2", 'ether');       

        const result = await bank.formingDiamondHands(withdrawTime, { 
            from: accountCreator,
            value: initialDeposit
        });

        const theTokenId = result.logs[0].args.tokenId.toNumber();
        const newBaseURI = "https://www.google.com/search?q=.toNumber&rlz=1C1CHBF_/";

        await bank.setBaseURI(newBaseURI);
        const URI = await bank.tokenURI(theTokenId);

        console.log("New Base URI: ",URI);
        
    })

    xit("allows a user to change initial deposit an account", async () => {
        const bank = await Bank.new();
        let [alice,bob] = accounts;
        
        await bank.setInitialDeposit(2);

        const withdrawTime =  1661669800;
        const initialDeposit = web3.utils.toWei("1", 'ether');   
        
        for (i = 0; i <=4; i++){
            await bank.formingDiamondHands(withdrawTime, {
                from: alice,
                value: initialDeposit
            });
        }

        
        //await bank.formingDiamondHands(withdrawTime, { 
        //    from: alice,
        //    value: initialDeposit
        //});

        await bank.formingDiamondHands(withdrawTime, { 
            from: bob,
            value: initialDeposit
        });

        let result = await bank.getAccountsByOwner(alice);
        console.log("Tokens Owned by Alice", result );

        result = await bank.getAccountsByOwner(bob);
        console.log("Tokens Owned by Bob",result);

        
    })   

    

})
