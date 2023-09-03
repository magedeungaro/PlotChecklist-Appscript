class Manager {
  readonly id: number;
  readonly username: string;
  readonly name: string;

  constructor(id: ManagerID) {
    let xlColumn: string = "A";

    if (typeof id == "string") {
      id = `'${id}'`;
      xlColumn = "B";
    }

    const queryStr = xlQuery(
      "GP!A2:E",
      `SELECT A, B, C WHERE ${xlColumn} = ${id} AND E = TRUE`
    );
    const res = query(queryStr);

    //problema com a query que está retornando um valor a mais e não achei solução ainda, apenas essa gambiarra
    if (res.length > 1) res.shift();

    const manager = res.flat();

    this.id = manager[0];
    this.username = manager[1];
    this.name = manager[2];
  }
}
