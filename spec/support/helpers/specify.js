global.specify = function(expectation) {
  it('specify', expectation);
};

global.fspecify = function(expectation) {
 fit('specify', expectation);
};

global.context = function(context, expectation) {
  describe(context, expectation);
};

