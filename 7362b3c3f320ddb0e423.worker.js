!function(e){var t={};function r(n){if(t[n])return t[n].exports;var o=t[n]={i:n,l:!1,exports:{}};return e[n].call(o.exports,o,o.exports,r),o.l=!0,o.exports}r.m=e,r.c=t,r.d=function(e,t,n){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},r.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"===typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)r.d(n,o,function(t){return e[t]}.bind(null,o));return n},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="/robot-tic-tac-toe/",r(r.s=0)}([function(e,t,r){"use strict";function n(e,t){(null==t||t>e.length)&&(t=e.length);for(var r=0,n=new Array(t);r<t;r++)n[r]=e[r];return n}function o(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){if("undefined"!==typeof Symbol&&Symbol.iterator in Object(e)){var r=[],n=!0,o=!1,a=void 0;try{for(var i,s=e[Symbol.iterator]();!(n=(i=s.next()).done)&&(r.push(i.value),!t||r.length!==t);n=!0);}catch(u){o=!0,a=u}finally{try{n||null==s.return||s.return()}finally{if(o)throw a}}return r}}(e,t)||function(e,t){if(e){if("string"===typeof e)return n(e,t);var r=Object.prototype.toString.call(e).slice(8,-1);return"Object"===r&&e.constructor&&(r=e.constructor.name),"Map"===r||"Set"===r?Array.from(r):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?n(e,t):void 0}}(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function a(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}function s(e,t,r){return t&&i(e.prototype,t),r&&i(e,r),e}r.r(t);var u,c=function(){function e(){a(this,e)}return s(e,null,[{key:"uctValue",value:function(e,t,r){return 0===r?Number.MAX_SAFE_INTEGER:t/r+1.41*Math.sqrt(Math.log(e)/r)}},{key:"findBestNodeWithUCT",value:function(e){var t=this;if(0===e.children.length)throw new Error("Node can not have 0 children");var r=e.state.visitCount,n=e.children.map((function(e){return{node:e,value:t.uctValue(r,e.state.winScore,e.state.visitCount)}}));return n.reduce((function(e,t){return e.value>t.value?e:t}),n[0]).node}}]),e}();!function(e){e.IN_PROGRESS="IN_PROGRESS",e.DRAW="DRAW",e.PLAYER_X="PLAYER_X",e.PLAYER_O="PLAYER_O"}(u||(u={}));var l=function(){function e(t){a(this,e),this.board=void 0,this.visitCount=0,this.winScore=0,t&&(this.board=t.board.clone(),this.visitCount=t.visitCount,this.winScore=t.winScore)}return s(e,[{key:"getAllPossibleStates",value:function(){var t=this,r=[];return this.board.getAvailableMoves().forEach((function(n){var o=new e(t);o.board.performMove(n),o.visitCount=0,r.push(o)})),r}},{key:"incrementVisitCount",value:function(){this.visitCount++}},{key:"randomPlay",value:function(){var e=this.board.getAvailableMoves(),t=e[Math.floor(Math.random()*e.length)];this.board.performMove(t)}},{key:"addScore",value:function(e){this.winScore!==Number.MIN_SAFE_INTEGER&&(this.winScore+=e)}}]),e}(),h=function(){function e(t){var r=this;switch(a(this,e),this.state=void 0,this.children=void 0,this.parent=void 0,t.type){case"empty":this.state=new l,this.children=[];break;case"state":this.state=t.state,this.children=[];break;case"state-parent-children":this.state=t.state,this.parent=t.parent,this.children=t.children;break;case"node":var n=t.node;this.children=[],this.state=new l(n.state),n.parent&&(this.parent=n.parent),n.children.forEach((function(t){r.children.push(new e({type:"node",node:t}))}))}}return s(e,[{key:"getRandomChildNode",value:function(){return this.children[Math.floor(Math.random()*this.children.length)]}},{key:"getChildWithMaxScore",value:function(){return this.children.reduce((function(e,t){return e.state.visitCount>t.state.visitCount?e:t}),this.children[0])}},{key:"print",value:function(){console.log("---------------------------------------------------"),console.log("count: ".concat(this.state.visitCount," score: ").concat(this.state.winScore)),this.state.board.printBoard(),console.log("-------------------children------------------------"),this.children.forEach((function(e){return e.print()})),console.log("---------------------------------------------------"),console.log()}}]),e}(),f=function e(){a(this,e),this.root=void 0,this.root=new h({type:"empty"})},p=function(){function e(){a(this,e)}return s(e,[{key:"findNextMove",value:function(e,t,r){var n=e.getOpposedStatus(t),o=new f,a=o.root;a.state.board=e.clone();for(var i=(new Date).valueOf()+r,s=0;(new Date).valueOf()<i;){s++;var c=this.selectPromisingNode(a);c.state.board.checkStatus()===u.IN_PROGRESS&&this.expandNode(c);var l=c;c.children.length>0&&(l=c.getRandomChildNode());var h=this.simulateRandomPlayout(l,n);this.backPropogation(l,h)}console.log("ran ".concat(s," iterations"));var p=a.getChildWithMaxScore();return o.root=p,p.state.board}},{key:"selectPromisingNode",value:function(e){for(var t=e;0!==t.children.length;)t=c.findBestNodeWithUCT(t);return t}},{key:"expandNode",value:function(e){e.state.getAllPossibleStates().forEach((function(t){var r=new h({type:"state",state:t});r.parent=e,e.children.push(r)}))}},{key:"simulateRandomPlayout",value:function(e,t){var r=new h({type:"node",node:e}),n=r.state,o=n.board.checkStatus();if(o===t)return r.parent.state.winScore=Number.MIN_SAFE_INTEGER,o;for(;o===u.IN_PROGRESS;)n.randomPlay(),o=n.board.checkStatus();return o}},{key:"backPropogation",value:function(t,r){for(var n=t;n;)n.state.incrementVisitCount(),n.state.board.getLatestPlayerToMove()===r&&n.state.addScore(e.WIN_SCORE),n=n.parent}}]),e}();function v(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function d(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function y(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?d(Object(r),!0).forEach((function(t){v(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):d(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}p.WIN_SCORE=10;var b=[448,56,7,292,146,73,273,84],m=function(){function e(){a(this,e),this.presence=0,this.color=0,this.lastPerformedMove=null,this.printEachMove=!1}return s(e,[{key:"clone",value:function(){var t=new e;return t.presence=this.presence,t.color=this.color,t.lastPerformedMove=this.lastPerformedMove,t}},{key:"exportBoard",value:function(){return{presence:this.presence,color:this.color}}},{key:"getAvailableMoves",value:function(){var e=this;return this.checkStatus()!==u.IN_PROGRESS?[]:new Array(9).fill(void 0).map((function(e,t){return t})).filter((function(t){return 0===(Math.pow(2,t)&e.presence)}))}},{key:"performMove",value:function(e,t){var r=Math.pow(2,e);this.presence=this.presence|r,t&&(this.color=this.color|r)}},{key:"checkStatus",value:function(){var e=this;return b.some((function(t){return(e.presence&t&e.color)===t}))?u.PLAYER_X:b.some((function(t){return(e.presence&t&~e.color)===t}))?u.PLAYER_O:511===this.presence?u.DRAW:u.IN_PROGRESS}},{key:"getOpposedStatus",value:function(e){return e===u.PLAYER_O?u.PLAYER_X:u.PLAYER_O}},{key:"getRows",value:function(){var e=this;return new Array(9).fill(void 0).map((function(e,t){return t})).map((function(t){var r=Math.pow(2,t);return 0===(r&e.presence)?"empty":0===(r&e.presence&e.color)?"player2":"player1"}))}},{key:"getPrintedRows",value:function(){for(var e=[],t=0;t<3;t++){for(var r=[],n=0;n<3;n++){var o=3*t+n;if(Math.pow(2,o)&this.presence){var a=Math.pow(2,o)&this.color;r.push(a?"x":"o")}else r.push(" ")}e.push("| ".concat(r.join(" ")," |"))}return e}}],[{key:"importBoard",value:function(t){var r=new e;return r.presence=t.presence,r.color=t.color,r}}]),e}(),O=[448,56,7,292,146,73,273,84],g=function(){function e(){a(this,e),this.printEachMove=!1,this.currentBoard=null,this.presence=0,this.color=0,this.playerOneToMove=!0,this.boards=[];for(var t=0;t<9;t++)this.boards.push(new m)}return s(e,[{key:"clone",value:function(){var t=new e;return t.currentBoard=this.currentBoard,t.presence=this.presence,t.color=this.color,t.playerOneToMove=this.playerOneToMove,t.boards=this.boards.map((function(e){return e.clone()})),t}},{key:"exportBoard",value:function(){return{color:this.color,presence:this.presence,currentBoard:this.currentBoard,boards:this.boards.map((function(e){return e.exportBoard()})),playerOneToMove:this.playerOneToMove}}},{key:"getAvailableMovesForOuterGrid",value:function(){var e=this;return new Array(9).fill(void 0).map((function(e,t){return t})).filter((function(t){return 0===(Math.pow(2,t)&e.presence)}))}},{key:"getAvailableMoves",value:function(){var e=this;if(null!==this.currentBoard)return this.boards[this.currentBoard].getAvailableMoves();var t=[];return this.getAvailableMovesForOuterGrid().forEach((function(r){var n=e.boards[r];n.checkStatus()===u.IN_PROGRESS&&n.getAvailableMoves().forEach((function(e){t.push(10*r+e+10)}))})),t}},{key:"getPlayerToMove",value:function(){return this.playerOneToMove?u.PLAYER_X:u.PLAYER_O}},{key:"getLatestPlayerToMove",value:function(){return this.playerOneToMove?u.PLAYER_O:u.PLAYER_X}},{key:"updatePresenceAndColor",value:function(e){var t=this.boards[e].checkStatus();if(t!==u.IN_PROGRESS&&t!==u.DRAW){var r=Math.pow(2,e);this.presence=this.presence|r,t===u.PLAYER_X&&(this.color=this.color|r)}}},{key:"performMove",value:function(e){var t=e<9?this.currentBoard:Math.floor(e/10)-1,r=e<9?e:e%10;this.boards[t].performMove(r,this.playerOneToMove),this.boards[r].checkStatus()===u.IN_PROGRESS?this.currentBoard=r:this.currentBoard=null,this.updatePresenceAndColor(t),this.playerOneToMove=!this.playerOneToMove,this.printEachMove&&this.printBoard()}},{key:"getBoards",value:function(){return this.boards.map((function(e){return e.getRows()}))}},{key:"checkStatus",value:function(){var e=this;if(O.some((function(t){return(e.presence&t&e.color)===t})))return u.PLAYER_X;if(O.some((function(t){return(e.presence&t&~e.color)===t})))return u.PLAYER_O;if(0===this.getAvailableMoves().length){var t=this.boards.reduce((function(e,t){return t.checkStatus()===u.PLAYER_O?y({},e,{playerO:e.playerO+1}):t.checkStatus()===u.PLAYER_X?y({},e,{playerX:e.playerX+1}):e}),{playerO:0,playerX:0});return t.playerO>t.playerX?u.PLAYER_O:t.playerX>t.playerO?u.PLAYER_X:u.DRAW}return u.IN_PROGRESS}},{key:"getOpposedStatus",value:function(e){return e===u.PLAYER_O?u.PLAYER_X:u.PLAYER_O}},{key:"printBoard",value:function(){for(var e=[],t=0;t<3;t++){for(var r=[[],[],[]],n=0;n<3;n++){var a=3*t+n,i=o(this.boards[a].getPrintedRows(),3),s=i[0],u=i[1],c=i[2];r[0].push(s),r[1].push(u),r[2].push(c)}var l=r.map((function(e){return e.join("    ")})).join("\n");e.push(l)}console.log("\nGame status: ".concat(this.checkStatus()," -- Current square: ").concat(null!==this.currentBoard?this.currentBoard+1:"None","\n\n").concat(e.join("\n\n"),"\n"))}}],[{key:"importBoard",value:function(t){var r=new e;return r.color=t.color,r.presence=t.presence,r.currentBoard=t.currentBoard,r.boards=t.boards.map((function(e){return m.importBoard(e)})),r.playerOneToMove=t.playerOneToMove,r}}]),e}(),P=new p;onmessage=function(e){var t=o(e.data,3),r=t[0],n=t[1],a=t[2],i=g.importBoard(r),s=P.findNextMove(i,n,a);postMessage(s.exportBoard())},addEventListener("message",(function(e){var r,n=e.data,o=n.type,a=n.method,i=n.id,s=n.params;"RPC"===o&&a&&((r=t[a])?Promise.resolve().then((function(){return r.apply(t,s)})):Promise.reject("No such method")).then((function(e){postMessage({type:"RPC",id:i,result:e})})).catch((function(e){var t={message:e};e.stack&&(t.message=e.message,t.stack=e.stack,t.name=e.name),postMessage({type:"RPC",id:i,error:t})}))})),postMessage({type:"RPC",method:"ready"})}]);
//# sourceMappingURL=7362b3c3f320ddb0e423.worker.js.map