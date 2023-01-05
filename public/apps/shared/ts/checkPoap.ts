declare let window: any;  // rough and ugly as first drafts are, TODO
declare let poapProxyABI: any;  // rough and ugly as first drafts are, TODO


// import * as poapProxyABI from '../abi/poapABI.js';
// import * as Web3 from './web3.min.js';





let web3 = new window.Web3(window.ethereum);
let POAPContract = new web3.eth.Contract(poapProxyABI, "0x22C1f6050E56d2876009903609a2cC3fEf83B415");

export async function checkPoap(eventID) {

    const account = web3.eth.accounts;
    let walletAddress = account.givenProvider.selectedAddress;
    console.log(`Wallet: ${walletAddress}`);

    let POAPCount = await POAPContract.methods.balanceOf(walletAddress).call();
    console.log("Total POAPS:", {POAPCount});

    for (let poapIndex = 0; poapIndex < POAPCount; poapIndex++) {
        let POAPToken = await POAPContract.methods.tokenDetailsOfOwnerByIndex(walletAddress, poapIndex).call();
        console.log("event ID:");
        console.log(POAPToken.eventId);

        if (POAPToken.eventId == "95303") {
            console.log("In Bogota!")
            // bogota = true
            // album_acess = true
            //
            //
            // bogotaArt.classList.add('saturated')
            // bogotaArt.classList.remove('unsaturated');
            // bogotaArt.classList.remove('pulsing-red');
        }
    }

}

export async function connect() {
    if (window.ethereum) {
        console.log("Getting wallet info.  Hey RJ.")

        await window.ethereum.request({method: "eth_requestAccounts"});


        console.log("Changing Network");
        let networkChange = window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [{
                chainId: "0x64",
                rpcUrls: ["https://rpc.gnosischain.com/"],
                chainName: "Gnosis",
                nativeCurrency: {
                    name: "xDAI",
                    symbol: "xDAI",
                    decimals: 18
                },
                blockExplorerUrls: ["https://gnosisscan.io"]
            }]
        });
        await networkChange;
        console.log("Network change result:")
        console.log(networkChange);


        //////////////////

        let bogota = false

        let album_acess = false

        let bogotaArt = document.getElementById("devconPOAP");
        bogotaArt.classList.add('pulsing-red');


    } else {
        console.log("No wallet");
    }
}