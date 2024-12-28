//17011079 - Emre Nitim
var gl;
var fishProgram;
var playerProgram;

var fishes = [];
var fishVColor;

var time = Date.now();

var player;
var playerVColor;

class Location {

    constructor(x, y, z) {
        this.maxLocation = 100;
        this.outOfClipLocation = 150;

        this.coordinates = [x, y, z];

        this.clipCoordinates = [x / this.maxLocation, y / this.maxLocation, z / this.maxLocation];
    }

    add(velocity, deltaTimeValue) {
        this.coordinates[0] += velocity[0] * deltaTimeValue;
        this.coordinates[1] += velocity[1] * deltaTimeValue;
        this.coordinates[2] += velocity[2] * deltaTimeValue;
        this.clipCoordinates = [this.coordinates[0] / this.maxLocation, this.coordinates[1] / this.maxLocation, this.coordinates[2] / this.maxLocation];
    }

    isOutOfClip() {
        if (this.coordinates[0] < -this.outOfClipLocation || this.coordinates[0] > this.outOfClipLocation
            || this.coordinates[1] < -this.outOfClipLocation || this.coordinates[1] > this.outOfClipLocation)
            return true;
        return false;
    }

    getDistance(b) {
        var a = this.coordinates;
        return Math.sqrt((a[0] - b[0]) * (a[0] - b[0]) + (a[1] - b[1]) * (a[1] - b[1]));
    }
}

class Fish {

