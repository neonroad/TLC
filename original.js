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

//Misc.
var arrow = document.getElementById("arrow");
var arrowColor = function(){
  arrow.src="assets/arrowYellow.png";
  console.log("changed");
}

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
item = function(name){
  this.name = name;
};

var randItem = function(){
  var itemGet = "";
  rand = randomNumber(2,1);
  if(rand === 1){
    itemGet = new item('water');
    itemGet.fill = randomNumber(5,1);
  }
  else if(rand === 2){
    itemGet = new item('magnifying glass');
  }
  return itemGet;
};

//Action
var action = "";

//Room List
var map = [];
var place = 0; //Current place where the player is

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

//Room Text
var roomText = document.getElementById("text");
roomText.innerHTML = entrance.desc;

//Action Text
var actionText = document.getElementById("response");
actionText.innerHTML = "Type your action below. <br> Press 'h' for help.";

//New Room
var newroom = function(){
  var newerroom = new room(null, null, null); // 3 types of rooms: pits, corridors & monsters
  
  //random room generation
  var rand = randomNumber(3,1);
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

  else{
    //graffiti generation
    rand = randomNumber(10, 1);
    if(rand === 4){
      newerroom = new room("graffiti", null, "O");
      newerroom.desc = "A normal segment of the corridor.";
      rand = randomNumber(10, 1);
      if(rand === 1){
        newerroom.graffiti = "They call him John..";
      }
      else if(rand === 2){
        newerroom.graffiti = "Spitting really does help, they say...";
      }
      else if(rand === 3){
        newerroom.graffiti = "Why do people hide gold in pits?";
      }
      else if(rand === 4){
        newerroom.graffiti = "I heard that there are only about 20 segments in usual corridors...";
      }
      else{
        newerroom.graffiti = "sos";
      }
    }
    //normal room generation
    else{
      newerroom = new room("normal", null, "O");
      newerroom.desc = "A normal segment of the corridor.";  
    }
    image.src = "assets/normal.png";
    
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
  /*if(hp <= 0){
    hp = 0;
    gameOver("You died of mysterious causes!");
  } */
  if(nrg <= 0){
    nrg = 0;
  }
  var status = document.getElementById("status");
  status.innerHTML = "HP: " + hp + "/" + maxhp + "<br> NRG: " + nrg + "/" + maxnrg + "<br> DMG: " + dmg + "<br> TRN: " + turn + "<br> SCORE: " + score;
};
//============UPDATE============
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
      
      //wait
      case "wait":
      case "rest":
      case "wa":
      case "WA":
      case "REST":
      case "Rest":
      case "WAIT":
      case "Wait":
        console.log("waited");
        if(hp === maxhp && nrg === maxnrg){
          actionText.innerHTML= "You wait for no apparent reason.";
        }
        else{
          actionText.innerHTML= "You wait, restoring your stats.";
        }
        regen();
        turn++;
        break;
        
      //walk  
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
            setTimeout(function(){
              gameOver("You died from falling in a spike pit.");
              console.log(gameover);
            },5000);
          }
          //gold pit
          else if(choice === true && roomie.symbol === "G"){
            actionBox.disabled = true;
            image.src="assets/gold.png";
            console.log("collected gold");
            rand = randomNumber(11,10);
            score+=rand;
            actionText.innerHTML = "You fell in the pit...<br> But some gold broke your fall! <br> Obtained $" + rand + "!";
            setTimeout(function(){
              roomie = newroom();
              updateRoomText();
              actionText.innerHTML = "You crawl out of the pit.";
              turn ++;
              actionBox.disabled = false;
            }, 3000);
            
          }
          //regular pit
          else if(choice === true && roomie.symbol === "P"){
            console.log("deep pit hit");
            fallDamage = randomNumber(5, 1); 
            actionText.innerHTML = "Ow! <br>You fell in a pit, and hurt yourself for " + fallDamage + " damage! <br> You crawl out of the pit. <br> Be more careful next time!";
            hp-=fallDamage;
            if(hp <= 0){
              gameOver("You fell to your death!");
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
                actionText.innerHTML = "You got " + junkItem.name + "! <br><br> You wiped the spit off. <br> You crawled out the pit.";
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
            },3000);
            
            
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
              actionText.innerHTML = "You escaped the skeleton! <br> Guess he didn't have the guts to stop you."
              console.log("escaped");
              roomie = newroom();
              updateRoomText();
              turn ++;
            }
            else{
              actionText.innerHTML = "The skeleton awkwardly blocks your way, and slashes you away for " + monster.dmg + " damage!";
              hp -= rand;
              if(hp <=0){
                gameOver("A skeleton defeated you while you rudely tried to leave.");
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
            
          }

          //monster jump attack
          else if(roomie.symbol === "M"){
            if(roomie.name = "skeleton room"){
              actionText.innerHTML = "You do an awesome jump kick...";
              console.log("jump kick");
              image.src = "assets/jumpkick.png";

              rand = randomNumber(4,1);
              setTimeout(function(){

              if(rand === 2){
                actionText.innerHTML = "... and the skeleton shatters as you fly through!";
                console.log("succes skeleton jump kick");
                nrg-=4;
                updateStats();
                turn ++;
                roomie = newroom();
                updateRoomText();
              }
              else{
                actionText.innerHTML = "... but the skeleton slashes you back down, making you take " + (monster.dmg+3) + " damage!";
                image.src = "assets/monster1.png";
                hp -= monster.dmg + 3;
                if(hp<=0){
                  actionBox.disabled = true;
                  image.src = "assets/monster1win.png";
                  setTimeout(function(){
                    gameOver("You tried to look cool, but a skeleton embarrassed you.");
                  },2000)
                }
                nrg -=4;
                turn++;
                updateStats();
                
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
          console.log("found");
          //if searching regular room
          if(roomie.symbol === "O"){
            //grafitti
            if(roomie.name === "graffiti"){
              actionText.innerHTML = "Hey! There's something written on the wall here. It says:<br>" + roomie.graffiti;
            }
            //no grafitti
            else{
              actionText.innerHTML = "You notice how long the corridor really is.";  
            }
            
          }
          //entrance search
          else if(map[place] === "E"){
            actionText.innerHTML = "Heck, this is only the beginning!";
          }
          //normal pit search
          else if(roomie.symbol === "P"){
            actionText.innerHTML = "It looks really dark. <br> You wonder how far down a bottomless pit really is.";
          }
          //spike pit search
          else if(roomie.symbol === "S"){
            actionText.innerHTML = "It looks really dark. <br> You wonder how far down a bottomless pit really is.";
          }
          //gold pit search
          else if(roomie.symbol === "G"){
            actionText.innerHTML = "It looks really dark. <br> You wonder how far down... hey, wait a second! That looked like a little sparkle!";
          }
          //junk pit search
          else if(roomie.symbol === "J"){
            actionText.innerHTML = "Some words on the wall read 'Garbage dump'.";
          }
          //monster search
          else if(roomie.symbol === "M"){
            actionText.innerHTML = "The " + monster.name + ":<br>" + "HP: " + monster.hp + "<br>" + "DMG: " + monster.dmg;
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
        break;
      
      //spit
      case "sp":
      case "spit":
      case "SP":
      case "Spit":
      case "SPIT":
        console.log("spit");
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
            if(roomie.name = "skeleton room"){
              actionText.innerHTML = "*splat* <br> The skeleton looks sad.";
            }
          }
          //unknown spit
          else{
            actionText.innerHTML = "*spoo* <br> That was unethical...";
          }  
          spit-=1;
          turn++;
        }
        //no spit left
        else{
          spit = 0;
          actionText.innerHTML = "*ppt* <br> Ugh. You can't do it anymore.";
        }
        
        break;
        
      //use
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
            // if using magnifying glass
            else if(use === 'magnifying glass'){
              for(i=0; i<items.length; i++){
                if(items[i].name === 'magnifying glass'){
                  actionText.innerHTML = "You use the magnifying glass. <br> <br> You are so observant!";
                  searchRand = 1;
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
        //fight
        case "fight":
        case "Fight":
        case "FIGHT":
        case "f":
        case "F":
          if(roomie.symbol === "M"){
            if(roomie.name = "skeleton room"){
              actionText.innerHTML
              turn++;
              updateStats();
            }
          }
          else{
            actionText.innerHTML = "You fight your inner conscious. <br> Just kidding. There's nothing to fight here."
          }
          break;
        
        
        //********************** HELP SCREEN **********************
      //help
      case "h":                
      case "help":
      case "HELP":
      case "Help":
        //open help
        console.log("Help screen");
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
              console.log("asked for hp");
              actionText.innerHTML = "HP is your health. When it reaches 0, you die. Saying 'wait' will restore it by 1 pts.";
              break;
            //help energy
            case "nrg":
            case "energy":
            case "ENERGY":
            case "NRG":
              console.log("asked for nrg");
              actionText.innerHTML = "NRG is your energy. When it reaches 0, you can't perform certain actions. Waiting restores this by 2 points.";
              break;
            //help turn
            case "trn":
            case "turn":
            case "TRN":
            case "Turn":
              console.log("asked about turn");
              actionText.innerHTML = "These are the number of turns that have passed. A turn only applies when you perform an action, or time advances.";
              break;
            //help damage
            case"dmg":
            case"DMG":
            case"Damage":
            case"damage":
            case"DAMAGE":
              console.log("asked about damage");
              actionText.innerHTML = "Damage is the amount that affects the enemy's hp. The higher it is, the more damage you do.";
              break;
            //help damage
            case"score":
            case"SCORE":
            case"Score":
            case"Gold":
            case"GOLD":
            case"gold":
            case"$":
              console.log("asked about score");
              actionText.innerHTML = "This is your score, counted with money. <br> Try to get the most before you leave the corridor!.";
              break;
            //help walk
            case "walk":
            case "w":
            case "WALK":
            case "Walk":
              console.log("asked about walking.");
              actionText.innerHTML = "Walking: Walking uses up a turn and continues you to the next segment of the corridor. Can also be used with 'w'.";
              break;
            //help jump
            case "jump":
            case "j":
            case "JUMP":
            case "Jump":
              console.log("asked about jumping");
              actionText.innerHTML = "Jumping: Jumping uses up a turn and 2 of your energy, but can skip over some traps. Use 'wait' to regain energy. Can also be used with 'j'.";
              break;
            //help search
            case "search":
            case "s":
            case "Search":
            case "S":
            case "SEARCH":
              console.log("asked about searching");
              actionText.innerHTML = "Searching allows you to look for clues in a segment. It takes up one turn. 's' can be used as well.";
              break;
            
            //help use
            case "use":
            case "u":
            case "Use":
            case "USE":
            case "U":
              console.log("asked about using");
              actionText.innerHTML = "Using things in your inventory can help you on your quest. <br> Type the object you wish to use in the popup box. <br> Some items are consumed immediately.";
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
        arrow.src="assets/arrowRed.png"
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