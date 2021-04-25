var Dot = (function () {
    function Dot(x, y) {
        if (x === void 0) { x = random(0, width); }
        if (y === void 0) { y = random(0, height); }
        this.r = 5;
        this.x = x;
        this.y = y;
    }
    Dot.prototype.show = function () {
        fill(255);
        ellipse(this.x, this.y, this.r * 2, this.r * 2);
    };
    Dot.prototype.drawClosest = function (points) {
        var d = width;
        var c = this;
        for (var _i = 0, points_1 = points; _i < points_1.length; _i++) {
            var point_1 = points_1[_i];
            var p = point_1.userData;
            if (dist(p.x, p.y, this.x, this.y) < d && p != this) {
                c = p;
            }
        }
        stroke(255);
        strokeWeight(1);
        line(this.x, this.y, c.x, c.y);
    };
    return Dot;
}());
var Point = (function () {
    function Point(x, y, data) {
        this.x = x;
        this.y = y;
        this.userData = data;
    }
    Point.prototype.distanceFrom = function (other) {
        var dx = other.x - this.x;
        var dy = other.y - this.y;
        return Math.sqrt(dx * dx + dy * dy);
    };
    return Point;
}());
var Rectangle = (function () {
    function Rectangle(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.left = x - w / 2;
        this.right = x + w / 2;
        this.top = y - h / 2;
        this.bottom = y + h / 2;
    }
    Rectangle.prototype.contains = function (point) {
        return (this.left <= point.x &&
            point.x <= this.right &&
            this.top <= point.y &&
            point.y <= this.bottom);
    };
    Rectangle.prototype.intersects = function (range) {
        return !(this.right < range.left ||
            range.right < this.left ||
            this.bottom < range.top ||
            range.bottom < this.top);
    };
    Rectangle.prototype.subdivide = function (quadrant) {
        switch (quadrant) {
            case "ne":
                return new Rectangle(this.x + this.w / 4, this.y - this.h / 4, this.w / 2, this.h / 2);
            case "nw":
                return new Rectangle(this.x - this.w / 4, this.y - this.h / 4, this.w / 2, this.h / 2);
            case "se":
                return new Rectangle(this.x + this.w / 4, this.y + this.h / 4, this.w / 2, this.h / 2);
            case "sw":
                return new Rectangle(this.x - this.w / 4, this.y + this.h / 4, this.w / 2, this.h / 2);
        }
    };
    Rectangle.prototype.xDistanceFrom = function (point) {
        if (this.left <= point.x && point.x <= this.right) {
            return 0;
        }
        return Math.min(Math.abs(point.x - this.left), Math.abs(point.x - this.right));
    };
    Rectangle.prototype.yDistanceFrom = function (point) {
        if (this.top <= point.y && point.y <= this.bottom) {
            return 0;
        }
        return Math.min(Math.abs(point.y - this.top), Math.abs(point.y - this.bottom));
    };
    Rectangle.prototype.distanceFrom = function (point) {
        var dx = this.xDistanceFrom(point);
        var dy = this.yDistanceFrom(point);
        return Math.sqrt(dx * dx + dy * dy);
    };
    return Rectangle;
}());
var Circle = (function () {
    function Circle(x, y, r) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.rSquared = this.r * this.r;
    }
    Circle.prototype.contains = function (point) {
        var d = Math.pow(point.x - this.x, 2) + Math.pow(point.y - this.y, 2);
        return d <= this.rSquared;
    };
    Circle.prototype.intersects = function (range) {
        var xDist = Math.abs(range.x - this.x);
        var yDist = Math.abs(range.y - this.y);
        var r = this.r;
        var w = range.w / 2;
        var h = range.h / 2;
        var edges = Math.pow(xDist - w, 2) + Math.pow(yDist - h, 2);
        if (xDist > r + w || yDist > r + h)
            return false;
        if (xDist <= w || yDist <= h)
            return true;
        return edges <= this.rSquared;
    };
    return Circle;
}());
var QuadTree = (function () {
    function QuadTree(boundary, capacity) {
        if (capacity < 1) {
            throw RangeError("capacity must be greater than 0");
        }
        this.boundary = boundary;
        this.capacity = capacity;
        this.points = [];
        this.divided = false;
    }
    Object.defineProperty(QuadTree.prototype, "children", {
        get: function () {
            if (this.divided) {
                return [this.northeast, this.northwest, this.southeast, this.southwest];
            }
            else {
                return [];
            }
        },
        enumerable: false,
        configurable: true
    });
    QuadTree.create = function () {
        var DEFAULT_CAPACITY = 8;
        if (arguments.length === 0) {
            var bounds = new Rectangle(width / 2, height / 2, width, height);
            return new QuadTree(bounds, DEFAULT_CAPACITY);
        }
        if (arguments[0] instanceof Rectangle) {
            var capacity = arguments[1] || DEFAULT_CAPACITY;
            return new QuadTree(arguments[0], capacity);
        }
        if (typeof arguments[0] === "number" &&
            typeof arguments[1] === "number" &&
            typeof arguments[2] === "number" &&
            typeof arguments[3] === "number") {
            var capacity = arguments[4] || DEFAULT_CAPACITY;
            return new QuadTree(new Rectangle(arguments[0], arguments[1], arguments[2], arguments[3]), capacity);
        }
        throw new TypeError("Invalid parameters");
    };
    QuadTree.prototype.toJSON = function (isChild) {
        var obj = { points: this.points };
        if (this.divided) {
            if (this.northeast.points.length > 0) {
                obj.ne = this.northeast.toJSON(true);
            }
            if (this.northwest.points.length > 0) {
                obj.nw = this.northwest.toJSON(true);
            }
            if (this.southeast.points.length > 0) {
                obj.se = this.southeast.toJSON(true);
            }
            if (this.southwest.points.length > 0) {
                obj.sw = this.southwest.toJSON(true);
            }
        }
        if (!isChild) {
            obj.capacity = this.capacity;
            obj.x = this.boundary.x;
            obj.y = this.boundary.y;
            obj.w = this.boundary.w;
            obj.h = this.boundary.h;
        }
        return obj;
    };
    QuadTree.fromJSON = function (obj, x, y, w, h, capacity) {
        if (typeof x === "undefined") {
            if ("x" in obj) {
                x = obj.x;
                y = obj.y;
                w = obj.w;
                h = obj.h;
                capacity = obj.capacity;
            }
            else {
                throw TypeError("JSON missing boundary information");
            }
        }
        var qt = new QuadTree(new Rectangle(x, y, w, h), capacity);
        qt.points = obj.points;
        if ("ne" in obj || "nw" in obj || "se" in obj || "sw" in obj) {
            var x_1 = qt.boundary.x;
            var y_1 = qt.boundary.y;
            var w_1 = qt.boundary.w / 2;
            var h_1 = qt.boundary.h / 2;
            if ("ne" in obj) {
                qt.northeast = QuadTree.fromJSON(obj.ne, x_1 + w_1 / 2, y_1 - h_1 / 2, w_1, h_1, capacity);
            }
            else {
                qt.northeast = new QuadTree(qt.boundary.subdivide("ne"), capacity);
            }
            if ("nw" in obj) {
                qt.northwest = QuadTree.fromJSON(obj.nw, x_1 - w_1 / 2, y_1 - h_1 / 2, w_1, h_1, capacity);
            }
            else {
                qt.northwest = new QuadTree(qt.boundary.subdivide("nw"), capacity);
            }
            if ("se" in obj) {
                qt.southeast = QuadTree.fromJSON(obj.se, x_1 + w_1 / 2, y_1 + h_1 / 2, w_1, h_1, capacity);
            }
            else {
                qt.southeast = new QuadTree(qt.boundary.subdivide("se"), capacity);
            }
            if ("sw" in obj) {
                qt.southwest = QuadTree.fromJSON(obj.sw, x_1 - w_1 / 2, y_1 + h_1 / 2, w_1, h_1, capacity);
            }
            else {
                qt.southwest = new QuadTree(qt.boundary.subdivide("sw"), capacity);
            }
            qt.divided = true;
        }
        return qt;
    };
    QuadTree.prototype.subdivide = function () {
        this.northeast = new QuadTree(this.boundary.subdivide("ne"), this.capacity);
        this.northwest = new QuadTree(this.boundary.subdivide("nw"), this.capacity);
        this.southeast = new QuadTree(this.boundary.subdivide("se"), this.capacity);
        this.southwest = new QuadTree(this.boundary.subdivide("sw"), this.capacity);
        this.divided = true;
    };
    QuadTree.prototype.insert = function (point) {
        if (!this.boundary.contains(point)) {
            return false;
        }
        if (this.points.length < this.capacity) {
            this.points.push(point);
            return true;
        }
        if (!this.divided) {
            this.subdivide();
        }
        return (this.northeast.insert(point) ||
            this.northwest.insert(point) ||
            this.southeast.insert(point) ||
            this.southwest.insert(point));
    };
    QuadTree.prototype.query = function (range, found) {
        if (found === void 0) { found = []; }
        if (!range.intersects(this.boundary)) {
            return found;
        }
        for (var _i = 0, _a = this.points; _i < _a.length; _i++) {
            var p = _a[_i];
            if (range.contains(p)) {
                found.push(p);
            }
        }
        if (this.divided) {
            this.northwest.query(range, found);
            this.northeast.query(range, found);
            this.southwest.query(range, found);
            this.southeast.query(range, found);
        }
        return found;
    };
    QuadTree.prototype.forEach = function (fn) {
        this.points.forEach(fn);
        if (this.divided) {
            this.northeast.forEach(fn);
            this.northwest.forEach(fn);
            this.southeast.forEach(fn);
            this.southwest.forEach(fn);
        }
    };
    QuadTree.prototype.merge = function (other, capacity) {
        var left = Math.min(this.boundary.left, other.boundary.left);
        var right = Math.max(this.boundary.right, other.boundary.right);
        var top = Math.min(this.boundary.top, other.boundary.top);
        var bottom = Math.max(this.boundary.bottom, other.boundary.bottom);
        var height = bottom - top;
        var width = right - left;
        var midX = left + width / 2;
        var midY = top + height / 2;
        var boundary = new Rectangle(midX, midY, width, height);
        var result = new QuadTree(boundary, capacity);
        this.forEach(function (point) { return result.insert(point); });
        other.forEach(function (point) { return result.insert(point); });
        return result;
    };
    Object.defineProperty(QuadTree.prototype, "length", {
        get: function () {
            var count = this.points.length;
            if (this.divided) {
                count += this.northwest.length;
                count += this.northeast.length;
                count += this.southwest.length;
                count += this.southeast.length;
            }
            return count;
        },
        enumerable: false,
        configurable: true
    });
    return QuadTree;
}());
var numDots = 30;
var dots = [];
function setup() {
    var cnv = createCanvas(windowWidth, windowHeight);
    cnv.position(0, 0);
    for (var i = 0; i < numDots; i++) {
        dots.push(new Dot());
    }
}
function draw() {
    background(0);
    var qtree = QuadTree.create();
    for (var _i = 0, dots_1 = dots; _i < dots_1.length; _i++) {
        var p = dots_1[_i];
        var point_2 = new Point(p.x, p.y, p);
        qtree.insert(point_2);
    }
    for (var _a = 0, dots_2 = dots; _a < dots_2.length; _a++) {
        var p = dots_2[_a];
        var range = new Circle(p.x, p.y, 1000);
        var points = qtree.query(range);
        p.drawClosest(points);
    }
    for (var _b = 0, dots_3 = dots; _b < dots_3.length; _b++) {
        var p = dots_3[_b];
        p.show();
    }
}
//# sourceMappingURL=../src/src/main.js.map