    constructor(isPlayer) {
        
        this.location = new Location(
            Math.random() > 0.5 ? Math.round(Math.random() * 100 + 50) : Math.round(Math.random() * -50 - 100),
            Math.random() > 0.5 ? Math.round(Math.random() * 100 + 50) : Math.round(Math.random() * -50 - 100),
            Math.round(Math.random() * 50 - 25)
        );

        this.velocity = [(Math.random() * 10 - 5), (Math.random() * 10 - 5), 0];
        //this.velocity = [0, 0, 0];
        this.size = Math.random() / 2 + 0.05;
        if (this.velocity[0] < 0)
            this.turnBackAngle = 180;
        else
            this.turnBackAngle = 0;

        //this.size = 1;

        this.numVertices = 114;
        //3D Balık noktaları
        this.vertices = [
            vec3(-0.05, 0.15, 0.07),    //0
            vec3(-0.05, 0.15, -0.07),
            vec3(0.15, 0.15, 0.07),
            vec3(0.15, 0.15, -0.07),
            vec3(-0.05, -0.15, 0.07),   //1
            vec3(-0.05, -0.15, -0.07),
            vec3(0.15, -0.15, 0.07),
            vec3(0.15, -0.15, -0.07),
            vec3(0.25, 0.05, 0.04),      //2
            vec3(0.25, 0.05, -0.04),
            vec3(0.25, -0.05, 0.04),
            vec3(0.25, -0.05, -0.04),
            vec3(-0.25, 0.05, 0.02),    //3
            vec3(-0.25, 0.05, -0.02),
            vec3(-0.25, -0.05, 0.02),
            vec3(-0.25, -0.05, -0.02),
            vec3(-0.35, 0.1, 0.03),    //4
            vec3(-0.35, 0.1, -0.03),
            vec3(-0.35, -0.1, 0.03),
            vec3(-0.35, -0.1, -0.03),

            vec3(0.2, 0.06, 0.06),
            vec3(0.2, 0.0, 0.06),
            vec3(0.25, 0.03, 0.04),

            vec3(0.2, 0.06, -0.06),
            vec3(0.2, 0.0, -0.06),
            vec3(0.25, 0.03, -0.04),
        ];
        this.colors = [
            vec4( 0.0, 0.0, 0.6, 1.0 ),
            vec4( 0.0, 0.0, 0.6, 1.0 ),
            vec4( 0.0, 0.0, 0.8, 1.0 ),
            vec4( 0.0, 0.0, 0.8, 1.0 ),
            vec4( 0.0, 0.0, 0.6, 1.0 ),  
            vec4( 0.0, 0.0, 0.6, 1.0 ),  
            vec4( 0.0, 0.0, 0.8, 1.0 ),  
            vec4( 0.0, 0.0, 0.8, 1.0 ),  
            vec4( 0.0, 0.0, 1.0, 1.0 ),  
            vec4( 0.0, 0.0, 1.0, 1.0 ),  
            vec4( 0.0, 0.0, 1.0, 1.0 ),  
            vec4( 0.0, 0.0, 1.0, 1.0 ),  
            vec4( 0.0, 0.0, 1.0, 1.0 ),  
            vec4( 0.0, 0.0, 1.0, 1.0 ),  
            vec4( 0.0, 0.0, 1.0, 1.0 ),  
            vec4( 0.0, 0.0, 1.0, 1.0 ), 
            vec4( 0.0, 0.0, 0.0, 1.0 ), 
            vec4( 0.0, 0.0, 0.0, 1.0 ),  
            vec4( 0.0, 1.0, 1.0, 1.0 ),   
            vec4( 0.0, 1.0, 1.0, 1.0 ),   

            vec4( 1.0, 1.0, 0.0, 1.0 ), 
            vec4( 1.0, 1.0, 0.0, 1.0 ),  
            vec4( 0.7, 0.7, 0.0, 1.0 ),   
            vec4( 1.0, 1.0, 0.0, 1.0 ),  
            vec4( 1.0, 1.0, 0.0, 1.0 ),   
            vec4( 0.7, 0.7, 0.0, 1.0 ),  



            vec4( 0.6, 0.6, 0.0, 1.0 ),
            vec4( 0.6, 0.6, 0.0, 1.0 ),
            vec4( 0.8, 0.8, 0.0, 1.0 ),
            vec4( 0.8, 0.8, 0.0, 1.0 ),
            vec4( 0.6, 0.6, 0.0, 1.0 ),  
            vec4( 0.6, 0.6, 0.0, 1.0 ),  
            vec4( 0.8, 0.8, 0.0, 1.0 ),  
            vec4( 0.8, 0.8, 0.0, 1.0 ),  
            vec4( 1.0, 1.0, 0.0, 1.0 ),  
            vec4( 1.0, 1.0, 0.0, 1.0 ), 
            vec4( 1.0, 1.0, 0.0, 1.0 ),  
            vec4( 1.0, 1.0, 0.0, 1.0 ), 
            vec4( 1.0, 1.0, 0.0, 1.0 ),  
            vec4( 1.0, 1.0, 0.0, 1.0 ), 
            vec4( 1.0, 1.0, 0.0, 1.0 ),  
            vec4( 1.0, 1.0, 0.0, 1.0 ),  
            vec4( 0.0, 0.0, 0.0, 1.0 ),  
            vec4( 0.0, 0.0, 0.0, 1.0 ), 
            vec4( 1.0, 0.0, 1.0, 1.0 ),  
            vec4( 1.0, 0.0, 1.0, 1.0 ),  

            vec4( 1.0, 0.0, 1.0, 1.0 ),  
            vec4( 1.0, 0.0, 1.0, 1.0 ),  
            vec4( 0.4, 0.0, 0.4, 1.0 ),  
            vec4( 1.0, 0.0, 1.0, 1.0 ),  
            vec4( 1.0, 0.0, 1.0, 1.0 ),  
            vec4( 0.4, 0.0, 0.4, 1.0 )  
        ];
        this.indices = [
            0, 1, 2,
            1, 2, 3,
            2, 3, 8,
            3, 8, 9,
            8, 9, 10,
            9, 10, 11,
            10, 11, 6,
            11, 6, 7,
            6, 7, 4,
            7, 4, 5,
            4, 5, 14,
            5, 14, 15,
            14, 15, 18,
            15, 18, 19,
            18, 19, 16,
            19, 16, 17,
            16, 17, 12,
            17, 12, 13,
            12, 13, 0,
            13, 0, 1,

            18, 16, 14,
            16, 14, 12,
            14, 12, 4,
            12, 4, 0,
            4, 0, 6,
            0, 6, 2,
            6, 2, 10,
            2, 10, 8,

            19, 17, 15,
            17, 15, 13,
            15, 13, 5,
            13, 5, 1,
            5, 1, 7,
            1, 7, 3,
            7, 3, 11,
            3, 11, 9,

            20, 21, 22,
            23, 24, 25

        ];
        this.test = 0;
        this.theta = 0.0;

        this.translation = translate(this.location.clipCoordinates);
        this.rotation = rotate(0, 0, 0, 1);
        this.scale = scalem(this.size, this.size, this.size);
    }
    
    createBufferInfo() {
        var iBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(this.indices), gl.STATIC_DRAW);

        var cBuffer = gl.createBuffer();
        gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
        gl.bufferData( gl.ARRAY_BUFFER, flatten(this.colors), gl.STATIC_DRAW );

        fishVColor = gl.getAttribLocation( fishProgram, "vColor" );
        gl.vertexAttribPointer( fishVColor, 4, gl.FLOAT, false, 0, 0 );
        gl.enableVertexAttribArray( fishVColor );

        var vBuffer = gl.createBuffer();
        gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
        gl.bufferData( gl.ARRAY_BUFFER, flatten(this.vertices), gl.STATIC_DRAW );

