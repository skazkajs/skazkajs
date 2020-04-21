const recursiveRows = async (processRow, list, index = 0) => {
  const row = list[index];

  if (row) {
    await processRow(row);

    await recursiveRows(processRow, list, index + 1);
  }
};

module.exports = recursiveRows;
