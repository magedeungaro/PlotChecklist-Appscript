class Visit {
  readonly areaId: number;
  readonly categoryId: number;
  readonly nonCompliancesIds: Array<number>;
  readonly plot: string;
  readonly obs: string;
  readonly date: Date;

  readonly area: Area;
  readonly processManager: ProcessManager;
  readonly category: Category;
  readonly operationManager: Manager;

  constructor({
    areaId,
    categoryId,
    nonCompliancesIds,
    plot,
    obs,
  }: {
    areaId: number;
    categoryId?: number;
    nonCompliancesIds?: Array<number>;
    plot?: string;
    obs?: string;
  }) {
    this.area = new Area(areaId);
    this.processManager = new ProcessManager(this.area.idResp);
    this.category = new Category(categoryId);
    this.operationManager = new Manager(this.category.idResp);
    this.nonCompliancesIds = nonCompliancesIds;
    this.plot = plot;
    this.obs = obs;
    this.date = new Date();
  }

  hasCategory(): boolean {
    return this.category.id > 0;
  }

  nonCompliances(): string {
    const nonCompliances = this.nonCompliancesIds.map((id) => {
      let nonCompliance = new NonCompliance(id);
      return nonCompliance.desc;
    });

    return nonCompliances.join(";");
  }

  hasPlot(): boolean {
    if (!this.hasCategory()) return false;

    return this.plot.length > 0;
  }

  create() {
    if (this.hasCategory() && !this.hasPlot())
      throw new err("Visita com não conformidade precisa ter talhão.");

    let nonComplianceInfo = ["", "", "", "", ""];
    let status = "";

    if (this.hasCategory()) {
      nonComplianceInfo = [
        this.operationManager.username,
        this.operationManager.name,
        this.category.desc,
        this.nonCompliances(),
        this.plot,
      ];

      status = this.category.status();
    }

    const params = dateParams();
    const visit = [
      this.date,
      params.hash,
      this.processManager.username,
      this.processManager.name,
      xlString(this.area.sig),
      this.area.desc,
      nonComplianceInfo,
      this.obs,
      params.month,
      params.week,
      params.year,
      status,
    ].flat();

    return visit;
  }

  static save({
    areaId,
    categoryId,
    nonCompliancesIds,
    plot,
    obs,
  }: {
    areaId: number;
    categoryId?: number;
    nonCompliancesIds?: Array<number>;
    plot?: string;
    obs?: string;
  }) {
    const visit = new Visit({
      areaId,
      categoryId,
      nonCompliancesIds,
      plot,
      obs,
    });

    const wsName = "Database";

    const visitInfo = visit.create();

    writeData(wsName, visitInfo);

    return visitInfo;
  }
}

const saveVisit = (params: any) => {
  const visit = Visit.save(params);

  const visitLog = [
    visit[3],
    visit[5],
    visit[8],
    visit[9],
    visit[10],
    visit[11],
  ];

  return visitLog;
};
