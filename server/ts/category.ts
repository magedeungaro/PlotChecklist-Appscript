class Category {
  readonly id: number;
  readonly desc: string;
  readonly idResp: number;

  constructor(id: number) {
    const queryStr = xlQuery(
      "Acao!A2:D",
      `SELECT B, C WHERE A = ${id} AND D = TRUE`
    );
    const categoriesQuery = query(queryStr);

    if (categoriesQuery.length > 1) categoriesQuery.shift();

    let desc: string, idResp: number;
    [desc, idResp] = categoriesQuery.flat();

    this.id = id;
    this.desc = desc;
    this.idResp = idResp;
  }

  operationsManager(): Manager {
    return new Manager(this.idResp);
  }

  nonCompliances(): any[][] {
    return NonCompliance.all(this.id);
  }

  status() {
    return "PENDENTE";
  }

  static all(): keyValue[] {
    const queryStr = xlQuery("Acao!A2:D", "SELECT A, B WHERE D = TRUE");
    const categories = keyValueMaker(query(queryStr));

    return categories;
  }

  static nonCompliances(id: number): keyValue[] {
    const category = new Category(id);
    let nonCompliancesQuery = category.nonCompliances();

    if (nonCompliancesQuery.length > 1) nonCompliancesQuery.shift();

    const nonCompliances = keyValueMaker(nonCompliancesQuery);

    return nonCompliances;
  }
}

const allCategories = () => {
  return Category.all();
};

const nonCompliances = ({ id }: { id: number }) => {
  return Category.nonCompliances(id);
};
