//THE LONG CORRIDOR ROUGELIKE-LIKE

//Gameplay Elements
var hp = 15;
var maxhp = 15;
var nrg = 10;
var maxnrg = 10;
var dmg = 3;
var turn = 0;
var score = 0;
var gameover = 0;
var fallDamage = 0;
var spit = 5;
var searchRand = 10;
var shopItem = "";
var amuletGet = 0; //We only want one amulet to exist in one game.
var revive = 0;
var amuletEnchantment = ""; //Amulet enchantment
var scavenger = 0; //Additional gold
var lastRoom = 20;

//Misc.
var arrow = document.getElementById("arrow");
var arrowColor = function(){
  arrow.src="assets/arrowYellow.png";
  console.log("changed");
};

//Monsters
creature = function(name, hp, dmg){
  this.name = name;
  this.hp = hp;
  this.dmg = dmg;
};

//Regen
var regen = function(){
  
  nrg+=2;
  hp++;
};

//Random Number
var randomNumber = function(max, min){
  var rand = Math.floor((Math.random() * max) + min);
  return rand;
};
var rand = "";

//Items
var objectSpit = 0;
var li = document.createElement("li");
items = [];
var invList = document.getElementById("invlist");
item = function(name, worth){
  this.name = name;
  this.worth = worth;
};

var amuletSave = function(){
  actionBox.disabled = true;
  actionText.innerHTML += "<br>But your amulet shatters, and you are brought back to life! What a miracle!";
  image.src = "assets/revive.png";
  setTimeout(function(){
    roomie = newroom();
    turn ++;
    revive = 0;
    actionBox.disabled = false;
    actionBox.select();
    hp = maxhp;
    nrg = maxnrg;
    updateRoomText();
    updateStats();
    
  }, 1000); 
  updateStats();
};

var randItem = function(){
  var itemGet = "";
  rand = randomNumber(7,1);
  if(rand === 3){
    itemGet = new item('water', 5);
    itemGet.fill = randomNumber(5,1);
  }
  else if(rand === 2){
    itemGet = new item('glasses', 10);
  }
  else if(rand === 1 && amuletGet === 0){
    itemGet = new item('amulet', 15);
    amuletGet = 1; // Saying "Hey, an amulet exists, don't give me any more!"
  }
  else if(rand === 1 && amuletGet === 1){
    itemGet = new item('punching glove', 10);
  }
  else if(rand === 4){
    itemGet = new item('hourglass', 20);
    itemGet.extend = randomNumber(20,1);
  }
  else if(rand === 5){
    itemGet = new item('potion', 10);
    itemGet.effect = randomNumber(5,1);
  }
  else if(rand === 6){
    itemGet = new item('medkit', 10);
    itemGet.health = randomNumber(5,1);
  }
  else if(rand === 7){
    itemGet = new item('flashlight', 10);
    itemGet.power = randomNumber(20,1); //How far the gruel can get set back
  }
  return itemGet;
};

//Action
var action = "";

//Room List
var map = [];
var place = 0; //Current place where the player is
var grool = -20; //Where the Grool is
//Room Object
room = function(name, desc, symbol){
  this.name = name;
  this.desc = desc;
  this.symbol = symbol;
};
var roomie = new room("", "", "");
var image = document.getElementById("canvas"); 

//Preset Rooms
entrance = new room("entrance", null, "E");
entrance.desc = "The doors shut behind you. Welcome to the Long Corridor.";
map.push(entrance.symbol);

exit = new room("exit", null, "X");
exit.desc = "The end of the corridor! You made it!";

//Room Text
var roomText = document.getElementById("text");
roomText.innerHTML = entrance.desc;

//Action Text
var actionText = document.getElementById("response");
actionText.innerHTML = "Type your action below. <br> Press 'h' for help.";

