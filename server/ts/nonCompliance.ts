class NonCompliance {
  readonly id: number;
  readonly desc: string;

  constructor(id: number) {
    const queryStr = xlQuery(
      "NConformidades!A2:D",
      `SELECT B WHERE A = ${id} AND D = TRUE`
    );
    let nonCompliance = query(queryStr);

    if (nonCompliance.length > 1) nonCompliance.shift();

    const description: string = nonCompliance.flat()[0];

    this.id = id;
    this.desc = description;
  }

  static all(categoryId: number): any[][] {
    const queryStr = xlQuery(
      "NConformidades!A2:D",
      `SELECT A, B WHERE C = ${categoryId} AND D = TRUE`
    );

    return query(queryStr);
  }
}
