/* The GridBot 3
bluetypo 2025
*/

color[] colores  = {#ED6D6A, #E94545, #CF2A30, #B6181F, #A01814, #7E170F};

import processing.pdf.*;

int RandV;
int RandH;
int rectWidth;
int rectHeight;
int cols=3; //define el numero de columnas


void setup() {
  size(600, 900);

  dibuja();
}



void draw() {
}


// función dibuja
void dibuja() {
  int grid =width/cols;
  beginRecord(PDF, "gridbot/gridBot-####.pdf");
  background(#ffffff);
  rect(0, 0, width - 1, height - 1);
  pushMatrix();
  translate(-grid, -grid);
  for (int i = 0; i < 50; i++) {
    RandV = (int) random(12) * grid;
    RandH = (int) random(12) * grid;
    rectWidth = constrain((int) random(12) * grid, 0, width - RandV);
    rectHeight = constrain((int) random(12) * grid, 0, height - RandH);
    //noStroke();
    //fill(colores[(int)random(colores.length)]);
    rect(RandV, RandH, rectWidth, rectHeight);
    
    println(RandV);
  }
  endRecord();
}

// función exporta
void exporta() {
  // saveFrame("gridbot/gridBot-######.tif");
}

void mousePressed() {
  clear();
  dibuja();
}

void keyPressed() {
  exporta();
}
