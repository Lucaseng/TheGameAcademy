function showHome() {
    document.getElementById("jumbotron").style.display = "block";
    document.getElementById("shop").style.display = "none";
    document.getElementById("register").style.display = "none";
    document.getElementById("login").style.display = "none";
    document.getElementById("chess").style.display = "none";
    document.getElementById("guestbook").style.display = "none";
}

function showShop() {
    document.getElementById("jumbotron").style.display = "none";
    document.getElementById("shop").style.display = "block";
    document.getElementById("register").style.display = "none";
    document.getElementById("login").style.display = "none";
    document.getElementById("chess").style.display = "none";
    document.getElementById("guestbook").style.display = "none";
    getAllItems();
}

function showRegister() {
    document.getElementById("jumbotron").style.display = "none";
    document.getElementById("shop").style.display = "none";
    document.getElementById("register").style.display = "block";
    document.getElementById("login").style.display = "none";
    document.getElementById("chess").style.display = "none";
    document.getElementById("guestbook").style.display = "none";
}

function showLogin() {
    document.getElementById("jumbotron").style.display = "none";
    document.getElementById("shop").style.display = "none";
    document.getElementById("register").style.display = "none";
    document.getElementById("login").style.display = "block";
    document.getElementById("chess").style.display = "none";
    document.getElementById("guestbook").style.display = "none";
}

function showGuestbook() {
    document.getElementById("jumbotron").style.display = "none";
    document.getElementById("shop").style.display = "none";
    document.getElementById("register").style.display = "none";
    document.getElementById("login").style.display = "none";
    document.getElementById("chess").style.display = "none";
    document.getElementById("guestbook").style.display = "block";
    getAllComments();
}

function showChess() {
    document.getElementById("jumbotron").style.display = "none";
    document.getElementById("shop").style.display = "none";
    document.getElementById("register").style.display = "none";
    document.getElementById("login").style.display = "none";
    document.getElementById("chess").style.display = "block";
    document.getElementById("guestbook").style.display = "none";
}


window.onload = () => {
    showHome();     
    resetChessboard = document.getElementById("chessboard").innerHTML;
};

var gameId = null;
let hasMoved = false;


function quit() {
    const fetchPromise = fetch(`https://cws.auckland.ac.nz/gas/api/QuitGame?gameId=${gameId}`, {
        headers: {
            "Content-Type": "text/plain",
            'Authorization': 'Basic ' + btoa(`${document.getElementById("myUser").value}:${document.getElementById("myPass").value}`),
        }
    });
    const streamPromise = fetchPromise.then((response) => response.text());
    streamPromise.then((data) => document.getElementById("initialStatus").innerHTML = data);
    gameId = null;
    document.getElementById("chessboard").innerHTML = resetChessboard;
    document.getElementById("pairedPlayerStatus").innerHTML = "";
    document.getElementById("initialStatus").innerHTML = "";
    document.getElementById("getMoveBut").style.display = "none";
    document.getElementById("quitBut").style.display = "none";
    document.getElementById("setMoveBut").style.display = "none";
    document.getElementById("pairBut").style.display = "inline";


}

function pair() {
    if (document.getElementById("loginbut").style.display === "none") {
        const fetchPromise = fetch(`https://cws.auckland.ac.nz/gas/api/PairMe`, {
            headers: {
                "Content-Type": "text/plain",
                'Authorization': 'Basic ' + btoa(`${document.getElementById("myUser").value}:${document.getElementById("myPass").value}`),
            }
        });
        const streamPromise = fetchPromise.then((response) => response.json());
        streamPromise.then((data) => showPair(data));
    } else {
        showLogin();
    }
}

