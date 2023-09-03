class Area {
  readonly id: number;
  readonly desc: string;
  readonly idResp: number;
  readonly sig: number;

  constructor(id: number) {
    const queryStr = xlQuery(
      "Areas!A2:E",
      `SELECT B, C,D WHERE A = ${id} AND E = TRUE`
    );

    const area = query(queryStr);

    if (id > 1) area.shift();

    let desc: string, idResp: number, sig: number;
    [sig, desc, idResp] = area.flat();

    this.id = id;
    this.desc = desc;
    this.idResp = idResp;
    this.sig = sig;
  }

  static all(id: number) {
    const queryStr = xlQuery(
      "Areas!A2:E",
      `SELECT A, C WHERE D = ${id} AND E = TRUE`
    );

    let areaQuery = query(queryStr);

    if (id > 1) areaQuery.shift();

    const areas = keyValueMaker(areaQuery);

    return areas;
  }
}
