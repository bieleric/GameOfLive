let view, model, controller;


document.addEventListener('DOMContentLoaded', function() {
    
    view = new View();
    model = new Model();
    controller = new Controller();


    controller.registerEventhandler();
});

class View 
{
    constructor() {
        
    }

    createTable(width, height) {
        let oldTable = document.getElementsByTagName("table");
        if(!(oldTable[0] == null)) {
            document.body.removeChild(oldTable[0]);
        }

        let table = document.createElement("table");

        table.style.width = 20*width + "px";
        table.style.height = 20*height + "px";
        table.style.marginTop = "3%";
        table.style.border = "solid 3px gray";

        let counter = 0;
        for (var i = 0; i < height; i++) {

            var tr = document.createElement('tr');
            tr.style.lineHeight = "15px";
            
            for (var j = 0; j < width; j++) {
                var td = document.createElement('td');
                td.style.border = "solid 2px grey";
                td.style.width = "15px";
                td.style.height = "15px";

                if(model.binaryArray[counter] == 1) {
                    td.style.backgroundColor = "green";
                }
                else {
                    td.style.backgroundColor = "red";
                }

                counter++;

                tr.appendChild(td);
            }
            table.appendChild(tr);
        }
        
        document.body.appendChild(table);
    }
    
}



class Model
{    
    constructor() {
        this.binaryArray;
        this.matrix;
        this.futureMatrix;
    }

    array2Matrix(width, height) {

        this.matrix = new Array(width);
        this.futureMatrix = new Array(width);

        for(let i = 0; i < width; i++) {
            
            this.matrix[i] = new Array(height);
            this.futureMatrix[i] = new Array(height);

            for(let j = 0; j < height; j++) {
                
                this.matrix[i][j] = this.binaryArray[i + j];
            }
        }
    }

    matrix2Array(width, height) {

        for(let i = 0; i < width; i++) {

            for(let j = 0; j < height; j++) {
                
                 this.binaryArray[i + j] = this.futureMatrix[i][j]
            }
        }
    }

    nextGen(width, height) {
        for(let l = 1; l < width - 1; l++) {
            for(let m = 1; m < height - 1; m++) {
                let neighbors = 0;

                for(let i = -1; i <= 1; i++) {
                    for(let j = -1; j <= 1; j++) {
                        neighbors += Number(this.matrix[l + i][m + j]);
                    }
                }

                neighbors -= Number(this.matrix[l][m]);

                /* rules */
                if((this.matrix[l][m] == 1) && (neighbors < 2)) {
                    this.futureMatrix[l][m] = 0;
                }
                else if((this.matrix[l][m] == 1) && (neighbors > 3)) {
                    this.futureMatrix[l][m] = 0;
                }
                else if((this.matrix[l][m] == 0) && (neighbors == 3)) {
                    this.futureMatrix[l][m] = 1;
                }
                else {
                    this.futureMatrix[l][m] = Number(this.matrix[l][m]); 
                }
            }
        }
    }
}

class Controller
{
    constructor() {
        this.live;
    }

    registerEventhandler() {
        let inputWidth = document.getElementById("inputWidth");
        let inputHeight = document.getElementById("inputHeight");
        let inputLivecycles = document.getElementById("inputLivecycles");
        let playButton = document.getElementById("playButton");
        let nextButton = document.getElementById("nextButton");


        playButton.addEventListener("click", () => {
            let width = inputWidth.value;
            let height = inputHeight.value;
            this.live = 1;

            let cells = this.checkBinaryInput(width, height);
            if(cells == 0) {
                return;
            }

            view.createTable(width, height);
            model.array2Matrix(width, height);
        });

        nextButton.addEventListener("click", () => {
            let width = inputWidth.value;
            let height = inputHeight.value;
            let livecycles = inputLivecycles.value;

            if(this.live > livecycles) {
                nextButton.innerHTML = "Ende!";
                return;
            }

            model.nextGen(width, height);
            model.matrix2Array(width, height);
            view.createTable(width, height); 

            this.live++;
        })

    }

    checkBinaryInput(width, height) {
        let binaryInput = document.getElementById("inputBinaryGame").value;
        let binaryArray = binaryInput.split('');
        let cellNumbers = width * height;

        
        for(let i = 0; i < binaryInput.length; i++) {
            if(!(binaryArray[i] == "0" || binaryArray[i] == "1")) {
                alert("Binärer Input darf nur aus Nullen und Einsen bestehen.");
                return 0;
            }
        }

        if(cellNumbers == binaryInput.length) {
            model.binaryArray = binaryArray;
            return cellNumbers;
        }
        else {
            alert("Binärer Input entspricht nicht der Anzahl der Zellen");
            return 0;
        }
    }
}
