var React = require('react')

var initialState = {
  x: null,
  y: null,
  swiping: false,
  start: 0,
  wheelTimeout: null
};

var defaultProps = {
  flickThreshold: 0.6,
  delta: 10
};

var ____Class4=React.Component;for(var ____Class4____Key in ____Class4){if(____Class4.hasOwnProperty(____Class4____Key)){Swipeable[____Class4____Key]=____Class4[____Class4____Key];}}var ____SuperProtoOf____Class4=____Class4===null?null:____Class4.prototype;Swipeable.prototype=Object.create(____SuperProtoOf____Class4);Swipeable.prototype.constructor=Swipeable;Swipeable.__superConstructor__=____Class4;
  function Swipeable() {"use strict";
    this.state = initialState;

    this.resetWheelTimeout = this.resetWheelTimeout.bind(this);
    this.calculatePos = this.calculatePos.bind(this);
    this.touchStart = this.touchStart.bind(this);
    this.touchMove = this.touchMove.bind(this);
    this.touchEnd = this.touchEnd.bind(this);
    this.wheel = this.wheel.bind(this);
  }

  Object.defineProperty(Swipeable.prototype,"resetWheelTimeout",{writable:true,configurable:true,value:function(ev) {"use strict";
    if (this.state.wheelTimeout !== null) {
      clearTimeout(this.state.wheelTimeout)
    }
    this.setState({
      x: this.state.x + ev.deltaX,
      y: this.state.y + ev.deltaY,
      wheelTimeout: setTimeout( function()  {
        var e = {
          deltaX: this.state.x,
          deltaY: this.state.y
        };
        this.touchEnd(e)
        this.setState(initialState)
      }.bind(this), 50)
    });
  }});

  Object.defineProperty(Swipeable.prototype,"calculatePos",{writable:true,configurable:true,value:function(e) {"use strict";
    var xd = null;
    var yd = null;
    if (e.changedTouches !== undefined) {
      var x = e.changedTouches[0].clientX
      var y = e.changedTouches[0].clientY

      xd = this.state.x - x
      yd = this.state.y - y
    } else {
      xd = this.state.x + e.deltaX
      yd = this.state.y + e.deltaY
    }

    var axd = Math.abs(xd)
    var ayd = Math.abs(yd)

    return {
      deltaX: xd,
      deltaY: yd,
      absX: axd,
      absY: ayd
    }
  }});

  Object.defineProperty(Swipeable.prototype,"touchStart",{writable:true,configurable:true,value:function(e) {"use strict";
    if (this.state.swiping) {
      return;
    }
    var multiTouch = e.touches !== undefined && e.touches.length > 1
    if (multiTouch) {
      return
    }
    this.setState({
      start: Date.now(),
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
      swiping: false
    })
  }});

  Object.defineProperty(Swipeable.prototype,"touchMove",{writable:true,configurable:true,value:function(e) {"use strict";
    var multiTouch = e.touches !== undefined && e.touches.length > 1
    if (this.state.x == null || this.state.y == null || multiTouch) {
      return
    }

    var cancelPageSwipe = false
    var pos = this.calculatePos(e)

    if (pos.absX < this.props.delta && pos.absY < this.props.delta) {
      return
    }

    if (pos.absX > pos.absY) {
      if (pos.deltaX > 0) {
        if (this.props.onSwipingLeft) {
          this.props.onSwipingLeft(e, pos.absX)
          cancelPageSwipe = true
        }
      } else {
        if (this.props.onSwipingRight) {
          this.props.onSwipingRight(e, pos.absX)
          cancelPageSwipe = true
        }
      }
    } else {
      if (pos.deltaY > 0) {
        if (this.props.onSwipingUp) {
          this.props.onSwipingUp(e, pos.absY)
          cancelPageSwipe = true
        }
      } else {
        if (this.props.onSwipingDown) {
          this.props.onSwipingDown(e, pos.absY)
          cancelPageSwipe = true
        }
      }
    }

    this.setState({ swiping: true })

    if (cancelPageSwipe) {
      e.preventDefault()
    }
  }});

  Object.defineProperty(Swipeable.prototype,"touchEnd",{writable:true,configurable:true,value:function(ev) {"use strict";
    if (this.state.swiping) {
      var pos = this.calculatePos(ev)

      var time = Date.now() - this.state.start
      var velocity = Math.sqrt(pos.absX * pos.absX + pos.absY * pos.absY) / time
      var isFlick = velocity > this.props.flickThreshold

      this.props.onSwiped && this.props.onSwiped(
        ev,
        pos.deltaX,
        pos.deltaY,
        isFlick
      )

      if (pos.absX > pos.absY) {
        if (pos.deltaX > 0) {
          this.props.onSwipedLeft && this.props.onSwipedLeft(ev, pos.deltaX, isFlick)
        } else {
          this.props.onSwipedRight && this.props.onSwipedRight(ev, pos.deltaX, isFlick)
        }
      } else {
        if (pos.deltaY > 0) {
          this.props.onSwipedUp && this.props.onSwipedUp(ev, pos.deltaY, isFlick)
        } else {
          this.props.onSwipedDown && this.props.onSwipedDown(ev, pos.deltaY, isFlick)
        }
      }
    }

    this.setState(initialState)
  }});

  Object.defineProperty(Swipeable.prototype,"wheel",{writable:true,configurable:true,value:function(ev) {"use strict";
    // For initializing the movement
    if (!this.state.swiping) {
      this.setState({
        start: Date.now(),
        x: 0,
        y: 0,
        swiping: true
      })
    } else {
      // Accounts for momentum scrolling
      // var xIncreasing = Math.abs(ev.deltaX) > Math.abs(this.state.x);
      // var yIncreasing = Math.abs(ev.deltaY) > Math.abs(this.state.Y);
      // if(xIncreasing || yIncreasing) {
      this.touchMove(ev)
      this.resetWheelTimeout(ev)
      // }
    }
    // Prevent forward/back actions in Safari and Chrome (with tradeoffs)
    if (Math.abs(ev.deltaX) > Math.abs(ev.deltaY)) {
      ev.preventDefault();
    }
  }});

  Object.defineProperty(Swipeable.prototype,"render",{writable:true,configurable:true,value:function() {"use strict";
    return (
      React.createElement("div", React.__spread({},  this.props, 
        {onTouchStart: this.touchStart, 
        onTouchMove: this.touchMove, 
        onTouchEnd: this.touchEnd, 
        onWheel: this.wheel}), 
          this.props.children
      )
    )
  }});
;

Swipeable.propTypes = {
  onSwiped: React.PropTypes.func,
  onSwipingUp: React.PropTypes.func,
  onSwipingRight: React.PropTypes.func,
  onSwipingDown: React.PropTypes.func,
  onSwipingLeft: React.PropTypes.func,
  onSwipedUp: React.PropTypes.func,
  onSwipedRight: React.PropTypes.func,
  onSwipedDown: React.PropTypes.func,
  onSwipedLeft: React.PropTypes.func,
  flickThreshold: React.PropTypes.number,
  delta: React.PropTypes.number
};

module.exports = Swipeable
