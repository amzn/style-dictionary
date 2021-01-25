const constantDate = new Date('2000-01-01');
global.Date = function() { return constantDate };
global.Date.now = function() { return constantDate };