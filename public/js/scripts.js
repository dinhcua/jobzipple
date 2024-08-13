let pojo = {
  a: 1,
  b: 2,
  sum: function () {
    return this.a + this.b;
  },
};

console.log(pojo.sum()); // 3

class Tritangle {
  constructor(base, height) {
    if (isNaN(base) || isNaN(height) || base < 0 || height < 0) {
      throw new Error('Base and height must be numbers');
    }

    this.base = base;
    this.height = height;
  }

  area() {
    return 0.5 * this.base * this.height;
  }
}

const tri = new Tritangle(2, 2);
tri.base = 3;

console.log(tri.area());
