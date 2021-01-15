//Create variables here
var dogImage1, dogImage2;
var database;
var dog;
var food,foodStock;
var lastFed,fedTime;
var foodObj;
var feed, addFood;
var bedroom,washroom,garden;
var readState;
var gameState;

function preload()
{
  //load images here
  dogImage1 = loadImage("images/dogImg.png");
  dogImage2 = loadImage("images/dogImg1.png");
  bedroom = loadImage("images/Bed Room.png");
  washroom = loadImage("images/Wash Room.png");
  garden = loadImage("images/Garden.png");
}

function setup() {
  createCanvas(1000, 700);
  
  database = firebase.database();

  foodObj = new Food();

  foodStock = database.ref('Food');
  foodStock.on("value",readStock);

  fedTime = database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed = data.val();
  })

  readState = database.ref('gameState');
  readState.on("value",function(data){
    gameState = data.val();
  })

  dog = createSprite(800,350,100,100);
  dog.addImage(dogImage1);
  dog.scale = 0.15;

  feed = createButton("Feed the Dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  addFood = createButton("Add Food");
  addFood.position(850,95);
  addFood.mousePressed(addFoods);
}


function draw() {  
  background(46,139,87);

  currentTime = hour();

  if(currentTime == (lastFed+1))
  {
    update("Playing");
    foodObj.garden();
  }
  else if(currentTime == (lastFed+2))
  {
    update("Sleeping");
    foodObj.bedroom();
  }
  else if(currentTime > (lastFed+2) && currentTime <= (lastFed+4))
  {
    update("Bathing");
    foodObj.washroom();
  }
  else
  {
    update("Hungry");
    foodObj.display();
  }

  if(gameState !== "Hungry")
  {
    feed.hide();
    addFood.hide();
    dog.remove();
  }
  else
  {
    feed.show();
    addFood.show();
    dog.addImage(dogImage1);
  }


  drawSprites();
}

function readStock(data)
{
  food = data.val();
  foodObj.updateFoodStock(food);
}

function feedDog()
{
  dog.addImage(dogImage2);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref("/").update({
    Food : foodObj.getFoodStock(),
    FeedTime : hour(),
    gameState : "Hungry"
  })
}

function addFoods()
{
  food ++;
  database.ref("/").update({
    Food : food
  })
}

function update(state)
{
  database.ref('/').update({
    gameState : state
  })
}