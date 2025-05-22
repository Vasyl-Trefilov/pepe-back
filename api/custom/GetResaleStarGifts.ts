import { Api } from "telegram";

export class GetResaleStarGifts extends Api.Method {
  static CONSTRUCTOR_ID = 0x7a5fa236;
  static classType = "request";

  flags: number;
  sortByPrice?: boolean;
  sortByNum?: boolean;
  attributesHash?: bigint;
  giftId: bigint;
  attributes?: any[];
  offset: string;
  limit: number;

  constructor(params: {
    sortByPrice?: boolean;
    sortByNum?: boolean;
    attributesHash?: bigint;
    giftId: bigint;
    attributes?: any[];
    offset: string;
    limit: number;
  }) {
    super();

    const {
      sortByPrice,
      sortByNum,
      attributesHash,
      giftId,
      attributes,
      offset,
      limit,
    } = params;

    let flags = 0;
    if (attributesHash) flags |= 1 << 0;
    if (sortByPrice) flags |= 1 << 1;
    if (sortByNum) flags |= 1 << 2;
    if (attributes && attributes.length) flags |= 1 << 3;

    this.flags = flags;
    this.sortByPrice = sortByPrice;
    this.sortByNum = sortByNum;
    this.attributesHash = attributesHash;
    this.giftId = giftId;
    this.attributes = attributes;
    this.offset = offset;
    this.limit = limit;
  }
}
