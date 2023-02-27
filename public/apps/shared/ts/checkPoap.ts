// Some awful hacks up front, as you'd expect from a rough and ugly draft.
declare let window: any;
declare let poapProxyABI: any;
declare let anime: any;

let web3 = new window.Web3(window.ethereum);
let POAPContract = new web3.eth.Contract(poapProxyABI, "0x22C1f6050E56d2876009903609a2cC3fEf83B415");

let productionEID = 95404;
let ensembleEID = 95425;
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

export async function evaluatePOAPInventory(POAPInventory: {}) {
    console.log(POAPInventory);

    // Animation: Fade out spinner, and checking dialog bring in list
    // First: the spinner
    let spinnerFadeOut: any = anime.timeline({
        targets: "#POAPloadanimation",
    }).add({
        opacity: 0, duration: 1000, easing: 'linear'
    });
    // Now, get rid of the "checking" dialogu
    anime.timeline({targets: "#poap-checking-now"}).add({opacity: 0, height: 0});


    // ...and roll in the found list.

    document.getElementById('found-poaps').style.display = "block";
    anime({targets: '#found-poaps', opacity: 1});
    // End animation stuff.

    let devconAnimation: any;
    let ethbcnAnimation: any;
    let berlinAnimation: any;
    let devconnectAnimation: any;

    let barcelona: any = document.getElementById("ethbcnPOAP");
    let devcon: any = document.getElementById("devconPOAP");
    let berlin: any = document.getElementById("berlinPOAP");
    let amsterdam: any = document.getElementById("amsterdamPOAP");
    let listOfFoundPOAPS: any = document.getElementById("list-of-found-poaps")

    if (POAPInventory[devconEID] > 0) {

        let liDevcon = document.createElement('li')
        let foundDevcon = document.createTextNode("devconVI.");
        liDevcon.appendChild(foundDevcon);
        listOfFoundPOAPS.appendChild(liDevcon);

        devconAnimation = anime.timeline({
            targets: '#devconPOAP',
        }).add({
            width: '+=60px;', duration: 1000,
        }).add({
            filter: 'saturate(1)', duration: 1000, easing: "linear",
        }).add({
            width: '-=60px;', duration: 500, easing: "linear",
        })
    } else {
        console.log("Does not have devcon POAP.")
        devconAnimation = anime.timeline();
    }

    await devconAnimation.finished;
    console.log("Devcon finished")

    if (POAPInventory[ethbcnEID] > 0) {

        let liBcn = document.createElement('li')
        let foundBcn = document.createTextNode("EthBarcelona.");
        liBcn.appendChild(foundBcn);
        listOfFoundPOAPS.appendChild(liBcn);

        console.log("Has ethbcn POAP.");
        ethbcnAnimation = anime.timeline({
            targets: '#ethbcnPOAP',
        }).add({
            width: '+=60px;', duration: 1000,
        }).add({
            filter: 'saturate(1)', duration: 1000, easing: "linear",
        }).add({
            width: '-=60px;', duration: 500, easing: "linear",
        })
    } else {
        ethbcnAnimation = anime.timeline();
    }

    await ethbcnAnimation.finished;

    console.log("BCN finished.")
    if (POAPInventory[berlinEID] > 0) {

        let liBerlin = document.createElement('li')
        let foundBerlin = document.createTextNode("Berlin Blockchain Week.");
        liBerlin.appendChild(foundBerlin);
        listOfFoundPOAPS.appendChild(liBerlin);

        berlinAnimation = anime.timeline({
            targets: '#berlinPOAP',
        }).add({
            width: '+=60px;', duration: 1000,
        }).add({
            filter: 'saturate(1)', duration: 1000, easing: "linear",
        }).add({
            width: '-=60px;', duration: 500, easing: "linear",
        })
    } else {
        console.log("No berlin POAP.");
        berlinAnimation = anime.timeline();
    }

    await berlinAnimation.finished;

    if (POAPInventory[devconnectEID] > 0) {

        let liDevconnect = document.createElement('li')
        let foundDevconnect = document.createTextNode("devconnect.");
        liDevconnect.appendChild(foundDevconnect);
        listOfFoundPOAPS.appendChild(liDevconnect);

        devconnectAnimation = anime.timeline({
            targets: '#amsterdamPOAP',
        }).add({
            width: '+=60px;', duration: 1000,
        }).add({
            filter: 'saturate(1)', duration: 1000, easing: 'linear',
        }).add({
            width: '-=60px;', duration: 500, easing: "linear",
        })
    } else {
        devconnectAnimation = anime.timeline();
    }

    let concertPOAPCount: number = POAPInventory[devconnectEID] + POAPInventory[devconEID] + POAPInventory[berlinEID] + POAPInventory[ethbcnEID];

    if (concertPOAPCount == 0) {
        let noPoaps = document.createElement('li');
        let noPoapstext = document.createTextNode("No concert POAPs found.");
        noPoaps.appendChild(noPoapstext);
        listOfFoundPOAPS.appendChild(noPoaps);
    }

    await devconnectAnimation.finished;
    // FINISHED PUZZLE HIGHLIGHTING

    devcon.classList.remove("shadowed");
    berlin.classList.remove("shadowed");
    amsterdam.classList.remove("shadowed");
    barcelona.classList.remove("shadowed");

    anime({targets: devcon, left: "-=90", duration: 2000, easing: "linear"});
    anime({targets: berlin, top: "-=85", duration: 2000, easing: "linear"});
    let puzzleJoin: any = anime.timeline({targets: amsterdam, duration: 2000, easing: "linear", endDelay: 600,}).add({
        left: '-=90',
        top: '-=85px'
    });

    await puzzleJoin.finished

    let productionFrameExpand: any;

    if (POAPInventory[productionEID] > 0) {
        let productionArtFrame: any = document.getElementById("productionArtFrame");

        document.getElementById("productionArea").style.display = "block";
        productionArtFrame.scrollIntoView({behavior: 'smooth'});

        productionFrameExpand = anime.timeline({
            targets: "#productionArtFrame",
            easing: "easeInExpo"
        }).add({opacity: 1}).add({width: 409, height: 438, duration: 2000})

        productionFrameExpand.finished.then(function () {
            anime({targets: "#productionArt", opacity: 1, duration: 1500, easing: "linear"})
            anime.timeline({targets: "#productionText"}).add({opacity: 1, duration: 1500, easing: "linear"});

        })
    } else {
        productionFrameExpand = anime.timeline();
    }

    await productionFrameExpand.finished;

    let ensembleFrameExpand: any;
    let ensembleTextExpand: any;

    if (POAPInventory[ensembleEID] > 0) {
        let ensembleArtFrame: any = document.getElementById("ensembleArtFrame");
        document.getElementById("ensembleArea").style.display = "block";
        ensembleArtFrame.scrollIntoView({behavior: 'smooth'});
        ensembleFrameExpand = anime.timeline({
            targets: "#ensembleArtFrame",
            easing: "easeInExpo"
        }).add({opacity: 1}).add({width: 409, height: 438, duration: 2000})


        ensembleFrameExpand.finished.then(function () {
            anime({targets: "#ensembleArt", opacity: 1, duration: 1500, easing: "linear"});
            anime.timeline({ targets: "#ensembleText",}).add({opacity: 1, duration: 1500, easing: "linear"});

        })
    } else {
        ensembleFrameExpand = anime.timeline();
    }
    await ensembleFrameExpand.finished;


    // Now to reveal the album if they have a POAP.
    let totalRelevantPOAPCount: number = concertPOAPCount + POAPInventory[productionEID] + POAPInventory[ensembleEID]

    if (totalRelevantPOAPCount > 0) {
        console.log("Revealing album.");
        let actualAlbum: any = document.getElementById('ursa-minor-actual-album');
        actualAlbum.style.display = "block";
        actualAlbum.scrollIntoView({behavior: 'smooth'});
        anime({targets: actualAlbum, opacity: 1, height: 1520, duration: 5000});
    }


}

