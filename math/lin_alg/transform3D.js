var sketch = function(p) {
  var h, a, mode, affAx, scAff, draw, grid, axis1, axis2, axis3, cAxis, plane, cube, trns, cAxisN, M, N;

  p.setup = function() {
    p.createCanvas(1000,1000,p.WEBGL);  p.noLoop();
    mode = [false,false,false,false];
    affAx = [false,false,false,false];
    scAff = [0,0,0,0, 0,0,0,0, 0,0,0,0];
    draw = [true,false,true,true,true,false];
    h = (p.height <= p.width) ? p.round(p.height/2) : p.round(p.width/2);
    trns = p.createVector(0,0,0);
    cAxisN = p.createVector(1,1,1);  cAxisN.div(p.sqrt(3));
    //M = new PMatrix3D(1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1);
    //N = M.get();
    pShapeInit();
  }


  p.draw = function() {
    p.background(0);  p.textSize(25);  p.noStroke();
    var col = (mode[0]) ? 200 : 50;
    p.fill(col);  p.text("Skalering",10,30,0);
    for (var i = 0; i < 9; i++) {
      col = (scAff[i] == 1) ? 200 : 50;  p.fill(col);
      p.ellipse(50+15*i-45*p.floor(i/3),45+15*p.floor(i/3),12,12);
    }
    var axes = ['x','y','z','r'];
    col = (mode[1]) ? 200 : 50;
    p.fill(col);  p.text("Rotasjon",140,30,0);
    for (var i = 0; i < 4; i++) {
      col = (affAx[i]) ? 200 : 70;  p.fill(col);
      p.text(axes[i],150+25*i,60,0);
    }
    col = (mode[2]) ? 200 : 50;
    p.fill(col);  p.text("Translasjon",260,30,0);
    for (var i = 0; i < 4; i++) {
      col = (affAx[i]) ? 200 : 70;  p.fill(col);
      p.text(axes[i],287+25*i,60,0);
    }
    col = (mode[3]) ? 200 : 50;
    p.fill(col);  p.text('r',430,45);
    
    p.translate(h,h,-h*5/3);
    p.translate(trns.x,trns.y,trns.z);
    a = p.map(p.mouseX,0,p.width,-1,1);
    //b = map(mouseY,0,height,-1,1);
    p.push();  p.rotateX(p.mouseX);
    p.shape(cube);  p.pop();

    /*
    p.push();
    p.applyMatrix(M);
    p.applyMatrix(N);
    if (draw[0] || draw[1]) {
      p.push();
      if (draw[0]) p.shape(grid);  if (draw[1]) p.shape(plane);
      p.applyMatrix(1,0,0,0, 0,0,-1,0, 0,1,0,0, 0,0,0,1);
      if (draw[0]) p.shape(grid);  if (draw[1]) p.shape(plane);
      p.applyMatrix(0,0,1,0, 0,1,0,0, -1,0,0,0, 0,0,0,1);
      if (draw[0]) p.shape(grid);  if (draw[1]) p.shape(plane);
      p.pop();
    }
    if (draw[2]) { p.shape(axis1); p.shape(axis2); p.shape(axis3); }
    if (draw[3]) p.shape(cAxis);
    if (draw[4]) p.shape(cube);
    p.pop();
    */
  }


  p.mouseMoved = function() {
    //N.reset();
    if (mode[0]) {
      N.m00 += scAff[0]*2*a;  N.m01 += scAff[1]*2*a;  N.m02 += scAff[2]*2*a;
      N.m10 += scAff[3]*2*a;  N.m11 += scAff[4]*2*a;  N.m12 += scAff[5]*2*a;
      N.m20 += scAff[6]*2*a;  N.m21 += scAff[7]*2*a;  N.m22 += scAff[8]*2*a;
    }
    if (mode[1]) {
      var api = a*p.PI;
      if (affAx[0]) N.apply(1,0,0,0, 0,p.cos(api),-p.sin(api),0, 0,p.sin(api),p.cos(api),0, 0,0,0,1);
      if (affAx[1]) N.apply(p.cos(api),0,p.sin(api),0, 0,1,0,0, -p.sin(api),0,p.cos(api),0, 0,0,0,1);
      if (affAx[2]) N.apply(p.cos(api),-p.sin(api),0,0, p.sin(api),p.cos(api),0,0, 0,0,1,0, 0,0,0,1);
      if (affAx[3]) {
        var theta, phi, s1, c1, s2, c2, ss, sc, cs, cc;
        theta = p.atan2(cAxisN.y, p.sqrt(p.sq(cAxisN.x)+p.sq(cAxisN.z)));
        phi = p.atan2(cAxisN.z, cAxisN.x);
        s1 = p.sin(theta);  c1 = p.cos(theta);  s2 = p.sin(phi);  c2 = p.cos(phi);
        ss = s1*s2;  sc = s1*c2;  cs = c1*s2;  cc = c1*c2;
        /*
        N.apply(cc,sc,s2,0, -s1,c1,0,0, -cs,-ss,c2,0, 0,0,0,1);
        N.apply(1,0,0,0, 0,cos(api),-sin(api),0, 0,sin(api),cos(api),0, 0,0,0,1);
        N.apply(cc,-s1,-cs,0, sc,c1,-ss,0, s2,0,c2,0, 0,0,0,1);
        */
        N.apply(cc,-s1,-cs,0, sc,c1,-ss,0, s2,0,c2,0, 0,0,0,1);
        N.apply(1,0,0,0, 0,p.cos(api),-p.sin(api),0, 0,p.sin(api),p.cos(api),0, 0,0,0,1);
        N.apply(cc,sc,s2,0, -s1,c1,0,0, -cs,-ss,c2,0, 0,0,0,1);
      }
    }
    if (mode[2]) {
      if (affAx[0]) trns.x = 2*a*h;
      if (affAx[1]) trns.y = 2*a*h;
      if (affAx[2]) trns.z = 2*a*h;
    }
    if (mode[3]) {
      if (affAx[0]) cAxisN.x = a;
      if (affAx[1]) cAxisN.y = a;
      if (affAx[2]) cAxisN.z = a;
      cAxisN.div(p.sqrt(p.sq(cAxisN.x)+p.sq(cAxisN.y)+p.sq(cAxisN.z)));
      cAxis.setVertex(0, -h*cAxisN.x, -h*cAxisN.y, -h*cAxisN.z);
      cAxis.setVertex(1, h*cAxisN.x, h*cAxisN.y, h*cAxisN.z);
    }
    p.redraw();
  }


  p.keyPressed = function() {
    switch (p.key) {
      case 'f':  M.apply(N);  break;
      case 'v':  M.reset();  break;
      case 'g':  draw[0] = (draw[0]) ? false : true;  break;
      case 'h':  draw[1] = (draw[1]) ? false : true;  break;
      case 'j':  draw[2] = (draw[2]) ? false : true;  break;
      case 'b':  draw[3] = (draw[3]) ? false : true;  break;
      case 'n':  draw[4] = (draw[4]) ? false : true;  break;
      case 'm':  draw[5] = (draw[5]) ? false : true;  break;
    }
    for (var i = 0; i < 4; i++) {
      if (p.key == char(i + 1 + '0')) {
        mode[i] = (mode[i]) ? false : true;
        p.redraw();  return;
      }
    }
    if (mode[1] || mode[2] || mode[3]) switch (p.key) {
      case 'q':  affAx[0] = (affAx[0]) ? false : true;  break;
      case 'w':  affAx[1] = (affAx[1]) ? false : true;  break;
      case 'e':  affAx[2] = (affAx[2]) ? false : true;  break;
      case 'r':  affAx[3] = (affAx[3]) ? false : true;  break;
    } else if (mode[0]) switch (p.key) {
      case 'q':  scAff[0] = (scAff[0] == 1) ? 0 : 1;  break;
      case 'w':  scAff[1] = (scAff[1] == 1) ? 0 : 1;  break;
      case 'e':  scAff[2] = (scAff[2] == 1) ? 0 : 1;  break;
      case 'a':  scAff[3] = (scAff[3] == 1) ? 0 : 1;  break;
      case 's':  scAff[4] = (scAff[4] == 1) ? 0 : 1;  break;
      case 'd':  scAff[5] = (scAff[5] == 1) ? 0 : 1;  break;
      case 'z':  scAff[6] = (scAff[6] == 1) ? 0 : 1;  break;
      case 'x':  scAff[7] = (scAff[7] == 1) ? 0 : 1;  break;
      case 'c':  scAff[8] = (scAff[8] == 1) ? 0 : 1;  break;
    }
    p.redraw();
  }


  pShapeInit = function() {
    var unit = p.round(p.height)/10;
    grid = p.createShape();  grid.beginShape(LINES);
    grid.stroke(200,20);  grid.strokeWeight(3);
    for (var i = -h; i <= h; i += unit) {
      for (var j = -h; j <= h; j += unit) {
        grid.vertex(i,-h,j);  grid.vertex(i,h,j);
        grid.vertex(-h,i,j);  grid.vertex(h,i,j);
      }
    }
    grid.endShape();
    
    p.strokeWeight(6);
    axis1 = p.createShape();
    axis1.beginShape(LINES);  axis1.stroke(255,0,0);
    axis1.vertex(-h,0,0);  axis1.vertex(h,0,0);  axis1.endShape();
    
    axis2 = p.createShape();
    axis2.beginShape(LINES);  axis2.stroke(0,255,0);
    axis2.vertex(0,-h,0);  axis2.vertex(0,h,0);  axis2.endShape();
    
    axis3 = p.createShape();
    axis3.beginShape(LINES);  axis3.stroke(0,0,255);
    axis3.vertex(0,0,-h);  axis3.vertex(0,0,h);  axis3.endShape();
    
    cAxis = p.createShape();
    cAxis.beginShape(LINES);  cAxis.stroke(255,255,0);
    cAxis.vertex(-h*cAxisN.x,-h*cAxisN.y,-h*cAxisN.z);
    cAxis.vertex(h*cAxisN.x,h*cAxisN.y,h*cAxisN.z);  cAxis.endShape();
    
    plane = p.createShape();
    plane.beginShape();  plane.strokeWeight(0.5);  plane.fill(0,0,255,150);
    plane.vertex(-h,-h,0);  plane.vertex(-h,h,0);
    plane.vertex(h,h,0);  plane.vertex(h,-h,0);  plane.endShape();
    
    var hs = p.height/8;
    cube = p.createShape();  cube.beginShape();  cube.stroke(255,200);
    cube.vertex(hs,hs,hs);  cube.vertex(-hs,hs,hs);  cube.vertex(-hs,-hs,hs);
    cube.vertex(hs,-hs,hs);  cube.vertex(hs,hs,hs);  cube.vertex(hs,hs,-hs);
    cube.vertex(hs,-hs,-hs);  cube.vertex(-hs,-hs,-hs);  cube.vertex(-hs,hs,-hs);
    cube.vertex(hs,hs,-hs);  cube.vertex(hs,-hs,-hs);  cube.vertex(hs,-hs,hs);
    cube.vertex(-hs,-hs,hs);  cube.vertex(-hs,-hs,-hs);  cube.vertex(-hs,hs,-hs);
    cube.vertex(-hs,hs,hs);  cube.endShape();
  }
}