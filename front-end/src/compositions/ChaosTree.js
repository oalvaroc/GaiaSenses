// inspired by: https://openprocessing.org/sketch/732455

import React from "react";
import Sketch from "react-p5";

class Particle {
  constructor(p5, x, y, size, img) {
    this.pos = p5.createVector(x, y);
    this.tgt = p5.createVector(p5.random(-1, 1) + x, p5.random(-1, 1) + y);
    this.size = size;
    this.col = img.get(x, y);
  }
}

function ChaosTree({ width, height, imageUrl }) {
  let particles = [];
  let img = null;

  const isInsideCanvas = (x, y) => {
    return (x < img.width && x > 0) && (y < img.height && y > 0);
  }

  const distanceSquared = (x1, y1, x2, y2) => {
    return Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2);
  }

  const overlap = (x1, y1, diam1, x2, y2, diam2) => {
    return distanceSquared(x1, y1, x2, y2) < Math.pow(diam2 / 2 + diam1 / 2 - 2, 2);
  }

  const preload = (p5) => {
    img = p5.loadImage(imageUrl);
  }

  const setup = (p5, parentRef) => {
    img.resize(
      width || window.screen.availWidth,
      height || window.screen.availHeight - 100
    );

    p5.createCanvas(img.width, img.height).parent(parentRef);

    p5.image(img, 0, 0);
    p5.frameRate(20);

    for (let i = 1; i > 0; i -= 0.0001) {
      const x = p5.random(img.width);
      const y = p5.random(img.height);
      const size = 40 * Math.pow(p5.random(i), 2) + 8;

      if (!particles.some((p) => overlap(x, y, size, p.pos.x, p.pos.y, p.size))
      ) {
        particles.push(new Particle(p5, x, y, size, img));
      }
    }
    p5.noStroke();
  }

  const draw = (p5) => {
    if (isInsideCanvas(p5.mouseX, p5.mouseY)) {
      p5.image(img, 0, 0);

      for (const particle of particles) {
        const t = 1 - 5e-4 * (Math.pow(particle.pos.x - p5.mouseX, 2) + Math.pow(particle.pos.y - p5.mouseY, 2));
        const p = [
          (1 - t) * particle.pos.x + particle.tgt.x * t,
          (1 - t) * particle.pos.y + particle.tgt.y * t
        ];

        p5.fill(particle.col);
        p5.circle(p[0], p[1], particle.size);
      }
   }
  }
  return <Sketch preload={preload} setup={setup} draw={draw} />;
}

export default ChaosTree;
