const utils = require('./utils');



describe('headers', () => {

  const dateToUse = "Sat, 18 Apr 2020 16:44:49 GMT";
  global.Date = jest.fn(() => {
    return {
      'toUTCString': () => dateToUse
    }
  });

  it('should generate a CSS header', () => {
    const header = utils.fileHeaderCSS();
    const expectedHeader =`/**
  * Do not edit directly
  * Generated on ${dateToUse}
  */\n\n`
    expect(header).toEqual(expectedHeader);
  });

  it('should generate a string header', () => {
    const header = utils.fileHeaderString();
    const expectedHeader = `Do not edit directly, Generated on ${dateToUse}`
    expect(header).toEqual(expectedHeader);
  });
});


