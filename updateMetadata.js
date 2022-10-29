
// this script runs in terminal in the location you want to store you metadata, it has no requirements other than the cid for the images
// must type 'node' first and then the script
var fs = require('fs')

for (let i = 0; i < 100; i++) {
    let json = {}
    json.name = "Piggybank #" + i;
    json.description = "A simple time-locked ETH piggy bank stored as a transferable NFT"
    json.image = "ipfs://bafybeif25nlujjxehmeppqpmkuka3nnbc7st4wyg34tihoaknbrjf6q6oe/" + i + ".png" //add in image ipfs cid here

    fs.writeFileSync('' + i, JSON.stringify(json))
}

// this script should be run in the folder where the image to be copied is, this only works for copying the same image multiple times
// essentially creating erc721 out of an edition
var fs = require('fs')

for (let i = 1; i < 100; i++) {
    fs.copyFile("0.png", i + ".png", (err) => {
        if (err){
            console.log("Error found: ", err);
        }
    })    
}