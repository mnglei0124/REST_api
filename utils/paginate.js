module.exports = async function (page, limit, model) {
  const total = await model.countDocuments();
  const pageCount = Math.ceil(total / limit);
  const start = (page - 1) * limit + 1;
  let end = start + limit - 1;
  end = end > total ? total : end;
  const pagination = { total, pageCount, start, end, limit };
  if (page < pageCount) pagination.nextPage = page + 1;
  if (page > 1) pagination.previousPage = page - 1;

  return pagination;
};
