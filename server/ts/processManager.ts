class ProcessManager extends Manager {
  constructor(username: ManagerID) {
    super(username);
  }

  getAreas() {
    const areas = Area.all(this.id);

    return areas;
  }
}

const getProcessManagerInfo = ({ username }: { username: string }) => {
  const processManager = new ProcessManager(username);

  return { name: processManager.name, areas: processManager.getAreas() };
};
