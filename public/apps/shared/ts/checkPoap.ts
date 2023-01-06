// Some awful hacks up front, as you'd expect from a rough and ugly draft.
declare let window: any;
declare let poapProxyABI: any;
declare let Velocity: any;

let web3 = new window.Web3(window.ethereum);
let POAPContract = new web3.eth.Contract(poapProxyABI, "0x22C1f6050E56d2876009903609a2cC3fEf83B415");

let productionEID = 95404;
let ensembleEID = 95424;
let devconnectEID = 95421;
let berlinEID = 95422;
let ethbcnEID = 95423;
let devconEID = 95424;


export async function checkPoap(eventIDs: Array<number>) {

    console.log("Ready to check for POAPs.")

    const account = web3.eth.accounts;
    let walletAddress = account.givenProvider.selectedAddress;

    console.log("About to wait to get count of POAPs.")
    let POAPCount = await POAPContract.methods.balanceOf(walletAddress).call();
    console.log("Total POAPS:", {POAPCount});

    let POAPCountByEvent = {};
    eventIDs.forEach(function (eventID) {
        POAPCountByEvent[eventID] = 0;
    })
    for (let poapIndex = 0; poapIndex < POAPCount; poapIndex++) {
        console.log(`Checking POAP at index ${poapIndex}`);
        let POAPToken = await POAPContract.methods.tokenDetailsOfOwnerByIndex(walletAddress, poapIndex).call();
        console.log(`Wallet has POAP for event ID: ${POAPToken.eventId}`);

        eventIDs.forEach(function (eventID) {
            if (POAPToken.eventId == eventID) {
                POAPCountByEvent[eventID]++;
            }
        })
    }
    return POAPCountByEvent;
}

export function evaluatePOAPInventory(POAPInventory: {}) {

    if (POAPInventory[productionEID] > 0) {
        let productionArt: any = document.getElementById("productionArt");
        let productionFrame: any = document.getElementById("productionArtFrame");
        let devcon: any = document.getElementById("devconPOAP");
        productionArt.scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"});

        productionFrame.velocity({width: 409, height: 438}, {speed:.2}).then(function (e) {productionArt.velocity("fadeIn")});
    }

        console.log(POAPInventory);
}

export function startWaitAnimation() {
    let barcelona: any = document.getElementById("ethbcnPOAP");
    let devcon: any = document.getElementById("devconPOAP");
    let berlin: any = document.getElementById("berlinPOAP");
    let amsterdam: any = document.getElementById("amsterdamPOAP");

    devcon.velocity({'left': '275px'});
    berlin.velocity({'top': '304px'});
    amsterdam.velocity({'left': '285px', 'top': '242px'});

    devcon.classList.add("shadowed");
    berlin.classList.add("shadowed");
    amsterdam.classList.add("shadowed");
    barcelona.classList.add("shadowed");

    let pieces: any = document.getElementsByClassName("puzzlePiece");

    let animatedBear: any = document.getElementById("POAPloadanimation");
    animatedBear.velocity('fadeIn').velocity(
        {
            transform: ["rotate3d(1, 1, 1, 360DEG)", "rotate3d(1, 1, 1, 0DEG)",]
        },
        {speed: .1, loop: true},
    );

}

export async function connect() {

    // WALLET CHECK ->
    if (!window.hasOwnProperty("ethereum")) {
        console.log("No wallet");
        alert("Hey friends.  You need a wallet installed in order to check your POAPs.");
        throw TypeError("No wallet.");
    }
    // <- WALLET CHECK


    console.log("Getting wallet info.  Hey RJ.")

    await window.ethereum.request({method: "eth_requestAccounts"});


    console.log("Changing Network");

    let networkChange: Promise<object> = window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{chainId: "0x64"}],
    });


    let networkChangeResult: Promise<void> = networkChange.then(
        function (result) {
            console.log("Network change went OK.");
        },
        function (exception) {
            if (exception.code == 4902) {

                let networkAddition: Promise<object> = window.ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [
                        {
                            rpcUrls: ["https://rpc.gnosischain.com/"],
                            chainName: "Gnosis",
                            chainId: "0x64",
                            nativeCurrency: {
                                name: "xDAI",
                                symbol: "xDAI",
                                decimals: 18
                            },
                            blockExplorerUrls: ["https://gnosisscan.io"],

                        },
                    ],
                });
                networkAddition.then(
                    function (result) {
                        console.log("Network addition seems to have gone ok.");
                    },
                    function (exception) {
                        if (exception.code == 4001) {
                            alert("Gotta check on Gnosis to see which POAPs you have.  For that, we need to add the network.")
                        } else {
                            alert(exception.message);
                        }
                    }
                )

            } else {
                console.log(`Error while changing network: ${exception.message}`);
                if (exception.code == 4001) {
                    alert("Gotta check on Gnosis to see which POAPs you have.");
                } else {
                    alert(exception.message);
                }
                throw exception;
            }
        }
    )
    await networkChangeResult;

    // Network Change is good, let's check the POAPs now.
    const account = web3.eth.accounts;
    let walletAddress = account.givenProvider.selectedAddress;
    console.log(`Wallet: ${walletAddress}`);

    let relevantEvents: Array<number> = [
        productionEID,
        ensembleEID,
        devconnectEID,
        berlinEID,
        ethbcnEID,
        devconEID,
    ]

    let POAPCheckRun: Promise<{}> = checkPoap(relevantEvents);
    console.log("About to wait a while:")


    POAPCheckRun.then(
        function (POAPInventory) {
            console.log("Done waiting.");
            evaluatePOAPInventory(POAPInventory);
        },
        function (exception) {
            console.log("Not sure what to do here.");
        }
    )
}