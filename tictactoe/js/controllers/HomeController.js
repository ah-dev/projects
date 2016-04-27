app.controller('HomeController',
    ['$scope', function ($scope) {

        /* Scope variables for template and constants */
        $scope.gameCount = 0;
        $scope.playerMoves = {};
        $scope.winningBoards = {};

        /* Function: Initializes items necessary for game play */
        $scope.initGame = function (size) {
            $scope.createBoard(size);
            $scope.winningBoards = $scope.generateWinners(size);
            $scope.gameCount++;
        };

        /* Function: Creates data model that is used to render the gameboard on the template */
        $scope.createBoard = function (size) {
            /* init playerMoves obj
             * ...ask not what your data model can do for you but what you can do for your data model! */
            $scope.playerMoves[$scope.gameCount] = {};
            $scope.playerMoves[$scope.gameCount]['size'] = size;
            $scope.playerMoves[$scope.gameCount]['displayMoves'] = [];
            $scope.playerMoves[$scope.gameCount]['moves'] = {};
            $scope.playerMoves[$scope.gameCount]['nextMove'] = 'x';
            $scope.playerMoves[$scope.gameCount]['resultText'] = '';
            $scope.playerMoves[$scope.gameCount]['gameOver'] = false;

            var gridSize = size * size;

            var row = [];
            for (var i = 0; i < gridSize; i++) {
                if (i !== 0 && i % size === 0) {
                    $scope.playerMoves[$scope.gameCount]['displayMoves'].push(row);
                    row = [];
                }

                row.push(i);

                if (i === gridSize - 1) {
                    $scope.playerMoves[$scope.gameCount]['displayMoves'].push(row);
                }
            }

        };

        /* Function: Mathematically generates list of all possible winning board combinations */
        $scope.generateWinners = function (size) {
            var winBoards = $scope.winningBoards;
            var winList = [];

            if (winBoards[size]) {
                return winBoards;
            } else {
                winBoards[size] = [];
            }

            /* size base array */
            for (var w = 0; w < size; w++) {
                winList.push(w);
            }

            /* horizonal rows */
            for (var h = 0; h < size; h++) {
                var winHorRows = winList.map(function (num) {
                    return num + size * h;
                });

                winBoards[size].push(winHorRows);
            }

            /* vertical rows */
            for (var v = 0; v < size; v++) {
                var winVertRows = winList.map(function (num) {
                    return winList.indexOf(num) * size + v;
                });

                winBoards[size].push(winVertRows);
            }

            /* top left to bottom right diagonal */
            var winLeftDiag = winList.map(function (num) {
                return num * size + winList.indexOf(num);
            });
            winBoards[size].push(winLeftDiag);

            /* top right to bottom left diagonal */
            var winRightDiag = winList.map(function (num) {
                return (winList.indexOf(num) + 1) * (size - 1);
            });
            winBoards[size].push(winRightDiag);

            return winBoards;
        };

        /* Function: Registers that a move was made and defines current/next moves */
        $scope.makeMove = function () {
            var moveContainer = $(this).children('.move');

            var gameId = $(this).attr('data-gameId');
            var moveId = this.id;

            var plays = $scope.playerMoves[gameId];
            var currentSize = plays['size'];

            if ($scope.playerMoves[gameId]['nextMove'] === '') {
                var currentMove = 'x';
            } else {
                currentMove = $scope.playerMoves[gameId]['nextMove'];
            }

            if ((moveContainer).is(':empty') && $scope.playerMoves[gameId]['gameOver'] !== true) {
                $scope.playerMoves[gameId]['nextMove'] = (currentMove === 'x') ? 'o' : 'x';
                $scope.playerMoves[gameId]['moves'][moveId] = currentMove;

                $(moveContainer).append(currentMove);
                $scope.checkWinner(currentSize, gameId, currentMove);
            }

            /* Angular magic to update $scope values for view */
            $scope.$apply();

        };

        /* Function: For each winning board, checks if moves so far equals a winner */
        $scope.checkWinner = function (size, id, lastMove) {
            var pattern = '';
            var resultText = '';
            var gameOver = false;

            var plays = $scope.playerMoves[id]['moves'];
            var winningBoards = $scope.winningBoards[size];
            var winningMove = lastMove.repeat(size);

            for (var i = 0; i < winningBoards.length; i++) {
                var winners = winningBoards[i];

                for (var j = 0; j < size; j++) {
                    if (plays[winners[j]] !== undefined) {
                        pattern += plays[winners[j]];
                    }

                }
                if (pattern === winningMove) {
                    gameOver = true;
                    resultText = lastMove + ' wins';
                    break;
                }
                pattern = '';
            }

            if ($scope.getObjLength(plays) === (size * size) && gameOver !== true) {
                resultText = "Sorry buddy, it's a draw";
            }

            $scope.playerMoves[id]['gameOver'] = gameOver;
            $scope.playerMoves[id]['resultText'] = resultText;
        };

        /* Function: Empty's moves and resets data model for fresh game */
        $scope.resetBoard = function (gameId) {
            $scope.playerMoves[gameId]['moves'] = {};
            $scope.playerMoves[gameId]['resultText'] = '';
            $scope.playerMoves[gameId]['gameOver'] = false;
            $('#tic-contain-' + gameId + ' .move').empty();
        };

        /* Function: Helper function that returns length of an object */
        $scope.getObjLength = function (obj) {
            return Object.keys(obj).length;
        };

        $('.tic-gameboards').on('click', '.tic-tile', $scope.makeMove);

    }]);