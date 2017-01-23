const paramReplacer = require('./paramReplacer');

describe('Parameter replacer',()=>{
    var text = "Hello, ${name}!";
    var text2 = "Hello, ${ name  }!";
    var text3 = "Hello, ${ name  } and ${  name2 }!";
    var params = {
        name: "World",
        name2: "Joe"
    };

    it('should replace one param',()=>{
        expect(paramReplacer(text, params)).toBe("Hello, World!");
        expect(paramReplacer(text2, params)).toBe("Hello, World!");
    });

    it('should replace with empty',()=>{
        expect(paramReplacer(text, {})).toBe("Hello, !");
    });

    it('should replace with names',()=>{
        expect(paramReplacer(text3, params)).toBe("Hello, World and Joe!");
    });
});