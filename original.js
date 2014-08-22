//THE LONG CORRIDOR ROUGELIKE-LIKE

//Gameplay Elements
var hp = 15;
var maxhp = 15;
var nrg = 10;
var maxnrg = 10;
var dmg = 3;
var turn = 0;
var score = 120;
var gameover = 0;
var fallDamage = 0;
var spit = 5;
var searchRand = 10;
var shopItem = "";
var amuletGet = 0; //We only want one amulet to exist in one game.
var revive = 0;
var enchantment = ""; //Amulet enchantment

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

var randItem = function(){
  var itemGet = "";
  rand = randomNumber(3,1);
  if(rand === 1){
    itemGet = new item('water', 5);
    itemGet.fill = randomNumber(5,1);
  }
  else if(rand === 2){
    itemGet = new item('magnifying glass', 10);
  }
  else if(rand === 3 && amuletGet === 0){
    itemGet = new item('amulet', 15);
    itemGet.enchantment = randomNumber(2,1);
    if(itemGet.enchantment === 1){
      itemGet.enchantment = "life saving";
      enchantment = "life saving";
      revive = 1;

    }
    else{
      itemGet.enchantment = "strangling";
      enchantment = "strangling";
    }
    amuletGet = 1; // Saying "Hey, an amulet exists, don't give me any more!"
  }
  else if(rand === 3 && amuletGet === 1){
    itemGet = new item('punching glove', 10);
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
  var newerroom = new room(null, null, null); // 3 types of rooms: pits, corridors & monsters
  
  //ENDING ~~ Thats it! Its over! This is where the game ends. 
  if(map.length >= 20){ //If you have covered 20 or more tiles, end the game.
    actionBox.disabled = true;
    newerroom = exit; //The new room will always be an exit room.
    image.src = "assets/end.png";
    actionText.innerHTML = "Congratulations!";
    score +=100;
    setTimeout(function(){
      image.src = "assets/endscreen.png";
      actionText.innerHTML = "Your final score: " + score;
      if(score > 170){
        alert("Wow! You beat John's high score! Congrats!");
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
  /*if(hp <= 0){ ~~Uncomment for strange results! Originally a test for default losses.
    hp = 0;
    gameOver("You died of mysterious causes!");
  } */
  if(nrg <= 0){
    nrg = 0;
  }

  if(amuletGet === 1 && enchantment === "strangling"){

    hp-=2;
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
        console.log("waited");
        if(hp === maxhp && nrg === maxnrg && roomie.symbol !== "M"){
          actionText.innerHTML= "You wait for no apparent reason.";
          regen();
          turn++;
        }
        else if(roomie.symbol === 'M'){
          actionText.innerHTML = "You can't wait while there is a monster in front of you!";
        }
        else{
          actionText.innerHTML= "You wait, restoring your stats.";
          regen();
          turn++;
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
            setTimeout(function(){ //Life saving
              if(revive === 1){
                i = 0;
                actionText.innerHTML = "Your amulet shatters, and you are brought back to life! What a miracle!";
                image.src = "assets/revive.png";
                roomie = newroom();
                updateRoomText();
                hp = maxhp;
                nrg = maxnrg;
                turn ++;
                revive = 0;
                actionBox.disabled = false;
                actionBox.select();
                for(i=0; i<items.length; i++){
                if(items[i].name === 'amulet'){
                  items.splice(i, 1);
                  invList.removeChild(invList.childNodes[i+1]);
                }
              }

              }
              else{
                setTimeout(function(){
                  gameOver("You died from falling in a spike pit.");
                  console.log(gameover);
                },1000);
              }
            }, 2000);
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
              actionBox.select();
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
              hp -= rand;
              if(hp <=0){
                image.src = "assets/monster1win.png";
                actionBox.disabled = true;
                setTimeout(function(){
                  gameOver("A skeleton defeated you while you tried to leave. <br> How rude of you!");
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
                    gameOver("You tried to look cool, but a skeleton embarrassed you.");
                  },2000);
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
          //shop search
          else if(roomie.symbol === "$"){
            actionText.innerHTML = "A shop in the middle of the corridor. I wonder how business is going?";
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
      
      //spit action
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
                actionText.innerHTML = "You deal " + dmg + " damage to the skeleton!" + "<br>------<br> The skeleton does " + monster.dmg + " damage to you in return!";
                monster.hp -= dmg;
                hp -= monster.dmg;
                turn++;
                updateStats();
                
                if(hp <=0){
                  actionBox.disabled = true;
                  image.src = "assets/monster1win.png";
                  actionText.innerHTML = "Fatal damage! <br>You die...";
                  setTimeout(function(){
                    gameOver("A skeleton has slain you."); 

                  }, 3000);
                }
                else if(monster.hp <= 0){
                  rand = randomNumber(10, 1);
                  image.src = "assets/monster1lose.png";
                  actionText.innerHTML = "You won the fight! <br> +"+ rand +" gold!";
                  score += rand;
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
            actionText.innerHTML = "You fight your inner conscious. <br> Just kidding. There's nothing to fight here.";
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
              actionText.innerHTML = "Thank you for your payment! <br> <br> -"+ shopItem.worth + " gold";
              
              score-=shopItem.worth;
              items.push(shopItem);
              li = document.createElement("li");
              var node = document.createTextNode(shopItem.name);
              li.appendChild(node);
              invList.appendChild(li);

              payed = 1;
            }
            else if(sell === true && score < shopItem.worth){
              actionText.innerHTML = "Thank you for-- Hey, wait a sec! You're broke! <br> Come back when you're not so poor!";
            }
            else if(payed === 1){
              actionText.innerHTML = "I got nothing else. Go see the guy up ahead. If there even is a guy up ahead. <br> Why are there so many shops here?";
            }
            else{
              actionText.innerHTML = "Get outta here, then! You're scaring away my customers.";
            }
          }
          else if(payed === 1){
              actionText.innerHTML = "I got nothing else. Scram.";
            }
          else{
            actionText.innerHTML = "You will pay for wasting my time!<br><br>...There is no shop to pay.";
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
            
            case "fight":
            case "f":
            case "Fight":
            case "FIGHT":
            case "F":
              actionText.innerHTML = "Fight a monster in front of you equal to your damage, as well as take the monster's damage.";
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