        var vPosition = gl.getAttribLocation( fishProgram, "vPosition" );
        gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
        gl.enableVertexAttribArray( vPosition );
    }

    setTranslationMatrix(x, y, z) {
        this.translation = translate(x, y, z);
    }

    setRotationMatrix(degree, x, y, z) {
        this.rotation = rotate(degree, x, y, z);
    }

    setScale(x, y, z) {
        this.scale = scale(x, y, z);
    }

    computeMatrix() {
        var m = mat4();
        m = [[1, 0, 0, 0],
            [0, 1, 0, 0],
            [0, 0, 1, 0],
            [0, 0, 0, 1]];
        m.matrix = true;
        m = mult(m, this.translation);
        m = mult(m, this.rotation);
        m = mult(m, this.scale);
        return m;
    }

    getVelMagnitude() {
        return Math.sqrt(this.velocity[0] * this.velocity[0] + this.velocity[1] * this.velocity[1] + this.velocity[2] * this.velocity[2])
    }

    calculateSeperationVector() {
        if (this.location.getDistance(player.location.coordinates) > 30 + player.size * 3)
            return [0, 0, 0];
        var power = 1 / (this.location.getDistance(player.location.coordinates) + 1) * (this.location.getDistance(player.location.coordinates) + 1) * 0.01;
        var seperationVector = [power * (player.location.coordinates[0] - this.location.coordinates[0]),
            power * (player.location.coordinates[1] - this.location.coordinates[1]),
            0
        ];

        if (this.size < player.size) {
            seperationVector[0] *= -0.3;
            seperationVector[1] *= -0.3;
        }

        return seperationVector;
    }

    update() {
        this.test -= 0.01;
        var now = Date.now();
        var deltaTime = now - time;

        var seperationVector = this.calculateSeperationVector();
        this.velocity[0] += seperationVector[0];
        this.velocity[1] += seperationVector[1];

        this.location.add(this.velocity, 0.01 * deltaTime);
        this.setTranslationMatrix(this.location.clipCoordinates);

        this.theta += this.getVelMagnitude() * deltaTime * 0.001;
        if (this.velocity[0] < 0 && this.turnBackAngle != 180) {
            this.turnBackAngle += 10;
            this.setRotationMatrix(this.turnBackAngle, 0, 1, 0);
        } else if (this.velocity[0] >= 0 && this.turnBackAngle != 0) {
            this.turnBackAngle -= 10;
            this.setRotationMatrix(this.turnBackAngle, 0, 1, 0);
        } else {
            this.setRotationMatrix(this.turnBackAngle + Math.sin(this.theta) * 30, 0, 1, 0);
        }

    }

    display() {
        gl.useProgram(fishProgram);
        var uMatrixLoc = gl.getUniformLocation( fishProgram, "uMatrix" );
        gl.uniformMatrix4fv(uMatrixLoc, false, flatten(this.computeMatrix()));

        gl.drawElements( gl.TRIANGLES, this.numVertices, gl.UNSIGNED_BYTE, 0 );
    }

}

class Player {

    constructor() {
        this.location = new Location(
            Math.random() > 0.5 ? Math.round(Math.random() * 100 + 50) : Math.round(Math.random() * -50 - 100),
            Math.random() > 0.5 ? Math.round(Math.random() * 100 + 50) : Math.round(Math.random() * -50 - 100),
            Math.round(Math.random() * 100 - 50)
        );
        this.size = 0.3;
        this.velocity = [(Math.random() * 10 - 5), (Math.random() * 10 - 5), 0];
        //this.velocity = [0, 0, 0];

        this.targetLocation = new Location(0, 0, 0);

        if (this.velocity[0] < 0)
            this.turnBackAngle = 180;
        else
            this.turnBackAngle = 0;

        this.numVertices = 114;
        this.theta = 0.0;

        this.translation = translate(this.location.clipCoordinates);
        this.rotation = rotate(0, 0, 0, 1);
        this.scale = scalem(this.size, this.size, this.size);
    }
    
    setTranslationMatrix(x, y, z) {
        this.translation = translate(x, y, z);
    }

    setRotationMatrix(degree, x, y, z) {
        this.rotation = rotate(degree, x, y, z);
    }

    setScale(x, y, z) {
        this.scale = scalem(x, y, z);
    }

    getVelMagnitude() {
        return Math.sqrt(this.velocity[0] * this.velocity[0] + this.velocity[1] * this.velocity[1] + this.velocity[2] * this.velocity[2])
    }

    setTargetLocation(x, y) {
        this.targetLocation.clipCoordinates[0] = x;
        this.targetLocation.clipCoordinates[1] = y;
        this.targetLocation.coordinates[0] = x * this.location.maxLocation;
        this.targetLocation.coordinates[1] = y * this.location.maxLocation;
    }