function resumeGame(isPlayer1, isMyTurn, priorMove) {
    document.getElementById("chessboard").innerHTML = priorMove;
    document.getElementById("pairBut").style.display = "none";
    if (isMyTurn) {
        if (isPlayer1) {
            document.getElementById("initialStatus").innerHTML = `Welcome back! You're white.`;
        } else {
            document.getElementById("initialStatus").innerHTML = `Welcome back! You're black.`;
        }
        document.getElementById("pairedPlayerStatus").innerHTML = `It's your turn.`;
        myTurn();
    } else {
        if (isPlayer1) {
            document.getElementById("initialStatus").innerHTML = `Welcome back! You're white.`;
        } else {
            document.getElementById("initialStatus").innerHTML = `Welcome back! You're black.`;
        }
        document.getElementById("pairedPlayerStatus").innerHTML = `It's not your turn.`;
        opponentTurn();

    }
}

    function showPair(data) {
        if (data.state === "wait") {
            document.getElementById("pairedPlayerStatus").innerHTML = `Waiting for a game, ${data.player1}! Press the pair button periodically to check if you are paired.`;
        } else if ((data.lastMovePlayer1 === "" && data.lastMovePlayer2 !== "")) {
            if (data.player1 === document.getElementById("myUser").value) {
                resumeGame(true, true, data.lastMovePlayer2);
            } else {
                resumeGame(false, false, data.lastMovePlayer2);
            }
        } else if ((data.lastMovePlayer2 === "" && data.lastMovePlayer1 !== "")) {
            if (data.player2 === document.getElementById("myUser").value) {
                resumeGame(false, true, data.lastMovePlayer1);
            } else {
                resumeGame(true, false, data.lastMovePlayer1);
            }
        } else {
            document.getElementById("chessboard").innerHTML = resetChessboard;
            if (document.getElementById("myUser").value === data.player1) {
                document.getElementById("initialStatus").innerHTML = `You're all paired up! ${data.player1} takes on ${data.player2}. You are white.`;
                document.getElementById("pairedPlayerStatus").innerHTML = "";
                myTurn();
            } else {
                document.getElementById("initialStatus").innerHTML = `You're all paired up! ${data.player1} takes on ${data.player2}. You are black.`;
                document.getElementById("pairedPlayerStatus").innerHTML = "";
                opponentTurn();
            }

            document.getElementById("pairBut").style.display = "none";
        }
        document.getElementById("quitBut").style.display = "inline";
        gameId = data.gameId;
    }

    function getMove() {
        const fetchPromise = fetch(`https://cws.auckland.ac.nz/gas/api/TheirMove?gameId=${gameId}`, {
            headers: {
                "Content-Type": "text/plain",
                'Authorization': 'Basic ' + btoa(`${document.getElementById("myUser").value}:${document.getElementById("myPass").value}`),
            }
        });
        const streamPromise = fetchPromise.then((response) => response.text());
        streamPromise.then((data) => {
            if (data === "") {
                document.getElementById("pairedPlayerStatus").innerHTML = "Your opponent hasn't moved yet.";
            } else if (data === "(no such gameId)") {
                opponentQuit();
            } 
            else {
                // change the board
                document.getElementById("chessboard").innerHTML = data;
                // change buttons
                myTurn();
                document.getElementById("pairedPlayerStatus").innerHTML = "It's your turn.";
            }
        });
    }

    function opponentQuit() {
        document.getElementById("pairedPlayerStatus").innerHTML = "Your opponent forfeited.";
        document.getElementById("initialStatus").innerHTML = "";
        document.getElementById("chessboard").innerHTML = resetChessboard;
        document.getElementById("setMoveBut").style.display = "none";
        document.getElementById("getMoveBut").style.display = "none";
        document.getElementById("quitBut").style.display = "none";
        document.getElementById("pairBut").style.display = "inline";
    }

    function setMove() {
        if (hasMoved) {
            let myJSON = {
                "gameId": gameId,
                "move": document.getElementById("chessboard").innerHTML
            };
            const fetchPromise = fetch('https://cws.auckland.ac.nz/gas/api/MyMove', {
                method: 'POST',
                body: JSON.stringify(myJSON),
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': 'Basic ' + btoa(`${document.getElementById("myUser").value}:${document.getElementById("myPass").value}`),
                }
            });
            const streamPromise = fetchPromise.then((response) => response.text());
            streamPromise.then((response) => {
                if (response === "no such game id") {
                    opponentQuit();
                } else {
                    document.getElementById("pairedPlayerStatus").innerHTML = response;
                    opponentTurn();
                    hasMoved = false;
                }

            });
        } else {
            document.getElementById("pairedPlayerStatus").innerHTML = "You haven't moved yet!";

        }


    }

    function myTurn() {
        document.getElementById("setMoveBut").style.display = "inline";
        document.getElementById("getMoveBut").style.display = "none";
    }

    function opponentTurn() {
        document.getElementById("setMoveBut").style.display = "none";
        document.getElementById("getMoveBut").style.display = "inline";

    }

    function dragstart(event) {
        event.dataTransfer.setData("text/plain", event.target.id);

    }

    function mybindrop(event) {
        if (event.dataTransfer !== null) {
            const data = event.dataTransfer.getData("text/plain");
            document.getElementById(data).remove();
        }
    }

    function mybindragover(event) {
        event.preventDefault();
    }

    function mydragover(event) {
        if (event.target.nodeName !== "IMG" && !event.target.hasChildNodes()) {
            event.preventDefault();
        }
    }

    function mydrop(event) {
        if (event.dataTransfer !== null) {
            if (event.target.nodeName !== "IMG") {
                const data = event.dataTransfer.getData("text/plain");
                event.target.appendChild(document.getElementById(data));
                hasMoved = true;
            }
        }
    }

    function getAllComments() {
        const fetchPromise = fetch('https://cws.auckland.ac.nz/gas/api/Comments');
        const streamPromise = fetchPromise.then((response) => response.text());
        streamPromise.then((data) => showComments(data));
    }

    function showComments(data) {
        document.getElementById("injectRecentComments").innerHTML = data;


    }

    function writeComment() {
        let myJSON = {
            "comment": document.getElementById("commentBody").value,
            "name": document.getElementById("commentName").value
        };
        const fetchPromise = fetch('https://cws.auckland.ac.nz/gas/api/Comment', {
            method: 'POST',
            body: JSON.stringify(myJSON),
            headers: { "Content-Type": "application/json" }
        });
        const streamPromise = fetchPromise.then((response) => response.text());
        streamPromise.then((response) => {
            getAllComments();
            document.getElementById("commentBody").value = "";
            document.getElementById("commentName").value = "";
        });

    }

    function register() {
        let myJSON = {
            "username": document.getElementById("regUsername").value,
            "password": document.getElementById("regPassword").value,
            "address": document.getElementById("regAddress").value
        };
        const fetchPromise = fetch('https://cws.auckland.ac.nz/gas/api/Register', {
            method: 'POST',
            body: JSON.stringify(myJSON),
            headers: { "Content-Type": "application/json" }
        });
        const streamPromise = fetchPromise.then((response) => response.text());
        streamPromise.then((data) => document.getElementById("injectRegisterMessage").innerHTML = data);
    }

    function login() {

        const fetchPromise = fetch('https://cws.auckland.ac.nz/gas/api/VersionA', {
            headers: {
                "Content-Type": "text/plain",
                'Authorization': 'Basic ' + btoa(`${document.getElementById("myUser").value}:${document.getElementById("myPass").value}`),
            }
        });
        fetchPromise.then(function (response) {
            if (response.status === 401) {
                throw new Error(response.status)
            }
            else {
                isAuthenticated();
            }
        }).catch(function (error) {
            document.getElementById("failedLogin").innerHTML = `Login failed! 401: Invalid Credentials. Try again!`;
        });

    }

    function getPopup(userName, ID) {
        var popup = document.getElementById("myPop");
        popup.style.display = "block";
        document.getElementById("injectPurchaseMessage").innerHTML = `Gotcha! ${userName}, you successfully purchased ${ID}.`;

        document.getElementsByClassName("close")[0].onclick = function () {
            popup.style.display = "none";
        }

        window.onclick = function (event) {
            if (event.target == popup) {
                popup.style.display = "none";
            }
        }

    }

    function isAuthenticated() {
        document.getElementById("loginbut").style.display = "none";
        document.getElementById("logoutbut").style.display = "inline";
        document.getElementById("failedLogin").innerHTML = ``;
        document.getElementById("logoutbut").innerHTML = `${document.getElementById("myUser").value} (Logout)`;
        showHome();
    }

    function logout() {
        document.getElementById("loginbut").style.display = "inline";
        document.getElementById("logoutbut").style.display = "none";
        document.getElementById("myPass").value = "";
        document.getElementById("myUser").value = "";
        opponentQuit();
        document.getElementById("pairedPlayerStatus").innerHTML = "";
        document.getElementById("initialStatus").innerHTML = "";
        showHome();
    }

    function purchaseItem(str) {
        if (document.getElementById("loginbut").style.display === "none") {
            const fetchPromise = fetch(`https://cws.auckland.ac.nz/gas/api/PurchaseItem/${str}`, {
                headers: {
                    "Content-Type": "text/plain",
                    'Authorization': 'Basic ' + btoa(`${document.getElementById("myUser").value}:${document.getElementById("myPass").value}`),
                }
            });
            const streamPromise = fetchPromise.then((response) => response.json());
            streamPromise.then((data) => getPopup(data.userName, data.productID));
        } else {
            showLogin();
        }
    }

    function filterShop() {
        if (document.getElementById("filterInput").value === "") {
            getAllItems();
        } else {
            const fetchPromise = fetch(`https://cws.auckland.ac.nz/gas/api/Items/${document.getElementById("filterInput").value}`);
            const streamPromise = fetchPromise.then((response) => response.json());
            streamPromise.then((data) => showItems(data));
        }

    }

    function getVersion() {
        const fetchPromise = fetch('https://cws.auckland.ac.nz/gas/api/Version');
        const streamPromise = fetchPromise.then((response) => response.text());
        streamPromise.then((data) => showVersion(data));
        const showVersion = (myStr) => {
            const myP = document.getElementById('myVer');
            myP.innerHTML = myStr;
        }
    }

    function getAllItems() {
        const fetchPromise = fetch('https://cws.auckland.ac.nz/gas/api/AllItems');
        const streamPromise = fetchPromise.then((response) => response.json());
        streamPromise.then((data) => showItems(data));
    }


    const showItems = (items) => {
        let htmlString = "";
        const showItem = (item) => {
            htmlString += `<tr><td><img alt="Item Photo" src="https://cws.auckland.ac.nz/gas/api/ItemPhoto/${item.id}"/></td>\
        <td><h3>${item.name}</h3><p>${item.description}</p><h4>$${item.price}</h4><button onclick="purchaseItem(${item.id})" class="purBut" type="submit">Purchase Item</button></td></tr>`;
        }

        items.forEach(showItem);
        const ourTable = document.getElementById("productTable");
        ourTable.innerHTML = htmlString;
    }

    getVersion();