export async function startWaitAnimation() {
    let barcelona: any = document.getElementById("ethbcnPOAP");
    let devcon: any = document.getElementById("devconPOAP");
    let berlin: any = document.getElementById("berlinPOAP");
    let amsterdam: any = document.getElementById("amsterdamPOAP");

    anime({targets: "#poap-check-dialog", height: 0, opacity: 0});

    document.getElementById("poap-checking-now").style.display = "block";
    anime({targets: "#poap-checking-now", opacity: 1});

    let animation = anime.timeline({targets: devcon, duration: 1200, easing: "linear"}).add({left: "+=90"});
    anime({targets: berlin, top: "+=85", duration: 1200, easing: "linear"});
    anime({targets: amsterdam, left: '+=90', top: '+=85px', duration: 1200, easing: "linear"});

    devcon.classList.add("shadowed");
    berlin.classList.add("shadowed");
    amsterdam.classList.add("shadowed");
    barcelona.classList.add("shadowed");

    let pieces: any = document.getElementsByClassName("puzzlePiece");

    let spinnerFadeIn: any = anime.timeline({
        targets: "#POAPloadanimation",
    }).add({
        opacity: 1, duration: 1000, easing: 'linear'
    });

    function whatever() {
        console.log("done!")
    }

    await spinnerFadeIn;
    let spinnerSpinning: any = anime({
        targets: "#POAPloadanimation",
        rotateZ: [0, 360],
        rotateX: [0, 360],
        rotateY: [0, 360],
        loop: true,
        duration: 8000,
        direction: 'alternate',
        easing: "linear",
    });
    console.log('llamas');
    await animation.finished;

    return spinnerSpinning;
}

export async function connect() {

    // WALLET CHECK ->
    if (!window.hasOwnProperty("ethereum")) {
        console.log("No wallet");
        alert("Hey friends.  You need a wallet installed in order to check your POAPs.");
        throw TypeError("No wallet.");
    }
    // <- WALLET CHECK

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

    let animationStarted = startWaitAnimation();
    await animationStarted;
    console.log("dingos");

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

    await animationStarted;

    POAPCheckRun.then(
        function (POAPInventory) {
            console.log("Done waiting.");
            document.getElementById("poap-check-dialog").classList.add("displayNone");
            let waitingAnimation: any;
            animationStarted.then(async function (spinnerAnimation) {
                spinnerAnimation.pause();
            });

            evaluatePOAPInventory(POAPInventory);
            // evaluatePOAPInventory({95404: 0, 95425: 0, 95421: 0, 95422: 0, 95423: 1, 95424: 1});


        },
        function (exception) {
            console.log(`Something went wrong: ${exception.message}`);
            alert(`Something went wrong: ${exception.message}`);

        }
    )
}