    setTargetLocationZ(z) {
        this.targetLocation.clipCoordinates[2] = z / this.maxLocation;
        this.targetLocation.coordinates[2] = z;
    }

    computeMatrix() {
        var m = mat4();
        m = mult(m, this.translation);
        m = mult(m, this.rotation);
        m = mult(m, this.scale);
        return m;
    }

    update() {
        var now = Date.now();
        var deltaTime = now - time;

        var power = 0.1;
        this.velocity = [power * (this.targetLocation.coordinates[0] - this.location.coordinates[0]),
            power * (this.targetLocation.coordinates[1] - this.location.coordinates[1]),
            power * (this.targetLocation.coordinates[2] - this.location.coordinates[2])
        ];
        this.location.add(this.velocity, 0.01 * deltaTime);
        this.setTranslationMatrix(this.location.clipCoordinates);

        this.theta += this.getVelMagnitude() * deltaTime * 0.001;
        if (this.velocity[0] < 0 && this.turnBackAngle != 180) {
            this.turnBackAngle += 10;
            this.setRotationMatrix(this.turnBackAngle, 0, 1, 0);
        } else if (this.velocity[0] >= 0 && this.turnBackAngle != 0) {
            this.turnBackAngle -= 10;
            this.setRotationMatrix(this.turnBackAngle, 0, 1, 0);
        } else {
            this.setRotationMatrix(this.turnBackAngle + Math.sin(this.theta) * 30, 0, 1, 0);
        }

        this.setScale(this.size, this.size, this.size);
    }

    display() {
        gl.useProgram(playerProgram);
        var uMatrixLoc = gl.getUniformLocation( playerProgram, "uMatrix" );
        gl.uniformMatrix4fv(uMatrixLoc, false, flatten(this.computeMatrix()));

        gl.drawElements( gl.TRIANGLES, this.numVertices, gl.UNSIGNED_BYTE, 0 );
    }

}

window.onload = function init() {
    //Canvası al WebGL setupla
    var canvas = document.getElementById("gl-canvas");
    canvas.tabIndex = 1000;
    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) {
        alert("WebGL isn't available");
        return;
    }

    fishProgram = initShaders(gl, "vertex-shader", "fragment-shader");
    playerProgram = initShaders(gl, "player-vertex-shader", "fragment-shader");

    player = new Player();

    fish = new Fish();
    fish.createBufferInfo();
    fishes.push(fish);
    for (i = 0; i < 29; i++) {
        fish = new Fish();
        fishes.push(fish);
    }

    canvas.addEventListener('mousemove', e => {
        var pos = getRelativeMousePosition(e, canvas);
        const x = pos.x / gl.canvas.width  *  2 - 1;
        const y = pos.y / gl.canvas.height * -2 + 1;
        player.setTargetLocation(x, y, player.location.clipCoordinates[2]);
    });

    canvas.addEventListener('keydown', event => {
        if (event.keyCode == 82) {
            player.size = 0.3;
            window.requestAnimationFrame(render);
        }
    })

    render();
};

function render() {

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(57/255, 174/255, 179/255, 1.0);
    gl.enable(gl.DEPTH_TEST);

    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    player.update();
    player.display();
    var flag = 0;

    for (i = fishes.length-1; i >= 0 ; i--) {
        //console.log(i);
        fishes[i].update();
        fishes[i].display();

        if (fishes[i].location.isOutOfClip()) {
            fishes.splice(i, 1);
            fish = new Fish();
            fishes.push(fish);
        }

        if (!checkCollision(player, fishes[i], i)) {
            flag = 1;
        }
    }

    time = Date.now();
    if (flag == 0)
        window.requestAnimationFrame(render);
}

function checkCollision(player, fish, index) {
    if (player.location.getDistance(fish.location.coordinates) <= player.size * 5 && player.size > fish.size) {
        fishes.splice(index, 1);
        fish = new Fish();
        fishes.push(fish);
        player.size += 0.04;
    } else if (player.location.getDistance(fish.location.coordinates) <= player.size * 20 && player.size < fish.size) {
        console.log("restart");
        return false;
    }
    return true;
}

function getRelativeMousePosition(event, target) {
    target = target || event.target;
    var rect = target.getBoundingClientRect();
  
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    }
  }

function getNoPaddingNoBorderCanvasRelativeMousePosition(event, target) {
    target = target || event.target;
    var pos = getRelativeMousePosition(event, target);
  
    pos.x = pos.x * target.width  / target.clientWidth;
    pos.y = pos.y * target.height / target.clientHeight;
  
    return pos;  
}

console.log("square.js bitti");