//New Room
var newroom = function(){
  var newerroom = new room(null, null, null); // 4 types of rooms: shops, pits, corridors & monsters
  
  //ENDING ~~ Thats it! Its over! This is where the game ends. 
  if(map.length >= lastRoom){ //If you have covered 20 or more tiles, end the game.
    actionBox.disabled = true;
    newerroom = exit; //The new room will always be an exit room.
    image.src = "assets/end.png";
    actionText.innerHTML = "Congratulations!";
    score +=100;
    setTimeout(function(){
      image.src = "assets/endscreen.png";
      actionText.innerHTML = "Your final score: " + score;
      if(score > 196){
        alert("Wow! You beat John's high score! Congrats!");
      }
      else if(score === 196){
        alert("You tied with John's score! Congrats!");
      }
    },2000);
  }
  else{
    //random room generation
    var rand = randomNumber(4,1);
    //random pit generation
    if(rand === 2){
      rand = randomNumber(4,1);
      //normal pit generation
      if(rand === 1){
        newerroom = new room("pit", null, "P");
        newerroom.desc = "There is a large pit in this segment.";  
      }
      //gold pit generation
      else if(rand === 2){
        newerroom = new room("gold pit", null, "G");
        newerroom.desc = "There is a large pit in this segment.";
      }
      //spike pit generation
      else if(rand === 3){
        newerroom = new room("spiked pit", null, "S");
        newerroom.desc = "There is a large pit in this segment.";
      }
      else if(rand === 4){
        newerroom = new room("junk pile", null, "J");
        newerroom.desc = "There is a large pit in this segment.";
      }
      //default image
      image.src="assets/pit.png";
    }

    //monster room
    else if(rand === 3){
      rand = randomNumber(1,1);
      if(rand === 1){
        newerroom = new room("skeleton room", null, "M");
        newerroom.desc = "A skeleton blocks the way!";
        image.src = "assets/monster1.png";
        monster = new creature('skeleton', 5, 3);
      }

    }
    //shop room
    else if(rand === 4 && place >= 5){
      rand = randomNumber(1,1);
      payed = 0;
      newerroom = new room("shop", null, "$");
      newerroom.desc = "A shop for buying stuff in exchange for gold.";
      image.src = "assets/shop.png";
      shopItem = randItem();
      
    }

    else{
      //graffiti generation -- usually little tips that help people who are so bored that they search a normal looking segment.
      rand = randomNumber(10, 1);
      if(rand === 4){
        newerroom = new room("graffiti", null, "O");
        newerroom.desc = "A normal segment of the corridor.";
        rand = randomNumber(10, 1);
        if(rand === 1){
          newerroom.graffiti = "They call him John..";
        }
        else if(rand === 2){
          newerroom.graffiti = "Spitting really does help find out what lies on the bottom of pits, they say...";
        }
        else if(rand === 3){
          newerroom.graffiti = "Why do people hide gold in pits?";
        }
        else if(rand === 4){
          newerroom.graffiti = "I heard that there are only about 20 segments in usual corridors...";
        }
        else if(rand === 5){
          newerroom.graffiti = "Amulets can either be good or bad. Remember to use them if you wish to learn the effect.";
        }
        else if(rand === 6){
          newerroom.graffiti = "Try to beat John's score of 196!";
        }
        else{
          newerroom.graffiti = "Who made this corridor?!";
        }
      }
      //normal room generation
      else{
        newerroom = new room("normal", null, "O");
        newerroom.desc = "A normal segment of the corridor.";  
      }
      image.src = "assets/normal.png";
      
    }
  }
  

  return newerroom;
};

//GAME OVER
var gameOver = function(cause){
  image.src = "assets/gameOver.png";
  roomText.innerHTML = "Your final score: " + score;
  actionText.innerHTML = "R.I.P <br>" + cause + "<br> Refresh for a new run.";
  gameover = 1;
  hp = 0;
  updateStats();
  actionBox.disabled = true;
};

var GROOL = function(length){
  grool += length;
  var groolHex = "0";
  if(place - 1 === grool){
    groolHex = "1"; 
  }
  else if(place - 2 === grool){
    groolHex = "2";
  }
  else if(place - 3 === grool){
    groolHex = "3";
  }
  else if(place - 4 === grool){
    groolHex = "4";
  }
  else if(place - 5 === grool){
    groolHex = "5";
  }
  else if(place - 6 === grool){
    groolHex = "6";
  }
  else if(place - 7 === grool){
    groolHex = "7";
  }
  else if(place - 8 === grool){
    groolHex = "8";
  }
  else if(place - 9 === grool){
    groolHex = "9";
  }
  else if(place - 10 === grool){
    groolHex = "A";
  }
  else if(place - 11 === grool){
    groolHex = "A";
  }
  else if(place - 12 === grool){
    groolHex = "A";
  }
  else if(place - 13 === grool){
    groolHex = "A";
  }
  else if(place - 14 === grool){
    groolHex = "A";
  }
  else if(place - 15 >= grool){
    groolHex = "A";
  }
  else if(place - 0 <= grool){
    groolHex = "0";
  }
  else{
    document.body.style.backgroundColor= "#000000";
  }
  console.log(groolHex);
  document.body.style.backgroundColor= "#"+groolHex+groolHex+groolHex+groolHex+groolHex+groolHex;
  if(grool >= place){
    actionText.innerHTML += "<br> YOU WERE EATEN BY THE GROOL";

  }
}

