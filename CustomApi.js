const { Api } = require("./telegram/tl/api");
const Request = require("./telegram/tl/core");
Api.payments = Api.payments || {};

Api.payments.GetUserStarGifts = class extends Request {
  static CONSTRUCTOR_ID = 0xa0788a80;
  static SUBCLASS_OF_ID = 0x7f3b18ea;
  static className = "payments.GetUserStarGifts";
  static classType = "request";

  constructor() {
    super();
  }

  getBytes() {
    return Buffer.alloc(0); // Метод не принимает аргументов
  }

  static fromReader(reader) {
    return new this();
  }
};

module.exports = { Api };
