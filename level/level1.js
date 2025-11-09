const level1 = new Level(
  [
    new chicken(),
    new chicken(),
    new chicken(),
    new chicken(),
    new chicken(),
    new Endboss()
  ],

  [
    new Cloud()
  ],

  [
    new Backround('img/5_background/layers/air.png', -719),
    new Backround('img/5_background/layers/3_third_layer/2.png', -719),
    new Backround('img/5_background/layers/2_second_layer/2.png', -719),
    new Backround('img/5_background/layers/1_first_layer/2.png', -719),
    new Backround('img/5_background/layers/air.png', 0),
    new Backround('img/5_background/layers/3_third_layer/1.png', 0),
    new Backround('img/5_background/layers/2_second_layer/1.png', 0),
    new Backround('img/5_background/layers/1_first_layer/1.png', 0),
    new Backround('img/5_background/layers/air.png', 719),
    new Backround('img/5_background/layers/3_third_layer/2.png', 719),
    new Backround('img/5_background/layers/2_second_layer/2.png', 719),
    new Backround('img/5_background/layers/1_first_layer/2.png', 719),
    new Backround('img/5_background/layers/air.png', 1438),
    new Backround('img/5_background/layers/3_third_layer/1.png', 1438),
    new Backround('img/5_background/layers/2_second_layer/1.png', 1438),
    new Backround('img/5_background/layers/1_first_layer/1.png', 1438),
    new Backround('img/5_background/layers/air.png', 2157),
    new Backround('img/5_background/layers/3_third_layer/2.png', 2157),
    new Backround('img/5_background/layers/2_second_layer/2.png', 2157),
    new Backround('img/5_background/layers/1_first_layer/2.png', 2157)
  ],

  [
    new Coin(300),
    new Coin(500),
    new Coin(800)
  ]
);
