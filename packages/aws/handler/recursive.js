const recursive = async (processRow, list, index = 0) => {
  const row = list[index];

  if (row) {
    await processRow(row);

    await recursive(processRow, list, index + 1);
  }
};

module.exports = recursive;