var updateStats = function(){
  if(hp >= maxhp){
    hp = maxhp;
  }
  if(hp <= 0){
    hp=0;
  }
  if(nrg >= maxnrg){
    nrg = maxnrg;
  }
  
  if(nrg <= 0){
    nrg = 0;
  }
  //STATUS BOX ~~Tells you whether you're alive or not, as well as a bunch of other things (score, energy, damage etc.)
  var status = document.getElementById("status");
  status.innerHTML = "HP: " + hp + "/" + maxhp + "<br> NRG: " + nrg + "/" + maxnrg + "<br> DMG: " + dmg + "<br> TRN: " + turn + "<br> SCORE: " + score;
  if(hp<= maxhp/2){
    status.style.backgroundColor = "#FF0000";
  }
  else{
    status.style.backgroundColor = "#00FF00";
  }
  if(hp === 0){
    document.body.style.backgroundColor= "#800000";
  }
};
//============UPDATE============  ~~Where the magic happens. All actions get received and scanned through here. good luck exploring through it.
var update = function(){
  
  
  
  //recieve action
  var updateAction = function(){
    var actionBox = document.getElementById("actionBox");
    action = document.getElementById("actionBox").value;
    document.getElementById("actionBox").value = null;
    return action;
  };
  
  //update room text
  var updateRoomText = function(){
    map.push(roomie.symbol);
    roomText.innerHTML = roomie.desc;
  };
  

  //decision making
  var decide = function(){
    switch(updateAction()){
      
      //wait action
      case "wait":
      case "rest":
      case "wa":
      case "WA":
      case "REST":
      case "Rest":
      case "WAIT":
      case "Wait":
        if(hp === maxhp && nrg === maxnrg && roomie.symbol !== "M" && amuletEnchantment !== "sleep"){
          actionText.innerHTML= "You wait for no apparent reason.";
          turn++;
          GROOL(1);
        }
        else if(hp === maxhp && nrg === maxnrg && roomie.symbol !== "M" && amuletEnchantment === "sleep"){
          actionText.innerHTML = "You fall into a deep sleep...";
          turn+= 5;
          GROOL(1);
        }
        else if(hp <= maxhp && nrg <= maxnrg && roomie.symbol !== "M" && amuletEnchantment === "sleep"){
          actionText.innerHTML = "You fall into a deep and relaxing sleep...";
          regen();
          regen();
          regen();
          turn+= 3;
          GROOL(3);
        }
        else if(roomie.symbol === 'M'){
          actionText.innerHTML = "You can't wait while there is a monster in front of you!";
        }
        else if(roomie.symbol === 'M' && amuletEnchantment === 'sleep'){
          actionText.innerHTML = "Your eyes are heavy, but you can't fall asleep now!";
        }
        else{
          actionText.innerHTML= "You wait, restoring your stats.";
          regen();
          turn++;
          GROOL(1);
        }
        break;
        
      //walk action
      case "walk":
      case "run":
      case "w":
      case "W":
      case "RUN":
      case "Run":
      case "Walk":
      case "WALK":

        //pit walk
        if(roomie.symbol === "P" || roomie.symbol === "G" || roomie.symbol === "S" || roomie.symbol === "J"){
          var choice = confirm("Are you sure you want to walk into the pit?");
          //spike pit
          if(choice === true && roomie.symbol === "S"){
            actionBox.disabled = true;
            image.src="assets/spike.png";
            console.log("died");
            actionText.innerHTML = "You fell in the pit, only to be met with a spiky doom!";
              if(revive === 1){
                amuletSave();
              }
              
              else{
                setTimeout(function(){
                  gameOver("You died from falling in a spike pit.");
                  console.log(gameover);
                },1000);
              }
          }
          //gold pit
          else if(choice === true && roomie.symbol === "G"){
            actionBox.disabled = true;
            image.src="assets/gold.png";
            console.log("collected gold");
            rand = randomNumber(11,10);
            score+=rand+scavenger;
            actionText.innerHTML = "You fell in the pit...<br> But some gold broke your fall! <br> Obtained $" + (rand+scavenger) + "!";
            setTimeout(function(){
              roomie = newroom();
              updateRoomText();
              actionText.innerHTML = "You crawl out of the pit.";
              turn ++;
              actionBox.disabled = false;
              actionBox.select();
            }, 3000);
            
          }
          //regular pit
          else if(choice === true && roomie.symbol === "P"){
            console.log("deep pit hit");
            fallDamage += randomNumber(5, 1); 
            actionText.innerHTML = "Ow! <br>You fell in a pit, and hurt yourself for " + fallDamage + " damage! <br> You crawl out of the pit. <br> Be more careful next time!";
            hp-=fallDamage;
            if(hp <= 0){
              if(revive === 1){
                      
                      amuletSave();

              }
              else{
                gameOver("You fell to your death!");
              }
            }
            else{

              turn ++;
              roomie = newroom();
              updateRoomText();
            }
          }
          //junk pit
          else if(choice === true && roomie.symbol === "J"){
            actionBox.disabled = true;
            image.src="assets/item.png";
            console.log("junk pile fall");
            var junkItem = randItem();
            actionText.innerHTML = "Oof! You fell on something.";
            setTimeout(function(){
              actionText.innerHTML = "You got " + junkItem.name + "! <br> <br> You crawled out the pit.";
              if(objectSpit === 1){
                actionText.innerHTML += "<br>You wiped off the spit.";
                objectSpit = 0;
              }
              items.push(junkItem);
              li = document.createElement("li");
              var node = document.createTextNode(junkItem.name);
              li.appendChild(node);
              invList.appendChild(li);
              turn ++;
              roomie = newroom();
              updateRoomText();
              actionBox.disabled = false;
              actionBox.select();
            },3000);
            actionBox.select();
            
          }
          //refuse walking into pit
          else{
            actionText.innerHTML = "You rethink your actions.";
            console.log("stepped back");
          }
        }

        //walking through monster
        else if(roomie.symbol === "M"){
          choice = confirm("Try to avoid the monster?");
          if(choice === true && roomie.name === "skeleton room"){
            rand = randomNumber(4,1);
            if(rand === 2){
              actionText.innerHTML = "You escaped the skeleton! <br> Guess he didn't have the guts to stop you.";
              console.log("escaped");
              roomie = newroom();
              updateRoomText();
              turn ++;
            }
            else{
              actionText.innerHTML = "The skeleton awkwardly blocks your way, and slashes you away for " + monster.dmg + " damage!";
              hp -= monster.dmg;
              GROOL(1);
              if(hp <=0){
                image.src = "assets/monster1win.png";
                actionBox.disabled = true;
                setTimeout(function(){
                  if(revive === 1){
                      
                      amuletSave();
                  }
                  else{
                    gameOver("A skeleton defeated you while you tried to leave. <br> How rude of you!");
                  }
                },2000);
              }
              
            }
          }
          else{
            actionText.innerHTML = "You stay put.";
          }
        }
        //walking - no obstacle
        else{
          actionText.innerHTML = "You move onward.";
          console.log("walked");
          roomie = newroom();
          updateRoomText();
          turn ++;
        }

        place++;
        break;
       
      //jump 
      case "J":
      case "j":
      case "skip":
      case "jump":
      case "leap":
      case "SKIP":
      case "Skip":
      case "LEAP":
      case "Leap":
      case "JUMP":
      case "Jump":
        //check for pit if energy available
        if(nrg >=2){
          if(roomie.symbol === "P" || roomie.symbol === "S" || roomie.symbol === "G" || roomie.symbol === "J"){
            console.log("jumped over pit");
            actionText.innerHTML = "You jump over the pit!";
            nrg-=2;
            turn ++;
            roomie = newroom();
            updateRoomText();
            GROOL(-2);
            
          }

          //monster jump attack
          else if(roomie.symbol === "M"){
            if(roomie.name === "skeleton room"){
              actionText.innerHTML = "You do an awesome jump kick...";
              console.log("jump kick");
              image.src = "assets/jumpkick.png";
              actionBox.disabled = true;

              rand = randomNumber(4,1);
              setTimeout(function(){

              if(rand === 2){
                actionBox.disabled = false;
                actionBox.select();
                actionText.innerHTML = "... and the skeleton shatters as you fly through!";
                console.log("succes skeleton jump kick");
                nrg-=4;
                updateStats();
                turn ++;
                place++;
                roomie = newroom();
                GROOL(-2);
                updateRoomText();
              }
              else{
                actionBox.disabled = false;
                actionBox.select();
                actionText.innerHTML = "... but the skeleton slashes you back down, making you take " + (monster.dmg+3) + " damage!";
                image.src = "assets/monster1.png";
                hp -= monster.dmg + 3;
                if(hp<=0){
                  actionBox.disabled = true;
                  image.src = "assets/monster1win.png";
                  setTimeout(function(){
                    if(revive === 1){
                      
                      amuletSave();
                    }
                    else{
                      gameOver("You tried to look cool, but a skeleton embarrassed you.");
                    }
                  },2000);
                }
                nrg -=4;
                turn++;
                updateStats();
                GROOL(1);
                
              }

              },2000);
            }
          }
          //no pit
          else{
            actionText.innerHTML = "You jump!";
            console.log("jumped");
            nrg-=2;
            turn ++;
            roomie = newroom();
            updateRoomText();
            updateStats();
            GROOL(-2);
          }
        }
        //tried jump, no energy
        else{
          console.log("tried jump");
          actionText.innerHTML = "You tried to jump, <br> but you don't have any energy.";
        }
        place++;
        break;
      
      //search
      case "s":
      case "search":
      case "SEARCH":
      case "Search":
      case "S":
        rand = randomNumber(searchRand, 1);
        //find something
        if(rand === 1){
          //if searching regular room
          if(roomie.symbol === "O"){
            //grafitti
            if(roomie.name === "graffiti"){
              actionText.innerHTML = "Hey! There's something written on the wall here. It says:<br>" + roomie.graffiti;
            }
            //no grafitti
            else{
              actionText.innerHTML = "Nothing of interest here.";  
            }
            
          }
          //entrance search
          else if(map[place] === "E"){
            actionText.innerHTML = "You take one good look at the doors.";
          }
          //normal pit search
          else if(roomie.symbol === "P"){
            actionText.innerHTML = "The pit looks really dark.";
          }
          //spike pit search
          else if(roomie.symbol === "S"){
            actionText.innerHTML = "The pit looks really dark.";
          }
          //gold pit search
          else if(roomie.symbol === "G"){
            actionText.innerHTML = "The pit looks really dark...<br> Hey, wait a second! That looked like a little sparkle!";
          }
          //junk pit search
          else if(roomie.symbol === "J"){
            actionText.innerHTML = "Some words on the wall read 'Garbage dump'.";
          }
          //monster search
          else if(roomie.symbol === "M"){
            actionText.innerHTML = "The " + monster.name + ":<br>" + "HP: " + monster.hp + "<br>" + "DMG: " + monster.dmg;
          }
          //shop search
          else if(roomie.symbol === "$"){
            actionText.innerHTML = "A shop in the middle of the corridor.";
          }
          //unknown search
          else{
            actionText.innerHTML = "What... is this?";
          }
        }
        //miss search
        else{
          //miss search in monster room
          if(roomie.symbol === "M"){
            console.log("miss monster search");
            actionText.innerHTML = "You don't notice anything about the monster.";
          }
          else{
            console.log("miss search");
            actionText.innerHTML = "You don't notice anything.";
          }
        }
        turn++;
        GROOL(1);
        break;
      
      //spit action
      case "sp":
      case "spit":
      case "SP":
      case "Spit":
      case "SPIT":
        //if you have required number of spit
        if(spit > 0){
          //regular room spit
          if(roomie.symbol === "O"){
            actionText.innerHTML = "*spitooie* <br> Looks like it hit the floor with a splat. <br><br> Gross.";
          }
          //regular pit spit
          else if(roomie.symbol === "P"){
              actionText.innerHTML = "*plop* <br> Sounded like it hit the floor pretty hard.";
          }
          //spike pit spit
          else if(roomie.symbol === "G" || roomie.symbol === "S"){
              actionText.innerHTML = "*plink* <br> Sounded like it hit metal.";
          }
          //junk pit spit
          else if(roomie.symbol === "J"){
              actionText.innerHTML = "*peck* <br> Sounds like it hit some sort of object.";
              objectSpit = 1;
          }
          //monster spit
          else if(roomie.symbol === "M"){
            if(roomie.name === "skeleton room"){
              actionText.innerHTML = "*splat* <br> The skeleton looks sad.";
            }
          }
          //shop spit
          else if(roomie.symbol === "$"){
            actionText.innerHTML = "'Oi! Watch where you're spitting!'";
          }
          //unknown spit
          else{
            actionText.innerHTML = "*spoo* <br> That was unethical...";
          }  
          spit-=1;
          turn++;
          GROOL(1);
        }
        //no spit left
        else{
          spit = 0;
          actionText.innerHTML = "*ppt* <br> Ugh. You can't do it anymore.";
        }
        
        break;
        
      //use action
      case "use":
      case "Use":
      case "u":
      case "USE":
      case "U":
        var i = 0;

        //if no items to use in inventory
        if(items.length === 0){
              alert("You don't have anything!");
        }

        //if items in inventory to use
        else{
          actionText.innerHTML = "Use what?";
            var use = prompt("Use what item? ('exit' to leave prompt)");

            //if using water
            if(use === 'water'){
              for(i=0; i<items.length; i++){
                if(items[i].name === 'water'){
                  actionText.innerHTML = "You drink the water. <br> <br> <br> Tasty!";
                  spit+=3;
                  hp+=2;
                  items[i].fill -=1;
                  //water runs out
                  if(items[i].fill <=0){
                    alert("This water ran out!");
                    items.splice(i, 1);
                    invList.removeChild(invList.childNodes[i+1]);
                  }
                  return;
                }
              }
            }
            // if using glasses
            else if(use === 'glasses'){
              for(i=0; i<items.length; i++){
                if(items[i].name === 'glasses'){
                  actionText.innerHTML = "You put on the glasses. <br> <br> You are so observant!";
                  searchRand = 1;
                  items.splice(i, 1);
                  invList.removeChild(invList.childNodes[i+1]);
                  return;
                }
              }
            }
            else if(use === 'amulet'){
              for(i=0; i<items.length; i++){
                if(items[i].name === 'amulet'){
                  actionText.innerHTML = "You put on the amulet.";
                  rand = randomNumber(3,1);
                  if(rand === 1){
                    items[i].enchantment = "life saving";
                    actionText.innerHTML += "<br> You feel protected.";
                    revive = 1;
                    amuletEnchantment = "life saving";
                  }
                  else if(rand === 2){
                    items[i].enchantment = "reflection";
                    actionText.innerHTML += "<br> Shiny!";
                    amuletEnchantment = "reflection";

                  }
                  else if(rand === 3){
                    items[i].enchantment = "sleep";
                    actionText.innerHTML += "<br> You feel tired...!";
                    amuletEnchantment = "sleep";
                  }
                  else{
                    items[i].enchantment = "gold";
                    actionText.innerHTML += "<br> You feel greedy.";
                    scavenger += 20;
                    amuletEnchantment = "gold";
                  }
                  items.splice(i, 1);
                  invList.removeChild(invList.childNodes[i+1]);
                  return;
                }
              }
            }
            else if(use === 'punching glove'){
              for(i=0; i<items.length; i++){
                if(items[i].name === 'punching glove'){
                  actionText.innerHTML = "You put on the gloves. You can really pack a punch!";
                  dmg += 2;
                  updateStats();
                  items.splice(i, 1);
                  invList.removeChild(invList.childNodes[i+1]);
                  return;
                }
              }
            }
            else if(use === 'hourglass'){
              for(i=0; i<items.length; i++){
                if(items[i].name === 'hourglass'){
                  actionText.innerHTML = "The hourglass turns over. <br> The corridor extends!";
                  lastRoom += items[i].extend;
                  items.splice(i, 1);
                  invList.removeChild(invList.childNodes[i+1]);
                  return;
                }
              }
            }
            else if(use === 'potion'){
              for(i=0; i<items.length; i++){
                if(items[i].name === 'potion'){
                  actionText.innerHTML = "You drink the potion... <br>";
                  if(items[i].effect === 1){
                    actionText.innerHTML += "Tastes great! It must have been a potion of healing!";
                    hp = maxhp;
                    updateStats();
                  }
                  else if(items[i].effect === 2){
                    actionText.innerHTML += "Bleeech! Tastes like poison!";
                    hp -= 5;
                    if(hp<=0){
                      actionBox.disabled = true;
                      setTimeout(function(){
                        if(revive === 1){
                      
                          amuletSave();
                        }
                        else{
                          gameOver("You poisoned yourself!");
                        }
                      },2000);

                    }
                  }
                  else if(items[i].effect === 3){
                    actionText.innerHTML += "You feel mighty! Must have been a potion of strength!";
                    dmg += 1;
                    updateStats();
                  }
                  else if(items[i].effect === 4){
                    actionText.innerHTML += "You feel really healthy! You're larger than life!";
                    maxhp += 5;
                  }
                  else if(items[i].effect === 5){
                    actionText.innerHTML += "You feel rich!";
                    score += 20;
                  }
                  else{
                    actionText.innerHTML += "Nothing happens!";
                  }
                  spit += 5;
                  items.splice(i, 1);
                  invList.removeChild(invList.childNodes[i+1]);
                  return;
                }
              }
            }
            else if(use === 'medkit'){
              for(i=0; i<items.length; i++){
                if(items[i].name === 'medkit'){
                  actionText.innerHTML = "You heal up. You feel super!";
                  maxhp += items[i].health;
                  hp = maxhp;
                  updateStats();
                  items.splice(i, 1);
                  invList.removeChild(invList.childNodes[i+1]);
                  return;
                }
              }
            }
            else if(use === 'flashlight'){
              for(i=0; i<items.length; i++){
                if(items[i].name === 'flashlight'){
                  actionText.innerHTML = "You use the flashlight. <br> The darkness behind you backs up!";
                  GROOL(items[i].power);
                  updateStats();
                  items.splice(i, 1);
                  invList.removeChild(invList.childNodes[i+1]);
                  return;
                }
              }
            }
            //unknown item usage
            else{
              alert("Never heard of it.");
            } 
        }
            
          break;
        //fight action
        case "fight":
        case "Fight":
        case "FIGHT":
        case "f":
        case "F":
          if(roomie.symbol === "M"){
            if(roomie.name === "skeleton room"){
              actionBox.disabled = true;
              image.src = "assets/pow.png";
              
              setTimeout(function(){
                image.src = "assets/monster1.png";  
                actionBox.disabled = false;
                actionBox.select();
                actionText.innerHTML = "You deal " + dmg + " damage to the skeleton!" + "<br>---------------------------<br> The skeleton does " + monster.dmg + " damage to you in return!";
                monster.hp -= dmg;
                hp -= monster.dmg;
                turn++;
                GROOL(1);
                updateStats();
                
                if(hp <=0){
                  actionBox.disabled = true;
                  image.src = "assets/monster1win.png";
                  actionText.innerHTML = "Fatal damage! <br>You black out...";
                  setTimeout(function(){
                    if(revive === 1){
                      
                      amuletSave();
                    }
                    else{
                      gameOver("A skeleton has slain you."); 
                    }
                  }, 3000);
                }
                else if(monster.hp <= 0){
                  rand = randomNumber(10, 1);
                  image.src = "assets/monster1lose.png";
                  actionText.innerHTML = "You won the fight! <br> +"+ (rand + scavenger) +" gold!";
                  score += rand+scavenger;
                  actionBox.disabled = true;
                  setTimeout(function(){
                    rand = randomNumber(5,1);
                    if(rand === 1){
                      var lootItem = randItem();
                      actionText.innerHTML = "You found a " + lootItem.name + " in the pile of bones! <br> You continue.";
                      items.push(lootItem);
                      li = document.createElement("li");
                      var node = document.createTextNode(lootItem.name);
                      li.appendChild(node);
                      invList.appendChild(li);

                    }
                    else{
                      actionText.innerHTML = "You found nothing in the bone pile. <br> You continue.";
                    }
                    actionBox.disabled = false;
                    actionBox.select();
                    roomie = newroom();
                    updateRoomText();
                    updateStats();
                    turn++;
                    place++;
                    updateStats();

                  }, 1000);
                }
              }, 1000);
              
            }
          }
          else if(roomie.symbol === "$"){
            actionText.innerHTML = "'Hey! You wanna tussle or what? Yeah, I thought so.'";
          }
          else{
            actionText.innerHTML = "There's nothing to fight here.";
          }
          break;
        //pay action
        case "pay":
        case "p":
        case "PAY":
        case "P":
        case "Pay":
          if(roomie.symbol === "$" && payed === 0){
            alert("Welcome! Today we have " + shopItem.name + " on sale for only " + shopItem.worth + " gold!"); //announce to the player what is on sale
            sell = confirm("Are you interested?");
            if(sell === true && score >= shopItem.worth && payed === 0){
              actionText.innerHTML = "'Thank you for your payment!'' <br> <br> -"+ shopItem.worth + " gold";
              
              score-=shopItem.worth;
              items.push(shopItem);
              li = document.createElement("li");
              var node = document.createTextNode(shopItem.name);
              li.appendChild(node);
              invList.appendChild(li);

              payed = 1;
            }
            else if(sell === true && score < shopItem.worth){
              actionText.innerHTML = "'Thank you for-- Hey, wait a sec! You're broke! <br> Come back when you're not so poor!'";
            }
            else if(payed === 1){
              actionText.innerHTML = "'I got nothing else. Go see the guy up ahead. If there even is a guy up ahead. <br> Why are there so many shops here?'";
            }
            else{
              actionText.innerHTML = "'Get outta here, then! You're scaring away my customers.'";
            }
          }
          else{
            actionText.innerHTML = "There is no shop to pay.";
          }
          break;
        
        
        //********************** HELP SCREEN **********************
      //help
      case "h":                
      case "help":
      case "HELP":
      case "Help":
        //open help
        var helpScreen = function(){
          actionText.innerHTML = "Displaying help.";
          
          var askHelp = function(){
            var advice = prompt("What would you like to learn more about? (HP, NRG, etc.)");
            return advice;
          };
          
          switch(askHelp()){
            //help hp
            case "hp":
            case "HP":
              actionText.innerHTML = "HP is your health. When it reaches 0, you die. Saying 'wait' will restore it by 1 point.";
              break;
            //help energy
            case "nrg":
            case "energy":
            case "ENERGY":
            case "NRG":
              actionText.innerHTML = "NRG is your energy. When it reaches 0, you can't perform certain actions. Waiting restores this by 2 points.";
              break;
            //help turn
            case "trn":
            case "turn":
            case "TRN":
            case "Turn":
              actionText.innerHTML = "These are the number of turns that have passed. A turn only applies when you perform an action, or time advances.";
              break;
            //help damage
            case"dmg":
            case"DMG":
            case"Damage":
            case"damage":
            case"DAMAGE":
              actionText.innerHTML = "Damage is the amount that affects the enemy's hp during a fight. The higher it is, the more damage you do, and the faster the enemy will die.";
              break;
            //help damage
            case"score":
            case"SCORE":
            case"Score":
            case"Gold":
            case"GOLD":
            case"gold":
            case"$":
              actionText.innerHTML = "This is your score, counted with money. <br> Try to get as much as you can before you leave the corridor!.";
              break;
            //help walk
            case "walk":
            case "w":
            case "WALK":
            case "Walk":
              actionText.innerHTML = "Walking: Walking uses up a turn and continues you to the next segment of the corridor. Can also be used with 'w'.";
              break;
            //help jump
            case "jump":
            case "j":
            case "JUMP":
            case "Jump":
              actionText.innerHTML = "Jumping: Jumping uses up a turn and 2 of your energy, but can skip over some traps. Use 'wait' to regain energy. Can also be used with 'j'.";
              break;
            //help search
            case "search":
            case "s":
            case "Search":
            case "S":
            case "SEARCH":
              actionText.innerHTML = "Searching allows you to look for clues in a segment. It takes up one turn. 's' can be used as well.";
              break;
            
            //help use
            case "use":
            case "u":
            case "Use":
            case "USE":
            case "U":
              actionText.innerHTML = "Using things in your inventory can help you on your quest. <br> Type the object you wish to use in the popup box. <br> Some items are consumed immediately.";
              break;
            
            case "fight":
            case "f":
            case "Fight":
            case "FIGHT":
            case "F":
              actionText.innerHTML = "Fight a monster in front of you equal to your damage, as well as take the monster's damage.";
              break;

            case "p":
            case "pay":
            case "PAY":
            case "Pay":
            case "P":
              actionText.innerHTML = "Finds out what the shop is selling as well as confirms the purchase.";
              break;

            //exit help
            default:
              actionText.innerHTML = "Exiting help. <br> Type your action below. <br> Type 'h' or 'help' to get back to the help screen.";
          }
            
        };
        helpScreen();
        break;
      //unkown action overall
      default:
        console.log("misunderstood");
        actionText.innerHTML = "Sorry, didn't quite get that. <br> Press 'h' for help.";
        gameover=0;
        arrow.src="assets/arrowRed.png";
        miss = 1;
        break;
    }
  };
  if(gameover === 0){
    decide();
    updateStats();
    if(miss === 0){
      arrow.src="assets/arrowGreen.png";
      setTimeout(arrowColor,300);
    }
    else{
      miss = 0;
    }

  }
};

if(gameover === 0){
  update();
}
actionText.innerHTML = "Welcome, adventurer! <br> Enter your action below. <br> Type 'h' or 'help' for assistance.";
image.src = "assets/entrance.png";
arrow.src="assets/arrowYellow.png";
GROOL(0);